import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBranchyStore } from '@/store/branchyStore';
import { mockRepoTemplate } from '@/data/mockData';
import { N8N_WEBHOOKS } from '@/config/webhooks';
import { AnalysisResult } from '@/types';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type ModalStep = 'select' | 'analyzing' | 'complete';
type TaskStatus = 'pending' | 'running' | 'complete' | 'error';

interface Task {
  id: string;
  label: string;
  status: TaskStatus;
  duration?: number;
}

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  language: string | null;
  visibility: string;
  updated_at: string;
  private: boolean;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const TASK_DELAYS: Record<string, number> = {
  t1: 1000,
  t2: 2000,
  t3: 3000,
  t4: 2000,
  t5: 2000,
  t6: 1000,
  t7: 3000,
  t8: 3000,
  t9: 1000,
  t10: 1000,
};

const INITIAL_TASKS: Task[] = [
  { id: 't1', label: 'Conectando ao repositório', status: 'pending' },
  { id: 't2', label: 'Lendo estrutura de arquivos', status: 'pending' },
  { id: 't3', label: 'Mapeando módulos e dependências', status: 'pending' },
  { id: 't4', label: 'Detectando dependências circulares', status: 'pending' },
  { id: 't5', label: 'Calculando complexidade do código', status: 'pending' },
  { id: 't6', label: 'Identificando código morto', status: 'pending' },
  { id: 't7', label: 'Gerando mapa de arquitetura', status: 'pending' },
  { id: 't8', label: 'Construindo guia de onboarding', status: 'pending' },
  { id: 't9', label: 'Computando score de saúde', status: 'pending' },
  { id: 't10', label: 'Finalizando análise', status: 'pending' },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d atrás`;
  if (hrs > 0) return `${hrs}h atrás`;
  if (mins > 0) return `${mins}m atrás`;
  return 'agora';
}

function langColor(lang: string | null): string {
  const map: Record<string, string> = {
    TypeScript: '#3178C6',
    JavaScript: '#F0DB4F',
    Python: '#3776AB',
    Go: '#00ADD8',
    Rust: '#CE422B',
    Java: '#B07219',
    'C#': '#239120',
    Ruby: '#CC342D',
    PHP: '#4F5D95',
    Swift: '#FA7343',
    Kotlin: '#A97BFF',
    CSS: '#563D7C',
    HTML: '#E34C26',
    Shell: '#89E051',
  };
  return map[lang ?? ''] ?? '#6E7681';
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function StepDots({ step }: { step: ModalStep }) {
  const steps: ModalStep[] = ['select', 'analyzing', 'complete'];
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
      {steps.map((s) => (
        <div
          key={s}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: s === step ? '#3FB950' : '#30363D',
            transition: 'background-color 300ms',
          }}
        />
      ))}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div
      style={{
        height: 48,
        borderRadius: 6,
        backgroundColor: '#0D1117',
        marginBottom: 8,
        animation: 'branchyPulse 1.5s ease-in-out infinite',
      }}
    />
  );
}

function TaskIcon({ status }: { status: TaskStatus }) {
  if (status === 'pending') {
    return (
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '1.5px solid #30363D',
          flexShrink: 0,
        }}
      />
    );
  }
  if (status === 'running') {
    return <div className="branchy-spinner" style={{ flexShrink: 0 }} />;
  }
  if (status === 'complete') {
    return (
      <div
        className="branchy-check"
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: '#3FB950',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  // error
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: '#F85149',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{ color: 'white', fontSize: 12, lineHeight: 1 }}>×</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main ConnectModal
// ─────────────────────────────────────────────
interface ConnectModalProps {
  onDismiss?: () => void;
}

export default function ConnectModal({ onDismiss }: ConnectModalProps) {
  const { session } = useAuth();
  const addRepo = useBranchyStore((s) => s.addRepo);
  const addRecentRepo = useBranchyStore((s) => s.addRecentRepo);
  const navigate = useNavigate();

  const [step, setStep] = useState<ModalStep>('select');
  const [visible, setVisible] = useState(true);

  // Step 1 state
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);

  // Step 2 state
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [stepTransitionKey, setStepTransitionKey] = useState(0);
  const runningRef = useRef(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [realResult, setRealResult] = useState<AnalysisResult | null>(null);

  // Step 3 state
  const [analysisStats, setAnalysisStats] = useState({ files: 0, healthScore: 0, issues: 0 });

  // Overlay closing animation
  const [fading, setFading] = useState(false);

  // ── Fetch repos ──────────────────────────────
  useEffect(() => {
    if (!session?.provider_token) {
      setReposLoading(false);
      return;
    }
    fetch('https://api.github.com/user/repos?sort=updated&per_page=20', {
      headers: { Authorization: `Bearer ${session.provider_token}` },
    })
      .then((r) => r.json())
      .then((data: GithubRepo[]) => {
        setRepos(Array.isArray(data) ? data : []);
        setReposLoading(false);
      })
      .catch(() => setReposLoading(false));
  }, [session]);

  // ── Task runner (n8n Polling) ────────────────
  const runTasks = useCallback(async (jobIdVal: string) => {
    if (runningRef.current) return;
    runningRef.current = true;

    let taskList = INITIAL_TASKS.map((t) => ({ ...t }));
    let completedInUI = 0;

    // We animate the UI tasks while polling in the background
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${N8N_WEBHOOKS.GET_STATUS}?jobId=${jobIdVal}`);
        const data = await res.json();

        if (data.status === 'COMPLETED' || data.status === 'FAILED') {
          clearInterval(interval);
          
          // Complete remaining UI tasks quickly
          for (let i = completedInUI; i < taskList.length; i++) {
            taskList[i].status = data.status === 'COMPLETED' ? 'complete' : 'error';
            setTasks([...taskList]);
            await new Promise(r => setTimeout(r, 100));
          }

          if (data.status === 'COMPLETED' && data.analysisResult) {
            const result = data.analysisResult as AnalysisResult;
            setRealResult(result);
            setAnalysisStats({
              files: result.filesCount,
              healthScore: result.healthScore,
              issues: result.healthReport.issues.length,
            });
            
            await new Promise((r) => setTimeout(r, 600));
            setStepTransitionKey((k) => k + 1);
            setStep('complete');
          } else {
            // Handle error state in UI if needed
          }
          runningRef.current = false;
        } else {
          // Progress simulation
          if (completedInUI < taskList.length - 1) {
             taskList[completedInUI].status = 'complete';
             completedInUI++;
             taskList[completedInUI].status = 'running';
             setTasks([...taskList]);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);
  }, []);

  // ── Transition to step 2 ─────────────────────
  const handleAnalyze = async () => {
    if (!selectedRepo || !session?.provider_token) return;
    setStepTransitionKey((k) => k + 1);
    setStep('analyzing');

    try {
      const res = await fetch(N8N_WEBHOOKS.ANALYZE_REPO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: selectedRepo.full_name,
          repoName: selectedRepo.name,
          owner: selectedRepo.owner.login,
          token: session.provider_token,
        }),
      });
      const data = await res.json();
      if (data.jobId) {
        setJobId(data.jobId);
        runTasks(data.jobId);
      }
    } catch (err) {
      console.error('Failed to start analysis:', err);
    }
  };

  // ── Step 3 → navigate ────────────────────────
  const handleViewResults = () => {
    if (selectedRepo && realResult) {
      const repoId = selectedRepo.name;
      // Persist the real result from n8n
      addRepo(realResult);
      addRecentRepo({
        repoId,
        repoUrl: selectedRepo.full_name,
        repoName: selectedRepo.name,
        owner: selectedRepo.owner.login,
        status: 'analyzed',
        analyzedAt: new Date().toISOString(),
      });
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        onDismiss?.();
        navigate(`/app/repo/${repoId}`);
      }, 200);
    } else if (selectedRepo) {
      // Fallback to mock if real result missing (should not happen in success flow)
      const repoId = selectedRepo.name;
      addRepo({
        ...mockRepoTemplate,
        repoId,
        repoName: selectedRepo.name,
        owner: selectedRepo.owner.login,
        language: selectedRepo.language || 'TypeScript',
        filesCount: analysisStats.files,
        healthScore: analysisStats.healthScore,
        healthReport: {
          ...mockRepoTemplate.healthReport,
          overallScore: analysisStats.healthScore,
        },
        analyzedAt: new Date().toISOString(),
      });
      // ... same as before
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        onDismiss?.();
        navigate(`/app/repo/${repoId}`);
      }, 200);
    }
  };

  const completedCount = tasks.filter((t) => t.status === 'complete').length;
  const progressPct = (completedCount / tasks.length) * 100;

  const filteredRepos = repos.filter((r) =>
    r.full_name.toLowerCase().includes(search.toLowerCase())
  );

  if (!visible) return null;

  return (
    <>
      {/* Global styles (injected once) */}
      <style>{`
        @keyframes branchyPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes branchySpin {
          to { transform: rotate(360deg); }
        }
        @keyframes branchyFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes branchySlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes branchyScaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes branchyCheckPop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes branchyTaskIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .branchy-spinner {
          width: 18px;
          height: 18px;
          border: 1.5px solid #1A4228;
          border-top-color: #3FB950;
          border-radius: 50%;
          animation: branchySpin 700ms linear infinite;
        }
        .branchy-check {
          animation: branchyCheckPop 200ms ease forwards;
        }
        .branchy-overlay {
          animation: branchyFadeIn 150ms ease forwards;
        }
        .branchy-step-enter {
          animation: branchySlideUp 200ms ease forwards;
        }
        .branchy-step-scale {
          animation: branchyScaleIn 250ms ease forwards;
        }
        .branchy-task-item {
          animation: branchyTaskIn 150ms ease forwards;
        }
      `}</style>

      {/* Overlay */}
      <div
        className="branchy-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity 200ms ease' : undefined,
        }}
      >
        {/* Card */}
        <div
          style={{
            background: '#161B22',
            border: '0.5px solid #30363D',
            borderRadius: 10,
            width: 480,
            maxWidth: 'calc(100vw - 32px)',
            padding: 28,
            position: 'relative',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                color: '#fff',
                fontWeight: 600,
              }}
            >
              branchy<span style={{ color: '#3FB950' }}>.</span>
            </span>
          </div>

          {/* Step dots */}
          <StepDots step={step} />

          {/* ── STEP 1: SELECT REPO ── */}
          {step === 'select' && (
            <div
              key={`select-${stepTransitionKey}`}
              className="branchy-step-enter"
              style={{ marginTop: 20, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: '#484F58',
                  textAlign: 'center',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                Selecionar Repositório
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: '#6E7681',
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                Escolha qual repositório analisar
              </p>

              {/* Search */}
              <input
                type="text"
                placeholder="buscar repositório..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: '#0D1117',
                  border: '0.5px solid #30363D',
                  borderRadius: 6,
                  padding: '8px 14px',
                  width: '100%',
                  boxSizing: 'border-box',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: '#C9D1D9',
                  outline: 'none',
                  marginBottom: 12,
                }}
              />

              {/* Repo list */}
              <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, marginBottom: 16 }}>
                {reposLoading
                  ? [1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)
                  : filteredRepos.length === 0
                  ? (
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#484F58', textAlign: 'center', padding: '24px 0' }}>
                      Nenhum repositório encontrado.
                    </p>
                  )
                  : filteredRepos.map((repo) => {
                    const isSelected = selectedRepo?.id === repo.id;
                    return (
                      <div
                        key={repo.id}
                        onClick={() => setSelectedRepo(repo)}
                        style={{
                          background: isSelected ? '#0D2318' : '#0D1117',
                          border: `0.5px solid ${isSelected ? '#3FB950' : '#21262D'}`,
                          borderRadius: 6,
                          padding: '12px 16px',
                          marginBottom: 8,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'border-color 150ms, background 150ms',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLDivElement).style.borderColor = '#388BFD';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLDivElement).style.borderColor = '#21262D';
                          }
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 13,
                              color: '#C9D1D9',
                              marginBottom: 4,
                            }}
                          >
                            {repo.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {repo.language && (
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  fontSize: 10,
                                  color: langColor(repo.language),
                                  background: `${langColor(repo.language)}22`,
                                  border: `0.5px solid ${langColor(repo.language)}55`,
                                  borderRadius: 4,
                                  padding: '1px 6px',
                                }}
                              >
                                {repo.language}
                              </span>
                            )}
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 11,
                                color: '#484F58',
                              }}
                            >
                              {timeAgo(repo.updated_at)}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 10,
                              color: '#484F58',
                              background: '#21262D',
                              borderRadius: 4,
                              padding: '2px 7px',
                            }}
                          >
                            {repo.private ? 'privado' : 'público'}
                          </span>
                          {isSelected && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <circle cx="8" cy="8" r="7.25" stroke="#3FB950" strokeWidth="1.5" fill="#0D2318" />
                              <path d="M4.5 8L6.8 10.5L11.5 5.5" stroke="#3FB950" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* CTA */}
              <button
                onClick={handleAnalyze}
                disabled={!selectedRepo}
                style={{
                  width: '100%',
                  background: selectedRepo ? '#238636' : '#21262D',
                  color: selectedRepo ? '#fff' : '#484F58',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 0',
                  cursor: selectedRepo ? 'pointer' : 'not-allowed',
                  transition: 'background 150ms, color 150ms',
                }}
              >
                Analisar este repositório →
              </button>
            </div>
          )}

          {/* ── STEP 2: ANALYZING ── */}
          {step === 'analyzing' && (
            <div
              key={`analyzing-${stepTransitionKey}`}
              className="branchy-step-enter"
              style={{ marginTop: 20, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  color: '#fff',
                  textAlign: 'center',
                  marginBottom: 4,
                }}
              >
                {selectedRepo?.full_name ?? 'repositório'}
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: '#6E7681',
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                Análise em andamento...
              </p>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: 3,
                  background: '#21262D',
                  borderRadius: 2,
                  marginBottom: 20,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    background: '#3FB950',
                    borderRadius: 2,
                    transition: 'width 400ms ease',
                  }}
                />
              </div>

              {/* Task list */}
              <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="branchy-task-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 0',
                      borderBottom: '0.5px solid #21262D',
                    }}
                  >
                    <TaskIcon status={task.status} />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                        color:
                          task.status === 'pending'
                            ? '#484F58'
                            : task.status === 'running'
                            ? '#C9D1D9'
                            : task.status === 'error'
                            ? '#F85149'
                            : '#6E7681',
                        flex: 1,
                      }}
                    >
                      {task.label}
                    </span>
                    {task.status === 'complete' && task.duration !== undefined && (
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11,
                          color: '#484F58',
                        }}
                      >
                        {task.duration.toFixed(1)}s
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: COMPLETE ── */}
          {step === 'complete' && (
            <div
              key={`complete-${stepTransitionKey}`}
              className="branchy-step-scale"
              style={{
                marginTop: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Green circle checkmark */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#0D2318',
                  border: '1.5px solid #3FB950',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 20,
                    color: '#3FB950',
                    lineHeight: 1,
                  }}
                >
                  ✓
                </span>
              </div>

              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 18,
                  color: '#fff',
                  marginTop: 16,
                  marginBottom: 0,
                }}
              >
                Análise concluída
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: '#6E7681',
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                {selectedRepo?.full_name ?? ''}
              </p>

              {/* Stats */}
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  marginTop: 20,
                  justifyContent: 'center',
                }}
              >
                {/* Files */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 20,
                      color: '#C9D1D9',
                    }}
                  >
                    {analysisStats.files}
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#6E7681' }}>
                    arquivos
                  </span>
                </div>
                {/* Health */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 20,
                      color:
                        analysisStats.healthScore >= 80
                          ? '#3FB950'
                          : analysisStats.healthScore >= 50
                          ? '#D29922'
                          : '#F85149',
                    }}
                  >
                    {analysisStats.healthScore}
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#6E7681' }}>
                    health score
                  </span>
                </div>
                {/* Issues */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 20,
                      color: analysisStats.issues > 0 ? '#D29922' : '#3FB950',
                    }}
                  >
                    {analysisStats.issues}
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#6E7681' }}>
                    problemas
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleViewResults}
                style={{
                  marginTop: 24,
                  width: '100%',
                  background: '#238636',
                  color: '#fff',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  border: 'none',
                  borderRadius: 6,
                  height: 44,
                  cursor: 'pointer',
                  transition: 'brightness 150ms',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.filter = '')}
              >
                Ver resultados →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
