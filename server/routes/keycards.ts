import type { RequestHandler } from "express";
import { supabaseAdmin } from "../lib/supabase";

export const getKeycardByUniqueId: RequestHandler = async (req, res) => {
  const unique = (req.params["unique_id"] || req.query["unique_id"]) as string | undefined;
  if (!unique || !unique.trim()) return res.status(400).json({ error: "unique_id is required" });
  if (!supabaseAdmin) return res.status(200).json({ found: false });

  try {
    const { data, error } = await supabaseAdmin
      .from("keycards")
      .select("*")
      .eq("unique_id", unique)
      .maybeSingle();

    if (error) {
      if ((error as any)?.code === "42P01" || /relation .* does not exist/i.test(error.message) || /no table/i.test(error.message)) {
        return res.status(200).json({ found: false });
      }
      return res.status(500).json({ error: error.message });
    }

    if (!data) return res.status(200).json({ found: false });
    return res.json({ found: true, item: data });
  } catch (e: any) {
    return res.status(200).json({ found: false });
  }
};
