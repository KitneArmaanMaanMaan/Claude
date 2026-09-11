# Sourcing companies from GitHub, properly

## Why this channel is worth the effort

A funding announcement is a record of consensus already formed. A GitHub repository
gaining stars fast is a record of **demand forming before anyone has priced it**. For a
seed fund the gap between those two events is the entire opportunity — and it is typically
6–18 months wide.

The trending page is not this. It is a 24-hour snapshot with no history, no location
filter, no pagination and no way to ask a question. What follows enumerates the universe
instead.

---

## The four signals that actually matter

Most people screen on stars. Stars are a vanity metric that rewards age and reach. The
signals that predict *a company* rather than *a popular project*:

**1. Star velocity, not star count.** Stars per day computed over the *most recent* 100
stargazers. GitHub exposes `starredAt` on the stargazers connection, so you can measure the
current slope rather than the lifetime average. A repo at 3,000 stars accelerating through
80/day is a far better lead than one at 40,000 stars that peaked a year ago.

**2. The licence tell — the single highest-precision filter I know.**
A permissive licence (MIT, Apache-2.0) is the default for a side project. **AGPL-3.0,
SSPL, BUSL-1.1 or Elastic-2.0 is a deliberate act.** Nobody picks a copyleft or
source-available licence by accident — it is chosen specifically to stop a cloud provider
reselling your work, which is only a concern if you intend to sell it yourself. It is a
founder telling you they have a business model, in machine-readable form.

Demonstrated live: `created:>2025-09-11 stars:>=400 license:agpl-3.0` returns **427 repos**
for the last year, and the head of that list is visibly commercial — self-hosted AI
workspaces, an AI pentester, an open-source ElevenLabs alternative. Compare that to the
unfiltered head of the same window, which is dominated by agent-skill collections and
prompt libraries with no company behind them.

**3. An organisation account created recently.** A repo under a personal account is a
person. A repo under an org account created in the last 24 months, with 2–20 members, is a
company forming. Owner type plus org creation date is a better founding-date proxy than
anything in a startup database.

**4. A homepage that is not documentation.** `homepageUrl` pointing at a real domain rather
than github.io or readthedocs means someone bought a domain and built a landing page. Cheap
to check, and it separates product from project.

Secondary: ships tagged releases, has a `pricing` or `cloud` page linked from the README,
issue volume from strangers rather than the author.

---

## The exhaustive enumeration, and the trap in it

**GitHub caps every search at 1,000 results**, however you paginate. So a naive
`created:>2025-09-11 stars:>=200` query silently returns 1,000 of the 13,162 that exist and
you never learn what you missed.

The fix is to slice until every slice fits under the cap, and recursively bisect any slice
that does not:

```
for each star band [200-499, 500-999, 1000-2499, 2500-4999, 5000-9999, 10000-24999, 25000+]:
    query the full date window
    if total_count > 1000: split the date range in half and recurse
    else: page through all results
```

Measured sizes for the trailing year (11 Sep 2025 → 11 Sep 2026), taken live:

| Band | Repos created in window |
|---|---|
| 200–999 stars | 13,162 |
| 1,000–4,999 | 2,918 |
| ≥5,000 | 698 |
| **≥1,000 total** | **3,616** |

So ~16,800 repos at a 200-star floor. That is entirely enumerable — roughly 200 search
calls at 30/min, about seven minutes of wall clock.

---

## Enrichment: one GraphQL call per 25 repos

REST would need three calls per repo (repo, owner, stargazers). GraphQL gets everything in
one batched query — owner location and type, org creation date and member count, licence,
homepage, topics, release count, and the timestamps of the 100 most recent stars. At 25
repos per call, 16,800 repos is ~670 calls, comfortably inside the 5,000 points/hour budget.

The query is in `gh_source.py` (`ENRICH`).

---

## The Europe filter, and its honest failure rate

`owner.location` is free text and **often blank — in my experience well over half of org
accounts leave it empty.** So:

1. Match `owner.location` against a gazetteer of European countries, demonyms and ~120
   cities, with a negative list to catch the false positives (Cambridge MA, Paris TX,
   Berlin CT, Dublin OH).
2. Fall back to the ccTLD of the homepage or owner website (`.de`, `.co.uk`, `.se`, `.nl`…).
3. For anything still unresolved that scores well, fall back to top-contributor locations,
   or read the README and the company's own site.

**Be honest that steps 1–2 have maybe 50–60% recall.** The blank-location tail is where
some of the best leads hide, and the only way to clear it is human judgement on a shortlist.
Do not report the filtered list as complete.

---

## The exclusions, which matter more than the inclusions

The top of any star-sorted list is dominated by things that are not companies. Exclude:

- **Content repos**: awesome-lists, tutorials, courses, books, roadmaps, interview prep,
  cheat sheets, "100 days of X", example collections, boilerplate, dotfiles.
- **Forks and archived repos.**
- **Big-company accounts** — Microsoft, Google, ByteDance, Alibaba, DeepSeek, NVIDIA and so
  on. Keep an explicit denylist; it needs updating every few months.
- In the current window specifically: **agent-skill and prompt-library repos**, which are
  the single largest noise category and can reach hundreds of thousands of stars with no
  company, no product and no revenue intent.

In the live AGPL sample above, roughly a third of the head of the list was still noise by
these criteria even after the licence filter. Expect to discard 80–90% overall.

---

## Running it

```bash
export GITHUB_TOKEN=ghp_...                     # public-repo read scope is enough
python3 gh_source.py --since 2025-09-11 --min-stars 200 --out candidates.csv
```

Output is a CSV ranked by commercial-intent score then star velocity, with the signals that
produced each score spelled out so you can argue with them.

**Cadence.** Run it weekly with `--since` set 90 days back. The interesting event is not a
repo appearing in the list — it is a repo *climbing* the list between runs. Diff consecutive
CSVs and the accelerating ones surface themselves.

---

## What could not be done inside this session

The GitHub REST API is restricted here to this session's own repositories:
`/users/{login}` and `/repos/{any}` both return 403. So from this environment I could run
Stage 1 (enumeration via the MCP search tool, which works and is where the numbers above
come from) but **not** Stage 2 — no owner location, no stargazer timestamps, no dependents.

Those three are exactly what separates this from reading a trending page, so the honest
position is: **the method and the script are the deliverable; they need to run against an
unrestricted token.** I have not produced a ranked European candidate list from GitHub, and
I am not going to present a location-blind list as if it were one.

---

## Three refinements worth adding once it runs

- **Dependents count** (`/network/dependents`, HTML-scraped — no API) is the strongest
  available proxy for real adoption versus star-farming.
- **Package-registry downloads** — npm, PyPI, crates.io — give a usage curve that stars do
  not. A repo with 2,000 stars and 400k monthly npm downloads is a different animal.
- **Contributor-company inference**: resolve top contributors' employers from their
  profiles. A project whose top three contributors all left the same scale-up six months
  ago is a company, whatever the org account says.
