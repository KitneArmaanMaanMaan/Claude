# Independent audit — findings accepted

An adversarial auditor was given the original brief, the research plan and the full pack,
and told to judge without assuming the analyst was competent. The findings below are
recorded because they are correct, not because they are comfortable.

## The verdict

> "A strong Phase 0 and one genuinely good memo, sitting on top of a sourcing funnel that
> does not do what it claims, wrapped in a pack that ships three contradictory answers and
> never produces a finished deliverable for the one it currently recommends."

## The failure that matters most

**The obviousness check was declared passed, and is refuted by my own discovery channel.**

`VERIFICATION.md` passed Squid on obviousness because press coverage was trade-press only.
But Squid is a **Y Combinator W26 company, found in the YC public directory**. So are Seeing
Systems (W26), KugelAudio (P26), Lamb Labs (S26) and Frontier Computing (S26). **Every
finalist and both memo picks came out of the YC dataset.**

My own argument against the Euro Seed 50 — that every name on it has been seen, debated and
either bought or passed — applies to YC with far greater force. The ES50 is an annual list of
fifty. YC Demo Day is a live, quarterly, globally-attended auction, and Creandum has a London
office. A London YC company is the single most-seen category of seed company in Europe.

Frontier Computing is worse: a **$10M pre-seed led by General Catalyst, with LocalGlobe — a
direct Creandum peer and frequent co-investor — already on the cap table**. Against which the
memo claims it is "the only candidate where a Creandum partner would plausibly say *nobody
has brought us this*." That claim is almost certainly false, and it was the emotional centre
of the recommendation.

The check was passed by redefining "obvious" as "covered by Sifted". That inverts its purpose.

*Note on scope: the auditor independently ran the literal ES50 gate and confirmed none of the
pass-2 or pass-3 names appear on the roster. The narrow gate would have passed. The failure is
the broader principle it existed to serve.*

## The second failure: diagnosing the disease and not taking the medicine

`BLIND-SPOTS.md` correctly identified that 153 of 153 longlisted companies were
pre-validated, and committed to a fix: *"sourcing moves entirely upstream of funding —
research preprints, open-source repositories, patent filings, non-dilutive grant awards,
university spinout registers."*

**None of that happened.** The heresy screen's candidate set was seven companies: four from
YC, three from funding announcements. The corrective pass reproduced the exact defect it had
just named, from the same two channels, and presented the result as a remedy. A
correctly-diagnosed failure that is then not corrected is worse than an undiagnosed one,
because the document functions as cover.

## The third failure: the rubric moved to fit each winner

| Pass | Rubric | Winner | Squid's score |
|---|---|---|---|
| 1 | 100-pt quality rubric | Squid | **91** |
| 2 | New 100-pt "heresy" rubric — **explicitly excludes traction, revenue and near-term market size** | Frontier | **51** |
| 3 | Four-question pattern test | Poppins | off-pattern |

Squid's underlying facts never changed between 91 and 51. Pass 2's rubric excluded precisely
the three dimensions Squid had just won on. Each change is defensible in isolation, which is
what makes the pattern hard to see — but a screen whose weights move to match the candidate
is post-hoc justification with a scoring table attached.

## Other findings accepted

- **The README still names Frontier as "the pick"** while my own later document repudiates
  it as "a laboratory, and Creandum has never made money on a laboratory." A reviewer opening
  the repo reads a headline the author disowns, and never learns Poppins exists.
- **Verification rigor is inversely correlated with strength of recommendation.** Poppins —
  the current recommendation — has no memo, no source appendix, no registry check, no conflict
  log, no ES50 check, and a stage claim resting on "no priced round *found*", which is absence
  of evidence.
- **The SAFE argument is arithmetic dressed as character.** "He raised $10M and gave away
  neither control nor a board seat" — SAFEs do not convert until a priced round, so *every*
  SAFE-funded solo founder holds 75%+ of shares and votes. It is evidence of nothing about
  conviction. This was written after being told founder credentials and ownership were
  secondary.
- **Zero primary research**, against a plan that called it "the single biggest quality
  differentiator". All three finalists have their load-bearing unknown left open — Squid's
  ARR, Frontier's vascularisation claim, Poppins' revenue model — and all three were
  answerable by a twenty-minute call. The plan scripted the permission question and I decided
  unilaterally instead of asking.
- **Tier 1 and Tier 4 sourcing were dropped entirely**; Tier 3 (media) was promoted from
  cross-check to primary discovery, which the plan explicitly forbade. The 150+ count was hit
  while the mechanism the count was a proxy for was discarded.
- **The funnel is not auditable.** ~120 companies vanish between longlist and shortlist with
  no recorded gate result.
- **`founders` is empty for 153 of 153 longlist rows**; `amount` empty for 103; no `date`
  column; one source is the bare string `https://tech.eu/`.
- **Lanes were committed to with weights and silently abandoned** — 103 of 153 rows unlaned,
  and no final pick belongs to any lane.
- **Product teardown never happened.** Not one product was signed up for or used, in a pack
  whose central judgement is which product to back.
- **Conflict check ran against 154 CMS records, not the ~179 specified** — the missing ~25 are
  disproportionately older and exited, which is where a historical conflict would live.
- **The brief's singular was load-bearing and was dissolved.** It asked for one company. The
  pack ships three live answers and "my recommendation, *if you want one*", which transfers
  the decision back to the requester. For an application testing conviction under uncertainty,
  that is the most costly property of the pack.

## On the timeline

Every phase was committed on 11 September 2026 between 14:19 and 19:12 — under five hours
against a scope agreed as "2+ weeks". Speed is not itself a defect. It becomes one because
the requirements that went unmet are exactly the ones that cannot be compressed: primary
research, registry sweeps, grant-database sweeps, patent sweeps, using the products. The
depth deficits are not random. They are precisely what time buys.

## The lead the pack found and did not follow

`TWENTY-COMPANIES.md` identifies the EU regulatory-unlock thesis — Data Act live 12 Sep 2026,
EUDI Wallet by end-2026, Right to Repair from 31 Jul 2026, Digital Product Passports from
20 Jul 2026 — as "the strongest European-specific edge I found", then concedes: "I did not
find a convincing seed-stage company attacking any of them."

A correctly-identified, precisely-dated, genuinely non-consensus thesis with no candidate
attached. The excellent answer is the company that fills it.
