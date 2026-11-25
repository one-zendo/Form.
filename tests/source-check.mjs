import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const source=readFileSync(new URL('../src/index.js',import.meta.url),'utf8');
const browser=readFileSync(new URL("../src/browser.js.txt",import.meta.url),"utf8");
new vm.Script(browser);
const ids=[...source.matchAll(/\bid="([\w-]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate HTML IDs');
for(const m of browser.matchAll(/\$\("([\w-]+)"\)/g)) assert.ok(ids.includes(m[1]),'Missing element: '+m[1]);
console.log('Browser syntax and static DOM references passed');

const start=browser.indexOf('const validRoutine=');
const end=browser.indexOf('let routines=[];',start);
assert.ok(start>=0&&end>start,'Storage helpers missing');
const storage=vm.runInNewContext(browser.slice(start,end)+';({validRoutine,decodeRecord,encodeRecord})');
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

const journalStart=browser.indexOf('const finishJournalKey=');
const journalEnd=browser.indexOf('let finishRecoveryBlocked=',journalStart);
assert.ok(journalStart>=0&&journalEnd>journalStart);
const recoverFinish=vm.runInNewContext(browser.slice(journalStart,journalEnd)+';finishJournal');
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
assert.ok(browser.includes('@keyframes form-finish-float-in'));
assert.ok(browser.includes('prefers-reduced-motion:reduce){.exercise-remove-confirm[open]{animation:none}'));
const motionSource=browser.slice(0,browser.indexOf('function motionAllowed'));
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

const routineStart=browser.indexOf('function routineDraftDirty(');
const routineEnd=browser.indexOf('const finishJournalKey=',routineStart);
assert.ok(routineStart>=0&&routineEnd>routineStart);
const routineChecks=vm.runInNewContext(browser.slice(routineStart,routineEnd)+';({routineDraftDirty,validDateStamp,uniqueRecordIds})');
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
const statsStart=browser.indexOf('function recordStats('),statsEnd=browser.indexOf('function numberLabel(',statsStart);
const stats=vm.runInNewContext(browser.slice(statsStart,statsEnd)+';recordStats');
const result=stats({started:0,finished:120000,exercises:[{sets:[{done:true,weight:20,reps:10},{done:false,weight:100,reps:100}]},{sets:[{done:true,weight:30,reps:5}]}]});
assert.equal(result.sets,2);assert.equal(result.reps,15);assert.equal(result.volume,350);assert.equal(result.minutes,2);assert.equal(result.exercises,2);
console.log('Routine draft, record identity, timestamp and history summary regression checks passed');

const timerStart=browser.indexOf('const MAX_REST_MS='),timerEnd=browser.indexOf('function adjustRest(',timerStart);
assert.ok(timerStart>=0&&timerEnd>timerStart);
const timer=vm.runInNewContext(browser.slice(timerStart,timerEnd)+';({restTimeLeft,restAdjustment,beginSessionRest,clearSessionRest})');
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

const calendarStart=browser.indexOf('function localDay('),calendarEnd=browser.indexOf('let schedules=',calendarStart);
const streakStart=browser.indexOf('function calculateStreak('),streakEnd=browser.indexOf('function streakStats(',streakStart);
assert.ok(calendarStart>=0&&calendarEnd>calendarStart&&streakStart>=0&&streakEnd>streakStart);
const calendar=vm.runInNewContext(browser.slice(calendarStart,calendarEnd)+browser.slice(streakStart,streakEnd)+';({validWeekKey,validSchedules,calculateStreak})');
const dayRecord=(day,done=true,weight=20)=>({finished:new Date(day+'T12:00:00').getTime(),exercises:[{name:'Squat',sets:[{done,weight,reps:10}]}]});
const plan=[{from:'2026-11-02',rest:[2,3,4,5,6]}];
const streakRecords=['2026-11-02','2026-11-03','2026-11-09','2026-11-10','2026-11-16','2026-11-17','2026-11-23'].map(d=>dayRecord(d));
const currentStreak=calendar.calculateStreak(new Date('2026-11-24T18:00:00'),streakRecords,plan);
assert.equal(currentStreak.run,3);assert.equal(currentStreak.best,3);
assert.equal(calendar.calculateStreak(new Date('2026-11-24T18:00:00'),[...streakRecords,dayRecord('2026-11-24')],plan).run,4);
assert.equal(calendar.calculateStreak(new Date('2026-12-01T18:00:00'),streakRecords,plan).run,0);
assert.equal(calendar.calculateStreak(new Date('2026-11-24T18:00:00'),[...streakRecords,dayRecord('2026-11-23'),dayRecord('2026-11-24',false),dayRecord('2026-11-25')],plan).days.size,1);
assert.equal(calendar.validWeekKey('2026-02-30'),false);assert.equal(calendar.validWeekKey('2026-11-03'),false);assert.equal(calendar.validSchedules(plan),true);
const progressStart=browser.indexOf('function progressRecords('),progressEnd=browser.indexOf('function renderProgress(',progressStart);
const progressChecks=vm.runInNewContext(browser.slice(progressStart,progressEnd)+';({progressRecords,exerciseSeries,progressChartPoints})');
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
assert.ok(browser.includes('miniCopy.setAttribute("aria-controls","active-workout")'));
assert.ok(css.includes('touch-action:pan-y pinch-zoom'));
assert.ok(css.includes('prefers-reduced-transparency:reduce'));
assert.ok(css.includes('prefers-contrast:more'));
console.log('Accessibility markup, disclosure, focus and gesture alternative source checks passed');
