import { useMemo, useState, useEffect, useRef, lazy, Suspense } from "react";
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
  ArrowDown
} from "lucide-react";
import { projects } from "./data/projects";
import { ProjectCard } from "./components/ProjectCard";
import { Reveal } from "./components/Reveal";
import { Typewriter } from "./components/Typewriter";
import { FeaturedShowcase } from "./components/FeaturedShowcase";
import { ScrollProgress } from "./components/ScrollProgress";
import { ParticleName } from "./components/ParticleName";
import { Terminal } from "./components/Terminal";
import { Magnetic } from "./components/Magnetic";
import { CursorGlow } from "./components/CursorGlow";
import { Lanyard } from "./components/Lanyard";
import { LiveCursors } from "./components/LiveCursors";
import { HoopsGame } from "./components/HoopsGame";
import { WelcomeGreeting } from "./components/WelcomeGreeting";
import { getCompanyFromUrl } from "./lib/company";

const Hero3D = lazy(() => import("./components/Hero3D"));

export default function App() {
  const [open, setOpen] = useState<null | "about-en" | "about-he" | "contact" | "resume" | "skills">(null);
  const [hoopsOpen, setHoopsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const company = useMemo(getCompanyFromUrl, []);

  useEffect(() => {
    setMounted(true);
    const openHoops = () => setHoopsOpen(true);
    window.addEventListener("open-hoops", openHoops);
    return () => window.removeEventListener("open-hoops", openHoops);
  }, []);

  const aboutEN = useMemo(() =>
    `Hi, I’m Yuval Boker — a Software Engineer at Onezero, working full-stack across web and mobile products: building new systems, maintaining production applications, integrating AI capabilities, and working directly with clients to turn requirements into working software.

My foundation is a B.Sc. in Computer Science from Tel-Hai and the Excellenteam excellence program at Startup Nation Central, where I developed systems in Python and C++ on Linux and presented end-to-end projects to engineers from Google, NVIDIA, and Check Point.

My experience spans both systems and product development — from a user-space file system in C++ and Linux container isolation, to real-time computer vision and full-stack platforms built with React, Node.js, TypeScript, databases, and LLM integrations. I’m especially drawn to complex technical problems at the intersection of software engineering, AI, security, and infrastructure.

Before software, I served as a Recruits Commander in the IDF and worked as a Teaching Assistant at Tel-Hai — so leading people and explaining complex ideas clearly comes with the package.

Fun fact: I'm a massive sports enthusiast (Tennis, Basketball, Gym). If you want to talk shop — or hoops — let’s connect!`,  []
  );

  const aboutHE = useMemo(() =>
        `היי, אני יובל בוקר – מהנדס תוכנה ב-Onezero. עובד פול-סטאק על מוצרי ווב ומובייל: בונה מערכות חדשות, מתחזק אפליקציות בפרודקשן, משלב יכולות AI ועובד ישירות מול לקוחות כדי להפוך דרישות לתוכנה עובדת.

בוגר מדעי המחשב מתל-חי (כן, שרדתי את הצפון!) ותוכנית המצוינות Excellenteam של Startup Nation Central, שם פיתחתי מערכות ב-Python ו-C++ על לינוקס והצגתי פרויקטים מול מהנדסים מגוגל, NVIDIA וצ'ק פוינט.

חוץ מזה? אני איש של אנשים (הייתי מפקד טירונים בצבא ומתרגל בתל-חי, אז יש לי סבלנות של ברזל), סקרן ברמות וספורטאי בנשמה. הכי מעניין אותי החיבור בין הנדסת תוכנה, AI, אבטחה ותשתיות – ותמיד שמח לדבר על בעיות טכניות מורכבות (או על כדורסל).`, []
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
    "Linux", "Docker", "AWS", "Git & GitHub", "Bash Scripting", "Render/Vercel (Deployment)",
    "LLM APIs (Gemini/OpenAI)", "RAG (Retrieval-Augmented Generation)", "AI Agents & Workflows",
    "Pandas", "NumPy", "Prompt Engineering",
    "Object-Oriented Programming (OOP)", "Clean Code", "Unit Testing", "Debugging", "Agile"
  ], []);

  const featured = useMemo(() => projects.filter((p) => p.featured), []);
  const more = useMemo(() => projects.filter((p) => !p.featured), []);

  if (!mounted) return null;

  const scrollToContent = () => {
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative bg-[#020617] text-slate-200 font-sans">
      <ScrollProgress />
      <CursorGlow />
      <LiveCursors />
      <Lanyard />
      <WelcomeGreeting />
      <TechBackground />

      {/* theme-scope: everything inside flips colors in day mode */}
      <div className="theme-scope">

      {/* ===== 3D HERO ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <Hero3D />
          </Suspense>
        </div>

        {/* readability vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0.55)_0%,rgba(2,6,23,0.15)_45%,rgba(2,6,23,0.7)_100%)]" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-[#020617] pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center w-full">
            <div data-fall className="relative group" style={{ animation: "fadeInDown 1s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-400 to-blue-600 blur-md opacity-60 group-hover:opacity-90 transition duration-700 animate-spin-slow" />
              <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-2 border-white/20 bg-slate-950 shadow-[0_0_60px_rgba(59,130,246,0.35)]">
                <img src="/me.jpeg" alt="Yuval Boker" className="h-full w-full object-cover object-top" />
              </div>
            </div>

            <p data-fall className="mt-8 text-blue-200/90 text-xl md:text-2xl font-medium" style={{ animation: "fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 0.45s both" }}>
              {company ? `👋 Hey ${company} team, I'm` : "👋 Hey, I'm"}
            </p>

            <div data-fall className="mt-2 w-full" style={{ animation: "fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 0.6s both" }}>
              <ParticleName text="YUVAL BOKER" />
            </div>

            <div data-fall className="mt-6 text-xl md:text-3xl font-medium text-slate-300 h-10 md:h-12" style={{ animation: "fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}>
              <span className="text-blue-400 font-bold">
                <Typewriter words={["Software Engineer", "Full Stack & Backend", "Product Manager", "AI Integrations", "Systems Enthusiast", "C++ / Python / Node.js"]} />
              </span>
            </div>

            <div data-fall className="flex flex-wrap gap-4 mt-10 justify-center" style={{ animation: "fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 1s both" }}>
              <Magnetic>
                <a href={githubUrl} target="_blank" rel="noreferrer" className="px-8 py-3 rounded-full bg-white text-slate-950 font-bold flex items-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] transition-shadow">
                  <Github size={20} /> GitHub
                </a>
              </Magnetic>
              <Magnetic>
                <a href={linkedinUrl} target="_blank" rel="noreferrer" className="px-8 py-3 rounded-full bg-blue-600/20 text-blue-100 border border-blue-500/40 font-bold flex items-center gap-2 hover:bg-blue-600/40 backdrop-blur transition-colors">
                  <Linkedin size={20} /> LinkedIn
                </a>
              </Magnetic>
              <Magnetic>
                <button onClick={scrollToContent} className="px-8 py-3 rounded-full bg-cyan-500/10 text-cyan-200 border border-cyan-400/30 font-bold flex items-center gap-2 hover:bg-cyan-500/25 backdrop-blur transition-colors">
                  <ArrowDown size={20} /> Explore
                </button>
              </Magnetic>
            </div>
          </div>
        </div>

        <button onClick={scrollToContent} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-slate-400 hover:text-white transition-colors animate-bounce-slow" aria-label="Scroll down">
          <ChevronDown size={32} />
        </button>
      </section>

      {/* ===== CONTENT ===== */}
      <div id="explore" className="max-w-6xl mx-auto px-6 pb-12 relative z-10 scroll-mt-8">
        <Reveal>
          <header className="mt-16 rounded-[3rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 shadow-[0_0_80px_rgba(59,130,246,0.1)] hover:border-blue-500/20 transition-all duration-700">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <TopCard title="About" subtitle="EN" onClick={() => setOpen("about-en")} index={0} icon={<FileText size={18}/>} />
              <TopCard title="קצת עליי" subtitle="HE" onClick={() => setOpen("about-he")} index={1} icon={<MessageSquare size={18}/>} />
              <TopCard title="Experience" subtitle="My Journey" onClick={() => setOpen("resume")} index={2} icon={<Briefcase size={18}/>} />
              <TopCard title="Contact" subtitle="Reach out" onClick={() => setOpen("contact")} index={3} icon={<Mail size={18}/>} />
              <TopLinkCard title="Community" subtitle="Junior Devs" href={juniorGroupUrl} icon={<Users size={18} />} index={4} />
              <TopCard title="Skills" subtitle="Stack" onClick={() => setOpen("skills")} index={5} icon={<ChevronDown size={18} />} />
            </div>
          </header>
        </Reveal>

        {/* Stats strip */}
        <Reveal delay={0.1}>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={17} suffix="+" label="Projects Built" />
            <StatCard value={40} suffix="+" label="Technologies" />
            <StatCard value={7} suffix="" label="Programming Languages" />
            <StatCard custom="∞" label="Drive & Curiosity" />
          </div>
        </Reveal>

        {/* Skills marquee */}
        <Reveal delay={0.15}>
          <SkillsMarquee skills={skills} />
        </Reveal>

        {/* Interactive terminal */}
        <Reveal delay={0.1}>
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-emerald-500"></span>
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent font-mono">$ talk_to_me --terminal</span>
            </h2>
            <Terminal />
          </div>
        </Reveal>

        <section className="mt-24 space-y-24">
          {/* Featured Projects */}
          <div>
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8 flex items-center gap-4">
                <span className="h-px w-12 bg-gradient-to-r from-blue-500 to-cyan-400"></span>
                <span className="bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">FEATURED PROJECTS</span>
              </h2>
            </Reveal>
            <div className="space-y-24 lg:space-y-32 mt-16">
              {featured.map((p, i) => (
                <Reveal key={p.slug}>
                  <FeaturedShowcase project={p} index={i} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Archive Projects */}
          <div>
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 flex items-center gap-4">
                 <span className="h-px w-8 bg-slate-600"></span>
                 <span className="bg-gradient-to-r from-slate-300 to-slate-500 bg-clip-text text-transparent">ARCHIVE & EXPERIMENTS</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {more.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 0.1}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <footer data-fall className="mt-32 pb-12 text-center space-y-3">
          <div className="flex justify-center gap-4">
            <a href={githubUrl} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/40 hover:bg-blue-600/10 transition-all"><Github size={18} /></a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/40 hover:bg-blue-600/10 transition-all"><Linkedin size={18} /></a>
            <a href={`mailto:${email}`} className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/40 hover:bg-blue-600/10 transition-all"><Mail size={18} /></a>
          </div>
          <div className="text-slate-500 font-medium tracking-widest text-xs uppercase">
            &copy; {new Date().getFullYear()} Yuval Boker • Built for Scale
          </div>
          <div className="text-slate-600 text-[11px] tracking-wide">
            React • TypeScript • Three.js • Tailwind • Supabase
          </div>
        </footer>
      </div>

      </div>{/* /theme-scope */}

      {/* floating basketball button */}
      <button
        onClick={() => setHoopsOpen(true)}
        className="fixed bottom-6 right-6 z-[90] text-6xl leading-none drop-shadow-[0_0_18px_rgba(249,115,22,0.5)] hover:scale-110 hover:rotate-[25deg] hover:drop-shadow-[0_0_28px_rgba(249,115,22,0.8)] transition-all animate-bounce-gentle"
        title="Shoot some hoops"
        aria-label="Play basketball mini game"
      >
        🏀
      </button>

      {hoopsOpen && <HoopsGame onClose={() => setHoopsOpen(false)} />}

      {open && (
        <Modal onClose={() => setOpen(null)}>
          {open === "about-en" && <div className="prose prose-invert"><h3 className="text-3xl font-bold mb-6 text-blue-400">About Me</h3><p className="whitespace-pre-line leading-relaxed text-slate-300 text-lg">{aboutEN}</p></div>}
          {open === "about-he" && <div className="prose prose-invert text-right" dir="rtl"><h3 className="text-3xl font-bold mb-6 text-blue-400">קצת עליי</h3><p className="whitespace-pre-line leading-relaxed text-slate-300 text-lg">{aboutHE}</p></div>}
          {open === "contact" && <ContactContent email={email} phone={phone} whatsapp={whatsapp} />}
          {open === "resume" && <ExperienceContent />}
          {open === "skills" && <SkillsSearch skills={skills} />}
        </Modal>
      )}
    </div>
  );
}

// --- Sub-Components ---

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const t0 = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

function StatCard({ value, suffix, custom, label }: { value?: number; suffix?: string; custom?: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 text-center hover:border-blue-500/30 hover:bg-blue-600/5 transition-all duration-500">
      <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
        {custom ?? <CountUp target={value!} suffix={suffix} />}
      </div>
      <div className="mt-2 text-xs md:text-sm text-slate-400 font-medium tracking-wide uppercase">{label}</div>
    </div>
  );
}

function SkillsMarquee({ skills }: { skills: string[] }) {
  const row = skills.slice(0, 24);
  return (
    <div
      className="mt-10 overflow-hidden py-2"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className="flex w-max gap-3 animate-marquee">
        {[...row, ...row].map((s, i) => (
          <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-blue-200/90 whitespace-nowrap backdrop-blur">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceContent() {
  return (
    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h3 className="text-3xl font-bold text-blue-400">Professional Journey</h3>
          <p className="text-slate-400 text-sm mt-1">Full CV available for specific roles</p>
        </div>
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=yuvalboker588@gmail.com&su=${encodeURIComponent("CV Request — Yuval Boker")}&body=${encodeURIComponent("Hi Yuval,\n\nWe would be happy to receive your CV.\n\nBest regards,")}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20"
        >
          <Mail size={18} /> Request CV
        </a>
      </div>

      <div className="space-y-10">
        <div className="relative pl-8 border-l-2 border-blue-500/30">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <h4 className="text-xl font-bold text-white">Full Stack Engineer <span className="text-blue-400">@ Onezero</span></h4>
          <p className="text-blue-400 text-sm mb-2 font-mono italic">Onezero Software Engineering | Jan 2026 - Present</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Full-stack development across <strong>web and mobile</strong>: building new products, maintaining live production systems, and integrating AI capabilities.
            Developing end-to-end features with <strong>React, Node.js, TypeScript, and Python</strong>, working with <strong>MongoDB and AWS</strong>, and integrating LLM capabilities — prompt design, agent workflows, and model-driven features.
            Working directly with clients to translate business needs into technical tasks.
          </p>
        </div>

        <div className="relative pl-8 border-l-2 border-slate-700">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700" />
          <h4 className="text-xl font-bold text-white">Personal Trainer</h4>
          <p className="text-slate-400 text-sm mb-2 font-mono">Freelance, Part-time | Oct 2025 - Present</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Designed and adapted personalized training programs based on individual goals and progress. Worked directly with clients to track results, adjust plans, and maintain long-term motivation.
          </p>
        </div>

        <div className="relative pl-8 border-l-2 border-slate-700">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700" />
          <h4 className="text-xl font-bold text-white">Excellenteam Excellence Program</h4>
          <p className="text-slate-400 text-sm mb-2 font-mono">Startup Nation Central | Aug - Sep 2025</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Selected for an elite software engineering program. Focused on <strong>Advanced C++ & Python</strong> on Linux, System Design, and performance-aware development.
            Presented end-to-end projects to senior engineers from <strong>Google, NVIDIA, and Check Point</strong>.
          </p>
        </div>

        <div className="relative pl-8 border-l-2 border-slate-700">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700" />
          <h4 className="text-xl font-bold text-white">Teaching Assistant</h4>
          <p className="text-slate-400 text-sm mb-2 font-mono">Tel-Hai College | Jan 2025 - Aug 2025</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Assisted students in a <strong>Probability</strong> course — reviewing assignments, ensuring accurate evaluation, and giving clear feedback to help students improve. Developed strong communication and mentoring skills.
          </p>
        </div>

        <div className="relative pl-8 border-l-2 border-slate-700">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700" />
          <h4 className="text-xl font-bold text-white">B.Sc. Computer Science</h4>
          <p className="text-slate-400 text-sm mb-2 font-mono">Tel-Hai College | 2022 - 2025</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Bachelor of Science in Computer Science.
          </p>
        </div>

        <div className="relative pl-8 border-l-2 border-slate-700">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700" />
          <h4 className="text-xl font-bold text-white">Shift Manager</h4>
          <p className="text-slate-400 text-sm mb-2 font-mono">Rikushet | 2024 - 2025</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Managed team operations, scheduling, and task delegation in a dynamic retail environment — leadership and multitasking skills I bring into software development.
          </p>
        </div>

        <div className="relative pl-8 border-l-2 border-slate-700">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700" />
          <h4 className="text-xl font-bold text-white">First Sergeant, Recruits Commander</h4>
          <p className="text-slate-400 text-sm mb-2 font-mono">IDF | Nov 2018 - Jul 2021</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Led training and operations as a Recruits Commander, progressing through platoon and company leadership roles. Responsible for team performance, discipline, and operational readiness.
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
      className="group relative flex flex-col items-start p-5 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-lg hover:bg-blue-600/10 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-500 text-left overflow-hidden"
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
      className="group relative flex flex-col items-start p-5 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-lg hover:bg-cyan-600/10 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-500 text-left overflow-hidden"
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
    <div className="day-self fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60" onMouseDown={onClose}>
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
    <div className="day-self fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
      <div className="absolute top-[-10%] left-[-10%] h-[800px] w-[800px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `radial-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalEnter { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes blink { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounceSlow { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, 10px); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .animate-fadeInDown { animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-modalEnter { animation: modalEnter 0.3s ease-out forwards; }
        .animate-blink { animation: blink 1.1s step-end infinite; }
        .animate-spin-slow { animation: spinSlow 8s linear infinite; }
        .animate-bounce-slow { animation: bounceSlow 2s ease-in-out infinite; }
        .animate-marquee { animation: marquee 45s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        @keyframes bounceGentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .animate-bounce-gentle { animation: bounceGentle 2.5s ease-in-out infinite; }

        html { scroll-behavior: smooth; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}
