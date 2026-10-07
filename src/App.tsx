import { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const links = ['About', 'Skills', 'Achievements', 'Work', 'Connect'];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 sm:px-12 w-full bg-[#000000]/90 backdrop-blur-xl border-b border-[#222]">
        <div className="flex items-center gap-2">
          <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0a0a0a] border border-[#222] group cursor-pointer hover:border-[#444] transition-colors duration-200">
            <span 
              className="text-[16px] font-bold tracking-tight text-white transition-colors duration-200"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              AS
            </span>
          </a>
        </div>
        <div className="hidden md:flex flex-row gap-8 text-[14px] text-gray-400 font-medium">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors cursor-pointer">
              {link}
            </a>
          ))}
        </div>
        <a href="https://wa.me/918126684451" target="_blank" rel="noreferrer" className="hidden md:block text-[13px] text-black bg-white px-5 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors cursor-pointer">
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
        className={`fixed inset-0 bg-[#000000]/95 backdrop-blur-xl z-[50] flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {links.map(link => (
          <a key={link} href={`#${link.toLowerCase()}`} className="text-[32px] font-bold text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={() => setIsOpen(false)} style={{ fontFamily: 'var(--font-heading)' }}>
            {link}
          </a>
        ))}
        <div className="w-12 h-[1px] bg-[#333] my-4"></div>
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md mb-8 border border-[#222] bg-[#0a0a0a]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Open to opportunities</span>
        </div>
        
        <h1 
          className="text-[48px] sm:text-[64px] md:text-[80px] font-bold tracking-tight leading-[1.05] mb-6 text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Abhishek Singh
        </h1>
        
        <h2 className="text-[24px] sm:text-[32px] md:text-[40px] text-gray-500 font-medium tracking-tight mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          Data Scientist & AI Engineer
        </h2>
        
        <p className="text-[16px] sm:text-[18px] md:text-[20px] text-gray-400 max-w-2xl leading-relaxed mb-10">
          Building and shipping scalable ML systems, computer vision solutions, and Gen AI applications with Python, TensorFlow, and AWS.
        </p>

        <div className="flex flex-wrap gap-4">
          <a href="#work" className="inline-flex items-center justify-center bg-white text-black font-medium rounded-full text-[14px] px-6 py-3 transition-opacity hover:opacity-90 duration-200">
            View Work
          </a>
          <a href="#connect" className="inline-flex items-center justify-center bg-[#0a0a0a] text-white border border-[#333] font-medium rounded-full text-[14px] px-6 py-3 transition-colors hover:bg-[#111] duration-200">
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
    <section id="skills" className="py-24 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-[#222]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[28px] sm:text-[32px] font-bold mb-12 tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>Skills & Technology</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(s => (
            <div key={s.category} className="p-6 bg-[#0a0a0a] rounded-2xl border border-[#222] hover:border-[#444] transition-colors duration-300">
              <h4 className="text-gray-500 text-[12px] uppercase tracking-wider mb-2 font-semibold">{s.category}</h4>
              <p className="text-[15px] text-gray-200">{s.items}</p>
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
    <section id="achievements" className="py-24 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-[#222]">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-[#0a0a0a] rounded-2xl p-8 border border-[#222] hover:border-[#444] transition-colors">
          <h2 className="text-[24px] font-bold mb-8 tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>Certificates</h2>
          <ul className="space-y-6 text-gray-400 text-[15px]">
            <li className="flex gap-4 items-start">
              <span className="mt-2 w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0"></span>
              <span>Data Analytics Job Simulation — <strong className="text-white font-medium">Deloitte</strong>.</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="mt-2 w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0"></span>
              <span>Machine Learning Course — <strong className="text-white font-medium">Infosys Springboard</strong>.</span>
            </li>
          </ul>
        </div>

        <div className="flex-1 bg-[#0a0a0a] rounded-2xl p-8 border border-[#222] hover:border-[#444] transition-colors">
          <h2 className="text-[24px] font-bold mb-8 tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>Education</h2>
          <div className="flex flex-col gap-6">
            {education.map(e => (
              <div key={e.deg} className="border-b border-[#222] pb-6 last:border-0 last:pb-0">
                <h3 className="text-[16px] font-bold mb-1 text-gray-200">{e.deg}</h3>
                <p className="text-[14px] text-gray-500 mb-2">{e.inst}</p>
                <div className="inline-block bg-[#111] border border-[#333] rounded-md px-2 py-0.5 text-[11px] text-gray-400 font-medium uppercase tracking-wider">{e.date}</div>
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
    <section id="work" className="py-24 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-[#222]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[28px] sm:text-[32px] font-bold mb-12 tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>Work & Projects</h2>
        
        {/* Experience Section */}
        <div className="mb-16">
          <h3 className="text-[18px] font-bold mb-6 text-gray-400" style={{ fontFamily: 'var(--font-heading)' }}>Experience</h3>
          <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-[#222] hover:border-[#444] transition-colors">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-6">
              <div>
                <h4 className="text-[20px] font-bold text-gray-100" style={{ fontFamily: 'var(--font-heading)' }}>Arcap REIT AI Solution</h4>
                <p className="text-[15px] text-gray-500 font-medium">Data Scientist Trainee</p>
              </div>
              <div className="inline-block bg-[#111] border border-[#333] rounded-md px-2 py-1 text-[12px] text-gray-400 font-medium tracking-wide w-max">
                Aug 2025 – Jan 2026
              </div>
            </div>
            
            <ul className="space-y-4 text-gray-400 text-[14px] leading-relaxed">
              <li className="flex gap-4 items-start">
                <span className="mt-1.5 w-1 h-1 bg-gray-500 rounded-full shrink-0"></span>
                <span><strong className="text-gray-300 font-medium">Data Pipeline Development:</strong> Developed automated data cleaning pipelines using Python and R, reducing manual data preparation time by 30%.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-1.5 w-1 h-1 bg-gray-500 rounded-full shrink-0"></span>
                <span><strong className="text-gray-300 font-medium">Feature Engineering:</strong> Implementing advanced preprocessing techniques including categorical encoding, datetime extraction, and scaling/normalization.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-1.5 w-1 h-1 bg-gray-500 rounded-full shrink-0"></span>
                <span><strong className="text-gray-300 font-medium">ML System Architecture:</strong> Designing end-to-end cloud-based AI architecture using AWS (S3, SageMaker) and Azure for Patient Risk Prediction.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-1.5 w-1 h-1 bg-gray-500 rounded-full shrink-0"></span>
                <span><strong className="text-gray-300 font-medium">Model Deployment:</strong> Deployed Random Forest and CNN models via Flask, ensuring scalability and monitoring.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <h3 className="text-[18px] font-bold mb-6 text-gray-400" style={{ fontFamily: 'var(--font-heading)' }}>Selected Projects</h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <a 
                  key={proj.id} 
                  href={proj.html_url !== '#' ? proj.html_url : undefined} 
                  target={proj.html_url !== '#' ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex flex-col bg-[#0a0a0a] rounded-2xl p-6 border border-[#222] hover:border-[#444] transition-colors duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    {proj.language && (
                      <span className="text-[11px] font-medium text-gray-400 bg-[#111] border border-[#333] px-2 py-0.5 rounded-md">
                        {proj.language}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[18px] font-bold mb-3 text-gray-200" style={{ fontFamily: 'var(--font-heading)' }}>
                    {proj.title}
                  </h4>
                  <p className="text-gray-500 text-[14px] leading-relaxed flex-1">
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
    <section className="py-24 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-[#222]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[28px] sm:text-[32px] font-bold mb-12 tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>Coding Profiles</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#0a0a0a] rounded-2xl p-6 flex flex-col items-center justify-center border border-[#222]">
            <h3 className="text-[16px] font-bold mb-6 text-gray-400 w-full text-left" style={{ fontFamily: 'var(--font-heading)' }}>LeetCode</h3>
            <a href="https://leetcode.com/u/abhi28031/" target="_blank" rel="noreferrer" className="w-full flex justify-center hover:opacity-80 transition-opacity">
              <img 
                src="https://leetcard.jacoblin.cool/abhi28031?theme=dark&font=Inter&ext=activity" 
                alt="LeetCode Stats" 
                className="w-full max-w-[500px] rounded-lg"
              />
            </a>
          </div>

          <div className="bg-[#0a0a0a] rounded-2xl p-6 flex flex-col items-center justify-center border border-[#222]">
            <h3 className="text-[16px] font-bold mb-6 text-gray-400 w-full text-left" style={{ fontFamily: 'var(--font-heading)' }}>GitHub Streak</h3>
            <a href="https://github.com/Abhi20O1" target="_blank" rel="noreferrer" className="w-full flex justify-center hover:opacity-80 transition-opacity">
              <img 
                src="https://github-readme-streak-stats.herokuapp.com/?user=Abhi20O1&theme=dark&hide_border=true&background=00000000&ring=555555&fire=aaaaaa&currStreakNum=ffffff&sideNums=ffffff&currStreakLabel=888888&sideLabels=888888&dates=888888" 
                alt="GitHub Streak" 
                className="w-full max-w-[500px] rounded-lg"
              />
            </a>
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-[#222] w-full overflow-x-auto flex flex-col items-center">
          <h3 className="text-[16px] font-bold mb-8 text-gray-400 self-start" style={{ fontFamily: 'var(--font-heading)' }}>GitHub Contributions</h3>
          <div className="min-w-max">
            <GitHubCalendar 
              username="Abhi20O1" 
              colorScheme="dark"
              theme={{
                dark: ['#111111', '#222222', '#444444', '#888888', '#ffffff'],
              }}
              style={{
                color: '#888',
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
    <section id="connect" className="py-24 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-[#222] bg-[#030303]">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-[32px] sm:text-[48px] font-bold mb-4 tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>Let's Connect</h2>
        <p className="text-gray-500 text-[16px] sm:text-[18px] mb-10 max-w-xl leading-relaxed">
          I'm currently looking for new opportunities. Whether you have a question or want to collaborate, my inbox is open.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a href="https://wa.me/918126684451" target="_blank" rel="noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1da851] text-white px-6 py-3 rounded-full font-medium hover:bg-[#189145] transition-colors text-[15px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12c0 1.76.45 3.4 1.25 4.84L2 22l5.31-1.21A9.973 9.973 0 0 0 11.99 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zM12 20c-1.59 0-3.08-.38-4.41-1.04l-.32-.16-3.28.75.76-3.21-.17-.32A7.95 7.95 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.23-5.69c-.23-.12-1.38-.68-1.59-.76-.21-.08-.36-.12-.51.12-.15.23-.61.76-.75.92-.14.15-.28.17-.51.05-.23-.12-1-.37-1.9-1.17-.7-.62-1.18-1.39-1.31-1.62-.14-.23-.01-.35.1-.47.1-.1.23-.26.35-.39.12-.13.15-.23.23-.39.08-.15.04-.29-.02-.41-.06-.12-.51-1.24-.7-1.69-.19-.44-.38-.51-.39-.13-.01-.28-.01-.43-.01-.15 0-.4.06-.61.29-.21.23-.81.79-.81 1.93 0 1.14.83 2.24.95 2.4.12.15 1.64 2.5 3.96 3.5.55.24 1.01.38 1.36.49.56.17 1.07.15 1.48.09.46-.07 1.38-.56 1.57-1.11.19-.55.19-1.01.13-1.11-.05-.09-.2-.14-.43-.26z"/></svg>
            WhatsApp
          </a>
          <a href="mailto:abhi28031@gmail.com" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#111] border border-[#333] text-white px-6 py-3 rounded-full font-medium hover:bg-[#222] hover:border-[#444] transition-colors text-[15px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Email
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 border-t border-[#222] bg-[#000000]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold tracking-tight text-gray-500" style={{ fontFamily: 'var(--font-heading)' }}>
            AS
          </span>
        </div>
        
        <div className="flex gap-6 text-gray-500 text-[13px] font-medium">
          <a href="https://github.com/Abhi20O1" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="mailto:abhi28031@gmail.com" className="hover:text-white transition-colors">Email</a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
        
        <div className="text-gray-600 text-[12px]">
          © 2026 Abhishek Singh.
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-white/20 selection:text-white">
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
