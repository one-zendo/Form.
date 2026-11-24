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
 await page.locator('#exercise-search').fill('Squat');
 await page.locator('#exercise-options button').first().click();
 await page.locator('#save-routine').click();
 await expect(page.locator('#detail-title')).toHaveText('Regression routine');
 await page.locator('#detail-edit').click();
 await page.locator('#routine-name').fill('Unsaved rename');
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
