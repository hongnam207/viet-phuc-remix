import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const model=await readFile(new URL('../assets/human.glb',import.meta.url));
const doc=JSON.parse(model.subarray(20,20+model.readUInt32LE(12)).toString());

test('Human model has embedded textures, both hairstyles and bounded geometry',()=>{
 assert.equal(model.toString('ascii',0,4),'glTF');
 assert.equal(model.readUInt32LE(4),2);
 assert.equal(model.readUInt32LE(8),model.length);
 assert.ok(model.length<10*1024*1024);
 assert.deepEqual(doc.nodes.map(n=>n.name),['Head','HandL','HandR','Eyes','HairLong','HairShort']);
 assert.equal(doc.images.length,4);
 assert.ok(doc.images.every(image=>Number.isInteger(image.bufferView)&&!image.uri));
 for(const mesh of doc.meshes){
  const primitive=mesh.primitives[0],pos=doc.accessors[primitive.attributes.POSITION];
  assert.ok(pos.count>100);
  assert.ok(pos.min.every(Number.isFinite)&&pos.max.every(Number.isFinite));
  assert.ok(Number.isInteger(primitive.indices));
  assert.ok(doc.materials[primitive.material].pbrMetallicRoughness.baseColorTexture);
 }
 assert.equal(doc.materials[2].alphaMode,'MASK');
 assert.equal(doc.materials[3].doubleSided,true);
});

test('Human model and retained CC0 sources match provenance checksums',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../assets/human-source/manifest.json',import.meta.url)));
 const hash=data=>createHash('sha256').update(data).digest('hex');
 assert.equal(manifest.license,'CC0-1.0');
 assert.equal(hash(model),manifest.generatedSHA256);
 for(const [name,expected] of Object.entries(manifest.sources)){
  assert.equal(hash(await readFile(new URL('../assets/human-source/'+name,import.meta.url))),expected,name);
 }
});
