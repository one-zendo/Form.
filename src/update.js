// Compare deployed asset contents, not commit timestamps, to avoid refreshing before deployment.
const paths=['./','./src/tokens.css','./src/navigation.css','./src/navigation.js','./src/update.js'];
let baseline=null,busy=false;
async function check(){
 if(busy||document.hidden||!navigator.onLine)return;
 busy=true;
 try{
 const snapshots=await Promise.all(paths.map(async p=>{const u=new URL(p,location.href);u.searchParams.set('_form_check',Date.now());const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error('Unavailable');return r.text()}));
 const next=JSON.stringify(snapshots);
 if(baseline===null){baseline=next;return;}
 if(next!==baseline && !document.querySelector('[data-workout-active="true"]') && !window.formWorkoutActive){
 const u=new URL(location.href);u.searchParams.set('_form_version',Date.now());location.replace(u);
 }
 }catch{}finally{busy=false;}
}
check();setInterval(check,5000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
window.addEventListener('online',check);
