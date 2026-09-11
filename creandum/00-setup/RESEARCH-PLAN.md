# Creandum Investment Pick — Exhaustive Research Plan

## Context

You've been given a Creandum application task: find one Europe-based, pre-seed-or-seed
company the Creandum funds should invest in, and pitch it in a ≤90-second video.

The task looks like "find a cool startup." It isn't. It's a proxy for the actual job of a
VC analyst, and it tests four things at once:

1. **Sourcing** — can you find something they haven't already seen?
2. **Judgement** — can you tell a good company from a well-marketed one?
3. **Fit** — do you understand *Creandum's* fund, not venture in the abstract?
4. **Compression** — can you carry a thesis in 90 seconds?

Most candidates will fail on #1 and #3. They'll pick a company that already has press
coverage (so every Creandum partner has seen it) and pitch it generically (so it could
have been sent to any fund). The plan below is built to win on exactly those two axes.

**Scope agreed:** I run the full research and hand you a decision-ready pack. Timeline
2+ weeks. Free/public sources only. **No video work** — script, slides and recording are
out of scope; the deliverable ends at the memo.

---

## What Creandum actually is (grounding)

Verified from search across multiple independent sources:

| Fact | Detail | Why it matters to the pick |
|---|---|---|
| Fund VII | €500M, closed 2024, deploying 2025–26 | Needs €1B+ outcomes. Pick must be fund-returner-shaped. |
| Deployment | 35–40 companies planned over 2 years | Extremely selective; ~11 new deals/yr historically |
| Stage | Seed + Series A; 62 seed deals to date | Your pick must be a *seed lead* opportunity |
| Lead behaviour | Leads/co-leads ~60–70% of seeds | They need ownership — not a €250k angel ticket |
| Avg seed round | ~$11.6M | Their "seed" is large. A €400k pre-seed is off-strategy. |
| Sectors | Fintech, SaaS, consumer, health, climate, AI, robotics | Broad — sector alone won't differentiate you |
| Offices | Stockholm, Berlin, London, SF | Nordics/DACH/UK strength; SF for scaling |
| Portfolio | ~179 companies, 16 unicorns | Conflict-check is mandatory |
| Recent deals | Sereact (robotics), Maisa (AI agents, ES), Rillet, Embat, Conduct, Black Forest Labs, Modal, Cast AI | Reveals current appetite |
| Stated posture | "Back companies before it's obvious"; invest at 80% conviction, not 100%; anti-thematic — bet on founders with a unique market vision | The pitch must be non-consensus *and* defensible |

### The single most important find: the Euro Seed 50

Creandum publishes **the Euro Seed 50** (euroseed50.com) — Europe's 50 most promising
seed-stage startups, nominated by ~20 European seed funds, angels and solo GPs.

Its eligibility criteria are *identical to your task*: **HQ in Europe, raised up to and
including a seed round.** This task is almost certainly derived from that exercise.

Two consequences, and they pull in opposite directions:

- **Use it as a calibration set.** It is a labelled dataset of Creandum's own taste. Reverse-
  engineering what those 50 have in common tells you what "good" looks like *to them*.
- **Do not pick from it.** Every name on that list has been seen, discussed and passed on
  or lost by Creandum. Pitching one signals you can read their website. The winning answer
  is a company that *would* qualify for next year's list but isn't on this one.

Known list characteristics: >90% AI-native or AI-core; strong trend toward vertical AI
agents for regulated/understaffed industries (healthcare, defence, robotics) plus the
infrastructure beneath them; geography skewed UK (19), France (10), Germany (10),
Nordics (5).

---

## STEP ZERO — widen this environment's network access (you must do this)

`WebFetch` is not broken; it's **allowlisted**. Confirmed by testing: `github.com` and
`code.claude.com` fetch fine, while `creandum.com`, `euroseed50.com`, `f4.fund`,
`en.wikipedia.org`, `sifted.eu`, `eu-startups.com` and `insights.tryspecter.com` all return
`EGRESS_BLOCKED`.

This session runs in a cloud environment whose **Network access** level is **Trusted** —
package registries, GitHub and cloud SDKs only. I can't change it from inside the sandbox,
and routing around an egress policy is explicitly off-limits. **You** change it, in about
thirty seconds:

1. Open the environment for editing — the **cloud icon** on the session surface at
   claude.ai/code (or in the routine editor).
2. Find the **Network access** selector. It has four levels: **None**, **Trusted**
   (current), **Full**, **Custom**.
3. Either:
   - **Full** — any domain. Simplest, and appropriate here: this is public-web research and
     the repo holds nothing sensitive. **This is what I'd pick.**
   - **Custom** — paste the list below into **Allowed domains**, and tick *"Also include
     default list of common package managers"* so GitHub and registries keep working.
