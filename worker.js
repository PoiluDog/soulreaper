// SOULREAPER - FPS solo en un seul fichier Cloudflare Worker
// Deploiement : wrangler deploy (main = "worker.js")
const HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>SOULREAPER</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;800&display=swap" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{overflow:hidden;background:#05070d;font-family:Cinzel,Georgia,serif;color:#dfe8ff;user-select:none}
canvas{display:block}
.ov{position:fixed;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(#0a1124cc,#020409f2);text-align:center;z-index:10;padding:20px}
.ov h1{font-size:clamp(36px,8vw,76px);letter-spacing:12px;color:#8fe9ff;text-shadow:0 0 30px #29b6ff,0 0 80px #1368ff}
.ov p{color:#9fb4d8;margin:10px;line-height:1.7;max-width:640px}
.btn{margin-top:22px;padding:14px 38px;font:800 18px Cinzel,serif;letter-spacing:4px;color:#06101c;background:linear-gradient(#aaf3ff,#4cc3ff);border:0;border-radius:3px;cursor:pointer;box-shadow:0 0 25px #34b8ff88}
.btn:hover{filter:brightness(1.15)}
#hud{position:fixed;inset:0;pointer-events:none;display:none;z-index:5}
#cross{position:absolute;left:50%;top:50%;width:20px;height:20px;margin:-10px;border:2px solid #fff9;border-radius:50%;box-shadow:0 0 6px #000}
#cross.hit{border-color:#ff3a3a;transform:scale(1.5)}
#vig{position:absolute;inset:0;box-shadow:inset 0 0 160px 50px #c00;opacity:0}
.box{position:absolute;background:#070d1acc;border:1px solid #3a5a8a88;padding:10px 16px;border-radius:4px;backdrop-filter:blur(4px)}
#hpb{left:24px;bottom:24px;width:300px}
#hpbar{height:14px;background:#2a0a10;border:1px solid #733;margin-top:6px}
#hpfill{height:100%;background:linear-gradient(90deg,#b0102a,#ff4a5e);width:100%;transition:width .15s}
#amb{right:24px;bottom:24px;text-align:right}
#amb b{font-size:34px;color:#fff}
#top{left:50%;top:18px;transform:translateX(-50%);text-align:center;letter-spacing:3px}
#souls{color:#7fe9ff;font-size:24px;text-shadow:0 0 14px #2ab}
#abil{left:24px;bottom:100px;display:flex;gap:10px;padding:6px}
.ab{width:54px;height:54px;border:1px solid #6ab;position:relative;background:#0a1626;display:flex;align-items:center;justify-content:center;font-size:20px;overflow:hidden}
.ab i{position:absolute;left:0;bottom:0;width:100%;background:#000b;transition:height .1s}
.ab s{position:absolute;right:2px;top:0;font-size:11px;text-decoration:none;color:#8cf}
#msg{position:absolute;left:0;right:0;top:22%;text-align:center;font-size:44px;letter-spacing:8px;color:#ffd38a;text-shadow:0 0 25px #f80;opacity:0;transition:opacity .6s}
#shop{display:none;background:radial-gradient(#0a1830ee,#02050bf5)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;max-width:920px;width:100%;margin-top:14px}
.it{background:#0b1a30;border:1px solid #2f5b94;padding:12px;text-align:left;border-radius:4px}
.it h3{color:#9fefff;font-size:16px}.it small{color:#8aa}.it button{margin-top:8px;width:100%;padding:8px;background:#123b66;border:1px solid #4ab;color:#cfefff;font:600 14px Cinzel,serif;cursor:pointer}
.it button:disabled{opacity:.35;cursor:default}
#wbar{left:50%;bottom:24px;transform:translateX(-50%);display:flex;gap:8px;padding:6px}
.sec{grid-column:1/-1;color:#ffd38a;letter-spacing:4px;font-size:15px;margin-top:8px;text-align:left}
#shop{overflow-y:auto;justify-content:flex-start;padding-top:30px}#amb{min-width:230px}
#bossb{position:absolute;left:50%;top:84px;transform:translateX(-50%);width:min(560px,80vw);text-align:center;display:none}
#bossn{letter-spacing:6px;color:#ff9a6a;text-shadow:0 0 12px #f40}#bossbar{height:14px;background:#1a0608;border:1px solid #a44;margin-top:4px}#bossf{height:100%;background:linear-gradient(90deg,#8a0a1a,#ff3a3a);width:100%}
.ov input{margin:6px;padding:12px 16px;width:280px;font:600 16px Cinzel,serif;background:#0b1a30;border:1px solid #3a6aa4;color:#dff;border-radius:3px;user-select:text;text-align:center}
.c2{background:#0b1a30cc;border:1px solid #2f5b94;padding:18px 22px;border-radius:6px;width:270px;min-height:210px}.c2 h3{color:#9fefff;letter-spacing:3px}.c2 p{font-size:13px}
#lbt td{padding:2px 10px}.btn:disabled{opacity:.35;cursor:default}.sm{background:#556!important;color:#fff!important;box-shadow:none!important;font-size:13px!important;padding:8px 20px!important}
#kf{position:absolute;right:20px;top:20px;text-align:right;font-size:14px;text-shadow:0 0 6px #000}#sb{left:50%;top:28%;transform:translateX(-50%);min-width:340px;display:none}
</style></head><body>
<div id="hud">
 <div id="vig"></div><div id="cross"></div><div id="msg"></div><div id="kf"></div><div class="box" id="sb"></div><div id="bossb"><div id="bossn"></div><div id="bossbar"><div id="bossf"></div></div></div>
 <div class="box" id="top"><div id="wave">WAVE 1</div><div id="souls">0 souls</div></div>
 <div class="box" id="hpb"><span id="hptxt">100</span><div id="hpbar"><div id="hpfill"></div></div></div>
 <div class="box" id="abil"></div><div class="box" id="wbar"></div>
 <div class="box" id="amb"><div id="wname">HELLBRINGER</div><b id="ammo">6</b><div id="wab" style="font-size:13px;color:#8cf"></div><div style="font-size:11px;color:#89a;margin-top:4px">1-5 Weapons | LMB Fire | RMB Ability | R Reload | E Altar</div></div>
</div>
<div class="ov" id="auth" style="display:flex"><h1>SOULREAPER</h1><p>Create an account or log in. Your FFA kills are saved to your account and ranked on the global leaderboard.</p>
<input id="au" placeholder="Username" maxlength="16" autocomplete="username"><input id="ap" type="password" placeholder="Password" maxlength="64" autocomplete="current-password" onkeydown="if(event.key=='Enter')auth('login')">
<div id="ae" style="color:#ff7a7a;min-height:26px"></div><div><button class="btn" onclick="auth('login')">LOG IN</button> <button class="btn" onclick="auth('register')">CREATE ACCOUNT</button></div>
<button class="btn sm" onclick="guest()">PLAY AS GUEST (adventure only)</button></div>
<div class="ov" id="menu"><h1>SOULREAPER</h1><div id="who" style="color:#9fefff;letter-spacing:3px;margin-top:6px"></div>
<div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center;margin-top:20px">
<div class="c2"><h3>ADVENTURE</h3><p>Solo campaign: 3 realms, a boss on wave 10, souls to spend on weapons, upgrades and abilities.</p><button class="btn" onclick="startGame()">PLAY</button></div>
<div class="c2"><h3>FREE FOR ALL</h3><p>Online deathmatch with every weapon against other players. Each kill counts on the leaderboard.</p><button class="btn" id="ffab" onclick="startFFA()">JOIN</button></div>
<div class="c2"><h3>LEADERBOARD</h3><div id="lbt" style="font-size:14px;text-align:left"></div></div></div>
<p style="font-size:12px">WASD move - Shift sprint - Space jump - LMB fire - RMB ability - 1-5 / wheel weapons - R reload - Q dash - E altar - Tab scoreboard</p>
<button class="btn sm" onclick="logout()">LOG OUT</button></div>
<div class="ov" id="pause"><h1 style="font-size:44px">PAUSED</h1><button class="btn" onclick="resume()">RESUME</button><button class="btn sm" onclick="toLobby()">LEAVE TO LOBBY</button></div>
<div class="ov" id="shop"><h1 style="font-size:40px">ALTAR OF SOULS</h1><div id="shopsouls" style="color:#7fe9ff;font-size:22px;margin-top:8px"></div><div class="grid" id="grid"></div><button class="btn" style="margin-bottom:30px" onclick="toggleShop()">BACK TO BATTLE (E)</button></div>
<div class="ov" id="dead"><h1 style="color:#ff4a5e;text-shadow:0 0 30px #c00">YOU DIED</h1><p id="stats"></p><button class="btn" onclick="retry()">RETRY REALM</button><button class="btn" style="background:#556;color:#fff;box-shadow:none" onclick="startGame()">NEW RUN</button><button class="btn sm" onclick="toLobby()">LOBBY</button></div>
<div class="ov" id="clear"><h1 id="clrT" style="font-size:52px;color:#ffd38a;text-shadow:0 0 30px #f80">REALM CLEARED</h1><p id="clrP"></p><button class="btn" id="clrB" onclick="nextMap()">CONTINUE</button></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const $=id=>document.getElementById(id),R=Math.random,V=(x,y,z)=>new THREE.Vector3(x,y,z);
let seed=7;const sr=()=>(seed=(seed*16807)%2147483647)/2147483647;
// ---------- Scene ----------
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x0a0f1e,0.022);scene.background=new THREE.Color(0x0a0f1e);
const cam=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,800);cam.rotation.order='YXZ';scene.add(cam);
const ren=new THREE.WebGLRenderer({antialias:true});ren.setSize(innerWidth,innerHeight);ren.setPixelRatio(Math.min(devicePixelRatio,2));
ren.shadowMap.enabled=true;ren.toneMapping=THREE.ACESFilmicToneMapping;ren.outputEncoding=THREE.sRGBEncoding;document.body.appendChild(ren.domElement);
addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight)});
const hemi=new THREE.HemisphereLight(0x5a78b8,0x151a10,0.7);scene.add(hemi);
const moon=new THREE.DirectionalLight(0xa9c4ff,1.0);moon.castShadow=true;moon.shadow.mapSize.set(2048,2048);
Object.assign(moon.shadow.camera,{left:-45,right:45,top:45,bottom:-45,near:1,far:150});scene.add(moon,moon.target);
const moonM=new THREE.Mesh(new THREE.SphereGeometry(20,32,32),new THREE.MeshBasicMaterial({color:0xe6eeff,fog:false}));moonM.position.set(-220,170,-300);scene.add(moonM);
{const p=[];for(let i=0;i<900;i++){const a=R()*6.28,b=R()*1.4+.1,r=500;p.push(Math.cos(a)*Math.cos(b)*r,Math.sin(b)*r,Math.sin(a)*Math.cos(b)*r)}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.6,sizeAttenuation:false,fog:false})))}
function tex(base,n,rep,hue){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,256,256);
for(let i=0;i<n;i++){const v=R()*70|0;g.fillStyle='rgba('+v+','+(v+hue)+','+v+',0.22)';g.fillRect(R()*256,R()*256,R()*7+1,R()*7+1)}
const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep);t.anisotropy=4;return t}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(400,400),new THREE.MeshStandardMaterial({map:tex('#1d2618',7000,60,12),roughness:1}));
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const BASE=scene.children.length;
// ---------- Map ----------
const col=[],stone=new THREE.MeshStandardMaterial({map:tex('#5a5f69',5000,2,0),roughness:.95}),
wood=new THREE.MeshStandardMaterial({color:0x2a1e16,roughness:1}),leaf=new THREE.MeshStandardMaterial({color:0x10200f,roughness:1});
function add(m,x,y,z,cs){m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;scene.add(m);return m}
for(let i=0;i<46;i++){const a=sr()*6.28,r=14+sr()*70,h=3+sr()*5,x=Math.cos(a)*r,z=Math.sin(a)*r;
 const m=add(new THREE.Mesh(new THREE.CylinderGeometry(.55,.7,h,8),stone),x,h/2,z);m.rotation.z=(sr()-.5)*.1;col.push({x,z,r:.9});
 const cap=add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.4,1.5),stone),x,h+.2,z);cap.rotation.y=sr()}
for(let i=0;i<16;i++){const a=sr()*6.28,r=16+sr()*65,x=Math.cos(a)*r,z=Math.sin(a)*r,ry=sr()*3.14,L=7;
 const m=add(new THREE.Mesh(new THREE.BoxGeometry(L,2+sr()*2,.7),stone),x,1.3,z);m.rotation.y=ry;
 for(let k=-1;k<=1;k++)col.push({x:x+Math.cos(ry)*k*2.6,z:z-Math.sin(ry)*k*2.6,r:1.3})}
for(let i=0;i<70;i++){const a=sr()*6.28,r=12+sr()*80,x=Math.cos(a)*r,z=Math.sin(a)*r,h=4+sr()*4;
 add(new THREE.Mesh(new THREE.CylinderGeometry(.12,.35,h,6),wood),x,h/2,z);col.push({x,z,r:.5});
 for(let k=0;k<4;k++){const b=add(new THREE.Mesh(new THREE.CylinderGeometry(.04,.1,2.2,5),wood),x,h*.7,z);b.rotation.set(sr()*1.5-.75,sr()*6,1.0);b.position.y=h*.6+k*.4}}
