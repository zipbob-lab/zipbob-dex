import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/supabase/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.from("TEST2_TABLE").select("*");

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(200).json(data);
}


