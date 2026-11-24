import { test, expect } from '@playwright/test';
const url='http://127.0.0.1:8787';
for(const [name,width,height] of [['folded',466,678],['portrait',626,890],['landscape',890,626]]){
 test(name+' navigation and appearance',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height});
  await page.goto(url);
  await expect(page.locator('#home-page')).toBeVisible();
  await page.locator('#nav-profile').click();
  await page.locator('#appearance-open').click();
  await expect(page.locator('#appearance-page')).toBeVisible();
  await page.locator('input[name="theme"][value="dark"]').check();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.locator('#nav-workouts').click();
  await expect(page.locator('#routine-list')).toBeVisible();
  await page.locator('#routine-items .routine-entry').first().click();
  await expect(page.locator('#routine-detail')).toBeVisible();
  await page.setViewportSize({width:890,height:626});
  await expect(page.locator('#routine-detail')).toBeVisible();
  await page.setViewportSize({width:466,height:678});
  await expect(page.locator('#routine-detail')).toBeVisible();
  await page.locator('#nav-home').click();
  await expect(page.locator('#home-page')).toBeVisible();
  expect(errors).toEqual([]);
 });
}

test('routine edits, discard and persistence',async({page})=>{
 await page.setViewportSize({width:466,height:678});
 await page.goto(url);
 await page.locator('#nav-workouts').click();
 await page.locator('#new-routine').click();
 await page.locator('#routine-name').fill('Regression routine');
 await page.locator('#show-exercise-picker').click();
 await page.locator('#exercise-search').fill('Squat');
 await page.locator('#exercise-options button').first().click();
 await page.locator('#save-routine').click();
 await expect(page.locator('#detail-title')).toHaveText('Regression routine');
 await page.locator('#detail-edit').click();
 await expect(page.locator('#save-routine')).toBeDisabled();
 await expect(page.locator('#routine-exercises details.routine-exercise[open]')).toHaveCount(1);
 await page.locator('#routine-name').fill('Unsaved rename');
 await expect(page.locator('#save-routine')).toBeEnabled();
 await page.locator('#nav-home').click();
 await expect(page.locator('#leave-routine')).toBeVisible();
 await page.locator('#leave-cancel').click();
 await expect(page.locator('#routine-name')).toHaveValue('Unsaved rename');
 await page.locator('#nav-home').click();
 await page.locator('#leave-discard').click();
 await expect(page.locator('#home-page')).toBeVisible();
 await page.reload();
 await page.locator('#nav-workouts').click();
 await page.locator('#routine-search').fill('Regression routine');
 await expect(page.locator('#routine-items .routine-entry')).toHaveCount(1);
 await page.locator('#routine-items .routine-entry').click();
 await expect(page.locator('#detail-title')).toHaveText('Regression routine');
});

const storedRoutine={id:'storage-test',name:'Recovered routine',description:'',exercises:[{name:'Squat',sets:[{weight:20,reps:10,rest:90}]}]};
for(const mode of ['legacy','backup','invalid']){
 test('storage '+mode,async({page})=>{
  await page.goto(url);
  await page.evaluate(({mode,routine})=>{
   localStorage.setItem('form-preview-page','workouts');
   localStorage.setItem('form-routines',mode==='legacy'?JSON.stringify([routine]):'{broken');
   if(mode==='backup')localStorage.setItem('form-routines-backup',JSON.stringify({version:1,data:[routine]}));
  },{mode,routine:storedRoutine});
  await page.reload();
  if(mode==='invalid'){
   await page.locator('#new-routine').click();
   await expect(page.locator('#routine-status')).toContainText('not being saved');
   expect(await page.evaluate(()=>localStorage.getItem('form-routines'))).toBe('{broken');
  }else{
   await page.locator('#routine-search').fill('Recovered routine');
   await expect(page.locator('#routine-items .routine-entry')).toHaveCount(1);
   if(mode==='backup')expect(await page.evaluate(()=>localStorage.getItem('form-routines-quarantine'))).toBe('{broken');
  }
 });
}

