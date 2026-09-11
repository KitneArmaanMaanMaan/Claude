#!/usr/bin/env python3
"""
gh_source.py — exhaustive GitHub sourcing for early-stage venture.

Finds repositories created in a time window that (a) are gaining stars fast,
(b) have a European owner, and (c) show commercial intent — i.e. look like a
company forming, not a side project.

Why this is not "browsing trending": GitHub's trending page is a 24h snapshot
with no history, no location filter and no way to page. This enumerates the
whole universe for the window, then filters on signals that actually predict a
company.

Requires a GitHub personal access token (classic or fine-grained, public repo
read is enough):
    export GITHUB_TOKEN=ghp_...
    python3 gh_source.py --since 2025-09-11 --min-stars 200 --out candidates.csv

Rate limits respected: 30 search req/min, 5000 core req/hr, 5000 GraphQL pts/hr.
"""
import argparse, csv, json, os, re, sys, time
from datetime import date, datetime, timedelta, timezone
from urllib.request import Request, urlopen
from urllib.error import HTTPError

API = "https://api.github.com"
TOKEN = os.environ.get("GITHUB_TOKEN")
if not TOKEN:
    sys.exit("Set GITHUB_TOKEN first.")
HDRS = {"Authorization": f"Bearer {TOKEN}", "Accept": "application/vnd.github+json",
        "User-Agent": "gh-source/1.0", "X-GitHub-Api-Version": "2022-11-28"}

# ---------------------------------------------------------------- HTTP layer
def _req(url, data=None, headers=None, method=None):
    h = dict(HDRS); h.update(headers or {})
    body = json.dumps(data).encode() if data is not None else None
    if body: h["Content-Type"] = "application/json"
    r = Request(url, data=body, headers=h, method=method)
    for attempt in range(6):
        try:
            with urlopen(r, timeout=60) as resp:
                return json.loads(resp.read().decode()), dict(resp.headers)
        except HTTPError as e:
            # Secondary rate limit / abuse detection / primary limit
            if e.code in (403, 429):
                hdr = dict(e.headers)
                wait = int(hdr.get("Retry-After", 0)) or 0
                if not wait and hdr.get("X-RateLimit-Remaining") == "0":
                    wait = max(1, int(hdr.get("X-RateLimit-Reset", 0)) - int(time.time()) + 2)
                wait = wait or (2 ** attempt)
                print(f"  rate limited, sleeping {wait}s", file=sys.stderr)
                time.sleep(wait); continue
            if e.code >= 500:
                time.sleep(2 ** attempt); continue
            raise
    raise RuntimeError(f"gave up on {url}")

def search_repos(q, page=1, per_page=100):
    from urllib.parse import urlencode
    url = f"{API}/search/repositories?" + urlencode(
        {"q": q, "sort": "stars", "order": "desc", "per_page": per_page, "page": page})
    time.sleep(2.1)                      # 30 req/min ceiling on search
    return _req(url)[0]

def graphql(query, variables):
    return _req(f"{API}/graphql", data={"query": query, "variables": variables})[0]

# ------------------------------------------------- Stage 1: enumerate window
# GitHub caps ANY search at 1000 results. Slice by (date window x star band)
# and recursively bisect any slice that overflows, so coverage is complete.
STAR_BANDS = [(200, 499), (500, 999), (1000, 2499), (2500, 4999),
              (5000, 9999), (10000, 24999), (25000, None)]

def band_q(lo, hi):
    return f"stars:{lo}..{hi}" if hi else f"stars:>={lo}"

