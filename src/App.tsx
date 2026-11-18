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
  GraduationCap
} from 'lucide-react';

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
      document.querySelectorAll(".fade-in-entry").forEach((el) => {
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
    <div className="min-h-screen bg-[#090a0d] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-white">
      <div className="subtle-noise" />

      {/* TOP NAVIGATION */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#090a0d]/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#about" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/15 bg-zinc-900 flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}Logo.webp`}
                alt="Abhishek Singh"
                className="w-full h-full object-cover"
                width={32}
                height={32}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Abhishek Singh
              </span>
              <span className="text-[11px] text-zinc-400 hidden sm:block">AI Engineer & Data Scientist</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-300 font-medium">
            <a href="#about" className="hover:text-white transition-colors">Overview</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#problem-solving" className="hover:text-white transition-colors">Problem Solving</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#education" className="hover:text-white transition-colors">Education</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white px-3 py-1.5 rounded-md border border-white/10 hover:border-white/20 transition-colors"
            >
              {copiedEmail ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedEmail ? 'Copied' : 'Email'}</span>
            </button>
            <a
              href="#contact"
              onClick={scrollToContact}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 px-3.5 py-1.5 rounded-md transition-colors"
            >
              <MessageCircle size={13} className="fill-zinc-950" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-20 flex flex-col gap-20 sm:gap-28">

        {/* HERO SECTION */}
        <section id="about" className="fade-in-entry">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Identity & Bio */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="text-xs text-emerald-400 font-medium">
                Available for full-time AI/ML roles
              </div>

              <div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
                  Abhishek Singh
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-zinc-300 mt-2 sm:mt-3">
                  AI Engineer & Data Scientist
                </h2>
              </div>

              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                Specialized in <span className="text-white font-medium">Data Cleaning & Feature Engineering</span>, scalable <span className="text-white font-medium">System Architecture Design</span>, and high-performance ML pipelines across Healthcare, and Computer Vision.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 items-center pt-2">
                <a
                  href="#contact"
                  onClick={scrollToContact}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm transition-colors"
                >
                  <Send size={14} />
                  <span>Get in Touch</span>
                </a>
                <a
                  href={`${import.meta.env.BASE_URL}resume.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-white/20 hover:border-white/40 text-zinc-200 hover:text-white text-sm font-medium transition-colors"
                >
                  <FileText size={14} />
                  <span>Resume</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/abhishek-singh-sd"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-md border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-sm transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight size={14} className="text-zinc-400" />
                </a>
                <a
                  href="https://github.com/Abhi20O1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-md border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-sm transition-colors"
                >
                  <span>GitHub</span>
                  <ArrowUpRight size={14} className="text-zinc-400" />
                </a>
              </div>

              {/* Verified Credentials Strip */}
              <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-indigo-400 shrink-0" />
                  <span className="text-zinc-200 font-medium">Data Science Trainee · Arcap REIT</span>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-white/[0.08] sm:pl-4 flex items-center">
                  <span>IIT Guwahati (Data Science)</span>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-white/[0.08] sm:pl-4 flex items-center">
                  <span>HackerRank 3★ SQL Gold Rank</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Portrait */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
              <figure className="w-full max-w-sm">
                <div className="rounded-2xl overflow-hidden border border-white/15 bg-zinc-900 shadow-xl aspect-[4/5]">
                  <img
                    src={`${import.meta.env.BASE_URL}robo.webp`}
                    alt="Abhishek Singh"
                    className="w-full h-full object-cover object-top"
                    width={400}
                    height={500}
                  />
                </div>
                <figcaption className="mt-3 text-xs text-zinc-400 text-center lg:text-left">
                  Abhishek Singh — Data Science Trainee at Arcap REIT
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        <section id="experience" className="pt-12 border-t border-white/[0.08] fade-in-entry">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-white/5 border border-white/10 text-indigo-400">
                <Briefcase size={18} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Work Experience</h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">Professional machine learning and data engineering tenure</p>
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Aug 2025 – Jan 2026
            </span>
          </div>

          <div className="border-l-2 border-indigo-500/40 pl-6 sm:pl-8 ml-2 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Arcap REIT AI Solution
                </h4>
                <div className="text-sm font-medium text-indigo-400 mt-0.5">
                  Data Scientist trainee
                </div>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Aug 2025 – Jan 2026
              </span>
            </div>

            <ul className="flex flex-col gap-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">●</span>
                <span>
                  <strong className="text-white font-semibold">Data Pipeline Development:</strong> Developed automated data cleaning pipelines using Python and R, reducing manual data preparation time by 30%.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">●</span>
                <span>
                  <strong className="text-white font-semibold">Feature Engineering:</strong> Implementing advanced preprocessing techniques including categorical encoding, datetime extraction, and scaling/normalization to optimize data for machine learning models.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">●</span>
                <span>
                  <strong className="text-white font-semibold">ML System Architecture:</strong> Designing end-to-end cloud-based AI architecture using AWS (S3, SageMaker) and Azure for scenarios like Patient Risk Prediction.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">●</span>
                <span>
                  <strong className="text-white font-semibold">Model Deployment:</strong> Deployed Random Forest and CNN models via Flask, ensuring scalability and monitoring.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* CORE TECHNICAL COMPETENCIES */}
        <section id="skills" className="pt-12 border-t border-white/[0.08] fade-in-entry">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-md bg-white/5 border border-white/10 text-blue-400">
              <Cpu size={18} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Technical Stack & Toolkit</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">Foundational frameworks, libraries, and infrastructure</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0c0e12] flex flex-col gap-3">
              <span className="text-xs font-semibold text-indigo-300">
                Deep Learning & LLMs
              </span>
              <div className="flex flex-wrap gap-2">
                {['PyTorch', 'Transformers', 'LLM', 'Hugging Face', 'Scikit-learn'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0c0e12] flex flex-col gap-3">
              <span className="text-xs font-semibold text-blue-300">
                Multimodal & Document AI
              </span>
              <div className="flex flex-wrap gap-2">
                {['OpenCV', 'YOLO', 'LangChain', 'LlamaIndex'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0c0e12] flex flex-col gap-3">
              <span className="text-xs font-semibold text-emerald-300">
                Databases & Vector Stores
              </span>
              <div className="flex flex-wrap gap-2">
                {['PostgreSQL', 'pgvector', 'Redis', 'SQL'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0c0e12] flex flex-col gap-3">
              <span className="text-xs font-semibold text-purple-300">
                Systems & Cloud Infra
              </span>
              <div className="flex flex-wrap gap-2">
                {['Python', 'C++', 'FastAPI', 'Docker', 'AWS (S3, SageMaker)', 'Linux', 'Git'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ALGORITHMIC PROBLEM SOLVING */}
        <section id="problem-solving" className="pt-12 border-t border-white/[0.08] fade-in-entry">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-white/5 border border-white/10 text-emerald-400">
                <Code2 size={18} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Algorithmic Problem Solving</h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">Verified problem solving across complex SQL queries and algorithms</p>
              </div>
            </div>

            <div className="flex items-center p-1 rounded-md border border-white/10 bg-[#0c0e12] text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setAlgoPlatform('hackerrank')}
                className={`px-3 py-1.5 rounded transition-colors ${algoPlatform === 'hackerrank'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
                  }`}
              >
                HackerRank
              </button>
              <button
                type="button"
                onClick={() => setAlgoPlatform('leetcode')}
                className={`px-3 py-1.5 rounded transition-colors ${algoPlatform === 'leetcode'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
                  }`}
              >
                LeetCode
              </button>
            </div>
          </div>

          {algoPlatform === 'hackerrank' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SQL 3-Star Badge Card */}
              <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0c0e12] flex flex-col justify-between gap-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-emerald-400">Relational SQL Domain</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star key={starIdx} size={15} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mt-2">SQL 3-Star Gold Badge</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                    Solved 24 multi-table challenges covering window functions (ROW_NUMBER, DENSE_RANK, LEAD/LAG), recursive CTEs, and aggregated joins on massive schemas.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono text-zinc-200">24 of 24 challenges solved</span>
                  <a
                    href="https://www.hackerrank.com/profile/abhi28031"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Verify Profile</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* C++ 1-Star Badge Card */}
              <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0c0e12] flex flex-col justify-between gap-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-400">Systems Language Domain</span>
                    <div className="flex items-center gap-1">
                      <Star size={15} className="text-amber-400 fill-amber-400" />
                      <Star size={15} className="text-zinc-700" />
                      <Star size={15} className="text-zinc-700" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mt-2">C++ 1-Star Badge</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                    Systems programming: pointer arithmetic, manual memory allocation, low-level data structures, and computational algorithmic complexity.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono text-zinc-200">Language proficiency verified</span>
                  <a
                    href="https://www.hackerrank.com/profile/abhi28031"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
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
                className="w-full max-w-xl block"
              >
                <img
                  src="https://leetcard.jacoblin.cool/abhi28031?theme=dark&font=Geist&ext=activity"
                  alt="LeetCode Stats @abhi28031"
                  className="w-full rounded-xl border border-white/[0.08] shadow-lg hover:border-amber-400/40 transition-colors"
                  width={600}
                  height={300}
                />
              </a>
            </div>
          )}
        </section>

        {/* FEATURED PROJECTS & CENTERED GITHUB STREAM */}
        <section id="projects" className="pt-12 border-t border-white/[0.08] fade-in-entry">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-white/5 border border-white/10 text-purple-400">
                <Terminal size={18} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Featured Projects</h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">Open source machine learning architectures and repositories</p>
              </div>
            </div>
            <a
              href="https://github.com/Abhi20O1"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-zinc-300 hover:text-white inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 hover:border-white/20 transition-colors w-fit"
            >
              <span>GitHub @Abhi20O1</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <a
                  key={proj.id}
                  href={proj.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col p-6 rounded-xl border border-white/[0.08] bg-[#0c0e12] hover:bg-[#12141a] hover:border-white/20 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-medium text-indigo-300 bg-white/5 px-2.5 py-1 rounded">
                      {proj.language || 'Python'}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span>{proj.stars ?? 0}</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">
                    {proj.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed flex-1 line-clamp-3">
                    {proj.description}
                  </p>

                  <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 hover:text-white transition-colors">
                    <span>Inspect Code</span>
                    <ArrowUpRight size={14} className="text-zinc-400" />
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Centered GitHub Contribution Calendar */}
          <div className="mt-8 p-6 sm:p-8 rounded-xl border border-white/[0.08] bg-[#0c0e12] flex flex-col items-center justify-center gap-4">
            <div className="text-xs text-zinc-400 font-medium">
              GitHub Contribution Stream · @Abhi20O1
            </div>
            <div
              ref={calendarScrollRef}
              className="w-full overflow-x-auto pb-2 flex justify-start sm:justify-center items-center"
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
        <section id="education" className="pt-12 border-t border-white/[0.08] fade-in-entry">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-md bg-white/5 border border-white/10 text-amber-400">
              <GraduationCap size={18} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Education</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">Academic background and coursework</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0c0e12] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>2025 – 2026</span>
                  <span className="text-indigo-300">Data Science Minor</span>
                </div>
                <h4 className="text-lg font-bold text-white mt-2">Indian Institute of Technology (IIT) Guwahati</h4>
                <p className="text-sm text-indigo-300 font-medium mt-0.5">Data Science & Artificial Intelligence</p>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                  Focus: Advanced Machine Learning, Deep Neural Networks, Linear Algebra, Convex Optimization, and Probability Theory.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0c0e12] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>2020 – 2024</span>
                  <span className="text-blue-300">Undergraduate Degree</span>
                </div>
                <h4 className="text-lg font-bold text-white mt-2">JSS Academy of Technical Education, Noida</h4>
                <p className="text-sm text-blue-300 font-medium mt-0.5">B.Tech in Computer Science & Engineering</p>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                  Focus: Data Structures & Algorithms, Distributed Systems, Operating Systems, Database Management and System Networks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CONTACT & COMMUNICATION */}
        <section id="contact" className="pt-12 border-t border-white/[0.08] fade-in-entry scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div>
                <div className="text-xs text-indigo-400 font-semibold mb-1">
                  Direct Communication
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Let's Build Together</h3>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  I'm actively open to full-time AI Engineering, Data Science, and Machine Learning systems roles. Whether you have an open role or a challenging problem, let's connect.
                </p>
              </div>

              <div className="flex flex-col gap-3 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-indigo-400" />
                  <span className="text-zinc-200">abhi28031@gmail.com</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MessageCircle size={15} className="text-emerald-400" />
                  <span className="text-zinc-200">+91 8126684451 (WhatsApp Available)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-amber-400" />
                  <span className="text-zinc-200">New Delhi, India (Open to Relocation & Remote)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 rounded-xl border border-white/[0.08] bg-[#0c0e12]">
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-md text-xs font-medium">
                    {formError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-xs text-zinc-400 font-medium mb-1 block">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      value={contactName}
                      onChange={(e) => { setContactName(e.target.value); if (formError) setFormError(""); }}
                      placeholder="e.g. Alex Rivera"
                      className="w-full bg-[#14161f] border border-white/10 rounded-md px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-xs text-zinc-400 font-medium mb-1 block">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      value={contactEmail}
                      onChange={(e) => { setContactEmail(e.target.value); if (formError) setFormError(""); }}
                      placeholder="e.g. alex@company.com"
                      className="w-full bg-[#14161f] border border-white/10 rounded-md px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-400 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="text-xs text-zinc-400 font-medium mb-1 block">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => { setContactMessage(e.target.value); if (formError) setFormError(""); }}
                    placeholder="Tell me about the role, project, or machine learning problem..."
                    className="w-full bg-[#14161f] border border-white/10 rounded-md px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                    required
                  />
                </div>
                <div className="mt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-4 py-2.5 rounded-md font-semibold text-xs transition-colors"
                  >
                    <MessageCircle size={15} />
                    <span>Send via WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-5 py-2.5 rounded-md font-semibold text-xs transition-colors"
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
      <footer className="border-t border-white/[0.08] bg-[#07080a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10">
              <img
                src={`${import.meta.env.BASE_URL}Logo.webp`}
                alt="Logo"
                className="w-full h-full object-cover"
                width={24}
                height={24}
              />
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
        </div>
      </footer>
    </div>
  );
}
