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
