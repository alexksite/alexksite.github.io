# Requirements — Chatbot-Focused Website Rebuild

## Overview

The current website (`alexkoziy.com`) positions Alex Koziy as a broad
"AI Engineer (Python & AWS) & Java/Spring Boot Architect". The Java, ZK and
Keikai enterprise story dominates the page and dilutes the message. It does not
read like the site of a specialist who will build, ship and support a business
chatbot reliably.

This rebuild repositions the site around a single, sharp promise:

> **A Python chatbot developer businesses can hand a bot project to — and trust
> that it will be built well, deployed, and supported.**

The goal is to make a strong impression on **non-technical business people**
(shop owners, clinic managers, restaurant owners, online-school founders,
trading educators) so they feel confident delegating a chatbot to Alex.

The supporting facts come from the current site plus the commercial material in
`D:\work\Projects\Oracle_Cloud\Comecial` (product descriptions, sales
arguments, launch offer, portfolio links).

## Positioning inputs (from source documents)

These facts are approved source material for the copy:

- **Two live, referenceable bots** exist and must be showcased:
  1. **WhatsApp Trading FAQ Bot** — rule-based educational trading assistant,
     Python 3.12 + FastAPI, Meta Cloud API, deployed on Oracle Cloud Free Tier,
     optional Claude AI mentor mode via an LLM gateway.
     Links: `https://wa.me/+380998780590`,
     `https://github.com/alexksoft/Trading-FAQ-bot`,
     `https://www.freelancer.com/portfolio-items/11605487-trading-faq-bot`
  2. **Orion Restaurant Instagram DM Bot** — AI-powered order/FAQ assistant,
     Python/FastAPI, Meta Instagram API, Claude via LLM gateway, rule-based
     fallback, manager handoff.
     Links:
     `https://www.instagram.com/orion_restau/`,
     `https://github.com/alexksoft/orion-instagram-direct-chatbot`,
     `https://www.freelancer.com/portfolio-items/11582496-instagram-direct-chatbot-with-ai`
- **Why Python beats no-code/low-code** (ManyChat, SendPulse, SmartSender):
  no monthly platform lock-in ($3–10/mo VPS vs hundreds/mo), unlimited custom
  logic, direct API/DB integration without Zapier/Make, scales under load,
  full AI/LLM integration, and the client **owns the source code and data**.
- **Launch offer:** free deployment on Oracle Cloud "Always Free" (zero monthly
  hosting), one-click cloud scaling without reinstalling the bot, and 6 months
  free access to a multi-model AI gateway. Client pays once for development.
- **Channels:** WhatsApp, Instagram Direct, Telegram, plus web widgets.
- **Finance / trading / crypto** is both a delivered specialism (the trading
  bot) and Alex's personal interest — to be used as a credibility and niche
  angle, not as financial advice.

## Requirement 1 — Reposition the home page around Python chatbots

**User story:** As a business owner evaluating who should build my chatbot, I
want the site to clearly communicate that Alex builds and supports custom Python
chatbots, so that within seconds I understand this is exactly what I need.

### Acceptance criteria
1. WHEN a visitor lands on the home page THEN the hero SHALL state, in
   business language, that Alex builds custom Python chatbots for WhatsApp,
   Instagram, Telegram and web, that businesses can rely on and that he supports
   after launch.
2. WHEN the visitor reads the hero THEN the primary call to action SHALL be to
   start a bot project (book a call / message), not "See case studies".
3. THE home page SHALL NOT lead with, or give prominent space to, Java, Spring
   Boot, ZK or Keikai. Any reference to that experience SHALL be a single small
   link to a separate page (see Requirement 5).
4. THE hero SHALL avoid jargon (no "RAG", "BM25", "Pydantic", "aiogram" in
   headline copy); technical terms MAY appear only in a dedicated tech/trust
   section lower on the page.
5. THE page title, meta description, Open Graph tags and JSON-LD SHALL be
   rewritten to describe a Python chatbot developer, not a Java/AI architect.

## Requirement 2 — Present chatbot services and value clearly and credibly

**User story:** As a business owner who is not technical, I want to understand
what I get and why custom beats a cheap builder, so that I feel safe spending
money on a bespoke bot.

### Acceptance criteria
1. THE site SHALL present the chatbot offering as concrete services/outcomes
   (e.g. 24/7 customer support & FAQ automation, lead capture, order/booking
   assistant, AI-assisted conversations with human handoff, multi-channel
   deployment).
2. THE site SHALL include a "Why custom Python, not a no-code builder" section
   translated into business benefits: no growing monthly platform fees, you own
   the code and data, unlimited custom logic, direct integration with your CRM /
   database / payment tools, and reliability under peak load.
3. WHERE claims about reliability appear, THEY SHALL use the supporting facts
   from the source docs (instant replies, graceful human escalation, health
   checks, verified 72+ hours continuous uptime) phrased for a business reader.
4. THE site SHALL communicate ongoing **support and maintenance** as an explicit
   part of the offer, so a prospect sees the bot will be looked after, not
   abandoned after delivery.
5. THE "launch offer" (free Oracle Cloud Always-Free hosting, one-click scaling,
   6 months free AI gateway access, pay once for development) SHALL be presented
   as a clear value proposition with the financial-risk objections addressed.

## Requirement 3 — Showcase the two live bots as proof

**User story:** As a skeptical prospect, I want to see and test real working
bots, so that I believe Alex is a practitioner with a real portfolio, not a
theorist.

### Acceptance criteria
1. THE site SHALL feature the WhatsApp Trading FAQ Bot and the Orion Restaurant
   Instagram bot as the primary portfolio items.
