(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();const Gr=r=>440*Math.pow(2,(r-69)/12),as=[{id:"kick",name:"Kick",color:"#ff6a3d"},{id:"snare",name:"Snare",color:"#ffb23d"},{id:"clap",name:"Clap",color:"#ffd93d"},{id:"hat",name:"Hi-hat",color:"#9be15d"},{id:"ohat",name:"Open hat",color:"#3dd9a8"},{id:"conga",name:"Conga",color:"#3db7ff"},{id:"shaker",name:"Shaker",color:"#8a7bff"},{id:"bell",name:"Cowbell",color:"#ff7bd0"}];class Af{constructor(){this.ctx=null,this.listeners=new Set,this.playing=!1,this.step=0,this.timer=null,this.state=null,this.nextTime=0,this.lastVisual=[]}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}const t=this.ctx=new(window.AudioContext||window.webkitAudioContext);this.in=t.createGain(),this.filter=t.createBiquadFilter(),this.filter.type="lowpass",this.filter.frequency.value=18e3,this.filter.Q.value=.7,this.comp=t.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.ratio.value=4,this.comp.attack.value=.005,this.comp.release.value=.2,this.master=t.createGain(),this.master.gain.value=.8,this.analyser=t.createAnalyser(),this.analyser.fftSize=512,this.analyser.smoothingTimeConstant=.78,this.dest=t.createMediaStreamDestination(),this.in.connect(this.filter),this.filter.connect(this.comp),this.comp.connect(this.master),this.master.connect(t.destination),this.master.connect(this.analyser),this.master.connect(this.dest),this.delay=t.createDelay(1.5),this.delay.delayTime.value=.375,this.fb=t.createGain(),this.fb.gain.value=.35,this.dsend=t.createGain(),this.dsend.gain.value=0;const e=t.createBiquadFilter();e.type="lowpass",e.frequency.value=3500,this.dsend.connect(this.delay),this.delay.connect(e),e.connect(this.fb),this.fb.connect(this.delay),e.connect(this.in),this.verb=t.createConvolver(),this.verb.buffer=this.impulse(2.4,2.6),this.rsend=t.createGain(),this.rsend.gain.value=0,this.rsend.connect(this.verb),this.verb.connect(this.in);const n=t.createBuffer(1,t.sampleRate*1,t.sampleRate),i=n.getChannelData(0);for(let s=0;s<i.length;s++)i[s]=Math.random()*2-1;this.noise=n,this.freq=new Uint8Array(this.analyser.frequencyBinCount)}impulse(t,e){const n=this.ctx,i=n.sampleRate*t,s=n.createBuffer(2,i,n.sampleRate);for(let a=0;a<2;a++){const o=s.getChannelData(a);for(let l=0;l<i;l++)o[l]=(Math.random()*2-1)*Math.pow(1-l/i,e)}return s}out(t,e=1){if(t.connect(this.in),this.dsend){const n=this.ctx.createGain();n.gain.value=e,t.connect(n),n.connect(this.dsend);const i=this.ctx.createGain();i.gain.value=e,t.connect(i),i.connect(this.rsend)}}setFx({cutoff:t,delay:e,reverb:n,volume:i}){if(!this.ctx)return;const s=this.ctx.currentTime;t!=null&&this.filter.frequency.setTargetAtTime(t,s,.03),e!=null&&this.dsend.gain.setTargetAtTime(e,s,.03),n!=null&&this.rsend.gain.setTargetAtTime(n,s,.03),i!=null&&this.master.gain.setTargetAtTime(i,s,.03)}setTempoSync(t){this.delay&&(this.delay.delayTime.value=Math.min(1.4,60/t*.75))}env(t,e,n,i,s,a=1e-4){t.gain.cancelScheduledValues(e),t.gain.setValueAtTime(1e-4,e),t.gain.linearRampToValueAtTime(i,e+n),t.gain.exponentialRampToValueAtTime(a,e+n+s)}burst(t,e,n,i,s,a,o=.15){const l=this.ctx,c=l.createBufferSource();c.buffer=this.noise,c.loop=!0;const h=l.createBiquadFilter();h.type=n,h.frequency.value=i,h.Q.value=s;const u=l.createGain();this.env(u,t,.001,a,e),c.connect(h),h.connect(u),this.out(u,o),c.start(t,Math.random()*.5),c.stop(t+e+.05)}tone(t,e,n,i,s,a,o=.1){const l=this.ctx,c=l.createOscillator(),h=l.createGain();c.type=e,c.frequency.setValueAtTime(n,t),i!==n&&c.frequency.exponentialRampToValueAtTime(i,t+s*.8),this.env(h,t,.002,a,s),c.connect(h),this.out(h,o),c.start(t),c.stop(t+s+.05)}drum(t,e,n=1){switch(t){case"kick":this.tone(e,"sine",160,42,.42,1*n,0),this.burst(e,.02,"lowpass",900,.5,.35*n,0);break;case"snare":this.tone(e,"triangle",190,140,.14,.45*n,.1),this.burst(e,.2,"bandpass",2200,.7,.7*n,.2);break;case"clap":for(let i=0;i<3;i++)this.burst(e+i*.011,.07,"bandpass",1500,1.1,.55*n,.3);this.burst(e+.034,.18,"bandpass",1500,1.1,.5*n,.35);break;case"hat":this.burst(e,.05,"highpass",8e3,.8,.32*n,.05);break;case"ohat":this.burst(e,.32,"highpass",7e3,.8,.3*n,.1);break;case"conga":this.tone(e,"sine",330,230,.2,.6*n,.2),this.burst(e,.03,"bandpass",1800,1,.2*n,.1);break;case"shaker":{const i=this.ctx,s=i.createBufferSource();s.buffer=this.noise;const a=i.createBiquadFilter();a.type="highpass",a.frequency.value=6500;const o=i.createGain();o.gain.setValueAtTime(1e-4,e),o.gain.linearRampToValueAtTime(.22*n,e+.025),o.gain.exponentialRampToValueAtTime(1e-4,e+.09),s.connect(a),a.connect(o),this.out(o,.1),s.start(e,.1),s.stop(e+.12);break}case"bell":{const i=this.ctx,s=i.createGain(),a=i.createBiquadFilter();a.type="bandpass",a.frequency.value=700,a.Q.value=1.5;for(const o of[562,845]){const l=i.createOscillator();l.type="square",l.frequency.value=o,l.connect(a),l.start(e),l.stop(e+.3)}this.env(s,e,.002,.28*n,.22),a.connect(s),this.out(s,.15);break}}}bass(t,e,n,i=1){const s=this.ctx,a=Gr(e),o=s.createGain(),l=s.createBiquadFilter();l.type="lowpass",l.Q.value=5,l.frequency.setValueAtTime(a*7,t),l.frequency.exponentialRampToValueAtTime(a*1.5,t+n*.9);const c=s.createOscillator(),h=s.createOscillator();c.type="sawtooth",h.type="sine",c.frequency.value=a,h.frequency.value=a/2;const u=s.createGain();u.gain.value=.5,c.connect(l),h.connect(u),u.connect(l),l.connect(o),o.gain.setValueAtTime(1e-4,t),o.gain.linearRampToValueAtTime(.5*i,t+.01),o.gain.exponentialRampToValueAtTime(1e-4,t+n),this.out(o,.03),c.start(t),h.start(t),c.stop(t+n+.05),h.stop(t+n+.05)}lead(t,e,n,i=1,s="pluck"){if(s==="organ"||s==="square"||s==="bell"||s==="pad")return this.voice(t,e,n,i,s);const a=this.ctx,o=Gr(e),l=a.createGain(),c=a.createBiquadFilter();c.type="lowpass",c.Q.value=2,c.frequency.setValueAtTime(Math.min(12e3,o*9),t),c.frequency.exponentialRampToValueAtTime(Math.max(300,o*2),t+n);for(const h of[-6,6]){const u=a.createOscillator();u.type=s==="pluck"?"sawtooth":"triangle",u.frequency.value=o,u.detune.value=h,u.connect(c),u.start(t),u.stop(t+n+.1)}c.connect(l),l.gain.setValueAtTime(1e-4,t),l.gain.linearRampToValueAtTime(.2*i,t+.006),l.gain.exponentialRampToValueAtTime(1e-4,t+n),this.out(l,.4)}voice(t,e,n,i,s){const a=this.ctx,o=Gr(e),l=a.createGain(),c=a.createBiquadFilter();c.type="lowpass";let h,u=.01,f=.1,d=.16*i;s==="organ"?(h=[["sine",1,1],["sine",2,.6],["sine",3,.35],["sine",4,.2]],c.frequency.value=5e3,d=.12*i):s==="square"?(h=[["square",1,1],["square",2.003,.3]],c.frequency.value=2600,d=.1*i):s==="bell"?(h=[["sine",1,1],["sine",2.76,.5],["sine",5.4,.25],["sine",8.93,.12]],c.frequency.value=9e3,n=Math.max(n,1.2),f=n,d=.14*i):(h=[["sawtooth",1,1],["sawtooth",1.004,1],["triangle",.5,.8]],c.frequency.value=1400,u=.25,f=.5,n=Math.max(n,.9),d=.09*i);for(const[g,_,m]of h){const p=a.createOscillator(),v=a.createGain();p.type=g,p.frequency.value=o*_,v.gain.value=m/h.length*2,p.connect(v),v.connect(c),p.start(t),p.stop(t+n+f+.05)}c.connect(l),l.gain.setValueAtTime(1e-4,t),l.gain.linearRampToValueAtTime(d,t+u),s==="bell"?l.gain.exponentialRampToValueAtTime(1e-4,t+n):(l.gain.setValueAtTime(d,t+Math.max(u,n*.7)),l.gain.exponentialRampToValueAtTime(1e-4,t+n+f)),this.out(l,.45)}kalimba(t,e,n=1){const i=Gr(e);this.tone(t,"sine",i,i,.9,.35*n,.5),this.tone(t,"sine",i*4.1,i*4.1,.15,.1*n,.5)}chord(t,e,n,i=1){const s=this.ctx,a=s.createGain(),o=s.createBiquadFilter();o.type="lowpass",o.frequency.value=2400;for(const l of e)for(const c of[-5,5]){const h=s.createOscillator();h.type="triangle",h.frequency.value=Gr(l),h.detune.value=c,h.connect(o),h.start(t),h.stop(t+n+.4)}o.connect(a),a.gain.setValueAtTime(1e-4,t),a.gain.linearRampToValueAtTime(.11*i,t+.06),a.gain.setValueAtTime(.11*i,t+n*.7),a.gain.exponentialRampToValueAtTime(1e-4,t+n+.3),this.out(a,.5)}start(t){this.init(),!this.playing&&(this.getState=t,this.playing=!0,this.step=0,this.nextTime=this.ctx.currentTime+.06,this.timer=setInterval(()=>this.tick(),25),this.emit())}stop(){clearInterval(this.timer),this.playing=!1,this.step=0,this.emit()}tick(){const t=this.ctx.currentTime+.14;for(;this.nextTime<t;){const e=this.getState(this.step),n=e.div||4,i=60/e.bpm/n;this.setTempoSync(e.bpm);const s=this.step%e.length,a=s%2===1&&n===4?e.swing*i*.5:0,o=this.nextTime+a;this.playStep(e,s,o,i);const l=Math.max(0,(o-this.ctx.currentTime)*1e3);setTimeout(()=>this.emit(s),l),this.nextTime+=i,this.step=(this.step+1)%e.length}}playStep(t,e,n,i){for(const h of t.tracks){const u=h.steps[e];u&&!h.mute&&this.drum(h.id,n,(u===2?1.25:.85)*h.vol)}const s=t.root,a=t.scale,o=(h,u)=>s+12*u+a[(h%a.length+a.length)%a.length]+12*Math.floor(h/a.length),l=t.bass.steps[e];l!=null&&!t.bass.mute&&this.bass(n,o(l,2),i*1.8,t.bass.vol);const c=t.lead.steps[e];if(c!=null&&!t.lead.mute&&this.lead(n,o(c,4),i*2.2,t.lead.vol,t.lead.kind),t.chords&&t.chords.on&&e%t.length===0){const h=t.chords.list[(this.bar=(this.bar||0)+1)%t.chords.list.length];this.chord(n,h.map(u=>s+48+u),i*t.length,.9)}}on(t){return this.listeners.add(t),()=>this.listeners.delete(t)}emit(t){for(const e of this.listeners)e(t)}levels(){return this.analyser?(this.analyser.getByteFrequencyData(this.freq),this.freq):null}record(){if(this.init(),this.rec)return;this.chunks=[];const t=MediaRecorder.isTypeSupported("audio/webm;codecs=opus")?"audio/webm;codecs=opus":"";this.rec=new MediaRecorder(this.dest.stream,t?{mimeType:t}:void 0),this.rec.ondataavailable=e=>e.data.size&&this.chunks.push(e.data),this.rec.start()}stopRecord(){return new Promise(t=>{if(!this.rec)return t(null);this.rec.onstop=()=>{const e=new Blob(this.chunks,{type:this.rec.mimeType||"audio/webm"});this.rec=null,t(e)},this.rec.stop()})}}const Dt=new Af,wf=r=>[...r.replace(/\s/g,"")].map(t=>t==="x"?1:t==="X"?2:0),Rf=r=>r.trim().split(/\s+/).map(t=>t==="."?null:+t),Bt=(r,t,e,n,i,s,a,o,l,c,h,u,f,d)=>({id:r,name:t,region:e,bpm:n,len:i,div:s,swing:a,drums:o,bass:l,lead:c,root:h,scale:u,blurb:f,tag:d}),he=[Bt("afrobeat","Afrobeat","Nigeria",108,16,4,0,{kick:"X..x..x...x..x..",snare:"....x.......x...",clap:"................",hat:"x.x.x.x.x.x.x.x.",ohat:"..............x.",conga:"..x..x..x..x..x.",shaker:"xxxxxxxxxxxxxxxx",bell:"x..x..x.x..x..x."},"0 . . 0 . . 2 . 0 . . 0 . 3 . .",". . 4 . . 2 . 4 . . 5 . 4 . . .",2,"Dorian","Polyrhythm over a steady kick, built around interlocking percussion. Associated with Fela Kuti and the Africa 70 sound.","Groove"),Bt("afrobeats","Afrobeats (Naija pop)","Nigeria",100,16,4,0,{kick:"X..x..x...x...x.",snare:"....x.......x...",clap:"....x.......x...",hat:"x.x.x.x.x.x.x.x.",ohat:".......x.......x",conga:"..x..x...x..x...",shaker:"x.xxx.xxx.xxx.xx",bell:"................"},"0 . . . 0 . . 3 . . 0 . . . 2 .","4 . . 2 . . 4 . 5 . . . 4 2 . .",9,"Minor pentatonic",'Mid-tempo with a syncopated "3+3+2" kick and shaker, singable minor-pentatonic toplines.',"Pop"),Bt("amapiano","Amapiano","South Africa",112,16,4,.08,{kick:"X.......X.......",snare:"................",clap:"....x.......x...",hat:"x.x.x.x.x.x.x.x.",ohat:"..x...x...x...x.",conga:"....x..x....x...",shaker:"xxxxxxxxxxxxxxxx",bell:"................"},"0 . . 0 . 0 . 3 . . 0 . 0 . 4 .",". . 7 . 4 . 2 . . . 5 . 4 . . .",7,"Natural minor","Soft four-on-the-floor feel with a deep log-drum-style bassline, jazzy pads and a light swing.","House"),Bt("highlife","Highlife","Ghana / Nigeria",118,16,4,.12,{kick:"x...x...x...x...",snare:"....x.......x...",clap:"................",hat:"x.xxx.xxx.xxx.xx",ohat:"................",conga:".x.x..x..x.x..x.",shaker:"x.x.x.x.x.x.x.x.",bell:"x..x..x.x..x..x."},"0 . . 0 . . 4 . 0 . . 4 . . 3 .","2 . 4 . 5 . 4 . 2 . 4 . 7 . 5 .",7,"Major","Sunny guitar lines over a light swung groove. The ancestor of much West African pop.","Groove"),Bt("juju","Jùjú","Nigeria",112,12,3,0,{kick:"x..x..x..x..",snare:"...x..x..x..",clap:"............",hat:"x.xx.xx.xx.x",ohat:"............",conga:"..x.x..x.x.x",shaker:"xxxxxxxxxxxx",bell:"x.xx.xx.xx.x"},"0 . . 0 . . 2 . . 0 . .","4 . 5 . 4 . 2 . . 0 . .",2,"Major","A 12/8 feel (four beats, each split in three) with talking-drum style call and response. Associated with King Sunny Adé.","12/8"),Bt("bembe","Bembé 12/8","West Africa / Cuba",120,12,3,0,{kick:"x..x..x..x..",snare:"............",clap:"............",hat:"............",ohat:"............",conga:"x.x.xx.x.x.x",shaker:"x.xxx.xx.xx.",bell:"x.x.xx.x.x.x"},"0 . . . . . 3 . . . . .",". . . 4 . . . . 2 . . .",7,"Mixolydian","The bell pattern at the heart of many West African and Afro-Cuban rhythms. 7 strikes over 12 pulses.","12/8"),Bt("soukous","Soukous","DR Congo",126,16,4,0,{kick:"x...x...x...x...",snare:"....x.......x...",clap:"................",hat:"xxxxxxxxxxxxxxxx",ohat:"................",conga:"..x.x..x..x.x...",shaker:"................",bell:"x.x.x...x.x.x..."},"0 . 0 . 2 . 0 . 3 . 0 . 2 . 4 .","4 5 4 2 . 4 5 4 2 . 0 . 2 . . .",7,"Major","Fast, cheerful and guitar-led. Rolling hi-hats with a sparkling melody over the top.","Dance"),Bt("afrohouse","Afro house","Pan-African",122,16,4,0,{kick:"x...x...x...x...",snare:"................",clap:"....x.......x...",hat:"..x...x...x...x.",ohat:"..x...x...x...x.",conga:"x..x..x..x..x...",shaker:"x.x.x.x.x.x.x.x.",bell:"................"},"0 . . . . . 0 . . . 3 . . . . .",". . 4 . . . 2 . . . 5 4 . . . .",9,"Natural minor","A house kick with African hand percussion layered over it.","House"),Bt("house","House","Chicago",124,16,4,0,{kick:"x...x...x...x...",snare:"................",clap:"....x.......x...",hat:"..x...x...x...x.",ohat:"..x...x...x...x.",conga:"................",shaker:"xxxxxxxxxxxxxxxx",bell:"................"},"0 . . 0 . . 0 . 3 . . 0 . . 4 .",". . 7 . . . 4 . . . 2 . . 4 . .",0,"Minor pentatonic","Four-on-the-floor. A kick on every beat and an off-beat open hat.","House"),Bt("techno","Techno","Detroit / Berlin",132,16,4,0,{kick:"x...x...x...x...",snare:"................",clap:"........x.......",hat:"x.x.x.x.x.x.x.x.",ohat:".x.x.x.x.x.x.x.x",conga:"................",shaker:"................",bell:"................"},"0 0 . 0 0 0 . 0 0 0 . 0 0 0 . 0","",6,"Phrygian","Relentless and hypnotic. Rolling 16th bass under a constant kick.","Dance"),Bt("dnb","Drum & bass","UK",174,16,4,0,{kick:"x.........x.....",snare:"....x.......x...",clap:"................",hat:"x.x.x.x.x.x.x.x.",ohat:"..............x.",conga:"",shaker:"",bell:""},"0 . . . . . . . . . 0 . . . 3 .",". . . 4 . . . . 2 . . . . 4 . .",4,"Natural minor","Very fast with a syncopated kick-snare skeleton and heavy sub bass.","Dance"),Bt("boombap","Boom bap","New York",90,16,4,.2,{kick:"x.....x...x.....",snare:"....x.......x...",clap:"",hat:"x.x.x.x.x.x.x.x.",ohat:"..............x.",conga:"",shaker:"",bell:""},"0 . . . . . 3 . . . 0 . . . . .","",9,"Minor pentatonic","Classic hip-hop: a lazy swung kick and a hard backbeat snare.","Hip-hop"),Bt("trap","Trap","Atlanta",140,16,4,0,{kick:"x.........x.....",snare:"........x.......",clap:"........x.......",hat:"xxxxxxxxxxxxxxxx",ohat:"..............x.",conga:"",shaker:"",bell:""},"0 . . . . . . . . . 0 . . . . .",". . . . . . 4 . . . . . 2 . . .",0,"Natural minor","Half-time snare on beat 3 with rapid hi-hat rolls and a long 808-style bass.","Hip-hop"),Bt("lofi","Lo-fi hip-hop","Internet",78,16,4,.3,{kick:"x.....x...x.....",snare:"....x.......x...",clap:"",hat:"x.x.x.x.x.x.x.x.",ohat:"",conga:"",shaker:"",bell:""},"0 . . . . 2 . . 4 . . . 3 . . .","4 . . 2 . . 0 . . 4 . . 5 . 4 .",0,"Dorian","Slow, dusty and swung. Soft kick, laid-back hats and a mellow melody.","Chill"),Bt("reggae","Reggae one drop","Jamaica",76,16,4,.1,{kick:"........x.......",snare:"........x.......",clap:"",hat:"x.x.x.x.x.x.x.x.",ohat:"",conga:"..x...x...x...x.",shaker:"",bell:""},"0 . . . . . . . 0 . . . 4 . 3 .",". . . 4 . . 2 . . 4 . . . . . .",9,"Minor pentatonic","The one drop: the kick and snare both land on beat 3, leaving beat 1 empty.","Groove"),Bt("dancehall","Dancehall","Jamaica",96,16,4,0,{kick:"x..x..x...x..x..",snare:"...x..x...x..x..",clap:"",hat:"x.x.x.x.x.x.x.x.",ohat:"",conga:"",shaker:"",bell:""},"0 . . 0 . . 3 . . 0 . . 4 . . .","",9,"Natural minor",'The 3+3+2 "dembow" kick and snare pattern that powers reggaeton too.',"Dance"),Bt("reggaeton","Reggaeton","Puerto Rico",95,16,4,0,{kick:"x...x...x...x...",snare:"...x..x....x..x.",clap:"",hat:"x.x.x.x.x.x.x.x.",ohat:"",conga:"",shaker:"",bell:""},"0 . . 0 . . 2 . 0 . . 0 . . 3 .","4 . . 2 . . 0 . 4 . . 5 . . 4 .",9,"Natural minor",'The dembow: a steady kick with the snare on the "and" of the beats.',"Dance"),Bt("bossa","Bossa nova","Brazil",132,16,4,0,{kick:"x..x..x..x..x...",snare:"",clap:"",hat:"x.xxx.xxx.xxx.xx",ohat:"",conga:"",shaker:"x.x.x.x.x.x.x.x.",bell:""},"0 . . 0 . . 4 . 0 . . 0 . . 4 .","4 . 5 . . 4 2 . . 4 . 2 . . 0 .",2,"Major",'Gentle and syncopated, with a steady kick against a "clave-like" rim feel.',"Chill"),Bt("salsa","Salsa clave","Cuba / New York",180,16,4,0,{kick:"",snare:"",clap:"",hat:"",ohat:"",conga:"..x.x...x.x.x...",shaker:"x.x.x.x.x.x.x.x.",bell:"x..x..x...x.x..."},"0 . . 0 . . 4 . 0 . . 0 . . 3 .","",9,"Minor pentatonic","Built on the 3-2 son clave. The bell plays the clave shape, everything else locks to it.","Latin"),Bt("funk","Funk","USA",104,16,4,.1,{kick:"X..x..x...x.x...",snare:"....x..x.x..x...",clap:"",hat:"xxxxxxxxxxxxxxxx",ohat:"..............x.",conga:"",shaker:"",bell:""},"0 . . 0 . . 3 . . 0 . 2 . . 4 . .","4 . 5 . 4 . . 2 . . 4 . 5 . . .",4,"Dorian",'The "one" is everything. Syncopated kicks and ghosted snares with a tight bassline.',"Groove"),Bt("disco","Disco","USA",118,16,4,0,{kick:"x...x...x...x...",snare:"",clap:"....x.......x...",hat:"..x...x...x...x.",ohat:"..x...x...x...x.",conga:"",shaker:"xxxxxxxxxxxxxxxx",bell:""},"0 . 7 . 0 . 7 . 0 . 7 . 0 . 7 .","4 . . 2 . . 5 . . 4 . 2 . . 0 .",9,"Major","Four on the floor with an octave-jumping bass and open hats on the off-beat.","Dance"),Bt("rock","Rock","UK / USA",112,16,4,0,{kick:"x.....x.x.......",snare:"....x.......x...",clap:"",hat:"x.x.x.x.x.x.x.x.",ohat:"",conga:"",shaker:"",bell:""},"0 . 0 . 0 . 0 . 3 . 3 . 4 . 4 .","",4,"Minor pentatonic","Kick, snare, hat. The shape of almost every rock song.","Rock"),Bt("pop","Pop","Global",120,16,4,0,{kick:"x...x...x...x...",snare:"....x.......x...",clap:"....x.......x...",hat:"x.x.x.x.x.x.x.x.",ohat:"..............x.",conga:"",shaker:"",bell:""},"0 . . . 0 . . . 5 . . . 3 . . .","4 . 2 . 4 . 5 . 4 . 2 . 0 . . .",0,"Major","Four-on-the-floor kick with a backbeat clap and a catchy repeated hook.","Pop"),Bt("waltz","Slow jam","R&B",68,12,3,0,{kick:"x..x....x...",snare:"......x.....",clap:"",hat:"x.xx.xx.xx.x",ohat:"",conga:"",shaker:"",bell:""},"0 . . . . . 3 . . . . .","4 . . 2 . . 0 . . 2 . .",9,"Dorian","A slow 12/8 swing for ballads. Each beat splits into three.","12/8"),Bt("gqom","Gqom","South Africa",125,16,4,0,{kick:"X..x..x...x.x...",snare:"",clap:"........x.......",hat:"..x...x...x...x.",ohat:"",conga:"",shaker:"x.x.x.x.x.x.x.x.",bell:""},"0 . . 0 . . . 0 . . 0 . . . . .",". . . . 4 . . . . . . 2 . . . .",0,"Phrygian","Dark, minimal and percussive, with heavy broken kicks and sparse hits. A simplified teaching version.","Dance"),Bt("kuduro","Kuduro","Angola",135,16,4,0,{kick:"x...x...x...x...",snare:"....x.......x.x.",clap:"",hat:"x.x.x.x.x.x.x.x.",ohat:"..x...x...x...x.",conga:"..x..x..x..x..x.",shaker:"xxxxxxxxxxxxxxxx",bell:""},"0 . 0 . 0 . 3 . 0 . 0 . 4 . 3 .","4 . . 5 . . 4 . . 2 . . 4 . . .",4,"Natural minor","Fast, bouncy electronic dance music with a driving four-on-the-floor kick. Simplified.","Dance"),Bt("coupe","Coupé-décalé","Côte d'Ivoire",126,16,4,0,{kick:"x..x..x...x..x..",snare:"....x.......x...",clap:"",hat:"x.x.x.x.x.x.x.x.",ohat:"..............x.",conga:"x.xx.x.xx.xx.x.x",shaker:"x.x.x.x.x.x.x.x.",bell:""},"0 . . 0 . . 2 . 0 . . 0 . . 3 .","4 . 5 . 4 . 2 . . 4 . 5 . 4 . .",7,"Major","Upbeat club dance music with busy percussion layered over a syncopated kick. Simplified.","Dance"),Bt("makossa","Makossa","Cameroon",112,16,4,.05,{kick:"x...x...x...x...",snare:"....x.......x...",clap:"",hat:"x.xxx.xxx.xxx.xx",ohat:"",conga:".x..x..x.x..x...",shaker:"x.x.x.x.x.x.x.x.",bell:""},"0 . . 0 . 4 . . 0 . . 0 . 3 . .","2 . 4 . 5 . 4 . 2 . . 4 . 5 . .",9,"Dorian","Smooth, funky dance music with a rolling bass and bright guitar-style melody. Simplified.","Groove"),Bt("uk2step","UK garage 2-step","UK",130,16,4,.1,{kick:"x.........x.....",snare:"....x.......x...",clap:"",hat:"x.x.x.x.x.x.x.x.",ohat:"..x..x..x..x..x.",conga:"",shaker:"",bell:""},"0 . . . . . 3 . . . 0 . . . . .",". . 4 . . 2 . . 4 . . 5 . . 4 .",4,"Natural minor","Skipping, swung drums where the kick leaves gaps instead of landing on every beat.","Dance"),Bt("dubstep","Dubstep","UK",140,16,4,0,{kick:"x.........x.....",snare:"........x.......",clap:"",hat:"x.x.x.x.x.x.x.x.",ohat:"",conga:"",shaker:"",bell:""},"0 . . . . . . . 0 . . . 3 . . .","",6,"Phrygian","Half-time feel at 140 BPM: one big snare on beat 3 with deep sub bass.","Dance"),Bt("drill","Drill","Chicago / UK",142,16,4,0,{kick:"x.....x...x.....",snare:"........x.......",clap:"........x.......",hat:"x.xxx.x.xxx.x.xx",ohat:"",conga:"",shaker:"",bell:""},"0 . . . . . . 0 . . . . . . 3 .",". . . . 4 . . . . . 2 . . . . .",6,"Natural minor","Sliding bass, sparse snare and rolling hats with an uneasy minor mood.","Hip-hop"),Bt("synthwave","Synthwave","Internet",100,16,4,0,{kick:"x...x...x...x...",snare:"....x.......x...",clap:"....x.......x...",hat:"x.x.x.x.x.x.x.x.",ohat:"",conga:"",shaker:"",bell:""},"0 0 0 0 0 0 0 0 5 5 5 5 3 3 3 3","4 . . 2 . . 4 . 5 . . 4 . 2 . .",9,"Natural minor","Retro 80s sound: driving 8th-note bass under a clean backbeat.","Pop"),Bt("cumbia","Cumbia","Colombia",92,16,4,0,{kick:"x...x...x...x...",snare:"",clap:"",hat:"x.x.x.x.x.x.x.x.",ohat:"",conga:"x..x.xx.x..x.xx.",shaker:"x.x.x.x.x.x.x.x.",bell:""},"0 . . . 4 . . . 0 . . . 4 . . .","4 . 5 . 4 . 2 . 4 . 5 . 7 . 4 .",9,"Minor pentatonic","A gentle, rolling dance rhythm with a steady bass and hand percussion. Simplified.","Latin"),Bt("samba","Samba","Brazil",100,16,4,0,{kick:"x..x..x..x..x...",snare:"..x...x...x...x.",clap:"",hat:"xxxxxxxxxxxxxxxx",ohat:"",conga:".x.x.x.x.x.x.x.x",shaker:"xxxxxxxxxxxxxxxx",bell:"x.x.x.x.x.x.x.x."},"0 . . 0 . . 4 . 0 . . 0 . . 4 .","4 . 5 . 4 . 2 . . 4 . 2 . 0 . .",7,"Major","Busy, layered percussion with a bouncing bass. Many instruments play many small patterns at once.","Latin"),Bt("merengue","Merengue","Dominican Republic",150,16,4,0,{kick:"x...x...x...x...",snare:"x.xxx.xxx.xxx.xx",clap:"",hat:"",ohat:"",conga:"..x...x...x...x.",shaker:"x.x.x.x.x.x.x.x.",bell:""},"0 . . . 4 . . . 0 . . . 4 . . .","4 . 5 . 4 . 2 . 4 . 5 . 7 . 5 .",7,"Major","Fast two-step dance with a rolling snare roll pattern. Simplified.","Latin"),Bt("ska","Ska","Jamaica",160,16,4,0,{kick:"x...x...x...x...",snare:"....x.......x...",clap:"",hat:"..x...x...x...x.",ohat:"",conga:"",shaker:"",bell:""},"0 . . . 3 . . . 4 . . . 3 . . .",". . 4 . . . 4 . . . 4 . . . 4 .",4,"Major","Fast tempo with short chords on the off-beats. The ancestor of reggae.","Groove"),Bt("shuffle","Blues shuffle","USA",96,12,3,0,{kick:"x..x..x..x..",snare:"...x.....x..",clap:"",hat:"x.xx.xx.xx.x",ohat:"",conga:"",shaker:"",bell:""},"0 . . . . . 3 . . . 4 .","2 . . 4 . . 2 . . 0 . .",4,"Blues","Each beat is split into three, and the middle note is skipped, giving the classic long-short bounce.","12/8"),Bt("gospel","Gospel 6/8","Worldwide",72,12,3,0,{kick:"x.....x.....",snare:"...x.....x..",clap:"...x.....x..",hat:"x.xx.xx.xx.x",ohat:"",conga:"",shaker:"",bell:""},"0 . . . . . 4 . . . 3 .","4 . . 5 . . 4 . . 2 . .",7,"Major","A slow, rolling 12/8 groove common in worship and ballads. Simplified.","12/8"),Bt("ambient","Ambient pulse","Chill",70,16,4,0,{kick:"x.......x.......",snare:"",clap:"",hat:"..x.......x.....",ohat:"",conga:"",shaker:"",bell:""},"0 . . . . . . . . . . . . . . .","4 . . . 2 . . . 5 . . . 4 . . .",2,"Lydian","Slow, spacious and sparse. Turn on the chord pad and the reverb.","Chill")],Cf=["kick","snare","clap","hat","ohat","conga","shaker","bell"];function zi(r){const t=r.len,e=i=>{const s=i.slice(0,t);for(;s.length<t;)s.push(0);return s},n=i=>{const a=Rf(i||"").slice(0,t);for(;a.length<t;)a.push(null);return a};return{id:r.id,name:r.name,bpm:r.bpm,swing:r.swing,length:t,div:r.div,root:r.root,scaleName:r.scale,tracks:Cf.map(i=>({id:i,steps:e(wf(r.drums[i]||"")),vol:1,mute:!1})),bass:{steps:n(r.bass),vol:1,mute:!1},lead:{steps:n(r.lead),vol:1,mute:!1,kind:"pluck"},chords:{on:!1,list:[]}}}function Pf(){return zi({id:"new",name:"New pattern",bpm:110,len:16,div:4,swing:0,drums:{},bass:"",lead:"",root:0,scale:"Natural minor"})}const Ih=["C","C♯","D","E♭","E","F","F♯","G","A♭","A","B♭","B"],Qs=r=>Ih[(r%12+12)%12],yn={Major:[0,2,4,5,7,9,11],"Natural minor":[0,2,3,5,7,8,10],"Harmonic minor":[0,2,3,5,7,8,11],Dorian:[0,2,3,5,7,9,10],Phrygian:[0,1,3,5,7,8,10],Lydian:[0,2,4,6,7,9,11],Mixolydian:[0,2,4,5,7,9,10],Locrian:[0,1,3,5,6,8,10],"Major pentatonic":[0,2,4,7,9],"Minor pentatonic":[0,3,5,7,10],Blues:[0,3,5,6,7,10],"Whole tone":[0,2,4,6,8,10],Hirajoshi:[0,2,3,7,8]},Df={Major:"Bright and settled. The default sound of most pop.","Natural minor":"Dark and serious, the sound of most sad songs.","Harmonic minor":"Minor with a raised 7th that gives a tense, classical pull.",Dorian:"Minor but with a lifted 6th. Warm and funky, common in Afrobeat and funk.",Phrygian:"Dark with a flat 2nd. Spanish and metal flavours.",Lydian:"Major with a raised 4th. Dreamy and floating.",Mixolydian:"Major with a flat 7th. Relaxed, bluesy, common in highlife and rock.",Locrian:"Unstable and rarely used as a home key.","Major pentatonic":"Five notes, no clashes. Almost impossible to play badly.","Minor pentatonic":"The backbone of blues, rock and a lot of Afrobeats toplines.",Blues:'Minor pentatonic plus the "blue" note.',"Whole tone":"Six equal steps. Floaty and ambiguous.",Hirajoshi:"A Japanese five-note scale with a sombre, open sound."},Wr={Major:[0,4,7],Minor:[0,3,7],Diminished:[0,3,6],Augmented:[0,4,8],Sus2:[0,2,7],Sus4:[0,5,7],"Major 7":[0,4,7,11],"Minor 7":[0,3,7,10],"Dominant 7":[0,4,7,10],"Major 9":[0,4,7,11,14],"Minor 9":[0,3,7,10,14],Add9:[0,4,7,14]},es=[["I – V – vi – IV",[0,4,5,3],"The most used four chords in pop.","major"],["vi – IV – I – V",[5,3,0,4],"Same chords, minor feel. Emotional and anthemic.","major"],["I – vi – IV – V",[0,5,3,4],"The 50s doo-wop progression.","major"],["ii – V – I",[1,4,0],"The core cadence of jazz.","major"],["I – IV – V – I",[0,3,4,0],"Blues and rock foundation, also all over highlife.","major"],["i – VII – VI – VII",[0,6,5,6],"Driving minor loop used in a lot of electronic and Afrobeats.","minor"],["i – iv – v – i",[0,3,4,0],"Natural minor home-and-away.","minor"],["i – VI – III – VII",[0,5,2,6],"Epic minor loop heard in film and pop.","minor"]];function Uh(r,t,e,n=!1){const i=t.length,s=o=>r+t[(e+o)%i]+12*Math.floor((e+o)/i),a=[s(0),s(2),s(4)];return n&&a.push(s(6)),a.map(o=>o-r)}const Da=[["Minor 2nd",1],["Major 2nd",2],["Minor 3rd",3],["Major 3rd",4],["Perfect 4th",5],["Tritone",6],["Perfect 5th",7],["Minor 6th",8],["Major 6th",9],["Minor 7th",10],["Major 7th",11],["Octave",12]],uc={"Minor 2nd":'the "Jaws" theme',"Major 2nd":'"Happy Birthday" (first two notes)',"Minor 3rd":'"Greensleeves"',"Major 3rd":'"When the Saints Go Marching In"',"Perfect 4th":'"Here Comes the Bride"',Tritone:'"Maria" from West Side Story',"Perfect 5th":'"Twinkle Twinkle" (first jump)',"Minor 6th":'the "Love Story" theme',"Major 6th":'"My Bonnie Lies Over the Ocean"',"Minor 7th":'"Somewhere" from West Side Story',"Major 7th":'"Take On Me" chorus leap',Octave:'"Somewhere Over the Rainbow"'};/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Sl="170",Lf=0,fc=1,If=2,Nh=1,Uf=2,Hn=3,gi=0,He=1,Xn=2,di=0,vr=1,dc=2,pc=3,mc=4,Nf=5,Oi=100,Ff=101,Of=102,kf=103,Bf=104,zf=200,Vf=201,Hf=202,Gf=203,yo=204,So=205,Wf=206,Xf=207,qf=208,$f=209,Yf=210,jf=211,Kf=212,Zf=213,Jf=214,bo=0,Eo=1,To=2,Tr=3,Ao=4,wo=5,Ro=6,Co=7,Fh=0,Qf=1,td=2,pi=0,ed=1,nd=2,id=3,rd=4,sd=5,ad=6,od=7,Oh=300,Ar=301,wr=302,Po=303,Do=304,Sa=306,Lo=1e3,Vi=1001,Io=1002,Tn=1003,ld=1004,Cs=1005,Ln=1006,La=1007,Hi=1008,jn=1009,kh=1010,Bh=1011,os=1012,bl=1013,ji=1014,qn=1015,Ms=1016,El=1017,Tl=1018,Rr=1020,zh=35902,Vh=1021,Hh=1022,En=1023,Gh=1024,Wh=1025,Mr=1026,Cr=1027,Xh=1028,Al=1029,qh=1030,wl=1031,Rl=1033,ta=33776,ea=33777,na=33778,ia=33779,Uo=35840,No=35841,Fo=35842,Oo=35843,ko=36196,Bo=37492,zo=37496,Vo=37808,Ho=37809,Go=37810,Wo=37811,Xo=37812,qo=37813,$o=37814,Yo=37815,jo=37816,Ko=37817,Zo=37818,Jo=37819,Qo=37820,tl=37821,ra=36492,el=36494,nl=36495,$h=36283,il=36284,rl=36285,sl=36286,cd=3200,hd=3201,ud=0,fd=1,li="",un="srgb",Or="srgb-linear",ba="linear",ee="srgb",Qi=7680,_c=519,dd=512,pd=513,md=514,Yh=515,_d=516,gd=517,xd=518,vd=519,gc=35044,xc="300 es",$n=2e3,ha=2001;class kr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,t);t.target=null}}}const Pe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ia=Math.PI/180,al=180/Math.PI;function ys(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pe[r&255]+Pe[r>>8&255]+Pe[r>>16&255]+Pe[r>>24&255]+"-"+Pe[t&255]+Pe[t>>8&255]+"-"+Pe[t>>16&15|64]+Pe[t>>24&255]+"-"+Pe[e&63|128]+Pe[e>>8&255]+"-"+Pe[e>>16&255]+Pe[e>>24&255]+Pe[n&255]+Pe[n>>8&255]+Pe[n>>16&255]+Pe[n>>24&255]).toLowerCase()}function Be(r,t,e){return Math.max(t,Math.min(e,r))}function Md(r,t){return(r%t+t)%t}function Ua(r,t,e){return(1-e)*r+e*t}function Xr(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function ke(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class Qt{constructor(t=0,e=0){Qt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Be(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*i+t.x,this.y=s*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ft{constructor(t,e,n,i,s,a,o,l,c){Ft.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,a,o,l,c)}set(t,e,n,i,s,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],_=i[0],m=i[3],p=i[6],v=i[1],S=i[4],x=i[7],R=i[2],A=i[5],T=i[8];return s[0]=a*_+o*v+l*R,s[3]=a*m+o*S+l*A,s[6]=a*p+o*x+l*T,s[1]=c*_+h*v+u*R,s[4]=c*m+h*S+u*A,s[7]=c*p+h*x+u*T,s[2]=f*_+d*v+g*R,s[5]=f*m+d*S+g*A,s[8]=f*p+d*x+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*s*h+n*o*l+i*s*c-i*a*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,f=o*l-h*s,d=c*s-a*l,g=e*u+n*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(i*c-h*n)*_,t[2]=(o*n-i*a)*_,t[3]=f*_,t[4]=(h*e-i*l)*_,t[5]=(i*s-o*e)*_,t[6]=d*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Na.makeScale(t,e)),this}rotate(t){return this.premultiply(Na.makeRotation(-t)),this}translate(t,e){return this.premultiply(Na.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Na=new Ft;function jh(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function ua(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function yd(){const r=ua("canvas");return r.style.display="block",r}const vc={};function Zr(r){r in vc||(vc[r]=!0,console.warn(r))}function Sd(r,t,e){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}function bd(r){const t=r.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Ed(r){const t=r.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const $t={enabled:!0,workingColorSpace:Or,spaces:{},convert:function(r,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ee&&(r.r=Yn(r.r),r.g=Yn(r.g),r.b=Yn(r.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(r.applyMatrix3(this.spaces[t].toXYZ),r.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ee&&(r.r=yr(r.r),r.g=yr(r.g),r.b=yr(r.b))),r},fromWorkingColorSpace:function(r,t){return this.convert(r,this.workingColorSpace,t)},toWorkingColorSpace:function(r,t){return this.convert(r,t,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===li?ba:this.spaces[r].transfer},getLuminanceCoefficients:function(r,t=this.workingColorSpace){return r.fromArray(this.spaces[t].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,t,e){return r.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}};function Yn(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function yr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}const Mc=[.64,.33,.3,.6,.15,.06],yc=[.2126,.7152,.0722],Sc=[.3127,.329],bc=new Ft().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ec=new Ft().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);$t.define({[Or]:{primaries:Mc,whitePoint:Sc,transfer:ba,toXYZ:bc,fromXYZ:Ec,luminanceCoefficients:yc,workingColorSpaceConfig:{unpackColorSpace:un},outputColorSpaceConfig:{drawingBufferColorSpace:un}},[un]:{primaries:Mc,whitePoint:Sc,transfer:ee,toXYZ:bc,fromXYZ:Ec,luminanceCoefficients:yc,outputColorSpaceConfig:{drawingBufferColorSpace:un}}});let tr;class Td{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{tr===void 0&&(tr=ua("canvas")),tr.width=t.width,tr.height=t.height;const n=tr.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=tr}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ua("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=Yn(s[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Yn(e[n]/255)*255):e[n]=Yn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Ad=0;class Kh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ad++}),this.uuid=ys(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(Fa(i[a].image)):s.push(Fa(i[a]))}else s=Fa(i);n.url=s}return e||(t.images[this.uuid]=n),n}}function Fa(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Td.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let wd=0;class Ge extends kr{constructor(t=Ge.DEFAULT_IMAGE,e=Ge.DEFAULT_MAPPING,n=Vi,i=Vi,s=Ln,a=Hi,o=En,l=jn,c=Ge.DEFAULT_ANISOTROPY,h=li){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wd++}),this.uuid=ys(),this.name="",this.source=new Kh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Qt(0,0),this.repeat=new Qt(1,1),this.center=new Qt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Oh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Lo:t.x=t.x-Math.floor(t.x);break;case Vi:t.x=t.x<0?0:1;break;case Io:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Lo:t.y=t.y-Math.floor(t.y);break;case Vi:t.y=t.y<0?0:1;break;case Io:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=Oh;Ge.DEFAULT_ANISOTROPY=1;class ve{constructor(t=0,e=0,n=0,i=1){ve.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(c+1)/2,x=(d+1)/2,R=(p+1)/2,A=(h+f)/4,T=(u+_)/4,C=(g+m)/4;return S>x&&S>R?S<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(S),i=A/n,s=T/n):x>R?x<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(x),n=A/i,s=C/i):R<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(R),n=T/s,i=C/s),this.set(n,i,s,e),this}let v=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(u-_)/v,this.z=(f-h)/v,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Rd extends kr{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e);const i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ln,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Ge(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Kh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ki extends Rd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Zh extends Ge{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Tn,this.minFilter=Tn,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Cd extends Ge{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Tn,this.minFilter=Tn,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ss{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const f=s[a+0],d=s[a+1],g=s[a+2],_=s[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==f||c!==d||h!==g){let m=1-o;const p=l*f+c*d+h*g+u*_,v=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){const R=Math.sqrt(S),A=Math.atan2(R,p*v);m=Math.sin(m*A)/R,o=Math.sin(o*A)/R}const x=o*v;if(l=l*m+f*x,c=c*m+d*x,h=h*m+g*x,u=u*m+_*x,m===1-o){const R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[a],f=s[a+1],d=s[a+2],g=s[a+3];return t[e]=o*g+h*u+l*d-c*f,t[e+1]=l*g+h*f+c*u-o*d,t[e+2]=c*g+h*d+o*f-l*u,t[e+3]=h*g-o*u-l*f-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(s/2),f=l(n/2),d=l(i/2),g=l(s/2);switch(a){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],s=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=n+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(s-c)*d,this._z=(a-i)*d}else if(n>o&&n>u){const d=2*Math.sqrt(1+n-o-u);this._w=(h-l)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(s+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-n-u);this._w=(s-c)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-n-o);this._w=(a-i)/d,this._x=(s+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Be(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,s=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+i*c-s*l,this._y=i*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+i*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*n+e*this._x,this._y=d*i+e*this._y,this._z=d*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=s*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(t=0,e=0,n=0){F.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Tc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Tc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),h=2*(o*e-s*i),u=2*(s*n-a*e);return this.x=e+l*c+a*u-o*h,this.y=n+l*h+o*c-s*u,this.z=i+l*u+s*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,s=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Oa.copy(this).projectOnVector(t),this.sub(Oa)}reflect(t){return this.sub(Oa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Be(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Oa=new F,Tc=new Ss;class bs{constructor(t=new F(1/0,1/0,1/0),e=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(xn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(xn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=xn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,xn):xn.fromBufferAttribute(s,a),xn.applyMatrix4(t.matrixWorld),this.expandByPoint(xn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ps.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ps.copy(n.boundingBox)),Ps.applyMatrix4(t.matrixWorld),this.union(Ps)}const i=t.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,xn),xn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(qr),Ds.subVectors(this.max,qr),er.subVectors(t.a,qr),nr.subVectors(t.b,qr),ir.subVectors(t.c,qr),ei.subVectors(nr,er),ni.subVectors(ir,nr),Ei.subVectors(er,ir);let e=[0,-ei.z,ei.y,0,-ni.z,ni.y,0,-Ei.z,Ei.y,ei.z,0,-ei.x,ni.z,0,-ni.x,Ei.z,0,-Ei.x,-ei.y,ei.x,0,-ni.y,ni.x,0,-Ei.y,Ei.x,0];return!ka(e,er,nr,ir,Ds)||(e=[1,0,0,0,1,0,0,0,1],!ka(e,er,nr,ir,Ds))?!1:(Ls.crossVectors(ei,ni),e=[Ls.x,Ls.y,Ls.z],ka(e,er,nr,ir,Ds))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,xn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(xn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(On[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),On[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),On[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),On[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),On[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),On[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),On[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),On[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(On),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const On=[new F,new F,new F,new F,new F,new F,new F,new F],xn=new F,Ps=new bs,er=new F,nr=new F,ir=new F,ei=new F,ni=new F,Ei=new F,qr=new F,Ds=new F,Ls=new F,Ti=new F;function ka(r,t,e,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){Ti.fromArray(r,s);const o=i.x*Math.abs(Ti.x)+i.y*Math.abs(Ti.y)+i.z*Math.abs(Ti.z),l=t.dot(Ti),c=e.dot(Ti),h=n.dot(Ti);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Pd=new bs,$r=new F,Ba=new F;class Ea{constructor(t=new F,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Pd.setFromPoints(t).getCenter(n);let i=0;for(let s=0,a=t.length;s<a;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;$r.subVectors(t,this.center);const e=$r.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector($r,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ba.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint($r.copy(t.center).add(Ba)),this.expandByPoint($r.copy(t.center).sub(Ba))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const kn=new F,za=new F,Is=new F,ii=new F,Va=new F,Us=new F,Ha=new F;class Jh{constructor(t=new F,e=new F(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,kn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=kn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(kn.copy(this.origin).addScaledVector(this.direction,e),kn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){za.copy(t).add(e).multiplyScalar(.5),Is.copy(e).sub(t).normalize(),ii.copy(this.origin).sub(za);const s=t.distanceTo(e)*.5,a=-this.direction.dot(Is),o=ii.dot(this.direction),l=-ii.dot(Is),c=ii.lengthSq(),h=Math.abs(1-a*a);let u,f,d,g;if(h>0)if(u=a*l-o,f=a*o-l,g=s*h,u>=0)if(f>=-g)if(f<=g){const _=1/h;u*=_,f*=_,d=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f=-s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-a*s+o)),f=u>0?-s:Math.min(Math.max(-s,-l),s),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-s,-l),s),d=f*(f+2*l)+c):(u=Math.max(0,-(a*s+o)),f=u>0?s:Math.min(Math.max(-s,-l),s),d=-u*u+f*(f+2*l)+c);else f=a>0?-s:s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(za).addScaledVector(Is,f),d}intersectSphere(t,e){kn.subVectors(t.center,this.origin);const n=kn.dot(this.direction),i=kn.dot(kn)-n*n,s=t.radius*t.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,i=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,i=(t.min.x-f.x)*c),h>=0?(s=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(s=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(o=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,kn)!==null}intersectTriangle(t,e,n,i,s){Va.subVectors(e,t),Us.subVectors(n,t),Ha.crossVectors(Va,Us);let a=this.direction.dot(Ha),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ii.subVectors(this.origin,t);const l=o*this.direction.dot(Us.crossVectors(ii,Us));if(l<0)return null;const c=o*this.direction.dot(Va.cross(ii));if(c<0||l+c>a)return null;const h=-o*ii.dot(Ha);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Me{constructor(t,e,n,i,s,a,o,l,c,h,u,f,d,g,_,m){Me.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,a,o,l,c,h,u,f,d,g,_,m)}set(t,e,n,i,s,a,o,l,c,h,u,f,d,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Me().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/rr.setFromMatrixColumn(t,0).length(),s=1/rr.setFromMatrixColumn(t,1).length(),a=1/rr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const f=a*h,d=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=d+g*c,e[5]=f-_*c,e[9]=-o*l,e[2]=_-f*c,e[6]=g+d*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,d=l*u,g=c*h,_=c*u;e[0]=f+_*o,e[4]=g*o-d,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=d*o-g,e[6]=_+f*o,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,d=l*u,g=c*h,_=c*u;e[0]=f-_*o,e[4]=-a*u,e[8]=g+d*o,e[1]=d+g*o,e[5]=a*h,e[9]=_-f*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,d=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=g*c-d,e[8]=f*c+_,e[1]=l*u,e[5]=_*c+f,e[9]=d*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,d=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=_-f*u,e[8]=g*u+d,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*u+g,e[10]=f-_*u}else if(t.order==="XZY"){const f=a*l,d=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+_,e[5]=a*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=o*h,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Dd,t,Ld)}lookAt(t,e,n){const i=this.elements;return Ze.subVectors(t,e),Ze.lengthSq()===0&&(Ze.z=1),Ze.normalize(),ri.crossVectors(n,Ze),ri.lengthSq()===0&&(Math.abs(n.z)===1?Ze.x+=1e-4:Ze.z+=1e-4,Ze.normalize(),ri.crossVectors(n,Ze)),ri.normalize(),Ns.crossVectors(Ze,ri),i[0]=ri.x,i[4]=Ns.x,i[8]=Ze.x,i[1]=ri.y,i[5]=Ns.y,i[9]=Ze.y,i[2]=ri.z,i[6]=Ns.z,i[10]=Ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],_=n[6],m=n[10],p=n[14],v=n[3],S=n[7],x=n[11],R=n[15],A=i[0],T=i[4],C=i[8],M=i[12],y=i[1],P=i[5],k=i[9],N=i[13],W=i[2],q=i[6],G=i[10],$=i[14],B=i[3],rt=i[7],st=i[11],gt=i[15];return s[0]=a*A+o*y+l*W+c*B,s[4]=a*T+o*P+l*q+c*rt,s[8]=a*C+o*k+l*G+c*st,s[12]=a*M+o*N+l*$+c*gt,s[1]=h*A+u*y+f*W+d*B,s[5]=h*T+u*P+f*q+d*rt,s[9]=h*C+u*k+f*G+d*st,s[13]=h*M+u*N+f*$+d*gt,s[2]=g*A+_*y+m*W+p*B,s[6]=g*T+_*P+m*q+p*rt,s[10]=g*C+_*k+m*G+p*st,s[14]=g*M+_*N+m*$+p*gt,s[3]=v*A+S*y+x*W+R*B,s[7]=v*T+S*P+x*q+R*rt,s[11]=v*C+S*k+x*G+R*st,s[15]=v*M+S*N+x*$+R*gt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+s*l*u-i*c*u-s*o*f+n*c*f+i*o*d-n*l*d)+_*(+e*l*d-e*c*f+s*a*f-i*a*d+i*c*h-s*l*h)+m*(+e*c*u-e*o*d-s*a*u+n*a*d+s*o*h-n*c*h)+p*(-i*o*h-e*l*u+e*o*f+i*a*u-n*a*f+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],_=t[13],m=t[14],p=t[15],v=u*m*c-_*f*c+_*l*d-o*m*d-u*l*p+o*f*p,S=g*f*c-h*m*c-g*l*d+a*m*d+h*l*p-a*f*p,x=h*_*c-g*u*c+g*o*d-a*_*d-h*o*p+a*u*p,R=g*u*l-h*_*l-g*o*f+a*_*f+h*o*m-a*u*m,A=e*v+n*S+i*x+s*R;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/A;return t[0]=v*T,t[1]=(_*f*s-u*m*s-_*i*d+n*m*d+u*i*p-n*f*p)*T,t[2]=(o*m*s-_*l*s+_*i*c-n*m*c-o*i*p+n*l*p)*T,t[3]=(u*l*s-o*f*s-u*i*c+n*f*c+o*i*d-n*l*d)*T,t[4]=S*T,t[5]=(h*m*s-g*f*s+g*i*d-e*m*d-h*i*p+e*f*p)*T,t[6]=(g*l*s-a*m*s-g*i*c+e*m*c+a*i*p-e*l*p)*T,t[7]=(a*f*s-h*l*s+h*i*c-e*f*c-a*i*d+e*l*d)*T,t[8]=x*T,t[9]=(g*u*s-h*_*s-g*n*d+e*_*d+h*n*p-e*u*p)*T,t[10]=(a*_*s-g*o*s+g*n*c-e*_*c-a*n*p+e*o*p)*T,t[11]=(h*o*s-a*u*s-h*n*c+e*u*c+a*n*d-e*o*d)*T,t[12]=R*T,t[13]=(h*_*i-g*u*i+g*n*f-e*_*f-h*n*m+e*u*m)*T,t[14]=(g*o*i-a*_*i-g*n*l+e*_*l+a*n*m-e*o*m)*T,t[15]=(a*u*i-h*o*i+h*n*l-e*u*l-a*n*f+e*o*f)*T,this}scale(t){const e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),s=1-n,a=t.x,o=t.y,l=t.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,a){return this.set(1,n,s,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,s=e._x,a=e._y,o=e._z,l=e._w,c=s+s,h=a+a,u=o+o,f=s*c,d=s*h,g=s*u,_=a*h,m=a*u,p=o*u,v=l*c,S=l*h,x=l*u,R=n.x,A=n.y,T=n.z;return i[0]=(1-(_+p))*R,i[1]=(d+x)*R,i[2]=(g-S)*R,i[3]=0,i[4]=(d-x)*A,i[5]=(1-(f+p))*A,i[6]=(m+v)*A,i[7]=0,i[8]=(g+S)*T,i[9]=(m-v)*T,i[10]=(1-(f+_))*T,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let s=rr.set(i[0],i[1],i[2]).length();const a=rr.set(i[4],i[5],i[6]).length(),o=rr.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),t.x=i[12],t.y=i[13],t.z=i[14],vn.copy(this);const c=1/s,h=1/a,u=1/o;return vn.elements[0]*=c,vn.elements[1]*=c,vn.elements[2]*=c,vn.elements[4]*=h,vn.elements[5]*=h,vn.elements[6]*=h,vn.elements[8]*=u,vn.elements[9]*=u,vn.elements[10]*=u,e.setFromRotationMatrix(vn),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,i,s,a,o=$n){const l=this.elements,c=2*s/(e-t),h=2*s/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i);let d,g;if(o===$n)d=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===ha)d=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,s,a,o=$n){const l=this.elements,c=1/(e-t),h=1/(n-i),u=1/(a-s),f=(e+t)*c,d=(n+i)*h;let g,_;if(o===$n)g=(a+s)*u,_=-2*u;else if(o===ha)g=s*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const rr=new F,vn=new Me,Dd=new F(0,0,0),Ld=new F(1,1,1),ri=new F,Ns=new F,Ze=new F,Ac=new Me,wc=new Ss;class Kn{constructor(t=0,e=0,n=0,i=Kn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(Be(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Be(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Be(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Be(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Be(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Be(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ac.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ac,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return wc.setFromEuler(this),this.setFromQuaternion(wc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Kn.DEFAULT_ORDER="XYZ";class Qh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Id=0;const Rc=new F,sr=new Ss,Bn=new Me,Fs=new F,Yr=new F,Ud=new F,Nd=new Ss,Cc=new F(1,0,0),Pc=new F(0,1,0),Dc=new F(0,0,1),Lc={type:"added"},Fd={type:"removed"},ar={type:"childadded",child:null},Ga={type:"childremoved",child:null};class We extends kr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=ys(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=We.DEFAULT_UP.clone();const t=new F,e=new Kn,n=new Ss,i=new F(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Me},normalMatrix:{value:new Ft}}),this.matrix=new Me,this.matrixWorld=new Me,this.matrixAutoUpdate=We.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=We.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return sr.setFromAxisAngle(t,e),this.quaternion.multiply(sr),this}rotateOnWorldAxis(t,e){return sr.setFromAxisAngle(t,e),this.quaternion.premultiply(sr),this}rotateX(t){return this.rotateOnAxis(Cc,t)}rotateY(t){return this.rotateOnAxis(Pc,t)}rotateZ(t){return this.rotateOnAxis(Dc,t)}translateOnAxis(t,e){return Rc.copy(t).applyQuaternion(this.quaternion),this.position.add(Rc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Cc,t)}translateY(t){return this.translateOnAxis(Pc,t)}translateZ(t){return this.translateOnAxis(Dc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Bn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Fs.copy(t):Fs.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Yr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bn.lookAt(Yr,Fs,this.up):Bn.lookAt(Fs,Yr,this.up),this.quaternion.setFromRotationMatrix(Bn),i&&(Bn.extractRotation(i.matrixWorld),sr.setFromRotationMatrix(Bn),this.quaternion.premultiply(sr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Lc),ar.child=t,this.dispatchEvent(ar),ar.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Fd),Ga.child=t,this.dispatchEvent(Ga),Ga.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Bn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Bn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Bn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Lc),ar.child=t,this.dispatchEvent(ar),ar.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yr,t,Ud),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yr,Nd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(t.materials,this.material[l]));i.material=o}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),d=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}We.DEFAULT_UP=new F(0,1,0);We.DEFAULT_MATRIX_AUTO_UPDATE=!0;We.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mn=new F,zn=new F,Wa=new F,Vn=new F,or=new F,lr=new F,Ic=new F,Xa=new F,qa=new F,$a=new F,Ya=new ve,ja=new ve,Ka=new ve;class bn{constructor(t=new F,e=new F,n=new F){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Mn.subVectors(t,e),i.cross(Mn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){Mn.subVectors(i,e),zn.subVectors(n,e),Wa.subVectors(t,e);const a=Mn.dot(Mn),o=Mn.dot(zn),l=Mn.dot(Wa),c=zn.dot(zn),h=zn.dot(Wa),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const f=1/u,d=(c*l-o*h)*f,g=(a*h-o*l)*f;return s.set(1-d-g,g,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Vn)===null?!1:Vn.x>=0&&Vn.y>=0&&Vn.x+Vn.y<=1}static getInterpolation(t,e,n,i,s,a,o,l){return this.getBarycoord(t,e,n,i,Vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Vn.x),l.addScaledVector(a,Vn.y),l.addScaledVector(o,Vn.z),l)}static getInterpolatedAttribute(t,e,n,i,s,a){return Ya.setScalar(0),ja.setScalar(0),Ka.setScalar(0),Ya.fromBufferAttribute(t,e),ja.fromBufferAttribute(t,n),Ka.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(Ya,s.x),a.addScaledVector(ja,s.y),a.addScaledVector(Ka,s.z),a}static isFrontFacing(t,e,n,i){return Mn.subVectors(n,e),zn.subVectors(t,e),Mn.cross(zn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Mn.subVectors(this.c,this.b),zn.subVectors(this.a,this.b),Mn.cross(zn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return bn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return bn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,s){return bn.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return bn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return bn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,s=this.c;let a,o;or.subVectors(i,n),lr.subVectors(s,n),Xa.subVectors(t,n);const l=or.dot(Xa),c=lr.dot(Xa);if(l<=0&&c<=0)return e.copy(n);qa.subVectors(t,i);const h=or.dot(qa),u=lr.dot(qa);if(h>=0&&u<=h)return e.copy(i);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(or,a);$a.subVectors(t,s);const d=or.dot($a),g=lr.dot($a);if(g>=0&&d<=g)return e.copy(s);const _=d*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(lr,o);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Ic.subVectors(s,i),o=(u-h)/(u-h+(d-g)),e.copy(i).addScaledVector(Ic,o);const p=1/(m+_+f);return a=_*p,o=f*p,e.copy(n).addScaledVector(or,a).addScaledVector(lr,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const tu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},si={h:0,s:0,l:0},Os={h:0,s:0,l:0};function Za(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}class Jt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=un){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,$t.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=$t.workingColorSpace){return this.r=t,this.g=e,this.b=n,$t.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=$t.workingColorSpace){if(t=Md(t,1),e=Be(e,0,1),n=Be(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=Za(a,s,t+1/3),this.g=Za(a,s,t),this.b=Za(a,s,t-1/3)}return $t.toWorkingColorSpace(this,i),this}setStyle(t,e=un){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=un){const n=tu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Yn(t.r),this.g=Yn(t.g),this.b=Yn(t.b),this}copyLinearToSRGB(t){return this.r=yr(t.r),this.g=yr(t.g),this.b=yr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=un){return $t.fromWorkingColorSpace(De.copy(this),t),Math.round(Be(De.r*255,0,255))*65536+Math.round(Be(De.g*255,0,255))*256+Math.round(Be(De.b*255,0,255))}getHexString(t=un){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=$t.workingColorSpace){$t.fromWorkingColorSpace(De.copy(this),e);const n=De.r,i=De.g,s=De.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=$t.workingColorSpace){return $t.fromWorkingColorSpace(De.copy(this),e),t.r=De.r,t.g=De.g,t.b=De.b,t}getStyle(t=un){$t.fromWorkingColorSpace(De.copy(this),t);const e=De.r,n=De.g,i=De.b;return t!==un?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(si),this.setHSL(si.h+t,si.s+e,si.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(si),t.getHSL(Os);const n=Ua(si.h,Os.h,e),i=Ua(si.s,Os.s,e),s=Ua(si.l,Os.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const De=new Jt;Jt.NAMES=tu;let Od=0;class Es extends kr{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Od++}),this.uuid=ys(),this.name="",this.blending=vr,this.side=gi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yo,this.blendDst=So,this.blendEquation=Oi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Jt(0,0,0),this.blendAlpha=0,this.depthFunc=Tr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_c,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qi,this.stencilZFail=Qi,this.stencilZPass=Qi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==vr&&(n.blending=this.blending),this.side!==gi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==yo&&(n.blendSrc=this.blendSrc),this.blendDst!==So&&(n.blendDst=this.blendDst),this.blendEquation!==Oi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Tr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==_c&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Qi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Qi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Qi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(e){const s=i(t.textures),a=i(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class ki extends Es{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kn,this.combine=Fh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ye=new F,ks=new Qt;class An{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=gc,this.updateRanges=[],this.gpuType=qn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ks.fromBufferAttribute(this,e),ks.applyMatrix3(t),this.setXY(e,ks.x,ks.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Xr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ke(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Xr(e,this.array)),e}setX(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Xr(e,this.array)),e}setY(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Xr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Xr(e,this.array)),e}setW(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),n=ke(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),n=ke(n,this.array),i=ke(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),n=ke(n,this.array),i=ke(i,this.array),s=ke(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==gc&&(t.usage=this.usage),t}}class eu extends An{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class nu extends An{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Ue extends An{constructor(t,e,n){super(new Float32Array(t),e,n)}}let kd=0;const cn=new Me,Ja=new We,cr=new F,Je=new bs,jr=new bs,Ae=new F;class mn extends kr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:kd++}),this.uuid=ys(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(jh(t)?nu:eu)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Ft().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return cn.makeRotationFromQuaternion(t),this.applyMatrix4(cn),this}rotateX(t){return cn.makeRotationX(t),this.applyMatrix4(cn),this}rotateY(t){return cn.makeRotationY(t),this.applyMatrix4(cn),this}rotateZ(t){return cn.makeRotationZ(t),this.applyMatrix4(cn),this}translate(t,e,n){return cn.makeTranslation(t,e,n),this.applyMatrix4(cn),this}scale(t,e,n){return cn.makeScale(t,e,n),this.applyMatrix4(cn),this}lookAt(t){return Ja.lookAt(t),Ja.updateMatrix(),this.applyMatrix4(Ja.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cr).negate(),this.translate(cr.x,cr.y,cr.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,s=t.length;i<s;i++){const a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ue(n,3))}else{for(let n=0,i=e.count;n<i;n++){const s=t[n];e.setXYZ(n,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new bs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const s=e[n];Je.setFromBufferAttribute(s),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,Je.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,Je.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint(Je.min),this.boundingBox.expandByPoint(Je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ea);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(t){const n=this.boundingSphere.center;if(Je.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];jr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ae.addVectors(Je.min,jr.min),Je.expandByPoint(Ae),Ae.addVectors(Je.max,jr.max),Je.expandByPoint(Ae)):(Je.expandByPoint(jr.min),Je.expandByPoint(jr.max))}Je.getCenter(n);let i=0;for(let s=0,a=t.count;s<a;s++)Ae.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(Ae));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ae.fromBufferAttribute(o,c),l&&(cr.fromBufferAttribute(t,c),Ae.add(cr)),i=Math.max(i,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new An(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<n.count;C++)o[C]=new F,l[C]=new F;const c=new F,h=new F,u=new F,f=new Qt,d=new Qt,g=new Qt,_=new F,m=new F;function p(C,M,y){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,y),f.fromBufferAttribute(s,C),d.fromBufferAttribute(s,M),g.fromBufferAttribute(s,y),h.sub(c),u.sub(c),d.sub(f),g.sub(f);const P=1/(d.x*g.y-g.x*d.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(P),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(P),o[C].add(_),o[M].add(_),o[y].add(_),l[C].add(m),l[M].add(m),l[y].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let C=0,M=v.length;C<M;++C){const y=v[C],P=y.start,k=y.count;for(let N=P,W=P+k;N<W;N+=3)p(t.getX(N+0),t.getX(N+1),t.getX(N+2))}const S=new F,x=new F,R=new F,A=new F;function T(C){R.fromBufferAttribute(i,C),A.copy(R);const M=o[C];S.copy(M),S.sub(R.multiplyScalar(R.dot(M))).normalize(),x.crossVectors(A,M);const P=x.dot(l[C])<0?-1:1;a.setXYZW(C,S.x,S.y,S.z,P)}for(let C=0,M=v.length;C<M;++C){const y=v[C],P=y.start,k=y.count;for(let N=P,W=P+k;N<W;N+=3)T(t.getX(N+0)),T(t.getX(N+1)),T(t.getX(N+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new An(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new F,s=new F,a=new F,o=new F,l=new F,c=new F,h=new F,u=new F;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);i.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=e.count;f<d;f+=3)i.fromBufferAttribute(e,f+0),s.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let d=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new An(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new mn,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=t(l,n);e.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=t(f,n);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(t.data))}h.length>0&&(i[l]=h,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],u=s[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Uc=new Me,Ai=new Jh,Bs=new Ea,Nc=new F,zs=new F,Vs=new F,Hs=new F,Qa=new F,Gs=new F,Fc=new F,Ws=new F;class ze extends We{constructor(t=new mn,e=new ki){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(s&&o){Gs.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],u=s[l];h!==0&&(Qa.fromBufferAttribute(u,t),a?Gs.addScaledVector(Qa,h):Gs.addScaledVector(Qa.sub(e),h))}e.add(Gs)}return e}raycast(t,e){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Bs.copy(n.boundingSphere),Bs.applyMatrix4(s),Ai.copy(t.ray).recast(t.near),!(Bs.containsPoint(Ai.origin)===!1&&(Ai.intersectSphere(Bs,Nc)===null||Ai.origin.distanceToSquared(Nc)>(t.far-t.near)**2))&&(Uc.copy(s).invert(),Ai.copy(t.ray).applyMatrix4(Uc),!(n.boundingBox!==null&&Ai.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ai)))}_computeIntersections(t,e,n){let i;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,f=s.groups,d=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=a[m.materialIndex],v=Math.max(m.start,d.start),S=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let x=v,R=S;x<R;x+=3){const A=o.getX(x),T=o.getX(x+1),C=o.getX(x+2);i=Xs(this,p,t,n,c,h,u,A,T,C),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const v=o.getX(m),S=o.getX(m+1),x=o.getX(m+2);i=Xs(this,a,t,n,c,h,u,v,S,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=a[m.materialIndex],v=Math.max(m.start,d.start),S=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let x=v,R=S;x<R;x+=3){const A=x,T=x+1,C=x+2;i=Xs(this,p,t,n,c,h,u,A,T,C),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const v=m,S=m+1,x=m+2;i=Xs(this,a,t,n,c,h,u,v,S,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function Bd(r,t,e,n,i,s,a,o){let l;if(t.side===He?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,t.side===gi,o),l===null)return null;Ws.copy(o),Ws.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(Ws);return c<e.near||c>e.far?null:{distance:c,point:Ws.clone(),object:r}}function Xs(r,t,e,n,i,s,a,o,l,c){r.getVertexPosition(o,zs),r.getVertexPosition(l,Vs),r.getVertexPosition(c,Hs);const h=Bd(r,t,e,n,zs,Vs,Hs,Fc);if(h){const u=new F;bn.getBarycoord(Fc,zs,Vs,Hs,u),i&&(h.uv=bn.getInterpolatedAttribute(i,o,l,c,u,new Qt)),s&&(h.uv1=bn.getInterpolatedAttribute(s,o,l,c,u,new Qt)),a&&(h.normal=bn.getInterpolatedAttribute(a,o,l,c,u,new F),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new F,materialIndex:0};bn.getNormal(zs,Vs,Hs,f.normal),h.face=f,h.barycoord=u}return h}class Br extends mn{constructor(t=1,e=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,e,t,a,s,0),g("z","y","x",1,-1,n,e,-t,a,s,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,s,4),g("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new Ue(c,3)),this.setAttribute("normal",new Ue(h,3)),this.setAttribute("uv",new Ue(u,2));function g(_,m,p,v,S,x,R,A,T,C,M){const y=x/T,P=R/C,k=x/2,N=R/2,W=A/2,q=T+1,G=C+1;let $=0,B=0;const rt=new F;for(let st=0;st<G;st++){const gt=st*P-N;for(let J=0;J<q;J++){const vt=J*y-k;rt[_]=vt*v,rt[m]=gt*S,rt[p]=W,c.push(rt.x,rt.y,rt.z),rt[_]=0,rt[m]=0,rt[p]=A>0?1:-1,h.push(rt.x,rt.y,rt.z),u.push(J/T),u.push(1-st/C),$+=1}}for(let st=0;st<C;st++)for(let gt=0;gt<T;gt++){const J=f+gt+q*st,vt=f+gt+q*(st+1),H=f+(gt+1)+q*(st+1),et=f+(gt+1)+q*st;l.push(J,vt,et),l.push(vt,H,et),B+=6}o.addGroup(d,B,M),d+=B,f+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Br(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Pr(r){const t={};for(const e in r){t[e]={};for(const n in r[e]){const i=r[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Fe(r){const t={};for(let e=0;e<r.length;e++){const n=Pr(r[e]);for(const i in n)t[i]=n[i]}return t}function zd(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function iu(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:$t.workingColorSpace}const Vd={clone:Pr,merge:Fe};var Hd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Gd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class xi extends Es{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Hd,this.fragmentShader=Gd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Pr(t.uniforms),this.uniformsGroups=zd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class ru extends We{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Me,this.projectionMatrix=new Me,this.projectionMatrixInverse=new Me,this.coordinateSystem=$n}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ai=new F,Oc=new Qt,kc=new Qt;class fn extends ru{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=al*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ia*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return al*2*Math.atan(Math.tan(Ia*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ai.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ai.x,ai.y).multiplyScalar(-t/ai.z),ai.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ai.x,ai.y).multiplyScalar(-t/ai.z)}getViewSize(t,e){return this.getViewBounds(t,Oc,kc),e.subVectors(kc,Oc)}setViewOffset(t,e,n,i,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ia*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const hr=-90,ur=1;class Wd extends We{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new fn(hr,ur,t,e);i.layers=this.layers,this.add(i);const s=new fn(hr,ur,t,e);s.layers=this.layers,this.add(s);const a=new fn(hr,ur,t,e);a.layers=this.layers,this.add(a);const o=new fn(hr,ur,t,e);o.layers=this.layers,this.add(o);const l=new fn(hr,ur,t,e);l.layers=this.layers,this.add(l);const c=new fn(hr,ur,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,s,a,o,l]=e;for(const c of e)this.remove(c);if(t===$n)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ha)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,s),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,o),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class su extends Ge{constructor(t,e,n,i,s,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ar,super(t,e,n,i,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Xd extends Ki{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new su(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ln}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Br(5,5,5),s=new xi({name:"CubemapFromEquirect",uniforms:Pr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:He,blending:di});s.uniforms.tEquirect.value=e;const a=new ze(i,s),o=e.minFilter;return e.minFilter===Hi&&(e.minFilter=Ln),new Wd(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,i){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(s)}}const to=new F,qd=new F,$d=new Ft;class Ii{constructor(t=new F(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=to.subVectors(n,e).cross(qd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(to),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||$d.getNormalMatrix(t),i=this.coplanarPoint(to).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const wi=new Ea,qs=new F;class au{constructor(t=new Ii,e=new Ii,n=new Ii,i=new Ii,s=new Ii,a=new Ii){this.planes=[t,e,n,i,s,a]}set(t,e,n,i,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=$n){const n=this.planes,i=t.elements,s=i[0],a=i[1],o=i[2],l=i[3],c=i[4],h=i[5],u=i[6],f=i[7],d=i[8],g=i[9],_=i[10],m=i[11],p=i[12],v=i[13],S=i[14],x=i[15];if(n[0].setComponents(l-s,f-c,m-d,x-p).normalize(),n[1].setComponents(l+s,f+c,m+d,x+p).normalize(),n[2].setComponents(l+a,f+h,m+g,x+v).normalize(),n[3].setComponents(l-a,f-h,m-g,x-v).normalize(),n[4].setComponents(l-o,f-u,m-_,x-S).normalize(),e===$n)n[5].setComponents(l+o,f+u,m+_,x+S).normalize();else if(e===ha)n[5].setComponents(o,u,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),wi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),wi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(wi)}intersectsSprite(t){return wi.center.set(0,0,0),wi.radius=.7071067811865476,wi.applyMatrix4(t.matrixWorld),this.intersectsSphere(wi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(qs.x=i.normal.x>0?t.max.x:t.min.x,qs.y=i.normal.y>0?t.max.y:t.min.y,qs.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(qs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ou(){let r=null,t=!1,e=null,n=null;function i(s,a){e(s,a),n=r.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=r.requestAnimationFrame(i),t=!0)},stop:function(){r.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function Yd(r){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=r.createBuffer();r.bindBuffer(l,f),r.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=r.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=r.HALF_FLOAT:d=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=r.SHORT;else if(c instanceof Uint32Array)d=r.UNSIGNED_INT;else if(c instanceof Int32Array)d=r.INT;else if(c instanceof Int8Array)d=r.BYTE;else if(c instanceof Uint8Array)d=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(r.bindBuffer(c,o),u.length===0)r.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],_=u[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const _=u[d];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(r.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}class Ts extends mn{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const s=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=t/o,f=e/l,d=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const v=p*f-a;for(let S=0;S<c;S++){const x=S*u-s;g.push(x,-v,0),_.push(0,0,1),m.push(S/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<o;v++){const S=v+c*p,x=v+c*(p+1),R=v+1+c*(p+1),A=v+1+c*p;d.push(S,x,A),d.push(x,R,A)}this.setIndex(d),this.setAttribute("position",new Ue(g,3)),this.setAttribute("normal",new Ue(_,3)),this.setAttribute("uv",new Ue(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ts(t.width,t.height,t.widthSegments,t.heightSegments)}}var jd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Kd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Zd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Jd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,tp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ep=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,np=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ip=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,rp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,sp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ap=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,op=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,lp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,cp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,hp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,up=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,fp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,dp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,pp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,mp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,_p=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,xp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,vp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Mp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,yp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Sp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,bp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ep=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Tp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ap=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,wp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Rp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Cp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Pp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Dp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Lp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ip=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Up=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Np=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Fp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Op=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,kp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,zp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Vp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Hp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Gp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Wp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Xp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,$p=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Yp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,jp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Kp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Zp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Jp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,em=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,nm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,im=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,rm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,am=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,om=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,lm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,cm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,um=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,dm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,pm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_m=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,gm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,xm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,vm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Mm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ym=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Em=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Am=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Rm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Cm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Pm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Dm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Lm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Im=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Um=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Nm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Fm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Om=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,km=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Vm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Gm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Wm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,$m=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ym=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,jm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Km=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,t_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,e_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,n_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,i_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,r_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,s_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,o_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,l_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,c_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,u_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,d_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,m_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,__=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,g_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,v_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,y_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,b_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,E_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,T_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,A_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,w_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,kt={alphahash_fragment:jd,alphahash_pars_fragment:Kd,alphamap_fragment:Zd,alphamap_pars_fragment:Jd,alphatest_fragment:Qd,alphatest_pars_fragment:tp,aomap_fragment:ep,aomap_pars_fragment:np,batching_pars_vertex:ip,batching_vertex:rp,begin_vertex:sp,beginnormal_vertex:ap,bsdfs:op,iridescence_fragment:lp,bumpmap_pars_fragment:cp,clipping_planes_fragment:hp,clipping_planes_pars_fragment:up,clipping_planes_pars_vertex:fp,clipping_planes_vertex:dp,color_fragment:pp,color_pars_fragment:mp,color_pars_vertex:_p,color_vertex:gp,common:xp,cube_uv_reflection_fragment:vp,defaultnormal_vertex:Mp,displacementmap_pars_vertex:yp,displacementmap_vertex:Sp,emissivemap_fragment:bp,emissivemap_pars_fragment:Ep,colorspace_fragment:Tp,colorspace_pars_fragment:Ap,envmap_fragment:wp,envmap_common_pars_fragment:Rp,envmap_pars_fragment:Cp,envmap_pars_vertex:Pp,envmap_physical_pars_fragment:Vp,envmap_vertex:Dp,fog_vertex:Lp,fog_pars_vertex:Ip,fog_fragment:Up,fog_pars_fragment:Np,gradientmap_pars_fragment:Fp,lightmap_pars_fragment:Op,lights_lambert_fragment:kp,lights_lambert_pars_fragment:Bp,lights_pars_begin:zp,lights_toon_fragment:Hp,lights_toon_pars_fragment:Gp,lights_phong_fragment:Wp,lights_phong_pars_fragment:Xp,lights_physical_fragment:qp,lights_physical_pars_fragment:$p,lights_fragment_begin:Yp,lights_fragment_maps:jp,lights_fragment_end:Kp,logdepthbuf_fragment:Zp,logdepthbuf_pars_fragment:Jp,logdepthbuf_pars_vertex:Qp,logdepthbuf_vertex:tm,map_fragment:em,map_pars_fragment:nm,map_particle_fragment:im,map_particle_pars_fragment:rm,metalnessmap_fragment:sm,metalnessmap_pars_fragment:am,morphinstance_vertex:om,morphcolor_vertex:lm,morphnormal_vertex:cm,morphtarget_pars_vertex:hm,morphtarget_vertex:um,normal_fragment_begin:fm,normal_fragment_maps:dm,normal_pars_fragment:pm,normal_pars_vertex:mm,normal_vertex:_m,normalmap_pars_fragment:gm,clearcoat_normal_fragment_begin:xm,clearcoat_normal_fragment_maps:vm,clearcoat_pars_fragment:Mm,iridescence_pars_fragment:ym,opaque_fragment:Sm,packing:bm,premultiplied_alpha_fragment:Em,project_vertex:Tm,dithering_fragment:Am,dithering_pars_fragment:wm,roughnessmap_fragment:Rm,roughnessmap_pars_fragment:Cm,shadowmap_pars_fragment:Pm,shadowmap_pars_vertex:Dm,shadowmap_vertex:Lm,shadowmask_pars_fragment:Im,skinbase_vertex:Um,skinning_pars_vertex:Nm,skinning_vertex:Fm,skinnormal_vertex:Om,specularmap_fragment:km,specularmap_pars_fragment:Bm,tonemapping_fragment:zm,tonemapping_pars_fragment:Vm,transmission_fragment:Hm,transmission_pars_fragment:Gm,uv_pars_fragment:Wm,uv_pars_vertex:Xm,uv_vertex:qm,worldpos_vertex:$m,background_vert:Ym,background_frag:jm,backgroundCube_vert:Km,backgroundCube_frag:Zm,cube_vert:Jm,cube_frag:Qm,depth_vert:t_,depth_frag:e_,distanceRGBA_vert:n_,distanceRGBA_frag:i_,equirect_vert:r_,equirect_frag:s_,linedashed_vert:a_,linedashed_frag:o_,meshbasic_vert:l_,meshbasic_frag:c_,meshlambert_vert:h_,meshlambert_frag:u_,meshmatcap_vert:f_,meshmatcap_frag:d_,meshnormal_vert:p_,meshnormal_frag:m_,meshphong_vert:__,meshphong_frag:g_,meshphysical_vert:x_,meshphysical_frag:v_,meshtoon_vert:M_,meshtoon_frag:y_,points_vert:S_,points_frag:b_,shadow_vert:E_,shadow_frag:T_,sprite_vert:A_,sprite_frag:w_},at={common:{diffuse:{value:new Jt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ft},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ft}},envmap:{envMap:{value:null},envMapRotation:{value:new Ft},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ft}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ft}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ft},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ft},normalScale:{value:new Qt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ft},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ft}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ft}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ft}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Jt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Jt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0},uvTransform:{value:new Ft}},sprite:{diffuse:{value:new Jt(16777215)},opacity:{value:1},center:{value:new Qt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ft},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0}}},Pn={basic:{uniforms:Fe([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.fog]),vertexShader:kt.meshbasic_vert,fragmentShader:kt.meshbasic_frag},lambert:{uniforms:Fe([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Jt(0)}}]),vertexShader:kt.meshlambert_vert,fragmentShader:kt.meshlambert_frag},phong:{uniforms:Fe([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Jt(0)},specular:{value:new Jt(1118481)},shininess:{value:30}}]),vertexShader:kt.meshphong_vert,fragmentShader:kt.meshphong_frag},standard:{uniforms:Fe([at.common,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.roughnessmap,at.metalnessmap,at.fog,at.lights,{emissive:{value:new Jt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:kt.meshphysical_vert,fragmentShader:kt.meshphysical_frag},toon:{uniforms:Fe([at.common,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.gradientmap,at.fog,at.lights,{emissive:{value:new Jt(0)}}]),vertexShader:kt.meshtoon_vert,fragmentShader:kt.meshtoon_frag},matcap:{uniforms:Fe([at.common,at.bumpmap,at.normalmap,at.displacementmap,at.fog,{matcap:{value:null}}]),vertexShader:kt.meshmatcap_vert,fragmentShader:kt.meshmatcap_frag},points:{uniforms:Fe([at.points,at.fog]),vertexShader:kt.points_vert,fragmentShader:kt.points_frag},dashed:{uniforms:Fe([at.common,at.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:kt.linedashed_vert,fragmentShader:kt.linedashed_frag},depth:{uniforms:Fe([at.common,at.displacementmap]),vertexShader:kt.depth_vert,fragmentShader:kt.depth_frag},normal:{uniforms:Fe([at.common,at.bumpmap,at.normalmap,at.displacementmap,{opacity:{value:1}}]),vertexShader:kt.meshnormal_vert,fragmentShader:kt.meshnormal_frag},sprite:{uniforms:Fe([at.sprite,at.fog]),vertexShader:kt.sprite_vert,fragmentShader:kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:kt.background_vert,fragmentShader:kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ft}},vertexShader:kt.backgroundCube_vert,fragmentShader:kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:kt.cube_vert,fragmentShader:kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:kt.equirect_vert,fragmentShader:kt.equirect_frag},distanceRGBA:{uniforms:Fe([at.common,at.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:kt.distanceRGBA_vert,fragmentShader:kt.distanceRGBA_frag},shadow:{uniforms:Fe([at.lights,at.fog,{color:{value:new Jt(0)},opacity:{value:1}}]),vertexShader:kt.shadow_vert,fragmentShader:kt.shadow_frag}};Pn.physical={uniforms:Fe([Pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ft},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ft},clearcoatNormalScale:{value:new Qt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ft},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ft},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ft},sheen:{value:0},sheenColor:{value:new Jt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ft},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ft},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ft},transmissionSamplerSize:{value:new Qt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ft},attenuationDistance:{value:0},attenuationColor:{value:new Jt(0)},specularColor:{value:new Jt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ft},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ft},anisotropyVector:{value:new Qt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ft}}]),vertexShader:kt.meshphysical_vert,fragmentShader:kt.meshphysical_frag};const $s={r:0,b:0,g:0},Ri=new Kn,R_=new Me;function C_(r,t,e,n,i,s,a){const o=new Jt(0);let l=s===!0?0:1,c,h,u=null,f=0,d=null;function g(v){let S=v.isScene===!0?v.background:null;return S&&S.isTexture&&(S=(v.backgroundBlurriness>0?e:t).get(S)),S}function _(v){let S=!1;const x=g(v);x===null?p(o,l):x&&x.isColor&&(p(x,1),S=!0);const R=r.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(r.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(v,S){const x=g(S);x&&(x.isCubeTexture||x.mapping===Sa)?(h===void 0&&(h=new ze(new Br(1,1,1),new xi({name:"BackgroundCubeMaterial",uniforms:Pr(Pn.backgroundCube.uniforms),vertexShader:Pn.backgroundCube.vertexShader,fragmentShader:Pn.backgroundCube.fragmentShader,side:He,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Ri.copy(S.backgroundRotation),Ri.x*=-1,Ri.y*=-1,Ri.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Ri.y*=-1,Ri.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(R_.makeRotationFromEuler(Ri)),h.material.toneMapped=$t.getTransfer(x.colorSpace)!==ee,(u!==x||f!==x.version||d!==r.toneMapping)&&(h.material.needsUpdate=!0,u=x,f=x.version,d=r.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new ze(new Ts(2,2),new xi({name:"BackgroundMaterial",uniforms:Pr(Pn.background.uniforms),vertexShader:Pn.background.vertexShader,fragmentShader:Pn.background.fragmentShader,side:gi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=$t.getTransfer(x.colorSpace)!==ee,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||d!==r.toneMapping)&&(c.material.needsUpdate=!0,u=x,f=x.version,d=r.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function p(v,S){v.getRGB($s,iu(r)),n.buffers.color.setClear($s.r,$s.g,$s.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(v,S=1){o.set(v),l=S,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,p(o,l)},render:_,addToRenderList:m}}function P_(r,t){const e=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=f(null);let s=i,a=!1;function o(y,P,k,N,W){let q=!1;const G=u(N,k,P);s!==G&&(s=G,c(s.object)),q=d(y,N,k,W),q&&g(y,N,k,W),W!==null&&t.update(W,r.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,x(y,P,k,N),W!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function l(){return r.createVertexArray()}function c(y){return r.bindVertexArray(y)}function h(y){return r.deleteVertexArray(y)}function u(y,P,k){const N=k.wireframe===!0;let W=n[y.id];W===void 0&&(W={},n[y.id]=W);let q=W[P.id];q===void 0&&(q={},W[P.id]=q);let G=q[N];return G===void 0&&(G=f(l()),q[N]=G),G}function f(y){const P=[],k=[],N=[];for(let W=0;W<e;W++)P[W]=0,k[W]=0,N[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:k,attributeDivisors:N,object:y,attributes:{},index:null}}function d(y,P,k,N){const W=s.attributes,q=P.attributes;let G=0;const $=k.getAttributes();for(const B in $)if($[B].location>=0){const st=W[B];let gt=q[B];if(gt===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(gt=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(gt=y.instanceColor)),st===void 0||st.attribute!==gt||gt&&st.data!==gt.data)return!0;G++}return s.attributesNum!==G||s.index!==N}function g(y,P,k,N){const W={},q=P.attributes;let G=0;const $=k.getAttributes();for(const B in $)if($[B].location>=0){let st=q[B];st===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(st=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(st=y.instanceColor));const gt={};gt.attribute=st,st&&st.data&&(gt.data=st.data),W[B]=gt,G++}s.attributes=W,s.attributesNum=G,s.index=N}function _(){const y=s.newAttributes;for(let P=0,k=y.length;P<k;P++)y[P]=0}function m(y){p(y,0)}function p(y,P){const k=s.newAttributes,N=s.enabledAttributes,W=s.attributeDivisors;k[y]=1,N[y]===0&&(r.enableVertexAttribArray(y),N[y]=1),W[y]!==P&&(r.vertexAttribDivisor(y,P),W[y]=P)}function v(){const y=s.newAttributes,P=s.enabledAttributes;for(let k=0,N=P.length;k<N;k++)P[k]!==y[k]&&(r.disableVertexAttribArray(k),P[k]=0)}function S(y,P,k,N,W,q,G){G===!0?r.vertexAttribIPointer(y,P,k,W,q):r.vertexAttribPointer(y,P,k,N,W,q)}function x(y,P,k,N){_();const W=N.attributes,q=k.getAttributes(),G=P.defaultAttributeValues;for(const $ in q){const B=q[$];if(B.location>=0){let rt=W[$];if(rt===void 0&&($==="instanceMatrix"&&y.instanceMatrix&&(rt=y.instanceMatrix),$==="instanceColor"&&y.instanceColor&&(rt=y.instanceColor)),rt!==void 0){const st=rt.normalized,gt=rt.itemSize,J=t.get(rt);if(J===void 0)continue;const vt=J.buffer,H=J.type,et=J.bytesPerElement,pt=H===r.INT||H===r.UNSIGNED_INT||rt.gpuType===bl;if(rt.isInterleavedBufferAttribute){const Z=rt.data,bt=Z.stride,xt=rt.offset;if(Z.isInstancedInterleavedBuffer){for(let At=0;At<B.locationSize;At++)p(B.location+At,Z.meshPerAttribute);y.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let At=0;At<B.locationSize;At++)m(B.location+At);r.bindBuffer(r.ARRAY_BUFFER,vt);for(let At=0;At<B.locationSize;At++)S(B.location+At,gt/B.locationSize,H,st,bt*et,(xt+gt/B.locationSize*At)*et,pt)}else{if(rt.isInstancedBufferAttribute){for(let Z=0;Z<B.locationSize;Z++)p(B.location+Z,rt.meshPerAttribute);y.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Z=0;Z<B.locationSize;Z++)m(B.location+Z);r.bindBuffer(r.ARRAY_BUFFER,vt);for(let Z=0;Z<B.locationSize;Z++)S(B.location+Z,gt/B.locationSize,H,st,gt*et,gt/B.locationSize*Z*et,pt)}}else if(G!==void 0){const st=G[$];if(st!==void 0)switch(st.length){case 2:r.vertexAttrib2fv(B.location,st);break;case 3:r.vertexAttrib3fv(B.location,st);break;case 4:r.vertexAttrib4fv(B.location,st);break;default:r.vertexAttrib1fv(B.location,st)}}}}v()}function R(){C();for(const y in n){const P=n[y];for(const k in P){const N=P[k];for(const W in N)h(N[W].object),delete N[W];delete P[k]}delete n[y]}}function A(y){if(n[y.id]===void 0)return;const P=n[y.id];for(const k in P){const N=P[k];for(const W in N)h(N[W].object),delete N[W];delete P[k]}delete n[y.id]}function T(y){for(const P in n){const k=n[P];if(k[y.id]===void 0)continue;const N=k[y.id];for(const W in N)h(N[W].object),delete N[W];delete k[y.id]}}function C(){M(),a=!0,s!==i&&(s=i,c(s.object))}function M(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:C,resetDefaultState:M,dispose:R,releaseStatesOfGeometry:A,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function D_(r,t,e){let n;function i(c){n=c}function s(c,h){r.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,u){u!==0&&(r.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];e.update(d,n,1)}function l(c,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)a(c[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*f[_];e.update(g,n,1)}}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function L_(r,t,e,n){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");i=r.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(T){return!(T!==En&&n.convert(T)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const C=T===Ms&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==jn&&n.convert(T)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==qn&&!C)}function l(T){if(T==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),v=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),S=r.getParameter(r.MAX_VARYING_VECTORS),x=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,A=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:v,maxVaryings:S,maxFragmentUniforms:x,vertexTextures:R,maxSamples:A}}function I_(r){const t=this;let e=null,n=0,i=!1,s=!1;const a=new Ii,o=new Ft,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=r.get(u);if(!i||g===null||g.length===0||s&&!m)s?h(null):c();else{const v=s?0:n,S=v*4;let x=p.clippingState||null;l.value=x,x=h(g,f,S,d);for(let R=0;R!==S;++R)x[R]=e[R];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=d+_*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,x=d;S!==_;++S,x+=4)a.copy(u[S]).applyMatrix4(v,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function U_(r){let t=new WeakMap;function e(a,o){return o===Po?a.mapping=Ar:o===Do&&(a.mapping=wr),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Po||o===Do)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Xd(l.height);return c.fromEquirectangularTexture(r,a),t.set(a,c),a.addEventListener("dispose",i),e(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}class N_ extends ru{constructor(t=-1,e=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const pr=4,Bc=[.125,.215,.35,.446,.526,.582],Bi=20,eo=new N_,zc=new Jt;let no=null,io=0,ro=0,so=!1;const Ui=(1+Math.sqrt(5))/2,fr=1/Ui,Vc=[new F(-Ui,fr,0),new F(Ui,fr,0),new F(-fr,0,Ui),new F(fr,0,Ui),new F(0,Ui,-fr),new F(0,Ui,fr),new F(-1,1,-1),new F(1,1,-1),new F(-1,1,1),new F(1,1,1)];class Hc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){no=this._renderer.getRenderTarget(),io=this._renderer.getActiveCubeFace(),ro=this._renderer.getActiveMipmapLevel(),so=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,i,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(no,io,ro),this._renderer.xr.enabled=so,t.scissorTest=!1,Ys(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ar||t.mapping===wr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),no=this._renderer.getRenderTarget(),io=this._renderer.getActiveCubeFace(),ro=this._renderer.getActiveMipmapLevel(),so=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ln,minFilter:Ln,generateMipmaps:!1,type:Ms,format:En,colorSpace:Or,depthBuffer:!1},i=Gc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gc(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=F_(s)),this._blurMaterial=O_(s,t,e)}return i}_compileMaterial(t){const e=new ze(this._lodPlanes[0],t);this._renderer.compile(e,eo)}_sceneToCubeUV(t,e,n,i){const o=new fn(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(zc),h.toneMapping=pi,h.autoClear=!1;const d=new ki({name:"PMREM.Background",side:He,depthWrite:!1,depthTest:!1}),g=new ze(new Br,d);let _=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,_=!0):(d.color.copy(zc),_=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):v===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const S=this._cubeSize;Ys(i,v*S,p>2?S:0,S,S),h.setRenderTarget(i),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Ar||t.mapping===wr;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wc());const s=i?this._cubemapMaterial:this._equirectMaterial,a=new ze(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const l=this._cubeSize;Ys(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,eo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Vc[(i-s-1)%Vc.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",s),this._halfBlur(a,t,n,n,i,"longitudinal",s)}_halfBlur(t,e,n,i,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ze(this._lodPlanes[i],c),f=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*Bi-1),_=s/g,m=isFinite(s)?1+Math.floor(h*_):Bi;m>Bi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Bi}`);const p=[];let v=0;for(let T=0;T<Bi;++T){const C=T/_,M=Math.exp(-C*C/2);p.push(M),T===0?v+=M:T<m&&(v+=2*M)}for(let T=0;T<p.length;T++)p[T]=p[T]/v;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:S}=this;f.dTheta.value=g,f.mipInt.value=S-n;const x=this._sizeLods[i],R=3*x*(i>S-pr?i-S+pr:0),A=4*(this._cubeSize-x);Ys(e,R,A,3*x,2*x),l.setRenderTarget(e),l.render(u,eo)}}function F_(r){const t=[],e=[],n=[];let i=r;const s=r-pr+1+Bc.length;for(let a=0;a<s;a++){const o=Math.pow(2,i);e.push(o);let l=1/o;a>r-pr?l=Bc[a-r+pr-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,_=3,m=2,p=1,v=new Float32Array(_*g*d),S=new Float32Array(m*g*d),x=new Float32Array(p*g*d);for(let A=0;A<d;A++){const T=A%3*2/3-1,C=A>2?0:-1,M=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];v.set(M,_*g*A),S.set(f,m*g*A);const y=[A,A,A,A,A,A];x.set(y,p*g*A)}const R=new mn;R.setAttribute("position",new An(v,_)),R.setAttribute("uv",new An(S,m)),R.setAttribute("faceIndex",new An(x,p)),t.push(R),i>pr&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Gc(r,t,e){const n=new Ki(r,t,e);return n.texture.mapping=Sa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ys(r,t,e,n,i){r.viewport.set(t,e,n,i),r.scissor.set(t,e,n,i)}function O_(r,t,e){const n=new Float32Array(Bi),i=new F(0,1,0);return new xi({name:"SphericalGaussianBlur",defines:{n:Bi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:di,depthTest:!1,depthWrite:!1})}function Wc(){return new xi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:di,depthTest:!1,depthWrite:!1})}function Xc(){return new xi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:di,depthTest:!1,depthWrite:!1})}function Cl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function k_(r){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Po||l===Do,h=l===Ar||l===wr;if(c||h){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new Hc(r)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const d=o.image;return c&&d&&d.height>0||h&&d&&i(d)?(e===null&&(e=new Hc(r)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function B_(r){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Zr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function z_(r,t,e,n){const i={},s=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}f.removeEventListener("dispose",a),delete i[f.id];const d=s.get(f);d&&(t.remove(d),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)t.update(f[g],r.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const _=d[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],r.ARRAY_BUFFER)}}function c(u){const f=[],d=u.index,g=u.attributes.position;let _=0;if(d!==null){const v=d.array;_=d.version;for(let S=0,x=v.length;S<x;S+=3){const R=v[S+0],A=v[S+1],T=v[S+2];f.push(R,A,A,T,T,R)}}else if(g!==void 0){const v=g.array;_=g.version;for(let S=0,x=v.length/3-1;S<x;S+=3){const R=S+0,A=S+1,T=S+2;f.push(R,A,A,T,T,R)}}else return;const m=new(jh(f)?nu:eu)(f,1);m.version=_;const p=s.get(u);p&&t.remove(p),s.set(u,m)}function h(u){const f=s.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function V_(r,t,e){let n;function i(f){n=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,d){r.drawElements(n,d,s,f*a),e.update(d,n,1)}function c(f,d,g){g!==0&&(r.drawElementsInstanced(n,d,s,f*a,g),e.update(d,n,g))}function h(f,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];e.update(m,n,1)}function u(f,d,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)c(f[p]/a,d[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,s,f,0,_,0,g);let p=0;for(let v=0;v<g;v++)p+=d[v]*_[v];e.update(p,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function H_(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case r.TRIANGLES:e.triangles+=o*(s/3);break;case r.LINES:e.lines+=o*(s/2);break;case r.LINE_STRIP:e.lines+=o*(s-1);break;case r.LINE_LOOP:e.lines+=o*s;break;case r.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function G_(r,t,e){const n=new WeakMap,i=new ve;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let y=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",y)};var d=y;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let x=0;g===!0&&(x=1),_===!0&&(x=2),m===!0&&(x=3);let R=o.attributes.position.count*x,A=1;R>t.maxTextureSize&&(A=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const T=new Float32Array(R*A*4*u),C=new Zh(T,R,A,u);C.type=qn,C.needsUpdate=!0;const M=x*4;for(let P=0;P<u;P++){const k=p[P],N=v[P],W=S[P],q=R*A*4*P;for(let G=0;G<k.count;G++){const $=G*M;g===!0&&(i.fromBufferAttribute(k,G),T[q+$+0]=i.x,T[q+$+1]=i.y,T[q+$+2]=i.z,T[q+$+3]=0),_===!0&&(i.fromBufferAttribute(N,G),T[q+$+4]=i.x,T[q+$+5]=i.y,T[q+$+6]=i.z,T[q+$+7]=0),m===!0&&(i.fromBufferAttribute(W,G),T[q+$+8]=i.x,T[q+$+9]=i.y,T[q+$+10]=i.z,T[q+$+11]=W.itemSize===4?i.w:1)}}f={count:u,texture:C,size:new Qt(R,A)},n.set(o,f),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(r,"morphTargetBaseInfluence",_),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",f.size)}return{update:s}}function W_(r,t,e,n){let i=new WeakMap;function s(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(e.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,r.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return u}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:a}}class lu extends Ge{constructor(t,e,n,i,s,a,o,l,c,h=Mr){if(h!==Mr&&h!==Cr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Mr&&(n=ji),n===void 0&&h===Cr&&(n=Rr),super(null,i,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Tn,this.minFilter=l!==void 0?l:Tn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const cu=new Ge,qc=new lu(1,1),hu=new Zh,uu=new Cd,fu=new su,$c=[],Yc=[],jc=new Float32Array(16),Kc=new Float32Array(9),Zc=new Float32Array(4);function zr(r,t,e){const n=r[0];if(n<=0||n>0)return r;const i=t*e;let s=$c[i];if(s===void 0&&(s=new Float32Array(i),$c[i]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,r[a].toArray(s,o)}return s}function Ee(r,t){if(r.length!==t.length)return!1;for(let e=0,n=r.length;e<n;e++)if(r[e]!==t[e])return!1;return!0}function Te(r,t){for(let e=0,n=t.length;e<n;e++)r[e]=t[e]}function Ta(r,t){let e=Yc[t];e===void 0&&(e=new Int32Array(t),Yc[t]=e);for(let n=0;n!==t;++n)e[n]=r.allocateTextureUnit();return e}function X_(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function q_(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;r.uniform2fv(this.addr,t),Te(e,t)}}function $_(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ee(e,t))return;r.uniform3fv(this.addr,t),Te(e,t)}}function Y_(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;r.uniform4fv(this.addr,t),Te(e,t)}}function j_(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;Zc.set(n),r.uniformMatrix2fv(this.addr,!1,Zc),Te(e,n)}}function K_(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;Kc.set(n),r.uniformMatrix3fv(this.addr,!1,Kc),Te(e,n)}}function Z_(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;jc.set(n),r.uniformMatrix4fv(this.addr,!1,jc),Te(e,n)}}function J_(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function Q_(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;r.uniform2iv(this.addr,t),Te(e,t)}}function tg(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;r.uniform3iv(this.addr,t),Te(e,t)}}function eg(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;r.uniform4iv(this.addr,t),Te(e,t)}}function ng(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function ig(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;r.uniform2uiv(this.addr,t),Te(e,t)}}function rg(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;r.uniform3uiv(this.addr,t),Te(e,t)}}function sg(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;r.uniform4uiv(this.addr,t),Te(e,t)}}function ag(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(qc.compareFunction=Yh,s=qc):s=cu,e.setTexture2D(t||s,i)}function og(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||uu,i)}function lg(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||fu,i)}function cg(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||hu,i)}function hg(r){switch(r){case 5126:return X_;case 35664:return q_;case 35665:return $_;case 35666:return Y_;case 35674:return j_;case 35675:return K_;case 35676:return Z_;case 5124:case 35670:return J_;case 35667:case 35671:return Q_;case 35668:case 35672:return tg;case 35669:case 35673:return eg;case 5125:return ng;case 36294:return ig;case 36295:return rg;case 36296:return sg;case 35678:case 36198:case 36298:case 36306:case 35682:return ag;case 35679:case 36299:case 36307:return og;case 35680:case 36300:case 36308:case 36293:return lg;case 36289:case 36303:case 36311:case 36292:return cg}}function ug(r,t){r.uniform1fv(this.addr,t)}function fg(r,t){const e=zr(t,this.size,2);r.uniform2fv(this.addr,e)}function dg(r,t){const e=zr(t,this.size,3);r.uniform3fv(this.addr,e)}function pg(r,t){const e=zr(t,this.size,4);r.uniform4fv(this.addr,e)}function mg(r,t){const e=zr(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function _g(r,t){const e=zr(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function gg(r,t){const e=zr(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function xg(r,t){r.uniform1iv(this.addr,t)}function vg(r,t){r.uniform2iv(this.addr,t)}function Mg(r,t){r.uniform3iv(this.addr,t)}function yg(r,t){r.uniform4iv(this.addr,t)}function Sg(r,t){r.uniform1uiv(this.addr,t)}function bg(r,t){r.uniform2uiv(this.addr,t)}function Eg(r,t){r.uniform3uiv(this.addr,t)}function Tg(r,t){r.uniform4uiv(this.addr,t)}function Ag(r,t,e){const n=this.cache,i=t.length,s=Ta(e,i);Ee(n,s)||(r.uniform1iv(this.addr,s),Te(n,s));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||cu,s[a])}function wg(r,t,e){const n=this.cache,i=t.length,s=Ta(e,i);Ee(n,s)||(r.uniform1iv(this.addr,s),Te(n,s));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||uu,s[a])}function Rg(r,t,e){const n=this.cache,i=t.length,s=Ta(e,i);Ee(n,s)||(r.uniform1iv(this.addr,s),Te(n,s));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||fu,s[a])}function Cg(r,t,e){const n=this.cache,i=t.length,s=Ta(e,i);Ee(n,s)||(r.uniform1iv(this.addr,s),Te(n,s));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||hu,s[a])}function Pg(r){switch(r){case 5126:return ug;case 35664:return fg;case 35665:return dg;case 35666:return pg;case 35674:return mg;case 35675:return _g;case 35676:return gg;case 5124:case 35670:return xg;case 35667:case 35671:return vg;case 35668:case 35672:return Mg;case 35669:case 35673:return yg;case 5125:return Sg;case 36294:return bg;case 36295:return Eg;case 36296:return Tg;case 35678:case 36198:case 36298:case 36306:case 35682:return Ag;case 35679:case 36299:case 36307:return wg;case 35680:case 36300:case 36308:case 36293:return Rg;case 36289:case 36303:case 36311:case 36292:return Cg}}class Dg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=hg(e.type)}}class Lg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Pg(e.type)}}class Ig{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(t,e[o.id],n)}}}const ao=/(\w+)(\])?(\[|\.)?/g;function Jc(r,t){r.seq.push(t),r.map[t.id]=t}function Ug(r,t,e){const n=r.name,i=n.length;for(ao.lastIndex=0;;){const s=ao.exec(n),a=ao.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Jc(e,c===void 0?new Dg(o,r,t):new Lg(o,r,t));break}else{let u=e.map[o];u===void 0&&(u=new Ig(o),Jc(e,u)),e=u}}}class sa{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=t.getActiveUniform(e,i),a=t.getUniformLocation(e,s.name);Ug(s,a,this)}}setValue(t,e,n,i){const s=this.map[e];s!==void 0&&s.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,a=e.length;s!==a;++s){const o=e[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,s=t.length;i!==s;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function Qc(r,t,e){const n=r.createShader(t);return r.shaderSource(n,e),r.compileShader(n),n}const Ng=37297;let Fg=0;function Og(r,t){const e=r.split(`
`),n=[],i=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const th=new Ft;function kg(r){$t._getMatrix(th,$t.workingColorSpace,r);const t=`mat3( ${th.elements.map(e=>e.toFixed(4))} )`;switch($t.getTransfer(r)){case ba:return[t,"LinearTransferOETF"];case ee:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function eh(r,t,e){const n=r.getShaderParameter(t,r.COMPILE_STATUS),i=r.getShaderInfoLog(t).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const a=parseInt(s[1]);return e.toUpperCase()+`

`+i+`

`+Og(r.getShaderSource(t),a)}else return i}function Bg(r,t){const e=kg(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function zg(r,t){let e;switch(t){case ed:e="Linear";break;case nd:e="Reinhard";break;case id:e="Cineon";break;case rd:e="ACESFilmic";break;case ad:e="AgX";break;case od:e="Neutral";break;case sd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const js=new F;function Vg(){$t.getLuminanceCoefficients(js);const r=js.x.toFixed(4),t=js.y.toFixed(4),e=js.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Hg(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Jr).join(`
`)}function Gg(r){const t=[];for(const e in r){const n=r[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Wg(r,t){const e={},n=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(t,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:r.getAttribLocation(t,a),locationSize:o}}return e}function Jr(r){return r!==""}function nh(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ih(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Xg=/^[ \t]*#include +<([\w\d./]+)>/gm;function ol(r){return r.replace(Xg,$g)}const qg=new Map;function $g(r,t){let e=kt[t];if(e===void 0){const n=qg.get(t);if(n!==void 0)e=kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ol(e)}const Yg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function rh(r){return r.replace(Yg,jg)}function jg(r,t,e,n){let i="";for(let s=parseInt(t);s<parseInt(e);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function sh(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Kg(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Nh?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===Uf?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Hn&&(t="SHADOWMAP_TYPE_VSM"),t}function Zg(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Ar:case wr:t="ENVMAP_TYPE_CUBE";break;case Sa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Jg(r){let t="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case wr:t="ENVMAP_MODE_REFRACTION";break}return t}function Qg(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Fh:t="ENVMAP_BLENDING_MULTIPLY";break;case Qf:t="ENVMAP_BLENDING_MIX";break;case td:t="ENVMAP_BLENDING_ADD";break}return t}function t0(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function e0(r,t,e,n){const i=r.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Kg(e),c=Zg(e),h=Jg(e),u=Qg(e),f=t0(e),d=Hg(e),g=Gg(s),_=i.createProgram();let m,p,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Jr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Jr).join(`
`),p.length>0&&(p+=`
`)):(m=[sh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Jr).join(`
`),p=[sh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==pi?"#define TONE_MAPPING":"",e.toneMapping!==pi?kt.tonemapping_pars_fragment:"",e.toneMapping!==pi?zg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",kt.colorspace_pars_fragment,Bg("linearToOutputTexel",e.outputColorSpace),Vg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Jr).join(`
`)),a=ol(a),a=nh(a,e),a=ih(a,e),o=ol(o),o=nh(o,e),o=ih(o,e),a=rh(a),o=rh(o),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===xc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===xc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=v+m+a,x=v+p+o,R=Qc(i,i.VERTEX_SHADER,S),A=Qc(i,i.FRAGMENT_SHADER,x);i.attachShader(_,R),i.attachShader(_,A),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function T(P){if(r.debug.checkShaderErrors){const k=i.getProgramInfoLog(_).trim(),N=i.getShaderInfoLog(R).trim(),W=i.getShaderInfoLog(A).trim();let q=!0,G=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(q=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,R,A);else{const $=eh(i,R,"vertex"),B=eh(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+k+`
`+$+`
`+B)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(N===""||W==="")&&(G=!1);G&&(P.diagnostics={runnable:q,programLog:k,vertexShader:{log:N,prefix:m},fragmentShader:{log:W,prefix:p}})}i.deleteShader(R),i.deleteShader(A),C=new sa(i,_),M=Wg(i,_)}let C;this.getUniforms=function(){return C===void 0&&T(this),C};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(_,Ng)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Fg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=A,this}let n0=0;class i0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new r0(t),e.set(t,n)),n}}class r0{constructor(t){this.id=n0++,this.code=t,this.usedTimes=0}}function s0(r,t,e,n,i,s,a){const o=new Qh,l=new i0,c=new Set,h=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures;let d=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,y,P,k,N){const W=k.fog,q=N.geometry,G=M.isMeshStandardMaterial?k.environment:null,$=(M.isMeshStandardMaterial?e:t).get(M.envMap||G),B=$&&$.mapping===Sa?$.image.height:null,rt=g[M.type];M.precision!==null&&(d=i.getMaxPrecision(M.precision),d!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const st=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,gt=st!==void 0?st.length:0;let J=0;q.morphAttributes.position!==void 0&&(J=1),q.morphAttributes.normal!==void 0&&(J=2),q.morphAttributes.color!==void 0&&(J=3);let vt,H,et,pt;if(rt){const te=Pn[rt];vt=te.vertexShader,H=te.fragmentShader}else vt=M.vertexShader,H=M.fragmentShader,l.update(M),et=l.getVertexShaderID(M),pt=l.getFragmentShaderID(M);const Z=r.getRenderTarget(),bt=r.state.buffers.depth.getReversed(),xt=N.isInstancedMesh===!0,At=N.isBatchedMesh===!0,ie=!!M.map,Wt=!!M.matcap,ge=!!$,U=!!M.aoMap,on=!!M.lightMap,Vt=!!M.bumpMap,Ht=!!M.normalMap,Rt=!!M.displacementMap,oe=!!M.emissiveMap,wt=!!M.metalnessMap,w=!!M.roughnessMap,b=M.anisotropy>0,O=M.clearcoat>0,j=M.dispersion>0,tt=M.iridescence>0,Y=M.sheen>0,Et=M.transmission>0,lt=b&&!!M.anisotropyMap,dt=O&&!!M.clearcoatMap,Xt=O&&!!M.clearcoatNormalMap,nt=O&&!!M.clearcoatRoughnessMap,mt=tt&&!!M.iridescenceMap,Ct=tt&&!!M.iridescenceThicknessMap,Pt=Y&&!!M.sheenColorMap,_t=Y&&!!M.sheenRoughnessMap,Gt=!!M.specularMap,Ot=!!M.specularColorMap,se=!!M.specularIntensityMap,D=Et&&!!M.transmissionMap,ot=Et&&!!M.thicknessMap,X=!!M.gradientMap,K=!!M.alphaMap,ut=M.alphaTest>0,ct=!!M.alphaHash,It=!!M.extensions;let me=pi;M.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(me=r.toneMapping);const Ce={shaderID:rt,shaderType:M.type,shaderName:M.name,vertexShader:vt,fragmentShader:H,defines:M.defines,customVertexShaderID:et,customFragmentShaderID:pt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:At,batchingColor:At&&N._colorsTexture!==null,instancing:xt,instancingColor:xt&&N.instanceColor!==null,instancingMorph:xt&&N.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Z===null?r.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Or,alphaToCoverage:!!M.alphaToCoverage,map:ie,matcap:Wt,envMap:ge,envMapMode:ge&&$.mapping,envMapCubeUVHeight:B,aoMap:U,lightMap:on,bumpMap:Vt,normalMap:Ht,displacementMap:f&&Rt,emissiveMap:oe,normalMapObjectSpace:Ht&&M.normalMapType===fd,normalMapTangentSpace:Ht&&M.normalMapType===ud,metalnessMap:wt,roughnessMap:w,anisotropy:b,anisotropyMap:lt,clearcoat:O,clearcoatMap:dt,clearcoatNormalMap:Xt,clearcoatRoughnessMap:nt,dispersion:j,iridescence:tt,iridescenceMap:mt,iridescenceThicknessMap:Ct,sheen:Y,sheenColorMap:Pt,sheenRoughnessMap:_t,specularMap:Gt,specularColorMap:Ot,specularIntensityMap:se,transmission:Et,transmissionMap:D,thicknessMap:ot,gradientMap:X,opaque:M.transparent===!1&&M.blending===vr&&M.alphaToCoverage===!1,alphaMap:K,alphaTest:ut,alphaHash:ct,combine:M.combine,mapUv:ie&&_(M.map.channel),aoMapUv:U&&_(M.aoMap.channel),lightMapUv:on&&_(M.lightMap.channel),bumpMapUv:Vt&&_(M.bumpMap.channel),normalMapUv:Ht&&_(M.normalMap.channel),displacementMapUv:Rt&&_(M.displacementMap.channel),emissiveMapUv:oe&&_(M.emissiveMap.channel),metalnessMapUv:wt&&_(M.metalnessMap.channel),roughnessMapUv:w&&_(M.roughnessMap.channel),anisotropyMapUv:lt&&_(M.anisotropyMap.channel),clearcoatMapUv:dt&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Xt&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:mt&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:Ct&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:Pt&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:_t&&_(M.sheenRoughnessMap.channel),specularMapUv:Gt&&_(M.specularMap.channel),specularColorMapUv:Ot&&_(M.specularColorMap.channel),specularIntensityMapUv:se&&_(M.specularIntensityMap.channel),transmissionMapUv:D&&_(M.transmissionMap.channel),thicknessMapUv:ot&&_(M.thicknessMap.channel),alphaMapUv:K&&_(M.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Ht||b),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!q.attributes.uv&&(ie||K),fog:!!W,useFog:M.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:bt,skinning:N.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:gt,morphTextureStride:J,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:r.shadowMap.enabled&&P.length>0,shadowMapType:r.shadowMap.type,toneMapping:me,decodeVideoTexture:ie&&M.map.isVideoTexture===!0&&$t.getTransfer(M.map.colorSpace)===ee,decodeVideoTextureEmissive:oe&&M.emissiveMap.isVideoTexture===!0&&$t.getTransfer(M.emissiveMap.colorSpace)===ee,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Xn,flipSided:M.side===He,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:It&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(It&&M.extensions.multiDraw===!0||At)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Ce.vertexUv1s=c.has(1),Ce.vertexUv2s=c.has(2),Ce.vertexUv3s=c.has(3),c.clear(),Ce}function p(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const P in M.defines)y.push(P),y.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(v(y,M),S(y,M),y.push(r.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function v(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function S(M,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),M.push(o.mask)}function x(M){const y=g[M.type];let P;if(y){const k=Pn[y];P=Vd.clone(k.uniforms)}else P=M.uniforms;return P}function R(M,y){let P;for(let k=0,N=h.length;k<N;k++){const W=h[k];if(W.cacheKey===y){P=W,++P.usedTimes;break}}return P===void 0&&(P=new e0(r,y,M,s),h.push(P)),P}function A(M){if(--M.usedTimes===0){const y=h.indexOf(M);h[y]=h[h.length-1],h.pop(),M.destroy()}}function T(M){l.remove(M)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:R,releaseProgram:A,releaseShaderCache:T,programs:h,dispose:C}}function a0(){let r=new WeakMap;function t(a){return r.has(a)}function e(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:s}}function o0(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function ah(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function oh(){const r=[];let t=0;const e=[],n=[],i=[];function s(){t=0,e.length=0,n.length=0,i.length=0}function a(u,f,d,g,_,m){let p=r[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},r[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,f,d,g,_,m){const p=a(u,f,d,g,_,m);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):e.push(p)}function l(u,f,d,g,_,m){const p=a(u,f,d,g,_,m);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):e.unshift(p)}function c(u,f){e.length>1&&e.sort(u||o0),n.length>1&&n.sort(f||ah),i.length>1&&i.sort(f||ah)}function h(){for(let u=t,f=r.length;u<f;u++){const d=r[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:i,init:s,push:o,unshift:l,finish:h,sort:c}}function l0(){let r=new WeakMap;function t(n,i){const s=r.get(n);let a;return s===void 0?(a=new oh,r.set(n,[a])):i>=s.length?(a=new oh,s.push(a)):a=s[i],a}function e(){r=new WeakMap}return{get:t,dispose:e}}function c0(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new F,color:new Jt};break;case"SpotLight":e={position:new F,direction:new F,color:new Jt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new F,color:new Jt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new F,skyColor:new Jt,groundColor:new Jt};break;case"RectAreaLight":e={color:new Jt,position:new F,halfWidth:new F,halfHeight:new F};break}return r[t.id]=e,e}}}function h0(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}let u0=0;function f0(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function d0(r){const t=new c0,e=h0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new F);const i=new F,s=new Me,a=new Me;function o(c){let h=0,u=0,f=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let d=0,g=0,_=0,m=0,p=0,v=0,S=0,x=0,R=0,A=0,T=0;c.sort(f0);for(let M=0,y=c.length;M<y;M++){const P=c[M],k=P.color,N=P.intensity,W=P.distance,q=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=k.r*N,u+=k.g*N,f+=k.b*N;else if(P.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(P.sh.coefficients[G],N);T++}else if(P.isDirectionalLight){const G=t.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const $=P.shadow,B=e.get(P);B.shadowIntensity=$.intensity,B.shadowBias=$.bias,B.shadowNormalBias=$.normalBias,B.shadowRadius=$.radius,B.shadowMapSize=$.mapSize,n.directionalShadow[d]=B,n.directionalShadowMap[d]=q,n.directionalShadowMatrix[d]=P.shadow.matrix,v++}n.directional[d]=G,d++}else if(P.isSpotLight){const G=t.get(P);G.position.setFromMatrixPosition(P.matrixWorld),G.color.copy(k).multiplyScalar(N),G.distance=W,G.coneCos=Math.cos(P.angle),G.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),G.decay=P.decay,n.spot[_]=G;const $=P.shadow;if(P.map&&(n.spotLightMap[R]=P.map,R++,$.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[_]=$.matrix,P.castShadow){const B=e.get(P);B.shadowIntensity=$.intensity,B.shadowBias=$.bias,B.shadowNormalBias=$.normalBias,B.shadowRadius=$.radius,B.shadowMapSize=$.mapSize,n.spotShadow[_]=B,n.spotShadowMap[_]=q,x++}_++}else if(P.isRectAreaLight){const G=t.get(P);G.color.copy(k).multiplyScalar(N),G.halfWidth.set(P.width*.5,0,0),G.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=G,m++}else if(P.isPointLight){const G=t.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),G.distance=P.distance,G.decay=P.decay,P.castShadow){const $=P.shadow,B=e.get(P);B.shadowIntensity=$.intensity,B.shadowBias=$.bias,B.shadowNormalBias=$.normalBias,B.shadowRadius=$.radius,B.shadowMapSize=$.mapSize,B.shadowCameraNear=$.camera.near,B.shadowCameraFar=$.camera.far,n.pointShadow[g]=B,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=P.shadow.matrix,S++}n.point[g]=G,g++}else if(P.isHemisphereLight){const G=t.get(P);G.skyColor.copy(P.color).multiplyScalar(N),G.groundColor.copy(P.groundColor).multiplyScalar(N),n.hemi[p]=G,p++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=at.LTC_FLOAT_1,n.rectAreaLTC2=at.LTC_FLOAT_2):(n.rectAreaLTC1=at.LTC_HALF_1,n.rectAreaLTC2=at.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const C=n.hash;(C.directionalLength!==d||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==v||C.numPointShadows!==S||C.numSpotShadows!==x||C.numSpotMaps!==R||C.numLightProbes!==T)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=x+R-A,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=T,C.directionalLength=d,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=v,C.numPointShadows=S,C.numSpotShadows=x,C.numSpotMaps=R,C.numLightProbes=T,n.version=u0++)}function l(c,h){let u=0,f=0,d=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,v=c.length;p<v;p++){const S=c[p];if(S.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),u++}else if(S.isSpotLight){const x=n.spot[d];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),d++}else if(S.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),a.identity(),s.copy(S.matrixWorld),s.premultiply(m),a.extractRotation(s),x.halfWidth.set(S.width*.5,0,0),x.halfHeight.set(0,S.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(S.isPointLight){const x=n.point[f];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),f++}else if(S.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(S.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function lh(r){const t=new d0(r),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function p0(r){let t=new WeakMap;function e(i,s=0){const a=t.get(i);let o;return a===void 0?(o=new lh(r),t.set(i,[o])):s>=a.length?(o=new lh(r),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class m0 extends Es{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=cd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class _0 extends Es{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const g0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,x0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function v0(r,t,e){let n=new au;const i=new Qt,s=new Qt,a=new ve,o=new m0({depthPacking:hd}),l=new _0,c={},h=e.maxTextureSize,u={[gi]:He,[He]:gi,[Xn]:Xn},f=new xi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Qt},radius:{value:4}},vertexShader:g0,fragmentShader:x0}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new mn;g.setAttribute("position",new An(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ze(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nh;let p=this.type;this.render=function(A,T,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const M=r.getRenderTarget(),y=r.getActiveCubeFace(),P=r.getActiveMipmapLevel(),k=r.state;k.setBlending(di),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const N=p!==Hn&&this.type===Hn,W=p===Hn&&this.type!==Hn;for(let q=0,G=A.length;q<G;q++){const $=A[q],B=$.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);const rt=B.getFrameExtents();if(i.multiply(rt),s.copy(B.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/rt.x),i.x=s.x*rt.x,B.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/rt.y),i.y=s.y*rt.y,B.mapSize.y=s.y)),B.map===null||N===!0||W===!0){const gt=this.type!==Hn?{minFilter:Tn,magFilter:Tn}:{};B.map!==null&&B.map.dispose(),B.map=new Ki(i.x,i.y,gt),B.map.texture.name=$.name+".shadowMap",B.camera.updateProjectionMatrix()}r.setRenderTarget(B.map),r.clear();const st=B.getViewportCount();for(let gt=0;gt<st;gt++){const J=B.getViewport(gt);a.set(s.x*J.x,s.y*J.y,s.x*J.z,s.y*J.w),k.viewport(a),B.updateMatrices($,gt),n=B.getFrustum(),x(T,C,B.camera,$,this.type)}B.isPointLightShadow!==!0&&this.type===Hn&&v(B,C),B.needsUpdate=!1}p=this.type,m.needsUpdate=!1,r.setRenderTarget(M,y,P)};function v(A,T){const C=t.update(_);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Ki(i.x,i.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,r.setRenderTarget(A.mapPass),r.clear(),r.renderBufferDirect(T,null,C,f,_,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,r.setRenderTarget(A.map),r.clear(),r.renderBufferDirect(T,null,C,d,_,null)}function S(A,T,C,M){let y=null;const P=C.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)y=P;else if(y=C.isPointLight===!0?l:o,r.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const k=y.uuid,N=T.uuid;let W=c[k];W===void 0&&(W={},c[k]=W);let q=W[N];q===void 0&&(q=y.clone(),W[N]=q,T.addEventListener("dispose",R)),y=q}if(y.visible=T.visible,y.wireframe=T.wireframe,M===Hn?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:u[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const k=r.properties.get(y);k.light=C}return y}function x(A,T,C,M,y){if(A.visible===!1)return;if(A.layers.test(T.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&y===Hn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,A.matrixWorld);const N=t.update(A),W=A.material;if(Array.isArray(W)){const q=N.groups;for(let G=0,$=q.length;G<$;G++){const B=q[G],rt=W[B.materialIndex];if(rt&&rt.visible){const st=S(A,rt,M,y);A.onBeforeShadow(r,A,T,C,N,st,B),r.renderBufferDirect(C,null,N,st,A,B),A.onAfterShadow(r,A,T,C,N,st,B)}}}else if(W.visible){const q=S(A,W,M,y);A.onBeforeShadow(r,A,T,C,N,q,null),r.renderBufferDirect(C,null,N,q,A,null),A.onAfterShadow(r,A,T,C,N,q,null)}}const k=A.children;for(let N=0,W=k.length;N<W;N++)x(k[N],T,C,M,y)}function R(A){A.target.removeEventListener("dispose",R);for(const C in c){const M=c[C],y=A.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}const M0={[bo]:Eo,[To]:Ro,[Ao]:Co,[Tr]:wo,[Eo]:bo,[Ro]:To,[Co]:Ao,[wo]:Tr};function y0(r,t){function e(){let D=!1;const ot=new ve;let X=null;const K=new ve(0,0,0,0);return{setMask:function(ut){X!==ut&&!D&&(r.colorMask(ut,ut,ut,ut),X=ut)},setLocked:function(ut){D=ut},setClear:function(ut,ct,It,me,Ce){Ce===!0&&(ut*=me,ct*=me,It*=me),ot.set(ut,ct,It,me),K.equals(ot)===!1&&(r.clearColor(ut,ct,It,me),K.copy(ot))},reset:function(){D=!1,X=null,K.set(-1,0,0,0)}}}function n(){let D=!1,ot=!1,X=null,K=null,ut=null;return{setReversed:function(ct){if(ot!==ct){const It=t.get("EXT_clip_control");ot?It.clipControlEXT(It.LOWER_LEFT_EXT,It.ZERO_TO_ONE_EXT):It.clipControlEXT(It.LOWER_LEFT_EXT,It.NEGATIVE_ONE_TO_ONE_EXT);const me=ut;ut=null,this.setClear(me)}ot=ct},getReversed:function(){return ot},setTest:function(ct){ct?Z(r.DEPTH_TEST):bt(r.DEPTH_TEST)},setMask:function(ct){X!==ct&&!D&&(r.depthMask(ct),X=ct)},setFunc:function(ct){if(ot&&(ct=M0[ct]),K!==ct){switch(ct){case bo:r.depthFunc(r.NEVER);break;case Eo:r.depthFunc(r.ALWAYS);break;case To:r.depthFunc(r.LESS);break;case Tr:r.depthFunc(r.LEQUAL);break;case Ao:r.depthFunc(r.EQUAL);break;case wo:r.depthFunc(r.GEQUAL);break;case Ro:r.depthFunc(r.GREATER);break;case Co:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}K=ct}},setLocked:function(ct){D=ct},setClear:function(ct){ut!==ct&&(ot&&(ct=1-ct),r.clearDepth(ct),ut=ct)},reset:function(){D=!1,X=null,K=null,ut=null,ot=!1}}}function i(){let D=!1,ot=null,X=null,K=null,ut=null,ct=null,It=null,me=null,Ce=null;return{setTest:function(te){D||(te?Z(r.STENCIL_TEST):bt(r.STENCIL_TEST))},setMask:function(te){ot!==te&&!D&&(r.stencilMask(te),ot=te)},setFunc:function(te,_n,Nn){(X!==te||K!==_n||ut!==Nn)&&(r.stencilFunc(te,_n,Nn),X=te,K=_n,ut=Nn)},setOp:function(te,_n,Nn){(ct!==te||It!==_n||me!==Nn)&&(r.stencilOp(te,_n,Nn),ct=te,It=_n,me=Nn)},setLocked:function(te){D=te},setClear:function(te){Ce!==te&&(r.clearStencil(te),Ce=te)},reset:function(){D=!1,ot=null,X=null,K=null,ut=null,ct=null,It=null,me=null,Ce=null}}}const s=new e,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,d=[],g=null,_=!1,m=null,p=null,v=null,S=null,x=null,R=null,A=null,T=new Jt(0,0,0),C=0,M=!1,y=null,P=null,k=null,N=null,W=null;const q=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,$=0;const B=r.getParameter(r.VERSION);B.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(B)[1]),G=$>=1):B.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),G=$>=2);let rt=null,st={};const gt=r.getParameter(r.SCISSOR_BOX),J=r.getParameter(r.VIEWPORT),vt=new ve().fromArray(gt),H=new ve().fromArray(J);function et(D,ot,X,K){const ut=new Uint8Array(4),ct=r.createTexture();r.bindTexture(D,ct),r.texParameteri(D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(D,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let It=0;It<X;It++)D===r.TEXTURE_3D||D===r.TEXTURE_2D_ARRAY?r.texImage3D(ot,0,r.RGBA,1,1,K,0,r.RGBA,r.UNSIGNED_BYTE,ut):r.texImage2D(ot+It,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ut);return ct}const pt={};pt[r.TEXTURE_2D]=et(r.TEXTURE_2D,r.TEXTURE_2D,1),pt[r.TEXTURE_CUBE_MAP]=et(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[r.TEXTURE_2D_ARRAY]=et(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),pt[r.TEXTURE_3D]=et(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Z(r.DEPTH_TEST),a.setFunc(Tr),Vt(!1),Ht(fc),Z(r.CULL_FACE),U(di);function Z(D){h[D]!==!0&&(r.enable(D),h[D]=!0)}function bt(D){h[D]!==!1&&(r.disable(D),h[D]=!1)}function xt(D,ot){return u[D]!==ot?(r.bindFramebuffer(D,ot),u[D]=ot,D===r.DRAW_FRAMEBUFFER&&(u[r.FRAMEBUFFER]=ot),D===r.FRAMEBUFFER&&(u[r.DRAW_FRAMEBUFFER]=ot),!0):!1}function At(D,ot){let X=d,K=!1;if(D){X=f.get(ot),X===void 0&&(X=[],f.set(ot,X));const ut=D.textures;if(X.length!==ut.length||X[0]!==r.COLOR_ATTACHMENT0){for(let ct=0,It=ut.length;ct<It;ct++)X[ct]=r.COLOR_ATTACHMENT0+ct;X.length=ut.length,K=!0}}else X[0]!==r.BACK&&(X[0]=r.BACK,K=!0);K&&r.drawBuffers(X)}function ie(D){return g!==D?(r.useProgram(D),g=D,!0):!1}const Wt={[Oi]:r.FUNC_ADD,[Ff]:r.FUNC_SUBTRACT,[Of]:r.FUNC_REVERSE_SUBTRACT};Wt[kf]=r.MIN,Wt[Bf]=r.MAX;const ge={[zf]:r.ZERO,[Vf]:r.ONE,[Hf]:r.SRC_COLOR,[yo]:r.SRC_ALPHA,[Yf]:r.SRC_ALPHA_SATURATE,[qf]:r.DST_COLOR,[Wf]:r.DST_ALPHA,[Gf]:r.ONE_MINUS_SRC_COLOR,[So]:r.ONE_MINUS_SRC_ALPHA,[$f]:r.ONE_MINUS_DST_COLOR,[Xf]:r.ONE_MINUS_DST_ALPHA,[jf]:r.CONSTANT_COLOR,[Kf]:r.ONE_MINUS_CONSTANT_COLOR,[Zf]:r.CONSTANT_ALPHA,[Jf]:r.ONE_MINUS_CONSTANT_ALPHA};function U(D,ot,X,K,ut,ct,It,me,Ce,te){if(D===di){_===!0&&(bt(r.BLEND),_=!1);return}if(_===!1&&(Z(r.BLEND),_=!0),D!==Nf){if(D!==m||te!==M){if((p!==Oi||x!==Oi)&&(r.blendEquation(r.FUNC_ADD),p=Oi,x=Oi),te)switch(D){case vr:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case dc:r.blendFunc(r.ONE,r.ONE);break;case pc:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case mc:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case vr:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case dc:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case pc:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case mc:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}v=null,S=null,R=null,A=null,T.set(0,0,0),C=0,m=D,M=te}return}ut=ut||ot,ct=ct||X,It=It||K,(ot!==p||ut!==x)&&(r.blendEquationSeparate(Wt[ot],Wt[ut]),p=ot,x=ut),(X!==v||K!==S||ct!==R||It!==A)&&(r.blendFuncSeparate(ge[X],ge[K],ge[ct],ge[It]),v=X,S=K,R=ct,A=It),(me.equals(T)===!1||Ce!==C)&&(r.blendColor(me.r,me.g,me.b,Ce),T.copy(me),C=Ce),m=D,M=!1}function on(D,ot){D.side===Xn?bt(r.CULL_FACE):Z(r.CULL_FACE);let X=D.side===He;ot&&(X=!X),Vt(X),D.blending===vr&&D.transparent===!1?U(di):U(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const K=D.stencilWrite;o.setTest(K),K&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),oe(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Z(r.SAMPLE_ALPHA_TO_COVERAGE):bt(r.SAMPLE_ALPHA_TO_COVERAGE)}function Vt(D){y!==D&&(D?r.frontFace(r.CW):r.frontFace(r.CCW),y=D)}function Ht(D){D!==Lf?(Z(r.CULL_FACE),D!==P&&(D===fc?r.cullFace(r.BACK):D===If?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):bt(r.CULL_FACE),P=D}function Rt(D){D!==k&&(G&&r.lineWidth(D),k=D)}function oe(D,ot,X){D?(Z(r.POLYGON_OFFSET_FILL),(N!==ot||W!==X)&&(r.polygonOffset(ot,X),N=ot,W=X)):bt(r.POLYGON_OFFSET_FILL)}function wt(D){D?Z(r.SCISSOR_TEST):bt(r.SCISSOR_TEST)}function w(D){D===void 0&&(D=r.TEXTURE0+q-1),rt!==D&&(r.activeTexture(D),rt=D)}function b(D,ot,X){X===void 0&&(rt===null?X=r.TEXTURE0+q-1:X=rt);let K=st[X];K===void 0&&(K={type:void 0,texture:void 0},st[X]=K),(K.type!==D||K.texture!==ot)&&(rt!==X&&(r.activeTexture(X),rt=X),r.bindTexture(D,ot||pt[D]),K.type=D,K.texture=ot)}function O(){const D=st[rt];D!==void 0&&D.type!==void 0&&(r.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function j(){try{r.compressedTexImage2D.apply(r,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function tt(){try{r.compressedTexImage3D.apply(r,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Y(){try{r.texSubImage2D.apply(r,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Et(){try{r.texSubImage3D.apply(r,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function lt(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function dt(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Xt(){try{r.texStorage2D.apply(r,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function nt(){try{r.texStorage3D.apply(r,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function mt(){try{r.texImage2D.apply(r,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ct(){try{r.texImage3D.apply(r,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Pt(D){vt.equals(D)===!1&&(r.scissor(D.x,D.y,D.z,D.w),vt.copy(D))}function _t(D){H.equals(D)===!1&&(r.viewport(D.x,D.y,D.z,D.w),H.copy(D))}function Gt(D,ot){let X=c.get(ot);X===void 0&&(X=new WeakMap,c.set(ot,X));let K=X.get(D);K===void 0&&(K=r.getUniformBlockIndex(ot,D.name),X.set(D,K))}function Ot(D,ot){const K=c.get(ot).get(D);l.get(ot)!==K&&(r.uniformBlockBinding(ot,K,D.__bindingPointIndex),l.set(ot,K))}function se(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},rt=null,st={},u={},f=new WeakMap,d=[],g=null,_=!1,m=null,p=null,v=null,S=null,x=null,R=null,A=null,T=new Jt(0,0,0),C=0,M=!1,y=null,P=null,k=null,N=null,W=null,vt.set(0,0,r.canvas.width,r.canvas.height),H.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:Z,disable:bt,bindFramebuffer:xt,drawBuffers:At,useProgram:ie,setBlending:U,setMaterial:on,setFlipSided:Vt,setCullFace:Ht,setLineWidth:Rt,setPolygonOffset:oe,setScissorTest:wt,activeTexture:w,bindTexture:b,unbindTexture:O,compressedTexImage2D:j,compressedTexImage3D:tt,texImage2D:mt,texImage3D:Ct,updateUBOMapping:Gt,uniformBlockBinding:Ot,texStorage2D:Xt,texStorage3D:nt,texSubImage2D:Y,texSubImage3D:Et,compressedTexSubImage2D:lt,compressedTexSubImage3D:dt,scissor:Pt,viewport:_t,reset:se}}function ch(r,t,e,n){const i=S0(n);switch(e){case Vh:return r*t;case Gh:return r*t;case Wh:return r*t*2;case Xh:return r*t/i.components*i.byteLength;case Al:return r*t/i.components*i.byteLength;case qh:return r*t*2/i.components*i.byteLength;case wl:return r*t*2/i.components*i.byteLength;case Hh:return r*t*3/i.components*i.byteLength;case En:return r*t*4/i.components*i.byteLength;case Rl:return r*t*4/i.components*i.byteLength;case ta:case ea:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case na:case ia:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case No:case Oo:return Math.max(r,16)*Math.max(t,8)/4;case Uo:case Fo:return Math.max(r,8)*Math.max(t,8)/2;case ko:case Bo:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case zo:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Vo:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Ho:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case Go:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case Wo:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case Xo:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case qo:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case $o:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case Yo:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case jo:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case Ko:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case Zo:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case Jo:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case Qo:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case tl:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case ra:case el:case nl:return Math.ceil(r/4)*Math.ceil(t/4)*16;case $h:case il:return Math.ceil(r/4)*Math.ceil(t/4)*8;case rl:case sl:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function S0(r){switch(r){case jn:case kh:return{byteLength:1,components:1};case os:case Bh:case Ms:return{byteLength:2,components:1};case El:case Tl:return{byteLength:2,components:4};case ji:case bl:case qn:return{byteLength:4,components:1};case zh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}function b0(r,t,e,n,i,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Qt,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,b){return d?new OffscreenCanvas(w,b):ua("canvas")}function _(w,b,O){let j=1;const tt=wt(w);if((tt.width>O||tt.height>O)&&(j=O/Math.max(tt.width,tt.height)),j<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const Y=Math.floor(j*tt.width),Et=Math.floor(j*tt.height);u===void 0&&(u=g(Y,Et));const lt=b?g(Y,Et):u;return lt.width=Y,lt.height=Et,lt.getContext("2d").drawImage(w,0,0,Y,Et),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+Y+"x"+Et+")."),lt}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),w;return w}function m(w){return w.generateMipmaps}function p(w){r.generateMipmap(w)}function v(w){return w.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?r.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function S(w,b,O,j,tt=!1){if(w!==null){if(r[w]!==void 0)return r[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Y=b;if(b===r.RED&&(O===r.FLOAT&&(Y=r.R32F),O===r.HALF_FLOAT&&(Y=r.R16F),O===r.UNSIGNED_BYTE&&(Y=r.R8)),b===r.RED_INTEGER&&(O===r.UNSIGNED_BYTE&&(Y=r.R8UI),O===r.UNSIGNED_SHORT&&(Y=r.R16UI),O===r.UNSIGNED_INT&&(Y=r.R32UI),O===r.BYTE&&(Y=r.R8I),O===r.SHORT&&(Y=r.R16I),O===r.INT&&(Y=r.R32I)),b===r.RG&&(O===r.FLOAT&&(Y=r.RG32F),O===r.HALF_FLOAT&&(Y=r.RG16F),O===r.UNSIGNED_BYTE&&(Y=r.RG8)),b===r.RG_INTEGER&&(O===r.UNSIGNED_BYTE&&(Y=r.RG8UI),O===r.UNSIGNED_SHORT&&(Y=r.RG16UI),O===r.UNSIGNED_INT&&(Y=r.RG32UI),O===r.BYTE&&(Y=r.RG8I),O===r.SHORT&&(Y=r.RG16I),O===r.INT&&(Y=r.RG32I)),b===r.RGB_INTEGER&&(O===r.UNSIGNED_BYTE&&(Y=r.RGB8UI),O===r.UNSIGNED_SHORT&&(Y=r.RGB16UI),O===r.UNSIGNED_INT&&(Y=r.RGB32UI),O===r.BYTE&&(Y=r.RGB8I),O===r.SHORT&&(Y=r.RGB16I),O===r.INT&&(Y=r.RGB32I)),b===r.RGBA_INTEGER&&(O===r.UNSIGNED_BYTE&&(Y=r.RGBA8UI),O===r.UNSIGNED_SHORT&&(Y=r.RGBA16UI),O===r.UNSIGNED_INT&&(Y=r.RGBA32UI),O===r.BYTE&&(Y=r.RGBA8I),O===r.SHORT&&(Y=r.RGBA16I),O===r.INT&&(Y=r.RGBA32I)),b===r.RGB&&O===r.UNSIGNED_INT_5_9_9_9_REV&&(Y=r.RGB9_E5),b===r.RGBA){const Et=tt?ba:$t.getTransfer(j);O===r.FLOAT&&(Y=r.RGBA32F),O===r.HALF_FLOAT&&(Y=r.RGBA16F),O===r.UNSIGNED_BYTE&&(Y=Et===ee?r.SRGB8_ALPHA8:r.RGBA8),O===r.UNSIGNED_SHORT_4_4_4_4&&(Y=r.RGBA4),O===r.UNSIGNED_SHORT_5_5_5_1&&(Y=r.RGB5_A1)}return(Y===r.R16F||Y===r.R32F||Y===r.RG16F||Y===r.RG32F||Y===r.RGBA16F||Y===r.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function x(w,b){let O;return w?b===null||b===ji||b===Rr?O=r.DEPTH24_STENCIL8:b===qn?O=r.DEPTH32F_STENCIL8:b===os&&(O=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===ji||b===Rr?O=r.DEPTH_COMPONENT24:b===qn?O=r.DEPTH_COMPONENT32F:b===os&&(O=r.DEPTH_COMPONENT16),O}function R(w,b){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==Tn&&w.minFilter!==Ln?Math.log2(Math.max(b.width,b.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?b.mipmaps.length:1}function A(w){const b=w.target;b.removeEventListener("dispose",A),C(b),b.isVideoTexture&&h.delete(b)}function T(w){const b=w.target;b.removeEventListener("dispose",T),y(b)}function C(w){const b=n.get(w);if(b.__webglInit===void 0)return;const O=w.source,j=f.get(O);if(j){const tt=j[b.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&M(w),Object.keys(j).length===0&&f.delete(O)}n.remove(w)}function M(w){const b=n.get(w);r.deleteTexture(b.__webglTexture);const O=w.source,j=f.get(O);delete j[b.__cacheKey],a.memory.textures--}function y(w){const b=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(b.__webglFramebuffer[j]))for(let tt=0;tt<b.__webglFramebuffer[j].length;tt++)r.deleteFramebuffer(b.__webglFramebuffer[j][tt]);else r.deleteFramebuffer(b.__webglFramebuffer[j]);b.__webglDepthbuffer&&r.deleteRenderbuffer(b.__webglDepthbuffer[j])}else{if(Array.isArray(b.__webglFramebuffer))for(let j=0;j<b.__webglFramebuffer.length;j++)r.deleteFramebuffer(b.__webglFramebuffer[j]);else r.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&r.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&r.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let j=0;j<b.__webglColorRenderbuffer.length;j++)b.__webglColorRenderbuffer[j]&&r.deleteRenderbuffer(b.__webglColorRenderbuffer[j]);b.__webglDepthRenderbuffer&&r.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const O=w.textures;for(let j=0,tt=O.length;j<tt;j++){const Y=n.get(O[j]);Y.__webglTexture&&(r.deleteTexture(Y.__webglTexture),a.memory.textures--),n.remove(O[j])}n.remove(w)}let P=0;function k(){P=0}function N(){const w=P;return w>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+i.maxTextures),P+=1,w}function W(w){const b=[];return b.push(w.wrapS),b.push(w.wrapT),b.push(w.wrapR||0),b.push(w.magFilter),b.push(w.minFilter),b.push(w.anisotropy),b.push(w.internalFormat),b.push(w.format),b.push(w.type),b.push(w.generateMipmaps),b.push(w.premultiplyAlpha),b.push(w.flipY),b.push(w.unpackAlignment),b.push(w.colorSpace),b.join()}function q(w,b){const O=n.get(w);if(w.isVideoTexture&&Rt(w),w.isRenderTargetTexture===!1&&w.version>0&&O.__version!==w.version){const j=w.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{H(O,w,b);return}}e.bindTexture(r.TEXTURE_2D,O.__webglTexture,r.TEXTURE0+b)}function G(w,b){const O=n.get(w);if(w.version>0&&O.__version!==w.version){H(O,w,b);return}e.bindTexture(r.TEXTURE_2D_ARRAY,O.__webglTexture,r.TEXTURE0+b)}function $(w,b){const O=n.get(w);if(w.version>0&&O.__version!==w.version){H(O,w,b);return}e.bindTexture(r.TEXTURE_3D,O.__webglTexture,r.TEXTURE0+b)}function B(w,b){const O=n.get(w);if(w.version>0&&O.__version!==w.version){et(O,w,b);return}e.bindTexture(r.TEXTURE_CUBE_MAP,O.__webglTexture,r.TEXTURE0+b)}const rt={[Lo]:r.REPEAT,[Vi]:r.CLAMP_TO_EDGE,[Io]:r.MIRRORED_REPEAT},st={[Tn]:r.NEAREST,[ld]:r.NEAREST_MIPMAP_NEAREST,[Cs]:r.NEAREST_MIPMAP_LINEAR,[Ln]:r.LINEAR,[La]:r.LINEAR_MIPMAP_NEAREST,[Hi]:r.LINEAR_MIPMAP_LINEAR},gt={[dd]:r.NEVER,[vd]:r.ALWAYS,[pd]:r.LESS,[Yh]:r.LEQUAL,[md]:r.EQUAL,[xd]:r.GEQUAL,[_d]:r.GREATER,[gd]:r.NOTEQUAL};function J(w,b){if(b.type===qn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===Ln||b.magFilter===La||b.magFilter===Cs||b.magFilter===Hi||b.minFilter===Ln||b.minFilter===La||b.minFilter===Cs||b.minFilter===Hi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(w,r.TEXTURE_WRAP_S,rt[b.wrapS]),r.texParameteri(w,r.TEXTURE_WRAP_T,rt[b.wrapT]),(w===r.TEXTURE_3D||w===r.TEXTURE_2D_ARRAY)&&r.texParameteri(w,r.TEXTURE_WRAP_R,rt[b.wrapR]),r.texParameteri(w,r.TEXTURE_MAG_FILTER,st[b.magFilter]),r.texParameteri(w,r.TEXTURE_MIN_FILTER,st[b.minFilter]),b.compareFunction&&(r.texParameteri(w,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(w,r.TEXTURE_COMPARE_FUNC,gt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Tn||b.minFilter!==Cs&&b.minFilter!==Hi||b.type===qn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");r.texParameterf(w,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,i.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function vt(w,b){let O=!1;w.__webglInit===void 0&&(w.__webglInit=!0,b.addEventListener("dispose",A));const j=b.source;let tt=f.get(j);tt===void 0&&(tt={},f.set(j,tt));const Y=W(b);if(Y!==w.__cacheKey){tt[Y]===void 0&&(tt[Y]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,O=!0),tt[Y].usedTimes++;const Et=tt[w.__cacheKey];Et!==void 0&&(tt[w.__cacheKey].usedTimes--,Et.usedTimes===0&&M(b)),w.__cacheKey=Y,w.__webglTexture=tt[Y].texture}return O}function H(w,b,O){let j=r.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(j=r.TEXTURE_2D_ARRAY),b.isData3DTexture&&(j=r.TEXTURE_3D);const tt=vt(w,b),Y=b.source;e.bindTexture(j,w.__webglTexture,r.TEXTURE0+O);const Et=n.get(Y);if(Y.version!==Et.__version||tt===!0){e.activeTexture(r.TEXTURE0+O);const lt=$t.getPrimaries($t.workingColorSpace),dt=b.colorSpace===li?null:$t.getPrimaries(b.colorSpace),Xt=b.colorSpace===li||lt===dt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,b.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,b.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);let nt=_(b.image,!1,i.maxTextureSize);nt=oe(b,nt);const mt=s.convert(b.format,b.colorSpace),Ct=s.convert(b.type);let Pt=S(b.internalFormat,mt,Ct,b.colorSpace,b.isVideoTexture);J(j,b);let _t;const Gt=b.mipmaps,Ot=b.isVideoTexture!==!0,se=Et.__version===void 0||tt===!0,D=Y.dataReady,ot=R(b,nt);if(b.isDepthTexture)Pt=x(b.format===Cr,b.type),se&&(Ot?e.texStorage2D(r.TEXTURE_2D,1,Pt,nt.width,nt.height):e.texImage2D(r.TEXTURE_2D,0,Pt,nt.width,nt.height,0,mt,Ct,null));else if(b.isDataTexture)if(Gt.length>0){Ot&&se&&e.texStorage2D(r.TEXTURE_2D,ot,Pt,Gt[0].width,Gt[0].height);for(let X=0,K=Gt.length;X<K;X++)_t=Gt[X],Ot?D&&e.texSubImage2D(r.TEXTURE_2D,X,0,0,_t.width,_t.height,mt,Ct,_t.data):e.texImage2D(r.TEXTURE_2D,X,Pt,_t.width,_t.height,0,mt,Ct,_t.data);b.generateMipmaps=!1}else Ot?(se&&e.texStorage2D(r.TEXTURE_2D,ot,Pt,nt.width,nt.height),D&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,nt.width,nt.height,mt,Ct,nt.data)):e.texImage2D(r.TEXTURE_2D,0,Pt,nt.width,nt.height,0,mt,Ct,nt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Ot&&se&&e.texStorage3D(r.TEXTURE_2D_ARRAY,ot,Pt,Gt[0].width,Gt[0].height,nt.depth);for(let X=0,K=Gt.length;X<K;X++)if(_t=Gt[X],b.format!==En)if(mt!==null)if(Ot){if(D)if(b.layerUpdates.size>0){const ut=ch(_t.width,_t.height,b.format,b.type);for(const ct of b.layerUpdates){const It=_t.data.subarray(ct*ut/_t.data.BYTES_PER_ELEMENT,(ct+1)*ut/_t.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,X,0,0,ct,_t.width,_t.height,1,mt,It)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,X,0,0,0,_t.width,_t.height,nt.depth,mt,_t.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,X,Pt,_t.width,_t.height,nt.depth,0,_t.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ot?D&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,X,0,0,0,_t.width,_t.height,nt.depth,mt,Ct,_t.data):e.texImage3D(r.TEXTURE_2D_ARRAY,X,Pt,_t.width,_t.height,nt.depth,0,mt,Ct,_t.data)}else{Ot&&se&&e.texStorage2D(r.TEXTURE_2D,ot,Pt,Gt[0].width,Gt[0].height);for(let X=0,K=Gt.length;X<K;X++)_t=Gt[X],b.format!==En?mt!==null?Ot?D&&e.compressedTexSubImage2D(r.TEXTURE_2D,X,0,0,_t.width,_t.height,mt,_t.data):e.compressedTexImage2D(r.TEXTURE_2D,X,Pt,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ot?D&&e.texSubImage2D(r.TEXTURE_2D,X,0,0,_t.width,_t.height,mt,Ct,_t.data):e.texImage2D(r.TEXTURE_2D,X,Pt,_t.width,_t.height,0,mt,Ct,_t.data)}else if(b.isDataArrayTexture)if(Ot){if(se&&e.texStorage3D(r.TEXTURE_2D_ARRAY,ot,Pt,nt.width,nt.height,nt.depth),D)if(b.layerUpdates.size>0){const X=ch(nt.width,nt.height,b.format,b.type);for(const K of b.layerUpdates){const ut=nt.data.subarray(K*X/nt.data.BYTES_PER_ELEMENT,(K+1)*X/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,K,nt.width,nt.height,1,mt,Ct,ut)}b.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,mt,Ct,nt.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,Pt,nt.width,nt.height,nt.depth,0,mt,Ct,nt.data);else if(b.isData3DTexture)Ot?(se&&e.texStorage3D(r.TEXTURE_3D,ot,Pt,nt.width,nt.height,nt.depth),D&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,mt,Ct,nt.data)):e.texImage3D(r.TEXTURE_3D,0,Pt,nt.width,nt.height,nt.depth,0,mt,Ct,nt.data);else if(b.isFramebufferTexture){if(se)if(Ot)e.texStorage2D(r.TEXTURE_2D,ot,Pt,nt.width,nt.height);else{let X=nt.width,K=nt.height;for(let ut=0;ut<ot;ut++)e.texImage2D(r.TEXTURE_2D,ut,Pt,X,K,0,mt,Ct,null),X>>=1,K>>=1}}else if(Gt.length>0){if(Ot&&se){const X=wt(Gt[0]);e.texStorage2D(r.TEXTURE_2D,ot,Pt,X.width,X.height)}for(let X=0,K=Gt.length;X<K;X++)_t=Gt[X],Ot?D&&e.texSubImage2D(r.TEXTURE_2D,X,0,0,mt,Ct,_t):e.texImage2D(r.TEXTURE_2D,X,Pt,mt,Ct,_t);b.generateMipmaps=!1}else if(Ot){if(se){const X=wt(nt);e.texStorage2D(r.TEXTURE_2D,ot,Pt,X.width,X.height)}D&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,mt,Ct,nt)}else e.texImage2D(r.TEXTURE_2D,0,Pt,mt,Ct,nt);m(b)&&p(j),Et.__version=Y.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function et(w,b,O){if(b.image.length!==6)return;const j=vt(w,b),tt=b.source;e.bindTexture(r.TEXTURE_CUBE_MAP,w.__webglTexture,r.TEXTURE0+O);const Y=n.get(tt);if(tt.version!==Y.__version||j===!0){e.activeTexture(r.TEXTURE0+O);const Et=$t.getPrimaries($t.workingColorSpace),lt=b.colorSpace===li?null:$t.getPrimaries(b.colorSpace),dt=b.colorSpace===li||Et===lt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,b.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,b.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const Xt=b.isCompressedTexture||b.image[0].isCompressedTexture,nt=b.image[0]&&b.image[0].isDataTexture,mt=[];for(let K=0;K<6;K++)!Xt&&!nt?mt[K]=_(b.image[K],!0,i.maxCubemapSize):mt[K]=nt?b.image[K].image:b.image[K],mt[K]=oe(b,mt[K]);const Ct=mt[0],Pt=s.convert(b.format,b.colorSpace),_t=s.convert(b.type),Gt=S(b.internalFormat,Pt,_t,b.colorSpace),Ot=b.isVideoTexture!==!0,se=Y.__version===void 0||j===!0,D=tt.dataReady;let ot=R(b,Ct);J(r.TEXTURE_CUBE_MAP,b);let X;if(Xt){Ot&&se&&e.texStorage2D(r.TEXTURE_CUBE_MAP,ot,Gt,Ct.width,Ct.height);for(let K=0;K<6;K++){X=mt[K].mipmaps;for(let ut=0;ut<X.length;ut++){const ct=X[ut];b.format!==En?Pt!==null?Ot?D&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut,0,0,ct.width,ct.height,Pt,ct.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut,Gt,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?D&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut,0,0,ct.width,ct.height,Pt,_t,ct.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut,Gt,ct.width,ct.height,0,Pt,_t,ct.data)}}}else{if(X=b.mipmaps,Ot&&se){X.length>0&&ot++;const K=wt(mt[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,ot,Gt,K.width,K.height)}for(let K=0;K<6;K++)if(nt){Ot?D&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,mt[K].width,mt[K].height,Pt,_t,mt[K].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Gt,mt[K].width,mt[K].height,0,Pt,_t,mt[K].data);for(let ut=0;ut<X.length;ut++){const It=X[ut].image[K].image;Ot?D&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut+1,0,0,It.width,It.height,Pt,_t,It.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut+1,Gt,It.width,It.height,0,Pt,_t,It.data)}}else{Ot?D&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Pt,_t,mt[K]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Gt,Pt,_t,mt[K]);for(let ut=0;ut<X.length;ut++){const ct=X[ut];Ot?D&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut+1,0,0,Pt,_t,ct.image[K]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut+1,Gt,Pt,_t,ct.image[K])}}}m(b)&&p(r.TEXTURE_CUBE_MAP),Y.__version=tt.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function pt(w,b,O,j,tt,Y){const Et=s.convert(O.format,O.colorSpace),lt=s.convert(O.type),dt=S(O.internalFormat,Et,lt,O.colorSpace),Xt=n.get(b),nt=n.get(O);if(nt.__renderTarget=b,!Xt.__hasExternalTextures){const mt=Math.max(1,b.width>>Y),Ct=Math.max(1,b.height>>Y);tt===r.TEXTURE_3D||tt===r.TEXTURE_2D_ARRAY?e.texImage3D(tt,Y,dt,mt,Ct,b.depth,0,Et,lt,null):e.texImage2D(tt,Y,dt,mt,Ct,0,Et,lt,null)}e.bindFramebuffer(r.FRAMEBUFFER,w),Ht(b)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,j,tt,nt.__webglTexture,0,Vt(b)):(tt===r.TEXTURE_2D||tt>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,j,tt,nt.__webglTexture,Y),e.bindFramebuffer(r.FRAMEBUFFER,null)}function Z(w,b,O){if(r.bindRenderbuffer(r.RENDERBUFFER,w),b.depthBuffer){const j=b.depthTexture,tt=j&&j.isDepthTexture?j.type:null,Y=x(b.stencilBuffer,tt),Et=b.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,lt=Vt(b);Ht(b)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,lt,Y,b.width,b.height):O?r.renderbufferStorageMultisample(r.RENDERBUFFER,lt,Y,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,Y,b.width,b.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Et,r.RENDERBUFFER,w)}else{const j=b.textures;for(let tt=0;tt<j.length;tt++){const Y=j[tt],Et=s.convert(Y.format,Y.colorSpace),lt=s.convert(Y.type),dt=S(Y.internalFormat,Et,lt,Y.colorSpace),Xt=Vt(b);O&&Ht(b)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Xt,dt,b.width,b.height):Ht(b)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Xt,dt,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,dt,b.width,b.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function bt(w,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(r.FRAMEBUFFER,w),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=n.get(b.depthTexture);j.__renderTarget=b,(!j.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),q(b.depthTexture,0);const tt=j.__webglTexture,Y=Vt(b);if(b.depthTexture.format===Mr)Ht(b)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,tt,0,Y):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,tt,0);else if(b.depthTexture.format===Cr)Ht(b)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,tt,0,Y):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function xt(w){const b=n.get(w),O=w.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==w.depthTexture){const j=w.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),j){const tt=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,j.removeEventListener("dispose",tt)};j.addEventListener("dispose",tt),b.__depthDisposeCallback=tt}b.__boundDepthTexture=j}if(w.depthTexture&&!b.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");bt(b.__webglFramebuffer,w)}else if(O){b.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(e.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer[j]),b.__webglDepthbuffer[j]===void 0)b.__webglDepthbuffer[j]=r.createRenderbuffer(),Z(b.__webglDepthbuffer[j],w,!1);else{const tt=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Y=b.__webglDepthbuffer[j];r.bindRenderbuffer(r.RENDERBUFFER,Y),r.framebufferRenderbuffer(r.FRAMEBUFFER,tt,r.RENDERBUFFER,Y)}}else if(e.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=r.createRenderbuffer(),Z(b.__webglDepthbuffer,w,!1);else{const j=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,tt=b.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,tt),r.framebufferRenderbuffer(r.FRAMEBUFFER,j,r.RENDERBUFFER,tt)}e.bindFramebuffer(r.FRAMEBUFFER,null)}function At(w,b,O){const j=n.get(w);b!==void 0&&pt(j.__webglFramebuffer,w,w.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),O!==void 0&&xt(w)}function ie(w){const b=w.texture,O=n.get(w),j=n.get(b);w.addEventListener("dispose",T);const tt=w.textures,Y=w.isWebGLCubeRenderTarget===!0,Et=tt.length>1;if(Et||(j.__webglTexture===void 0&&(j.__webglTexture=r.createTexture()),j.__version=b.version,a.memory.textures++),Y){O.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer[lt]=[];for(let dt=0;dt<b.mipmaps.length;dt++)O.__webglFramebuffer[lt][dt]=r.createFramebuffer()}else O.__webglFramebuffer[lt]=r.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer=[];for(let lt=0;lt<b.mipmaps.length;lt++)O.__webglFramebuffer[lt]=r.createFramebuffer()}else O.__webglFramebuffer=r.createFramebuffer();if(Et)for(let lt=0,dt=tt.length;lt<dt;lt++){const Xt=n.get(tt[lt]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=r.createTexture(),a.memory.textures++)}if(w.samples>0&&Ht(w)===!1){O.__webglMultisampledFramebuffer=r.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let lt=0;lt<tt.length;lt++){const dt=tt[lt];O.__webglColorRenderbuffer[lt]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,O.__webglColorRenderbuffer[lt]);const Xt=s.convert(dt.format,dt.colorSpace),nt=s.convert(dt.type),mt=S(dt.internalFormat,Xt,nt,dt.colorSpace,w.isXRRenderTarget===!0),Ct=Vt(w);r.renderbufferStorageMultisample(r.RENDERBUFFER,Ct,mt,w.width,w.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+lt,r.RENDERBUFFER,O.__webglColorRenderbuffer[lt])}r.bindRenderbuffer(r.RENDERBUFFER,null),w.depthBuffer&&(O.__webglDepthRenderbuffer=r.createRenderbuffer(),Z(O.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(Y){e.bindTexture(r.TEXTURE_CUBE_MAP,j.__webglTexture),J(r.TEXTURE_CUBE_MAP,b);for(let lt=0;lt<6;lt++)if(b.mipmaps&&b.mipmaps.length>0)for(let dt=0;dt<b.mipmaps.length;dt++)pt(O.__webglFramebuffer[lt][dt],w,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+lt,dt);else pt(O.__webglFramebuffer[lt],w,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);m(b)&&p(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Et){for(let lt=0,dt=tt.length;lt<dt;lt++){const Xt=tt[lt],nt=n.get(Xt);e.bindTexture(r.TEXTURE_2D,nt.__webglTexture),J(r.TEXTURE_2D,Xt),pt(O.__webglFramebuffer,w,Xt,r.COLOR_ATTACHMENT0+lt,r.TEXTURE_2D,0),m(Xt)&&p(r.TEXTURE_2D)}e.unbindTexture()}else{let lt=r.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(lt=w.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(lt,j.__webglTexture),J(lt,b),b.mipmaps&&b.mipmaps.length>0)for(let dt=0;dt<b.mipmaps.length;dt++)pt(O.__webglFramebuffer[dt],w,b,r.COLOR_ATTACHMENT0,lt,dt);else pt(O.__webglFramebuffer,w,b,r.COLOR_ATTACHMENT0,lt,0);m(b)&&p(lt),e.unbindTexture()}w.depthBuffer&&xt(w)}function Wt(w){const b=w.textures;for(let O=0,j=b.length;O<j;O++){const tt=b[O];if(m(tt)){const Y=v(w),Et=n.get(tt).__webglTexture;e.bindTexture(Y,Et),p(Y),e.unbindTexture()}}}const ge=[],U=[];function on(w){if(w.samples>0){if(Ht(w)===!1){const b=w.textures,O=w.width,j=w.height;let tt=r.COLOR_BUFFER_BIT;const Y=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Et=n.get(w),lt=b.length>1;if(lt)for(let dt=0;dt<b.length;dt++)e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+dt,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+dt,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,Et.__webglMultisampledFramebuffer),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,Et.__webglFramebuffer);for(let dt=0;dt<b.length;dt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(tt|=r.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(tt|=r.STENCIL_BUFFER_BIT)),lt){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Et.__webglColorRenderbuffer[dt]);const Xt=n.get(b[dt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Xt,0)}r.blitFramebuffer(0,0,O,j,0,0,O,j,tt,r.NEAREST),l===!0&&(ge.length=0,U.length=0,ge.push(r.COLOR_ATTACHMENT0+dt),w.depthBuffer&&w.resolveDepthBuffer===!1&&(ge.push(Y),U.push(Y),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,U)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ge))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),lt)for(let dt=0;dt<b.length;dt++){e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+dt,r.RENDERBUFFER,Et.__webglColorRenderbuffer[dt]);const Xt=n.get(b[dt]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+dt,r.TEXTURE_2D,Xt,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,Et.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const b=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[b])}}}function Vt(w){return Math.min(i.maxSamples,w.samples)}function Ht(w){const b=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function Rt(w){const b=a.render.frame;h.get(w)!==b&&(h.set(w,b),w.update())}function oe(w,b){const O=w.colorSpace,j=w.format,tt=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||O!==Or&&O!==li&&($t.getTransfer(O)===ee?(j!==En||tt!==jn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),b}function wt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=k,this.setTexture2D=q,this.setTexture2DArray=G,this.setTexture3D=$,this.setTextureCube=B,this.rebindTextures=At,this.setupRenderTarget=ie,this.updateRenderTargetMipmap=Wt,this.updateMultisampleRenderTarget=on,this.setupDepthRenderbuffer=xt,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Ht}function E0(r,t){function e(n,i=li){let s;const a=$t.getTransfer(i);if(n===jn)return r.UNSIGNED_BYTE;if(n===El)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Tl)return r.UNSIGNED_SHORT_5_5_5_1;if(n===zh)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===kh)return r.BYTE;if(n===Bh)return r.SHORT;if(n===os)return r.UNSIGNED_SHORT;if(n===bl)return r.INT;if(n===ji)return r.UNSIGNED_INT;if(n===qn)return r.FLOAT;if(n===Ms)return r.HALF_FLOAT;if(n===Vh)return r.ALPHA;if(n===Hh)return r.RGB;if(n===En)return r.RGBA;if(n===Gh)return r.LUMINANCE;if(n===Wh)return r.LUMINANCE_ALPHA;if(n===Mr)return r.DEPTH_COMPONENT;if(n===Cr)return r.DEPTH_STENCIL;if(n===Xh)return r.RED;if(n===Al)return r.RED_INTEGER;if(n===qh)return r.RG;if(n===wl)return r.RG_INTEGER;if(n===Rl)return r.RGBA_INTEGER;if(n===ta||n===ea||n===na||n===ia)if(a===ee)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ta)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ea)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===na)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ia)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ta)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ea)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===na)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ia)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Uo||n===No||n===Fo||n===Oo)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Uo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===No)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Fo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Oo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ko||n===Bo||n===zo)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===ko||n===Bo)return a===ee?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===zo)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Vo||n===Ho||n===Go||n===Wo||n===Xo||n===qo||n===$o||n===Yo||n===jo||n===Ko||n===Zo||n===Jo||n===Qo||n===tl)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Vo)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ho)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Go)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wo)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xo)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===qo)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===$o)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Yo)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===jo)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ko)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Zo)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Jo)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Qo)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===tl)return a===ee?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ra||n===el||n===nl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===ra)return a===ee?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===el)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===nl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===$h||n===il||n===rl||n===sl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===ra)return s.COMPRESSED_RED_RGTC1_EXT;if(n===il)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===rl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===sl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Rr?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:e}}class T0 extends fn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ci extends We{constructor(){super(),this.isGroup=!0,this.type="Group"}}const A0={type:"move"};class oo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ci,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ci,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ci,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(A0)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ci;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const w0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,R0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class C0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const i=new Ge,s=t.properties.get(i);s.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new xi({vertexShader:w0,fragmentShader:R0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ze(new Ts(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class P0 extends kr{constructor(t,e){super();const n=this;let i=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null;const _=new C0,m=e.getContextAttributes();let p=null,v=null;const S=[],x=[],R=new Qt;let A=null;const T=new fn;T.viewport=new ve;const C=new fn;C.viewport=new ve;const M=[T,C],y=new T0;let P=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let et=S[H];return et===void 0&&(et=new oo,S[H]=et),et.getTargetRaySpace()},this.getControllerGrip=function(H){let et=S[H];return et===void 0&&(et=new oo,S[H]=et),et.getGripSpace()},this.getHand=function(H){let et=S[H];return et===void 0&&(et=new oo,S[H]=et),et.getHandSpace()};function N(H){const et=x.indexOf(H.inputSource);if(et===-1)return;const pt=S[et];pt!==void 0&&(pt.update(H.inputSource,H.frame,c||a),pt.dispatchEvent({type:H.type,data:H.inputSource}))}function W(){i.removeEventListener("select",N),i.removeEventListener("selectstart",N),i.removeEventListener("selectend",N),i.removeEventListener("squeeze",N),i.removeEventListener("squeezestart",N),i.removeEventListener("squeezeend",N),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",q);for(let H=0;H<S.length;H++){const et=x[H];et!==null&&(x[H]=null,S[H].disconnect(et))}P=null,k=null,_.reset(),t.setRenderTarget(p),d=null,f=null,u=null,i=null,v=null,vt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){s=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){o=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(H){c=H},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(H){if(i=H,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",N),i.addEventListener("selectstart",N),i.addEventListener("selectend",N),i.addEventListener("squeeze",N),i.addEventListener("squeezestart",N),i.addEventListener("squeezeend",N),i.addEventListener("end",W),i.addEventListener("inputsourceschange",q),m.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(R),i.renderState.layers===void 0){const et={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(i,e,et),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new Ki(d.framebufferWidth,d.framebufferHeight,{format:En,type:jn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let et=null,pt=null,Z=null;m.depth&&(Z=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=m.stencil?Cr:Mr,pt=m.stencil?Rr:ji);const bt={colorFormat:e.RGBA8,depthFormat:Z,scaleFactor:s};u=new XRWebGLBinding(i,e),f=u.createProjectionLayer(bt),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),v=new Ki(f.textureWidth,f.textureHeight,{format:En,type:jn,depthTexture:new lu(f.textureWidth,f.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),vt.setContext(i),vt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function q(H){for(let et=0;et<H.removed.length;et++){const pt=H.removed[et],Z=x.indexOf(pt);Z>=0&&(x[Z]=null,S[Z].disconnect(pt))}for(let et=0;et<H.added.length;et++){const pt=H.added[et];let Z=x.indexOf(pt);if(Z===-1){for(let xt=0;xt<S.length;xt++)if(xt>=x.length){x.push(pt),Z=xt;break}else if(x[xt]===null){x[xt]=pt,Z=xt;break}if(Z===-1)break}const bt=S[Z];bt&&bt.connect(pt)}}const G=new F,$=new F;function B(H,et,pt){G.setFromMatrixPosition(et.matrixWorld),$.setFromMatrixPosition(pt.matrixWorld);const Z=G.distanceTo($),bt=et.projectionMatrix.elements,xt=pt.projectionMatrix.elements,At=bt[14]/(bt[10]-1),ie=bt[14]/(bt[10]+1),Wt=(bt[9]+1)/bt[5],ge=(bt[9]-1)/bt[5],U=(bt[8]-1)/bt[0],on=(xt[8]+1)/xt[0],Vt=At*U,Ht=At*on,Rt=Z/(-U+on),oe=Rt*-U;if(et.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(oe),H.translateZ(Rt),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert(),bt[10]===-1)H.projectionMatrix.copy(et.projectionMatrix),H.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const wt=At+Rt,w=ie+Rt,b=Vt-oe,O=Ht+(Z-oe),j=Wt*ie/w*wt,tt=ge*ie/w*wt;H.projectionMatrix.makePerspective(b,O,j,tt,wt,w),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}}function rt(H,et){et===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(et.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(i===null)return;let et=H.near,pt=H.far;_.texture!==null&&(_.depthNear>0&&(et=_.depthNear),_.depthFar>0&&(pt=_.depthFar)),y.near=C.near=T.near=et,y.far=C.far=T.far=pt,(P!==y.near||k!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),P=y.near,k=y.far),T.layers.mask=H.layers.mask|2,C.layers.mask=H.layers.mask|4,y.layers.mask=T.layers.mask|C.layers.mask;const Z=H.parent,bt=y.cameras;rt(y,Z);for(let xt=0;xt<bt.length;xt++)rt(bt[xt],Z);bt.length===2?B(y,T,C):y.projectionMatrix.copy(T.projectionMatrix),st(H,y,Z)};function st(H,et,pt){pt===null?H.matrix.copy(et.matrixWorld):(H.matrix.copy(pt.matrixWorld),H.matrix.invert(),H.matrix.multiply(et.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(et.projectionMatrix),H.projectionMatrixInverse.copy(et.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=al*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(H){l=H,f!==null&&(f.fixedFoveation=H),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=H)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let gt=null;function J(H,et){if(h=et.getViewerPose(c||a),g=et,h!==null){const pt=h.views;d!==null&&(t.setRenderTargetFramebuffer(v,d.framebuffer),t.setRenderTarget(v));let Z=!1;pt.length!==y.cameras.length&&(y.cameras.length=0,Z=!0);for(let xt=0;xt<pt.length;xt++){const At=pt[xt];let ie=null;if(d!==null)ie=d.getViewport(At);else{const ge=u.getViewSubImage(f,At);ie=ge.viewport,xt===0&&(t.setRenderTargetTextures(v,ge.colorTexture,f.ignoreDepthValues?void 0:ge.depthStencilTexture),t.setRenderTarget(v))}let Wt=M[xt];Wt===void 0&&(Wt=new fn,Wt.layers.enable(xt),Wt.viewport=new ve,M[xt]=Wt),Wt.matrix.fromArray(At.transform.matrix),Wt.matrix.decompose(Wt.position,Wt.quaternion,Wt.scale),Wt.projectionMatrix.fromArray(At.projectionMatrix),Wt.projectionMatrixInverse.copy(Wt.projectionMatrix).invert(),Wt.viewport.set(ie.x,ie.y,ie.width,ie.height),xt===0&&(y.matrix.copy(Wt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),Z===!0&&y.cameras.push(Wt)}const bt=i.enabledFeatures;if(bt&&bt.includes("depth-sensing")){const xt=u.getDepthInformation(pt[0]);xt&&xt.isValid&&xt.texture&&_.init(t,xt,i.renderState)}}for(let pt=0;pt<S.length;pt++){const Z=x[pt],bt=S[pt];Z!==null&&bt!==void 0&&bt.update(Z,et,c||a)}gt&&gt(H,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),g=null}const vt=new ou;vt.setAnimationLoop(J),this.setAnimationLoop=function(H){gt=H},this.dispose=function(){}}}const Ci=new Kn,D0=new Me;function L0(r,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,iu(r)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,v,S,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,x)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,v,S):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===He&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===He&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=t.get(p),S=v.envMap,x=v.envMapRotation;S&&(m.envMap.value=S,Ci.copy(x),Ci.x*=-1,Ci.y*=-1,Ci.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Ci.y*=-1,Ci.z*=-1),m.envMapRotation.value.setFromMatrix4(D0.makeRotationFromEuler(Ci)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,v,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=S*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===He&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const v=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function I0(r,t,e,n){let i={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,S){const x=S.program;n.uniformBlockBinding(v,x)}function c(v,S){let x=i[v.id];x===void 0&&(g(v),x=h(v),i[v.id]=x,v.addEventListener("dispose",m));const R=S.program;n.updateUBOMapping(v,R);const A=t.render.frame;s[v.id]!==A&&(f(v),s[v.id]=A)}function h(v){const S=u();v.__bindingPointIndex=S;const x=r.createBuffer(),R=v.__size,A=v.usage;return r.bindBuffer(r.UNIFORM_BUFFER,x),r.bufferData(r.UNIFORM_BUFFER,R,A),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,S,x),x}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const S=i[v.id],x=v.uniforms,R=v.__cache;r.bindBuffer(r.UNIFORM_BUFFER,S);for(let A=0,T=x.length;A<T;A++){const C=Array.isArray(x[A])?x[A]:[x[A]];for(let M=0,y=C.length;M<y;M++){const P=C[M];if(d(P,A,M,R)===!0){const k=P.__offset,N=Array.isArray(P.value)?P.value:[P.value];let W=0;for(let q=0;q<N.length;q++){const G=N[q],$=_(G);typeof G=="number"||typeof G=="boolean"?(P.__data[0]=G,r.bufferSubData(r.UNIFORM_BUFFER,k+W,P.__data)):G.isMatrix3?(P.__data[0]=G.elements[0],P.__data[1]=G.elements[1],P.__data[2]=G.elements[2],P.__data[3]=0,P.__data[4]=G.elements[3],P.__data[5]=G.elements[4],P.__data[6]=G.elements[5],P.__data[7]=0,P.__data[8]=G.elements[6],P.__data[9]=G.elements[7],P.__data[10]=G.elements[8],P.__data[11]=0):(G.toArray(P.__data,W),W+=$.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,k,P.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function d(v,S,x,R){const A=v.value,T=S+"_"+x;if(R[T]===void 0)return typeof A=="number"||typeof A=="boolean"?R[T]=A:R[T]=A.clone(),!0;{const C=R[T];if(typeof A=="number"||typeof A=="boolean"){if(C!==A)return R[T]=A,!0}else if(C.equals(A)===!1)return C.copy(A),!0}return!1}function g(v){const S=v.uniforms;let x=0;const R=16;for(let T=0,C=S.length;T<C;T++){const M=Array.isArray(S[T])?S[T]:[S[T]];for(let y=0,P=M.length;y<P;y++){const k=M[y],N=Array.isArray(k.value)?k.value:[k.value];for(let W=0,q=N.length;W<q;W++){const G=N[W],$=_(G),B=x%R,rt=B%$.boundary,st=B+rt;x+=rt,st!==0&&R-st<$.storage&&(x+=R-st),k.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=x,x+=$.storage}}}const A=x%R;return A>0&&(x+=R-A),v.__size=x,v.__cache={},this}function _(v){const S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=48,S.storage=48):v.isMatrix4?(S.boundary=64,S.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),S}function m(v){const S=v.target;S.removeEventListener("dispose",m);const x=a.indexOf(S.__bindingPointIndex);a.splice(x,1),r.deleteBuffer(i[S.id]),delete i[S.id],delete s[S.id]}function p(){for(const v in i)r.deleteBuffer(i[v]);a=[],i={},s={}}return{bind:l,update:c,dispose:p}}class U0{constructor(t={}){const{canvas:e=yd(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const v=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=un,this.toneMapping=pi,this.toneMappingExposure=1;const x=this;let R=!1,A=0,T=0,C=null,M=-1,y=null;const P=new ve,k=new ve;let N=null;const W=new Jt(0);let q=0,G=e.width,$=e.height,B=1,rt=null,st=null;const gt=new ve(0,0,G,$),J=new ve(0,0,G,$);let vt=!1;const H=new au;let et=!1,pt=!1;const Z=new Me,bt=new Me,xt=new F,At=new ve,ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Wt=!1;function ge(){return C===null?B:1}let U=n;function on(E,L){return e.getContext(E,L)}try{const E={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Sl}`),e.addEventListener("webglcontextlost",K,!1),e.addEventListener("webglcontextrestored",ut,!1),e.addEventListener("webglcontextcreationerror",ct,!1),U===null){const L="webgl2";if(U=on(L,E),U===null)throw on(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Vt,Ht,Rt,oe,wt,w,b,O,j,tt,Y,Et,lt,dt,Xt,nt,mt,Ct,Pt,_t,Gt,Ot,se,D;function ot(){Vt=new B_(U),Vt.init(),Ot=new E0(U,Vt),Ht=new L_(U,Vt,t,Ot),Rt=new y0(U,Vt),Ht.reverseDepthBuffer&&f&&Rt.buffers.depth.setReversed(!0),oe=new H_(U),wt=new a0,w=new b0(U,Vt,Rt,wt,Ht,Ot,oe),b=new U_(x),O=new k_(x),j=new Yd(U),se=new P_(U,j),tt=new z_(U,j,oe,se),Y=new W_(U,tt,j,oe),Pt=new G_(U,Ht,w),nt=new I_(wt),Et=new s0(x,b,O,Vt,Ht,se,nt),lt=new L0(x,wt),dt=new l0,Xt=new p0(Vt),Ct=new C_(x,b,O,Rt,Y,d,l),mt=new v0(x,Y,Ht),D=new I0(U,oe,Ht,Rt),_t=new D_(U,Vt,oe),Gt=new V_(U,Vt,oe),oe.programs=Et.programs,x.capabilities=Ht,x.extensions=Vt,x.properties=wt,x.renderLists=dt,x.shadowMap=mt,x.state=Rt,x.info=oe}ot();const X=new P0(x,U);this.xr=X,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const E=Vt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Vt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(E){E!==void 0&&(B=E,this.setSize(G,$,!1))},this.getSize=function(E){return E.set(G,$)},this.setSize=function(E,L,z=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=E,$=L,e.width=Math.floor(E*B),e.height=Math.floor(L*B),z===!0&&(e.style.width=E+"px",e.style.height=L+"px"),this.setViewport(0,0,E,L)},this.getDrawingBufferSize=function(E){return E.set(G*B,$*B).floor()},this.setDrawingBufferSize=function(E,L,z){G=E,$=L,B=z,e.width=Math.floor(E*z),e.height=Math.floor(L*z),this.setViewport(0,0,E,L)},this.getCurrentViewport=function(E){return E.copy(P)},this.getViewport=function(E){return E.copy(gt)},this.setViewport=function(E,L,z,V){E.isVector4?gt.set(E.x,E.y,E.z,E.w):gt.set(E,L,z,V),Rt.viewport(P.copy(gt).multiplyScalar(B).round())},this.getScissor=function(E){return E.copy(J)},this.setScissor=function(E,L,z,V){E.isVector4?J.set(E.x,E.y,E.z,E.w):J.set(E,L,z,V),Rt.scissor(k.copy(J).multiplyScalar(B).round())},this.getScissorTest=function(){return vt},this.setScissorTest=function(E){Rt.setScissorTest(vt=E)},this.setOpaqueSort=function(E){rt=E},this.setTransparentSort=function(E){st=E},this.getClearColor=function(E){return E.copy(Ct.getClearColor())},this.setClearColor=function(){Ct.setClearColor.apply(Ct,arguments)},this.getClearAlpha=function(){return Ct.getClearAlpha()},this.setClearAlpha=function(){Ct.setClearAlpha.apply(Ct,arguments)},this.clear=function(E=!0,L=!0,z=!0){let V=0;if(E){let I=!1;if(C!==null){const it=C.texture.format;I=it===Rl||it===wl||it===Al}if(I){const it=C.texture.type,ht=it===jn||it===ji||it===os||it===Rr||it===El||it===Tl,Mt=Ct.getClearColor(),yt=Ct.getClearAlpha(),Lt=Mt.r,Ut=Mt.g,St=Mt.b;ht?(g[0]=Lt,g[1]=Ut,g[2]=St,g[3]=yt,U.clearBufferuiv(U.COLOR,0,g)):(_[0]=Lt,_[1]=Ut,_[2]=St,_[3]=yt,U.clearBufferiv(U.COLOR,0,_))}else V|=U.COLOR_BUFFER_BIT}L&&(V|=U.DEPTH_BUFFER_BIT),z&&(V|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",K,!1),e.removeEventListener("webglcontextrestored",ut,!1),e.removeEventListener("webglcontextcreationerror",ct,!1),dt.dispose(),Xt.dispose(),wt.dispose(),b.dispose(),O.dispose(),Y.dispose(),se.dispose(),D.dispose(),Et.dispose(),X.dispose(),X.removeEventListener("sessionstart",ic),X.removeEventListener("sessionend",rc),bi.stop()};function K(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function ut(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const E=oe.autoReset,L=mt.enabled,z=mt.autoUpdate,V=mt.needsUpdate,I=mt.type;ot(),oe.autoReset=E,mt.enabled=L,mt.autoUpdate=z,mt.needsUpdate=V,mt.type=I}function ct(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function It(E){const L=E.target;L.removeEventListener("dispose",It),me(L)}function me(E){Ce(E),wt.remove(E)}function Ce(E){const L=wt.get(E).programs;L!==void 0&&(L.forEach(function(z){Et.releaseProgram(z)}),E.isShaderMaterial&&Et.releaseShaderCache(E))}this.renderBufferDirect=function(E,L,z,V,I,it){L===null&&(L=ie);const ht=I.isMesh&&I.matrixWorld.determinant()<0,Mt=bf(E,L,z,V,I);Rt.setMaterial(V,ht);let yt=z.index,Lt=1;if(V.wireframe===!0){if(yt=tt.getWireframeAttribute(z),yt===void 0)return;Lt=2}const Ut=z.drawRange,St=z.attributes.position;let Yt=Ut.start*Lt,ae=(Ut.start+Ut.count)*Lt;it!==null&&(Yt=Math.max(Yt,it.start*Lt),ae=Math.min(ae,(it.start+it.count)*Lt)),yt!==null?(Yt=Math.max(Yt,0),ae=Math.min(ae,yt.count)):St!=null&&(Yt=Math.max(Yt,0),ae=Math.min(ae,St.count));const le=ae-Yt;if(le<0||le===1/0)return;se.setup(I,V,Mt,z,yt);let Oe,Kt=_t;if(yt!==null&&(Oe=j.get(yt),Kt=Gt,Kt.setIndex(Oe)),I.isMesh)V.wireframe===!0?(Rt.setLineWidth(V.wireframeLinewidth*ge()),Kt.setMode(U.LINES)):Kt.setMode(U.TRIANGLES);else if(I.isLine){let Tt=V.linewidth;Tt===void 0&&(Tt=1),Rt.setLineWidth(Tt*ge()),I.isLineSegments?Kt.setMode(U.LINES):I.isLineLoop?Kt.setMode(U.LINE_LOOP):Kt.setMode(U.LINE_STRIP)}else I.isPoints?Kt.setMode(U.POINTS):I.isSprite&&Kt.setMode(U.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)Kt.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if(Vt.get("WEBGL_multi_draw"))Kt.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else{const Tt=I._multiDrawStarts,Fn=I._multiDrawCounts,Zt=I._multiDrawCount,gn=yt?j.get(yt).bytesPerElement:1,Ji=wt.get(V).currentProgram.getUniforms();for(let Ke=0;Ke<Zt;Ke++)Ji.setValue(U,"_gl_DrawID",Ke),Kt.render(Tt[Ke]/gn,Fn[Ke])}else if(I.isInstancedMesh)Kt.renderInstances(Yt,le,I.count);else if(z.isInstancedBufferGeometry){const Tt=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,Fn=Math.min(z.instanceCount,Tt);Kt.renderInstances(Yt,le,Fn)}else Kt.render(Yt,le)};function te(E,L,z){E.transparent===!0&&E.side===Xn&&E.forceSinglePass===!1?(E.side=He,E.needsUpdate=!0,Rs(E,L,z),E.side=gi,E.needsUpdate=!0,Rs(E,L,z),E.side=Xn):Rs(E,L,z)}this.compile=function(E,L,z=null){z===null&&(z=E),p=Xt.get(z),p.init(L),S.push(p),z.traverseVisible(function(I){I.isLight&&I.layers.test(L.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),E!==z&&E.traverseVisible(function(I){I.isLight&&I.layers.test(L.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),p.setupLights();const V=new Set;return E.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;const it=I.material;if(it)if(Array.isArray(it))for(let ht=0;ht<it.length;ht++){const Mt=it[ht];te(Mt,z,I),V.add(Mt)}else te(it,z,I),V.add(it)}),S.pop(),p=null,V},this.compileAsync=function(E,L,z=null){const V=this.compile(E,L,z);return new Promise(I=>{function it(){if(V.forEach(function(ht){wt.get(ht).currentProgram.isReady()&&V.delete(ht)}),V.size===0){I(E);return}setTimeout(it,10)}Vt.get("KHR_parallel_shader_compile")!==null?it():setTimeout(it,10)})};let _n=null;function Nn(E){_n&&_n(E)}function ic(){bi.stop()}function rc(){bi.start()}const bi=new ou;bi.setAnimationLoop(Nn),typeof self<"u"&&bi.setContext(self),this.setAnimationLoop=function(E){_n=E,X.setAnimationLoop(E),E===null?bi.stop():bi.start()},X.addEventListener("sessionstart",ic),X.addEventListener("sessionend",rc),this.render=function(E,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(L),L=X.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,L,C),p=Xt.get(E,S.length),p.init(L),S.push(p),bt.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),H.setFromProjectionMatrix(bt),pt=this.localClippingEnabled,et=nt.init(this.clippingPlanes,pt),m=dt.get(E,v.length),m.init(),v.push(m),X.enabled===!0&&X.isPresenting===!0){const it=x.xr.getDepthSensingMesh();it!==null&&Pa(it,L,-1/0,x.sortObjects)}Pa(E,L,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(rt,st),Wt=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,Wt&&Ct.addToRenderList(m,E),this.info.render.frame++,et===!0&&nt.beginShadows();const z=p.state.shadowsArray;mt.render(z,E,L),et===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=m.opaque,I=m.transmissive;if(p.setupLights(),L.isArrayCamera){const it=L.cameras;if(I.length>0)for(let ht=0,Mt=it.length;ht<Mt;ht++){const yt=it[ht];ac(V,I,E,yt)}Wt&&Ct.render(E);for(let ht=0,Mt=it.length;ht<Mt;ht++){const yt=it[ht];sc(m,E,yt,yt.viewport)}}else I.length>0&&ac(V,I,E,L),Wt&&Ct.render(E),sc(m,E,L);C!==null&&(w.updateMultisampleRenderTarget(C),w.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(x,E,L),se.resetDefaultState(),M=-1,y=null,S.pop(),S.length>0?(p=S[S.length-1],et===!0&&nt.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?m=v[v.length-1]:m=null};function Pa(E,L,z,V){if(E.visible===!1)return;if(E.layers.test(L.layers)){if(E.isGroup)z=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(L);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||H.intersectsSprite(E)){V&&At.setFromMatrixPosition(E.matrixWorld).applyMatrix4(bt);const ht=Y.update(E),Mt=E.material;Mt.visible&&m.push(E,ht,Mt,z,At.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||H.intersectsObject(E))){const ht=Y.update(E),Mt=E.material;if(V&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),At.copy(E.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),At.copy(ht.boundingSphere.center)),At.applyMatrix4(E.matrixWorld).applyMatrix4(bt)),Array.isArray(Mt)){const yt=ht.groups;for(let Lt=0,Ut=yt.length;Lt<Ut;Lt++){const St=yt[Lt],Yt=Mt[St.materialIndex];Yt&&Yt.visible&&m.push(E,ht,Yt,z,At.z,St)}}else Mt.visible&&m.push(E,ht,Mt,z,At.z,null)}}const it=E.children;for(let ht=0,Mt=it.length;ht<Mt;ht++)Pa(it[ht],L,z,V)}function sc(E,L,z,V){const I=E.opaque,it=E.transmissive,ht=E.transparent;p.setupLightsView(z),et===!0&&nt.setGlobalState(x.clippingPlanes,z),V&&Rt.viewport(P.copy(V)),I.length>0&&ws(I,L,z),it.length>0&&ws(it,L,z),ht.length>0&&ws(ht,L,z),Rt.buffers.depth.setTest(!0),Rt.buffers.depth.setMask(!0),Rt.buffers.color.setMask(!0),Rt.setPolygonOffset(!1)}function ac(E,L,z,V){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[V.id]===void 0&&(p.state.transmissionRenderTarget[V.id]=new Ki(1,1,{generateMipmaps:!0,type:Vt.has("EXT_color_buffer_half_float")||Vt.has("EXT_color_buffer_float")?Ms:jn,minFilter:Hi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$t.workingColorSpace}));const it=p.state.transmissionRenderTarget[V.id],ht=V.viewport||P;it.setSize(ht.z,ht.w);const Mt=x.getRenderTarget();x.setRenderTarget(it),x.getClearColor(W),q=x.getClearAlpha(),q<1&&x.setClearColor(16777215,.5),x.clear(),Wt&&Ct.render(z);const yt=x.toneMapping;x.toneMapping=pi;const Lt=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),p.setupLightsView(V),et===!0&&nt.setGlobalState(x.clippingPlanes,V),ws(E,z,V),w.updateMultisampleRenderTarget(it),w.updateRenderTargetMipmap(it),Vt.has("WEBGL_multisampled_render_to_texture")===!1){let Ut=!1;for(let St=0,Yt=L.length;St<Yt;St++){const ae=L[St],le=ae.object,Oe=ae.geometry,Kt=ae.material,Tt=ae.group;if(Kt.side===Xn&&le.layers.test(V.layers)){const Fn=Kt.side;Kt.side=He,Kt.needsUpdate=!0,oc(le,z,V,Oe,Kt,Tt),Kt.side=Fn,Kt.needsUpdate=!0,Ut=!0}}Ut===!0&&(w.updateMultisampleRenderTarget(it),w.updateRenderTargetMipmap(it))}x.setRenderTarget(Mt),x.setClearColor(W,q),Lt!==void 0&&(V.viewport=Lt),x.toneMapping=yt}function ws(E,L,z){const V=L.isScene===!0?L.overrideMaterial:null;for(let I=0,it=E.length;I<it;I++){const ht=E[I],Mt=ht.object,yt=ht.geometry,Lt=V===null?ht.material:V,Ut=ht.group;Mt.layers.test(z.layers)&&oc(Mt,L,z,yt,Lt,Ut)}}function oc(E,L,z,V,I,it){E.onBeforeRender(x,L,z,V,I,it),E.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),I.onBeforeRender(x,L,z,V,E,it),I.transparent===!0&&I.side===Xn&&I.forceSinglePass===!1?(I.side=He,I.needsUpdate=!0,x.renderBufferDirect(z,L,V,I,E,it),I.side=gi,I.needsUpdate=!0,x.renderBufferDirect(z,L,V,I,E,it),I.side=Xn):x.renderBufferDirect(z,L,V,I,E,it),E.onAfterRender(x,L,z,V,I,it)}function Rs(E,L,z){L.isScene!==!0&&(L=ie);const V=wt.get(E),I=p.state.lights,it=p.state.shadowsArray,ht=I.state.version,Mt=Et.getParameters(E,I.state,it,L,z),yt=Et.getProgramCacheKey(Mt);let Lt=V.programs;V.environment=E.isMeshStandardMaterial?L.environment:null,V.fog=L.fog,V.envMap=(E.isMeshStandardMaterial?O:b).get(E.envMap||V.environment),V.envMapRotation=V.environment!==null&&E.envMap===null?L.environmentRotation:E.envMapRotation,Lt===void 0&&(E.addEventListener("dispose",It),Lt=new Map,V.programs=Lt);let Ut=Lt.get(yt);if(Ut!==void 0){if(V.currentProgram===Ut&&V.lightsStateVersion===ht)return cc(E,Mt),Ut}else Mt.uniforms=Et.getUniforms(E),E.onBeforeCompile(Mt,x),Ut=Et.acquireProgram(Mt,yt),Lt.set(yt,Ut),V.uniforms=Mt.uniforms;const St=V.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(St.clippingPlanes=nt.uniform),cc(E,Mt),V.needsLights=Tf(E),V.lightsStateVersion=ht,V.needsLights&&(St.ambientLightColor.value=I.state.ambient,St.lightProbe.value=I.state.probe,St.directionalLights.value=I.state.directional,St.directionalLightShadows.value=I.state.directionalShadow,St.spotLights.value=I.state.spot,St.spotLightShadows.value=I.state.spotShadow,St.rectAreaLights.value=I.state.rectArea,St.ltc_1.value=I.state.rectAreaLTC1,St.ltc_2.value=I.state.rectAreaLTC2,St.pointLights.value=I.state.point,St.pointLightShadows.value=I.state.pointShadow,St.hemisphereLights.value=I.state.hemi,St.directionalShadowMap.value=I.state.directionalShadowMap,St.directionalShadowMatrix.value=I.state.directionalShadowMatrix,St.spotShadowMap.value=I.state.spotShadowMap,St.spotLightMatrix.value=I.state.spotLightMatrix,St.spotLightMap.value=I.state.spotLightMap,St.pointShadowMap.value=I.state.pointShadowMap,St.pointShadowMatrix.value=I.state.pointShadowMatrix),V.currentProgram=Ut,V.uniformsList=null,Ut}function lc(E){if(E.uniformsList===null){const L=E.currentProgram.getUniforms();E.uniformsList=sa.seqWithValue(L.seq,E.uniforms)}return E.uniformsList}function cc(E,L){const z=wt.get(E);z.outputColorSpace=L.outputColorSpace,z.batching=L.batching,z.batchingColor=L.batchingColor,z.instancing=L.instancing,z.instancingColor=L.instancingColor,z.instancingMorph=L.instancingMorph,z.skinning=L.skinning,z.morphTargets=L.morphTargets,z.morphNormals=L.morphNormals,z.morphColors=L.morphColors,z.morphTargetsCount=L.morphTargetsCount,z.numClippingPlanes=L.numClippingPlanes,z.numIntersection=L.numClipIntersection,z.vertexAlphas=L.vertexAlphas,z.vertexTangents=L.vertexTangents,z.toneMapping=L.toneMapping}function bf(E,L,z,V,I){L.isScene!==!0&&(L=ie),w.resetTextureUnits();const it=L.fog,ht=V.isMeshStandardMaterial?L.environment:null,Mt=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Or,yt=(V.isMeshStandardMaterial?O:b).get(V.envMap||ht),Lt=V.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Ut=!!z.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),St=!!z.morphAttributes.position,Yt=!!z.morphAttributes.normal,ae=!!z.morphAttributes.color;let le=pi;V.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(le=x.toneMapping);const Oe=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Kt=Oe!==void 0?Oe.length:0,Tt=wt.get(V),Fn=p.state.lights;if(et===!0&&(pt===!0||E!==y)){const ln=E===y&&V.id===M;nt.setState(V,E,ln)}let Zt=!1;V.version===Tt.__version?(Tt.needsLights&&Tt.lightsStateVersion!==Fn.state.version||Tt.outputColorSpace!==Mt||I.isBatchedMesh&&Tt.batching===!1||!I.isBatchedMesh&&Tt.batching===!0||I.isBatchedMesh&&Tt.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&Tt.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&Tt.instancing===!1||!I.isInstancedMesh&&Tt.instancing===!0||I.isSkinnedMesh&&Tt.skinning===!1||!I.isSkinnedMesh&&Tt.skinning===!0||I.isInstancedMesh&&Tt.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&Tt.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&Tt.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&Tt.instancingMorph===!1&&I.morphTexture!==null||Tt.envMap!==yt||V.fog===!0&&Tt.fog!==it||Tt.numClippingPlanes!==void 0&&(Tt.numClippingPlanes!==nt.numPlanes||Tt.numIntersection!==nt.numIntersection)||Tt.vertexAlphas!==Lt||Tt.vertexTangents!==Ut||Tt.morphTargets!==St||Tt.morphNormals!==Yt||Tt.morphColors!==ae||Tt.toneMapping!==le||Tt.morphTargetsCount!==Kt)&&(Zt=!0):(Zt=!0,Tt.__version=V.version);let gn=Tt.currentProgram;Zt===!0&&(gn=Rs(V,L,I));let Ji=!1,Ke=!1,Vr=!1;const ce=gn.getUniforms(),wn=Tt.uniforms;if(Rt.useProgram(gn.program)&&(Ji=!0,Ke=!0,Vr=!0),V.id!==M&&(M=V.id,Ke=!0),Ji||y!==E){Rt.buffers.depth.getReversed()?(Z.copy(E.projectionMatrix),bd(Z),Ed(Z),ce.setValue(U,"projectionMatrix",Z)):ce.setValue(U,"projectionMatrix",E.projectionMatrix),ce.setValue(U,"viewMatrix",E.matrixWorldInverse);const Qn=ce.map.cameraPosition;Qn!==void 0&&Qn.setValue(U,xt.setFromMatrixPosition(E.matrixWorld)),Ht.logarithmicDepthBuffer&&ce.setValue(U,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&ce.setValue(U,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Ke=!0,Vr=!0)}if(I.isSkinnedMesh){ce.setOptional(U,I,"bindMatrix"),ce.setOptional(U,I,"bindMatrixInverse");const ln=I.skeleton;ln&&(ln.boneTexture===null&&ln.computeBoneTexture(),ce.setValue(U,"boneTexture",ln.boneTexture,w))}I.isBatchedMesh&&(ce.setOptional(U,I,"batchingTexture"),ce.setValue(U,"batchingTexture",I._matricesTexture,w),ce.setOptional(U,I,"batchingIdTexture"),ce.setValue(U,"batchingIdTexture",I._indirectTexture,w),ce.setOptional(U,I,"batchingColorTexture"),I._colorsTexture!==null&&ce.setValue(U,"batchingColorTexture",I._colorsTexture,w));const Hr=z.morphAttributes;if((Hr.position!==void 0||Hr.normal!==void 0||Hr.color!==void 0)&&Pt.update(I,z,gn),(Ke||Tt.receiveShadow!==I.receiveShadow)&&(Tt.receiveShadow=I.receiveShadow,ce.setValue(U,"receiveShadow",I.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(wn.envMap.value=yt,wn.flipEnvMap.value=yt.isCubeTexture&&yt.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&L.environment!==null&&(wn.envMapIntensity.value=L.environmentIntensity),Ke&&(ce.setValue(U,"toneMappingExposure",x.toneMappingExposure),Tt.needsLights&&Ef(wn,Vr),it&&V.fog===!0&&lt.refreshFogUniforms(wn,it),lt.refreshMaterialUniforms(wn,V,B,$,p.state.transmissionRenderTarget[E.id]),sa.upload(U,lc(Tt),wn,w)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(sa.upload(U,lc(Tt),wn,w),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&ce.setValue(U,"center",I.center),ce.setValue(U,"modelViewMatrix",I.modelViewMatrix),ce.setValue(U,"normalMatrix",I.normalMatrix),ce.setValue(U,"modelMatrix",I.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const ln=V.uniformsGroups;for(let Qn=0,ti=ln.length;Qn<ti;Qn++){const hc=ln[Qn];D.update(hc,gn),D.bind(hc,gn)}}return gn}function Ef(E,L){E.ambientLightColor.needsUpdate=L,E.lightProbe.needsUpdate=L,E.directionalLights.needsUpdate=L,E.directionalLightShadows.needsUpdate=L,E.pointLights.needsUpdate=L,E.pointLightShadows.needsUpdate=L,E.spotLights.needsUpdate=L,E.spotLightShadows.needsUpdate=L,E.rectAreaLights.needsUpdate=L,E.hemisphereLights.needsUpdate=L}function Tf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,L,z){wt.get(E.texture).__webglTexture=L,wt.get(E.depthTexture).__webglTexture=z;const V=wt.get(E);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=z===void 0,V.__autoAllocateDepthBuffer||Vt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,L){const z=wt.get(E);z.__webglFramebuffer=L,z.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(E,L=0,z=0){C=E,A=L,T=z;let V=!0,I=null,it=!1,ht=!1;if(E){const yt=wt.get(E);if(yt.__useDefaultFramebuffer!==void 0)Rt.bindFramebuffer(U.FRAMEBUFFER,null),V=!1;else if(yt.__webglFramebuffer===void 0)w.setupRenderTarget(E);else if(yt.__hasExternalTextures)w.rebindTextures(E,wt.get(E.texture).__webglTexture,wt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const St=E.depthTexture;if(yt.__boundDepthTexture!==St){if(St!==null&&wt.has(St)&&(E.width!==St.image.width||E.height!==St.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(E)}}const Lt=E.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(ht=!0);const Ut=wt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ut[L])?I=Ut[L][z]:I=Ut[L],it=!0):E.samples>0&&w.useMultisampledRTT(E)===!1?I=wt.get(E).__webglMultisampledFramebuffer:Array.isArray(Ut)?I=Ut[z]:I=Ut,P.copy(E.viewport),k.copy(E.scissor),N=E.scissorTest}else P.copy(gt).multiplyScalar(B).floor(),k.copy(J).multiplyScalar(B).floor(),N=vt;if(Rt.bindFramebuffer(U.FRAMEBUFFER,I)&&V&&Rt.drawBuffers(E,I),Rt.viewport(P),Rt.scissor(k),Rt.setScissorTest(N),it){const yt=wt.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+L,yt.__webglTexture,z)}else if(ht){const yt=wt.get(E.texture),Lt=L||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,yt.__webglTexture,z||0,Lt)}M=-1},this.readRenderTargetPixels=function(E,L,z,V,I,it,ht){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Mt=wt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ht!==void 0&&(Mt=Mt[ht]),Mt){Rt.bindFramebuffer(U.FRAMEBUFFER,Mt);try{const yt=E.texture,Lt=yt.format,Ut=yt.type;if(!Ht.textureFormatReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ht.textureTypeReadable(Ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=E.width-V&&z>=0&&z<=E.height-I&&U.readPixels(L,z,V,I,Ot.convert(Lt),Ot.convert(Ut),it)}finally{const yt=C!==null?wt.get(C).__webglFramebuffer:null;Rt.bindFramebuffer(U.FRAMEBUFFER,yt)}}},this.readRenderTargetPixelsAsync=async function(E,L,z,V,I,it,ht){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Mt=wt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ht!==void 0&&(Mt=Mt[ht]),Mt){const yt=E.texture,Lt=yt.format,Ut=yt.type;if(!Ht.textureFormatReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ht.textureTypeReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(L>=0&&L<=E.width-V&&z>=0&&z<=E.height-I){Rt.bindFramebuffer(U.FRAMEBUFFER,Mt);const St=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,St),U.bufferData(U.PIXEL_PACK_BUFFER,it.byteLength,U.STREAM_READ),U.readPixels(L,z,V,I,Ot.convert(Lt),Ot.convert(Ut),0);const Yt=C!==null?wt.get(C).__webglFramebuffer:null;Rt.bindFramebuffer(U.FRAMEBUFFER,Yt);const ae=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Sd(U,ae,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,St),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,it),U.deleteBuffer(St),U.deleteSync(ae),it}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,L=null,z=0){E.isTexture!==!0&&(Zr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),L=arguments[0]||null,E=arguments[1]);const V=Math.pow(2,-z),I=Math.floor(E.image.width*V),it=Math.floor(E.image.height*V),ht=L!==null?L.x:0,Mt=L!==null?L.y:0;w.setTexture2D(E,0),U.copyTexSubImage2D(U.TEXTURE_2D,z,0,0,ht,Mt,I,it),Rt.unbindTexture()},this.copyTextureToTexture=function(E,L,z=null,V=null,I=0){E.isTexture!==!0&&(Zr("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,E=arguments[1],L=arguments[2],I=arguments[3]||0,z=null);let it,ht,Mt,yt,Lt,Ut,St,Yt,ae;const le=E.isCompressedTexture?E.mipmaps[I]:E.image;z!==null?(it=z.max.x-z.min.x,ht=z.max.y-z.min.y,Mt=z.isBox3?z.max.z-z.min.z:1,yt=z.min.x,Lt=z.min.y,Ut=z.isBox3?z.min.z:0):(it=le.width,ht=le.height,Mt=le.depth||1,yt=0,Lt=0,Ut=0),V!==null?(St=V.x,Yt=V.y,ae=V.z):(St=0,Yt=0,ae=0);const Oe=Ot.convert(L.format),Kt=Ot.convert(L.type);let Tt;L.isData3DTexture?(w.setTexture3D(L,0),Tt=U.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(w.setTexture2DArray(L,0),Tt=U.TEXTURE_2D_ARRAY):(w.setTexture2D(L,0),Tt=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,L.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,L.unpackAlignment);const Fn=U.getParameter(U.UNPACK_ROW_LENGTH),Zt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),gn=U.getParameter(U.UNPACK_SKIP_PIXELS),Ji=U.getParameter(U.UNPACK_SKIP_ROWS),Ke=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,le.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,le.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,yt),U.pixelStorei(U.UNPACK_SKIP_ROWS,Lt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ut);const Vr=E.isDataArrayTexture||E.isData3DTexture,ce=L.isDataArrayTexture||L.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const wn=wt.get(E),Hr=wt.get(L),ln=wt.get(wn.__renderTarget),Qn=wt.get(Hr.__renderTarget);Rt.bindFramebuffer(U.READ_FRAMEBUFFER,ln.__webglFramebuffer),Rt.bindFramebuffer(U.DRAW_FRAMEBUFFER,Qn.__webglFramebuffer);for(let ti=0;ti<Mt;ti++)Vr&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,wt.get(E).__webglTexture,I,Ut+ti),E.isDepthTexture?(ce&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,wt.get(L).__webglTexture,I,ae+ti),U.blitFramebuffer(yt,Lt,it,ht,St,Yt,it,ht,U.DEPTH_BUFFER_BIT,U.NEAREST)):ce?U.copyTexSubImage3D(Tt,I,St,Yt,ae+ti,yt,Lt,it,ht):U.copyTexSubImage2D(Tt,I,St,Yt,ae+ti,yt,Lt,it,ht);Rt.bindFramebuffer(U.READ_FRAMEBUFFER,null),Rt.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else ce?E.isDataTexture||E.isData3DTexture?U.texSubImage3D(Tt,I,St,Yt,ae,it,ht,Mt,Oe,Kt,le.data):L.isCompressedArrayTexture?U.compressedTexSubImage3D(Tt,I,St,Yt,ae,it,ht,Mt,Oe,le.data):U.texSubImage3D(Tt,I,St,Yt,ae,it,ht,Mt,Oe,Kt,le):E.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,I,St,Yt,it,ht,Oe,Kt,le.data):E.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,I,St,Yt,le.width,le.height,Oe,le.data):U.texSubImage2D(U.TEXTURE_2D,I,St,Yt,it,ht,Oe,Kt,le);U.pixelStorei(U.UNPACK_ROW_LENGTH,Fn),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Zt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,gn),U.pixelStorei(U.UNPACK_SKIP_ROWS,Ji),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ke),I===0&&L.generateMipmaps&&U.generateMipmap(Tt),Rt.unbindTexture()},this.copyTextureToTexture3D=function(E,L,z=null,V=null,I=0){return E.isTexture!==!0&&(Zr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,V=arguments[1]||null,E=arguments[2],L=arguments[3],I=arguments[4]||0),Zr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,L,z,V,I)},this.initRenderTarget=function(E){wt.get(E).__webglFramebuffer===void 0&&w.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?w.setTextureCube(E,0):E.isData3DTexture?w.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?w.setTexture2DArray(E,0):w.setTexture2D(E,0),Rt.unbindTexture()},this.resetState=function(){A=0,T=0,C=null,Rt.reset(),se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return $n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=$t._getDrawingBufferColorSpace(t),e.unpackColorSpace=$t._getUnpackColorSpace()}}class N0 extends We{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Kn,this.environmentIntensity=1,this.environmentRotation=new Kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class du extends Es{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Jt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const hh=new Me,ll=new Jh,Ks=new Ea,Zs=new F;class F0 extends We{constructor(t=new mn,e=new du){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,s=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ks.copy(n.boundingSphere),Ks.applyMatrix4(i),Ks.radius+=s,t.ray.intersectsSphere(Ks)===!1)return;hh.copy(i).invert(),ll.copy(t.ray).applyMatrix4(hh);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let g=f,_=d;g<_;g++){const m=c.getX(g);Zs.fromBufferAttribute(u,m),uh(Zs,m,l,i,t,e,this)}}else{const f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let g=f,_=d;g<_;g++)Zs.fromBufferAttribute(u,g),uh(Zs,g,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function uh(r,t,e,n,i,s,a){const o=ll.distanceSqToPoint(r);if(o<e){const l=new F;ll.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Pl extends mn{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const s=[],a=[];o(i),c(n),h(),this.setAttribute("position",new Ue(s,3)),this.setAttribute("normal",new Ue(s.slice(),3)),this.setAttribute("uv",new Ue(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const S=new F,x=new F,R=new F;for(let A=0;A<e.length;A+=3)d(e[A+0],S),d(e[A+1],x),d(e[A+2],R),l(S,x,R,v)}function l(v,S,x,R){const A=R+1,T=[];for(let C=0;C<=A;C++){T[C]=[];const M=v.clone().lerp(x,C/A),y=S.clone().lerp(x,C/A),P=A-C;for(let k=0;k<=P;k++)k===0&&C===A?T[C][k]=M:T[C][k]=M.clone().lerp(y,k/P)}for(let C=0;C<A;C++)for(let M=0;M<2*(A-C)-1;M++){const y=Math.floor(M/2);M%2===0?(f(T[C][y+1]),f(T[C+1][y]),f(T[C][y])):(f(T[C][y+1]),f(T[C+1][y+1]),f(T[C+1][y]))}}function c(v){const S=new F;for(let x=0;x<s.length;x+=3)S.x=s[x+0],S.y=s[x+1],S.z=s[x+2],S.normalize().multiplyScalar(v),s[x+0]=S.x,s[x+1]=S.y,s[x+2]=S.z}function h(){const v=new F;for(let S=0;S<s.length;S+=3){v.x=s[S+0],v.y=s[S+1],v.z=s[S+2];const x=m(v)/2/Math.PI+.5,R=p(v)/Math.PI+.5;a.push(x,1-R)}g(),u()}function u(){for(let v=0;v<a.length;v+=6){const S=a[v+0],x=a[v+2],R=a[v+4],A=Math.max(S,x,R),T=Math.min(S,x,R);A>.9&&T<.1&&(S<.2&&(a[v+0]+=1),x<.2&&(a[v+2]+=1),R<.2&&(a[v+4]+=1))}}function f(v){s.push(v.x,v.y,v.z)}function d(v,S){const x=v*3;S.x=t[x+0],S.y=t[x+1],S.z=t[x+2]}function g(){const v=new F,S=new F,x=new F,R=new F,A=new Qt,T=new Qt,C=new Qt;for(let M=0,y=0;M<s.length;M+=9,y+=6){v.set(s[M+0],s[M+1],s[M+2]),S.set(s[M+3],s[M+4],s[M+5]),x.set(s[M+6],s[M+7],s[M+8]),A.set(a[y+0],a[y+1]),T.set(a[y+2],a[y+3]),C.set(a[y+4],a[y+5]),R.copy(v).add(S).add(x).divideScalar(3);const P=m(R);_(A,y+0,v,P),_(T,y+2,S,P),_(C,y+4,x,P)}}function _(v,S,x,R){R<0&&v.x===1&&(a[S]=v.x-1),x.x===0&&x.z===0&&(a[S]=R/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pl(t.vertices,t.indices,t.radius,t.details)}}class Dl extends Pl{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Dl(t.radius,t.detail)}}class Ll extends mn{constructor(t=1,e=32,n=16,i=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new F,f=new F,d=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const v=[],S=p/n;let x=0;p===0&&a===0?x=.5/e:p===n&&l===Math.PI&&(x=-.5/e);for(let R=0;R<=e;R++){const A=R/e;u.x=-t*Math.cos(i+A*s)*Math.sin(a+S*o),u.y=t*Math.cos(a+S*o),u.z=t*Math.sin(i+A*s)*Math.sin(a+S*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(A+x,1-S),v.push(c++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<e;v++){const S=h[p][v+1],x=h[p][v],R=h[p+1][v],A=h[p+1][v+1];(p!==0||a>0)&&d.push(S,x,A),(p!==n-1||l<Math.PI)&&d.push(x,R,A)}this.setIndex(d),this.setAttribute("position",new Ue(g,3)),this.setAttribute("normal",new Ue(_,3)),this.setAttribute("uv",new Ue(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ll(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Il extends mn{constructor(t=1,e=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],l=[],c=[],h=new F,u=new F,f=new F;for(let d=0;d<=n;d++)for(let g=0;g<=i;g++){const _=g/i*s,m=d/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/i),c.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=i;g++){const _=(i+1)*d+g-1,m=(i+1)*(d-1)+g-1,p=(i+1)*(d-1)+g,v=(i+1)*d+g;a.push(_,m,v),a.push(m,p,v)}this.setIndex(a),this.setAttribute("position",new Ue(o,3)),this.setAttribute("normal",new Ue(l,3)),this.setAttribute("uv",new Ue(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Il(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Sl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Sl);const O0=["Ring","Terrain","Orbs","Tunnel"];function k0(r){let t;try{t=new U0({canvas:r,antialias:!0,alpha:!0})}catch{return{setLayout(){},setMode(){},setHue(){}}}t.setPixelRatio(Math.min(devicePixelRatio,2));const e=new N0,n=new fn(50,1,.1,100);n.position.set(0,2.2,9);const i=new ci;e.add(i);let s=.03;const a=(J=0,vt=.58)=>new Jt().setHSL((s+J)%1,.85,vt),o=72,l=new ci,c=[],h=new Br(.12,1,.12);for(let J=0;J<o;J++){const vt=J/o*Math.PI*2,H=new ze(h,new ki({color:a(J/o*.5)}));H.position.set(Math.cos(vt)*3.2,0,Math.sin(vt)*3.2),H.rotation.y=-vt,l.add(H),c.push(H)}const u=new ze(new Dl(1.1,2),new ki({color:a(0,.6),wireframe:!0}));l.add(u),i.add(l);const f=48,d=30,g=new Ts(18,12,f-1,d-1);g.rotateX(-Math.PI/2);const _=new ze(g,new ki({color:a(.1),wireframe:!0,transparent:!0,opacity:.8}));_.position.set(0,-1.5,-1);const m=Array.from({length:d},()=>new Float32Array(f));i.add(_);const p=new ci,v=new Ll(.16,12,12),S=[];for(let J=0;J<60;J++){const vt=new ze(v,new ki({color:a(J/60*.7)}));vt.userData={ring:J%5,ph:J*.7,sp:.3+J%5*.12},p.add(vt),S.push(vt)}i.add(p);const x=new ci,R=new Il(3,.03,6,48),A=[];for(let J=0;J<22;J++){const vt=new ze(R,new ki({color:a(J/22*.6),transparent:!0}));vt.position.z=-J*1.6,x.add(vt),A.push(vt)}i.add(x);const T=450,C=new mn,M=new Float32Array(T*3);for(let J=0;J<T;J++)M[J*3]=(Math.random()-.5)*26,M[J*3+1]=(Math.random()-.5)*14,M[J*3+2]=(Math.random()-.5)*16-2;C.setAttribute("position",new An(M,3));const y=new F0(C,new du({color:9075711,size:.04,transparent:!0,opacity:.7}));e.add(y);let P="Ring",k="home",N=!0,W={x:0,y:0};const q=performance.now();addEventListener("pointermove",J=>{W.x=J.clientX/innerWidth-.5,W.y=J.clientY/innerHeight-.5}),document.addEventListener("visibilitychange",()=>{N=!document.hidden});const G=()=>{t.setSize(innerWidth,innerHeight,!1),n.aspect=innerWidth/innerHeight,n.updateProjectionMatrix()};addEventListener("resize",G),G();const $=matchMedia("(prefers-reduced-motion: reduce)").matches,B=(J,vt,H)=>J?J[Math.min(J.length-1,Math.floor(Math.pow(vt/H,1.6)*90)+1)]/255:0;function rt(){const J=innerWidth>980;return k==="np"?{x:J?3.6:0,y:J?-2.1:-4.2,s:J?.62:.5,o:J?1:.2}:k==="home"?{x:J?4.6:0,y:J?0:-5.4,s:.82,o:J?1:.3}:{x:0,y:-1,s:1.1,o:.22}}const st={x:0,y:0,s:1,o:1};function gt(){if(requestAnimationFrame(gt),!N)return;const J=(performance.now()-q)/1e3,vt=Dt.levels(),H=Dt.playing&&vt,et=rt();for(const Z of["x","y","s","o"])st[Z]+=(et[Z]-st[Z])*.07;i.position.set(st.x,st.y,0),i.scale.setScalar(st.s),r.style.opacity=st.o,l.visible=P==="Ring",_.visible=P==="Terrain",p.visible=P==="Orbs",x.visible=P==="Tunnel";let pt=0;for(let Z=0;Z<6;Z++)pt+=B(vt,Z,72)/6;if(H||(pt=.1+.05*Math.sin(J*2)),l.visible){for(let Z=0;Z<o;Z++){const bt=B(vt,Z,o),xt=.25+.15*Math.sin(J*1.3+Z*.4),At=.2+(H?bt*3.6:xt);c[Z].scale.y+=(At-c[Z].scale.y)*.35,c[Z].position.y=c[Z].scale.y/2-.4}u.scale.setScalar(1+pt*.5),u.rotation.x=J*.3,u.rotation.y=J*.45,l.rotation.y=$?0:J*.12}if(_.visible){const Z=m.pop();for(let xt=0;xt<f;xt++){const At=H?B(vt,Math.abs(xt-f/2)*2,f):.08+.06*Math.sin(J*2+xt*.4);Z[xt]=At}m.unshift(Z);const bt=g.attributes.position.array;for(let xt=0;xt<d;xt++)for(let At=0;At<f;At++)bt[(xt*f+At)*3+1]=m[d-1-xt][At]*3.2*(1-Math.abs(At-f/2)/f*.8);g.attributes.position.needsUpdate=!0,_.rotation.y=Math.sin(J*.2)*.25}if(p.visible)for(const Z of S){const bt=Z.userData,xt=H?B(vt,bt.ring*12+1,72):.15,At=1.2+bt.ring*.7+xt*1.4,ie=J*bt.sp+bt.ph;Z.position.set(Math.cos(ie)*At,Math.sin(ie*1.3)*(.6+xt),Math.sin(ie)*At),Z.scale.setScalar(1+xt*3)}if(x.visible)for(const Z of A)Z.position.z+=H?.06+pt*.12:.025,Z.position.z>4&&(Z.position.z-=35),Z.scale.setScalar(1+pt*.4),Z.material.opacity=Math.max(0,Math.min(1,1+Z.position.z/32)),Z.rotation.z=J*.2+Z.position.z*.1;y.rotation.y=J*.02,n.position.x+=(W.x*2-n.position.x)*.04,n.position.y+=(2.2-W.y*2-n.position.y)*.04,n.lookAt(st.x*.6,st.y*.4,0),t.render(e,n)}return gt(),{setLayout(J){k=J},setMode(J){P=J},setHue(J){s=J/360,c.forEach((vt,H)=>vt.material.color.copy(a(H/o*.5))),u.material.color.copy(a(0,.6)),_.material.color.copy(a(.1)),S.forEach((vt,H)=>vt.material.color.copy(a(H/60*.7))),A.forEach((vt,H)=>vt.material.color.copy(a(H/22*.6)))}}}let B0=0;function pu(r){let t=2166136261;for(const e of String(r))t^=e.charCodeAt(0),t=Math.imul(t,16777619);return t>>>0}function z0(r){return()=>{r|=0,r=r+1831565813|0;let t=Math.imul(r^r>>>15,1|r);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const V0=r=>pu(r)%360;function Dr(r,t="",e={}){const n=pu(r),i=z0(n),s=n%360,a=(s+40+(n>>3)%80)%360,o="g"+B0++,l=(n>>5)%6;let c="";if(l===0)for(let f=0;f<7;f++)c+=`<circle cx="${70+i()*60}" cy="${60+i()*50}" r="${14+f*14}" fill="none" stroke="hsl(${a} 90% ${60+f*3}% / .55)" stroke-width="${2+i()*5}"/>`;else if(l===1)for(let f=0;f<14;f++){const d=20+i()*110;c+=`<rect x="${12+f*13}" y="${150-d}" width="9" height="${d}" rx="4.5" fill="hsl(${(a+f*6)%360} 90% 62% / .8)"/>`}else if(l===2)for(let f=0;f<5;f++){let d=`M0 ${70+f*14}`;const g=8+i()*22,_=.02+i()*.05,m=i()*6;for(let p=0;p<=200;p+=5)d+=` L${p} ${(70+f*14+Math.sin(p*_*6+m)*g).toFixed(1)}`;c+=`<path d="${d}" fill="none" stroke="hsl(${(a+f*14)%360} 95% 66% / .75)" stroke-width="3" stroke-linecap="round"/>`}else if(l===3){c+=`<circle cx="100" cy="82" r="46" fill="hsl(${a} 95% 62%)"/>`;for(let f=0;f<6;f++)c+=`<rect x="0" y="${92+f*11}" width="200" height="${2+f*1.6}" fill="hsl(${s} 70% 14%)"/>`}else if(l===4)for(let f=0;f<8;f++)for(let d=0;d<8;d++){const g=i()>.35;c+=`<circle cx="${20+d*23}" cy="${18+f*18}" r="${g?5+i()*5:2}" fill="hsl(${(a+d*8)%360} 90% 65% / ${g?.85:.3})"/>`}else for(let f=0;f<6;f++)c+=`<rect x="${i()*120}" y="${i()*100}" width="${40+i()*60}" height="${40+i()*60}" transform="rotate(${i()*90} 100 100)" fill="hsl(${(s+f*25)%360} 90% 60% / .45)"/>`;const h=String(t).split(/\s+/).slice(0,3),u=e.noText?"":h.map((f,d)=>`<text x="12" y="${186-(h.length-1-d)*22}" font-family="Space Grotesk,system-ui,sans-serif" font-weight="800" font-size="21" fill="#fff" opacity=".95">${f.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</text>`).join("");return`<svg class="cv" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="${o}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${s} 80% 52%)"/><stop offset="1" stop-color="hsl(${a} 80% 22%)"/></linearGradient></defs><rect width="200" height="200" fill="url(#${o})"/>${c}<rect y="110" width="200" height="90" fill="#000" opacity=".25"/>${u}</svg>`}function Gn(r){if(r===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return r}function mu(r,t){r.prototype=Object.create(t.prototype),r.prototype.constructor=r,r.__proto__=t}/*!
 * GSAP 3.15.1
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var rn={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},ls={duration:.5,overwrite:!1,delay:0},Ul,Re,ue,dn=1e8,ne=1/dn,cl=Math.PI*2,H0=cl/4,G0=0,_u=Math.sqrt,W0=Math.cos,X0=Math.sin,we=function(t){return typeof t=="string"},_e=function(t){return typeof t=="function"},Zn=function(t){return typeof t=="number"},Nl=function(t){return typeof t>"u"},Un=function(t){return typeof t=="object"},Xe=function(t){return t!==!1},Fl=function(){return typeof window<"u"},Js=function(t){return _e(t)||we(t)},gu=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},Ne=Array.isArray,q0=/random\([^)]+\)/g,$0=/,\s*/g,fh=/(?:-?\.?\d|\.)+/gi,xu=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,mr=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,lo=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,vu=/[+-]=-?[.\d]+/,Y0=/[^,'"\[\]\s]+/gi,j0=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,de,Cn,hl,Ol,sn={},fa={},Mu,yu=function(t){return(fa=Lr(t,sn))&&je},kl=function(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")},cs=function(t,e){return!e&&console.warn(t)},Su=function(t,e){return t&&(sn[t]=e)&&fa&&(fa[t]=e)||sn},hs=function(){return 0},K0={suppressEvents:!0,isStart:!0,kill:!1},aa={suppressEvents:!0,kill:!1},Z0={suppressEvents:!0},Bl={},mi=[],ul={},bu,Qe={},co={},dh=30,oa=[],zl="",Vl=function(t){var e=t[0],n,i;if(Un(e)||_e(e)||(t=[t]),!(n=(e._gsap||{}).harness)){for(i=oa.length;i--&&!oa[i].targetTest(e););n=oa[i]}for(i=t.length;i--;)t[i]&&(t[i]._gsap||(t[i]._gsap=new Xu(t[i],n)))||t.splice(i,1);return t},Wi=function(t){return t._gsap||Vl(pn(t))[0]._gsap},Eu=function(t,e,n){return(n=t[e])&&_e(n)?t[e]():Nl(n)&&t.getAttribute&&t.getAttribute(e)||n},qe=function(t,e){return(t=t.split(",")).forEach(e)||t},xe=function(t){return Math.round(t*1e5)/1e5||0},fe=function(t){return Math.round(t*1e7)/1e7||0},Sr=function(t,e){var n=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),n==="+"?t+i:n==="-"?t-i:n==="*"?t*i:t/i},J0=function(t,e){for(var n=e.length,i=0;t.indexOf(e[i])<0&&++i<n;);return i<n},da=function(){var t=mi.length,e=mi.slice(0),n,i;for(ul={},mi.length=0,n=0;n<t;n++)i=e[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},Hl=function(t){return!!(t._initted||t._startAt||t.add)},Tu=function(t,e,n,i){mi.length&&!Re&&da(),t.render(e,n,!!(Re&&e<0&&Hl(t))),mi.length&&!Re&&da()},Au=function(t){var e=parseFloat(t);return(e||e===0)&&(t+"").match(Y0).length<2?e:we(t)?t.trim():t},wu=function(t){return t},an=function(t,e){for(var n in e)n in t||(t[n]=e[n]);return t},Q0=function(t){return function(e,n){for(var i in n)i in e||i==="duration"&&t||i==="ease"||(e[i]=n[i])}},Lr=function(t,e){for(var n in e)t[n]=e[n];return t},ph=function r(t,e){for(var n in e)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(t[n]=Un(e[n])?r(t[n]||(t[n]={}),e[n]):e[n]);return t},pa=function(t,e){var n={},i;for(i in t)i in e||(n[i]=t[i]);return n},ns=function(t){var e=t.parent||de,n=t.keyframes?Q0(Ne(t.keyframes)):an;if(Xe(t.inherit))for(;e;)n(t,e.vars.defaults),e=e.parent||e._dp;return t},tx=function(t,e){for(var n=t.length,i=n===e.length;i&&n--&&t[n]===e[n];);return n<0},Ru=function(t,e,n,i,s){var a=t[i],o;if(s)for(o=e[s];a&&a[s]>o;)a=a._prev;return a?(e._next=a._next,a._next=e):(e._next=t[n],t[n]=e),e._next?e._next._prev=e:t[i]=e,e._prev=a,e.parent=e._dp=t,e},Aa=function(t,e,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var s=e._prev,a=e._next;s?s._next=a:t[n]===e&&(t[n]=a),a?a._prev=s:t[i]===e&&(t[i]=s),e._next=e._prev=e.parent=null},vi=function(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0},Xi=function(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var n=t;n;)n._dirty=1,n=n.parent;return t},ex=function(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t},fl=function(t,e,n,i){return t._startAt&&(Re?t._startAt.revert(aa):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))},nx=function r(t){return!t||t._ts&&r(t.parent)},mh=function(t){return t._repeat?Ir(t._tTime,t=t.duration()+t._rDelay)*t:0},Ir=function(t,e){var n=Math.floor(t=fe(t/e));return t&&n===t?n-1:n},ma=function(t,e){return(t-e._start)*e._ts+(e._ts>=0?0:e._dirty?e.totalDuration():e._tDur)},wa=function(t){return t._end=fe(t._start+(t._tDur/Math.abs(t._ts||t._rts||ne)||0))},Ra=function(t,e){var n=t._dp;return n&&n.smoothChildTiming&&t._ts&&(t._start=fe(n._time-(t._ts>0?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),wa(t),n._dirty||Xi(n,t)),t},Cu=function(t,e){var n;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(n=ma(t.rawTime(),e),(!e._dur||As(0,e.totalDuration(),n)-e._tTime>ne)&&e.render(n,!0)),Xi(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(n=t;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;t._zTime=-ne}},Dn=function(t,e,n,i){return e.parent&&vi(e),e._start=fe((Zn(n)?n:!n&&_a(e)&&(!t._last||t._last._start>=t._time)?t._last?t._last._start:t._time:n||t!==de?hn(t,n,e):t._time)+e._delay),e._end=fe(e._start+(e.totalDuration()/Math.abs(e.timeScale())||0)),Ru(t,e,"_first","_last",t._sort?"_start":0),_a(e)||(t._recent=e),i||Cu(t,e),t._ts<0&&Ra(t,t._tTime),t},Pu=function(t,e){return(sn.ScrollTrigger||kl("scrollTrigger",e))&&sn.ScrollTrigger.create(e,t)},Du=function(t,e,n,i,s){if(Wl(t,e,s),!t._initted)return 1;if(!n&&t._pt&&!Re&&(t._dur&&t.vars.lazy!==!1||!t._dur&&t.vars.lazy)&&bu!==tn.frame)return mi.push(t),t._lazy=[s,i],1},ix=function r(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||r(e))},_a=function(t){var e=t.data;return e==="isFromStart"||e==="isStart"},rx=function(t,e,n,i){var s=t.ratio,a=e<0||!e&&(!t._start&&ix(t)&&!(!t._initted&&_a(t))||(t._ts<0||t._dp._ts<0)&&!_a(t))?0:1,o=t._rDelay,l=0,c,h,u;if(o&&t._repeat&&(l=As(0,t._tDur,e),h=Ir(l,o),t._yoyo&&h&1&&(a=1-a),h!==Ir(t._tTime,o)&&(s=1-a,t.vars.repeatRefresh&&t._initted&&t.invalidate())),a!==s||Re||i||t._zTime===ne||!e&&t._zTime){if(!t._initted&&Du(t,e,i,n,l))return;for(u=t._zTime,t._zTime=e||(n?ne:0),n||(n=e&&!u),t.ratio=a,t._from&&(a=1-a),t._time=0,t._tTime=l,c=t._pt;c;)c.r(a,c.d),c=c._next;e<0&&fl(t,e,n,!0),t._onUpdate&&!n&&en(t,"onUpdate"),l&&t._repeat&&!n&&t.parent&&en(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===a&&(a&&vi(t,1),!n&&!Re&&(en(t,a?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)},sx=function(t,e,n){var i;if(n>e)for(i=t._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<e)return i;i=i._prev}},Ur=function(t,e,n,i){var s=t._repeat,a=fe(e)||0,o=t._tTime/t._tDur;return o&&!i&&(t._time*=a/t._dur),t._dur=a,t._tDur=s?s<0?1e10:fe(a*(s+1)+t._rDelay*s):a,o>0&&!i&&Ra(t,t._tTime=t._tDur*o),t.parent&&wa(t),n||Xi(t.parent,t),t},_h=function(t){return t instanceof Ve?Xi(t):Ur(t,t._dur)},ax={_start:0,endTime:hs,totalDuration:hs},hn=function r(t,e,n){var i=t.labels,s=t._recent||ax,a=t.duration()>=dn?s.endTime(!1):t._dur,o,l,c;return we(e)&&(isNaN(e)||e in i)?(l=e.charAt(0),c=e.substr(-1)==="%",o=e.indexOf("="),l==="<"||l===">"?(o>=0&&(e=e.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(e.substr(1))||0)*(c?(o<0?s:n).totalDuration()/100:1)):o<0?(e in i||(i[e]=a),i[e]):(l=parseFloat(e.charAt(o-1)+e.substr(o+1)),c&&n&&(l=l/100*(Ne(n)?n[0]:n).totalDuration()),o>1?r(t,e.substr(0,o-1),n)+l:a+l)):e==null?a:+e},is=function(t,e,n){var i=Zn(e[1]),s=(i?2:1)+(t<2?0:1),a=e[s],o,l;if(i&&(a.duration=e[1]),a.parent=n,t){for(o=a,l=n;l&&!("immediateRender"in o);)o=l.vars.defaults||{},l=Xe(l.vars.inherit)&&l.parent;a.immediateRender=Xe(o.immediateRender),t<2?a.runBackwards=1:a.startAt=e[s-1]}return new Se(e[0],a,e[s+1])},Si=function(t,e){return t||t===0?e(t):e},As=function(t,e,n){return n<t?t:n>e?e:n},Ie=function(t,e){return!we(t)||!(e=j0.exec(t))?"":e[1]},ox=function(t,e,n){return Si(n,function(i){return As(t,e,i)})},dl=[].slice,Lu=function(t,e){return t&&Un(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&Un(t[0]))&&!t.nodeType&&t!==Cn},lx=function(t,e,n){return n===void 0&&(n=[]),t.forEach(function(i){var s;return we(i)&&!e||Lu(i,1)?(s=n).push.apply(s,pn(i)):n.push(i)})||n},pn=function(t,e,n){return ue&&!e&&ue.selector?ue.selector(t):we(t)&&!n&&(hl||!Nr())?dl.call((e||Ol).querySelectorAll(t),0):Ne(t)?lx(t,n):Lu(t)?dl.call(t,0):t?[t]:[]},pl=function(t){return t=pn(t)[0]||cs("Invalid scope")||{},function(e){var n=t.current||t.nativeElement||t;return pn(e,n.querySelectorAll?n:n===t?cs("Invalid scope")||Ol.createElement("div"):t)}},Iu=function(t){return t.sort(function(){return .5-Math.random()})},Uu=function(t){if(_e(t))return t;var e=Un(t)?t:{each:t},n=qi(e.ease),i=e.from||0,s=parseFloat(e.base)||0,a={},o=i>0&&i<1,l=isNaN(i)||o,c=e.axis,h=i,u=i;return we(i)?h=u={center:.5,edges:.5,end:1}[i]||0:!o&&l&&(h=i[0],u=i[1]),function(f,d,g){var _=(g||e).length,m=a[_],p,v,S,x,R,A,T,C,M;if(!m){if(M=e.grid==="auto"?0:(e.grid||[1,dn])[1],!M){for(T=-dn;T<(T=g[M++].getBoundingClientRect().left)&&M<_;);M<_&&M--}for(m=a[_]=[],p=l?Math.min(M,_)*h-.5:i%M,v=M===dn?0:l?_*u/M-.5:i/M|0,T=0,C=dn,A=0;A<_;A++)S=A%M-p,x=v-(A/M|0),m[A]=R=c?Math.abs(c==="y"?x:S):_u(S*S+x*x),R>T&&(T=R),R<C&&(C=R);i==="random"&&Iu(m),m.max=T-C,m.min=C,m.v=_=(parseFloat(e.amount)||parseFloat(e.each)*(M>_?_-1:c?c==="y"?_/M:M:Math.max(M,_/M))||0)*(i==="edges"?-1:1),m.b=_<0?s-_:s,m.u=Ie(e.amount||e.each)||0,n=n&&_<0?yx(n):n}return _=(m[f]-m.min)/m.max||0,fe(m.b+(n?n(_):_)*m.v)+m.u}},ml=function(t){var e=Math.pow(10,((t+"").split(".")[1]||"").length);return function(n){var i=fe(Math.round(parseFloat(n)/t)*t*e);return(i-i%1)/e+(Zn(n)?0:Ie(n))}},Nu=function(t,e){var n=Ne(t),i,s;return!n&&Un(t)&&(i=n=t.radius||dn,t.values?(t=pn(t.values),(s=!Zn(t[0]))&&(i*=i)):t=ml(t.increment)),Si(e,n?_e(t)?function(a){return s=t(a),Math.abs(s-a)<=i?s:a}:function(a){for(var o=parseFloat(s?a.x:a),l=parseFloat(s?a.y:0),c=dn,h=0,u=t.length,f,d;u--;)s?(f=t[u].x-o,d=t[u].y-l,f=f*f+d*d):f=Math.abs(t[u]-o),f<c&&(c=f,h=u);return h=!i||c<=i?t[h]:a,s||h===a||Zn(a)?h:h+Ie(a)}:ml(t))},Fu=function(t,e,n,i){return Si(Ne(t)?!e:n===!0?!!(n=0):!i,function(){return Ne(t)?t[~~(Math.random()*t.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((t-n/2+Math.random()*(e-t+n*.99))/n)*n*i)/i})},cx=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(i){return e.reduce(function(s,a){return a(s)},i)}},hx=function(t,e){return function(n){return t(parseFloat(n))+(e||Ie(n))}},ux=function(t,e,n){return ku(t,e,0,1,n)},Ou=function(t,e,n){return Si(n,function(i){return t[~~e(i)]})},fx=function r(t,e,n){var i=e-t;return Ne(t)?Ou(t,r(0,t.length),e):Si(n,function(s){return(i+(s-t)%i)%i+t})},dx=function r(t,e,n){var i=e-t,s=i*2;return Ne(t)?Ou(t,r(0,t.length-1),e):Si(n,function(a){return a=(s+(a-t)%s)%s||0,t+(a>i?s-a:a)})},us=function(t){return t.replace(q0,function(e){var n=e.indexOf("[")+1,i=e.substring(n||7,n?e.indexOf("]"):e.length-1).split($0);return Fu(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},ku=function(t,e,n,i,s){var a=e-t,o=i-n;return Si(s,function(l){return n+((l-t)/a*o||0)})},px=function r(t,e,n,i){var s=isNaN(t+e)?0:function(d){return(1-d)*t+d*e};if(!s){var a=we(t),o={},l,c,h,u,f;if(n===!0&&(i=1)&&(n=null),a)t={p:t},e={p:e};else if(Ne(t)&&!Ne(e)){for(h=[],u=t.length,f=u-2,c=1;c<u;c++)h.push(r(t[c-1],t[c]));u--,s=function(g){g*=u;var _=Math.min(f,~~g);return h[_](g-_)},n=e}else i||(t=Lr(Ne(t)?[]:{},t));if(!h){for(l in e)Gl.call(o,t,l,"get",e[l]);s=function(g){return $l(g,o)||(a?t.p:t)}}}return Si(n,s)},gh=function(t,e,n){var i=t.labels,s=dn,a,o,l;for(a in i)o=i[a]-e,o<0==!!n&&o&&s>(o=Math.abs(o))&&(l=a,s=o);return l},en=function(t,e,n){var i=t.vars,s=i[e],a=ue,o=t._ctx,l,c,h;if(s)return l=i[e+"Params"],c=i.callbackScope||t,n&&mi.length&&da(),o&&(ue=o),h=l?s.apply(c,l):s.call(c),ue=a,h},Qr=function(t){return vi(t),t.scrollTrigger&&t.scrollTrigger.kill(!!Re),t.progress()<1&&en(t,"onInterrupt"),t},_r,Bu=[],zu=function(t){if(t)if(t=!t.name&&t.default||t,Fl()||t.headless){var e=t.name,n=_e(t),i=e&&!n&&t.init?function(){this._props=[]}:t,s={init:hs,render:$l,add:Gl,kill:Dx,modifier:Px,rawVars:0},a={targetTest:0,get:0,getSetter:ql,aliases:{},register:0};if(Nr(),t!==i){if(Qe[e])return;an(i,an(pa(t,s),a)),Lr(i.prototype,Lr(s,pa(t,a))),Qe[i.prop=e]=i,t.targetTest&&(oa.push(i),Bl[e]=1),e=(e==="css"?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}Su(e,i),t.register&&t.register(je,i,$e)}else Bu.push(t)},re=255,ts={aqua:[0,re,re],lime:[0,re,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,re],navy:[0,0,128],white:[re,re,re],olive:[128,128,0],yellow:[re,re,0],orange:[re,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[re,0,0],pink:[re,192,203],cyan:[0,re,re],transparent:[re,re,re,0]},ho=function(t,e,n){return t+=t<0?1:t>1?-1:0,(t*6<1?e+(n-e)*t*6:t<.5?n:t*3<2?e+(n-e)*(2/3-t)*6:e)*re+.5|0},Vu=function(t,e,n){var i=t?Zn(t)?[t>>16,t>>8&re,t&re]:0:ts.black,s,a,o,l,c,h,u,f,d,g;if(!i){if(t.substr(-1)===","&&(t=t.substr(0,t.length-1)),ts[t])i=ts[t];else if(t.charAt(0)==="#"){if(t.length<6&&(s=t.charAt(1),a=t.charAt(2),o=t.charAt(3),t="#"+s+s+a+a+o+o+(t.length===5?t.charAt(4)+t.charAt(4):"")),t.length===9)return i=parseInt(t.substr(1,6),16),[i>>16,i>>8&re,i&re,parseInt(t.substr(7),16)/255];t=parseInt(t.substr(1),16),i=[t>>16,t>>8&re,t&re]}else if(t.substr(0,3)==="hsl"){if(i=g=t.match(fh),!e)l=+i[0]%360/360,c=+i[1]/100,h=+i[2]/100,a=h<=.5?h*(c+1):h+c-h*c,s=h*2-a,i.length>3&&(i[3]*=1),i[0]=ho(l+1/3,s,a),i[1]=ho(l,s,a),i[2]=ho(l-1/3,s,a);else if(~t.indexOf("="))return i=t.match(xu),n&&i.length<4&&(i[3]=1),i}else i=t.match(fh)||ts.transparent;i=i.map(Number)}return e&&!g&&(s=i[0]/re,a=i[1]/re,o=i[2]/re,u=Math.max(s,a,o),f=Math.min(s,a,o),h=(u+f)/2,u===f?l=c=0:(d=u-f,c=h>.5?d/(2-u-f):d/(u+f),l=u===s?(a-o)/d+(a<o?6:0):u===a?(o-s)/d+2:(s-a)/d+4,l*=60),i[0]=~~(l+.5),i[1]=~~(c*100+.5),i[2]=~~(h*100+.5)),n&&i.length<4&&(i[3]=1),i},Hu=function(t){var e=[],n=[],i=-1;return t.split(_i).forEach(function(s){var a=s.match(mr)||[];e.push.apply(e,a),n.push(i+=a.length+1)}),e.c=n,e},xh=function(t,e,n){var i="",s=(t+i).match(_i),a=e?"hsla(":"rgba(",o=0,l,c,h,u;if(!s)return t;if(s=s.map(function(f){return(f=Vu(f,e,1))&&a+(e?f[0]+","+f[1]+"%,"+f[2]+"%,"+f[3]:f.join(","))+")"}),n&&(h=Hu(t),l=n.c,l.join(i)!==h.c.join(i)))for(c=t.replace(_i,"1").split(mr),u=c.length-1;o<u;o++)i+=c[o]+(~l.indexOf(o)?s.shift()||a+"0,0,0,0)":(h.length?h:s.length?s:n).shift());if(!c)for(c=t.split(_i),u=c.length-1;o<u;o++)i+=c[o]+s[o];return i+c[u]},_i=(function(){var r="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",t;for(t in ts)r+="|"+t+"\\b";return new RegExp(r+")","gi")})(),mx=/hsl[a]?\(/,Gu=function(t){var e=t.join(" "),n;if(_i.lastIndex=0,_i.test(e))return n=mx.test(e),t[1]=xh(t[1],n),t[0]=xh(t[0],n,Hu(t[1])),!0},fs,tn=(function(){var r=Date.now,t=500,e=33,n=r(),i=n,s=1e3/240,a=s,o=[],l,c,h,u,f,d,g=function _(m){var p=r()-i,v=m===!0,S,x,R,A;if((p>t||p<0)&&(n+=p-e),i+=p,R=i-n,S=R-a,(S>0||v)&&(A=++u.frame,f=R-u.time*1e3,u.time=R=R/1e3,a+=S+(S>=s?0:s-S),x=1),v||(l=c(_)),x)for(d=0;d<o.length;d++)o[d](R,f,A,m)};return u={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(m){return f/(1e3/(m||60))},wake:function(){Mu&&(!hl&&Fl()&&(Cn=hl=window,Ol=Cn.document||{},sn.gsap=je,(Cn.gsapVersions||(Cn.gsapVersions=[])).push(je.version),yu(fa||Cn.GreenSockGlobals||!Cn.gsap&&Cn||{}),Bu.forEach(zu)),h=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&u.sleep(),c=h||function(m){return setTimeout(m,a-u.time*1e3+1|0)},fs=1,g(2))},sleep:function(){(h?cancelAnimationFrame:clearTimeout)(l),fs=0,c=hs},lagSmoothing:function(m,p){t=m||1/0,e=Math.min(p||33,t)},fps:function(m){s=1e3/(m||240),a=u.time*1e3+s},add:function(m,p,v){var S=p?function(x,R,A,T){m(x,R,A,T),u.remove(S)}:m;return u.remove(m),o[v?"unshift":"push"](S),Nr(),S},remove:function(m,p){~(p=o.indexOf(m))&&o.splice(p,1)&&d>=p&&d--},_listeners:o},u})(),Nr=function(){return!fs&&tn.wake()},zt={},_x=/^[\d.\-M][\d.\-,\s]/,gx=/["']/g,xx=function(t){for(var e={},n=t.substr(1,t.length-3).split(":"),i=n[0],s=1,a=n.length,o,l,c;s<a;s++)l=n[s],o=s!==a-1?l.lastIndexOf(","):l.length,c=l.substr(0,o),e[i]=isNaN(c)?c.replace(gx,"").trim():+c,i=l.substr(o+1).trim();return e},vx=function(t){var e=t.indexOf("(")+1,n=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<n?t.indexOf(")",n+1):n)},Mx=function(t){var e=(t+"").split("("),n=zt[e[0]];return n&&e.length>1&&n.config?n.config.apply(null,~t.indexOf("{")?[xx(e[1])]:vx(t).split(",").map(Au)):zt._CE&&_x.test(t)?zt._CE("",t):n},yx=function(t){return function(e){return 1-t(1-e)}},qi=function(t,e){return t&&(_e(t)?t:zt[t]||Mx(t))||e},Zi=function(t,e,n,i){n===void 0&&(n=function(l){return 1-e(1-l)}),i===void 0&&(i=function(l){return l<.5?e(l*2)/2:1-e((1-l)*2)/2});var s={easeIn:e,easeOut:n,easeInOut:i},a;return qe(t,function(o){zt[o]=sn[o]=s,zt[a=o.toLowerCase()]=n;for(var l in s)zt[a+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=zt[o+"."+l]=s[l]}),s},Wu=function(t){return function(e){return e<.5?(1-t(1-e*2))/2:.5+t((e-.5)*2)/2}},uo=function r(t,e,n){var i=e>=1?e:1,s=(n||(t?.3:.45))/(e<1?e:1),a=s/cl*(Math.asin(1/i)||0),o=function(h){return h===1?1:i*Math.pow(2,-10*h)*X0((h-a)*s)+1},l=t==="out"?o:t==="in"?function(c){return 1-o(1-c)}:Wu(o);return s=cl/s,l.config=function(c,h){return r(t,c,h)},l},fo=function r(t,e){e===void 0&&(e=1.70158);var n=function(a){return a?--a*a*((e+1)*a+e)+1:0},i=t==="out"?n:t==="in"?function(s){return 1-n(1-s)}:Wu(n);return i.config=function(s){return r(t,s)},i};qe("Linear,Quad,Cubic,Quart,Quint,Strong",function(r,t){var e=t<5?t+1:t;Zi(r+",Power"+(e-1),t?function(n){return Math.pow(n,e)}:function(n){return n},function(n){return 1-Math.pow(1-n,e)},function(n){return n<.5?Math.pow(n*2,e)/2:1-Math.pow((1-n)*2,e)/2})});zt.Linear.easeNone=zt.none=zt.Linear.easeIn;Zi("Elastic",uo("in"),uo("out"),uo());(function(r,t){var e=1/t,n=2*e,i=2.5*e,s=function(o){return o<e?r*o*o:o<n?r*Math.pow(o-1.5/t,2)+.75:o<i?r*(o-=2.25/t)*o+.9375:r*Math.pow(o-2.625/t,2)+.984375};Zi("Bounce",function(a){return 1-s(1-a)},s)})(7.5625,2.75);Zi("Expo",function(r){return Math.pow(2,10*(r-1))*r+r*r*r*r*r*r*(1-r)});Zi("Circ",function(r){return-(_u(1-r*r)-1)});Zi("Sine",function(r){return r===1?1:-W0(r*H0)+1});Zi("Back",fo("in"),fo("out"),fo());zt.SteppedEase=zt.steps=sn.SteppedEase={config:function(t,e){t===void 0&&(t=1);var n=1/t,i=t+(e?0:1),s=e?1:0,a=1-ne;return function(o){return((i*As(0,a,o)|0)+s)*n}}};ls.ease=zt["quad.out"];qe("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(r){return zl+=r+","+r+"Params,"});var Xu=function(t,e){this.id=G0++,t._gsap=this,this.target=t,this.harness=e,this.get=e?e.get:Eu,this.set=e?e.getSetter:ql},ds=(function(){function r(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,Ur(this,+e.duration,1,1),this.data=e.data,ue&&(this._ctx=ue,ue.data.push(this)),fs||tn.wake()}var t=r.prototype;return t.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},t.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},t.totalDuration=function(n){return arguments.length?(this._dirty=0,Ur(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(n,i){if(Nr(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(Ra(this,n),!s._dp||s.parent||Cu(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&Dn(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===ne||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),Tu(this,n,i)),this},t.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+mh(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},t.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+mh(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},t.iteration=function(n,i){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*s,i):this._repeat?Ir(this._tTime,s)+1:1},t.timeScale=function(n,i){if(!arguments.length)return this._rts===-ne?0:this._rts;if(this._rts===n)return this;var s=this.parent&&this._ts?ma(this.parent._time,this):this._tTime,a=this._rts<0;this._rts=+n||0,this._ts=this._ps||n===-ne?0:this._rts;var o=this.totalDuration();return(a!==this._rts<0||s>0&&s<o)&&this.totalTime(As(-Math.abs(this._delay),o,s),i!==!1),wa(this),ex(this)},t.paused=function(n){if(!arguments.length)return this._ps;if(this._ps!==n)if(this._ps=n,n)this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0;else{Nr(),this._ts=this._rts;var i=this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,s=this.progress()===1&&Math.abs(this._zTime)!==ne,a;if(s)for(this._tTime-=ne,a=this._first;a;){if(!a._dur&&a._zTime<0&&a._ts&&a._start<=i+ne){s=!1;break}a=a._next}this.totalTime(i,s)}return this},t.startTime=function(n){if(arguments.length){this._start=fe(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&Dn(i,this,this._start-this._delay),this}return this._start},t.endTime=function(n){return this._start+(Xe(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?ma(i.rawTime(n),this):this._tTime:this._tTime},t.revert=function(n){n===void 0&&(n=Z0);var i=Re;return Re=n,Hl(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),Re=i,this},t.globalTime=function(n){for(var i=this,s=arguments.length?n:i.rawTime();i;)s=i._start+s/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):s},t.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,_h(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,_h(this),i?this.time(i):this}return this._rDelay},t.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},t.seek=function(n,i){return this.totalTime(hn(this,n),Xe(i))},t.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,Xe(i)),this._dur||(this._zTime=-ne),this},t.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},t.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},t.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-ne:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-ne,this},t.isActive=function(){var n=this.parent||this._dp,i=this._start,s;return!!(!n||this._ts&&this._initted&&n.isActive()&&(s=n.rawTime(!0))>=i&&s<this.endTime(!0)-ne)},t.eventCallback=function(n,i,s){var a=this.vars;return arguments.length>1?(i?(a[n]=i,s&&(a[n+"Params"]=s),n==="onUpdate"&&(this._onUpdate=i)):delete a[n],this):a[n]},t.then=function(n){var i=this,s=i._prom;return new Promise(function(a){var o=_e(n)?n:wu,l=function(){var h=i.then;i.then=null,s&&s(),_e(o)&&(o=o(i))&&(o.then||o===i)&&(i.then=h),a(o),i.then=h};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},t.kill=function(){Qr(this)},r})();an(ds.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-ne,_prom:0,_ps:!1,_rts:1});var Ve=(function(r){mu(t,r);function t(n,i){var s;return n===void 0&&(n={}),s=r.call(this,n)||this,s.labels={},s.smoothChildTiming=!!n.smoothChildTiming,s.autoRemoveChildren=!!n.autoRemoveChildren,s._sort=Xe(n.sortChildren),de&&Dn(n.parent||de,Gn(s),i),n.reversed&&s.reverse(),n.paused&&s.paused(!0),n.scrollTrigger&&Pu(Gn(s),n.scrollTrigger),s}var e=t.prototype;return e.to=function(i,s,a){return is(0,arguments,this),this},e.from=function(i,s,a){return is(1,arguments,this),this},e.fromTo=function(i,s,a,o){return is(2,arguments,this),this},e.set=function(i,s,a){return s.duration=0,s.parent=this,ns(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new Se(i,s,hn(this,a),1),this},e.call=function(i,s,a){return Dn(this,Se.delayedCall(0,i,s),a)},e.staggerTo=function(i,s,a,o,l,c,h){return a.duration=s,a.stagger=a.stagger||o,a.onComplete=c,a.onCompleteParams=h,a.parent=this,new Se(i,a,hn(this,l)),this},e.staggerFrom=function(i,s,a,o,l,c,h){return a.runBackwards=1,ns(a).immediateRender=Xe(a.immediateRender),this.staggerTo(i,s,a,o,l,c,h)},e.staggerFromTo=function(i,s,a,o,l,c,h,u){return o.startAt=a,ns(o).immediateRender=Xe(o.immediateRender),this.staggerTo(i,s,o,l,c,h,u)},e.render=function(i,s,a){var o=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,h=i<=0?0:fe(i),u=this._zTime<0!=i<0&&(this._initted||!c),f,d,g,_,m,p,v,S,x,R,A,T;if(this!==de&&h>l&&i>=0&&(h=l),h!==this._tTime||a||u){if(o!==this._time&&c&&(h+=this._time-o,i+=this._time-o),f=h,x=this._start,S=this._ts,p=!S,u&&(c||(o=this._zTime),(i||!s)&&(this._zTime=i)),this._repeat){if(A=this._yoyo,m=c+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(m*100+i,s,a);if(f=fe(h%m),h===l?(_=this._repeat,f=c):(R=fe(h/m),_=~~R,_&&_===R&&(f=c,_--),f>c&&(f=c)),R=Ir(this._tTime,m),!o&&this._tTime&&R!==_&&this._tTime-R*m-this._dur<=0&&(R=_),A&&_&1&&(f=c-f,T=1),_!==R&&!this._lock){var C=A&&R&1,M=C===(A&&_&1);if(_<R&&(C=!C),o=C?0:h%c?c:h,this._lock=1,this.render(o||(T?0:fe(_*m)),s,!c)._lock=0,this._tTime=h,!s&&this.parent&&en(this,"onRepeat"),this.vars.repeatRefresh&&!T&&(this.invalidate()._lock=1,R=_),o&&o!==this._time||p!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,M&&(this._lock=2,o=C?c:-1e-4,this.render(o,!0),this.vars.repeatRefresh&&!T&&this.invalidate()),this._lock=0,!this._ts&&!p)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(v=sx(this,fe(o),fe(f)),v&&(h-=f-(f=v._start))),this._tTime=h,this._time=f,this._act=!!S,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,o=0),!o&&h&&c&&!s&&!R&&(en(this,"onStart"),this._tTime!==h))return this;if(f>=o&&i>=0)for(d=this._first;d;){if(g=d._next,(d._act||f>=d._start)&&d._ts&&v!==d){if(d.parent!==this)return this.render(i,s,a);if(d.render(d._ts>0?(f-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(f-d._start)*d._ts,s,a),f!==this._time||!this._ts&&!p){v=0,g&&(h+=this._zTime=-ne);break}}d=g}else{d=this._last;for(var y=i<0?i:f;d;){if(g=d._prev,(d._act||y<=d._end)&&d._ts&&v!==d){if(d.parent!==this)return this.render(i,s,a);if(d.render(d._ts>0?(y-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(y-d._start)*d._ts,s,a||Re&&Hl(d)),f!==this._time||!this._ts&&!p){v=0,g&&(h+=this._zTime=y?-ne:ne);break}}d=g}}if(v&&!s&&(this.pause(),v.render(f>=o?0:-ne)._zTime=f>=o?1:-1,this._ts))return this._start=x,wa(this),this.render(i,s,a);this._onUpdate&&!s&&en(this,"onUpdate",!0),(h===l&&this._tTime>=this.totalDuration()||!h&&o)&&(x===this._start||Math.abs(S)!==Math.abs(this._ts))&&(this._lock||((i||!c)&&(h===l&&this._ts>0||!h&&this._ts<0)&&vi(this,1),!s&&!(i<0&&!o)&&(h||o||!l)&&(en(this,h===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom())))}return this},e.add=function(i,s){var a=this;if(Zn(s)||(s=hn(this,s,i)),!(i instanceof ds)){if(Ne(i))return i.forEach(function(o){return a.add(o,s)}),this;if(we(i))return this.addLabel(i,s);if(_e(i))i=Se.delayedCall(0,i);else return this}return this!==i?Dn(this,i,s):this},e.getChildren=function(i,s,a,o){i===void 0&&(i=!0),s===void 0&&(s=!0),a===void 0&&(a=!0),o===void 0&&(o=-dn);for(var l=[],c=this._first;c;)c._start>=o&&(c instanceof Se?s&&l.push(c):(a&&l.push(c),i&&l.push.apply(l,c.getChildren(!0,s,a)))),c=c._next;return l},e.getById=function(i){for(var s=this.getChildren(1,1,1),a=s.length;a--;)if(s[a].vars.id===i)return s[a]},e.remove=function(i){return we(i)?this.removeLabel(i):_e(i)?this.killTweensOf(i):(i.parent===this&&Aa(this,i),i===this._recent&&(this._recent=this._last),Xi(this))},e.totalTime=function(i,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=fe(tn.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),r.prototype.totalTime.call(this,i,s),this._forcing=0,this):this._tTime},e.addLabel=function(i,s){return this.labels[i]=hn(this,s),this},e.removeLabel=function(i){return delete this.labels[i],this},e.addPause=function(i,s,a){var o=Se.delayedCall(0,s||hs,a);return o.data="isPause",this._hasPause=1,Dn(this,o,hn(this,i))},e.removePause=function(i){var s=this._first;for(i=hn(this,i);s;)s._start===i&&s.data==="isPause"&&vi(s),s=s._next},e.killTweensOf=function(i,s,a){for(var o=this.getTweensOf(i,a),l=o.length;l--;)hi!==o[l]&&o[l].kill(i,s);return this},e.getTweensOf=function(i,s){for(var a=[],o=pn(i),l=this._first,c=Zn(s),h;l;)l instanceof Se?J0(l._targets,o)&&(c?(!hi||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&a.push(l):(h=l.getTweensOf(o,s)).length&&a.push.apply(a,h),l=l._next;return a},e.tweenTo=function(i,s){s=s||{};var a=this,o=hn(a,i),l=s,c=l.startAt,h=l.onStart,u=l.onStartParams,f=l.immediateRender,d,g=Se.to(a,an({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:o,overwrite:"auto",duration:s.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale())||ne,onStart:function(){if(a.pause(),!d){var m=s.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale());g._dur!==m&&Ur(g,m,0,1).render(g._time,!0,!0),d=1}h&&h.apply(g,u||[])}},s));return f?g.render(0):g},e.tweenFromTo=function(i,s,a){return this.tweenTo(s,an({startAt:{time:hn(this,i)}},a))},e.recent=function(){return this._recent},e.nextLabel=function(i){return i===void 0&&(i=this._time),gh(this,hn(this,i))},e.previousLabel=function(i){return i===void 0&&(i=this._time),gh(this,hn(this,i),1)},e.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+ne)},e.shiftChildren=function(i,s,a){a===void 0&&(a=0);var o=this._first,l=this.labels,c;for(i=fe(i);o;)o._start>=a&&(o._start+=i,o._end+=i),o=o._next;if(s)for(c in l)l[c]>=a&&(l[c]+=i);return Xi(this)},e.invalidate=function(i){var s=this._first;for(this._lock=0;s;)s.invalidate(i),s=s._next;return r.prototype.invalidate.call(this,i)},e.clear=function(i){i===void 0&&(i=!0);for(var s=this._first,a;s;)a=s._next,this.remove(s),s=a;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),Xi(this)},e.totalDuration=function(i){var s=0,a=this,o=a._last,l=dn,c,h,u;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-i:i));if(a._dirty){for(u=a.parent;o;)c=o._prev,o._dirty&&o.totalDuration(),h=o._start,h>l&&a._sort&&o._ts&&!a._lock?(a._lock=1,Dn(a,o,h-o._delay,1)._lock=0):l=h,h<0&&o._ts&&(s-=h,(!u&&!a._dp||u&&u.smoothChildTiming)&&(a._start+=fe(h/a._ts),a._time-=h,a._tTime-=h),a.shiftChildren(-h,!1,-1/0),l=0),o._end>s&&o._ts&&(s=o._end),o=c;Ur(a,a===de&&a._time>s?a._time:s,1,1),a._dirty=0}return a._tDur},t.updateRoot=function(i){if(de._ts&&(Tu(de,ma(i,de)),bu=tn.frame),tn.frame>=dh){dh+=rn.autoSleep||120;var s=de._first;if((!s||!s._ts)&&rn.autoSleep&&tn._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||tn.sleep()}}},t})(ds);an(Ve.prototype,{_lock:0,_hasPause:0,_forcing:0});var Sx=function(t,e,n,i,s,a,o){var l=new $e(this._pt,t,e,0,1,Ku,null,s),c=0,h=0,u,f,d,g,_,m,p,v;for(l.b=n,l.e=i,n+="",i+="",(p=~i.indexOf("random("))&&(i=us(i)),a&&(v=[n,i],a(v,t,e),n=v[0],i=v[1]),f=n.match(lo)||[];u=lo.exec(i);)g=u[0],_=i.substring(c,u.index),d?d=(d+1)%5:_.substr(-5)==="rgba("&&(d=1),g!==f[h++]&&(m=parseFloat(f[h-1])||0,l._pt={_next:l._pt,p:_||h===1?_:",",s:m,c:g.charAt(1)==="="?Sr(m,g)-m:parseFloat(g)-m,m:d&&d<4?Math.round:0},c=lo.lastIndex);return l.c=c<i.length?i.substring(c,i.length):"",l.fp=o,(vu.test(i)||p)&&(l.e=0),this._pt=l,l},Gl=function(t,e,n,i,s,a,o,l,c,h){_e(i)&&(i=i(s||0,t,a));var u=t[e],f=n!=="get"?n:_e(u)?c?t[e.indexOf("set")||!_e(t["get"+e.substr(3)])?e:"get"+e.substr(3)](c):t[e]():u,d=_e(u)?c?wx:Yu:Xl,g;if(we(i)&&(~i.indexOf("random(")&&(i=us(i)),i.charAt(1)==="="&&(g=Sr(f,i)+(Ie(f)||0),(g||g===0)&&(i=g))),!h||f!==i||_l)return!isNaN(f*i)&&i!==""?(g=new $e(this._pt,t,e,+f||0,i-(f||0),typeof u=="boolean"?Cx:ju,0,d),c&&(g.fp=c),o&&g.modifier(o,this,t),this._pt=g):(!u&&!(e in t)&&kl(e,i),Sx.call(this,t,e,f,i,d,l||rn.stringFilter,c))},bx=function(t,e,n,i,s){if(_e(t)&&(t=rs(t,s,e,n,i)),!Un(t)||t.style&&t.nodeType||Ne(t)||gu(t))return we(t)?rs(t,s,e,n,i):t;var a={},o;for(o in t)a[o]=rs(t[o],s,e,n,i);return a},qu=function(t,e,n,i,s,a){var o,l,c,h;if(Qe[t]&&(o=new Qe[t]).init(s,o.rawVars?e[t]:bx(e[t],i,s,a,n),n,i,a)!==!1&&(n._pt=l=new $e(n._pt,s,t,0,1,o.render,o,0,o.priority),n!==_r))for(c=n._ptLookup[n._targets.indexOf(s)],h=o._props.length;h--;)c[o._props[h]]=l;return o},hi,_l,Wl=function r(t,e,n){var i=t.vars,s=i.ease,a=i.startAt,o=i.immediateRender,l=i.lazy,c=i.onUpdate,h=i.runBackwards,u=i.yoyoEase,f=i.keyframes,d=i.autoRevert,g=t._dur,_=t._startAt,m=t._targets,p=t.parent,v=p&&p.data==="nested"?p.vars.targets:m,S=t._overwrite==="auto"&&!Ul,x=t.timeline,R=i.easeReverse||u,A,T,C,M,y,P,k,N,W,q,G,$,B;if(x&&(!f||!s)&&(s="none"),t._ease=qi(s,ls.ease),t._rEase=R&&(qi(R)||t._ease),t._from=!x&&!!i.runBackwards,t._from&&(t.ratio=1),!x||f&&!i.stagger){if(N=m[0]?Wi(m[0]).harness:0,$=N&&i[N.prop],A=pa(i,Bl),_&&(_._zTime<0&&_.progress(1),e<0&&h&&o&&!d?_.render(-1,!0):_.revert(h&&g?aa:K0),_._lazy=0),a){if(vi(t._startAt=Se.set(m,an({data:"isStart",overwrite:!1,parent:p,immediateRender:!0,lazy:!_&&Xe(l),startAt:null,delay:0,onUpdate:c&&function(){return en(t,"onUpdate")},stagger:0},a))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(Re||!o&&!d)&&t._startAt.revert(aa),o&&g&&e<=0&&n<=0){e&&(t._zTime=e);return}}else if(h&&g&&!_){if(e&&(o=!1),C=an({overwrite:!1,data:"isFromStart",lazy:o&&!_&&Xe(l),immediateRender:o,stagger:0,parent:p},A),$&&(C[N.prop]=$),vi(t._startAt=Se.set(m,C)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(Re?t._startAt.revert(aa):t._startAt.render(-1,!0)),t._zTime=e,!o)r(t._startAt,ne,ne);else if(!e)return}for(t._pt=t._ptCache=0,l=g&&Xe(l)||l&&!g,T=0;T<m.length;T++){if(y=m[T],k=y._gsap||Vl(m)[T]._gsap,t._ptLookup[T]=q={},ul[k.id]&&mi.length&&da(),G=v===m?T:v.indexOf(y),N&&(W=new N).init(y,$||A,t,G,v)!==!1&&(t._pt=M=new $e(t._pt,y,W.name,0,1,W.render,W,0,W.priority),W._props.forEach(function(rt){q[rt]=M}),W.priority&&(P=1)),!N||$)for(C in A)Qe[C]&&(W=qu(C,A,t,G,y,v))?W.priority&&(P=1):q[C]=M=Gl.call(t,y,C,"get",A[C],G,v,0,i.stringFilter);t._op&&t._op[T]&&t.kill(y,t._op[T]),S&&t._pt&&(hi=t,de.killTweensOf(y,q,t.globalTime(e)),B=!t.parent,hi=0),t._pt&&l&&(ul[k.id]=1)}P&&Zu(t),t._onInit&&t._onInit(t)}t._onUpdate=c,t._initted=(!t._op||t._pt)&&!B,f&&e<=0&&x.render(dn,!0,!0)},Ex=function(t,e,n,i,s,a,o,l){var c=(t._pt&&t._ptCache||(t._ptCache={}))[e],h,u,f,d;if(!c)for(c=t._ptCache[e]=[],f=t._ptLookup,d=t._targets.length;d--;){if(h=f[d][e],h&&h.d&&h.d._pt)for(h=h.d._pt;h&&h.p!==e&&h.fp!==e;)h=h._next;if(!h)return _l=1,t.vars[e]="+=0",Wl(t,o),_l=0,l?cs(e+" not eligible for reset. Try splitting into individual properties"):1;c.push(h)}for(d=c.length;d--;)u=c[d],h=u._pt||u,h.s=(i||i===0)&&!s?i:h.s+(i||0)+a*h.c,h.c=n-h.s,u.e&&(u.e=xe(n)+Ie(u.e)),u.b&&(u.b=h.s+Ie(u.b))},Tx=function(t,e){var n=t[0]?Wi(t[0]).harness:0,i=n&&n.aliases,s,a,o,l;if(!i)return e;s=Lr({},e);for(a in i)if(a in s)for(l=i[a].split(","),o=l.length;o--;)s[l[o]]=s[a];return s},Ax=function(t,e,n,i){var s=e.ease||i||"power1.inOut",a,o;if(Ne(e))o=n[t]||(n[t]=[]),e.forEach(function(l,c){return o.push({t:c/(e.length-1)*100,v:l,e:s})});else for(a in e)o=n[a]||(n[a]=[]),a==="ease"||o.push({t:parseFloat(t),v:e[a],e:s})},rs=function(t,e,n,i,s){return _e(t)?t.call(e,n,i,s):we(t)&&~t.indexOf("random(")?us(t):t},ga=zl+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",$u={};qe(ga+",id,stagger,delay,duration,paused,scrollTrigger",function(r){return $u[r]=1});ga=ga.split(",");var Se=(function(r){mu(t,r);function t(n,i,s,a){var o;typeof i=="number"&&(s.duration=i,i=s,s=null),o=r.call(this,a?i:ns(i))||this;var l=o.vars,c=l.duration,h=l.delay,u=l.immediateRender,f=l.stagger,d=l.overwrite,g=l.keyframes,_=l.defaults,m=l.scrollTrigger,p=i.parent||de,v=(Ne(n)||gu(n)?Zn(n[0]):"length"in i)?[n]:pn(n),S,x,R,A,T,C,M,y;if(o._targets=v.length?Vl(v):cs("GSAP target "+n+" not found. https://gsap.com",!rn.nullTargetWarn)||[],o._ptLookup=[],o._overwrite=d,g||f||Js(c)||Js(h)){i=o.vars;var P=i.easeReverse||i.yoyoEase;if(S=o.timeline=new Ve({data:"nested",defaults:_||{},targets:p&&p.data==="nested"?p.vars.targets:v}),S.kill(),S.parent=S._dp=Gn(o),S._start=0,f||Js(c)||Js(h)){if(A=v.length,M=f&&Uu(f),Un(f))for(T in f)~ga.indexOf(T)&&(y||(y={}),y[T]=f[T]);for(x=0;x<A;x++)R=pa(i,$u),R.stagger=0,P&&(R.easeReverse=P),y&&Lr(R,y),C=v[x],R.duration=+rs(c,Gn(o),x,C,v),R.delay=(+rs(h,Gn(o),x,C,v)||0)-o._delay,!f&&A===1&&R.delay&&(o._delay=h=R.delay,o._start+=h,R.delay=0),S.to(C,R,M?M(x,C,v):0),S._ease=zt.none;S.duration()?c=h=0:o.timeline=0}else if(g){ns(an(S.vars.defaults,{ease:"none"})),S._ease=qi(g.ease||i.ease||"none");var k=0,N,W,q;if(Ne(g))g.forEach(function(G){return S.to(v,G,">")}),S.duration();else{R={};for(T in g)T==="ease"||T==="easeEach"||Ax(T,g[T],R,g.easeEach);for(T in R)for(N=R[T].sort(function(G,$){return G.t-$.t}),k=0,x=0;x<N.length;x++)W=N[x],q={ease:W.e,duration:(W.t-(x?N[x-1].t:0))/100*c},q[T]=W.v,S.to(v,q,k),k+=q.duration;S.duration()<c&&S.to({},{duration:c-S.duration()})}}c||o.duration(c=S.duration())}else o.timeline=0;return d===!0&&!Ul&&(hi=Gn(o),de.killTweensOf(v),hi=0),Dn(p,Gn(o),s),i.reversed&&o.reverse(),i.paused&&o.paused(!0),(u||!c&&!g&&o._start===fe(p._time)&&Xe(u)&&nx(Gn(o))&&p.data!=="nested")&&(o._tTime=-ne,o.render(Math.max(0,-h)||0)),m&&Pu(Gn(o),m),o}var e=t.prototype;return e.render=function(i,s,a){var o=this._time,l=this._tDur,c=this._dur,h=i<0,u=i>l-ne&&!h?l:i<ne?0:i,f,d,g,_,m,p,v,S;if(!c)rx(this,i,s,a);else if(u!==this._tTime||!i||a||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==h||this._lazy){if(f=u,S=this.timeline,this._repeat){if(_=c+this._rDelay,this._repeat<-1&&h)return this.totalTime(_*100+i,s,a);if(f=fe(u%_),u===l?(g=this._repeat,f=c):(m=fe(u/_),g=~~m,g&&g===m?(f=c,g--):f>c&&(f=c)),p=this._yoyo&&g&1,p&&(f=c-f),m=Ir(this._tTime,_),f===o&&!a&&this._initted&&g===m)return this._tTime=u,this;g!==m&&this.vars.repeatRefresh&&!p&&!this._lock&&f!==_&&this._initted&&(this._lock=a=1,this.render(fe(_*g),!0).invalidate()._lock=0)}if(!this._initted){if(Du(this,h?i:f,a,s,u))return this._tTime=0,this;if(o!==this._time&&!(a&&this.vars.repeatRefresh&&g!==m))return this;if(c!==this._dur)return this.render(i,s,a)}if(this._rEase){var x=f<o;if(x!==this._inv){var R=x?o:c-o;this._inv=x,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=o,this._invRecip=R?(x?-1:1)/R:0,this._invScale=x?-this.ratio:1-this.ratio,this._invEase=x?this._rEase:this._ease}this.ratio=v=this._invRatio+this._invScale*this._invEase((f-this._invTime)*this._invRecip)}else this.ratio=v=this._ease(f/c);if(this._from&&(this.ratio=v=1-v),this._tTime=u,this._time=f,!this._act&&this._ts&&(this._act=1,this._lazy=0),!o&&u&&!s&&!m&&(en(this,"onStart"),this._tTime!==u))return this;for(d=this._pt;d;)d.r(v,d.d),d=d._next;S&&S.render(i<0?i:S._dur*S._ease(f/this._dur),s,a)||this._startAt&&(this._zTime=i),this._onUpdate&&!s&&(h&&fl(this,i,s,a),en(this,"onUpdate")),this._repeat&&g!==m&&this.vars.onRepeat&&!s&&this.parent&&en(this,"onRepeat"),(u===this._tDur||!u)&&this._tTime===u&&(h&&!this._onUpdate&&fl(this,i,!0,!0),(i||!c)&&(u===this._tDur&&this._ts>0||!u&&this._ts<0)&&vi(this,1),!s&&!(h&&!o)&&(u||o||p)&&(en(this,u===l?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom()))}return this},e.targets=function(){return this._targets},e.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),r.prototype.invalidate.call(this,i)},e.resetTo=function(i,s,a,o,l){fs||tn.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),h;return this._initted||Wl(this,c),h=this._ease(c/this._dur),Ex(this,i,s,a,o,h,c,l)?this.resetTo(i,s,a,o,1):(Ra(this,0),this.parent||Ru(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function(i,s){if(s===void 0&&(s="all"),!i&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?Qr(this):this.scrollTrigger&&this.scrollTrigger.kill(!!Re),this;if(this.timeline){var a=this.timeline.totalDuration();return this.timeline.killTweensOf(i,s,hi&&hi.vars.overwrite!==!0)._first||Qr(this),this.parent&&a!==this.timeline.totalDuration()&&Ur(this,this._dur*this.timeline._tDur/a,0,1),this}var o=this._targets,l=i?pn(i):o,c=this._ptLookup,h=this._pt,u,f,d,g,_,m,p;if((!s||s==="all")&&tx(o,l))return s==="all"&&(this._pt=0),Qr(this);for(u=this._op=this._op||[],s!=="all"&&(we(s)&&(_={},qe(s,function(v){return _[v]=1}),s=_),s=Tx(o,s)),p=o.length;p--;)if(~l.indexOf(o[p])){f=c[p],s==="all"?(u[p]=s,g=f,d={}):(d=u[p]=u[p]||{},g=s);for(_ in g)m=f&&f[_],m&&((!("kill"in m.d)||m.d.kill(_)===!0)&&Aa(this,m,"_pt"),delete f[_]),d!=="all"&&(d[_]=1)}return this._initted&&!this._pt&&h&&Qr(this),this},t.to=function(i,s){return new t(i,s,arguments[2])},t.from=function(i,s){return is(1,arguments)},t.delayedCall=function(i,s,a,o){return new t(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:s,onReverseComplete:s,onCompleteParams:a,onReverseCompleteParams:a,callbackScope:o})},t.fromTo=function(i,s,a){return is(2,arguments)},t.set=function(i,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new t(i,s)},t.killTweensOf=function(i,s,a){return de.killTweensOf(i,s,a)},t})(ds);an(Se.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});qe("staggerTo,staggerFrom,staggerFromTo",function(r){Se[r]=function(){var t=new Ve,e=dl.call(arguments,0);return e.splice(r==="staggerFromTo"?5:4,0,0),t[r].apply(t,e)}});var Xl=function(t,e,n){return t[e]=n},Yu=function(t,e,n){return t[e](n)},wx=function(t,e,n,i){return t[e](i.fp,n)},Rx=function(t,e,n){return t.setAttribute(e,n)},ql=function(t,e){return _e(t[e])?Yu:Nl(t[e])&&t.setAttribute?Rx:Xl},ju=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e6)/1e6,e)},Cx=function(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},Ku=function(t,e){var n=e._pt,i="";if(!t&&e.b)i=e.b;else if(t===1&&e.e)i=e.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*t):Math.round((n.s+n.c*t)*1e4)/1e4)+i,n=n._next;i+=e.c}e.set(e.t,e.p,i,e)},$l=function(t,e){for(var n=e._pt;n;)n.r(t,n.d),n=n._next},Px=function(t,e,n,i){for(var s=this._pt,a;s;)a=s._next,s.p===i&&s.modifier(t,e,n),s=a},Dx=function(t){for(var e=this._pt,n,i;e;)i=e._next,e.p===t&&!e.op||e.op===t?Aa(this,e,"_pt"):e.dep||(n=1),e=i;return!n},Lx=function(t,e,n,i){i.mSet(t,e,i.m.call(i.tween,n,i.mt),i)},Zu=function(t){for(var e=t._pt,n,i,s,a;e;){for(n=e._next,i=s;i&&i.pr>e.pr;)i=i._next;(e._prev=i?i._prev:a)?e._prev._next=e:s=e,(e._next=i)?i._prev=e:a=e,e=n}t._pt=s},$e=(function(){function r(e,n,i,s,a,o,l,c,h){this.t=n,this.s=s,this.c=a,this.p=i,this.r=o||ju,this.d=l||this,this.set=c||Xl,this.pr=h||0,this._next=e,e&&(e._prev=this)}var t=r.prototype;return t.modifier=function(n,i,s){this.mSet=this.mSet||this.set,this.set=Lx,this.m=n,this.mt=s,this.tween=i},r})();qe(zl+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(r){return Bl[r]=1});sn.TweenMax=sn.TweenLite=Se;sn.TimelineLite=sn.TimelineMax=Ve;de=new Ve({sortChildren:!1,defaults:ls,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});rn.stringFilter=Gu;var $i=[],la={},Ix=[],vh=0,Ux=0,po=function(t){return(la[t]||Ix).map(function(e){return e()})},ps=function(){var t=Date.now(),e=[];t-vh>2&&(po("matchMediaInit"),$i.forEach(function(n){var i=n.queries,s=n.conditions,a,o,l,c;for(o in i)a=Cn.matchMedia(i[o]).matches,a&&(l=1),a!==s[o]&&(s[o]=a,c=1);c&&(n.revert(),l&&e.push(n))}),po("matchMediaRevert"),e.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),vh=t,po("matchMedia"))},Ju=(function(){function r(e,n){this.selector=n&&pl(n),this.data=[],this._r=[],this.isReverted=!1,this.id=Ux++,e&&this.add(e)}var t=r.prototype;return t.add=function(n,i,s){_e(n)&&(s=i,i=n,n=_e);var a=this,o=function(){var c=ue,h=a.selector,u;return c&&c!==a&&c.data.push(a),s&&(a.selector=pl(s)),ue=a,u=i.apply(a,arguments),_e(u)&&a._r.push(u),ue=c,a.selector=h,a.isReverted=!1,u};return a.last=o,n===_e?o(a,function(l){return a.add(null,l)}):n?a[n]=o:o},t.ignore=function(n){var i=ue;ue=null,n(this),ue=i},t.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof r?n.push.apply(n,i.getTweens()):i instanceof Se&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(n,i){var s=this;if(n?(function(){for(var o=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(h){return o.splice(o.indexOf(h),1)}));for(o.map(function(h){return{g:h._dur||h._delay||h._sat&&!h._sat.vars.immediateRender?h.globalTime(0):-1/0,t:h}}).sort(function(h,u){return u.g-h.g||-1/0}).forEach(function(h){return h.t.revert(n)}),l=s.data.length;l--;)c=s.data[l],c instanceof Ve?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof Se)&&c.revert&&c.revert(n);s._r.forEach(function(h){return h(n,s)}),s.isReverted=!0})():this.data.forEach(function(o){return o.kill&&o.kill()}),this.clear(),i){for(var a=$i.length;a--;)$i[a].id===this.id&&$i.splice(a,1);this._mqs&&this._mqs.forEach(function(o){return o.removeListener?o.removeListener(ps):o.removeEventListener("change",ps)}),this._mqs=null}},t.revert=function(n){this.kill(n||{})},r})(),Nx=(function(){function r(e){this.contexts=[],this.scope=e,ue&&ue.data.push(this)}var t=r.prototype;return t.add=function(n,i,s){Un(n)||(n={matches:n});var a=new Ju(0,s||this.scope),o=a.conditions={},l,c,h;ue&&!a.selector&&(a.selector=ue.selector),this.contexts.push(a),i=a.add("onMatch",i),a.queries=n;for(c in n)c==="all"?h=1:(l=Cn.matchMedia(n[c]),l&&($i.indexOf(a)<0&&$i.push(a),(o[c]=l.matches)&&(h=1),l.addListener?l.addListener(ps):l.addEventListener("change",ps),(a._mqs||(a._mqs=[])).push(l)));return h&&i(a,function(u){return a.add(null,u)}),this},t.revert=function(n){this.kill(n||{})},t.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},r})(),xa={registerPlugin:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];e.forEach(function(i){return zu(i)})},timeline:function(t){return new Ve(t)},getTweensOf:function(t,e){return de.getTweensOf(t,e)},getProperty:function(t,e,n,i){we(t)&&(t=pn(t)[0]);var s=Wi(t||{}).get,a=n?wu:Au;return n==="native"&&(n=""),t&&(e?a((Qe[e]&&Qe[e].get||s)(t,e,n,i)):function(o,l,c){return a((Qe[o]&&Qe[o].get||s)(t,o,l,c))})},quickSetter:function(t,e,n){if(t=pn(t),t.length>1){var i=t.map(function(h){return je.quickSetter(h,e,n)}),s=i.length;return function(h){for(var u=s;u--;)i[u](h)}}t=t[0]||{};var a=Qe[e],o=Wi(t),l=o.harness&&(o.harness.aliases||{})[e]||e,c=a?function(h){var u=new a;_r._pt=0,u.init(t,n?h+n:h,_r,0,[t]),u.render(1,u),_r._pt&&$l(1,_r)}:o.set(t,l);return a?c:function(h){return c(t,l,n?h+n:h,o,1)}},quickTo:function(t,e,n){var i,s=je.to(t,an((i={},i[e]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),a=function(l,c,h){return s.resetTo(e,l,c,h)};return a.tween=s,a},isTweening:function(t){return de.getTweensOf(t,!0).length>0},defaults:function(t){return t&&t.ease&&(t.ease=qi(t.ease,ls.ease)),ph(ls,t||{})},config:function(t){return ph(rn,t||{})},registerEffect:function(t){var e=t.name,n=t.effect,i=t.plugins,s=t.defaults,a=t.extendTimeline;(i||"").split(",").forEach(function(o){return o&&!Qe[o]&&!sn[o]&&cs(e+" effect requires "+o+" plugin.")}),co[e]=function(o,l,c){return n(pn(o),an(l||{},s),c)},a&&(Ve.prototype[e]=function(o,l,c){return this.add(co[e](o,Un(l)?l:(c=l)&&{},this),c)})},registerEase:function(t,e){zt[t]=qi(e)},parseEase:function(t,e){return arguments.length?qi(t,e):zt},getById:function(t){return de.getById(t)},exportRoot:function(t,e){t===void 0&&(t={});var n=new Ve(t),i,s;for(n.smoothChildTiming=Xe(t.smoothChildTiming),de.remove(n),n._dp=0,n._time=n._tTime=de._time,i=de._first;i;)s=i._next,(e||!(!i._dur&&i instanceof Se&&i.vars.onComplete===i._targets[0]))&&Dn(n,i,i._start-i._delay),i=s;return Dn(de,n,0),n},context:function(t,e){return t?new Ju(t,e):ue},matchMedia:function(t){return new Nx(t)},matchMediaRefresh:function(){return $i.forEach(function(t){var e=t.conditions,n,i;for(i in e)e[i]&&(e[i]=!1,n=1);n&&t.revert()})||ps()},addEventListener:function(t,e){var n=la[t]||(la[t]=[]);~n.indexOf(e)||n.push(e)},removeEventListener:function(t,e){var n=la[t],i=n&&n.indexOf(e);i>=0&&n.splice(i,1)},utils:{wrap:fx,wrapYoyo:dx,distribute:Uu,random:Fu,snap:Nu,normalize:ux,getUnit:Ie,clamp:ox,splitColor:Vu,toArray:pn,selector:pl,mapRange:ku,pipe:cx,unitize:hx,interpolate:px,shuffle:Iu},install:yu,effects:co,ticker:tn,updateRoot:Ve.updateRoot,plugins:Qe,globalTimeline:de,core:{PropTween:$e,globals:Su,Tween:Se,Timeline:Ve,Animation:ds,getCache:Wi,_removeLinkedListItem:Aa,reverting:function(){return Re},context:function(t){return t&&ue&&(ue.data.push(t),t._ctx=ue),ue},suppressOverwrites:function(t){return Ul=t}}};qe("to,from,fromTo,delayedCall,set,killTweensOf",function(r){return xa[r]=Se[r]});tn.add(Ve.updateRoot);_r=xa.to({},{duration:0});var Fx=function(t,e){for(var n=t._pt;n&&n.p!==e&&n.op!==e&&n.fp!==e;)n=n._next;return n},Ox=function(t,e){var n=t._targets,i,s,a;for(i in e)for(s=n.length;s--;)a=t._ptLookup[s][i],a&&(a=a.d)&&(a._pt&&(a=Fx(a,i)),a&&a.modifier&&a.modifier(e[i],t,n[s],i))},mo=function(t,e){return{name:t,headless:1,rawVars:1,init:function(i,s,a){a._onInit=function(o){var l,c;if(we(s)&&(l={},qe(s,function(h){return l[h]=1}),s=l),e){l={};for(c in s)l[c]=e(s[c]);s=l}Ox(o,s)}}}},je=xa.registerPlugin({name:"attr",init:function(t,e,n,i,s){var a,o,l;this.tween=n;for(a in e)l=t.getAttribute(a)||"",o=this.add(t,"setAttribute",(l||0)+"",e[a],i,s,0,0,a),o.op=a,o.b=l,this._props.push(a)},render:function(t,e){for(var n=e._pt;n;)Re?n.set(n.t,n.p,n.b,n):n.r(t,n.d),n=n._next}},{name:"endArray",headless:1,init:function(t,e){for(var n=e.length;n--;)this.add(t,n,t[n]||0,e[n],0,0,0,0,0,1)}},mo("roundProps",ml),mo("modifiers"),mo("snap",Nu))||xa;Se.version=Ve.version=je.version="3.15.1";Mu=1;Fl()&&Nr();zt.Power0;zt.Power1;zt.Power2;zt.Power3;zt.Power4;zt.Linear;zt.Quad;zt.Cubic;zt.Quart;zt.Quint;zt.Strong;zt.Elastic;zt.Back;zt.SteppedEase;zt.Bounce;zt.Sine;zt.Expo;zt.Circ;/*!
 * CSSPlugin 3.15.1
 * https://gsap.com
 *
 * Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var Mh,ui,br,Yl,Gi,yh,jl,kx=function(){return typeof window<"u"},Jn={},Ni=180/Math.PI,Er=Math.PI/180,dr=Math.atan2,Sh=1e8,Kl=/([A-Z])/g,Bx=/(left|right|width|margin|padding|x)/i,zx=/[\s,\(]\S/,In={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},gl=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},Vx=function(t,e){return e.set(e.t,e.p,t===1?e.e:Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},Hx=function(t,e){return e.set(e.t,e.p,t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},Gx=function(t,e){return e.set(e.t,e.p,t===1?e.e:t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},Wx=function(t,e){var n=e.s+e.c*t;e.set(e.t,e.p,~~(n+(n<0?-.5:.5))+e.u,e)},Qu=function(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)},tf=function(t,e){return e.set(e.t,e.p,t!==1?e.b:e.e,e)},Xx=function(t,e,n){return t.style[e]=n},qx=function(t,e,n){return t.style.setProperty(e,n)},$x=function(t,e,n){return t._gsap[e]=n},Yx=function(t,e,n){return t._gsap.scaleX=t._gsap.scaleY=n},jx=function(t,e,n,i,s){var a=t._gsap;a.scaleX=a.scaleY=n,a.renderTransform(s,a)},Kx=function(t,e,n,i,s){var a=t._gsap;a[e]=n,a.renderTransform(s,a)},pe="transform",Ye=pe+"Origin",Zx=function r(t,e){var n=this,i=this.target,s=i.style,a=i._gsap;if(t in Jn&&s){if(this.tfm=this.tfm||{},t!=="transform")t=In[t]||t,~t.indexOf(",")?t.split(",").forEach(function(o){return n.tfm[o]=Wn(i,o)}):this.tfm[t]=a.x?a[t]:Wn(i,t),t===Ye&&(this.tfm.zOrigin=a.zOrigin);else return In.transform.split(",").forEach(function(o){return r.call(n,o,e)});if(this.props.indexOf(pe)>=0)return;a.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(Ye,e,"")),t=pe}(s||e)&&this.props.push(t,e,s[t])},ef=function(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))},Jx=function(){var t=this.props,e=this.target,n=e.style,i=e._gsap,s,a;for(s=0;s<t.length;s+=3)t[s+1]?t[s+1]===2?e[t[s]](t[s+2]):e[t[s]]=t[s+2]:t[s+2]?n[t[s]]=t[s+2]:n.removeProperty(t[s].substr(0,2)==="--"?t[s]:t[s].replace(Kl,"-$1").toLowerCase());if(this.tfm){for(a in this.tfm)i[a]=this.tfm[a];i.svg&&(i.renderTransform(),e.setAttribute("data-svg-origin",this.svgo||"")),s=jl(),(!s||!s.isStart)&&!n[pe]&&(ef(n),i.zOrigin&&n[Ye]&&(n[Ye]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},nf=function(t,e){var n={target:t,props:[],revert:Jx,save:Zx};return t._gsap||je.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(i){return n.save(i)}),n},rf,xl=function(t,e){var n=ui.createElementNS?ui.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):ui.createElement(t);return n&&n.style?n:ui.createElement(t)},nn=function r(t,e,n){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(Kl,"-$1").toLowerCase())||i.getPropertyValue(e)||!n&&r(t,Fr(e)||e,1)||""},bh="O,Moz,ms,Ms,Webkit".split(","),Fr=function(t,e,n){var i=e||Gi,s=i.style,a=5;if(t in s&&!n)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);a--&&!(bh[a]+t in s););return a<0?null:(a===3?"ms":a>=0?bh[a]:"")+t},vl=function(){kx()&&window.document&&(Mh=window,ui=Mh.document,br=ui.documentElement,Gi=xl("div")||{style:{}},xl("div"),pe=Fr(pe),Ye=pe+"Origin",Gi.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",rf=!!Fr("perspective"),jl=je.core.reverting,Yl=1)},Eh=function(t){var e=t.ownerSVGElement,n=xl("svg",e&&e.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=t.cloneNode(!0),s;i.style.display="block",n.appendChild(i),br.appendChild(n);try{s=i.getBBox()}catch{}return n.removeChild(i),br.removeChild(n),s},Th=function(t,e){for(var n=e.length;n--;)if(t.hasAttribute(e[n]))return t.getAttribute(e[n])},sf=function(t){var e,n;try{e=t.getBBox()}catch{e=Eh(t),n=1}return e&&(e.width||e.height)||n||(e=Eh(t)),e&&!e.width&&!e.x&&!e.y?{x:+Th(t,["x","cx","x1"])||0,y:+Th(t,["y","cy","y1"])||0,width:0,height:0}:e},af=function(t){return!!(t.getCTM&&(!t.parentNode||t.ownerSVGElement)&&sf(t))},Mi=function(t,e){if(e){var n=t.style,i;e in Jn&&e!==Ye&&(e=pe),n.removeProperty?(i=e.substr(0,2),(i==="ms"||e.substr(0,6)==="webkit")&&(e="-"+e),n.removeProperty(i==="--"?e:e.replace(Kl,"-$1").toLowerCase())):n.removeAttribute(e)}},fi=function(t,e,n,i,s,a){var o=new $e(t._pt,e,n,0,1,a?tf:Qu);return t._pt=o,o.b=i,o.e=s,t._props.push(n),o},Ah={deg:1,rad:1,turn:1},Qx={grid:1,flex:1},yi=function r(t,e,n,i){var s=parseFloat(n)||0,a=(n+"").trim().substr((s+"").length)||"px",o=Gi.style,l=Bx.test(e),c=t.tagName.toLowerCase()==="svg",h=(c?"client":"offset")+(l?"Width":"Height"),u=100,f=i==="px",d=i==="%",g,_,m,p;if(i===a||!s||Ah[i]||Ah[a])return s;if(a!=="px"&&!f&&(s=r(t,e,n,"px")),p=t.getCTM&&af(t),(d||a==="%")&&(Jn[e]||~e.indexOf("adius")))return g=p?t.getBBox()[l?"width":"height"]:t[h],xe(d?s/g*u:s/100*g);if(o[l?"width":"height"]=u+(f?a:i),_=i!=="rem"&&~e.indexOf("adius")||i==="em"&&t.appendChild&&!c?t:t.parentNode,p&&(_=(t.ownerSVGElement||{}).parentNode),(!_||_===ui||!_.appendChild)&&(_=ui.body),m=_._gsap,m&&d&&m.width&&l&&m.time===tn.time&&!m.uncache)return xe(s/m.width*u);if(d&&(e==="height"||e==="width")){var v=t.style[e];t.style[e]=u+i,g=t[h],v?t.style[e]=v:Mi(t,e)}else(d||a==="%")&&!Qx[nn(_,"display")]&&(o.position=nn(t,"position")),_===t&&(o.position="static"),_.appendChild(Gi),g=Gi[h],_.removeChild(Gi),o.position="absolute";return l&&d&&(m=Wi(_),m.time=tn.time,m.width=_[h]),xe(f?g*s/u:g&&s?u/g*s:0)},Wn=function(t,e,n,i){var s;return Yl||vl(),e in In&&e!=="transform"&&(e=In[e],~e.indexOf(",")&&(e=e.split(",")[0])),Jn[e]&&e!=="transform"?(s=_s(t,i),s=e!=="transformOrigin"?s[e]:s.svg?s.origin:Ma(nn(t,Ye))+" "+s.zOrigin+"px"):(s=t.style[e],(!s||s==="auto"||i||~(s+"").indexOf("calc("))&&(s=va[e]&&va[e](t,e,n)||nn(t,e)||Eu(t,e)||(e==="opacity"?1:0))),n&&!~(s+"").trim().indexOf(" ")?yi(t,e,s,n)+n:s},tv=function(t,e,n,i){if(!n||n==="none"){var s=Fr(e,t,1),a=s&&nn(t,s,1);a&&a!==n?(e=s,n=a):e==="borderColor"&&(n=nn(t,"borderTopColor"))}var o=new $e(this._pt,t.style,e,0,1,Ku),l=0,c=0,h,u,f,d,g,_,m,p,v,S,x,R;if(o.b=n,o.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=nn(t,i.substring(4,i.indexOf(")")))),i==="auto"&&(_=t.style[e],t.style[e]=i,i=nn(t,e)||i,_?t.style[e]=_:Mi(t,e)),h=[n,i],Gu(h),n=h[0],i=h[1],f=n.match(mr)||[],R=i.match(mr)||[],R.length){for(;u=mr.exec(i);)m=u[0],v=i.substring(l,u.index),g?g=(g+1)%5:(v.substr(-5)==="rgba("||v.substr(-5)==="hsla(")&&(g=1),m!==(_=f[c++]||"")&&(d=parseFloat(_)||0,x=_.substr((d+"").length),m.charAt(1)==="="&&(m=Sr(d,m)+x),p=parseFloat(m),S=m.substr((p+"").length),l=mr.lastIndex-S.length,S||(S=S||rn.units[e]||x,l===i.length&&(i+=S,o.e+=S)),x!==S&&(d=yi(t,e,_,S)||0),o._pt={_next:o._pt,p:v||c===1?v:",",s:d,c:p-d,m:g&&g<4||e==="zIndex"?Math.round:0});o.c=l<i.length?i.substring(l,i.length):""}else o.r=e==="display"&&i==="none"?tf:Qu;return vu.test(i)&&(o.e=0),this._pt=o,o},wh={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},ev=function(t){var e=t.split(" "),n=e[0],i=e[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(t=n,n=i,i=t),e[0]=wh[n]||n,e[1]=wh[i]||i,e.join(" ")},nv=function(t,e){if(e.tween&&e.tween._time===e.tween._dur){var n=e.t,i=n.style,s=e.u,a=n._gsap,o,l,c;if(s==="all"||s===!0)i.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)o=s[c],Jn[o]&&(l=1,o=o==="transformOrigin"?Ye:pe),Mi(n,o);l&&(Mi(n,pe),a&&(a.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",_s(n,1),a.uncache=1,ef(i)))}},va={clearProps:function(t,e,n,i,s){if(s.data!=="isFromStart"){var a=t._pt=new $e(t._pt,e,n,0,0,nv);return a.u=i,a.pr=-10,a.tween=s,t._props.push(n),1}}},ms=[1,0,0,1,0,0],of={},lf=function(t){return t==="matrix(1, 0, 0, 1, 0, 0)"||t==="none"||!t},Rh=function(t){var e=nn(t,pe);return lf(e)?ms:e.substr(7).match(xu).map(xe)},Zl=function(t,e){var n=t._gsap||Wi(t),i=t.style,s=Rh(t),a,o,l,c;return n.svg&&t.getAttribute("transform")?(l=t.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?ms:s):(s===ms&&!t.offsetParent&&t!==br&&!n.svg&&(l=i.display,i.display="block",a=t.parentNode,(!a||!t.offsetParent&&!t.getBoundingClientRect().width)&&(c=1,o=t.nextElementSibling,br.appendChild(t)),s=Rh(t),l?i.display=l:Mi(t,"display"),c&&(o?a.insertBefore(t,o):a?a.appendChild(t):br.removeChild(t))),e&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},Ml=function(t,e,n,i,s,a){var o=t._gsap,l=s||Zl(t,!0),c=o.xOrigin||0,h=o.yOrigin||0,u=o.xOffset||0,f=o.yOffset||0,d=l[0],g=l[1],_=l[2],m=l[3],p=l[4],v=l[5],S=e.split(" "),x=parseFloat(S[0])||0,R=parseFloat(S[1])||0,A,T,C,M;n?l!==ms&&(T=d*m-g*_)&&(C=x*(m/T)+R*(-_/T)+(_*v-m*p)/T,M=x*(-g/T)+R*(d/T)-(d*v-g*p)/T,x=C,R=M):(A=sf(t),x=A.x+(~S[0].indexOf("%")?x/100*A.width:x),R=A.y+(~(S[1]||S[0]).indexOf("%")?R/100*A.height:R)),i||i!==!1&&o.smooth?(p=x-c,v=R-h,o.xOffset=u+(p*d+v*_)-p,o.yOffset=f+(p*g+v*m)-v):o.xOffset=o.yOffset=0,o.xOrigin=x,o.yOrigin=R,o.smooth=!!i,o.origin=e,o.originIsAbsolute=!!n,t.style[Ye]="0px 0px",a&&(fi(a,o,"xOrigin",c,x),fi(a,o,"yOrigin",h,R),fi(a,o,"xOffset",u,o.xOffset),fi(a,o,"yOffset",f,o.yOffset)),t.setAttribute("data-svg-origin",x+" "+R)},_s=function(t,e){var n=t._gsap||new Xu(t);if("x"in n&&!e&&!n.uncache)return n;var i=t.style,s=n.scaleX<0,a="px",o="deg",l=getComputedStyle(t),c=nn(t,Ye)||"0",h,u,f,d,g,_,m,p,v,S,x,R,A,T,C,M,y,P,k,N,W,q,G,$,B,rt,st,gt,J,vt,H,et;return h=u=f=_=m=p=v=S=x=0,d=g=1,n.svg=!!(t.getCTM&&af(t)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[pe]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[pe]!=="none"?l[pe]:"")),i.scale=i.rotate=i.translate="none"),T=Zl(t,n.svg),n.svg&&(n.uncache?(B=t.getBBox(),c=n.xOrigin-B.x+"px "+(n.yOrigin-B.y)+"px",$=""):$=!e&&t.getAttribute("data-svg-origin"),Ml(t,$||c,!!$||n.originIsAbsolute,n.smooth!==!1,T)),R=n.xOrigin||0,A=n.yOrigin||0,T!==ms&&(P=T[0],k=T[1],N=T[2],W=T[3],h=q=T[4],u=G=T[5],T.length===6?(d=Math.sqrt(P*P+k*k),g=Math.sqrt(W*W+N*N),_=P||k?dr(k,P)*Ni:0,v=N||W?dr(N,W)*Ni+_:0,v&&(g*=Math.abs(Math.cos(v*Er))),n.svg&&(h-=R-(R*P+A*N),u-=A-(R*k+A*W))):(et=T[6],vt=T[7],st=T[8],gt=T[9],J=T[10],H=T[11],h=T[12],u=T[13],f=T[14],C=dr(et,J),m=C*Ni,C&&(M=Math.cos(-C),y=Math.sin(-C),$=q*M+st*y,B=G*M+gt*y,rt=et*M+J*y,st=q*-y+st*M,gt=G*-y+gt*M,J=et*-y+J*M,H=vt*-y+H*M,q=$,G=B,et=rt),C=dr(-N,J),p=C*Ni,C&&(M=Math.cos(-C),y=Math.sin(-C),$=P*M-st*y,B=k*M-gt*y,rt=N*M-J*y,H=W*y+H*M,P=$,k=B,N=rt),C=dr(k,P),_=C*Ni,C&&(M=Math.cos(C),y=Math.sin(C),$=P*M+k*y,B=q*M+G*y,k=k*M-P*y,G=G*M-q*y,P=$,q=B),m&&Math.abs(m)+Math.abs(_)>359.9&&(m=_=0,p=180-p),d=xe(Math.sqrt(P*P+k*k+N*N)),g=xe(Math.sqrt(G*G+et*et)),C=dr(q,G),v=Math.abs(C)>2e-4?C*Ni:0,x=H?1/(H<0?-H:H):0),n.svg&&($=t.getAttribute("transform"),n.forceCSS=t.setAttribute("transform","")||!lf(nn(t,pe)),$&&t.setAttribute("transform",$))),Math.abs(v)>90&&Math.abs(v)<270&&(s?(d*=-1,v+=_<=0?180:-180,_+=_<=0?180:-180):(g*=-1,v+=v<=0?180:-180)),e=e||n.uncache,n.x=h-((n.xPercent=h&&(!e&&n.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-h)?-50:0)))?t.offsetWidth*n.xPercent/100:0)+a,n.y=u-((n.yPercent=u&&(!e&&n.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-u)?-50:0)))?t.offsetHeight*n.yPercent/100:0)+a,n.z=f+a,n.scaleX=xe(d),n.scaleY=xe(g),n.rotation=xe(_)+o,n.rotationX=xe(m)+o,n.rotationY=xe(p)+o,n.skewX=v+o,n.skewY=S+o,n.transformPerspective=x+a,(n.zOrigin=parseFloat(c.split(" ")[2])||!e&&n.zOrigin||0)&&(i[Ye]=Ma(c)),n.xOffset=n.yOffset=0,n.force3D=rn.force3D,n.renderTransform=n.svg?rv:rf?cf:iv,n.uncache=0,n},Ma=function(t){return(t=t.split(" "))[0]+" "+t[1]},_o=function(t,e,n){var i=Ie(e);return xe(parseFloat(e)+parseFloat(yi(t,"x",n+"px",i)))+i},iv=function(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,cf(t,e)},Pi="0deg",Kr="0px",Di=") ",cf=function(t,e){var n=e||this,i=n.xPercent,s=n.yPercent,a=n.x,o=n.y,l=n.z,c=n.rotation,h=n.rotationY,u=n.rotationX,f=n.skewX,d=n.skewY,g=n.scaleX,_=n.scaleY,m=n.transformPerspective,p=n.force3D,v=n.target,S=n.zOrigin,x="",R=p==="auto"&&t&&t!==1||p===!0;if(S&&(u!==Pi||h!==Pi)){var A=parseFloat(h)*Er,T=Math.sin(A),C=Math.cos(A),M;A=parseFloat(u)*Er,M=Math.cos(A),a=_o(v,a,T*M*-S),o=_o(v,o,-Math.sin(A)*-S),l=_o(v,l,C*M*-S+S)}m!==Kr&&(x+="perspective("+m+Di),(i||s)&&(x+="translate("+i+"%, "+s+"%) "),(R||a!==Kr||o!==Kr||l!==Kr)&&(x+=l!==Kr||R?"translate3d("+a+", "+o+", "+l+") ":"translate("+a+", "+o+Di),c!==Pi&&(x+="rotate("+c+Di),h!==Pi&&(x+="rotateY("+h+Di),u!==Pi&&(x+="rotateX("+u+Di),(f!==Pi||d!==Pi)&&(x+="skew("+f+", "+d+Di),(g!==1||_!==1)&&(x+="scale("+g+", "+_+Di),v.style[pe]=x||"translate(0, 0)"},rv=function(t,e){var n=e||this,i=n.xPercent,s=n.yPercent,a=n.x,o=n.y,l=n.rotation,c=n.skewX,h=n.skewY,u=n.scaleX,f=n.scaleY,d=n.target,g=n.xOrigin,_=n.yOrigin,m=n.xOffset,p=n.yOffset,v=n.forceCSS,S=parseFloat(a),x=parseFloat(o),R,A,T,C,M;l=parseFloat(l),c=parseFloat(c),h=parseFloat(h),h&&(h=parseFloat(h),c+=h,l+=h),l||c?(l*=Er,c*=Er,R=Math.cos(l)*u,A=Math.sin(l)*u,T=Math.sin(l-c)*-f,C=Math.cos(l-c)*f,c&&(h*=Er,M=Math.tan(c-h),M=Math.sqrt(1+M*M),T*=M,C*=M,h&&(M=Math.tan(h),M=Math.sqrt(1+M*M),R*=M,A*=M)),R=xe(R),A=xe(A),T=xe(T),C=xe(C)):(R=u,C=f,A=T=0),(S&&!~(a+"").indexOf("px")||x&&!~(o+"").indexOf("px"))&&(S=yi(d,"x",a,"px"),x=yi(d,"y",o,"px")),(g||_||m||p)&&(S=xe(S+g-(g*R+_*T)+m),x=xe(x+_-(g*A+_*C)+p)),(i||s)&&(M=d.getBBox(),S=xe(S+i/100*M.width),x=xe(x+s/100*M.height)),M="matrix("+R+","+A+","+T+","+C+","+S+","+x+")",d.setAttribute("transform",M),v&&(d.style[pe]=M)},sv=function(t,e,n,i,s){var a=360,o=we(s),l=parseFloat(s)*(o&&~s.indexOf("rad")?Ni:1),c=l-i,h=i+c+"deg",u,f;return o&&(u=s.split("_")[1],u==="short"&&(c%=a,c!==c%(a/2)&&(c+=c<0?a:-a)),u==="cw"&&c<0?c=(c+a*Sh)%a-~~(c/a)*a:u==="ccw"&&c>0&&(c=(c-a*Sh)%a-~~(c/a)*a)),t._pt=f=new $e(t._pt,e,n,i,c,Vx),f.e=h,f.u="deg",t._props.push(n),f},Ch=function(t,e){for(var n in e)t[n]=e[n];return t},av=function(t,e,n){var i=Ch({},n._gsap),s="perspective,force3D,transformOrigin,svgOrigin",a=n.style,o,l,c,h,u,f,d,g;i.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),a[pe]=e,o=_s(n,1),Mi(n,pe),n.setAttribute("transform",c)):(c=getComputedStyle(n)[pe],a[pe]=e,o=_s(n,1),a[pe]=c);for(l in Jn)c=i[l],h=o[l],c!==h&&s.indexOf(l)<0&&(d=Ie(c),g=Ie(h),u=d!==g?yi(n,l,c,g):parseFloat(c),f=parseFloat(h),t._pt=new $e(t._pt,o,l,u,f-u,gl),t._pt.u=g||0,t._props.push(l));Ch(o,i)};qe("padding,margin,Width,Radius",function(r,t){var e="Top",n="Right",i="Bottom",s="Left",a=(t<3?[e,n,i,s]:[e+s,e+n,i+n,i+s]).map(function(o){return t<2?r+o:"border"+o+r});va[t>1?"border"+r:r]=function(o,l,c,h,u){var f,d;if(arguments.length<4)return f=a.map(function(g){return Wn(o,g,c)}),d=f.join(" "),d.split(f[0]).length===5?f[0]:d;f=(h+"").split(" "),d={},a.forEach(function(g,_){return d[g]=f[_]=f[_]||f[(_-1)/2|0]}),o.init(l,d,u)}});var hf={name:"css",register:vl,targetTest:function(t){return t.style&&t.nodeType},init:function(t,e,n,i,s){var a=this._props,o=t.style,l=n.vars.startAt,c,h,u,f,d,g,_,m,p,v,S,x,R,A,T,C,M;Yl||vl(),this.styles=this.styles||nf(t),C=this.styles.props,this.tween=n;for(_ in e)if(_!=="autoRound"&&(h=e[_],!(Qe[_]&&qu(_,e,n,i,t,s)))){if(d=typeof h,g=va[_],d==="function"&&(h=h.call(n,i,t,s),d=typeof h),d==="string"&&~h.indexOf("random(")&&(h=us(h)),g)g(this,t,_,h,n)&&(T=1);else if(_.substr(0,2)==="--")c=(getComputedStyle(t).getPropertyValue(_)+"").trim(),h+="",_i.lastIndex=0,_i.test(c)||(m=Ie(c),p=Ie(h),p?m!==p&&(c=yi(t,_,c,p)+p):m&&(h+=m)),this.add(o,"setProperty",c,h,i,s,0,0,_),a.push(_),C.push(_,0,o[_]);else if(d!=="undefined"){if(l&&_ in l?(c=typeof l[_]=="function"?l[_].call(n,i,t,s):l[_],we(c)&&~c.indexOf("random(")&&(c=us(c)),Ie(c+"")||c==="auto"||(c+=rn.units[_]||Ie(Wn(t,_))||""),(c+"").charAt(1)==="="&&(c=Wn(t,_))):c=Wn(t,_),f=parseFloat(c),v=d==="string"&&h.charAt(1)==="="&&h.substr(0,2),v&&(h=h.substr(2)),u=parseFloat(h),_ in In&&(_==="autoAlpha"&&(f===1&&Wn(t,"visibility")==="hidden"&&u&&(f=0),C.push("visibility",0,o.visibility),fi(this,o,"visibility",f?"inherit":"hidden",u?"inherit":"hidden",!u)),_!=="scale"&&_!=="transform"&&(_=In[_],~_.indexOf(",")&&(_=_.split(",")[0]))),S=_ in Jn,S){if(this.styles.save(_),M=h,d==="string"&&h.substring(0,6)==="var(--"){if(h=nn(t,h.substring(4,h.indexOf(")"))),h.substring(0,5)==="calc("){var y=t.style.perspective;t.style.perspective=h,h=nn(t,"perspective"),y?t.style.perspective=y:Mi(t,"perspective")}u=parseFloat(h)}if(x||(R=t._gsap,R.renderTransform&&!e.parseTransform||_s(t,e.parseTransform),A=e.smoothOrigin!==!1&&R.smooth,x=this._pt=new $e(this._pt,o,pe,0,1,R.renderTransform,R,0,-1),x.dep=1),_==="scale")this._pt=new $e(this._pt,R,"scaleY",R.scaleY,(v?Sr(R.scaleY,v+u):u)-R.scaleY||0,gl),this._pt.u=0,a.push("scaleY",_),_+="X";else if(_==="transformOrigin"){C.push(Ye,0,o[Ye]),h=ev(h),R.svg?Ml(t,h,0,A,0,this):(p=parseFloat(h.split(" ")[2])||0,p!==R.zOrigin&&fi(this,R,"zOrigin",R.zOrigin,p),fi(this,o,_,Ma(c),Ma(h)));continue}else if(_==="svgOrigin"){Ml(t,h,1,A,0,this);continue}else if(_ in of){sv(this,R,_,f,v?Sr(f,v+h):h);continue}else if(_==="smoothOrigin"){fi(this,R,"smooth",R.smooth,h);continue}else if(_==="force3D"){R[_]=h;continue}else if(_==="transform"){av(this,h,t);continue}}else _ in o||(_=Fr(_)||_);if(S||(u||u===0)&&(f||f===0)&&!zx.test(h)&&_ in o)m=(c+"").substr((f+"").length),u||(u=0),p=Ie(h)||(_ in rn.units?rn.units[_]:m),m!==p&&(f=yi(t,_,c,p)),this._pt=new $e(this._pt,S?R:o,_,f,(v?Sr(f,v+u):u)-f,!S&&(p==="px"||_==="zIndex")&&e.autoRound!==!1?Wx:gl),this._pt.u=p||0,S&&M!==h?(this._pt.b=c,this._pt.e=M,this._pt.r=Gx):m!==p&&p!=="%"&&(this._pt.b=c,this._pt.r=Hx);else if(_ in o)tv.call(this,t,_,c,v?v+h:h);else if(_ in t)this.add(t,_,c||t[_],v?v+h:h,i,s);else if(_!=="parseTransform"){kl(_,h);continue}S||(_ in o?C.push(_,0,o[_]):typeof t[_]=="function"?C.push(_,2,t[_]()):C.push(_,1,c||t[_])),a.push(_)}}T&&Zu(this)},render:function(t,e){if(e.tween._time||!jl())for(var n=e._pt;n;)n.r(t,n.d),n=n._next;else e.styles.revert()},get:Wn,aliases:In,getSetter:function(t,e,n){var i=In[e];return i&&i.indexOf(",")<0&&(e=i),e in Jn&&e!==Ye&&(t._gsap.x||Wn(t,"x"))?n&&yh===n?e==="scale"?Yx:$x:(yh=n||{})&&(e==="scale"?jx:Kx):t.style&&!Nl(t.style[e])?Xx:~e.indexOf("-")?qx:ql(t,e)},core:{_removeProperty:Mi,_getMatrix:Zl}};je.utils.checkPrefix=Fr;je.core.getStyleSaver=nf;(function(r,t,e,n){var i=qe(r+","+t+","+e,function(s){Jn[s]=1});qe(t,function(s){rn.units[s]="deg",of[s]=1}),In[i[13]]=r+","+t,qe(n,function(s){var a=s.split(":");In[a[1]]=i[a[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");qe("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(r){rn.units[r]="px"});je.registerPlugin(hf);var Jl=je.registerPlugin(hf)||je;Jl.core.Tween;const go=[{t:"The beat and the step",body:'Music is built on a steady pulse. The studio divides each beat into 4 steps (16th notes), so a 16-step row is one bar of 4 beats. Count it "1 e & a, 2 e & a…". Kick on 1, 2, 3, 4 gives four-on-the-floor.',demo:{rhythm:"house"}},{t:"Backbeat: where the snare lives",body:"Most pop, rock and hip-hop puts the snare or clap on beats 2 and 4 (steps 5 and 13). That off-balance accent is what makes people nod along.",demo:{rhythm:"pop"}},{t:"Swing",body:"Swing delays every second 16th note so the groove feels looser and rolls instead of marching. Boom bap and lo-fi use a lot; techno uses none. Try the Swing slider while a pattern plays.",demo:{rhythm:"lofi"}},{t:"Syncopation and 3+3+2",body:"Grouping 8 steps as 3+3+2 puts accents off the main beats. The dembow pattern behind dancehall and reggaeton, and many Afrobeats kicks, lean on this shape.",demo:{rhythm:"dancehall"}},{t:"Polyrhythm and 12/8",body:"In 12/8, each beat splits into three, not four. Layer a bell, shakers and drums that each repeat on different cycles and you get the interlocking feel of many West African rhythms.",demo:{rhythm:"bembe"}},{t:"Major and minor",body:"The only difference between a major and a minor triad is one note: the third. Major has 4 semitones from the root to the third (bright); minor has 3 (darker). Play both in the chord builder.",demo:{chord:"Major"}},{t:"Why pentatonic is forgiving",body:"A pentatonic scale has five notes and leaves out the two that clash most. Almost any order of those notes sounds acceptable, which is why it shows up in blues, rock and pop toplines.",demo:{scale:"Minor pentatonic"}},{t:"Modes: same notes, new home",body:"Dorian is a minor scale with a raised 6th, which gives it a warmer, funkier sound. It is common in Afrobeat, funk and lo-fi. Mixolydian is major with a flat 7th, relaxed and bluesy, common in highlife and rock.",demo:{scale:"Dorian"}},{t:"Bass and kick lock together",body:"The bass usually plays on or near the kick, and holds the root note of the chord. When they hit together the groove feels heavy; when the bass answers between kicks it feels bouncy.",demo:{rhythm:"funk"}},{t:"Building a loop that lasts",body:"Start with kick and snare, add hats for energy, add percussion for flavour, then a bass line, then a short melody that repeats. Leave space; what you leave out matters as much as what you add.",demo:{rhythm:"afrobeats"}}],Q=(r,t=document)=>t.querySelector(r),Nt=(r,t=document)=>[...t.querySelectorAll(r)],Rn=Q("#app"),gs=k0(Q("#bg")),oi={...gs,setHome:r=>gs.setLayout(r?"home":"bg")},Ql=matchMedia("(prefers-reduced-motion: reduce)").matches,uf="sonara.v1";let ft=ov()||zi(he[0]);ft.progIdx=ft.progIdx??0;let gr={cutoff:12e3,delay:.15,reverb:.2,volume:.8};function ov(){try{return JSON.parse(localStorage.getItem(uf))}catch{return null}}function be(){try{localStorage.setItem(uf,JSON.stringify(ft))}catch{}}function ff(r){const t=yn[r.scaleName]||yn["Minor pentatonic"],e=es[r.progIdx??0]||es[0],n=e[1].map(i=>Uh(0,yn[e[3]==="minor"?"Natural minor":"Major"],i));return{...r,scale:t,chords:{on:r.chords.on,list:n}}}const tc=()=>ff(ft);let qt=(()=>{try{return JSON.parse(localStorage.getItem("sonara.song"))||[]}catch{return[]}})(),jt=null,ca=!0;const Li=()=>{try{localStorage.setItem("sonara.song",JSON.stringify(qt))}catch{}};function lv(r){if(!qt.length)return tc();(jt.last===-1||r===0&&jt.last!==0&&jt.started)&&jt.started&&(jt.bar++,jt.bar>=qt[jt.i].bars&&(jt.bar=0,jt.i++,jt.i>=qt.length&&(ca||(jt.done=!0),jt.i=0))),jt.started=!0,jt.last=r;const t=qt[jt.i];return setTimeout(()=>df(),0),ff(t.pat)}let df=()=>{Nt(".sg").forEach(r=>r.classList.toggle("now",jt&&+r.dataset.i===jt.i)),jt&&jt.done&&xr()};function Ph(){qt.length&&(Dt.stop(),jt={i:0,bar:0,last:-1,started:!1,done:!1},Dt.start(lv),Le())}function xr(){Dt.stop(),jt=null,Nt(".sg").forEach(t=>t.classList.remove("now"));const r=Q("#songBtn");r&&(r.textContent="▶ Play song")}const Sn=()=>(Dt.init(),Dt.ctx.currentTime);function Le(){Dt.init(),Dt.setFx(gr)}function xs(){jt=null,Dt.playing?Dt.stop():(Dt.start(tc),Le())}function vs(r){ft={...zi(r),progIdx:ft.progIdx,chords:{on:!1,list:[]}},be(),jt=null,Dt.stop(),Dt.start(tc),Le(),gf(r.id),nc()}function pf(r,t="pluck"){const e=Sn()+.005;Le(),t==="kalimba"?Dt.kalimba(e,r):t==="bass"?Dt.bass(e,r-12,.6):t==="chord"?Dt.chord(e,[r,r+4,r+7],1.2):Dt.lead(e,r,.7,1,t)}const ec={home:'<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',studio:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 9v6M12 7v10M16 11v2"/>',rhythms:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',arranger:'<path d="M4 6h10M4 12h16M4 18h12"/><circle cx="18" cy="6" r="2"/><circle cx="20" cy="18" r="2"/>',learn:'<path d="M3 8l9-4 9 4-9 4zM7 10v5c3 2 7 2 10 0v-5"/>',theory:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',lab:'<path d="M10 3h4M11 3v6l-6 10a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-6-10V3"/>',about:'<circle cx="12" cy="12" r="9"/><path d="M12 8v.5M12 11v5"/>'},mf=[["","Home","home"],["studio","Studio","studio"],["rhythms","Rhythms","rhythms"],["arranger","Arranger","arranger"],["learn","Learn","learn"],["theory","Theory","theory"],["lab","Sound lab","lab"],["about","About","about"]];Q("#nav").innerHTML=mf.map(([r,t,e])=>`<a href="#/${r}"><svg viewBox="0 0 24 24">${ec[e]}</svg><span>${t}</span></a>`).join("");Q("#tabs").innerHTML=mf.filter(r=>r[0]!=="about").map(([r,t,e])=>`<a href="#/${r}"><svg viewBox="0 0 24 24">${ec[e]}</svg><span>${t}</span></a>`).join("");const ss='<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>',cv='<svg viewBox="0 0 24 24"><path d="M8 4v16M16 4v16" stroke-width="5"/></svg>',_f=()=>{try{return JSON.parse(localStorage.getItem("sonara.recent"))||[]}catch{return[]}};function gf(r){try{const t=[r,..._f().filter(e=>e!==r)].slice(0,6);localStorage.setItem("sonara.recent",JSON.stringify(t))}catch{}vf()}const xf=()=>he.find(r=>r.id===ft.id);function hv(){const r=V0(ft.id||"new");document.documentElement.style.setProperty("--h",r),gs.setHue(r)}function vf(){const r=_f().map(t=>he.find(e=>e.id===t)).filter(Boolean);Q("#lib").innerHTML=(qt.length?`<button data-go="arranger"><span class="t" style="display:grid;place-items:center;background:var(--card2)">♫</span><span><b>Your song</b><small>${qt.length} section${qt.length>1?"s":""}</small></span></button>`:"")+r.map(t=>`<button data-play="${t.id}"><span class="t">${Dr(t.id,"",{noText:!0})}</span><span><b>${t.name}</b><small>${t.region}</small></span></button>`).join("")||'<div class="meta" style="padding:6px 12px">Play a rhythm and it shows up here.</div>',Nt("#lib [data-play]").forEach(t=>t.onclick=()=>vs(he.find(e=>e.id===t.dataset.play))),Nt("#lib [data-go]").forEach(t=>t.onclick=()=>{location.hash="#/"+t.dataset.go})}function nc(){const r=xf(),t=jt&&qt[jt.i]?qt[jt.i].name:ft.name;Q("#pTitle").textContent=t||"Pick a groove",Q("#pSub").textContent=r?`${r.region} · ${ft.bpm} BPM`:`Custom pattern · ${ft.bpm} BPM`,Q("#pCov").innerHTML=Dr(ft.id||"new",ft.name,{noText:!0}),Q("#pDots").innerHTML=Array.from({length:ft.length},(e,n)=>`<i class="${n%4===0?"q":""}"></i>`).join(""),Q("#npCov").innerHTML=Dr(ft.id||"new",ft.name),Q("#npT").textContent=ft.name,Q("#npS").textContent=r?`${r.region} · ${r.tag}`:"Your own pattern",Q("#npD").textContent=r?r.blurb:"Built in the studio. Open it there to keep editing.",Q("#npBpm").value=ft.bpm,Q("#npBpmV").textContent=ft.bpm+" BPM",Q("#lanes").innerHTML=[...ft.tracks.map(e=>({n:as.find(n=>n.id===e.id).name,c:as.find(n=>n.id===e.id).color,s:e.steps.map(n=>n?1:0)})),{n:"Bass",c:"#ff6a3d",s:ft.bass.steps.map(e=>e!=null?1:0)},{n:"Lead",c:"#8a7bff",s:ft.lead.steps.map(e=>e!=null?1:0)}].filter(e=>e.s.some(Boolean)).map(e=>`<div class="ln"><span>${e.n}</span><div class="lc" style="grid-template-columns:repeat(${ft.length},1fr);--c:${e.c}">${e.s.map(n=>`<i class="${n?"on":""}"></i>`).join("")}</div></div>`).join(""),hv(),Yi()}function Yi(){const r=Dt.playing;for(const e of[Q("#mini"),Q("#npPlay")])e.innerHTML=r?cv:ss,e.classList.toggle("on",r),e.setAttribute("aria-label",r?"Stop":"Play");Q("#np").classList.toggle("play",r);const t=Q("#playBtn");t&&(t.textContent=r?"■ Stop":"▶ Play",t.classList.toggle("on",r)),Nt(".alb").forEach(e=>e.classList.toggle("playing",r&&e.dataset.id===ft.id)),r||(Nt(".st.play,.pdots i.now,.lc i.now").forEach(e=>e.classList.remove("now","play")),Q("#pProg i").style.width="0")}Dt.on(r=>{if(Yi(),r!=null&&Dt.playing){Nt(".st.play,.pdots i.now,.lc i.now").forEach(e=>e.classList.remove("now","play")),Nt(`.st[data-i="${r}"]`).forEach(e=>e.classList.add("play"));const t=Nt("#pDots i")[r];t&&t.classList.add("now"),Nt(".lc").forEach(e=>{const n=e.children[r];n&&n.classList.add("now")}),Q("#pProg i").style.width=(r+1)/ft.length*100+"%"}});Q("#mini").onclick=()=>{jt?xr():xs(),Yi()};Q("#npPlay").onclick=Q("#mini").onclick;const Mf=r=>{const t=he.findIndex(n=>n.id===ft.id),e=he.length;vs(he[((t<0?0:t+r)+e)%e])};Q("#pNext").onclick=()=>Mf(1);Q("#pPrev").onclick=()=>Mf(-1);Q("#pVol").oninput=r=>{gr.volume=+r.target.value,Le()};const Ca=r=>{Q("#np").classList.toggle("open",r),document.body.classList.toggle("npopen",r),Q("#np").setAttribute("aria-hidden",!r),gs.setLayout(r?"np":/^#\/?$/.test(location.hash)||!location.hash?"home":"bg"),document.body.style.overflow=r?"hidden":""};Q("#pOpen").onclick=()=>Ca(!0);Q("#pExp").onclick=()=>Ca(!0);Q("#npX").onclick=()=>Ca(!1);addEventListener("keydown",r=>{r.key==="Escape"&&Ca(!1)});Q("#npBpm").oninput=r=>{ft.bpm=+r.target.value,Q("#npBpmV").textContent=ft.bpm+" BPM",be();const t=Q("#bpm");t&&(t.value=ft.bpm),Q("#pSub").textContent=Q("#pSub").textContent.replace(/\d+ BPM/,ft.bpm+" BPM")};Q("#npModes").innerHTML=O0.map((r,t)=>`<button class="chip${t?"":" on"}" data-vm="${r}">${r}</button>`).join("");Nt("#npModes .chip").forEach(r=>r.onclick=()=>{Nt("#npModes .chip").forEach(t=>t.classList.remove("on")),r.classList.add("on"),gs.setMode(r.dataset.vm)});const uv=[...Nt("#sideeq i"),...Nt("#peq i")];(function r(){requestAnimationFrame(r);const t=Dt.levels(),e=Dt.playing&&t;uv.forEach((n,i)=>{const s=n.parentElement.children.length,a=i%s,o=e?t[2+a*5]/255:.05+.04*Math.sin(performance.now()/600+a);n.style.height=Math.max(6,o*100)+"%"})})();document.addEventListener("pointerdown",r=>{const t=r.target.closest(".btn");if(!t)return;const e=t.getBoundingClientRect(),n=Math.max(e.width,e.height),i=document.createElement("span");i.className="rip",i.style.cssText=`width:${n}px;height:${n}px;left:${r.clientX-e.left-n/2}px;top:${r.clientY-e.top-n/2}px`,t.appendChild(i),setTimeout(()=>i.remove(),650)});document.addEventListener("pointermove",r=>{if(Ql||r.pointerType==="touch")return;const t=r.target.closest(".alb,.tile,.npcov");if(Nt(".tilt").forEach(s=>{s!==t&&(s.style.transform="",s.classList.remove("tilt"))}),!t)return;const e=t.getBoundingClientRect(),n=(r.clientX-e.left)/e.width-.5,i=(r.clientY-e.top)/e.height-.5;t.classList.add("tilt"),t.style.transform=`perspective(700px) rotateX(${-i*9}deg) rotateY(${n*11}deg) translateZ(6px)`});document.addEventListener("pointerleave",()=>Nt(".tilt").forEach(r=>{r.style.transform=""}),!0);function Dh(r){return r.map(t=>`<button class="alb" data-id="${t.id}" aria-label="Play ${t.name}"><div class="art">${Dr(t.id,t.name)}<span class="pl">${ss}</span></div><b>${t.name}</b><small>${t.region} · ${t.bpm} BPM</small></button>`).join("")}function Lh(r=Rn){Nt(".alb[data-id],.qk[data-id]",r).forEach(t=>t.onclick=()=>{const e=he.find(n=>n.id===t.dataset.id);ft.id===e.id&&Dt.playing&&!jt?(Dt.stop(),Yi()):vs(e)})}function xo(r,t,e,n=60,i=14){const s=new Set(t.map(c=>(c%12+12)%12)),a=[0,2,4,5,7,9,11];let o="",l="";for(let c=0;c<i;c++){const h=n+12*Math.floor(c/7)+a[c%7],u=s.has(h%12);if(o+=`<div class="wk${u?" in":""}" data-m="${h}">${u?Qs(h):""}</div>`,[0,1,3,4,5].includes(c%7)&&c<i-1){const f=h+1;l+=`<div class="bk${s.has(f%12)?" in":""}" data-m="${f}" style="left:calc(${(c+1)/i*100}% - 2.6%)"></div>`}}return`<div class="piano" id="${e}">${o}${l}</div>`}function vo(r,t){Nt(`#${r} [data-m]`).forEach(e=>e.addEventListener("pointerdown",n=>{n.preventDefault(),pf(+e.dataset.m,typeof t=="function"?t():t),e.classList.add("act"),setTimeout(()=>e.classList.remove("act"),160)}))}const Fi=(r,t)=>r.map(([e,n])=>`<option value="${e}"${e==t?" selected":""}>${n}</option>`).join(""),Mo=r=>Fi(Ih.map((t,e)=>[e,t]),r),ya={home(){oi.setHome(!0);const r=/Nigeria|Ghana|South Africa|Congo|Cameroon|Angola|Ivoire|Pan-African|West Africa/,t=he.find(a=>a.id===(xf()?ft.id:"afrobeat"))||he[0],e=a=>he.filter(a),n=(a,o,l)=>`<section class="shelf rv"><div class="shh"><h2>${a}</h2><span class="meta">${o}</span></div><div class="row2">${Dh(l)}</div></section>`,i=new Date().getHours(),s=i<12?"Good morning":i<18?"Good afternoon":"Good evening";Rn.innerHTML=`<section class="hero2"><div class="txt"><span class="tag">${s}, a music studio made of code</span><h1>Make music from <span>nothing.</span></h1>
<p class="lead">Every drum, bass note and melody is synthesised live in your browser. No samples, no downloads. Play ${he.length} rhythms, rebuild them, record them.</p>
<div class="btns"><button class="btn" id="hp">${ss.replace("<svg",'<svg width="18" height="18" fill="#111" stroke="#111"')} Play something</button><a class="btn ghost" href="#/studio">Open the studio</a><a class="btn ghost" href="#/arranger">Build a song</a></div>
<div class="hstats"><div><b data-count="${he.length}">0</b><span>rhythms</span></div><div><b data-count="${as.length+7}">0</b><span>instruments</span></div><div><b data-count="${Object.keys(yn).length}">0</b><span>scales</span></div><div><b data-count="0">0</b><span>audio files</span></div></div></div>
<div class="feat"><button class="alb" data-id="${t.id}" style="width:100%"><div class="art">${Dr(t.id,t.name)}<span class="pl">${ss}</span></div><b>${t.name}</b><small>Featured · ${t.region}</small></button></div></section>
<h2 style="margin-top:10px">Quick picks</h2><div class="quick rv">${he.slice(0,8).map(a=>`<button class="qk" data-id="${a.id}"><span class="t">${Dr(a.id,"",{noText:!0})}</span>${a.name}<span class="pl">${ss}</span></button>`).join("")}</div>
${n("Made in Africa","West, Central and Southern Africa",e(a=>r.test(a.region)))}
${n("Dance floor","House, techno and club",e(a=>/Dance|House/.test(a.tag)))}
${n("Hip-hop and chill","Slow, swung and dusty",e(a=>/Hip-hop|Chill/.test(a.tag)))}
${n("Latin and Caribbean","Clave, dembow, one drop",e(a=>/Latin|Jamaica|Puerto|Brazil|Colombia|Dominican|Cuba/.test(a.region+a.tag)))}
${n("Rolling 12/8","Every beat splits into three",e(a=>a.div===3))}
<section class="shelf rv"><div class="shh"><h2>Jump in</h2></div><div class="tiles">${[["studio","Studio","Edit every step, shape the sound and record.",14],["arranger","Arranger","Chain patterns into a full song.",170],["learn","Learn","Ten short lessons with live examples.",260],["theory","Theory","Scales, chords and an ear trainer.",320],["lab","Sound lab","Play nine voices and drum pads.",60]].map(([a,o,l,c])=>`<a class="tile" href="#/${a}" style="--x:${c}"><h3>${o}</h3><p>${l}</p><svg viewBox="0 0 24 24">${ec[a]}</svg></a>`).join("")}</div></section>`,Lh(),Q("#hp").onclick=()=>{Dt.playing?(Dt.stop(),Yi()):vs(he[Math.floor(Math.random()*he.length)])},Nt("[data-count]").forEach(a=>{const o=+a.dataset.count;if(Ql||!o){a.textContent=o;return}const l={v:0};Jl.to(l,{v:o,duration:1.4,ease:"power2.out",onUpdate:()=>{a.textContent=Math.round(l.v)}})}),Yi()},studio(){oi.setHome(!1),nc();const r=ft;Rn.innerHTML=`<h2>Studio <span class="meta" id="sname">${r.name}</span></h2>
<div class="panel bar"><button class="btn" id="playBtn">▶ Play</button>
<label class="f">Tempo <input type="number" id="bpm" min="50" max="200" value="${r.bpm}" style="width:80px"></label>
<label class="f">Swing <input type="range" id="swing" min="0" max="0.5" step="0.01" value="${r.swing}"></label>
<label class="f">Key <select id="root">${Mo(r.root)}</select></label>
<label class="f">Scale <select id="scale">${Fi(Object.keys(yn).map(n=>[n,n]),r.scaleName)}</select></label>
<label class="f">Preset <select id="preset"><option value="">Choose…</option>${Fi(he.map(n=>[n.id,n.name]),"")}</select></label>
<label class="f">Lead <select id="lkind"><option value="pluck">Pluck</option><option value="soft">Soft</option><option value="organ">Organ</option><option value="square">Chip square</option><option value="bell">Bell</option><option value="pad">Pad</option></select></label>
<button class="btn ghost sm" id="clear">Clear</button><button class="btn ghost sm" id="rec">● Record</button><button class="btn ghost sm" id="share">Copy share link</button><button class="btn ghost sm" id="tap">Tap tempo</button><button class="btn ghost sm" id="addsong">+ Add to song</button></div>
<div class="panel"><div class="seq" id="seq"></div></div>
<div class="panel bar"><label class="f"><span><input type="checkbox" id="chon"> Chord pad</span><select id="prog">${Fi(es.map((n,i)=>[i,n[0]]),r.progIdx)}</select></label>
${[["cutoff","Filter",400,12e3,50],["delay","Echo",0,.6,.01],["reverb","Reverb",0,.8,.01],["volume","Volume",0,1,.01]].map(([n,i,s,a,o])=>`<label class="f">${i}<input type="range" data-fx="${n}" min="${s}" max="${a}" step="${o}" value="${gr[n]}"></label>`).join("")}</div>
<p class="meta">Tip: click a drum step to cycle off → hit → accent. On bass and lead rows it cycles scale degrees. Keys <kbd>A</kbd>–<kbd>K</kbd> play the lead live.</p><div class="msg" id="msg"></div>`,fv(),Q("#chon").checked=r.chords.on,Q("#lkind").value=r.lead.kind,Q("#playBtn").onclick=xs,Q("#playBtn").textContent=Dt.playing?"■ Stop":"▶ Play",Q("#bpm").onchange=n=>{ft.bpm=Math.max(50,Math.min(200,+n.target.value||100)),be()},Q("#swing").oninput=n=>{ft.swing=+n.target.value,be()},Q("#root").onchange=n=>{ft.root=+n.target.value,be()},Q("#scale").onchange=n=>{ft.scaleName=n.target.value,be()},Q("#lkind").onchange=n=>{ft.lead.kind=n.target.value,be()},Q("#chon").onchange=n=>{ft.chords.on=n.target.checked,be()},Q("#prog").onchange=n=>{ft.progIdx=+n.target.value,be()},Q("#preset").onchange=n=>{const i=he.find(s=>s.id===n.target.value);i&&(ft={...zi(i),progIdx:ft.progIdx,chords:{on:ft.chords.on,list:[]}},be(),ya.studio())},Q("#clear").onclick=()=>{ft={...Pf(),bpm:ft.bpm,root:ft.root,scaleName:ft.scaleName,progIdx:ft.progIdx},be(),ya.studio()},Nt("[data-fx]").forEach(n=>n.oninput=()=>{gr[n.dataset.fx]=+n.value,Le()}),Q("#share").onclick=async()=>{const n=location.origin+location.pathname+"#/studio?p="+btoa(unescape(encodeURIComponent(JSON.stringify(ft))));try{await navigator.clipboard.writeText(n),Q("#msg").textContent="Link copied. Anyone who opens it gets your pattern."}catch{prompt("Copy this link",n)}};let t=[];Q("#tap").onclick=()=>{const n=performance.now();if(t=t.filter(i=>n-i<2500),t.push(n),t.length>1){const i=(t[t.length-1]-t[0])/(t.length-1);ft.bpm=Math.max(50,Math.min(200,Math.round(6e4/i))),Q("#bpm").value=ft.bpm,be()}},Q("#addsong").onclick=()=>{qt.push({name:ft.name,bars:2,pat:JSON.parse(JSON.stringify(ft))}),Li(),Q("#msg").textContent=`Added "${ft.name}" to your song (${qt.length} section${qt.length>1?"s":""}). Open Arranger to edit.`};let e=!1;Q("#rec").onclick=async()=>{if(!e)Dt.playing||xs(),Dt.record(),e=!0,Q("#rec").textContent="■ Stop & save",Q("#rec").classList.add("rec");else{const n=await Dt.stopRecord();if(e=!1,Q("#rec").textContent="● Record",Q("#rec").classList.remove("rec"),n){const i=document.createElement("a");i.href=URL.createObjectURL(n),i.download=`sonara-${ft.id||"loop"}.webm`,i.click(),Q("#msg").textContent="Saved your recording as a .webm audio file."}}}},rhythms(){oi.setHome(!1);let r="All",t=yl.toLowerCase();const e=["All",...new Set(he.map(i=>i.tag))];Rn.innerHTML=`<h2>Rhythms</h2><p class="lead">Simplified teaching versions of each style. They show the core feel, not a note-for-note copy of any record. Click a cover to play, then open it in the studio to take it apart.</p>
<div class="chips" id="tags">${e.map(i=>`<button class="chip${i==="All"?" on":""}" data-t="${i}">${i}</button>`).join("")}</div><div class="grid4" id="rg" style="margin-top:16px"></div><p class="meta" id="rn" style="margin-top:12px"></p>`;const n=()=>{const i=he.filter(s=>(r==="All"||s.tag===r)&&(!t||(s.name+s.region+s.tag+s.blurb).toLowerCase().includes(t)));Q("#rg").innerHTML=i.map(s=>`<div style="position:relative">${Dh([s])}<button class="btn ghost sm" data-o="${s.id}" style="margin-top:6px;width:100%;justify-content:center">Open in studio</button></div>`).join("")||'<div class="card"><p>No rhythms match that search.</p></div>',Q("#rn").textContent=`${i.length} rhythm${i.length===1?"":"s"}`,Lh(),Yi(),Nt("[data-o]").forEach(s=>s.onclick=()=>{const a=he.find(o=>o.id===s.dataset.o);ft={...zi(a),progIdx:ft.progIdx,chords:{on:!1,list:[]}},be(),gf(a.id),location.hash="#/studio"})};n(),Nt("#tags .chip").forEach(i=>i.onclick=()=>{Nt("#tags .chip").forEach(s=>s.classList.remove("on")),i.classList.add("on"),r=i.dataset.t,n()}),window.__rq=i=>{t=i.toLowerCase(),n()}},theory(){oi.setHome(!1);let r=0,t="Major",e="Major",n=0;Rn.innerHTML=`<h2>Theory</h2><p class="lead">Press the notes. Learn by hearing.</p>
<div class="panel"><h3>Scale explorer</h3><div class="bar" style="margin:10px 0"><label class="f">Root <select id="sr">${Mo(0)}</select></label><label class="f">Scale <select id="ss">${Fi(Object.keys(yn).map(d=>[d,d]),t)}</select></label><button class="btn sm" id="sp">▶ Play scale</button></div><div id="sx"></div></div>
<div class="panel"><h3>Chord builder</h3><div class="bar" style="margin:10px 0"><label class="f">Root <select id="cr">${Mo(0)}</select></label><label class="f">Type <select id="ct">${Fi(Object.keys(Wr).map(d=>[d,d]),e)}</select></label><button class="btn sm" id="cp">▶ Play chord</button><button class="btn ghost sm" id="ca">Arpeggio</button></div><div id="cx"></div></div>
<div class="panel"><h3>Progressions</h3><p class="meta">Played with the Studio's root key, as diatonic chords.</p><div class="grid" id="pg" style="margin-top:10px"></div></div>
<div class="panel"><h3>Ear trainer: name the interval</h3><div class="quiz-q" id="eq">Press Start.</div><div class="chips" id="eo"></div><div class="msg" id="em"></div><div class="btns"><button class="btn sm" id="es">Start / next</button><button class="btn ghost sm" id="er">Hear again</button><span class="meta" id="esc" style="align-self:center">Score 0 / 0</span></div></div>`;const i=()=>{const d=yn[t],g=d.map(_=>r+_);Q("#sx").innerHTML=xo(r,g,"sp1",60,14)+`<div class="chips">${d.map(_=>`<span class="chip on">${Qs(r+_)}</span>`).join("")}</div><p class="meta" style="margin-top:8px">${Df[t]} Steps from the root: ${d.join(" · ")} semitones.</p>`,vo("sp1","pluck")},s=()=>{const d=Wr[e],g=d.map(_=>n+_);Q("#cx").innerHTML=xo(n,g,"cp1",60,14)+`<p class="meta">${Qs(n)} ${e}: ${d.map(_=>Qs(n+_)).join(" – ")}</p>`,vo("cp1","pluck")};Q("#sr").onchange=d=>{r=+d.target.value,i()},Q("#ss").onchange=d=>{t=d.target.value,i()},Q("#sp").onclick=()=>{const d=Sn()+.05;Le(),[...yn[t],12].forEach((g,_)=>Dt.lead(d+_*.28,60+r+g,.4))},Q("#cr").onchange=d=>{n=+d.target.value,s()},Q("#ct").onchange=d=>{e=d.target.value,s()},Q("#cp").onclick=()=>{Le(),Dt.chord(Sn()+.03,Wr[e].map(d=>60+n+d),1.4)},Q("#ca").onclick=()=>{const d=Sn()+.05;Le(),Wr[e].forEach((g,_)=>Dt.lead(d+_*.22,60+n+g,.5))},Q("#pg").innerHTML=es.map((d,g)=>`<div class="card"><h3>${d[0]}</h3><p>${d[2]}</p><button class="btn sm" data-pp="${g}">▶ Play</button></div>`).join(""),Nt("[data-pp]").forEach(d=>d.onclick=()=>{const g=es[+d.dataset.pp],_=yn[g[3]==="minor"?"Natural minor":"Major"],m=Sn()+.05;Le(),g[1].forEach((p,v)=>Dt.chord(m+v*1.1,Uh(0,_,p).map(S=>ft.root+55+S),1))}),i(),s();let a=0,o=0,l=null,c=0,h=0,u=!0;const f=()=>{const d=Sn()+.03;Le(),Dt.lead(d,c,.6),Dt.lead(d+.7,h,.6)};Q("#es").onclick=()=>{const d=Da[Math.floor(Math.random()*Da.length)];l=d[0],c=55+Math.floor(Math.random()*12),h=c+d[1],u=!1,Q("#eq").textContent="Which interval is this?",Q("#em").textContent="",Q("#eo").innerHTML=Da.map(g=>`<button class="chip" data-a="${g[0]}">${g[0]}</button>`).join(""),f(),Nt("#eo .chip").forEach(g=>g.onclick=()=>{if(u)return;u=!0,o++;const _=g.dataset.a===l;_&&a++,Q("#em").style.color=_?"var(--ok)":"#ff7b8a",Q("#em").textContent=_?`Correct: ${l}. Think of ${uc[l]}.`:`It was ${l}. Think of ${uc[l]}.`,Q("#esc").textContent=`Score ${a} / ${o}`})},Q("#er").onclick=()=>{l&&f()}},lab(){oi.setHome(!1);let r="pluck";Rn.innerHTML=`<h2>Sound lab</h2><p class="lead">Play it yourself. Pick a voice, shape it with the filter, echo and reverb.</p>
<div class="panel"><div class="chips" id="kinds">${[["pluck","Pluck"],["soft","Soft"],["organ","Organ"],["square","Chip square"],["bell","Bell"],["pad","Pad"],["kalimba","Kalimba"],["bass","Bass"],["chord","Chord"]].map(([t,e],n)=>`<button class="chip${n?"":" on"}" data-k="${t}">${e}</button>`).join("")}</div>${xo(0,[],"lp",48,21)}<p class="meta">Computer keyboard: <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> <kbd>F</kbd> <kbd>G</kbd> <kbd>H</kbd> <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd> play C to D, with <kbd>W</kbd> <kbd>E</kbd> <kbd>T</kbd> <kbd>Y</kbd> <kbd>U</kbd> <kbd>O</kbd> for sharps.</p></div>
<div class="panel bar">${[["cutoff","Filter",400,12e3,50],["delay","Echo",0,.6,.01],["reverb","Reverb",0,.8,.01],["volume","Volume",0,1,.01]].map(([t,e,n,i,s])=>`<label class="f">${e}<input type="range" data-fx="${t}" min="${n}" max="${i}" step="${s}" value="${gr[t]}"></label>`).join("")}</div>
<div class="panel"><h3>Drum pads</h3><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(110px,1fr));margin-top:10px">${as.map(t=>`<button class="btn" data-d="${t.id}" style="background:${t.color};border-radius:var(--r);padding:22px 8px">${t.name}</button>`).join("")}</div></div>`,vo("lp",()=>r),Nt("#kinds .chip").forEach(t=>t.onclick=()=>{Nt("#kinds .chip").forEach(e=>e.classList.remove("on")),t.classList.add("on"),r=t.dataset.k}),Nt("[data-fx]").forEach(t=>t.oninput=()=>{gr[t.dataset.fx]=+t.value,Le()}),Nt("[data-d]").forEach(t=>t.addEventListener("pointerdown",e=>{e.preventDefault(),Le(),Dt.drum(t.dataset.d,Sn()+.005,1.1)})),yf=()=>r},arranger(){oi.setHome(!1);const r=()=>{Rn.innerHTML=`<h2>Arranger</h2><p class="lead">Chain patterns into a full song. Add sections from the Studio ("+ Add to song") or from any rhythm below, set how many bars each plays, and press play.</p>
<div class="panel bar"><button class="btn" id="songBtn">${jt?"■ Stop":"▶ Play song"}</button><label class="f"><span><input type="checkbox" id="loop"${ca?" checked":""}> Loop</span></label><label class="f">Add preset <select id="addp"><option value="">Choose…</option>${Fi(he.map(n=>[n.id,n.name]),"")}</select></label><button class="btn ghost sm" id="rec2">● Record song</button><button class="btn ghost sm" id="clrs">Clear song</button><span class="meta" id="tot"></span></div>
<div id="sl">${qt.length?"":'<div class="card"><p>Your song is empty. Pick a preset above to start.</p></div>'}${qt.map((n,i)=>`<div class="panel sg" data-i="${i}"><div class="bar"><b>${i+1}. ${n.name}</b><span class="meta">${n.pat.bpm} BPM</span><label class="f">Bars <input type="number" min="1" max="16" value="${n.bars}" data-b="${i}" style="width:64px"></label><button class="btn ghost sm" data-u="${i}">↑</button><button class="btn ghost sm" data-d="${i}">↓</button><button class="btn ghost sm" data-e="${i}">Edit in studio</button><button class="btn ghost sm" data-x="${i}">Remove</button></div></div>`).join("")}</div><div class="msg" id="msg"></div>`;const t=()=>{const n=qt.reduce((i,s)=>i+s.bars*s.pat.length/(s.pat.div||4)*60/s.pat.bpm*(s.pat.div===3,1),0);Q("#tot").textContent=qt.length?`Length about ${Math.floor(n/60)}:${String(Math.round(n%60)).padStart(2,"0")}`:""};t(),Q("#songBtn").onclick=()=>{jt?xr():(Ph(),Q("#songBtn").textContent="■ Stop")},Q("#loop").onchange=n=>{ca=n.target.checked},Q("#addp").onchange=n=>{const i=he.find(s=>s.id===n.target.value);i&&(qt.push({name:i.name,bars:4,pat:zi(i)}),Li(),r())},Q("#clrs").onclick=()=>{xr(),qt=[],Li(),r()},Nt("[data-b]").forEach(n=>n.onchange=()=>{qt[+n.dataset.b].bars=Math.max(1,Math.min(16,+n.value||1)),Li(),t()}),Nt("[data-x]").forEach(n=>n.onclick=()=>{qt.splice(+n.dataset.x,1),Li(),xr(),r()}),Nt("[data-u]").forEach(n=>n.onclick=()=>{const i=+n.dataset.u;i>0&&([qt[i-1],qt[i]]=[qt[i],qt[i-1]],Li(),r())}),Nt("[data-d]").forEach(n=>n.onclick=()=>{const i=+n.dataset.d;i<qt.length-1&&([qt[i+1],qt[i]]=[qt[i],qt[i+1]],Li(),r())}),Nt("[data-e]").forEach(n=>n.onclick=()=>{ft=JSON.parse(JSON.stringify(qt[+n.dataset.e].pat)),ft.progIdx=ft.progIdx??0,be(),location.hash="#/studio"});let e=!1;Q("#rec2").onclick=async()=>{if(e){const n=await Dt.stopRecord();if(e=!1,xr(),Q("#rec2").textContent="● Record song",Q("#rec2").classList.remove("rec"),n){const i=document.createElement("a");i.href=URL.createObjectURL(n),i.download="sonara-song.webm",i.click(),Q("#msg").textContent="Saved your song as a .webm audio file."}}else{if(!qt.length)return;ca=!1,Q("#loop").checked=!1,Ph(),Q("#songBtn").textContent="■ Stop",Dt.record(),e=!0,Q("#rec2").textContent="■ Stop & save",Q("#rec2").classList.add("rec")}},df()};r()},learn(){oi.setHome(!1),Rn.innerHTML=`<h2>Learn</h2><p class="lead">Ten short lessons. Each one plays a real example you can then open and edit.</p><div class="grid">${go.map((r,t)=>`<div class="card"><span class="tag">Lesson ${t+1}</span><h3>${r.t}</h3><p>${r.body}</p><div class="btns"><button class="btn sm" data-l="${t}">▶ Hear it</button>${r.demo.rhythm?`<button class="btn ghost sm" data-lo="${t}">Open in studio</button>`:'<a class="btn ghost sm" href="#/theory">Open in theory</a>'}</div></div>`).join("")}</div>`,Nt("[data-l]").forEach(r=>r.onclick=()=>{const t=go[+r.dataset.l].demo;if(t.rhythm)vs(he.find(e=>e.id===t.rhythm));else{const e=Sn()+.05;Le(),t.scale?[...yn[t.scale],12].forEach((n,i)=>Dt.lead(e+i*.28,62+n,.4)):Dt.chord(e,Wr[t.chord].map(n=>60+n),1.4)}}),Nt("[data-lo]").forEach(r=>r.onclick=()=>{const t=he.find(e=>e.id===go[+r.dataset.lo].demo.rhythm);ft={...zi(t),progIdx:ft.progIdx,chords:{on:!1,list:[]}},be(),location.hash="#/studio"})},about(){oi.setHome(!1),Rn.innerHTML=`<h2>About SONARA</h2><p class="lead">A showpiece built to prove that a browser alone is enough to make music.</p>
<div class="grid"><div class="card"><h3>No audio files</h3><p>Kicks are sine sweeps, snares and hats are filtered noise, bass and leads are oscillators, reverb is generated noise. All of it runs through the Web Audio API.</p></div>
<div class="card"><h3>Honest rhythms</h3><p>The patterns are simplified teaching versions that show each style's character. They are not transcriptions of specific songs.</p></div>
<div class="card"><h3>Stack</h3><p>Vanilla JavaScript, Web Audio, three.js for the visualiser, Vite. Your work is saved in your own browser.</p></div></div>
<p class="meta" style="margin-top:24px">Built by Afolabi Peter. Includes a step sequencer, song arranger, 10 lessons, theory tools and a sound lab.</p>`}};let yf=()=>"pluck",yl="";function fv(){const r=ft,t=Object.fromEntries(as.map(n=>[n.id,n])),e=[...r.tracks.map(n=>({k:"d",t:n,name:t[n.id].name,color:t[n.id].color})),{k:"m",t:r.bass,name:"Bass",color:"#ff6a3d",which:"bass"},{k:"m",t:r.lead,name:"Lead",color:"#8a7bff",which:"lead"}];Q("#seq").innerHTML=e.map((n,i)=>`<div class="row"><div class="rl"><button data-m="${i}" class="${n.t.mute?"m":""}">M</button>${n.name}<input type="range" class="vol" data-v="${i}" min="0" max="1.5" step="0.05" value="${n.t.vol}" aria-label="${n.name} volume"></div><div class="steps" style="grid-template-columns:repeat(${r.length},1fr);grid-auto-flow:row">${n.t.steps.map((s,a)=>`<button class="st ${s!=null&&(n.k==="m"||s!==0)?"on":""} ${s===2?"acc":""}" data-r="${i}" data-i="${a}" style="--c:${n.color}" aria-label="${n.name} step ${a+1}">${n.k==="m"&&s!=null?s+1:""}</button>`).join("")}</div></div>`).join(""),Nt(".st").forEach(n=>n.onclick=()=>{const i=e[+n.dataset.r],s=+n.dataset.i;if(i.k==="d")i.t.steps[s]=(i.t.steps[s]+1)%3,i.t.steps[s]&&(Le(),Dt.drum(i.t.id,Sn()+.005,i.t.steps[s]===2?1.2:.8));else{const o=i.t.steps[s];if(i.t.steps[s]=o==null?0:o>=6?null:o+1,i.t.steps[s]!=null){const l=yn[ft.scaleName],c=i.t.steps[s],h=i.which==="bass"?2:4,u=ft.root+12*(h+1)+l[c%l.length]+12*Math.floor(c/l.length);Le(),i.which==="bass"?Dt.bass(Sn()+.005,u,.4):Dt.lead(Sn()+.005,u,.5,1,ft.lead.kind)}}const a=i.t.steps[s];n.className="st"+(a!=null&&(i.k==="m"||a!==0)?" on":"")+(a===2?" acc":""),i.k==="m"&&(n.textContent=a!=null?a+1:""),be()}),Nt(".vol").forEach(n=>n.oninput=()=>{e[+n.dataset.v].t.vol=+n.value,be()}),Nt("[data-m]").forEach(n=>n.onclick=()=>{const i=e[+n.dataset.m];i.t.mute=!i.t.mute,n.classList.toggle("m",i.t.mute),be()})}const dv={a:0,w:1,s:2,e:3,d:4,f:5,t:6,g:7,y:8,h:9,u:10,j:11,k:12,o:13,l:14};addEventListener("keydown",r=>{if(r.repeat||r.metaKey||r.ctrlKey||r.altKey||/INPUT|SELECT|TEXTAREA/.test(r.target.tagName))return;const t=location.hash;if(!/studio|lab/.test(t)){r.code==="Space"&&!/button|a/i.test(r.target.tagName)&&(r.preventDefault(),xs());return}if(r.code==="Space"){r.preventDefault(),xs();return}const e=dv[r.key.toLowerCase()];e!=null&&pf(60+e,/lab/.test(t)?yf():"pluck")});function Sf(){const r=(location.hash.replace(/^#\/?/,"")||"home").split("?")[0].split("/")[0],t=ya[r]?r:"home";if(Nt("#nav a,#tabs a").forEach(e=>e.classList.toggle("on",e.getAttribute("href")==="#/"+(t==="home"?"":t))),t==="studio"){const e=location.hash.split("?p=")[1];if(e){try{const n=JSON.parse(decodeURIComponent(escape(atob(e))));n&&n.tracks&&n.length&&(ft=n,be())}catch{}history.replaceState(null,"","#/studio")}}window.__rq=null,ya[t](),scrollTo(0,0),nc(),vf(),pv(),document.title=t==="home"?"SONARA — a music studio made of code":`${t[0].toUpperCase()+t.slice(1)} · SONARA`}function pv(){if(Ql)return;const r=Nt(".alb,.card,.panel,.tile,.qk,.shh,.hero2 .txt > *,.chips",Rn).slice(0,60);Jl.fromTo(r,{opacity:0,y:22},{opacity:1,y:0,duration:.55,stagger:.025,ease:"power2.out",clearProps:"transform,opacity"})}Q("#q").addEventListener("input",r=>{yl=r.target.value,/rhythms/.test(location.hash)?window.__rq&&window.__rq(yl):location.hash="#/rhythms"});addEventListener("hashchange",Sf);Sf();
