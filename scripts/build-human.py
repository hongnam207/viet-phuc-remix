"""Bake CC0 MakeHuman assets into a small self-contained, clothed-preview component GLB.
Run: PYTHONPATH=dist/pytools python scripts/build-human.py (numpy + Pillow).
The original basemesh is retained under assets/human-source; only exposed skin is packaged.
"""
from pathlib import Path
import json,math,struct,io,hashlib
import numpy as np
from PIL import Image
SRC=Path('assets/human-source')
def obj(path):
 v=[];uv=[];faces=[];group=''
 for line in path.read_text().splitlines():
  a=line.split()
  if not a:continue
  if a[0]=='v':v.append([float(x) for x in a[1:4]])
  elif a[0]=='vt':uv.append([float(x) for x in a[1:3]])
  elif a[0]=='g':group=' '.join(a[1:])
  elif a[0]=='f':faces.append((group,[(int(x.split('/')[0])-1,int(x.split('/')[1])-1) for x in a[1:]]))
 return np.array(v),np.array(uv),faces
base,uv,faces=obj(SRC/'base.obj')
for name in ['asian-female-young.target','universal-female-young-averagemuscle-averageweight.target']:
 for line in (SRC/name).read_text().splitlines():
  a=line.split()
  if a and not a[0].startswith('#'):base[int(a[0])]+=np.array([float(x) for x in a[1:4]])
bottom=float(base[:13380,1].min());scale=1.84/(base[:13380,1].max()-bottom)
sk=json.loads((SRC/'default.mhskel').read_text());joint=lambda name:base[sk['joints'][name]].mean(axis=0)
zcenter=joint(sk['bones']['head']['head'])[2]
def normalise(v):return (v-np.array([0,bottom,zcenter]))*scale
normal=normalise(base)
weights=json.loads((SRC/'default_weights.mhw').read_text())['weights']
hand_sets={side:set(i for name,entries in weights.items() if name.endswith('.'+side) and (name.startswith('finger') or name.startswith('wrist')) for i,w in entries if w>.35) for side in ['L','R']}
parts=[]
for name,side in [('Head',None),('HandL','L'),('HandR','R')]:
 selected=[]
 for group,f in faces:
  if group!='body':continue
  ids=[i for i,t in f]
  if side is None:keep=min(normal[i,1] for i in ids)>1.575
  else:keep=all(i in hand_sets[side] for i in ids)
  if keep:selected.append(f)
 pos=normal.copy()
 if side is None:
  neck=np.clip((pos[:,1]-1.58)/.065,0,1)
  pos[:,0]*=.8+.2*neck
  pos[:,2]=pos[:,2]*(.60+.40*neck)+.006*(1-neck)
 if side:
  origin=normalise(joint(sk['bones']['wrist.'+side]['head']));pos-=origin
  # Rotate the relaxed hand slightly toward the body, from the source A pose.
  a=-.22 if side=='L' else .22;c=math.cos(a);s=math.sin(a)
  pos=pos@np.array([[c,s,0],[-s,c,0],[0,0,1]])
 parts.append((name,pos,uv,selected,0,True))
def proxy(name):
 v,uv,f=obj(SRC/(name+'.obj'));lines=(SRC/(name+'.mhclo')).read_text().splitlines();out=[];factors=np.ones(3)
 for line in lines:
  a=line.split()
  if a and a[0] in ['x_scale','y_scale','z_scale']:
   axis={'x_scale':0,'y_scale':1,'z_scale':2}[a[0]];factors[axis]=abs(base[int(a[1]),axis]-base[int(a[2]),axis])/float(a[3])
 active=False
 for line in lines:
  a=line.split()
  if a and a[0]=='verts':active=True;continue
  if not active or not a:continue
  try:
   if len(a)==9:
    ids=[int(x) for x in a[:3]];w=np.array([float(x) for x in a[3:6]]);offset=np.array([float(x) for x in a[6:9]])*factors
    out.append((base[ids]*w[:,None]).sum(axis=0)+offset)
   elif len(a)==1:out.append(base[int(a[0])])
  except ValueError:pass
 if len(out)!=len(v):raise ValueError((name,len(out),len(v)))
 return normalise(np.array(out)),uv,[x[1] for x in f]
for name,mat in [('eyes',1),('long01',2),('bob01',3)]:
 p,u,f=proxy(name);parts.append(({'eyes':'Eyes','long01':'HairLong','bob01':'HairShort'}[name],p,u,f,mat,False))
# Subdivide the actual skin topology once using Catmull-Clark, preserving UV seams.
def subdivide(p,u,fs):
 ids=sorted(set(i for f in fs for i,t in f));faces_pos=[p[[i for i,t in f]].mean(axis=0) for f in fs];edges={};incident={i:[] for i in ids}
 for j,f in enumerate(fs):
  for k,(i,t) in enumerate(f):
   incident[i].append(j);key=tuple(sorted((i,f[(k+1)%len(f)][0])));edges.setdefault(key,[]).append(j)
 new=p.tolist();edge_index={}
 neighbors={i:[] for i in ids};boundary={i:[] for i in ids}
 for (a,b),adj in edges.items():
  neighbors[a].append(b);neighbors[b].append(a)
  if len(adj)==1:boundary[a].append(b);boundary[b].append(a)
  point=(p[a]+p[b]+sum((faces_pos[j] for j in adj),np.zeros(3)))/(2+len(adj)) if len(adj)>1 else (p[a]+p[b])/2
  edge_index[a,b]=len(new);new.append(point.tolist())
 for i in ids:
  if boundary[i]:new[i]=(p[i]*.75+np.mean(p[boundary[i]],axis=0)*.25).tolist()
  else:
   n=len(incident[i]);F=np.mean([faces_pos[j] for j in incident[i]],axis=0);R=np.mean([(p[i]+p[k])/2 for k in neighbors[i]],axis=0);new[i]=((F+2*R+(n-3)*p[i])/n).tolist()
 us=[];out=[]
 for j,f in enumerate(fs):
  center=len(new);new.append(faces_pos[j].tolist());fu=u[[t for i,t in f]].mean(axis=0)
  for k,(i,t) in enumerate(f):
   ni,nt=f[(k+1)%len(f)];pi,pt=f[k-1];pts=[i,edge_index[tuple(sorted((i,ni)))],center,edge_index[tuple(sorted((pi,i)))]];tex=[u[t],(u[t]+u[nt])/2,fu,(u[t]+u[pt])/2];start=len(us);us.extend(tex);out.append([(vi,start+l) for l,vi in enumerate(pts)])
 return np.array(new),np.array(us),out
