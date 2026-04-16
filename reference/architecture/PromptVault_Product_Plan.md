# PromptVault — Product Plan

> A personal prompt library where you store, tag, rate, compose, fork, and share prompts.
> Think "GitHub for prompts" — build a private collection of reusable prompt pieces, assemble them into full prompts, then optionally share or fork others' public work.

---

## 1. Vision & positioning

**What it is:** A prompt management platform for everyday AI users — writers, marketers, developers, educators — who interact with ChatGPT, Claude, Midjourney, etc. daily and need an organized, composable, shareable system.

**What it is not:** A developer CI/CD tool (Langfuse, PromptLayer) or a pure marketplace (PromptBase). It bridges both worlds — personal utility first, community and commerce second.

**Core differentiator:** Prompt pieces (reusable fragments) + drag-and-drop composition + forking + public/private toggle. No competitor combines all four.

**Target users:**

- AI power users who use 5+ prompts daily
- Content creators (writers, marketers, social media managers)
- Developers building with LLMs
- Educators and students crafting learning prompts
- Teams that share prompt libraries internally

**Revenue model:** Freemium + optional marketplace

- Free: unlimited private prompts and pieces, basic search, copy-to-clipboard
- Pro ($8-12/month): AI suggestions, analytics, version history, unlimited collections, browser extension
- Marketplace: 80/20 revenue split (creator/platform) on premium public prompts

---

## 2. Competitive analysis

### 2.1 Landscape overview

The existing market splits into two camps:

1. **Developer platforms** — Langfuse, PromptLayer, Maxim AI, Arize AX, LangSmith. These focus on versioning, A/B testing, observability, and production deployment. They are API-first and target engineering teams.

2. **Marketplaces** — PromptBase (270k+ prompts, 450k+ users), FlowGPT (10M+ users, free-first), PromptHero (community + portfolios). These focus on buying/selling/sharing prompts but offer little in personal organization or composition.

Neither camp serves the individual who wants a personal, organized, composable prompt library with community features.

### 2.2 Feature comparison

| Feature | PromptVault | PromptBase | PromptHero | PromptHub | FlowGPT |
|---|---|---|---|---|---|
| Personal library | ✅ | ❌ | ~ | ✅ | ~ |
| Tags + categories | ✅ | ~ | ✅ | ✅ | ~ |
| Prompt pieces (fragments) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Compose from pieces | ✅ | ❌ | ❌ | ❌ | ❌ |
| Forking | ✅ | ❌ | ❌ | ✅ | ~ |
| Public / private toggle | ✅ | ~ | ✅ | ✅ | ✅ |
| Rating + reviews | ✅ | ✅ | ✅ | ~ | ~ |
| Version history | ✅ | ❌ | ❌ | ✅ | ❌ |
| Marketplace / sell | ✅ (V3) | ✅ | ~ | ❌ | ~ |
| Browser extension | ✅ (V2) | ❌ | ❌ | ❌ | ❌ |
| AI suggestions | ✅ (V3) | ❌ | ❌ | ❌ | ❌ |
| Free tier | ✅ generous | ~ | ✅ | ✅ | ✅ |

### 2.3 Lessons from competitors

**PromptBase** — Proved prompt commerce works (80/20 revenue split, $1.99-$9.99 price range). But it's a marketplace only with no personal library, no composition, and a dated UI. Creators have little identity on the platform.

**PromptHub** — Has Git-like versioning, branching, merge approvals, and community forking. Targets developer teams, not everyday users. Their community remix feature is a strong pattern to adopt.

**FlowGPT** — Proved that free-first community models can scale to 10M+ users. Moves faster than commercial competitors because prompts aren't gated behind paywalls.

**PromptHero** — Strong social features (portfolios, job board) show that community identity drives engagement. Users want to be recognized as prompt creators.

**Promptaa** — "Magic wand" enhancement feature that transforms basic ideas into structured prompts. This AI-assistance pattern is worth adopting in V3.

---

## 3. Core features

### 3.1 Prompt CRUD + organization (MVP)

- Create, read, update, delete prompts
- Rich text editor with variable placeholders: `{{topic}}`, `{{tone}}`, `{{audience}}`
- Each prompt has: title, description, content body, model target, visibility setting
- Visibility: public, private, unlisted (link-only)
- Copy-to-clipboard with one click
- Duplicate prompt functionality
- Bulk operations (delete, move category, change visibility)

### 3.2 Tags + categories (MVP)