for(const [width,height] of [[466,678],[626,890],[890,626]]){
 test('inline editor cancellation and expansion '+width,async({page})=>{
  await page.setViewportSize({width,height});
  await page.goto(url);
  await page.evaluate(()=>localStorage.setItem('form-routines',JSON.stringify([{id:'inline-test',name:'Inline test',description:'',exercises:['Squat','Bench Press'].map(name=>({name,sets:[{weight:20,reps:10,rest:90}]}))}])));
  await page.reload();
  await page.locator('#nav-workouts').click();
  await page.locator('#routine-items .routine-entry').filter({hasText:'Inline test'}).click();
  await page.locator('#detail-edit').click();
  await expect(page.locator('#routine-exercises details.routine-exercise[open]')).toHaveCount(2);
  await expect(page.locator('#save-routine')).toBeDisabled();
  await page.locator('#routine-exercises details.routine-exercise > summary').first().click();
  await expect(page.locator('#save-routine')).toBeDisabled();
  await page.locator('#routine-cancel').click();
  await expect(page.locator('#detail-title')).toHaveText('Inline test');
  await expect(page.locator('#detail-exercises details[open]')).toHaveCount(0);
  await page.locator('#detail-edit').click();
  await page.locator('#routine-name').fill('Updated inline test');
  await page.locator('#routine-cancel').click();
  await expect(page.locator('#leave-routine')).toBeVisible();
  await page.locator('#leave-apply').click();
  await expect(page.locator('#detail-title')).toHaveText('Updated inline test');
 });
}

for(const [width,height] of [[466,678],[626,890],[890,626]]){
 test('rest controls and navigation '+width,async({page})=>{
  await page.setViewportSize({width,height});await page.goto(url);
  await page.locator('#start').click();await expect(page.locator('#active-workout')).toBeVisible();
  await page.locator('#active-workout .session-check:visible').first().click();
  const landscape=width>height;const timer=page.locator('.mini-workout');
  await expect(timer).toBeVisible();await expect(page.locator('.dock'))[landscape?'toBeVisible':'toBeHidden']();
  const deadline=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data.restUntil);
  const before=await deadline();await timer.getByRole('button',{name:'Add 15 Seconds'}).click();expect(await deadline()).toBe(before+15000);
  await timer.getByRole('button',{name:'Subtract 15 Seconds'}).click();expect(await deadline()).toBe(before);
  await timer.getByRole('button',{name:'Skip Rest'}).click();expect(await deadline()).toBe(0);await expect(timer.getByRole('button',{name:'Reset Rest'})).toBeEnabled();await timer.getByRole('button',{name:'Reset Rest'}).click();expect(await deadline()).toBeGreaterThan(Date.now());await timer.getByRole('button',{name:'Skip Rest'}).click();expect(await deadline()).toBe(0);
  await expect(page.locator('#session-rest-card')).toBeHidden();if(landscape){await page.locator('#nav-home').click();await expect(page.locator('.mini-workout')).toBeVisible();await page.getByRole('button',{name:'Resume Active Workout'}).click();await expect(page.locator('#active-workout')).toBeVisible()}
 });
}

for(const theme of ['light','dark'])for(const [width,height] of [[466,678],[626,890],[890,626]]){
 test('floating dock geometry '+theme+' '+width,async({page})=>{
  await page.setViewportSize({width,height});await page.addInitScript(t=>localStorage.setItem('form-preview-theme',t),theme);await page.goto(url);
  const dock=page.locator('.dock');const original=await dock.boundingBox();await page.locator('#start').click();await page.locator('#active-workout .session-check:visible').first().click();await page.getByRole('button',{name:'Minimize Workout'}).click();
  await expect(page.locator('#start')).toContainText('Resume Workout');const timer=page.locator('.mini-workout');await expect(timer).toBeVisible();await expect(dock).toHaveCSS('border-top-left-radius','999px');await expect(timer).toHaveCSS('border-top-left-radius','999px');await expect(timer).toHaveCSS('height','56px');await expect(dock).toHaveCSS('height','56px');
  await expect.poll(async()=>{const d=await dock.boundingBox(),t=await timer.boundingBox();return width>height?Math.abs(d.y-t.y)<2&&d.x+d.width<=t.x&&Math.abs(d.height-original.height)<3:t.y+t.height<=d.y}).toBe(true);
  await expect(timer).toHaveAttribute('data-resting','true');const fraction=()=>timer.evaluate(e=>Number(e.style.getPropertyValue('--rest-fraction')));const initialFraction=await fraction();await expect.poll(fraction).toBeLessThan(initialFraction);await expect.poll(()=>timer.evaluate(e=>getComputedStyle(e,'::before').backgroundColor)).toBe('rgb(0, 136, 255)');const t=await timer.boundingBox(),p=await timer.locator('.mini-copy').boundingBox();expect(Math.abs(t.x+t.width/2-p.x-p.width/2)).toBeLessThan(2);await timer.getByRole('button',{name:'Skip Rest'}).click();await expect(timer).toHaveAttribute('data-resting','false');await expect(timer).toHaveAttribute('data-ready','true');await expect(timer.locator('.mini-name')).toHaveText('Rest Done');await expect(timer.locator('.mini-clock')).toBeVisible();await expect(timer.locator('.mini-clock')).toHaveText(/^0+:00$/);await expect(timer.getByRole('button',{name:'Reset Rest'})).toBeEnabled();await expect(timer).toHaveCSS('height','56px');
 });
}

