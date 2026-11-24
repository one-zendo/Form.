import {useState,useEffect} from 'react';
import {Navigation,tabs} from '../components/Navigation';
import {Home} from './Home';
type Theme='unified-apple'|'graphite-lime';
const themes:Theme[]=['unified-apple','graphite-lime'];
function initialTheme():Theme{try{return localStorage.getItem('form.theme')==='graphite-lime'?'graphite-lime':'unified-apple'}catch{return 'unified-apple'}}
export function App(){const [tab,setTab]=useState(0);const [theme,setTheme]=useState(initialTheme);const [active,setActive]=useState(false);
useEffect(()=>{document.documentElement.dataset.theme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',getComputedStyle(document.documentElement).getPropertyValue('--canvas').trim());try{localStorage.setItem('form.theme',theme)}catch{}},[theme]);
return <><div className="build">DEV · v0.1.0 (003)</div><main><header className="app-header"><div className="home-row"><div className="brand">FORM.</div><time>{new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',weekday:'short'}).format(new Date())}</time></div><p>Train with focus, follow your progress</p></header>{tab===0?<Home active={active} onStart={()=>setActive(true)}/>:<><h1>{tabs[tab].label}</h1><p>Coming soon.</p>{tab===3&&<section aria-label="Appearance"><h2>Appearance</h2>{themes.map((t,i)=><button className="theme" key={t} aria-pressed={theme===t} onClick={()=>setTheme(t)}>{['Unified Apple','Graphite Lime'][i]}</button>)}</section>}</>}</main><div className="dock-backdrop" aria-hidden="true"/><Navigation active={tab} onChange={setTab}/></>}
