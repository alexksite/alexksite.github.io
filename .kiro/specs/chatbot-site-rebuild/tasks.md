# Implementation Plan — Chatbot-Focused Website Rebuild

> Do not start these tasks until requirements and design are approved and the
> open questions in `requirements.md` (§Open questions) are answered.

- [ ] 1. Create the standalone enterprise page
  - [ ] 1.1 Create `enterprise.html` from the current Java/ZK content
    - Move the timeline, four-pillar expertise, ZK/Keikai partner callout and
      the enterprise narrative off the home page into this page.
    - Give it its own `<title>`, meta description, canonical, OG/Twitter tags.
    - _Requirements: 5.1, 5.3, 7.3_
  - [ ] 1.2 Move the eight enterprise case studies onto the enterprise page
    - Relocate the case-study cards/filters from `case-studies.html`.
    - _Requirements: 5.1, 3.4_
  - [ ] 1.3 Add the enterprise JSON-LD graph (WebPage + Person + enterprise ItemList)
    - _Requirements: 7.3_
  - [ ] 1.4 Preserve the old `case-studies.html` route
    - Repurpose it to link to `enterprise.html` and the live-bots section so no
      inbound links break (design §7, Option A).
    - _Requirements: 5.1, 7.5_

- [ ] 2. Rebuild the home page structure and navigation
  - [ ] 2.1 Update nav + brand sub-role + drawer to chatbot-relevant links
    - Links: Services, Live Bots, Why Custom, Offer, FAQ, Contact.
    - _Requirements: 1.1, 5.4_
  - [ ] 2.2 Rewrite the hero (headline, sub-line, CTAs, meta line)
    - Primary CTA = start a bot project; secondary = try live bots.
    - Business language, no jargon in the headline.
    - _Requirements: 1.1, 1.2, 1.4_
  - [ ] 2.3 Replace the tech ticker with a channels strip
    - WhatsApp · Instagram · Telegram · Web.
    - _Requirements: 1.1, 2.1_
  - [ ] 2.4 Add one small in-body link to the enterprise page
    - Single low-prominence line only.
    - _Requirements: 1.3, 5.2_

- [ ] 3. Build the chatbot services section
  - [ ] 3.1 Author outcome-first service cards (design §3.2)
    - _Requirements: 2.1, 2.4_
  - [ ] 3.2 Style using existing `.grid`/`.card` components
    - _Requirements: 7.1_

- [ ] 4. Build the "live bots" proof section
  - [ ] 4.1 WhatsApp Trading FAQ Bot card with try-live + code + portfolio links
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ] 4.2 Orion Restaurant Instagram Bot card with links
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ] 4.3 Ensure all external links use `target="_blank" rel="noopener"`
    - _Requirements: 3.3_

- [ ] 5. Build the "why custom Python" comparison section
  - [ ] 5.1 Author the business-benefit comparison (design §3.3 table)
    - _Requirements: 2.2_
  - [ ] 5.2 Add reliability proof points in business language
    - Instant replies, human escalation, health checks, 72+ hrs uptime.
    - _Requirements: 2.3_

- [ ] 6. Build the launch offer section
  - [ ] 6.1 Author the offer panel (free hosting, one-click scaling, 6mo AI gateway, pay once)
    - Objection-busting framing; soften absolute claims.
    - _Requirements: 2.5_
  - [ ] 6.2 Communicate ongoing support/maintenance explicitly
    - _Requirements: 2.4_

- [ ] 7. Build the finance / trading / crypto section
  - [ ] 7.1 Author the niche/credibility block tied to the trading bot
    - _Requirements: 4.1, 4.3_
  - [ ] 7.2 Add "education, not financial advice" framing wherever finance appears
    - _Requirements: 4.2_

- [ ] 8. Rewrite the FAQ and contact sections
  - [ ] 8.1 Replace AI-architecture FAQ with chatbot-buyer questions (design §3.7)
    - _Requirements: 2.1, 2.2, 2.4, 4.1_
  - [ ] 8.2 Update contact CTAs (book a call, email, optional WhatsApp/Telegram)
    - Pending open question Q1.
    - _Requirements: 1.2_

- [ ] 9. Update the on-site chat widget content
  - [ ] 9.1 Rewrite `data/kb.json` for chatbot-first positioning
    - New entries: services, channels, live bots, no-code comparison, offer,
      ownership, integration, AI vs rules, support, finance niche, how-to-start.
    - _Requirements: 6.1_
  - [ ] 9.2 Revise Java/ZK/Keikai KB entries to "background" that points to the enterprise page
    - _Requirements: 6.3_
  - [ ] 9.3 Update `agent.js` greeting, `SUGGESTIONS` chips and header sub-title
    - Retrieval logic untouched.
    - _Requirements: 6.2, 6.4_
  - [ ] 9.4 Manually test the widget against a new-positioning question battery
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 10. Update SEO, structured data and agent-facing files
  - [ ] 10.1 Rewrite home `<title>`, meta, OG/Twitter, keywords for a chatbot developer
    - _Requirements: 1.5, 7.3_
  - [ ] 10.2 Rewrite home JSON-LD (Person jobTitle, ProfessionalService, offer catalog, FAQPage, featured-work ItemList)
    - _Requirements: 1.5, 7.3_
  - [ ] 10.3 Rewrite `llms.txt` (chatbot practice first, enterprise second)
    - _Requirements: 7.3_
  - [ ] 10.4 Update sitemap / manifest consistency; add enterprise page
    - _Requirements: 7.3, 7.5_

- [ ] 11. Verification pass
  - [ ] 11.1 Desktop + mobile visual review of home and enterprise pages
    - _Requirements: 7.1, 7.4_
  - [ ] 11.2 Validate JSON-LD on both pages
    - _Requirements: 7.3_
  - [ ] 11.3 Confirm accessibility affordances preserved (skip link, ARIA, keyboard, reduced motion, contrast)
    - _Requirements: 7.4_
  - [ ] 11.4 Confirm no broken routes and all external links resolve with `rel="noopener"`
    - _Requirements: 3.3, 7.5_
  - [ ] 11.5 Confirm static/GitHub Pages deployability (no build step introduced)
    - _Requirements: 7.2_
