import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
// Portrait — using uploaded real photo from public folder
const ADHIL_PHOTO = "/adhil-photo.jpg";
import {
  ArrowUpRight, Github, Linkedin, Mail, MapPin,
  Code2, Server, Sparkles, Wrench, Layout,
  ShieldCheck, Zap, Cpu, Check, Copy, Terminal,
  Search, X, ExternalLink, MessageSquare, Bot,
  Send, Menu, Eye, CheckCircle2, Layers,
  GraduationCap, BookOpen, Award, ChevronDown,
  Briefcase, Calendar, Star, Download,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "S ADHIL — Full-Stack & AI Systems Developer" },
      { name: "description", content: "Portfolio of S Adhil — Building scalable full-stack applications and AI-powered systems with RAG, LLMs and modern web tech." },
      { property: "og:title", content: "S ADHIL — Full-Stack & AI Systems Developer" },
      { property: "og:description", content: "Portfolio of S Adhil — Building scalable full-stack applications and AI-powered systems." },
    ],
  }),
  component: Index,
});

/* ─── Types ─── */
type Project = {
  slug: string; title: string; tagline: string; description: string;
  category: "ai" | "fullstack" | "systems"; tags: string[];
  features: string[]; icon: any; github?: string; demo?: string; featured?: boolean;
};

/* ─── Data ─── */
const allProjects: Project[] = [
  {
    slug: "ai-tutor",
    title: "AI Tutor",
    tagline: "Intelligent academic assistant with real-time doubt solving",
    description: "An intelligent tutoring platform built with LangChain and RAG that ingests course material and answers student questions with grounded, citation-backed responses. Features automated flashcards and conversational memory.",
    category: "ai",
    tags: ["LangChain", "RAG", "LLMs", "Python", "Vector DB", "FastAPI"],
    features: [
      "Retrieval-Augmented Generation over uploaded course material",
      "Real-time doubt solving with conversational memory",
      "Auto quiz and flashcard generation from topics",
      "Cited answers with source-document references",
    ],
    icon: Sparkles, featured: true, github: "https://github.com/SADHIL2006",
  },

  {
    slug: "local-courier",
    title: "Local Courier Management",
    tagline: "Real-time tracking and automated delivery operations",
    description: "A courier management platform for local delivery businesses featuring automated agent assignment by workload, WebSocket live GPS tracking, and real-time administrative analytics.",
    category: "systems",
    tags: ["Node.js", "Express", "React", "PostgreSQL", "Socket.IO"],
    features: [
      "Automated courier assignment by zone and load",
      "Live GPS tracking via WebSockets",
      "Admin dashboard with delivery analytics",
      "Customer notifications at every status change",
    ],
    icon: Server, github: "https://github.com/SADHIL2006",
  },
  {
    slug: "theatre-management",
    title: "Theatre Management System",
    tagline: "Interactive seat booking and inventory for cinemas",
    description: "A comprehensive cinema management system supporting interactive seat selection, multi-screen show scheduling, concession inventory control, and financial reporting.",
    category: "fullstack",
    tags: ["Java", "Spring Boot", "MySQL", "React"],
    features: [
      "Interactive seat selection and booking engine",
      "Show scheduling across multiple screens",
      "Concession inventory and sales tracking",
      "Revenue and occupancy reports",
    ],
    icon: Cpu, github: "https://github.com/SADHIL2006",
  },
];

