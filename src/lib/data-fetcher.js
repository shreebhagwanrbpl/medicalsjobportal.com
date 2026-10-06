const parseResponse = async (response) => {
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok || body?.ok === false) {
    const message = typeof body === "string" ? body : JSON.stringify(body);
    throw new Error(`API ${response.status}: ${message}`);
  }
  return body;
};

const get = (url) => fetch(url, { cache: "no-store", headers: { Accept: "application/json" } }).then(parseResponse);

const clientCache = new Map();
const CLIENT_CACHE_TTL_MS = 60 * 1000;

export async function fetchDocCached(path, forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && clientCache.has(path)) {
    const entry = clientCache.get(path);
    if (now - entry.timestamp < CLIENT_CACHE_TTL_MS) {
      return entry.data;
    }
  }

  try {
    const data = await get(`/api/site-data?path=${encodeURIComponent(path)}`);
    clientCache.set(path, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`[data-fetcher] ${path}`, error);
    return null;
  }
}

let catalogPromise = null;
let lastCatalogFetchTime = 0;

export async function fetchFullCatalog(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && catalogPromise && now - lastCatalogFetchTime < CLIENT_CACHE_TTL_MS) {
    return catalogPromise;
  }

  catalogPromise = (async () => {
    try {
      const body = await get("/api/catalog");
      const products = body?.products ?? body?.data?.products ?? body?.data ?? body;
      lastCatalogFetchTime = Date.now();
      return Array.isArray(products) ? products : [];
    } catch (error) {
      console.error("[data-fetcher] catalog", error);
      return [];
    }
  })();

  return catalogPromise;
}

export async function fetchProductBySlug(slug) {
  if (!slug) return null;
  const products = await fetchFullCatalog();
  return products.find((p) => p.slug === slug || p.productSlug === slug) || null;
}

import { parseContactDetails } from "./constants";

export const fetchHomeData = () => fetchDocCached("__website__/pages/home");
export const fetchContactData = () => fetchDocCached("__website__/pages/contact");
export const fetchServicesData = () => fetchDocCached("__website__/pages/services");
export const fetchDistrictData = (district) => fetchDocCached(`__website__/districts/${encodeURIComponent(district || "")}`);

export async function fetchContactDetails(districtData = null) {
  try {
    const raw = await fetchContactData();
    return parseContactDetails(raw, districtData);
  } catch (error) {
    console.error("[data-fetcher] contact details error:", error);
    return parseContactDetails(null, districtData);
  }
}

export async function fetchAllDistricts() {
  try { return await get("/api/site-data?districts=1"); }
  catch (error) { console.error("[data-fetcher] districts", error); return []; }
}

export const fetchActiveDistricts = fetchAllDistricts;

export function subscribeToCatalog(onUpdate, intervalMs = 30000) {
  let active = true;
  let lastSignature = "";

  const emit = async () => {
    try {
      const products = await fetchFullCatalog();
      if (!active) return;
      const signature = JSON.stringify(products.map((p) => [p.id, p.slug, p.updatedAt, p.updated_at]));
      if (signature !== lastSignature) {
        lastSignature = signature;
        onUpdate(products);
      }
    } catch (error) {
      console.error("[data-fetcher] catalog polling", error);
    }
  };

  emit();
  const timer = setInterval(emit, intervalMs);
  return () => { active = false; clearInterval(timer); };
}
