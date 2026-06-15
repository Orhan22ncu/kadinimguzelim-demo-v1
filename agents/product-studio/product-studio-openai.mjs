#!/usr/bin/env node
/**
 * AI Product Studio — OpenAI (ChatGPT) variant.
 *
 * Rewrites product copy (description, fabric card, callouts, SEO) with OpenAI
 * using vision + JSON structured output, reading/writing the per-category feeds.
 *
 * Setup:
 *   cd agents/product-studio && npm i openai
 *   export OPENAI_API_KEY=sk-...
 *   node product-studio-openai.mjs --cat gecelik --limit 20   # one category, 20 items
 *   node product-studio-openai.mjs --all                      # whole catalog (cost!)
 *
 * Only the text fields are rewritten; price/images/category are left untouched.
 * Review the diff before publishing — see README (human review gate).
 */
import OpenAI from "openai";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const FEEDS = join(dirname(fileURLToPath(import.meta.url)), "../../feeds");
const MODEL = "gpt-4o"; // vision-capable; swap for your preferred model
const client = new OpenAI(); // reads OPENAI_API_KEY

const args = process.argv.slice(2);
const getArg = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? (args[i + 1] || true) : d; };
const ALL = args.includes("--all");
const CATS = ALL ? ["gecelik", "sutyen", "fantazi", "pijama", "body-korse", "buyuk-beden"] : [getArg("cat", "gecelik")];
const LIMIT = parseInt(getArg("limit", "20"), 10);

const SYSTEM = `Sen KadınımGuzelim için ürün metni yazan bir editörsün. Marka: Türkiye merkezli,
büyük beden ağırlıklı kadın iç giyim & gecelik. Ton: premium, güven veren, abartısız, sıcak.
Görseldeki kumaş/dantel/dikiş/şeffaflık ipuçlarını DOĞRU yorumla; uydurma iddia yok.
Açıklama 2-3 cümle Türkçe. transparanlik: "Düşük"|"Orta"|"Orta-Yüksek"|"Yüksek".
callouts: görselde işaretlenebilecek 3-4 kısa somut detay.`;

const SCHEMA = {
  name: "product_content",
  schema: {
    type: "object", additionalProperties: false,
    properties: {
      description: { type: "string" },
      fabric: {
        type: "object", additionalProperties: false,
        properties: { doku: { type: "string" }, esneklik: { type: "string" }, transparanlik: { type: "string" }, dantel: { type: "string" }, kalip: { type: "string" }, icerik: { type: "string" } },
        required: ["doku", "esneklik", "transparanlik", "dantel", "kalip", "icerik"]
      },
      callouts: { type: "array", items: { type: "string" } },
      seo: { type: "object", additionalProperties: false, properties: { title: { type: "string" }, description: { type: "string" } }, required: ["title", "description"] }
    },
    required: ["description", "fabric", "callouts", "seo"]
  },
  strict: true
};

async function rewrite(p) {
  const res = await client.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_schema", json_schema: SCHEMA },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: [
        { type: "text", text: `Ürün: ${p.title}\nKategori: ${p.category}\nRenkler: ${(p.colors || []).join(", ")}\nBedenler: ${(p.sizes || []).join(", ")}\nBu ürün için içerik üret.` },
        { type: "image_url", image_url: { url: p.images[0] } }
      ] }
    ]
  });
  return JSON.parse(res.choices[0].message.content);
}

for (const cat of CATS) {
  const path = join(FEEDS, cat + ".json");
  const feed = JSON.parse(readFileSync(path, "utf8"));
  const slice = feed.products.slice(0, ALL ? feed.products.length : LIMIT);
  for (const p of slice) {
    try {
      const c = await rewrite(p);
      p.description = c.description; p.fabric = c.fabric; p.callouts = c.callouts; p.seo = c.seo;
      process.stderr.write(".");
    } catch (e) { process.stderr.write("x"); }
  }
  writeFileSync(path, JSON.stringify(feed, null, 2) + "\n");
  console.error(`\n${cat}: ${slice.length} ürün yeniden yazıldı`);
}
console.error("Bitti. feeds/search.json ve featured.json'u da yeniden üretmeyi unutmayın (catalog-pipeline ile).");
