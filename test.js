import { assertEquals } from "https://deno.land/std@0.77.0/testing/asserts.ts";
import { asyncOpWrapper, syncOpWrapper } from "./mod.js";

Deno.test({
  name: "invoking a sync op from a native plugin",
  fn() {
    var zeroCopy = new Uint8Array(4);
    // NOTE: the sync op stub showcases how to not return a value aka undefined
    // it mutates zeroCopy though and writes an enlightening message to it
    var returnValue = syncOpWrapper(zeroCopy);
    assertEquals(returnValue, undefined);
    assertEquals(new TextDecoder().decode(zeroCopy), "ACAB");
  },
});

Deno.test({
  name: "invoking an async op from a native plugin",
  async fn() {
    var zeroCopy = crypto.getRandomValues(new Uint8Array(4));
    var buf = await asyncOpWrapper(zeroCopy);
    assertEquals(new TextDecoder().decode(buf), "ACAB");
  },
});
