import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
await mkdir('public/vendor',{recursive:true});
const base='node_modules/@mediapipe/tasks-vision';
for(const f of ['vision_bundle.mjs','vision_wasm_internal.wasm','vision_wasm_internal.js','vision_wasm_nosimd_internal.wasm','vision_wasm_nosimd_internal.js']){
  await copyFile(join(base,f),join('public/vendor',f));
}
const url='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const r=await fetch(url);if(!r.ok)throw new Error('No se pudo obtener el modelo corporal durante el despliegue: '+r.status);
await writeFile('public/vendor/pose_landmarker_lite.task',Buffer.from(await r.arrayBuffer()));
await copyFile('index.html','public/index.html');
console.log('SV Performance Lab: modelo y motor incorporados en public/vendor');
