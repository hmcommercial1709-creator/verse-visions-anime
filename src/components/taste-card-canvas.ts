/**
 * Draws the shareable card onto a canvas and hands back a PNG.
 *
 * Text only, deliberately. Cover art lives on other origins, and drawing a
 * cross-origin image taints the canvas — toDataURL then throws a SecurityError
 * and the download button silently does nothing. A card that always saves beats
 * a prettier one that fails on some picks.
 *
 * 1200x630 is the Open Graph ratio, so the same bitmap looks right posted to
 * X, Discord or WhatsApp without being recropped.
 */

import type { CardInsight, CardPick } from "@/lib/gamer-card";

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

const BG = "#0b0f1a";
const PANEL = "#121a2b";
const ACCENT = "#22d3ee";
const TEXT = "#f8fafc";
const MUTED = "#94a3b8";

const font = (size: number, weight = "600") =>
  `${weight} ${size}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`;

/** Trims to fit a width, with an ellipsis, so long titles never overflow. */
function fit(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return `${cut}…`;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawTasteCard(
  canvas: HTMLCanvasElement,
  { picks, cardInsights, title }: { picks: CardPick[]; cardInsights: CardInsight[]; title: string },
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const bg = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  bg.addColorStop(0, BG);
  bg.addColorStop(1, "#131c30");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, 0, CARD_WIDTH, 6);

  ctx.fillStyle = TEXT;
  ctx.font = font(46, "800");
  ctx.fillText(fit(ctx, title, CARD_WIDTH - 120), 60, 108);

  ctx.fillStyle = MUTED;
  ctx.font = font(22, "500");
  ctx.fillText(`${picks.length} picks · computed from the GameCastle catalog`, 60, 146);

  // Picks column
  ctx.font = font(26, "600");
  let y = 214;
  for (const pick of picks.slice(0, 6)) {
    ctx.fillStyle = ACCENT;
    ctx.beginPath();
    ctx.arc(72, y - 9, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = TEXT;
    ctx.fillText(fit(ctx, pick.name, 470), 94, y);
    y += 48;
  }

  // Insight panel
  const panelX = 620;
  roundedRect(ctx, panelX, 190, CARD_WIDTH - panelX - 60, 340, 18);
  ctx.fillStyle = PANEL;
  ctx.fill();

  let iy = 238;
  for (const insight of cardInsights.slice(0, 4)) {
    ctx.fillStyle = MUTED;
    ctx.font = font(18, "600");
    ctx.fillText(insight.label.toUpperCase(), panelX + 34, iy);
    ctx.fillStyle = TEXT;
    ctx.font = font(30, "700");
    ctx.fillText(fit(ctx, insight.value, CARD_WIDTH - panelX - 128), panelX + 34, iy + 38);
    iy += 82;
  }

  ctx.fillStyle = MUTED;
  ctx.font = font(22, "600");
  ctx.fillText("gamecastle.store", 60, CARD_HEIGHT - 48);
}

/** Saves the canvas as a PNG. Returns false when the browser refuses. */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): boolean {
  try {
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
  } catch {
    return false;
  }
}

/**
 * The card as a File, for the native share sheet.
 *
 * toBlob rather than toDataURL: a 1200x630 PNG base64-encodes to roughly a
 * megabyte of string, and navigator.share wants a File anyway. Resolves null
 * when the browser refuses — a tainted canvas, or no toBlob at all — so the
 * caller hides the image-share button instead of offering one that fails.
 */
export function canvasToFile(canvas: HTMLCanvasElement, filename: string): Promise<File | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        resolve(new File([blob], filename, { type: "image/png" }));
      }, "image/png");
    } catch {
      resolve(null);
    }
  });
}