# glTF binary writer: separate position / normals / UV accessors and embedded textures.
binary=bytearray();views=[];access=[]
def view(data,target=None):
 while len(binary)%4:binary.append(0)
 offset=len(binary);binary.extend(data);d={'buffer':0,'byteOffset':offset,'byteLength':len(data)}
 if target:d['target']=target
 views.append(d);return len(views)-1
meshes=[];nodes=[]
for name,p,u,fs,mat,sub in parts:
 if sub:p,u,fs=subdivide(p,u,fs)
 triangles=[]
 for f in fs:
  for k in range(1,len(f)-1):triangles.append([f[0],f[k],f[k+1]])
 normals=np.zeros_like(p)
 for tri in triangles:
  ids=[i for i,t in tri];a,b,c=p[ids];n=np.cross(b-a,c-a)
  for i in ids:normals[i]+=n
 lengths=np.linalg.norm(normals,axis=1);normals/=np.maximum(lengths[:,None],1e-12)
 lookup={};unique=[];indices=[]
 for tri in triangles:
  for pair in tri:
   if pair not in lookup:lookup[pair]=len(unique);unique.append(pair)
   indices.append(lookup[pair])
 positions=np.array([p[i] for i,t in unique],dtype='<f4');ns=np.array([normals[i] for i,t in unique],dtype='<f4');uvs=np.array([u[t] for i,t in unique],dtype='<f4')
 uvs[:,1]=1-uvs[:,1]
 attrs={}
 for semantic,array,kind in [('POSITION',positions,'VEC3'),('NORMAL',ns,'VEC3'),('TEXCOORD_0',uvs,'VEC2')]:
  v=view(array.tobytes(),34962);a={'bufferView':v,'componentType':5126,'count':len(array),'type':kind}
  if semantic=='POSITION':a.update(min=array.min(axis=0).tolist(),max=array.max(axis=0).tolist())
  access.append(a);attrs[semantic]=len(access)-1
 iv=view(np.array(indices,dtype='<u4').tobytes(),34963);access.append({'bufferView':iv,'componentType':5125,'count':len(indices),'type':'SCALAR'});meshes.append({'name':name,'primitives':[{'attributes':attrs,'indices':len(access)-1,'material':mat}]});nodes.append({'name':name,'mesh':len(meshes)-1})
 print(name,'triangles',len(triangles),'bounds',positions.min(axis=0),positions.max(axis=0))
images=[]
for name in ['skin.png','eyes.png','long01_diffuse.png','bob01_diffuse.png']:
 image=Image.open(SRC/name);image.thumbnail(((2048,2048) if name=='skin.png' else (1024,1024)),Image.Resampling.LANCZOS);out=io.BytesIO();fmt='JPEG' if name=='skin.png' else 'PNG';image=image.convert('RGB' if fmt=='JPEG' else 'RGBA');image.save(out,format=fmt,**({'quality':94,'optimize':True} if fmt=='JPEG' else {'optimize':True}));images.append({'bufferView':view(out.getvalue()),'mimeType':'image/jpeg' if fmt=='JPEG' else 'image/png'})
materials=[]
for i,name in enumerate(['Skin','Eyes','HairLong','HairShort']):
 materials.append({'name':name,'pbrMetallicRoughness':{'baseColorTexture':{'index':i},'metallicFactor':0,'roughnessFactor':.82 if i!=1 else .3},**({'alphaMode':'MASK','alphaCutoff':.35,'doubleSided':True} if i>1 else {})})
doc={'asset':{'version':'2.0','generator':'Viet phuc Remix MakeHuman CC0 asset bake'},'scene':0,'scenes':[{'nodes':list(range(len(nodes)))}],'nodes':nodes,'meshes':meshes,'materials':materials,'textures':[{'source':i,'sampler':0} for i in range(4)],'samplers':[{'magFilter':9729,'minFilter':9987,'wrapS':33071,'wrapT':33071}],'images':images,'buffers':[{'byteLength':len(binary)}],'bufferViews':views,'accessors':access,'extras':{'source':'MakeHuman hm08; system assets','license':'CC0-1.0','baseHeight':1.84}}
j=json.dumps(doc,separators=(',',':')).encode();j+=b' '*((-len(j))%4);binary+=b'\0'*((-len(binary))%4);out=struct.pack('<4sII',b'glTF',2,12+8+len(j)+8+len(binary))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(binary),b'BIN\0')+binary
Path('assets/human.glb').write_bytes(out);print('assets/human.glb',len(out),'SHA256',hashlib.sha256(out).hexdigest())
