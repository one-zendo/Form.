import { test, expect } from '@playwright/test';
const url='http://127.0.0.1:8787';
test.use({colorScheme:'dark'});
async function startFromHome(page){await page.locator('#home-workout-card').click();await page.locator('#home-routine-picker .home-picker-list button').first().click()}
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
 await page.locator('#detail-start').click();
 await expect(page.locator('#detail-title')).toHaveText('Regression routine');
 await page.locator('#detail-edit').click();
 await expect(page.locator('#detail-start')).toBeDisabled();
 await expect(page.locator('#detail-exercises details.routine-exercise[open]')).toHaveCount(1);
 await page.locator('#routine-name').fill('Unsaved rename');
 await expect(page.locator('#detail-start')).toBeEnabled();
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
  await page.locator('#nav-workouts').click();
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
  await expect(page.locator('#detail-exercises details.routine-exercise[open]')).toHaveCount(2);
  await expect(page.locator('#detail-start')).toBeDisabled();
  await page.locator('#detail-exercises details.routine-exercise > summary').first().click();
  await expect(page.locator('#detail-start')).toBeDisabled();
  await page.locator('#detail-edit').click();
  await expect(page.locator('#detail-title')).toHaveText('Inline test');
  await expect(page.locator('#detail-exercises details[open]')).toHaveCount(0);
  await page.locator('#detail-edit').click();
  await page.locator('#routine-name').fill('Updated inline test');
  await page.locator('#detail-edit').click();
  await expect(page.locator('#leave-routine')).toBeVisible();
  await page.locator('#leave-apply').click();
  await expect(page.locator('#detail-title')).toHaveText('Updated inline test');
 });
}

for(const [width,height] of [[466,678],[626,890],[890,626]]){
 test('rest controls and navigation '+width,async({page})=>{
  await page.setViewportSize({width,height});await page.goto(url);
  await startFromHome(page);await expect(page.locator('#active-workout')).toBeVisible();
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
  const dock=page.locator('.dock');const original=await dock.boundingBox();await startFromHome(page);await page.locator('#active-workout .session-check:visible').first().click();await page.getByRole('button',{name:'Minimize Workout'}).click();
  await expect(page.locator('#home-workout-action')).toHaveText('Resume');const timer=page.locator('.mini-workout');await expect(timer).toBeVisible();await expect(dock).toHaveCSS('border-top-left-radius','999px');await expect(timer).toHaveCSS('border-top-left-radius','999px');await expect(timer).toHaveCSS('height','72px');await expect(dock).toHaveCSS('height','56px');
  await expect.poll(async()=>{const d=await dock.boundingBox(),t=await timer.boundingBox();return width>height?Math.abs(d.y+d.height-t.y-t.height)<2&&d.x+d.width<=t.x&&Math.abs(d.height-original.height)<3:t.y+t.height<=d.y}).toBe(true);
  await expect(timer).toHaveAttribute('data-resting','true');const fraction=()=>timer.evaluate(e=>Number(e.style.getPropertyValue('--rest-fraction')));const initialFraction=await fraction();await expect.poll(fraction).toBeLessThan(initialFraction);await expect.poll(()=>timer.evaluate(e=>getComputedStyle(e,'::before').backgroundColor)).toBe('rgb(0, 136, 255)');const t=await timer.boundingBox(),p=await timer.locator(':scope > .mini-copy').boundingBox();expect(Math.abs(t.x+t.width/2-p.x-p.width/2)).toBeLessThan(2);await timer.getByRole('button',{name:'Skip Rest'}).click();await expect(timer).toHaveAttribute('data-resting','false');await expect(timer).toHaveAttribute('data-ready','true');await expect(timer.locator(':scope > .mini-copy .mini-name')).toHaveText('Continue Workout');await expect(timer.locator(':scope > .mini-copy .mini-clock')).toBeVisible();await expect(timer.locator(':scope > .mini-copy .mini-clock')).toHaveText(/^0+:00$/);await expect(timer.getByRole('button',{name:'Reset Rest'})).toBeEnabled();await expect(timer).toHaveCSS('height','72px');
 });
}

for(const theme of ['light','dark'])for(const [width,height] of [[466,678],[626,890],[890,626]]){
 test('shared card radius '+theme+' '+width,async({page})=>{
  await page.setViewportSize({width,height});await page.addInitScript(t=>localStorage.setItem('form-preview-theme',t),theme);await page.goto(url);
  await expect(page.locator('#home-workout-card')).toHaveCSS('border-top-left-radius','20px');await expect(page.locator('.streak-card')).toHaveCSS('border-top-left-radius','20px');await expect(page.locator('.dock')).toHaveCSS('border-top-left-radius','999px');
  await page.locator('#nav-workouts').click();await expect(page.locator('#routine-items .routine-row').first()).toHaveCSS('border-top-left-radius','20px');
 });
}

for(const [width,height] of [[466,678],[626,890],[890,626]]){
 test('real progress and saved summary '+width,async({page})=>{
  await page.setViewportSize({width,height});await page.goto(url);
  await page.locator('#nav-progress').click();await expect(page.locator('#progress-page')).toBeVisible();await expect(page.locator('#progress-trend')).toContainText('Complete a workout');
  await page.locator('#nav-home').click();await startFromHome(page);await page.locator('#active-workout .session-check:visible').first().click();
  await page.locator('.session-toolbar .session-finish').click();await expect(page.locator('#finish-workout')).toBeVisible();await page.locator('#finish-confirm').click();
  await expect(page.locator('#workout-summary')).toBeVisible();await expect(page.locator('#summary-stats')).toContainText('Completed sets');await page.locator('#summary-done').click();
  await page.locator('#nav-progress').click();await expect(page.locator('#progress-history button')).toHaveCount(1);await page.locator('#progress-history button').first().click();await expect(page.locator('#workout-summary')).toBeVisible();await page.locator('#summary-done').click();
  await page.reload();await expect(page.locator('#home-page')).toBeVisible();await page.locator('#nav-progress').click();await expect(page.locator('#progress-history button')).toHaveCount(1);
 });
}

