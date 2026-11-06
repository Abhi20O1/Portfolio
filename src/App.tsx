import { useState, useEffect, useRef } from 'react';
import { GitHubCalendar, type Activity as GitHubActivity } from 'react-github-calendar';
import {
  Mail,
  MessageCircle,
  MapPin,
  Code2,
  ArrowRight,
  Network,
  Database,
  LineChart,
  Cpu,
  Terminal,
  Send,
  FileText,
  Star,
  Layers,
  ArrowUpRight
} from 'lucide-react';

/* Interactive Latent Space Attention Visualizer */
function LatentSpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [queryPoint, setQueryPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 280);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Feature embedding nodes in 2D projection
    const numNodes = 28;
    const nodes = Array.from({ length: numNodes }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2 + 2,
    }));

    let mouseX = -1000;
    let mouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      setQueryPoint({
        x: Number(((mouseX / width) * 2 - 1).toFixed(2)),
        y: Number((1 - (mouseY / height) * 2).toFixed(2)),
      });
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      setQueryPoint(null);
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Coordinate axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Node iteration
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        // Draw pairwise similarity connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 85) {
            ctx.strokeStyle = `rgba(125, 175, 255, ${((1 - dist / 85) * 0.22).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Base node
        ctx.fillStyle = 'rgba(235, 240, 250, 0.6)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Attention connection to mouse query vector
        const dMouse = Math.hypot(mouseX - node.x, mouseY - node.y);
        if (dMouse < 135) {
          const alpha = ((1 - dMouse / 135) * 0.75).toFixed(3);
          ctx.strokeStyle = `rgba(245, 185, 65, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();

          // Attention highlight on node
          ctx.fillStyle = 'rgba(245, 185, 65, 0.9)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Cursor query node
      if (mouseX > 0 && mouseY > 0) {
        ctx.fillStyle = 'rgb(245, 185, 65)';
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(245, 185, 65, 0.35)';
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] rounded-card bg-paper-3 border border-rule overflow-hidden flex flex-col justify-between p-4 group">
      <div className="flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true"></span>
          <span className="text-xs font-mono text-ink-2">Embedding Space: R^64</span>
        </div>
        <span className="text-xs font-mono text-muted">
          {queryPoint ? `Q: [${queryPoint.x}, ${queryPoint.y}]` : 'Interactive: move cursor'}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive neural attention and vector projection canvas"
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />

      <div className="flex items-center justify-between text-xs font-mono text-muted z-10 pointer-events-none border-t border-rule pt-2">
        <span>Metric: Cosine Similarity</span>
        <span className="text-accent font-medium">Multi-Head Attention Simulation</span>
      </div>
    </div>
  );
}

