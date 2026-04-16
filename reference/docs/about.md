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

## 2. Core features

### 2.1 Prompt CRUD + organization (MVP)

- Create, read, update, delete prompts
- Rich text editor with variable placeholders: `{{topic}}`, `{{tone}}`, `{{audience}}`
- Each prompt has: title, description, content body, model target, visibility setting
- Visibility: public, private, unlisted (link-only)
- Copy-to-clipboard with one click
- Duplicate prompt functionality
- Bulk operations (delete, move category, change visibility)

### 2.2 Tags + categories (MVP)

- Hierarchical categories with nesting (e.g., Marketing > Email > Cold Outreach)
- Freeform tags (e.g., #copywriting, #seo, #midjourney-v6, #coding)
- Auto-suggest tags based on prompt content (V3 AI feature)
- Filter by category, tag, model target, visibility, rating
- Full-text search across titles, descriptions, and content
- Saved search filters / smart folders

### 2.3 Prompt pieces — the killer feature (MVP)

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

### 2.4 Prompt composer (MVP)

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

### 2.5 Forking + version history (V2)

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

### 2.6 Rating + reviews (V2)

- 1-5 star rating on public prompts
- Written reviews with optional "verified use" badge
- Upvote/downvote on reviews (surface helpful ones)
- Personal effectiveness notes on private prompts (not public)
- Average rating displayed on prompt cards
- Sort/filter by rating in search results

### 2.7 Community explore (V2)

- Browse public prompts: trending, newest, highest rated, most forked
- User profiles with bio, avatar, public prompt showcase, follower count
- Follow system: follow creators, see their new public prompts in feed
- Collections: curated groups of prompts (e.g., "My SEO Toolkit", "Interview Prep")
- Featured collections curated by the PromptVault team
- Activity feed: new prompts from followed users, forks of your prompts, new ratings

### 2.8 AI-powered features (V3)

- **Auto-tagging:** analyze prompt content and suggest relevant tags
- **Quality scoring:** rate prompt clarity, specificity, and likely effectiveness (1-100)
- **Improvement suggestions:** "Add a constraint to reduce hallucination", "Specify output format"
- **Similar prompt discovery:** find prompts in the community library that solve the same problem
- **Auto-decompose:** take a full prompt and suggest how to break it into reusable pieces
- **Model translation:** adapt a ChatGPT-style prompt for Claude, Gemini, etc.
- **Daily prompt recommendation:** AI-curated prompt of the day based on usage patterns
