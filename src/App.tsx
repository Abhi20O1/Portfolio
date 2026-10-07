import { useState, useEffect, useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const links = ['About', 'Skills', 'Achievements', 'Work', 'Connect'];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 sm:px-12 w-full bg-black/40 backdrop-blur-2xl border-b border-white/10">
        <div className="flex items-center gap-2">
          <a href="#" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 group cursor-pointer hover:border-white/30 hover:bg-white/10 transition-all duration-300">
            <span 
              className="text-[16px] font-bold tracking-tight text-white transition-colors duration-300"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              AS
            </span>
          </a>
        </div>
        <div className="hidden md:flex flex-row gap-8 text-[14px] text-gray-300 font-medium">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors cursor-pointer">
              {link}
            </a>
          ))}
        </div>
        <a href="https://wa.me/918126684451" target="_blank" rel="noreferrer" className="hidden md:block text-[13px] text-black bg-white px-5 py-2.5 rounded-full font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all cursor-pointer">
          Let's Talk
        </a>
        <button 
          className="md:hidden flex flex-col gap-[6px] z-[60] cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={`w-6 h-[2px] bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
          <div className={`w-6 h-[2px] bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
          <div className={`w-6 h-[2px] bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
        </button>
      </nav>

      <div 
        className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-[50] flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {links.map(link => (
          <a key={link} href={`#${link.toLowerCase()}`} className="text-[32px] font-bold text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={() => setIsOpen(false)} style={{ fontFamily: 'var(--font-heading)' }}>
            {link}
          </a>
        ))}
        <div className="w-12 h-[1px] bg-white/10 my-4"></div>
        <a href="https://wa.me/918126684451" target="_blank" rel="noreferrer" className="text-[18px] font-medium text-white/60 cursor-pointer" onClick={() => setIsOpen(false)}>
          WhatsApp Me
        </a>
      </div>
    </>
  );
}

function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="about" className="relative z-10 w-full min-h-screen flex flex-col justify-center pt-24 pb-12 px-6 sm:px-12 md:px-20 lg:px-32">
      <div 
        className="max-w-4xl text-left"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
        }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
          <span className="text-xs text-gray-300 font-semibold tracking-wide uppercase">Open to opportunities</span>
        </div>
        
        <h1 
          className="text-[48px] sm:text-[64px] md:text-[80px] font-bold tracking-tight leading-[1.05] mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 drop-shadow-xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Abhishek Singh
        </h1>
        
        <h2 className="text-[24px] sm:text-[32px] md:text-[40px] text-gray-400 font-medium tracking-tight mb-8 drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>
          Data Scientist & AI Engineer
        </h2>
        
        <p className="text-[16px] sm:text-[18px] md:text-[20px] text-gray-300/90 max-w-2xl leading-relaxed mb-10 drop-shadow-md">
          Building and shipping scalable ML systems, computer vision solutions, and Gen AI applications with Python, TensorFlow, and AWS.
        </p>

        <div className="flex flex-wrap gap-4">
          <a href="#work" className="inline-flex items-center justify-center bg-white text-black font-bold rounded-full text-[15px] px-8 py-3.5 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] duration-300">
            View Work
          </a>
          <a href="#connect" className="inline-flex items-center justify-center bg-white/5 backdrop-blur-md text-white border border-white/20 font-bold rounded-full text-[15px] px-8 py-3.5 transition-all hover:bg-white/10 hover:border-white/40 duration-300">
            Connect With Me
          </a>
        </div>
      </div>
    </section>
  );
}

