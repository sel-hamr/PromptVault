# PromptVault — Build Prompts

> Use these prompts one by one, in order, to build the PromptVault platform step by step.
> Each prompt is self-contained and builds on the previous ones.
> Copy-paste each prompt into your AI coding assistant (Claude, Cursor, etc.) when you're ready for that step.

---

## Phase 1 — Project Setup & Foundation

---

### Prompt 1: Project Initialization

```
Create a new Next.js 16+ project with App Router for a platform called "PromptVault" — a personal prompt library app. Set up:

- Next.js 16+ with App Router and TypeScript
- Tailwind CSS with shadcn/ui components (install Button, Input, Card, Dialog, DropdownMenu, Badge, Textarea, Select, Tabs, Avatar, Command)
- Prisma ORM connected to PostgreSQL
- Project structure with these folders:
  - app/ (pages and layouts)
  - components/ (reusable UI components)
  - lib/ (utilities, database client, helpers)
  - prisma/ (schema and migrations)
  - types/ (TypeScript interfaces)

Create a .env.example with DATABASE_URL and NEXTAUTH_SECRET placeholders.
Create a basic root layout with a clean sans-serif font and a placeholder navbar with the PromptVault logo text.
```

---

### Prompt 2: Database Schema

```
Set up the Prisma schema for PromptVault with these models:

USER:
- id (uuid, default cuid), username (unique), email (unique), password_hash, avatar_url (optional), bio (optional), role (enum: USER, PRO, ADMIN, default USER), follower_count (default 0), following_count (default 0), created_at, updated_at

PROMPT:
- id (uuid), user_id (FK → User), title, description (optional), content (text), model_target (enum: CHATGPT, CLAUDE, MIDJOURNEY, GEMINI, DALLE, STABLE_DIFFUSION, UNIVERSAL), visibility (enum: PUBLIC, PRIVATE, UNLISTED, default PRIVATE), category_id (FK → Category, optional), forked_from_id (self-referencing FK, optional), variables (Json, default []), avg_rating (float, default 0), rating_count (default 0), fork_count (default 0), use_count (default 0), version_count (default 1), created_at, updated_at

PROMPT_PIECE:
- id (uuid), user_id (FK → User), title, content (text), piece_type (enum: PERSONA, FORMAT, CONSTRAINT, CONTEXT, TONE, CUSTOM), variables (Json, default []), visibility (enum: PUBLIC, PRIVATE, UNLISTED, default PRIVATE), use_count (default 0), created_at, updated_at

CATEGORY:
- id (uuid), name, slug (unique), parent_id (self-referencing FK, optional), depth (default 0), prompt_count (default 0), created_at

TAG:
- id (uuid), name (unique), slug (unique), usage_count (default 0)

PROMPT_TAG (join table):
- prompt_id (FK → Prompt), tag_id (FK → Tag), compound unique on both

Add indexes on: prompt(user_id), prompt(visibility), prompt(category_id), prompt(model_target), prompt(avg_rating DESC), prompt(created_at DESC), tag(slug).

Run prisma migrate dev to create the initial migration.
```

---

### Prompt 3: Authentication System

```
Set up NextAuth.js authentication for PromptVault:

- Email/password login with bcrypt hashing
- Google OAuth provider
- GitHub OAuth provider (optional, can be added later)
- Prisma adapter for session/user storage
- JWT strategy for sessions

Create these pages:
1. /login — sign in form with email/password fields and Google OAuth button. Clean, centered card layout.
2. /signup — registration form with username, email, password fields and Google OAuth button. Validate that username is unique.

Create auth middleware that protects /dashboard and /compose routes.
Create a helper function getCurrentUser() that returns the logged-in user from the session.
Update the navbar to show login/signup buttons when logged out, and username + avatar + logout when logged in.
```

---

## Phase 2 — Core CRUD

---

### Prompt 4: Prompt CRUD — Backend API

```
Create API routes for prompt management in PromptVault:

POST /api/prompts — Create a new prompt. Required: title, content. Optional: description, model_target (default UNIVERSAL), visibility (default PRIVATE), category_id, variables (array of placeholder strings like ["topic", "tone"]). Auto-detect variables from {{placeholder}} patterns in content.

GET /api/prompts — List the current user's prompts. Support query params: search (full-text search on title + description + content), category_id, model_target, visibility, tags (comma-separated tag slugs), sort (newest, oldest, rating, most_used), page, per_page (default 20). Return paginated results with total count.

GET /api/prompts/[id] — Get a single prompt with its tags and category. Only return if the user owns it OR it's public/unlisted.

PUT /api/prompts/[id] — Update a prompt. Only the owner can update. Accept same fields as create.

DELETE /api/prompts/[id] — Soft delete or hard delete a prompt. Only the owner can delete.

POST /api/prompts/[id]/duplicate — Duplicate a prompt to the current user's library. Copy all fields except reset use_count, fork_count, rating to defaults.

All routes should be protected by auth middleware. Return proper error codes (401, 403, 404).
```