def enumerate_window(d0, d1, lo, hi, out, depth=0):
    q = f"created:{d0}..{d1} {band_q(lo, hi)}"
    res = search_repos(q, per_page=1)
    n = res["total_count"]
    if n == 0:
        return
    if n > 1000 and (d1 - d0).days >= 1:      # bisect the date range
        mid = d0 + (d1 - d0) / 2
        enumerate_window(d0, mid, lo, hi, out, depth + 1)
        enumerate_window(mid + timedelta(days=1), d1, lo, hi, out, depth + 1)
        return
    if n > 1000:
        print(f"  !! {q} has {n} results on a single day — will truncate at 1000",
              file=sys.stderr)
    pages = min(10, (min(n, 1000) + 99) // 100)
    for p in range(1, pages + 1):
        for r in search_repos(q, page=p)["items"]:
            out[r["full_name"]] = r
    print(f"  {q}: {n} -> running total {len(out)}", file=sys.stderr)

# --------------------------------------- Stage 2: enrich owners + velocity
# One GraphQL call per 25 repos gets owner location, licence, homepage,
# contributor proxy, and the timestamps of the 100 most recent stars — which
# is what actually makes "trending" measurable rather than anecdotal.
ENRICH = """
query($q:String!){ search(query:$q, type:REPOSITORY, first:25){ nodes{ ... on Repository {
  nameWithOwner url description homepageUrl stargazerCount forkCount isFork isArchived
  createdAt pushedAt primaryLanguage{name}
  licenseInfo{ spdxId }
  repositoryTopics(first:20){ nodes{ topic{ name } } }
  releases{ totalCount }
  issues(states:OPEN){ totalCount }
  owner{ __typename login
    ... on Organization { name location websiteUrl createdAt membersWithRole{totalCount} }
    ... on User { name location websiteUrl createdAt followers{totalCount} } }
  stargazers(last:100, orderBy:{field:STARRED_AT, direction:ASC}){ edges{ starredAt } }
  defaultBranchRef{ target{ ... on Commit { history(first:0){ totalCount } } } }
}}}}"""

def enrich(full_names):
    out = {}
    for i in range(0, len(full_names), 25):
        chunk = full_names[i:i + 25]
        q = " ".join(f"repo:{fn}" for fn in chunk)
        try:
            d = graphql(ENRICH, {"q": q})
        except Exception as e:
            print(f"  enrich failed for chunk {i}: {e}", file=sys.stderr); continue
        for node in (d.get("data", {}).get("search", {}) or {}).get("nodes", []) or []:
            if node: out[node["nameWithOwner"]] = node
        time.sleep(0.5)
        print(f"  enriched {len(out)}/{len(full_names)}", file=sys.stderr)
    return out

def velocity(node):
    """Stars per day across the most recent 100 stargazers. This is the real
    'trending' number: absolute stars reward age, this rewards momentum."""
    edges = (node.get("stargazers") or {}).get("edges") or []
    if len(edges) < 20: return 0.0
    t0 = datetime.fromisoformat(edges[0]["starredAt"].replace("Z", "+00:00"))
    t1 = datetime.fromisoformat(edges[-1]["starredAt"].replace("Z", "+00:00"))
    days = max((t1 - t0).total_seconds() / 86400, 0.25)
    return round(len(edges) / days, 2)

# --------------------------------------------------- Stage 3: Europe filter
EU = {
 "countries": ["united kingdom","uk","england","scotland","wales","ireland","germany",
  "deutschland","france","spain","españa","portugal","italy","italia","netherlands",
  "nederland","holland","belgium","belgique","luxembourg","switzerland","schweiz","suisse",
  "austria","österreich","sweden","sverige","norway","norge","denmark","danmark","finland",
  "suomi","iceland","estonia","latvia","lithuania","poland","polska","czech","czechia",
  "slovakia","slovenia","croatia","hungary","romania","bulgaria","greece","serbia","ukraine",
  "cyprus","malta","europe","eu"],
 "cities": ["london","cambridge","oxford","manchester","edinburgh","bristol","dublin",
  "berlin","munich","münchen","hamburg","cologne","köln","frankfurt","stuttgart","karlsruhe",
  "dresden","leipzig","paris","lyon","toulouse","grenoble","nantes","bordeaux","lille",
  "amsterdam","rotterdam","utrecht","eindhoven","delft","brussels","bruxelles","antwerp",
  "ghent","leuven","zurich","zürich","geneva","genève","lausanne","basel","bern","vienna",
  "wien","graz","stockholm","gothenburg","göteborg","malmö","lund","uppsala","oslo","bergen",
  "trondheim","copenhagen","københavn","aarhus","odense","helsinki","espoo","tampere","oulu",
  "reykjavik","tallinn","riga","vilnius","kaunas","warsaw","warszawa","krakow","kraków",
  "wroclaw","poznan","gdansk","prague","praha","brno","bratislava","ljubljana","zagreb",
  "budapest","bucharest","bucuresti","cluj","sofia","athens","thessaloniki","belgrade",
  "madrid","barcelona","valencia","seville","bilbao","malaga","lisbon","lisboa","porto",
  "milan","milano","rome","roma","turin","torino","bologna","florence","firenze","naples"],
}
EU_RE = re.compile(r"\b(" + "|".join(re.escape(x) for x in EU["countries"] + EU["cities"]) + r")\b", re.I)
# Places that would false-positive (US/other cities sharing European names)
NEG_RE = re.compile(r"\b(ontario|texas|ohio|new england|birmingham,\s*al|cambridge,\s*ma|"
                    r"berlin,\s*(ct|nh|md)|paris,\s*(tx|tn)|moscow,\s*id|dublin,\s*(ca|oh))\b", re.I)

def is_europe(node):
    o = node.get("owner") or {}
    loc = (o.get("location") or "")
    if loc and not NEG_RE.search(loc) and EU_RE.search(loc):
        return True, loc
    site = (o.get("websiteUrl") or "") + " " + (node.get("homepageUrl") or "")
    if re.search(r"\.(co\.uk|de|fr|nl|se|no|dk|fi|es|it|pl|ch|at|be|ie|pt|cz|ee|lt|lv|eu)(/|$|\b)", site, re.I):
        return True, f"TLD:{site[:60]}"
    return False, loc

# ------------------------------------------ Stage 4: exclude the noise
NOISE = re.compile(r"\b(awesome|tutorial|tutorials|course|courses|book|books|roadmap|"
  r"interview|cheat[- ]?sheet|100[- ]days|learn|learning|examples?|boilerplate|starter|"
  r"template|dotfiles|resources|curated|collection|list[- ]of|study|notes|handbook|"
  r"leetcode|freecodecamp|bootcamp|portfolio|blog|wiki|docs|papers?)\b", re.I)
BIGCO = {"microsoft","google","facebook","meta","apple","amazon","aws","netflix","openai",
  "anthropics","anthropic","nvidia","bytedance","alibaba","tencent","baidu","huawei","ibm",
  "intel","adobe","salesforce","uber","airbnb","spotify","shopify","stripe","cloudflare",
  "vercel","supabase","hashicorp","elastic","mongodb","redis","docker","kubernetes","apache",
  "deepseek-ai","zai-org","qwen","alibaba-inc","modelscope","huggingface","pytorch","tensorflow"}

def is_noise(node):
    name = node["nameWithOwner"].split("/")[-1]
    desc = node.get("description") or ""
    topics = [t["topic"]["name"] for t in (node.get("repositoryTopics") or {}).get("nodes", [])]
    if node.get("isFork") or node.get("isArchived"): return True
    if node["nameWithOwner"].split("/")[0].lower() in BIGCO: return True
    if NOISE.search(name) or NOISE.search(desc): return True
    if any(NOISE.search(t) for t in topics): return True
    return False

# ------------------------------- Stage 5: commercial-intent score (the IP)
COMMERCIAL_LICENCES = {"AGPL-3.0","SSPL-1.0","BUSL-1.1","Elastic-2.0","MPL-2.0"}
PRODUCT_WORDS = re.compile(r"\b(platform|engine|runtime|api|sdk|cloud|hosted|self[- ]host|"
  r"enterprise|production|infrastructure|open[- ]source alternative|drop[- ]in replacement)\b", re.I)

def score(node, vel):
    s, why = 0, []
    o = node.get("owner") or {}
    if o.get("__typename") == "Organization":
        s += 2; why.append("org account")
        created = o.get("createdAt", "")
        if created and created > (datetime.now(timezone.utc) - timedelta(days=730)).isoformat():
            s += 3; why.append("org <2yrs old")
    hp = node.get("homepageUrl") or ""
    if hp and not re.search(r"github\.(io|com)|readthedocs|gitbook", hp):
        s += 2; why.append("product site")
    lic = ((node.get("licenseInfo") or {}).get("spdxId") or "")
    if lic in COMMERCIAL_LICENCES:
        s += 3; why.append(f"open-core licence ({lic})")
    if PRODUCT_WORDS.search(node.get("description") or ""):
        s += 1; why.append("product language")
    if (node.get("releases") or {}).get("totalCount", 0) > 3:
        s += 1; why.append("ships releases")
    members = (o.get("membersWithRole") or {}).get("totalCount")
    if members and 2 <= members <= 20:
        s += 2; why.append(f"{members} org members")
    if vel >= 50: s += 3; why.append(f"{vel} stars/day")
    elif vel >= 15: s += 2; why.append(f"{vel} stars/day")
    elif vel >= 5: s += 1; why.append(f"{vel} stars/day")
    return s, "; ".join(why)

# ------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", default=(date.today() - timedelta(days=365)).isoformat())
    ap.add_argument("--until", default=date.today().isoformat())
    ap.add_argument("--min-stars", type=int, default=200)
    ap.add_argument("--out", default="candidates.csv")
    ap.add_argument("--raw", default="raw_repos.json")
    a = ap.parse_args()

    d0 = date.fromisoformat(a.since); d1 = date.fromisoformat(a.until)
    found = {}
    print("Stage 1 — enumerating the window", file=sys.stderr)
    for lo, hi in STAR_BANDS:
        if hi is not None and hi < a.min_stars: continue
        lo = max(lo, a.min_stars)
        enumerate_window(d0, d1, lo, hi, found)
    print(f"Stage 1 complete: {len(found)} repos", file=sys.stderr)
    json.dump(list(found.values()), open(a.raw, "w"))

    print("Stage 2 — enriching owners and measuring velocity", file=sys.stderr)
    nodes = enrich(list(found.keys()))

    print("Stage 3-5 — filtering and scoring", file=sys.stderr)
    rows = []
    for fn, node in nodes.items():
        if is_noise(node): continue
        eu, loc = is_europe(node)
        if not eu: continue
        vel = velocity(node)
        sc, why = score(node, vel)
        o = node.get("owner") or {}
        rows.append(dict(
            score=sc, repo=fn, url=node["url"], stars=node["stargazerCount"],
            stars_per_day=vel, created=node["createdAt"][:10], pushed=node["pushedAt"][:10],
            owner_type=o.get("__typename"), owner=o.get("login"), owner_name=o.get("name"),
            location=loc, homepage=node.get("homepageUrl") or o.get("websiteUrl") or "",
            language=(node.get("primaryLanguage") or {}).get("name"),
            licence=((node.get("licenseInfo") or {}).get("spdxId") or ""),
            signals=why, description=(node.get("description") or "")[:200]))
    rows.sort(key=lambda r: (-r["score"], -r["stars_per_day"]))
    with open(a.out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
    print(f"Done: {len(rows)} European candidates -> {a.out}", file=sys.stderr)

if __name__ == "__main__":
    main()
