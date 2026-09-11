# Adversarial diligence — results

| | Stage compliant? | Verdict |
|---|---|---|
| Frontier Computing | **NO** | **Killed** — General Catalyst already led a $10M round. There is no seed to lead. |
| Poppins | Yes (on stage) | **Killed** — on unit economics. The company's own website contains the kill shot. |
| Squid | Yes | **Survives**, with real concerns. The only one Creandum could actually lead. |

---

## Frontier Computing — killed

**1. The round is done and GC led it.** $10M, led by General Catalyst, with LocalGlobe, Amino
Collective, KAYA, Long Journey, Off Piste and SVA. A $10M first cheque with a top-tier US
multistage lead holding the board seat is a seed by any measure. "Pre-seed" is nomenclature.

**2. Team size: 1.** YC lists team size 1. Companies House confirms one director and a
corporate secretary. A wet-lab, tissue-culture, hardware-heavy company run by one nineteen-
year-old, pitching a 500M-neuron cluster within four months.

**3. The UK entity is probably a shell, which breaks the Europe constraint.** Incorporated
2 June 2026 at **3rd Floor, 1 Ashley Road, Altrincham** — the address of Oakwood Corporate
Secretary Limited, which is also the company secretary. That is a company-formation agent, not
a neuron lab. £1 capital, no SH01 ever filed, founder still PSC at 75%+. **So the $10M is not
in this entity.** Combined with the LinkedIn slug `frontier-computing-corp` and YC S26
membership, the topco is very likely a Delaware C-corp. Not confirmed against the Delaware
registry, but if true the company fails "Europe-based" outright.

**4. An error I made, not a gap.** I wrote that the "2,500× larger than the next-largest
system" claim "checks out arithmetically" — by inferring a ~200,000-neuron baseline *from
their own claim* and then confirming their claim against it. That is circular. **Cortical
Labs' CL1 contains 800,000 neurons and has shipped commercially since summer 2025** at
$35,000 a unit. 500M ÷ 800k = **625×, not 2,500×.** The headline is inflated roughly fourfold
and I manufactured corroboration for it.

**5. The field is already worried about exactly this.** STAT, 17 Nov 2025: *"Brain organoid
pioneers fear inflated claims about biocomputing could backfire."* And better-capitalised
competitors exist — The Biological Computing Co. raised a **$25M seed**; Cortical Labs
launched a biocomputing cloud in March 2026.

---

## Poppins — killed on the business, not on stage

**The arithmetic is on their own homepage.** The stat bar reads, in one line:
*+150k objets en location · +350k utilisateurs · +100 locations par jour.*

- 100 rentals/day = ~36,500 a year. **÷ 350,000 users = 0.10 rentals per user per year.** The
  average user transacts **once a decade**.
- **150,000 objects producing 100 rentals/day is a 0.067% daily utilisation rate.** The supply
  side is dead inventory.
- At a generous €25 basket and a 20% take: GMV ≈ €900k, **net revenue ≈ €150k a year.**

**Growth has already stalled.** ~60,000 users (press, mid-2025) → **300,000** (Boursorama,
14 Jan 2026) → 350,000 (company site, 11 Sep 2026). **+240k in seven months, then +50k in
eight.** That is a launch-PR spike decaying, not a compounding marketplace.

**App Store contradicts the user number.** 850 ratings, 4.7★, **#93 in Shopping in France** —
eighteen months after launch, with national TV coverage and a celebrity founder. Google Play
blocked scraping, so Android is unchecked.

**The category precedent I missed entirely.** **Zilok** — French P2P object rental, founded
2007 — **ceased operations in March 2024 after fifteen years**. Its model: every rental
secured by systematic insurance, funded by a **20% commission**. That is Poppins' model and
Poppins' exact commission, line for line. I cited Peerby and Streetbank and never found the
one French precedent that matters. Also: **Fat Llama**, the category flagship, sold to Hygglo
for £34.5M in 2022 — a modest trade sale — and Hygglo **shut it down on 24 November 2025**.
Academic work counts **120+ P2P sharing platforms closed since 2010**, most dying on unit
economics rather than demand.

**The structural reason:** a €10–30 basket cannot carry logistics, insurance, verification,
damage adjudication and CAC, because every rental needs two physical handoffs between
strangers for the price of a coffee. Airbnb and Uber work at 10–100× the basket.

**One point where my two agents disagree, unresolved.** The registry agent reads the Feb/Mar
2026 capital increase as a fresh priced round, on the strength of INPI filing **PJ_56, a
*certificat du dépositaire* dated 26/02/2026** — which is issued only when subscription cash
is deposited in a blocked account. The red team reads the same event as most plausibly a
BSA-AIR/convertible conversion and therefore stage-neutral. A conversion would not normally
require a new depositary certificate, which favours the first reading, but neither agent could
open the *acte*. **Resolve it by buying one hour of Pappers/Infogreffe access and pulling the
PV d'AG and the statuts of 02/03/2026.** If it is a €5M+ priced round, Poppins is
stage-disqualified as well.

**Both agents agree on one thing worth stating plainly:** BODACC shows *"Président partant:
Basch, Lucie"*, but **MURMURIA is her own holding company and she is its sole gérant. She did
not leave.** Anyone reading the register carelessly would report a founder departure.

---

## Squid — survives

**Stage is clean.** SQUID LABS LTD (16925657), incorporated 22 Dec 2025. Filing history is
NEWINC only, £1 statement of capital, model articles, **no SH01 ever filed**. Two founder
PSCs, each >25% and ≤50%. The reported $500k is the YC standard deal on SAFEs. **No priced
round exists.**

**The National Grid work is real production software, not an innovation pilot.** NGED's public
**FlexPortal**, launched Feb 2026, is served from **`flex.squid.energy`** — NGED's live
flexibility-tender portal running on a nine-month-old startup's infrastructure. CIM Explorer
followed in March, quoted alongside NGED's Head of System Models & Data.

**But every source says "partnership".** No contract value, no procurement reference, no ARR
anywhere. That is diligence question one: ask for the signed MSA and an invoice, not the press
release.

**The concerns that matter:**
- **Five to six months post Demo Day with no priced round.** Either they are deliberately
  holding out, or they went out at Demo Day and did not clear a lead. Find out which.
- **The shipped product may be a compliance sidecar, not the system of record.** FlexPortal
  and CIM Explorer are open-data visualisation. DNOs are already *mandated* by Ofgem's Data
  Best Practice rules to publish this data — so NGED may be paying very little, and the wedge
  may not convert to the versioned planning system Squid pitches.
- **Six DNO groups, fourteen licence areas in GB**, buying on Ofgem RIIO five-year price
  controls. Large deals, glacial cycles, real single-customer concentration today.
- **terralayr adjacency.** Creandum's terralayr participates in the flexibility markets
  FlexPortal publishes. Not a product conflict, but disclose it to both boards before a term
  sheet.

---

## Still unchecked

1. Poppins FY2025 financials — sealed under L.232-25.
2. The Feb/Mar 2026 Poppins *acte* and share premium — Pappers 403, API needs a paid token.
3. Poppins Google Play installs — listing blocked scraping.
4. Whether Frontier's topco is a Delaware C-corp — strongly implied, not confirmed.
5. The commercial terms of the Squid–NGED relationship — nothing public.