export default function App() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarRange, setCalendarRange] = useState<'6months' | 'year'>('6months');
  const [algoPlatform, setAlgoPlatform] = useState<'hackerrank' | 'leetcode'>('hackerrank');
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);
  const calendarScrollRef = useRef<HTMLDivElement>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [formError, setFormError] = useState("");

  const selectLastHalfYear = (contributions: GitHubActivity[]) => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 6);
    const cutoffStr = cutoffDate.toISOString().slice(0, 10);
    return contributions.filter((activity) => activity.date >= cutoffStr);
  };

  useEffect(() => {
    const el = calendarScrollRef.current;
    if (!el) return;

    const scrollToLatest = () => {
      el.scrollLeft = el.scrollWidth;
    };

    scrollToLatest();
    const observer = new MutationObserver(scrollToLatest);
    observer.observe(el, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [calendarRange]);

  const handleEmailSubmit = () => {
    if (!contactName) return setFormError("Please enter your name.");
    if (!contactEmail) return setFormError("Please enter your email.");
    if (!contactMessage) return setFormError("Please enter a message.");
    setFormError("");

    const emailStr = contactEmail ? ` (${contactEmail})` : "";
    const subject = `Portfolio enquiry from ${contactName}${emailStr}`;
    window.location.href = `mailto:abhi28031@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(contactMessage)}`;
  };

  const handleWhatsAppSubmit = () => {
    if (!contactName) return setFormError("Please enter your name.");
    if (!contactEmail) return setFormError("Please enter your email.");
    if (!contactMessage) return setFormError("Please enter a message.");
    setFormError("");

    const intro = `Hi, I am ${contactName}${contactEmail ? ` (${contactEmail})` : ''} reaching out from your portfolio.`;
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
    async function fetchProjects() {
      try {
        const res = await fetch('https://api.github.com/users/Abhi20O1/repos');
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("GitHub API limit exceeded");
        }

        const filtered = data.filter((r: any) => r.name !== 'Abhi20O1' && r.name.toLowerCase() !== 'fastapi' && !r.fork);
        const reposWithReadme = await Promise.all(
          filtered.map(async (repo: any) => {
            let readmeText = "";
            try {
              let readmeRes = await fetch(`https://raw.githubusercontent.com/Abhi20O1/${repo.name}/main/README.md`);
              if (!readmeRes.ok) readmeRes = await fetch(`https://raw.githubusercontent.com/Abhi20O1/${repo.name}/master/README.md`);
              if (readmeRes.ok) {
                const text = await readmeRes.text();
                const lines = text.split('\n');
                for (const line of lines) {
                  const cleanLine = line.trim();
                  if (cleanLine && !cleanLine.startsWith('#') && !cleanLine.startsWith('[') && !cleanLine.startsWith('<') && !cleanLine.startsWith('!')) {
                    readmeText = cleanLine;
                    break;
                  }
                }
              }
            } catch (e) { }
            if (readmeText.length > 120) readmeText = readmeText.substring(0, 117) + "…";

            return {
              id: repo.id,
              title: repo.name.replace(/[-_]/g, ' '),
              html_url: repo.html_url,
              language: repo.language,
              stargazers_count: repo.stargazers_count,
              description: readmeText || repo.description || "Open source machine learning project."
            };
          })
        );

        setProjects([
          {
            id: 'chatbot',
            title: 'Healthcare Chatbot',
            html_url: '#',
            language: 'Python',
            stargazers_count: 1,
            description: 'Healthcare chatbot that handles patient support 24/7 using AWS Lex, Lambda, and DynamoDB.'
          },
          ...reposWithReadme.filter(r => r.title.toLowerCase() !== 'healthcare chatbot')
        ]);
      } catch (err) {
        setProjects([
          {
            id: 'chatbot',
            title: 'Healthcare Chatbot',
            html_url: '#',
            language: 'Python',
            stargazers_count: 1,
            description: 'Healthcare chatbot that handles patient support 24/7 using AWS Lex, Lambda, and DynamoDB.'
          },
          {
            id: 'portfolio',
            title: 'Portfolio Website',
            html_url: 'https://github.com/Abhi20O1/Portfolio',
            language: 'TypeScript',
            stargazers_count: 1,
            description: 'Personal portfolio website built with React, Vite, and Tailwind CSS.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const pipelineStages = [
    {
      title: "01: Ingestion & Pipelines",
      shortTitle: "Ingestion",
      toolchain: "Python, R, Pandas, Shell Scripts",
      summary: "Engineered automated ETL pipelines for raw real-estate data ingestion, handling missing value imputations and categorical feature encoding.",
      metric: "30% reduction in preparation runtime"
    },
    {
      title: "02: Distributed Training",
      shortTitle: "Architecture",
      toolchain: "AWS SageMaker, S3, Azure ML, Scikit-Learn",
      summary: "Trained Random Forest and Convolutional Neural Network architectures on cloud storage clusters with rigorous k-fold cross-validation.",
      metric: "Evaluated across multi-region cloud buckets"
    },
    {
      title: "03: Model Serving & APIs",
      shortTitle: "Deployment",
      toolchain: "Flask, Docker, RESTful Endpoints",
      summary: "Packaged trained model artifacts behind robust Flask endpoints to deliver real-time inference latency for production decision engines.",
      metric: "Sub-100ms endpoint response"
    }
  ];

  return (
    <div className="min-h-screen bg-paper text-ink pb-16 selection:bg-accent-soft selection:text-ink">
      {/* Precision Topbar */}
      <header className="sticky top-0 z-50 bg-paper border-b border-rule">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-rule-2 bg-paper-3 flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}Logo.webp`}
                alt="Abhishek Singh logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink leading-none">Abhishek Singh</p>
              <p className="text-[11px] font-mono text-muted mt-1">28.61° N, 77.20° E: New Delhi</p>
            </div>
          </div>

          <nav className="flex items-center gap-4 sm:gap-6">
            <a
              href="https://github.com/Abhi20O1"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="text-muted hover:text-ink transition-colors p-1"
            >
              <svg role="img" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            </a>
            <a
              href="https://www.hackerrank.com/profile/abhi28031"
              target="_blank"
              rel="noreferrer"
              aria-label="HackerRank profile"
              className="text-muted hover:text-ink transition-colors p-1"
            >
              <svg role="img" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path d="M0 0v24h24V0zm9.95 8.002h1.805c.061 0 .111.05.111.111v7.767c0 .061-.05.111-.11.111H9.95c-.061 0-.111-.05-.111-.11v-2.87H7.894v2.87c0 .06-.05.11-.11.11H5.976a.11.11 0 01-.11-.11V8.112c0-.06.05-.11.11-.11h1.806c.061 0 .11.05.11.11v2.869H9.84v-2.87c0-.06.05-.11.11-.11zm2.999 0h5.778c.061 0 .111.05.111.11v7.767a.11.11 0 01-.11.112h-5.78a.11.11 0 01-.11-.11V8.111c0-.06.05-.11.11-.11z"/></svg>
            </a>
            <a
              href="https://www.linkedin.com/in/abhishek-singh-sd"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="text-muted hover:text-ink transition-colors p-1"
            >
              <svg role="img" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a
              href="#contact"
              onClick={scrollToContact}
              className="px-3.5 py-1.5 rounded-pill bg-accent text-accent-ink text-xs font-semibold hover:opacity-95 transition-opacity"
            >
              Let’s talk
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-12">
        {/* HERO: Asymmetric Editorial + Interactive Latent Canvas */}
        <section className="console-panel p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-paper-3 border border-rule text-xs text-muted mb-5">
                <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true"></span>
                <span>Data Science & AI Engineer: Open to full-time roles</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink mb-2">
                Abhishek Singh
              </h1>
              <p className="text-lg sm:text-xl text-cool font-normal mb-5">
                Specialized in Machine Learning Models and Data Pipelines
              </p>

              <p className="text-muted text-base leading-relaxed mb-6 max-w-xl">
                Building production machine learning models and automated data pipelines from real-world data.
              </p>

              {/* Verified Credentials Ticker */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-rule my-6 text-xs">
                <div>
                  <p className="text-muted font-medium">IIT Guwahati</p>
                  <p className="text-ink font-mono text-[11px] mt-0.5">Data Science</p>
                </div>
                <div>
                  <p className="text-muted font-medium">HackerRank</p>
                  <p className="text-ink font-mono text-[11px] mt-0.5">3 Stars SQL (24 Solved)</p>
                </div>
                <div>
                  <p className="text-muted font-medium">Arcap REIT AI</p>
                  <p className="text-ink font-mono text-[11px] mt-0.5">Trainee (30% Faster ETL)</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <a
                  href="#contact"
                  onClick={scrollToContact}
                  className="px-5 py-2.5 rounded-pill bg-accent text-accent-ink text-sm font-semibold hover:opacity-95 transition-opacity"
                >
                  Contact Me
                </a>
                <a
                  href={`${import.meta.env.BASE_URL}resume.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-pill bg-paper-3 border border-rule-2 text-ink text-sm font-medium hover:border-muted transition-colors flex items-center gap-2"
                >
                  <FileText size={15} aria-hidden="true" /> Resume
                </a>
                <a
                  href="https://www.linkedin.com/in/abhishek-singh-sd"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 rounded-pill text-muted hover:text-ink text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  LinkedIn <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Interactive Neural Attention Visualizer */}
            <div className="lg:col-span-5">
              <LatentSpaceCanvas />
            </div>
          </div>
        </section>

        {/* CORE EXPERTISE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Network size={18} className="text-muted" aria-hidden="true" />
            <h3 className="text-lg font-medium text-ink">Technical Competencies</h3>
          </div>

          <div className="console-panel p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2.5">
              <p className="text-xs text-cool font-mono">01: ML & Deep Learning</p>
              <div className="flex flex-wrap gap-1.5">
                {['TensorFlow', 'PyTorch', 'Scikit-Learn', 'Keras', 'AWS SageMaker', 'OpenCV', 'YOLO', 'LLMs', 'Pandas'].map((skill) => (
                  <span key={skill} className="px-2 py-0.5 rounded bg-paper-3 border border-rule text-xs font-mono text-ink-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs text-cool font-mono">02: Data Engineering</p>
              <div className="flex flex-wrap gap-1.5">
                {['SQL', 'Flask', 'Azure', 'Linux', 'Git', 'Data Pipelines'].map((skill) => (
                  <span key={skill} className="px-2 py-0.5 rounded bg-paper-3 border border-rule text-xs font-mono text-ink-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs text-cool font-mono">03: Languages</p>
              <div className="flex flex-wrap gap-1.5">
                {['Python', 'C++', 'SQL', 'JavaScript', 'TypeScript', 'C#'].map((skill) => (
                  <span key={skill} className="px-2 py-0.5 rounded bg-paper-3 border border-rule text-xs font-mono text-ink-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs text-cool font-mono">04: Dashboards & Web</p>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'Vite', 'MongoDB'].map((skill) => (
                  <span key={skill} className="px-2 py-0.5 rounded bg-paper-3 border border-rule text-xs font-mono text-ink-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE ARCHITECTURAL PIPELINE (EXPERIENCE) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-muted" aria-hidden="true" />
              <h3 className="text-lg font-medium text-ink">Production System Architecture</h3>
            </div>
            <span className="text-xs font-mono text-muted">Arcap REIT AI Solution (Aug 2025 to Jan 2026)</span>
          </div>

          <div className="console-panel p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rule pb-4">
              <div>
                <h4 className="text-base font-semibold text-ink">Data Scientist Trainee</h4>
                <p className="text-xs text-muted mt-0.5">End-to-End Real-Estate ML Infrastructure</p>
              </div>
              <div className="flex items-center gap-1.5">
                {pipelineStages.map((stage, idx) => (
                  <button
                    key={stage.shortTitle}
                    type="button"
                    onClick={() => setActivePipelineStage(idx)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      activePipelineStage === idx
                        ? 'bg-accent text-accent-ink font-semibold'
                        : 'bg-paper-3 text-muted hover:text-ink border border-rule'
                    }`}
                  >
                    {stage.shortTitle}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Stage Detailed Breakdown */}
            <div className="console-subpanel p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <span className="text-xs font-mono text-accent">Stage {pipelineStages[activePipelineStage].title}</span>
                <p className="text-sm text-ink leading-relaxed font-medium">
                  {pipelineStages[activePipelineStage].summary}
                </p>
                <p className="text-xs font-mono text-muted pt-1">
                  Toolchain: {pipelineStages[activePipelineStage].toolchain}
                </p>
              </div>
              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-rule pt-3 md:pt-0 md:pl-5 space-y-1">
                <p className="text-xs text-muted font-medium">Verified Metric</p>
                <p className="text-sm font-semibold text-cool font-mono">
                  {pipelineStages[activePipelineStage].metric}
                </p>
              </div>
            </div>

            {/* Stage Cards Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="console-subpanel p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-ink mb-1.5">
                  <Database size={15} className="text-cool" aria-hidden="true" />
                  <span>Automated Data Cleaning</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Built automated Python and R data cleaning pipelines, cutting data preparation time by 30%.
                </p>
              </div>

              <div className="console-subpanel p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-ink mb-1.5">
                  <Cpu size={15} className="text-cool" aria-hidden="true" />
                  <span>Cloud Architecture</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Designed and deployed cloud ML pipelines across AWS (S3, SageMaker) and Azure.
                </p>
              </div>

              <div className="console-subpanel p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-ink mb-1.5">
                  <Terminal size={15} className="text-cool" aria-hidden="true" />
                  <span>API Serving</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Deployed Random Forest and CNN models behind Flask APIs for production workloads.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION & LOCATION */}
        <section className="console-panel p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LineChart size={18} className="text-muted" aria-hidden="true" />
                <h3 className="text-base font-semibold text-ink">Academic Formation</h3>
              </div>
              <div className="space-y-4 pt-1">
                <div className="console-subpanel p-3.5">
                  <p className="text-xs font-semibold text-ink">IIT Guwahati & Daksh Gurukul</p>
                  <p className="text-xs text-muted mt-0.5">Data Science Specialization (2025 to 2026)</p>
                </div>
                <div className="console-subpanel p-3.5">
                  <p className="text-xs font-semibold text-ink">JSS Academy of Technical Education, Noida</p>
                  <p className="text-xs text-muted mt-0.5">B.Tech Computer Science & Engineering (2020 to 2024)</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-muted" aria-hidden="true" />
                <h3 className="text-base font-semibold text-ink">Geographic Deployment</h3>
              </div>
              <div className="console-subpanel p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">New Delhi, India</span>
                  <span className="text-xs font-mono text-cool bg-paper-2 px-2 py-0.5 rounded border border-rule">UTC+5:30</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Available for global remote software engineering roles, hybrid positions, and technical contract research.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS (DYNAMIC GITHUB API) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-muted" aria-hidden="true" />
              <h3 className="text-lg font-medium text-ink">Model Repositories & Engineering</h3>
            </div>
            <a
              href="https://github.com/Abhi20O1"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-muted hover:text-ink transition-colors flex items-center gap-1"
            >
              All repositories <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>

          {loading ? (
            <div className="console-panel p-12 flex justify-center">
              <span className="text-xs font-mono text-muted">Loading repositories…</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((proj) => (
                <a
                  key={proj.id}
                  href={proj.html_url !== '#' ? proj.html_url : undefined}
                  target={proj.html_url !== '#' ? "_blank" : undefined}
                  rel="noreferrer"
                  className="console-panel p-5 flex flex-col justify-between hover:border-rule-2 transition-colors group block"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono text-muted bg-paper-3 px-2 py-0.5 rounded border border-rule">
                        {proj.language || 'Code'}
                      </span>
                      {proj.html_url !== '#' && (
                        <ArrowUpRight size={14} className="text-muted group-hover:text-accent transition-colors" aria-hidden="true" />
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors line-clamp-1">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-rule flex items-center justify-between text-xs text-muted font-mono">
                    <span>Repository</span>
                    <span className="text-ink-2 group-hover:text-accent transition-colors">Inspect source →</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* ACTIVITY & CODING ENGINES */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* GitHub Activity Calendar */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-medium text-ink">GitHub Commit Activity</h3>
              <div className="flex items-center gap-1 bg-paper-3 p-1 rounded-md border border-rule text-xs">
                <button
                  type="button"
                  onClick={() => setCalendarRange('6months')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    calendarRange === '6months' ? 'bg-paper-2 text-ink font-medium' : 'text-muted hover:text-ink'
                  }`}
                >
                  6 Months
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarRange('year')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    calendarRange === 'year' ? 'bg-paper-2 text-ink font-medium' : 'text-muted hover:text-ink'
                  }`}
                >
                  Full Year
                </button>
              </div>
            </div>

            <div className="console-panel p-6 flex flex-col justify-center overflow-hidden">
              <div
                ref={calendarScrollRef}
                className="w-full overflow-x-auto no-scrollbar pb-2 flex justify-start sm:justify-center"
              >
                <div className="min-w-fit pr-2">
                  <GitHubCalendar
                    username="Abhi20O1"
                    colorScheme="dark"
                    transformData={calendarRange === '6months' ? selectLastHalfYear : undefined}
                    labels={
                      calendarRange === '6months'
                        ? { totalCount: '{{count}} contributions in the last 6 months' }
                        : undefined
                    }
                    theme={{
                      dark: [
                        'oklch(13.5% 0.007 250)',
                        'oklch(29% 0.05 245)',
                        'oklch(52% 0.1 245)',
                        'oklch(77% 0.12 245)',
                        'oklch(82% 0.15 80)'
                      ],
                    }}
                    style={{ color: 'var(--color-muted)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Problem Solving: HackerRank & LeetCode */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-medium text-ink">Problem Solving Profiles</h3>
              <div className="flex items-center gap-1 bg-paper-3 p-1 rounded-md border border-rule text-xs">
                <button
                  type="button"
                  onClick={() => setAlgoPlatform('hackerrank')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    algoPlatform === 'hackerrank' ? 'bg-paper-2 text-ink font-medium' : 'text-muted hover:text-ink'
                  }`}
                >
                  HackerRank
                </button>
                <button
                  type="button"
                  onClick={() => setAlgoPlatform('leetcode')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    algoPlatform === 'leetcode' ? 'bg-paper-2 text-ink font-medium' : 'text-muted hover:text-ink'
                  }`}
                >
                  LeetCode
                </button>
              </div>
            </div>

            <div className="console-panel p-6 flex flex-col justify-center min-h-[195px]">
              {algoPlatform === 'hackerrank' ? (
                <a
                  href="https://www.hackerrank.com/profile/abhi28031"
                  target="_blank"
                  rel="noreferrer"
                  className="space-y-4 group block"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-paper-3 border border-rule flex items-center justify-center text-ok">
                        <svg role="img" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M0 0v24h24V0zm9.95 8.002h1.805c.061 0 .111.05.111.111v7.767c0 .061-.05.111-.11.111H9.95c-.061 0-.111-.05-.111-.11v-2.87H7.894v2.87c0 .06-.05.11-.11.11H5.976a.11.11 0 01-.11-.11V8.112c0-.06.05-.11.11-.11h1.806c.061 0 .11.05.11.11v2.869H9.84v-2.87c0-.06.05-.11.11-.11zm2.999 0h5.778c.061 0 .111.05.111.11v7.767a.11.11 0 01-.11.112h-5.78a.11.11 0 01-.11-.11V8.111c0-.06.05-.11.11-.11z"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">HackerRank</p>
                        <p className="text-xs font-mono text-muted">@abhi28031</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted group-hover:text-accent transition-colors flex items-center gap-1">
                      View Profile <ArrowUpRight size={12} aria-hidden="true" />
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="console-subpanel p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-ink">SQL</span>
                        <div className="flex items-center gap-0.5 text-accent" aria-label="Three stars">
                          <Star size={12} className="fill-accent text-accent" aria-hidden="true" />
                          <Star size={12} className="fill-accent text-accent" aria-hidden="true" />
                          <Star size={12} className="fill-accent text-accent" aria-hidden="true" />
                        </div>
                      </div>
                      <p className="text-xs text-muted font-mono">24 Challenges Solved</p>
                    </div>

                    <div className="console-subpanel p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-ink">C++</span>
                        <div className="flex items-center gap-0.5 text-accent" aria-label="One star">
                          <Star size={12} className="fill-accent text-accent" aria-hidden="true" />
                        </div>
                      </div>
                      <p className="text-xs text-muted font-mono">Language Verified</p>
                    </div>
                  </div>
                </a>
              ) : (
                <a
                  href="https://leetcode.com/u/abhi28031/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-center group"
                >
                  <img
                    src="https://leetcard.jacoblin.cool/abhi28031?theme=dark&font=Geist&ext=activity"
                    alt="LeetCode statistics for abhi28031"
                    className="w-full max-w-md rounded-md border border-rule group-hover:border-rule-2 transition-colors"
                  />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* INQUIRY & CONTACT SECTION */}
        <section id="contact" className="console-panel p-6 sm:p-10 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className="text-xs font-mono text-cool">Direct Inquiry</span>
                <h3 className="text-xl sm:text-2xl font-medium text-ink mt-1">Let’s Work Together</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Open to full-time roles and contract projects. If you need a data scientist to build and ship practical ML systems, let’s talk.
              </p>
              <div className="pt-2 text-xs text-muted space-y-1 font-mono">
                <p>Location: New Delhi, India</p>
                <p>Direct Email: abhi28031@gmail.com</p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {formError && (
                  <div className="bg-bad-soft border border-bad text-ink px-3.5 py-2 rounded-md text-xs">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-muted mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={contactName}
                      onChange={(e) => { setContactName(e.target.value); if (formError) setFormError(""); }}
                      placeholder="Your name"
                      className="w-full bg-paper-3 border border-rule rounded-pill px-3.5 py-2 text-sm text-ink placeholder:text-muted focus:border-rule-2 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-muted mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={contactEmail}
                      onChange={(e) => { setContactEmail(e.target.value); if (formError) setFormError(""); }}
                      placeholder="your.email@example.com"
                      className="w-full bg-paper-3 border border-rule rounded-pill px-3.5 py-2 text-sm text-ink placeholder:text-muted focus:border-rule-2 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-muted mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => { setContactMessage(e.target.value); if (formError) setFormError(""); }}
                    placeholder="Tell me about your project or opportunity…"
                    className="w-full bg-paper-3 border border-rule rounded-card px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-rule-2 transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    className="px-4 py-2 rounded-pill bg-paper-3 border border-rule-2 text-ink text-xs font-semibold hover:border-muted transition-colors flex items-center gap-1.5"
                  >
                    <MessageCircle size={14} aria-hidden="true" /> WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    className="px-5 py-2 rounded-pill bg-accent text-accent-ink text-xs font-semibold hover:opacity-95 transition-opacity flex items-center gap-1.5"
                  >
                    <Send size={14} aria-hidden="true" /> Send Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 mt-12 border-t border-rule flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <p>Abhishek Singh · Data Science, Machine Learning & Computer Vision</p>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Abhi20O1"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="text-muted hover:text-ink transition-colors p-1"
          >
            <svg role="img" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
          </a>
          <a
            href="https://www.hackerrank.com/profile/abhi28031"
            target="_blank"
            rel="noreferrer"
            aria-label="HackerRank profile"
            className="text-muted hover:text-ink transition-colors p-1"
          >
            <svg role="img" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M0 0v24h24V0zm9.95 8.002h1.805c.061 0 .111.05.111.111v7.767c0 .061-.05.111-.11.111H9.95c-.061 0-.111-.05-.111-.11v-2.87H7.894v2.87c0 .06-.05.11-.11.11H5.976a.11.11 0 01-.11-.11V8.112c0-.06.05-.11.11-.11h1.806c.061 0 .11.05.11.11v2.869H9.84v-2.87c0-.06.05-.11.11-.11zm2.999 0h5.778c.061 0 .111.05.111.11v7.767a.11.11 0 01-.11.112h-5.78a.11.11 0 01-.11-.11V8.111c0-.06.05-.11.11-.11z"/></svg>
          </a>
          <a
            href="https://www.linkedin.com/in/abhishek-singh-sd"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            className="text-muted hover:text-ink transition-colors p-1"
          >
            <svg role="img" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
          </a>
          <a
            href="mailto:abhi28031@gmail.com"
            aria-label="Send email"
            className="text-muted hover:text-ink transition-colors p-1"
          >
            <Mail size={16} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
}