const skillGroups = [
  {
    category: "languages", icon: Code2, title: "Languages",
    items: [
      { name: "Python", pct: 85 }, { name: "JavaScript", pct: 85 },
      { name: "Java", pct: 78 }, { name: "C", pct: 72 }, { name: "SQL", pct: 75 },
    ],
  },
  {
    category: "frontend", icon: Layout, title: "Frontend",
    items: [
      { name: "React.js", pct: 83 }, { name: "HTML5 / CSS3", pct: 90 },
      { name: "Tailwind CSS", pct: 85 }, { name: "Responsive Design", pct: 88 },
    ],
  },
  {
    category: "backend", icon: Server, title: "Backend",
    items: [
      { name: "Node.js", pct: 83 }, { name: "Express.js", pct: 83 },
      { name: "REST APIs", pct: 90 },
    ],
  },
  {
    category: "ai", icon: Sparkles, title: "AI & ML",
    items: [
      { name: "LangChain", pct: 82 }, { name: "RAG Architecture", pct: 80 },
      { name: "LLM Orchestration", pct: 78 }, { name: "Prompt Engineering", pct: 85 },
      { name: "Vector Databases", pct: 75 },
    ],
  },
  {
    category: "tools", icon: Wrench, title: "Tools",
    items: [
      { name: "PostgreSQL & MongoDB", pct: 80 }, { name: "Git & GitHub", pct: 88 },
      { name: "Swagger / OpenAPI", pct: 76 },
    ],
  },
];

const education = [
  {
    degree: "B.Tech – Computer Science & Engineering",
    institution: "NSS College of Engineering, Palakkad",
    university: "APJ Abdul Kalam Technological University (KTU)",
    year: "Oct 2024 – Apr 2028",
    grade: "CGPA: 9.52 / 10 (up to S4)",
    highlight: "Specialisation in AI & Full-Stack Systems",
    icon: GraduationCap,
  },
  {
    degree: "Higher Secondary Education (Class XII)",
    institution: "Brook International School",
    university: "CBSE Board",
    year: "2024",
    grade: "Score: 90.4%",
    highlight: "Science with Computer Science",
    icon: BookOpen,
  },
  {
    degree: "Secondary School (Class X)",
    institution: "Brook International School",
    university: "CBSE Board",
    year: "2022",
    grade: "Score: 87.4%",
    highlight: "Distinction in all subjects",
    icon: Award,
  },
];

const presetBotQuestions = [
  { q: "What are Adhil's core strengths?", a: "Adhil specialises in Full-Stack Development and AI Systems! His strengths include building RAG pipelines with LangChain, Node.js/Express APIs, React frontends, and database design with PostgreSQL & MongoDB." },
  { q: "Tell me about AI Tutor project.", a: "AI Tutor is an academic assistant powered by LangChain and RAG. It ingests textbook/lecture documents, answers student doubts with citation-backed precision, and auto-generates quizzes and flashcards." },
  { q: "Is Adhil open for roles?", a: "Yes! Adhil is actively looking for Full-Stack Developer and AI Engineering roles or internships. Email him at adhilshaji965@gmail.com or connect on LinkedIn." },
  { q: "How can I contact Adhil?", a: "Email: adhilshaji965@gmail.com | LinkedIn: s-adhil-1528b1328 | GitHub: SADHIL2006 — or use the contact form at the bottom of this page!" },
];

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
  useEffect(() => {
    const selectors = [
      ".reveal", ".reveal-left", ".reveal-right", ".reveal-scale",
      ".reveal-flip", ".reveal-rotate", ".reveal-zoom", ".reveal-glow",
    ];
    const all = document.querySelectorAll(selectors.join(","));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    all.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Reading Progress ─── */
function ReadingProgress() {
  useEffect(() => {
    const bar = document.getElementById("reading-progress-bar");
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (bar && total > 0) bar.style.width = `${(window.scrollY / total) * 100}%`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div id="reading-progress">
      <div id="reading-progress-bar" />
    </div>
  );
}

/* ─── Floating Orbs Background ─── */
function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Large glossy black swirling rings with soft white specular highlights */}
      <div className="animate-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[900px] w-[900px] rounded-full opacity-[0.055]"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.9) 12%, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 65%, rgba(255,255,255,0.7) 80%, transparent 92%)",
          maskImage: "radial-gradient(circle, transparent 36%, black 40%, black 46%, transparent 50%)",
          filter: "blur(2px)"
        }} />
      <div className="animate-spin-reverse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[640px] w-[640px] rounded-full opacity-[0.04]"
        style={{
          background: "conic-gradient(from 120deg, transparent 0%, rgba(255,255,255,0.8) 18%, transparent 36%, rgba(255,255,255,0.5) 65%, transparent 82%)",
          maskImage: "radial-gradient(circle, transparent 38%, black 42%, black 48%, transparent 52%)",
          filter: "blur(3px)"
        }} />
      {/* Soft radial vignette — slightly lighter center fading to black at edges */}
      <div className="absolute inset-0 opacity-100"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.025) 0%, transparent 70%)" }} />
    </div>
  );
}