---

### Prompt 5: Prompt CRUD — Frontend Pages

```
Build the prompt management UI for PromptVault:

1. /prompt/new — Create prompt page:
   - Title input field
   - Description textarea (optional)
   - Content textarea (large, with monospace font) — this is the main prompt body
   - Model target dropdown (ChatGPT, Claude, Midjourney, Gemini, DALL-E, Stable Diffusion, Universal)
   - Visibility selector (Private, Public, Unlisted) with icon indicators
   - Tag input — type and press Enter to add tags as badges, click X to remove
   - Auto-detect {{variables}} from the content and show them as chips below the content area
   - "Save Prompt" button
   - After save, redirect to the prompt detail page

2. /prompt/[id] — View prompt detail page:
   - Show title, description, content (in a styled code block), model badge, visibility badge, tags as badges
   - "Copy to Clipboard" button that copies the content with one click (show toast on success)
   - "Edit" button → navigates to edit page
   - "Duplicate" button → creates a copy in user's library
   - "Delete" button with confirmation dialog
   - If the prompt has variables, show input fields to fill them in and a "Copy with Variables" button that replaces {{placeholders}} with the filled values

3. /prompt/[id]/edit — Edit prompt page:
   - Same form as create, pre-filled with existing data
   - "Save Changes" button
```

---

### Prompt 6: Prompt Pieces — Backend API

```
Create API routes for prompt pieces in PromptVault:

POST /api/pieces — Create a new piece. Required: title, content, piece_type (PERSONA, FORMAT, CONSTRAINT, CONTEXT, TONE, CUSTOM). Optional: visibility, variables. Auto-detect {{variables}} from content.

GET /api/pieces — List the current user's pieces. Support query params: piece_type (filter by type), search (full-text), visibility, sort (newest, most_used), page, per_page. Return paginated results.

GET /api/pieces/[id] — Get a single piece. Only return if user owns it or it's public.

PUT /api/pieces/[id] — Update a piece. Owner only.

DELETE /api/pieces/[id] — Delete a piece. Owner only.

GET /api/pieces/popular — List most-used public pieces, sorted by use_count descending. Support piece_type filter and pagination.
```

---

### Prompt 7: Prompt Pieces — Frontend Pages

```
Build the prompt pieces UI for PromptVault:

1. /dashboard/pieces — "My Toolkit" page:
   - Top section with 6 filter tabs: All, Persona, Format, Constraint, Context, Tone, Custom
   - Search bar to filter pieces by text
   - Grid of piece cards, each showing:
     - Title
     - Piece type as a colored badge (each type gets a distinct color: Persona=purple, Format=blue, Constraint=red, Context=green, Tone=orange, Custom=gray)
     - First 2 lines of content preview
     - Use count
     - Quick actions: Copy, Edit, Delete
   - "+ New Piece" button that opens a creation dialog/modal:
     - Title input
     - Piece type dropdown
     - Content textarea
     - Visibility selector
     - Save button

2. Piece edit modal — same as creation modal but pre-filled, triggered by clicking Edit on a card.

3. Piece delete — confirmation dialog, then remove from list.
```

---

## Phase 3 — Categories, Tags & Search

---

### Prompt 8: Categories System

```
Build the hierarchical category system for PromptVault:

Backend:
- POST /api/categories — Create a category. Fields: name, parent_id (optional). Auto-generate slug from name. Set depth based on parent (0 for root, parent.depth + 1 for children). Max depth: 3 levels.
- GET /api/categories — Return the full category tree as nested JSON. Each node has: id, name, slug, depth, prompt_count, children[].
- PUT /api/categories/[id] — Update category name/parent.
- DELETE /api/categories/[id] — Delete category. Only if prompt_count is 0 or move child prompts to parent.

Frontend:
- In the dashboard sidebar, show the category tree as a collapsible list. Clicking a category filters prompts.
- "+" button next to categories header to create a new category via a small dialog (name + optional parent dropdown).
- Right-click or "..." menu on a category to rename or delete.
- When creating/editing a prompt, show a category dropdown with indented nesting to visualize hierarchy.
```

---

### Prompt 9: Tags & Autocomplete

```
Build the tagging system for PromptVault:

Backend:
- When creating/updating a prompt, accept a tags array of strings. For each tag:
  - Check if a tag with that name exists (case-insensitive)
  - If not, create it with auto-generated slug
  - Create PROMPT_TAG join record
  - Increment the tag's usage_count
- When removing a tag from a prompt, decrement usage_count
- GET /api/tags — List all tags sorted by usage_count descending. Support: search query, limit.
- GET /api/tags/autocomplete?q=<prefix> — Return tags matching the prefix (case-insensitive, limit 10), sorted by usage_count. This powers the tag input.

Frontend:
- Update the prompt create/edit form tag input:
  - As the user types, show a dropdown of matching tags from the autocomplete API
  - User can select from suggestions or press Enter to create a new tag
  - Added tags show as removable badges below the input
- In the dashboard top bar, add a tag filter dropdown that shows popular tags with usage counts
```