test('active floating timer survives folding and unfolding',async({page})=>{
 await page.setViewportSize({width:890,height:626});await page.goto(url);await startFromHome(page);await page.locator('#active-workout .session-check:visible').first().click();const timer=page.locator('.mini-workout');await expect(timer).toBeVisible();const deadline=await page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data.restUntil);
 for(const [width,height] of [[466,678],[626,890],[890,626]]){await page.setViewportSize({width,height});await expect(timer).toBeVisible();await expect(timer).toHaveAttribute('data-resting','true');await expect(page.locator('#session-rest-card')).toBeHidden();await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data.restUntil)).toBe(deadline);const bounds=await timer.boundingBox();expect(bounds.y+bounds.height).toBeLessThanOrEqual(height);}
});

for(const [width,height] of [[466,678],[626,890],[890,626]]){
 test('workout header stays pinned while exercises scroll '+width,async({page})=>{
  await page.setViewportSize({width,height});await page.goto(url);
  await page.evaluate(()=>localStorage.setItem('form-routines',JSON.stringify([{id:'scroll-test',name:'Scroll test',description:'',exercises:Array.from({length:12},(_,i)=>({name:'Exercise '+(i+1),sets:Array.from({length:12},()=>({weight:20,reps:10,rest:90}))}))}])));
  await page.reload();await startFromHome(page);
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
 const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('form-routine-draft')).data);expect(draft.exercises[0].sets[0].reps).toBe(12);await page.locator('#detail-start').click();await expect(page.locator('#detail-title')).toHaveText('Validation routine');
 });

test('finish modal safely cancels and discards an empty workout',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await startFromHome(page);await page.locator('.session-toolbar .session-finish').click();await expect(page.locator('#finish-confirm')).toBeDisabled();await page.locator('#finish-discard').click();await expect(page.locator('#finish-heading')).toHaveText('Discard workout?');await page.locator('#finish-keep').click();await expect(page.locator('#finish-heading')).toHaveText('Finish workout?');await page.locator('#finish-keep').click();await expect(page.locator('#finish-workout')).toBeHidden();await page.locator('.session-toolbar .session-finish').click();await page.locator('#finish-discard').click();await page.locator('#finish-confirm').click();await expect(page.locator('#home-page')).toBeVisible();await expect(page.locator('#finish-workout')).toBeHidden();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data)).toBeNull();});

test('global action capitalization remains consistent across states',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await expect(page.locator('#home-workout-action')).toHaveText('Start');await expect(page.locator('#quick')).toBeHidden();await startFromHome(page);await page.getByRole('button',{name:'Minimize Workout'}).click();await expect(page.locator('#routine')).toBeHidden();await expect(page.locator('#quick')).toBeHidden();await expect(page.locator('#home-workout-action')).toHaveText('Resume');await page.locator('#nav-workouts').click();await expect(page.locator('#toggle-samples')).toHaveAttribute('aria-label','Hide Sample Routines');await page.locator('#toggle-samples').click();await expect(page.locator('#toggle-samples')).toHaveAttribute('aria-label','Show Sample Routines');});

test('semantic action palette is shared by workout and home',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await page.evaluate(()=>document.documentElement.dataset.theme='dark');await expect(page.locator('#home-workout-card')).toBeVisible();await startFromHome(page);await expect(page.locator('.session-finish')).toHaveCSS('background-color','rgb(176, 255, 0)');await page.evaluate(()=>document.documentElement.dataset.theme='light');await expect(page.locator('.session-finish')).toHaveCSS('background-color','rgb(0, 102, 204)');});

test('adaptive workout retains focus after final set and switches manually',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await startFromHome(page);const cards=page.locator('#active-workout .routine-exercise');await expect(page.locator('.session-card-select[aria-expanded=true]')).toHaveCount(1);await expect(page.locator('#active-workout details')).toHaveCount(0);await cards.nth(1).locator('.session-card-select').click();await expect(cards.nth(1).locator('.session-card-select')).toHaveAttribute('aria-expanded','true');await cards.nth(1).locator('.session-card-select').click();await expect(cards.nth(1).locator('.session-card-select')).toHaveAttribute('aria-expanded','false');await cards.nth(1).locator('.session-card-select').click();await expect(cards.nth(1).locator('.session-card-select')).toHaveAttribute('aria-expanded','true');await cards.first().locator('.session-card-select').click();const count=await cards.first().locator('.session-check').count();for(let j=0;j<count;j++)await cards.first().locator('.session-check').nth(j).click();await expect(cards.first().locator('.session-card-select')).toHaveAttribute('aria-expanded','true');await expect(cards.first().locator('.session-check[aria-pressed=true]')).toHaveCount(count);await cards.nth(1).locator('.session-card-select').click();await expect(cards.nth(1).locator('.session-card-select')).toHaveAttribute('aria-expanded','true');await cards.first().locator('.session-card-select').click();await expect(cards.first().locator('.session-check[aria-pressed=true]')).toHaveCount(count);});

test('light theme semantic foreground contrast',async({page})=>{await page.goto(url);await page.evaluate(()=>document.documentElement.dataset.theme='light');const values=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);return Object.fromEntries(['--action','--success','--insight','--danger','--canvas','--paper'].map(k=>[k,s.getPropertyValue(k).trim()]))});const lum=h=>{const a=h.replace('#','').match(/./g);const v=(a.length===3?a.map(x=>x+x):h.replace('#','').match(/../g)).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2]};for(const k of ['--action','--success','--insight','--danger'])for(const bg of ['--canvas','--paper'])expect((lum(values[bg])+.05)/(lum(values[k])+.05)).toBeGreaterThanOrEqual(4.5);});


test('shared icon geometry stays consistent across layouts and themes',async({page})=>{for(const [width,height] of [[466,678],[626,890],[890,626]]){await page.setViewportSize({width,height});await page.goto(url);for(const theme of ['light','dark']){await page.evaluate(v=>document.documentElement.dataset.theme=v,theme);await expect(page.locator('#nav-home svg')).toHaveCSS('width','20px');await expect(page.locator('#nav-home svg')).toHaveCSS('stroke-width','1.75px');await page.locator('#nav-workouts').click();await expect(page.locator('#detail-start svg')).toHaveCSS('width','18px');await page.locator('#nav-home').click();}}});

