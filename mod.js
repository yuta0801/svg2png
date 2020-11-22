var pluginPath = [
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
var pluginId = Deno.openPlugin(pluginPath);
var { asyncOp: asyncOpId, syncOp: syncOpId } = Deno.core.ops();

export function syncOpWrapper(zeroCopy) {
  return Deno.core.dispatch(syncOpId, zeroCopy);
}

export function asyncOpWrapper(zeroCopy) {
  return new Promise(function (resolve, reject) {
    try {
      Deno.core.setAsyncHandler(asyncOpId, resolve);
      Deno.core.dispatch(asyncOpId, zeroCopy);
    } catch (err) {
      return reject(err);
    }
  });
}