4. Restart or re-open the session so the new policy applies.

Custom allowlist, if you'd rather stay conservative (`*.` matches all subdomains):

```text
*.creandum.com
euroseed50.com
*.dealroom.co
*.crunchbase.com
sifted.eu
tech.eu
*.eu-startups.com
*.vestbee.com
arcticstartup.com
siliconcanals.com
maddyness.com
*.tracxn.com
*.linkedin.com
*.wikipedia.org
find-and-update.company-information.service.gov.uk
api.company-information.service.gov.uk
worldwide.espacenet.com
eic.ec.europa.eu
cordis.europa.eu
*.vinnova.se
*.ukri.org
*.bpifrance.fr
*.huggingface.co
arxiv.org
news.ycombinator.com
*.ycombinator.com
*.producthunt.com
joinef.com
*.antler.co
seedcamp.com
*.stationf.co
*.slush.org
*.g2.com
*.capterra.com
*.reddit.com
*.medium.com
*.substack.com
```

**Why it's worth doing rather than working around.** Without it I'm limited to WebSearch
snippets — enough to source and screen, but not enough to read a Companies House filing, a
full Euro Seed 50 roster, a founder's history, or a product's actual docs. The phases below
that create the real edge (Phase 0 calibration, Phase 2 tier-1 registry and grant sourcing,
Phase 4 deep dives) all assume full fetch. If you'd rather not widen it, say so and I'll
fall back to: WebSearch at volume, plus a batched **assisted-fetch loop** where you paste
pages I can't reach. Slower and shallower, but workable.

On the `f4.fund` link you sent: currently blocked, and it's a third-party aggregator of
unclear provenance. Either way I'll treat it as a **lead to verify**, never as a citable
source. Every Creandum fact in the final memo will trace to a primary or
multi-source-corroborated origin.

---

## Phase 0 — Calibration (Days 1–2)

**Goal: build a model of Creandum's revealed preferences, so screening is against *their*
taste rather than generic VC taste.**

1. Reconstruct the **Euro Seed 50 roster** (via search + your assisted fetch). Tag each by
   country, sector, stage, founder background, round size, and lead investor.
2. Reconstruct **Creandum's last 24 months of seed investments** (Maisa, Sereact, Conduct,
   Embat, Rillet, EquiLibre and the rest). For each: what was true at the moment they
   invested? Team pedigree, traction, round size, who else was in.
3. Read every Creandum-authored piece I can reach: the `creandum.com/stories/*` posts
   (Backing Sereact, the Euro Seed 50 essays), `blog.creandum.com` (Traits of unicorn
   founders; Getting from Seed to Series A; Seed Data Room Template), partner posts from
   Staffan Helgesson, Carl Fritjofsson, Simon Schmincke, Johan Brenner.
4. **Output: a one-page "Creandum Taste Profile"** — 8–12 explicit criteria with evidence.
   This becomes the scoring rubric in Phase 3, and it's also the thing that makes your
   eventual pitch sound like it was written *for them*.
5. **Map the white space.** Where has Creandum publicly signalled appetite but has no
   portfolio company yet? A pick that lands in stated-appetite-but-unfilled space is far
   stronger than one that lands next to an existing bet.

---

## Phase 1 — Thesis lanes (Day 2)

Rather than scanning all of European tech, commit to **three lanes**. Lanes are chosen
where (a) Creandum has signalled appetite, (b) there's a genuine "why now" unlock, and
(c) public sourcing can actually reach the companies.

Provisional lanes, to be confirmed against Phase 0 findings:

- **Lane A — Vertical AI agents in regulated/understaffed sectors.** Healthcare admin,
  defence procurement, legal, insurance, public sector. Creandum has said this explicitly.
  Risk: crowded, so the bar for differentiation is high.
- **Lane B — Physical AI / robotics foundation layers.** Sereact tells you they're active.
  Look adjacent, not competing: sensing, sim-to-real, teleop, fleet ops, actuation supply chain.
- **Lane C — A genuinely contrarian lane.** Deliberately chosen *outside* the AI consensus:
  e.g. European industrial/energy software, defence dual-use, healthtech infrastructure, or
  a fintech unlock driven by new EU regulation. This is the lane most likely to produce a
  "before it's obvious" answer.

Running three lanes protects against a single lane turning out to be barren or
over-consensus, and gives the final memo a credible "here's what I considered and rejected."

---

## Phase 2 — Longlist sourcing (Days 3–5, target 150+ companies)

The differentiator is sourcing from channels *upstream of press coverage*. Ranked by how
proprietary the signal is:

