# Conversion Review & Recommendations — alexkoziy.com

_Prepared after re-reading the current site (EN + UK) and cross-checking the
marketing critique you shared against current landing-page best practices._

---

## 1. Short verdict on the critique you received

**It's largely correct and worth acting on.** Its central idea — *sell the
business result, not "an AI assistant"* — matches what current conversion
research says: outcome-first hero headlines, a single primary CTA, visible
pricing, and explicit objection-handling are the biggest levers on a services
landing page. Sources consulted:

- Outcome/benefit-led headlines (short, ideally under ~44 characters) tend to
  outperform feature/category headlines, and adding a concrete number adds a
  further lift. ([saashero.net](https://www.saashero.net/design/saas-landing-page-best-practices/), [uxmagic.ai](https://uxmagic.ai/hi/blog/landing-page-design-examples-that-convert)) _Content rephrased for licensing compliance._
- One page, one goal — every extra competing link leaks conversions ("attention
  ratio"). ([systeme.io](https://systeme.io/learn/landing-page-best-practices/))
- Pages fail mainly by talking features not outcomes, burying the value prop, and
  ignoring objections. ([rivereditor.com](https://rivereditor.com/guides/how-to-write-high-converting-landing-pages-2026))
- Specific, intent-driven CTA labels convert markedly better than generic ones.
  ([docket.io](https://www.docket.io/blog/b2b-landing-page-copy-examples))

So: adopt the **structure and the "sell the result" principle**. But a few
specific suggestions in it need adjusting for *your* facts — see §4.

---

## 2. Where the current site already does what the critique asks

The site has been iterated a lot; several critique points are already partly or
fully handled. Being fair to the current state:

| Critique asks for | Current site status |
|---|---|
| Answer "what do you do / for whom / channels" fast | Hero already says: custom Python chatbots for WhatsApp, Instagram, Telegram, web. ✅ mostly |
| Three hero numbers | Present: `24/7`, `Low` (running cost), `2` live bots, `100%` code ownership. ⚠️ but "Low" is vague |
| Show concrete tasks solved | `#services` has 6 outcome cards (support/FAQ, lead capture, orders, AI+handoff, multi-channel, supported). ✅ |
| "What you get" result block | Partly — the `#offer` block lists what's included, but framed around cost, not a deliverables list. ⚠️ |
| Trust / "why me" block | Weak on the home page. The 20-years/Java depth is on `enterprise.html`, not surfaced as trust here. ❌ |
| Real case studies with numbers | `case-studies.html` has the 2 live bots + generic bot types, **no before/after metrics**. ❌ |
| Transparent process (4 steps) | `#how` already has a 4-step process. ✅ |
| Visible pricing | The AI-assistant answers give $200 / $250 + $0 hosting, **but the page itself shows no price table**. ⚠️ |
| Client-facing FAQ (objections) | `#faq` exists and is buyer-focused (ownership, AI hallucination-free, integrations, support). ✅ good |
| Contacts (WhatsApp/Telegram/Email) | ✅ done, with brand-colored buttons and footer icons |

**Net:** the raw material is strong. The gaps are: (a) a sharper outcome hero,
(b) a visible "what you get" deliverables block, (c) a real trust block on the
home page, (d) **case studies with real numbers**, and (e) **pricing visible on
the page, not only in the chatbot**.

---

## 3. What I'd change first (priority order)

1. **Hero headline → outcome, not category.** Replace "Chatbots your customers
   actually get answers from" with a result line. Draft (EN):
   *"Your customers get answered in seconds — and your team stops repeating
   itself."* Sub: *"Custom AI chatbots for WhatsApp, Instagram, Telegram and your
   website — connected to your CRM, docs and knowledge base."* This is the single
   highest-impact change.
2. **Fix the vague "Low" stat.** A number beats a word. Use e.g. `7–14 днів`
   time-to-launch **only if you can commit to it**, or keep a cost figure like
   `$0` monthly hosting (offer) — but make it concrete. (See §4 on the delivery-
   time claim.)
3. **Add a "What you get in 10–14 days" deliverables block** — bot, channel
   connection, knowledge base from your docs, admin panel, logs, deployment on
   your server + instructions. This is the critique's strongest single addition
   and you already have all these as real features.
4. **Add a dedicated "Why work with me" trust block on the home page** — pull the
   strongest proof up from `enterprise.html`: 20+ years building software, fully
   self-hosted (no platform lock-in), full source code handed over, docs +
   training after launch, two live bots you can message right now.
5. **Put pricing on the page** (not just in the widget). Even "from $200 /
   from $250 / custom after scoping" as a small table beats hiding it.
6. **Make the case studies real.** Replace the generic "bot type" cards with 1–2
   true before/after stories with real numbers (see §4 — must not be invented).

---

## 4. Where I disagree with the critique, or where you must decide

I won't implement these blindly, because getting them wrong would hurt trust:

- **The UAH price list (18 000 / 30 000 / 22 000 грн).** These conflict with the
  prices already live in your assistant ($200 simple bot, ~$250 WhatsApp+AI).
  18 000 грн ≈ $430+, which is a *different, higher* price than $200. **You must
  pick one pricing story.** My recommendation: publish in the currency your
  buyers use (USD for international via Upwork/WhatsApp, UAH for local UA site),
  and keep the numbers consistent with what the bot quotes. I will not publish
  two contradicting prices.
- **"Запуск від 7 днів" / "10–14 днів до запуску".** This is a *promise*. It
  reads great, but only put a delivery time on the site if you can consistently
  hit it. Miss it once and it damages trust more than it helped. Confirm the
  timeframe you can actually commit to and I'll use exactly that.
- **The example case study ("Фінансова компанія… 80% автоматичних відповідей").**
  The critique itself notes numbers create trust — but **invented numbers are a
  liability.** If you have a real client result (even anonymized) with real
  figures, give them to me and I'll build the case study card. If you don't yet,
  we frame the two live bots honestly ("try it yourself") rather than fabricate
  an 80% stat.
- **"AI won't make up answers."** Good objection to address — but phrase it
  truthfully: your bots ground answers in your documents/rules and fall back to
  rules, which greatly reduces hallucination; with an LLM you can reduce but not
  claim absolute zero. I'll word it as "answers from your documents and rules,"
  not "the AI never invents anything," unless a given bot is purely rule-based.
- **Reordering the page** (Hero → Problems → Services → Process → Cases → Pricing
  → FAQ → About → Contact) is sound and I'd mostly follow it. One caveat: your
  finance/trading niche block and the "live bots" proof are strong assets — I'd
  keep "live bots" high (right after problems/services) because *working bots you
  can message* are your best trust signal, stronger than a promised timeline.

---

## 5. Suggested page structure (adapted to your real assets)

1. **Hero** — outcome headline + one primary CTA (Start / Замовити) + 3 real
   numbers (24/7 · $0 hosting offer · 100% code yours).
2. **Problems we solve** — 4 cards: support, knowledge base (PDF/Word/Excel),
   automation (CRM/заявки/calendar), analytics (top questions asked).
3. **Live bots (proof)** — keep high; message them now.
4. **What you get in ~2 weeks** — deliverables list (new block).
5. **Services / channels** — WhatsApp · Instagram · Telegram · Website · CRM.
6. **How it works** — 4 steps (already exists; add "free 30-min audit" as step 1).
7. **Pricing** — from $200 / from $250 / custom, + the $0 hosting offer line.
8. **Case studies** — real numbers (pending your data).
9. **Why work with me (trust)** — new block, pulled from enterprise depth.
10. **FAQ** — client objections (mostly done).
11. **Contact** — WhatsApp / Telegram / Viber / Email (done).

---

## 6. My honest bottom line

- The critique is a **good brief** and I'd act on ~80% of it.
- The **highest-value, safe-to-do-now** changes: outcome hero, a "what you get"
  deliverables block, a home-page trust block, and visible pricing consistent
  with the bot's quotes.
- The **do-not-fake** items: delivery-time promises and case-study metrics —
  I need real inputs from you, or we present the live bots as the proof instead.
- Everything here applies to **both** the English site and the `UK/` version;
  the UK price story should be decided (USD vs UAH) before I touch copy.

### What I need from you to proceed
1. Final pricing + currency (USD only? add UAH on the UK site?).
2. A delivery timeframe you can actually commit to (or "no timeframe on site").
3. Any **real** client result (even anonymized) with real before/after numbers.
4. Confirm whether each bot is rule-based or LLM (affects the "won't invent
   answers" wording).

Give me those four, and I'll implement the hero rewrite, the "what you get"
block, the trust block, and the pricing block on both language versions.