---

### Prompt 10: Search & Filters

```
Build the search and filter system for PromptVault:

Backend:
- Implement full-text search on prompts using PostgreSQL. Search across title, description, and content fields.
- GET /api/search endpoint that accepts: q (search query), category (category_id), tags (comma-separated), model (model_target), visibility, rating_min (float), sort (relevance, newest, rating, most_used, most_forked), page, per_page.
- For relevance sorting, use PostgreSQL ts_rank on the text search vector.
- Return results with highlighted matches if possible (or just the matching prompts with scores).

Frontend — Update the dashboard:
- Search bar at the top — debounced input (300ms) that triggers search as you type
- Filter bar below search with dropdowns: Model Target, Visibility, Tags (multi-select), Category
- Sort toggle: Newest / Rating / Most Used
- Show result count (e.g., "23 prompts found")
- When filters are active, show a "Clear all filters" button
- Empty state: "No prompts found. Try different filters or create your first prompt."
```

---

## Phase 4 — Dashboard & Daily Use

---

### Prompt 11: Dashboard Main View

```
Build the main dashboard page at /dashboard for PromptVault:

Layout:
- Left sidebar (collapsible on mobile):
  - Category tree (from Prompt 8)
  - "All Prompts" link at the top
  - "My Pieces" link → /dashboard/pieces
  - "Collections" link → /dashboard/collections (placeholder for now)
  - Divider
  - "Most Used" section showing top 5 pinned prompts by use_count

- Main content area:
  - Top bar: search input, filter dropdowns, view toggle (grid/list), sort dropdown
  - Prompt cards in a responsive grid (or list rows):
    Grid card shows: title, first line of content (truncated), model target badge (colored), tags as small badges (max 3, then "+N"), visibility icon, fork count, use count
    List row shows: title, model badge, tags, visibility, dates, quick actions
  - Quick actions on each card (visible on hover or via "..." menu): Copy content, Edit, Duplicate, Delete, Change visibility
  - Pagination at the bottom

- Floating action button "+ New Prompt" in bottom right corner on mobile

Make it responsive: sidebar collapses to a hamburger menu on mobile, grid becomes single column.
```

---

### Prompt 12: Copy to Clipboard & Use Count

```
Implement the copy-to-clipboard and usage tracking for PromptVault:

1. Copy functionality:
   - On every prompt card, add a copy icon button
   - On the prompt detail page, add a prominent "Copy to Clipboard" button
   - When clicked: copy the prompt content to clipboard, show a success toast "Copied!", increment the prompt's use_count by 1 via API call (PUT /api/prompts/[id]/use)
   - If the prompt has variables ({{placeholders}}): show a modal with input fields for each variable, a preview of the prompt with filled values, and a "Copy with Variables" button

2. Backend:
   - PUT /api/prompts/[id]/use — increment use_count by 1. No auth required if prompt is public (to track copies from shared links).

3. Variable fill modal:
   - Parse all {{variable_name}} patterns from the prompt content
   - Show an input field for each unique variable
   - Live preview below that shows the prompt with variables replaced
   - "Copy" button copies the filled version
```

---

### Prompt 13: Quick Access Panel (Cmd+K)

```
Build a Cmd+K (Ctrl+K on Windows) quick-access panel for PromptVault:

- Global keyboard shortcut listener: Cmd+K or Ctrl+K opens the panel from any page
- Panel is a centered modal/dialog with:
  - Search input auto-focused
  - Below the input, two sections:
    1. "Recently Used" — last 5 prompts the user copied (tracked by use_count timestamps or a separate recent_use table)
    2. "Most Used" — top 5 prompts by use_count
  - As the user types, filter/search prompts in real-time (debounced API call to /api/search)
  - Each result row shows: title, model badge, first line of content
  - Keyboard navigation: arrow keys to move between results, Enter to copy the selected prompt to clipboard, Escape to close
  - After copying, show a brief toast and close the panel

- Use the shadcn/ui Command component as the base (it's built for this exact pattern).
- The panel should work on both desktop and mobile (on mobile, add a search icon in the navbar that opens it).
```

---

## Phase 5 — Prompt Composer

---

### Prompt 14: Composer — Editor Layout