- Hierarchical categories with nesting (e.g., Marketing > Email > Cold Outreach)
- Freeform tags (e.g., #copywriting, #seo, #midjourney-v6, #coding)
- Auto-suggest tags based on prompt content (V3 AI feature)
- Filter by category, tag, model target, visibility, rating
- Full-text search across titles, descriptions, and content
- Saved search filters / smart folders

### 3.3 Prompt pieces — the killer feature (MVP)

Small, reusable prompt fragments that serve as building blocks:

**Piece types:**

- **Persona** — "Act as a senior marketing strategist with 15 years of experience"
- **Format** — "Output as a markdown table with columns: Feature, Benefit, Example"
- **Constraint** — "Keep response under 200 words. Do not use jargon."
- **Context** — "The target audience is small business owners in the US aged 30-50"
- **Tone** — "Use a friendly, conversational tone. Avoid corporate speak."
- **Custom** — any reusable fragment that doesn't fit the above

**Piece features:**

- Pieces are first-class entities, stored and managed like prompts
- Each piece has a title, content, type, tags, and variables
- Pieces can be public or private
- Search and filter pieces separately from full prompts
- "My toolkit" view showing all personal pieces organized by type

### 3.4 Prompt composer (MVP)

A drag-and-drop interface to assemble pieces into complete prompts:

- Left panel: piece library (searchable, filterable by type)
- Center panel: composition canvas where pieces are stacked
- Drag pieces from library to canvas
- Reorder pieces by dragging
- Add custom "glue text" between pieces (free-form text that connects fragments)
- Live preview of the assembled prompt on the right panel
- Variable resolution: if multiple pieces use `{{topic}}`, show one input field
- Save composition as a new prompt (with piece references preserved)
- "Decompose" feature: break an existing prompt into suggested pieces (V3 AI feature)

### 3.5 Forking + version history (V2)

**Forking:**

- Fork any public prompt or piece to your personal library
- Forked copy is fully editable — changes don't affect the original
- Fork badge shows lineage: "Forked from @username/prompt-name"
- Fork count displayed on original prompt (social proof)
- "Forks" tab on any public prompt to see all derivatives

**Version history:**

- Every save creates a new version automatically
- Version list with timestamps and optional change notes
- Diff view showing what changed between versions
- Restore any previous version with one click
- Version count displayed on prompt card

### 3.6 Rating + reviews (V2)

- 1-5 star rating on public prompts
- Written reviews with optional "verified use" badge
- Upvote/downvote on reviews (surface helpful ones)
- Personal effectiveness notes on private prompts (not public)
- Average rating displayed on prompt cards
- Sort/filter by rating in search results

### 3.7 Community explore (V2)

- Browse public prompts: trending, newest, highest rated, most forked
- User profiles with bio, avatar, public prompt showcase, follower count
- Follow system: follow creators, see their new public prompts in feed
- Collections: curated groups of prompts (e.g., "My SEO Toolkit", "Interview Prep")
- Featured collections curated by the PromptVault team
- Activity feed: new prompts from followed users, forks of your prompts, new ratings

### 3.8 AI-powered features (V3)

- **Auto-tagging:** analyze prompt content and suggest relevant tags
- **Quality scoring:** rate prompt clarity, specificity, and likely effectiveness (1-100)
- **Improvement suggestions:** "Add a constraint to reduce hallucination", "Specify output format"
- **Similar prompt discovery:** find prompts in the community library that solve the same problem
- **Auto-decompose:** take a full prompt and suggest how to break it into reusable pieces
- **Model translation:** adapt a ChatGPT-style prompt for Claude, Gemini, etc.
- **Daily prompt recommendation:** AI-curated prompt of the day based on usage patterns

### 3.9 Browser extension (V2-V3)

- **Quick save:** highlight text in any AI chat and save it as a prompt or piece
- **Quick insert:** search your library and paste a prompt into any AI chat input
- **Popup library:** mini version of your library accessible from the toolbar
- **Auto-detect:** recognize when you're in ChatGPT, Claude, Gemini and offer contextual features
- Chrome and Firefox support

### 3.10 Marketplace (V3)

- Creators can price premium prompts ($0.99-$9.99)
- 80/20 revenue split (creator/platform)
- Stripe integration for payments
- Seller analytics: views, sales, revenue, conversion rate
- Buyer protections: preview before purchase, rating-based quality signals
- Premium prompt bundles
- Creator verification badges

---

## 4. Data model

### 4.1 Core entities

```
USER
├── id (uuid, PK)
├── username (string, unique)
├── email (string, unique)
├── password_hash (string)
├── avatar_url (string, nullable)
├── bio (text, nullable)
├── role (enum: user, pro, admin)
├── follower_count (int, default 0)
├── following_count (int, default 0)
├── created_at (timestamp)
└── updated_at (timestamp)

PROMPT
├── id (uuid, PK)
├── user_id (uuid, FK → USER)
├── title (string)
├── description (text, nullable)
├── content (text)
├── model_target (enum: chatgpt, claude, midjourney, gemini, dalle, stable_diffusion, universal)
├── visibility (enum: public, private, unlisted)
├── category_id (uuid, FK → CATEGORY, nullable)
├── forked_from_id (uuid, FK → PROMPT, nullable)
├── is_piece (boolean, default false)
├── piece_type (enum: persona, format, constraint, context, tone, custom, nullable)
├── variables (json, array of placeholder strings)
├── avg_rating (float, default 0)
├── rating_count (int, default 0)
├── fork_count (int, default 0)
├── use_count (int, default 0)
├── version_count (int, default 1)
├── price (decimal, nullable — for marketplace)
├── created_at (timestamp)
└── updated_at (timestamp)

PROMPT_PIECE
├── id (uuid, PK)
├── user_id (uuid, FK → USER)
├── title (string)
├── content (text)
├── piece_type (enum: persona, format, constraint, context, tone, custom)
├── variables (json)
├── visibility (enum: public, private, unlisted)
├── use_count (int, default 0)
├── created_at (timestamp)
└── updated_at (timestamp)

PROMPT_COMPOSITION
├── id (uuid, PK)
├── prompt_id (uuid, FK → PROMPT)
├── piece_id (uuid, FK → PROMPT_PIECE)
├── sort_order (int)
├── glue_text (text, nullable — free text between pieces)
└── created_at (timestamp)

CATEGORY
├── id (uuid, PK)
├── name (string)
├── slug (string, unique)
├── parent_id (uuid, FK → CATEGORY, nullable)
├── depth (int, default 0)
├── prompt_count (int, default 0)
└── created_at (timestamp)

TAG
├── id (uuid, PK)
├── name (string, unique)
├── slug (string, unique)
└── usage_count (int, default 0)

PROMPT_TAG (join table)
├── prompt_id (uuid, FK → PROMPT)
└── tag_id (uuid, FK → TAG)

VERSION
├── id (uuid, PK)
├── prompt_id (uuid, FK → PROMPT)
├── version_number (int)
├── content (text — snapshot of prompt content)
├── change_note (string, nullable)
└── created_at (timestamp)

FORK
├── id (uuid, PK)
├── original_prompt_id (uuid, FK → PROMPT)
├── forked_prompt_id (uuid, FK → PROMPT)
├── forked_by (uuid, FK → USER)
└── created_at (timestamp)

RATING
├── id (uuid, PK)
├── prompt_id (uuid, FK → PROMPT)
├── user_id (uuid, FK → USER)
├── score (int, 1-5)
└── created_at (timestamp)
  UNIQUE(prompt_id, user_id)

REVIEW
├── id (uuid, PK)
├── prompt_id (uuid, FK → PROMPT)
├── user_id (uuid, FK → USER)
├── body (text)
├── verified_use (boolean, default false)
├── helpful_count (int, default 0)
└── created_at (timestamp)

COLLECTION
├── id (uuid, PK)
├── user_id (uuid, FK → USER)
├── name (string)
├── description (text, nullable)
├── visibility (enum: public, private)
├── item_count (int, default 0)
└── created_at (timestamp)

COLLECTION_ITEM (join table)
├── collection_id (uuid, FK → COLLECTION)
├── prompt_id (uuid, FK → PROMPT)
├── sort_order (int)
└── added_at (timestamp)

FOLLOW
├── follower_id (uuid, FK → USER)
├── following_id (uuid, FK → USER)
└── created_at (timestamp)
  UNIQUE(follower_id, following_id)
```

### 4.2 Key relationships

- User → Prompts: one-to-many
- User → Prompt Pieces: one-to-many
- Prompt → Prompt Pieces: many-to-many (through PROMPT_COMPOSITION with sort_order)
- Prompt → Category: many-to-one
- Prompt → Tags: many-to-many (through PROMPT_TAG)
- Prompt → Versions: one-to-many
- Prompt → Forks: one-to-many (original → forked copies)
- Prompt → Ratings: one-to-many
- Prompt → Reviews: one-to-many
- User → Collections: one-to-many
- Collection → Prompts: many-to-many (through COLLECTION_ITEM)
- User → User: many-to-many (through FOLLOW)

### 4.3 Indexes (performance-critical)

```sql
-- Search and browsing
CREATE INDEX idx_prompt_user ON prompt(user_id);
CREATE INDEX idx_prompt_visibility ON prompt(visibility);
CREATE INDEX idx_prompt_category ON prompt(category_id);
CREATE INDEX idx_prompt_model ON prompt(model_target);
CREATE INDEX idx_prompt_rating ON prompt(avg_rating DESC);
CREATE INDEX idx_prompt_created ON prompt(created_at DESC);
CREATE INDEX idx_prompt_forked_from ON prompt(forked_from_id);
CREATE INDEX idx_prompt_is_piece ON prompt(is_piece);

-- Full-text search
CREATE INDEX idx_prompt_search ON prompt USING gin(
  to_tsvector('english', title || ' ' || coalesce(description, '') || ' ' || content)
);

-- Tags
CREATE INDEX idx_prompt_tag_prompt ON prompt_tag(prompt_id);
CREATE INDEX idx_prompt_tag_tag ON prompt_tag(tag_id);
CREATE INDEX idx_tag_slug ON tag(slug);

-- Social
CREATE INDEX idx_follow_follower ON follow(follower_id);
CREATE INDEX idx_follow_following ON follow(following_id);
CREATE INDEX idx_rating_prompt ON rating(prompt_id);
CREATE INDEX idx_rating_user ON rating(user_id);
```

---

## 5. Tech stack

### 5.1 Recommended stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js 14+ (App Router) | SSR for SEO, React ecosystem, fast DX |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design system |
| State | Zustand or Jotai | Lightweight, perfect for prompt editor state |
| Backend | Next.js API routes (start) → separate Node/Express (scale) | Start simple, split when needed |
| Database | PostgreSQL | Relational data fits perfectly, great full-text search |
| ORM | Prisma | Type-safe, excellent migration system, great DX |
| Auth | NextAuth.js or Clerk | Social login (Google, GitHub), magic links, session management |
| Search | PostgreSQL full-text (start) → Typesense/Meilisearch (scale) | Start free, upgrade when search latency matters |
| File storage | Cloudflare R2 or AWS S3 | For user avatars, prompt attachments |
| AI features | Anthropic Claude API | Auto-tagging, quality scoring, suggestions |
| Payments | Stripe | Marketplace transactions, Pro subscriptions |
| Hosting | Vercel (frontend) + Railway or Supabase (DB) | Easy deployment, good free tiers |
| Monitoring | Sentry (errors) + PostHog (analytics) | Both have generous free tiers |

### 5.2 Alternative stacks

**If you prefer Python:**
- FastAPI (backend) + Next.js (frontend)
- SQLAlchemy + Alembic (ORM + migrations)
- Everything else stays the same

**If you want maximum speed to market:**
- Supabase (auth + database + real-time + storage — all in one)
- Next.js frontend
- Trade flexibility for speed

---

## 6. API design (key endpoints)

### 6.1 Prompts

```
GET    /api/prompts                    — list user's prompts (paginated, filterable)
POST   /api/prompts                    — create a new prompt
GET    /api/prompts/:id                — get single prompt
PUT    /api/prompts/:id                — update prompt
DELETE /api/prompts/:id                — delete prompt
POST   /api/prompts/:id/fork           — fork a public prompt
GET    /api/prompts/:id/versions       — list versions
POST   /api/prompts/:id/versions       — save new version
PUT    /api/prompts/:id/versions/:vid  — restore a version
GET    /api/prompts/:id/forks          — list forks of a prompt
```

### 6.2 Pieces

```
GET    /api/pieces                     — list user's pieces
POST   /api/pieces                     — create a piece
PUT    /api/pieces/:id                 — update a piece
DELETE /api/pieces/:id                 — delete a piece
```

### 6.3 Composition

```
POST   /api/prompts/:id/compose        — set composition (array of piece_ids + glue_text)
GET    /api/prompts/:id/compose        — get composition details
PUT    /api/prompts/:id/compose        — update composition order/glue
GET    /api/prompts/:id/preview        — preview assembled prompt
```

### 6.4 Tags & categories

```
GET    /api/categories                 — list category tree
POST   /api/categories                 — create category
GET    /api/tags                       — list tags (with usage count)
GET    /api/tags/suggest?q=            — auto-suggest tags
```

### 6.5 Social

```
POST   /api/prompts/:id/rate           — rate a prompt (1-5)
POST   /api/prompts/:id/reviews        — write a review
POST   /api/users/:id/follow           — follow a user
DELETE /api/users/:id/follow           — unfollow
GET    /api/explore/trending           — trending public prompts
GET    /api/explore/newest             — newest public prompts
GET    /api/explore/top-rated          — highest rated
GET    /api/explore/most-forked        — most forked
GET    /api/feed                       — personalized activity feed
```

### 6.6 Collections

```
GET    /api/collections                — list user's collections
POST   /api/collections                — create collection
PUT    /api/collections/:id            — update collection
POST   /api/collections/:id/items      — add prompt to collection
DELETE /api/collections/:id/items/:pid — remove prompt from collection
```

### 6.7 Search

```
GET    /api/search?q=&category=&tags=&model=&sort=&page=
```

### 6.8 AI features (V3)

```
POST   /api/ai/suggest-tags            — get tag suggestions for a prompt
POST   /api/ai/quality-score           — get quality score + improvement tips
POST   /api/ai/decompose               — suggest pieces from a full prompt
POST   /api/ai/translate               — translate prompt between model styles
GET    /api/ai/similar/:id             — find similar prompts
GET    /api/ai/daily-recommendation    — get daily prompt suggestion
```

---

## 7. UI/UX pages

### 7.1 Page map

```
/                           — landing page (marketing)
/login                      — sign in
/signup                     — create account
/dashboard                  — personal prompt library (main view)
/dashboard/pieces           — personal piece toolkit
/dashboard/collections      — personal collections
/dashboard/analytics        — usage stats (Pro)
/compose                    — prompt composer (drag-and-drop)
/prompt/new                 — create new prompt
/prompt/:id                 — view prompt detail
/prompt/:id/edit            — edit prompt
/prompt/:id/versions        — version history
/explore                    — browse public prompts
/explore/trending           — trending view
/explore/collections        — featured collections
/user/:username             — public profile
/user/:username/prompts     — user's public prompts
/settings                   — account settings
/settings/profile           — edit profile
/settings/billing           — subscription management
```

### 7.2 Key UI patterns

**Dashboard (main view):**
- Sidebar: categories tree, saved filters, quick links
- Main area: prompt cards in grid or list view
- Top bar: search, filter dropdowns (model, tags, visibility), sort toggle
- Each card shows: title, first line of content, model badge, tags, rating, fork count
- Quick actions on hover: copy, edit, fork, delete

**Prompt composer:**
- Three-panel layout
- Left: piece library (searchable, grouped by type)
- Center: composition canvas (vertical stack of pieces, drag to reorder)
- Right: live preview of assembled prompt + variable inputs
- Drag pieces from left to center
- Click "+" between pieces to add glue text
- "Save as prompt" button at bottom

**Explore page:**
- Tab bar: trending / newest / top-rated / most-forked
- Prompt cards with author avatar, title, description preview, rating stars, fork count, model badge
- Sidebar: category filter, tag cloud, model filter

---

## 8. Roadmap

### Phase 1 — MVP: personal library (6-8 weeks)

**Goal:** A tool you use every day to manage your own prompts.

Week 1-2:
- Project setup (Next.js, Prisma, PostgreSQL, auth)
- User registration and login (email + Google OAuth)
- Database schema and migrations

Week 3-4:
- Prompt CRUD (create, edit, delete, view)
- Piece CRUD with piece types
- Categories (hierarchical) and tags
- Basic search and filter

Week 5-6:
- Prompt composer (drag-and-drop pieces → assembled prompt)
- Variable system ({{placeholders}})
- Public/private toggle
- Copy-to-clipboard

Week 7-8:
- Dashboard UI polish
- Responsive design (mobile-friendly)
- Basic landing page
- Deploy to production
- Beta testing with 10-20 users

**MVP success metric:** 50+ daily active users who each store 10+ prompts.

### Phase 2 — Community layer (4-6 weeks after MVP)

**Goal:** A place to discover and build on others' prompt craft.

Week 9-10:
- User profiles (public page, bio, avatar)
- Explore page (trending, newest, top-rated)
- Public prompt browsing and search

Week 11-12:
- Forking (fork to your library, lineage tracking)
- Rating (1-5 stars) and reviews
- Follow system and activity feed

Week 13-14:
- Collections (create, curate, share)
- Version history with diff view
- Featured collections (team-curated)
- Browser extension v1 (quick save + quick insert)

**V2 success metric:** 500+ users, 50+ public prompts getting forked.

### Phase 3 — Intelligence + monetization (6-8 weeks after V2)

**Goal:** An intelligent prompt ecosystem with sustainable revenue.

Week 15-17:
- AI auto-tagging and quality scoring
- Prompt improvement suggestions
- Similar prompt discovery

Week 18-20:
- Model translation (ChatGPT → Claude, etc.)
- Auto-decompose (full prompt → suggested pieces)
- Daily prompt recommendation

Week 21-22:
- Pro subscription tier (Stripe)
- Marketplace for premium prompts
- Seller dashboard and analytics
- Public API for developers

**V3 success metric:** 2,000+ users, $1,000+ MRR, 100+ marketplace transactions.

---

## 9. Key suggestions

### 9.1 Start with the personal tool, not the marketplace

PromptBase started as a marketplace. But the pain point you've described is personal organization first. Build a tool so useful for yourself that sharing becomes natural. The marketplace can come later — Notion didn't start with a template gallery.

### 9.2 Prompt pieces are your moat

Nobody else does composable prompt fragments. This is genuinely novel. Make the piece system so intuitive that users build a personal toolkit of 20-30 reusable fragments. The composer should feel like snapping Lego blocks together.

### 9.3 Browser extension is critical for daily use

The biggest drop-off risk: users forget to visit your site. A Chrome extension that lets you save a prompt from any AI chat, or insert a prompt with one click, turns your platform from "a site I visit" into "a tool I rely on."

### 9.4 Free tier must be generous

FlowGPT proved free-first can scale to 10M+ users. Offer unlimited private prompts and pieces on the free tier. Gate advanced features: AI suggestions, analytics, premium marketplace listings. The library itself should always be free.

### 9.5 "Quick use" daily prompt feed

Build a "daily prompt" feature — an AI-recommended prompt each day based on usage patterns. Plus a "quick copy" panel of your most-used prompts accessible in one click. This creates a daily habit loop.

### 9.6 Import/export to prevent lock-in fear

Let users export their entire library as JSON/Markdown. Let them import from text files, CSV, or even their ChatGPT history. Reducing lock-in anxiety accelerates adoption.

### 9.7 Model-agnostic but model-aware

Tag prompts by target model but don't lock them. In V3, the AI translation feature can auto-adapt a prompt between model styles — this is a massive value-add nobody offers well.

### 9.8 Gamification for community growth

- "Prompt crafter" levels based on contribution (prompts created, forks received, ratings)
- Weekly leaderboard of top-rated new prompts
- "Featured creator" spotlight on explore page
- Achievement badges (first fork, 100 uses, 5-star average)

### 9.9 SEO strategy for organic growth

Every public prompt gets its own URL with structured metadata. This means thousands of long-tail search pages: "best ChatGPT prompt for cold email outreach", "midjourney prompt for product photography." PromptBase gets significant traffic this way.

### 9.10 Consider a "prompt playground" (V3+)

Let users test prompts directly within PromptVault by connecting their own API keys. This keeps users on your platform instead of copy-pasting to another tool. Start with a simple text completion interface, expand to support image generation previews.

---

## 10. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Users don't return after first visit | High | High | Browser extension, daily prompt feed, email digests |
| Prompt pieces too complex for casual users | Medium | High | Default templates, guided onboarding, "simple mode" without pieces |
| Low community contribution | High | Medium | Seed with curated prompts, gamification, featured creators |
| Marketplace spam / low quality | Medium | Medium | Quality review process, minimum rating thresholds, verified badges |
| Competitor copies the piece feature | Low | Medium | Move fast, build community moat, network effects |
| AI costs for V3 features | Medium | Low | Cache common suggestions, batch processing, rate limits on free tier |

---

## 11. Success metrics

### North star

**Weekly active users who compose a prompt from pieces** — this measures both retention and adoption of the core differentiating feature.

### Supporting metrics

| Metric | MVP target | V2 target | V3 target |
|---|---|---|---|
| Registered users | 200 | 2,000 | 10,000 |
| Weekly active users | 50 | 500 | 2,500 |
| Prompts created (total) | 1,000 | 15,000 | 100,000 |
| Pieces created (total) | 500 | 5,000 | 30,000 |
| Public prompts | 100 | 2,000 | 20,000 |
| Forks | — | 500 | 5,000 |
| Avg prompts per user | 5 | 8 | 12 |
| Avg pieces per user | 3 | 5 | 8 |
| MRR | $0 | $0 | $1,000+ |

---

*Document generated for PromptVault product planning. Last updated: April 2026.*
