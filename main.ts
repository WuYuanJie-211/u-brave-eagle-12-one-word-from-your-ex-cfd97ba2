import * as fs from "fs";

const WORD = "Renamed";
const OUT = "/output/entry.txt";

// Gate: exactly one word, letters only, at most 30 characters.
// Anything else is refused before any file is touched.
if (WORD.length === 0 || WORD.length > 30) {
  throw new Error("entry word must be 1-30 characters: " + JSON.stringify(WORD));
}
if (!/^[A-Za-z]+$/.test(WORD)) {
  throw new Error("entry must be exactly one alphabetic word: " + JSON.stringify(WORD));
}

fs.writeFileSync(OUT, WORD, { mode: 0o644 });
fs.chmodSync(OUT, 0o644);

// Read-back check: content must match byte for byte, mode must be 0644.
const back = fs.readFileSync(OUT, "utf8");
if (back !== WORD) {
  throw new Error("read-back mismatch: " + JSON.stringify(back));
}
if (Buffer.byteLength(back, "utf8") !== WORD.length) {
  throw new Error("read-back byte length mismatch: " + Buffer.byteLength(back, "utf8"));
}
if ((fs.statSync(OUT).mode & 0o777) !== 0o644) {
  throw new Error("output mode is not 0644");
}

console.log("wrote entry: " + WORD + " (" + WORD.length + " chars) -> " + OUT);