test('routine cards select details without redundant quick start controls',async({page})=>{test.setTimeout(90000);for(const [width,height] of [[466,678],[626,890],[890,626]]){await page.setViewportSize({width,height});await page.goto(url);for(const theme of ['light','dark']){await page.evaluate(v=>document.documentElement.dataset.theme=v,theme);await page.locator('#nav-workouts').click();await expect(page.locator('.routine-play')).toHaveCount(0);await page.locator('.routine-entry').first().click();await expect(page.locator('.routine-row.selected .routine-entry')).toHaveAttribute('aria-current','true');await expect(page.locator('#detail-start')).toBeVisible();if(width===890){expect(await page.locator('.routine-row.selected').evaluate(e=>getComputedStyle(e,'::before').width)).toBe('3px')}await page.locator('#nav-home').click();}await page.locator('#nav-workouts').click();await page.locator('.routine-entry').first().click();await page.locator('#detail-start').click();await expect(page.locator('#active-workout')).toBeVisible();await page.evaluate(()=>localStorage.clear());}});

test('active workout semantic set styling across themes and layouts',async({page})=>{test.setTimeout(90000);for(const [width,height] of [[466,678],[626,890],[890,626]]){await page.setViewportSize({width,height});await page.goto(url);await page.evaluate(()=>localStorage.clear());await page.reload();await startFromHome(page);const rows=page.locator('.session-selected .set-line').filter({has:page.locator('input')});const row=rows.first(),unfinished=rows.nth(1);await row.locator('.session-check').click();for(const theme of ['dark','light']){await page.evaluate(v=>document.documentElement.dataset.theme=v,theme);await expect(row.locator('input').first()).toHaveCSS('color',theme==='dark'?'rgb(255, 255, 255)':'rgb(0, 0, 0)');await expect(unfinished.locator('input').first()).toHaveCSS('color',theme==='dark'?'rgb(146, 146, 156)':'rgb(99, 99, 102)');await expect(row.locator('input').first()).toHaveCSS('height','44px');await expect(row.locator('.session-check')).toHaveCSS('width','44px');await expect(row.locator('.session-check-glyph')).toHaveCSS('width','32px');await expect(row.locator('.session-check-glyph')).toHaveCSS('border-radius','999px');await expect(row.locator('.session-check-glyph')).toHaveCSS('background-color',theme==='dark'?'rgb(176, 255, 0)':'rgb(0, 102, 204)');await expect(unfinished.locator('.session-check-glyph svg')).toHaveCSS('visibility','hidden');await expect(page.locator('.session-selected .session-count')).toHaveCount(0);await expect(page.locator('.session-complete-mark')).toHaveCount(0);await expect(page.locator('.session-choice .session-count').first()).toHaveText('1/3');}}});

for(const [width,height] of [[466,678],[626,890],[890,626]])for(const theme of ['light','dark'])test('persistent workout capsule '+width+' '+theme,async({page})=>{await page.setViewportSize({width,height});await page.goto(url);await page.evaluate(v=>document.documentElement.dataset.theme=v,theme);await startFromHome(page);const timer=page.locator('.mini-workout');await expect(timer.locator(':scope > .mini-copy .mini-name')).toHaveText(await page.locator('.session-identity h2').innerText());await expect(timer.locator(':scope > .mini-copy .caption')).toHaveText('Workout in progress');await expect(timer.locator(':scope > .mini-chevron')).toHaveCount(0);const name=await page.locator('.session-selected .session-exercise-name').innerText();await page.locator('.session-selected .session-check').first().click();await expect(timer.locator(':scope > .mini-copy .mini-name')).toHaveText(name);const deadline=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data.restUntil);const before=await deadline();await page.locator('.session-minimize').click();for(const tab of ['workouts','progress','profile','home']){await page.locator('#nav-'+tab).click();await expect(timer.locator(':scope > .mini-copy .mini-name')).toHaveText(name);expect(await deadline()).toBe(before)}await timer.locator(':scope > .mini-copy').click();await expect(page.locator('#active-workout')).toBeVisible();await timer.getByRole('button',{name:'Skip Rest'}).click();await expect(timer.locator(':scope > .mini-copy .mini-name')).toHaveText('Continue Workout');await expect(timer.locator(':scope > .mini-copy .mini-clock')).toHaveText('00:00');await timer.getByRole('button',{name:'Reset Rest'}).click();await expect(timer.locator(':scope > .mini-copy .mini-name')).toHaveText(name);});

for(const [width,height] of [[466,678],[626,890],[890,626]])test('balanced workout table and retained focus '+width,async({page})=>{await page.setViewportSize({width,height});await page.goto(url);await startFromHome(page);const card=page.locator('.session-selected');await expect(card).toHaveCSS('padding-left','16px');await expect(card).toHaveCSS('padding-right','16px');const rows=card.locator('.set-line').filter({has:page.locator('input')});await expect(rows.first()).toHaveCSS('column-gap','8px');const widths=await rows.first().locator('input').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().width));expect(Math.abs(widths[0]-widths[1])).toBeLessThan(1);const name=await card.locator('.session-exercise-name').innerText();const count=await rows.count();for(let i=0;i<count;i++)await rows.nth(i).locator('.session-check').click();await expect(card.locator('.session-exercise-name')).toHaveText(name);await expect(card.locator('.session-check[aria-pressed=true]')).toHaveCount(count);for(const theme of ['dark','light']){await page.evaluate(v=>document.documentElement.dataset.theme=v,theme);await expect(page.locator('.session-segment.filled').first()).toHaveCSS('background-color',theme==='dark'?'rgb(176, 255, 0)':'rgb(0, 102, 204)')}await card.locator('.session-add').click();await expect(rows).toHaveCount(count+1);});

