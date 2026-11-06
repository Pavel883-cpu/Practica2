import test from "node:test";
import assert from "node:assert/strict";
import { loadTestGraph, buildGraph } from "../src/graph.js";
const sample = new URL("../test-repos/sample.json", import.meta.url).pathname;
const isolated = new URL("../test-repos/isolated.json", import.meta.url).pathname;
const invalid = new URL("../test-repos/invalid.json", import.meta.url).pathname;

test("читает тестовый граф", async () => {
  const graph = await loadTestGraph(sample);
  assert.deepEqual(graph.get("A"), ["B", "C"]);
});
test("BFS ограничивает глубину и сохраняет цикл", async () => {
  const graph = await buildGraph({ package: "A", repository: sample, testMode: true, maxDepth: 2 });
  assert.deepEqual([...graph.keys()].sort(), ["A", "B", "C", "D", "E"]);
  assert.deepEqual(graph.get("D"), ["A"]);
});
test("обрабатывает изолированный пакет", async () => {
  const graph = await buildGraph({ package: "A", repository: isolated, testMode: true, maxDepth: 3 });
  assert.deepEqual(graph.get("A"), []);
  assert.equal(graph.size, 1);
});
test("отклоняет некорректные имена узлов", async () => {
  await assert.rejects(loadTestGraph(invalid), /заглавных латинских букв/);
});
