import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import * as lucide from "lucide-react";

const exports = new Set(Object.keys(lucide));
const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(tsx|ts)$/.test(full)) files.push(full);
  }
})(process.argv[2]);

const missing = new Map();
for (const file of files) {
  const src = readFileSync(file, "utf8");
  const re = /import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']/g;
  let m;
  while ((m = re.exec(src))) {
    for (const raw of m[1].split(",")) {
      const name = raw.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim();
      if (!name) continue;
      if (!exports.has(name)) {
        if (!missing.has(name)) missing.set(name, []);
        missing.get(name).push(file.replace(process.argv[2] + "/", ""));
      }
    }
  }
}

if (missing.size === 0) console.log("OK: all lucide icons resolve");
else for (const [name, where] of missing) console.log(`MISSING ${name} -> ${[...new Set(where)].join(", ")}`);
