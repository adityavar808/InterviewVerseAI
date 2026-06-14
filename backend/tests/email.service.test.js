import test from "node:test";
import assert from "node:assert/strict";

import { normalizeEmailCredential } from "../src/services/email.service.js";

test("normalizes email credentials by removing whitespace", () => {
  assert.equal(
    normalizeEmailCredential(" nffa drbd fzjp btkx "),
    "nffadrbdfzjpbtkx",
  );
  assert.equal(normalizeEmailCredential(" test@example.com "), "test@example.com");
});
