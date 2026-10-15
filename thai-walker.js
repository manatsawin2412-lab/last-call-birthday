'use strict';
window.thaiWalker=(()=>{
 let sceneId=-1,frame=2,loaded=false,x=53,y=89,target=null,pending=null,bypass=false,steps=0,facing=1;
 const keys=new Set(),stage=$('stage'),actor=elem('div',undefined,'thai-walker hidden'),sprite=elem('canvas',undefined,'thai-walk-sprite');actor.id='thaiWalker';actor.setAttribute('role','img');actor.setAttribute('aria-label','ทัย · เดินด้วยลูกศรหรือ WASD');actor.append(sprite);stage.append(actor);
 const button=elem('button','✥ วิธีเดิน');button.id='walkThai';button.onclick=()=>modal('เดินสำรวจ','ลูกศร / W A S D: เดิน\nแตะพื้น: เดินไปจุดนั้น\nคลิกไอเทม: เดินไปเก็บหรือสำรวจ\nE: สำรวจของใกล้ตัว · P: โทรศัพท์\nเปิดกระดาษหรือโทรศัพท์แล้วตัวละครหยุด');$('solveBtn').parentElement.insertBefore(button,$('solveBtn'));
 const controls=elem('div',undefined,'walk-controls');controls.id='walkControls';[['↑',0,-1],['←',-1,0],['↓',0,1],['→',1,0]].forEach(([label,dx,dy])=>{const b=elem('button',label);b.setAttribute('aria-label','เดิน'+label);b.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(label);target=pending=null;b.setPointerCapture?.(e.pointerId)});const release=()=>keys.delete(label);b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);b.onclick=()=>walkTo(x+dx*8,y+dy*5);controls.append(b)});$('solveBtn').parentElement.insertBefore(controls,$('solveBtn'));
 const painter=sprite.getContext?.('2d');sprite.width=410;sprite.height=543;const img=new Image();img.onload=()=>{loaded=true;actor.style.setProperty('--walk-ratio',String(410/543));scene()};img.src='assets/thai-walk-striped.png';
 function floor(tx,ty){return window.walkSurfaces?.point(state.scene,tx,ty)||{x:Math.max(7,Math.min(93,tx)),y:Math.max(66,Math.min(93,ty))}}
 function draw(n){frame=n;if(loaded&&painter){const regions=[[0,410],[430,318],[770,314],[1100,348]],sx=img.naturalWidth/1448,sy=img.naturalHeight/1086,[left,width]=regions[n%4],row=Math.floor(n/4);painter.clearRect(0,0,410,543);painter.drawImage(img,left*sx,(row*543+2)*sy,width*sx,539*sy,(410-width)/2,2,width,539);}sprite.setAttribute('data-walk-frame',String(n));actor.style.left=x+'%';actor.style.bottom=100-y+'%';actor.style.setProperty('--depth',String(window.walkSurfaces?.depth(state.scene,y)??(.7+(y-66)/95)));window.roomMirror?.draw(sprite,{x,y,frame,facing})}
 function remember(){state.playerPosition={scene:state.scene,x,y};save()}
 function scene(){actor.classList.toggle('hidden',!active||!loaded);controls.classList.toggle('hidden',!active||!loaded);if(!active||!loaded)return;if(sceneId!==state.scene){sceneId=state.scene;target=pending=null;keys.clear();const p=state.playerPosition;const start=floor(p?.scene===state.scene&&Number.isFinite(p.x)?p.x:state.scene===4?66:53,p?.scene===state.scene&&Number.isFinite(p.y)?p.y:state.scene===3?95:93);x=start.x;y=start.y;facing=1;actor.style.setProperty('--facing',facing);remember()}draw(2)}
 function stop(){sceneId=-1;target=pending=null;keys.clear();actor.classList.add('hidden');controls.classList.add('hidden')}
 function walkTo(tx,ty,callback){if(!active||!loaded||!$('overlay').classList.contains('hidden'))return false;target=floor(tx,ty);pending=callback||null;keys.clear();return true}
 function approach(item){if(bypass||!active||!loaded||!$('overlay').classList.contains('hidden'))return false;const p=state.scene===4&&item[0]==='mirror'?floor(68,90):floor(item[2],Math.max(70,Math.min(95,item[3]+15)));if(Math.hypot(p.x-x,(p.y-y)*1.5)<7)return false;return walkTo(p.x,p.y,()=>{bypass=true;try{inspect(item)}finally{bypass=false}})}
 function tick(){
  if(!active||!loaded||document.hidden)return;
  if(!$('overlay').classList.contains('hidden')){keys.clear();draw(2);return}
  let dx=(keys.has('ArrowRight')||keys.has('d')||keys.has('→')?1:0)-(keys.has('ArrowLeft')||keys.has('a')||keys.has('←')?1:0),dy=(keys.has('ArrowDown')||keys.has('s')||keys.has('↓')?1:0)-(keys.has('ArrowUp')||keys.has('w')||keys.has('↑')?1:0);
  if(dx||dy){target=pending=null;const len=Math.hypot(dx,dy);dx=dx/len*1.25;dy=dy/len*.7}
  else if(target){const tx=target.x-x,ty=target.y-y,len=Math.hypot(tx,ty);if(len<1.4){x=target.x;y=target.y;target=null;const done=pending;pending=null;draw(2);remember();done?.();return}dx=tx/len*1.25;dy=ty/len*1.25}
  else{draw(2);return}
  const p=floor(x+dx,y+dy);x=p.x;y=p.y;
  if(dx){facing=dx>0?-1:1;actor.style.setProperty('--facing',facing)}
  draw(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?2:(frame+1)%8);
  if(++steps%4===0&&!window.gameSfx?.play('steps'))tone(125,.05,'triangle',.009);if(steps%12===0)remember();
 }
 stage.addEventListener('click',e=>{if(e.target.closest?.('button'))return;const r=stage.getBoundingClientRect();walkTo((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100)});
 document.addEventListener('keydown',e=>{if(!active||!$('overlay').classList.contains('hidden')||/INPUT|TEXTAREA/.test(e.target?.tagName||''))return;const k=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(k)){e.preventDefault();keys.add(k)}if(k==='e'){const candidates=scenes[state.scene].items.filter(i=>state.scene!==0||i[0]==='taxi'||(i[0]==='wallet'&&!state.seen.includes('wallet')));const near=candidates.reduce((a,b)=>Math.abs(b[2]-x)<Math.abs(a[2]-x)?b:a);inspect(near)}if(k==='p')window.gamePhone?.open()});document.addEventListener('keyup',e=>{keys.delete(e.key.length===1?e.key.toLowerCase():e.key);if(active)remember()});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();target=pending=null;remember()}});
 setInterval(tick,85);return{scene,stop,tick,walkTo,approach,getStatus:()=>({frame,x,y,target,loaded,sceneId,walking:!!target||keys.size>0})};
})();
