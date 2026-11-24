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
