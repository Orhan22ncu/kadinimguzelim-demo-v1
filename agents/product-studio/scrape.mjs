const UA = 'Mozilla/5.0 (compatible; KadinimGuzelim-Demo-Builder/1.0)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url){ const r = await fetch(url, { headers:{'User-Agent':UA} }); return await r.text(); }

const sm = await get('https://kadinimguzelim.com/sitemap/products/0.xml');
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]).slice(0, 34);

function meta(html, prop){ const m = html.match(new RegExp('<meta property="'+prop+'" content="([^"]*)"')); return m ? m[1].replace(/&amp;/g,'&') : null; }
function images(html){
  // Prefer the high-res /urunresimleri/buyuk/ variant; dedupe by filename so a
  // small thumbnail and the large of the same image collapse to the large one.
  const map = new Map();
  for (const m of html.matchAll(/https:\/\/static\.ticimax\.cloud\/cdn-cgi\/image\/[^"' ]*?\/uploads\/urunresimleri\/[^"' ]+?\.(?:jpg|jpeg|png)/gi)){
    let file = m[0].split('/uploads/')[1]
      .replace('urunresimleri/', 'urunresimleri/buyuk/')
      .replace('buyuk/buyuk/', 'buyuk/');
    const base = file.split('/').pop();
    if (!map.has(base)) map.set(base, 'https://static.ticimax.cloud/cdn-cgi/image/width=1200,quality=85/75855/uploads/' + file);
  }
  return [...map.values()].slice(0, 4);
}
function price(html){ const m = html.match(/satisFiyati["']?\s*:\s*([0-9]+(?:\.[0-9]+)?)/i); return m ? Math.round(parseFloat(m[1])) : null; }

const out = [];
for (const url of urls){
  try {
    const html = await get(url);
    const ogt = meta(html,'og:title') || '';
    const title = ogt.split('|')[0].trim();
    const imgs = images(html);
    if (!title || imgs.length===0) { console.error('skip', url); continue; }
    out.push({
      slug: url.split('/').pop(),
      title,
      description: meta(html,'og:description') || '',
      images: imgs,
      price: price(html),
    });
    process.stderr.write('.');
    await sleep(250);
    if (out.length>=24) break;
  } catch(e){ console.error('err', url, e.message); }
}
console.log(JSON.stringify(out, null, 2));
