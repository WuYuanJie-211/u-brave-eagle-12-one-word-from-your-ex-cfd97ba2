import * as fs from "fs";

const WORD = "Forgettable";
const OUT = "/output/entry.txt";

// Gate: the competition takes exactly one word and nothing else — refuse
// to write anything that is not a single whitespace-free word.
if (!/^[A-Za-z]+$/.test(WORD)) {
  throw new Error("entry must be exactly one word: " + JSON.stringify(WORD));
}

fs.writeFileSync(OUT, WORD, { mode: 0o644 });
fs.chmodSync(OUT, 0o644);

// Read-back check: byte-exact content, world-readable mode.
const back = fs.readFileSync(OUT, "utf8");
if (back !== WORD) {
  throw new Error("read-back mismatch: " + JSON.stringify(back));
}
if ((fs.statSync(OUT).mode & 0o777) !== 0o644) {
  throw new Error("output mode is not 0644");
}
