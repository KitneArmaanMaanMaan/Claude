# Investment Memo — Frontier Computing
### Recommendation: lead the seed. Explicitly as a high-variance position.
**Frontier Computing Ltd · UK · incorporated 2 June 2026 · frontier.site**
Prepared 11 September 2026. Sources and access dates in `SOURCES-CONTRARIAN.md`; unverified claims flagged inline.

---

## 1. The heresy

Every dollar of the roughly $400B a year now going into AI infrastructure rests on one
unexamined assumption: **that compute is fabricated in a foundry.** The argument is only
ever about *which* silicon — GPU, TPU, ASIC, photonic, analog, neuromorphic. Nobody argues
about the substrate.

Frontier's claim is that the substrate is wrong. They grow living neuronal tissue and train
models on it. The neurons colocate memory and compute at the cellular level, so there is no
von Neumann bottleneck to engineer around — the thing the entire GPU industry spends its
effort on simply is not there.

The market's verdict on this is not neutral, it is dismissive. When Cortical Labs' DishBrain
learned Pong in 2022 it was covered as a curiosity, not as a roadmap. Four years later no
serious ML team trains anything on neurons. The consensus position is that wetware is a
neuroscience instrument that makes good press, and that anyone claiming otherwise does not
understand how far behind it is.

**That consensus may be right.** Section 7 argues it as hard as I can. But it is worth
noticing what the consensus is actually built on, which is the next section.

---

## 2. Why the crowd might be wrong

The reason wetware stalled at ~1M neurons is not a computer-science limit. It is a
**plumbing** problem.

Cultured neural tissue develops a necrotic core once it exceeds roughly 300–400 µm, because
oxygen and nutrients diffuse no further than a few hundred micrometres without a blood
supply. Past that geometric limit, the middle of your tissue dies. Every scaling ceiling in
the field traces back to this one fact. The field did not conclude that biological compute
does not work; it ran into vascularisation and stopped.

That is a biology problem, and biology has been working on it. Protocols published in
2025–26 now grow cortical organoids past 3 mm without necrotic cores, via co-culture with
endothelial cells, microfluidic perfusion and 3D bioprinting. **The blocker that produced
the consensus is being dismantled in academic labs right now,** which means the question the
market considers settled was settled against an obstacle that is going away.

Meanwhile the case *for* caring has strengthened. The binding constraint on frontier
training has moved from raw FLOPs to memory bandwidth and to energy. A single training GPU
draws 700–2,700 W and runs continuously for weeks; datacentre buildout is now gated on grid
connections, with roughly 1,700 GW of projects queued across Europe and EU electricity demand
forecast up ~60% by 2030. A human brain runs ~86 billion neurons on about 20 watts.

Nobody sane claims neurons will replace GPUs. The claim worth underwriting is narrower and
more interesting: **that there exists a class of work — continual learning, adaptation
without catastrophic forgetting, learning from tiny numbers of trials — where a substrate
that learns the way brains learn is not 1,000x behind but ahead.** If that class exists and
is commercially useful, whoever can grow the substrate at scale owns a category that does
not currently have an incumbent.

---

## 3. The founder

**Michael Domarkas.** Nineteen years old — Companies House gives his date of birth as
November 2006. Cambridge natural scientist. He has been culturing neuronal tissue for two
years, starting at seventeen on a $20,000 Emergent Ventures grant, before there was a
company, a batch, or an investor.

Then the part that matters most, from the register rather than the pitch:

> **Sole person with significant control: 75% or more of shares, 75% or more of voting
> rights, and the right to appoint and remove directors.** Sole director. Share capital
> still £1.

He has raised $10M and given away neither control nor a board seat. That is not a
negotiating outcome; it is a statement of how certain he is. It also happens to be the exact
profile the request asks for — someone taking a path nobody else is taking, who has been on
it since before anyone was willing to fund it.

The obvious counter-argument is in §7. He is nineteen, he is a solo founder, and the
Principal Investigator / CSO role is still open.

---

## 4. What is actually built

| Claim | Status |
|---|---|
| Biological culture trained to play Frogger — 92% peak cross rate over 25 games after **1 hour of real-time learning**, June 2026 | Company demo, published with video |
| A tissue-culture approach that breaks the ~1M-neuron vascularisation ceiling | **Company claim. No peer-reviewed publication found. The single most important unverified item in this memo** |
| 100M and 500M neuron systems, 500M cluster live January 2027 — "2,500× the next-largest publicly available system" | Dated public roadmap |
| $10M pre-seed led by General Catalyst, with Amino Collective, LocalGlobe, KAYA, Long Journey Ventures | Multi-source press |
| Incorporation, sole director, sole PSC at 75%+, share capital £1, **no SH01 filed** | **Verified — Companies House 17255584** |

The 2,500× figure checks out arithmetically against the state of the art: Cortical Labs' CL1
shipped in March 2025 at ~$35k with roughly 800k neurons demonstrated on a Pong-like task,
and a 2025 review put viable complexity for such 2D MEA cultures in the thousands of
*active* neurons. 500M against ~200k active is 2,500×.

Note what that roadmap does: it is **falsifiable inside six months**. A 100M-neuron system
either exists by end of 2026 or it does not. Most frontier bets cannot be checked for years.

---

## 5. Why now

1. **The ceiling is lifting.** Necrotic-core protocols allowing >3 mm cortical organoids were
   published in 2025–26. The specific obstacle that stalled the field has an academic
   solution path for the first time.