for(let i=0;i<80;i++){const a=sr()*6.28,r=8+sr()*85,x=Math.cos(a)*r,z=Math.sin(a)*r;
 const m=add(new THREE.Mesh(new THREE.BoxGeometry(.8,1.2+sr()*.6,.2),stone),x,.6,z);m.rotation.set((sr()-.5)*.2,sr()*6,(sr()-.5)*.2);col.push({x,z,r:.5})}
const altar=add(new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.8,.8,12),stone),0,.4,0);col.push({x:0,z:0,r:2.7});
const crystal=add(new THREE.Mesh(new THREE.OctahedronGeometry(.7),new THREE.MeshStandardMaterial({color:0x66e6ff,emissive:0x22b0ff,emissiveIntensity:2})),0,2,0);
const altarL=new THREE.PointLight(0x38c8ff,2.2,28);altarL.position.set(0,2.2,0);scene.add(altarL);
for(let i=0;i<8;i++){const a=i/8*6.28,x=Math.cos(a)*5.5,z=Math.sin(a)*5.5;add(new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,1.6,6),wood),x,.8,z);
 const f=new THREE.Mesh(new THREE.SphereGeometry(.16),new THREE.MeshBasicMaterial({color:0xff9a3a}));f.position.set(x,1.7,z);scene.add(f);
 if(i%2==0){const l=new THREE.PointLight(0xff8a2a,1.1,14);l.position.set(x,1.9,z);scene.add(l)}}
// ---------- Map extras ----------
const iron=new THREE.MeshStandardMaterial({color:0x111418,metalness:.8,roughness:.5});
const pathM=new THREE.Mesh(new THREE.PlaneGeometry(5,130),new THREE.MeshStandardMaterial({map:tex('#2b2419',4000,8,6),roughness:1}));pathM.rotation.x=-Math.PI/2;pathM.position.set(0,.02,-35);pathM.receiveShadow=true;scene.add(pathM);
for(const sx of[-5,5]){add(new THREE.Mesh(new THREE.BoxGeometry(1.6,9,1.6),stone),sx,4.5,-62);col.push({x:sx,z:-62,r:1.2});add(new THREE.Mesh(new THREE.ConeGeometry(1.1,1.8,4),stone),sx,9.9,-62);
 const l=new THREE.PointLight(0xff8a2a,1.4,18);l.position.set(sx*.8,6,-60);scene.add(l)}
add(new THREE.Mesh(new THREE.BoxGeometry(12,.8,1),iron),0,8.4,-62);
for(let i=-4;i<=4;i++){add(new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,7,5),iron),i*1.1,3.5,-62);col.push({x:i*1.1,z:-62,r:.45})}
add(new THREE.Mesh(new THREE.BoxGeometry(9,5,7),stone),42,2.5,-28);add(new THREE.Mesh(new THREE.BoxGeometry(10,.8,8),stone),42,5.3,-28);
add(new THREE.Mesh(new THREE.BoxGeometry(2.2,3.4,.3),new THREE.MeshBasicMaterial({color:0x020a06})),42,1.7,-24.4);
const crL=new THREE.PointLight(0x44ff88,2.2,16);crL.position.set(42,2,-22);scene.add(crL);for(const k of[-3,0,3])col.push({x:42+k,z:-28,r:2.4});
for(let i=0;i<4;i++){const x=-38+(i%2)*7,z=-22+(i>>1)*7;add(new THREE.Mesh(new THREE.CylinderGeometry(.6,.7,7,8),stone),x,3.5,z);col.push({x,z,r:.9})}
add(new THREE.Mesh(new THREE.BoxGeometry(8,.7,.9),stone),-34.5,7.2,-22);add(new THREE.Mesh(new THREE.BoxGeometry(.9,.7,8),stone),-38,7.2,-18);
for(let i=0;i<34;i++){const a=sr()*6.28,r=15+sr()*75,x=Math.cos(a)*r,z=Math.sin(a)*r,sz=.6+sr()*1.4,m=add(new THREE.Mesh(new THREE.DodecahedronGeometry(1,0),stone),x,sz*.5,z);m.scale.set(sz,sz*.7,sz);m.rotation.set(sr()*3,sr()*3,0);col.push({x,z,r:sz*.9})}
const gm=new THREE.InstancedMesh(new THREE.ConeGeometry(.06,.9,3),new THREE.MeshStandardMaterial({color:0x2a3a1a,roughness:1}),3500),mt=new THREE.Object3D();
for(let i=0;i<3500;i++){mt.position.set((sr()-.5)*190,.4,(sr()-.5)*190);mt.rotation.set((sr()-.5)*.4,sr()*6,(sr()-.5)*.4);mt.scale.setScalar(.6+sr()*1.2);mt.updateMatrix();gm.setMatrixAt(i,mt.matrix)}scene.add(gm);
const mc=document.createElement('canvas');mc.width=mc.height=128;{const g=mc.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(150,170,210,.5)');gr.addColorStop(1,'rgba(150,170,210,0)');g.fillStyle=gr;g.fillRect(0,0,128,128)}
const mistT=new THREE.CanvasTexture(mc),mist=[];for(let i=0;i<26;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:mistT,transparent:true,opacity:.3,depthWrite:false}));sp.scale.set(34,9,1);sp.position.set((sr()-.5)*180,2.5,(sr()-.5)*180);scene.add(sp);mist.push(sp)}
const ep=new Float32Array(1200);for(let i=0;i<1200;i+=3){ep[i]=(sr()-.5)*120;ep[i+1]=sr()*14;ep[i+2]=(sr()-.5)*120}
const eg=new THREE.BufferGeometry();eg.setAttribute('position',new THREE.BufferAttribute(ep,3));const embers=new THREE.Points(eg,new THREE.PointsMaterial({color:0x8fe9ff,size:.14,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(embers);
// ---------- Realms ----------
const MOBJ=[null,null,null],MCOL=[null,null,null],MZN=[[],[],[]];MOBJ[0]=scene.children.slice(BASE);MCOL[0]=col.slice();
const PTS=[{p:embers,vy:.5,h:14}];let curMap=0,ZN=[];
const HM=[1,1.8,2.8],DM=[1,1.5,2.2],SM=[1,2,4];
const MAPS=[
{name:"CURSED GRAVEYARD",fog:0x0a0f1e,fd:.022,hm:[0x5a78b8,0x151a10,.7],mo:[0xa9c4ff,1],mc:0xe6eeff,gt:ground.material.map,pick:(W,r)=>(W>=4&&r<.14)?1:(W>=3&&r<.32)?3:(W>=2&&r<.55)?2:0,boss:11},
{name:"EMBER WASTES",fog:0x2a0c06,fd:.026,hm:[0xc0502a,0x2a0a06,.85],mo:[0xff7a40,1.1],mc:0xff5a20,gc:'#241210',gh:0,pick:(W,r)=>(W>=5&&r<.12)?6:r<.42?4:5,boss:12},
{name:"FROZEN CITADEL",fog:0x16253a,fd:.02,hm:[0x8ab8e8,0x203040,.9],mo:[0xcfe6ff,1.2],mc:0xdff0ff,gc:'#cfdbe8',gh:0,pick:(W,r)=>(W>=4&&r<.14)?10:(W>=2&&r<.38)?9:r<.65?8:7,boss:13}];
function mkPts(n,c,sz,vy,h){const a=new Float32Array(n*3);for(let i=0;i<a.length;i+=3){a[i]=(sr()-.5)*130;a[i+1]=sr()*h;a[i+2]=(sr()-.5)*130}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a,3));
 const p=new THREE.Points(g,new THREE.PointsMaterial({color:c,size:sz,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(p);PTS.push({p,vy,h})}
function mkAltar(c){add(new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.8,.8,12),stone),0,.4,0);col.push({x:0,z:0,r:2.7});
 const k=add(new THREE.Mesh(new THREE.OctahedronGeometry(.7),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:2})),0,2,0);k.castShadow=false;const l=new THREE.PointLight(c,2.2,28);l.position.set(0,2.2,0);scene.add(l)}
function pol(){const a=sr()*6.28,r=14+sr()*80;return[Math.cos(a)*r,Math.sin(a)*r]}
function build1(){const n0=scene.children.length;col.length=0;const zn=[],
 obs=new THREE.MeshStandardMaterial({color:0x1a0e10,roughness:.5,metalness:.3,emissive:0x300600}),lavaM=new THREE.MeshBasicMaterial({color:0xff5a10}),bone=new THREE.MeshStandardMaterial({color:0xcfc4aa,roughness:.7}),fire=new THREE.MeshBasicMaterial({color:0xff9a30});
 for(let i=0;i<9;i++){const a=sr()*6.28,r=26+sr()*58,x=Math.cos(a)*r,z=Math.sin(a)*r,rad=4+sr()*5,m=new THREE.Mesh(circG,lavaM);m.rotation.x=-Math.PI/2;m.scale.setScalar(rad);m.position.set(x,.06,z);scene.add(m);zn.push({x,z,r:rad*.92,t:'lava'});
  if(i<3){const l=new THREE.PointLight(0xff5a10,2.2,28);l.position.set(x,2.5,z);scene.add(l)}}
 for(let i=0;i<55;i++){const[x,z]=pol(),h=4+sr()*11,m=add(new THREE.Mesh(new THREE.ConeGeometry(.6+sr()*1.3,h,6),obs),x,h/2,z);m.rotation.z=(sr()-.5)*.15;col.push({x,z,r:.9+h*.04})}
 for(let i=0;i<9;i++){const[x,z]=pol(),Rr=3+sr()*2,ry=sr()*3.14,m=add(new THREE.Mesh(new THREE.TorusGeometry(Rr,.28,6,16,Math.PI),bone),x,0,z);m.rotation.y=ry;for(const k of[-1,1])col.push({x:x+k*Rr*Math.cos(ry),z:z-k*Rr*Math.sin(ry),r:.6})}
 for(let i=0;i<12;i++){const a=i/12*6.28,x=Math.cos(a)*9,z=Math.sin(a)*9;add(new THREE.Mesh(new THREE.CylinderGeometry(.15,.2,1.4,6),obs),x,.7,z);const f=new THREE.Mesh(new THREE.ConeGeometry(.3,.8,6),fire);f.position.set(x,1.8,z);scene.add(f);col.push({x,z,r:.4})}
 const vo=new THREE.Mesh(new THREE.ConeGeometry(150,230,16,1,true),new THREE.MeshBasicMaterial({color:0x1a0805,fog:false,side:2}));vo.position.set(0,100,-360);scene.add(vo);
 const cr=new THREE.Mesh(new THREE.SphereGeometry(28,12,8),new THREE.MeshBasicMaterial({color:0xff6a20,fog:false}));cr.position.set(0,205,-360);cr.scale.y=.4;scene.add(cr);
 mkPts(500,0xff8a30,.16,1.2,16);mkAltar(0xff7a20);MOBJ[1]=scene.children.slice(n0);MCOL[1]=col.slice();MZN[1]=zn}
function build2(){const n0=scene.children.length;col.length=0;const zn=[],
 ice=new THREE.MeshStandardMaterial({color:0x9fd0f0,roughness:.15,metalness:.2,emissive:0x1a4a7a,transparent:true,opacity:.85}),snowM=new THREE.MeshStandardMaterial({color:0xe8f0f8,roughness:1}),pine=new THREE.MeshStandardMaterial({color:0x1d3b36,roughness:1}),
 wall=new THREE.MeshStandardMaterial({color:0x7a8aa0,roughness:.6}),lakeM=new THREE.MeshStandardMaterial({color:0xbfe6ff,roughness:.05,metalness:.4,emissive:0x103050});
 for(let i=0;i<7;i++){const a=sr()*6.28,r=22+sr()*55,x=Math.cos(a)*r,z=Math.sin(a)*r,rad=5+sr()*5,m=new THREE.Mesh(circG,lakeM);m.rotation.x=-Math.PI/2;m.scale.setScalar(rad);m.position.set(x,.05,z);m.receiveShadow=true;scene.add(m);zn.push({x,z,r:rad*.92,t:'ice'})}
 for(let i=0;i<40;i++){const[x,z]=pol();for(let k=0;k<3;k++){const h=2+sr()*6,m=add(new THREE.Mesh(new THREE.ConeGeometry(.35+sr()*.5,h,5),ice),x+(sr()-.5)*2,h/2,z+(sr()-.5)*2);m.rotation.set((sr()-.5)*.4,sr()*6,(sr()-.5)*.4)}col.push({x,z,r:1.4})}
 for(let i=0;i<55;i++){const[x,z]=pol();add(new THREE.Mesh(new THREE.CylinderGeometry(.15,.25,1.6,6),wood),x,.8,z);for(let k=0;k<3;k++)add(new THREE.Mesh(new THREE.ConeGeometry(2.1-k*.55,2.6,8),pine),x,2.4+k*1.4,z);col.push({x,z,r:.6})}
 for(let i=0;i<30;i++){const[x,z]=pol(),m=add(new THREE.Mesh(new THREE.SphereGeometry(1,10,8),snowM),x,.2,z);m.scale.set(2+sr()*3,.6,2+sr()*3)}
 for(let i=0;i<6;i++){const a=i/6*6.28+.3,x=Math.cos(a)*48,z=Math.sin(a)*48;add(new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.8,16,10),wall),x,8,z);add(new THREE.Mesh(new THREE.ConeGeometry(3,6,10),ice),x,19,z);col.push({x,z,r:3});
  if(i%3==0){const l=new THREE.PointLight(0x60b8ff,1.8,26);l.position.set(x*.9,8,z*.9);scene.add(l)}
  if(i%2==0){const am=a+Math.PI/6,cx=Math.cos(am)*41.6,cz=Math.sin(am)*41.6,m=add(new THREE.Mesh(new THREE.BoxGeometry(40,4+sr()*2,1.4),wall),cx,2.5,cz);m.rotation.y=-(am+Math.PI/2);for(const t of[-16,-8,0,8,16])col.push({x:cx+t*-Math.sin(am),z:cz+t*Math.cos(am),r:1.6})}}
 for(const[c,y,x] of[['80,255,170',150,-120],['170,110,255',175,110]]){const cv=document.createElement('canvas');cv.width=8;cv.height=128;const g=cv.getContext('2d'),gr=g.createLinearGradient(0,0,0,128);gr.addColorStop(0,'rgba('+c+',0)');gr.addColorStop(.5,'rgba('+c+',.55)');gr.addColorStop(1,'rgba('+c+',0)');g.fillStyle=gr;g.fillRect(0,0,8,128);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending}));sp.scale.set(600,90,1);sp.position.set(x,y,-300);scene.add(sp)}
 mkPts(900,0xffffff,.2,-3,16);mkAltar(0x60d8ff);MOBJ[2]=scene.children.slice(n0);MCOL[2]=col.slice();MZN[2]=zn}