/* ─── Nav ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");
  const links = [["About", "#about"], ["Skills", "#skills"], ["Projects", "#projects"], ["Education", "#education"], ["Contact", "#contact"]];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-3 z-50 px-4 transition-all duration-300`}>
      <nav className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-300 ${scrolled ? "glass shadow-elegant" : "bg-transparent"}`}>
        <a href="#top" className="flex items-center gap-2.5 font-display font-bold tracking-tight">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <span className="text-gradient text-base">S ADHIL</span>
          <span className="hidden text-muted-foreground font-mono text-xs sm:inline">/portfolio</span>
        </a>

        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href}
                className={`relative py-1 transition-colors hover:text-primary ${active === href ? "text-primary" : "text-muted-foreground"}`}
                onClick={() => setActive(href)}>
                {label}
                {active === href && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#contact"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow hover:scale-105 transition-transform">
            Let's talk <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden grid h-9 w-9 place-items-center rounded-full border border-border bg-card/80 text-foreground">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden mx-auto mt-2 max-w-6xl rounded-2xl glass p-6 shadow-2xl">
          <ul className="flex flex-col gap-1">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                  {label} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
            <li className="mt-3">
              <a href="#contact" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow">
                Let's Talk <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

/* ─── Hero ─── */
function Hero({ onOpenBot }: { onOpenBot: () => void }) {
  const roles = ["Full-Stack Developer", "AI & RAG Engineer", "Backend Systems Architect", "Computer Science Graduate"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = roles[roleIndex];
    const speed = isDeleting ? 40 : 80;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        } else {
          setCharIndex(c => c + 1);
        }
      } else {
        setDisplayText(current.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setRoleIndex(i => (i + 1) % roles.length);
        }
        setCharIndex(c => c - 1);
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  return (
    <section id="top" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">

      {/* 3D glossy rings — still on top of canvas */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="animate-spin-slow relative h-[750px] w-[750px] opacity-[0.07]" style={{
          background: "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.95) 12%, transparent 26%, rgba(255,255,255,0.4) 50%, transparent 66%, rgba(255,255,255,0.75) 82%, transparent 94%)",
          borderRadius: "50%",
          filter: "blur(1.5px)",
          maskImage: "radial-gradient(circle, transparent 37%, black 41%, black 47%, transparent 51%)"
        }} />
        <div className="animate-spin-reverse absolute h-[520px] w-[520px] opacity-[0.045]" style={{
          background: "conic-gradient(from 90deg, transparent 0%, rgba(255,255,255,0.80) 20%, transparent 40%, rgba(255,255,255,0.45) 70%, transparent 88%)",
          borderRadius: "50%",
          filter: "blur(2.5px)",
          maskImage: "radial-gradient(circle, transparent 39%, black 43%, black 50%, transparent 54%)"
        }} />
      </div>

      {/* Subtle grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hero-grid opacity-30"
        style={{ maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)" }} />

      {/* Subtle grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(231,200,130,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(231,200,130,0.06) 1px, transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)" }} />

      <div className="mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="reveal inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 text-xs font-mono mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-muted-foreground">Currently:</span>
          <span className="font-semibold text-primary">Open to Software Engineering Opportunities</span>
        </div>

        {/* Name */}
        <h1 className="reveal stagger-1 text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
          <span className="block text-foreground">S ADHIL</span>
        </h1>

        {/* Typewriter role */}
        <div className="reveal stagger-2 mt-4 h-14 flex items-center justify-center">
          <span className="text-2xl font-semibold sm:text-3xl md:text-4xl text-gradient">
            {displayText}
          </span>
          <span className="ml-1 inline-block w-0.5 h-8 bg-primary animate-cursor" />
        </div>

        <p className="reveal stagger-3 mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Engineering scalable backend systems, production-ready REST APIs, and intelligent AI applications
          powered by <strong className="text-foreground">RAG</strong> and <strong className="text-foreground">LLMs</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="reveal stagger-4 mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#projects"
            data-magnetic
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-105 transition-all duration-300">
            Explore Projects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button onClick={onOpenBot}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/50 px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/50 hover:bg-card transition-all duration-300">
            <Bot className="h-4 w-4 text-accent" /> Ask AI About Me
          </button>
          <a href="#contact"
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-card transition-all duration-300">
            <Mail className="h-4 w-4" /> Contact Me
          </a>
        </div>

        {/* Stats Row */}
        <div className="reveal stagger-5 mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 max-w-3xl mx-auto">
          {[
            { label: "Projects Built", value: "3+", color: "text-primary" },
            { label: "AI Systems", value: "RAG / LLM", color: "text-accent" },
            { label: "Backend Expertise", value: "Node.js", color: "text-primary" },
            { label: "Years Coding", value: "4+", color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card neon-border rounded-2xl p-5 text-center">
              <div className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="mt-1 text-xs font-mono text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="reveal stagger-6 mt-16 flex flex-col items-center gap-2 text-muted-foreground/60">
          <span className="font-mono text-xs">scroll to explore</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mx-auto mb-16 max-w-2xl text-center">
      <div className="reveal font-mono text-xs uppercase tracking-[0.3em] text-primary font-semibold">{eyebrow}</div>
      <div className="section-line reveal" />
      <h2 className="reveal mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h2>
      {description && <p className="reveal mt-4 text-base text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  );
}

/* ─── About ─── */
function About() {
  const [activeTab, setActiveTab] = useState<"overview" | "philosophy" | "focus">("overview");

  const tabs = {
    overview: (
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>I'm a <strong className="text-foreground">Computer Science Engineering</strong> student passionate about building production-ready web applications and intelligent AI systems that solve real-world problems.</p>
        <p>My work spans full-stack development with <strong className="text-foreground">React, Node.js, and Express</strong>, and advanced AI systems using <strong className="text-foreground">LangChain, RAG pipelines, and Vector Databases</strong>.</p>
      </div>
    ),
    philosophy: (
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>I believe in writing <strong className="text-foreground">clean, secure, and maintainable software</strong>. Every line of code should serve a purpose — no over-engineering, no shortcuts on security.</p>
        <p>Whether building logistics engines or AI tutors, I prioritise robust system design, clear documentation, and seamless user experiences.</p>
      </div>
    ),
    focus: (
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>Currently focused on bridging traditional software engineering with modern AI — specifically building <strong className="text-foreground">RAG pipelines for grounded, hallucination-free AI responses</strong>.</p>
        <p>Actively seeking roles where I can architect scalable APIs, integrate LLM capabilities, and ship production-grade software.</p>
      </div>
    ),
  };

  return (
    <section id="about" className="px-4 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="01 / About" title="About Me" />
        <div className="grid gap-10 lg:grid-cols-5 items-start">

          {/* Portrait Column */}
          <div className="reveal-left lg:col-span-2 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="glow-ring relative h-64 w-64 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-elegant scanner-wrap">
                <img src={ADHIL_PHOTO} alt="S Adhil" className="h-full w-full object-cover photo-mono" style={{ objectPosition: "center 15%" }} loading="lazy" />
                <div className="scanner-line" aria-hidden />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 font-mono text-xs">
              {[
                { label: "Kollam, Kerala, India", icon: MapPin },
                { label: "Open to Work", icon: Briefcase },
                { label: "B.Tech CSE", icon: GraduationCap },
              ].map(({ label, icon: Icon }) => (
                <span key={label} className="glass-card inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary" /> {label}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <a href="https://github.com/SADHIL2006" target="_blank" rel="noreferrer"
                className="glass-card grid h-10 w-10 place-items-center rounded-full hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/s-adhil-1528b1328" target="_blank" rel="noreferrer"
                className="glass-card grid h-10 w-10 place-items-center rounded-full hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:adhilshaji965@gmail.com"
                className="glass-card grid h-10 w-10 place-items-center rounded-full hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Bio Column */}
          <div className="reveal-scale lg:col-span-3">
            <div className="glass-card rounded-3xl p-8">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-border/40 pb-5 mb-6">
                {(["overview", "philosophy", "focus"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all ${activeTab === tab ? "bg-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
                    {tab === "focus" ? "AI Focus" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="min-h-[120px] text-sm sm:text-base">{tabs[activeTab]}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Skill Bar ─── */
function SkillBar({ name, pct, delay }: { name: string; pct: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setAnimated(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{name}</span>
        <span className="font-mono text-xs text-primary">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
        <div
          className="h-full rounded-full skill-bar-fill"
          style={{
            background: "var(--gradient-primary)",
            width: animated ? `${pct}%` : "0%",
            transitionDelay: `${delay}ms`,
            transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: animated ? "0 0 10px rgba(231,200,130,0.55)" : "none",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Skills ─── */
function Skills() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? skillGroups
    : skillGroups.filter(g => g.category === activeCategory);

  return (
    <section id="skills" className="px-4 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="02 / Skills" title="Technical Toolkit" description="Technologies I use to build reliable, high-performance software." />

        {/* Filter Tabs */}
        <div className="reveal flex flex-wrap justify-center gap-2 mb-12">
          {[{ id: "all", label: "All Skills" }, { id: "languages", label: "Languages" }, { id: "frontend", label: "Frontend" }, { id: "backend", label: "Backend" }, { id: "ai", label: "AI & ML" }, { id: "tools", label: "Tools" }].map(({ id, label }) => (
            <button key={id} onClick={() => setActiveCategory(id)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${activeCategory === id ? "bg-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((group, gi) => {
            const Icon = group.icon;
            return (
              <div key={group.title} className={`reveal-flip stagger-${Math.min(gi + 1, 6)} glass-card neon-border rounded-2xl p-6`}>
                <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-5">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{group.title}</h3>
                </div>
                <div className="space-y-4">
                  {group.items.map((item, ii) => (
                    <SkillBar key={item.name} name={item.name} pct={item.pct} delay={ii * 100} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Project Quick View Modal ─── */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const Icon = project.icon;
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-black/85 backdrop-blur-md p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-elegant animate-bounce-in"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-5 right-5 grid h-8 w-8 place-items-center rounded-full border border-border bg-muted/40 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="font-mono text-xs text-primary uppercase tracking-widest">Project Details</div>
            <h2 className="font-display text-xl font-bold">{project.title}</h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
        <div className="mt-6 border-t border-border/40 pt-5">
          <h3 className="font-semibold text-sm mb-3">Key Features</h3>
          <ul className="space-y-2.5">
            {project.features.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5 border-t border-border/40 pt-5">
          <h3 className="font-semibold text-sm mb-3">Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(t => (
              <span key={t} className="rounded-full border border-border/80 bg-muted/30 px-3 py-1 font-mono text-xs text-foreground">{t}</span>
            ))}
          </div>
        </div>
        <div className="mt-7 flex items-center justify-between pt-4 border-t border-border/40">
          <Link to="/projects/$slug" params={{ slug: project.slug }} onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            Full Details <ArrowUpRight className="h-4 w-4" />
          </Link>
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold hover:text-primary">
              <Github className="h-4 w-4" /> Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Projects ─── */
function Projects({ onSelect }: { onSelect: (p: Project) => void }) {
  const [cat, setCat] = useState<"all" | "ai" | "fullstack" | "systems">("all");
  const filtered = cat === "all" ? allProjects : allProjects.filter(p => p.category === cat);

  return (
    <section id="projects" className="px-4 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="03 / Projects" title="Selected Work" description="Applications, APIs, and AI solutions I have designed and built." />

        {/* Category Filter */}
        <div className="reveal flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: "all", label: `All (${allProjects.length})` },
            { id: "ai", label: "AI & RAG" },
            { id: "fullstack", label: "Full-Stack" },
            { id: "systems", label: "Systems" },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setCat(id as any)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${cat === id ? "bg-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filtered.map((project, pi) => {
            const Icon = project.icon;
            return (
              <div key={project.slug}
                data-cursor="view"
                className={`reveal-zoom stagger-${Math.min(pi + 1, 6)} group relative flex flex-col justify-between overflow-hidden glass-card neon-border rounded-3xl p-8`}>
                <div aria-hidden
                  className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-30"
                  style={{ background: "var(--gradient-primary)" }} />
                <div>
                  <div className="flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                      <Icon className="h-6 w-6" />
                    </div>
                    {project.featured && (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] font-semibold text-primary">
                        ✦ Featured
                      </span>
                    )}
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold group-hover:text-gradient transition-all">{project.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{project.tagline}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map(t => (
                      <span key={t} className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 font-mono text-xs text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-7 flex items-center justify-between border-t border-border/40 pt-5">
                  <button onClick={() => onSelect(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                    <Eye className="h-3.5 w-3.5" /> Quick View
                  </button>
                  <Link to="/projects/$slug" params={{ slug: project.slug }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                    Full Details <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Education ─── */
function Education() {
  return (
    <section id="education" className="px-4 py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow="04 / Education" title="Academic Journey" description="My educational background in Computer Science and Engineering." />
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent opacity-30" />
          <div className="space-y-8 pl-16">
            {education.map((edu, i) => {
              const Icon = edu.icon;
              return (
                <div key={edu.degree} className={`reveal-rotate stagger-${i + 1} relative`}>
                  {/* Timeline dot */}
                  <div className="absolute -left-10 top-6 grid h-8 w-8 place-items-center rounded-full bg-primary/20 border border-primary/40 text-primary z-10">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg font-bold">{edu.degree}</h3>
                        <p className="mt-1 text-sm font-semibold text-primary">{edu.institution}</p>
                        {"university" in edu && edu.university && (
                          <p className="mt-0.5 text-xs font-medium text-accent">{(edu as typeof edu & {university:string}).university}</p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">{edu.highlight}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1 font-mono text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {edu.year}
                        </div>
                        <div className="mt-2 font-semibold text-sm text-foreground">{edu.grade}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── AI Bot Modal ─── */
function BotModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState([
    { sender: "bot" as const, text: "Hello! I'm Adhil's AI Assistant. Ask me anything about his background, projects, or availability! 🤖" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  if (!isOpen) return null;

  const send = (text: string, answer?: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { sender: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const matched = presetBotQuestions.find(q => text.toLowerCase().includes(q.q.toLowerCase().slice(0, 10)));
      setMessages(m => [...m, { sender: "bot", text: answer ?? matched?.a ?? "Great question! Adhil is a Full-Stack and AI developer based in Kerala. Reach him at adhilshaji965@gmail.com for more details!" }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card shadow-elegant flex flex-col h-[600px] max-h-[90vh] animate-bounce-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/20 text-accent">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">Adhil AI <span className="h-2 w-2 rounded-full bg-green-400" /></h3>
              <p className="text-xs text-muted-foreground">Interactive Portfolio Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:text-foreground text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "bot" && <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/20 text-accent text-xs"><Bot className="h-3.5 w-3.5" /></div>}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${m.sender === "user" ? "bg-primary text-primary-foreground" : "glass text-foreground"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && <div className="flex gap-2 items-center text-xs text-muted-foreground font-mono"><Bot className="h-4 w-4 text-accent animate-bounce" /> Thinking...</div>}
          <div ref={bottomRef} />
        </div>

        {/* Preset buttons */}
        <div className="border-t border-border/40 px-4 pt-3 pb-2">
          <div className="text-[11px] font-mono text-muted-foreground mb-2">Quick questions:</div>
          <div className="flex flex-wrap gap-1.5">
            {presetBotQuestions.map(q => (
              <button key={q.q} onClick={() => send(q.q, q.a)}
                className="rounded-full border border-border/60 bg-muted/20 px-3 py-1 text-[11px] text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                {q.q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-border/40 p-4">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about Adhil..."
            className="flex-1 rounded-full border border-border bg-muted/40 px-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
          <button type="submit" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Contact ─── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Please fill in all required fields."); return; }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! Adhil will get back to you soon. 🎉");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("adhilshaji965@gmail.com");
    setCopied(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="px-4 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="05 / Contact" title="Let's Build Together" description="Open to software engineering roles, internships, and interesting collaborations." />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Info Column */}
          <div className="reveal-left md:col-span-2 space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Email</div>
              <div className="text-sm font-semibold">adhilshaji965@gmail.com</div>
              <button onClick={copyEmail}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary hover:bg-muted">
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy Email"}
              </button>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Location</div>
              <div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-primary" /> Kollam, Kerala, India</div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Socials</div>
              <div className="flex items-center gap-3">
                {[
                  { href: "https://github.com/SADHIL2006", icon: Github, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/s-adhil-1528b1328", icon: Linkedin, label: "LinkedIn" },
                ].map(({ href, icon: Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer"
                    className="glass-card flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium hover:text-primary">
                    <Icon className="h-4 w-4" /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <form onSubmit={submit} className="reveal-right md:col-span-3 space-y-4">
            {[
              { key: "name", label: "Your Name *", type: "text", placeholder: "e.g. Sarah Johnson", required: true },
              { key: "email", label: "Your Email *", type: "email", placeholder: "e.g. sarah@company.com", required: true },
              { key: "subject", label: "Subject", type: "text", placeholder: "Internship / Project Collaboration", required: false },
            ].map(({ key, label, type, placeholder, required }) => (
              <div key={key}>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">{label}</label>
                <input type={type} required={required} placeholder={placeholder}
                  value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5">Message *</label>
              <textarea rows={4} required placeholder="Tell me about your project or opportunity..."
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all resize-none" />
            </div>
            <button type="submit" disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.01] transition-transform disabled:opacity-50">
              {sending ? "Sending..." : (<>Send Message <Send className="h-4 w-4" /></>)}
            </button>
          </form>
        </div>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground font-mono">
          <span>© {new Date().getFullYear()} S ADHIL — All rights reserved.</span>
          <span className="text-gradient">Built with React 19 & TanStack</span>
        </footer>
      </div>
    </section>
  );
}

/* ─── Root Component ─── */
function Index() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [botOpen, setBotOpen] = useState(false);

  useScrollReveal();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <ReadingProgress />
      <FloatingOrbs />
      <Nav />

      <main>
        <Hero onOpenBot={() => setBotOpen(true)} />
        <About />
        <Skills />
        <Projects onSelect={setSelectedProject} />
        <Education />
        <Contact />
      </main>

      {/* Floating AI Bot Button */}
      <button onClick={() => setBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-semibold text-accent-foreground shadow-glow-accent hover:scale-105 transition-all">
        <Bot className="h-5 w-5" />
        <span className="hidden sm:inline">Ask AI Bot</span>
      </button>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      <BotModal isOpen={botOpen} onClose={() => setBotOpen(false)} />
    </div>
  );
}
