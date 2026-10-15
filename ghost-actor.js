'use strict';
window.ghostActor=(()=>{
 let frame=0,remaining=0,menu=false,visits=0,playTicks=0,cooldown=0,lastScene=-1,poseTicks=0;const actor=elem('div',undefined,'haunt-actor hidden'),sprite=elem('div',undefined,'haunt-sprite');actor.id='hauntActor';actor.setAttribute('aria-hidden','true');actor.append(sprite);$('stage').append(actor);
 const flash=elem('div',undefined,'call-ghost-flash hidden'),flashSprite=elem('div',undefined,'haunt-sprite');flash.id='callGhostFlash';flash.setAttribute('aria-hidden','true');flash.append(flashSprite);document.body.append(flash);
 const img=new Image();img.onload=()=>{const r=(img.naturalWidth/4)/(img.naturalHeight/2);actor.style.setProperty('--ghost-ratio',r);flash.style.setProperty('--ghost-ratio',r)};img.src='assets/ghost-poses.png';
 function hide(){remaining=0;actor.classList.add('hidden');flash.classList.add('hidden')}
 function show(onMenu=false){if(!state.scares||document.hidden||(!active&&!onMenu))return false;if(!onMenu){state.hauntScenes??=[];if(![2,3].includes(state.scene)||cooldown>0||state.hauntScenes.includes(state.scene))return false;state.hauntScenes.push(state.scene);cooldown=720;save()}hide();menu=onMenu;frame=onMenu?3:visits++%4;poseTicks=0;remaining=onMenu?8:32;const el=onMenu?flash:actor;el.classList.remove('hidden');actor.classList.remove('haunt-enter');void actor.offsetWidth;if(!onMenu)actor.classList.add('haunt-enter');actor.style.left=state.scene===3?'76%':'83%';draw();if(onMenu){noise(.12,.025);tone(74,.2,'triangle',.015)}else tone(65,.6,'triangle',.009);return true}
 function draw(){const target=menu?flashSprite:sprite;target.style.backgroundPosition=frame%4/3*100+'% '+Math.floor(frame/4)*100+'%'}
 function tick(){if(document.hidden||!state.scares||(!menu&&(!active||!$('overlay').classList.contains('hidden')))){if(remaining)hide();return}if(active&&$('overlay').classList.contains('hidden')){if(lastScene!==state.scene){lastScene=state.scene;playTicks=0}playTicks++;if(cooldown>0)cooldown--;if(playTicks>=360&&!remaining&&cooldown===0&&[2,3].includes(state.scene)&&!state.hauntScenes?.includes(state.scene))show()}if(!remaining)return;if(++poseTicks%8===0&&!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)frame=(frame+1)%8;draw();if(--remaining<=0)hide()}
 setInterval(tick,250);
 return{show,hide,tick,getStatus:()=>({frame,remaining,menu})};
})();
