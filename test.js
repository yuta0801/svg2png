import { assertEquals } from "https://deno.land/std@0.77.0/testing/asserts.ts";
import { render } from "./mod.js";

Deno.test({
  name: "can render deno logo successfully",
  async fn() {
    const input = await Deno.readFile("./assets/deno.svg");
    const png = render(input);
    assertEquals(png.length, 54934);
    const image = await Deno.readFile("./assets/deno.png");
    assertEquals(png, image);
  },
});
