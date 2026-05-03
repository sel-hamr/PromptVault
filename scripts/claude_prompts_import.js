const fetch = require('node-fetch');
const fs = require('fs');
const crypto = require('crypto');

const RAW_URL = 'https://raw.githubusercontent.com/langgptai/awesome-claude-prompts/main/README.md';

function uuid() {
  return crypto.randomUUID();
}

async function fetchRaw() {
  const res = await fetch(RAW_URL, { headers: { 'User-Agent': 'promptvault-import-script' } });
  if (!res.ok) throw new Error('Failed to fetch README: ' + res.statusText);
  return await res.text();
}

// Very small language detector fallback (optional translation handled separately)
function isProbablyEnglish(text) {
  // if there are many ASCII letters and common English words
  const engWords = ['the','and','is','to','a','you','in','for','that','with'];
  const lower = text.toLowerCase();
  let score = 0;
  for (const w of engWords) if (lower.includes(' ' + w + ' ')) score++;
  return score >= 2 || /[a-zA-Z0-9]/.test(text);
}

// Heuristic classifier: PromptPiece vs Prompt
function classify(content) {
  const len = content.trim().length;
  if (len < 180) {
    // short items are likely pieces/snippets
    return 'PromptPiece';
  }
  return 'Prompt';
}

async function main() {
  console.log('Fetching README...');
  const md = await fetchRaw();

  // Split by top-level headings (##) — skip leading frontmatter
  const chunks = md.split(/\n##\s+/).slice(1);
  const items = [];

  for (const chunk of chunks) {
    const lines = chunk.split('\n');
    const title = (lines[0] || '').trim().replace(/\r/g, '');
    const content = lines.slice(1).join('\n').trim();
    if (!title || !content) continue;
    if (content.length < 40) continue;

    const detectedEnglish = isProbablyEnglish(content) || isProbablyEnglish(title);

    const item = {
      id: uuid(),
      user_id: process.env.USER_ID || 'REPLACE_USER_ID',
      title: title,
      description: content.replace(/\n/g, ' ').slice(0, 300),
      content: content,
      model_target: 'UNIVERSAL',
      visibility: 'PUBLIC',
      variables: [],
      avg_rating: 0,
      rating_count: 0,
      fork_count: 0,
      use_count: 0,
      version_count: 1,
      type: classify(content),
      detected_english: detectedEnglish,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    items.push(item);
  }

  if (!fs.existsSync('data')) fs.mkdirSync('data');
  fs.writeFileSync('data/claude_prompts_raw.json', JSON.stringify(items, null, 2));
  console.log('Wrote data/claude_prompts_raw.json with', items.length, 'items');

  // Emit a SQL template for manual insertion. NOTE: replace USER_ID placeholder.
  const sqlLines = [];
  sqlLines.push('-- prompts_insert.sql\n-- Replace REPLACE_USER_ID with a real user id from your users table before running.\n-- Adjust table/column names if your Prisma migration used different casing.\n');

  for (const it of items) {
    const id = it.id;
    const userId = it.user_id;
    const title = it.title.replace(/'/g, "''");
    const description = it.description.replace(/'/g, "''");
    const content = it.content.replace(/'/g, "''");
    const now = it.created_at;
    const variables = "'[]'::jsonb";

    const sql = `INSERT INTO "Prompt" (id, user_id, title, description, content, model_target, visibility, variables, avg_rating, rating_count, fork_count, use_count, version_count, created_at, updated_at) VALUES ('${id}', '${userId}', '${title}', '${description}', '${content}', 'UNIVERSAL', 'PUBLIC', ${variables}, 0, 0, 0, 0, 1, '${now}', '${now}');`;
    sqlLines.push(sql);
  }

  fs.writeFileSync('data/claude_prompts_insert.sql', sqlLines.join('\n'));
  console.log('Wrote data/claude_prompts_insert.sql (edit REPLACE_USER_ID as needed)');

  // Output a small analysis summary
  const counts = items.reduce((acc, it) => { acc[it.type] = (acc[it.type]||0)+1; return acc; }, {});
  fs.writeFileSync('data/claude_prompts_summary.json', JSON.stringify({ total: items.length, by_type: counts }, null, 2));
  console.log('Wrote data/claude_prompts_summary.json');
}

main().catch(err => { console.error(err); process.exit(1); });
