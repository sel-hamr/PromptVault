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
