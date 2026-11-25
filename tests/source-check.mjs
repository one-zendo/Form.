import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const source=readFileSync(new URL('../src/index.js',import.meta.url),'utf8');
const browser=readFileSync(new URL("../src/browser.js.txt",import.meta.url),"utf8");
const core=Object.fromEntries(["storage","timer","calendar","progress","themes"].map(name=>[name,readFileSync(new URL("../src/core/"+name+".js.txt",import.meta.url),"utf8")]));
const developmentStorage=readFileSync(new URL('../src/development/reset.js.txt',import.meta.url),'utf8');
const developmentUI=readFileSync(new URL('../src/development/ui.js.txt',import.meta.url),'utf8');
const developmentMarkup=readFileSync(new URL('../src/development/dialog.js.txt',import.meta.url),'utf8');
const developmentEntry=readFileSync(new URL('../src/development.js',import.meta.url),'utf8');
const assembled=[...Object.values(core),'const storageRecoveryBlocked=false;',browser].join("\n");
new vm.Script([...Object.values(core),developmentStorage,'const storageRecoveryBlocked=false;',browser,developmentUI].join('\n'));
new vm.Script(assembled);
for(const [name,code] of Object.entries(core)){new vm.Script(code);assert.ok(source.includes('./core/'+name+'.js.txt'));}
assert.ok(source.includes('${browserScript}</script>'));
new vm.Script(browser);
const ids=[...source.matchAll(/\bid="([\w-]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate HTML IDs');
const dynamicIds=[...browser.matchAll(/\.id\s*=\s*"([\w-]+)"/g)].map(m=>m[1]);
for(const m of browser.matchAll(/\$\("([\w-]+)"\)/g)) assert.ok(ids.includes(m[1])||dynamicIds.includes(m[1]),'Missing element: '+m[1]);
console.log('Browser syntax and static DOM references passed');

const storage=vm.runInNewContext(core.storage+';({validRoutine,decodeRecord,encodeRecord})');
const routine={id:'test',name:'Test',description:'',exercises:[{name:'Squat',sets:[{weight:20,reps:8,rest:90}]}]};
const validate=v=>Array.isArray(v)&&v.every(storage.validRoutine);
assert.ok(storage.validRoutine(routine));
assert.equal(storage.validRoutine({...routine,exercises:[{name:'Squat',sets:[{weight:-1,reps:8,rest:90}]}]}),false);
assert.equal(storage.validRoutine({...routine,exercises:[{name:'Squat',sets:[{weight:20,reps:0,rest:90}]}]}),false);
assert.equal(storage.validRoutine({...routine,exercises:[{name:'Squat',sets:[{weight:20,reps:8,rest:1.5}]}]}),false);
assert.equal(JSON.stringify(storage.decodeRecord(JSON.stringify([routine]),[],validate)),JSON.stringify([routine]));
assert.equal(JSON.stringify(storage.decodeRecord(storage.encodeRecord([routine]),[],validate)),JSON.stringify([routine]));
assert.equal(storage.decodeRecord(null,[],validate).length,0);
for(const raw of ['broken','{}','{"version":2,"data":[]}','{"version":1,"data":[null]}'])assert.throws(()=>storage.decodeRecord(raw,[],validate));
assert.equal((browser.match(/function navigate\(p\)/g)||[]).length,1);
assert.ok(browser.includes('onclick=()=>guardLeave(()=>navigate(p))'));
console.log('Storage and navigation source regression checks passed');

const recoverFinish=vm.runInNewContext(core.storage+';finishJournal');
const entries=[{key:'form-workout-history',previous:'old',next:'new'},{key:'form-routines',previous:'oldr',next:'newr'},{key:'form-active-workout',previous:'active',next:'null'}];
for(let fail=1;fail<=9;fail++){
 const m=new Map(entries.map(x=>[x.key,x.previous]));let n=0;
 const storage={getItem:k=>m.get(k)??null,setItem(k,v){if(++n===fail)throw Error('simulated interruption');m.set(k,v)},removeItem(k){if(++n===fail)throw Error('simulated interruption');m.delete(k)}};
 try{recoverFinish(storage,entries)}catch{}
 if(m.has('form-finish-journal'))recoverFinish(storage);
 for(const x of entries)assert.equal(m.get(x.key),fail===1?x.previous:x.next);
 assert.equal(m.has('form-finish-journal'),false);
}
const conflict=new Map(entries.map(x=>[x.key,x.previous]));conflict.set('form-finish-journal',JSON.stringify(entries));conflict.set(entries[1].key,'conflict');
const conflictStorage={getItem:k=>conflict.get(k)??null,setItem:(k,v)=>conflict.set(k,v),removeItem:k=>conflict.delete(k)};
assert.throws(()=>recoverFinish(conflictStorage),/conflict/i);
assert.equal(conflict.get(entries[0].key),'old');
assert.equal(conflict.get(entries[1].key),'conflict');
console.log('Workout finish journal interruption and conflict checks passed');

const gestureStart=browser.indexOf('function exerciseSwipeGeometry(');
const gestureEnd=browser.indexOf('function cancelExerciseGesture(',gestureStart);
assert.ok(gestureStart>=0&&gestureEnd>gestureStart);
const gesture=vm.runInNewContext(browser.slice(gestureStart,gestureEnd)+';({exerciseSwipeGeometry,exerciseGestureDirection})');
for(const width of [100,240,320,700]){
 let last=48;
 for(let d=0;d<=width;d++){
  const g=gesture.exerciseSwipeGeometry(width,d);
  assert.ok(g.actionWidth>=last&&g.actionWidth-last<=1,'Swipe action width must expand continuously');
  assert.ok(g.opacity>=0&&g.opacity<=1);
  last=g.actionWidth;
 }
 assert.equal(gesture.exerciseSwipeGeometry(width,width).armed,true);
 assert.equal(gesture.exerciseSwipeGeometry(width,0).armed,false);
 assert.equal(gesture.exerciseSwipeGeometry(width,width+100).distance,width);
 assert.equal(gesture.exerciseSwipeGeometry(width,-100).distance,0);
}
for(const [dx,dy,open,expected] of [[2,1,false,'pending'],[-30,3,false,'swipe'],[-3,30,false,'scroll'],[30,3,false,'scroll'],[30,3,true,'swipe'],[-10,10,false,'scroll']])assert.equal(gesture.exerciseGestureDirection(dx,dy,open),expected);
console.log('Exercise swipe geometry and direction regression checks passed');

const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const globalTokens=new Map([...css.matchAll(/(--[\w-]+):([^;}]+)/g)].map(m=>[m[1],m[2]]));
for(const [key,value] of Object.entries({'radius-card':'20px','radius-dialog':'24px','radius-control':'12px','font-body':'17px','touch-target':'44px','motion-swipe':'260ms','motion-glide':'230ms','motion-drop':'200ms','motion-collapse':'280ms'}))assert.equal(globalTokens.get('--'+key),value);
assert.ok(!browser.includes(':root{--motion-fast:'),'Motion tokens must live in the global stylesheet');
assert.ok(!browser.includes('animation:finish-enter'),'Removal dialog must use a defined animation');
assert.ok(css.includes('@keyframes form-finish-float-in'));
assert.ok(browser.includes('prefers-reduced-motion:reduce){.exercise-remove-confirm[open]{animation:none}'));
const motionSource=browser.slice(browser.indexOf('const formMotion='),browser.indexOf('function motionAllowed'));
const motion=vm.runInNewContext(motionSource+';formMotion',{document:{documentElement:{}},getComputedStyle:()=>({getPropertyValue:key=>globalTokens.get(key)||''})});
for(const key of ['fast','tab','back','edit','standard','sheet','collapse','settle','celebrate','swipe','glide','drop'])assert.ok(Number.isFinite(motion[key])&&motion[key]>0,'Invalid motion token '+key);
for(const key of ['ease','spring','gesture-ease','system-ease'])assert.ok(motion[key].startsWith('cubic-bezier('));
console.log('Global design token and motion regression checks passed');

const foldStart=browser.indexOf('function homeFoldGeometry(');
const foldEnd=browser.indexOf('\n{const style=el("style");',foldStart);
assert.ok(foldStart>=0&&foldEnd>foldStart);
const fold=vm.runInNewContext(browser.slice(foldStart,foldEnd)+';({homeFoldGeometry,homeFoldVariables})');
const side=[{x:0,y:0,width:400,height:800},{x:420,y:0,width:400,height:800}];
const stack=[{x:0,y:0,width:400,height:400},{x:0,y:420,width:400,height:400}];
for(const [rects,w,h,mode] of [[side,820,800,'side'],[stack,400,820,'stack']]){
 for(const timer of [false,true]){
  const g=fold.homeFoldGeometry([...rects].reverse(),true,w,h,timer);
  assert.equal(g.mode,mode);
  const v=fold.homeFoldVariables(g,h,timer);
  for(const prefix of ['a','b']){
   assert.ok(v[prefix+'-width']>0);
   assert.ok(v[prefix+'-height']-v[prefix+'-clearance']-(prefix==='a'?100:v['b-header'])>0);
  }
  for(const [control,segment] of [['nav',mode==='side'?g.a:g.b],['timer',mode==='side'?g.b:g.a]]){
   assert.ok(v[control+'-center']-v[control+'-width']/2>=segment.x);
   assert.ok(v[control+'-center']+v[control+'-width']/2<=segment.x+segment.w);
   assert.ok(h-v[control+'-bottom']<=segment.y+segment.h);
  }
 }
}
assert.equal(fold.homeFoldGeometry(side,false,820,800,true),null);
assert.equal(fold.homeFoldGeometry([{...side[0]},{...side[1],x:380}],true,820,800,true),null);
assert.equal(fold.homeFoldGeometry(stack,true,400,700,true),null);
assert.equal(fold.homeFoldGeometry([{...side[0],width:NaN},side[1]],true,820,800,true),null);
assert.equal(fold.homeFoldGeometry([{x:0,y:0,width:300,height:210},{x:0,y:230,width:300,height:210}],true,300,440,true),null);
assert.ok(browser.includes('--floating-safe-width:calc(100% - var(--floating-safe-left) - var(--floating-safe-right))'));
console.log('Fold geometry, safe-area references and floating control regression checks passed');

const routineChecks=vm.runInNewContext(core.storage+';({routineDraftDirty,validDateStamp,uniqueRecordIds})');
const cleanRoutine={id:'a',name:'Push Day',description:'',exercises:[]};
const emptyRoutine={id:'b',name:'',description:'',exercises:[]};
assert.equal(routineChecks.routineDraftDirty(null,null),false);
assert.equal(routineChecks.routineDraftDirty(emptyRoutine,null),false);
assert.equal(routineChecks.routineDraftDirty(cleanRoutine,null),true);
assert.equal(routineChecks.routineDraftDirty(cleanRoutine,cleanRoutine),false);
assert.equal(routineChecks.routineDraftDirty({...cleanRoutine,name:'Pull Day'},cleanRoutine),true);
assert.equal(routineChecks.routineDraftDirty(cleanRoutine,null,JSON.stringify(cleanRoutine)),false);
assert.equal(routineChecks.uniqueRecordIds([cleanRoutine,emptyRoutine]),true);
assert.equal(routineChecks.uniqueRecordIds([cleanRoutine,cleanRoutine]),false);
for(const value of [NaN,Infinity,1e20,-1e20,'2026'])assert.equal(routineChecks.validDateStamp(value),false);
assert.equal(routineChecks.validDateStamp(0),true);
assert.equal(routineChecks.validDateStamp(1800000000000),true);
const stats=vm.runInNewContext(core.progress+';recordStats');
const result=stats({started:0,finished:120000,exercises:[{sets:[{done:true,weight:20,reps:10},{done:false,weight:100,reps:100}]},{sets:[{done:true,weight:30,reps:5}]}]});
assert.equal(result.sets,2);assert.equal(result.reps,15);assert.equal(result.volume,350);assert.equal(result.minutes,2);assert.equal(result.exercises,2);
console.log('Routine draft, record identity, timestamp and history summary regression checks passed');

const timer=vm.runInNewContext(core.timer+';({restTimeLeft,restAdjustment,beginSessionRest,clearSessionRest})');
const resting={restUntil:91000,restTotal:90000,restOriginal:90000};
assert.equal(timer.restTimeLeft(resting,1000),90000);
assert.equal(timer.restTimeLeft(resting,31000),60000);
assert.equal(timer.restTimeLeft(resting,91000),0);
assert.equal(timer.restTimeLeft(resting,120000),0);
assert.equal(timer.restAdjustment(resting,15,31000).restUntil,106000);
assert.equal(timer.restAdjustment(resting,-15,31000).restUntil,76000);
assert.equal(timer.restAdjustment(resting,-90,31000).restUntil,0);
assert.equal(timer.restAdjustment(resting,0,31000).restUntil,0);
assert.equal(timer.restAdjustment(resting,null,120000).restUntil,210000);
assert.equal(timer.restAdjustment(resting,-15,120000),null);
assert.equal(timer.restAdjustment(resting,NaN,31000),null);
assert.equal(timer.restAdjustment(resting,1e10,31000).restTotal,86400000);
const timerState={exercises:[{name:'Squat',sets:[{rest:90}]}]};
timer.beginSessionRest(timerState,0,0,1000);
assert.equal(timerState.restSet.exercise,0);
assert.equal(timerState.restSet.set,0);
assert.equal(timerState.restUntil,91000);
timer.clearSessionRest(timerState);
assert.equal(timerState.restUntil,0);
assert.equal(timerState.restSet,undefined);
assert.equal(timerState.restExercise,undefined);
assert.ok(!browser.includes('setInterval(tickSession'));
console.log('Rest deadline, adjustment, expiration and set association regression checks passed');

const calendar=vm.runInNewContext(core.calendar+';({validWeekKey,validSchedules,calculateStreak})');
const dayRecord=(day,done=true,weight=20)=>({finished:new Date(day+'T12:00:00').getTime(),exercises:[{name:'Squat',sets:[{done,weight,reps:10}]}]});
const plan=[{from:'2026-11-02',rest:[2,3,4,5,6]}];
const streakRecords=['2026-11-02','2026-11-03','2026-11-09','2026-11-10','2026-11-16','2026-11-17','2026-11-23'].map(d=>dayRecord(d));
const currentStreak=calendar.calculateStreak(new Date('2026-11-24T18:00:00'),streakRecords,plan);
assert.equal(currentStreak.run,3);assert.equal(currentStreak.best,3);
assert.equal(calendar.calculateStreak(new Date('2026-11-24T18:00:00'),[...streakRecords,dayRecord('2026-11-24')],plan).run,4);
assert.equal(calendar.calculateStreak(new Date('2026-12-01T18:00:00'),streakRecords,plan).run,0);
assert.equal(calendar.calculateStreak(new Date('2026-11-24T18:00:00'),[...streakRecords,dayRecord('2026-11-23'),dayRecord('2026-11-24',false),dayRecord('2026-11-25')],plan).days.size,1);
assert.equal(calendar.validWeekKey('2026-02-30'),false);assert.equal(calendar.validWeekKey('2026-11-03'),false);assert.equal(calendar.validSchedules(plan),true);
const progressChecks=vm.runInNewContext(core.progress+';({progressRecords,exerciseSeries,progressChartPoints})');
const progressNow=new Date('2026-11-24T18:00:00').getTime();
assert.equal(progressChecks.progressRecords([dayRecord('2026-11-25'),dayRecord('2026-11-23',false),dayRecord('2026-11-22')],'all',progressNow).length,1);
assert.equal(progressChecks.progressRecords([dayRecord('2026-10-01'),dayRecord('2026-11-22')],'30',progressNow).length,1);
const duplicateExercise=dayRecord('2026-11-22');duplicateExercise.exercises.push({name:'Squat',sets:[{done:true,weight:40,reps:5}]});
const seriesChecks=progressChecks.exerciseSeries([dayRecord('2026-11-23'),duplicateExercise]).get('Squat');
assert.equal(seriesChecks.length,2);assert.equal(seriesChecks[0].weight,40);
assert.equal(progressChecks.progressChartPoints([{date:0,weight:0},{date:1,weight:1},{date:4,weight:2}],0,2),'8,92 84,50 312,8');
console.log('Weekly streak, schedule validation, progress filtering and chart spacing regression checks passed');

assert.ok(!source.includes('user-scalable=no'));
assert.ok(!source.includes('maximum-scale=1'));
for(const id of ['workout-summary','dialog','leave-routine'])assert.ok(new RegExp('<dialog id="'+id+'" aria-label=').test(source));
assert.ok(source.includes('aria-controls="exercise-picker" aria-expanded="false"'));
assert.ok(browser.includes('setAttribute("aria-expanded",String(!p.hidden))'));
assert.ok(browser.includes('cell.setAttribute("role","img")'));
assert.ok(browser.includes('cell.setAttribute("aria-label",weekdays[j]'));
assert.ok(browser.includes('$("leave-cancel").focus({preventScroll:true})'));
assert.ok(browser.includes('()=>moveSessionExercise(index,index-1)'));
assert.ok(browser.includes('()=>moveSessionExercise(index,index+1)'));
assert.ok(browser.includes('setAttributeChanged(miniCopy,"aria-controls","active-workout")'));
assert.ok(css.includes('touch-action:pan-y pinch-zoom'));
assert.ok(css.includes('prefers-reduced-transparency:reduce'));
assert.ok(css.includes('prefers-contrast:more'));
console.log('Accessibility markup, disclosure, focus and gesture alternative source checks passed');

const refreshStart=browser.indexOf('function homeRefreshKey('),refreshEnd=browser.indexOf('function refreshHomeSession(',refreshStart);
const refreshChecks=vm.runInNewContext(browser.slice(refreshStart,refreshEnd)+';({homeRefreshKey,sameRefreshKey})');
const activeSample={started:0},routineSample={id:'a'};
assert.equal(refreshChecks.sameRefreshKey(refreshChecks.homeRefreshKey(activeSample,routineSample,1000),refreshChecks.homeRefreshKey(activeSample,routineSample,59000)),true);
assert.equal(refreshChecks.sameRefreshKey(refreshChecks.homeRefreshKey(activeSample,routineSample,1000),refreshChecks.homeRefreshKey(activeSample,routineSample,60000)),false);
assert.equal(refreshChecks.sameRefreshKey(refreshChecks.homeRefreshKey(activeSample,routineSample,1000),refreshChecks.homeRefreshKey({...activeSample},routineSample,1000)),false);
assert.equal(refreshChecks.sameRefreshKey(refreshChecks.homeRefreshKey(null,routineSample,1000),refreshChecks.homeRefreshKey(null,routineSample,60000)),true);
const buildIndex=vm.runInNewContext(core.progress+';buildPreviousSetIndex');
const previous=buildIndex([{finished:100,exercises:[{name:'Squat',sets:[{done:true,weight:20},{done:true,weight:30}]}]},{finished:200,exercises:[{name:'Squat',sets:[{done:true,weight:40},{done:false,weight:99}]}]}]);
assert.equal(previous.get('Squat').get(0).weight,40);
assert.equal(previous.get('Squat').get(1).weight,30);
assert.equal(previous.get('Bench Press'),undefined);
assert.ok(browser.includes('previousLoggedSet(e.name,j)'));
assert.ok(browser.includes('60000-now%60000'));
console.log('Dashboard refresh caching, previous-set indexing and idle scheduling checks passed');

const checkCurrent=vm.runInNewContext(core.storage+';assertRecordCurrent');
const snapshots=new Map([['record','original'],['deleted',null]]);
assert.equal(checkCurrent({getItem:()=> 'original'},'record',snapshots),'original');
assert.throws(()=>checkCurrent({getItem:()=> 'changed'},'record',snapshots),/another tab/);
assert.throws(()=>checkCurrent({getItem:()=> 'created'},'deleted',snapshots),/another tab/);
assert.equal(checkCurrent({getItem:()=>null},'unknown',snapshots),null);
const headerStart=source.indexOf('function securityHeaders('),headerEnd=source.indexOf('return {fetch(request)',headerStart);
const headers=vm.runInNewContext(source.slice(headerStart,headerEnd)+';securityHeaders')('testnonce');
assert.equal(headers['X-Content-Type-Options'],'nosniff');
assert.equal(headers['X-Frame-Options'],'DENY');
assert.equal(headers['Referrer-Policy'],'no-referrer');
assert.ok(headers['Content-Security-Policy'].includes("script-src 'nonce-testnonce'"));
assert.ok(!headers['Content-Security-Policy'].includes("script-src 'unsafe-inline'"));
assert.ok(headers['Content-Security-Policy'].includes("frame-ancestors 'none'"));
assert.ok(source.includes('nonce="FORM_SCRIPT_NONCE"'));
assert.ok(browser.includes('previous:assertRecordCurrent(localStorage,key)'));
console.log('Security headers and stale storage snapshot regression checks passed');

assert.ok(browser.includes('const initialPage="home";'));
assert.ok(browser.includes('navigate(initialPage);renderHomeData();refreshMini();'));
assert.ok(!browser.includes('navigate(initialPage);renderHomeData();if(session)renderSession();'));
console.log('Fresh launch resets navigation without clearing persisted data');

assert.ok(browser.includes('if(!cancel&&armed){removeSessionExercise(index,card,true)}'));
assert.ok(browser.includes('if(recorded&&!fullSwipe)'));
assert.ok(browser.includes('(fullSwipe||!recorded)&&session?.id===id'));
assert.ok(css.includes('html[data-input-mode="pointer"]'));
assert.ok(browser.includes('setInteractionMode("keyboard")'));
console.log('Full swipe removal, undo and input-modality focus checks passed');

assert.ok(browser.includes('if(!session||exerciseRemovalPending)return;cancelExerciseGesture()'));
assert.ok(browser.includes('session!==d.sessionSnapshot'));
assert.ok(browser.includes('sessionBlocked=sessionBlocked||blocked'));
assert.ok(browser.includes('if(wasSelected){sessionSelection=at;sessionCollapsed=wasCollapsed;if(!wasCollapsed)sessionOpenCards.add(at)}'));
assert.ok(browser.includes('if(removedRest&&!next.restSet&&!next.restExercise&&!next.restUntil&&!next.restTotal)'));
assert.ok(browser.includes('if(!storeSession(next))input.value=session.exercises[i].sets[j][k]'));
console.log('Active workout edit, undo, stale gesture and save protection checks passed');

assert.ok(browser.includes('sets.push({...sets.at(-1)'));
assert.ok(browser.includes('drag.headers.push([header,header.getAttribute("aria-expanded")])'));
assert.ok(browser.includes('for(const [header,value] of d.headers)'));
assert.ok(browser.includes('session.exercises[index]===menuExercise&&anchor.isConnected'));
assert.ok(browser.includes('if(restCard)restCard.hidden=!left'));
console.log('Active workout live set defaults, gesture cleanup and stale menu checks passed');

const restOwner=vm.runInNewContext(core.timer+';normalizeRestOwner');
const ownerState={exercises:[{name:'Squat',sets:[{done:true},{done:false}]}],restExercise:'Squat',restUntil:10000,restTotal:9000};
assert.equal(restOwner(ownerState).restSet.set,0);
ownerState.restSet={exercise:0,set:1};restOwner(ownerState);assert.equal(ownerState.restUntil,0);assert.equal(ownerState.exercises[0].sets[0].done,true);
assert.ok(browser.includes('dropCancel?.()'));assert.ok(browser.includes('normalizeRestOwner(recoverRecord(sessionKey'));
console.log('Rest ownership recovery and interrupted drop cleanup checks passed');

const ambiguous={exercises:[{name:'Squat',sets:[{done:true},{done:true}]}],restExercise:'Squat',restUntil:10000,restTotal:9000};restOwner(ambiguous);assert.equal(ambiguous.restUntil,0);assert.equal(ambiguous.exercises[0].sets.filter(x=>x.done).length,2);
const undoIndex=vm.runInNewContext(browser.slice(browser.indexOf('function undoNeighborKeys('),browser.indexOf('function showExerciseUndo('))+';undoInsertionIndex');
assert.equal(undoIndex([{name:'C'},{name:'A'},{name:'D'}],1,{before:'A',after:'C'}),2);
assert.equal(undoIndex([{name:'A'},{name:'D'},{name:'C'}],1,{before:'A',after:'C'}),2);
assert.equal(undoIndex([{name:'A'},{name:'A'}],1,{before:'A'}),1);
assert.ok(browser.includes('animation.oncancel=()=>{if(completed)return;'));
assert.ok(browser.includes('maxHeight:"calc(100dvh - 24px)",overflowY:"auto"'));
console.log('Ambiguous rest recovery, delayed cancellation, undo placement and short viewport menu checks passed');

assert.ok(browser.includes('const EXERCISE_HOLD_MS=350;'));
assert.ok(browser.includes('cancelExerciseGesture();closeExerciseSwipe();const cards='));
assert.ok(browser.includes('if(end===index){sessionCollapsed=d.originalCollapsed;renderSession()}'));
console.log('Exercise tap versus hold and selection cleanup checks passed');

assert.ok(browser.includes('--floating-height:56px;--timer-height:72px;'));
assert.ok(browser.includes('.mini-workout{height:var(--timer-height)'));
assert.ok(css.includes('var(--floating-height,56px) + var(--timer-height,72px)'));
console.log('Independent timer and navigation heights passed');

assert.ok(source.includes('class="streak-title-row"'));
assert.ok(browser.includes('if(done||rest)dot.append(streakIcon("check"))'));
assert.ok(css.includes('.dot.rest{background:var(--system-blue);color:#fff}'));
assert.ok(css.includes('.streak-trophy-button svg{width:var(--streak-trophy-size);height:var(--streak-trophy-size);stroke:currentColor'));
console.log('Compact streak trophy and recovery checkmark styling passed');

assert.ok(browser.includes('if(selected)dot.append(streakIcon("check"))'));
assert.ok(css.includes('.rest-day-option[aria-pressed=true] .dot{background:var(--system-blue);color:#fff}'));
assert.ok(!source.includes('class="rest-total-icon recovery-total-icon"'));
console.log('Rest-day picker matches streak styling and recovery summary');

assert.equal((source.match(/from "lucide\/icons\/dumbbell\.svg"/g)||[]).length,1);
assert.ok(source.includes('id="streak-dumbbell">${icon("dumbbell")}'));
assert.ok(!source.includes('training-total-icon" aria-hidden="true">${icon("dumbbell")}'));
assert.ok(source.includes('aria-label="Animate training streak trophy">${icons.trophy}'));
console.log('Shared Lucide dumbbell and trophy sources passed');

assert.ok(source.includes('import trophyIcon from "lucide/icons/trophy.svg"'));
assert.ok(source.includes('<div class="row streak-footer"><span class="muted">Personal best</span>'));
assert.ok(css.includes('#streak-title,#streak-best{color:var(--ink)}'));
console.log('Single trophy and neutral streak typography passed');

assert.ok(css.includes('--streak-trophy-size:18px'));
assert.ok(css.includes('#rest-days-dialog>.row{justify-content:center}'));
assert.ok(css.includes('#rest-days-dialog .rest-day-totals>div{justify-items:center;text-align:center}'));
assert.ok(css.includes('#rest-days-dialog>p{font-size:var(--font-footnote);line-height:var(--type-body-line);text-align:center'));
console.log('Smaller trophy and centered rest-day dialog passed');

assert.ok(!source.includes('id="routine-editor"'));
assert.ok(!browser.includes('$("routine-editor")'));
assert.ok(browser.includes('function setRoutineEditing(on)'));
assert.ok(browser.includes('if(routineEditing)commitRoutine()'));
assert.ok(browser.includes('const root=$("detail-exercises");root.replaceChildren();if(!draft)'));
assert.ok(css.includes('#routine-detail.is-editing #detail-exercises input{border:1px solid var(--line)'));
console.log('Unified routine detail and inline edit mode checks passed');

assert.ok(source.includes('class="routine-detail-scroll" id="routine-detail-scroll"'));
assert.ok(browser.includes('editScroll=$("routine-detail-scroll").scrollTop'));
assert.ok(css.includes('#routine-detail .routine-detail-body::before{content:"";position:absolute;inset:0 0 auto;height:24px;z-index:2;pointer-events:none;background:linear-gradient'));
assert.ok(css.includes('#routine-detail:not([hidden]){display:flex;flex-direction:column;align-items:stretch;min-height:0;overflow:hidden'));
console.log('Routine pinned header and permanent noninteractive fade checks passed');

assert.ok(css.includes('#workouts-page:has(#routine-detail:not([hidden])),#workouts-page:has(#routine-detail:not([hidden])) .workout-layout{height:100%;min-height:0}'));
assert.ok(css.includes('#workouts-page:has(#routine-detail:not([hidden])) .workout-layout{align-items:stretch;grid-template-rows:minmax(0,1fr)}'));
assert.ok(css.includes('overflow:hidden;isolation:isolate;display:grid;grid-template-rows:minmax(0,1fr)'));
console.log('Routine scrollport definite height across orientations passed');

assert.ok(!browser.includes('Exercise actions ···'));
assert.ok(css.includes('#routine-detail #detail-start{height:48px;min-height:48px;border-radius:var(--radius-control)'));
assert.ok(css.includes('#routine-detail #detail-exercises .routine-set-row{display:grid;grid-template-columns:var(--space-6) repeat(3,minmax(0,1fr)) var(--touch-target)'));
assert.ok(browser.includes('routine-read-value'));
console.log('Shared view/edit routine dimensions and simplified exercise card passed');

assert.ok(!browser.includes(' · Sample routine'));
assert.ok(!source.includes('>Hide Sample Routines</button>'));
assert.ok(!browser.includes("showSamples"));assert.ok(!source.includes('id="toggle-samples"'));
console.log('Built-in sample routines removed');

// Legacy Home must stay deleted; verify actual removal, not CSS hiding.
for(const id of ['hero-label','hero-title','hero-sub','exercise-preview','home-recent','home-insight','home-history','home-progress','quick','start','routine']){assert.ok(!source.includes('id="'+id+'"'));assert.ok(!browser.includes('$("'+id+'")'))}

const themeManifest=vm.runInNewContext(core.themes+';formThemes');
assert.equal(themeManifest.length,10);
assert.equal(new Set(themeManifest.map(t=>t.id)).size,10);
for(const scheme of ['light','dark'])assert.equal(themeManifest.filter(t=>t.scheme===scheme).length,5);
const luminance=hex=>{const rgb=hex.slice(1).match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
const contrast=(a,b)=>{const l=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (l[0]+.05)/(l[1]+.05)};
for(const {id,palette:p} of themeManifest){
  for(const role of ['canvas','paper','elevated','ink','muted','brand','action','onAction','success','warning','danger','completion'])assert.match(p[role],/^#[0-9a-f]{6}$/i);
  for(const [fg,bg] of [[p.action,p.onAction],[p.ink,p.paper],[p.muted,p.paper],[p.success,p.paper],[p.warning,p.paper],[p.danger,p.paper]])assert.ok(contrast(fg,bg)>=4.5,id+' insufficient contrast '+fg+' / '+bg);
}
const paperInk=themeManifest.find(t=>t.id==='paper-ink').palette;
for(const role of ['brand','action','recovery','streakAccent','success','warning','danger','completion'])assert.equal(paperInk[role],paperInk.ink);
assert.equal(paperInk.restTrack,paperInk.elevated);
assert.ok(browser.includes('vars["--theme-rest-track"]=p.restTrack'));
assert.ok(css.includes(':root[data-theme-id=paper-ink] :is(.dot.rest,.home-month-day.rest)'));
for(const bg of [paperInk.canvas,paperInk.paper,paperInk.elevated])assert.ok(contrast(paperInk.muted,bg)>=4.5);
assert.ok(contrast(paperInk.recovery,paperInk.onAction)>=4.5);
assert.ok(contrast(paperInk.completion,paperInk.onAction)>=4.5);
assert.equal(themeManifest.filter(t=>t.palette.recovery!==undefined).length,1);
assert.ok(browser.includes('p.recovery||"#0066CC"')&&browser.includes('vars["--palette-light-contrast-blue"]=p.recovery'));
console.log('Ten theme identities and manifest text/action contrast checks passed');

const monthly=vm.runInNewContext(core.calendar+';monthlyTrainingDays');
const monthPlan=[{from:'2026-11-02',rest:[2]},{from:'2026-11-16',rest:[4]}];
const monthRecords=[{finished:new Date('2026-11-04T12:00:00').getTime(),exercises:[{sets:[{done:true}]}]},{finished:new Date('2026-11-26T12:00:00').getTime(),exercises:[{sets:[{done:true}]}]}];
const monthData=monthly(2026,10,new Date('2026-11-25T18:00:00'),monthRecords,monthPlan);
assert.equal(monthData.offset,6);assert.equal(monthData.days.length,30);
assert.equal(monthData.days[3].state,'done');assert.equal(monthData.days[10].state,'rest');assert.equal(monthData.days[17].state,'none');assert.equal(monthData.days[19].state,'rest');assert.equal(monthData.days[24].today,true);assert.equal(monthData.days[25].state,'future');
assert.equal(monthly(2024,1,new Date('2024-03-01T12:00:00'),[],[]).days.length,29);
assert.equal(monthly(2026,1,new Date('2026-03-01T12:00:00'),[],[]).days.length,28);
const liveSample={started:0,exercises:[{name:'Squat',sets:[{done:false}]}]};
const liveKey=refreshChecks.homeRefreshKey(liveSample,null,1000);liveSample.exercises[0].sets[0].done=true;assert.equal(refreshChecks.sameRefreshKey(liveKey,refreshChecks.homeRefreshKey(liveSample,null,1000)),false);
console.log('Monthly calendar historical schedules, month boundaries and live Home progress cache passed');

const historyMetrics=vm.runInNewContext(core.progress+';({historyDuration,historyExercisePoints,historyPreviousSets})');
const historyFixture=(id,finished,weight,reps)=>({id,finished,started:finished-5040000,exercises:[{name:'Bench Press',sets:[{weight,reps,done:true},{weight:999,reps:10,done:false}]}]});
const chosenHistory=historyFixture('selected',8000000,80,8),earlierHistory=historyFixture('earlier',7000000,70,8),laterHistory=historyFixture('later',9000000,100,5);
assert.equal(historyMetrics.historyDuration(chosenHistory),'1:24');
const scopedHistory=historyMetrics.historyExercisePoints(chosenHistory,'Bench Press',[laterHistory,chosenHistory,earlierHistory]);
assert.equal(scopedHistory.length,2);assert.equal(scopedHistory.at(-1).weight,80);assert.equal(scopedHistory.at(-1).volume,640);assert.ok(Math.abs(scopedHistory.at(-1).estimated-101.33333333333333)<1e-9);
assert.equal(historyMetrics.historyPreviousSets(chosenHistory,'Bench Press',[laterHistory,earlierHistory]).get(0).weight,70);
assert.equal(historyMetrics.historyExercisePoints(historyFixture('high-reps',9000000,30,15),'Bench Press',[])[0].estimated,null);
assert.equal(historyMetrics.historyExercisePoints(historyFixture('single',9000000,100,1),'Bench Press',[])[0].estimated,100);
assert.equal(historyMetrics.historyExercisePoints(chosenHistory,'Bench Press',Array.from({length:8},(_,i)=>historyFixture('old-'+i,1000000+i*10000,30,5))).length,5);
console.log('Historical duration, previous sets, scoped chart metrics and estimated 1RM checks passed');

const resetChecks=vm.runInNewContext(core.storage+'\n'+core.calendar+'\n'+developmentStorage+';({buildCleanSlate,validCleanSlate,resetAndPopulate,completeCleanSlate})');
const resetDate=new Date(2026,10,25,13);
const seeded=resetChecks.buildCleanSlate(resetDate);
assert.equal(seeded.records.length,48);assert.ok(resetChecks.validCleanSlate(seeded));assert.ok(seeded.records.every(r=>r.finished<+resetDate));
for(let failure=0;failure<12;failure++){
 const m=new Map([['form-personal-name','old'],['form-routines','old'],['form-workout-history','old'],['form-workout-history-backup','old'],['form-active-workout','old'],['unrelated','keep']]);let n=0,fail=failure;
 const store={get length(){return m.size},key:i=>[...m.keys()][i]??null,getItem:k=>m.get(k)??null,setItem(k,v){if(++n===fail)throw Error('interruption');m.set(k,v)},removeItem(k){if(++n===fail)throw Error('interruption');m.delete(k)}};
 assert.equal(resetChecks.resetAndPopulate(store,false,resetDate),false);assert.equal(m.get('form-personal-name'),'old');
 try{resetChecks.resetAndPopulate(store,true,resetDate)}catch{}
 fail=0;if(m.has('form-clean-slate-journal'))resetChecks.completeCleanSlate(store);else if(m.has('form-personal-name'))resetChecks.resetAndPopulate(store,true,resetDate);
 assert.equal(m.get('unrelated'),'keep');assert.equal(m.has('form-personal-name'),false);assert.equal(m.has('form-workout-history-backup'),false);assert.equal(m.has('form-active-workout'),false);assert.equal(m.has('form-clean-slate-journal'),false);assert.equal(JSON.parse(m.get('form-routines')).data.length,0);assert.equal(JSON.parse(m.get('form-workout-history')).data.length,48);
}
console.log('Explicit reset, synthetic history and interruption recovery checks passed');

assert.ok(!source.includes('id="clean-slate-dialog"'));assert.ok(!source.includes('src/development'));assert.ok(!source.includes('./development'));assert.ok(!browser.includes('resetAndPopulate'));assert.ok(!core.storage.includes('buildCleanSlate'));assert.ok(!browser.includes('form-preview-page'));assert.ok(!source.includes('id="state"'));assert.ok(!source.includes('FORM. preview'));assert.ok(!css.includes('#toggle-samples'));assert.ok(!css.includes('.sample-switch'));assert.ok(!browser.includes('>Push Day</text>'));assert.ok(!browser.includes('>+12%</text>'));assert.ok(developmentEntry.includes('./development/reset.js.txt'));const devIds=[...developmentMarkup.matchAll(/\bid="([\w-]+)"/g)].map(m=>m[1]);for(const m of developmentUI.matchAll(/\$\("([\w-]+)"\)/g))assert.ok(ids.includes(m[1])||devIds.includes(m[1]));console.log('Clean release source and isolated development entry checks passed');

// Graphite Lime Home Screen asset: opaque 180px PNG and versioned iOS/favicon links.
const iconPayload=source.match(/const homeIconBase64 = "([A-Za-z0-9+/=]+)"/)?.[1];
assert.ok(iconPayload);const iconBytes=Buffer.from(iconPayload,'base64');
assert.equal(iconBytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
assert.equal(iconBytes.readUInt32BE(16),180);assert.equal(iconBytes.readUInt32BE(20),180);
assert.ok(iconBytes.includes(Buffer.from([23,23,31])));assert.ok(iconBytes.includes(Buffer.from([176,255,0])));assert.ok(iconBytes.includes(Buffer.from([255,255,255])));
assert.equal(source.split('/apple-touch-icon.png?v=2').length-1,2);assert.ok(!source.includes('/apple-touch-icon.png?v=1'));
console.log('Graphite Lime Home Screen asset checks passed');
