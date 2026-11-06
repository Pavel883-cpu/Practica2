import test from"node:test";import assert from"node:assert/strict";import{loadTestGraph,buildGraph}from"../src/graph.js";
const sample=new URL("../test-repos/sample.json",import.meta.url).pathname;const isolated=new URL("../test-repos/isolated.json",import.meta.url).pathname;
test("читает тестовый граф",async()=>{const g=await loadTestGraph(sample);assert.deepEqual(g.get("A"),["B","C"]);});
test("BFS ограничивает глубину и сохраняет цикл",async()=>{const g=await buildGraph({package:"A",repository:sample,testMode:true,maxDepth:2});assert.deepEqual([...g.keys()].sort(),["A","B","C","D","E"]);assert.deepEqual(g.get("D"),["A"]);});
test("обрабатывает изолированный пакет",async()=>{const g=await buildGraph({package:"A",repository:isolated,testMode:true,maxDepth:3});assert.deepEqual(g.get("A"),[]);assert.equal(g.size,1);});
test("отклоняет неизвестный формат узлов",async()=>{await assert.rejects(loadTestGraph(new URL("../test-repos/invalid.json",import.meta.url).pathname),/Не удалось прочитать/);});
