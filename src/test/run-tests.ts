import assert from "node:assert/strict";
import { getServiceStatus } from "../lib";

function testGetServiceStatus() {
  const v = "1.2.3";
  const s = getServiceStatus(v);
  assert.equal(s.status, "ok");
  assert.equal(typeof s.uptime, "number");
  assert.equal(s.version, v);
}

function runAll() {
  testGetServiceStatus();
  console.log("All tests passed");
}

runAll();
