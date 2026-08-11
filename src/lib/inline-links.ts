/** Inline editorial link markup: `[label](/article/slug)`. */
export const INLINE_LINK_RE = /\[([^\]]+)\]\((\/[^)\s]+|https?:\/\/[^)\s]+)\)/g;

/** Strips inline link markup for plain-text contexts (meta, schema, counts). */
export const plainText = (text: string) => text.replace(new RegExp(INLINE_LINK_RE), "$1");
