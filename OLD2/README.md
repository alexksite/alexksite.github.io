# alexkoziy.com — rebuild

A modern replacement for the current alexkoziy.com, repositioned around the last two years of
AI work in **Python and AWS**, with the Java/Spring Boot and ZK/Keikai track record kept as the
credibility foundation rather than the headline.

Static HTML/CSS/JS. No build step, no framework, no runtime dependencies. Deploy by serving this
directory (the existing site is on GitHub Pages, so it drops straight in).

## Files

```
index.html          Homepage — hero, AI focus, timeline, expertise, work, engagement,
                    clients, at-a-glance facts, FAQ, contact
case-studies.html   All 9 case studies with domain filtering
css/style.css       Design system + all styles
js/main.js          Nav, drawer, scroll reveal, scrollspy, filters, form validation
site.webmanifest    PWA manifest
robots.txt          Open to search engines, AI answer engines and preview bots
sitemap.xml         Current URLs, with lastmod, hreflang and image entries
llms.txt            Plain-Markdown summary for AI agents (llmstxt.org convention)
images/             Logos, favicons, generated social card
```

Plus the chat agent:

```
js/agent-loader.js  Tiny lazy launcher — the only agent code on the critical path
js/agent.js         Retrieval engine + chat UI + its own injected styles
data/kb.json        Generated knowledge base (57 entries)
```

The SEO layer and the agent are both generated, not hand-maintained:

```
../build/seo_data.py    Single source of truth: facts, FAQ, services, case studies
../build/apply_seo.py   Injects JSON-LD + head metadata + the facts/FAQ sections
../build/gen_llms.py    Generates llms.txt from the same model
../build/gen_kb.py      Generates the agent's data/kb.json from the same model
```

Re-run after editing `seo_data.py`:

```bash
python3 ../build/apply_seo.py && python3 ../build/gen_llms.py && python3 ../build/gen_kb.py
```

Both scripts are idempotent — re-running replaces generated blocks rather than
duplicating them, and `apply_seo.py` validates the JSON-LD as it writes.

## What carried over from the old site

All of it, verified by crawling the four live pages (`/`, `contact_project.html`,
`contact_team.html`, `case_studies.html` — the 2019 `sitemap.xml` was stale and most of its URLs
now 404):

- 20+ years Java/Spring Boot positioning, legacy modernization, performance work, integrations
- ZK Framework v3–10, Keikai (5 years), official ZK implementation partner claim
- The dual engagement model: independent specialist **or** dedicated teams via Quontex
- All 8 case studies with their original stack, impact and scope lines
- Client logos: PwC, Stratifytech, Dynamic Inventory
- Contact routes: `info@alexkoziy.com`, Google Calendar booking, LinkedIn, Upwork
- Both Google Forms endpoints and their `entry.*` field IDs, so the contact form still posts to
  the existing form

## What's new

- **AI/Python/AWS is now the lead story.** Hero, a dedicated "AI Focus" section, and a
  "Since 2024" entry at the top of the timeline.
- **A "through-line" argument** rather than a career pivot apology: enterprise backend discipline
  is framed as the reason the AI work is production-grade.
- **Four expertise pillars** — AI & LLM engineering, Python backend, AWS cloud, Java/Spring
  Boot & ZK.
- **A ninth case study** covering the current AI/RAG practice.
- **Domain filtering** on the case studies page.

## Fixes to the old site's defects

| Issue on the live site | Status |
|---|---|
| No `<h1>` (document started at `<h2>`) | Fixed — one `<h1>` per page, no heading-level skips |
| No meta description | Added on both pages |
| No Open Graph / Twitter cards | Added, with a generated 1200×630 card (`images/og-image.jpg`) |
| No canonical tag | Added |
| No structured data | `Person`, `ProfessionalService`, `WebSite`, `BreadcrumbList` JSON-LD |
| Missing `alt` text on logos | All images have `alt` |
| `robots.txt` was Googlebot-only, no sitemap | Now `User-agent: *` + `Sitemap:` line |
| `sitemap.xml` listed mostly 404 URLs | Rewritten to the two real pages |
| Dead link to `stratifytech.com` (404) | Logo kept as a credential, link removed |
| Dead internal link `/contact-quontex.html` (404) | Not carried over |
| Stray `-->` artifacts from malformed comments | Gone |
| Logo PNGs bloated (1.44 MB total; a 16×14 favicon was 46 KB) | Stripped metadata and resized — **1.44 MB → 437 KB** |
| Client logos were dark artwork, invisible on a dark theme | Pre-generated `-dark.png` variants: neutral pixels inverted, brand colours preserved |

## Search and AI-answer-engine optimization

### Structured data

One JSON-LD `@graph` per page, all nodes cross-linked by `@id` with **zero dangling
references**.

