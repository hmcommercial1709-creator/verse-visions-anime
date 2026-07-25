const WPM = 225;

export function wordCount(parts: string[]) {
  return parts.reduce((n, p) => n + p.trim().split(/\s+/).filter(Boolean).length, 0);
}

export function readingMinutes(parts: string[]) {
  return Math.max(1, Math.round(wordCount(parts) / WPM));
}

export function readingLabel(parts: string[]) {
  return `${readingMinutes(parts)} min read`;
}

export type DerivedSection = { id: string; heading: string; paragraphs: string[] };

function titleFrom(paragraph: string) {
  const firstSentence = paragraph.split(/(?<=[.!?])\s/)[0] ?? paragraph;
  const words = firstSentence.replace(/[.,!?;:—]+$/, "").split(/\s+/).slice(0, 7);
  const text = words.join(" ");
  return text.length > 62 ? `${text.slice(0, 62)}…` : text;
}

export function slugifyHeading(text: string, index: number) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 48);
  return `${base || "section"}-${index + 1}`;
}

/** Splits a flat paragraph body into navigable sections for the table of contents. */
export function deriveSections(body: string[], perSection = 2): DerivedSection[] {
  const sections: DerivedSection[] = [];
  for (let i = 0; i < body.length; i += perSection) {
    const paragraphs = body.slice(i, i + perSection);
    const heading = titleFrom(paragraphs[0]);
    sections.push({ id: slugifyHeading(heading, sections.length), heading, paragraphs });
  }
  return sections;
}