```
Build the Prompt Composer page at /compose for PromptVault:

Three-panel layout:

LEFT PANEL — Piece Library:
- Search input at the top
- Filter tabs: All, Persona, Format, Constraint, Context, Tone, Custom
- Scrollable list of the user's pieces, each showing:
  - Title
  - Piece type badge (colored by type)
  - First line of content preview
  - "+ Add" button on each piece
- Clicking "+ Add" inserts the piece into the editor at the cursor position

CENTER PANEL — Rich Text Editor:
- Use Tiptap (or a simple contenteditable-based editor) as the editing surface
- User can type freely — it's just like writing in a document
- When a piece is inserted (via "+ Add" button, slash command, or autocomplete), it appears as a styled inline chip/block:
  - Colored background matching piece type
  - Shows piece title
  - Click to expand and see full piece content
  - X button to remove it
  - The chip is non-editable but the text around it is fully editable
- User types their own text between pieces naturally

RIGHT PANEL — Live Preview:
- Shows the final assembled prompt text in real-time
- Pieces are expanded to their full content, mixed with the user's typed text
- Variable inputs: if any pieces or typed text contain {{variables}}, show input fields at the top of the preview panel. Filling them updates the preview.
- "Copy" button to copy the assembled prompt
- "Save as Prompt" button to save it as a new prompt (opens a dialog for title, description, tags, model, visibility)

Make the panels resizable. On mobile, use tabs to switch between the three panels.
```

---

### Prompt 15: Composer — Slash Commands & Autocomplete

```
Add slash commands and autocomplete to the PromptVault composer editor:

1. Slash commands:
   - When the user types "/" at the beginning of a line or after a space, show a dropdown menu with piece type shortcuts:
     - /persona → filter piece library to Persona type
     - /format → filter to Format type
     - /constraint → filter to Constraint type
     - /context → filter to Context type
     - /tone → filter to Tone type
     - /piece → show all pieces
   - The dropdown appears inline at the cursor position
   - Arrow keys to navigate, Enter to select (which opens the piece picker filtered by that type)
   - Escape to dismiss

2. Piece autocomplete:
   - When the user types "@" followed by text, show a dropdown of matching pieces by title
   - Filter as they type (e.g., "@market" shows "Marketing Expert Persona", "Market Research Format")
   - Enter to insert the selected piece as a chip at the cursor position
   - The "@" trigger text is replaced by the piece chip

3. Keyboard shortcut:
   - Ctrl+Shift+P (or Cmd+Shift+P) opens the piece picker as a centered modal
   - Same search/filter interface as the left panel but as a modal overlay
```

---

## Phase 6 — Import/Export & Visibility

---

### Prompt 16: Import & Export

```
Build import and export functionality for PromptVault:

Backend:
- GET /api/export — Export the user's entire library as a JSON file. Include all prompts and pieces with their tags and categories. Return as a downloadable .json file.
- GET /api/export/prompt/[id] — Export a single prompt as JSON or Markdown.
- POST /api/import — Accept a JSON file upload. Parse and create prompts/pieces for the current user. Handle:
  - JSON format: array of objects with title, content, description, model_target, tags, piece_type fields
  - CSV format: columns for title, content, description, model_target, tags (comma-separated)
  - Plain text: treat each block separated by "---" as a separate prompt (first line = title, rest = content)
  - Return a summary: { imported: N, skipped: N, errors: [] }

Frontend — /settings/import-export page:
- Export section:
  - "Export All Prompts" button → downloads JSON
  - "Export All Pieces" button → downloads JSON
  - Format selector: JSON or Markdown
- Import section:
  - File upload area (drag & drop or click to browse)
  - Accept .json, .csv, .txt files
  - After upload, show a preview of what will be imported (count of prompts/pieces)
  - "Import" button to confirm
  - Show progress and results summary
- Clipboard import:
  - "Paste Prompt" button that opens a textarea
  - User pastes a prompt, clicks "Save" → opens the create prompt form with content pre-filled
```

---

### Prompt 17: Public/Private Toggle & Share Links

```
Build the visibility system and sharing for PromptVault:

1. Visibility toggle on prompt cards:
   - Each prompt card shows a visibility icon (lock for private, globe for public, link for unlisted)
   - Clicking the icon opens a dropdown to change visibility: Private, Public, Unlisted
   - Changing visibility makes an API call to update the prompt
   - Show a toast confirming the change

2. Public prompt pages:
   - /prompt/[id] — if the prompt is public or unlisted, show it to anyone (no login required)
   - Show: title, description, content (in a styled block), author name + avatar, model badge, tags, rating, fork count, created date
   - "Copy" button (works for non-logged-in users too)
   - "Fork to My Library" button (requires login — redirects to login if not authenticated)
   - Share button that copies the URL to clipboard

3. Unlisted prompts:
   - Accessible via direct link but don't appear in search or explore pages
   - Show a banner: "This prompt is unlisted. Only people with the link can see it."

4. Bulk visibility change:
   - In the dashboard, add a "Select" mode — checkboxes on each card
   - When items are selected, show a toolbar: "Change visibility", "Delete", "Move to category"
   - "Change visibility" opens a dropdown to set all selected prompts to the chosen visibility
```

---

## Phase 7 — Community Features

---

### Prompt 18: User Profiles

