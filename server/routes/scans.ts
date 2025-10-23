import type { RequestHandler } from "express";
import { supabaseAdmin } from "../lib/supabase";

export const listScans: RequestHandler = async (_req, res) => {
  if (!supabaseAdmin) return res.status(200).json({ items: [] });
  try {
    const { data, error } = await supabaseAdmin
      .from("scans")
      .select("id, content, meta, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) {
      // If table doesn't exist, return empty list gracefully
      if (
        (error as any)?.code === "42P01" ||
        /relation .* does not exist/i.test(error.message) ||
        /no table/i.test(error.message)
      ) {
        return res.status(200).json({ items: [] });
      }
      return res.status(500).json({ error: error.message });
    }
    res.json({ items: data ?? [] });
  } catch (e: any) {
    return res.status(200).json({ items: [] });
  }
};

export const createScan: RequestHandler = async (req, res) => {
  const { content, meta } = req.body as { content?: string; meta?: unknown };
  if (!content || !content.trim())
    return res.status(400).json({ error: "Missing content" });
  if (!supabaseAdmin)
    return res
      .status(202)
      .json({ saved: false, message: "Supabase not configured" });

  const { data, error } = await supabaseAdmin
    .from("scans")
    .insert([{ content, meta: meta ?? null }])
    .select("id, content, meta, created_at")
    .single();

  if (error) {
    if (
      (error as any)?.code === "42P01" ||
      /relation .* does not exist/i.test(error.message)
    ) {
      return res
        .status(202)
        .json({
          saved: false,
          message: "Table scans not found. Skipping persistence.",
          item: {
            content,
            meta: meta ?? null,
            created_at: new Date().toISOString(),
          },
        });
    }
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ saved: true, item: data });
};