**Tier 1 — proprietary-feeling, free, mostly unmined by candidates**
- **Company registries.** UK Companies House (free; incorporations + SH01 share-allotment
  filings are hard evidence of a round *before* announcement), Bolagsverket (SE),
  Handelsregister (DE), KVK (NL), Infogreffe (FR).
- **Non-dilutive grant winners.** EIC Accelerator, Horizon Europe, Vinnova (SE), Innovate UK,
  Bpifrance, Business Finland. Deep-tech teams appear here *years* before a seed round.
- **Patent filings.** Espacenet (free) — filter by recent European applicants with no
  corporate parent.
- **University spinout pipelines.** Oxford Science Enterprises, Cambridge Enterprise, ETH
  Zurich spin-offs, EPFL, KTH, Chalmers Ventures, DTU, TUM Venture Labs, Aalto, Imperial,
  Conception X, Deep Science Ventures.
- **Research-to-company signal.** arXiv author affiliations, Hugging Face trending models
  and Spaces from European orgs, GitHub trending filtered to EU-based orgs.

**Tier 2 — structured and public**
- Accelerator/studio batches: Y Combinator (European companies), Entrepreneur First
  (London/Paris/Berlin), Antler (Nordics/DACH), Techstars, Founders Factory, Station F,
  Merantix (Berlin), Seedcamp portfolio.
- Event exhibitor and startup lists: Slush (Helsinki), Slush 100, TechBBQ, Bits & Pretzels,
  VivaTech, Web Summit, London Tech Week, SaaStock.
- Free database tiers: Dealroom free, Crunchbase free — filtered to Europe + last-round ≤ seed.

**Tier 3 — media (useful, but everyone reads it — use for cross-checking, not discovery)**
- Sifted, Tech.eu, EU-Startups, Vestbee, Arctic Startup, Silicon Canals, Maddyness (FR),
  Gründerszene (DE), The Next Web.
- Annual lists: Sifted 50, Forbes 30U30 Europe, EU-Startups top-10s, national "startups to watch."

**Tier 4 — people signals**
- LinkedIn: operators who recently left Spotify, Klarna, Revolut, Wise, Adyen, Datadog,
  Stripe EU, DeepMind London, Mistral — especially those now listing "stealth" or a new company.
- Public portfolios of European solo GPs, angels and pre-seed funds (many of them are the
  same people who nominated the Euro Seed 50 — their *other* bets are the unmined ones).
- Product Hunt EU launches; Hacker News "Launch HN" threads with European founders.

**Output: a longlist tracker** (spreadsheet) — company, country, sector, lane, stage, amount
raised, date, founders, source URL, one-line description, discovery channel.

---

## Phase 3 — Screening (Days 6–7)

### Hard gates (binary; failing one is instant elimination)

- [ ] HQ in Europe (verify from registry or primary announcement, not an aggregator)
- [ ] Has raised **no round, pre-seed, or seed only** — no Series A, no bridge dressed as a seed
- [ ] Not a Creandum portfolio company, and not a direct competitor to one (conflict)
- [ ] Founded and operating — not a concept, not an agency/consultancy in startup clothing
- [ ] Round size and ownership math make a **Creandum-sized seed lead** plausible
- [ ] Verifiable: real founders, real product or real technical artefact, traceable evidence

### Scoring rubric (100 points) — applied to everything that clears the gates

| Dimension | Weight | What earns the points |
|---|---|---|
| Fund-returner potential | 25 | Can this plausibly reach €1B+? TAM, pricing power, expansion path. A €500M fund cannot make money on a €150M outcome. |
| Founder–market fit & team density | 25 | Unfair insight, credible right-to-win, prior depth in the problem. Creandum's own stated test: would you work *for* this founder for a decade? |
| Why now | 15 | A specific technical, regulatory or behavioural unlock that makes this possible *this year* and not three years ago |
| Evidence of pull | 15 | Customers, revenue, waitlists, usage, retention, inbound — anything that isn't a deck |
| Compounding moat | 10 | Data, network, workflow lock-in, distribution, regulatory position. Not "we're first." |
| Creandum fit | 10 | Stage, check size, geography, conflict-free, ownership availability, white-space match |

**Output: shortlist of 12**, each with a filled scorecard and a one-paragraph rationale.

---

## Phase 4 — Deep dives (Days 8–11, top 3)

For each of the top three, everything below:

**Product**
- Sign up and use it. Screenshot the actual experience. If it's closed, find demos,
  conference talks, technical papers, or the founder's own walkthroughs.
- Technical teardown: GitHub/Hugging Face activity, docs quality, changelog cadence,
  architecture claims vs. what's evidently built.

**Market**
- Bottom-up TAM — build it from customer counts × realistic ACV, never a Gartner headline.
- Competitor map: European, US, and incumbents. Explicitly answer *why the incumbent
  doesn't just ship this.*