const BUILD=[null,build1,build2];
function loadMap(n){curMap=n;S.mm=Math.max(S.mm,n);const m=MAPS[n];MOBJ.forEach(a=>a&&a.forEach(o=>o.visible=false));if(!MOBJ[n])BUILD[n]();MOBJ[n].forEach(o=>o.visible=true);col.length=0;col.push(...MCOL[n]);ZN=MZN[n];
 scene.fog.color.setHex(m.fog);scene.fog.density=m.fd;scene.background.setHex(m.fog);hemi.color.setHex(m.hm[0]);hemi.groundColor.setHex(m.hm[1]);hemi.intensity=m.hm[2];moon.color.setHex(m.mo[0]);moon.intensity=m.mo[1];moonM.material.color.setHex(m.mc);
 if(!m.gt)m.gt=tex(m.gc,7000,60,m.gh);ground.material.map=m.gt;ground.material.needsUpdate=true;
 clearField();W=0;spawnQ=0;waveWait=4;P.pos.set(0,0,9);P.vel.set(0,0,0);P.yaw=0;P.pitch=0;S.hp=maxHp();cdv={dash:0,nova:0,heal:0};msg("REALM "+(n+1)+": "+m.name+(n?"  -  SOULS x"+SM[n]:""))}
// ---------- State ----------
const bGeo=new THREE.BoxGeometry(1,1,1),coneG=new THREE.ConeGeometry(.05,.3,5),circG=new THREE.CircleGeometry(1,18),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const S={};let mode='menu',W=0,cdv={dash:0,nova:0,heal:0},keys={},held=false,clickT=0,vigA=0,msgT=0,hitT=0,ts=1,shake=0,mdx=0,sx=0,rec=0,landDip=0,spin=0,bobA=0,lde=false;
const P={pos:V(0,0,9),vel:V(0,0,0),vy:0,yaw:0,pitch:0,dash:0,dd:V(0,0,0),bob:0,roll:0};
const WP=[
{n:"HELLBRINGER",mag:6,dmg:11,pel:7,spr:.09,int:.85,rel:1.8,cost:0,ab:"Slug Shot",cd:6,desc:"Pump shotgun. RMB: piercing slug that hits every enemy in line."},
{n:"REAPER-47",mag:30,dmg:15,pel:1,spr:.03,int:.095,rel:1.9,auto:1,cost:15,ab:"Overdrive",cd:14,desc:"Assault rifle. RMB: 5s of doubled fire rate."},
{n:"SOULPIERCER",mag:6,dmg:60,pel:1,spr:.004,int:.45,rel:2.1,cost:20,ab:"Dead Eye",cd:16,desc:"Heavy revolver, 3x headshots. RMB: slows enemies for 4s."},
{n:"SOUL CANNON",mag:4,dmg:75,proj:1,int:.9,rel:2.2,cost:40,ab:"Singularity",cd:15,desc:"Explosive soul orbs. RMB: black hole that drags and shreds enemies."},
{n:"SCYTHE",melee:1,cost:0,ab:"Reaping Spin",cd:5,desc:"Infinite ammo, heals on hit. RMB: whirlwind slash around you."}];
const UP=[["dmg","Cursed Rounds","+15% damage, all weapons",8],["mag","Spectral Magazine","+12% magazine size",6],["rate","Infernal Tempo","+7% fire rate",10],["hp","Vitality","+20 max HP (full heal)",6],["spd","Shadow Step","+8% move speed",6],["pull","Soul Magnet","Bigger soul pickup range",5],["crit","Critical Edge","+8% crit chance (x2 damage)",8,1],["arm","Soul Armor","-8% damage taken",8,1],["sip","Soul Siphon","+2 HP per kill",6,2],["cdr","Time Dilation","-8% ability cooldowns",8,2]];
const AB=[["dash","Dash (Q)","Instant, invulnerable burst",12,">>"],["nova","Soul Nova (F)","Devastating explosion",25,"*"],["heal","Communion (H)","Heals 50 HP",18,"+"]];
const CDMAX={dash:3.5,nova:12,heal:18};
const magMax=i=>Math.round((WP[i].mag||0)*(1+.12*S.up.mag)),dmgM=()=>1+.15*S.up.dmg,rateM=()=>Math.pow(.93,S.up.rate),maxHp=()=>100+20*S.up.hp,cdm=()=>Math.pow(.92,S.up.cdr);
function reset(){Object.assign(S,{souls:0,hp:100,kills:0,up:{dmg:0,mag:0,rate:0,hp:0,spd:0,pull:0,crit:0,arm:0,sip:0,cdr:0},ab:{dash:0,nova:0,heal:0},own:[1,0,0,0,1],w:0,nw:-1,swap:0,am:WP.map(w=>w.mag||0),rel:0,cd:0,acd:[0,0,0,0,0],od:0,de:0,sw:-1,swHit:false,mm:0});
 clearField();W=0;spawnQ=0;waveWait=1.5;cdv={dash:0,nova:0,heal:0};P.pos.set(0,0,9);P.vel.set(0,0,0);P.yaw=0;P.pitch=0;
 VM.forEach((v,i)=>v.visible=i==0);$('wname').textContent=WP[0].n;buildAbil();buildBar()}
// ---------- Audio ----------
let AC;const ac=()=>AC=AC||new(window.AudioContext||window.webkitAudioContext)();
function snd(f,d,type,v,sl){try{const a=ac(),o=a.createOscillator(),g=a.createGain(),t=a.currentTime;o.type=type;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f*sl),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(a.destination);o.start();o.stop(t+d)}catch(e){}}
function noise(d,v){try{const a=ac(),n=a.sampleRate*d|0,b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=(R()*2-1)*Math.pow(1-i/n,2);
 const s=a.createBufferSource(),g=a.createGain();g.gain.value=v;s.buffer=b;s.connect(g);g.connect(a.destination);s.start()}catch(e){}}
// ---------- Viewmodels ----------
const metal=new THREE.MeshStandardMaterial({color:0x22262c,metalness:.85,roughness:.35}),wd=new THREE.MeshStandardMaterial({color:0x5a3a22,roughness:.7}),chrome=new THREE.MeshStandardMaterial({color:0xc0c4cc,metalness:1,roughness:.18}),
glowM=c=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:2.2});
function vb(p,w,h,d,m,x,y,z,rx){const o=new THREE.Mesh(bGeo,m);o.scale.set(w,h,d);o.position.set(x,y,z);if(rx)o.rotation.x=rx;p.add(o);return o}
function vc(p,r1,r2,l,m,x,y,z){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,l,14),m);o.rotation.x=Math.PI/2;o.position.set(x,y,z);p.add(o);return o}
const VM=[];function mkVM(b,fn){const g=new THREE.Group();fn(g);g.userData.b=b;g.position.copy(b);g.visible=false;cam.add(g);VM.push(g)}
mkVM(V(.26,-.27,-.55),g=>{vc(g,.03,.03,1,metal,0,0,-.3);vc(g,.026,.026,.8,metal,0,-.065,-.25);vb(g,.09,.07,.28,wd,0,-.08,-.32);vb(g,.09,.13,.38,metal,0,-.02,.2);vb(g,.08,.15,.45,wd,0,-.07,.55,.15);vb(g,.012,.04,.012,chrome,0,.04,-.78)});
mkVM(V(.24,-.25,-.5),g=>{vb(g,.07,.11,.55,metal,0,0,.05);vc(g,.016,.016,.75,metal,0,.02,-.6);vb(g,.08,.08,.4,metal,0,0,-.28);vb(g,.05,.22,.1,metal,0,-.15,.08,.2);vb(g,.05,.14,.07,wd,0,-.12,.3,-.2);vb(g,.06,.12,.35,metal,0,-.03,.45);vc(g,.028,.028,.22,metal,0,.095,-.02);vb(g,.012,.012,.012,glowM(0xff2020),0,.095,-.14)});
mkVM(V(.22,-.22,-.45),g=>{vc(g,.02,.02,.55,chrome,0,.04,-.3);vb(g,.05,.11,.26,chrome,0,0,0);vc(g,.05,.05,.13,chrome,0,.02,-.02);vb(g,.05,.2,.08,wd,0,-.14,.14,-.35);vb(g,.02,.04,.04,chrome,0,.08,.1);vb(g,.01,.03,.01,chrome,0,.075,-.5)});
mkVM(V(.28,-.28,-.6),g=>{vc(g,.09,.11,.9,metal,0,0,-.3);for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.115,.015,8,18),glowM(0x40d8ff));r.position.z=-.55+i*.25;g.add(r)}
 const c=new THREE.Mesh(new THREE.SphereGeometry(.07,12,12),glowM(0x7ff0ff));c.position.set(0,0,.2);g.add(c);vb(g,.2,.2,.3,metal,0,0,.2);vb(g,.07,.2,.09,wd,0,-.16,.15,-.2);vb(g,.03,.1,.3,metal,.12,0,-.1);vb(g,.03,.1,.3,metal,-.12,0,-.1)});
mkVM(V(.55,-.45,-.7),g=>{const h=new THREE.Mesh(new THREE.CylinderGeometry(.02,.025,1.5,8),wd);h.rotation.x=Math.PI/2*.3;
 const bl=new THREE.Mesh(new THREE.TorusGeometry(.5,.03,6,24,2.1),new THREE.MeshStandardMaterial({color:0xcfe8ff,emissive:0x2a8bff,emissiveIntensity:1.2,metalness:.9,roughness:.2}));bl.position.set(0,.2,-.7);bl.rotation.set(Math.PI/2,0,1.9);g.add(h,bl)});
const flash=new THREE.PointLight(0xffa844,0,16);flash.position.set(0,0,-1.2);cam.add(flash);
// ---------- Enemies ----------
const en=[],corpses=[],orbs=[],fx=[],proj=[],vort=[],eproj=[];let spawnQ=0,spawnT=0,waveWait=0;
const eyeMat=c=>new THREE.MeshBasicMaterial({color:c}),mkBone=()=>new THREE.MeshStandardMaterial({color:0xd8d0b8,roughness:.6});
function bx(w,h,d,m,x,y,z,p){const o=new THREE.Mesh(bGeo,m);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=true;p.add(o);return o}
function cn(p,m,x,y,z,rx,rz,s){const o=new THREE.Mesh(coneG,m);o.position.set(x,y,z);o.rotation.set(rx,0,rz);o.scale.setScalar(s);p.add(o);return o}
function human(o){const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:o.skin,roughness:.85}),c=new THREE.MeshStandardMaterial({color:o.cloth,roughness:1}),eye=eyeMat(o.eye),bone=mkBone(),
 hip=new THREE.Group(),sp=new THREE.Group(),hd=new THREE.Group(),mats=[m,c,eye,bone];hip.position.y=.95;g.add(hip);sp.rotation.x=o.hunch;hip.add(sp);
 bx(.72,.95,.42,m,0,.5,0,sp);bx(.76,.45,.46,c,0,.2,0,sp);for(let i=0;i<4;i++)bx(.5,.045,.06,bone,0,.45+i*.13,.22,sp);
 if(o.glow){const gm=new THREE.MeshStandardMaterial({color:o.glow,emissive:o.glow,emissiveIntensity:2.5});mats.push(gm);bx(.32,.45,.06,gm,0,.55,.23,sp)}
 for(let i=0;i<o.spikes;i++)cn(sp,bone,0,.2+i*.22,-.24,-1.9,0,1.2);
 hd.position.set(0,1.05,.08);hd.rotation.x=-o.hunch*.8;sp.add(hd);bx(.42,.46,.44,m,0,.1,0,hd);
 const jaw=new THREE.Group();jaw.position.set(0,-.1,-.1);hd.add(jaw);bx(.34,.1,.38,m,0,-.07,.2,jaw);for(let i=-1;i<=1;i++)bx(.035,.09,.035,bone,i*.1,0,.38,jaw);
 bx(.1,.07,.05,eye,-.11,.17,.23,hd);bx(.1,.07,.05,eye,.11,.17,.23,hd);
 if(o.horns){cn(hd,bone,-.2,.38,0,0,.5,2.2);cn(hd,bone,.2,.38,0,0,-.5,2.2)}
 const arm=x=>{const a=new THREE.Group();a.position.set(x,.95,0);sp.add(a);bx(.17,o.arm,.17,m,0,-o.arm/2,0,a);for(let i=-1;i<=1;i++)cn(a,bone,i*.05,-o.arm-.1,.04,Math.PI,0,1.3);return a},
 leg=x=>{const l=new THREE.Group();l.position.set(x,0,0);hip.add(l);bx(.23,.95,.23,c,0,-.47,0,l);return l};
 return{g,hip,spn:sp,hd,jaw,a1:arm(-.5),a2:arm(.5),l1:leg(-.2),l2:leg(.2),m,mats}}
