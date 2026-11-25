import { test, expect } from "@playwright/test";

const release = "http://127.0.0.1:8788";
async function switchMode(page, enable) {
  await page.locator("#nav-profile").click();
  const toggle = page.getByRole("switch", { name: "Demo Mode", exact: true });
  await expect(toggle).toBeChecked({ checked: !enable });
  await Promise.all([page.waitForNavigation(), toggle.click()]);
  await expect(toggle).toBeChecked({ checked: enable });
}
async function readPersonal(page) {
  return page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) =>
    key !== "form-mode-v1" && !key.includes(":"))));
}
for (const [width, height] of [[390, 720], [626, 890], [890, 626]]) {
  test("Demo Mode renders calculated history, records, streaks and charts at " + width, async ({ page }) => {
    await page.setViewportSize({width, height});
    await page.goto(release);
    await expect(page.getByText("Foldable display diagnostics")).toHaveCount(0);
    await switchMode(page, true);
    const toggle = page.getByRole("switch", {name: "Demo Mode", exact: true});
    await expect(toggle.locator("..")).toHaveText("Demo Mode");
    await expect(toggle.locator("..").locator("svg")).toHaveCount(1);
    await expect(toggle).toBeFocused();
    await page.locator("#nav-home").click();
    await expect(page.locator("#workspace-indicator")).toHaveText("Demo Mode");
    await expect(page.locator("#streak-best")).toHaveText(/1[0-2] weeks/);
    await page.locator("#nav-workouts").click();
    await expect(page.locator(".routine-entry")).toHaveCount(3);
    for (const name of ["Push Day", "Pull Day", "Leg Day"]) await expect(page.locator(".routine-entry").filter({hasText:name})).toHaveCount(1);
    await page.getByRole("button", {name:"History", exact:true}).click();
    await expect(page.locator(".workout-history-card")).toHaveCount(48);
    await page.locator(".workout-history-card").first().click();
    await expect(page.locator(width < 760 ? "#workout-summary" : "#history-detail")).toBeVisible();
    if (width < 760) await page.locator("#summary-done").click();
    await page.locator("#nav-progress").click();
    await page.locator("#progress-period").selectOption("all");
    await expect(page.locator("#progress-stats .progress-stat").first()).toContainText("48");
    await expect(page.locator("#progress-trend svg")).toBeVisible();
    await page.reload();
    await expect(page.locator("#workspace-indicator")).toHaveText("Demo Mode");
    await switchMode(page, false);
    await page.locator("#nav-workouts").click();
    await expect(page.locator(".routine-entry")).toHaveCount(0);
    await page.getByRole("button", {name:"History",exact:true}).click();
    await expect(page.locator(".workout-history-card")).toHaveCount(0);
  });
}

test("Demo Mode preserves a personal session, rest deadline, drafts, preferences and exact legacy bytes", async ({ page }) => {
  await page.setViewportSize({width:466,height:678});
  await page.goto(release);
  await page.evaluate(() => {
    const routine={id:"existing",name:"My routine",description:"",exercises:[{name:"Squat",sets:[{weight:40,reps:8,rest:120}]}]};
    const now=Date.now(),active={...routine,id:"in-flight",started:now-60000,restUntil:now+600000,restTotal:600000,
      restOriginal:600000,restSet:{exercise:0,set:0},exercises:[{name:"Squat",sets:[{...routine.exercises[0].sets[0],done:true}]}]};
    for (const [k,v] of Object.entries({"form-routines":JSON.stringify([routine]),"form-routine-draft":JSON.stringify({...routine,id:"draft"}),
      "form-active-workout":JSON.stringify(active),"form-workout-history":JSON.stringify([]),"form-personal-name":"Z",
      "form-personal-goal":"Real goal","form-preview-theme":"dark","form-routines-backup":"existing backup","unrelated":"keep"})) localStorage.setItem(k,v);
  });
  await page.reload();
  await expect(page.locator(".mini-workout")).toBeVisible();
  const original=await readPersonal(page);
  await switchMode(page,true);
  await expect(page.locator(".mini-workout")).toBeHidden();
  await page.locator("#personal-open").click();
  await expect(page.locator("#personal-name")).toHaveValue("");
  await page.locator("#personal-name").fill("Demo athlete");
  await page.locator("#nav-home").click();
  await page.locator("#home-workout-card").click();
  await page.locator("#home-routine-picker .home-picker-list button").first().click();
  await page.locator(".session-selected .session-check").first().click();
  await page.getByRole("button",{name:"Minimize Active Workout"}).click();
  await switchMode(page,false);
  await expect(page.locator(".mini-workout")).toBeVisible();
  expect(await readPersonal(page)).toEqual(original);
  await switchMode(page,true);
  await page.getByRole("button",{name:"Resume Active Workout"}).click();
  await page.locator(".session-toolbar .session-finish").click();
  await page.locator("#finish-confirm").click();
  await expect(page.locator("#workout-summary")).toBeVisible();
  await page.locator("#summary-done").click();
  await page.locator("#nav-workouts").click();
  await page.getByRole("button",{name:"History",exact:true}).click();
  await expect(page.locator(".workout-history-card")).toHaveCount(49);
  await switchMode(page,false);
  expect(await readPersonal(page)).toEqual(original);
  await page.locator("#nav-home").click();
  await expect(page.locator("#home-greeting")).toHaveText("Hello, Z.");
  await expect(page.locator(".mini-workout")).toBeVisible();
});

test("Design preview and open tabs keep separate workspaces across reload and edits", async ({ page, context }) => {
  await page.goto(release);
  const design=await context.newPage();
  await design.goto(release+"/design/");
  await expect(design.locator("#workspace-indicator")).toHaveText("Design preview");
  await switchMode(design,true);
  await design.locator("#personal-open").click();
  await design.locator("#personal-name").fill("Design athlete");
  await page.locator("#nav-profile").click();
  await page.locator("#personal-open").click();
  await expect(page.locator("#personal-name")).toHaveValue("");
  await page.locator("#personal-name").fill("Personal athlete");
  await design.reload();
  await design.locator("#nav-home").click();
  await expect(design.locator("#home-greeting")).toHaveText("Hello, Design athlete.");
  await expect(design.locator("#workspace-indicator")).toHaveText("Design preview · Demo");
  await page.reload();
  await expect(page.locator("#home-greeting")).toHaveText("Hello, Personal athlete.");
  await expect(page.locator("#workspace-indicator")).toBeHidden();
  await expect(page.getByText("Foldable display diagnostics")).toHaveCount(0);
});
