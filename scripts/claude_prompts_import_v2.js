/*
Improved Claude prompts importer
- Parses README with markdown-it to reliably extract sections
- Detects language with franc; optionally translates using LibreTranslate-compatible endpoint if TRANSLATE_API_URL is set
- Extracts template variables like {{var}}
- Classifies items as Prompt / PromptPiece
- Emits JSON, SQL template, and summary

Install dependencies before running:

npm install node-fetch@2 markdown-it franc langs

Optional translation support (LibreTranslate-style): set env TRANSLATE_API_URL and optionally TRANSLATE_API_KEY

Run:
node scripts/claude_prompts_import_v2.js
*/

const fetch = require('node-fetch');
const fs = require('fs');
const crypto = require('crypto');
const MarkdownIt = require('markdown-it');
const franc = require('franc');
const langs = require('langs');

const RAW_URL = 'https://raw.githubusercontent.com/langgptai/awesome-claude-prompts/main/README.md';
const md = new MarkdownIt();

function uuid() { return crypto.randomUUID(); }

async function fetchRaw() {
  const res = await fetch(RAW_URL, { headers: { 'User-Agent': 'promptvault-import-script' } });
  if (!res.ok) throw new Error('Failed to fetch README: ' + res.statusText);
  return await res.text();
}

function extractVariables(text) {
  const vars = [];
  const re = /{{\s*([^}]+?)\s*}}/g;
  let m;
  while ((m = re.exec(text)) !== null) vars.push(m[1].trim());
  return Array.from(new Set(vars));
}

function classify(content) {
  const len = content.trim().length;
  if (len < 180) return 'PromptPiece';
  return 'Prompt';
}

async function translateText(text, sourceLang, target = 'en') {
  const url = process.env.TRANSLATE_API_URL;
  if (!url) return { translated: text, used: false };
  try {
    const body = { q: text, source: sourceLang || 'auto', target };
    if (process.env.TRANSLATE_API_KEY) body.api_key = process.env.TRANSLATE_API_KEY;
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error('Translation failed: ' + res.statusText);
    const j = await res.json();
    // LibreTranslate returns { translatedText: '...' } or { translation: '...' } variations
    return { translated: j.translatedText || j.translated || j.translation || text, used: true };
  } catch (e) {
    console.warn('Translation error, continuing without translation:', e.message);
    return { translated: text, used: false };
  }
}

async function main() {
  console.log('Fetching README...');
  const content = await fetchRaw();

  // Use regex to split on level-2 headings while preserving title
  const parts = content.split(/\n##\s+/g).slice(1);
  const items = [];

  for (const part of parts) {
    const lines = part.split(/\r?\n/);
    const title = (lines[0] || '').trim();
    const bodyLines = lines.slice(1);
    const body = bodyLines.join('\n').trim();
    if (!title || !body) continue;
    if (body.length < 40) continue;

    // detect language
    const langCode = franc(body, { minLength: 10 });
    let detectedLang = 'und';
    try { detectedLang = langCode === 'und' ? 'und' : (langs.where('3', langCode) || {}).name || 'und'; } catch(e) { detectedLang = 'und'; }

    // extract variables
    const variables = extractVariables(title + '\n' + body);

    // classify
    const type = classify(body);

    // optional translate
    let translatedTitle = title;
    let translatedBody = body;
    let translationUsed = false;
    if (detectedLang !== 'und') {
      const iso2 = (() => { try { const l = langs.where('3', langCode); return (l && l['1']) || null; } catch(e){return null;} })();
      if (iso2 && iso2 !== 'en') {
        const t1 = await translateText(title, iso2, 'en');
        const t2 = await translateText(body, iso2, 'en');
        translatedTitle = t1.translated; translatedBody = t2.translated; translationUsed = t1.used || t2.used;
      }
    }

    const item = {
      id: uuid(),
      user_id: process.env.USER_ID || 'REPLACE_USER_ID',
      title: translatedTitle,
      original_title: title,
      description: translatedBody.replace(/\n/g, ' ').slice(0, 300),
      content: translatedBody,
      raw_content: body,
      model_target: 'UNIVERSAL',
      visibility: 'PUBLIC',
      variables,
      avg_rating: 0,
      rating_count: 0,
      fork_count: 0,
      use_count: 0,
      version_count: 1,
      type,
      detected_lang: detectedLang,
      translation_used: translationUsed,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    items.push(item);
  }

  if (!fs.existsSync('data')) fs.mkdirSync('data');
  fs.writeFileSync('data/claude_prompts_v2.json', JSON.stringify(items, null, 2));
  console.log('Wrote data/claude_prompts_v2.json with', items.length, 'items');

  // SQL template
  const sql = [];
  sql.push('-- prompts_insert_v2.sql\n-- Replace REPLACE_USER_ID with a real user id before running.');
  for (const it of items) {
    const id = it.id;
    const uid = it.user_id;
    const title = it.title.replace(/'/g, "''");
    const desc = it.description.replace(/'/g, "''");
    const contentEsc = it.content.replace(/'/g, "''");
    const now = it.created_at;
    const varsJson = "'[]'::jsonb";
    sql.push(`INSERT INTO "Prompt" (id, user_id, title, description, content, model_target, visibility, variables, avg_rating, rating_count, fork_count, use_count, version_count, created_at, updated_at) VALUES ('${id}', '${uid}', '${title}', '${desc}', '${contentEsc}', 'UNIVERSAL', 'PUBLIC', ${varsJson}, 0, 0, 0, 0, 1, '${now}', '${now}');`);
  }
  fs.writeFileSync('data/claude_prompts_v2_insert.sql', sql.join('\n'));
  console.log('Wrote data/claude_prompts_v2_insert.sql');

  // Summary
  const byType = items.reduce((a, it) => { a[it.type] = (a[it.type]||0)+1; return a; }, {});
  const langsCount = items.reduce((a, it) => { a[it.detected_lang] = (a[it.detected_lang]||0)+1; return a; }, {});
  fs.writeFileSync('data/claude_prompts_v2_summary.json', JSON.stringify({ total: items.length, byType, langs: langsCount }, null, 2));
  console.log('Wrote data/claude_prompts_v2_summary.json');

  console.log('\nDone. Next:');
  console.log('- Replace REPLACE_USER_ID in generated SQL or set USER_ID env when running script to produce correct user ids.');
  console.log('- If you want automatic translation, set TRANSLATE_API_URL (LibreTranslate-style endpoint) and optionally TRANSLATE_API_KEY.');
}

main().catch(err => { console.error(err); process.exit(1); });
