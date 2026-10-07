import { useState, useEffect, useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Mail, ArrowUpRight, MessageCircle, MapPin, Code2, BrainCircuit, Bot } from 'lucide-react';

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
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      <video 
        ref={videoRef}
        src="/kling_20261008_VIDEO_animate_339_0.mp4" 
        className="w-full h-full object-cover opacity-50 mix-blend-screen" 
        muted 
        playsInline 
        preload="auto"
      />
      <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px]"></div>
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
    <div className="min-h-screen font-sans selection:bg-white/20 selection:text-white pb-20">
      <InteractiveBackground />
      <div className="noise-texture"></div>
      
      {/* Navbar (Minimal) */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 sm:px-10 bg-zinc-950/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold tracking-tight text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">AS</span>
        </div>
        <a href="https://wa.me/918126684451" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] text-white bg-zinc-800/50 hover:bg-zinc-700/50 px-4 py-2 rounded-full font-medium transition-colors border border-white/10">
          <MessageCircle size={16} /> Let's Talk
        </a>
      </nav>

      {/* Bento Grid Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 auto-rows-min">
        
        {/* HERO CARD - Spans 8 cols */}
        <div className="col-span-1 md:col-span-4 lg:col-span-8 bg-zinc-900/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 lg:p-10 flex flex-col justify-between hover:bg-zinc-900/40 transition-colors shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-blue-500/20 transition-colors"></div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] text-emerald-300 font-semibold tracking-wide uppercase">Available for work</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 text-white">
              Abhishek Singh
            </h1>
            <h2 className="text-xl sm:text-2xl text-zinc-400 font-medium tracking-tight mb-6">
              Data Scientist & AI Engineer
            </h2>
            <p className="text-zinc-300/80 text-[16px] leading-relaxed max-w-xl">
              Building scalable ML systems, computer vision solutions, and Gen AI applications with Python, TensorFlow, and AWS.
            </p>
          </div>
        </div>

        {/* PROFILE / CONNECT - Spans 4 cols */}
        <div className="col-span-1 md:col-span-4 lg:col-span-4 bg-zinc-900/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 flex flex-col gap-4 hover:bg-zinc-900/40 transition-colors shadow-2xl">
          <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-2">Connect</h3>
          <a href="https://github.com/Abhi20O1" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
            <div className="flex items-center gap-3 text-zinc-200 font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> GitHub</div>
            <ArrowUpRight size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
            <div className="flex items-center gap-3 text-zinc-200 font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn</div>
            <ArrowUpRight size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
          </a>
          <a href="mailto:abhi28031@gmail.com" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
            <div className="flex items-center gap-3 text-zinc-200 font-medium"><Mail size={20} /> Email</div>
            <ArrowUpRight size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
          </a>
        </div>

        {/* EXPERIENCE - Spans 5 cols */}
        <div className="col-span-1 md:col-span-4 lg:col-span-5 row-span-2 bg-zinc-900/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 flex flex-col hover:bg-zinc-900/40 transition-colors shadow-2xl">
          <div className="flex items-center gap-2 mb-6 text-zinc-400">
            <BrainCircuit size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Experience</h3>
          </div>
          
          <div className="relative pl-6 border-l border-white/10 flex-1">
            <div className="absolute w-3 h-3 bg-white/20 border border-white/40 rounded-full -left-[6.5px] top-1"></div>
            <h4 className="text-lg font-bold text-white mb-1">Arcap REIT AI</h4>
            <p className="text-sm text-blue-400 font-medium mb-3">Data Scientist Trainee <span className="text-zinc-500 ml-2">Aug 2025 - Jan 2026</span></p>
            <ul className="space-y-3 text-[14px] text-zinc-400">
              <li><strong className="text-zinc-200">Pipelines:</strong> Dev automated data cleaning with Python/R, reducing prep time 30%.</li>
              <li><strong className="text-zinc-200">ML Architecture:</strong> Designed end-to-end cloud AI using AWS (S3, SageMaker) & Azure.</li>
              <li><strong className="text-zinc-200">Deployment:</strong> Deployed Random Forest & CNN models via Flask.</li>
            </ul>
          </div>
        </div>

        {/* SKILLS SCROLLER - Spans 7 cols */}
        <div className="col-span-1 md:col-span-4 lg:col-span-7 bg-zinc-900/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 overflow-hidden hover:bg-zinc-900/40 transition-colors shadow-2xl flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6 text-zinc-400">
            <Code2 size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Tech Stack</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Python', 'TensorFlow', 'PyTorch', 'AWS SageMaker', 'OpenCV', 'YOLO', 'Flask', 'SQL', 'C++', 'JavaScript', 'Azure', 'Git'].map(skill => (
              <span key={skill} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-200 text-sm font-medium hover:bg-white/10 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* EDUCATION & LOCATION - Spans 7 cols */}
        <div className="col-span-1 md:col-span-4 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-zinc-900/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:bg-zinc-900/40 transition-colors shadow-2xl flex flex-col justify-center">
            <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-4">Education</h3>
            <div className="mb-4">
              <p className="text-zinc-100 font-bold text-sm">IIT Guwahati & Daksh Gurukul</p>
              <p className="text-zinc-400 text-xs mt-1">Data Science (Mar 2025 – May 2026)</p>
            </div>
            <div>
              <p className="text-zinc-100 font-bold text-sm">JSS Academy</p>
              <p className="text-zinc-400 text-xs mt-1">B.Tech CSE (2020 – 2024)</p>
            </div>
          </div>
          
          <div className="bg-zinc-900/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:bg-zinc-900/40 transition-colors shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://api.maptiler.com/maps/basic-v2/static/77.2090,28.6139,11/400x300.png?key=get_your_own_OpIi9ZULNHzrESv6T2vL')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity mix-blend-luminosity"></div>
            <MapPin size={32} className="text-white mb-3 relative z-10" />
            <p className="text-white font-bold text-lg relative z-10">New Delhi, India</p>
            <p className="text-zinc-400 text-sm relative z-10">Open to Remote</p>
          </div>
        </div>

        {/* PROJECTS SECTION - Spans all 12 cols */}
        <div className="col-span-1 md:col-span-4 lg:col-span-12 bg-zinc-900/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:bg-zinc-900/40 transition-colors shadow-2xl mt-4">
          <div className="flex items-center gap-2 mb-8 text-zinc-400">
            <Bot size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Featured Projects</h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((proj) => (
                <a 
                  key={proj.id} 
                  href={proj.html_url !== '#' ? proj.html_url : undefined} 
                  target={proj.html_url !== '#' ? "_blank" : undefined}
                  className="group flex flex-col bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all shadow-lg"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white/10 rounded-lg text-zinc-300 group-hover:text-white transition-colors">
                      <Code2 size={16} />
                    </div>
                    {proj.language && (
                      <span className="text-[10px] font-bold text-zinc-400 bg-black/40 px-2 py-1 rounded-md">
                        {proj.language}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[16px] font-bold mb-2 text-zinc-100 group-hover:text-blue-300 transition-colors line-clamp-1">
                    {proj.title}
                  </h4>
                  <p className="text-zinc-400 text-[13px] leading-relaxed flex-1 line-clamp-3">
                    {proj.description}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* GITHUB STATS - Spans 4 cols */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-zinc-900/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:bg-zinc-900/40 transition-colors shadow-2xl flex flex-col justify-center items-center overflow-hidden">
          <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-6 w-full text-left">Contributions</h3>
          <div className="scale-[0.8] sm:scale-90 origin-left max-w-full overflow-x-auto no-scrollbar">
            <GitHubCalendar 
              username="Abhi20O1" 
              colorScheme="dark"
              theme={{
                dark: ['rgba(255,255,255,0.03)', 'rgba(59,130,246,0.4)', 'rgba(59,130,246,0.6)', 'rgba(59,130,246,0.8)', 'rgba(59,130,246,1)'],
              }}
              style={{ color: '#a1a1aa' }}
            />
          </div>
        </div>

        {/* GITHUB STREAK - Spans 4 cols */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-zinc-900/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:bg-zinc-900/40 transition-colors shadow-2xl flex flex-col justify-center items-center">
          <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-6 w-full text-left">GitHub Streak</h3>
          <a href="https://github.com/Abhi20O1" target="_blank" rel="noreferrer" className="w-full flex justify-center hover:scale-[1.02] transition-transform">
            <img 
              src="https://github-readme-streak-stats.herokuapp.com/?user=Abhi20O1&theme=dark&hide_border=true&background=00000000&ring=3b82f6&fire=3b82f6&currStreakNum=ffffff&sideNums=ffffff&currStreakLabel=9ca3af&sideLabels=9ca3af&dates=9ca3af" 
              alt="GitHub Streak" 
              className="w-full max-w-[450px] rounded-xl shadow-lg opacity-90 hover:opacity-100 transition-opacity"
            />
          </a>
        </div>

        {/* LEETCODE - Spans 4 cols */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-zinc-900/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:bg-zinc-900/40 transition-colors shadow-2xl flex flex-col justify-center items-center">
          <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-6 w-full text-left">LeetCode</h3>
          <a href="https://leetcode.com/u/abhi28031/" target="_blank" rel="noreferrer" className="w-full flex justify-center hover:scale-[1.02] transition-transform">
            <img 
              src="https://leetcard.jacoblin.cool/abhi28031?theme=dark&font=Inter&ext=activity" 
              alt="LeetCode Stats" 
              className="w-full max-w-[450px] rounded-xl shadow-lg border border-white/5 opacity-90 hover:opacity-100 transition-opacity"
            />
          </a>
        </div>

      </main>
    </div>
  );
}
