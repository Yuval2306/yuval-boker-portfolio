import { useEffect, useMemo, useState } from "react";
import { Heart, MessageCircle, ExternalLink, BookOpen, Eye } from "lucide-react";
import type { Project } from "../data/projects";
import { supabase } from "../lib/supabase";

type Stats = { likes: number; clicks: number };

export function ProjectCard({ project }: { project: Project }) {
  const [stats, setStats] = useState<Stats>({ likes: 0, clicks: 0 });
  const [comments, setComments] = useState<Array<{ id: string; text: string; created_at: string }>>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const pid = useMemo(() => project.slug, [project.slug]);

  async function load() {
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from("project_stats").select("likes,clicks").eq("project_id", pid).maybeSingle(),
      supabase.from("project_comments").select("id,text,created_at").eq("project_id", pid).order("created_at", { ascending: false }).limit(20),
    ]);

    setStats({
      likes: s?.likes ?? 0,
      clicks: s?.clicks ?? 0,
    });
    setComments(c ?? []);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);

  async function ensureRow() {
    await supabase.from("project_stats").upsert({ project_id: pid }, { onConflict: "project_id" });
  }

  async function onLike() {
    setLoading(true);
    try {
      await ensureRow();
      const { data } = await supabase.rpc("inc_like", { pid });
      setStats((prev) => ({ ...prev, likes: data ?? prev.likes + 1 }));
    } finally {
      setLoading(false);
    }
  }

  async function onRepoClick() {
    // increment clicks BEFORE opening
    await ensureRow();
    await supabase.rpc("inc_click", { pid });
    setStats((prev) => ({ ...prev, clicks: prev.clicks + 1 }));
    window.open(project.repoUrl, "_blank", "noopener,noreferrer");
  }

  async function onReadmeClick() {
    window.open(project.readmeUrl, "_blank", "noopener,noreferrer");
  }

  async function addComment() {
    const text = commentText.trim();
    if (!text) return;
    setLoading(true);
    try {
      await supabase.from("project_comments").insert({ project_id: pid, text });
      setCommentText("");
      await load();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden shadow-lg">
      <div className="aspect-[16/9] bg-zinc-900">
        <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <p className="text-sm text-zinc-300 mt-1">{project.description}</p>
          </div>
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <Eye size={16} />
            <span>{stats.clicks}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onRepoClick}
            className="px-3 py-2 rounded-xl bg-zinc-100 text-zinc-900 font-medium inline-flex items-center gap-2"
          >
            <ExternalLink size={16} /> Repo
          </button>

          <button
            onClick={onReadmeClick}
            className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-100 border border-zinc-700 inline-flex items-center gap-2"
          >
            <BookOpen size={16} /> README
          </button>

          <button
            disabled={loading}
            onClick={onLike}
            className="ml-auto px-3 py-2 rounded-xl bg-zinc-800 text-zinc-100 border border-zinc-700 inline-flex items-center gap-2"
          >
            <Heart size={16} /> {stats.likes}
          </button>
        </div>

        <div className="pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-200 mb-2">
            <MessageCircle size={16} />
            <span className="text-sm font-medium">Comments</span>
          </div>

          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm outline-none"
            />
            <button
              disabled={loading}
              onClick={addComment}
              className="px-3 py-2 rounded-xl bg-zinc-100 text-zinc-900 font-medium"
            >
              Post
            </button>
          </div>

          <div className="mt-3 space-y-2 max-h-40 overflow-auto pr-1">
            {comments.map((c) => (
              <div key={c.id} className="text-sm bg-zinc-950/50 border border-zinc-800 rounded-xl p-3">
                <div className="text-zinc-200">{c.text}</div>
                <div className="text-xs text-zinc-500 mt-1">{new Date(c.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
