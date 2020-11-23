import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.78.0/path/mod.ts";

const pluginPath = join(
  dirname(fromFileUrl(import.meta.url)),
  "target",
  "debug",
  (Deno.build.os + "" === "windows" ? "" : "lib") +
    "svg2png".replace(/-/g, "_") +
    (Deno.build.os + "" === "windows"
      ? ".dll"
      : Deno.build.os + "" === "darwin"
      ? ".dylib"
      : ".so"),
);

// NOTE: Deno.close(pluginId) once u r done
const pluginId = Deno.openPlugin(pluginPath);
const { renderOp: renderOpId } = Deno.core.ops();

export function render(svg, buffer = new Uint8Array(64 * 1024)) {
  const input = convertStringToArrayBuffer(svg);
  const res = Deno.core.dispatch(renderOpId, input, buffer);
  if (!res) throw new Error("Failed to render svg");
  const size = convertU64BytesToNumber(res);
  return buffer.slice(0, size);
}

function convertStringToArrayBuffer(svg) {
  if (typeof svg !== "string") return svg;
  return new TextEncoder().encode(svg);
}

function convertU64BytesToNumber(bytes) {
  const arr = new Uint8Array(bytes);
  const view = new DataView(arr.buffer);
  const bigint = view.getBigUint64(0);
  if (bigint > Number.MAX_SAFE_INTEGER) {
    throw new Error(`Cannot represent ${bigint} as Number safely`);
  }
  return Number(bigint);
}
