import { useState } from "react";
import { Heart, MessageCircle, ExternalLink, BookOpen, Eye, ChevronDown } from "lucide-react";
import type { Project } from "../data/projects";
import { useProjectStats } from "../hooks/useProjectStats";
import { Tilt } from "./Tilt";

export function FeaturedShowcase({ project, index }: { project: Project; index: number }) {
  const { stats, comments, loading, like, openRepo, addComment } = useProjectStats(project.slug, project.repoUrl);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const flip = index % 2 === 1;

  async function onPost() {
    await addComment(commentText);
    setCommentText("");
  }

  return (
    <div className={`relative flex flex-col ${flip ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-14 items-center`}>
      {/* ghost number */}
      <div className={`hidden lg:block absolute -top-14 ${flip ? "right-0" : "left-0"} text-[9rem] font-black leading-none text-white/[0.04] select-none pointer-events-none`}>
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* image side */}
      <div className="w-full lg:w-[58%]">
        <Tilt className="group relative">
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-blue-600/50 via-cyan-400/30 to-blue-600/50 blur-lg opacity-30 group-hover:opacity-70 transition duration-700" />
          <button onClick={openRepo} className="relative block w-full rounded-[2rem] overflow-hidden border border-white/10 bg-slate-950 cursor-pointer text-left">
            <img
              src={project.image}
              alt={project.title}
              className="w-full aspect-[16/9] object-cover group-hover:scale-[1.04] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="absolute bottom-4 left-5 flex items-center gap-2 text-sm font-semibold text-white/0 group-hover:text-white/90 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <ExternalLink size={16} /> View Repository
            </div>
          </button>
        </Tilt>
      </div>

      {/* text side */}
      <div className="w-full lg:w-[42%] space-y-5">
        <h3 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
          {project.title}
        </h3>
        <p className="text-slate-300 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-200 border border-blue-500/20">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={openRepo}
            className="px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold inline-flex items-center gap-2 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 transition-all"
          >
            <ExternalLink size={16} /> Repo
          </button>
          <a
            href={project.readmeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-full bg-white/5 text-slate-100 border border-white/10 inline-flex items-center gap-2 hover:bg-white/10 hover:border-blue-500/30 transition-all"
          >
            <BookOpen size={16} /> README
          </a>
          <button
            disabled={loading}
            onClick={like}
            className="px-5 py-2.5 rounded-full bg-white/5 text-slate-100 border border-white/10 inline-flex items-center gap-2 hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-300 transition-all"
          >
            <Heart size={16} /> {stats.likes}
          </button>
          <span className="inline-flex items-center gap-1.5 text-slate-400 text-sm px-2">
            <Eye size={16} /> {stats.clicks}
          </span>
        </div>

        {/* comments */}
        <div className="pt-2">
          <button
            onClick={() => setShowComments((v) => !v)}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-300 transition-colors"
          >
            <MessageCircle size={15} />
            Comments ({comments.length})
            <ChevronDown size={14} className={`transition-transform duration-300 ${showComments ? "rotate-180" : ""}`} />
          </button>

          {showComments && (
            <div className="mt-3 space-y-3">
              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onPost()}
                  placeholder="Write a comment..."
                  className="flex-1 rounded-xl bg-slate-950/70 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blue-500/40 transition-colors"
                />
                <button
                  disabled={loading}
                  onClick={onPost}
                  className="px-4 py-2 rounded-xl bg-white text-slate-950 text-sm font-medium hover:scale-105 transition-transform"
                >
                  Post
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-auto pr-1 custom-scrollbar">
                {comments.map((c) => (
                  <div key={c.id} className="text-sm bg-slate-950/50 border border-white/10 rounded-xl p-3">
                    <div className="text-slate-200">{c.text}</div>
                    <div className="text-xs text-slate-500 mt-1">{new Date(c.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
