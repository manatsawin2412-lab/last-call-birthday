'use strict';
const callLines=[
 'ฮัลโหล ทัย ได้ยินไหม อู๋เอง วันนี้กลับดึกเหรอ ไม่มีวินแล้วใช่ไหม',
 'เมื่อกี้สัญญาณแทรกนิดหน่อย ไม่ต้องกลัวนะ ฉันอยู่ในสาย กดเริ่มเดินมาได้เลย เดี๋ยวคุยเป็นเพื่อนจนถึงห้อง',
 'ทัย ยังได้ยินฉันไหม อย่าหันไปมอง เดินอยู่ในแสงไว้ ฉันยังไม่วางสาย'
];
window.callIntro=(()=>{
 let connected=false,phase='idle',session=0,timers=[],ringing=null;
 const originalStart=$('newGame').onclick,originalContinue=$('continueGame').onclick;
 $('menuCall').parentElement.insertBefore($('menuCall'),$('newGame'));
 const ringText=elem('p','ยังไม่ได้ต่อสาย · โทรหาอู๋ก่อนออกเดินทาง','call-ready-note');ringText.id='callReadyNote';$('menuCall').parentElement.insertBefore(ringText,$('newGame'));
 function schedule(fn,ms){const id=session;const timer=setTimeout(()=>{if(id===session)fn()},ms);timers.push(timer);return timer}
 function stopRing(){window.gameSfx?.stop('ring');if(ringing){clearInterval(ringing);ringing=null}}
 function ring(){if(phase!=='ringing'||document.hidden)return;if(window.gameSfx?.play('ring'))return;tone(425,.85,'sine',.045);tone(450,.85,'sine',.022)}
 function cancel(){session++;timers.forEach(clearTimeout);timers=[];stopRing();window.ouVoice?.stop();window.ghostActor?.hide();if(phase!=='connected')phase='idle';window.experience?.cinematicSound(false)}
 function lock(){ $('newGame').disabled=!connected;$('newGame').textContent=connected?'เริ่มเดินกลับหอ →':'เริ่มเกม · รออู๋รับสายก่อน';$('menuCall').innerHTML=connected?'☎ คาสายอู๋ไว้ <small>เดินต่อโดยไม่วางสาย</small>':'☎ โทรหาอู๋ <small>ทัยไม่อยากเดินกลับคนเดียว</small>';$('continueGame').disabled=!connected;ringText.textContent=connected?'● อู๋รับสายแล้ว · พร้อมเดินเป็นเพื่อน':'ยังไม่ได้ต่อสาย · โทรหาอู๋ก่อนออกเดินทาง';ringText.classList.toggle('connected',connected)}
 function stage(title,subtitle){$('callPhase').textContent=title;$('callCaption').textContent=subtitle;$('modal').setAttribute('data-call-phase',phase)}
 function deliver(text,next){stage('อู๋ · อยู่ในสาย','“'+text+'”');const started=Date.now();let advanced=false;const advance=()=>{if(advanced||phase==='idle')return;advanced=true;schedule(next,Math.max(800,3200-(Date.now()-started)))};window.ouVoice?.say(text,advance);schedule(advance,Math.max(8000,text.length*120))}
 function finish(){connected=true;phase='connected';lock();window.experience?.cinematicSound(false);stage('☎ คาสายอู๋ไว้','สายยังเชื่อมต่ออยู่ · ย่อหน้าจอนี้แล้วเดินกลับหอไปด้วยกัน');const row=$('modal').querySelector('.actions');row.replaceChildren();const resume=!!readSave();const b=elem('button',resume?'คาสายไว้ · เดินต่อจากจุดเดิม →':'คาสายไว้ · เริ่มเดินกลับหอ →','primary');b.onclick=()=>{cancel();closeModal();if(resume)originalContinue();else originalStart()};const replay=elem('button','ฟังเสียงอู๋อีกครั้ง');replay.onclick=()=>window.ouVoice?.say(callLines[1]);row.append(b,replay);if(resume){const fresh=elem('button','คาสายไว้ · เริ่มคืนใหม่');fresh.onclick=()=>{cancel();closeModal();originalStart()};row.append(fresh)}}
 function answer(){if(phase!=='ringing')return;stopRing();phase='answered';const waiting=elem('button','☎ อู๋อยู่ในสาย · กำลังคุย');waiting.disabled=true;$('modal').querySelector('.actions').replaceChildren(waiting);tone(950,.08,'sine',.025);deliver(callLines[0],()=>{phase='interference';stage('สัญญาณแทรก…','เมื่อกี้… มีใครอยู่ข้างหลังหรือเปล่า');window.ghostActor?.show(true);schedule(()=>{window.ghostActor?.hide();phase='reassuring';deliver(callLines[1],finish)},600)})}
 function begin(){if(connected&&!active){cancel();closeModal();if(readSave())originalContinue();else originalStart();return}if(transitioning||active||phase==='ringing'||phase==='answered'||phase==='reassuring'||phase==='interference')return;cancel();state.audio=$('audioPref').checked;state.scares=$('scarePref').checked;soundInit();modal('โทรหาอู๋','',[['วางสาย',()=>{cancel();closeModal();lock()}]]);phase='ringing';$('modal').classList.add('call-intro');const row=$('modal').querySelector('.actions'),card=elem('div',undefined,'call-phone-card');const avatar=elem('div','อู๋','call-avatar'),label=elem('p','กำลังโทรออก…','call-phase');label.id='callPhase';const caption=elem('p','ตื๊ด… ตื๊ด… รอคนปลายสายรับโทรศัพท์','call-caption');caption.id='callCaption';card.append(avatar,elem('h3','อู๋'),elem('div','▂ ▄ ▂ ▆ ▃ ▅ ▂','call-wave'),label,caption);$('modal').insertBefore(card,row);window.experience?.cinematicSound(true);ring();ringing=setInterval(ring,2600);schedule(answer,4900)}
 $('menuCall').onclick=begin;$('newGame').onclick=()=>{if(!connected){begin();return}cancel();originalStart()};$('continueGame').onclick=()=>{if(!connected){begin();return}cancel();originalContinue()};lock();
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&phase!=='idle'&&phase!=='connected'){cancel();closeModal();lock()}});
 return{begin,answer,cancel,getStatus:()=>({connected,phase})};
})();
