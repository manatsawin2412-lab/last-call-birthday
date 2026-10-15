'use strict';
window.gameSfx=(()=>{
 const paths={steps:'steps.mp3',ring:'ring.mp3',knock:'knock.mp3',door:'door.mp3',message:'message.mp3',laugh:'ghost-laugh.mp3',chew:'chew.mp3',flash:'flash.mp3'},bank={};
 function play(key){if(!state.audio||document.hidden||typeof window.Audio!=='function')return false;const file=paths[key];if(!file)return false;const a=bank[key]??=new window.Audio('assets/sfx/'+file);if(a.paused===false)return true;a.volume={steps:.18,ring:.4,knock:.25,door:.3,message:.2,laugh:.2,chew:.28,flash:.23}[key];a.loop=key==='ring';a.currentTime=0;Promise.resolve(a.play()).catch(()=>{});return true}
 function stop(key){if(key){bank[key]?.pause();return}Object.values(bank).forEach(a=>a.pause())}
 const old=$('sound').onclick;$('sound').onclick=()=>{old();if(!state.audio)stop()};document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});return{play,stop};
})();
