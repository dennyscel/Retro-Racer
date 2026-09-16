import * as state from './core/state.js';
import * as cars from './meta/cars.js';
import { RngHub } from './core/rng.js';
import { EventBus } from './core/events.js';
import { InputReplay, determinismSelfTest } from './core/replay.js';
import { createFixedLoop } from './core/loop.js';
import * as assets from './core/assets.js';
import * as runtime from './core/runtime-store.js';

const BUILD_TAG=new URL(import.meta.url).searchParams.get('v')||'c22-v4',BUILD_QUERY=encodeURIComponent(BUILD_TAG);
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register(`./sw.js?v=${BUILD_QUERY}`,{updateViaCache:'none'}).then(reg=>reg.update()).catch(()=>{});

const rng=new RngHub(`boot|${state.career.level}`),events=new EventBus(),replay=new InputReplay(),lapReplay=new InputReplay();
window.RRCore={state,cars,rng,events,replay,lapReplay,assets,runtime,version:'AAA_R2+C21'};
state.loadCareer();
await assets.ensureActiveCircuit(state.career.level);

const runtimeModules=[
 './core/runtime-state.js','./audio/runtime.js','./ui/haptics.js','./ui/accessibility.js','./growth/telemetry.js','./meta/economy.js','./meta/combo-risk.js','./meta/rift.js','./ui/input.js','./growth/integrity.js','./meta/season.js','./meta/licenses.js','./meta/paint-shop.js','./meta/trainer.js','./meta/drive-modes.js','./audio/radio-live.js','./audio/adaptive.js','./meta/ghost-learning.js','./race/track-ai.js','./render/juice.js','./race/physics.js','./meta/results.js','./render/road-background.js','./render/car-fx.js','./render/weather.js','./ui/screens.js','./meta/story.js','./growth/shadow-code.js','./growth/highlight-clip.js','./ui/identity.js','./meta/ftue.js','./core/runtime-bridge.js'
];
for(const modulePath of runtimeModules) await import(`${modulePath}?v=${BUILD_QUERY}`);

const api=window.RRGameAPI;
if(!api)throw new Error('RRGameAPI não inicializada');
const loop=createFixedLoop({step:1/60,update:api.update,render:()=>{api.render();api.renderGarage();},getFpsCap:api.getFpsCap,getTimeScale:api.getTimeScale,onSlowFrame:api.onSlowFrame});
window.RRCore.loop=loop;window.RRCore.determinismSelfTest=determinismSelfTest;
api.boot();loop.start();

const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,1200));idle(()=>assets.ensureTrackCatalog().catch(()=>{}));
