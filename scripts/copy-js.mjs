// Copies the plain (non-module) scripts into dist/js after the Vite build.
// These live in js/ and are referenced by classic <script src="js/..."> tags,
// which Vite doesn't touch or bundle -- it only processes type="module"
// scripts and asset references (img/link). Node's fs.cpSync is used
// instead of a shell `cp` so this runs identically on Windows/Mac/Linux.
import { cpSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, "js");
const dest = join(root, "dist", "js");

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("Copied js/ -> dist/js/");
