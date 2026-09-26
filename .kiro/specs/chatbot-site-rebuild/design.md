# Design — Chatbot-Focused Website Rebuild

## 1. Goals and constraints

- **Message:** one page, one promise — *"I build and support custom Python
  chatbots for business."* Everything on the home page serves that.
- **Audience:** non-technical business decision-makers. Copy leads with money,
  time saved, ownership and reliability; tech is proof, not pitch.
- **Constraints:** stays a static site (GitHub Pages, no build step); reuses the
  current design system in `css/style.css`; keeps the client-side chat widget
  with no external calls; preserves SEO, structured data and accessibility.

## 2. Information architecture

### Pages after rebuild (locked structure)

| Page | Role | Nav prominence |
|------|------|----------------|
| `index.html` | Chatbot-first landing page | Primary |
| `case-studies.html` | **Bots portfolio** / chatbot case studies (the two live bots + future bots) | Primary ("Live Bots" / "Work") |
| `enterprise.html` (new) | Java / Spring Boot enterprise background + enterprise case studies | Footer + one small in-body link |
| `java-zk.html` (new) | ZK / Keikai experience, distinct from enterprise | Footer + link from enterprise page |
| `data/kb.json` | Widget knowledge base, rewritten | n/a |
| `llms.txt` | Plain-text summary for AI agents, rewritten | n/a |

**Backup:** all pre-rebuild files were copied to `OLD2/` before any change.
Each page keeps identical functionality (see §1 constraints and Requirement
"same functionality, new text/design").

### Home page section order (top → bottom)

1. **Nav** — brand + chatbot-relevant links + primary CTA.
2. **Hero** — headline promise, sub-line in business terms, CTA "Start your bot",
   secondary "See live bots", trust chips (available / remote / replies fast).
3. **Channels strip** — WhatsApp · Instagram · Telegram · Web (replaces the
   Python/Bedrock tech ticker as the marquee).
4. **What I build (Services)** — 4–6 outcome cards: FAQ & support automation,
   lead capture, order/booking assistant, AI conversations with human handoff,
   multi-channel deployment, ongoing support.
5. **Live bots (Proof)** — the two real bots with try-live + code links.
6. **Why custom Python, not a builder** — business-benefit comparison table /
   cards (cost, ownership, integration, scale, AI).
7. **Launch offer** — free Oracle Cloud hosting, one-click scaling, 6 months
   free AI gateway, pay once for development; objection-busting framing.
8. **Finance / trading focus** — short niche block (domain credibility, not
   advice), tied to the trading bot.
9. **How it works / support** — simple 3–4 step process ending in "ongoing
   support", to reassure the bot won't be abandoned.
10. **FAQ** — rewritten for chatbot buyers.
11. **Contact** — book a call, email, and (optional) WhatsApp/Telegram DM.
12. **Footer** — small link to the enterprise page + social/portfolio links.

### Navigation labels

- Proposed: `Services` · `Live Bots` · `Why Custom` · `Offer` · `FAQ` ·
  `Contact` (button).
- Brand sub-role changes from `AI · Python · AWS` to
  `Python Chatbots · WhatsApp · Instagram · Telegram` (pending Q3 approval).

## 3. Content design

### 3.1 Hero copy (draft, for approval)

- **Eyebrow:** `Custom Python chatbots for business`
- **H1:** `Chatbots your customers actually get answers from.` with
  `answers` in `.grad-text`.
- **Sub:** Plain-language promise: built in Python for WhatsApp, Instagram,
  Telegram and your website; instant 24/7 replies; hands off to a human when
  needed; you own the code; and it's supported after launch — not abandoned.
- **Primary CTA:** `Start your bot` → contact.
- **Secondary CTA:** `Try my live bots` → live-bots section.
- **Meta line:** Available · Remote worldwide · Replies within 1 business day.

### 3.2 Services (outcome cards)

Each card = business outcome first, mechanism second. Draft set:

1. **24/7 support & FAQ automation** — answer repeat questions instantly, day
   and night, so staff stop copy-pasting the same replies.
2. **Lead capture & qualification** — greet, qualify and route leads from DMs
   and comments before they go cold.
3. **Orders, bookings & menus** — take orders, bookings and enquiries right
   inside chat (as in the live restaurant bot).
