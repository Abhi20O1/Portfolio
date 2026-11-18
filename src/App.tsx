import { useState, useEffect, useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import {
  Mail,
  MessageCircle,
  MapPin,
  Code2,
  ExternalLink,
  Cpu,
  Terminal,
  Briefcase,
  Send,
  FileText,
  Star,
  CheckCircle2,
  Copy,
  ShieldCheck,
  ArrowUpRight,
  GraduationCap,
  Sparkles,
  Layers,
  Database,
  Network
} from 'lucide-react';

function InteractiveBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#060709] pointer-events-none">
      {/* Precision ambient lighting blooms */}
      <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/[0.08] blur-[140px]" />
      <div className="absolute top-[25%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/[0.07] blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-violet-600/[0.06] blur-[130px]" />
    </div>
  );
}

interface GitHubRepo {
  id: number | string;
  title: string;
  html_url: string;
  language: string | null;
  description: string;
  stars?: number;
}

export default function App() {
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [algoPlatform, setAlgoPlatform] = useState<'hackerrank' | 'leetcode'>('hackerrank');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const calendarScrollRef = useRef<HTMLDivElement>(null);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [formError, setFormError] = useState("");

  const email = "abhi28031@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  useEffect(() => {
    const el = calendarScrollRef.current;
    if (!el) return;

    const centerCalendar = () => {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      }
    };

    centerCalendar();
    const observer = new MutationObserver(centerCalendar);
    observer.observe(el, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const handleEmailSubmit = () => {
    if (!contactName.trim()) return setFormError("Please enter your name!");
    if (!contactEmail.trim()) return setFormError("Please enter your email!");
    if (!contactMessage.trim()) return setFormError("Please enter a message!");
    setFormError("");

    const emailStr = contactEmail ? ` (${contactEmail})` : "";
    const subject = `Portfolio enquiry from ${contactName}${emailStr}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(contactMessage)}`;
  };

  const handleWhatsAppSubmit = () => {
    if (!contactName.trim()) return setFormError("Please enter your name!");
    if (!contactEmail.trim()) return setFormError("Please enter your email!");
    if (!contactMessage.trim()) return setFormError("Please enter a message!");
    setFormError("");

    const intro = `Hi Abhishek, I am ${contactName}${contactEmail ? ` (${contactEmail})` : ''} reaching out from your portfolio.`;
    window.open(`https://wa.me/918126684451?text=${encodeURIComponent(`${intro}\n\n${contactMessage}`)}`, '_blank');
  };

  const scrollToContact = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        document.getElementById("name")?.focus();
      }, 500);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08 }
    );

    const observeElements = () => {
      document.querySelectorAll(".animate-fade-in-up").forEach((el) => {
        observer.observe(el);
      });
    };

    const timeoutId = setTimeout(observeElements, 100);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [projects]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('https://api.github.com/users/Abhi20O1/repos?sort=updated&per_page=8');
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("GitHub API limit exceeded");
        }

        const filtered = data.filter((r: any) => r.name !== 'Abhi20O1' && r.name.toLowerCase() !== 'fastapi' && !r.fork);
        const reposWithReadme = await Promise.all(
          filtered.slice(0, 6).map(async (repo: any) => {
            let readmeText = "";
            try {
              let readmeRes = await fetch(`https://raw.githubusercontent.com/Abhi20O1/${repo.name}/main/README.md`);
              if (!readmeRes.ok) readmeRes = await fetch(`https://raw.githubusercontent.com/Abhi20O1/${repo.name}/master/README.md`);
              if (readmeRes.ok) {
                const text = await readmeRes.text();
                const firstPara = text.split('\n\n').find((p: string) => p.trim() && !p.startsWith('#') && !p.startsWith('[!'));
                if (firstPara) {
                  readmeText = firstPara.replace(/[#*`_[\]]/g, '').slice(0, 140).trim() + "...";
                }
              }
            } catch { }

            return {
              id: repo.id,
              title: repo.name.replace(/[-_]/g, ' '),
              html_url: repo.html_url,
              language: repo.language,
              stars: repo.stargazers_count,
              description: readmeText || repo.description || "Production open source machine learning codebase."
            };
          })
        );

        setProjects(reposWithReadme);
      } catch {
        setProjects([
          {
            id: 'rag',
            title: 'Multimodal Document RAG',
            html_url: 'https://github.com/Abhi20O1',
            language: 'Python',
            stars: 8,
            description: 'Hybrid Vision-Language pipeline extracting structured tabular covenants from high-resolution legal deeds.'
          },
          {
            id: 'vllm',
            title: 'FineTuned LLM Inference',
            html_url: 'https://github.com/Abhi20O1',
            language: 'Python',
            stars: 12,
            description: 'High-throughput token serving with vLLM, Pydantic AST schema enforcement, and FlashAttention-2 benchmarks.'
          },
          {
            id: 'retriever',
            title: 'Dense Sparse Retriever',
            html_url: 'https://github.com/Abhi20O1',
            language: 'C++',
            stars: 6,
            description: 'ColBERT multi-vector scoring integrated with BM25 inverted index for legal and financial cross-search.'
          },
          {
            id: 'vision',
            title: 'Autonomous Vision Agent',
            html_url: 'https://github.com/Abhi20O1',
            language: 'Python',
            stars: 5,
            description: 'Computer vision framework tracking document bounding boxes, optical flow, and edge segmentation in real time.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30 selection:text-white pb-16">
      <InteractiveBackground />
      <div className="tech-grid-pattern" />
      <div className="noise-texture" />

      {/* FLOATING NAVIGATION DOCK */}
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 w-[95%] sm:w-[90%] max-w-6xl glass-panel rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl bg-[#090b10]/85 animate-fade-in-up">
        <a href="#about" className="flex items-center gap-3 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex items-center justify-center border border-white/15 shadow-sm bg-zinc-900 group-hover:border-indigo-400/50 transition-colors">
            <img src={`${import.meta.env.BASE_URL}Logo.webp`} alt="Abhishek Singh Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-100 tracking-tight leading-tight group-hover:text-white transition-colors">
              Abhishek Singh
            </span>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:block">AI & Data Scientist</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
          <a href="#about" className="hover:text-white transition-colors">Overview</a>
          <a href="#experience" className="hover:text-white transition-colors">Experience</a>
          <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          <a href="#problem-solving" className="hover:text-white transition-colors">Problem Solving</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#education" className="hover:text-white transition-colors">Education</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
          >
            {copiedEmail ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copiedEmail ? 'Copied' : 'Email'}</span>
          </button>
          <a
            href="#contact"
            onClick={scrollToContact}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-100 px-4 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.18)] hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] whitespace-nowrap cursor-pointer active:scale-95"
          >
            <MessageCircle size={13} className="fill-zinc-950 text-zinc-950" />
            <span>Let's Talk</span>
          </a>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 flex flex-col gap-10 sm:gap-14">

        {/* HERO SECTION */}
        <section id="about" className="glass-panel rounded-[2.2rem] p-6 sm:p-10 lg:p-12 relative overflow-hidden animate-fade-in-up stagger-1">
          {/* Subtle Corner Brackets for Technical Elegance */}
          <div className="absolute top-4 left-4 text-xs font-mono text-zinc-700 pointer-events-none select-none">+</div>
          <div className="absolute top-4 right-4 text-xs font-mono text-zinc-700 pointer-events-none select-none">+</div>
          <div className="absolute bottom-4 left-4 text-xs font-mono text-zinc-700 pointer-events-none select-none">+</div>
          <div className="absolute bottom-4 right-4 text-xs font-mono text-zinc-700 pointer-events-none select-none">+</div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Core Identity & Impact */}
            <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 backdrop-blur-md w-fit shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] text-emerald-300 font-mono tracking-wide uppercase font-semibold">
                  Available for AI/ML Roles
                </span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.05]">
                  Abhishek Singh
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold gradient-text-accent tracking-tight mt-2 sm:mt-3">
                  AI Engineer & Data Scientist
                </h2>
              </div>

              <p className="text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
                Specialized in <span className="text-white font-medium">Data Cleaning & Feature Engineering</span>, scalable <span className="text-white font-medium">System Architecture Design</span>, and high-performance ML pipelines across Healthcare, and Computer Vision.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 sm:gap-4 items-center pt-2">
                <a
                  href="#contact"
                  onClick={scrollToContact}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 transition-all font-bold text-sm shadow-[0_0_25px_rgba(255,255,255,0.22)] hover:shadow-[0_0_30px_rgba(255,255,255,0.38)] cursor-pointer active:scale-95"
                >
                  <Send size={15} />
                  <span>Get in Touch</span>
                </a>
                <a
                  href={`${import.meta.env.BASE_URL}resume.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 transition-all text-sm font-semibold backdrop-blur-md shadow-sm active:scale-95"
                >
                  <FileText size={15} />
                  <span>Resume</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/abhishek-singh-sd"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all text-zinc-300 text-sm font-medium active:scale-95"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight size={14} className="text-zinc-400" />
                </a>
                <a
                  href="https://github.com/Abhi20O1"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all text-zinc-300 text-sm font-medium active:scale-95"
                >
                  <span>GitHub</span>
                  <ArrowUpRight size={14} className="text-zinc-400" />
                </a>
              </div>

              {/* Verified Credentials Ticker */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-200 font-medium">
                  <ShieldCheck size={14} className="text-indigo-400" />
                  <span>Data Science Trainee · Arcap REIT</span>
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300">IIT Guwahati (Data Science)</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300">HackerRank 3★ SQL Gold Rank</span>
              </div>
            </div>

            {/* Right Column: High-Grade Editorial Portrait */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative group w-full max-w-[360px] sm:max-w-[400px]">
                {/* Ambient glow backdrop */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500/25 via-blue-500/15 to-purple-500/25 rounded-[2.5rem] blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

                {/* Main Portrait Card */}
                <div className="relative rounded-[2.2rem] overflow-hidden border border-white/15 bg-[#0a0c10] shadow-[0_20px_50px_rgba(0,0,0,0.7)] aspect-[4/5] flex items-center justify-center">
                  <img
                    src={`${import.meta.env.BASE_URL}robo.webp`}
                    alt="Abhishek Singh"
                    className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03] group-hover:scale-[1.02] transition-transform duration-700"
                  />

                  {/* Gradient lighting mask for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/25 to-transparent pointer-events-none" />

                  {/* Floating Micro-Badge */}
                  <div className="absolute bottom-5 left-5 right-5 bg-[#0d0f14]/85 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl flex items-center justify-between shadow-xl">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">Abhishek Singh</span>
                      <span className="text-[11px] text-zinc-400">Data Science Trainee</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px] text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROFESSIONAL WORK EXPERIENCE */}
        <section id="experience" className="glass-panel rounded-[2.2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-2 flex flex-col gap-6 sm:gap-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Briefcase size={20} />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold mb-0.5">
                  {"// Professional Experience"}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Work Experience</h3>
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10 w-fit">
              Aug 2025 – Jan 2026
            </span>
          </div>

          {/* Flagship Experience Card */}
          <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-2xl bg-[#090b10] border border-white/10 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-white/10 pb-5">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Arcap REIT AI Solution
                </h4>
                <span className="text-zinc-600 font-mono hidden sm:inline">|</span>
                <span className="text-sm sm:text-base text-indigo-400 font-semibold">
                  Data Scientist trainee
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400 bg-white/[0.05] px-3 py-1 rounded-md border border-white/5">
                  Aug 2025 – Jan 2026
                </span>
              </div>
            </div>

            {/* Exactly Preserved 4 Bullet Points Rendered as Engineering Impact Nodes */}
            <div className="grid grid-cols-1 gap-4 pt-1">
              {/* Bullet 1 */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#0d0f14]/80 border border-white/5 hover:border-indigo-500/30 transition-all flex items-start gap-4 group">
                <span className="text-xs font-mono text-indigo-400/80 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded mt-0.5 shrink-0">
                  01
                </span>
                <div className="flex flex-col gap-1">
                  <div className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    <span className="text-white font-semibold">● Data Pipeline Development:</span> Developed automated data cleaning pipelines using Python and R, reducing manual data preparation time by 30%.
                  </div>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#0d0f14]/80 border border-white/5 hover:border-indigo-500/30 transition-all flex items-start gap-4 group">
                <span className="text-xs font-mono text-indigo-400/80 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded mt-0.5 shrink-0">
                  02
                </span>
                <div className="flex flex-col gap-1">
                  <div className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    <span className="text-white font-semibold">● Feature Engineering:</span> Implementing advanced preprocessing techniques including categorical encoding, datetime extraction, and scaling/normalization to optimize data for machine learning models.
                  </div>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#0d0f14]/80 border border-white/5 hover:border-indigo-500/30 transition-all flex items-start gap-4 group">
                <span className="text-xs font-mono text-indigo-400/80 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded mt-0.5 shrink-0">
                  03
                </span>
                <div className="flex flex-col gap-1">
                  <div className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    <span className="text-white font-semibold">● ML System Architecture:</span> Designing end-to-end cloud-based AI architecture using AWS (S3, SageMaker) and Azure for scenarios like Patient Risk Prediction.
                  </div>
                </div>
              </div>

              {/* Bullet 4 */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#0d0f14]/80 border border-white/5 hover:border-indigo-500/30 transition-all flex items-start gap-4 group">
                <span className="text-xs font-mono text-indigo-400/80 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded mt-0.5 shrink-0">
                  04
                </span>
                <div className="flex flex-col gap-1">
                  <div className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    <span className="text-white font-semibold">● Model Deployment:</span> Deployed Random Forest and CNN models via Flask, ensuring scalability and monitoring.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE TECHNICAL COMPETENCIES */}
        <section id="skills" className="glass-panel rounded-[2.2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-3 flex flex-col gap-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Cpu size={20} />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold mb-0.5">
                {"// Core Competencies"}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Technical Stack & Toolkit</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1: Deep Learning & LLMs */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#090b10] border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                  {"// Deep Learning & LLMs"}
                </span>
                <Sparkles size={14} className="text-indigo-400/60" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['PyTorch', 'Transformers', 'LLM', 'Hugging Face', 'Scikit-learn'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2: Multimodal & Document AI */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#090b10] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                  {"// Multimodal & Document AI"}
                </span>
                <Layers size={14} className="text-blue-400/60" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['OpenCV', 'YOLO', 'LangChain', 'LlamaIndex'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 3: Databases & Vector Stores */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#090b10] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  {"// Databases & Vector Stores"}
                </span>
                <Database size={14} className="text-emerald-400/60" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['PostgreSQL', 'pgvector', 'Redis', 'SQL'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 4: Systems & Cloud Infra */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#090b10] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                  {"// Systems & Cloud Infra"}
                </span>
                <Network size={14} className="text-purple-400/60" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['Python', 'C++', 'FastAPI', 'Docker', 'AWS (S3, SageMaker)', 'Linux', 'Git'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ALGORITHMIC PROBLEM SOLVING: HACKERRANK FIRST + LEETCODE */}
        <section id="problem-solving" className="glass-panel rounded-[2.2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-4 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Code2 size={20} />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-0.5">
                  {"// Verified Benchmarks"}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Algorithmic Mastery</h3>
              </div>
            </div>

            {/* Platform Switcher Buttons: HackerRank First */}
            <div className="flex items-center bg-[#090b10] p-1.5 rounded-xl border border-white/10 text-xs font-medium self-start sm:self-auto shadow-inner">
              <button
                type="button"
                onClick={() => setAlgoPlatform('hackerrank')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${algoPlatform === 'hackerrank'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                HackerRank
              </button>
              <button
                type="button"
                onClick={() => setAlgoPlatform('leetcode')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${algoPlatform === 'leetcode'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                LeetCode
              </button>
            </div>
          </div>

          {algoPlatform === 'hackerrank' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SQL 3-Star Badge Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#090b10] border border-white/10 flex flex-col justify-between gap-5 shadow-lg hover:border-emerald-500/30 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                      Relational SQL Domain
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star key={starIdx} size={16} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mt-2.5">SQL 3-Star Gold Badge</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                    Solved 24 multi-table challenges covering window functions (ROW_NUMBER, DENSE_RANK, LEAD/LAG), recursive CTEs, and aggregated joins on massive schemas.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono text-white">24 of 24 challenges solved</span>
                  <a
                    href="https://www.hackerrank.com/profile/abhi28031"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Verify Profile</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* C++ 1-Star Badge Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#090b10] border border-white/10 flex flex-col justify-between gap-5 shadow-lg hover:border-blue-500/30 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
                      Systems Language Domain
                    </span>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-amber-400 fill-amber-400" />
                      <Star size={16} className="text-zinc-700" />
                      <Star size={16} className="text-zinc-700" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mt-2.5">C++ 1-Star Badge</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                    Systems programming: pointer arithmetic, manual memory allocation, low-level data structures, and computational algorithmic complexity.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono text-white">Language proficiency verified</span>
                  <a
                    href="https://www.hackerrank.com/profile/abhi28031"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>HackerRank Handle @abhi28031</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <a
                href="https://leetcode.com/u/abhi28031/"
                target="_blank"
                rel="noreferrer"
                className="w-full max-w-xl group/leet relative block"
              >
                <div className="absolute -inset-1.5 bg-amber-500/20 rounded-2xl blur-lg opacity-0 group-hover/leet:opacity-100 transition-opacity duration-500 -z-10" />
                <img
                  src="https://leetcard.jacoblin.cool/abhi28031?theme=dark&font=Geist&ext=activity"
                  alt="LeetCode Stats @abhi28031"
                  className="w-full rounded-2xl border border-white/10 group-hover/leet:border-amber-500/30 transition-all duration-300 shadow-2xl"
                />
              </a>
            </div>
          )}
        </section>

        {/* OPEN SOURCE PROJECTS & CENTERED GITHUB STREAM */}
        <section id="projects" className="glass-panel rounded-[2.2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-5 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Terminal size={20} />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold mb-0.5">
                  {"// Repositories & Artifacts"}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Featured Projects</h3>
              </div>
            </div>
            <a
              href="https://github.com/Abhi20O1"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2 rounded-full border border-white/10 transition-colors w-fit"
            >
              <span>View GitHub @Abhi20O1</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <a
                  key={proj.id}
                  href={proj.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group/card flex flex-col bg-[#090b10] rounded-2xl p-6 border border-white/10 hover:border-indigo-500/40 hover:bg-[#0e1017] transition-all duration-300 shadow-lg relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                      {proj.language || 'Python'}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span>{proj.stars ?? 0}</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover/card:text-indigo-400 transition-colors line-clamp-1 mb-2">
                    {proj.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed flex-1 line-clamp-3">
                    {proj.description}
                  </p>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 group-hover/card:text-zinc-300 transition-colors">
                    <span>Inspect Code</span>
                    <ArrowUpRight size={14} className="text-indigo-400 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* GitHub Contribution Calendar - Centered */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#090b10] border border-white/10 flex flex-col items-center justify-center gap-4 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>GitHub Contribution Stream · @Abhi20O1</span>
            </div>
            <div
              ref={calendarScrollRef}
              className="w-full overflow-x-auto no-scrollbar pb-2 flex justify-start sm:justify-center items-center"
            >
              <div className="flex justify-center items-center mx-auto w-fit">
                <GitHubCalendar
                  username="Abhi20O1"
                  colorScheme="dark"
                  labels={{
                    totalCount: '{{count}} contributions in recent cycle'
                  }}
                  theme={{
                    dark: [
                      'rgba(255,255,255,0.03)',
                      'rgba(99,102,241,0.25)',
                      'rgba(99,102,241,0.5)',
                      'rgba(99,102,241,0.75)',
                      'rgba(99,102,241,1)'
                    ]
                  }}
                  fontSize={12}
                  blockSize={11}
                  blockMargin={3}
                />
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION & FOUNDATIONAL RESEARCH */}
        <section id="education" className="glass-panel rounded-[2.2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-5 flex flex-col gap-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-0.5">
                {"// Academic Pedigree"}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Education</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#090b10] border border-white/10 flex flex-col justify-between gap-4 hover:border-indigo-500/30 transition-all shadow-sm">
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">2025 - 2026</span>
                  <span className="text-indigo-400/90 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    Data Science Minor
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mt-2.5">Indian Institute of Technology (IIT) Guwahati</h4>
                <p className="text-sm text-indigo-300 font-medium mt-0.5">Data Science & Artificial Intelligence</p>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                  Focus: Advanced Machine Learning, Deep Neural Networks, Linear Algebra, Convex Optimization, and Probability Theory.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-[#090b10] border border-white/10 flex flex-col justify-between gap-4 hover:border-blue-500/30 transition-all shadow-sm">
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">2020 - 2024</span>
                  <span className="text-blue-400/90 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                    Undergraduate Degree
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mt-2.5">JSS Academy of Technical Education, Noida</h4>
                <p className="text-sm text-blue-300 font-medium mt-0.5">B.Tech in Computer Science & Engineering</p>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                  Focus: Data Structures & Algorithms, Distributed Systems, Operating Systems, Database Management and System Networks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CONTACT & COMMUNICATION */}
        <section id="contact" className="glass-panel rounded-[2.2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-6 scroll-mt-24">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
            <div className="flex-1 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span>Direct Communication</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Let's Build Together</h3>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-md">
                  I'm actively open to full-time AI Engineering, Data Science, and Machine Learning systems roles. Whether you have an open role or a challenging problem, let's connect.
                </p>
              </div>

              <div className="flex flex-col gap-3.5 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-indigo-400" />
                  <span className="text-zinc-300">abhi28031@gmail.com</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MessageCircle size={15} className="text-emerald-400" />
                  <span className="text-zinc-300">+91 8126684451 (WhatsApp Available)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-amber-400" />
                  <span className="text-zinc-300">New Delhi, India (Open to Relocation & Remote)</span>
                </div>
              </div>
            </div>

            <div className="flex-[1.4] w-full bg-[#090b10] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs font-medium">
                    {formError}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="name" className="text-xs text-zinc-400 font-medium mb-1.5 block">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      value={contactName}
                      onChange={(e) => { setContactName(e.target.value); if (formError) setFormError(""); }}
                      placeholder="e.g. Alex Rivera"
                      className="w-full bg-[#0e1017] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="email" className="text-xs text-zinc-400 font-medium mb-1.5 block">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      value={contactEmail}
                      onChange={(e) => { setContactEmail(e.target.value); if (formError) setFormError(""); }}
                      placeholder="e.g. alex@company.com"
                      className="w-full bg-[#0e1017] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="text-xs text-zinc-400 font-medium mb-1.5 block">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => { setContactMessage(e.target.value); if (formError) setFormError(""); }}
                    placeholder="Tell me about the role, project, or machine learning problem..."
                    className="w-full bg-[#0e1017] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner resize-none"
                    required
                  />
                </div>
                <div className="mt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] cursor-pointer active:scale-95"
                  >
                    <MessageCircle size={15} />
                    <span>Send via WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-zinc-950 hover:bg-zinc-100 px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer active:scale-95"
                  >
                    <Send size={15} />
                    <span>Send via Email</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10">
            <img src={`${import.meta.env.BASE_URL}Logo.webp`} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-medium text-zinc-300">Abhishek Singh · AI & Data Science Engineer</span>
        </div>

        <div className="flex items-center gap-5">
          <a href="https://github.com/Abhi20O1" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/abhishek-singh-sd" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            LinkedIn
          </a>
          <a href="https://www.hackerrank.com/profile/abhi28031" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            HackerRank
          </a>
          <a href="https://leetcode.com/u/abhi28031/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            LeetCode
          </a>
          <a href={`mailto:${email}`} className="hover:text-white transition-colors">
            Email
          </a>
        </div>
      </footer>
    </div>
  );
}
