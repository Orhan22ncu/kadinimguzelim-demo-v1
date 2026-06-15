import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
const UA='Mozilla/5.0 (compatible; KadinimGuzelim-Demo-Builder/1.0)';
const get=async u=>{ try{ const r=await fetch(u,{headers:{'User-Agent':UA}}); return await r.text(); }catch(e){ return ''; } };
const low=s=>(s||'').toLocaleLowerCase('tr-TR');
const hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h;};
const OUT='/srv/nexus/palette/clients/kadinimguzelim/03_PROTOTYPE/demo-v1/feeds';
mkdirSync(OUT,{recursive:true});

const slugs=JSON.parse(readFileSync('/tmp/allslugs.json','utf8'));
const RULES={ 'Gecelik':s=>/gecelik/.test(s),'Pijama':s=>/pijama/.test(s),'Fantazi':s=>/fantazi|fantezi/.test(s),'Sütyen':s=>/sutyen|bralet|c-cup|brodeli/.test(s),'Body & Korse':s=>/korse|bustiyer|bustier|(^|-)body(-|$)/.test(s),'Büyük Beden':s=>/buyuk-beden/.test(s) };
const CATSLUG={'Gecelik':'gecelik','Sütyen':'sutyen','Fantazi':'fantazi','Pijama':'pijama','Body & Korse':'body-korse','Büyük Beden':'buyuk-beden'};
const cats=s=>Object.keys(RULES).filter(c=>RULES[c](low(s)));

const targets=slugs.map(s=>({slug:s,cs:cats(s)})).filter(x=>x.cs.length>0);
console.error('relevant products:', targets.length, '/', slugs.length);

function meta(h,p){ const m=h.match(new RegExp('<meta property="'+p+'" content="([^"]*)"')); return m?m[1].replace(/&amp;/g,'&'):null; }
function images(h){ const map=new Map(); for(const m of h.matchAll(/https:\/\/static\.ticimax\.cloud\/cdn-cgi\/image\/[^"' ]*?\/uploads\/urunresimleri\/[^"' ]+?\.(?:jpg|jpeg|png)/gi)){ let f=m[0].split('/uploads/')[1].replace('urunresimleri/','urunresimleri/buyuk/').replace('buyuk/buyuk/','buyuk/'); const b=f.split('/').pop(); if(!map.has(b))map.set(b,'https://static.ticimax.cloud/cdn-cgi/image/width=1200,quality=85/75855/uploads/'+f);} return [...map.values()].slice(0,4); }
function price(h){ const m=h.match(/satisFiyati["']?\s*:\s*([0-9]+(?:\.[0-9]+)?)/i); return m?Math.round(parseFloat(m[1])):null; }
function fabric(t){ const s=low(t),saten=/saten/.test(s),dantel=/dantel/.test(s),penye=/penye|viskon/.test(s),sifon=/şifon|sifon/.test(s),buyuk=/büyük beden|buyuk beden/.test(s); return {doku:penye?'Yumuşak Penye (Viskon)':saten?'Parlak Saten':sifon?'Saten + Şifon':'Yumuşak Dokuma',esneklik:penye?'Yüksek':'Orta',transparanlik:sifon?'Orta-Yüksek':dantel?'Orta':'Düşük',dantel:dantel?'Dantel Detaylı':'Yok',kalip:buyuk?'Geniş Büyük Beden':'Rahat Kalıp',icerik:penye?'Viskon karışım penye':saten?'%100 Polyester Saten':'Karışım kumaş'}; }
function callouts(t){ const s=low(t),o=[]; if(/dantel/.test(s))o.push('Dantel Detayı'); if(/saten/.test(s))o.push('Saten Doku'); if(/penye|viskon/.test(s))o.push('Yumuşak Penye'); if(/leopar/.test(s))o.push('Leopar Desen'); if(/v yaka|v-yaka/.test(s))o.push('V Yaka'); if(/askı|askili/.test(s))o.push('Ayarlanabilir Askı'); if(/büyük beden|buyuk beden/.test(s))o.push('Geniş Kalıp'); return [...new Set(o)].slice(0,4); }
function colors(t){ const s=low(t),c=[]; for(const [k,v] of [['leopar','Leopar'],['zebra','Zebra'],['siyah','Siyah'],['bordo','Bordo'],['ekru','Ekru'],['mor','Mor'],['kırmızı','Kırmızı'],['kirmizi','Kırmızı'],['lacivert','Lacivert'],['pembe','Pembe'],['mavi','Mavi'],['yeşil','Yeşil']]) if(s.includes(k)&&!c.includes(v))c.push(v); return c.length?c:['Standart']; }
function sizes(t){ return /büyük beden|buyuk beden/.test(low(t))?['2XL','3XL','4XL']:['S/M','L/XL','2XL/3XL']; }
function tags(t){ return low(t).replace(/[^a-zçğıöşü0-9 ]/g,'').split(/\s+/).filter(w=>w.length>2).slice(0,6); }

async function pool(items, n, fn){ const out=[]; let i=0; const workers=Array.from({length:n},async()=>{ while(i<items.length){ const idx=i++; out[idx]=await fn(items[idx]); if(idx%100===0) process.stderr.write(' '+idx+' '); } }); await Promise.all(workers); return out; }

const results=await pool(targets, 6, async ({slug,cs})=>{
  const html=await get('https://kadinimguzelim.com/'+slug);
  const title=(meta(html,'og:title')||'').split('|')[0].trim();
  const imgs=images(html); const pr=price(html);
  if(!title||imgs.length===0||!pr) return null;
  const h=hash(slug);
  return { id:slug, slug, url:'product.html?p='+slug, title, price:pr, category:cs[0], categories:cs, images:imgs, colors:colors(title), sizes:sizes(title), fabric:fabric(title), callouts:callouts(title), description:meta(html,'og:description')||title, seo:{title:title+' — KadınımGuzelim',description:meta(html,'og:description')||title}, tags:tags(title), rating:{value:+(4.6+(h%4)/10).toFixed(1),count:8+(h%34)} };
});
const products=results.filter(Boolean);
console.error('\nfetched OK:', products.length);

const meta_={ "$schema":"https://kadinimguzelim.com/schema/product-feed-v1", generator:"KadınımGuzelim AI Product Studio", generatedAt:new Date().toISOString().slice(0,10), brand:"KadınımGuzelim", currency:"TRY" };
const index={};
for(const [name,cslug] of Object.entries(CATSLUG)){
  const list=products.filter(p=>p.categories.includes(name));
  writeFileSync(OUT+'/'+cslug+'.json', JSON.stringify({...meta_, category:name, products:list},null,2)+'\n');
  console.error(cslug, list.length);
}
for(const p of products){ if(!index[p.slug]) index[p.slug]=CATSLUG[p.categories[0]]; }
writeFileSync(OUT+'/index.json', JSON.stringify(index)+'\n');
console.error('index entries:', Object.keys(index).length);