4. **AI conversations with a safety net** — natural AI answers with a rule-based
   fallback and instant human handoff, so it never leaves a customer stuck.
5. **One bot, every channel** — WhatsApp, Instagram Direct, Telegram and web
   from a single codebase.
6. **Built to be supported** — monitoring, health checks and a maintenance
   relationship, not a hand-off-and-vanish delivery.

### 3.3 Why custom Python (business translation)

Source (`commercial_chat.docx`) → business benefit mapping:

| No-code / builder pain | Custom Python benefit (business words) |
|------------------------|----------------------------------------|
| Subscription grows with your audience (hundreds/mo) | Flat, tiny hosting (a few dollars/mo) no matter how many customers |
| Blocked by preset building blocks | Any logic you can describe, we can build |
| Integrations need Zapier/Make (extra fees, fragile) | Direct, reliable links to your CRM, database and payment tools |
| Falls over / lags during promos & spikes | Handles peak load and replies instantly |
| Your data lives on their servers | You own the source code and the data |
| Marked-up, limited AI add-ons | Full AI (Claude, GPT) integration on your terms |

Rendered as either a two-column comparison or benefit cards, styled with
existing `.card` / `.cs` / `.chip` components.

### 3.4 Live bots block

Reuse the `.cs` card pattern. For each bot:

- Tag chips (channel + AI/rule-based).
- Plain-language "what it does".
- 3–5 capability bullets in a `<details>` (progressive disclosure).
- Compact tech line (chips) — optional, collapsed.
- Action row: `Try it live` (primary ghost) + `View code` + `Portfolio`.

**Bot 1 — WhatsApp Trading FAQ Bot:** educational trading assistant; instant
answers on indicators, risk and psychology; human-mentor handoff; runs on Oracle
Cloud free tier. Links per Requirement 3.

**Bot 2 — Orion Restaurant Instagram Bot:** AI order/FAQ assistant in EN/UA;
menu consultation; manager handoff; rule-based fallback. Links per Requirement 3.

### 3.5 Launch offer block

Frame around removing financial risk:
- **$0 monthly hosting** on Oracle Cloud Always Free, tuned for reliable uptime.
- **Scale in one click** — it's a real cloud platform; upgrade CPU/RAM from the
  console without reinstalling the bot.
- **6 months free AI gateway** — access to multiple premium models without
  separate subscriptions.
- **Pay once for development** — no platform tax, the bot is yours.

Use a `.callout` / `.track` styled panel. Avoid over-promising ("forever" claims
softened to "no monthly hosting bills").

### 3.6 Finance / trading / crypto block

- One short section: "I build in the finance space, and it's what I follow
  personally — trading, markets and crypto." Ties to the live trading bot as
  proof of domain fluency.
- Explicit disclaimer tone: the trading bot **teaches concepts and manages
  risk education; it does not give buy/sell advice.** No investment advice
  anywhere on the site.

### 3.7 FAQ (rewritten themes)

Replace AI-architecture Q&A with buyer questions: What channels? How much does a
bot cost to run? Can it use AI / ChatGPT? Do I own it? Can it connect to my CRM?
What about support after launch? Can you build for trading/finance? How do we
start? Keep the "Who is Alex / how to contact" essentials.

## 4. Enterprise page (`enterprise.html`)

- Self-contained page carrying the current Java/Spring Boot/ZK/Keikai narrative,
  the timeline, the four-pillar expertise, the ZK partner callout, and the eight
  enterprise case studies (moved/kept from `case-studies.html`).
- Its own `<title>`, meta, canonical, and JSON-LD (`WebPage` + `Person` +
  enterprise `ItemList`).
- Back-links to home; framed as "background / where I come from", explicitly
  secondary to the chatbot practice.
- Reached from: home footer link, one in-body home link, and the widget when a
  visitor asks about Java/ZK.

## 5. On-site widget (`data/kb.json`) redesign

The widget engine (`js/agent.js`) stays as-is (BM25F, client-side). Only the
**knowledge base content** changes:

- **New/expanded entries:** chatbot services, channels (WhatsApp/Instagram/
  Telegram/web), the two live bots (with links), no-code comparison, hosting/
  launch offer, ownership & source code, CRM/DB integration, AI vs rule-based,
  support & maintenance, finance/trading niche (+ "not advice"), how-to-start,
  pricing deferral, hire/contact.
