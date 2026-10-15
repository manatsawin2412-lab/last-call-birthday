'use strict';
window.ouVoice=(()=>{
 let player=null,finish=null,serial=0;
 function stop(){serial++;if(player){player.onended=null;player.onerror=null;player.pause();player=null}window.speechSynthesis?.cancel();const done=finish;finish=null;done?.()}
 function say(text,onEnd){stop();const id=serial;let ended=false;const done=()=>{if(ended||id!==serial)return;ended=true;finish=null;onEnd?.()};finish=done;
  if(!state.audio||!$('voicePref').checked){done();return false}
  const path=window.ouVoiceFiles?.[text];if(path&&typeof window.Audio==='function'){player=new window.Audio(path);player.volume=.9;player.onended=done;player.onerror=done;Promise.resolve(player.play()).catch(done);return true}
  const synth=window.speechSynthesis,Utterance=window.SpeechSynthesisUtterance;
  const male=synth?.getVoices().find(v=>/^th(?:-|_)/i.test(v.lang)&&/niwat|pattara|nattapong|krit|male(?!.*female)/i.test(v.name)&&!/female/i.test(v.name));
  if(male&&Utterance){const u=new Utterance(text);u.voice=male;u.lang='th-TH';u.rate=.9;u.pitch=.9;u.volume=.9;u.onend=done;u.onerror=done;synth.speak(u);return true}done();return false;
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 return{say,stop};
})();
