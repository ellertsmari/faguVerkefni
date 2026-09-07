import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.FAGU_TEST_URL ?? "http://localhost:3011";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname),
  "These tests write only to a local test database, never the live Site.");

// Local requests simulate identity headers that the hosted dispatcher supplies.
const teacher = {
  "oai-authenticated-user-id": "local-test-teacher",
  "oai-authenticated-user-email": "ellertsmari@gmail.com",
};
const student = {
  "oai-authenticated-user-id": "local-test-student",
  "oai-authenticated-user-email": "student@example.invalid",
};
const readPublished = async () => {
  const response = await fetch(base + "/api/projects");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  return (await response.json()).projects;
};
const readEditor = async () => {
  const response = await fetch(base + "/api/teacher/projects", { headers: teacher });
  assert.equal(response.status, 200);
  return (await response.json()).records;
};
const save = (project, revision, action, identity = teacher, origin = base) =>
  fetch(base + "/api/teacher/projects", {
    method: "PUT",
    headers: { ...identity, Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify({ project, revision, action }),
  });

test("teacher drafts and publishing are shared, private, and concurrency-safe", async (t) => {
  const original = (await readPublished()).find((project) => project.number === 6);
  let current = (await readEditor()).find((record) => record.project.number === 6);
  const edited = structuredClone(original);
  edited.intro += " [Local editor integration test]";
  await t.test("anonymous readers see all eight projects without teacher data", async () => {
    assert.equal((await readPublished()).length, 8);
    const response = await fetch(base + "/api/teacher/projects");
    assert.equal(response.status, 403);
    assert.equal((await fetch(base + "/api/teacher/projects", { headers: student })).status, 403);
  });
  await t.test("anonymous and student mutations are rejected", async () => {
    assert.equal((await save(edited, current.revision, "publish", {})).status, 403);
    assert.equal((await save(edited, current.revision, "publish", student)).status, 403);
  });
  await t.test("cross-origin mutations are rejected", async () => {
    assert.equal((await save(edited, current.revision, "publish", teacher, "https://example.invalid")).status, 403);
  });
  await t.test("invalid content is rejected before saving", async () => {
    assert.equal((await save({ ...edited, title: "" }, current.revision, "publish")).status, 400);
    assert.equal((await save(edited, -1, "publish")).status, 400);
  });
  await t.test("saving a draft persists on another request but does not change student content", async () => {
    const response = await save(edited, current.revision, "draft");
    assert.equal(response.status, 200, await response.clone().text());
    const saved = await response.json();
    assert.ok(saved.hasDraft);
    assert.equal((await readPublished()).find((p) => p.number === 6).intro, original.intro);
    current = (await readEditor()).find((r) => r.project.number === 6);
    assert.equal(current.project.intro, edited.intro);
    assert.equal(current.revision, saved.revision);
  });
  await t.test("publishing changes the independently fetched student version", async () => {
    const response = await save(edited, current.revision, "publish");
    assert.equal(response.status, 200, await response.clone().text());
    const saved = await response.json();
    assert.equal(saved.hasDraft, false);
    assert.ok(saved.publishedAt);
    assert.equal((await readPublished()).find((p) => p.number === 6).intro, edited.intro);
  });
  await t.test("a stale editor cannot overwrite a newer version", async () => {
    assert.equal((await save(original, current.revision, "publish")).status, 409);
    assert.equal((await readPublished()).find((p) => p.number === 6).intro, edited.intro);
  });
  await t.test("teacher routes expose a sign-in prompt and protect the editor", async () => {
    const anonymous = await (await fetch(base + "/teacher")).text();
    assert.ok(anonymous.includes("/signin-with-chatgpt?return_to="));
    const denied = await (await fetch(base + "/teacher", { headers: student })).text();
    assert.ok(denied.includes("ekki kennaraaðgang"));
    const allowed = await (await fetch(base + "/teacher", { headers: teacher })).text();
    assert.ok(allowed.includes("Verkefnin þín"));
  });
  current = (await readEditor()).find((record) => record.project.number === 6);
  assert.equal((await save(original, current.revision, "publish")).status, 200);
});
