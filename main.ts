// Break Production, Own It — u-ricoxyz-break-production-own-it-be78a994
// Writes one brutally honest one-line confession to /output/entry.txt.
//
// Runtime guard: the gate only accepts UTF-8 text of 1-200 characters,
// a single line, not only whitespace. Validate before writing and verify
// the bytes on disk after writing, so a bad entry fails loudly here
// instead of silently reaching the judge.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "I shipped my Friday 5pm 'quick fix' straight to prod, dropped the users table, and the backup I swore we had was a screenshot.";

function validateEntry(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // Reject control characters other than the trailing newline we add.
  for (const ch of text) {
    if (ch.charCodeAt(0) < 0x20) {
      throw new Error(`entry contains control character U+${ch
        .charCodeAt(0)
        .toString(16)
        .padStart(4, "0")}`);
    }
  }
}

validateEntry(ENTRY);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY + "\n", "utf8");

// Verify what actually landed on disk, byte for byte.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== ENTRY + "\n") {
  throw new Error("verification failed: /output/entry.txt does not match ENTRY");
}
validateEntry(written.trimEnd());
