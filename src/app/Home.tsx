import {useState} from 'react';
import {Play,Flame,Check,CircleDot,ChevronRight,ChevronDown} from 'lucide-react';
import './home.css';
const sample={name:'Zendo',streak:4,days:[0],today:1};
export function Home({active,onStart}:{active:boolean;onStart:()=>void}){
 const [detail,setDetail]=useState(false);
 return <div className="home"><div className="home-row home-greeting"><h1>Hello, {sample.name}.</h1><small>Sample data</small></div>
 <div className="home-workspace"><section className="home-paper" aria-label="Today's workout"><span className="home-muted">{active?'In progress':"Today's workout"}</span><h2>Upper body</h2><p>6 exercises · 18 sets</p><button className="home-start" onClick={onStart}><Play size={17}/>{active?'Resume workout':'Start workout'}</button>{active&&<p role="status" className="home-demo">Demo session · Logging not yet available</p>}</section>
 <section className="home-streak" aria-label="Weekly training streak"><div className="home-streak-heading"><Flame size={36} aria-hidden="true"/><div><h2>{sample.streak} weeks</h2><span className="home-muted">Training streak</span></div></div><div className="home-days">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=><div key={d}><small>{d.slice(0,1)}</small><span className={sample.days.includes(i)?'done':i===sample.today?'today':''} aria-label={d+(sample.days.includes(i)?' completed':i===sample.today?' today':' not completed')}>{sample.days.includes(i)?<Check size={16}/>:i===sample.today?<CircleDot size={16}/>:null}</span></div>)}</div></section></div>
 <section className="home-last"><h2>Last workout</h2><button aria-expanded={detail} onClick={()=>setDetail(v=>!v)}><span><strong>Lower body</strong><small>Yesterday · 48 min</small></span>{detail?<ChevronDown size={20}/>:<ChevronRight size={20}/>}</button>{detail&&<p>7 exercises · 21 sets · 4,280 kg</p>}</section></div>
}
