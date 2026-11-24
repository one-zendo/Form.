// Poll only the entry document; versioned imports identify deployed releases.
let baseline=null,busy=false;
function active(){try{return !!JSON.parse(localStorage.getItem('form.data.v2')||'{}').active}catch{return true}}
async function check(){if(busy||document.hidden||!navigator.onLine)return;busy=true;try{const u=new URL('./',location.href);u.searchParams.set('_form_check',Date.now());const r=await fetch(u,{cache:'no-store'});if(!r.ok)return;const next=await r.text();if(baseline===null){baseline=next;return}if(next!==baseline&&!active()&&!document.querySelector('dialog[open]')&&!document.activeElement?.matches('input,textarea,select,[contenteditable=true]')){const target=new URL(location.href);target.searchParams.set('_form_version',Date.now());location.replace(target)}}catch{}finally{busy=false}}
check();setInterval(check,30000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});window.addEventListener('online',check);
