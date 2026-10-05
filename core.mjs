export const SERIES='148.3_INIVELNAL_DICI_M_26';
export const API=`https://apis.datos.gob.ar/series/api/series/?ids=${SERIES}&start_date=2026-01-01&limit=1000&format=json`;
export function month(s){if(typeof s!=='string'||!/^\d{4}-(0[1-9]|1[0-2])$/.test(s))throw Error('Invalid month');const [y,m]=s.split('-').map(Number);if(y<2016||y>2100)throw Error('Invalid year');return y*12+m-1}
export function shift(s,n){const a=month(s)+n;return `${Math.floor(a/12)}-${String(a%12+1).padStart(2,'0')}`}
export function parseAPI(j,now=new Date()){
 if(j?.meta?.[1]?.field?.id!==SERIES||j.meta[1].field.representation_mode!=='value'||!Array.isArray(j.data)||!j.data.length)throw Error('Wrong series or empty data');
 const limit=now.toISOString().slice(0,7), values={};
 for(const row of j.data){if(!Array.isArray(row)||!/^\d{4}-(0[1-9]|1[0-2])-01$/.test(row[0]))throw Error('Invalid date');const key=row[0].slice(0,7);month(key);if(Object.hasOwn(values,key))throw Error('Duplicate month');if(row[1]===null)continue;if(typeof row[1]!=='number'||!Number.isFinite(row[1])||row[1]<=0)throw Error('Invalid index');if(key<'2026-01'||key>=limit)continue;values[key]=row[1]}
 if(!Object.keys(values).length)throw Error('No usable data');return values;
}
export function numberInput(s){if(typeof s!=='string'||!/^[-+]?\d+(?:[.,]\d+)?$/.test(s.trim()))throw Error('Invalid number');const n=Number(s.trim().replace(',','.'));if(!Number.isFinite(n))throw Error('Invalid number');return n}
export function factorFor(q,values,overrides={}){
 const start=shift(q,-4),end=shift(q,-1),months=[shift(q,-3),shift(q,-2),end];
 const o=overrides[q];let factor=null,from=values[start],to=values[end],kind='official';
 if(o){kind='manual';if(o.mode==='indices'){from=o.start;to=o.end;if(!(from>0&&to>0&&Number.isFinite(from)&&Number.isFinite(to)))throw Error('Invalid manual indices');factor=to/from}else if(o.mode==='percent'&&Number.isFinite(o.percent)&&o.percent>-100){factor=1+o.percent/100;from=null;to=null}else throw Error('Invalid override')}
 else if(from>0&&to>0)factor=to/from;
 if(factor!==null&&(!Number.isFinite(factor)||factor<=0))throw Error('Invalid factor');
 return {q,start,end,months,from:from??null,to:to??null,factor,kind,note:o?.note||'',missing:[start,end].filter(k=>!(values[k]>0))};
}
export function calculate(target,values={},overrides={}){
 const distance=month(target)-month('2026-10');if(distance<0||distance%3!==0||distance>120)throw Error('Invalid quarter');
 const rows=[{q:'2026-10',previous:1000000,rent:1000000,increase:0,percent:0,kind:'base',manualChain:false}];let previous=1000000,manualChain=false;
 for(let i=3;i<=distance;i+=3){const q=shift('2026-10',i),r=factorFor(q,values,overrides);manualChain ||= r.kind==='manual';const rent=previous!==null&&r.factor!==null?Math.round((previous*r.factor+Number.EPSILON)*100)/100:null;if(rent!==null&&!Number.isFinite(rent))throw Error('Invalid rent');rows.push({...r,previous,rent,increase:rent!==null?Math.round((rent-previous)*100)/100:null,percent:r.factor!==null?(r.factor-1)*100:null,manualChain});previous=rent}
 return rows;
}
export function csv(rows){return '\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n')}
