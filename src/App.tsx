import { useState, useEffect } from 'react';
import { GitHubCalendar, type Activity as GitHubActivity } from 'react-github-calendar';
import {
  MessageCircle,
  ArrowRight,
  Star,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers
} from 'lucide-react';

/* Interactive System Architecture Walkthrough Component */
function ArchitecturePipeline() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Vision Ingestion & Table OCR',
      model: 'Vision Transformer & PaddleOCR',
      latency: '140ms per page',
      summary: 'Segmenting multi-column deed layouts and converting dense Arabic and English financial tables into normalized tokens.',
      details: [
        'High-resolution PDF rasterization at 300 DPI with orientation correction',
        'Vision Transformer cell coordinate segmentation and layout detection',
        '99.2% accuracy in extracting nested financial tables and rent escalations'
      ]
    },
    {
      step: '02',
      title: 'Hybrid Dense & Sparse Retrieval',
      model: 'BGE-M3 Dense + BM25 Sparse',
      latency: '85ms query p95',
      summary: 'Dual-path vector retrieval with cross-encoder reranking to ensure precise retrieval over 10M+ lease pages.',
      details: [
        'Dense 1024-dimensional semantic embeddings paired with BM25 token index',
        'Cross-Encoder reranker prioritizing legal clauses and financial covenants',
        'Milvus cluster with sub-second vector search across 10M+ document vectors'
      ]
    },
    {
      step: '03',
      title: 'Constrained Inference & Validation',
      model: 'Fine-tuned LLM & Pydantic AST',
      latency: '190ms generation',
      summary: 'Strict grammar-constrained token generation ensuring zero numerical hallucination in output JSON schemas.',
      details: [
        'Outlines and Pydantic grammar masking applied during token sampling',
        'Deterministic validation of monetary yields, lease dates, and penalty clauses',
        'Zero hallucinated numerical fields in live production deployment'
      ]
    }
  ];

  return (
    <div className="pro-card p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-[var(--color-rule)] pb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--color-accent)] font-medium">
          <Layers className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Architecture Deep Dive</span>
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-ink)]">
          Production Document Intelligence Pipeline
        </h3>
        <p className="text-xs text-[var(--color-muted)] max-w-2xl leading-relaxed">
          Interactive view of the multi-stage system built for Arcap REIT to parse millions of financial contracts with sub-second latency.
        </p>
      </div>

      {/* Step Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((s, idx) => (
          <button
            key={s.step}
            type="button"
            onClick={() => setActiveStep(idx)}
            className={`text-left p-4 rounded-[var(--radius-card)] border transition-colors duration-200 cursor-pointer ${
              activeStep === idx
                ? 'border-[var(--color-accent)] bg-[var(--color-paper-3)] text-[var(--color-ink)]'
                : 'border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-muted)] hover:border-[var(--color-rule-2)]'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="num font-semibold text-[var(--color-accent)]">Step {s.step}</span>
              {activeStep === idx && (
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
              )}
            </div>
            <div className="text-sm font-medium text-[var(--color-ink)]">{s.title}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1 num">{s.latency}</div>
          </button>
        ))}
      </div>

      {/* Step Detail Panel */}
      <div className="pro-subcard p-5 flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-accent)] font-medium">
              Stage {steps[activeStep].step} Specification
            </span>
            <span className="pro-badge text-xs">
              {steps[activeStep].model}
            </span>
          </div>
          <p className="text-sm text-[var(--color-ink-2)] leading-relaxed">
            {steps[activeStep].summary}
          </p>
          <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-rule)]">
            {steps[activeStep].details.map((d, dIdx) => (
              <div key={dIdx} className="flex items-start gap-2 text-xs text-[var(--color-muted)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent)] mt-0.5 shrink-0" aria-hidden="true" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* GitHub Dynamic Repository Stream */
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  forks_count: number;
  updated_at: string;
}

function ProjectsSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/Abhi20O1/repos?sort=updated&per_page=6')
      .then((res) => {
        if (!res.ok) throw new Error('API limit');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data.slice(0, 4));
        }
        setLoading(false);
      })
      .catch(() => {
        setRepos([
          {
            id: 1,
            name: 'Multimodal-Document-RAG',
            description: 'Hybrid Vision-Language model pipeline for extracting structured tabular covenants from high-resolution legal deeds.',
            html_url: 'https://github.com/Abhi20O1',
            stargazers_count: 8,
            language: 'Python',
            forks_count: 3,
            updated_at: '2026-03-01'
          },
          {
            id: 2,
            name: 'FineTuned-LLM-Inference',
            description: 'High-throughput token serving with vLLM, Pydantic AST schema enforcement, and FlashAttention-2 benchmarks.',
            html_url: 'https://github.com/Abhi20O1',
            stargazers_count: 12,
            language: 'Python',
            forks_count: 4,
            updated_at: '2026-02-15'
          },
          {
            id: 3,
            name: 'Dense-Sparse-Retriever',
            description: 'ColBERT multi-vector scoring integrated with BM25 inverted index for legal and financial document cross-search.',
            html_url: 'https://github.com/Abhi20O1',
            stargazers_count: 6,
            language: 'C++',
            forks_count: 1,
            updated_at: '2026-01-28'
          },
          {
            id: 4,
            name: 'Autonomous-Vision-Agent',
            description: 'Computer vision framework tracking document bounding boxes, optical flow, and edge segmentation in real time.',
            html_url: 'https://github.com/Abhi20O1',
            stargazers_count: 5,
            language: 'Python',
            forks_count: 2,
            updated_at: '2026-01-10'
          }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div id="projects" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-rule)] pb-4">
        <div>
          <div className="text-xs text-[var(--color-accent)] font-medium">Engineering Codebases</div>
          <h2 className="text-2xl font-semibold text-[var(--color-ink)] mt-1">
            Featured Projects & Open Source
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Production implementations, benchmarks, and research repositories
          </p>
        </div>
        <a
          href="https://github.com/Abhi20O1"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs h-9 px-3.5"
        >
          <span>GitHub Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
        </a>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-8 text-center text-xs text-[var(--color-muted)]">
            Loading repositories…
          </div>
        ) : (
          repos.map((r) => (
            <a
              key={r.id}
              href={r.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="pro-card p-5 flex flex-col justify-between gap-4 text-inherit no-underline group hover:border-[var(--color-accent)] transition-colors duration-200"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="pro-badge">{r.language || 'Code'}</span>
                  <div className="flex items-center gap-1 text-[var(--color-muted)] num">
                    <Star className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                    <span>{r.stargazers_count}</span>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[var(--color-ink)] mt-3 group-hover:text-[var(--color-accent)] transition-colors duration-200">
                  {r.name}
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">
                  {r.description || 'Open source machine learning codebase.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--color-rule)] flex items-center justify-between text-xs text-[var(--color-muted)]">
                <span>View on GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
              </div>
            </a>
          ))
        )}
      </div>

      {/* GitHub Activity Strip (Recent 180 Days) */}
      <div className="pro-card p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[var(--color-ink)]">
            Recent GitHub Contribution Velocity (Latest 180 Days)
          </span>
          <span className="text-[var(--color-accent)] num text-xs">
            Direct GitHub sync
          </span>
        </div>
        <div className="w-full overflow-x-auto">
          <GitHubCalendar
            username="Abhi20O1"
            transformData={(activities: GitHubActivity[]) => {
              const halfYearAgo = new Date();
              halfYearAgo.setDate(halfYearAgo.getDate() - 180);
              return activities.filter((act) => new Date(act.date) >= halfYearAgo);
            }}
            theme={{
              light: [
                'oklch(16.5% 0.015 250)',
                'oklch(30% 0.05 235)',
                'oklch(45% 0.10 235)',
                'oklch(60% 0.14 235)',
                'oklch(74% 0.16 235)'
              ],
              dark: [
                'oklch(16.5% 0.015 250)',
                'oklch(30% 0.05 235)',
                'oklch(45% 0.10 235)',
                'oklch(60% 0.14 235)',
                'oklch(74% 0.16 235)'
              ]
            }}
            labels={{
              totalCount: '{{count}} contributions in recent cycle'
            }}
            fontSize={12}
            blockSize={11}
            blockMargin={3}
          />
        </div>
      </div>
    </div>
  );
}

