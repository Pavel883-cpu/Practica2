import test from"node:test";import assert from"node:assert/strict";import{parseArgs}from"../src/cli.js";
test("разбирает параметры CLI",()=>{const o=parseArgs(["--package","A","--test-mode","--repository","test-repos/sample.json","--max-depth","2"]);assert.equal(o.package,"A");assert.equal(o.maxDepth,2);assert.equal(o.testMode,true);});
test("проверяет обязательные и числовые параметры",()=>{assert.throws(()=>parseArgs([]),/--package/);assert.throws(()=>parseArgs(["--package","A","--max-depth","-1"]),/целым числом/);});
test("отклоняет неизвестные и повторные параметры",()=>{assert.throws(()=>parseArgs(["--package","A","--wat"]),/Неизвестный/);assert.throws(()=>parseArgs(["--package","A","--package","B"]),/повторно/);});
