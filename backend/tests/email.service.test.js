import test from "node:test";
import assert from "node:assert/strict";

import { normalizeEmailCredential } from "../src/services/email.service.js";

test("normalizes email credentials by removing whitespace", () => {
  assert.equal(
    normalizeEmailCredential(" cwkz vwpx onko ttfs "),
    "cwkzvwpxonkottfs",
  );
  assert.equal(normalizeEmailCredential(" test@example.com "), "test@example.com");
});