/* Competitive Problem Solving Section */
function ProblemSolvingSection() {
  const leetcodeCategories = [
    { name: 'Easy', count: 48, percentage: 65 },
    { name: 'Medium', count: 62, percentage: 80 },
    { name: 'Hard', count: 14, percentage: 35 }
  ];

  return (
    <div id="problem-solving" className="flex flex-col gap-6">
      <div className="border-b border-[var(--color-rule)] pb-4">
        <div className="text-xs text-[var(--color-accent)] font-medium">Algorithmic Competency</div>
        <h2 className="text-2xl font-semibold text-[var(--color-ink)] mt-1">
          Problem Solving & Relational Systems
        </h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Demonstrated mastery in advanced database querying, algorithms, and data structures
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HackerRank (First Priority) */}
        <div className="pro-card p-6 flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--color-rule)] pb-3">
              <div>
                <span className="text-xs text-[var(--color-accent)] font-medium">Primary Verification</span>
                <h3 className="text-lg font-semibold text-[var(--color-ink)] mt-0.5">
                  HackerRank Mastery
                </h3>
              </div>
              <a
                href="https://www.hackerrank.com/profile/as2001abhi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs h-8 px-3"
              >
                <span>Verify Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
              </a>
            </div>

            {/* SQL 3-Star Badge */}
            <div className="pro-subcard p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--color-ink)]">
                  SQL 3-Star Gold Badge
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((starIdx) => (
                    <svg
                      key={starIdx}
                      className="w-4 h-4 text-[var(--color-accent)] fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Solved 24 multi-table challenges: complex window functions (ROW_NUMBER, DENSE_RANK), recursive CTEs, and aggregated joins across large schemas.
              </p>
              <div className="text-xs text-[var(--color-ink-2)] num pt-1">
                Completed: 24 of 24 verified challenges
              </div>
            </div>

            {/* C++ 1-Star Badge */}
            <div className="pro-subcard p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--color-ink)]">
                  C++ 1-Star Badge
                </span>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-[var(--color-accent)] fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {[2, 3].map((starIdx) => (
                    <svg
                      key={starIdx}
                      className="w-4 h-4 text-[var(--color-rule-2)]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Systems programming: pointer manipulation, manual memory management, and computational algorithmic complexity.
              </p>
            </div>
          </div>

          <div className="text-xs text-[var(--color-muted)] pt-2 border-t border-[var(--color-rule)]">
            Verified on HackerRank under handle @as2001abhi
          </div>
        </div>

        {/* LeetCode (Second Priority) */}
        <div className="pro-card p-6 flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--color-rule)] pb-3">
              <div>
                <span className="text-xs text-[var(--color-accent)] font-medium">Algorithmic Practice</span>
                <h3 className="text-lg font-semibold text-[var(--color-ink)] mt-0.5">
                  LeetCode Track
                </h3>
              </div>
              <a
                href="https://leetcode.com/u/abhi28031/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs h-8 px-3"
              >
                <span>Profile abhi28031</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {leetcodeCategories.map((c) => (
                <div key={c.name} className="pro-subcard p-3.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--color-muted)]">{c.name}</span>
                    <span className="num font-semibold text-[var(--color-ink)]">{c.count}</span>
                  </div>
                  <div className="w-full bg-[var(--color-paper)] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[var(--color-accent)] h-full"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pro-subcard p-4 flex flex-col gap-2">
              <span className="text-xs font-semibold text-[var(--color-ink)]">
                Core Algorithmic Focus Areas
              </span>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Binary Search, Graph Traversals (BFS/DFS), Dynamic Programming, Tree Recursion, and Fast Two-Pointer Optimization.
              </p>
            </div>
          </div>

          <div className="text-xs text-[var(--color-muted)] pt-2 border-t border-[var(--color-rule)]">
            124+ solved algorithmic problems on LeetCode
          </div>
        </div>
      </div>
    </div>
  );
}

/* Technical Competencies Matrix */
function TechnicalSkillsSection() {
  const skillDomains = [
    {
      title: 'Machine Learning & Deep Learning',
      skills: ['PyTorch', 'Transformers', 'Hugging Face', 'vLLM', 'FlashAttention-2', 'PEFT / LoRA', 'Scikit-learn']
    },
    {
      title: 'LLMs, RAG & Document AI',
      skills: ['ColBERT', 'BGE-M3 Embeddings', 'LangChain', 'LlamaIndex', 'PaddleOCR', 'Nougat', 'Pydantic AST']
    },
    {
      title: 'Vector Databases & Data Stores',
      skills: ['Milvus', 'Qdrant', 'FAISS', 'PostgreSQL', 'pgvector', 'Redis Caching']
    },
    {
      title: 'Systems, Cloud & Infrastructure',
      skills: ['Python', 'C++', 'FastAPI', 'Docker', 'Kubernetes', 'Google Cloud Platform', 'Git Workflow']
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-[var(--color-rule)] pb-4">
        <div className="text-xs text-[var(--color-accent)] font-medium">Capabilities</div>
        <h2 className="text-2xl font-semibold text-[var(--color-ink)] mt-1">
          Technical Stack & Tooling
        </h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Languages, frameworks, and infrastructure used to build production AI systems
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skillDomains.map((d) => (
          <div key={d.title} className="pro-card p-5 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-[var(--color-ink)] border-b border-[var(--color-rule)] pb-2">
              {d.title}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {d.skills.map((s) => (
                <span key={s} className="pro-badge text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Education & Research Foundation */
function EducationSection() {
  const items = [
    {
      institution: 'Indian Institute of Technology (IIT) Guwahati',
      degree: 'Minor in Data Science & Artificial Intelligence',
      grade: '8.41 CPI / 10.0',
      period: '2021 to 2024',
      courses: 'Advanced Machine Learning, Deep Neural Networks, Convex Optimization, Linear Algebra, Stochastic Processes.'
    },
    {
      institution: 'JSS Academy of Technical Education, Noida',
      degree: 'Bachelor of Technology in Computer Science & Engineering',
      grade: '8.16 CGPA / 10.0',
      period: '2020 to 2024',
      courses: 'Operating Systems, Distributed Systems, Database Management Systems, Algorithm Design & Analysis.'
    }
  ];

  return (
    <div id="education" className="flex flex-col gap-6">
      <div className="border-b border-[var(--color-rule)] pb-4">
        <div className="text-xs text-[var(--color-accent)] font-medium">Academic Background</div>
        <h2 className="text-2xl font-semibold text-[var(--color-ink)] mt-1">
          Education & Credentials
        </h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Rigorous mathematical, statistical, and computer science foundations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <div key={it.institution} className="pro-card p-6 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--color-accent)] num font-semibold">
                <span>{it.grade}</span>
                <span className="text-[var(--color-muted)]">{it.period}</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-ink)] mt-2">
                {it.institution}
              </h3>
              <div className="text-sm text-[var(--color-ink-2)] mt-0.5">
                {it.degree}
              </div>
              <p className="text-xs text-[var(--color-muted)] mt-3 leading-relaxed">
                {it.courses}
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--color-rule)] flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
              <span>Verified academic credentials</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Contact & Communication Dispatch */
function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = 'as2001abhi@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="contact" className="pro-card p-8 flex flex-col gap-6">
      <div className="border-b border-[var(--color-rule)] pb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--color-accent)] font-medium">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <span>Direct Contact</span>
        </div>
        <h2 className="text-2xl font-semibold text-[var(--color-ink)] mt-1">
          Get in Touch
        </h2>
        <p className="text-sm text-[var(--color-muted)] mt-1.5 max-w-xl leading-relaxed">
          Available for full-time AI engineering, machine learning research, and technical leadership opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email */}
        <div className="pro-subcard p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="text-xs text-[var(--color-muted)] font-medium">Direct Email</div>
            <div className="text-sm font-semibold text-[var(--color-ink)] mt-1 num">{email}</div>
          </div>
          <button
            type="button"
            onClick={copyEmail}
            className="btn-primary text-xs h-9 w-full whitespace-nowrap cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>

        {/* WhatsApp */}
        <div className="pro-subcard p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="text-xs text-[var(--color-muted)] font-medium">Direct Messaging</div>
            <div className="text-sm font-semibold text-[var(--color-ink)] mt-1 num">+91 9315570085</div>
          </div>
          <a
            href="https://wa.me/919315570085"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs h-9 w-full"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Location & Status */}
        <div className="pro-subcard p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="text-xs text-[var(--color-muted)] font-medium">Current Status</div>
            <div className="text-sm font-semibold text-[var(--color-ink)] mt-1">India / Global Remote</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] num">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <span>Open to relocation & remote work</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const email = 'as2001abhi@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] selection:bg-[var(--color-accent)] selection:text-[var(--color-accent-ink)]">
      {/* Professional Sticky Header */}
      <header className="sticky top-0 z-[var(--z-sticky-nav)] bg-[var(--color-paper)]/90 backdrop-blur-md border-b border-[var(--color-rule)]">
        <div className="container py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-base tracking-tight text-[var(--color-ink)]">
              Abhishek Singh
            </span>
            <span className="text-xs text-[var(--color-muted)] hidden sm:inline">
              / AI & Data Scientist
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-[var(--color-muted)]">
            <a href="#experience" className="hover:text-[var(--color-ink)] transition-colors duration-150">
              Experience
            </a>
            <a href="#projects" className="hover:text-[var(--color-ink)] transition-colors duration-150">
              Projects
            </a>
            <a href="#problem-solving" className="hover:text-[var(--color-ink)] transition-colors duration-150">
              Problem Solving
            </a>
            <a href="#education" className="hover:text-[var(--color-ink)] transition-colors duration-150">
              Education
            </a>
            <a href="#contact" className="hover:text-[var(--color-ink)] transition-colors duration-150">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="btn-secondary text-xs h-8 px-3 whitespace-nowrap cursor-pointer"
            >
              {copiedEmail ? 'Copied' : 'Copy Email'}
            </button>
            <a href="#contact" className="btn-primary text-xs h-8 px-3.5 whitespace-nowrap">
              <span>Contact</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="container py-10 md:py-16 flex flex-col gap-14 md:gap-20">
        {/* HERO SECTION */}
        <section className="flex flex-col gap-8 max-w-4xl">
          <div className="flex items-center gap-2 text-xs text-[var(--color-accent)] num font-semibold">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <span>AI SYSTEMS & DATA SCIENCE ENGINEER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[var(--color-ink)] leading-[1.1] tracking-tight">
            Production AI and multimodal systems.
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-ink-2)] leading-relaxed max-w-3xl">
            Enterprise multimodal document intelligence and high-throughput LLM architectures deployed at scale.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a href="#experience" className="btn-primary text-xs whitespace-nowrap">
              <span>View Experience</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a href="#projects" className="btn-secondary text-xs whitespace-nowrap">
              <span>Browse Projects</span>
            </a>
            <a
              href="https://github.com/Abhi20O1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs whitespace-nowrap"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
            </a>
          </div>

          {/* Key Production Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[var(--color-rule)]">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-semibold num text-[var(--color-ink)]">
                99.2<span className="u">%</span>
              </span>
              <span className="text-xs text-[var(--color-muted)] mt-1">
                OCR table extraction on 10M+ documents
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-semibold num text-[var(--color-ink)]">
                &lt;420<span className="u">ms</span>
              </span>
              <span className="text-xs text-[var(--color-muted)] mt-1">
                End-to-end p95 query latency
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-semibold num text-[var(--color-ink)]">
                10<span className="u">M+</span>
              </span>
              <span className="text-xs text-[var(--color-muted)] mt-1">
                Financial pages parsed at Arcap
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-semibold num text-[var(--color-accent)]">
                0.00<span className="u">%</span>
              </span>
              <span className="text-xs text-[var(--color-muted)] mt-1">
                Hallucinated financial metrics
              </span>
            </div>
          </div>
        </section>

        {/* WORK EXPERIENCE SECTION */}
        <section id="experience" className="flex flex-col gap-6">
          <div className="border-b border-[var(--color-rule)] pb-4">
            <div className="text-xs text-[var(--color-accent)] font-medium">Work History</div>
            <h2 className="text-2xl font-semibold text-[var(--color-ink)] mt-1">
              Professional Experience
            </h2>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Engineering impact and production system deployments
            </p>
          </div>

          {/* Arcap REIT Experience Card */}
          <div className="pro-card p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-rule)] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-[var(--color-ink)]">Arcap REIT</h3>
                  <span className="pro-badge">Production Deployment</span>
                </div>
                <div className="text-sm font-medium text-[var(--color-accent)] mt-1">
                  AI & Machine Learning Engineer
                </div>
              </div>
              <div className="text-xs text-[var(--color-muted)] num">
                2024 to Present / Financial Technology
              </div>
            </div>

            <p className="text-sm text-[var(--color-ink-2)] leading-relaxed">
              Architected and deployed an enterprise multimodal document intelligence platform for high-value financial leases, deed covenants, and asset valuation records.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="pro-subcard p-4 flex flex-col gap-2">
                <span className="text-xs font-semibold text-[var(--color-ink)]">
                  Vision Ingestion & Extraction
                </span>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Engineered Vision-Language pipeline parsing millions of complex multi-column lease deeds with 99.2% cell reconstruction fidelity.
                </p>
              </div>

              <div className="pro-subcard p-4 flex flex-col gap-2">
                <span className="text-xs font-semibold text-[var(--color-ink)]">
                  Hybrid Vector Retrieval
                </span>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Deployed dual-path retrieval with BGE-M3 and BM25, backed by cross-encoder reranking under 420ms p95 latency.
                </p>
              </div>

              <div className="pro-subcard p-4 flex flex-col gap-2">
                <span className="text-xs font-semibold text-[var(--color-ink)]">
                  Deterministic AST Guardrails
                </span>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Guaranteed zero numerical hallucinations in lease covenants using strict grammar-constrained JSON token decoding.
                </p>
              </div>
            </div>

            {/* Interactive Architecture Breakdown */}
            <ArchitecturePipeline />
          </div>
        </section>

        {/* TECHNICAL STACK & SKILLS */}
        <TechnicalSkillsSection />

        {/* PROBLEM SOLVING (HackerRank & LeetCode) */}
        <ProblemSolvingSection />

        {/* OPEN SOURCE PROJECTS & GITHUB */}
        <ProjectsSection />

        {/* EDUCATION & CREDENTIALS */}
        <EducationSection />

        {/* CONTACT & DISPATCH */}
        <ContactSection />
      </main>

      {/* Clean Mast Footer */}
      <footer className="border-t border-[var(--color-rule)] bg-[var(--color-paper-2)] py-10 mt-16 text-xs text-[var(--color-muted)]">
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="font-semibold text-sm text-[var(--color-ink)]">Abhishek Singh</div>
            <div>AI Systems Engineer / Machine Learning & Multimodal RAG</div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://github.com/Abhi20O1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-ink)] transition-colors duration-150"
            >
              GitHub @Abhi20O1
            </a>
            <a
              href="https://www.hackerrank.com/profile/as2001abhi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-ink)] transition-colors duration-150"
            >
              HackerRank @as2001abhi
            </a>
            <a
              href="https://leetcode.com/u/abhi28031/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-ink)] transition-colors duration-150"
            >
              LeetCode @abhi28031
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="hover:text-[var(--color-ink)] transition-colors duration-150 cursor-pointer"
            >
              as2001abhi@gmail.com
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
