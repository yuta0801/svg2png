import { assertEquals } from "https://deno.land/std@0.77.0/testing/asserts.ts";
import { render } from "./mod.js";

Deno.test({
  name: "can render deno logo successfully",
  async fn() {
    const input = await Deno.readFile("./assets/deno.svg");
    const buf = new Uint8Array(64 * 1024);
    const size = render(input, buf);
    assertEquals(size, [0, 0, 0, 0, 0, 0, 214, 150]);
    const image = await Deno.readFile("./assets/deno.png");
    assertEquals(buf, image);
  },
});