for(const [width,height] of [[466,678],[626,890],[890,626]])test('light adaptive Home workout card '+width,async({page})=>{await page.setViewportSize({width,height});await page.goto(url);await page.evaluate(()=>document.documentElement.dataset.theme='light');const card=page.locator('#home-workout-card');await expect(card).toBeVisible();await expect(card).toHaveCSS('background-color','rgb(0, 136, 255)');expect(await card.evaluate(e=>parseFloat(getComputedStyle(e).minHeight))).toBeGreaterThanOrEqual(108);await expect(page.locator('#home-workout-title')).toHaveText('Ready to train?');await expect(page.locator('#start')).toBeHidden();await card.click();await expect(page.locator('#home-routine-picker')).toBeVisible();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')||'{"data":null}').data)).toBeNull();await page.locator('#home-routine-picker .home-picker-list button').first().click();await expect(page.locator('#active-workout')).toBeVisible();await page.locator('.session-minimize').click();await expect(card).toHaveCSS('background-color','rgb(255, 149, 0)');await expect(card.locator('#home-workout-status')).toHaveCount(0);await expect(page.locator('#home-workout-action')).toHaveText('Resume');await card.click();await expect(page.locator('#active-workout')).toBeVisible();await page.locator('.session-minimize').click();await page.evaluate(()=>document.documentElement.dataset.theme='dark');await expect(card).toBeVisible();await expect(page.locator('#start')).toBeHidden()});

for(const [width,height] of [[466,678],[626,890],[890,626]])test('Home aligned header and saved greeting '+width,async({page})=>{await page.setViewportSize({width,height});await page.goto(url);await page.evaluate(()=>{document.documentElement.dataset.theme="light";localStorage.setItem('form-personal-name','Alex');localStorage.setItem('form-preview-page','home');localStorage.setItem('form-preview-theme','light')});await page.reload();await expect(page.locator('.home-header h1')).toHaveText('FORM');await expect(page.locator('#home-greeting')).toHaveText('Hello, Alex.');await expect(page.locator('#date')).toHaveAttribute('datetime',/^\d{4}-\d{2}-\d{2}$/);await expect(page.locator('.home-tagline')).toHaveText('Train with focus, follow your progress.');await expect(page.locator('#home-greeting')).toBeVisible();await expect(page.locator('#home-workout-card')).toBeVisible();await page.locator('#nav-profile').click();await page.locator('#personal-open').click();await page.locator('#personal-name').fill('');await page.locator('#nav-home').click();await expect(page.locator('#home-greeting')).toHaveText('Hello.');await startFromHome(page);await page.locator('.session-selected .session-check').first().click();const timer=page.locator('.mini-workout');await expect(timer).toHaveCSS('background-color','rgb(229, 229, 234)');await page.evaluate(()=>document.documentElement.dataset.theme='dark');await expect(timer).toHaveCSS('background-color','rgb(36, 36, 46)')});

for(const [width,height] of [[466,678],[626,890],[890,626]])test('weekly streak schedule persists '+width,async({page})=>{await page.setViewportSize({width,height});await page.goto(url);await page.locator('#nav-home').click();await page.locator('#home-activity').click();await expect(page.locator('#rest-days-dialog')).toBeVisible();await page.getByRole('button',{name:'Wednesday rest day'}).click();await page.getByRole('button',{name:'Sunday rest day'}).click();await expect(page.locator('#rest-training-total')).toHaveText('5');await page.locator('#rest-days-save').click();await expect(page.locator('#home-week-count')).toHaveCount(0);await page.reload();await expect(page.locator('#home-days .dot.rest')).toHaveCount(2);await page.locator('#home-activity').click();await expect(page.locator('#rest-days-effective')).toHaveText('Changes apply to this week. Previous weeks are preserved.');await page.getByRole('button',{name:'Friday rest day'}).click();await page.locator('#rest-days-save').click();await expect(page.locator('#home-week-count')).toHaveCount(0);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('form-rest-schedules')).data.map(x=>x.rest))).toEqual([[2,4,6]])});

test("streak card uses calendar rest-day control and bright orange accent",async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await page.evaluate(()=>document.documentElement.dataset.theme="light");const control=page.locator("#home-activity");await expect(control).toBeVisible();await expect(control).toHaveAttribute("aria-label","Manage Rest Days");await expect(control.locator("svg")).toHaveCount(1);const ink=await page.locator(".streak-card").evaluate(e=>getComputedStyle(e).color);await expect(page.locator("#streak-title")).toHaveCSS("color",ink);await expect(page.locator("#streak-best")).toHaveCSS("color",ink);await expect(page.locator(".streak-trophy-button")).toHaveCSS("color","rgb(255, 149, 0)");await expect(page.locator(".streak-footer svg")).toHaveCount(0);await control.click();await expect(page.locator("#rest-days-dialog")).toBeVisible()});

test("Home workout card keeps only name, session details and pill action",async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await page.evaluate(()=>document.documentElement.dataset.theme="light");const card=page.locator("#home-workout-card");await expect(card).toBeVisible();await expect(card.locator("#home-workout-status")).toHaveCount(0);await expect(card.locator(".home-workout-cta svg")).toHaveCount(0);await expect(card.locator("#home-workout-action")).toHaveText("Start");await expect(card.locator(".home-workout-cta")).toBeVisible();await startFromHome(page);await expect(card.locator("#home-workout-title")).not.toHaveText("Ready to train?");await expect(card.locator("#home-workout-action")).toHaveText("Resume");await expect(card.locator("#home-workout-meta")).toContainText("of");await expect(card.locator("#home-workout-status")).toHaveCount(0);await expect(card.locator(".home-workout-cta svg")).toHaveCount(0)});

test("streak card omits weekly count and progress bar and labels personal best",async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await page.evaluate(()=>document.documentElement.dataset.theme="light");await expect(page.locator(".streak-card")).toBeVisible();await expect(page.locator("#home-week-count")).toHaveCount(0);await expect(page.locator(".streak-track")).toHaveCount(0);await expect(page.locator(".streak-footer")).toContainText("Personal best");await expect(page.locator("#streak-best")).toBeVisible();await expect(page.locator("#home-activity")).toHaveAttribute("aria-label","Manage Rest Days")});

