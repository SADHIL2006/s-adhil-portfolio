import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Github, ExternalLink, CheckCircle2, Calendar, Code2 } from "lucide-react";

type Project = {
  title: string; tagline: string; overview: string;
  stack: string[]; features: string[]; role: string;
  github?: string; demo?: string;
};

const projects: Record<string, Project> = {
  "ai-tutor": {
    title: "AI Tutor",
    tagline: "AI-powered academic assistant for real-time doubt solving.",
    overview: "An intelligent tutoring platform built with LangChain and RAG that ingests course material and answers student questions with grounded, citation-backed responses. Includes auto quiz generation, concept summarization, and conversation memory.",
    stack: ["Python", "LangChain", "RAG", "LLMs", "Vector DB", "FastAPI"],
    features: [
      "Retrieval-Augmented Generation over uploaded course material",
      "Real-time doubt solving with conversational memory",
      "Auto quiz and flashcard generation from topics",
      "Cited answers with source-document references",
    ],
    role: "Architected the RAG pipeline, document embedding, prompt orchestration, and backend APIs.",
    github: "https://github.com/SADHIL2006",
  },
  "delivery-management": {
    title: "Delivery Management System",
    tagline: "Peer-to-peer logistics with smart route optimization.",
    overview: "A logistics platform that connects senders with travelers heading the same way, with optimized route matching, real-time order tracking, and automated fare calculation.",
    stack: ["Node.js", "Express", "React", "MongoDB", "Maps API"],
    features: [
      "Smart matching between senders and travelers",
      "Route optimization and ETA calculation",
      "Real-time order tracking with status updates",
      "In-app messaging and user verification",
    ],
    role: "Built the matching engine, route optimization logic, and backend services.",
    github: "https://github.com/SADHIL2006",
  },
  "local-courier": {
    title: "Local Courier Management System",
    tagline: "Real-time tracking and automated delivery operations.",
    overview: "A courier management platform for local delivery businesses with automated assignment, live WebSocket GPS tracking, and admin analytics dashboard.",
    stack: ["Node.js", "Express", "React", "PostgreSQL", "Socket.IO"],
    features: [
      "Automated courier assignment by zone and load",
      "Live GPS tracking via WebSockets",
      "Admin dashboard with delivery analytics",
      "Customer notifications at every status change",
    ],
    role: "Designed the backend, real-time tracking layer, and admin dashboard.",
    github: "https://github.com/SADHIL2006",
  },
  "theatre-management": {
    title: "Theatre Management System",
    tagline: "Booking and inventory platform for cinemas.",
    overview: "A theatre management system with seat-level booking, show scheduling, concession inventory, and reporting for multiplex operators.",
    stack: ["Java", "Spring Boot", "MySQL", "React"],
    features: [
      "Interactive seat selection and booking",
      "Show scheduling across multiple screens",
      "Concession inventory and sales tracking",
      "Revenue and occupancy reports",
    ],
    role: "Built core booking logic, database schema, and reporting APIs.",
    github: "https://github.com/SADHIL2006",
  },
};

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const p = projects[params.slug];
    const title = p ? `${p.title} — S ADHIL` : "Project — S ADHIL";
    return { meta: [{ title }, { name: "description", content: p?.tagline ?? "Project by S Adhil." }] };
  },
  loader: ({ params }): { project: Project } => {
    const project = projects[params.slug];
    if (!project) throw notFound();
    return { project };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground px-4">
      <div className="text-center">
        <div className="text-7xl font-bold text-primary/20 font-display">404</div>
        <h1 className="mt-4 font-display text-3xl font-bold">Project not found</h1>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to portfolio
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground px-4 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
        <button onClick={reset} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
          Try again
        </button>
      </div>
    </div>
  ),
  component: ProjectPage,
});

function ProjectPage() {
  const { project } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Ambient bg */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10"
        style={{ backgroundImage: "var(--gradient-hero)" }} />

      {/* Navbar */}
      <header className="fixed inset-x-0 top-3 z-50 px-4">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full glass px-5 py-3 shadow-elegant">
          <Link to="/" className="flex items-center gap-2 font-display font-bold">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-gradient text-base">S ADHIL</span>
          </Link>
          <Link to="/" hash="projects"
            className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-card hover:scale-105 transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> All Projects
          </Link>
        </nav>
      </header>

      <main className="relative px-4 pt-32 pb-24">
        <article className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Portfolio</Link>
            <span>/</span>
            <Link to="/" hash="projects" className="hover:text-primary transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-primary">{project.title}</span>
          </div>

          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary font-semibold">Project Showcase</div>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">{project.tagline}</p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-105 transition-transform">
                <Github className="h-4 w-4" /> View on GitHub
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold hover:bg-card transition-all">
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            )}
          </div>

          {/* Content Grid */}
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <div className="glass-card rounded-3xl p-8 lg:col-span-2">
              <h2 className="font-display text-xl font-bold border-b border-border/40 pb-3 mb-5">System Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{project.overview}</p>

              <h2 className="mt-8 font-display text-xl font-bold border-b border-border/40 pb-3 mb-5">Key Features</h2>
              <ul className="space-y-3.5">
                {project.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="glass-card rounded-3xl p-8">
              <h3 className="font-display text-lg font-bold border-b border-border/40 pb-3 mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map(s => (
                  <span key={s} className="rounded-full border border-border/80 bg-muted/30 px-3 py-1 font-mono text-xs text-foreground">
                    {s}
                  </span>
                ))}
              </div>
              <h3 className="mt-7 font-display text-lg font-bold border-b border-border/40 pb-3 mb-4">My Role</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.role}</p>
            </aside>
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-border/40 pt-6">
            <Link to="/" hash="projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to all projects
            </Link>
            <a href="mailto:adhilshaji965@gmail.com" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
              Questions? Email Adhil →
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}
