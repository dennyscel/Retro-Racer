// CICLO 21 — integridade local: provas de recorde por replay+seed e relógio monotônico best-effort.
const FNV_OFFSET=2166136261,FNV_PRIME=16777619;const rawDateKey=globalThis.localDateKey;
function fnv(s){let h=FNV_OFFSET>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i)&255;h=Math.imul(h,FNV_PRIME)>>>0;}return h>>>0;}
function proofBody(p){return[p.level,p.car,p.time,p.seed,p.replay?.sampleCount,p.replay?.encoding,p.replay?.payload].join('|');}
function replayFrames(rep){try{return window.RRCore?.lapReplay?.decode(rep)||[];}catch(e){return[];}}
function validReplay(rep,time){if(!rep||!rep.payload||!Number.isFinite(time)||time<5)return false;const frames=replayFrames(rep),count=Number(rep.sampleCount)||0;if(!count||frames.length!==count)return false;const hz=Math.max(1,Number(rep.hz)||20),expected=time*hz;return Math.abs(count-expected)<=Math.max(4,Math.ceil(hz*.25));}
globalThis.integrityMakeProof=function integrityMakeProof(level,time,rep,seed,car){if(!validReplay(rep,time))return null;const p={v:1,level:Number(level),time:+Number(time).toFixed(6),seed:String(seed||''),car:Number(car)||0,replay:structuredClone(rep)};p.checksum=fnv(proofBody(p));return p;};
globalThis.integrityVerifyProof=function integrityVerifyProof(p){if(!p||p.v!==1||!validReplay(p.replay,Number(p.time)))return false;return (fnv(proofBody(p))>>>0)===(Number(p.checksum)>>>0);};
globalThis.integrityAcceptLapRecord=function integrityAcceptLapRecord(level,time){const old=globalThis.integrityVerifiedRecord?integrityVerifiedRecord(level):0;if(old&&time>=old)return false;const rep=window.RRCore?.lapReplay?.finish?.();const proof=integrityMakeProof(level,time,rep,window.RRCore?.rng?.seed,career.selectedCar);if(!proof)return false;career.records[level]=time;career.integrity.recordProofs[level]=proof;saveCareer();return true;};
globalThis.integrityGhostValid=function integrityGhostValid(g){if(!g||!g.proof)return false;return integrityVerifyProof(g.proof)&&Math.abs(Number(g.time)-Number(g.proof.time))<.001;};
globalThis.integrityVerifiedRecord=function integrityVerifiedRecord(level){const p=career.integrity?.recordProofs?.[level],r=Number(career.records[level]||0);return integrityVerifyProof(p)&&Math.abs(r-Number(p.time))<.001?Number(p.time):0;};
globalThis.integrityAuditRecords=function integrityAuditRecords(){const bad=[];let verified=0;for(const [k,p] of Object.entries(career.integrity?.recordProofs||{})){if(integrityVerifyProof(p)&&Math.abs(Number(career.records[k]||0)-Number(p.time))<.001)verified++;else bad.push(k);}return{verified,bad,legacy:Object.keys(career.integrity?.legacyRecords||{}).length};};
function wallDay(ms){const d=new Date(ms);return rawDateKey?rawDateKey(d):`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
let bootWall=Date.now(),bootMono=performance.now();
function checkClock(){const c=career.integrity.clock,now=Date.now(),mono=performance.now();if(c.lastWall&&now<c.lastWall-300000){c.suspect=true;c.reason='RELÓGIO VOLTOU';}const wallDelta=now-bootWall,monoDelta=mono-bootMono;if(Math.abs(wallDelta-monoDelta)>120000){c.suspect=true;c.reason='SALTO DE RELÓGIO NA SESSÃO';}if(!c.suspect)c.lastGoodDay=wallDay(now);c.lastWall=Math.max(c.lastWall||0,now);saveCareer();return c;}
globalThis.integrityClockCheck=checkClock;
globalThis.integrityTrustedDateKey=function integrityTrustedDateKey(d=new Date()){const c=checkClock();if(c.suspect&&c.lastGoodDay)return c.lastGoodDay;return rawDateKey?rawDateKey(d):wallDay(d.getTime());};
if(rawDateKey)globalThis.localDateKey=(d=new Date())=>integrityTrustedDateKey(d);
setInterval(checkClock,60000);checkClock();career.flags.c21Integrity=true;saveCareer();