for(const theme of ['light','dark'])for(const [width,height] of [[390,844],[466,678],[626,890],[890,626],[320,480]]){
 test('two-card Home viewport and timer '+theme+' '+width+'x'+height,async({page})=>{
  await page.setViewportSize({width,height});await page.addInitScript(t=>localStorage.setItem('form-preview-theme',t),theme);await page.goto(url);
  const card=page.locator('#home-workout-card'),streak=page.locator('.streak-card'),dock=page.locator('.dock'),main=page.locator('main');
  await expect(card).toBeVisible();await expect(streak).toBeVisible();
  await expect(page.locator('#home-page .card:visible')).toHaveCount(1);
  await expect(page.locator('#home-page .hero,#home-page .home-legacy,#quick,#home-greeting')).not.toHaveCount(0);
  for(const node of await page.locator('#home-page .hero,#home-page .home-legacy,#quick').all())await expect(node).toBeHidden();
  await expect(page.locator('#home-greeting')).toBeVisible();
  const geometry=()=>page.evaluate(()=>{const a=document.querySelector('.home-brand h1').getBoundingClientRect(),b=document.querySelector('#home-weekday').getBoundingClientRect(),c=document.querySelector('.home-tagline').getBoundingClientRect(),d=document.querySelector('#home-calendar-date').getBoundingClientRect(),m=document.querySelector('main'),s=document.querySelector('.streak-card'),p=s.parentElement;return {title:Math.abs(a.top-b.top),tag:Math.abs(c.top-d.top),horizontal:m.scrollWidth-m.clientWidth,vertical:m.scrollHeight-m.clientHeight,streakWidth:s.offsetWidth,parentWidth:p.clientWidth}});
  const g=await geometry();expect(g.title).toBeLessThan(2);expect(g.tag).toBeLessThan(2);expect(g.horizontal).toBeLessThanOrEqual(1);expect(g.streakWidth).toBe(g.parentWidth);
  expect(g.vertical).toBeLessThanOrEqual(2);if(height>=678){const a=await card.boundingBox(),s=await streak.boundingBox(),d=await dock.boundingBox();expect(Math.abs(a.height/(a.height+s.height)-.45)).toBeLessThan(.08);expect(d.y-(s.y+s.height)).toBeLessThanOrEqual(24);}
  await expect(page.locator('.streak-trophy-button svg')).toHaveCSS('width','18px');await expect(page.locator('.streak-trophy-button svg')).toHaveCSS('height','18px');
  const before=await card.boundingBox();await startFromHome(page);await page.locator('#active-workout .session-check:visible').first().click();await page.getByRole('button',{name:'Minimize Workout'}).click();
  const timer=page.locator('.mini-workout');await expect(timer).toBeVisible();await expect(page.locator('#home-workout-action')).toHaveText('Resume');
  if(height>=678)await expect.poll(async()=> (await card.boundingBox()).height).toBeLessThan(before.height);
  await expect.poll(async()=>main.evaluate(e=>e.scrollHeight-e.clientHeight)).toBeLessThanOrEqual(2);await main.evaluate(e=>e.scrollTop=1000);expect(await main.evaluate(e=>e.scrollTop)).toBeLessThanOrEqual(1);await expect.poll(async()=>{const s=await streak.boundingBox(),t=await timer.boundingBox(),d=await dock.boundingBox();return s.y+s.height<=Math.min(t.y,d.y)+2}).toBe(true);
  await page.locator('#home-activity').click();await expect(page.locator('#rest-days-dialog')).toBeVisible();
 });
}

 test('rest color mask follows countdown and is noninteractive',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await startFromHome(page);await page.locator('.session-selected .session-check').first().click();const timer=page.locator('.mini-workout'),mask=timer.locator('.mini-color-mask');await expect(mask).toBeVisible();await expect(mask).toHaveAttribute('aria-hidden','true');await expect(mask).toHaveCSS('pointer-events','none');expect(await mask.evaluate(e=>e.inert)).toBe(true);const clip=()=>mask.evaluate(e=>getComputedStyle(e).clipPath);const initial=await clip();expect(initial).not.toBe('none');await expect.poll(clip).not.toBe(initial);await expect(mask.locator('.mini-name')).toHaveText(await timer.locator(':scope > .mini-copy .mini-name').innerText());await timer.getByRole('button',{name:'Skip Rest'}).click();await expect(mask).toBeHidden();await expect(timer).toHaveAttribute('data-ready','true')});

for(const [width,height] of [[466,678],[890,626]])test('active workout reorder preserves logged sets and rest '+width,async({page})=>{await page.setViewportSize({width,height});await page.goto(url);await startFromHome(page);await page.locator('.session-selected .session-check').first().click();const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data);const before=await saved();expect(before.exercises.length).toBeGreaterThan(1);const headers=page.locator(width>height?'.session-choice[data-exercise-order]':'.session-card-select[data-exercise-order]');await headers.first().focus();await page.keyboard.press('Alt+ArrowDown');const after=await saved();expect(after.exercises[1]).toEqual(before.exercises[0]);expect(after.exercises[0]).toEqual(before.exercises[1]);expect(after.restUntil).toBe(before.restUntil);await expect(page.locator('.session-selected .session-exercise-name')).toHaveText(before.exercises[0].name);await page.reload();expect((await saved()).exercises).toEqual(after.exercises)});


test('security policy permits FORM startup and uses a per-response nonce',async({page,request})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(url);const headers=response.headers();
 expect(headers['x-content-type-options']).toBe('nosniff');
 expect(headers['x-frame-options']).toBe('DENY');
 const nonce=await page.locator('script[nonce]').evaluate(e=>e.nonce);
 expect(nonce).toBeTruthy();expect(headers['content-security-policy']).toContain("'nonce-"+nonce+"'");
 await expect(page.locator('#home-workout-card')).toBeVisible();
 await startFromHome(page);await expect(page.locator('#active-workout')).toBeVisible();
 expect(errors).toEqual([]);
 const next=await request.get(url);expect(next.headers()['content-security-policy']).not.toBe(headers['content-security-policy']);
 const post=await request.post(url);expect(post.status()).toBe(405);
});

test('rest deadline survives reload and undo clears the associated timer',async({page})=>{
 await page.goto(url);await startFromHome(page);
 const check=page.locator('.session-selected .session-check').first();await check.click();
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data);
 const before=await saved();expect(before.restUntil).toBeGreaterThan(Date.now());
 await page.reload();expect((await saved()).restUntil).toBe(before.restUntil);
 await expect(page.locator('.mini-workout')).toHaveAttribute('data-resting','true');
 await expect(page.locator('#home-page')).toBeVisible();
 await page.getByRole('button',{name:'Resume Active Workout'}).click();
 await page.locator('.session-selected .session-check').first().click();
 expect((await saved()).restUntil).toBe(0);
});

test('another tab changing stored training records prevents stale writes',async({page,context})=>{
 await page.goto(url);await startFromHome(page);
 const second=await context.newPage();await second.goto(url);await second.getByRole('button',{name:'Resume Active Workout'}).click();
 await page.locator('.session-selected .session-check').first().click();
 await expect(second.locator('#dialog')).toBeVisible();
 await expect(second.locator('#message')).toContainText('another tab');
 const saved=()=>page.evaluate(()=>localStorage.getItem('form-active-workout'));
 const before=await saved();await second.locator('#dialog button').click();
 await second.locator('.session-selected .session-check').first().click();
 expect(await saved()).toBe(before);await second.close();
});