- **Revised entries:** Java, Spring Boot, ZK, Keikai become short "background"
  answers that point to `enterprise.html` rather than headline offerings.
- **Widget chrome:** greeting, suggestion chips (`SUGGESTIONS`) and header
  sub-title in `agent.js` updated to chatbot phrasing (e.g. "What channels do
  you support?", "How much does a bot cost to run?", "Show me a live bot",
  "Do I own the code?", "How do we start?").
- Keep the offline / no-data-leaves-your-browser promise and the defer-to-Alex
  behavior unchanged.

Note: `SUGGESTIONS`, greeting text and header copy are the only `agent.js`
edits; retrieval logic and thresholds are untouched.

## 6. Visual & styling approach

- Reuse existing classes; introduce **no new color tokens or fonts**.
- New content maps onto existing components:
  - Services → `.grid .grid--3/--4` + `.card card--pillar`.
  - Live bots → `.cs` cards with `.cs__tags`, `.cs__facts`, `<details>`.
  - Comparison → `.grid--2` cards or a styled table using existing tokens.
  - Offer → `.callout` / `.track` panel.
  - Channels strip → reuse `.strip`/`.strip__track` marquee with new labels.
- Any genuinely new CSS (e.g. a comparison table) is added to `css/style.css`
  using existing custom properties (`--muted`, gradients, radii) to stay
  visually consistent.

## 7. Handling existing routes (no breakage) — locked

- `case-studies.html` **stays** as a live route but is **repurposed** into the
  bots portfolio (chatbot case studies), keeping its filter functionality.
- `enterprise.html` (new) holds the Java/Spring Boot narrative + enterprise
  case studies moved off the current pages.
- `java-zk.html` (new) holds the ZK/Keikai narrative and partner credential.
- `index.html` remains the landing page.
- Result: the two previously-indexed routes (`/` and `/case-studies.html`) still
  resolve; two new routes are added to the sitemap. No inbound-link 404s.

## 8. SEO / metadata / structured data

- **Home:** retitle to a chatbot developer (e.g. *"Alex Koziy — Custom Python
  Chatbot Developer | WhatsApp, Instagram, Telegram"*); rewrite description, OG,
  Twitter, keywords. JSON-LD `Person.jobTitle` → "Python Chatbot Developer";
  `ProfessionalService` `serviceType` list → chatbot services; `hasOfferCatalog`
  → chatbot offerings; `FAQPage` → new FAQ; `ItemList` featured work → the two
  live bots.
- **Enterprise page:** its own schema graph as in §4.
- **`llms.txt`:** rewritten to describe the chatbot practice first, enterprise
  background second.
- **`sitemap`/`site.webmanifest`/CNAME:** keep consistent; add `enterprise.html`
  to sitemap if a sitemap exists.
- Keep `og-image.jpg` unless a chatbot-specific image is provided later.

## 9. Accessibility

- Preserve skip link, ARIA roles, keyboard handling, `prefers-reduced-motion`,
  focus management in the widget.
- New interactive elements (comparison toggles, `<details>`, CTAs) get
  appropriate labels and visible focus states.
- Maintain color-contrast on any new text/background combinations.

## 10. Risks & mitigations

- **Message drift:** enterprise depth is tempting to over-feature. Mitigate by
  the strict single in-body link rule (Req 5.2).
- **Financial-advice liability:** enforce "education, not advice" wording
  everywhere finance/trading appears (Req 4.2).
- **Publishing personal contact (phone/WhatsApp):** confirm at approval (Q4)
  before exposing `+380998780590` beyond the live-demo link.
- **SEO regression from retitle:** keep canonical URLs stable, update sitemap,
  and preserve existing routes (§7) to protect ranking.

## 11. Verification approach

- Visual check of both pages at desktop and mobile widths.
- Validate JSON-LD (e.g. Schema.org validator) for home and enterprise pages.
- Manually exercise the widget against a battery of new-positioning questions
  (services, channels, live bots, cost, ownership, support, finance, Java →
  should defer/point to enterprise page).
- Confirm all external links (live bots, GitHub, Freelancer, socials) open with
  `rel="noopener"` and resolve.
- Confirm no 404s for previously existing routes.