```
Build public user profiles for PromptVault:

Backend:
- GET /api/users/[username] — Return public profile data: username, avatar_url, bio, follower_count, following_count, created_at, public prompt count, public piece count.
- PUT /api/users/me/profile — Update current user's profile: username, bio, avatar_url.

Frontend:
1. /user/[username] — Public profile page:
   - Header section: avatar (large, circular), username, bio, join date
   - Stats row: X prompts · Y pieces · Z followers · W following
   - Tab bar: Prompts | Pieces | Collections
   - Prompts tab: grid of the user's public prompts (same card format as dashboard)
   - Pieces tab: list of public pieces
   - "Follow" button (if logged in and viewing another user)

2. /settings/profile — Edit profile page:
   - Avatar upload (or URL input for now)
   - Username field
   - Bio textarea (max 300 chars)
   - "Save" button
```

---

### Prompt 19: Explore Page

```
Build the public explore page for PromptVault:

Backend:
- GET /api/explore/trending — Public prompts sorted by a trending score: (fork_count * 3 + rating_count * 2 + use_count) / hours_since_created. Paginated.
- GET /api/explore/newest — Public prompts sorted by created_at desc. Paginated.
- GET /api/explore/top-rated — Public prompts sorted by avg_rating desc, min 3 ratings. Paginated.
- GET /api/explore/most-forked — Public prompts sorted by fork_count desc. Paginated.

Frontend — /explore page:
- Top section: hero banner with tagline "Discover prompts from the community"
- Tab bar: Trending | Newest | Top Rated | Most Forked
- Prompt cards in a grid:
  - Author avatar + username (linked to profile)
  - Title
  - Description preview (2 lines max)
  - Model target badge
  - Tags (max 3)
  - Rating stars (average) + rating count
  - Fork count
  - "Copy" and "Fork" quick action buttons
- Right sidebar (desktop only):
  - Category filter
  - Model filter
  - Popular tags cloud (top 20 tags by usage_count)
- Search bar at the top that searches public prompts only
- Pagination at the bottom
```

---

### Prompt 20: Forking System

```
Build the prompt forking system for PromptVault:

Backend:
- POST /api/prompts/[id]/fork — Fork a public prompt to the current user's library:
  - Create a copy of the prompt with the current user as owner
  - Set forked_from_id to the original prompt's id
  - Set visibility to PRIVATE (user can change later)
  - Reset use_count, rating, fork_count to 0
  - Increment the original prompt's fork_count by 1
  - Create a FORK record: original_prompt_id, forked_prompt_id, forked_by
  - Return the new forked prompt
- GET /api/prompts/[id]/forks — List all forks of a prompt. Return forked prompts with their authors.

Frontend:
- On public prompt pages and explore cards, add a "Fork" button (fork icon + count)
- Clicking "Fork":
  - If not logged in → redirect to login
  - If logged in → show a confirmation: "Fork this prompt to your library?"
  - On confirm → call fork API, show toast "Forked! View in your library", redirect to the new prompt's edit page
- On forked prompts, show a lineage badge: "Forked from @username/original-title" (linked to the original)
- On original prompts, show fork count and a "Forks" tab listing all derivatives
```

---

### Prompt 21: Rating & Reviews

```
Build the rating and review system for PromptVault:

Backend:
- POST /api/prompts/[id]/rate — Rate a public prompt 1-5 stars. One rating per user per prompt (upsert). After rating, recalculate the prompt's avg_rating and rating_count.
- POST /api/prompts/[id]/reviews — Write a review on a public prompt. Fields: body (text), verified_use (boolean — set true if the user has used/copied this prompt). One review per user per prompt.
- GET /api/prompts/[id]/reviews — List reviews for a prompt, sorted by helpful_count desc. Include author info.
- POST /api/reviews/[id]/helpful — Increment a review's helpful_count (upvote).

Frontend:
- On public prompt detail pages, add a rating section:
  - Star rating selector (1-5 clickable stars) — current user's rating highlighted
  - Average rating display with star icons and count: "4.3 ★ (12 ratings)"
- Reviews section below the prompt:
  - List of reviews with: author avatar + name, star rating, review text, "verified use" badge if applicable, helpful count with upvote button
  - "Write a Review" button that opens a form: star rating + text area + submit
- On prompt cards in explore/dashboard, show average rating as small stars
```

---

### Prompt 22: Follow System & Activity Feed

```
Build the follow system and activity feed for PromptVault:

Backend:
- POST /api/users/[id]/follow — Follow a user. Create FOLLOW record, increment both users' follower/following counts.
- DELETE /api/users/[id]/follow — Unfollow. Delete FOLLOW record, decrement counts.
- GET /api/users/[id]/followers — List a user's followers. Paginated.
- GET /api/users/[id]/following — List who a user follows. Paginated.
- GET /api/feed — Activity feed for the current user. Query recent public prompts from followed users, ordered by created_at desc. Paginated. Each item shows: user info, prompt info, action type (new_prompt, forked, rated).

Frontend:
- Follow/Unfollow button on user profile pages and next to usernames in explore results
- Activity feed page at /dashboard or as a tab on the dashboard:
  - Feed items showing: "[user avatar] @username published a new prompt: [title]" with timestamp
  - Feed items for forks: "@username forked [original title]"
  - Click any item to go to the prompt
- Follower/following counts on profile pages, clickable to see the list
```