function crawler(sk,ey){const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:sk,roughness:.8}),eye=eyeMat(ey),bone=mkBone(),legs=[];
 bx(.55,.34,1.1,m,0,.55,0,g);for(let i=0;i<5;i++)cn(g,bone,0,.75,-.4+i*.2,-.3,0,1.1);
 const hd=new THREE.Group();hd.position.set(0,.6,.6);g.add(hd);bx(.38,.3,.42,m,0,0,0,hd);bx(.3,.08,.35,m,0,-.18,.05,hd);
 for(let i=-1;i<=1;i+=2){bx(.07,.06,.04,eye,i*.1,.06,.21,hd);bx(.04,.04,.04,eye,i*.05,.12,.21,hd);bx(.04,.1,.04,bone,i*.1,-.1,.22,hd)}
 for(const [x,z] of [[-1,.35],[1,.35],[-1,-.35],[1,-.35]]){const l=new THREE.Group();l.position.set(x*.28,.55,z);l.rotation.z=x*.9;g.add(l);bx(.1,.9,.1,m,0,-.4,0,l);cn(l,bone,0,-.9,0,Math.PI,0,1.2);legs.push(l)}
 return{g,m,hd,legs,mats:[m,eye,bone]}}
function wraith(c1,c2,c3){const g=new THREE.Group(),cm=new THREE.MeshStandardMaterial({color:c1,emissive:c2,emissiveIntensity:1.2,transparent:true,opacity:.5,side:2,depthWrite:false}),
 sk=new THREE.MeshStandardMaterial({color:0xe8e4d4,roughness:.5,emissive:0x203030}),eye=eyeMat(c3),bk=new THREE.MeshBasicMaterial({color:0});
 const clk=new THREE.Mesh(new THREE.ConeGeometry(.62,2.3,12,1,true),cm);clk.position.y=1.15;g.add(clk);
 const hd=new THREE.Group();hd.position.y=2.2;g.add(hd);const sl=new THREE.Mesh(new THREE.SphereGeometry(.24,14,12),sk);sl.scale.set(.9,1.1,1);hd.add(sl);
 for(const x of[-.09,.09]){bx(.1,.11,.06,bk,x,.03,.19,hd);bx(.04,.04,.06,eye,x,.03,.22,hd)}bx(.14,.1,.12,sk,0,-.18,.1,hd);
 const arm=x=>{const a=new THREE.Group();a.position.set(x,1.9,0);g.add(a);bx(.07,1.5,.07,sk,0,-.75,0,a);for(let i=-1;i<=1;i++)cn(a,sk,i*.04,-1.6,.03,Math.PI,0,1.6);return a};
 return{g,m:cm,hd,cl:clk,a1:arm(-.4),a2:arm(.4),mats:[cm,sk,eye,bk]}}
const H=(o,x)=>Object.assign({k:'h',o,by:1.2,br:.7,hy:1.75,hr:.34},x),C=(a,x)=>Object.assign({k:'c',a,by:.55,br:.55,hy:.62,hr:.28},x),Wr=(a,x)=>Object.assign({k:'w',a,by:1.3,br:.7,hy:2,hr:.3},x);
const TY=[
H({skin:0x6b7466,cloth:0x1c1a1e,arm:.95,hunch:.45,spikes:3,eye:0xff2a1a},{hp:45,hpw:8,sp:2.6,ws:1,dmg:9,drop:3,s:1,reach:1.7}),
H({skin:0x4a2f3a,cloth:0x140f12,arm:1.05,hunch:.25,spikes:5,eye:0xffa020,horns:1,glow:0xff5a10},{hp:190,hpw:28,sp:1.9,dmg:22,drop:8,s:1.6,reach:1.9,ch:[7,1.7]}),
C([0x2c2228,0xff1010],{hp:28,hpw:5,sp:5.2,dmg:7,drop:2,s:.95,reach:1.3,ch:[6,1.5]}),
Wr([0x9ad8d0,0x1a6a66,0x60ffe0],{hp:32,hpw:5,sp:3.4,dmg:12,drop:4,s:1,reach:1.6}),
H({skin:0xa02a1a,cloth:0x2a0c08,arm:.8,hunch:.3,spikes:2,eye:0xffe020,horns:1,glow:0xff7a10},{hp:36,hpw:6,sp:3,ws:1,dmg:10,drop:4,s:.85,reach:1.5,rg:{r:22,keep:12,cd:2.6,c:0xff6a10,v:15}}),
C([0x3a1410,0xff8a10],{hp:40,hpw:6,sp:6,ws:1,dmg:10,drop:3,s:1.1,reach:1.5,ch:[8,1.6]}),
H({skin:0x2a1a18,cloth:0x1a0c0a,arm:1.1,hunch:.1,spikes:6,eye:0xff6010,glow:0xff4a00},{hp:320,hpw:40,sp:1.6,dmg:30,drop:12,s:1.9,reach:2.2}),
H({skin:0x9fc8e0,cloth:0x203040,arm:.95,hunch:.35,spikes:3,eye:0x40e0ff,glow:0x60d0ff},{hp:60,hpw:10,sp:3,ws:1,dmg:11,drop:4,s:1.05,reach:1.7}),
C([0xa8d4ee,0x80f0ff],{hp:45,hpw:7,sp:6.4,ws:1,dmg:11,drop:3,s:1,reach:1.4,ch:[8,1.6]}),
Wr([0xe8f6ff,0x3a8aff,0x80f0ff],{hp:50,hpw:7,sp:3,dmg:12,drop:6,s:1.1,reach:1.6,rg:{r:24,keep:13,cd:2.4,c:0x70d8ff,v:17}}),
H({skin:0xdfe8f0,cloth:0x8aa0b8,arm:1.15,hunch:.3,spikes:0,eye:0x40c0ff},{hp:300,hpw:40,sp:2.2,dmg:28,drop:12,s:1.75,reach:2.1,ch:[8,1.8]}),
H({skin:0x8a8f84,cloth:0x0a0a10,arm:1.3,hunch:.2,spikes:8,eye:0x40ffe0,horns:1,glow:0x40ffd0},{boss:1,name:"THE GRAVEWARDEN",bc:0x40ffd0,hp:1500,hpw:0,sp:2.4,dmg:34,drop:40,s:3,reach:3.4,hr:.38}),
H({skin:0x2a1210,cloth:0x0a0404,arm:1.4,hunch:.15,spikes:9,eye:0xffd020,horns:1,glow:0xff4a00},{boss:1,name:"THE INFERNAL TITAN",bc:0xff5a10,hp:1800,hpw:0,sp:2.6,dmg:40,drop:60,s:3.4,reach:3.8,hr:.38}),
Wr([0xcfeaff,0x3a8aff,0x80f0ff],{boss:1,name:"THE FROST SOVEREIGN",bc:0x80e0ff,hp:2000,hpw:0,sp:2.8,dmg:42,drop:80,s:2.6,reach:3.4})];
function mkEnemy(type){const T=TY[type],mi=curMap,b=T.k=='h'?human(T.o):T.k=='c'?crawler(T.a[0],T.a[1]):wraith(T.a[0],T.a[1],T.a[2]);
 const e=Object.assign(b,{type,T,kind:T.k,hn:T.k=='h'?T.o.hunch:0,s:T.s,t:R()*6,atk:0,pend:0,flash:0,rise:1,rt:2+R()*2,bt:6,vt:4,boss:!!T.boss,hp:(T.hp+T.hpw*W)*HM[mi],spd:(T.sp+Math.min(W*.08,1.5)*(T.ws||0))*(1+.06*mi),dmg:(T.dmg+W)*DM[mi],drop:T.drop,by:T.by,br:T.br,hy:T.hy,hr:T.hr,r:.5*T.s,base:b.m.emissive.getHex()});
 e.max=e.hp;e.g.rotation.order='YXZ';e.g.scale.setScalar(T.s);scene.add(e.g);return e}
function efire(e,c,dm,spd,off){const p=e.g.position,o=V(p.x,p.y+1.4*e.s,p.z),tg=V(P.pos.x,P.pos.y+1.3,P.pos.z).sub(o).normalize();
 if(off){const ca=Math.cos(off),sa=Math.sin(off),x=tg.x*ca-tg.z*sa,z=tg.x*sa+tg.z*ca;tg.x=x;tg.z=z}
 const m=new THREE.Mesh(orbG,new THREE.MeshBasicMaterial({color:c}));m.scale.setScalar(1.8);m.add(new THREE.Mesh(haloG,new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false})));m.position.copy(o);scene.add(m);eproj.push({m,v:tg.multiplyScalar(spd),life:5,dm})}
function clearField(){for(const e of en.concat(corpses)){scene.remove(e.g);if(e.bl)scene.remove(e.bl)}for(const a of[orbs,fx,proj,vort,eproj])for(const o of a)scene.remove(o.m);en.length=corpses.length=orbs.length=fx.length=proj.length=vort.length=eproj.length=0}
function spawnBoss(){const e=mkEnemy(MAPS[curMap].boss);e.g.position.set(cl(P.pos.x,-60,60),-2.5*e.s,cl(P.pos.z-34,-90,90));en.push(e);msg(e.T.name);shake+=1.5;snd(40,1.2,'sawtooth',.5,.5)}
function spawn(){const t=MAPS[curMap].pick(W,R()),e=mkEnemy(t),a=R()*6.28,d=34+R()*20;
 e.g.position.set(cl(P.pos.x+Math.cos(a)*d,-90,90),-2.5*e.s,cl(P.pos.z+Math.sin(a)*d,-90,90));en.push(e);burst(V(e.g.position.x,.2,e.g.position.z),0x3a2a1a,10,3)}
function burst(p,c,n,sp){for(let i=0;i<n;i++){const m=new THREE.Mesh(bGeo,new THREE.MeshBasicMaterial({color:c}));m.scale.setScalar(.06+R()*.06);m.position.copy(p);scene.add(m);
 fx.push({m,v:V((R()-.5)*sp,R()*sp*.8,(R()-.5)*sp),life:.6+R()*.4,g:1})}}
