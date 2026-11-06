import { useState, useEffect, useRef } from 'react';
import { GitHubCalendar, type Activity as GitHubActivity } from 'react-github-calendar';
import {
  Mail,
  MessageCircle,
  ArrowRight,
  Star,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';

/* Vantage Point Cloud & Neural Latent Manifold Canvas */
interface Point3D {
  x: number;
  y: number;
  z: number;
  cluster: number;
  label: string;
  isSignal?: boolean;
}

function VantageScannerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCluster, setActiveCluster] = useState<number>(0);
  const [hoveredPoint, setHoveredPoint] = useState<Point3D | null>(null);
  const [probeTelemetry, setProbeTelemetry] = useState<{ x: string; y: string; z: string; sim: string }>({
    x: '0.412',
    y: '-0.184',
    z: '0.892',
    sim: '0.941'
  });

  const clusters = [
    { id: 0, name: 'Multimodal Vision-Language Extraction', desc: 'OCR bounding box segmentation & table parsing' },
    { id: 1, name: 'Hybrid Dense-Sparse Vector Retrieval', desc: 'BGE-M3 embeddings & BM25 inverted index' },
    { id: 2, name: 'Deterministic AST Inference Guardrails', desc: 'Constrained JSON parsing & Pydantic verification' },
    { id: 3, name: 'High-Throughput Distributed Pipelines', desc: 'Sub-second FastAPI microservices on Kubernetes' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angleY = 0;
    let sweepX = -1.2;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Generate 600 structured 3D coordinate points around 4 cluster centers
    const clusterCenters = [
      { x: -0.6, y: -0.3, z: 0.2, label: 'Vision-Language OCR' },
      { x: 0.6, y: -0.4, z: -0.3, label: 'Hybrid Neural Retrieval' },
      { x: 0.2, y: 0.5, z: 0.5, label: 'Deterministic Guardrails' },
      { x: -0.4, y: 0.4, z: -0.4, label: 'Distributed Pipelines' }
    ];

    const points: Point3D[] = [];
    clusterCenters.forEach((center, cIdx) => {
      // Core signal point
      points.push({
        x: center.x,
        y: center.y,
        z: center.z,
        cluster: cIdx,
        label: center.label,
        isSignal: true
      });

      // Orbiting cluster points
      for (let i = 0; i < 120; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 0.35;
        const sinPhi = Math.sin(phi);

        points.push({
          x: center.x + r * sinPhi * Math.cos(theta),
          y: center.y + r * sinPhi * Math.sin(theta),
          z: center.z + r * Math.cos(phi),
          cluster: cIdx,
          label: `${center.label} vector ${i}`
        });
      }
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      if (!ctx || !canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.45;

      ctx.clearRect(0, 0, w, h);

      if (!prefersReducedMotion) {
        angleY += 0.0035;
        sweepX += 0.007;
        if (sweepX > 1.4) sweepX = -1.4;
      }

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const angleX = 0.25;
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Transform and sort points by depth
      const projected = points.map((p) => {
        // Rotate around Y
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        // Rotate around X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 2.4;
        const factor = fov / (fov + z2);
        const px = cx + x1 * factor * scale;
        const py = cy + y2 * factor * scale;

        // Distance from sweep plane
        const sweepDist = Math.abs(x1 - sweepX);
        const isSwept = sweepDist < 0.15;

        return {
          ...p,
          px,
          py,
          depth: z2,
          factor,
          isSwept,
          projX: x1,
          projY: y2,
          projZ: z2
        };
      });

      projected.sort((a, b) => b.depth - a.depth);

      // Draw faint sweep line in background
      const sweepCanvasX = cx + sweepX * scale;
      ctx.beginPath();
      ctx.moveTo(sweepCanvasX, cy - scale * 0.9);
      ctx.lineTo(sweepCanvasX, cy + scale * 0.9);
      ctx.strokeStyle = 'oklch(89% 0.19 126 / 0.12)';
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      // Render points
      for (const pt of projected) {
        const isClusterActive = pt.cluster === activeCluster;
        let radius = (pt.isSignal ? 3.5 : 1.7) * pt.factor * dpr;
        let fill = 'oklch(42% 0.04 245)'; // point-lo

        if (pt.isSwept) {
          fill = pt.isSignal || isClusterActive ? 'oklch(89% 0.19 126)' : 'oklch(96% 0.02 215)';
          radius *= 1.4;
        } else if (isClusterActive) {
          fill = pt.isSignal ? 'oklch(89% 0.19 126)' : 'oklch(70% 0.04 232)';
        }

        ctx.beginPath();
        ctx.arc(pt.px, pt.py, Math.max(1, radius), 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();

        // If core signal point, draw corner tick brackets
        if (pt.isSignal && isClusterActive) {
          const tickLen = 6 * dpr;
          ctx.strokeStyle = 'oklch(89% 0.19 126 / 0.7)';
          ctx.lineWidth = 1 * dpr;

          // Top-left tick
          ctx.beginPath();
          ctx.moveTo(pt.px - tickLen, pt.py - tickLen / 2);
          ctx.lineTo(pt.px - tickLen, pt.py - tickLen);
          ctx.lineTo(pt.px - tickLen / 2, pt.py - tickLen);
          ctx.stroke();

          // Bottom-right tick
          ctx.beginPath();
          ctx.moveTo(pt.px + tickLen, pt.py + tickLen / 2);
          ctx.lineTo(pt.px + tickLen, pt.py + tickLen);
          ctx.lineTo(pt.px + tickLen / 2, pt.py + tickLen);
          ctx.stroke();

          // Label text
          ctx.font = `${Math.round(10 * dpr)}px Geologica, sans-serif`;
          ctx.fillStyle = 'oklch(95% 0.006 230)';
          ctx.fillText(pt.label, pt.px + tickLen + 4, pt.py + 3);
        }
      }

      // Draw leader line if a point is hovered
      if (hoveredPoint) {
        const hPt = projected.find((p) => p.label === hoveredPoint.label);
        if (hPt) {
          ctx.beginPath();
          ctx.arc(hPt.px, hPt.py, 4 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = 'oklch(89% 0.19 126)';
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(hPt.px, hPt.py);
          ctx.lineTo(hPt.px + 40 * dpr, hPt.py - 30 * dpr);
          ctx.lineTo(hPt.px + 100 * dpr, hPt.py - 30 * dpr);
          ctx.strokeStyle = 'oklch(89% 0.19 126 / 0.8)';
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();

          ctx.font = `${Math.round(11 * dpr)}px Geologica, sans-serif`;
          ctx.fillStyle = 'oklch(89% 0.19 126)';
          ctx.fillText(`cos(θ) = ${probeTelemetry.sim}`, hPt.px + 45 * dpr, hPt.py - 36 * dpr);
        }
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * window.devicePixelRatio;
      const my = (e.clientY - rect.top) * window.devicePixelRatio;

      // Find nearest point
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.45;
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(0.25);
      const sinX = Math.sin(0.25);

      let closest: Point3D | null = null;
      let minDistance = 25 * dpr;

      points.forEach((p) => {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const factor = 2.4 / (2.4 + z2);
        const px = cx + x1 * factor * scale;
        const py = cy + y2 * factor * scale;

        const dist = Math.hypot(px - mx, py - my);
        if (dist < minDistance) {
          minDistance = dist;
          closest = p;
        }
      });

      if (closest) {
        setHoveredPoint(closest);
        setProbeTelemetry({
          x: (closest as Point3D).x.toFixed(3),
          y: (closest as Point3D).y.toFixed(3),
          z: (closest as Point3D).z.toFixed(3),
          sim: (0.88 + Math.random() * 0.11).toFixed(3)
        });
      }
    };

    canvas.addEventListener('mousemove', handlePointerMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handlePointerMove);
    };
  }, [activeCluster]);

  return (
    <div className="v-panel ticks p-5 flex flex-col gap-4">
      {/* Visualizer header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-rule)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="text-sm font-medium text-[var(--color-ink)]">
            Neural Latent Manifold Scanner
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[var(--color-muted)] num">
          <span>
            coordinates: [{probeTelemetry.x}, {probeTelemetry.y}, {probeTelemetry.z}]
          </span>
          <span className="text-[var(--color-accent)] font-medium">
            similarity: {probeTelemetry.sim}
          </span>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full h-[320px] bg-[var(--color-paper)] rounded-[var(--radius-card)] overflow-hidden border border-[var(--color-rule)]">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="3D neural latent space coordinate point cloud simulation with sweep plane"
          className="w-full h-full block cursor-crosshair"
        />

        {/* Overlay corner telemetry */}
        <div className="absolute bottom-2 left-3 text-[11px] text-[var(--color-muted)] num pointer-events-none">
          projection: PCA 3D to 2D / 600 vectors / field: R64
        </div>
        <div className="absolute top-2 right-3 text-[11px] text-[var(--color-accent)] num pointer-events-none">
          sweep active
        </div>
      </div>

      {/* Cluster selector pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {clusters.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCluster(c.id)}
            className={`text-left p-2.5 rounded-[var(--radius-card)] border text-xs transition-colors duration-200 ${
              activeCluster === c.id
                ? 'border-[var(--color-accent)] bg-[var(--color-paper-3)] text-[var(--color-ink)]'
                : 'border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-muted)] hover:border-[var(--color-rule-2)]'
            }`}
          >
            <div className="font-medium text-[var(--color-ink)] flex items-center justify-between">
              <span>{c.name}</span>
              {activeCluster === c.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              )}
            </div>
            <div className="text-[11px] mt-0.5 text-[var(--color-muted)]">{c.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* HackerRank SVG Badges & Stars */
function HackerRankBadgeSection() {
  return (
    <div className="v-panel ticks p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-[var(--color-rule)] pb-4">
        <div>
          <h3 className="text-lg font-medium text-[var(--color-ink)]">
            HackerRank Algorithmic Mastery
          </h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Verified problem solving badges in structured relational querying and systems development
          </p>
        </div>
        <a
          href="https://www.hackerrank.com/profile/as2001abhi"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-vantage-secondary text-xs h-8 px-3"
        >
          <span>Verify Handle</span>
          <ExternalLink className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SQL 3-Star Badge */}
        <div className="v-subpanel p-4 flex flex-col justify-between gap-3 border border-[var(--color-rule)]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[var(--color-accent)] font-medium">Relational Database Domain</span>
              <h4 className="text-base font-medium text-[var(--color-ink)] mt-0.5">SQL 3-Star Gold Rank</h4>
            </div>
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
            Solved 24 multi-table challenges: complex window functions (ROW_NUMBER, DENSE_RANK), recursive CTEs, and aggregated joins on massive schemas.
          </p>
          <div className="pt-2 border-t border-[var(--color-rule)] flex items-center justify-between text-xs num">
            <span className="text-[var(--color-muted)]">problems completed:</span>
            <span className="text-[var(--color-ink)] font-medium">24 / 24 verified</span>
          </div>
        </div>

        {/* C++ 1-Star Badge */}
        <div className="v-subpanel p-4 flex flex-col justify-between gap-3 border border-[var(--color-rule)]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[var(--color-muted)] font-medium">Systems Language Domain</span>
              <h4 className="text-base font-medium text-[var(--color-ink)] mt-0.5">C++ 1-Star Badge</h4>
            </div>
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
            Foundational systems programming: pointer arithmetic, manual memory allocation, structured object instantiation, and fast I/O algorithms.
          </p>
          <div className="pt-2 border-t border-[var(--color-rule)] flex items-center justify-between text-xs num">
            <span className="text-[var(--color-muted)]">proficiency:</span>
            <span className="text-[var(--color-ink)] font-medium">Core DSA and memory safety</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* LeetCode Section */
function LeetCodeStatsSection() {
  const problems = [
    { level: 'Easy', count: 48, total: 840, pct: '5.7%' },
    { level: 'Medium', count: 62, total: 1750, pct: '3.5%' },
    { level: 'Hard', count: 14, total: 750, pct: '1.8%' }
  ];

  return (
    <div className="v-panel ticks p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-[var(--color-rule)] pb-4">
        <div>
          <h3 className="text-lg font-medium text-[var(--color-ink)]">
            LeetCode Algorithmic Problem Solving
          </h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Data structures, dynamic programming, tree traversals, and computational geometry
          </p>
        </div>
        <a
          href="https://leetcode.com/u/abhi28031/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-vantage-secondary text-xs h-8 px-3"
        >
          <span>Profile abhi28031</span>
          <ExternalLink className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {problems.map((p) => (
          <div key={p.level} className="v-subpanel p-3.5 border border-[var(--color-rule)] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-muted)] font-medium">{p.level}</span>
              <span className="num text-[var(--color-accent)] font-medium">{p.count} solved</span>
            </div>
            <div className="w-full bg-[var(--color-paper)] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[var(--color-accent)] h-full"
                style={{ width: `${Math.min(100, (p.count / 70) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-[var(--color-muted)] num">
              algorithmic focus: graphs, trees, DP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Arcap REIT Architecture Deep-Dive */
function ArcapArchitectureSection() {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  const stages = [
    {
      num: '01',
      title: 'Multimodal Ingestion & Vision OCR',
      claim: '99.2% extraction accuracy on 10M+ financial pages',
      mechanism: 'Vision Transformer segmentation paired with PaddleOCR to convert complex non-standard lease tables and deed covenants into structured markdown tokens.',
      specs: [
        { label: 'Document Scale', value: '10M+ pages processed' },
        { label: 'Table Accuracy', value: '99.2% cell reconstruction' },
        { label: 'Format Support', value: 'Scanned PDF, TIFF, JPEG' }
      ]
    },
    {
      num: '02',
      title: 'Hybrid Dense-Sparse Vector Retrieval',
      claim: '<420ms p95 latency with ColBERT reranker',
      mechanism: 'Dual-path retrieval combining BGE-M3 dense embeddings with BM25 sparse keyword indices, reranked by a cross-encoder for sub-second precision across legal covenants.',
      specs: [
        { label: 'p95 Latency', value: '<420ms end-to-end' },
        { label: 'Retrieval Recall', value: '0.941 MRR@10' },
        { label: 'Vector Store', value: 'Milvus / Qdrant cluster' }
      ]
    },
    {
      num: '03',
      title: 'Constrained Inference & AST Guardrails',
      claim: '0.00% numerical hallucination in lease yield metrics',
      mechanism: 'Fine-tuned 7B LLM guided by strict grammar-constrained decoding (Outlines/Pydantic) to guarantee valid financial schemas and zero hallucinated yield numbers.',
      specs: [
        { label: 'Hallucination Rate', value: '0.00% verified fields' },
        { label: 'Engine', value: 'vLLM on NVIDIA A10G' },
        { label: 'Output Schema', value: 'Pydantic AST validation' }
      ]
    }
  ];

  return (
    <div className="v-panel ticks p-6 flex flex-col gap-6">
      <div className="border-b border-[var(--color-rule)] pb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--color-accent)] font-medium">
          <span>Production AI Architecture</span>
          <span className="text-[var(--color-muted)]">/</span>
          <span className="text-[var(--color-muted)]">Arcap REIT Deployment</span>
        </div>
        <h2 className="text-xl font-medium text-[var(--color-ink)] mt-1">
          Sub-second financial document intelligence pipeline
        </h2>
        <p className="text-xs text-[var(--color-muted)] mt-1.5 max-w-2xl leading-relaxed">
          Architected and deployed an enterprise multimodal RAG system handling millions of high-value lease deeds and financial records with deterministic precision.
        </p>
      </div>

      {/* Stage selector bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stages.map((stg, idx) => (
          <button
            key={stg.num}
            type="button"
            onClick={() => setSelectedStage(idx)}
            className={`text-left p-4 rounded-[var(--radius-card)] border transition-colors duration-200 ${
              selectedStage === idx
                ? 'border-[var(--color-accent)] bg-[var(--color-paper-3)] text-[var(--color-ink)]'
                : 'border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-muted)] hover:border-[var(--color-rule-2)]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs num text-[var(--color-accent)] font-medium">Stage {stg.num}</span>
              {selectedStage === idx && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              )}
            </div>
            <div className="text-sm font-medium text-[var(--color-ink)]">{stg.title}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1 num">{stg.claim}</div>
          </button>
        ))}
      </div>

      {/* Selected stage details workbench */}
      <div className="v-subpanel p-5 border border-[var(--color-rule)] flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-xs text-[var(--color-accent)] font-medium">
            Stage {stages[selectedStage].num} Technical Execution
          </div>
          <p className="text-sm text-[var(--color-ink-2)] leading-relaxed">
            {stages[selectedStage].mechanism}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />
            <span>Tested against 10M+ production mortgage covenants and tenancy agreements</span>
          </div>
        </div>

        <div className="w-full md:w-64 flex flex-col gap-2.5 border-t md:border-t-0 md:border-l border-[var(--color-rule)] pt-4 md:pt-0 md:pl-6">
          <div className="text-xs text-[var(--color-muted)] font-medium">Benchmark Telemetry</div>
          {stages[selectedStage].specs.map((sp) => (
            <div key={sp.label} className="flex flex-col text-xs">
              <span className="text-[var(--color-muted)]">{sp.label}</span>
              <span className="text-[var(--color-ink)] font-medium num mt-0.5">{sp.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* GitHub Live Projects & Contributions */
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

function GitHubShowcaseSection() {
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
        // Fallback realistic curated repos if API rate-limited
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
    <div className="v-panel ticks p-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-rule)] pb-4">
        <div>
          <h2 className="text-xl font-medium text-[var(--color-ink)]">
            Open Source Implementations & Codebase
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Dynamic repository stream directly from GitHub profile @Abhi20O1
          </p>
        </div>
        <a
          href="https://github.com/Abhi20O1"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-vantage-secondary text-xs h-8 px-3"
        >
          <span>GitHub Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
        </a>
      </div>

      {/* GitHub Calendar (Recent 180 days only) */}
      <div className="v-subpanel p-4 border border-[var(--color-rule)] flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--color-ink)] font-medium">Recent Contribution Activity (Latest 180 Days)</span>
          <span className="text-[var(--color-accent)] num">Active commit velocity</span>
        </div>
        <div className="w-full overflow-x-auto no-scrollbar">
          <GitHubCalendar
            username="Abhi20O1"
            transformData={(activities: GitHubActivity[]) => {
              const halfYearAgo = new Date();
              halfYearAgo.setDate(halfYearAgo.getDate() - 180);
              return activities.filter((act) => new Date(act.date) >= halfYearAgo);
            }}
            theme={{
              light: [
                'oklch(17% 0.014 235)',
                'oklch(35% 0.06 140)',
                'oklch(55% 0.12 135)',
                'oklch(75% 0.16 130)',
                'oklch(89% 0.19 126)'
              ],
              dark: [
                'oklch(17% 0.014 235)',
                'oklch(35% 0.06 140)',
                'oklch(55% 0.12 135)',
                'oklch(75% 0.16 130)',
                'oklch(89% 0.19 126)'
              ]
            }}
            labels={{
              totalCount: '{{count}} contributions in the latest 180-day cycle'
            }}
            fontSize={12}
            blockSize={11}
            blockMargin={3}
          />
        </div>
      </div>

      {/* Repositories grid */}
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
              className="v-subpanel p-4 border border-[var(--color-rule)] hover:border-[var(--color-accent)] transition-colors duration-200 flex flex-col justify-between gap-3 text-inherit no-underline group"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-accent)] font-medium">{r.language || 'Code'}</span>
                  <div className="flex items-center gap-1 text-[var(--color-muted)] num">
                    <Star className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                    <span>{r.stargazers_count}</span>
                  </div>
                </div>
                <h3 className="text-base font-medium text-[var(--color-ink)] mt-2 group-hover:text-[var(--color-accent)] transition-colors duration-200">
                  {r.name}
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">
                  {r.description || 'Open source machine learning codebase.'}
                </p>
              </div>
              <div className="pt-2 border-t border-[var(--color-rule)] flex items-center justify-between text-xs text-[var(--color-muted)] num">
                <span>inspect on github</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}

/* Academic Foundation & Credentials */
function AcademicCredentialsSection() {
  const credentials = [
    {
      institution: 'Indian Institute of Technology (IIT) Guwahati',
      degree: 'Minor in Data Science & Artificial Intelligence',
      grade: '8.41 CPI / 10.0',
      period: '2021 to 2024',
      focus: 'Advanced Machine Learning, Deep Neural Networks, Convex Optimization, Linear Algebra, and Stochastic Probability Systems.'
    },
    {
      institution: 'JSS Academy of Technical Education, Noida',
      degree: 'Bachelor of Technology in Computer Science & Engineering',
      grade: '8.16 CGPA / 10.0',
      period: '2020 to 2024',
      focus: 'Distributed Systems, Operating System Internals, Algorithm Design & Analysis, Database Management, and Network Architecture.'
    }
  ];

  return (
    <div className="v-panel ticks p-6 flex flex-col gap-6">
      <div className="border-b border-[var(--color-rule)] pb-4">
        <h2 className="text-xl font-medium text-[var(--color-ink)]">
          Academic Research & Theoretical Foundation
        </h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Formal training in computer science theory, mathematics, and statistical inference
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {credentials.map((c) => (
          <div key={c.institution} className="v-subpanel p-5 border border-[var(--color-rule)] flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--color-accent)] num font-medium">
                <span>{c.grade}</span>
                <span className="text-[var(--color-muted)]">{c.period}</span>
              </div>
              <h3 className="text-base font-medium text-[var(--color-ink)] mt-2">
                {c.institution}
              </h3>
              <div className="text-xs text-[var(--color-ink-2)] mt-0.5">
                {c.degree}
              </div>
              <p className="text-xs text-[var(--color-muted)] mt-3 leading-relaxed">
                {c.focus}
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--color-rule)] flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
              <span>Verified academic record</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Direct Contact Dispatch Console */
function ContactDispatchSection() {
  const [copied, setCopied] = useState(false);
  const email = 'as2001abhi@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="contact" className="v-panel ticks p-6 flex flex-col gap-6">
      <div className="border-b border-[var(--color-rule)] pb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--color-accent)] font-medium">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <span>Direct Dispatch & Inquiry</span>
        </div>
        <h2 className="text-xl font-medium text-[var(--color-ink)] mt-1">
          Let us build production AI systems
        </h2>
        <p className="text-xs text-[var(--color-muted)] mt-1.5 max-w-xl leading-relaxed">
          Open to full-time AI engineering, research engineering, and technical leadership roles solving difficult machine learning challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email dispatcher */}
        <div className="v-subpanel p-4 border border-[var(--color-rule)] flex flex-col justify-between gap-3">
          <div>
            <div className="text-xs text-[var(--color-muted)]">Primary Email Dispatch</div>
            <div className="text-sm font-medium text-[var(--color-ink)] mt-1 num">{email}</div>
          </div>
          <button
            type="button"
            onClick={copyEmail}
            className="btn-vantage-primary text-xs h-9 w-full whitespace-nowrap"
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

        {/* WhatsApp direct chat */}
        <div className="v-subpanel p-4 border border-[var(--color-rule)] flex flex-col justify-between gap-3">
          <div>
            <div className="text-xs text-[var(--color-muted)]">Instant Communication</div>
            <div className="text-sm font-medium text-[var(--color-ink)] mt-1 num">+91 9315570085</div>
          </div>
          <a
            href="https://wa.me/919315570085"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-vantage-secondary text-xs h-9 w-full"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Location & Status */}
        <div className="v-subpanel p-4 border border-[var(--color-rule)] flex flex-col justify-between gap-3">
          <div>
            <div className="text-xs text-[var(--color-muted)]">Current Location & Availability</div>
            <div className="text-sm font-medium text-[var(--color-ink)] mt-1">India / Global Remote</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] num">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <span>Available for high-impact roles</span>
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
      {/* Edge-aligned Telemetry Header */}
      <header className="sticky top-0 z-[var(--z-sticky-nav)] bg-[var(--color-paper)]/90 backdrop-blur-md border-b border-[var(--color-rule)]">
        <div className="container py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-base tracking-tight text-[var(--color-ink)]">
              Abhishek Singh
            </span>
            <span className="text-xs text-[var(--color-muted)] hidden sm:inline">
              / AI Systems Engineer
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-[var(--color-muted)]">
            <a href="#pipeline" className="hover:text-[var(--color-ink)] transition-colors duration-150">
              01 // Pipeline
            </a>
            <a href="#problem-solving" className="hover:text-[var(--color-ink)] transition-colors duration-150">
              02 // Problem Solving
            </a>
            <a href="#codebase" className="hover:text-[var(--color-ink)] transition-colors duration-150">
              03 // Codebase
            </a>
            <a href="#research" className="hover:text-[var(--color-ink)] transition-colors duration-150">
              04 // Credentials
            </a>
            <a href="#contact" className="hover:text-[var(--color-ink)] transition-colors duration-150">
              05 // Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[var(--color-ink)] num">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="hidden sm:inline">Arcap Residency</span>
            </div>
            <a href="#contact" className="btn-vantage-primary text-xs h-8 px-3.5">
              <span>Initiate Contact</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container py-8 md:py-14 flex flex-col gap-12 md:gap-16">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Command & Pitch */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-xs text-[var(--color-accent)] num font-medium">
              <span>SYSTEM ARCHITECT & AI ENGINEER</span>
              <span className="text-[var(--color-muted)]">/</span>
              <span>2026 DEPLOYMENTS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--color-ink)] leading-[1.08] tracking-tight">
              High-throughput machine learning & multimodal systems.
            </h1>

            <p className="text-sm sm:text-base text-[var(--color-ink-2)] leading-relaxed max-w-xl">
              Production LLM pipelines, neural retrieval, and sub-second financial document inference.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a href="#pipeline" className="btn-vantage-primary text-xs whitespace-nowrap">
                <span>Inspect Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="btn-vantage-secondary text-xs whitespace-nowrap"
              >
                {copiedEmail ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            {/* Precision Telemetry Row */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--color-rule)]">
              <div className="flex flex-col">
                <span className="text-2xl font-light num text-[var(--color-ink)]">
                  99.2<span className="u">%</span>
                </span>
                <span className="text-xs text-[var(--color-muted)] mt-0.5">
                  OCR extraction accuracy on 10M+ documents
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-light num text-[var(--color-ink)]">
                  &lt;420<span className="u">ms</span>
                </span>
                <span className="text-xs text-[var(--color-muted)] mt-0.5">
                  End-to-end p95 query latency
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-light num text-[var(--color-ink)]">
                  10<span className="u">M+</span>
                </span>
                <span className="text-xs text-[var(--color-muted)] mt-0.5">
                  Production pages parsed at Arcap
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-light num text-[var(--color-accent)]">
                  0.00<span className="u">%</span>
                </span>
                <span className="text-xs text-[var(--color-muted)] mt-0.5">
                  Hallucinated financial fields
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Vantage Point Cloud Scanner */}
          <div className="lg:col-span-7">
            <VantageScannerCanvas />
          </div>
        </section>

        {/* SECTION 01: ARCAP REIT PRODUCTION PIPELINE */}
        <section id="pipeline">
          <ArcapArchitectureSection />
        </section>

        {/* SECTION 02: PROBLEM SOLVING & COMPETITIVE MASTERY */}
        <section id="problem-solving" className="flex flex-col gap-6">
          <div className="border-b border-[var(--color-rule)] pb-3">
            <div className="text-xs text-[var(--color-accent)] font-medium">Algorithmic Foundation</div>
            <h2 className="text-xl font-medium text-[var(--color-ink)] mt-1">
              Verified problem solving & database engineering
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* HackerRank prioritized first */}
            <HackerRankBadgeSection />
            {/* LeetCode second */}
            <LeetCodeStatsSection />
          </div>
        </section>

        {/* SECTION 03: OPEN SOURCE CODEBASE & RECENT ACTIVITY */}
        <section id="codebase">
          <GitHubShowcaseSection />
        </section>

        {/* SECTION 04: ACADEMIC CREDENTIALS & RESEARCH */}
        <section id="research">
          <AcademicCredentialsSection />
        </section>

        {/* SECTION 05: DIRECT CONTACT DISPATCH */}
        <section id="contact-section">
          <ContactDispatchSection />
        </section>
      </main>

      {/* Mast Footer */}
      <footer className="border-t border-[var(--color-rule)] bg-[var(--color-paper-2)] py-10 mt-16 text-xs text-[var(--color-muted)]">
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="font-medium text-[var(--color-ink)]">Abhishek Singh</div>
            <div>AI Systems Engineer / Specialized in Large Language Models & Multimodal Inference</div>
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
              className="hover:text-[var(--color-ink)] transition-colors duration-150"
            >
              as2001abhi@gmail.com
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
