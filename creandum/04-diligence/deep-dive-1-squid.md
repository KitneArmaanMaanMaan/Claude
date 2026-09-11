# Deep dive 1 — Squid (Squid Labs Ltd), London

## What it is
"The model repository for power systems." Squid imports electricity network models out of
the incumbent simulation tools — DIgSILENT PowerFactory, Siemens PSS®E, IPSA, CYME, ETAP —
plus GIS and study data, and resolves them into **one governed, versioned network model**
with lineage, topology validation, parameter checking and scenario management. Planning
teams query it in the browser; AI agents run power-system analysis against it. Their own
line: *"The grid has a repo now."*

It does not replace the simulation engines. It sits above them and becomes the system of
record they all point at.

## Registry facts (primary — UK Companies House, company 16925657, read 11 Sep 2026)
- **SQUID LABS LTD**, incorporated **22 December 2025**, London. SIC 62012, software development.
- Directors: **Conor Michael Patrick JONES** (b. Apr 1996) and **George KOLOKOTRONIS**
  (b. Apr 2000), both appointed at incorporation.
- PSCs: the same two individuals, **each holding 25–50% of shares and votes**. No corporate PSC.
- **Complete filing history: incorporation (statement of capital GBP 1, model articles) and
  three registered-office changes. Nothing else.**

**No SH01, no statement of capital increase, no amended articles, no corporate PSC.** A
priced equity round essentially always produces at least an SH01 and new articles. So as
far as the register shows, money from YC, 20VC, Leap Forward Ventures and 33East is on
unconverted SAFEs/ASAs, and **Squid has not priced a round at all**. The whole seed is
open, and a lead investor would be setting the first price. *Caveat: allotments are filed
within a month, so a very recent round could still be in transit.*

## Team
- **Conor Jones (CEO).** Nine years at National Grid — power systems engineer through to
  Digital Product Line Director, reported as the youngest Director at National Grid
  Transmission, running 60+ engineers and a £10M+ annual budget. Then Head of Product at
  Octopus Energy. He ran the exact function he is now selling into.
- **George Kolokotronis (CTO).** Head of Tech at Octopus Energy; AWS; Cambridge. Director of
  GEOBOX LTD since April 2019 (aged 19) — a prior company, so a repeat founder at 26.
- Team of 3 at the time of the YC listing; hiring engineers in London at £70–120k + 0.5% equity.
- *Unverified:* the YC profile mentions BCG for Jones; no independent source corroborates it.

## Evidence of pull (this is the part that is unusual for a nine-month-old company)
- **National Grid Electricity Distribution is the launch customer.** Squid's CIM Explorer
  turned NGED's technical network model into an interactive interface for non-specialists;
  it powers the **FlexPortal** that NGED launched publicly in February 2026, covering their
  largest-ever long-term flexibility tender. Confirmed by NGED's own newsroom, The Energyst,
  Energy Live News and Utility Week — not just by Squid.
- Quoted alongside Phil Moseley, Head of System Models & Data at NGED.
- Squid's site names **Northern Powergrid and further European network operators** as
  launching partners. *Company claim, not independently corroborated.*
- **ISO 27001:2022, SOC 2 Type I and Type II** already in place. For a three-person company
  that is a deliberate act of selling to regulated utilities, and it is what makes the sales
  cycle survivable.
- Sits on the **GB CIM Advisory Group** — a seat at the table where the data standard itself
  is set.

## Market — built bottom-up, not from a headline
Direct buyers of a network model-of-record:

| Segment | Count | Realistic ACV | Serviceable |
|---|---|---|---|
| European TSOs (ENTSO-E members) | ~40 | £400k | £16M |
| Large European DSOs (>100k connections) | ~190 | £200k | £38M |
| UK DNO licence areas | 14 (6 groups) | £400k | £5.6M |
| US investor-owned utilities | ~200 | £300k | £60M |
| US municipals and co-ops of scale | ~900 | £60k | £54M |
| Engineering consultancies and developers | ~1,500 | £50k | £75M |
| | | | **≈ £250M ARR** |