function ringFx(x,y,z,c,size,life){const r=new THREE.Mesh(new THREE.RingGeometry(.9,1,48),new THREE.MeshBasicMaterial({color:c,side:2,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));r.rotation.x=-Math.PI/2;r.position.set(x,y,z);scene.add(r);fx.push({m:r,ring:1,size,life,l0:life,v:V(0,0,0),g:0})}
function tracer(a,b,c,w){const m=new THREE.Mesh(bGeo,new THREE.MeshBasicMaterial({color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));m.scale.set(w,w,a.distanceTo(b));m.position.copy(a).lerp(b,.5);m.lookAt(b);scene.add(m);fx.push({m,tr:1,life:.12,l0:.12,v:V(0,0,0),g:0})}
const orbG=new THREE.SphereGeometry(.14,10,10),haloG=new THREE.SphereGeometry(.32,10,10);
function dropOrb(p){const m=new THREE.Mesh(orbG,new THREE.MeshBasicMaterial({color:0x8ff0ff}));m.add(new THREE.Mesh(haloG,new THREE.MeshBasicMaterial({color:0x2aa8ff,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false})));
 m.position.set(p.x,1+R()*.5,p.z);scene.add(m);orbs.push({m,v:V((R()-.5)*4,3+R()*2,(R()-.5)*4),t:R()*6})}
function dmgE(e,d,head){if(e.dead)return false;if(e.rp){netHit(e,d);e.flash=.12;hitT=.12;burst(V(e.g.position.x,e.g.position.y+1.3,e.g.position.z),0x8a0a14,6,3);return false}if(S.up.crit&&R()<.08*S.up.crit){d*=2;burst(V(e.g.position.x,e.g.position.y+e.by*e.s+.3,e.g.position.z),0xffe060,4,3)}e.hp-=d;e.flash=.12;hitT=.12;const p=e.g.position;burst(V(p.x,p.y+e.by*e.s,p.z),e.kind=='w'?0x7fe8d8:head?0xff5a2a:0x8a0a14,head?9:5,3);
 if(e.hp<=0){e.dead=true;S.kills++;S.hp=Math.min(maxHp(),S.hp+2*S.up.sip);for(let i=0;i<e.drop;i++)dropOrb(p);burst(V(p.x,p.y+1,p.z),0x8ff0ff,14,5);snd(140,.35,'square',.12,.3);snd(60,.6,'sawtooth',.15,.3);
  en.splice(en.indexOf(e),1);if(e.boss){msg("BOSS SLAIN");shake+=2;for(const x of en.slice())dmgE(x,1e9,false)}const a=Math.atan2(p.x-P.pos.x,p.z-P.pos.z);e.cx=Math.sin(a)*3.5;e.cz=Math.cos(a)*3.5;e.ct=0;
  const bl=new THREE.Mesh(circG,new THREE.MeshBasicMaterial({color:e.kind=='w'?0x2a6a66:0x4a0508,transparent:true,opacity:.75,depthWrite:false}));bl.rotation.x=-Math.PI/2;bl.position.set(p.x,.04,p.z);bl.scale.setScalar(.1);scene.add(bl);e.bl=bl;corpses.push(e);return true}return false}
function collide(p,rad){for(const c of col){const dx=p.x-c.x,dz=p.z-c.z,d=Math.hypot(dx,dz),m=c.r+rad;if(d<m&&d>.001){p.x=c.x+dx/d*m;p.z=c.z+dz/d*m}}}
// ---------- Combat ----------
const fwd=V(0,0,0),rgt=V(0,0,0),upv=V(0,0,0);
function rayHit(o,d){let best=null,bt=70,bh=false;for(const e of en){if(e.rise>0)continue;const p=e.g.position;for(let k=0;k<2;k++){const c=V(p.x,p.y+(k?e.hy:e.by)*e.s,p.z).sub(o),r=(k?e.hr:e.br)*e.s,t=c.dot(d);if(t<0||t>bt)continue;if(c.lengthSq()-t*t<r*r){bt=t;best=e;bh=!!k}}}return best&&{e:best,head:bh,t:bt}}
function pierce(o,d,dmg){const hits=[];for(const e of en){if(e.rise>0)continue;const p=e.g.position;for(let k=0;k<2;k++){const c=V(p.x,p.y+(k?e.hy:e.by)*e.s,p.z).sub(o),r=(k?e.hr:e.br)*e.s*1.3,t=c.dot(d);if(t>0&&t<70&&c.lengthSq()-t*t<r*r){hits.push([e,k]);break}}}
 for(const [e,k] of hits){e.g.position.x+=d.x*1.8;e.g.position.z+=d.z*1.8;dmgE(e,dmg*(k?1.5:1),!!k)}}
function hurt(d){if(P.dash>0||mode!='play')return;S.hp-=d*Math.pow(.92,S.up.arm);vigA=1;shake+=.5;snd(90,.25,'sawtooth',.25,.5);if(S.hp<=0)die()}
function die(){mode='dead';document.exitPointerLock();$('hud').style.display='none';ren.domElement.style.filter='';$('stats').innerHTML='Wave reached: '+W+'<br>Enemies slain: '+S.kills+'<br>Unspent souls: '+S.souls;$('dead').style.display='flex'}
function aim(){cam.getWorldDirection(fwd);rgt.set(1,0,0).applyQuaternion(cam.quaternion);upv.set(0,1,0).applyQuaternion(cam.quaternion);return cam.getWorldPosition(V(0,0,0))}
function fire(){const i=S.w,w=WP[i];S.am[i]--;if(gmd=='ffa')netShot();S.cd=w.int*rateM()*(S.od>0?.5:1);rec=Math.min(1.5,rec+[1,.45,.9,1.2][i]);flash.intensity=i==3?0:6;
 noise(i==1?.12:.3,i==2?1:.8);snd(i==3?200:i==1?170:110,i==3?.4:.25,i==3?'sine':'sawtooth',.35,.3);
 const o=aim(),st=o.clone().addScaledVector(fwd,.9).addScaledVector(rgt,.17).addScaledVector(upv,-.14);
 if(w.proj){const m=new THREE.Mesh(new THREE.SphereGeometry(.22,12,12),new THREE.MeshBasicMaterial({color:0x7ff0ff}));m.add(new THREE.Mesh(new THREE.SphereGeometry(.5,12,12),new THREE.MeshBasicMaterial({color:0x2aa8ff,transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false})));m.position.copy(st);scene.add(m);proj.push({m,v:fwd.clone().multiplyScalar(40),life:3})}
 else for(let k=0;k<w.pel;k++){const d=fwd.clone().addScaledVector(rgt,(R()-.5)*w.spr).addScaledVector(upv,(R()-.5)*w.spr).normalize(),h=rayHit(o,d);
  if(h)dmgE(h.e,w.dmg*dmgM()*(h.head?(i==2?3:2):1),h.head);if(w.pel==1)tracer(st,o.clone().addScaledVector(d,h?h.t:60),i==2?0xffd080:0xffe0a0,.015)}
 P.pitch=cl(P.pitch+[.035,.012,.05,.04][i],-1.5,1.5);if(i==1)P.yaw+=(R()-.5)*.008;shake+=i==3?.08:i==0?.1:.04;if(S.am[i]<=0)S.rel=w.rel}
function swing(){if(S.sw>=0)return;if(gmd=='ffa')netShot();S.sw=0;S.swHit=false;S.cd=.5;snd(300,.25,'triangle',.18,.4);noise(.2,.3)}
function scythe(){const rng=3.2,dmg=45*dmgM();cam.getWorldDirection(fwd);fwd.y=0;fwd.normalize();let any=false;
 for(const e of en.slice()){const dx=e.g.position.x-P.pos.x,dz=e.g.position.z-P.pos.z,d=Math.hypot(dx,dz);if(d<rng+e.r&&(dx*fwd.x+dz*fwd.z)/Math.max(d,.01)>.15){any=true;
  e.g.position.x+=dx/d*1.2;e.g.position.z+=dz/d*1.2;dmgE(e,dmg,false);S.hp=Math.min(maxHp(),S.hp+2)}}if(any){snd(80,.2,'square',.25,.5);shake+=.3}}
function boom(p){snd(70,.6,'sawtooth',.5,.3);noise(.5,.9);shake+=.6;ringFx(p.x,Math.max(.3,p.y),p.z,0x6fe8ff,6.5,.45);burst(p,0x7ff0ff,26,7);
 for(const e of en.slice()){const g=e.g.position,d=Math.hypot(g.x-p.x,g.y+e.by*e.s-p.y,g.z-p.z);if(d<6.5)dmgE(e,WP[3].dmg*dmgM()*(1-.5*d/6.5),false)}}
function wAb(){const i=S.w,w=WP[i];if(gmd=='ffa'&&(i==2||i==3))return;if(S.acd[i]>0||mode!='play'||S.nw>=0)return;S.acd[i]=w.cd*cdm();snd(220,.4,'triangle',.25,3);const o=aim();
 if(i==0){const st=o.clone().addScaledVector(fwd,.9);st.y-=.14;tracer(st,o.clone().addScaledVector(fwd,70),0xff8a30,.14);pierce(o,fwd,130*dmgM());noise(.5,1);shake+=.5;rec=1.5;P.pitch+=.06}
 if(i==1){S.od=5;msg("OVERDRIVE")}if(i==2){S.de=4;msg("DEAD EYE")}
 if(i==3){const h=rayHit(o,fwd),vp=o.clone().addScaledVector(fwd,h?h.t:22);vp.y=Math.max(1.2,vp.y);
  const m=new THREE.Mesh(new THREE.SphereGeometry(.6,16,16),new THREE.MeshBasicMaterial({color:0}));m.add(new THREE.Mesh(new THREE.TorusGeometry(1.1,.08,8,32),new THREE.MeshBasicMaterial({color:0xb040ff,blending:THREE.AdditiveBlending,transparent:true})));m.position.copy(vp);scene.add(m);vort.push({p:vp,life:3.5,tk:0,m});snd(50,1,'sawtooth',.4,2)}
 if(i==4){spin=1;ringFx(P.pos.x,.3,P.pos.z,0xff4a4a,7,.5);noise(.4,.6);shake+=.4;for(const e of en.slice()){const dx=e.g.position.x-P.pos.x,dz=e.g.position.z-P.pos.z,d=Math.hypot(dx,dz);if(d<6.5+e.r){e.g.position.x+=dx/d*2.5;e.g.position.z+=dz/d*2.5;dmgE(e,85*dmgM(),false);S.hp=Math.min(maxHp(),S.hp+3)}}}}
function useAb(k){if(!S.ab[k]||cdv[k]>0||mode!='play')return;
 if(k=='dash'){cdv.dash=CDMAX.dash*cdm();P.dash=.22;let x=(keys.KeyD?1:0)-(keys.KeyA?1:0),z=(keys.KeyS?1:0)-(keys.KeyW?1:0);if(!x&&!z)z=-1;const c=Math.cos(P.yaw),s=Math.sin(P.yaw);P.dd.set(x*c+z*s,0,-x*s+z*c).normalize();snd(500,.25,'sine',.2,.2)}
 if(k=='nova'){cdv.nova=CDMAX.nova*cdm();snd(60,.8,'sawtooth',.5,3);noise(.6,.8);shake+=.6;ringFx(P.pos.x,.3,P.pos.z,0x6fe8ff,12,.7);for(const e of en.slice())if(Math.hypot(e.g.position.x-P.pos.x,e.g.position.z-P.pos.z)<12)dmgE(e,90+W*6,false)}
 if(k=='heal'){cdv.heal=CDMAX.heal*cdm();S.hp=Math.min(maxHp(),S.hp+50);snd(400,.5,'sine',.2,2)}}
// ---------- UI ----------
function buildAbil(){let h='';AB.forEach(a=>{if(S.ab[a[0]])h+='<div class="ab" id="ab_'+a[0]+'">'+a[4]+'<s>'+({dash:'Q',nova:'F',heal:'H'}[a[0]])+'</s><i></i></div>'});$('abil').innerHTML=h;$('abil').style.display=h?'flex':'none'}
function buildBar(){let h='';WP.forEach((w,i)=>{h+='<div class="ab" style="width:80px;font-size:11px;text-align:center;'+(S.own[i]?'':'opacity:.25;')+((S.nw<0?S.w:S.nw)==i?'border-color:#8fe9ff;box-shadow:0 0 10px #4cf;':'')+'">'+(i+1)+'<br>'+w.n.split(" ")[0]+'</div>'});$('wbar').innerHTML=h}
function card(t,k,name,desc,lv,cost,dis){return '<div class="it"><h3>'+name+(lv?' <small>'+lv+'</small>':'')+'</h3><small>'+desc+'</small><button data-t="'+t+'" data-k="'+k+'"'+(dis?' disabled':'')+'>'+cost+'</button></div>'}
function renderShop(){$('shopsouls').textContent=S.souls+' souls';let h='<h2 class="sec">WEAPONS</h2>';
 WP.forEach((w,i)=>{if(w.cost)h+=card(0,i,w.n,w.desc,'',S.own[i]?'OWNED':w.cost+' souls',S.own[i]||S.souls<w.cost)});h+='<h2 class="sec">UPGRADES</h2>';
 UP.forEach(u=>{const l=S.up[u[0]],c=u[3]*(l+1),mx=l>=8,lk=(u[4]||0)>S.mm;h+=card(1,u[0],u[1],lk?'Unlocks in realm '+(u[4]+1):u[2],'Lv '+l+'/8',lk?'LOCKED':mx?'MAX':c+' souls',lk||mx||S.souls<c)});h+='<h2 class="sec">ABILITIES</h2>';
 AB.forEach(a=>{const o=S.ab[a[0]];h+=card(2,a[0],a[1],a[2],'',o?'UNLOCKED':a[3]+' souls',o||S.souls<a[3])});$('grid').innerHTML=h}
$('grid').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;buy(+b.dataset.t,b.dataset.k)};
function buy(t,k){let c;
 if(t==0){c=WP[+k].cost;if(S.souls<c||S.own[+k])return;S.souls-=c;S.own[+k]=1;buildBar()}
 if(t==1){const u=UP.find(u=>u[0]==k);c=u[3]*(S.up[k]+1);if((u[4]||0)>S.mm||S.souls<c||S.up[k]>=8)return;S.souls-=c;S.up[k]++;if(k=='hp')S.hp=maxHp();if(k=='mag')S.am=S.am.map((a,i)=>Math.max(a,magMax(i)))}
 if(t==2){const a=AB.find(a=>a[0]==k);if(S.souls<a[3]||S.ab[k])return;S.souls-=a[3];S.ab[k]=1;buildAbil()}snd(700,.2,'sine',.2,1.8);renderShop()}
function msg(t){$('msg').textContent=t;$('msg').style.opacity=1;msgT=2.2}
function lock(){ren.domElement.requestPointerLock()}
function startGame(){gmd='adv';leaveNet();reset();loadMap(0);['menu','dead','pause','shop','clear'].forEach(i=>$(i).style.display='none');$('hud').style.display='block';mode='play';lock();ac().resume()}
function resume(){$('pause').style.display='none';mode='play';lock()}
function toggleShop(){if(gmd=='ffa')return;if(mode=='play'){mode='shop';document.exitPointerLock();renderShop();$('shop').style.display='flex'}else if(mode=='shop'){$('shop').style.display='none';mode='play';lock()}}
function setW(i){if(!S.own[i]||S.nw==i||(S.nw<0&&S.w==i))return;S.nw=i;S.swap=.3;S.rel=0;S.sw=-1;buildBar()}
function cyc(d){let i=S.nw<0?S.w:S.nw;do{i=(i+d+5)%5}while(!S.own[i]);setW(i)}
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement&&mode=='play'){mode='pause';$('pause').style.display='flex'}});
addEventListener('mousemove',e=>{if(document.pointerLockElement){mdx+=e.movementX;P.yaw-=e.movementX*.0022;P.pitch=cl(P.pitch-e.movementY*.0022,-1.5,1.5)}});
addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('mousedown',e=>{if(mode!='play')return;if(e.button==0){held=true;clickT=.18}if(e.button==2)wAb()});addEventListener('mouseup',e=>{if(e.button==0)held=false});
addEventListener('wheel',e=>{if(mode=='play')cyc(e.deltaY>0?1:-1)});
addEventListener('keydown',e=>{keys[e.code]=true;if(e.code=='Tab'&&mode=='play'){e.preventDefault();if(gmd=='ffa'){renderSB();$('sb').style.display='block'}}if(e.code=='KeyE')toggleShop();if(mode!='play')return;
 if(/^Digit[1-5]$/.test(e.code))setW(+e.code[5]-1);if(e.code=='KeyR'){const w=WP[S.w];if(!w.melee&&S.am[S.w]<magMax(S.w)&&S.rel<=0)S.rel=w.rel}
 if(e.code=='KeyQ')useAb('dash');if(e.code=='KeyF')useAb('nova');if(e.code=='KeyH')useAb('heal');if(e.code=='Space'&&P.pos.y<=.02)P.vy=7.5});
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code=='Tab')$('sb').style.display='none'});
function retry(){loadMap(curMap);$('dead').style.display='none';$('hud').style.display='block';mode='play';lock();ac().resume()}
function mapClear(){for(const o of orbs){S.souls+=SM[curMap];scene.remove(o.m)}orbs.length=0;mode='clear';document.exitPointerLock();const last=curMap>=2,nx=MAPS[curMap+1];ren.domElement.style.filter='';
 $('clrT').textContent=last?'VICTORY':'REALM CLEARED';$('clrP').innerHTML=last?'You have conquered every realm.<br>Enemies slain: '+S.kills+' - Souls: '+S.souls:'The gate to '+nx.name+' opens.<br>Souls are worth x'+SM[curMap+1]+' there, and new upgrades unlock at the altar.<br>You carry '+S.souls+' souls.';
 $('clrB').textContent=last?'NEW RUN':'ENTER '+nx.name;$('hud').style.display='none';$('clear').style.display='flex'}
