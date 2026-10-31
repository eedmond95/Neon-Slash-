
/* NEON ECHO BLACKOUT PROTOCOL 14.0. Keeps the existing campaign and Lyra engine. */
(function(){
'use strict';
if(typeof game==='undefined'||!document.getElementById('menu'))return;
const get=id=>document.getElementById(id),doc=document;
const state={trial:false,lastTrial:false,bossCalled:false,bossDefeated:false,won:false,link:null,nextLink:17,links:0,failures:0,chain:0,lastHit:-8,cinemaUntil:0,flash:0,elapsedAtEnd:0};
doc.title='NEON ECHO — BLACKOUT PROTOCOL v14.0';
const menu=get('menu'),shell=menu.querySelector('.v7-shell'),hero=menu.querySelector('.v7-main'),acts=hero.querySelector('.v7-actions');
const sky=doc.createElement('div');sky.id='n14Sky';sky.setAttribute('aria-hidden','true');shell.prepend(sky);
const alert=doc.createElement('div');alert.id='n14Alert';alert.innerHTML='<i></i><strong>ASTRA RED ALERT</strong> // BLACKOUT SIGNAL DETECTED <em>UNIT 07 ONLINE</em>';hero.insertBefore(alert,acts);
const trialButton=doc.createElement('button');trialButton.id='v14BlackoutBtn';trialButton.innerHTML='<span class="n14symbol">⟁</span><span class="v7-btn-copy"><strong>BLACKOUT SURVIVAL</strong><small>90 SECONDS · THREE-SEAL DUELS · FINAL COMMANDER</small></span><span class="n14arrow">↗</span>';acts.prepend(trialButton);
const edition=doc.createElement('div');edition.id='n14TrialLabel';edition.textContent='NEW CAMPAIGN EVENT // BLACKOUT PROTOCOL';hero.insertBefore(edition,hero.querySelector('.v8-feature-banner'));
const build=hero.querySelector('.v7-build');if(build)build.textContent='BLACKOUT // v14';
const subtitle=hero.querySelector('.v7-subtitle');if(subtitle)subtitle.innerHTML='<i></i> LYRA’S SLASH <span>— THE CITY IS FALLING</span>';
const desc=hero.querySelector('.v7-description');if(desc)desc.textContent='Neon City is collapsing into a dimensional blackout. Slash hostile constructs, break three numbered Rift Seals in sequence, and hold out for Lyra’s final stand.';
const banner=hero.querySelector('.v8-feature-banner');if(banner)banner.innerHTML='<strong>BLACKOUT PROTOCOL 14.0</strong><span>NEW 90s TRIAL</span><span>RIFT SEQUENCES</span><span>COMMANDER DUEL</span>';
const brand=menu.querySelector('.v7-brand small');if(brand)brand.textContent='LYRA // BLACKOUT PROTOCOL';
const foot=menu.querySelector('.v7-footer');if(foot&&foot.lastElementChild)foot.lastElementChild.textContent='BLACKOUT PROTOCOL / 14.0';
const status=doc.createElement('div');status.id='n14Status';status.className='hidden';status.innerHTML='<span id="n14Mode">◈ CAMPAIGN</span><strong id="n14Timer">RIFT SECURE</strong><em id="n14Links">0 SEALS</em>';get('ui').appendChild(status);
const sequence=doc.createElement('div');sequence.id='n14Sequence';sequence.className='hidden';sequence.innerHTML='<small>⟁ DIMENSIONAL RIFT // THREAT LEVEL OMEGA</small><strong id="n14Target">SLASH NUMBER 1</strong><span>STRIKE THE THREE SEALS IN ORDER · <b id="n14Seconds">9.0</b>s</span><meter id="n14Meter" min="0" max="1" value="1"></meter>';get('ui').appendChild(sequence);
const cine=doc.createElement('div');cine.id='n14Cinematic';cine.className='hidden';cine.setAttribute('aria-hidden','true');cine.innerHTML='<small id="n14CineTag">ASTRA COMMAND // UNIT 07</small><strong id="n14CineTitle">BLACKOUT</strong><span id="n14CineDesc">LYRA // NEURAL NETWORK ONLINE</span><svg viewBox="0 0 280 510"><use href="#lyraFullArt"></use></svg>';doc.body.appendChild(cine);
const note=doc.createElement('div');note.id='n14Note';note.className='hidden';get('end').querySelector('.v13-results').appendChild(note);
function cinematic(kicker,title,detail,seconds=1.35){get('n14CineTag').textContent=kicker;get('n14CineTitle').textContent=title;get('n14CineDesc').textContent=detail;cine.classList.remove('hidden');cine.style.animation='none';void cine.offsetWidth;cine.style.animation='n14cine '+seconds+'s ease-out both';state.cinemaUntil=performance.now()+seconds*1000}
function clearLink(){state.link=null;sequence.classList.add('hidden');get('ui').classList.remove('n14danger')}
function resetState(){state.trial=false;state.won=false;state.bossCalled=false;state.bossDefeated=false;state.link=null;state.nextLink=17;state.links=0;state.failures=0;state.chain=0;state.lastHit=-8;clearLink();status.classList.remove('hidden')}
const baseReset=resetRun;
resetRun=function(level){const r=baseReset(level);resetState();state.lastTrial=false;note.classList.add('hidden');return r};
function startTrial(){
resetRun(1);state.trial=true;state.lastTrial=true;state.bossCalled=false;state.nextLink=8;
game.level=Math.min(8,Math.max(3,Number(save.highestUnlocked||1)+2));game.levelQuota=999999;game.progress=0;game.mp=35;game.spawnTimer=1;game.directorWavesUntil=1;game.elapsed=0;
get('n14Mode').textContent='◈ BLACKOUT';get('n14Timer').textContent='01:30';
cinematic('CITYWIDE EMERGENCY / UNIT 07','BLACKOUT','90 SECONDS • SEQUENCE STRIKES • FINAL COMMANDER',1.55);
try{lyraSay('LYRA ONLINE. DEFEND THE CITY!',2.4);sound('boss')}catch(e){}
}
trialButton.onclick=startTrial;
const baseShow=show;
show=function(id){const r=baseShow(id);status.classList.toggle('hidden',!!id);sequence.classList.toggle('hidden',!!id||!state.link);if(id&&id!=='warning')cine.classList.add('hidden');return r};
const baseLevelUp=levelUp;
levelUp=function(){
if(!state.trial)return baseLevelUp();
state.bossDefeated=true;game.boss=null;game.bossAttack=null;game.laserAttack=null;game.mode='play';game.levelQuota=999999;game.progress=0;game.hp=Math.min(game.maxHp,game.hp+30);game.mp=Math.min(100,game.mp+40);game.earned+=250;game.spawnTimer=1.5;
for(const e of entities)e.active=false;clearLink();show('');
cinematic('COMMANDER ROUTED / LYRA','RIFT BROKEN','FINAL ESCAPE // SURVIVE THE BLACKOUT',1.1);try{lyraSay('COMMANDER DOWN. HOLD THE LINE!',2.1)}catch(e){}
};
const baseFinish=finish;
finish=function(){
const trial=state.trial,won=state.won;state.elapsedAtEnd=game.elapsed;
if(trial)clearLink();
const r=baseFinish();
if(!trial)return r;
state.trial=false;state.lastTrial=true;game.lastRush=false;game.lastTraining=false;
const bonus=won?325+state.links*65+(state.bossDefeated?250:0):state.links*30;
save.stardust+=bonus;save.blackoutBest=Math.max(save.blackoutBest||0,game.score);save.blackoutLinks=Math.max(save.blackoutLinks||0,state.links);persist();
get('endtag').textContent=won?'BLACKOUT COMPLETE // CITY SAVED':'BLACKOUT // SIGNAL LOST';
get('endtitle').textContent=won?'CITY DEFENDED':'BLACKOUT FAILED';
get('endstats').textContent='SCORE '+game.score.toLocaleString()+' · '+Math.floor(state.elapsedAtEnd)+'s SURVIVED';
get('endmessage').textContent=won?'Lyra held the line. '+(state.bossDefeated?'The commander was defeated. ':'The commander escaped. ')+'Beat your record in another Blackout run.':'The defense line broke. Break the numbered seals to earn Overdrive and create openings.';
get('endreward').textContent='✦ +'+Math.round(game.earned+bonus).toLocaleString()+' STARDUST BANKED';
note.classList.remove('hidden');note.textContent='⟁ MISSION // '+state.links+' RIFT SEQUENCES SOLVED · '+state.failures+' FAILED · '+(state.bossDefeated?'COMMANDER DEFEATED':'COMMANDER ACTIVE')+' · BEST SCORE '+save.blackoutBest.toLocaleString();
return r;
};
const oldAgain=get('again').onclick;
get('again').onclick=function(){if(state.lastTrial)return startTrial();note.classList.add('hidden');if(oldAgain)return oldAgain.call(this)};
const oldHome=toHub;toHub=function(){state.trial=false;clearLink();cine.classList.add('hidden');return oldHome()};
function point(n){return{x:n.x+Math.sin(clock*2.3+n.a)*Math.min(17,W*.04),y:n.y+Math.cos(clock*1.9+n.a)*Math.min(12,H*.025)}}
function segmentDist(x,y,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-ax-dx*t,y-ay-dy*t)}
function spawnLink(){
const poses=[[.20,.33],[.77,.61],[.44,.47]];
state.link={nodes:poses.map((p,i)=>({x:W*p[0],y:H*p[1],a:i*2.17,r:Math.max(31,Math.min(45,Math.min(W,H)*.08))})),i:0,deadline:clock+(state.trial?8.5:10),duration:state.trial?8.5:10};
sequence.classList.remove('hidden');get('ui').classList.add('n14danger');
try{lyraSay('RIFT SEALS! SLASH ONE, TWO, THREE!',1.9);sound('boss')}catch(e){}
}
function solveLink(){
state.links++;state.chain++;game.mp=Math.min(100,game.mp+32);game.hp=Math.min(game.maxHp,game.hp+8);game.score+=900*state.chain;game.earned+=35+state.chain*20;game.shake=Math.max(14,game.shake);game.feverUntil=Math.max(game.feverUntil||0,clock+3.5);
const targets=entities.filter(e=>e.active&&!['bomb','orb','prism'].includes(e.type)).slice(0,Math.min(7,2+state.chain));game.chainBusy=true;try{for(const e of targets){if(e.active){e.hp=0;destroyEntity(e)}}}finally{game.chainBusy=false}
if(game.boss){game.boss.shieldDown=Math.max(game.boss.shieldDown||0,5);game.boss.cool=0;impactRing(game.boss.x,game.boss.y,'#dfff78',Math.min(W,H)*.5,2)}
impactRing(W*.5,H*.5,'#deff74',Math.max(W,H)*.65,2);spawnParticle(W*.5,H*.5,'#d4ff81',90,1.6);
clearLink();state.nextLink=game.elapsed+(state.trial?16:27);
cinematic('ASTRA EXECUTION / '+state.links,'RIFT SHATTER','+32 OVERDRIVE · THREATS CLEARED · BOSS EXPOSED',1.05);try{lyraSay('THE SHIELD IS DOWN. STRIKE!',2);sound('pulse')}catch(e){}
}
function accept(ax,ay,bx,by){
const l=state.link;if(!l||game.mode!=='play'||clock-state.lastHit<.18)return false;
const n=l.nodes[l.i],p=point(n);
if(segmentDist(p.x,p.y,ax,ay,bx,by)>n.r+17)return false;
state.lastHit=clock;l.i++;impactRing(p.x,p.y,'#dfff85',Math.min(W,H)*.17,2);spawnParticle(p.x,p.y,'#dfff7b',33,1.1);floatText(p.x,p.y,'SEAL '+l.i+' / 3','#f1ffb2');try{sound('perfect')}catch(e){}
if(l.i>=3)solveLink();else l.deadline+=.6;
return true;
}
const baseSlash=slash;slash=function(ax,ay,bx,by){if(state.link)accept(ax,ay,bx,by);return baseSlash(ax,ay,bx,by)};
const baseTap=tapSlash;tapSlash=function(x,y){if(state.link&&accept(x-1,y-1,x+1,y+1))return;return baseTap(x,y)};
const baseUpdate=update;
update=function(dt){
baseUpdate(dt);
if(state.cinemaUntil&&performance.now()>=state.cinemaUntil){cine.classList.add('hidden');state.cinemaUntil=0}
if(game.mode!=='play'){if(game.mode==='warning'&&state.link)clearLink();return}
if(state.trial){
if(!state.bossCalled&&game.elapsed>=40){state.bossCalled=true;clearLink();enterWarning();cinematic('ALERT / 40-SECOND MARK','INCOMING','THE BLACKOUT COMMANDER APPROACHES',1.15);return}
if(game.elapsed>=90){state.won=true;finish();return}
game.levelQuota=999999;
}
if(!state.link&&game.elapsed>=state.nextLink&&!game.training&&!(game.levelTransitionUntil>clock)&&!(game.pulseUntil>clock))spawnLink();
if(state.link){
const l=state.link;if(game.pulseUntil>clock)l.deadline+=dt;
if(clock>=l.deadline){clearLink();state.failures++;state.chain=0;state.nextLink=game.elapsed+(state.trial?17:27);state.flash=.9;hitPlayer(state.trial?15:11);try{lyraSay('RIFT BREACH! RECHARGE!',1.8)}catch(e){}}
else{get('n14Target').textContent='CUT SEAL '+(l.i+1)+' / 3';get('n14Seconds').textContent=Math.max(0,l.deadline-clock).toFixed(1);get('n14Meter').value=Math.max(0,(l.deadline-clock)/l.duration)}
}
state.flash=Math.max(0,state.flash-dt*1.5);
get('n14Mode').textContent=state.trial?'◈ BLACKOUT':'◈ CAMPAIGN';
get('n14Timer').textContent=state.trial?String(Math.floor(Math.max(0,90-game.elapsed)/60)).padStart(2,'0')+':'+String(Math.ceil(Math.max(0,90-game.elapsed))%60).padStart(2,'0'):state.link?'RIFT DUEL':'RIFT SECURE';
get('n14Links').textContent=state.links+' SHATTERS';
};
const baseDraw=draw;
draw=function(){baseDraw();if(game.mode!=='play'&&game.mode!=='warning')return;
ctx.save();ctx.globalCompositeOperation='screen';
const light=save.fxQuality==='lite',t=clock;
for(let i=0;i<(light?5:12);i++){const x=(i*81+t*23)%(W+120)-60,y=(i*i*61+t*39)%(H+80)-40;ctx.strokeStyle=i%3?'#8bfaff2c':'#e4ff6f49';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-10,y+17+i%9);ctx.stroke()}
if(state.trial){ctx.strokeStyle='#d7ff7555';ctx.lineWidth=1;ctx.strokeRect(17,17,W-34,H-34)}
if(state.link){
const l=state.link;
for(let j=0;j<3;j++){const n=l.nodes[j],p=point(n),next=j===l.i,done=j<l.i,r=n.r*(1+.06*Math.sin(t*6+j));const c=done?'#71ffb9':next?'#e2ff79':'#74dffe';ctx.save();ctx.translate(p.x,p.y);ctx.globalAlpha=done?.26:next?1:.52;ctx.strokeStyle=c;ctx.shadowColor=c;ctx.shadowBlur=light?8:27;ctx.lineWidth=next?4:2;ctx.rotate(t*(next?.45:-.22));ctx.strokeRect(-r*.76,-r*.76,r*1.52,r*1.52);ctx.rotate(-t*(next?.45:-.22));ctx.beginPath();ctx.arc(0,0,r*1.07,0,6.283);ctx.stroke();ctx.font='1000 '+Math.round(n.r*.94)+'px ui-monospace,monospace';ctx.fillStyle='#f3ffcc';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(j+1),0,0);if(next){ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*1.4,Math.PI*.1,Math.PI*1.45);ctx.stroke()}ctx.restore()}
for(let j=0;j<l.i-1;j++){const a=point(l.nodes[j]),b=point(l.nodes[j+1]);ctx.strokeStyle='#d8ff7c';ctx.lineWidth=3;ctx.shadowColor='#d7ff7c';ctx.shadowBlur=18;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
}
if(state.flash){ctx.fillStyle='#edff6a';ctx.globalAlpha=state.flash*.4;ctx.fillRect(0,0,W,H)}
ctx.restore();
};
const tip=doc.createElement('p');tip.innerHTML='<strong>BLACKOUT:</strong> In the new 90-second operation, survive incoming waves and a commander at the 40-second mark. When a Rift Sequence appears, slash the glowing numbered seals <b>1 → 2 → 3</b> before time expires. Success clears targets, grants Overdrive, and exposes boss shields; failure costs Hull.';get('howto').querySelector('.tutorial-panel').appendChild(tip);
const origRush=get('bossRushBtn').onclick;if(origRush)get('bossRushBtn').onclick=function(){state.lastTrial=false;note.classList.add('hidden');return origRush.call(this)};
const origStart=get('start').onclick;if(origStart)get('start').onclick=function(){state.lastTrial=false;note.classList.add('hidden');return origStart.call(this)};
const origContinue=get('continueBtn').onclick;if(origContinue)get('continueBtn').onclick=function(){state.lastTrial=false;note.classList.add('hidden');return origContinue.call(this)};
window.__BLACKOUT_V14__={version:'14.0',startTrial,getStatus:()=>({trial:state.trial,links:state.links,bossDefeated:state.bossDefeated,remaining:Math.max(0,90-game.elapsed)})};
})();
