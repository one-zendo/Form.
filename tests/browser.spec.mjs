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