function nextMap(){$('clear').style.display='none';if(curMap>=2){startGame();return}loadMap(curMap+1);$('hud').style.display='block';mode='play';lock()}
// ---------- Update ----------
function update(dt,t){
 if(gmd=='ffa'&&ffaDead>0){ffaDead-=dt;cam.position.set(P.pos.x,P.pos.y+.5,P.pos.z);cam.rotation.z+=(1.3-cam.rotation.z)*Math.min(1,dt*4);for(const e of en)if(e.rp)remoteUpd(e,dt);return}
 ts=S.de>0?.3:1;const dts=dt*ts;S.od=Math.max(0,S.od-dt);S.de=Math.max(0,S.de-dt);for(let i=0;i<5;i++)S.acd[i]=Math.max(0,S.acd[i]-dt);
 const de=S.de>0;if(de!==lde){lde=de;ren.domElement.style.filter=de?'saturate(.35) contrast(1.15) brightness(1.1)':''}
 // movement (smoothed)
 const f=(keys.KeyW?1:0)-(keys.KeyS?1:0),s=(keys.KeyD?1:0)-(keys.KeyA?1:0),sp=6*(1+.08*S.up.spd)*(keys.ShiftLeft&&f>0?1.55:1);
 let mx=-Math.sin(P.yaw)*f+Math.cos(P.yaw)*s,mz=-Math.cos(P.yaw)*f-Math.sin(P.yaw)*s;const l=Math.hypot(mx,mz);if(l>1){mx/=l;mz/=l}
 let slick=false;for(const z of ZN){if(Math.hypot(P.pos.x-z.x,P.pos.z-z.z)<z.r&&P.pos.y<.5){if(z.t=='lava'){S.hp-=7*dt;vigA=Math.max(vigA,.35);if(S.hp<=0){die();return}}else slick=true}}const grounded=P.pos.y<=.02,ac=1-Math.exp(-dt*(grounded?(slick?1.6:12):3));P.vel.x+=(mx*sp-P.vel.x)*ac;P.vel.z+=(mz*sp-P.vel.z)*ac;
 P.pos.x+=P.vel.x*dt;P.pos.z+=P.vel.z*dt;if(P.dash>0){P.dash-=dt;P.pos.addScaledVector(P.dd,26*dt)}
 const pv=P.vy;P.vy-=20*dt;P.pos.y=Math.max(0,P.pos.y+P.vy*dt);if(P.pos.y==0&&P.vy<0){if(pv<-6)landDip=Math.min(.25,-pv*.015);P.vy=0}
 collide(P.pos,.45);P.pos.x=cl(P.pos.x,-95,95);P.pos.z=cl(P.pos.z,-95,95);
 const spd=Math.hypot(P.vel.x,P.vel.z);bobA+=((grounded?Math.min(1,spd/6):0)-bobA)*Math.min(1,dt*8);P.bob+=spd*dt*1.7;
 landDip*=Math.exp(-dt*9);shake*=Math.exp(-dt*9);P.roll+=(-s*.025*Math.min(1,spd/5)-P.roll)*Math.min(1,dt*8);
 cam.position.set(P.pos.x+(R()-.5)*shake*.1,P.pos.y+1.7+Math.sin(P.bob)*.05*bobA-landDip+(R()-.5)*shake*.1,P.pos.z);cam.rotation.set(P.pitch+(R()-.5)*shake*.02,P.yaw,P.roll);
 cam.fov+=((P.dash>0?92:(keys.ShiftLeft&&f>0?80:75))-cam.fov)*Math.min(1,dt*10);cam.updateProjectionMatrix();
 moon.position.set(P.pos.x-30,P.pos.y+55,P.pos.z-20);moon.target.position.copy(P.pos);
 // weapons
 S.cd-=dt;clickT-=dt;rec*=Math.exp(-dt*11);flash.intensity=Math.max(0,flash.intensity-dt*50);
 if(S.nw>=0){S.swap-=dt;if(S.swap<=.15){S.w=S.nw;S.nw=-1;VM.forEach((v,i)=>v.visible=i==S.w);$('wname').textContent=WP[S.w].n;buildBar()}}else S.swap=Math.max(0,S.swap-dt);
 const w=WP[S.w],canAct=S.nw<0&&S.swap<=.05;
 if(S.rel>0){S.rel-=dt;if(S.rel<=0&&!w.melee){S.am[S.w]=magMax(S.w);snd(600,.1,'square',.1,1.3)}}
 if(canAct&&S.cd<=0&&(held||clickT>0)){if(w.melee)swing();else if(S.rel<=0&&S.am[S.w]>0&&((w.auto&&held)||clickT>0))fire();else if(S.am[S.w]<=0&&S.rel<=0)S.rel=w.rel}
 if(S.sw>=0){S.sw+=dt/.42;if(S.sw>.4&&!S.swHit){S.swHit=true;scythe()}if(S.sw>=1)S.sw=-1}
 sx+=(cl(-mdx*.0008,-.06,.06)-sx)*Math.min(1,dt*9);mdx=0;
 const vm=VM[S.w],b=vm.userData.b,drop=cl(S.nw>=0?(.3-S.swap)/.15:S.swap/.15,0,1),rl=S.rel>0&&w.rel?Math.sin(Math.min(1,1-S.rel/w.rel)*Math.PI):0,sw=Math.max(0,S.sw),sy=Math.sin(sw*Math.PI);
 if(S.w==4){spin=Math.max(0,spin-dt*2);vm.position.set(b.x-sw*1.1+sx,b.y-sy*.1-drop*.4,b.z);vm.rotation.set(.2,sw*1.6-.9+(spin>0?(1-spin)*6.28:0),-.3-sy*.9)}
 else{vm.position.set(b.x+sx+Math.sin(P.bob*.5)*.01*bobA,b.y-drop*.4-rl*.12+Math.cos(P.bob)*.006*bobA,b.z+rec*.1);vm.rotation.set(rec*.2+drop*.7+rl*.6,sx*2,sx*3)}
 // enemies
 for(const e of en){if(e.rp){remoteUpd(e,dt);continue}const p=e.g.position,dx=P.pos.x-p.x,dz=P.pos.z-p.z,d=Math.hypot(dx,dz)||.01,T=e.T,K=e.kind,rg=T.rg;
  let df=Math.atan2(dx,dz)-e.g.rotation.y;df=Math.atan2(Math.sin(df),Math.cos(df));e.g.rotation.y+=df*Math.min(1,dts*7);
  if(e.rise>0){e.rise-=dts*.9;p.y=e.rise>0?-e.rise*e.rise*2.5*e.s:0;if(e.a1){e.a1.rotation.x=-2.6;e.a2.rotation.x=-2.6}continue}
  const speed=e.spd*((T.ch&&d<T.ch[0])?T.ch[1]:1);
  if(rg){if(d>rg.keep){p.x+=dx/d*speed*dts;p.z+=dz/d*speed*dts}else if(d<rg.keep-3){p.x-=dx/d*speed*.7*dts;p.z-=dz/d*speed*.7*dts}}else if(d>T.reach*.8){p.x+=dx/d*speed*dts;p.z+=dz/d*speed*dts}
  if(K!='w')collide(p,e.r);
  e.t+=dts*speed*1.7;const t2=e.t;e.atk-=dts;if(d<T.reach+.2&&e.atk<=0&&e.pend<=0){e.atk=1.1;e.pend=.4}
  if(rg){e.rt-=dts;if(d<rg.r&&e.rt<=0){e.rt=rg.cd*(.8+R()*.4);e.pend=.4;efire(e,rg.c,e.dmg*.8,rg.v,0)}}
  if(T.boss){e.bt-=dts;if(e.bt<=0){e.bt=8;for(let j=0;j<3;j++)spawn();snd(60,.8,'sawtooth',.4,.5);ringFx(p.x,.3,p.z,T.bc,10,.6)}
   e.vt-=dts;if(e.vt<=0&&d>7){e.vt=3.2;for(let j=-2;j<=2;j++)efire(e,T.bc,e.dmg*.45,15,j*.2)}}
  if(e.pend>0){e.pend-=dts;if(e.pend<=0&&d<T.reach+(T.boss?2.5:.9)){hurt(e.dmg);snd(70,.15,'square',.2,.5);if(T.boss){shake+=1;ringFx(p.x,.3,p.z,T.bc,9,.5)}}}
  const ak=e.pend>0?1-e.pend/.4:0,k=Math.min(1,dts*14);
  if(K=='h'){const ta=e.pend>0?-1.2-ak*1.3:-1.15+Math.sin(t2*.5)*.18;e.a1.rotation.x+=(ta-e.a1.rotation.x)*k;e.a2.rotation.x+=(ta+(e.pend>0?0:Math.sin(t2*.5+1)*.1)-e.a2.rotation.x)*k;
   e.l1.rotation.x=Math.sin(t2)*.75;e.l2.rotation.x=-Math.sin(t2)*.75;e.hip.position.y=.95+Math.abs(Math.sin(t2))*.06;e.spn.rotation.x=e.hn+Math.sin(t2*2)*.04+ak*.3;
   e.jaw.rotation.x=.25+Math.sin(t2*1.3)*.2+ak*.5;e.hd.rotation.z=Math.sin(t2*.7)*.12}
  if(K=='c'){e.legs.forEach((lg,i)=>lg.rotation.x=Math.sin(t2*1.4+(i%2)*Math.PI+(i>1?1:0))*.7);e.hd.rotation.x=Math.sin(t2)*.1-ak*.4}
  if(K=='w'){p.y=.55+Math.sin(t*1.6+e.t)*.25;e.a1.rotation.x+=(-.2-ak*1.4+Math.sin(t2*.6)*.2-e.a1.rotation.x)*k;e.a2.rotation.x+=(-.2-ak*1.4+Math.sin(t2*.6+1)*.2-e.a2.rotation.x)*k;e.cl.scale.x=1+Math.sin(t2*.8)*.06;e.m.opacity=.42+Math.sin(t*9+e.t)*.08}
  if(e.flash>0){e.flash-=dt;e.m.emissive.setHex(0xaa2222)}else e.m.emissive.setHex(e.base)}
 // corpses: stay on the ground ~2.5s, then fade out
 for(let i=corpses.length-1;i>=0;i--){const e=corpses[i];e.ct+=dt;const kk=Math.min(1,e.ct/.45),f2=1-Math.pow(1-kk,3),p=e.g.position;
  e.cx*=Math.exp(-dt*5);e.cz*=Math.exp(-dt*5);p.x+=e.cx*dt;p.z+=e.cz*dt;
  if(e.kind=='w'){e.g.scale.y=e.s*(1+f2*.6);p.y+=dt*1.2}else if(e.kind=='c'){e.g.rotation.z=f2*1.4;p.y=f2*.3}else{e.g.rotation.x=-f2*1.5;p.y=f2*.2*e.s;e.a1.rotation.x+=(-.3-e.a1.rotation.x)*Math.min(1,dt*8);e.a2.rotation.x+=(.2-e.a2.rotation.x)*Math.min(1,dt*8);e.jaw.rotation.x+=(.7-e.jaw.rotation.x)*Math.min(1,dt*6)}
  e.bl.scale.setScalar(.1+f2*e.s*1.1);
  if(e.ct>2){const q=(e.ct-2)/.5;for(const m of e.mats){if(m.userData.o==null){m.userData.o=m.opacity;m.transparent=true}m.opacity=m.userData.o*Math.max(0,1-q)}e.bl.material.opacity=.75*Math.max(0,1-q);
   if(q>=1){scene.remove(e.g);scene.remove(e.bl);corpses.splice(i,1)}}}
 // vortices
 for(let i=vort.length-1;i>=0;i--){const v=vort[i];v.life-=dt;v.m.rotation.y+=dt*6;v.m.children[0].rotation.x=1.2+Math.sin(t*5)*.3;v.m.scale.setScalar(Math.min(1,v.life*2)*(1+Math.sin(t*12)*.08));v.tk-=dt;const dT=v.tk<=0;if(dT)v.tk=.25;
  for(const e of en.slice()){const p=e.g.position,dx=v.p.x-p.x,dz=v.p.z-p.z,d=Math.hypot(dx,dz);if(d<13){const k=Math.min(1,9*dts/Math.max(d,.5));p.x+=dx*k;p.z+=dz*k;if(dT&&d<9)dmgE(e,16*dmgM(),false)}}
  if(v.life<=0){scene.remove(v.m);vort.splice(i,1)}}
 // projectiles
 for(let i=proj.length-1;i>=0;i--){const q=proj[i];q.life-=dt;q.m.position.addScaledVector(q.v,dt);const p=q.m.position;let hit=q.life<=0||p.y<.2;
  if(!hit)for(const e of en){const g=e.g.position;if(e.rise<=0&&Math.hypot(p.x-g.x,p.z-g.z)<e.br*e.s+.3&&p.y<g.y+2.2*e.s&&p.y>g.y-.2){hit=true;break}}
  if(!hit)for(const c of col)if(Math.hypot(p.x-c.x,p.z-c.z)<c.r&&p.y<4){hit=true;break}
  if(hit){boom(p.clone());scene.remove(q.m);proj.splice(i,1)}}
 // enemy projectiles
 for(let i=eproj.length-1;i>=0;i--){const q=eproj[i];q.life-=dts;q.m.position.addScaledVector(q.v,dts);const p=q.m.position;
  if(Math.hypot(p.x-P.pos.x,p.z-P.pos.z)<.9&&p.y>P.pos.y-.2&&p.y<P.pos.y+2){hurt(q.dm);burst(p,0xff8040,6,3);scene.remove(q.m);eproj.splice(i,1)}else if(q.life<=0||p.y<0){scene.remove(q.m);eproj.splice(i,1)}}
 // orbs
 const mr=7+2*S.up.pull;
 for(let i=orbs.length-1;i>=0;i--){const o=orbs[i],p=o.m.position;o.t+=dt;const dx=P.pos.x-p.x,dy=P.pos.y+1.2-p.y,dz=P.pos.z-p.z,d=Math.hypot(dx,dy,dz);
  if(d<mr){const k=(14/Math.max(d,.5))*dt*(mr+1-d)/4;p.x+=dx*k;p.y+=dy*k;p.z+=dz*k}else{o.v.y-=9*dt;p.addScaledVector(o.v,dt);o.v.x*=.97;o.v.z*=.97;if(p.y<.5){p.y=.5+Math.sin(o.t*3)*.1;o.v.set(0,0,0)}}
  o.m.scale.setScalar((1+Math.sin(o.t*8)*.15)*(1+.35*curMap));
  if(d<1){S.souls+=SM[curMap];S.hp=Math.min(maxHp(),S.hp+1);scene.remove(o.m);orbs.splice(i,1);snd(900+Math.random()*300,.12,'sine',.1,1.5)}}
 for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.life-=dt;
  if(f.ring){const k=1-f.life/f.l0;f.m.scale.setScalar(1+k*f.size);f.m.material.opacity=1-k}else if(f.tr)f.m.material.opacity=Math.max(0,f.life/f.l0);else{f.v.y-=9*f.g*dt;f.m.position.addScaledVector(f.v,dt)}
  if(f.life<=0){scene.remove(f.m);fx.splice(i,1)}}
 // waves
 if(gmd=='adv'){spawnT-=dt;if(spawnQ>0&&spawnT<=0&&en.length<30){spawn();spawnQ--;spawnT=.6}
 if(spawnQ==0&&en.length==0){if(W>=10){if(mode=='play')mapClear()}else{waveWait-=dt;if(waveWait<=0){W++;spawnQ=Math.round((4+W*3)*(1+.25*curMap));waveWait=4;msg('WAVE '+W);if(W>1)S.hp=Math.min(maxHp(),S.hp+15);if(W==10){spawnQ=Math.round(spawnQ*.4);spawnBoss()}}}}}
 crystal.rotation.y+=dt;crystal.position.y=2+Math.sin(t*2)*.15;altarL.intensity=2.2+Math.sin(t*3)*.4;
 for(const q of PTS){if(!q.p.visible)continue;const ea=q.p.geometry.attributes.position.array;for(let i=1;i<ea.length;i+=3){ea[i]+=dt*q.vy*(1+(i%7)*.15);if(ea[i]>q.h)ea[i]=0;if(ea[i]<0)ea[i]=q.h}q.p.geometry.attributes.position.needsUpdate=true}
 for(const m of mist){m.position.x+=dt*.6;if(m.position.x>95)m.position.x=-95}
 // HUD
 for(const k in cdv){cdv[k]=Math.max(0,cdv[k]-dt);const el=$('ab_'+k);if(el)el.lastChild.style.height=(cdv[k]/CDMAX[k]*100)+'%'}
 vigA=Math.max(0,vigA-dt*1.5);$('vig').style.opacity=vigA;hitT=Math.max(0,hitT-dt);$('cross').className=hitT>0?'hit':'';
 $('hpfill').style.width=Math.max(0,S.hp/maxHp()*100)+'%';$('hptxt').textContent=Math.ceil(S.hp)+' / '+maxHp();
 if(gmd=='ffa'){$('souls').textContent=myK+' kills / '+myD+' deaths  (TAB: scoreboard)';$('wave').textContent='FREE FOR ALL - '+(rps.size+1)+' players'}else{$('souls').textContent=S.souls+' souls x'+SM[curMap]+' (E: altar)';$('wave').textContent='REALM '+(curMap+1)+' - WAVE '+W+'/10 - '+(en.length+spawnQ)+' left'}
 $('ammo').textContent=w.melee?'∞':(S.rel>0?'RELOADING':S.am[S.w]+' / '+magMax(S.w));
 $('wab').textContent='RMB '+w.ab+': '+(S.acd[S.w]>0?S.acd[S.w].toFixed(1)+'s':'READY');
 const bs=en.find(e=>e.boss);$('bossb').style.display=bs?'block':'none';if(bs){$('bossn').textContent=bs.T.name;$('bossf').style.width=Math.max(0,bs.hp/bs.max*100)+'%'}
 if(msgT>0){msgT-=dt;if(msgT<=0)$('msg').style.opacity=0}}
