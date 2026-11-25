import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const readCore = name => readFileSync(new URL("../src/core/" + name + ".js.txt", import.meta.url), "utf8");
const api = vm.runInNewContext(["calendar","progress","storage","workspace","demo"].map(readCore).join("\n") +
  ";({createFormWorkspace,buildDemoDataset,calculateStreak,monthlyTrainingDays,progressRecords,exerciseSeries,savedWeightRecords,recordStats,validRoutine,validSchedules,finishJournal})");
const map = new Map();
let failOn = "";
const storage = {
  getItem: key => map.get(key) ?? null,
  setItem(key, value) { if (key === failOn) throw Error("Storage full"); map.set(key, value); },
  removeItem(key) { map.delete(key); }
};
const open = (preview = false) => api.createFormWorkspace(storage, {preview});
const real = open();
const keys = ["form-routines", "form-workout-history", "form-rest-schedules", "form-active-workout",
  "form-routine-draft", "form-personal-name", "form-personal-goal", "form-preview-theme",
  "form-finish-journal", "form-workout-history-backup", "form-active-workout-quarantine"];
for (const key of keys) {
  assert.equal(real.data.getItem(key), null);
  real.data.setItem(key, "original:" + key);
}
assert.equal(real.demo, false);
assert.equal(real.personalTransferSource().getItem(keys[0]), "original:" + keys[0]);
assert.throws(() => real.personalTransferSource().getItem("form-demo:v1:form-workout-history"));
for (const key of ["form-demo:v1:seed", "form-mode-v1"]) {
  failOn = key;
  assert.throws(() => real.changeMode(true), /Storage full/);
  assert.equal(open().demo, false);
  assert.equal(real.data.getItem("form-workout-history"), "original:form-workout-history");
}
failOn = "";
real.changeMode(true);
const demo = open();
assert.equal(demo.demo, true);
assert.equal(demo.personalTransferSource(), null);
const records = JSON.parse(demo.data.getItem("form-workout-history")).data;
assert.equal(records.length, 48);
assert.equal(new Set(records.map(r => r.id)).size, 48);
assert.equal(JSON.parse(demo.data.getItem("form-routines")).data.length, 3);
for (const key of keys) {
  if (!["form-routines", "form-workout-history", "form-rest-schedules"].includes(key)) assert.equal(demo.data.getItem(key), null);
  demo.data.setItem(key, "demo:" + key);
  assert.equal(real.data.getItem(key), "original:" + key);
  assert.equal(demo.ownsChange(key, keys), false);
  assert.equal(real.ownsChange("form-demo:v1:" + key, keys), false);
  assert.equal(demo.ownsChange("form-demo:v1:" + key, keys), true);
}
const preview = open(true);
assert.equal(preview.personalTransferSource(), null);
assert.equal(preview.data.getItem("form-workout-history"), null);
preview.changeMode(true);
const previewDemo = open(true);
assert.equal(JSON.parse(previewDemo.data.getItem("form-workout-history")).data.length, 48);
previewDemo.data.setItem("form-workout-history", "preview only");
demo.changeMode(false);
for (const key of keys) assert.equal(open().data.getItem(key), "original:" + key);
real.changeMode(true);
for (const key of keys) assert.equal(open().data.getItem(key), "demo:" + key);
assert.equal(open(true).data.getItem("form-workout-history"), "preview only");
assert.equal(api.createFormWorkspace(storage, {development:true}).personalTransferSource(), null);
for (const date of [new Date(2026, 2, 9, 0, 1), new Date(2026, 10, 1, 8), new Date(2027, 0, 1, 23)]) {
  const {routines, records, schedules} = api.buildDemoDataset(date);
  assert.deepEqual([...routines.map(r => r.name)], ["Push Day","Pull Day","Leg Day"]);
  assert.ok(routines.every(api.validRoutine) && records.every(api.validRoutine));
  assert.ok(api.validSchedules(schedules));
  assert.equal(records.length, 48);
  assert.ok(records.every(r => r.started < r.finished && r.finished < +date));
  assert.ok((+date-records[0].finished)/86400000 < 85);
  const streak = api.calculateStreak(date, records, schedules);
  assert.ok(streak.run >= 10 && streak.best >= streak.run);
  assert.equal(api.progressRecords(records,"all",+date).length, 48);
  for (const series of api.exerciseSeries(records).values()) assert.ok(series.at(-1).weight > series[0].weight);
  assert.ok(records.some(r => api.savedWeightRecords(r,records).length > 0));
  for (const r of records) assert.ok(api.recordStats(r).volume > 0 && api.recordStats(r).sets >= 9);
  const latest = new Date(records.at(-1).finished);
  assert.ok(api.monthlyTrainingDays(latest.getFullYear(),latest.getMonth(),date,records,schedules).days.some(day=>day.state==="done"));
}
console.log("Verified workspace isolation, interrupted activation, existing records and derived demo metrics.");
