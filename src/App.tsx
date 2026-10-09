import { useState, useEffect, useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Mail, MessageCircle, MapPin, Code2, BrainCircuit, Bot, ExternalLink, ArrowRight } from 'lucide-react';

function InteractiveBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let targetTime = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (videoRef.current && videoRef.current.duration) {
        const xPercent = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
        targetTime = xPercent * videoRef.current.duration;
      }
    };

    const updateVideoTime = () => {
      if (videoRef.current && !isNaN(targetTime)) {
        const currentTime = videoRef.current.currentTime;
        videoRef.current.currentTime = currentTime + (targetTime - currentTime) * 0.1;
      }
      animationFrameId = requestAnimationFrame(updateVideoTime);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(updateVideoTime);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-zinc-950 pointer-events-none">
      {/* Dynamic Glow Orbs */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '4s' }}></div>

      <video 
        ref={videoRef}
        src="/kling_20261008_VIDEO_animate_339_0.mp4" 
        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen" 
        muted 
        playsInline 
        preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/70 to-zinc-950"></div>
    </div>
  );
}

export default function App() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('https://api.github.com/users/Abhi20O1/repos');
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const filtered = data.filter((r: any) => r.name !== 'Abhi20O1' && !r.fork);
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
            } catch (e) {}
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
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-white/20 selection:text-white pb-24">
      <InteractiveBackground />
      <div className="noise-texture"></div>
      
      {/* Navbar (Minimal & Floating) */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-5 py-3 w-[90%] max-w-4xl glass-panel rounded-full border border-white/10 animate-fade-in-up shadow-2xl backdrop-blur-xl bg-zinc-950/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <span className="text-[14px] font-bold tracking-tight text-white">AS</span>
          </div>
          <span className="text-sm font-semibold text-zinc-200 hidden sm:block tracking-wide">Abhishek Singh</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="https://github.com/Abhi20O1" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </a>
          <a href="https://wa.me/918126684451" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] text-zinc-950 bg-white hover:bg-zinc-200 px-5 py-2 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-95 hover:scale-100">
            <MessageCircle size={16} className="fill-zinc-900" /> Let's Talk
          </a>
        </div>
      </nav>

      {/* Bento Grid Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-36 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 auto-rows-min">
        
        {/* HERO - 8 cols */}
        <div className="col-span-1 md:col-span-2 lg:col-span-8 glass-panel rounded-[2rem] p-8 lg:p-12 flex flex-col relative overflow-hidden group animate-fade-in-up stagger-1">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -z-10 group-hover:bg-blue-500/20 transition-colors duration-700"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-md w-fit shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[12px] text-emerald-300 font-semibold tracking-wide uppercase">Available for work</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-tighter mb-4 text-white glow-text leading-tight">
            Abhishek Singh
          </h1>
          <h2 className="text-2xl sm:text-3xl gradient-text font-semibold tracking-tight mb-6">
            Data Scientist & AI Engineer
          </h2>
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed max-w-2xl mb-10 font-light">
            Building scalable <span className="text-zinc-200 font-medium">ML systems</span>, computer vision solutions, and <span className="text-zinc-200 font-medium">Gen AI applications</span> with Python, TensorFlow, and AWS.
          </p>

          <div className="flex flex-wrap gap-4 items-center mt-auto">
            <a href="mailto:abhi28031@gmail.com" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Mail size={18} /> Contact Me
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-700/50 border border-white/10 transition-all text-zinc-200 text-sm font-medium backdrop-blur-md">
              LinkedIn <ArrowRight size={16} className="opacity-50" />
            </a>
          </div>
        </div>

        {/* PROFILE PIC - 4 cols */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 glass-panel rounded-[2rem] p-2 relative overflow-hidden group animate-fade-in-up stagger-2 flex items-center justify-center min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 blur-[60px] rounded-full z-0 group-hover:scale-150 transition-transform duration-700"></div>
          <img 
            src="/robo.png" 
            alt="Abhishek" 
            className="w-full h-full object-cover rounded-[1.5rem] relative z-10 grayscale-[0.2] contrast-125 group-hover:grayscale-0 transition-all duration-500" 
          />
        </div>

        {/* TECH STACK - 7 cols */}
        <div className="col-span-1 md:col-span-2 lg:col-span-7 glass-panel rounded-[2rem] p-8 lg:p-10 group animate-fade-in-up stagger-3 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-purple-500/20 transition-colors duration-700"></div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <Code2 size={20} className="text-zinc-300" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">Tech Stack</h3>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {['Python', 'TensorFlow', 'PyTorch', 'AWS SageMaker', 'OpenCV', 'YOLO', 'Flask', 'SQL', 'C++', 'JavaScript', 'Azure', 'Git'].map((skill, i) => (
              <span 
                key={skill} 
                className="px-4 py-2 rounded-lg bg-zinc-800/40 border border-white/5 text-zinc-300 text-sm font-medium hover:bg-white/10 hover:text-white hover:border-white/20 transition-all cursor-default"
                style={{ transitionDelay: `${i * 15}ms` }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* EDUCATION & LOCATION - 5 cols */}
        <div className="col-span-1 md:col-span-1 lg:col-span-5 flex flex-col gap-5 animate-fade-in-up stagger-4">
          <div className="glass-panel rounded-[2rem] p-8 flex-1 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <MapPin size={20} className="text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">Location</h3>
            </div>
            
            <div className="absolute right-0 bottom-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
              <img src="https://api.maptiler.com/maps/basic-v2/static/77.2090,28.6139,11/400x300.png?key=get_your_own_OpIi9ZULNHzrESv6T2vL" alt="Map" className="w-64 h-64 object-cover mix-blend-luminosity" style={{ maskImage: 'radial-gradient(circle at bottom right, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at bottom right, black 30%, transparent 70%)' }} />
            </div>
            
            <p className="text-white font-bold text-3xl mb-1">New Delhi, IN</p>
            <p className="text-zinc-400 text-sm font-medium">Open to Remote Opportunities</p>
          </div>

          <div className="glass-panel rounded-[2rem] p-8 flex-1 group relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <BrainCircuit size={20} className="text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">Education</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-zinc-200 font-bold text-[15px]">IIT Guwahati & Daksh Gurukul</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-zinc-400 text-sm">Data Science</p>
                  <p className="text-zinc-500 text-[11px] font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/5">2025–2026</p>
                </div>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>
              <div>
                <p className="text-zinc-200 font-bold text-[15px]">JSS Academy</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-zinc-400 text-sm">B.Tech CSE</p>
                  <p className="text-zinc-500 text-[11px] font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/5">2020–2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXPERIENCE - 12 cols */}
        <div className="col-span-1 md:col-span-2 lg:col-span-12 glass-panel rounded-[2rem] p-8 lg:p-12 group animate-fade-in-up stagger-5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 rounded-full blur-[120px] -z-10 group-hover:bg-blue-500/10 transition-colors duration-700"></div>
          
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <BrainCircuit size={20} className="text-zinc-300" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">Experience</h3>
          </div>
          
          <div className="relative pl-8 border-l-2 border-zinc-800/50 flex-1 ml-4">
            <div className="absolute w-4 h-4 bg-zinc-950 border-2 border-blue-500 rounded-full -left-[9px] top-1 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h4 className="text-2xl font-bold text-white">Arcap REIT AI</h4>
              <span className="text-zinc-400 text-sm font-mono mt-1 sm:mt-0 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 shadow-sm">Aug 2025 - Jan 2026</span>
            </div>
            
            <p className="text-blue-400 font-semibold mb-8 text-lg">Data Scientist Trainee</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:bg-zinc-800/60 hover:border-white/10 transition-all group/item shadow-inner">
                <h5 className="text-zinc-200 font-semibold mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div> Pipelines</h5>
                <p className="text-sm text-zinc-400 leading-relaxed group-hover/item:text-zinc-300 transition-colors">Developed automated data cleaning pipelines with Python/R, reducing overall preparation time by 30%.</p>
              </div>
              <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:bg-zinc-800/60 hover:border-white/10 transition-all group/item shadow-inner">
                <h5 className="text-zinc-200 font-semibold mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> Architecture</h5>
                <p className="text-sm text-zinc-400 leading-relaxed group-hover/item:text-zinc-300 transition-colors">Designed end-to-end cloud AI systems using AWS (S3, SageMaker) and Azure for scalable infrastructure.</p>
              </div>
              <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:bg-zinc-800/60 hover:border-white/10 transition-all group/item shadow-inner">
                <h5 className="text-zinc-200 font-semibold mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div> Deployment</h5>
                <p className="text-sm text-zinc-400 leading-relaxed group-hover/item:text-zinc-300 transition-colors">Successfully deployed Random Forest and CNN models via robust Flask APIs for production use.</p>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTS - 12 cols */}
        <div className="col-span-1 md:col-span-2 lg:col-span-12 glass-panel rounded-[2rem] p-8 lg:p-12 group animate-fade-in-up stagger-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <Bot size={20} className="text-zinc-300" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">Featured Projects</h3>
            </div>
            <a href="https://github.com/Abhi20O1" target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5">
              View All <ExternalLink size={14} />
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((proj) => (
                <a 
                  key={proj.id} 
                  href={proj.html_url !== '#' ? proj.html_url : undefined} 
                  target={proj.html_url !== '#' ? "_blank" : undefined}
                  className="group/card flex flex-col bg-zinc-900/40 rounded-2xl p-7 border border-white/5 hover:border-white/20 hover:bg-zinc-800/60 transition-all duration-300 shadow-inner relative overflow-hidden h-full"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-[40px] -z-10 group-hover/card:bg-blue-500/20 transition-colors duration-500"></div>
                  
                  <div className="flex justify-between items-start mb-5">
                    <div className="p-2.5 bg-zinc-950 rounded-xl text-zinc-400 group-hover/card:text-white transition-colors border border-white/5 shadow-inner">
                      <Code2 size={18} />
                    </div>
                    {proj.language && (
                      <span className="text-[11px] font-bold text-zinc-300 bg-zinc-950 px-3 py-1.5 rounded-md border border-white/5">
                        {proj.language}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[19px] font-bold mb-3 text-zinc-100 group-hover/card:text-blue-400 transition-colors line-clamp-1">
                    {proj.title}
                  </h4>
                  <p className="text-zinc-400 text-[15px] leading-relaxed flex-1 line-clamp-3 font-light group-hover/card:text-zinc-300 transition-colors">
                    {proj.description}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* CONTRIBUTIONS - 6 cols */}
        <div className="col-span-1 md:col-span-1 lg:col-span-6 glass-panel rounded-[2rem] p-8 lg:p-10 group animate-fade-in-up stagger-6 flex flex-col justify-center items-center overflow-hidden">
          <div className="flex items-center gap-3 w-full mb-8">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">GitHub Activity</h3>
          </div>
          
          <div className="scale-90 sm:scale-100 origin-center max-w-full overflow-x-auto no-scrollbar pb-2">
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

        {/* LEETCODE - 6 cols */}
        <div className="col-span-1 md:col-span-1 lg:col-span-6 glass-panel rounded-[2rem] p-8 lg:p-10 group animate-fade-in-up stagger-6 flex flex-col justify-center items-center">
          <div className="flex items-center gap-3 w-full mb-8">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">LeetCode</h3>
          </div>
          
          <a href="https://leetcode.com/u/abhi28031/" target="_blank" rel="noreferrer" className="w-full flex justify-center group/img relative">
            <div className="relative w-full max-w-[500px]">
              <div className="absolute inset-0 bg-orange-500/20 blur-[30px] rounded-2xl -z-10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"></div>
              <img 
                src="https://leetcard.jacoblin.cool/abhi28031?theme=dark&font=Geist&ext=activity" 
                alt="LeetCode Stats" 
                className="w-full rounded-2xl shadow-2xl border border-white/10 group-hover/img:border-white/30 transition-all duration-300"
              />
            </div>
          </a>
        </div>

      </main>
      
      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-12 mt-16 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in-up stagger-6">
        <p className="text-zinc-500 text-sm font-medium">© {new Date().getFullYear()} Abhishek Singh. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="https://github.com/Abhi20O1" className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></a>
          <a href="https://linkedin.com/" className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>
          <a href="mailto:abhi28031@gmail.com" className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><Mail size={20} /></a>
        </div>
      </footer>
    </div>
  );
}
