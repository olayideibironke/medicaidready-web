import type { GetServerSideProps } from "next";
import { supabaseAdmin } from "../lib/supabaseAdmin";

const SITE_URL = "https://www.medicaidready.org";

type JobSitemapRow = {
  slug: string;
  updated_at: string | null;
  published_at: string | null;
  created_at: string | null;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function validDate(value: string | null | undefined): string {
  if (!value) return new Date().toISOString();

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function buildSitemap(rows: JobSitemapRow[]): string {
  const urls = rows
    .filter((row) => row.slug && row.slug.trim())
    .map((row) => {
      const loc = `${SITE_URL}/careers/jobs/${row.slug}`;
      const lastmod = validDate(row.updated_at ?? row.published_at ?? row.created_at);

      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
        "    <changefreq>daily</changefreq>",
        "    <priority>0.7</priority>",
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
  ].join("\n");
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let rows: JobSitemapRow[] = [];

  try {
    const sb = supabaseAdmin();
    const nowIso = new Date().toISOString();

    const { data, error } = await sb
      .from("careers_jobs")
      .select("slug,updated_at,published_at,created_at")
      .eq("status", "approved")
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      .order("updated_at", { ascending: false });

    if (error) {
      console.warn("[careers sitemap] query failed:", error.message);
    } else {
      rows = (data || []) as JobSitemapRow[];
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[careers sitemap] threw:", message);
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.write(buildSitemap(rows));
  res.end();

  return {
    props: {},
  };
};

export default function CareersJobsSitemap() {
  return null;
}