---

## Phase 8 — Collections & Version History

---

### Prompt 23: Collections

```
Build the collections feature for PromptVault:

Backend:
- POST /api/collections — Create a collection. Fields: name, description (optional), visibility (PUBLIC or PRIVATE).
- GET /api/collections — List current user's collections with item_count.
- PUT /api/collections/[id] — Update collection name/description/visibility.
- DELETE /api/collections/[id] — Delete collection (not the prompts in it).
- POST /api/collections/[id]/items — Add a prompt to a collection. Fields: prompt_id. Set sort_order to next available number. Increment item_count.
- DELETE /api/collections/[id]/items/[promptId] — Remove prompt from collection. Decrement item_count.
- GET /api/collections/[id] — Get collection with all its prompts (ordered by sort_order).

Frontend:
1. /dashboard/collections — Collections list page:
   - Grid of collection cards: name, description preview, item count, visibility badge
   - "+ New Collection" button → dialog with name, description, visibility
   - Click a collection to view it

2. Collection detail page /collection/[id]:
   - Header: name, description, visibility, item count, author
   - List of prompts in the collection (reorderable)
   - "Add Prompt" button → opens a search dialog to find and add prompts
   - Remove button on each prompt

3. On prompt cards and detail pages, add "Add to Collection" in the actions menu:
   - Shows a list of user's collections with checkboxes
   - Check/uncheck to add/remove from collections
```

---

### Prompt 24: Version History

```
Build version history for prompts in PromptVault:

Backend:
- On every prompt update (PUT /api/prompts/[id]), automatically:
  - Save the current content as a new VERSION record with version_number (auto-increment), content snapshot, and optional change_note from the request body
  - Increment the prompt's version_count
- GET /api/prompts/[id]/versions — List all versions of a prompt, newest first. Return: version_number, content (truncated to 200 chars for list view), change_note, created_at.
- GET /api/prompts/[id]/versions/[versionId] — Get full version content.
- PUT /api/prompts/[id]/versions/[versionId]/restore — Restore a version: set the prompt's content to this version's content, create a new version record for the restore action.

Frontend — /prompt/[id]/versions page:
- Version timeline/list on the left: version number, date, change note (if any)
- Click a version to see its full content on the right
- "Restore this version" button on each version
- Diff view toggle: show what changed between the selected version and the current version (highlight additions in green, deletions in red — use a simple text diff library)
- On the prompt edit page, add an optional "Change note" input that saves with the version
- On prompt cards, show version count badge (e.g., "v3")
```

---

## Phase 9 — Templates & Advanced Features

---

### Prompt 25: Templates & Starter Kits

```
Build the templates system for PromptVault:

Backend:
- Seed the database with 15-20 official templates covering common use cases:
  - Marketing: Cold email, Social media post, Ad copy, SEO content brief
  - Writing: Blog post, Story outline, Article summary, Editing instructions
  - Development: Code review, Bug report, API docs, Refactoring instructions
  - Education: Lesson plan, Quiz generator, Concept explainer
  - General: Meeting notes, Interview prep, Research assistant
- Each template has: title, description, content (with {{variables}}), category, model_target, variables, is_official=true
- GET /api/templates — List all templates. Support category and model filters.
- POST /api/templates/[id]/use — Clone a template into the user's library as a new prompt.

Frontend — /templates page:
- Category tabs: All, Marketing, Writing, Development, Education, General
- Template cards showing: title, description, model badge, variable count
- Click a card to preview the full template content
- "Use This Template" button → clones to user's library, redirects to the new prompt's edit page
- During onboarding (first login), show a "Pick your starter kit" modal:
  - Checkboxes for categories of interest
  - "Get Started" button loads relevant templates into the user's library
```

---

### Prompt 26: Starter Piece Kits