- Regulatory and procurement reality — especially in health, defence, fintech.

**Traction & momentum (public proxies)**
- Hiring velocity from careers pages and LinkedIn headcount over time
- Web traffic direction, app-store ranks, review-site presence (G2, Capterra)
- Customer logos on the site; case studies; named design partners
- Community evidence: Reddit, niche forums, Slack/Discord communities, HN threads

**Cap table & round**
- Registry filings for actual round size, share classes and investors — the announced number
  and the filed number often differ
- Who's already in, and whether a Creandum-sized lead is still available

**Team**
- Every founder's full background; who they've worked with before; whether the team has
  done this together previously; key early hires as a quality signal

**Primary research** (this is what 2+ weeks buys you, and almost no candidate does it)
- Email the founders directly. Be straightforward about who you are and why — most early
  founders will take a 20-minute call with someone who's done real homework, and that call
  gives your video a line nobody else can say.
- Talk to 2–3 customers or users.
- Talk to 1–2 domain experts (practitioners in the target industry).
- If possible, one other seed investor who has seen the company.

**Output: three deep-dive one-pagers**, each ending in a bull case, a bear case, and the
single fact that would most change the conclusion.

---

## Phase 5 — Decide and write (Days 12–14)

1. **Red-team every finalist.** I argue the bear case as hard as I can. If a pick doesn't
   survive its own bear case, it doesn't go forward — this is the step that prevents you
   defending something fragile in a live interview.
2. **The three questions the memo must answer without hedging:**
   - Why *this* company? (not the sector — the company)
   - Why *now*? (the specific unlock)
   - Why *Creandum*? (fund math, stage fit, white space, what they add beyond money)
3. **Fund-math paragraph.** Explicit: entry valuation → plausible ownership → outcome needed
   to return meaningful multiple on a €500M fund. Showing this arithmetic is a strong signal
   that you think like an investor rather than a fan.
4. **Write the investment memo** (2–3 pages, IC format): thesis, company, market, team, why
   now, traction, risks, what would need to be true, recommendation.
5. **Source appendix** — every factual claim with URL and access date; anything I could not
   verify is explicitly flagged as unverified rather than smoothed over.

---

## Deliverables

| # | Artefact | Format |
|---|---|---|
| 1 | Creandum Taste Profile | 1 page |
| 2 | Longlist tracker (150+) | spreadsheet |
| 3 | Shortlist scorecards (12) | spreadsheet + notes |
| 4 | Deep-dive one-pagers (3) | 1 page each |
| 5 | **Final investment memo on the pick** | 2–3 pages |
| 6 | Source appendix | linked, dated |
| 7 | Runner-up brief | ½ page — so you have an answer to "what else did you consider?" |

Video script, slides and recording: **out of scope** per your instruction.

---

## Verification

Research can't be unit-tested, so these are the checks that stand in for it:

- **Two-source rule.** Funding stage, amount and HQ confirmed by two independent sources, or
  by a primary registry filing. Aggregators (Tracxn, PitchBook summaries, f4.fund) count as
  *one* source and never as the primary one.
- **Eligibility re-verification before writing.** Re-check on the final day that the pick
  hasn't raised a Series A mid-process. This is a real failure mode over a two-week window
  and it would invalidate the entire submission.
- **Conflict check.** Final pick cross-referenced against all ~179 Creandum portfolio
  companies and their direct competitors.
- **Obviousness check.** Confirm the pick is *not* on the Euro Seed 50 and has minimal
  tier-1 press coverage. If a Creandum partner has obviously already seen it, it's the wrong
  answer for this task.
- **Bear-case survival.** Documented, not implied.
- **Unverified-claim flagging.** Anything I couldn't confirm is marked as such in the memo
  rather than asserted.

---

## Risks and open items

- **Network access is the gating item.** Everything downstream is shaped by whether Step Zero
  happens. Set the environment to **Full** (or paste the Custom list) and the plan runs as
  written; leave it at **Trusted** and we drop to WebSearch plus assisted fetch, which costs
  roughly a tier of depth in Phases 0, 2 and 4.
- **The pick raises a Series A mid-research** — mitigated by re-verification, and by keeping
  the runner-up warm.
- **Over-indexing on AI.** >90% of the Euro Seed 50 is AI-native, which means an AI pick is
  consensus by construction. Lane C exists specifically to give you a defensible non-consensus
  option, and I'd weight it heavily unless Phase 0 argues otherwise.
- **Founder outreach is optional but high-leverage.** If you'd rather I not contact founders
  on your behalf, say so and I'll keep everything desk-based — but it's the single biggest
  quality differentiator available in a two-week window.
