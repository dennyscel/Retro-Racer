export function createFixedLoop({step=1/60,update,render,onSlowFrame=()=>{},getFpsCap=()=>60,getTimeScale=()=>1}){
  let last=0,acc=0,raf=0,lastRender=0,slow=0,running=false;
  function frame(now){if(!running)return;const cap=getFpsCap()===30?33.1:16.0;if(lastRender&&now-lastRender<cap){raf=requestAnimationFrame(frame);return;}lastRender=now;if(!last)last=now;const ft=Math.min((now-last)/1000,.25);last=now;acc+=ft;const threshold=getFpsCap()===30?.045:.022;if(ft>threshold)slow++;else slow=Math.max(0,slow-2);if(slow>=20){onSlowFrame();slow=0;}while(acc>=step){update(step*getTimeScale());acc-=step;}render(acc/step);raf=requestAnimationFrame(frame);}
  return{start(){if(running)return;running=true;raf=requestAnimationFrame(frame);},stop(){running=false;if(raf)cancelAnimationFrame(raf);},reset(){last=0;acc=0;lastRender=0;slow=0;},get running(){return running;}};
}