// ---------- Online ----------
let me={u:'',token:'',k:0,d:0},gmd='adv',ws=null,myId=0,names={},myK=0,myD=0,ffaDead=0,lastSend=0,sbData=[],lobbyNote='';const rps=new Map();
async function api(path,body){try{const r=await fetch(path,{method:body?'POST':'GET',headers:{'content-type':'application/json'},body:body?JSON.stringify(body):undefined});return await r.json()}catch(e){return{err:'Cannot reach the server'}}}
async function auth(kind){const u=$('au').value.trim(),p=$('ap').value;$('ae').textContent='...';const r=await api('/api/'+kind,{u,p});if(r.err){$('ae').textContent=r.err;return}
 me={u:r.u,token:r.token,k:r.k,d:r.d};try{localStorage.setItem('sr_tok',r.token)}catch(e){}$('ap').value='';$('ae').textContent='';$('auth').style.display='none';toLobby()}
function guest(){me={u:'Guest',token:'',k:0,d:0};$('auth').style.display='none';toLobby()}
function logout(){try{localStorage.removeItem('sr_tok')}catch(e){}me={u:'',token:'',k:0,d:0};$('menu').style.display='none';$('auth').style.display='flex'}
async function lobbyRefresh(){$('ffab').disabled=!me.token;$('who').textContent=me.u+(me.token?'':' (guest)')+lobbyNote;lobbyNote='';
 if(me.token){const r=await api('/api/me',{t:me.token});if(!r.err){me.k=r.k;me.d=r.d;$('who').textContent=me.u+'  -  FFA kills: '+r.k+'  deaths: '+r.d}}
 const l=await api('/api/lb');$('lbt').innerHTML=l.err?l.err:l.length?'<table>'+l.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>'+x.u+'</td><td>'+x.k+'</td></tr>').join('')+'</table>':'No kills yet. Be the first!'}
function toLobby(){leaveNet();gmd='adv';mode='menu';document.exitPointerLock();clearField();['pause','dead','clear','shop'].forEach(i=>$(i).style.display='none');$('hud').style.display='none';ren.domElement.style.filter='';$('menu').style.display='flex';lobbyRefresh()}
function leaveNet(){if(ws){ws.onclose=null;try{ws.close()}catch(e){}ws=null}for(const e of rps.values()){scene.remove(e.g);const i=en.indexOf(e);if(i>=0)en.splice(i,1)}rps.clear();$('kf').innerHTML='';$('sb').style.display='none'}
function startFFA(){if(!me.token)return;gmd='ffa';leaveNet();reset();S.own=[1,1,1,1,1];S.ab.dash=1;loadMap(0);clearField();buildBar();buildAbil();myK=myD=0;ffaDead=0;
 ['menu','dead','pause','shop','clear'].forEach(i=>$(i).style.display='none');$('hud').style.display='block';mode='play';lock();ac().resume();connect();msg("FREE FOR ALL")}
function connect(){ws=new WebSocket((location.protocol=='https:'?'wss://':'ws://')+location.host+'/ws?t='+me.token);
 ws.onmessage=e=>{const m=JSON.parse(e.data);
  if(m.t=='init'){myId=m.id;P.pos.set(m.x,0,m.z);collide(P.pos,.45)}
  else if(m.t=='ro'){names={};m.p.forEach(a=>names[a[0]]=a[1])}
  else if(m.t=='st')snap(m.p)
  else if(m.t=='k'){kf(m.a,m.v);if(m.vi==myId){ffaDead=3.2;msg("ELIMINATED BY "+m.a.toUpperCase());held=false}else if(m.ai==myId){msg("YOU KILLED "+m.v.toUpperCase());snd(900,.2,'sine',.2,1.5)}}
  else if(m.t=='sp'){P.pos.set(m.x,0,m.z);collide(P.pos,.45);P.vel.set(0,0,0);S.hp=100;S.am=WP.map(w=>w.mag||0);S.rel=0;ffaDead=0}
  else if(m.t=='dm'){vigA=1;shake+=.3;snd(90,.2,'sawtooth',.2,.5)}};
 ws.onclose=()=>{if(gmd=='ffa'){lobbyNote='  -  Disconnected from FFA server';toLobby()}}}
function netSend(t){if(!ws||ws.readyState!=1||t-lastSend<66)return;lastSend=t;ws.send(JSON.stringify({t:'s',x:+P.pos.x.toFixed(2),y:+P.pos.y.toFixed(2),z:+P.pos.z.toFixed(2),r:+P.yaw.toFixed(2),p:+P.pitch.toFixed(2),w:S.w}))}
function netShot(){if(ws&&ws.readyState==1)ws.send('{"t":"sh"}')}
function netHit(e,d){if(ws&&ws.readyState==1&&!ffaDead)ws.send('{"t":"h","id":'+e.id+',"d":'+Math.round(d)+'}')}
function kf(a,v){const d=document.createElement('div');d.textContent=a+' killed '+v;$('kf').prepend(d);setTimeout(()=>d.remove(),5000);while($('kf').children.length>5)$('kf').lastChild.remove()}
function renderSB(){const rows=sbData.map(r=>[r[0]==myId?me.u:(names[r[0]]||'?'),r[8],r[9]]).sort((a,b)=>b[1]-a[1]);$('sb').innerHTML='<b style="letter-spacing:4px">SCOREBOARD</b><table style="width:100%;margin-top:8px"><tr><td></td><td>KILLS</td><td>DEATHS</td></tr>'+rows.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</table>'}
function snap(a){const seen=new Set();sbData=a;
 for(const r of a){const id=r[0];if(id==myId){if(r[7]<S.hp)vigA=Math.max(vigA,.5);if(!ffaDead)S.hp=r[7];myK=r[8];myD=r[9];continue}
  seen.add(id);let e=rps.get(id);if(!e){e=mkRemote(id,names[id]||'Player');e.sh=r[11];e.dd=1;rps.set(id,e);e.g.position.set(r[1],r[2],r[3])}
  e.tx=r[1];e.ty=r[2];e.tz=r[3];e.tr=r[4];e.tp=r[5];e.hp=r[7];
  if(r[10]){if(e.in){en.splice(en.indexOf(e),1);e.in=false}e.g.visible=false;e.dd=1}else{if(e.dd){e.g.position.set(r[1],r[2],r[3]);e.dd=0}if(!e.in){en.push(e);e.in=true}e.g.visible=true}
  if(r[11]!=e.sh){e.sh=r[11];const d=Math.hypot(r[1]-P.pos.x,r[3]-P.pos.z);if(d<70)noise(.15,Math.max(0,.45-d/150))}}
 for(const[id,e] of rps)if(!seen.has(id)){scene.remove(e.g);const i=en.indexOf(e);if(i>=0)en.splice(i,1);rps.delete(id)}
 if($('sb').style.display=='block')renderSB()}
function label(t){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.font='bold 34px sans-serif';g.textAlign='center';g.fillStyle='rgba(0,0,0,.55)';g.fillRect(0,8,256,48);g.fillStyle='#fff';g.fillText(t,128,45);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true}));sp.scale.set(2,.5,1);return sp}
function soldier(col){const g=new THREE.Group(),M=(c,r,m)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m||0}),skin=M(0xd9a77f,.8),cloth=M(col,.9),dark=M(0x1b1f26,.8,.2),vest=M(0x2c3440,.7),blk=M(0x08090b,.9),hip=new THREE.Group();hip.position.y=.95;g.add(hip);
 bx(.5,.26,.28,dark,0,.05,0,hip);bx(.5,.6,.3,cloth,0,.38,0,hip);bx(.56,.42,.34,vest,0,.42,0,hip);bx(.4,.45,.16,vest,0,.42,-.25,hip);for(const x of[-.15,.15])bx(.12,.1,.08,dark,x,.28,.19,hip);bx(.12,.1,.12,skin,0,.7,0,hip);
 const hd=new THREE.Group();hd.position.set(0,.84,0);hip.add(hd);const sk=new THREE.Mesh(new THREE.SphereGeometry(.17,14,12),skin);sk.scale.set(.95,1.1,1);sk.castShadow=true;hd.add(sk);
 const hm=new THREE.Mesh(new THREE.SphereGeometry(.195,14,10,0,6.283,0,1.6),dark);hm.position.y=.03;hm.castShadow=true;hd.add(hm);bx(.3,.07,.05,blk,0,.0,.15,hd);
 const leg=x=>{const l=new THREE.Group();l.position.set(x,0,0);hip.add(l);bx(.2,.47,.22,dark,0,-.235,0,l);const k=new THREE.Group();k.position.y=-.47;l.add(k);bx(.17,.45,.2,dark,0,-.225,0,k);bx(.2,.1,.3,blk,0,-.45,.05,k);return[l,k]},
 arm=x=>{const a=new THREE.Group();a.position.set(x,.62,0);hip.add(a);bx(.14,.3,.14,cloth,0,-.15,0,a);const f=new THREE.Group();f.position.y=-.3;a.add(f);bx(.12,.28,.12,skin,0,-.14,0,f);bx(.13,.1,.13,blk,0,-.3,0,f);f.rotation.x=-.3;return a},
 L1=leg(-.13),L2=leg(.13),gun=new THREE.Group();gun.position.set(.08,.62,.1);hip.add(gun);bx(.07,.12,.5,dark,0,0,.15,gun);bx(.04,.04,.4,dark,0,.03,.55,gun);bx(.06,.14,.2,blk,0,-.02,-.2,gun);
 return{g,hip,hd,m:cloth,l1:L1[0],k1:L1[1],l2:L2[0],k2:L2[1],a1:arm(-.3),a2:arm(.3),gun}}