```
Build starter piece kits for PromptVault:

Seed the database with 25-30 official pieces covering all types:

PERSONA pieces (5-6):
- "Senior Marketing Strategist" — Act as a senior marketing strategist with 15 years of experience in digital marketing and brand strategy.
- "Code Review Expert" — Act as a senior software engineer specializing in code review. Focus on best practices, security, performance, and maintainability.
- "Creative Writing Coach" — Act as an experienced creative writing teacher who gives constructive, encouraging feedback.
- "Data Analyst" — Act as a data analyst who explains findings clearly to non-technical stakeholders.
- "UX Researcher" — Act as a UX researcher who focuses on user needs, pain points, and behavioral patterns.

FORMAT pieces (5-6):
- "Markdown Table" — Output as a markdown table with clear column headers.
- "Bullet Point Summary" — Output as a concise bullet point list, with key points first.
- "Step-by-Step Guide" — Output as a numbered step-by-step guide with clear instructions.
- "Pros and Cons" — Output as a structured pros and cons list.
- "Executive Summary" — Output as a brief executive summary (3-5 sentences) followed by detailed sections.

CONSTRAINT pieces (4-5):
- "Keep It Short" — Keep response under 200 words. Be concise and direct.
- "No Jargon" — Use simple, everyday language. Avoid technical jargon and acronyms.
- "Cite Sources" — Include specific sources, data points, or references to support claims.
- "Actionable Only" — Only include actionable advice. Skip theory and background.

CONTEXT pieces (4-5):
- "Small Business Owner" — The target audience is small business owners in the US with 1-50 employees, aged 30-55.
- "Tech Startup" — The context is an early-stage tech startup with limited budget and a small team of 5-10 people.
- "Student Audience" — The target audience is university students aged 18-25 studying the subject for the first time.

TONE pieces (4-5):
- "Friendly & Casual" — Use a friendly, conversational tone. Write like you're talking to a friend. Avoid corporate speak.
- "Professional & Formal" — Use a professional, formal tone appropriate for business communication.
- "Encouraging & Supportive" — Use a warm, encouraging tone. Be positive and supportive.
- "Direct & No-Nonsense" — Be direct and to the point. No fluff, no pleasantries.

Make these available in /templates under a "Piece Kits" section. Users can browse and add individual pieces or import an entire kit.
```

---

## Phase 10 — Advanced Search & Discovery

---

### Prompt 27: Similar Prompts & Related Tags

```
Build the discovery features for PromptVault:

1. Similar prompts:
   Backend — GET /api/prompts/[id]/similar:
   - Find public prompts that share the most tags with the given prompt, in the same category, or targeting the same model
   - Score: +3 for each shared tag, +2 for same category, +1 for same model
   - Return top 6 results sorted by score, excluding the prompt itself
   Frontend: On the prompt detail page, show a "Similar Prompts" section below the content with a horizontal scrollable row of prompt cards.

2. Related tags (tag co-occurrence):
   Backend:
   - Create a cron job (or API endpoint) that updates the TAG_COOCCURRENCE table: for every pair of tags that appear together on the same prompt, count how many prompts they share.
   - GET /api/tags/[id]/related — Return tags that frequently co-occur with the given tag, sorted by co_count desc, limit 10.
   Frontend: On the explore page tag cloud, clicking a tag shows related tags as suggestions. On the prompt create/edit form, after adding a tag, suggest related tags below.

3. Trending tags:
   Backend — GET /api/tags/trending — Tags with the fastest-growing usage_count in the last 7 days.
   Frontend: Show trending tags on the explore page sidebar and on the dashboard as quick filter chips.
```

---

### Prompt 28: Advanced Filters & Saved Searches

```
Build advanced filtering and saved searches for PromptVault:

1. Advanced filter UI on the dashboard:
   - Add a "Filters" button that expands a filter panel
   - Filters: Model target (multi-select), Tags (multi-select with autocomplete), Category (dropdown), Visibility (multi-select), Rating minimum (slider or dropdown: Any, 3+, 4+, 4.5+), Date range (created after/before)
   - Active filters shown as removable chips above the results
   - Filter state synced to URL query params (so filtered views are shareable/bookmarkable)
   - "Clear all" button

2. Saved searches / smart folders:
   Backend:
   - Create a SAVED_SEARCH model: id, user_id, name, filters (JSON storing the filter params), created_at
   - POST /api/saved-searches — Save current filter combination with a name
   - GET /api/saved-searches — List user's saved searches
   - DELETE /api/saved-searches/[id] — Delete a saved search
   Frontend:
   - "Save this search" button when filters are active → dialog to name it
   - Saved searches appear in the dashboard sidebar under "Smart Folders"
   - Click a smart folder to apply those filters instantly
```

---

## Phase 11 — Polish & Production

---

### Prompt 29: Landing Page

```
Build the public landing page for PromptVault at /:

Hero section:
- Headline: "Your Prompt Library, Organized"
- Subheadline: "Store, compose, and share prompts. Build a personal toolkit of reusable pieces and assemble them into perfect prompts."
- CTA button: "Get Started Free" → /signup
- Secondary CTA: "Explore Prompts" → /explore
- Hero visual: screenshot or illustration of the dashboard/composer

Features section (3-4 feature blocks):
- "Organize Everything" — Categories, tags, search. Find any prompt in seconds.
- "Compose with Pieces" — Build prompts from reusable fragments. Type freely, add pieces inline.
- "Share & Fork" — Make prompts public, fork others' work, build on the community.
- "Use Anywhere" — Copy with one click, fill variables, quick access with Cmd+K.

Social proof section:
- "Join X prompt crafters" (counter)
- "X prompts created" (counter)

How it works section:
- Step 1: Save your prompts
- Step 2: Build your piece toolkit
- Step 3: Compose and share

Footer: links to /explore, /templates, /login, /signup, privacy policy, terms

Make it visually polished with smooth scroll animations, gradient accents, and a professional feel. SEO meta tags: title, description, og:image.
```

