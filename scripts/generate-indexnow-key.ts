import { existsSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const publicDirectory = join(process.cwd(), "public");
const key = process.env.INDEXNOW_KEY?.trim();
const keyPattern = /^[A-Za-z0-9_-]{8,128}$/;

if (!key) {
  console.warn("IndexNow verification file skipped: INDEXNOW_KEY is not configured.");
  process.exit(0);
}

if (!keyPattern.test(key)) {
  throw new Error("INDEXNOW_KEY must contain only letters, numbers, hyphens, or underscores and be 8-128 characters long.");
}

const filename = `${key}.txt`;
const target = join(publicDirectory, filename);

if (!existsSync(publicDirectory)) throw new Error(`Public directory does not exist: ${publicDirectory}`);

for (const entry of readdirSync(publicDirectory)) {
  if (/^[A-Za-z0-9_-]{8,128}\.txt$/.test(entry) && entry !== filename) {
    unlinkSync(join(publicDirectory, entry));
  }
}

writeFileSync(target, `${key}\n`, "utf8");
console.log(`IndexNow verification file generated: public/${filename}`);
