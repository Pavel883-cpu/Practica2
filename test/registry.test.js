import test from "node:test";
import assert from "node:assert/strict";
import { getPackageDependencies } from "../src/registry.js";
test("извлекает обычные и optional зависимости выбранной версии", async () => {
 const original=globalThis.fetch;
 globalThis.fetch=async()=>({ok:true,json:async()=>({"dist-tags":{latest:"1.2.0"},versions:{"1.2.0":{dependencies:{alpha:"^1"},optionalDependencies:{beta:"~2"}}}})});
 try { const result=await getPackageDependencies("https://registry.npmjs.org","demo","latest"); assert.equal(result.version,"1.2.0"); assert.deepEqual(result.dependencies,{alpha:"^1",beta:"~2"}); }
 finally { globalThis.fetch=original; }
});