---

### Prompt 30: Responsive Design & Mobile Polish

```
Review and polish the responsive design across all PromptVault pages:

1. Mobile navigation:
   - Hamburger menu that opens a slide-out sidebar with: Dashboard, Pieces, Collections, Explore, Templates, Settings
   - Bottom navigation bar on mobile with: Home (dashboard), Compose, Explore, Profile
   - Cmd+K replaced with a search icon in the navbar on mobile

2. Dashboard mobile:
   - Sidebar becomes a slide-out drawer
   - Prompt cards stack in a single column
   - Filter dropdowns collapse into a "Filters" button that opens a bottom sheet
   - Swipe actions on cards: swipe right to copy, swipe left to show actions menu

3. Composer mobile:
   - Three panels become tabs: "Pieces", "Editor", "Preview"
   - The piece library is a bottom sheet that slides up when "+" is tapped
   - Editor is full-width
   - Preview accessible via a tab or a toggle button

4. Explore mobile:
   - Sidebar filters move to a filter button + bottom sheet
   - Cards are full-width, stacked

5. General:
   - All modals become bottom sheets on mobile
   - Touch-friendly button sizes (min 44px tap targets)
   - Test all forms are usable on mobile keyboards
   - Lazy load images and non-critical content
```

---

### Prompt 31: SEO & Performance

```
Optimize PromptVault for SEO and performance:

1. SEO:
   - Every public prompt page (/prompt/[id]) gets:
     - Dynamic meta title: "[Prompt Title] — PromptVault"
     - Meta description: first 160 chars of prompt description or content
     - Open Graph tags: title, description, type=article, site_name=PromptVault
     - Twitter card tags
     - JSON-LD structured data (CreativeWork schema)
   - /explore page: meta title "Explore Prompts — PromptVault", description about browsing public prompts
   - User profiles: "[username]'s Prompts — PromptVault"
   - Generate a sitemap.xml with all public prompt URLs, explore page, template pages
   - Add robots.txt allowing all public pages

2. Performance:
   - Implement ISR (Incremental Static Regeneration) for public prompt pages (revalidate every 60 seconds)
   - Add loading skeletons on dashboard and explore pages while data fetches
   - Lazy load prompt cards below the fold
   - Optimize images: use next/image with proper sizing
   - Add a loading.tsx for each route group
   - Database query optimization: ensure all queries use the indexes defined in the schema
   - Add caching headers for API responses where appropriate
```

---

### Prompt 32: Error Handling & Empty States

```
Add comprehensive error handling and empty states across PromptVault:

1. Empty states (friendly illustrations or icons + helpful text):
   - Dashboard with no prompts: "Your prompt library is empty. Create your first prompt or explore the community." + "Create Prompt" and "Explore" buttons
   - Pieces with no pieces: "Build your toolkit. Create reusable pieces to speed up prompt crafting." + "Create Piece" button
   - Collections with no collections: "Organize your favorites. Create a collection to group related prompts." + "Create Collection" button
   - Search with no results: "No prompts found matching your search. Try different keywords or clear your filters."
   - Explore with no public prompts: "The community is just getting started. Be the first to share a prompt!"
   - Profile with no public prompts: "This user hasn't shared any prompts yet."

2. Error states:
   - 404 page: "Prompt not found. It might have been deleted or made private." + link to dashboard and explore
   - 403 page: "You don't have access to this prompt." + link to explore
   - 500 page: "Something went wrong. We're working on it." + retry button
   - Network error toast: "Connection lost. Your changes will be saved when you're back online."
   - Form validation errors: inline error messages below each field in red

3. Loading states:
   - Skeleton cards on dashboard and explore while loading
   - Spinner on buttons during API calls (disable button during loading)
   - Progress bar for import operations
   - Optimistic UI for actions like copy, rate, follow (show result immediately, revert if API fails)
```

---

## How to Use These Prompts

> **Order matters.** Prompts 1–3 set up the foundation. Prompts 4–7 build core CRUD. Each prompt after that adds a layer.
>
> **One at a time.** Give one prompt per session. Review and test the output before moving to the next.
>
> **Adjust as you go.** If a prompt produces something you want to change, modify it before moving on. Later prompts build on earlier work.
>
> **Skip if needed.** Prompts 18–28 (community features) are optional for MVP. You can ship with just Prompts 1–17 for a fully functional personal tool.

---

_Build prompts generated from the PromptVault Product Plan. April 2026._
