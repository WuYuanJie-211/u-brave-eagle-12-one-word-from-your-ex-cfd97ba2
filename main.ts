import { chmodSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

// Why "Rebound": the prompt asks for the one word an ex would use to
// describe you, and "Rebound" is the whole story in a single noun — you
// were never the destination, only the comfort stop on the way to
// someone else. It is funny because it is a self-own, and it stings
// because it is honest: you were used to get over somebody else.
const WORD: string = "Rebound";
const OUT_DIR: string = "/output";
const OUT_PATH: string = "/output/entry.txt";

function die(message: string): never {
  console.error(`entry failed: ${message}`);
  process.exit(1);
}

function assertSingleWord(word: string): void {
  // Exactly one alphabetic word, 1-30 letters: no spaces, punctuation,
  // digits, or trailing newline can smuggle itself in.
  if (!/^[A-Za-z]{1,30}$/.test(word)) {
    die(`word must be 1-30 letters with nothing else, got ${JSON.stringify(word)}`);
  }
}

function writeEntry(): void {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_PATH, WORD, { encoding: "utf8", mode: 0o644 });
  chmodSync(OUT_PATH, 0o644);
}

function verifyEntry(): void {
  // Size gate first: the file must hold exactly the word's bytes, so a
  // trailing newline or any extra byte fails here before content compare.
  const expected: Buffer = Buffer.from(WORD, "utf8");
  const size: number = statSync(OUT_PATH).size;
  if (size !== expected.length) {
    die(`read-back size is ${size} bytes, expected ${expected.length} for ${JSON.stringify(WORD)}`);
  }
  // Byte-exact read-back: compare raw bytes, not decoded text, so a
  // trailing newline or any hidden byte fails even if it looks the same.
  const actual: Buffer = readFileSync(OUT_PATH);
  if (!actual.equals(expected)) {
    die(
      `read-back bytes differ: expected ${JSON.stringify(WORD)} (${expected.length} bytes), ` +
        `got ${JSON.stringify(actual.toString("utf8"))} (${actual.length} bytes)`,
    );
  }
  const mode: number = statSync(OUT_PATH).mode & 0o777;
  if (mode !== 0o644) {
    die(`read-back mode is 0${mode.toString(8)}, expected 0644`);
  }
}

assertSingleWord(WORD);
writeEntry();
verifyEntry();

console.log(`wrote ${JSON.stringify(WORD)} to ${OUT_PATH} (mode 0644, byte-verified)`);