test('exercise picker exposes expanded state and viewport allows zoom',async({page})=>{
 await page.goto(url);await page.locator('#nav-workouts').click();await page.locator('#new-routine').click();
 const picker=page.locator('#show-exercise-picker');
 await expect(picker).toHaveAttribute('aria-expanded','false');await picker.click();
 await expect(picker).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('#exercise-picker')).toBeVisible();
 const viewport=await page.locator('meta[name=viewport]').getAttribute('content');
 expect(viewport).not.toContain('user-scalable=no');expect(viewport).not.toContain('maximum-scale=1');
});


test('fresh launch returns Home without discarding an active session or routine draft',async({page})=>{
 await page.goto(url);
 await page.locator('#nav-workouts').click();await page.locator('#new-routine').click();
 await page.locator('#routine-name').fill('Keep this draft');
 const draft=await page.evaluate(()=>localStorage.getItem('form-routine-draft'));
 await page.reload();await expect(page.locator('#home-page')).toBeVisible();
 await expect(page.locator('#routine-detail.is-editing')).toHaveCount(0);await expect(page.locator('dialog[open]')).toHaveCount(0);
 expect(await page.evaluate(()=>localStorage.getItem('form-routine-draft'))).toBe(draft);
 await startFromHome(page);await page.locator('.session-selected .session-check').first().click();
 const session=await page.evaluate(()=>localStorage.getItem('form-active-workout'));
 await page.reload();await expect(page.locator('#home-page')).toBeVisible();await expect(page.locator('#active-workout')).toBeHidden();
 await expect(page.locator('.mini-workout')).toBeVisible();await expect(page.locator('#home-workout-action')).toHaveText('Resume');
 expect(await page.evaluate(()=>localStorage.getItem('form-active-workout'))).toBe(session);
 expect(await page.evaluate(()=>localStorage.getItem('form-routine-draft'))).toBe(draft);
 await page.getByRole('button',{name:'Resume Active Workout'}).click();await expect(page.locator('#active-workout')).toBeVisible();
});


test('full swipe removes logged exercise without dialog and restores its sets on Undo',async({page})=>{
 await page.setViewportSize({width:466,height:678});await page.goto(url);await startFromHome(page);
 await page.locator('.session-selected .session-check').first().click();
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data);
 const before=await saved();const card=page.locator('#active-workout .exercise-swipe-card').first();
 await card.evaluate(e=>{e._exerciseSwipe.begin();e._exerciseSwipe.move(-e.clientWidth);e._exerciseSwipe.end()});
 await expect(page.locator('.exercise-remove-confirm')).toHaveCount(0);
 await expect(page.locator('.exercise-undo')).toBeVisible();
 expect((await saved()).exercises.length).toBe(before.exercises.length-1);
 await page.locator('.exercise-undo').getByRole('button',{name:'Undo'}).click();
 expect((await saved()).exercises).toEqual(before.exercises);
});

test('pointer focus does not display keyboard focus rings',async({page})=>{
 await page.goto(url);await page.locator('#home-activity').click();
 await expect(page.locator('html')).toHaveAttribute('data-input-mode','pointer');
 await expect(page.locator('#rest-days-save')).toBeVisible();
 expect(await page.locator('#rest-days-save').evaluate(e=>{e.focus();return getComputedStyle(e).outlineStyle})).toBe('none');
 await page.keyboard.press('Tab');await expect(page.locator('html')).toHaveAttribute('data-input-mode','keyboard');
});


test('editing weight keeps set controls mounted and allows immediate completion',async({page})=>{
 await page.setViewportSize({width:466,height:678});await page.goto(url);await startFromHome(page);
 const row=page.locator('.session-selected .set-line').filter({has:page.locator('input')}).first();
 const weight=row.locator('input').first();await weight.evaluate(e=>e.dataset.editProbe='true');await weight.fill('42.5');
 await row.locator('.session-check').click();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data);
 expect(state.exercises[0].sets[0].weight).toBe(42.5);expect(state.exercises[0].sets[0].done).toBe(true);
});
test('undo selected exercise restores its running rest deadline and selection',async({page})=>{
 await page.setViewportSize({width:466,height:678});await page.goto(url);await startFromHome(page);
 await page.locator('.session-selected .session-check').first().click();
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data);
 const before=await saved();
 await page.locator('.session-selected.exercise-swipe-card').evaluate(e=>{e._exerciseSwipe.begin();e._exerciseSwipe.move(-e.clientWidth);e._exerciseSwipe.end()});
 await page.locator('.exercise-undo button').click();
 const after=await saved();expect(after.exercises).toEqual(before.exercises);expect(after.restUntil).toBe(before.restUntil);expect(after.restSet).toEqual(before.restSet);
 await expect(page.locator('.session-selected .session-exercise-name')).toHaveText(before.exercises[0].name);
});


test('added set inherits the latest edited values without requiring a screen rebuild',async({page})=>{
 await page.setViewportSize({width:466,height:678});await page.goto(url);await startFromHome(page);
 const card=page.locator('.session-selected'),row=card.locator('.set-line').filter({has:page.locator('input')}).last();
 await row.locator('input').first().fill('37.5');await row.locator('input').last().fill('8');
 await card.getByRole('button',{name:'+ Add Set',exact:true}).click();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('form-active-workout')).data);
 expect(state.exercises[0].sets.at(-1)).toMatchObject({weight:37.5,reps:8,done:false});
});


test('exercise menu fits short landscape viewport',async({page})=>{
 await page.setViewportSize({width:890,height:320});await page.goto(url);await startFromHome(page);
 await page.locator('.session-selected .session-exercise-options').click();
 const menu=page.locator('.session-exercise-popover');await expect(menu).toBeVisible();
 const bounds=await menu.boundingBox();expect(bounds.y).toBeGreaterThanOrEqual(0);expect(bounds.y+bounds.height).toBeLessThanOrEqual(321);
 await expect(menu.getByRole('button',{name:'Remove Exercise'})).toBeVisible();
});