2. EACH featured bot SHALL show: what it does in plain language, the channel, a
   short list of capabilities, the tech in a compact/optional form, and working
   links to try it live and to view the code/portfolio entry.
3. THE "try it live" links SHALL open in a new tab with `rel="noopener"`.
4. THE existing enterprise case studies MAY remain accessible but SHALL be
   subordinate to the chatbot portfolio and SHALL NOT dominate the home page.

## Requirement 4 — Finance / trading / crypto niche and interest

**User story:** As a trading educator or fintech founder, I want to see that
Alex understands finance and trading, so that I trust him with a bot in my
domain.

### Acceptance criteria
1. THE site SHALL state that Alex develops applications in the **finance** area
   and has a personal interest in **finance, trading and cryptocurrency**.
2. THE finance/trading angle SHALL be presented as domain credibility and a
   niche (backed by the live trading bot), NOT as investment or financial
   advice; copy SHALL make clear the trading bot educates rather than advises.
3. THE finance interest MAY be surfaced as a short "focus areas" or "about"
   element and reflected in the chatbot's knowledge base.

## Requirement 5 — Move Java / ZK / Keikai to a separate page

**User story:** As Alex, I want my long Java and ZK history preserved but out of
the way, so that the chatbot message stays clean while the depth is still there
for anyone who wants it.

### Acceptance criteria
1. THERE SHALL be a separate, standalone page (e.g. `enterprise.html` or
   `java-zk.html`) dedicated to the Java, Spring Boot, ZK and Keikai experience,
   including the enterprise case studies and the official ZK/Keikai partner
   credential.
2. THE home page SHALL link to this page only via one small, low-prominence link
   (e.g. a single line such as "20+ years of enterprise Java, Spring Boot & ZK —
   see my enterprise background").
3. THE separate page SHALL be self-contained: its own nav context, its own
   SEO/meta, and it SHALL NOT pull the chatbot message back to the front.
4. THE main navigation SHALL center on chatbot-relevant destinations (Services,
   Live Bots / Work, Why Custom, FAQ, Contact); the enterprise page SHALL NOT be
   a primary nav item (a footer or in-body link is acceptable).

## Requirement 6 — Update the on-site assistant (chatbot widget)

**User story:** As a visitor, I want the site's own chat widget to answer
questions about the chatbot services accurately, so that the site demonstrates
the very capability it sells.

### Acceptance criteria
1. THE knowledge base (`data/kb.json`) SHALL be rewritten so its entries reflect
   the chatbot-first positioning: services, channels, the two live bots, the
   no-code comparison, the launch/hosting offer, support, finance niche, and
   how to hire.
2. THE widget SHALL continue to run client-side with no external API calls and
   SHALL continue to defer to Alex for anything not covered.
3. WHERE the current KB describes Java/ZK/AI-architecture as the main offering,
   THOSE entries SHALL be revised to treat Java/ZK as background (pointing to
   the separate enterprise page) rather than the headline.
4. THE widget's greeting, suggestion chips and header copy SHALL match the new
   chatbot positioning.

## Requirement 7 — Preserve design quality, SEO and accessibility

**User story:** As a business visitor, I want the new site to look as polished
and trustworthy as the current one, so that the presentation itself signals
professionalism.

### Acceptance criteria
1. THE rebuild SHALL reuse the existing visual design system (dark theme,
   gradient accents, typography, `.wrap`/`.section`/`.hero`/`.chip`/`.cs`/`.faq`
   components) so quality is preserved; new sections SHALL match existing
   styling conventions.
2. THE site SHALL remain a static site deployable on GitHub Pages (no build step
   or server requirement introduced).
3. THE rebuilt pages SHALL keep valid, updated structured data (JSON-LD),
   canonical URLs, Open Graph/Twitter tags, `llms.txt`, sitemap and manifest
   consistency with the new content.
4. THE pages SHALL preserve existing accessibility affordances (skip link, ARIA
   labels, keyboard support, reduced-motion handling, sufficient contrast).
5. THE rebuild SHALL not break existing routes that may be linked externally;
   where content moves, the old URLs SHALL still resolve to sensible content.

## Out of scope
- Building or changing the actual chatbot backend products.
- Adding a server-side LLM to the website's own widget.
- Providing any real financial, investment or trading advice.
- Redesigning the visual identity from scratch (colors, logo, fonts stay).

## Approved decisions (from client, locked)
1. **Primary CTA:** keep the existing Google Calendar booking link and
   `info@alexkoziy.com`. No WhatsApp/Telegram contact button. (The trading-bot
   phone number appears only as a "try the live bot" demo link, see #4.)
2. **Page structure:** three purpose-built pages, all separate:
   - `case-studies.html` → **bots** portfolio / chatbot case studies.
   - `enterprise.html` → Java / Spring Boot enterprise experience.
   - `java-zk.html` → ZK / Keikai experience (a distinct page, separate from
     `enterprise.html`).
3. **Brand sub-line:** change nav/footer brand role from "AI · Python · AWS" to
   **"Python Chatbots · WhatsApp · Instagram · Telegram"**.
4. **Trading bot phone** `+380998780590`: use only as the live-bot demo link
   (`wa.me`), not as a personal contact method.
5. **Naming:** keep the **"Alex Koziy"** personal brand. No studio name.

## Backup / delivery decision (locked)
- Before rebuilding, copy **all current site files** into a new `OLD2/` folder
  (done). The rebuild happens in the repo root.
- Every current file/route keeps the **same functionality** it has now
  (nav + drawer, reveal-on-scroll, scroll-spy, case-study filters, Google Forms
  contact form via hidden iframe, lazy client-side chat widget, analytics),
  only with **new text and new design/positioning**.
