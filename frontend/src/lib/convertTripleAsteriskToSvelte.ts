/**
 * Convert a bespoke bilingual format into Svelte-friendly HTML.
 *
 * Supported patterns per paragraph/block:
 *  - "sv / en"  -> slash-separated bilingual line
 *  - "sv *** en" -> triple-asterisk bilingual line (can repeat in a block)
 *  - Monolingual lines are kept as <p>.
 *  - **bold** is converted to <strong>.
 *
 * Output is a string with semantic HTML you can drop into a Svelte component
 * via {@html convertTripleAsteriskToSvelte(input)} or render server-side.
 */
export default function convertTripleAsteriskToSvelte(input: string): string {
  const NL = /\r?\n/;
  const blocks = input
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/) // paragraph-ish blocks
    .map(b => b.trim())
    .filter(Boolean);

  const html: string[] = [];

  for (const raw of blocks) {
    // 1. Detect bold-wrapped bilingual block (two lines inside ** ... **)
    if (/^\*\*[\s\S]+\*\*$/.test(raw) && raw.includes("\n")) {
      const inner = raw.slice(2, -2).trim();
      const [sv, en] = inner.split(/\n+/).map(s => s.trim());
      if (sv && en) {
        html.push(bilingualBlock(
          `<strong>${escapeHtml(sv)}</strong>`,
          `<strong>${escapeHtml(en)}</strong>`
        ));
        continue;
      }
    }

    // 2. Detect block-level bold (single block wrapped in ** ... **)
    if (raw.startsWith("**") && raw.endsWith("**")) {
      const inner = raw.slice(2, -2).trim();
      html.push(`<p><strong>${escapeHtml(inner)}</strong></p>`);
      continue;
    }

    // 3. Existing *** handling
    const partsByStars = raw.split(/\s*\*\*\*\s*/).map(s => s.trim()).filter(Boolean);

    // 4. Existing slash-pair handling
    const slashPair = splitSlashPair(raw);

    if (partsByStars.length >= 2) {
      for (let i = 0; i + 1 < partsByStars.length; i += 2) {
        const sv = cleanInline(partsByStars[i]);
        const en = cleanInline(partsByStars[i + 1]);
        html.push(bilingualBlock(sv, en));
      }
      if (partsByStars.length % 2 === 1) {
        html.push(`<p>${escapeHtml(cleanInline(partsByStars.at(-1)!))}</p>`);
      }
      continue;
    }

    if (slashPair) {
      const [sv, en] = slashPair;
      html.push(bilingualBlock(cleanInline(sv), cleanInline(en)));
      continue;
    }

    // 5. Fallback
    const lines = raw.split(NL).map(line => line.trim()).filter(Boolean);
    const body = lines.map(line => escapeHtml(applyBold(line))).join("<br>");
    html.push(`<p>${body}</p>`);
  }

  // Wrap in a container for styling hooks.
  return `<div class="bilingual rich-text">${html.join("\n")}</div>`;
}

/** Convert **bold** to <strong> and trim stray whitespace */
function applyBold(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
    const inner = trimmed.slice(2, -2).trim();
    return `<strong>${escapeHtml(inner)}</strong>`;
  }
  // otherwise fall back to inline replacement
  return trimmed.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${escapeHtml(m)}</strong>`);
}

function applyBoldBlock(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
    // Remove the leading/trailing `**`
    const inner = trimmed.slice(2, -2).trim();
    return `<strong>${escapeHtml(inner)}</strong>`;
  }
  return escapeHtml(trimmed);
}

/** Escape HTML special characters. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Clean inline formatting then allow <strong> while escaping everything else. */
function cleanInline(text: string): string {
  // First apply bold to produce <strong> tags around **...**
  const withBold = applyBold(text);
  // Escape any remaining HTML-like chars that were not produced by us
  // Safely re-allow <strong> tags by temporary tokens
  const tokenOpen = "__STRONG_OPEN__";
  const tokenClose = "__STRONG_CLOSE__";
  const tokenized = withBold.replace(/<strong>/g, tokenOpen).replace(/<\/strong>/g, tokenClose);
  const escaped = escapeHtml(tokenized);
  return escaped.replace(new RegExp(tokenOpen, "g"), "<strong>").replace(new RegExp(tokenClose, "g"), "</strong>");
}

/** Detect and split a single-line "sv / en" pair, else null. */
function splitSlashPair(text: string): [string, string] | null {
  // Only treat as bilingual if exactly one slash separator that looks like a language divider
  // Allow spaces around slash.
  const m = text.match(/^(.+?)\s*\/\s*(.+)$/s);
  if (!m) return null;
  const left = m[1].trim();
  const right = m[2].trim();
  if (!left || !right) return null;
  return [left, right];
}

/** Compose a bilingual HTML block. */
function bilingualBlock(sv: string, en: string): string {
  return (
    `<section class="bilingual-block">` +
    `<p class="sv" lang="sv">${sv}</p>` +
    `<p class="en" lang="en">${en}</p>` +
    `</section>`
  );
}

// --- Example Svelte usage ---
// <script lang="ts">
//   import { convertTripleAsteriskToSvelte } from "./triple-asterisk-to-svelte";
//   export let source: string;
//   $: html = convertTripleAsteriskToSvelte(source);
// </script>
// <div class="prose max-w-none" {@html html}></div>
//
// /* Optional styles (global or component-scoped) */
// <style>
//   .bilingual-block { margin: 0 0 1rem 0; }
//   .bilingual-block .sv { margin: 0 0 .25rem 0; font-weight: 600; }
//   .bilingual-block .en { margin: 0; opacity: .9; }
//   .rich-text p { margin: 0 0 .75rem 0; }
// </style>
