# Database Schema — PromptVault

PostgreSQL database managed by Prisma ORM. The schema models the core domain of **PromptVault**, a prompt management platform where users create, organize, fork, tag, and rate AI prompts.

---

## Enums

### `ModelTarget`

The AI model a prompt is written for.

| Value | Description |
|---|---|
| `CHATGPT` | OpenAI ChatGPT |
| `CLAUDE` | Anthropic Claude |
| `MIDJOURNEY` | Midjourney image generation |
| `GEMINI` | Google Gemini |
| `DALLE` | OpenAI DALL-E image generation |
| `STABLE_DIFFUSION` | Stability AI Stable Diffusion |
| `UNIVERSAL` | Model-agnostic prompt |

### `Visibility`

Controls who can discover or access a prompt or piece.

| Value | Description |
|---|---|
| `PUBLIC` | Visible to everyone; appears in public listings |
| `PRIVATE` | Visible only to the owning user |
| `UNLISTED` | Accessible via direct link but excluded from public listings |

### `PieceType`

Classifies what role a reusable `PromptPiece` plays in a composed prompt.

| Value | Description |
|---|---|
| `PERSONA` | Defines the AI's character or role |
| `FORMAT` | Specifies output structure (e.g., JSON, markdown, bullet list) |
| `CONSTRAINT` | Adds rules or restrictions the model must follow |
| `CONTEXT` | Provides background information or task framing |
| `TONE` | Sets the desired tone (e.g., formal, casual, humorous) |
| `CUSTOM` | User-defined piece that doesn't fit a standard category |

---

## Models

### `User`

Platform account. Owns prompts and prompt pieces.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `String` | Yes | `cuid()` | Primary key |
| `username` | `String` | Yes | — | Unique display handle |
| `email` | `String` | Yes | — | Unique email address |
| `password_hash` | `String` | Yes | — | Bcrypt (or equivalent) hashed password |
| `created_at` | `DateTime` | Yes | `now()` | Account creation timestamp |
| `updated_at` | `DateTime` | Yes | auto | Last update timestamp |

---

### `Prompt`

The core entity. Represents a saved, versioned, and shareable AI prompt.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `String` | Yes | `cuid()` | Primary key |
| `user_id` | `String` | Yes | — | FK → `User.id`; the author |
| `title` | `String` | Yes | — | Human-readable prompt title |
| `description` | `String` | No | — | Short summary shown in listings |
| `content` | `String` | Yes | — | Full prompt text; may contain `{{variable}}` placeholders |
| `model_target` | `ModelTarget` | Yes | — | The AI model this prompt is optimized for |
| `visibility` | `Visibility` | Yes | `PRIVATE` | Access control |
| `category_id` | `String` | No | — | FK → `Category.id`; optional categorization |
| `forked_from_id` | `String` | No | — | FK → `Prompt.id`; set when this prompt was forked from another |
| `variables` | `Json` | Yes | `[]` | Array describing template variables embedded in `content` |
| `avg_rating` | `Float` | Yes | `0` | Denormalized average of all ratings |
| `rating_count` | `Int` | Yes | `0` | Total number of ratings received |
| `fork_count` | `Int` | Yes | `0` | Number of times this prompt has been forked |
| `use_count` | `Int` | Yes | `0` | Number of times this prompt has been run/copied |
| `version_count` | `Int` | Yes | `1` | Number of saved versions (increments on each revision) |
| `created_at` | `DateTime` | Yes | `now()` | Creation timestamp |
| `updated_at` | `DateTime` | Yes | auto | Last update timestamp |

---

### `PromptPiece`

A reusable snippet that can be composed into full prompts. Owned by a user, classified by `PieceType`.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `String` | Yes | `cuid()` | Primary key |
| `user_id` | `String` | Yes | — | FK → `User.id`; the author |
| `title` | `String` | Yes | — | Short label for the piece |
| `content` | `String` | Yes | — | Snippet text; may contain template variables |
| `piece_type` | `PieceType` | Yes | — | Semantic role of this piece |
| `variables` | `Json` | Yes | `[]` | Array describing template variables embedded in `content` |
| `visibility` | `Visibility` | Yes | `PRIVATE` | Access control |
| `use_count` | `Int` | Yes | `0` | Number of times this piece has been used in a prompt |
| `created_at` | `DateTime` | Yes | `now()` | Creation timestamp |
| `updated_at` | `DateTime` | Yes | auto | Last update timestamp |

---

### `Category`

Hierarchical taxonomy for organizing prompts. Supports arbitrary depth via self-referential parent/child relationship.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `String` | Yes | `cuid()` | Primary key |
| `name` | `String` | Yes | — | Display name (e.g., "Coding", "Marketing") |
| `slug` | `String` | Yes | — | Unique URL-safe identifier |
| `parent_id` | `String` | No | — | FK → `Category.id`; `null` for root categories |
| `depth` | `Int` | Yes | `0` | Nesting level; `0` = root, `1` = first child, etc. |
| `prompt_count` | `Int` | Yes | `0` | Denormalized count of prompts assigned to this category |
| `created_at` | `DateTime` | Yes | `now()` | Creation timestamp |

---

### `Tag`

A free-form label that can be applied to many prompts. Tags are global (not per-user).

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `String` | Yes | `cuid()` | Primary key |
| `name` | `String` | Yes | — | Unique display name (e.g., "summarization") |
| `slug` | `String` | Yes | — | Unique URL-safe version of `name` |
| `usage_count` | `Int` | Yes | `0` | Denormalized count of prompts using this tag |

---

### `PromptTag`

Join table for the many-to-many relationship between `Prompt` and `Tag`.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `prompt_id` | `String` | Yes | — | FK → `Prompt.id`; part of composite PK |
| `tag_id` | `String` | Yes | — | FK → `Tag.id`; part of composite PK |

The composite primary key `(prompt_id, tag_id)` enforces uniqueness of each pairing.

---

## Relationships

```
User ──< Prompt          one user authors many prompts
User ──< PromptPiece     one user authors many prompt pieces

Prompt >── User          many prompts belong to one user
Prompt >── Category      many prompts belong to one category (optional)
Prompt >── Prompt        self-referential fork tree (forked_from_id → id)
Prompt ──< Prompt        one prompt can be forked into many child prompts
Prompt >──< Tag          many-to-many via PromptTag join table

Category >── Category    self-referential parent/child tree (parent_id → id)
Category ──< Category    one category can have many child categories
Category ──< Prompt      one category groups many prompts

Tag >──< Prompt          many-to-many via PromptTag join table
```

---

## Indexes

### `Prompt`

| Index | Column(s) | Purpose |
|---|---|---|
| `Prompt_user_id_idx` | `user_id` | Fetch all prompts by a specific author efficiently |
| `Prompt_visibility_idx` | `visibility` | Filter public/private/unlisted prompts in listings |
| `Prompt_category_id_idx` | `category_id` | Retrieve all prompts within a category |
| `Prompt_model_target_idx` | `model_target` | Filter prompts by target AI model |
| `Prompt_avg_rating_idx` | `avg_rating DESC` | Sort by top-rated prompts without a full table scan |
| `Prompt_created_at_idx` | `created_at DESC` | Sort by newest prompts without a full table scan |

### `Tag`

| Index | Column(s) | Purpose |
|---|---|---|
| `Tag_slug_idx` | `slug` | Look up tags by slug (used in URL routing and search) |

> The unique constraints on `User.username`, `User.email`, `Category.slug`, `Tag.name`, and `Tag.slug` are enforced by Prisma `@unique` directives and automatically backed by B-tree indexes in PostgreSQL.
