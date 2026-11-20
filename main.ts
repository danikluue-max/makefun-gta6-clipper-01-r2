// gta6-clipper-01, round 2 — the hand-over program (Node 22, stdlib only).
//
// The clip is the entry, not this file: the house reads the video's views
// straight from YouTube and ranks on them. This program's only job is to
// carry VIDEO.json from the repository root into the output directory the
// gate reads, byte for byte, after proving the address inside it really
// names a YouTube video. It never touches the network and never edits
// anything: the bytes that go in are the bytes that come out.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader's container MAKEFUN_BOT_DIR is /bot and
// MAKEFUN_OUTPUT_DIR is /output; the fallbacks below mirror that.

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The descriptor every clipper entry ships, and the gate's size cap on it.
const DESCRIPTOR = "VIDEO.json";
const MAX_DESCRIPTOR_BYTES = 16384;

// A YouTube video id: exactly 11 letters, digits, "_" or "-".
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

type Folders = { sourceDir: string; targetDir: string };

function folders(): Folders {
  return {
    sourceDir: process.env.MAKEFUN_BOT_DIR ?? "/bot",
    targetDir: process.env.MAKEFUN_OUTPUT_DIR ?? "/output",
  };
}

function abort(reason: string): never {
  console.error(`gta6-clipper-01 round 2: ${reason}`);
  process.exit(1);
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// Read the descriptor as text, refusing anything over the gate's cap.
function readDescriptorText(dir: string): string {
  const path = join(dir, DESCRIPTOR);
  let size: number;
  try {
    size = statSync(path).size;
  } catch (error) {
    abort(`cannot stat ${path}: ${describe(error)}`);
  }
  if (size > MAX_DESCRIPTOR_BYTES) {
    abort(`${DESCRIPTOR} is ${size} bytes, over the ${MAX_DESCRIPTOR_BYTES} cap`);
  }
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    abort(`cannot read ${path}: ${describe(error)}`);
  }
}

// Pull the 11-character video id out of a YouTube address, or null when the
// address is not one of the three shapes the gate accepts:
//   https://www.youtube.com/shorts/<id>   (www. / m. / bare host)
//   https://www.youtube.com/watch?v=<id>
//   https://youtu.be/<id>
// Anything after the id (a query, a fragment, a trailing slash) is ignored.
function videoId(address: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(address);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:") return null;
  const host = parsed.hostname.toLowerCase();
  let candidate: string | null = null;
  if (host === "youtu.be") {
    candidate = parsed.pathname.slice(1).split("/")[0] ?? null;
  } else if (
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com"
  ) {
    if (parsed.pathname.startsWith("/shorts/")) {
      candidate = parsed.pathname.slice("/shorts/".length).split("/")[0] ?? null;
    } else if (parsed.pathname === "/watch") {
      candidate = parsed.searchParams.get("v");
    }
  }
  return candidate !== null && VIDEO_ID.test(candidate) ? candidate : null;
}

function main(): void {
  const { sourceDir, targetDir } = folders();
  const text = readDescriptorText(sourceDir);

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    abort(`${DESCRIPTOR} is not valid JSON`);
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    abort(`${DESCRIPTOR} must be a JSON object`);
  }
  // The descriptor is exactly one key: anything extra (or a missing "url")
  // would pass local validation yet fail the gate, so reject it here.
  const keys = Object.keys(data as Record<string, unknown>);
  if (keys.length !== 1 || keys[0] !== "url") {
    abort(`${DESCRIPTOR} must hold only the "url" key`);
  }
  const url = (data as Record<string, unknown>).url;
  if (typeof url !== "string") {
    abort(`${DESCRIPTOR} must hold a string "url"`);
  }
  const id = videoId(url);
  if (id === null) {
    abort(`"url" is not a YouTube video address: ${url}`);
  }

  mkdirSync(targetDir, { recursive: true });
  const target = join(targetDir, DESCRIPTOR);
  try {
    writeFileSync(target, text, "utf8");
  } catch (error) {
    abort(`cannot write ${target}: ${describe(error)}`);
  }
  console.log(`gta6-clipper-01 round 2: handed over ${target} (video ${id})`);
}

main();