test('normal exercise taps expand and collapse without entering reorder mode',async({browser})=>{
 const context=await browser.newContext({viewport:{width:466,height:678},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
 try{const page=await context.newPage();await page.goto(url);await startFromHome(page);
 const card=page.locator('#active-workout .routine-exercise').nth(1),header=card.locator('.session-card-select');
 await header.tap();await expect(header).toHaveAttribute('aria-expanded','true');await expect(card.locator('.session-check').first()).toBeVisible();
 await header.tap();await expect(header).toHaveAttribute('aria-expanded','false');
 await header.tap();await expect(header).toHaveAttribute('aria-expanded','true');await expect(page.locator('.session-drag-float')).toHaveCount(0);
 }finally{await context.close()}
});

test('planned recovery uses blue checks and compact inline trophy',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await page.evaluate(()=>document.documentElement.dataset.theme='light');await page.locator('#home-activity').click();await page.getByRole('button',{name:'Wednesday rest day'}).click();await page.locator('#rest-days-save').click();const dot=page.locator('#home-days .dot.rest');await expect(dot).toHaveCount(1);await expect(dot).toHaveCSS('background-color','rgb(0, 136, 255)');await expect(dot).toHaveCSS('color','rgb(255, 255, 255)');await expect(dot.locator('svg')).toHaveCount(1);await expect(page.locator('.streak-title-row .streak-trophy-button svg')).toHaveCSS('width','18px');});

test('rest-day picker uses matching checks and live totals',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await page.evaluate(()=>document.documentElement.dataset.theme='light');await page.locator('#home-activity').click();const day=page.getByRole('button',{name:'Wednesday rest day'});await day.click();await expect(day).toHaveAttribute('aria-pressed','true');await expect(day.locator('.dot')).toHaveCSS('background-color','rgb(0, 136, 255)');await expect(day.locator('.dot')).toHaveCSS('color','rgb(255, 255, 255)');await expect(page.locator('#rest-training-total')).toHaveText('6');await expect(page.locator('#rest-recovery-total')).toHaveText('1');await day.click();await expect(page.locator('#rest-recovery-total')).toHaveText('0');await expect(page.locator('.recovery-total-icon svg')).toHaveCount(1);});

test('shared dumbbell geometry matches throughout FORM',async({page})=>{await page.goto(url);const geometry=async locator=>locator.evaluate(e=>Array.from(e.querySelectorAll('path,rect,circle,line,polyline,polygon')).map(n=>n.outerHTML));const nav=await geometry(page.locator('#nav-workouts svg'));expect(nav.length).toBeGreaterThan(0);await page.locator('#home-activity').click();const training=await geometry(page.locator('.training-total-icon svg'));const day=await geometry(page.getByRole('button',{name:'Monday rest day'}).locator('svg'));expect(training).toEqual(nav);expect(day).toEqual(nav);});

test('rest day modal has centered title, copy and summary cards',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await page.locator('#home-activity').click();await expect(page.locator('#rest-days-dialog')).toHaveCSS('text-align','center');await expect(page.locator('#rest-days-dialog > .row')).toHaveCSS('justify-content','center');await expect(page.locator('#rest-days-dialog > p').first()).toHaveCSS('text-align','center');for(const card of await page.locator('#rest-days-dialog .rest-day-totals > div').all()){await expect(card).toHaveCSS('justify-items','center');await expect(card).toHaveCSS('text-align','center');}});

test('routine pencil edits inline without a second page',async({page})=>{await page.setViewportSize({width:466,height:678});await page.goto(url);await page.locator('#nav-workouts').click();await page.locator('#new-routine').click();await page.locator('#routine-name').fill('Inline routine');await page.locator('#show-exercise-picker').click();await page.locator('#exercise-search').fill('Bench Press');await page.locator('#exercise-options button').first().click();await page.locator('#detail-start').click();await expect(page.locator('#detail-title')).toHaveText('Inline routine');await page.locator('#routine-detail').evaluate(e=>e.dataset.inlineProbe='same');await page.locator('#detail-edit').click();await expect(page.locator('#routine-detail')).toHaveAttribute('data-inline-probe','same');await expect(page.locator('#routine-editor')).toHaveCount(0);await expect(page.locator('#detail-start')).toHaveText('Save Changes');await expect(page.locator('#detail-exercises input').first()).toBeVisible();await page.locator('#detail-exercises input').first().fill('42');await expect(page.locator('#detail-start')).toBeEnabled();await page.locator('#detail-start').click();await expect(page.locator('#detail-start')).toHaveText('Start Workout');await expect(page.locator('#routine-detail')).not.toHaveClass(/is-editing/);});

for(const [width,height] of [[466,678],[626,890],[890,626]])test('routine edit header and fade remain fixed while exercise body scrolls '+width,async({page})=>{await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);await page.evaluate(()=>localStorage.setItem('form-routines',JSON.stringify([{id:'pinned-routine',name:'Pinned routine',description:'',exercises:Array.from({length:12},(_,i)=>({name:'Exercise '+(i+1),sets:[{weight:20,reps:10,rest:90},{weight:20,reps:10,rest:90}]}))}])));await page.reload();await page.locator('#nav-workouts').click();await page.locator('#routine-items .routine-entry').filter({hasText:'Pinned routine'}).click();await page.locator('#detail-edit').click();const header=page.locator('.routine-detail-header-area'),body=page.locator('.routine-detail-body'),scroll=page.locator('#routine-detail-scroll');await expect(page.locator('#detail-start')).toHaveText('Save Changes');await expect(header).toBeVisible();const before=await header.boundingBox();const fade=await body.evaluate(e=>{const p=getComputedStyle(e,'::before');return {mask:p.maskImage||p.webkitMaskImage,height:p.height,pointerEvents:p.pointerEvents}});expect(fade.mask).toContain('linear-gradient');expect(fade.height).toBe('12px');expect(fade.pointerEvents).toBe('none');await scroll.evaluate(e=>e.scrollTop=300);await expect.poll(()=>scroll.evaluate(e=>e.scrollTop)).toBeGreaterThan(0);const after=await header.boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThan(1);const b=await body.boundingBox();expect(b.y).toBeGreaterThanOrEqual(after.y+after.height-1);if(width>=760&&width>height){await expect(page.locator('#detail-back')).toBeHidden();await expect(page.locator('.partner-wide-accent')).toBeVisible()}else await expect(page.locator('#detail-back')).toBeVisible();});