for(const theme of ['light','dark'])for(const [width,height] of [[466,678],[626,890],[890,626]]){
 test('shared card radius '+theme+' '+width,async({page})=>{
  await page.setViewportSize({width,height});await page.addInitScript(t=>localStorage.setItem('form-preview-theme',t),theme);await page.goto(url);
  await expect(page.locator('#home-page .hero')).toHaveCSS('border-top-left-radius','20px');await expect(page.locator('#start')).toHaveCSS('border-top-left-radius','12px');await expect(page.locator('.dock')).toHaveCSS('border-top-left-radius','999px');
  await page.locator('#nav-workouts').click();await expect(page.locator('#routine-items .routine-row').first()).toHaveCSS('border-top-left-radius','20px');
 });
}

for(const [width,height] of [[466,678],[626,890],[890,626]]){
 test('real progress and saved summary '+width,async({page})=>{
  await page.setViewportSize({width,height});await page.goto(url);
  await page.locator('#nav-progress').click();await expect(page.locator('#progress-page')).toBeVisible();await expect(page.locator('#progress-trend')).toContainText('Complete a workout');
  await page.locator('#nav-home').click();await page.locator('#start').click();await page.locator('#active-workout .session-check:visible').first().click();
  await page.locator('.session-toolbar .session-finish').click();await expect(page.locator('#finish-workout')).toBeVisible();await page.locator('#finish-confirm').click();
  await expect(page.locator('#workout-summary')).toBeVisible();await expect(page.locator('#summary-stats')).toContainText('Completed sets');await page.locator('#summary-done').click();
  await page.locator('#nav-progress').click();await expect(page.locator('#progress-history button')).toHaveCount(1);await page.locator('#progress-history button').first().click();await expect(page.locator('#workout-summary')).toBeVisible();await page.locator('#summary-done').click();
  await page.reload();await expect(page.locator('#progress-page')).toBeVisible();await expect(page.locator('#progress-history button')).toHaveCount(1);
 });
}

test('active floating timer survives folding and unfolding',async({page})=>{
 await page.setViewportSize({width:890,height:626});await page.goto(url);await page.locator('#start').click();await page.locator('#active-workout .session-check:visible').first().click();const timer=page.locator('.mini-workout');await expect(timer).toBeVisible();const deadline=await page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data.restUntil);
 for(const [width,height] of [[466,678],[626,890],[890,626]]){await page.setViewportSize({width,height});await expect(timer).toBeVisible();await expect(timer).toHaveAttribute('data-resting','true');await expect(page.locator('#session-rest-card')).toBeHidden();await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data.restUntil)).toBe(deadline);const bounds=await timer.boundingBox();expect(bounds.y+bounds.height).toBeLessThanOrEqual(height);}
});