function SkillsAndTech() {
  const skills = [
    { category: "Languages", items: "Python, R, SQL, C++, JavaScript" },
    { category: "Computer Vision", items: "OpenCV, YOLO, Image Segmentation, Image Processing" },
    { category: "Deep Learning", items: "TensorFlow, PyTorch, CNNs, Data Augmentation" },
    { category: "Deployment & Cloud", items: "Rest APIs, Flask, AWS (Sagemaker, S3, Lambda), Azure" },
    { category: "Engineering", items: "Data Structure & Algorithms, Git, Linux" }
  ];

  return (
    <section id="skills" className="py-24 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[28px] sm:text-[32px] font-bold mb-12 tracking-tight text-white drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>Skills & Technology</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(s => (
            <div key={s.category} className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <h4 className="text-gray-400 text-[12px] uppercase tracking-wider mb-2 font-bold">{s.category}</h4>
              <p className="text-[15px] text-gray-100 font-medium">{s.items}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificatesAndAchievements() {
  const education = [
    { inst: "IIT Guwahati & Daksh Gurukul", deg: "Credit-Linked Program in Data Science", date: "Mar 2025 – May 2026" },
    { inst: "JSS Academy of Technical Education", deg: "B.Tech - Computer Science and Engineering", date: "2020 – 2024" }
  ];

  return (
    <section id="achievements" className="py-24 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-colors shadow-2xl">
          <h2 className="text-[24px] font-bold mb-8 tracking-tight text-white drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>Certificates</h2>
          <ul className="space-y-6 text-gray-300 text-[15px]">
            <li className="flex gap-4 items-start group">
              <span className="mt-2 w-2 h-2 bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] rounded-full shrink-0 group-hover:scale-125 transition-transform"></span>
              <span>Data Analytics Job Simulation — <strong className="text-white font-semibold">Deloitte</strong>.</span>
            </li>
            <li className="flex gap-4 items-start group">
              <span className="mt-2 w-2 h-2 bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)] rounded-full shrink-0 group-hover:scale-125 transition-transform"></span>
              <span>Machine Learning Course — <strong className="text-white font-semibold">Infosys Springboard</strong>.</span>
            </li>
          </ul>
        </div>

        <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-colors shadow-2xl">
          <h2 className="text-[24px] font-bold mb-8 tracking-tight text-white drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>Education</h2>
          <div className="flex flex-col gap-6">
            {education.map(e => (
              <div key={e.deg} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                <h3 className="text-[17px] font-bold mb-1 text-gray-100">{e.deg}</h3>
                <p className="text-[14px] text-gray-400 mb-3">{e.inst}</p>
                <div className="inline-block bg-white/10 border border-white/10 rounded-md px-3 py-1 text-[11px] text-gray-300 font-bold uppercase tracking-wider">{e.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Work() {
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
              if (!readmeRes.ok) {
                readmeRes = await fetch(`https://raw.githubusercontent.com/Abhi20O1/${repo.name}/master/README.md`);
              }
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
            } catch (e) {
              console.error(e);
            }
            
            if (readmeText.length > 150) {
              readmeText = readmeText.substring(0, 147) + "...";
            }
            
            return {
              id: repo.id,
              title: repo.name.replace(/[-_]/g, ' '),
              html_url: repo.html_url,
              language: repo.language,
              description: readmeText || repo.description || "Open source project on GitHub."
            };
          })
        );

        const allProjects = [
          {
            id: 'chatbot',
            title: 'Healthcare Chatbot for Patient Support',
            html_url: '#',
            language: 'Python',
            description: 'Developed a full end-to-end healthcare chatbot providing 24/7 patient support using AWS Lex, Lambda, and DynamoDB for natural language understanding and automated workflows.'
          },
          ...reposWithReadme.filter(r => r.title.toLowerCase() !== 'healthcare chatbot')
        ];
        
        setProjects(allProjects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  return (
    <section id="work" className="py-24 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[28px] sm:text-[32px] font-bold mb-12 tracking-tight text-white drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>Work & Projects</h2>
        
        {/* Experience Section */}
        <div className="mb-16">
          <h3 className="text-[20px] font-bold mb-6 text-gray-300 drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>Experience</h3>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
              <div>
                <h4 className="text-[22px] font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Arcap REIT AI Solution</h4>
                <p className="text-[16px] text-blue-300 font-medium">Data Scientist Trainee</p>
              </div>
              <div className="inline-block bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-[13px] text-gray-300 font-bold tracking-wide w-max">
                Aug 2025 – Jan 2026
              </div>
            </div>
            
            <ul className="space-y-5 text-gray-300 text-[15px] leading-relaxed">
              <li className="flex gap-4 items-start">
                <span className="mt-2 w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
                <span><strong className="text-white font-semibold">Data Pipeline Development:</strong> Developed automated data cleaning pipelines using Python and R, reducing manual data preparation time by 30%.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-2 w-1.5 h-1.5 bg-purple-400 rounded-full shrink-0 shadow-[0_0_8px_rgba(192,132,252,0.8)]"></span>
                <span><strong className="text-white font-semibold">Feature Engineering:</strong> Implementing advanced preprocessing techniques including categorical encoding, datetime extraction, and scaling/normalization.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-2 w-1.5 h-1.5 bg-pink-400 rounded-full shrink-0 shadow-[0_0_8px_rgba(244,114,182,0.8)]"></span>
                <span><strong className="text-white font-semibold">ML System Architecture:</strong> Designing end-to-end cloud-based AI architecture using AWS (S3, SageMaker) and Azure for Patient Risk Prediction.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-2 w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span><strong className="text-white font-semibold">Model Deployment:</strong> Deployed Random Forest and CNN models via Flask, ensuring scalability and monitoring.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <h3 className="text-[20px] font-bold mb-6 text-gray-300 drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>Selected Projects</h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <a 
                  key={proj.id} 
                  href={proj.html_url !== '#' ? proj.html_url : undefined} 
                  target={proj.html_url !== '#' ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex flex-col bg-white/5 backdrop-blur-lg rounded-3xl p-7 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    {proj.language && (
                      <span className="text-[11px] font-bold text-white bg-white/10 border border-white/10 px-2.5 py-1 rounded-md shadow-sm">
                        {proj.language}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[19px] font-bold mb-3 text-white group-hover:text-blue-300 transition-colors drop-shadow-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                    {proj.title}
                  </h4>
                  <p className="text-gray-300 text-[14px] leading-relaxed flex-1">
                    {proj.description}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

function CodingProfiles() {
  return (
    <section className="py-24 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[28px] sm:text-[32px] font-bold mb-12 tracking-tight text-white drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>Coding Profiles</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 flex flex-col items-center justify-center border border-white/10 shadow-xl hover:border-white/20 transition-all">
            <h3 className="text-[18px] font-bold mb-6 text-gray-200 w-full text-left" style={{ fontFamily: 'var(--font-heading)' }}>LeetCode</h3>
            <a href="https://leetcode.com/u/abhi28031/" target="_blank" rel="noreferrer" className="w-full flex justify-center hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="https://leetcard.jacoblin.cool/abhi28031?theme=dark&font=Inter&ext=activity" 
                alt="LeetCode Stats" 
                className="w-full max-w-[500px] rounded-xl shadow-lg border border-white/5"
              />
            </a>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 flex flex-col items-center justify-center border border-white/10 shadow-xl hover:border-white/20 transition-all">
            <h3 className="text-[18px] font-bold mb-6 text-gray-200 w-full text-left" style={{ fontFamily: 'var(--font-heading)' }}>GitHub Streak</h3>
            <a href="https://github.com/Abhi20O1" target="_blank" rel="noreferrer" className="w-full flex justify-center hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="https://github-readme-streak-stats.herokuapp.com/?user=Abhi20O1&theme=dark&hide_border=true&background=00000000&ring=3b82f6&fire=3b82f6&currStreakNum=ffffff&sideNums=ffffff&currStreakLabel=9ca3af&sideLabels=9ca3af&dates=9ca3af" 
                alt="GitHub Streak" 
                className="w-full max-w-[500px] rounded-xl shadow-lg"
              />
            </a>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 sm:p-10 border border-white/10 w-full overflow-x-auto flex flex-col items-center shadow-xl hover:border-white/20 transition-all">
          <h3 className="text-[18px] font-bold mb-8 text-gray-200 self-start" style={{ fontFamily: 'var(--font-heading)' }}>GitHub Contributions</h3>
          <div className="min-w-max">
            <GitHubCalendar 
              username="Abhi20O1" 
              colorScheme="dark"
              theme={{
                dark: ['rgba(255,255,255,0.05)', 'rgba(59,130,246,0.4)', 'rgba(59,130,246,0.6)', 'rgba(59,130,246,0.8)', 'rgba(59,130,246,1)'],
              }}
              style={{
                color: '#d1d5db',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Connect() {
  return (
    <section id="connect" className="py-24 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-3xl">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-[40px] sm:text-[56px] font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-300 drop-shadow-lg" style={{ fontFamily: 'var(--font-heading)' }}>Let's Connect</h2>
        <p className="text-gray-300 text-[18px] sm:text-[20px] mb-12 max-w-xl leading-relaxed drop-shadow-md">
          I'm currently looking for new opportunities. Whether you have a question or want to collaborate, my inbox is open.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
          <a href="https://wa.me/918126684451" target="_blank" rel="noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:bg-[#20b858] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.4)] text-[16px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12c0 1.76.45 3.4 1.25 4.84L2 22l5.31-1.21A9.973 9.973 0 0 0 11.99 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zM12 20c-1.59 0-3.08-.38-4.41-1.04l-.32-.16-3.28.75.76-3.21-.17-.32A7.95 7.95 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.23-5.69c-.23-.12-1.38-.68-1.59-.76-.21-.08-.36-.12-.51.12-.15.23-.61.76-.75.92-.14.15-.28.17-.51.05-.23-.12-1-.37-1.9-1.17-.7-.62-1.18-1.39-1.31-1.62-.14-.23-.01-.35.1-.47.1-.1.23-.26.35-.39.12-.13.15-.23.23-.39.08-.15.04-.29-.02-.41-.06-.12-.51-1.24-.7-1.69-.19-.44-.38-.51-.39-.13-.01-.28-.01-.43-.01-.15 0-.4.06-.61.29-.21.23-.81.79-.81 1.93 0 1.14.83 2.24.95 2.4.12.15 1.64 2.5 3.96 3.5.55.24 1.01.38 1.36.49.56.17 1.07.15 1.48.09.46-.07 1.38-.56 1.57-1.11.19-.55.19-1.01.13-1.11-.05-.09-.2-.14-.43-.26z"/></svg>
            WhatsApp Me
          </a>
          <a href="mailto:abhi28031@gmail.com" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-[16px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Send Email
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <a href="#" className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-lg backdrop-blur-md group cursor-pointer hover:border-white/30 transition-all duration-300">
            <span className="text-[16px] font-bold tracking-tight text-gray-300 group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
              AS
            </span>
          </a>
        </div>
        
        <div className="flex gap-8 text-gray-400 text-[14px] font-medium">
          <a href="https://github.com/Abhi20O1" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="mailto:abhi28031@gmail.com" className="hover:text-white transition-colors">Email</a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
        
        <div className="text-gray-500 text-[13px] font-medium">
          © 2026 Abhishek Singh.
        </div>
      </div>
    </footer>
  );
}

function InteractiveBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let targetTime = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (videoRef.current && videoRef.current.duration) {
        // Map mouse X position to video duration
        const xPercent = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
        targetTime = xPercent * videoRef.current.duration;
      }
    };

    const updateVideoTime = () => {
      if (videoRef.current && !isNaN(targetTime)) {
        // Smooth interpolation (lerp) towards target time
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
        className="w-full h-full object-cover opacity-40 mix-blend-screen" 
        muted 
        playsInline 
        preload="auto"
      />
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-white/20 selection:text-white">
      <InteractiveBackground />
      <div className="noise-texture"></div>
      
      <Navbar />
      <main>
        <About />
        <SkillsAndTech />
        <CertificatesAndAchievements />
        <Work />
        <CodingProfiles />
        <Connect />
      </main>
      <Footer />
    </div>
  );
}

export default App;
