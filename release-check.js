'use strict';
(()=>{
 const failed=new Set();let panel;
 function report(){
  if(!document.body)return;
  if(panel)return;
  panel=document.createElement('section');panel.className='release-error';panel.setAttribute('role','alert');
  const title=document.createElement('h2');title.textContent='ไฟล์ฉากล่าสุดยังโหลดไม่ครบ';
  const text=document.createElement('p');text.textContent='โหลดหน้าใหม่เพื่อใช้ฉากสระ กระจก และวิดีโอชุดเดียวกัน';
  const retry=document.createElement('button');retry.textContent='โหลดเกมฉบับล่าสุด';retry.onclick=()=>{const url=new URL(location.href);url.searchParams.set('v','20261015-r10');url.searchParams.set('reload',Date.now());location.replace(url.href)};
  panel.append(title,text,retry);document.body.append(panel);
 }
 window.addEventListener('error',e=>{if(e.target?.tagName==='SCRIPT'||e.target?.tagName==='LINK'){failed.add(e.target.src||e.target.href);report()}},true);
 window.addEventListener('load',()=>{for(const name of ['walkSurfaces','roomMirror','thaiWalker','birthdayMedia','birthdayEnding'])if(!window[name])failed.add(name);if(failed.size)report();document.documentElement.dataset.gameRelease='20261015-r10'});
})();
