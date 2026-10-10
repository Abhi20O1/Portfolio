import { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Mail, MessageCircle, MapPin, Code2, Bot, ExternalLink, ArrowRight, Network, Database, LineChart, Cpu, Terminal, Activity, Send, FileText } from 'lucide-react';

function InteractiveBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-zinc-950 pointer-events-none">
      {/* Technical Grid Overlay for Data Science Vibe */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#22d3ee15_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Dynamic Glow Orbs - responsive positioning and sizing */}
      <div className="absolute top-[5%] sm:top-[10%] left-[10%] sm:left-[20%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-cyan-600/15 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[10%] sm:bottom-[20%] right-[5%] sm:right-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/10 rounded-full blur-[100px] sm:blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] sm:top-[40%] left-[50%] sm:left-[60%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-purple-600/10 rounded-full blur-[80px] sm:blur-[100px] animate-pulse-glow" style={{ animationDelay: '4s' }}></div>


      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/80 to-zinc-950"></div>
    </div>
  );
}

export default function App() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [formError, setFormError] = useState("");

  const handleEmailSubmit = () => {
    if (!contactName) return setFormError("Please enter your name!");
    if (!contactEmail) return setFormError("Please enter your email!");
    if (!contactMessage) return setFormError("Please enter a message!");
    setFormError("");

    const emailStr = contactEmail ? ` (${contactEmail})` : "";
    const subject = `Portfolio Contact from ${contactName}${emailStr}`;
    window.location.href = `mailto:abhi28031@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(contactMessage)}`;
  };

  const handleWhatsAppSubmit = () => {
    if (!contactName) return setFormError("Please enter your name!");
    if (!contactEmail) return setFormError("Please enter your email!");
    if (!contactMessage) return setFormError("Please enter a message!");
    setFormError("");

    const intro = `Hi, I am ${contactName}${contactEmail ? ` (${contactEmail})` : ''} reaching out from your portfolio.`;
    window.open(`https://wa.me/918126684451?text=${encodeURIComponent(`${intro}\n\n${contactMessage}`)}`, '_blank');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const observeElements = () => {
      document.querySelectorAll(".animate-fade-in-up").forEach((el) => {
        observer.observe(el);
      });
    };

    // Small delay to ensure DOM and dynamic projects are rendered
    const timeoutId = setTimeout(observeElements, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [projects]);

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
            if (readmeText.length > 120) readmeText = readmeText.substring(0, 117) + "...";

            return {
              id: repo.id,
              title: repo.name.replace(/[-_]/g, ' '),
              html_url: repo.html_url,
              language: repo.language,
              description: readmeText || repo.description || "Open source project."
            };
          })
        );

        setProjects([
          {
            id: 'chatbot',
            title: 'Healthcare Chatbot',
            html_url: '#',
            language: 'Python',
            description: 'Full end-to-end healthcare chatbot for 24/7 patient support via AWS Lex, Lambda & DynamoDB.'
          },
          ...reposWithReadme.filter(r => r.title.toLowerCase() !== 'healthcare chatbot')
        ]);
      } catch (err) {
        // Fallback if GitHub API fails
        setProjects([
          {
            id: 'chatbot',
            title: 'Healthcare Chatbot',
            html_url: '#',
            language: 'Python',
            description: 'Full end-to-end healthcare chatbot for 24/7 patient support via AWS Lex, Lambda & DynamoDB.'
          },
          {
            id: 'portfolio',
            title: 'Portfolio Website',
            html_url: 'https://github.com/Abhi20O1/Portfolio',
            language: 'TypeScript',
            description: 'My personal portfolio website built with React, Vite, and Tailwind CSS.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-white/20 selection:text-white pb-4 sm:pb-6">
      <InteractiveBackground />
      <div className="noise-texture"></div>

      {/* Navbar (Minimal & Floating) */}
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 w-[95%] sm:w-[90%] max-w-4xl glass-panel rounded-full border border-white/10 animate-fade-in-up shadow-2xl backdrop-blur-xl bg-zinc-950/80">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-zinc-900/50">
            <img src={`${import.meta.env.BASE_URL}Logo.webp`} alt="Abhishek Singh Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-semibold text-zinc-200 hidden sm:block tracking-wide">Abhishek Singh</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <a href="https://github.com/Abhi20O1" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors p-1.5 sm:p-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
          </a>
          <a href="https://wa.me/918126684451" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] text-zinc-950 bg-white hover:bg-zinc-200 px-4 sm:px-5 py-2 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-95 hover:scale-100 whitespace-nowrap">
            <MessageCircle size={14} className="fill-zinc-900 sm:w-4 sm:h-4" /> Let's Talk
          </a>
        </div>
      </nav>

      {/* Bento Grid Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 auto-rows-min">

        {/* HERO - 12 cols */}
        <div className="col-span-1 md:col-span-2 lg:col-span-12 glass-panel rounded-[1.5rem] sm:rounded-[2rem] flex flex-col relative overflow-hidden group animate-fade-in-up stagger-1 min-h-[400px] sm:min-h-[450px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={`${import.meta.env.BASE_URL}robo.webp`}
              alt="Abhishek"
              className="absolute right-0 top-0 h-full w-full sm:w-[60%] lg:w-[50%] object-cover object-center sm:object-[center_top] grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700 opacity-30 sm:opacity-90 group-hover:scale-[1.02] origin-right"
            />
            {/* Gradient Overlay for Text Readability and Seamless Blending */}
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-zinc-950 via-zinc-950/95 sm:via-zinc-950/80 to-zinc-950/10 sm:to-transparent"></div>
            {/* Extra dark gradient on the left edge of the image to blend it into the solid background */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent w-full sm:w-[60%]"></div>
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-12 flex flex-col h-full justify-center w-full sm:w-3/4 lg:w-2/3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-6 sm:mb-8 border border-cyan-500/20 bg-cyan-500/10 backdrop-blur-md w-fit shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[10px] sm:text-[12px] text-cyan-300 font-mono tracking-wide uppercase">SYS.STATUS : ONLINE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] xl:text-[5rem] font-extrabold tracking-tighter mb-3 sm:mb-4 text-white glow-text leading-tight sm:leading-tight">
              Abhishek Singh
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl gradient-text font-semibold tracking-tight mb-4 sm:mb-6">
              Data Scientist & AI Engineer
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mb-8 sm:mb-10 font-light drop-shadow-md">
              Transforming raw data into intelligent <span className="text-zinc-200 font-medium">Machine Learning</span> models, deep neural networks, and scalable <span className="text-zinc-200 font-medium">Data Pipelines</span>.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 items-center mt-auto">
              <a href="mailto:abhi28031@gmail.com" className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                <Database size={16} className="sm:w-[18px] sm:h-[18px]" /> Contact Me
              </a>
              <a href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 transition-all text-sm font-medium backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]">
                <FileText size={16} className="sm:w-[18px] sm:h-[18px]" /> Resume
              </a>
              <a href="https://www.linkedin.com/in/abhishek-singh-sd" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/70 border border-white/20 transition-all text-zinc-200 text-sm font-medium backdrop-blur-md hover:border-white/30">
                LinkedIn <ArrowRight size={14} className="opacity-50 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* CORE EXPERTISE - 7 cols */}
        <div className="col-span-1 md:col-span-2 lg:col-span-7 glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 group animate-fade-in-up stagger-3 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-48 h-48 sm:w-64 sm:h-64 bg-purple-500/10 rounded-full blur-[60px] sm:blur-[80px] -z-10 group-hover:bg-purple-500/20 transition-colors duration-700"></div>

          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <Network size={18} className="text-zinc-300 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 tracking-tight">Core Expertise</h3>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div>
              <p className="text-[10px] sm:text-[11px] font-mono text-cyan-500/70 uppercase tracking-widest mb-2.5 sm:mb-3">{"// Machine Learning & AI"}</p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {['TensorFlow', 'PyTorch', 'Scikit-Learn', 'Keras', 'AWS SageMaker', 'OpenCV', 'YOLO', 'LLMs', 'Pandas'].map((skill) => (
                  <span key={skill} className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs sm:text-sm font-medium hover:bg-blue-500/20 transition-all cursor-default shadow-[0_0_10px_rgba(59,130,246,0.1)] font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-mono text-cyan-500/70 uppercase tracking-widest mb-2.5 sm:mb-3">{"// Data Engineering & Tools"}</p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {['SQL', 'Flask', 'Azure', 'Linux', 'Git', 'Data Pipelines'].map((skill) => (
                  <span key={skill} className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-medium hover:bg-emerald-500/20 transition-all cursor-default shadow-[0_0_10px_rgba(16,185,129,0.1)] font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-mono text-cyan-500/70 uppercase tracking-widest mb-2.5 sm:mb-3">{"// Languages"}</p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {['Python', 'JavaScript', 'C++', 'C#', 'TypeScript'].map((skill) => (
                  <span key={skill} className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs sm:text-sm font-medium hover:bg-purple-500/20 transition-all cursor-default shadow-[0_0_10px_rgba(168,85,247,0.1)] font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-mono text-cyan-500/70 uppercase tracking-widest mb-2.5 sm:mb-3">{"// Interactive Dashboards & Web"}</p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {['React', 'Next.js', 'Node.js', 'Express', 'TailwindCSS', 'Vite', 'MongoDB'].map((skill) => (
                  <span key={skill} className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs sm:text-sm font-medium hover:bg-cyan-500/20 transition-all cursor-default shadow-[0_0_10px_rgba(6,182,212,0.1)] font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* EDUCATION & LOCATION - 5 cols */}
        <div className="col-span-1 md:col-span-1 lg:col-span-5 flex flex-col gap-4 sm:gap-5 lg:gap-6 animate-fade-in-up stagger-4">
          <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 flex-1 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <MapPin size={18} className="text-zinc-300 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-100 tracking-tight">Location</h3>
            </div>

            <div className="absolute right-0 bottom-0 opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" style={{ maskImage: 'radial-gradient(circle at bottom right, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at bottom right, black 30%, transparent 70%)' }}>
              <iframe src="https://maps.google.com/maps?q=New%20Delhi&t=&z=11&ie=UTF8&iwloc=&output=embed" className="w-48 h-48 sm:w-64 sm:h-64 object-cover" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(30%)' }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>

            <p className="text-white font-bold text-2xl sm:text-3xl mb-1">New Delhi, IN</p>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">Open to Remote Data Roles</p>
          </div>

          <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 flex-1 group relative overflow-hidden">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <LineChart size={18} className="text-zinc-300 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-100 tracking-tight">Education</h3>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-zinc-200 font-bold text-[14px] sm:text-[15px] leading-snug">IIT Guwahati & Daksh Gurukul</p>
                <div className="flex flex-wrap justify-between items-center mt-1.5 sm:mt-2 gap-2">
                  <p className="text-zinc-400 text-xs sm:text-sm">Data Science</p>
                  <p className="text-zinc-500 text-[10px] sm:text-[11px] font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/5 shrink-0 whitespace-nowrap">2025–2026</p>
                </div>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>
              <div>
                <p className="text-zinc-200 font-bold text-[14px] sm:text-[15px] leading-snug">JSS Academy</p>
                <div className="flex flex-wrap justify-between items-center mt-1.5 sm:mt-2 gap-2">
                  <p className="text-zinc-400 text-xs sm:text-sm">B.Tech CSE</p>
                  <p className="text-zinc-500 text-[10px] sm:text-[11px] font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/5 shrink-0 whitespace-nowrap">2020–2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXPERIENCE - 12 cols */}
        <div className="col-span-1 md:col-span-2 lg:col-span-12 glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 lg:p-12 group animate-fade-in-up stagger-5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 rounded-full blur-[80px] sm:blur-[120px] -z-10 group-hover:bg-blue-500/10 transition-colors duration-700"></div>

          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <Activity size={18} className="text-zinc-300 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 tracking-tight">Professional Experience</h3>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-zinc-800/50 flex-1 ml-2 sm:ml-4">
            <div className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-zinc-950 border-2 border-blue-500 rounded-full -left-[7.5px] sm:-left-[9px] top-1 sm:top-1.5 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3">
              <h4 className="text-xl sm:text-2xl font-bold text-white">Arcap REIT AI Solution</h4>
              <span className="text-zinc-400 text-xs sm:text-sm font-mono mt-2 sm:mt-0 bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/5 shadow-sm inline-block w-fit">Aug 2025 - Jan 2026</span>
            </div>

            <p className="text-blue-400 font-semibold mb-6 sm:mb-8 text-base sm:text-lg">Data Scientist Trainee</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-zinc-900/40 border border-white/5 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:bg-zinc-800/60 hover:border-white/10 transition-all group/item shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/item:opacity-20 transition-opacity">
                  <Database size={32} className="sm:w-10 sm:h-10" />
                </div>
                <h5 className="text-zinc-200 font-semibold mb-2 sm:mb-3 flex items-center gap-2"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div> Data Pipelines</h5>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed group-hover/item:text-zinc-300 transition-colors relative z-10">Developed automated data cleaning pipelines with Python/R, significantly reducing overall data preparation time by 30%.</p>
              </div>
              <div className="bg-zinc-900/40 border border-white/5 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:bg-zinc-800/60 hover:border-white/10 transition-all group/item shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/item:opacity-20 transition-opacity">
                  <Cpu size={32} className="sm:w-10 sm:h-10" />
                </div>
                <h5 className="text-zinc-200 font-semibold mb-2 sm:mb-3 flex items-center gap-2"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> ML Architecture</h5>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed group-hover/item:text-zinc-300 transition-colors relative z-10">Architected end-to-end cloud AI systems using AWS (S3, SageMaker) and Azure for scalable infrastructure.</p>
              </div>
              <div className="bg-zinc-900/40 border border-white/5 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:bg-zinc-800/60 hover:border-white/10 transition-all group/item shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/item:opacity-20 transition-opacity">
                  <Terminal size={32} className="sm:w-10 sm:h-10" />
                </div>
                <h5 className="text-zinc-200 font-semibold mb-2 sm:mb-3 flex items-center gap-2"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div> Model Deployment</h5>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed group-hover/item:text-zinc-300 transition-colors relative z-10">Successfully deployed Random Forest and CNN models via robust Flask APIs for enterprise production use.</p>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTS - 12 cols */}
        <div className="col-span-1 md:col-span-2 lg:col-span-12 glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 lg:p-12 group animate-fade-in-up stagger-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-8 sm:mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <Bot size={18} className="text-zinc-300 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 tracking-tight">Machine Learning Models & Projects</h3>
            </div>
            <a href="https://github.com/Abhi20O1" target="_blank" rel="noreferrer" className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/5 w-fit">
              View All Repos <ExternalLink size={14} className="sm:w-[14px] sm:h-[14px] w-3 h-3" />
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-16 sm:py-20">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.slice(0, 6).map((proj) => (
                <a
                  key={proj.id}
                  href={proj.html_url !== '#' ? proj.html_url : undefined}
                  target={proj.html_url !== '#' ? "_blank" : undefined}
                  className="group/card flex flex-col bg-zinc-900/40 rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-white/5 hover:border-cyan-500/30 hover:bg-zinc-800/60 transition-all duration-500 shadow-inner hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden h-full"
                >
                  <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full blur-[30px] sm:blur-[40px] -z-10 group-hover/card:bg-blue-500/20 transition-colors duration-500"></div>

                  <div className="flex justify-between items-start mb-4 sm:mb-5">
                    <div className="p-2 sm:p-2.5 bg-zinc-950 rounded-lg sm:rounded-xl text-zinc-400 group-hover/card:text-white transition-colors border border-white/5 shadow-inner">
                      <Code2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    {proj.language && (
                      <span className="text-[10px] sm:text-[11px] font-bold text-zinc-300 bg-zinc-950 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-white/5">
                        {proj.language}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[17px] sm:text-[19px] font-bold mb-2 sm:mb-3 text-zinc-100 group-hover/card:text-blue-400 transition-colors line-clamp-1">
                    {proj.title}
                  </h4>
                  <p className="text-zinc-400 text-xs sm:text-[15px] leading-relaxed flex-1 line-clamp-3 font-light group-hover/card:text-zinc-300 transition-colors">
                    {proj.description}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* CONTRIBUTIONS - 6 cols */}
        <div className="col-span-1 md:col-span-1 lg:col-span-6 glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 group animate-fade-in-up stagger-6 flex flex-col justify-center items-center overflow-hidden">
          <div className="flex items-center gap-3 w-full mb-6 sm:mb-8">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 w-4 h-4 sm:w-5 sm:h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 tracking-tight">GitHub Activity</h3>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar pb-2 flex justify-start sm:justify-center">
            <div className="min-w-[700px] sm:min-w-0 pr-6 sm:pr-0">
              <GitHubCalendar
                username="Abhi20O1"
                colorScheme="dark"
                theme={{
                  dark: ['rgba(255,255,255,0.02)', 'rgba(59,130,246,0.3)', 'rgba(59,130,246,0.5)', 'rgba(59,130,246,0.8)', 'rgba(59,130,246,1)'],
                }}
                style={{ color: '#a1a1aa' }}
              />
            </div>
          </div>
        </div>

        {/* LEETCODE - 6 cols */}
        <div className="col-span-1 md:col-span-1 lg:col-span-6 glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 group animate-fade-in-up stagger-6 flex flex-col justify-center items-center">
          <div className="flex items-center gap-3 w-full mb-6 sm:mb-8">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 w-4 h-4 sm:w-5 sm:h-5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 tracking-tight">Algorithmic Problem Solving</h3>
          </div>

          <a href="https://leetcode.com/u/abhi28031/" target="_blank" rel="noreferrer" className="w-full flex justify-center group/img relative">
            <div className="relative w-full max-w-[500px]">
              <div className="absolute inset-0 bg-orange-500/20 blur-[20px] sm:blur-[30px] rounded-xl sm:rounded-2xl -z-10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"></div>
              <img
                src="https://leetcard.jacoblin.cool/abhi28031?theme=dark&font=Geist&ext=activity"
                alt="LeetCode Stats"
                className="w-full rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 group-hover/img:border-white/30 transition-all duration-300"
              />
            </div>
          </a>
        </div>

        {/* CONTACT FORM - 12 cols */}
        <div className="col-span-1 md:col-span-2 lg:col-span-12 glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 lg:p-12 group animate-fade-in-up stagger-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-blue-500/20 transition-colors duration-700"></div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                  <Mail size={18} className="text-zinc-300 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Let's Work Together</h3>
              </div>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md">
                I'm currently available for freelance projects and full-time opportunities. If you're looking for a Data Scientist or AI Engineer to build intelligent solutions, I'd love to hear from you.
              </p>
            </div>

            <div className="flex-[1.5] w-full">
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-sm font-medium animate-fade-in-up">
                    {formError}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="name" className="sr-only">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={contactName}
                      onChange={(e) => { setContactName(e.target.value); if (formError) setFormError(""); }}
                      placeholder="Your name"
                      className={`w-full bg-zinc-950/50 border rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 transition-all shadow-inner ${formError === "Please enter your name!" ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50" : "border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/50"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={contactEmail}
                      onChange={(e) => { setContactEmail(e.target.value); if (formError) setFormError(""); }}
                      placeholder="Your email"
                      className={`w-full bg-zinc-950/50 border rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 transition-all shadow-inner ${formError === "Please enter your email!" ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50" : "border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/50"}`}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => { setContactMessage(e.target.value); if (formError) setFormError(""); }}
                    placeholder="What would you like to discuss?"
                    className={`w-full bg-zinc-950/50 border rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 transition-all shadow-inner resize-none ${formError === "Please enter a message!" ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50" : "border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/50"}`}
                    required
                  ></textarea>
                </div>
                <div className="mt-2 w-full flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  >
                    WhatsApp <MessageCircle size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                  >
                    Send Email <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-2 mt-6 sm:mt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-3 animate-fade-in-up text-center sm:text-left relative">
        <div className="flex flex-col gap-2 items-center sm:items-start">
          <p className="text-zinc-500 text-xs sm:text-sm font-medium">© {new Date().getFullYear()} Abhishek Singh. All rights reserved.</p>
        </div>
        <div className="flex gap-3 sm:gap-4">
          <a href="https://github.com/Abhi20O1" className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg></a>
          <a href="https://www.linkedin.com/in/abhishek-singh-sd" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg></a>
          <a href="mailto:abhi28031@gmail.com" className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><Mail className="w-4 h-4 sm:w-5 sm:h-5" /></a>
        </div>
      </footer>
    </div>
  );
}
