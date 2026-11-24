import {renderHome} from './home.js?v=29';
import {renderWorkouts,mountGlobalTimer} from './workouts.js?v=45';
const iconPaths={"house":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" />\n  <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />","dumbbell":"<path d=\"M14.4 14.4 9.6 9.6\" />\n  <path d=\"M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z\" />\n  <path d=\"m21.5 21.5-1.4-1.4\" />\n  <path d=\"M3.9 3.9 2.5 2.5\" />\n  <path d=\"M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z\" />","chart-no-axes-column-increasing":"<line x1=\"12\" x2=\"12\" y1=\"20\" y2=\"10\" />\n  <line x1=\"18\" x2=\"18\" y1=\"20\" y2=\"4\" />\n  <line x1=\"6\" x2=\"6\" y1=\"20\" y2=\"16\" />","user-round":"<circle cx=\"12\" cy=\"8\" r=\"5\" />\n  <path d=\"M20 21a8 8 0 0 0-16 0\" />"};
const tabs=[['Home','house'],['Workouts','dumbbell'],['Progress','chart-no-axes-column-increasing'],['Profile','user-round']];
class FormNavigation extends HTMLElement{
connectedCallback(){if(this.firstChild)return;
this.innerHTML='<nav class="form-nav" aria-label="Main navigation"><span class="nav-indicator" aria-hidden="true"></span>'+tabs.map(([name,path],i)=>'<button class="form-tab" type="button" data-tab="'+name+'" aria-label="'+name+'" '+(i===0?'aria-current="page"':'')+'><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+iconPaths[path]+'</svg><span>'+name+'</span></button>').join('')+'</nav>';
const nav=this.querySelector('nav'),indicator=nav.querySelector('.nav-indicator'),buttons=[...nav.querySelectorAll('button')];let gesture=null,suppressClick=false;
const current=()=>buttons.find(b=>b.hasAttribute('aria-current'));
const position=(b)=>{if(!b)return;indicator.style.width=b.offsetWidth+'px';indicator.style.height=b.offsetHeight+'px';indicator.style.transform='translate('+b.offsetLeft+'px,'+b.offsetTop+'px)'};
const preview=b=>{buttons.forEach(x=>x.toggleAttribute('data-preview',x===b));position(b)};
const commit=b=>{const changed=b!==current();buttons.forEach(x=>{x.removeAttribute('aria-current');x.removeAttribute('data-preview')});b.setAttribute('aria-current','page');position(b);if(changed)this.dispatchEvent(new CustomEvent('form:navigate',{bubbles:true,detail:b.dataset.tab}))};
const begin=(x,y)=>{suppressClick=false;gesture={x,y,drag:false,target:current(),bounds:buttons.map(b=>{const r=b.getBoundingClientRect();return {b,center:r.left+r.width/2}})}};
const move=(x,y)=>{if(!gesture)return false;if(!gesture.drag){if(Math.abs(x-gesture.x)<5)return false;gesture.drag=true;nav.classList.add('scrubbing')}const target=gesture.bounds.reduce((a,b)=>Math.abs(b.center-x)<Math.abs(a.center-x)?b:a).b;gesture.target=target;preview(target);return true};
const finish=cancel=>{if(!gesture)return;const g=gesture;gesture=null;nav.classList.remove('scrubbing');if(g.drag){suppressClick=true;if(cancel){buttons.forEach(b=>b.removeAttribute('data-preview'));position(current())}else commit(g.target)}};
nav.addEventListener('touchstart',e=>{if(e.touches.length===1)begin(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});
nav.addEventListener('touchmove',e=>{if(e.touches.length===1&&move(e.touches[0].clientX,e.touches[0].clientY)&&e.cancelable)e.preventDefault()},{passive:false});
nav.addEventListener('touchend',e=>{if(gesture?.drag&&e.cancelable)e.preventDefault();finish(false)},{passive:false});
nav.addEventListener('touchcancel',()=>finish(true));
nav.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0)return;begin(e.clientX,e.clientY);e.target.setPointerCapture(e.pointerId)});
nav.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')move(e.clientX,e.clientY)});
nav.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')finish(false)});
nav.addEventListener('pointercancel',e=>{if(e.pointerType!=='touch')finish(true)});
nav.addEventListener('click',e=>{if(suppressClick&&e.detail!==0){suppressClick=false;return}const b=e.target.closest('button[data-tab]');if(b)commit(b)});
new ResizeObserver(()=>{if(!gesture?.drag)position(current())}).observe(nav);requestAnimationFrame(()=>position(current()));
}}
customElements.define('form-navigation',FormNavigation);document.addEventListener('form:navigate',e=>{if(e.detail==='Home'){renderHome();return}if(e.detail==='Workouts'){renderWorkouts();return}document.getElementById('screen').innerHTML='<h1 id="heading"></h1>';document.getElementById('heading').textContent=e.detail;renderAppearance(e.detail);});
const themes=[{id:'soft-spectrum',name:'Soft Spectrum',colors:['#F0F5FB','#FFFFFF','#075FCB']},{id:'graphite-lime',name:'Graphite Lime',colors:['#17171F','#393A42','#A8F900']},{id:'monochrome',name:'Monochrome',colors:['#000000','#212121','#FFFFFF']}];let current='soft-spectrum';try{current=localStorage.getItem('form.theme')||current}catch{}if(!themes.some(t=>t.id===current))current='soft-spectrum';function applyTheme(id){current=id;document.documentElement.dataset.theme=id;document.querySelector('meta[name="theme-color"]').content=id==='monochrome'?'#000000':id==='graphite-lime'?'#17171F':'#F0F5FB';try{localStorage.setItem('form.theme',id)}catch{}}applyTheme(current);function renderAppearance(page){document.querySelector('.appearance')?.remove();if(page!=='Profile')return;const section=document.createElement('section');section.className='appearance';section.innerHTML='<h2>Appearance</h2>'+themes.map(t=>'<button type="button" class="theme-option" data-theme-id="'+t.id+'" aria-pressed="'+(current===t.id)+'">'+t.name+'<span class="theme-swatches" aria-hidden="true">'+t.colors.map(c=>'<span style="background:'+c+'"></span>').join('')+'</span></button>').join('');section.addEventListener('click',e=>{const b=e.target.closest('[data-theme-id]');if(!b)return;applyTheme(b.dataset.themeId);renderAppearance('Profile')});document.getElementById('screen').append(section)}

renderHome();

mountGlobalTimer();
