const pluginPath = [
  "target",
  "debug",
  (Deno.build.os + "" === "windows" ? "" : "lib") +
  "svg2png".replace(/-/g, "_") +
  (Deno.build.os + "" === "windows"
    ? ".dll"
    : Deno.build.os + "" === "darwin"
    ? ".dylib"
    : ".so"),
].join("/");

// NOTE: Deno.close(pluginId) once u r done
const pluginId = Deno.openPlugin(pluginPath);
const { renderOp: renderOpId } = Deno.core.ops();

export function render(input, buffer) {
  return Deno.core.dispatch(renderOpId, input, buffer);
}
