
/* NOVA ART DIRECTION 15.1 — presentation-only extension.
   Safe composition atop Riftbreak + Blackout; no changes to player saves or scoring. */
(()=>{
'use strict';
const $15=id=>document.getElementById(id);
if(!$15('menu')||!$15('ui')||!$15('v14Parry')||typeof draw!=='function')return;
const menu=$15('menu'),ui=$15('ui'),hero=menu.querySelector('.v7-main');
const edition=menu.querySelector('.v7-build');if(edition)edition.textContent='NOVA EDITION · 15.1';
const brand=menu.querySelector('.v7-brand small');if(brand)brand.textContent='LYRA / NOVA EDITION';
const footer=menu.querySelector('.v7-footer>span:last-child');if(footer)footer.textContent='NOVA EDITION 15.1 · ENHANCED INTERFACE';
const heading=menu.querySelector('.v7-eyebrow>span');if(heading)heading.textContent='ASTRA DIVISION / UNIT 07';
const descr=hero.querySelector('.v7-description');
if(descr)descr.textContent='Slice through a collapsing cyber-city. Perfect your counters, breach titan shields and unleash Lyra’s Overdrive in a fast, cinematic one-thumb arcade adventure.';
const operation=document.createElement('div');operation.id='n15OpsLabel';
operation.innerHTML='<span><b>01</b> SLASH INCOMING THREATS</span><span><b>02</b> PARRY ENEMY STRIKES</span><span><b>03</b> UNLEASH LYRA</span>';
const actions=hero.querySelector('.v7-actions');hero.insertBefore(operation,actions);
const cont=$15('continueBtn').querySelector('strong');if(cont)cont.textContent='DEPLOY / CONTINUE';
const contSmall=$15('continueBtn').querySelector('small');if(contSmall)contSmall.textContent='RESUME YOUR CAMPAIGN';
const newGame=$15('start').querySelector('strong');if(newGame)newGame.textContent='FRESH CAMPAIGN';
const br=$15('bossRushBtn').querySelector('strong');if(br)br.textContent='TITAN GAUNTLET';
const pulse=$15('pulse');pulse.setAttribute('aria-label','Lyra Pulse ultimate ability, charges to 100 percent');
const parry=$15('v14Parry');parry.setAttribute('aria-label','Parry enemy attacks. Cooldown displayed on button.');
const pause=$15('pause');pause.setAttribute('aria-label','Pause the mission');
const objective=document.createElement('div');objective.id='n15Objective';objective.className='hidden';objective.setAttribute('role','status');
objective.innerHTML='<i></i><span id="n15Task">SLASH HOSTILES TO CHARGE OVERDRIVE</span>';
ui.append(objective);
const reticle=document.createElement('div');reticle.id='n15Reticle';reticle.setAttribute('aria-hidden','true');ui.append(reticle);
const impact=document.createElement('div');impact.id='n15Impact';impact.setAttribute('aria-hidden','true');ui.append(impact);
const focusBtn=document.createElement('button');focusBtn.id='n15FocusBtn';focusBtn.type='button';
$15('paused').querySelector('.v13-pause-settings').append(focusBtn);
const key='riftbreak_v15_focus_hud';
let focus=true;
try{const v=localStorage.getItem(key);if(v==='off')focus=false}catch(e){}
function syncFocus(){ui.classList.toggle('n15-focus',focus);focusBtn.textContent=focus?'◉ FOCUS HUD ON':'○ FOCUS HUD OFF';focusBtn.setAttribute('aria-pressed',String(focus))}
focusBtn.onclick=()=>{focus=!focus;syncFocus();try{localStorage.setItem(key,focus?'on':'off')}catch(e){}};
syncFocus();
const baseShow=show;
show=function(id){const r=baseShow(id);objective.classList.toggle('hidden',!!id);return r};
const baseReset=resetRun;
resetRun=function(lvl){const r=baseReset(lvl);impact.classList.remove('n15-active');ui.classList.remove('n15-hurt');return r};
const baseHitPlayer=hitPlayer;
let hurtUntil=0;
hitPlayer=function(damage){
const was=game.hp,r=baseHitPlayer(damage);
if(game.hp<was){hurtUntil=clock+.27;ui.classList.add('n15-hurt')}
return r;
};
let tick=0,lastText='',lastMode='';
const baseUpdate=update;
update=function(dt){
baseUpdate(dt);
if(hurtUntil&&clock>=hurtUntil){hurtUntil=0;ui.classList.remove('n15-hurt')}
if(game.mode!=='play'){objective.classList.add('hidden');return}
objective.classList.remove('hidden');
tick+=dt;if(tick<.12)return;tick=0;
let mode='normal',copy='SLASH HOSTILES TO CHARGE LYRA PULSE';
if(game.training){copy='TRAINING · FOLLOW LYRA’S INSTRUCTIONS'}
else if(game.bossAttack){mode='danger';copy='⚠ EMP ACTIVE · SLASH ORANGE SIGNAL NODE'}
else if(game.laserAttack){mode='danger';copy='⚠ RAGE LASER · CUT REACTOR TWICE'}
else if(game.boss){
if(game.boss.shieldDown>0){mode='ready';copy='BOSS EXPOSED · ATTACK CORE · '+Math.ceil(game.boss.shieldDown)+'s'}
else if(game.mp>=100){mode='ready';copy='ULTIMATE READY · TAP LYRA PULSE TO BREACH SHIELD'}
else copy='BOSS SHIELDED · SLASH MINIONS FOR ENERGY';
}else if(game.mp>=100){mode='ready';copy='LYRA PULSE READY · CLEAR THE ARENA'}
else if(game.feverUntil>clock){mode='ready';copy='FEVER ACTIVE · KEEP YOUR COMBO ALIVE'}
else if(game.hp/game.maxHp<.27){mode='danger';copy='CRITICAL HULL · AVOID MISSED TARGETS'}
else if(game.combo>=8){copy=game.combo+' HIT CHAIN · MAINTAIN YOUR STREAK'}
if(copy!==lastText){$15('n15Task').textContent=copy;lastText=copy}
if(mode!==lastMode){objective.classList.remove('danger','ready');if(mode!=='normal')objective.classList.add(mode);lastMode=mode}
pulse.setAttribute('aria-label','Lyra Pulse '+Math.floor(game.mp)+' percent'+(game.mp>=100?', ready to activate':', charging'));
if(parry.classList.contains('cooling'))parry.setAttribute('aria-label','Parry recharging, '+parry.textContent.replace('◇',''));
else parry.setAttribute('aria-label','Parry ready. Tap before impact to counter.');
};
const impacts=[];
const baseDestroy=destroyEntity;
destroyEntity=function(e){
const x=e.x,y=e.y,color=e.type==='armor'?'#8cf4ff':e.type==='charger'?'#ff9d69':e.type==='splitter'?'#ffcb85':'#ff78b9';
const r=baseDestroy(e);
if(game.mode==='play'){if(impacts.length>20)impacts.shift();impacts.push({x,y,color,t:clock,radius:Math.max(27,e.size*1.8)})}
return r;
};
const environment={
  spires:Array.from({length:19},(_,i)=>({x:(i+.5)/19,height:.07+((i*19)%13)/110,phase:i*.83,side:i%2})),
  drones:Array.from({length:6},(_,i)=>({x:(i*.173+ .12)%1,y:(i*.137+.17)%1,phase:i*2.9,size:1+i%3}))
};
const baseBackground=background;
background=function(){
baseBackground();
if(game.mode!=='play'&&game.mode!=='warning')return;
const lite=save.fxQuality==='lite',unit=Math.min(W,H),phase=clock;
ctx.save();
ctx.globalCompositeOperation='screen';
const sky=ctx.createRadialGradient(W*.72,H*.25,0,W*.72,H*.25,Math.max(W,H)*.57);
sky.addColorStop(0,'#ff717315');sky.addColorStop(.44,'#d9657811');sky.addColorStop(1,'#00000000');
ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
// Kinetic architectural light towers. Kept behind targets to preserve readability.
for(const s of environment.spires){
const x=s.x*W+Math.sin(phase*.06+s.phase)*4,top=H*(.51-s.height);
const breadth=Math.max(2,W*.007);
ctx.globalAlpha=.11;ctx.fillStyle=s.side?'#ff6f83':'#6ce9ff';
ctx.fillRect(x,top,breadth,H*.32);
ctx.globalAlpha=.19;ctx.strokeStyle=s.side?'#ff9ca5':'#78eaff';ctx.lineWidth=lite?1:1.5;
ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,top-H*.07);ctx.stroke();
ctx.globalAlpha=.6;ctx.fillStyle=s.side?'#ff6a85':'#92faff';ctx.fillRect(x-1,top-H*.07,2,2);
}
ctx.globalAlpha=1;
for(let i=0;i<(lite?2:environment.drones.length);i++){
const d=environment.drones[i],x=(((d.x+clock*(.009+d.size*.002))%1)+1)%1*W,y=(.14+d.y*.37)*H+Math.sin(phase*.6+d.phase)*9;
ctx.save();ctx.translate(x,y);ctx.rotate(-.2);
ctx.globalAlpha=.28;ctx.strokeStyle=i%2?'#ffa798':'#76f5ff';ctx.lineWidth=1.3;
ctx.beginPath();ctx.moveTo(-8,-1);ctx.lineTo(0,-4);ctx.lineTo(8,-1);ctx.moveTo(0,-4);ctx.lineTo(0,3);ctx.stroke();
ctx.restore();
}
// Controlled bloom near horizon: do not flash near central player target area.
const bloom=ctx.createLinearGradient(0,H*.53,0,H*.76);
bloom.addColorStop(0,'#63e7ff00');bloom.addColorStop(.33,'#63e7ff0c');bloom.addColorStop(1,'#63e7ff00');
ctx.fillStyle=bloom;ctx.fillRect(0,H*.53,W,H*.24);
ctx.restore();
};
const baseDraw=draw;
draw=function(){
baseDraw();
if(game.mode!=='play'&&game.mode!=='warning')return;
const lite=save.fxQuality==='lite';
ctx.save();ctx.globalCompositeOperation='screen';
// Light kinetic frame with deliberately open center.
if(!lite){
const u=(clock*.13)%1,edge=Math.max(12,Math.min(30,W*.023));
ctx.strokeStyle='#8febff30';ctx.lineWidth=1;
for(let i=0;i<3;i++){
const y=(.23+i*.28)*H,dist=23+12*Math.sin(clock*.8+i);
ctx.beginPath();ctx.moveTo(edge,y-dist);ctx.lineTo(edge,y+dist);
ctx.moveTo(W-edge,y-dist);ctx.lineTo(W-edge,y+dist);ctx.stroke();
}
ctx.fillStyle='#ff9aa048';ctx.fillRect(edge,H*(.15+u*.7),2,21);
ctx.fillStyle='#92f7ff40';ctx.fillRect(W-edge-2,H*(.77-u*.55),2,18);
}
// Physical cut flashes and shock rings; short, restrained, no heavy full-screen blur.
for(let i=impacts.length-1;i>=0;i--){
const p=impacts[i],age=clock-p.t;
if(age>.4){impacts.splice(i,1);continue}
const q=age/.4,rad=p.radius*(.36+q*1.25);
ctx.globalAlpha=(1-q)*.86;ctx.lineWidth=Math.max(1,3*(1-q));ctx.shadowColor=p.color;ctx.shadowBlur=lite?0:22;
ctx.strokeStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,rad,0,Math.PI*2);ctx.stroke();
if(!lite){ctx.beginPath();ctx.moveTo(p.x-rad*.8,p.y-rad*.2);ctx.lineTo(p.x+rad*.8,p.y+rad*.2);ctx.stroke()}
}
ctx.restore();
};
window.NOVA_EDITION={version:'15.1',getHUD:()=>({mode:game.mode,focus,objective:lastText,pulse:Math.floor(game.mp),sector:game.level})};
console.info('[NOVA 15.1] Cinematic command deck, adaptive HUD, accessible touch controls, volumetric skyline ready');
})();
