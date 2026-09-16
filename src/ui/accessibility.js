// CICLO 18 — acessibilidade real, independente de dificuldade/recompensa.
const ASSIST=Object.freeze({OFF:0,LEVE:.28,MEDIO:.52,FORTE:.78});
const CAPTIONS=Object.freeze({beep:'SINAL DE LARGADA',go:'GO!',engine:'MOTOR LIGANDO',nitro:'NITRO ATIVO',crash:'IMPACTO',skid:'PNEUS DERRAPANDO',pit:'PIT · SERVIÇO',alarm:'ALERTA',buy:'COMPRA CONFIRMADA',win:'VITÓRIA',fail:'FALHA'});
let captionTimer=0;
function el(id){return document.getElementById(id);}
globalThis.applyAccessibilitySettings=function applyAccessibilitySettings(){
 const s=career.settings,b=document.body;['protan','deuter','tritan'].forEach(n=>b.classList.remove('cb-'+n));if(s.colorblind&&s.colorblind!=='OFF')b.classList.add('cb-'+String(s.colorblind).toLowerCase());
 b.classList.toggle('left-handed',!!s.leftHanded);b.classList.toggle('reduced-flash',!!s.reducedFlash);b.classList.toggle('captions-off',s.captions===false);
 const scale=MathUtils.limit(Number(s.buttonScale)||1,.8,1.4);b.style.setProperty('--vctrl-size',Math.round(64*scale)+'px');b.style.setProperty('--vctrl-gap',Math.round(10*scale)+'px');
 const v=el('virtualControls');if(v){v.dataset.hand=s.leftHanded?'left':'right';v.setAttribute('aria-label',s.leftHanded?'Controles virtuais para mão esquerda':'Controles virtuais para mão direita');}
};
globalThis.a11ySteerAssist=function a11ySteerAssist(seg,spPct,x,manual=0){const k=ASSIST[career.settings.steerAssist||'OFF']||0;if(!k||!seg||spPct<.12)return 0;const curve=MathUtils.limit(Number(seg.curve)||0,-4,4),edge=MathUtils.limit(-x*.22,-.22,.22);const desired=MathUtils.limit(curve*.055+edge,-.34,.34);const manualDamp=1-Math.min(1,Math.abs(manual))*.72;return desired*k*MathUtils.limit(spPct,0,1.1)*manualDamp;};
globalThis.a11yCaption=function a11yCaption(text,seconds=1.25){if(career.settings.captions===false)return;const c=el('a11yCaption');if(!c)return;clearTimeout(captionTimer);c.textContent=String(text||'');c.classList.add('show');captionTimer=setTimeout(()=>c.classList.remove('show'),Math.max(500,seconds*1000));};
globalThis.a11yCaptionSfx=function a11yCaptionSfx(type){const t=CAPTIONS[type];if(t)a11yCaption('🔊 '+t,type==='engine'?1.7:1.05);};
globalThis.a11yRadioCaption=function a11yRadioCaption(msg){if(msg)a11yCaption('📻 '+msg,1.6);};
globalThis.a11ySnapshot=function a11ySnapshot(){return{colorblind:career.settings.colorblind,leftHanded:!!career.settings.leftHanded,buttonScale:Number(career.settings.buttonScale)||1,steerAssist:career.settings.steerAssist,captions:career.settings.captions!==false,reducedFlash:!!career.settings.reducedFlash,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,rewardIndependent:true};};
