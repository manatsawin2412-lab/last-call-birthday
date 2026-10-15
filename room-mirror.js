'use strict';
window.roomMirror=(()=>{
 const frame=elem('div',undefined,'room-mirror hidden'),glass=elem('div',undefined,'mirror-glass'),reflection=elem('canvas',undefined,'mirror-reflection');
 frame.id='roomMirror';frame.setAttribute('role','img');frame.setAttribute('aria-label','กระจกเต็มตัว สะท้อนทัยตามตำแหน่งและท่าเดิน');reflection.width=410;reflection.height=543;glass.append(reflection);frame.append(glass);$('stage').append(frame);const painter=reflection.getContext?.('2d');
 function draw(source,p){const visible=active&&state.scene===4;frame.classList.toggle('hidden',!visible);if(!visible)return;reflection.style.left=(50+(p.x-80)*1.7)+'%';reflection.style.bottom=(7+(97-p.y)*.35)+'%';reflection.style.height=(70+(p.y-74)*.5)+'%';reflection.style.transform='translateX(-50%) scaleX('+(-p.facing)+')';reflection.setAttribute('data-walk-frame',String(p.frame));frame.setAttribute('data-player-x',String(p.x));if(painter){painter.clearRect(0,0,410,543);painter.drawImage(source,0,0)}}
 return{draw};
})();
