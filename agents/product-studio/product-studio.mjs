#!/usr/bin/env node
/**
 * AI Product Studio — KadınımGuzelim content agent.
 *
 * Given each product's identity + primary image, generates premium Turkish copy
 * (description, fabric card, callouts, SEO, tags) with Claude Opus 4.8 using
 * high-resolution vision + structured outputs, and writes ../../products.json.
 *
 * Run:  ANTHROPIC_API_KEY=... node product-studio.mjs
 */
import Anthropic from "@anthropic-ai/sdk";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY (or `ant auth login` profile)
const MODEL = "claude-opus-4-8";

// Stable brand voice + taxonomy → cached prefix (reused across every product).
const SYSTEM = [
  {
    type: "text",
    text: `Sen KadınımGuzelim için ürün içeriği yazan bir editörsün. Marka: Türkiye merkezli,
büyük beden ağırlıklı kadın iç giyim & gecelik. Ton: premium, güven veren, abartısız, sıcak.
Kurallar:
- Görseldeki kumaş/dantel/dikiş/şeffaflık ipuçlarını DOĞRU yorumla; uydurma iddia yok.
- Açıklama 2-3 cümle, Türkçe, satış odaklı ama dürüst.
- transparanlik alanı: "Düşük" | "Orta" | "Orta-Yüksek" | "Yüksek".
- callouts: görselde işaretlenebilecek 3-4 kısa somut detay (ör. "Fransız Dantel").
- Bu kategoride güven = kumaş/dikiş/şeffaflık netliği. Buna göre yaz.`,
    cache_control: { type: "ephemeral" },
  },
];

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    fabric: {
      type: "object",
      additionalProperties: false,
      properties: {
        doku: { type: "string" },
        esneklik: { type: "string" },
        transparanlik: { type: "string" },
        dantel: { type: "string" },
        kalip: { type: "string" },
        icerik: { type: "string" },
      },
      required: ["doku", "esneklik", "transparanlik", "dantel", "kalip", "icerik"],
    },
    callouts: { type: "array", items: { type: "string" } },
    seo: {
      type: "object",
      additionalProperties: false,
      properties: { title: { type: "string" }, description: { type: "string" } },
      required: ["title", "description"],
    },
    tags: { type: "array", items: { type: "string" } },
  },
  required: ["title", "description", "fabric", "callouts", "seo", "tags"],
};

// Product identities (seed). Scale this list from the sitemap for the full catalog.
const SEEDS = [
  {
    id: "bordo-saten-gecelik",
    slug: "bordo-saten-gecelik-sabahlik-takimi",
    titleSeed: "Bordo Saten Gecelik Sabahlık Takımı",
    price: 549,
    category: "Gecelik",
    colors: ["Bordo", "Siyah", "Ekru"],
    sizes: ["S/M", "L/XL", "2XL/3XL"],
    images: [
      "https://static.ticimax.cloud/cdn-cgi/image/width=1200,quality=85/75855/uploads/urunresimleri/buyuk/bordo-saten-gecelik-sabahlik-takim-1-4df4.jpg",
    ],
  },
  // ... additional seeds (see products.json for the current set)
];

async function generate(seed) {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    thinking: { type: "adaptive" },
    system: SYSTEM,
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "url", url: seed.images[0] } },
          {
            type: "text",
            text:
              `Ürün adı (taslak): ${seed.titleSeed}\nKategori: ${seed.category}\n` +
              `Renkler: ${seed.colors.join(", ")}\nBedenler: ${seed.sizes.join(", ")}\n` +
              `Bu ürün için içerik üret.`,
          },
        ],
      },
    ],
  });
  const text = res.content.find((b) => b.type === "text")?.text ?? "{}";
  return JSON.parse(text);
}

async function main() {
  const products = [];
  for (const seed of SEEDS) {
    const c = await generate(seed);
    products.push({
      id: seed.id,
      slug: seed.slug,
      url: "product.html",
      title: c.title,
      price: seed.price,
      category: seed.category,
      images: seed.images,
      colors: seed.colors,
      sizes: seed.sizes,
      fabric: c.fabric,
      callouts: c.callouts,
      description: c.description,
      seo: c.seo,
      tags: c.tags,
      rating: { value: 4.8, count: 0 },
    });
    console.log(`✓ ${seed.id}`);
  }
  const out = {
    $schema: "https://kadinimguzelim.com/schema/product-feed-v1",
    generator: "KadınımGuzelim AI Product Studio (Claude Opus 4.8)",
    generatedAt: new Date().toISOString().slice(0, 10),
    brand: "KadınımGuzelim",
    currency: "TRY",
    products,
  };
  const dest = join(dirname(fileURLToPath(import.meta.url)), "../../products.json");
  await writeFile(dest, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`Wrote ${products.length} products → ${dest}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
