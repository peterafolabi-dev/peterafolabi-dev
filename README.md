## Hi, I'm Peter 👋

**Full-stack engineer in Nigeria building software that handles money, bookings and trust: the parts where bugs cost real people.**
Python · Django · TypeScript · React/Next.js · PostgreSQL · Computer Engineering at FUT Minna (CGPA 3.79/5).

I like the unglamorous engineering that makes products safe to depend on: database constraints instead of hopeful checks, payments verified on the server, property-based tests, and books that can't silently go out of balance.

### What I've shipped

| Project | What it is | The engineering I'm proud of |
|---|---|---|
| **[Oja Ledger](https://github.com/peterafolabi-dev/oja-ledger)** · [live](https://oja-ledger.vercel.app) | Offline double-entry bookkeeping for Nigerian small businesses | Integer-kobo money, **SHA-256 hash-chained** append-only journal, **property-based tests** (fast-check) proving the books always balance, VAT and small-company tax checks under the Nigeria Tax Act 2025, installable offline PWA |
| **[Travel & Stays](https://github.com/peterafolabi-dev/travel-stays)** · [live](https://travel-stays.vercel.app) | Booking marketplace for stays and tours across Nigeria (MALhub internship) | Postgres **exclusion constraint** makes double bookings impossible, Paystack payments **verified server-side to the kobo** with unit tests, row-level security on every table, ID verification flow |
| **[RedCart](https://github.com/peterafolabi-dev/Retail-Logistics-Core)** · [live](https://redcart-ten.vercel.app) | E-commerce store with an AI shopping assistant and a Next.js storefront | AI that **can't invent facts** (orders and stock come from the DB, policies from RAG), review fraud scoring, payment amount re-verified against the cart, 83 tests in CI |
| **[StudyFlow](https://github.com/peterafolabi-dev/studyflow)** · [live](https://studyflow-xt1x.onrender.com) | Study platform with a 24/7 AI coach that renders LaTeX | **Magic-byte** upload validation, sanitised AI output, per-user AI rate limits, 108 tests in CI |

Each repo has a **case study or engineering-decisions section** explaining the trade-offs, not just the features.

### How I work
- Every project has **CI on every push** and tests for the parts that matter most.
- I write down *why*, not just *what*: architecture diagrams, decisions and what I'd do next.
- I'm honest in READMEs: test-mode payments are labelled test mode.

### Open to
**Junior full-stack, frontend or backend roles (remote or Nigeria)** and freelance builds for startups and small businesses.

📫 [LinkedIn](https://www.linkedin.com/in/afolabipeter-dev) · afolabiprosper329@gmail.com
