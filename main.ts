import { chmodSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

const WORD: string = "Who";
const OUT_DIR: string = "/output";
const OUT_PATH: string = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// The entry must be exactly one alphabetic word of at most 30 letters.
if (!/^[A-Za-z]{1,30}$/.test(WORD)) {
  fail("word must be a single alphabetic word of at most 30 letters");
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_PATH, WORD, { encoding: "utf8", mode: 0o644 });
chmodSync(OUT_PATH, 0o644);

// Read-back self-check: verify byte-exact content and mode.
const back: string = readFileSync(OUT_PATH, "utf8");
if (back !== WORD) {
  fail(
    `read-back mismatch: expected ${JSON.stringify(WORD)}, got ${JSON.stringify(back)}`,
  );
}
const mode: number = statSync(OUT_PATH).mode & 0o777;
if (mode !== 0o644) {
  fail(`read-back mode mismatch: expected 0644, got 0${mode.toString(8)}`);
}

console.log(`wrote ${JSON.stringify(WORD)} to ${OUT_PATH} (mode 0644, verified)`);