| Page | Nodes |
|---|---|
| `index.html` | `Person`, `Organization` (Quontex), `ProfessionalService`, `WebSite`, `WebPage`, `FAQPage`, `ItemList` |
| `case-studies.html` | `WebPage`, `BreadcrumbList`, `ItemList` (9 `CreativeWork`), `Person`, `Organization`, `WebSite` |

Notable details:

- **`Person`** carries `knowsAbout` (49 topics), `hasOccupation`, `knowsLanguage`,
  `contactPoint`, `affiliation`/`worksFor` → Quontex, `sameAs` → LinkedIn and Upwork, and
  `subjectOf` → the ZK partner announcement. That last one is the strongest entity signal
  available: a third-party publication naming him.
- **`ProfessionalService`** has a six-item `hasOfferCatalog`, so each service is a
  first-class `Service` node rather than a string.
- **`ItemList`** on the case studies page describes all nine projects with `keywords`
  (tech stack) and `about` (industry), each with a stable `@id` matching the on-page
  `id="case-N"` anchor.
- **`speakable`** is declared for voice assistants.
- **No `aggregateRating` or `review` markup.** There are no real reviews to cite, and
  inventing them risks a Google manual action.

### Content written to be extracted

AI answer engines quote short, self-contained, factual statements. Two blocks exist
specifically for that:

- **At a glance** (`#at-a-glance`) — a 12-row definition list of key/value facts. This is
  the single most reliably extracted format.
- **FAQ** (`#faq`) — 10 questions with answers written to stand alone, so they still make
  sense when quoted without surrounding context. Every answer names the subject explicitly
  ("Alex Koziy…" rather than "he…") for the same reason.

The FAQ is **visible on the page and mirrored in `FAQPage` schema from the same source
data** — the build asserts the two match. Schema describing content that isn't on the page
is a spam signal.

### Crawler access

`robots.txt` explicitly allows Googlebot, Bingbot, DuckDuckBot, YandexBot and Baiduspider,
and — deliberately — the AI crawlers: `Google-Extended`, `GPTBot`, `OAI-SearchBot`,
`ChatGPT-User`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`, `PerplexityBot`,
`Applebot-Extended`, `Amazonbot`, `CCBot`, `meta-externalagent` and others, plus the
LinkedIn/Twitter/Facebook/Slack preview bots.

`llms.txt` gives agents ~1,900 words of clean Markdown — positioning, services, full tech
list, all nine case studies, engagement models, credentials and the FAQ — without making
them parse HTML.

### Head metadata

Per page: unique title, meta description (~200 chars), canonical, `hreflang` + `x-default`,
11 Open Graph tags, Twitter card with a real 1200×630 image, `rel="me"` identity links for
entity resolution, `rel="author"`, keywords, and a `text/markdown` alternate pointing at
`llms.txt`. `dateModified` is carried in the schema.

## Profile links

All profile links come from one list — `PROFILES` in `build/seo_data.py` — which feeds the
footer icon row, the contact rows, JSON-LD `sameAs`, `llms.txt`, and the chat agent's
contact answer. Change a URL in one place and re-run the build.

| Platform | URL status |
|---|---|
| LinkedIn | verified, from the existing site |
| Upwork | verified, from the existing site |
| **Freelancer.com** | **not set** — links to the platform homepage |
| **Fiverr** | **not set** — links to the platform homepage |

### To finish the two unset ones

```python
# build/seo_data.py
{"id": "freelancer", ..., "url": "https://www.freelancer.com/u/<username>"},
{"id": "fiverr",     ..., "url": "https://www.fiverr.com/<username>"},
```

then:

```bash
cd build && python3 apply_seo.py && python3 gen_llms.py && python3 gen_kb.py
```

Until a URL is set, that profile:

- links to the platform homepage rather than a fabricated profile path
- carries `data-pending="true"`, which renders a small amber dot on the icon
- is **excluded from JSON-LD `sameAs` and `llms.txt`**

That last point is deliberate. `sameAs` is how search engines and AI systems confirm that
two profiles are the same person; a URL pointing at the wrong account is worse than no URL,
so unverified links are never published as identity claims. The build prints an
`ACTION REQUIRED` warning listing exactly what is still missing.

### Icons

Monochrome SVGs inheriting `currentColor`, tinted with each platform's brand colour on
hover (LinkedIn `#0A66C2`, Upwork `#14A800`, Freelancer `#29B2FE`, Fiverr `#1DBF73`).
LinkedIn and Upwork use their real glyphs; Freelancer.com and Fiverr are simplified letter
marks — swap in official brand SVGs at `ICONS` in `build/apply_seo.py` if you want exact
logos. All profile links carry `rel="noopener me"` (the `me` value supports identity
verification).

## The chat agent

A question-answering widget that runs **entirely in the browser**.

### Why there is no LLM in it

This is a static site with no backend. Any LLM API key shipped to the browser would be
public, and every answer would cost a network round trip. So the agent instead runs
**BM25F retrieval over a knowledge base generated from the site's own content**. The
trade-offs are deliberate:

