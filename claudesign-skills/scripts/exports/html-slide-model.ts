import fs from 'node:fs/promises';

import { resolveProjectPath } from '../runtime/path-safety.js';

export type SlideContent = {
  index: number;
  label: string;
  title: string;
  body: string[];
  notes?: string;
};

function stripTags(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|section|li|h1|h2|h3|h4|ul|ol)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function firstMatch(source: string, pattern: RegExp) {
  return source.match(pattern)?.[1]?.trim();
}

function parseSpeakerNotes(html: string) {
  const rawJson = firstMatch(
    html,
    /<script[^>]+id=["']speaker-notes["'][^>]*>([\s\S]*?)<\/script>/i
  );

  if (!rawJson) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawJson) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item));
    }

    if (parsed && typeof parsed === 'object') {
      return Object.values(parsed).map((item) => String(item));
    }
  } catch {
    return [];
  }

  return [];
}

function parseSlideBlocks(html: string) {
  const deckInner =
    firstMatch(html, /<deck-stage[^>]*>([\s\S]*?)<\/deck-stage>/i) ??
    firstMatch(html, /<main[^>]*>([\s\S]*?)<\/main>/i) ??
    firstMatch(html, /<body[^>]*>([\s\S]*?)<\/body>/i) ??
    html;

  const sectionMatches = [...deckInner.matchAll(/<section([^>]*)>([\s\S]*?)<\/section>/gi)];

  if (sectionMatches.length === 0) {
    return [{ attributes: '', content: deckInner }];
  }

  return sectionMatches.map((match) => ({
    attributes: match[1] ?? '',
    content: match[2] ?? ''
  }));
}

function buildSlideContent(attributes: string, content: string, index: number, notes?: string): SlideContent {
  const title =
    firstMatch(content, /<h1[^>]*>([\s\S]*?)<\/h1>/i) ??
    firstMatch(content, /<h2[^>]*>([\s\S]*?)<\/h2>/i) ??
    firstMatch(content, /<h3[^>]*>([\s\S]*?)<\/h3>/i) ??
    `Slide ${index + 1}`;
  const label =
    firstMatch(attributes, /data-screen-label=["']([^"']+)["']/i) ??
    `${String(index + 1).padStart(2, '0')} ${title}`;
  const lines = stripTags(content)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const body = lines.filter((line) => line !== title).slice(0, 8);

  return {
    index,
    label,
    title: stripTags(title),
    body,
    notes
  };
}

export async function extractSlidesFromHtml(htmlPath: string) {
  const absoluteHtmlPath = resolveProjectPath(htmlPath, 'Export HTML path');
  const html = await fs.readFile(absoluteHtmlPath, 'utf8');
  const notes = parseSpeakerNotes(html);
  const slides = parseSlideBlocks(html).map((block, index) =>
    buildSlideContent(block.attributes, block.content, index, notes[index])
  );

  return {
    absoluteHtmlPath,
    slides
  };
}
