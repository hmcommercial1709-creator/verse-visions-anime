export const VERSION = 1;
export const fresh = (name, island, flag = '☀', companion = 'fox') => ({version: VERSION, name: name.trim().slice(0,24) || 'القائد', island: island.trim().slice(0,30) || 'جزيرة الفجر', flag, companion, wood: 180, gold: 120, gems: 0, cannon: 1, harbor: 1, wave: 1, victories: 0, streak: 1, lastDay: new Date().toISOString().slice(0,10), upgrade: null});
export function restore(raw) {
  try {
    const p = JSON.parse(raw);
    if (p?.version !== VERSION || typeof p.name !== 'string' || typeof p.island !== 'string') return null;
    const s = fresh(p.name, p.island, ['☀','☽','⚡','✦'].includes(p.flag) ? p.flag : '☀', ['fox','hawk','spirit'].includes(p.companion) ? p.companion : 'fox');
    for (const [key,max] of Object.entries({wood:1000000,gold:1000000,gems:100000,cannon:20,harbor:20,wave:1000,victories:100000,streak:10000})) s[key] = Math.max(['cannon','harbor','wave','streak'].includes(key)?1:0, Math.min(max, Number.isFinite(p[key]) ? Math.floor(p[key]) : s[key]));
    if (typeof p.lastDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p.lastDay)) s.lastDay = p.lastDay;
    if (p.upgrade && ['cannon','harbor'].includes(p.upgrade.kind) && Number.isFinite(p.upgrade.end) && p.upgrade.end > 0) s.upgrade = {kind:p.upgrade.kind,end:Math.min(p.upgrade.end,Date.now()+600000)};
    return s;
  } catch { return null; }
}
export function cost(s, kind) { return {wood: 70*s[kind], gold:50*s[kind], seconds:Math.min(300,20*s[kind])}; }
export function beginUpgrade(s,kind,now=Date.now()) {
  if (!['cannon','harbor'].includes(kind) || s.upgrade || s[kind]>=20) return null;
  const c=cost(s,kind);
  if(s.wood<c.wood || s.gold<c.gold) return null;
  return {...s,wood:s.wood-c.wood,gold:s.gold-c.gold,upgrade:{kind,end:now+c.seconds*1000}};
}
export function finishUpgrade(s,now=Date.now(),rush=false) {
  if(!s.upgrade || (s.upgrade.end>now && (!rush || s.gems<5))) return null;
  return {...s,[s.upgrade.kind]:Math.min(20,s[s.upgrade.kind]+1),gems:s.gems-(s.upgrade.end>now && rush?5:0),upgrade:null};
}
export function victory(s, health) { return {...s,wave:Math.min(1000,s.wave+1),victories:s.victories+1,wood:s.wood+70+10*s.wave,gold:s.gold+50+10*s.wave,gems:s.gems+(health>=100?3:1)}; }
export function daily(s,now=new Date()) {
  const day=now.toISOString().slice(0,10); if(day<=s.lastDay) return s;
  const yesterday=new Date(now.getTime()-86400000).toISOString().slice(0,10);
  return {...s,lastDay:day,streak:s.lastDay===yesterday?s.streak+1:1,wood:s.wood+60,gold:s.gold+40};
}
export function seedRandom(seed) { let x=seed|0; return ()=>{x=(Math.imul(1664525,x)+1013904223)|0; return (x>>>0)/4294967296;}; }
export function challengeFrom(search) { const v=new URLSearchParams(search).get('challenge'); return v && /^\d{1,9}$/.test(v) ? Number(v) : null; }