for(const [width,height] of [[466,678],[626,890],[890,626]]){
 test('workout header stays pinned while exercises scroll '+width,async({page})=>{
  await page.setViewportSize({width,height});await page.goto(url);
  await page.evaluate(()=>localStorage.setItem('form-routines',JSON.stringify([{id:'scroll-test',name:'Scroll test',description:'',exercises:Array.from({length:12},(_,i)=>({name:'Exercise '+(i+1),sets:Array.from({length:12},()=>({weight:20,reps:10,rest:90}))}))}])));
  await page.reload();await page.locator('#start').click();
  const header=page.locator('.session-pinned'),content=page.locator('.session-scroll'),timer=page.locator('.mini-workout');
  await expect(header).toBeVisible();await expect(timer).toBeVisible();const before=await header.boundingBox(),timerBefore=await timer.boundingBox();
  await content.evaluate(e=>e.scrollTop=200);await expect.poll(()=>content.evaluate(e=>e.scrollTop)).toBeGreaterThan(0);
  const after=await header.boundingBox(),timerAfter=await timer.boundingBox(),clip=await content.boundingBox();
  expect(Math.abs(after.y-before.y)).toBeLessThan(1);expect(Math.abs(timerAfter.y-timerBefore.y)).toBeLessThan(1);expect(clip.y).toBeGreaterThanOrEqual(after.y+after.height-1);
 });
}

 test('routine draft retains valid set values during invalid input',async({page})=>{
 await page.setViewportSize({width:466,height:678});await page.goto(url);
 await page.evaluate(()=>localStorage.setItem('form-routines',JSON.stringify([{id:'validation-test',name:'Validation routine',description:'',exercises:[{name:'Squat',sets:[{weight:20,reps:10,rest:90}]}]}])));
 await page.reload();await page.locator('#nav-workouts').click();await page.locator('#routine-items .routine-entry').filter({hasText:'Validation routine'}).click();await page.locator('#detail-edit').click();
 const reps=page.getByRole('spinbutton',{name:'Squat set 1 reps'});await reps.fill('0');await expect(reps).toHaveAttribute('aria-invalid','true');await reps.fill('2.5');await expect(reps).toHaveAttribute('aria-invalid','true');await reps.blur();await expect(reps).toHaveValue('10');await reps.fill('12');await expect(reps).toHaveAttribute('aria-invalid','false');
 const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('form-routine-draft')).data);expect(draft.exercises[0].sets[0].reps).toBe(12);await page.locator('#save-routine').click();await expect(page.locator('#detail-title')).toHaveText('Validation routine');
 });

test('finish modal safely cancels and discards an empty workout',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await page.locator('#start').click();await page.locator('.session-toolbar .session-finish').click();await expect(page.locator('#finish-confirm')).toBeDisabled();await page.locator('#finish-discard').click();await expect(page.locator('#finish-heading')).toHaveText('Discard workout?');await page.locator('#finish-keep').click();await expect(page.locator('#finish-heading')).toHaveText('Finish workout?');await page.locator('#finish-keep').click();await expect(page.locator('#finish-workout')).toBeHidden();await page.locator('.session-toolbar .session-finish').click();await page.locator('#finish-discard').click();await page.locator('#finish-confirm').click();await expect(page.locator('#home-page')).toBeVisible();await expect(page.locator('#finish-workout')).toBeHidden();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data)).toBeNull();});

test('global action capitalization remains consistent across states',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await expect(page.locator('#quick')).toContainText('Quick Start');await expect(page.locator('#routine')).toHaveText('View Routine');await page.locator('#start').click();await page.getByRole('button',{name:'Minimize Workout'}).click();await expect(page.locator('#routine')).toHaveText('View Session');await page.locator('#nav-workouts').click();await expect(page.locator('#toggle-samples')).toHaveText('Hide Sample Routines');await page.locator('#toggle-samples').click();await expect(page.locator('#toggle-samples')).toHaveText('Show Sample Routines');});

test('semantic action palette is shared by workout and home',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await page.evaluate(()=>document.documentElement.dataset.theme='dark');await expect(page.locator('#start')).toHaveCSS('background-color','rgb(176, 255, 0)');await page.locator('#start').click();await expect(page.locator('.session-finish')).toHaveCSS('background-color','rgb(176, 255, 0)');await page.evaluate(()=>document.documentElement.dataset.theme='light');await expect(page.locator('.session-finish')).toHaveCSS('background-color','rgb(66, 101, 0)');});
