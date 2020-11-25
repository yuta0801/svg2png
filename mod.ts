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
// @ts-ignore Deno.core still doesn't have type definition
const { renderOp: renderOpId } = Deno.core.ops();

export function render(svg: string | Uint8Array) {
  const input = convertStringToArrayBuffer(svg);
  // @ts-ignore same as above
  const png = Deno.core.dispatch(renderOpId, input);
  if (!png) throw new Error("Failed to render svg");
  return png;
}

function convertStringToArrayBuffer(svg: string | Uint8Array) {
  if (typeof svg !== "string") return svg;
  return new TextEncoder().encode(svg);
}
