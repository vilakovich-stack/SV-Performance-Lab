import {mkdir,copyFile,writeFile,access} from 'node:fs/promises';
import {join} from 'node:path';
await mkdir('public/vendor',{recursive:true});
const base='node_modules/@mediapipe/tasks-vision';
for(const file of ['vision_bundle.mjs','vision_wasm_internal.wasm','vision_wasm_internal.js','vision_wasm_nosimd_internal.wasm','vision_wasm_nosimd_internal.js']){
  const candidates=[join(base,'wasm',file),join(base,file)];
  let copied=false;
  for(const src of candidates){try{await access(src);await copyFile(src,join('public/vendor',file));copied=true;break}catch(e){if(e.code!=='ENOENT')throw e}}
  if(!copied)throw new Error('Falta archivo MediaPipe: '+file+'; rutas revisadas: '+candidates.join(', '));
}
const url='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const response=await fetch(url);
if(!response.ok)throw new Error('Descarga del modelo fallida: HTTP '+response.status);
await writeFile('public/vendor/pose_landmarker_lite.task',Buffer.from(await response.arrayBuffer()));
await copyFile('index.html','public/index.html');
console.log('SV Performance Lab: recursos MediaPipe locales listos');