£250M of serviceable ARR at the narrow wedge. Capturing a realistic 25% is ~£60M ARR — a
€600M–€1B company on software multiples. **That is the honest ceiling of the wedge, and on
its own it is not comfortably a fund-returner.** The case for €1B+ rests on expansion, and
it is the same argument Creandum made for Rillet: own the clean, governed data layer and
the automation on top becomes yours to sell. Connection-queue management, reinforcement
planning, flexibility procurement, outage planning and asset investment are all much larger
budgets, and all of them require a trustworthy model first. The power-system analysis
software market they would expand into is put at $6.75B in 2025 growing ~8% (one estimate)
or $12.1B in 2026 growing ~13% (another) — the spread is wide enough that I treat it as
"several billion and growing", not as a precise number.

## Why now — three unlocks, all dated
1. **The queue became the binding constraint.** ~1,700 GW of projects are waiting for grid
   connection across Europe; €100B of renewables and storage is stuck in *distribution*
   queues across eight countries; UK waits run to 10–15 years. Planning throughput is now
   the thing standing between Europe and its energy transition.
2. **Regulation made data quality a licence condition, not a preference.** Ofgem's Data Best
   Practice sits under RIIO-ED2 Special Condition 9.5 (Digitalisation); DNOs must publish
   Digitalisation Strategy and Action Plans and make network data usable by third parties.
   Squid sells into an obligation with a deadline, which is why a three-person company got
   into National Grid at all.
3. **Money is arriving.** €584B of EU grid investment is required 2020–2030, of which
   roughly €170B is digitalisation. EU electricity demand is forecast up ~60% by 2030.

## Moat
- **Vendor neutrality is structurally unavailable to the incumbents.** Siemens, DIgSILENT,
  Eaton and ETAP sell seats of their own simulation engines. A repository whose entire value
  is federating all five formats is a product none of them can ship without undermining the
  thing they sell. This is the strongest single line of defence.
- **System-of-record lock-in.** Once the approved baseline, the version history and the audit
  trail live in Squid, moving is a regulatory event, not a procurement one.
- **Standards position.** GB CIM Advisory Group membership shapes the interchange format.
- **Compliance estate.** ISO 27001 + SOC 2 already cleared is a real barrier to a newer entrant.

## Competition
- **Neara** (Series C, $31M) — physics-enabled digital twin built from LiDAR, aimed at
  resilience, vegetation and asset failure. Builds its own model; Squid federates existing
  ones. Adjacent, not the same wedge.
- **Camus Energy** (US, ex-Google) — grid orchestration and FlexConnect for fast datacentre
  interconnection. Operational rather than planning-governance.
- **Rhizome** (US) — resilience investment prioritisation.
- **Incumbents** — PSS/E, PowerFactory, ETAP, CYME, GE PSLF. Top five vendors hold just under
  half of revenue, so there is no dominant system of record to displace; the category is
  unclaimed rather than contested.
- Nobody found is doing vendor-neutral, versioned model-of-record for network operators in
  Europe.

## Bear case (argued as hard as I can)
1. **The buyer list is short and slow.** Roughly 40 TSOs and 190 large DSOs in Europe. Utility
   procurement is famously 12–24 months and gated by regulated price-control allowances.
   A company can be excellent and still grow at the speed of RIIO.
2. **The wedge may be a feature.** "Version control for network models" could be absorbed into
   a PowerFactory release, or delivered by a consultancy as a services engagement.
3. **Expansion is assumed, not demonstrated.** The €1B case depends entirely on moving from
   repository to workflows. There is no evidence yet that they can sell the second product.
4. **Team of three.** Two founders and one hire, against a sales motion that needs enterprise
   patience and a technical surface that spans five proprietary file formats.
5. **Geography ambiguity.** A US entity (Squid Group, Inc.) exists alongside Squid Labs Ltd.
   The register shows no corporate PSC over the UK company, so no flip has been recorded,
   but a Delaware topco is the YC default and may appear later.
6. **Name collision.** An unrelated crypto company and a very well-known proxy server share
   the name; at least one data provider has already merged their funding histories.

## The single fact that would most change the conclusion
**Whether anyone is paying, and how much.** Everything public shows deployment and a marquee
logo; nothing public shows contracted ARR. If NGED is a paid production contract with a
second operator signed, this is a straightforward seed lead. If FlexPortal was an innovation-
budget pilot with no renewal, the entire pull argument thins out to one logo. This is the
first question to ask the founders, and it is not answerable from desk research.
