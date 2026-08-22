import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type ProjectComment = { id: string; text: string; created_at: string };
export type ProjectStats = { likes: number; clicks: number };

export function useProjectStats(pid: string, repoUrl: string) {
  const [stats, setStats] = useState<ProjectStats>({ likes: 0, clicks: 0 });
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from("project_stats").select("likes,clicks").eq("project_id", pid).maybeSingle(),
      supabase.from("project_comments").select("id,text,created_at").eq("project_id", pid).order("created_at", { ascending: false }).limit(20),
    ]);

    setStats({
      likes: s?.likes ?? 0,
      clicks: s?.clicks ?? 0,
    });
    setComments(c ?? []);
  }, [pid]);

  useEffect(() => {
    void load();
  }, [load]);

  async function ensureRow() {
    await supabase.from("project_stats").upsert({ project_id: pid }, { onConflict: "project_id" });
  }

  async function like() {
    setLoading(true);
    try {
      await ensureRow();
      const { data } = await supabase.rpc("inc_like", { pid });
      setStats((prev) => ({ ...prev, likes: data ?? prev.likes + 1 }));
    } finally {
      setLoading(false);
    }
  }

  async function openRepo() {
    // increment clicks BEFORE opening
    await ensureRow();
    await supabase.rpc("inc_click", { pid });
    setStats((prev) => ({ ...prev, clicks: prev.clicks + 1 }));
    window.open(repoUrl, "_blank", "noopener,noreferrer");
  }

  async function addComment(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await supabase.from("project_comments").insert({ project_id: pid, text: trimmed });
      await load();
    } finally {
      setLoading(false);
    }
  }

  return { stats, comments, loading, like, openRepo, addComment };
}
