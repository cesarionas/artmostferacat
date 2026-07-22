import type { MetadataRoute } from "next";
import { createClient } from "@/supabase/server";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; const supabase = await createClient(); const { data } = await supabase.from("people").select("slug,updated_at").eq("status", "published"); return [{ url: base, lastModified: new Date() }, ...(data ?? []).map(p => ({ url: `${base}/pessoas/${p.slug}`, lastModified: p.updated_at }))]; }
