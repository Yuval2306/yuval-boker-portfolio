import { useMemo, useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Github,
  Linkedin,
  Users,
  ChevronDown,
  Search,
  Briefcase,
  Download
} from "lucide-react";
import { projects } from "./data/projects";
import { ProjectCard } from "./components/ProjectCard";

export default function App() {
  const [open, setOpen] = useState<null | "about-en" | "about-he" | "contact" | "resume" | "skills">(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const aboutEN = useMemo(() => 
    `Hi, I’m Yuval Boker, a Computer Science graduate from Tel-Hai Academic College and a software engineer who thrives at the intersection of complex algorithms and reliable system design.

My background is rooted in the Excellenteam Excellence Program, where I specialized in high-performance software engineering and presented end-to-end projects to senior engineers from Google and NVIDIA. Whether it’s Python, Node.js, or deep-diving into C++, I’m all about building scalable, production-grade solutions.

As a former Teaching Assistant in Probability and Statistics, I’ve mastered the art of breaking down complex problems and communicating them clearly. I’m now looking for my next challenge in a Full Stack or Backend development role where I can take ownership and grow with a great R&D team.

Fun fact: I'm a massive sports enthusiast (Tennis, Basketball, Gym). If your team needs someone to ship clean features and boost the company’s athletic stats, let’s talk!`,  []
  );

  const aboutHE = useMemo(() => 
        `היי, אני יובל בוקר – בוגר מדעי המחשב מתל-חי(כן, שרדתי את הצפון!) ומפתח Full Stack/Backend עם אהבה לקוד נקי ופתרון בעיות מורכבות.

הגעתי מעולם ה-Excellenteam, מה שאומר שעברתי בוטקאמפ אינטנסיבי שכלל פרויקטים מול מהנדסים מגוגל וצ'ק פוינט. אני נהנה לשלב בין לוגיקה אלגוריתמית חזקה לבין חשיבה מוצרית שמביאה ערך למשתמשים.

חוץ מזה? אני איש של אנשים (הייתי מתרגל בסטטיסטיקה, אז יש לי סבלנות של ברזל), סקרן ברמות וספורטאי בנשמה. אם אתם מחפשים מפתח שלא רק לומד מהר אלא גם מוכן לקחת אחריות על ה-Vibe בצוות, אני האיש שלכם.
אני מחפש את ההזדמנות הראשונה שלי להוכיח שג'וניור יכול להביא אימפקט משמעותי מהיום הראשון.`, []
  );

  const githubUrl = "https://github.com/Yuval2306";
  const linkedinUrl = "https://www.linkedin.com/in/yuval-boker-43792537b/";
  const email = "yuvalboker588@gmail.com";
  const phone = "+972-52-7968511";
  const whatsapp = "972527968511";
  const juniorGroupUrl = "https://chat.whatsapp.com/DW6pGHJxgPI5wmQr1NyCwW";

  const skills = useMemo(() => [
    "Python", "C++", "C", "Java", "TypeScript", "JavaScript", "SQL",
    "Android Studio", "React", "Next.js", "AngularJS", "HTML5/CSS3", "Tailwind CSS",
    "Node.js", "Flask", "REST APIs", "Express.js", "PostgreSQL", "MongoDB", "Microservices",
    "Algorithms", "Data Structures", "Memory Management", "Performance Optimization", 
    "Operating Systems", "Multithreading", "System Design",
    "Linux", "Docker", "Git & GitHub", "Bash Scripting", "Render/Vercel (Deployment)",
    "LLM APIs (Gemini/OpenAI)", "RAG (Retrieval-Augmented Generation)", 
    "Pandas", "NumPy", "Prompt Engineering",
    "Object-Oriented Programming (OOP)", "Clean Code", "Unit Testing", "Debugging", "Agile"
  ], []);

  const featured = useMemo(() => projects.filter((p) => p.featured), []);
  const more = useMemo(() => projects.filter((p) => !p.featured), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617] text-slate-200 font-sans">
      <TechBackground />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <header className="animate-fadeInDown rounded-[3rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-10 md:p-16 shadow-[0_0_80px_rgba(59,130,246,0.1)] hover:border-blue-500/20 transition-all duration-700">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-[2.6rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative h-44 w-44 md:h-52 md:w-52 rounded-[2.5rem] overflow-hidden border border-white/10 bg-slate-950">
                <img src="/me.jpeg" alt="Yuval Boker" className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent italic">
                YUVAL BOKER
              </h1>
              <p className="text-blue-200/80 mt-4 text-xl md:text-2xl font-medium tracking-wide">
                <span className="text-blue-400">Software Engineer</span> | Systems & Full Stack
              </p>

              <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
                <a href={githubUrl} target="_blank" rel="noreferrer" className="px-8 py-3 rounded-full bg-white text-slate-950 font-bold flex items-center gap-2 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
                  <Github size={20} /> GitHub
                </a>
                <a href={linkedinUrl} target="_blank" rel="noreferrer" className="px-8 py-3 rounded-full bg-blue-600/20 text-blue-100 border border-blue-500/40 font-bold flex items-center gap-2 hover:bg-blue-600/40 hover:scale-105 transition-all">
                  <Linkedin size={20} /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-16">
            <TopCard title="About" subtitle="EN" onClick={() => setOpen("about-en")} index={0} icon={<FileText size={18}/>} />
            <TopCard title="קצת עליי" subtitle="HE" onClick={() => setOpen("about-he")} index={1} icon={<MessageSquare size={18}/>} />
            <TopCard title="Experience" subtitle="My Journey" onClick={() => setOpen("resume")} index={2} icon={<Briefcase size={18}/>} />
            <TopCard title="Contact" subtitle="Reach out" onClick={() => setOpen("contact")} index={3} icon={<Mail size={18}/>} />
            <TopLinkCard title="Community" subtitle="Junior Devs" href={juniorGroupUrl} icon={<Users size={18} />} index={4} />
            <TopCard title="Skills" subtitle="Stack" onClick={() => setOpen("skills")} index={5} icon={<ChevronDown size={18} />} />
          </div>
        </header>

        <section className="mt-24 space-y-24">
          {/* Featured Projects */}
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-blue-500"></span> FEATURED PROJECTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
          </div>

          {/* Archive Projects */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-slate-400 flex items-center gap-4">
               <span className="h-px w-8 bg-slate-700"></span>
               ARCHIVE & EXPERIMENTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {more.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
          </div>
        </section>

        {open && (
          <Modal onClose={() => setOpen(null)}>
            {open === "about-en" && <div className="prose prose-invert"><h3 className="text-3xl font-bold mb-6 text-blue-400">About Me</h3><p className="whitespace-pre-line leading-relaxed text-slate-300 text-lg">{aboutEN}</p></div>}
            {open === "about-he" && <div className="prose prose-invert text-right" dir="rtl"><h3 className="text-3xl font-bold mb-6 text-blue-400">קצת עליי</h3><p className="whitespace-pre-line leading-relaxed text-slate-300 text-lg">{aboutHE}</p></div>}
            {open === "contact" && <ContactContent email={email} phone={phone} whatsapp={whatsapp} />}
            {open === "resume" && <ExperienceContent />}
            {open === "skills" && <SkillsSearch skills={skills} />}
          </Modal>
        )}

        <footer className="mt-32 pb-12 text-center text-slate-500 font-medium tracking-widest text-xs uppercase">
          &copy; {new Date().getFullYear()} Yuval Boker • Built for Scale
        </footer>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function ExperienceContent() {
  return (
    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h3 className="text-3xl font-bold text-blue-400">Professional Journey</h3>
          <p className="text-slate-400 text-sm mt-1">Full CV available for specific roles</p>
        </div>
        <a href="/Yuval_Boker_CV.pdf" download className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20">
          <Download size={18} /> Download PDF
        </a>
      </div>

      <div className="space-y-10">
        <div className="relative pl-8 border-l-2 border-blue-500/30">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <h4 className="text-xl font-bold text-white">Excellenteam Excellence Program</h4>
          <p className="text-blue-400 text-sm mb-2 font-mono italic">Startup Nation Central | Intensive Engineering</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Selected for an elite software engineering program. Focused on <strong>Advanced C++ & Python</strong>, System Design, and performance-aware development. 
            Presented end-to-end projects to senior engineers from <strong>Google, NVIDIA, and Check Point</strong>.
          </p>
        </div>

        <div className="relative pl-8 border-l-2 border-slate-700">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700" />
          <h4 className="text-xl font-bold text-white">Teaching Assistant</h4>
          <p className="text-slate-400 text-sm mb-2 font-mono">Tel-Hai Academic College | 2024 - 2025</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Guided students in <strong>Probability and Statistics</strong>. Focused on analytical problem-solving, debugging strategies, and simplifying complex mathematical concepts.
          </p>
        </div>

        <div className="relative pl-8 border-l-2 border-slate-700">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700" />
          <h4 className="text-xl font-bold text-white">Military Service - Commander</h4>
          <p className="text-slate-400 text-sm mb-2 font-mono">IDF, Magal Unit | 2018 - 2021</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Led and trained teams in high-pressure environments. Developed strong leadership, accountability, and operational coordination skills.
          </p>
        </div>
      </div>
    </div>
  );
}

function TopCard({ title, subtitle, onClick, icon, index }: any) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start p-5 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-lg hover:bg-blue-600/10 hover:border-blue-500/40 transition-all duration-500 text-left overflow-hidden"
      style={{ animation: `fadeInUp 0.5s ease-out ${0.2 + (index || 0) * 0.08}s both` }}
    >
      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="font-bold text-white group-hover:text-blue-200 transition-colors leading-tight">{title}</div>
      <div className="text-xs text-slate-500 group-hover:text-slate-300">{subtitle}</div>
    </button>
  );
}

function TopLinkCard({ title, subtitle, href, icon, index }: any) {
  return (
    <a
      href={href} target="_blank" rel="noreferrer"
      className="group relative flex flex-col items-start p-5 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-lg hover:bg-cyan-600/10 hover:border-cyan-500/40 transition-all duration-500 text-left overflow-hidden"
      style={{ animation: `fadeInUp 0.5s ease-out ${0.2 + (index || 0) * 0.08}s both` }}
    >
      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="font-bold text-white group-hover:text-cyan-200 transition-colors leading-tight">{title}</div>
      <div className="text-xs text-slate-500 group-hover:text-slate-300">{subtitle}</div>
    </a>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60" onMouseDown={onClose}>
      <div className="relative max-w-3xl w-full bg-[#0a0f1e] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-modalEnter" onMouseDown={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors text-2xl">✕</button>
        {children}
      </div>
    </div>
  );
}

function ContactContent({ email, phone, whatsapp }: any) {
  return (
    <div className="space-y-6 text-left">
      <h3 className="text-3xl font-bold text-blue-400">Let's Connect</h3>
      <div className="grid gap-4">
        {[
          { icon: <Mail />, label: email, href: `mailto:${email}` },
          { icon: <Phone />, label: phone, href: `tel:${phone}` },
          { icon: <MessageSquare />, label: "WhatsApp", href: `https://wa.me/${whatsapp}` }
        ].map((item, i) => (
          <a key={i} href={item.href} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all">
            <span className="text-blue-400">{item.icon}</span>
            <span className="font-medium text-lg">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function SkillsSearch({ skills }: { skills: string[] }) {
  const [q, setQ] = useState("");
  const filtered = skills.filter(s => s.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6 text-left">
      <h3 className="text-3xl font-bold text-cyan-400">Tech Stack</h3>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input 
          autoFocus
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500/50 transition-all text-lg"
          placeholder="Search for a skill (e.g. Python, Docker)..." 
          onChange={e => setQ(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
        {filtered.map(s => (
          <div key={s} className="p-3 rounded-xl bg-white/5 border border-white/5 text-sm font-medium hover:bg-white/10 transition-colors">{s}</div>
        ))}
      </div>
    </div>
  );
}

function TechBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#020617]">
      <div className="absolute top-[-10%] left-[-10%] h-[800px] w-[800px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `radial-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalEnter { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        
        .animate-fadeInDown { animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-modalEnter { animation: modalEnter 0.3s ease-out forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}