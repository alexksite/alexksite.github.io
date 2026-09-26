/* ==========================================================================
   Alex Koziy — site agent
   --------------------------------------------------------------------------
   A dependency-free question-answering widget that runs entirely in the
   browser. It does NOT call a language model: this is a static site, so any
   API key would be public and every answer would cost a network round trip.
   Instead it runs BM25F retrieval over a knowledge base generated from the
   site's own content, which makes it instant, private, offline-capable, and
   incapable of hallucinating.

   Loaded lazily by agent-loader.js — nothing here runs until the visitor
   shows intent to use it.

   Public API: window.AKAgent.open() / .close() / .toggle() / .ask(text)
   ========================================================================== */
(function () {
  "use strict";

  var KB_URL = "data/kb.json";
  var EMAIL = "mailto:info@alexkoziy.com?subject=Enquiry%20from%20alexkoziy.com";
  var BOOKING = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3V7JCfEXgB9RWm0RUlyv6uiQxpczmkj5gUc7U9DvIT2xsqZN4mNHbBolgMISTyLfxACEfJIf9D";
  var TELEGRAM = "https://t.me/Cozy_Al";
  var WHATSAPP = "https://wa.me/380975436652";
  var VIBER = "viber://chat?number=%2B380975436652";

  /* ---------------------------------------------------------------- tuning */
  // Retrieval thresholds, calibrated against a fixed question battery.
  // ACCEPT: answer outright. MAYBE: offer disambiguation. Below: defer to Alex.
  var ACCEPT_SCORE = 2.6;
  var ACCEPT_COVER = 0.34;
  var MAYBE_SCORE = 2.2;
  var MAYBE_COVER = 0.5;
  var K1 = 1.4;
  var FIELD_W = { t: 3.0, k: 2.2, a: 1.0 };
  // Per-field length normalisation. Keyword fields are deliberately long,
  // unbounded lists of synonyms, so penalising their length (as standard BM25
  // would) makes broad-coverage entries lose to narrow ones. Near-zero b for
  // "k" treats it as set membership instead.
  var FIELD_B = { t: 0.7, k: 0.15, a: 0.7 };

  /* ------------------------------------------------------------- language */
  var STOP = new Set(("a an the is are was were am be been being do does did done " +
    "can could would should will shall may might must of in on at to for with about " +
    "from by as into over under and or but if that this these those there here " +
    "my mine our ours us their theirs " +
    "what which who whom whose how when where why whether have has had having " +
    // "much" is intentionally NOT stopped: it carries pricing intent via SYN.
    "get got getting any some all both each few other such own same too very many " +
    "so than then also just only really quite rather please tell me know like " +
    "want need give show say said talk speak thing things stuff lot bit way ways " +
    "i we they it its it's im i'm ive i've id we're you're isn't don't doesn't " +
    "not no yes ok okay well going go went make made made use used using " +
    "s t re ve ll d m o y").split(" "));

  // Pronouns and name variants collapse to one token. Deliberately NOT stopped:
  // BM25's IDF de-weights it naturally because it appears in most documents.
  var SUBJECT = new Set(["you", "your", "yours", "yourself", "he", "him", "his", "himself",
    "alex", "alexander", "koziy", "alexkoziy", "owner", "author", "guy", "dev", "developer"]);

  // Query-side expansion: abbreviations and near-synonyms that the knowledge
  // base spells out in full.
  var SYN = {
    aws: ["amazon", "cloud"], amazon: ["aws", "cloud"],
    llm: ["language", "model", "ai"], llms: ["language", "model", "ai"],
    gpt: ["llm", "ai", "model"], chatgpt: ["llm", "ai", "model"],
    openai: ["llm", "ai", "model"], claude: ["llm", "ai", "model"],
    gemini: ["llm", "ai", "model"], bedrock: ["llm", "ai", "aws"],
    genai: ["ai", "generative"], rag: ["retrieval", "augmented", "generation", "vector"],
    vector: ["embedding", "search"], embedding: ["vector"], embeddings: ["vector"],
    ml: ["machine", "learning"], nlp: ["language", "ai"],
    agent: ["agentic", "workflow"], agents: ["agentic", "workflow"],
    py: ["python"], python3: ["python"],
    // "api" is deliberately not expanded: it is common across many entries, and
    // adding "rest"/"endpoint" let generic API questions drown out the specific
    // technology being asked about (e.g. "GraphQL APIs").
    db: ["database"], dbs: ["database"], sql: ["database"],
    postgres: ["postgresql", "database"], mysql: ["database"], oracle: ["database"],
    mssql: ["database", "server"], dynamodb: ["database", "aws"],
    zk: ["zkoss", "framework"], zkoss: ["zk"], keikai: ["spreadsheet", "reporting", "zk"],
    spring: ["boot", "java"], springboot: ["spring", "boot", "java"],
    jvm: ["java"], j2ee: ["java"], jakarta: ["java"],
    price: ["cost", "rate"], pricing: ["cost", "rate", "price"],
    cost: ["price"], rates: ["rate", "price", "cost"],
    rate: ["price", "cost"], fee: ["price", "cost", "rate"],
    fees: ["price", "cost", "rate"], charge: ["price", "cost", "rate"],
    quote: ["price", "cost", "estimate"], budget: ["price", "cost"],
    expensive: ["price", "cost"], cheap: ["price", "cost"], afford: ["price", "cost"],
    salary: ["price", "rate", "cost"], much: ["price", "cost"],
    resume: ["cv"], cv: ["resume"],
    frontend: ["ui", "front"], ui: ["frontend"], ux: ["frontend", "ui"],
    devops: ["infrastructure", "cloud"], infra: ["infrastructure", "cloud"],
    k8s: ["kubernetes"], docker: ["container"], container: ["docker"],
    serverless: ["lambda", "aws"], lambda: ["serverless", "aws"],
    erp: ["enterprise"], crm: ["enterprise"],
    hire: ["engage", "hiring"], hiring: ["hire"], recruit: ["hire"],
    freelance: ["contractor", "independent"], contractor: ["freelance", "independent"],
    remote: ["remotely"], remotely: ["remote"],
    experience: ["years"], years: ["experience"],
    legacy: ["modernization"], refactor: ["modernization", "legacy"],
    slow: ["performance", "optimization"], performance: ["optimization", "speed"],
    testimonial: ["reference", "review"], testimonials: ["reference", "review"],
    portfolio: ["case", "study", "project"], projects: ["project", "case", "study"],
    industries: ["industry", "sector", "domain"], industry: ["sector", "domain"],
    timezone: ["hours", "time"], location: ["based", "where"], based: ["location", "where"],
    // One-way only: "nda" implies contract talk, but "contract" does not imply
    // NDAs — expanding it made "contract management system" (a case study)
    // land on the NDA/invoicing deferral.
    nda: ["contract", "legal"],
    invoice: ["payment", "billing"], payment: ["invoice", "billing"]
  };

  /* Light, deliberately consistent stemmer. Correctness matters less than
     applying the identical transform to queries and documents. */
  var PROTECT = new Set(["aws", "ai", "api", "css", "js", "sql", "ios", "less", "class",
    "was", "has", "his", "this", "its", "yes", "gis", "cms", "ops", "rss", "ss",
    "hosting"]);

  function stem(w) {
    if (w.length <= 3 || PROTECT.has(w)) return w;
    if (w.length > 4 && /ies$/.test(w)) w = w.slice(0, -3) + "y";
    else if (/[^s]s$/.test(w)) w = w.slice(0, -1);
    if (w.length > 5 && /ing$/.test(w)) w = w.slice(0, -3);
    else if (w.length > 4 && /ed$/.test(w)) w = w.slice(0, -2);
    return w;
  }

  function tokenize(text, expand) {
    var raw = String(text).toLowerCase()
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9+#]+/g, " ")
      .trim();
    if (!raw) return [];

    var out = [];
    raw.split(/\s+/).forEach(function (w) {
      if (SUBJECT.has(w)) { out.push("alex"); return; }
      if (STOP.has(w) || w.length < 2) return;
      out.push(stem(w));
      if (expand && SYN[w]) {
        SYN[w].forEach(function (s) { out.push(stem(s)); });
      }
    });
    return out;
  }

  /* --------------------------------------------------------------- index */
  var index = null;

  function buildIndex(entries) {
    var docs = entries.map(function (e) {
      var f = {
        t: tokenize(e.t, false),
        k: tokenize(e.k || "", false),
        a: tokenize(e.a, false)
      };
      var tf = { t: {}, k: {}, a: {} };
      var seen = {};
      Object.keys(f).forEach(function (name) {
        f[name].forEach(function (tok) {
          tf[name][tok] = (tf[name][tok] || 0) + 1;
          seen[tok] = 1;
        });
      });
      return {
        e: e,
        tf: tf,
        len: { t: f.t.length, k: f.k.length, a: f.a.length },
        terms: seen,
        hay: (e.t + " " + (e.k || "") + " " + e.a).toLowerCase()
      };
    });

    var N = docs.length;
    var df = {};
    docs.forEach(function (d) {
      Object.keys(d.terms).forEach(function (tok) { df[tok] = (df[tok] || 0) + 1; });
    });

    var avg = { t: 0, k: 0, a: 0 };
    docs.forEach(function (d) {
      avg.t += d.len.t; avg.k += d.len.k; avg.a += d.len.a;
    });
    ["t", "k", "a"].forEach(function (f) { avg[f] = (avg[f] / N) || 1; });

    var idf = {};
    Object.keys(df).forEach(function (tok) {
      // BM25 IDF, floored so very common terms contribute ~0 rather than negative
      idf[tok] = Math.max(0.05, Math.log(1 + (N - df[tok] + 0.5) / (df[tok] + 0.5)));
    });

    return { docs: docs, idf: idf, avg: avg, N: N };
  }

  /* --------------------------------------------------------------- search */
  function search(query) {
    var qt = tokenize(query, true);
    if (!qt.length) return { status: "empty", hits: [] };

    // de-duplicate while keeping a set for coverage measurement
    var uniq = [];
    var qset = {};
    qt.forEach(function (t) { if (!qset[t]) { qset[t] = 1; uniq.push(t); } });

    var known = uniq.filter(function (t) { return index.idf[t] !== undefined; });
    var informative = known.filter(function (t) { return index.idf[t] > 0.6; });

    // Words the index has never seen are counted in the coverage denominator.
    // They represent intent the knowledge base demonstrably does not cover, so
    // ignoring them would let a single incidental keyword hit ("write me a poem"
    // matching "write" in the contact entry) score as full coverage.
    var unknown = uniq.filter(function (t) { return index.idf[t] === undefined; });
    var informativeTotal = informative.length + unknown.length;

    var qLower = " " + String(query).toLowerCase().replace(/[^a-z0-9+# ]+/g, " ").replace(/\s+/g, " ").trim() + " ";

    var scored = index.docs.map(function (d) {
      var score = 0, matched = 0, matchedInf = 0, matchedTopical = 0;

      known.forEach(function (tok) {
        var tfw = 0, inTK = false;
        ["t", "k", "a"].forEach(function (f) {
          var tf = d.tf[f][tok];
          if (!tf) return;
          if (f !== "a") inTK = true;
          var b = FIELD_B[f];
          var norm = 1 - b + b * (d.len[f] / index.avg[f]);
          tfw += FIELD_W[f] * (tf / norm);
        });
        if (tfw > 0) {
          matched++;
          if (index.idf[tok] > 0.6) {
            matchedInf++;
            // Title and keyword fields declare what an entry is *about*; the
            // answer body is incidental prose. A term found only in prose is
            // not evidence of topical relevance.
            if (inTK) matchedTopical++;
          }
          score += index.idf[tok] * (tfw * (K1 + 1)) / (tfw + K1);
        }
      });

      // Phrase bonus: reward contiguous multi-word overlap, which single-term
      // BM25 cannot see. Cheap approximation using word shingles.
      var words = qLower.trim().split(" ").filter(function (w) { return w.length > 2; });
      for (var n = Math.min(4, words.length); n >= 2; n--) {
        for (var i = 0; i + n <= words.length; i++) {
          var sh = words.slice(i, i + n).join(" ");
          if (d.hay.indexOf(sh) !== -1) { score += 0.55 * n; n = 1; break; }
        }
      }

      var cover = informativeTotal
        ? matchedInf / informativeTotal
        : (known.length ? matched / known.length : 0);

      return { doc: d, score: score, cover: cover, topical: matchedTopical };
    });

    scored.sort(function (a, b) { return b.score - a.score; });
    var top = scored[0];
    if (!top) return { status: "none", hits: [] };

    function qualifies(s) {
      return s.score >= ACCEPT_SCORE && s.cover >= ACCEPT_COVER && s.topical >= 1;
    }

    // Take the highest-scoring candidate that actually qualifies, rather than
    // testing rank 1 alone. A generic entry can outscore the right one on a
    // single incidental keyword; rejecting the whole query in that case would
    // discard a perfectly good answer sitting at rank 2.
    for (var i = 0; i < scored.length; i++) {
      if (qualifies(scored[i])) {
        return {
          status: "hit",
          hit: scored[i],
          hits: [scored[i]].concat(scored.filter(function (s, j) { return j !== i; }).slice(0, 3))
        };
      }
    }
    // Offer a disambiguation only when the query is plausibly on-topic. A high
    // score with low coverage means one keyword happened to collide, so that
    // must fall through to the deferral instead.
    if (top.score >= MAYBE_SCORE && top.cover >= MAYBE_COVER) {
      return {
        status: "maybe",
        hits: scored.filter(function (s) {
          return s.score >= MAYBE_SCORE && s.cover >= MAYBE_COVER;
        }).slice(0, 3)
      };
    }
    return { status: "none", hits: scored.slice(0, 3) };
  }

  /* ------------------------------------------------------------------ UI */
  var el = {};
  var state = { open: false, ready: false, busy: false, lastFocus: null };

  var STYLE = [
    '.akw{position:fixed;right:22px;bottom:84px;z-index:120;width:min(392px,calc(100vw - 32px));',
    'height:min(600px,calc(100vh - 104px));max-height:calc(100vh - 104px);',
    'height:min(600px,calc(100dvh - 104px));max-height:calc(100dvh - 104px);',
    'display:flex;flex-direction:column;',
    'background:#0f1117;border:1px solid rgba(255,255,255,.14);border-radius:20px;',
    'box-shadow:0 40px 80px -24px rgba(0,0,0,.85);overflow:hidden;',
    'font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
    'opacity:0;visibility:hidden;transform:translateY(12px) scale(.98);',
    'transition:opacity .22s cubic-bezier(.22,1,.36,1),transform .22s cubic-bezier(.22,1,.36,1),visibility .22s}',
    '.akw.on{opacity:1;visibility:visible;transform:none}',
    '.akw__hd{display:flex;align-items:center;gap:11px;padding:15px 16px;background:#14171f;',
    'border-bottom:1px solid rgba(255,255,255,.08);flex:none}',
    '.akw__av{width:34px;height:34px;border-radius:10px;flex:none;display:grid;place-items:center;',
    'background:linear-gradient(135deg,#22d3ee,#8b5cf6);color:#05060a;font-weight:700;font-size:.82rem}',
    '.akw__ti{flex:1;min-width:0}',
    '.akw__ti b{display:block;font-size:.93rem;font-weight:600;color:#e9ebf1;letter-spacing:-.01em}',
    '.akw__ti span{display:block;font-size:.735rem;color:#8b93a3;margin-top:1px}',
    '.akw__x{width:30px;height:30px;flex:none;border-radius:8px;border:1px solid rgba(255,255,255,.12);',
    'background:rgba(255,255,255,.04);color:#b3bac7;cursor:pointer;font-size:1rem;line-height:1;',
    'display:grid;place-items:center;transition:background .2s,color .2s}',
    '.akw__x:hover{background:rgba(255,255,255,.1);color:#fff}',
    '.akw__bd{flex:1 1 auto;min-height:90px;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;',
    'padding:16px;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin}',
    '.akw__bd::-webkit-scrollbar{width:7px}',
    '.akw__bd::-webkit-scrollbar-thumb{background:#1a1e28;border-radius:4px}',
    '.akm{max-width:88%;font-size:.885rem;line-height:1.6;padding:11px 14px;border-radius:14px;',
    'white-space:pre-wrap;word-wrap:break-word;overflow-wrap:anywhere;word-break:break-word;',
    'animation:akin .26s cubic-bezier(.22,1,.36,1)}',
    '.akm a{overflow-wrap:anywhere;word-break:break-all}',
    '@keyframes akin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
    '.akm--b{align-self:flex-start;background:#181c26;color:#dfe3ec;border:1px solid rgba(255,255,255,.07);',
    'border-bottom-left-radius:5px}',
    '.akm--u{align-self:flex-end;background:linear-gradient(135deg,#22d3ee,#8b5cf6);color:#06070b;',
    'font-weight:500;border-bottom-right-radius:5px}',
    '.akm b{color:#fff;font-weight:600}',
    '.akm a{color:#22d3ee;text-decoration:underline;text-underline-offset:2px}',
    '.akcta{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px}',
    '.akcta a{display:inline-flex;align-items:center;gap:6px;padding:8px 13px;border-radius:999px;',
    'font-size:.8rem;font-weight:600;text-decoration:none;transition:transform .2s,box-shadow .2s}',
    '.akcta a:hover{transform:translateY(-1px);filter:brightness(1.08)}',
    '.akcta a svg{width:15px;height:15px;flex:none}',
    '.akcta a.tg{background:#229ED9;color:#fff}',
    '.akcta a.wa{background:#25D366;color:#04310f}',
    '.akcta a.vb{background:#7360F2;color:#fff}',
    '.akcta a.em{background:rgba(255,255,255,.08);color:#e9ebf1;border:1px solid rgba(255,255,255,.18)}',
    '.akchips{display:flex;flex-wrap:nowrap;gap:6px;padding:8px 14px;flex:0 0 auto;',
    'overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;',
    'border-top:1px solid rgba(255,255,255,.06);-webkit-overflow-scrolling:touch}',
    '.akchips::-webkit-scrollbar{height:5px}',
    '.akchips::-webkit-scrollbar-thumb{background:#1a1e28;border-radius:4px}',
    '.akchips button{padding:6px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.13);',
    'background:rgba(255,255,255,.035);color:#b3bac7;font-size:.75rem;cursor:pointer;white-space:nowrap;',
    'flex:0 0 auto;font-family:inherit;transition:all .2s}',
    '.akchips button:hover{background:rgba(255,255,255,.09);color:#e9ebf1;border-color:rgba(255,255,255,.28)}',
    '.akdots{align-self:flex-start;display:flex;gap:4px;padding:13px 15px;background:#181c26;',
    'border-radius:14px;border-bottom-left-radius:5px;border:1px solid rgba(255,255,255,.07)}',
    '.akdots i{width:6px;height:6px;border-radius:50%;background:#6a7382;animation:akb 1.3s infinite}',
    '.akdots i:nth-child(2){animation-delay:.18s}.akdots i:nth-child(3){animation-delay:.36s}',
    '@keyframes akb{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}',
    '.akw__ft{flex:none;border-top:1px solid rgba(255,255,255,.08);background:#14171f;padding:12px 14px}',
    '.akf{display:flex;gap:9px;align-items:flex-end}',
    '.akf textarea{flex:1;resize:none;max-height:96px;min-height:44px;padding:11px 13px;border-radius:11px;',
    'border:1px solid rgba(255,255,255,.12);background:#0b0d13;color:#e9ebf1;font-size:.875rem;',
    'font-family:inherit;line-height:1.45;transition:border-color .2s,box-shadow .2s}',
    '.akf textarea::placeholder{color:#5d6573}',
    '.akf textarea:focus{outline:none;border-color:rgba(34,211,238,.55);box-shadow:0 0 0 3px rgba(34,211,238,.1)}',
    '.akf button{width:42px;height:42px;flex:none;border-radius:11px;border:0;cursor:pointer;',
    'background:linear-gradient(135deg,#22d3ee,#8b5cf6);color:#05060a;display:grid;place-items:center;',
    'transition:transform .2s,opacity .2s}',
    '.akf button:hover:not(:disabled){transform:translateY(-1px)}',
    '.akf button:disabled{opacity:.4;cursor:not-allowed}',
    '.akf button svg{width:17px;height:17px}',
    '.aknote{margin-top:9px;font-size:.685rem;color:#6a7382;text-align:center;line-height:1.4}',
    /* Full-panel list of all common questions (shown first, and via the tab) */
    '.akq{position:absolute;left:0;right:0;top:65px;bottom:64px;z-index:3;background:#0f1117;',
    'display:flex;flex-direction:column;overflow:hidden}',
    '.akq__hd{flex:none;padding:15px 16px 10px;font-size:.82rem;color:#8b93a3;',
    'border-bottom:1px solid rgba(255,255,255,.06)}',
    '.akq__hd b{display:block;color:#e9ebf1;font-size:.98rem;font-weight:640;margin-bottom:2px}',
    '.akq__list{flex:1 1 auto;min-height:0;overflow-y:auto;padding:8px;display:flex;',
    'flex-direction:column;gap:6px;scrollbar-width:thin}',
    '.akq__list::-webkit-scrollbar{width:7px}',
    '.akq__list::-webkit-scrollbar-thumb{background:#1a1e28;border-radius:4px}',
    '.akq__item{text-align:left;padding:11px 13px;border-radius:11px;border:1px solid rgba(255,255,255,.09);',
    'background:rgba(255,255,255,.03);color:#dfe3ec;font-size:.86rem;line-height:1.4;cursor:pointer;',
    'font-family:inherit;transition:background .18s,border-color .18s,transform .18s}',
    '.akq__item:hover{background:rgba(255,255,255,.08);border-color:rgba(34,211,238,.4);transform:translateX(2px)}',
    '.akq__item span{color:#22d3ee;margin-right:8px;font-weight:700}',
    /* Subtle toggle tab at the bottom that re-opens the questions list */
    '.akqtab{flex:none;display:flex;align-items:center;justify-content:center;gap:7px;',
    'padding:9px 14px;background:#14171f;border-top:1px solid rgba(255,255,255,.08);',
    'color:#8b93a3;font-size:.78rem;font-family:inherit;cursor:pointer;width:100%;border:0;',
    'border-bottom:1px solid rgba(255,255,255,.06);transition:color .2s,background .2s}',
    '.akqtab:hover{color:#e9ebf1;background:#171b24}',
    '.akqtab svg{width:14px;height:14px}',
    '@media (max-width:620px){.akw{right:12px;left:12px;bottom:78px;width:auto;',
    'height:calc(100vh - 96px);max-height:calc(100vh - 96px);',
    'height:calc(100dvh - 96px);max-height:calc(100dvh - 96px)}}',
    '@media (prefers-reduced-motion:reduce){.akw,.akm,.akdots i{animation:none!important;transition:none!important}}'
  ].join("");

  var SUGGESTIONS = [
    "What does Alex build?",
    "Which channels do you support?",
    "Show me a live bot",
    "How much does a bot cost to run?",
    "How do we start?"
  ];

  // The full list of common questions, shown as a full-panel menu on first
  // open and whenever the visitor taps the "Browse common questions" tab.
  var QUESTIONS = [
    "How much does a chatbot cost?",
    "How much does hosting cost per month?",
    "Will you support us after installation?",
    "Do I own the bot and the source code?",
    "Which channels do you support?",
    "Can the bot use AI like ChatGPT or Claude?",
    "Can you build a WhatsApp bot?",
    "Can you build an Instagram bot?",
    "Can the bot connect to my CRM or database?",
    "How long does it take to build?",
    "Can I see a live bot?",
    "Why not just use ManyChat or a no-code builder?",
    "Is there a free hosting offer?",
    "Can the bot speak other languages?",
    "Can a human take over from the bot?",
    "How do we start?",
    "How reliable is the bot?",
    "Can you build a bot for trading or finance?",
    "How do I contact you?",
    "What happens if my traffic grows?"
  ];

  function h(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Turn bare http(s) URLs in already-escaped text into clickable links that
  // open in a new tab. Trailing sentence punctuation is kept out of the link.
  function linkify(escaped) {
    return String(escaped).replace(/https?:\/\/[^\s<)]+/g, function (url) {
      var trail = "";
      var m = url.match(/[.,);:]+$/);
      if (m) { trail = url.slice(url.length - m[0].length); url = url.slice(0, url.length - m[0].length); }
      return '<a href="' + url + '" target="_blank" rel="noopener">' + url + '</a>' + trail;
    });
  }

  function ctaHtml() {
    var tgIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3l-3.3 15.6c-.2 1-.9 1.3-1.8.8l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 9-8.1c.4-.3-.1-.5-.6-.2L6 12.9l-4.7-1.5c-1-.3-1-1 .2-1.5L20.6 2.7c.9-.3 1.6.2 1.3 1.6z"/></svg>';
    var waIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.7 15l-1.3 4.8 5-1.3A10 10 0 1012 2zm5.5 14.2c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .3-3.3-.7-2.8-1.2-4.5-4-4.6-4.2-.2-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.4 2.6 1.6.2.1.4.1.6-.1l.7-.9c.2-.3.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.9-.1 1.5z"/></svg>';
    var vbIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C7 2 3 5.6 3 10c0 2.4 1.2 4.6 3.1 6v3.5l3.2-1.8c.9.2 1.8.3 2.7.3 5 0 9-3.6 9-8s-4-8-9-8zm0 14.4c-.8 0-1.6-.1-2.4-.3l-.5-.1-2 1.1v-2.1l-.4-.3C8.9 13.6 8 11.9 8 10c0-3.1 1.8-5.6 4-5.6s4 2.5 4 5.6-1.8 5.6-4 5.6z"/></svg>';
    var emIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6" stroke-linecap="round"/></svg>';
    return '<div class="akcta">' +
      '<a class="tg" href="' + TELEGRAM + '" target="_blank" rel="noopener">' + tgIcon + 'Telegram</a>' +
      '<a class="wa" href="' + WHATSAPP + '" target="_blank" rel="noopener">' + waIcon + 'WhatsApp</a>' +
      '<a class="vb" href="' + VIBER + '">' + vbIcon + 'Viber</a>' +
      '<a class="em" href="' + EMAIL + '">' + emIcon + 'Email</a>' +
      "</div>";
  }

  function build() {
    document.head.appendChild(h("style", null, STYLE));

    el.panel = h("div", "akw");
    el.panel.id = "ak-agent";
    el.panel.setAttribute("role", "dialog");
    el.panel.setAttribute("aria-modal", "false");
    el.panel.setAttribute("aria-label", "Ask about Alex Koziy");

    var hd = h("div", "akw__hd");
    hd.appendChild(h("div", "akw__av", "AK"));
    hd.appendChild(h("div", "akw__ti",
      "<b>Ask about the chatbots</b><span>Answers from this site &middot; no data leaves your browser</span>"));
    el.close = h("button", "akw__x", "&times;");
    el.close.setAttribute("aria-label", "Close chat");
    hd.appendChild(el.close);
    el.panel.appendChild(hd);

    el.body = h("div", "akw__bd");
    el.body.setAttribute("role", "log");
    el.body.setAttribute("aria-live", "polite");
    el.body.setAttribute("aria-atomic", "false");
    el.panel.appendChild(el.body);

    // Subtle toggle tab that re-opens the full questions list.
    el.qtab = h("button", "akqtab",
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M8 10h8M8 14h5M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' +
      '<span>Browse common questions</span>');
    el.qtab.type = "button";
    el.qtab.addEventListener("click", showQuestions);
    el.panel.appendChild(el.qtab);

    // Full-panel questions menu (hidden until shown).
    el.qpanel = h("div", "akq");
    el.qpanel.style.display = "none";
    el.qpanel.appendChild(h("div", "akq__hd",
      "<b>What would you like to know?</b>Pick a question, or type your own below."));
    el.qlist = h("div", "akq__list");
    el.qpanel.appendChild(el.qlist);
    el.panel.appendChild(el.qpanel);

    var ft = h("div", "akw__ft");
    var form = h("form", "akf");
    el.input = h("textarea");
    el.input.rows = 1;
    // Kept short so it never wraps and forces a scrollbar on narrow screens.
    el.input.placeholder = "Ask about his work…";
    el.input.setAttribute("aria-label", "Your question");
    el.send = h("button", null,
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 12h15M13 6l6 6-6 6"/></svg>');
    el.send.type = "submit";
    el.send.setAttribute("aria-label", "Send question");
    form.appendChild(el.input);
    form.appendChild(el.send);
    ft.appendChild(form);
    ft.appendChild(h("div", "aknote",
      "Runs offline in your browser. For anything not published here, Alex is the source."));
    el.panel.appendChild(ft);

    document.body.appendChild(el.panel);

    /* --- events --- */
    el.close.addEventListener("click", close);

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      submit(el.input.value);
    });

    el.input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        submit(el.input.value);
      }
    });

    // auto-grow the textarea
    el.input.addEventListener("input", function () {
      el.input.style.height = "auto";
      el.input.style.height = Math.min(el.input.scrollHeight, 96) + "px";
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && state.open) {
        if (el.qpanel && el.qpanel.style.display !== "none") { hideQuestions(); }
        else { close(); }
      }
    });

    buildQuestionList();
  }

  // Fill the full-panel menu with every common question, once.
  function buildQuestionList() {
    if (!el.qlist || el.qlist.childElementCount) return;
    QUESTIONS.forEach(function (q) {
      var b = h("button", "akq__item", "<span>›</span>" + esc(q));
      b.type = "button";
      b.addEventListener("click", function () { submit(q); });
      el.qlist.appendChild(b);
    });
  }

  function showQuestions() {
    if (!el.qpanel) return;
    el.qpanel.style.display = "flex";
    el.qlist.scrollTop = 0;
    if (el.qtab) el.qtab.style.display = "none";
  }

  function hideQuestions() {
    if (el.qpanel) el.qpanel.style.display = "none";
    if (el.qtab) el.qtab.style.display = "flex";
  }

  // Kept for compatibility with older calls; chips are no longer rendered.
  function renderChips() {}

  function scroll() {
    el.body.scrollTop = el.body.scrollHeight;
  }

  function bot(html) {
    var m = h("div", "akm akm--b", html);
    el.body.appendChild(m);
    scroll();
    return m;
  }

  function user(text) {
    el.body.appendChild(h("div", "akm akm--u", esc(text)));
    scroll();
  }

  function dots() {
    var d = h("div", "akdots", "<i></i><i></i><i></i>");
    el.body.appendChild(d);
    scroll();
    return d;
  }

  /* --------------------------------------------------------------- answers */
  function answerFor(result) {
    if (result.status === "hit") {
      var e = result.hit.doc.e;
      var html = linkify(esc(e.a));
      if (e.defer) {
        /* deferred answers: show the answer text only, no contact prompt */
      } else if (e.soft) {
        html += "\n\nHappy to help with anything about his work though — the AI and " +
          "Python/AWS practice, his Java and ZK background, the case studies, or how to hire him.";
      } else if (e.cta === "contact") {
        html += ctaHtml();
      }
      return { html: html, chips: related(result) };
    }

    if (result.status === "maybe") {
      var opts = result.hits.map(function (s) { return s.doc.e.t; });
      return {
        html: "I'm not certain I understood that. Did you mean one of these?",
        chips: opts.length ? opts : SUGGESTIONS
      };
    }

    // Nothing close enough — say so plainly, without pushing contact prompts.
    return {
      html: "That's outside what this website covers, so I don't have a reliable answer for it. " +
        "Try one of the questions below, or rephrase what you're looking for.",
      chips: SUGGESTIONS
    };
  }

  function related(result) {
    var out = [];
    (result.hits || []).slice(1).forEach(function (s) {
      if (s.score >= MAYBE_SCORE) out.push(s.doc.e.t);
    });
    return out.length ? out : SUGGESTIONS.slice(0, 3);
  }

  function submit(text) {
    text = String(text || "").trim();
    if (!text || state.busy) return;

    hideQuestions();
    user(text);
    el.input.value = "";
    el.input.style.height = "auto";
    state.busy = true;
    el.send.disabled = true;

    var d = dots();

    function finish() {
      d.remove();
      var res = search(text);
      var a = answerFor(res);
      bot(a.html);
      renderChips(a.chips.slice(0, 4));
      state.busy = false;
      el.send.disabled = false;
      scroll();
    }

    function fail() {
      d.remove();
      bot("I'm having trouble loading my answers right now. Please refresh the page and try " +
        "again — or email <a href=\"" + EMAIL + "\">info@alexkoziy.com</a>.");
      renderChips(SUGGESTIONS.slice(0, 4));
      state.busy = false;
      el.send.disabled = false;
      scroll();
    }

    // The knowledge base loads asynchronously. If it isn't ready yet (or a
    // previous load failed), wait for it / retry before answering — never
    // answer "not found" just because the data hasn't arrived.
    if (index) {
      setTimeout(finish, 280);
    } else {
      loadKB(true).then(function () {
        setTimeout(finish, 120);
      }).catch(fail);
    }
  }

  /* ------------------------------------------------------------- lifecycle */
  function greet() {
    if (el.body.childElementCount) return;
    bot("Hi — I answer questions about <b>Alex Koziy's chatbots</b> using this site's content.\n\n" +
      "Ask about what he builds, which channels he supports (WhatsApp, Instagram, Telegram, web), " +
      "the live bots you can try, cost and hosting, or how to start. If it's not published here, " +
      "I'll say so and point you to him.");
  }

  function open() {
    if (!state.open) {
      state.lastFocus = document.activeElement;
      state.open = true;
      el.panel.classList.add("on");
      greet();
      // On the very first open, present the full list of common questions.
      if (!state.questionsShownOnce) {
        state.questionsShownOnce = true;
        showQuestions();
      }
      setTimeout(function () { el.input.focus(); }, 240);
      var btn = document.getElementById("ak-launch");
      if (btn) btn.setAttribute("aria-expanded", "true");
    }
  }

  function close() {
    if (!state.open) return;
    state.open = false;
    el.panel.classList.remove("on");
    var btn = document.getElementById("ak-launch");
    if (btn) { btn.setAttribute("aria-expanded", "false"); btn.focus(); }
    else if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
  }

  function toggle() { state.open ? close() : open(); }

  /* ------------------------------------------------------------------ boot */
  build();

  window.AKAgent = {
    open: open,
    close: close,
    toggle: toggle,
    ask: function (q) { open(); submit(q); },
    // exposed for the verification harness
    _search: function (q) { return search(q); },
    _ready: function () { return state.ready; }
  };

  // Load (or reload) the knowledge base. Returns a promise so callers can
  // wait for it. A cache-busting query is used on retries so a stale or broken
  // cached copy can never permanently break the widget.
  var kbPromise = null;
  function loadKB(bust) {
    if (index) return Promise.resolve(true);
    if (kbPromise && !bust) return kbPromise;
    var url = KB_URL + (bust ? ("?v=" + Date.now()) : "?v=20260926i");
    kbPromise = fetch(url, { cache: bust ? "reload" : "default" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        index = buildIndex(data.kb);
        state.ready = true;
        document.dispatchEvent(new CustomEvent("ak:ready", { detail: { entries: data.kb.length } }));
        return true;
      })
      .catch(function (err) {
        state.ready = false;
        kbPromise = null; // allow a later retry
        document.dispatchEvent(new CustomEvent("ak:error"));
        throw err;
      });
    return kbPromise;
  }

  loadKB(false);

  if (window.__akAutoOpen) open();
})();
