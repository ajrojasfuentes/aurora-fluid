#!/usr/bin/env node
/**
 * Aurora Fluid — Build Script
 * Minifies aurora.css and aurora.js for production distribution.
 * Run: npm run build
 */

import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

function formatBytes(b) {
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`;
}

function report(name, original, minified) {
  const gz = gzipSync(minified).length;
  console.log(
    `  ${name.padEnd(20)} ${formatBytes(original.length).padStart(10)} → ${formatBytes(minified.length).padStart(10)}  (gzip: ${formatBytes(gz)})`
  );
}

console.log("\n⚡ Aurora Fluid — Building minified assets\n");

// --- JS ---
const jsOriginal = readFileSync("aurora.js", "utf8");
const jsResult = await build({
  entryPoints: ["aurora.js"],
  bundle: false,
  minify: true,
  format: "esm",
  write: false,
  target: "es2020",
});
const jsMin = jsResult.outputFiles[0].text;
writeFileSync("aurora.min.js", jsMin);
report("aurora.min.js", Buffer.from(jsOriginal), Buffer.from(jsMin));

// --- CSS ---
const cssOriginal = readFileSync("aurora.css", "utf8");
const cssResult = await build({
  entryPoints: ["aurora.css"],
  bundle: false,
  minify: true,
  write: false,
});
const cssMin = cssResult.outputFiles[0].text;
writeFileSync("aurora.min.css", cssMin);
report("aurora.min.css", Buffer.from(cssOriginal), Buffer.from(cssMin));

console.log("\n✅ Done\n");