| | This approach | Browser-side LLM call |
|---|---|---|
| Answer latency | ~1 ms | 1–5 s |
| API key exposure | none | key is public |
| Hallucination risk | structurally impossible | present |
| Cost per question | zero | per token |
| Works offline | yes | no |

It can only return sentences written into the knowledge base. It cannot invent a rate,
a client name or a technology.

### Load cost

The launcher is the only thing on the critical path. The engine and knowledge base load
on first interaction, or during browser idle time — whichever comes first — so clicking
the button feels instant without the initial page paying for it.

| File | Raw | Gzipped | On critical path |
|---|--:|--:|---|
| `js/agent-loader.js` | 2.6 KB | **1.2 KB** | yes |
| `js/agent.js` | ~25 KB | ~8.7 KB | no — lazy |
| `data/kb.json` | ~26 KB | ~8.4 KB | no — lazy |

Index build after load: **~2 ms** for 57 entries.

### Knowledge base

57 entries: 43 answerable (FAQ, services, technical depth, all nine case studies,
contact/hire/availability), 5 small talk, **8 explicit defer-to-owner** entries, and 1
scope reply.

The eight deferrals exist because they are the questions visitors ask most that the site
genuinely does not answer — rates, CV, timezone/location, delivery timeline, NDAs and
invoicing, Quontex team size, unlisted technologies, and references. Each gives a specific,
honest reason rather than a blank "I don't know", then hands off to Alex.

### Three-way response model

1. **Confident match** → the answer, plus contact buttons when the topic warrants them.
2. **Ambiguous** (plausibly on-topic but unclear) → "Did you mean one of these?" with
   clickable options.
3. **Out of scope** → states plainly that it won't guess, says **Alex knows the answer
   exactly**, and offers Email / Book a call.

### Retrieval design notes

Calibrated against a 76-question battery (**75/76**). Several rules exist specifically to
prevent confident wrong answers:

- **Field-weighted BM25F** — title ×3.0, keywords ×2.2, answer body ×1.0.
- **Near-zero length normalisation on the keyword field** (`b=0.15`). Keyword lists are
  deliberately long synonym sets; standard BM25 length penalties made broad entries lose
  to narrow ones.
- **Unknown query words count against coverage.** Without this, *"write me a poem about
  cats"* scored full coverage because "write" appeared in the contact entry.
- **A match must land in a title or keyword field**, not only in answer prose. This is what
  stops *"what is my name?"* matching the clients entry (whose answer contains "the site
  names PwC…").
- **Best *qualifying* candidate wins, not rank 1.** A generic entry can outscore the right
  one on one incidental keyword; rejecting the whole query then would throw away a good
  answer at rank 2.
- Query-side synonym expansion, with asymmetric pairs where symmetry caused harm
  (`nda → contract` but not the reverse, which sent "contract management system" to the
  NDA deferral instead of the Contract Control Suite case study).

### Accessibility

`role="dialog"`, `aria-live="polite"` message log, `aria-expanded` on the launcher,
Escape to close, focus returned to the launcher on close, full keyboard operation, and
`prefers-reduced-motion` support.

## Verification performed

Rendered in headless Chromium at 1440×900 and 390×844:

- Every referenced asset returns 200; no broken images
- Heading outline valid, single `<h1>`, no skipped levels
- All `target="_blank"` links carry `rel="noopener"`; no empty `href`s
- Case study filters: `ai`→2, `erp`→2, `government`→1, `finance`→2, `all`→9
- Form validation: empty submit flags 3 fields and blocks; malformed email flags only that field;
  valid submit shows the thank-you panel
- Mobile: burger replaces nav links, stats collapse to 2 columns, grids to 1, no horizontal overflow
- Reduced-motion and print styles included
- All JSON-LD parses as valid JSON; every `@id` reference resolves within its page graph
- 10 visible FAQ questions match the 10 `FAQPage` questions exactly (asserted in the build)
- `ItemList` positions are contiguous from 1; `numberOfItems` matches actual item count
- `sitemap.xml` parses as well-formed XML
- No duplicate `id` attributes on either page
- Build scripts confirmed idempotent across three consecutive runs

## Known caveats

1. **The AI case study describes capabilities, not a named client project.** It was written from
   the positioning brief, not from crawled evidence — the old site has no AI content. Replace the
   Focus/Applies-to lines with a real engagement when there's one that can be disclosed.
2. **The "Since 2024" and "2021–2024" timeline dates are inferred** from "last two years" and
   "last 5 years with Keikai". Confirm before publishing.
3. **The `stat` figures** (20+ years, 2 years AI, 8+ systems) come from the old site's own copy and
   the case study count. The "8+" excludes the new AI entry.
4. **Google Fonts is the only third-party request.** Self-host Inter and JetBrains Mono if you want
   zero external dependencies.
5. Decorative glyphs (`→`, `◆`, `▸`, `✓`) are drawn with CSS or inline SVG rather than text,
   because the Google Fonts latin subsets omit them and they rendered as tofu boxes.
