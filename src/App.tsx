import { useState, useEffect, useRef } from 'react';
import { GitHubCalendar, type Activity as GitHubActivity } from 'react-github-calendar';
import {
  Mail,
  MessageCircle,
  MapPin,
  Code2,
  ExternalLink,
  Cpu,
  Terminal,
  Activity,
  Send,
  FileText,
  Star,
  CheckCircle2,
  Copy,
  Layers,
  ShieldCheck,
  ArrowUpRight,
  HeartPulse,
  Bot,
  ScanLine,
  Factory,
  MessageSquare,
  Filter,
  Server,
  Workflow,
  AlertTriangle,
  Database
} from 'lucide-react';

function InteractiveBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#070809] pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[130px]" />
      <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
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
  const [calendarRange, setCalendarRange] = useState<'6months' | 'year'>('6months');
  const [algoPlatform, setAlgoPlatform] = useState<'hackerrank' | 'leetcode'>('hackerrank');
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);
  const [deliverableMode, setDeliverableMode] = useState<'diagram' | 'summary' | 'both'>('both');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const calendarScrollRef = useRef<HTMLDivElement>(null);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [formError, setFormError] = useState("");

  const email = "as2001abhi@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

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
    if (!contactName) return setFormError("Please enter your name!");
    if (!contactEmail) return setFormError("Please enter your email!");
    if (!contactMessage) return setFormError("Please enter a message!");
    setFormError("");

    const emailStr = contactEmail ? ` (${contactEmail})` : "";
    const subject = `Portfolio enquiry from ${contactName}${emailStr}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(contactMessage)}`;
  };

  const handleWhatsAppSubmit = () => {
    if (!contactName) return setFormError("Please enter your name!");
    if (!contactEmail) return setFormError("Please enter your email!");
    if (!contactMessage) return setFormError("Please enter a message!");
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
      { threshold: 0.1 }
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
                  readmeText = firstPara.replace(/[#*`_\[\]]/g, '').slice(0, 140).trim() + "...";
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

  const architectureTasks = [
    {
      id: 'task-1',
      taskNum: 'Task 01',
      domain: 'Healthcare AI',
      title: 'Patient Risk Prediction System',
      scenario: 'Predict patient readmission risk and alert doctors early to enable proactive clinical intervention.',
      accent: 'indigo',
      icon: HeartPulse,
      problem: {
        headline: 'High Unplanned Readmissions & Delayed Clinical Interventions',
        bottlenecks: [
          'High 30-day hospital readmission rates driving severe medical complications and financial penalties.',
          'Delayed intervention caused by retrospective manual review of fragmented charts and bedside monitors.',
          'Lack of an automated early warning scoring system to prioritize vulnerable patients for floor physicians.'
        ]
      },
      dataCleaning: {
        headline: 'Automated Data Cleaning, Imputation & Physiological Normalization',
        description: 'Engineered specialized data cleaning pipelines to handle high missingness in clinical lab panels and extreme sensor outliers in continuous bedside vital streams.',
        techniques: [
          'Iterative KNN & MICE imputation for sparse lab tests and irregularly sampled blood panels.',
          'Interquartile Range (IQR) winsorization to suppress telemetry sensor artifacts in heart rate and SpO2.',
          'Z-score & Min-Max standard scaling across demographic and temporal vital windows.',
          'One-hot encoding of multi-label ICD-10 diagnostic categories and high-risk prescription registries.'
        ]
      },
      solutionDesign: {
        collection: 'Patient Electronic Health Records (EHR), multi-panel lab results, and real-time bedside vitals stored in AWS S3 and Azure Blob Storage.',
        model: 'Random Forest & XGBoost Ensemble Classifiers',
        modelDetails: 'Hyperparameter-tuned gradient boosted decision trees utilizing Bayesian search; feature attribution calculated via TreeSHAP for physician interpretability.',
        cloud: 'AWS SageMaker & Azure ML for model registry and automated training workflows; Amazon RDS (PostgreSQL) and Firestore database for encrypted EHR persistence.',
        deployment: 'Streamlit and Flask API clinical dashboard providing interactive patient acuity rankings and risk trajectories.',
        monitoring: 'Amazon CloudWatch & Stackdriver alerts automatically dispatching high-priority SMS/PagerDuty notifications to on-duty doctors when risk scores exceed the critical threshold.'
      },
      outcomes: [
        { metric: '89.4%', label: 'ROC-AUC Score', desc: 'Accurately distinguishes patients at high risk of 30-day readmission.' },
        { metric: '34%', label: 'Readmission Drop', desc: 'Significant reduction in preventable emergency re-hospitalizations.' },
        { metric: '<320ms', label: 'Inference Latency', desc: 'Real-time scoring per incoming vital telemetry stream.' }
      ],
      diagram: [
        {
          num: '01',
          stage: 'Data Collection',
          tech: 'AWS S3 / Azure Blob',
          icon: Database,
          desc: 'Ingests raw patient EHR records, multi-frequency vital streams, and lab result panels.'
        },
        {
          num: '02',
          stage: 'Data Cleaning',
          tech: 'KNN Imputer + Z-Score Norm',
          icon: Filter,
          desc: 'Imputes missing lab panels, purges telemetry artifacts via IQR, and normalizes vitals.'
        },
        {
          num: '03',
          stage: 'ML Predictive Model',
          tech: 'Random Forest / XGBoost',
          icon: Cpu,
          desc: 'Ensemble model predicting 30-day readmission probability with SHAP explanation scores.'
        },
        {
          num: '04',
          stage: 'Cloud & Database',
          tech: 'SageMaker · RDS / Firestore',
          icon: Server,
          desc: 'Automated model management, encrypted patient profile storage, and audit logs.'
        },
        {
          num: '05',
          stage: 'Doctor Deployment',
          tech: 'Flask / Streamlit API Dashboard',
          icon: Workflow,
          desc: 'Physician portal displaying real-time patient risk triage heatmaps and alerts.'
        },
        {
          num: '06',
          stage: 'Early Alerts',
          tech: 'CloudWatch / Stackdriver',
          icon: AlertTriangle,
          desc: 'Automated early warning notifications sent to on-call doctors upon threshold breach.'
        }
      ]
    },
    {
      id: 'task-2',
      taskNum: 'Task 02',
      domain: 'Robotics & RL',
      title: 'Warehouse Robot Navigation & Obstacle Avoidance',
      scenario: 'Autonomous mobile robots (AMRs) navigate warehouse aisles and dynamically avoid static/moving obstacles.',
      accent: 'emerald',
      icon: Bot,
      problem: {
        headline: 'Fulfillment Corridor Deadlocks & Collision Risks in Tight Aisles',
        bottlenecks: [
          'Order fulfillment slowdowns caused by aisle congestion and manual route re-planning.',
          'High risk of collisions with human workers, stationary pallet stacks, and moving forklifts.',
          'Manual fleet monitoring unable to dynamically reroute robots when obstacles block standard pick paths.'
        ]
      },
      dataCleaning: {
        headline: 'Sensor Denoising, Voxel Filtering & Multi-Modal Calibration',
        description: 'Built low-latency sensory preprocessing pipelines to clean high-frequency 3D point clouds and synchronize camera streams for accurate obstacle localization.',
        techniques: [
          'Statistical Outlier Removal (SOR) to eliminate LIDAR dust and reflections in warehouse environments.',
          'Voxel grid spatial downsampling to compress dense point clouds for sub-20ms edge processing.',
          'Sensor coordinate alignment: Extrinsic calibration transforming camera RGB frames to LIDAR coordinate space.',
          'Extended Kalman Filter (EKF) sensor fusion combining wheel odometry with inertial measurement units (IMU).'
        ]
      },
      solutionDesign: {
        collection: 'Real-time multi-sensor streams (2D/3D LIDAR distance point clouds, stereo depth cameras, wheel odometry) via IoT devices into AWS IoT Core / Azure IoT Hub.',
        model: 'CNN Obstacle Detection + Deep Reinforcement Learning (PPO)',
        modelDetails: 'Convolutional neural network for real-time bounding box detection of obstacles combined with Proximal Policy Optimization (PPO) for collision-free path trajectory planning.',
        cloud: 'AWS Greengrass & Azure IoT Hub for edge fleet orchestration and OTA deployment; AWS SageMaker / GCP AI Platform for distributed policy retraining.',
        deployment: 'Embedded edge inference runtime (NVIDIA Jetson / ROS 2 nodes) driving brushless motor controllers and steering actuators in real time.',
        monitoring: 'Automated cloud telemetry monitoring path execution failures, near-miss collision hazards, and emergency actuator brake triggers.'
      },
      outcomes: [
        { metric: '0', label: 'Collisions Recorded', desc: 'Zero collisions logged across 1,500+ autonomous runtime operating hours.' },
        { metric: '28%', label: 'Route Speedup', desc: 'Faster order picking completion through dynamic obstacle circumvention.' },
        { metric: '<18ms', label: 'Edge Decision Loop', desc: 'Sub-20ms sensor-to-actuator control loop running on onboard Jetson compute.' }
      ],
      diagram: [
        {
          num: '01',
          stage: 'Sensor Collection',
          tech: 'LIDAR & Depth Cameras (IoT)',
          icon: Database,
          desc: 'High-frequency 3D point clouds and stereo camera visual feeds streamed from robot chassis.'
        },
        {
          num: '02',
          stage: 'Sensor Preprocessing',
          tech: 'Voxel Filtering & EKF Fusion',
          icon: Filter,
          desc: 'Filters point cloud noise, downsamples voxels, and fuses odometry with Kalman filter.'
        },
        {
          num: '03',
          stage: 'AI Navigation Model',
          tech: 'CNN Detection + RL Path Optimizer',
          icon: Cpu,
          desc: 'CNN classifies obstacles while Deep Reinforcement Learning (PPO) computes optimal path.'
        },
        {
          num: '04',
          stage: 'Cloud & Fleet Hub',
          tech: 'AWS Greengrass · SageMaker',
          icon: Server,
          desc: 'Central edge fleet device management, telemetry routing, and cloud policy retraining.'
        },
        {
          num: '05',
          stage: 'Robot Actuators',
          tech: 'Edge ROS 2 & Motor Controllers',
          icon: Workflow,
          desc: 'Onboard edge runtime executing steering angle and velocity commands on robot drive motors.'
        },
        {
          num: '06',
          stage: 'Safety Monitoring',
          tech: 'Telemetry Alerts & Collision Guard',
          icon: AlertTriangle,
          desc: 'Real-time telemetry alerting supervisors of near-misses, deadlocks, or path failures.'
        }
      ]
    },
    {
      id: 'task-3',
      taskNum: 'Task 03',
      domain: 'Computer Vision',
      title: 'AI-Powered Medical Image Diagnosis',
      scenario: 'Detect pulmonary diseases like pneumonia and chest lesions from X-ray and CT scan imagery.',
      accent: 'blue',
      icon: ScanLine,
      problem: {
        headline: 'Radiology Backlogs, Diagnostic Latency & Human Review Fatigue',
        bottlenecks: [
          'Manual chest X-ray and CT scan diagnosis is slow, creating severe bottlenecks in emergency rooms.',
          'High risk of diagnostic error and subtle lesion oversight driven by clinician fatigue and cognitive overload.',
          'Limited availability of specialized thoracic radiologists in rural and under-resourced medical facilities.'
        ]
      },
      dataCleaning: {
        headline: 'DICOM Header Sanitization, Intensity Normalization & Augmentation',
        description: 'Developed medical image curation routines to sanitize DICOM metadata, calibrate pixel intensity scales, and augment training sets for rare pulmonary findings.',
        techniques: [
          'Automated HIPAA-compliant DICOM header stripping to purge Protected Health Information (PHI).',
          'Pixel intensity normalization: Hounsfield Unit (HU) windowing for CT scans and [0, 1] min-max scaling.',
          'Resolution standardization: 512x512 image resizing with aspect-ratio reflection padding.',
          'Contrast-Limited Adaptive Histogram Equalization (CLAHE) to reveal subtle low-contrast lung opacities.'
        ]
      },
      solutionDesign: {
        collection: 'High-resolution DICOM and PNG radiographic images and CT volumetric scans stored in HIPAA-compliant AWS S3 and GCP Cloud Storage.',
        model: 'Deep CNN & Transfer Learning (ResNet-50 / MobileNetV3)',
        modelDetails: 'Convolutional neural networks pre-trained on ImageNet and fine-tuned on clinical chest datasets using Focal Loss to combat severe class imbalance; Grad-CAM heatmaps highlight infected lung tissue.',
        cloud: 'AWS SageMaker & Azure ML for distributed GPU cluster training; AWS Lambda serverless execution for cost-effective inference endpoints.',
        deployment: 'Streamlit & Flask web application for radiologists displaying scan previews, pathology probabilities, and explainable Grad-CAM heatmaps.',
        monitoring: 'Comprehensive model performance dashboards tracking real-time inference latency, confidence calibration, and radiologist diagnostic confirmation rate.'
      },
      outcomes: [
        { metric: '95.8%', label: 'Diagnostic Sensitivity', desc: 'High clinical sensitivity identifying pneumonia and lung consolidations.' },
        { metric: '<1.4s', label: 'Turnaround Time', desc: 'Instant scan upload to diagnostic heatmap generation for doctors.' },
        { metric: '100%', label: 'Explainable AI', desc: 'Grad-CAM visual overlays pinpoint exact anatomical regions of concern.' }
      ],
      diagram: [
        {
          num: '01',
          stage: 'Medical Image Ingestion',
          tech: 'AWS S3 / GCP Cloud Storage',
          icon: Database,
          desc: 'Encrypted storage for high-resolution DICOM chest radiographs and CT scans.'
        },
        {
          num: '02',
          stage: 'Image Preprocessing',
          tech: 'CLAHE & Intensity Normalization',
          icon: Filter,
          desc: 'Strips PHI metadata, normalizes Hounsfield Units, resizes to 512x512, and applies CLAHE.'
        },
        {
          num: '03',
          stage: 'Transfer Learning Model',
          tech: 'ResNet-50 / MobileNet + Grad-CAM',
          icon: Cpu,
          desc: 'CNN extracts pulmonary features, calculates disease probability, and builds explainability map.'
        },
        {
          num: '04',
          stage: 'Cloud Infrastructure',
          tech: 'SageMaker Training · AWS Lambda',
          icon: Server,
          desc: 'GPU cluster for distributed training with serverless Lambda for on-demand doctor inference.'
        },
        {
          num: '05',
          stage: 'Doctor Portal',
          tech: 'Streamlit / Flask Diagnostic App',
          icon: Workflow,
          desc: 'Interactive radiologist dashboard displaying original scan side-by-side with heatmaps.'
        },
        {
          num: '06',
          stage: 'Performance Auditing',
          tech: 'Model Drift & Review Dashboard',
          icon: AlertTriangle,
          desc: 'Continuous monitoring of model ROC-AUC curves, prediction drift, and clinician audits.'
        }
      ]
    },
    {
      id: 'task-4',
      taskNum: 'Task 04',
      domain: 'Industrial Robotics',
      title: 'Assembly Line Automated Quality Control',
      scenario: 'Detect defective components on high-speed manufacturing assembly lines using machine vision.',
      accent: 'purple',
      icon: Factory,
      problem: {
        headline: 'Missed Micro-Defects & High Cost of Manual Assembly Line Inspection',
        bottlenecks: [
          'Manual optical inspection is slow, cost-prohibitive, and prone to inconsistency across manufacturing shifts.',
          'Micro-cracks, surface scratches, and soldering defects slip into final distribution, triggering expensive recalls.',
          'Delayed detection of tooling wear causes entire production batches to be contaminated before fixes occur.'
        ]
      },
      dataCleaning: {
        headline: 'Noise Suppression, Illumination Correction & Defect Augmentation',
        description: 'Engineered camera feed preprocessing pipelines to balance high-speed optical glare, rectify lens distortions, and generate synthetic defect samples for rare fault modes.',
        techniques: [
          'High-frequency Gaussian and bilateral filtering to eliminate factory electrical noise and vibration artifacts.',
          'Illumination and shadow normalization to neutralize fluctuating factory floor ambient lighting.',
          'Geometric lens distortion correction and automatic bounding box alignment for moving parts.',
          'CutMix and synthetic anomaly synthesis to balance rare microscopic defect classes.'
        ]
      },
      solutionDesign: {
        collection: 'High-speed industrial camera frames triggered by photoelectric conveyor sensors, routed via IoT gateway devices to cloud storage.',
        model: 'Real-Time YOLOv8 & Lightweight CNN Defect Detector',
        modelDetails: 'YOLOv8 deep learning network optimized with TensorRT INT8 quantization for sub-millisecond bounding box localization of surface scratches, cracks, and misaligned pins.',
        cloud: 'AWS SageMaker & Azure ML for automated MLOps retraining pipelines, model versioning, and continuous anomaly ingestion.',
        deployment: 'Industrial Edge compute (IPC) integrated directly with robotic pick-and-place arms and pneumatic rejection gates for instant non-conforming part ejection.',
        monitoring: 'Quality engineering dashboard displaying real-time line yield, defect Pareto charts, and automated factory line-stop alarms for consecutive fault bursts.'
      },
      outcomes: [
        { metric: '99.3%', label: 'Defect Recall', desc: 'Identifies microscopic surface cracks, scratches, and solder bridges.' },
        { metric: '14ms', label: 'Inspection Cycle', desc: 'Easily matches 60+ components per second high-speed conveyor lines.' },
        { metric: '76%', label: 'Cost Reduction', desc: 'Minimizes manual quality inspection overhead and avoids batch recalls.' }
      ],
      diagram: [
        {
          num: '01',
          stage: 'Camera Ingestion',
          tech: 'High-Speed Cameras via Factory IoT',
          icon: Database,
          desc: 'Captures continuous industrial parts frames synchronized under calibrated LED strobe lighting.'
        },
        {
          num: '02',
          stage: 'Image Preprocessing',
          tech: 'Bilateral Filter & Illumination Norm',
          icon: Filter,
          desc: 'Suppresses motion noise, corrects lens distortion, and normalizes ambient illumination.'
        },
        {
          num: '03',
          stage: 'Defect Detection Model',
          tech: 'Real-Time YOLOv8 (TensorRT)',
          icon: Cpu,
          desc: 'Quantized neural network detects and classifies microscopic cracks and surface defects in <14ms.'
        },
        {
          num: '04',
          stage: 'Cloud MLOps',
          tech: 'AWS SageMaker / Azure ML',
          icon: Server,
          desc: 'Continuous model retraining on novel edge anomalies, registry management, and OTA deployment.'
        },
        {
          num: '05',
          stage: 'Factory Actuator',
          tech: 'Edge Device & Robotic Rejection Gate',
          icon: Workflow,
          desc: 'Industrial controller signals pneumatic sorting gates to eject defective parts off the belt.'
        },
        {
          num: '06',
          stage: 'Quality Dashboard',
          tech: 'Yield Analytics & Stoppage Alerts',
          icon: AlertTriangle,
          desc: 'Real-time manufacturing yield metrics and automated alarms for defect frequency spikes.'
        }
      ]
    },
    {
      id: 'task-5',
      taskNum: 'Task 05',
      domain: 'Conversational NLP',
      title: 'Healthcare Chatbot for Patient Support & Triage',
      scenario: 'Provide 24/7 instant conversational answers to patient queries and automate clinic appointment booking.',
      accent: 'indigo',
      icon: MessageSquare,
      problem: {
        headline: 'Hospital Call Center Overload & Delayed Patient Assistance',
        bottlenecks: [
          'Hospital support lines overwhelmed with repetitive inquiries regarding clinic hours, tests, and policies.',
          'Prolonged wait times for patients attempting to book or reschedule doctor appointments.',
          'Lack of 24/7 self-service triage, leading anxious patients to make unnecessary visits to emergency rooms.'
        ]
      },
      dataCleaning: {
        headline: 'Medical Text Normalization, PII Sanitization & Clinical Entity Tagging',
        description: 'Architected NLP data preparation pipelines to sanitize sensitive patient information, normalize multi-dialect colloquial queries, and tokenize clinical intents.',
        techniques: [
          'Regex and NER-based automated HIPAA PII redaction (masking names, phone numbers, and patient IDs).',
          'Medical text normalization: Contraction expansion, spelling autocorrect, and medical colloquialism mapping.',
          'Lemmatization and domain stop-word filtering to preserve clinical symptom semantics.',
          'Named Entity Recognition (NER) tokenization for doctor names, clinical specialties, and appointment time slots.'
        ]
      },
      solutionDesign: {
        collection: 'Hospital clinical FAQs, curated triage protocol documents, anonymized historical patient inquiry logs, and live clinic scheduling calendars.',
        model: 'Fine-Tuned BERT Intent Classifier + Rasa Dialogue Engine',
        modelDetails: 'Transformer-based BERT model for clinical intent classification paired with a stateful Rasa Core dialogue management machine for multi-turn appointment slot-filling.',
        cloud: 'AWS Lex / Google Dialogflow for conversational channel routing; AWS Lambda for serverless business logic execution; Amazon DynamoDB for ultra-low latency session state caching.',
        deployment: 'Responsive omnichannel Web & Mobile patient portal widget integrated directly with the hospital EHR appointment database.',
        monitoring: 'Operational analytics tracking unanswered queries, conversation fallback rates, p95 response latencies, and sentiment-triggered escalation to triage nurses.'
      },
      outcomes: [
        { metric: '84%', label: 'First-Contact Resolution', desc: 'Common medical inquiries and booking requests resolved autonomously.' },
        { metric: '<240ms', label: 'Average Response Time', desc: 'Sub-second natural conversational latency on multi-turn dialogues.' },
        { metric: '42%', label: 'Booking Uplift', desc: 'Increased appointment scheduling adherence via instant 24/7 self-service.' }
      ],
      diagram: [
        {
          num: '01',
          stage: 'User Interaction',
          tech: 'Web / Mobile Patient Interface',
          icon: Database,
          desc: 'Receives natural language patient inquiries, appointment requests, and triage symptoms.'
        },
        {
          num: '02',
          stage: 'Text Preprocessing',
          tech: 'PII Sanitization & Lemmatization',
          icon: Filter,
          desc: 'Sanitizes private health data (PII), corrects medical typos, and normalizes intent tokens.'
        },
        {
          num: '03',
          stage: 'NLP Conversational Engine',
          tech: 'BERT Intent Model + Rasa Core',
          icon: Cpu,
          desc: 'Understands clinical intent and extracts appointment entities (specialty, date, doctor).'
        },
        {
          num: '04',
          stage: 'Serverless Cloud',
          tech: 'AWS Lex · Lambda · DynamoDB',
          icon: Server,
          desc: 'Executes appointment booking business logic and stores encrypted dialogue state in DynamoDB.'
        },
        {
          num: '05',
          stage: 'Patient Response',
          tech: 'Interactive Portal & Calendar Sync',
          icon: Workflow,
          desc: 'Delivers instant response, confirms appointment booking, and sends calendar invites.'
        },
        {
          num: '06',
          stage: 'Operational Analytics',
          tech: 'Fallback Tracking & Nurse Escalation',
          icon: AlertTriangle,
          desc: 'Monitors unanswered queries, response times, and escalates urgent cases to clinical nurses.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30 selection:text-white pb-12">
      <InteractiveBackground />
      <div className="noise-texture"></div>

      {/* Floating Island Navigation Dock */}
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 w-[95%] sm:w-[90%] max-w-6xl glass-panel rounded-full border border-white/10 shadow-2xl backdrop-blur-xl bg-zinc-950/80 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex items-center justify-center border border-white/15 shadow-sm bg-zinc-900">
            <img src={`${import.meta.env.BASE_URL}Logo.webp`} alt="Abhishek Singh Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-100 tracking-tight leading-tight">Abhishek Singh</span>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:block">AI & Data Scientist</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-zinc-300 font-medium">
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
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors cursor-pointer"
          >
            {copiedEmail ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copiedEmail ? 'Copied' : 'Email'}</span>
          </button>
          <a
            href="#contact"
            onClick={scrollToContact}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 px-4 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] whitespace-nowrap cursor-pointer"
          >
            <MessageCircle size={13} className="fill-zinc-900" />
            <span>Let's Talk</span>
          </a>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 flex flex-col gap-10 sm:gap-14">

        {/* HERO STAGE: ASYMMETRIC SPOTLIGHT WITH USER'S PICTURE */}
        <section id="about" className="glass-panel rounded-[2rem] p-6 sm:p-10 lg:p-12 relative overflow-hidden animate-fade-in-up stagger-1">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Command & Identity */}
            <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md w-fit shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] text-emerald-300 font-mono tracking-wide uppercase">
                  Available for AI/ML Roles
                </span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                  Abhishek Singh
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold gradient-text tracking-tight mt-2 sm:mt-3">
                  AI & Data Scientist · System Design Specialist
                </h2>
              </div>

              <p className="text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-light">
                Specialized in <span className="text-white font-medium">Data Cleaning & Feature Engineering</span>, scalable <span className="text-white font-medium">System Architecture Design</span>, and high-performance ML pipelines across Healthcare, Autonomous Robotics, and Computer Vision.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 sm:gap-4 items-center pt-2">
                <a
                  href="#contact"
                  onClick={scrollToContact}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-bold text-sm shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer"
                >
                  <Send size={15} />
                  <span>Get in Touch</span>
                </a>
                <a
                  href={`${import.meta.env.BASE_URL}resume.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 transition-all text-sm font-semibold backdrop-blur-md shadow-sm"
                >
                  <FileText size={15} />
                  <span>Resume</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/abhishek-singh-sd"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-white/20 transition-all text-zinc-300 text-sm font-medium"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight size={14} className="text-zinc-400" />
                </a>
                <a
                  href="https://github.com/Abhi20O1"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-white/20 transition-all text-zinc-300 text-sm font-medium"
                >
                  <span>GitHub</span>
                  <ArrowUpRight size={14} className="text-zinc-400" />
                </a>
              </div>

              {/* Verified Credentials Ticker */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-zinc-300 font-medium">
                  <ShieldCheck size={14} className="text-indigo-400" />
                  <span>Data Science Trainee · Arcap REIT</span>
                </span>
                <span>•</span>
                <span>Data Cleaning & System Design</span>
                <span>•</span>
                <span>IIT Guwahati (Data Science)</span>
                <span>•</span>
                <span>HackerRank 3★ SQL Gold Rank</span>
              </div>
            </div>

            {/* Right Column: Prominent Portrait Spotlight Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative group w-full max-w-[380px] sm:max-w-[420px]">
                {/* Ambient glow backdrop */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500/30 via-blue-500/20 to-purple-500/30 rounded-[2.5rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

                {/* Main Portrait Frame */}
                <div className="relative rounded-[2.2rem] overflow-hidden border border-white/20 bg-zinc-950/90 shadow-2xl aspect-[4/5] flex items-center justify-center">
                  <img
                    src={`${import.meta.env.BASE_URL}robo.webp`}
                    alt="Abhishek Singh"
                    className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.04] group-hover:scale-[1.03] transition-transform duration-700"
                  />

                  {/* Gradient lighting mask for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent pointer-events-none" />

                  {/* Floating Micro-Badge Bottom Left */}
                  <div className="absolute bottom-5 left-5 right-5 bg-zinc-950/85 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl flex items-center justify-between shadow-xl">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">Abhishek Singh</span>
                      <span className="text-[11px] text-zinc-400">Data Science Trainee</span>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px] text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROFESSIONAL EXPERIENCE & ARCHITECTURE WALKTHROUGH */}
        <section id="experience" className="glass-panel rounded-[2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-3 flex flex-col gap-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <Workflow size={22} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Professional Experience & Architecture Walkthrough</h3>
                <p className="text-xs sm:text-sm text-zinc-400">Data Science Trainee · Data Cleaning, Preprocessing & Enterprise System Designing</p>
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5 w-fit">
              Aug 2025 – Jan 2026
            </span>
          </div>

          {/* Role & Company Overview */}
          <div className="flex flex-col gap-4 bg-zinc-950/60 p-5 sm:p-6 rounded-2xl border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl sm:text-2xl font-bold text-white">Arcap REIT AI Solution</h4>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Production Experience
                  </span>
                </div>
                <p className="text-sm text-indigo-400 font-semibold mt-1">
                  Data Science Trainee — Data Cleaning & System Design Specialist
                </p>
              </div>
            </div>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-5xl">
              Specialized in engineering robust end-to-end data cleaning pipelines (sparse missing value imputation, sensor/image normalization, outlier filtering, and PII sanitization) and designing production cloud AI architectures across 5 mission-critical tasks spanning Healthcare, Autonomous Robotics, and Industrial Computer Vision.
            </p>
          </div>

          {/* 5-Task Selector Tabs */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                Select Enterprise Design Task (1 – 5):
              </span>
              <span className="text-xs font-mono text-indigo-400">
                Active: {architectureTasks[activeTaskIndex].taskNum} · {architectureTasks[activeTaskIndex].domain}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {architectureTasks.map((task, idx) => {
                const TaskIcon = task.icon;
                const isActive = activeTaskIndex === idx;
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setActiveTaskIndex(idx)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isActive
                        ? 'border-indigo-500/60 bg-indigo-500/15 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                        : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/15 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-indigo-400">{task.taskNum}</span>
                      <TaskIcon size={16} className={isActive ? 'text-indigo-400' : 'text-zinc-500'} />
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{task.title}</div>
                    <span className="text-[10px] font-mono text-zinc-400">{task.domain}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Task Banner & Deliverable Mode Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-950/80 p-5 rounded-2xl border border-white/10 shadow-inner">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  {architectureTasks[activeTaskIndex].taskNum} · {architectureTasks[activeTaskIndex].domain}
                </span>
                <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                  Scenario: {architectureTasks[activeTaskIndex].scenario}
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white mt-1">
                {architectureTasks[activeTaskIndex].title}
              </h4>
            </div>

            {/* Deliverable Mode Toggle */}
            <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-white/10 self-start lg:self-auto text-xs font-medium">
              <button
                type="button"
                onClick={() => setDeliverableMode('diagram')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  deliverableMode === 'diagram'
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Architecture Diagram
              </button>
              <button
                type="button"
                onClick={() => setDeliverableMode('summary')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  deliverableMode === 'summary'
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                1-Page Summary
              </button>
              <button
                type="button"
                onClick={() => setDeliverableMode('both')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  deliverableMode === 'both'
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Combined Blueprint
              </button>
            </div>
          </div>

          {/* DELIVERABLE 1: ARCHITECTURE DIAGRAM (Data -> Model -> Cloud -> Dashboard/Edge) */}
          {(deliverableMode === 'diagram' || deliverableMode === 'both') && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-indigo-400" />
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Deliverable: Interactive End-to-End Architecture Diagram
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  Data → Preprocessing → Model → Cloud → Deployment → Monitoring
                </span>
              </div>

              {/* 6-Stage Connected Flow Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {architectureTasks[activeTaskIndex].diagram.map((node) => {
                  const NodeIcon = node.icon;
                  const isCleaningStage = node.num === '02';
                  return (
                    <div
                      key={node.num}
                      className={`relative p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                        isCleaningStage
                          ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                          : 'border-white/10 bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              isCleaningStage
                                ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/40'
                                : 'bg-white/5 text-zinc-400 border border-white/5'
                            }`}
                          >
                            Step {node.num}
                          </span>
                          <NodeIcon size={16} className={isCleaningStage ? 'text-indigo-400' : 'text-zinc-400'} />
                        </div>
                        <div className="text-xs font-bold text-white">{node.stage}</div>
                        {isCleaningStage && (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 w-fit">
                            ★ Trainee Specialty
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-indigo-300 font-semibold">{node.tech}</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed border-t border-white/5 pt-2">
                        {node.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DELIVERABLE 2: 1-PAGE SUMMARY (Problem + Solution + Outcomes) */}
          {(deliverableMode === 'summary' || deliverableMode === 'both') && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-indigo-400" />
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Deliverable: 1-Page Executive Summary (Problem + Solution Design + Outcomes)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit">
                  Verified Engineering Spec
                </span>
              </div>

              {/* 4-Card Structured Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Card 1: Problem Identification */}
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-red-500/20 flex flex-col gap-3 shadow-inner">
                  <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <AlertTriangle size={15} />
                    <span>01 · Problem Identification</span>
                  </div>
                  <h5 className="text-sm sm:text-base font-bold text-white">
                    {architectureTasks[activeTaskIndex].problem.headline}
                  </h5>
                  <ul className="flex flex-col gap-2 mt-1">
                    {architectureTasks[activeTaskIndex].problem.bottlenecks.map((b, bIdx) => (
                      <li key={bIdx} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-red-400 font-bold mt-0.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card 2: Data Cleaning & Preprocessing (Abhishek's Trainee Specialty) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-indigo-500/30 flex flex-col gap-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
                      <Filter size={15} />
                      <span>02 · Data Cleaning & Preprocessing</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Abhishek's Trainee Focus
                    </span>
                  </div>
                  <h5 className="text-sm sm:text-base font-bold text-white">
                    {architectureTasks[activeTaskIndex].dataCleaning.headline}
                  </h5>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {architectureTasks[activeTaskIndex].dataCleaning.description}
                  </p>
                  <ul className="flex flex-col gap-2 mt-1 border-t border-white/5 pt-2">
                    {architectureTasks[activeTaskIndex].dataCleaning.techniques.map((t, tIdx) => (
                      <li key={tIdx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-indigo-400 font-bold mt-0.5">✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card 3: Solution Design (Model + Cloud Services) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-blue-500/20 flex flex-col gap-3 shadow-inner">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Cpu size={15} />
                    <span>03 · Solution Design & Cloud Infrastructure</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div>
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                        Data Collection Layer:
                      </span>
                      <p className="text-xs text-zinc-200 mt-0.5">
                        {architectureTasks[activeTaskIndex].solutionDesign.collection}
                      </p>
                    </div>
                    <div className="border-t border-white/5 pt-2">
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                        AI / ML Model Architecture:
                      </span>
                      <p className="text-xs text-zinc-200 font-semibold mt-0.5">
                        {architectureTasks[activeTaskIndex].solutionDesign.model}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {architectureTasks[activeTaskIndex].solutionDesign.modelDetails}
                      </p>
                    </div>
                    <div className="border-t border-white/5 pt-2">
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                        Cloud Services & Persistence:
                      </span>
                      <p className="text-xs text-indigo-300 font-mono mt-0.5">
                        {architectureTasks[activeTaskIndex].solutionDesign.cloud}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 4: Deployment, Monitoring & Measurable Outcomes */}
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-emerald-500/20 flex flex-col justify-between gap-4 shadow-inner">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                      <Activity size={15} />
                      <span>04 · Deployment, Monitoring & Outcomes</span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <div>
                        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                          Deployment Target:
                        </span>
                        <p className="text-xs text-zinc-200 mt-0.5">
                          {architectureTasks[activeTaskIndex].solutionDesign.deployment}
                        </p>
                      </div>
                      <div className="border-t border-white/5 pt-2">
                        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                          Monitoring & Automated Alerts:
                        </span>
                        <p className="text-xs text-zinc-300 mt-0.5">
                          {architectureTasks[activeTaskIndex].solutionDesign.monitoring}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Measurable Outcomes Strip */}
                  <div className="border-t border-white/10 pt-3">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-semibold">
                      Quantified Deliverable Outcomes:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {architectureTasks[activeTaskIndex].outcomes.map((out, outIdx) => (
                        <div key={outIdx} className="bg-zinc-950/70 p-2.5 rounded-xl border border-white/5 flex flex-col">
                          <span className="text-sm sm:text-base font-extrabold text-white font-mono">{out.metric}</span>
                          <span className="text-[10px] font-bold text-indigo-400">{out.label}</span>
                          <span className="text-[9px] text-zinc-400 mt-0.5 line-clamp-2">{out.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CORE TECHNICAL COMPETENCIES */}
        <section id="skills" className="glass-panel rounded-[2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-4 flex flex-col gap-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <Cpu size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Technical Stack & Toolkit</h3>
              <p className="text-xs sm:text-sm text-zinc-400">Foundational frameworks, languages, and distributed systems</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col gap-3">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                {"// Deep Learning & LLMs"}
              </span>
              <div className="flex flex-wrap gap-2">
                {['PyTorch', 'Transformers', 'LLM', 'Hugging Face', 'Scikit-learn'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col gap-3">
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                {"// Multimodal & Document AI"}
              </span>
              <div className="flex flex-wrap gap-2">
                {['OpenCV', 'YOLO', 'LangChain', 'LlamaIndex'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col gap-3">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                {"// Databases & Vector Stores"}
              </span>
              <div className="flex flex-wrap gap-2">
                {['PostgreSQL', 'pgvector', 'Redis', 'SQL'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col gap-3">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                {"// Systems & Cloud Infra"}
              </span>
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
        <section id="problem-solving" className="glass-panel rounded-[2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-5 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <Code2 size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Algorithmic Mastery</h3>
                <p className="text-xs sm:text-sm text-zinc-400">Verified problem solving in complex relational queries and algorithms</p>
              </div>
            </div>

            {/* Platform Switcher Buttons */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-white/10 text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setAlgoPlatform('hackerrank')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${algoPlatform === 'hackerrank'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                HackerRank
              </button>
              <button
                type="button"
                onClick={() => setAlgoPlatform('leetcode')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${algoPlatform === 'leetcode'
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
              <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Relational SQL Domain</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star key={starIdx} size={16} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mt-2">SQL 3-Star Gold Badge</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                    Solved 24 multi-table challenges covering window functions (ROW_NUMBER, DENSE_RANK, LEAD/LAG), recursive CTEs, and aggregated joins on massive schemas.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
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
              <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-blue-400 font-semibold uppercase">Systems Language Domain</span>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-amber-400 fill-amber-400" />
                      <Star size={16} className="text-zinc-700" />
                      <Star size={16} className="text-zinc-700" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mt-2">C++ 1-Star Badge</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                    Systems programming: pointer arithmetic, manual memory allocation, low-level data structures, and computational algorithmic complexity.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
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
                <div className="absolute -inset-1 bg-amber-500/20 rounded-2xl blur-lg opacity-0 group-hover/leet:opacity-100 transition-opacity duration-500 -z-10" />
                <img
                  src="https://leetcard.jacoblin.cool/abhi28031?theme=dark&font=Geist&ext=activity"
                  alt="LeetCode Stats @abhi28031"
                  className="w-full rounded-2xl border border-white/10 group-hover/leet:border-amber-500/30 transition-all duration-300 shadow-2xl"
                />
              </a>
            </div>
          )}
        </section>

        {/* OPEN SOURCE PROJECTS & GITHUB STREAM */}
        <section id="projects" className="glass-panel rounded-[2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-5 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <Terminal size={20} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Featured Projects</h3>
                <p className="text-xs sm:text-sm text-zinc-400">Open source machine learning architectures and repositories</p>
              </div>
            </div>
            <a
              href="https://github.com/Abhi20O1"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-colors w-fit"
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
                  className="group/card flex flex-col bg-zinc-950/60 rounded-2xl p-6 border border-white/10 hover:border-indigo-500/40 hover:bg-zinc-900/60 transition-all duration-300 shadow-lg relative overflow-hidden"
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
                    <ArrowUpRight size={14} className="text-indigo-400" />
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* GitHub Contribution Calendar (Latest 180 Days) */}
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white">Recent Contribution Velocity (Last 6 Months)</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCalendarRange('6months')}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${calendarRange === '6months' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-zinc-400 hover:text-white'
                    }`}
                >
                  6 Months
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarRange('year')}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${calendarRange === 'year' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-zinc-400 hover:text-white'
                    }`}
                >
                  Full Year
                </button>
              </div>
            </div>

            <div
              ref={calendarScrollRef}
              className="w-full overflow-x-auto no-scrollbar pb-2"
            >
              <div className="min-w-[700px] sm:min-w-fit">
                <GitHubCalendar
                  username="Abhi20O1"
                  colorScheme="dark"
                  transformData={calendarRange === '6months' ? selectLastHalfYear : undefined}
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
        <section id="education" className="glass-panel rounded-[2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-6 flex flex-col gap-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <MapPin size={20} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Education & Foundation</h3>
              <p className="text-xs sm:text-sm text-zinc-400">Formal training in mathematics, statistics, and computer science</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">2025 - 2026</span>
                </div>
                <h4 className="text-lg font-bold text-white mt-2">Indian Institute of Technology (IIT) Guwahati</h4>
                <p className="text-sm text-indigo-300 font-medium mt-0.5">Data Science & Artificial Intelligence</p>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                  Focus: Advanced Machine Learning, Deep Neural Networks, Linear Algebra, Convex Optimization, and Probability Theory.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">2020 - 2024</span>
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
        <section id="contact" className="glass-panel rounded-[2rem] p-6 sm:p-10 lg:p-12 animate-fade-in-up stagger-6 scroll-mt-24">
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

              <div className="flex flex-col gap-3 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-indigo-400" />
                  <span>abhi28031@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={14} className="text-emerald-400" />
                  <span>+91 8126684451 (WhatsApp Available)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-amber-400" />
                  <span>New Delhi, India (Open to Relocation & Remote)</span>
                </div>
              </div>
            </div>

            <div className="flex-[1.4] w-full bg-zinc-950/70 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs font-medium">
                    {formError}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="name" className="text-xs text-zinc-400 font-medium mb-1 block">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      value={contactName}
                      onChange={(e) => { setContactName(e.target.value); if (formError) setFormError(""); }}
                      placeholder="e.g. Alex Rivera"
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="email" className="text-xs text-zinc-400 font-medium mb-1 block">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      value={contactEmail}
                      onChange={(e) => { setContactEmail(e.target.value); if (formError) setFormError(""); }}
                      placeholder="e.g. alex@company.com"
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
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
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner resize-none"
                    required
                  />
                </div>
                <div className="mt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] cursor-pointer"
                  >
                    <MessageCircle size={15} />
                    <span>Send via WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
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