2. **The instrumentation commoditised.** Multi-electrode arrays and life-support are now
   off-the-shelf — CL1 is a $35k product. A team no longer has to build the rig before
   starting the science.
3. **Silicon hit physical limits that are not about transistors.** Power and grid
   interconnection, not fab capacity, now gate datacentre expansion.
4. **iPSC-derived neural tissue became routine** in labs worldwide, so the input is a
   protocol rather than a research project.

---

## 6. Fund math, and why the usual arithmetic does not apply

A €500M fund needs €1B+ outcomes. The honest position here is that **a discounted-cash-flow
argument is not available and pretending otherwise would be dishonest.** There is no revenue,
no ACV, no bottom-up TAM that means anything.

The correct framing is a barbell:

- Entry: lead a **$20–30M seed** at whatever the first priced round supports, for ~15–20%.
- **Most likely outcome: zero.** I would put the probability of total loss above 70%.
- If the substrate works at all, the comparable is not a software company. It is a new
  compute category with no incumbent — the semiconductor industry is ~$600B a year. A 1%
  position in a successor substrate is a €5B+ company.
- At ~10% after dilution on a €5B outcome: ~€500M back. **One position returning the fund.**

A €500M fund making 35–40 investments should hold **exactly one or two** positions of this
shape. Not zero — zero means the portfolio has no exposure to the thing that would matter
most if it happened. Not five — five is recklessness dressed as boldness. Creandum currently
holds zero.

This is also, precisely, what "invest at 80% conviction, not 100%" is for. That posture is
meaningless when applied to companies with customers and revenue; it only costs you something
when applied to a bet like this one.

---

## 7. The bear case, argued as hard as I can

1. **The hardware dies.** Cortical Labs keeps neurons alive around six months with active
   life support. A compute substrate with a half-life measured in months has an operating
   model nobody has solved.
2. **The clock gap is nine orders of magnitude.** Neurons fire at Hz; transistors switch at
   GHz. Massive parallelism is the answer offered, but parallelism does not rescue every
   workload and the gap is not a detail.
3. **Reproducibility.** No two cultures are identical. Machine learning as practised requires
   deterministic, repeatable training runs. A substrate that gives different answers each
   time is a research instrument, not infrastructure.
4. **The central claim is unpublished.** The vascularisation breakthrough — the thing the
   entire thesis rests on — has no peer-reviewed paper, no independent replication, no
   preprint I could locate. A Frogger video is not evidence of a solved diffusion limit.
5. **Frogger is not training.** DishBrain played Pong in 2022. Four years and one more game
   later, the distance to "ML training substrate" is not incremental, it is the whole problem.
   Neuron *count* is not capability.
6. **Team of one.** A nineteen-year-old solo founder with the scientific leadership role
   still unfilled, attempting a problem that has defeated well-funded academic groups.
7. **Ethics is a live wire.** Human-derived neural tissue at 100M+ neurons walks straight into
   an unresolved bioethics debate about sentience and consent. That is a genuine risk to LP
   comfort, university partnerships, and the right to operate — and it gets worse precisely
   as the technology succeeds.
8. **The founder holding 75%+ with board control** is evidence of conviction and also a
   governance risk. There is no mechanism by which investors correct a wrong turn.

**What would have to be true**
- The vascularisation method replicates, ideally in someone else's hands.
- The 100M-neuron system ships in 2026 — checkable by December.
- A task is identified where the biological substrate beats silicon on an axis that matters
  commercially, not just scientifically.
- A credible CSO joins, with real electrophysiology and tissue-engineering depth.
- An ethics and governance framework exists before the 500M-neuron cluster, not after.

**The single fact that would most change the conclusion:** whether the vascularisation result
survives contact with an independent lab. Everything else is downstream of it.

---

## 8. Why Creandum

- **Zero biocompute exposure across 154 portfolio companies.** Zero anything adjacent.
- **They have shown appetite for frontier hardware bets** — Black Forest Labs (Dec 2025),
  Olix (Feb 2026), Hosted·ai (Mar 2026), PAVE Space (Mar 2026). The PAVE memo argued for a
  space-hardware bet on strategic grounds with no revenue. This is the same act of faith
  pointed at a bigger prize.
- **"Back the companies of tomorrow before it's obvious"** is the firm's own masthead. This
  is the most literal available instance of it in European seed. It is also the only
  candidate in this whole process where a Creandum partner would plausibly say *"nobody has
  brought us this."*
- **Europe, and specifically UK deep tech** — Cambridge biology plus London capital is a
  genuine European edge, and this is exactly the kind of company that otherwise flips to the
  US and gets funded by a16z in eighteen months.
- **The seed is open.** $10M in on unconverted SAFEs, share capital still £1, founder at
  75%+. General Catalyst got the pre-seed; the priced round has not happened.

---

## 9. What I am not claiming

I am not claiming this is the highest-expected-value company I found. **Squid is more likely
to return capital** — real customers, verified deployment at National Grid, a defensible
wedge, and an unpriced cap table. That memo stands, in `../05-memo/`, as the low-variance
alternative.

I am claiming something narrower: that Squid's central belief is one the market already
shares, so it cannot produce a non-consensus outcome, and that if the brief is to find the
company doing what almost everyone believes is wrong, Frontier Computing is that company and
Squid is not.

Those are different questions with different right answers, and the fund should know which
one it is asking.