function mkRemote(id,name){const b=soldier(new THREE.Color().setHSL((id*.37)%1,.55,.32).getHex()),tag=label(name);tag.position.y=2.35;b.g.add(tag);scene.add(b.g);
 return Object.assign(b,{rp:1,id,name,by:1.25,br:.5,hy:1.8,hr:.22,s:1,rise:0,r:.5,T:{},kind:'r',tx:0,ty:0,tz:0,tr:0,tp:0,ph:0,flash:0,hp:100,sh:0,in:false,pit:0})}
function remoteUpd(e,dt){const p=e.g.position,k=Math.min(1,dt*12),ox=p.x,oz=p.z;p.x+=(e.tx-p.x)*k;p.y+=(e.ty-p.y)*k;p.z+=(e.tz-p.z)*k;
 let df=e.tr+Math.PI-e.g.rotation.y;df=Math.atan2(Math.sin(df),Math.cos(df));e.g.rotation.y+=df*k;e.pit+=(e.tp-e.pit)*k;
 const sp=Math.hypot(p.x-ox,p.z-oz)/Math.max(dt,.001);e.ph+=sp*dt*1.5;const a=Math.min(1,sp/4)*.9,sn=Math.sin(e.ph);
 e.l1.rotation.x=sn*a;e.l2.rotation.x=-sn*a;e.k1.rotation.x=Math.max(0,-sn)*a;e.k2.rotation.x=Math.max(0,sn)*a;e.hip.position.y=.95+Math.abs(sn)*.03*a;
 e.a1.rotation.x=e.a2.rotation.x=-1.25-e.pit;e.gun.rotation.x=-e.pit;e.hd.rotation.x=-e.pit*.6;
 if(e.flash>0){e.flash-=dt;e.m.emissive.setHex(0xaa2222)}else e.m.emissive.setHex(0)}
// ---------- Loop ----------
let last=performance.now();reset();loadMap(0);
function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1000);last=t;
 if(mode=='play'){update(dt,t/1000);if(gmd=='ffa')netSend(t)}else if(mode=='pause'&&gmd=='ffa')netSend(t);else if(mode=='menu'||mode=='dead'){cam.position.set(Math.cos(t/9000)*14,5,Math.sin(t/9000)*14);cam.rotation.set(-.2,-t/9000+Math.PI/2+Math.PI,0);crystal.rotation.y+=dt}
 ren.render(scene,cam)}
requestAnimationFrame(loop);
(async()=>{let t;try{t=localStorage.getItem('sr_tok')}catch(e){}if(t){const r=await api('/api/me',{t});if(!r.err){me={u:r.u,token:t,k:r.k,d:r.d};$('auth').style.display='none';toLobby();return}}$('auth').style.display='flex'})();
</script></body></html>`;

const hex=b=>[...b].map(x=>x.toString(16).padStart(2,"0")).join("");
async function sha(s){return hex(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s))))}
const JR=(o,c=200)=>new Response(JSON.stringify(o),{status:c,headers:{"content-type":"application/json"}});

// Durable Object: accounts, leaderboard and the FFA room (one global room)
export class Hub{
  constructor(st,env){this.st=st;this.pl=new Map();this.nid=1;this.tm=null}
  async user(tk){if(!tk)return null;const n=await this.st.storage.get("t:"+tk);return n?await this.st.storage.get("u:"+n.toLowerCase()):null}
  async top(){const m=await this.st.storage.list({prefix:"u:"});return[...m.values()].map(a=>({u:a.name,k:a.k||0,d:a.d||0})).sort((a,b)=>b.k-a.k).slice(0,10)}
  async bump(name,f){const k="u:"+name.toLowerCase(),a=await this.st.storage.get(k);if(a){a[f]=(a[f]||0)+1;await this.st.storage.put(k,a)}}
  bc(o){const m=JSON.stringify(o);for(const p of this.pl.values()){try{p.ws.send(m)}catch(e){}}}
  spawn(P){const a=Math.random()*6.283,r=15+Math.random()*50;P.x=Math.cos(a)*r;P.z=Math.sin(a)*r;P.y=0}
  roster(){this.bc({t:"ro",p:[...this.pl.values()].map(p=>[p.id,p.name])})}
  tick(){const now=Date.now();
    for(const p of this.pl.values())if(p.dead&&now>p.rt){p.dead=0;p.hp=100;p.inv=now+2000;this.spawn(p);try{p.ws.send(JSON.stringify({t:"sp",x:p.x,z:p.z}))}catch(e){}}
    this.bc({t:"st",p:[...this.pl.values()].map(p=>[p.id,p.x,p.y,p.z,p.r,p.p,p.w,Math.round(p.hp),p.k,p.d,p.dead?1:0,p.sh])})}
  msg(P,raw){let m;try{m=JSON.parse(raw)}catch(e){return}
    if(m.t=="s"&&!P.dead){const n=v=>Math.max(-200,Math.min(200,+v||0));P.x=n(m.x);P.y=Math.max(0,Math.min(30,+m.y||0));P.z=n(m.z);P.r=+m.r||0;P.p=+m.p||0;P.w=(m.w|0)%5}
    else if(m.t=="sh")P.sh++;
    else if(m.t=="h"){const V=this.pl.get(m.id|0);if(!V||V===P||V.dead||P.dead||V.inv>Date.now())return;if(Math.hypot(P.x-V.x,P.z-V.z)>100)return;
      V.hp-=Math.max(0,Math.min(150,+m.d||0));try{V.ws.send('{"t":"dm"}')}catch(e){}
      if(V.hp<=0){V.dead=1;V.hp=0;V.rt=Date.now()+3000;V.d++;P.k++;this.bc({t:"k",a:P.name,v:V.name,ai:P.id,vi:V.id});this.bump(P.name,"k");this.bump(V.name,"d")}}}
  drop(P){if(this.pl.get(P.id)!==P)return;this.pl.delete(P.id);this.roster();if(!this.pl.size&&this.tm){clearInterval(this.tm);this.tm=null}}
  async ws(req,url){
    if(req.headers.get("Upgrade")!="websocket")return new Response("Expected websocket",{status:426});
    const a=await this.user(url.searchParams.get("t"));if(!a)return new Response("Unauthorized",{status:401});
    for(const p of [...this.pl.values()])if(p.name==a.name){try{p.ws.close()}catch(e){}this.drop(p)}
    if(this.pl.size>=16)return new Response("Room full",{status:503});
    const[c,s]=Object.values(new WebSocketPair());s.accept();
    const P={id:this.nid++,ws:s,name:a.name,x:0,y:0,z:0,r:0,p:0,w:0,hp:100,k:0,d:0,dead:0,rt:0,sh:0,inv:Date.now()+2000};this.spawn(P);this.pl.set(P.id,P);
    s.send(JSON.stringify({t:"init",id:P.id,x:P.x,z:P.z}));this.roster();
    s.addEventListener("message",e=>this.msg(P,e.data));s.addEventListener("close",()=>this.drop(P));s.addEventListener("error",()=>this.drop(P));
    if(!this.tm)this.tm=setInterval(()=>this.tick(),66);
    return new Response(null,{status:101,webSocket:c})}
  async fetch(req){
    const url=new URL(req.url),p=url.pathname;if(p=="/ws")return this.ws(req,url);
    const b=req.method=="POST"?await req.json().catch(()=>({})):{};
    if(p=="/api/register"||p=="/api/login"){
      const u=String(b.u||"").trim(),pw=String(b.p||"");
      if(!/^[A-Za-z0-9_]{3,16}$/.test(u))return JR({err:"Username: 3-16 letters, numbers or _"});
      if(pw.length<4||pw.length>64)return JR({err:"Password: at least 4 characters"});
      const key="u:"+u.toLowerCase();let a=await this.st.storage.get(key);
      if(p=="/api/register"){if(a)return JR({err:"Username already taken"});const salt=hex(crypto.getRandomValues(new Uint8Array(8)));a={name:u,salt,hash:await sha(salt+pw),k:0,d:0};await this.st.storage.put(key,a)}
      else if(!a||a.hash!=await sha(a.salt+pw))return JR({err:"Wrong username or password"});
      const tk=hex(crypto.getRandomValues(new Uint8Array(16)));await this.st.storage.put("t:"+tk,a.name);return JR({token:tk,u:a.name,k:a.k||0,d:a.d||0})}
    if(p=="/api/me"){const a=await this.user(b.t);return a?JR({u:a.name,k:a.k||0,d:a.d||0}):JR({err:"Session expired"},401)}
    if(p=="/api/lb")return JR(await this.top());
    return JR({err:"Not found"},404)}
}

export default {
  async fetch(request, env) {
    const u = new URL(request.url);
    if (u.pathname.startsWith("/api/") || u.pathname == "/ws") {
      if (!env.HUB) return JR({ err: "Server not configured: add the HUB Durable Object binding (see wrangler.toml)" }, 503);
      return env.HUB.get(env.HUB.idFromName("main")).fetch(request);
    }
    return new Response(HTML, { headers: { "content-type": "text/html;charset=UTF-8", "cache-control": "no-store" } });
  },
};