for(const [width,height] of [[466,678],[626,890],[890,626]])test('routine exercise cards have visible height before and after editing '+width,async({page})=>{await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);await page.evaluate(()=>localStorage.setItem('form-routines',JSON.stringify([{id:'visible-routine',name:'Visible routine',description:'',exercises:Array.from({length:8},(_,i)=>({name:'Exercise '+(i+1),sets:[{weight:20,reps:10,rest:90}]}))}])));await page.reload();await page.locator('#nav-workouts').click();await page.locator('#routine-items .routine-entry').filter({hasText:'Visible routine'}).click();const sc=page.locator('#routine-detail-scroll'),card=page.locator('#detail-exercises .detail-exercise').first();for(const edit of [false,true]){if(edit)await page.locator('#detail-edit').click();await expect(card).toBeInViewport();expect((await sc.boundingBox()).height).toBeGreaterThan(80);await expect.poll(()=>sc.evaluate(e=>e.scrollHeight-e.clientHeight)).toBeGreaterThan(0);await sc.evaluate(e=>e.scrollTop=200);await expect.poll(()=>sc.evaluate(e=>e.scrollTop)).toBeGreaterThan(0);await sc.evaluate(e=>e.scrollTop=0);}});

for(const [width,height] of [[466,678],[626,890],[890,626]])test('routine edit matches read mode geometry '+width,async({page})=>{await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);await page.evaluate(()=>localStorage.setItem('form-routines',JSON.stringify([{id:'geometry-routine',name:'Geometry routine',description:'Example',exercises:[{name:'Bench Press',sets:[{weight:20,reps:10,rest:90},{weight:20,reps:10,rest:90}]}]}])));await page.reload();await page.locator('#nav-workouts').click();await page.locator('#routine-items .routine-entry').filter({hasText:'Geometry routine'}).click();await page.locator('#detail-exercises summary').first().click();const button=page.locator('#detail-start'),header=page.locator('.routine-detail-header-area'),row=page.locator('#detail-exercises .routine-set-row').nth(1);await expect(button).toHaveCSS('height','48px');const a=await header.boundingBox(),b=await row.boundingBox(),columns=await row.evaluate(e=>getComputedStyle(e).gridTemplateColumns);await page.locator('#detail-edit').click();await expect(button).toHaveCSS('height','48px');await expect(button).toHaveText('Save Changes');await expect(page.locator('#detail-exercises .exercise-menu')).toHaveCount(0);await expect(row.locator('input').first()).toBeVisible();expect(await row.evaluate(e=>getComputedStyle(e).gridTemplateColumns)).toBe(columns);expect(Math.abs((await header.boundingBox()).height-a.height)).toBeLessThan(1);expect(Math.abs((await row.boundingBox()).height-b.height)).toBeLessThan(1);});

for(const [width,height] of [[390,844],[466,678],[626,890]])test('partner headers preserve portrait geometry '+width,async({page})=>{
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);
  await page.evaluate(()=>localStorage.setItem('form-routines',JSON.stringify([{id:'partner-geometry',name:'Partner geometry',description:'',exercises:[{name:'Bench Press',sets:[{weight:20,reps:10,rest:90}]}]}])));
  await page.reload();await page.locator('#nav-workouts').click();
  const rect=async selector=>{const box=await page.locator(selector).boundingBox();expect(box).not.toBeNull();return box};
  const close=(a,b)=>expect(Math.abs(a-b)).toBeLessThanOrEqual(1);
  const title=await rect('#routine-list .partner-header h2'),add=await rect('#new-routine'),section=await rect('.routine-title-row'),control=await rect('.routine-search-wrap'),card=await rect('#routine-items .routine-row'),dock=await rect('.dock');
  const addColor=await page.locator('#new-routine').evaluate(e=>getComputedStyle(e).color);
  await page.locator('#routine-items .routine-entry').filter({hasText:'Partner geometry'}).click();
  const detail=await rect('#detail-title'),edit=await rect('#detail-edit'),back=await rect('#detail-back'),heading=await rect('.detail-heading'),start=await rect('#detail-start'),exercise=await rect('#detail-exercises summary'),nextDock=await rect('.dock');
  close(title.x,detail.x);close(title.y,detail.y);close(title.height,detail.height);close(add.x,edit.x);close(add.y,edit.y);close(control.y,start.y);close(section.y,heading.y);close(card.y,exercise.y);close(card.height,exercise.height);close(dock.y,nextDock.y);
  expect(back.width).toBe(44);expect(back.height).toBe(44);expect(edit.width).toBe(44);expect(edit.height).toBe(44);await expect(page.locator('#detail-edit .icon svg')).toHaveCSS('width','18px');await expect(page.locator('#detail-edit')).toHaveCSS('color',addColor);
  await page.locator('#detail-edit').click();const name=await rect('#routine-name');close(name.x,detail.x);close(name.y,detail.y);close((await rect('#detail-start')).y,start.y);
  await page.locator('#detail-edit').click();await page.locator('#detail-back').click();close((await rect('#routine-list .partner-header h2')).x,title.x);
});

for(const theme of ['light','dark'])test('global headline measurements '+theme,async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.addInitScript(t=>localStorage.setItem('form-preview-theme',t),theme);await page.goto(url);
 const check=async selector=>{const title=page.locator(selector);await expect(title).toBeVisible();for(const [property,value] of [['font-size','28px'],['font-weight','700'],['line-height','44px'],['height','44px'],['letter-spacing','-0.7px']])await expect(title).toHaveCSS(property,value);expect(await title.evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Inter')};
 await check('#home-page .form-headline');await page.locator('#nav-workouts').click();await check('#routine-list .form-headline');await page.locator('#routine-items .routine-entry').first().click();await check('#detail-title');await page.locator('#detail-edit').click();await check('#routine-name');await page.locator('#detail-back').click();
 await page.locator('#nav-progress').click();await check('#progress-page .form-headline');await page.locator('#nav-profile').click();await check('#profile-page .form-headline');await page.locator('#personal-open').click();await check('#personal-page .form-headline');await page.locator('#personal-back').click();await page.locator('#appearance-open').click();await check('#appearance-page .form-headline');
});
