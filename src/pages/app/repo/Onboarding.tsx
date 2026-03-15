import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { Download, Sparkles, User, Shield, Briefcase, RefreshCw, Loader2, FileText, ChevronRight } from 'lucide-react';
import { onboardingService, OnboardingGuide } from '@/services/onboarding';
import { githubAnalyzer } from '@/services/githubAnalyzer';
import { useAuth } from '@/contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';
import { motion, AnimatePresence } from 'framer-motion';

type Persona = 'developer' | 'stakeholder' | 'auditor';

export default function OnboardingPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  const addRepo = useBranchyStore((s) => s.addRepo);
  const { session } = useAuth();
  
  const [guide, setGuide] = useState<OnboardingGuide | null>(null);
  const [persona, setPersona] = useState<Persona>('developer');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchGuide = async () => {
    if (!repoId) return;
    try {
      setLoading(true);
      const data = await onboardingService.getLatest(repoId, persona);
      setGuide(data);
    } catch (err) {
      console.error('Failed to fetch onboarding guide:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuide();
  }, [repoId, persona]);

  useEffect(() => {
    if (guide?.contentMd) {
      mermaid.initialize({ 
        startOnLoad: false, 
        theme: 'dark',
        themeVariables: { 
          primaryColor: '#10B981',
          primaryTextColor: '#fff',
          lineColor: '#334155'
        } 
      });
      mermaid.run({ querySelector: '.mermaid' });
    }
  }, [guide]);

  const handleGenerate = async () => {
    if (!repoId || !repo || !session?.provider_token) return;
    try {
      setGenerating(true);
      const result = await githubAnalyzer.analyzeRepo(
        repo.repoName,
        repo.owner,
        session.provider_token,
        repoId
      );
      addRepo(result);
      await fetchGuide();
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadMd = () => {
    if (!guide) return;
    const blob = new Blob([guide.contentMd], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onboarding-${repo?.repoName}-${persona}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  const personas = [
    { id: 'developer', label: 'Developer', icon: User, desc: 'Foco técnico e arquitetura' },
    { id: 'stakeholder', label: 'Stakeholder', icon: Briefcase, desc: 'Visão de negócio e impacto' },
    { id: 'auditor', label: 'Auditor', icon: Shield, desc: 'Segurança e conformidade' },
  ];

  return (
    <div className="flex bg-b-background min-h-screen">
      {/* Persona Sidebar */}
      <div className="w-[280px] border-r border-b-border p-6 flex flex-col gap-6">
        <div>
          <h3 className="font-mono text-[10px] text-b-text-ghost uppercase tracking-widest mb-4">Selecione a Persona</h3>
          <div className="space-y-2">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => setPersona(p.id as Persona)}
                className={`w-full text-left p-3 rounded-card border transition-all ${
                  persona === p.id 
                    ? 'bg-b-card border-b-blue text-white' 
                    : 'border-transparent text-b-text-ghost hover:bg-b-surface'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <p.icon size={14} className={persona === p.id ? 'text-b-blue' : ''} />
                  <span className="font-mono text-[13px] font-bold">{p.label}</span>
                </div>
                <p className="font-body text-[11px] opacity-60 leading-tight">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-b-border">
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 bg-b-blue text-white font-mono text-[12px] py-3 rounded-btn hover:brightness-110 transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {generating ? 'Gerando...' : 'Regerar com IA'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto py-12 px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12 border-b border-b-border pb-8">
            <div>
              <h1 className="font-mono text-[28px] text-white font-bold leading-tight">
                {guide?.title || `Guia de Onboarding — ${repo.repoName}`}
              </h1>
              {guide && (
                <p className="font-body text-[13px] text-b-text-ghost mt-2">
                  Gerado em {new Date(guide.createdAt).toLocaleDateString()} · {guide.wordCount} palavras
                </p>
              )}
            </div>
            
            {guide && (
              <button 
                onClick={handleDownloadMd}
                className="flex items-center gap-2 font-mono text-[12px] text-b-text-ghost border border-b-border px-4 py-2 rounded-btn hover:text-white hover:border-b-text-ghost transition-all"
              >
                <FileText size={14} /> Download .md
              </button>
            )}
          </div>

          {/* Content Loading / Empty State */}
          {loading ? (
            <div className="space-y-6">
              <div className="h-8 bg-b-card animate-pulse rounded-sm w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-b-card animate-pulse rounded-sm w-full" />
                <div className="h-4 bg-b-card animate-pulse rounded-sm w-5/6" />
                <div className="h-4 bg-b-card animate-pulse rounded-sm w-4/6" />
              </div>
              <div className="h-64 bg-b-card animate-pulse rounded-card w-full" />
            </div>
          ) : (
            <>
              {/* Markdown Content */}
              <div className="prose prose-invert max-w-none 
                prose-headings:font-mono prose-headings:font-bold prose-headings:text-white 
                prose-h2:text-b-green prose-h2:border-b prose-h2:border-b-border prose-h2:pb-2 prose-h2:mt-12
                prose-p:font-body prose-p:text-b-text-secondary prose-p:leading-relaxed
                prose-code:font-mono prose-code:bg-b-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-b-blue
                prose-pre:bg-b-surface prose-pre:border prose-pre:border-b-border
                prose-li:font-body prose-li:text-b-text-secondary
              ">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      if (!inline && match && match[1] === 'mermaid') {
                        return <div className="mermaid bg-white/5 p-8 rounded-card my-8 border border-b-border/30 flex justify-center">{String(children).replace(/\n$/, '')}</div>;
                      }
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {guide.contentMd}
                </ReactMarkdown>
              </div>

              {/* AI Floating Comments / Insights Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 pt-12 border-t border-b-border"
              >
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 rounded-full bg-b-blue/20 flex items-center justify-center">
                    <Sparkles size={16} className="text-b-blue" />
                  </div>
                  <h3 className="font-mono text-[16px] text-white font-bold">Feedback em Tempo Real da IA</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {persona === 'developer' ? (
                    <>
                      <AIComment 
                        author="Branchy AI" 
                        time="Agora mesmo"
                        content="O padrão de injeção de dependência neste repositório parece inconsistente entre os módulos de serviço e controladores. Recomendo padronizar para facilitar a testabilidade."
                      />
                      <AIComment 
                        author="Branchy AI" 
                        time="2 min atrás"
                        content="Detectei que o arquivo `README.md` está desatualizado em relação às novas variáveis de ambiente adicionadas no último sprint."
                      />
                    </>
                  ) : persona === 'stakeholder' ? (
                    <>
                      <AIComment 
                        author="Branchy AI" 
                        time="Agora mesmo"
                        content="O ROI deste projeto pode ser aumentado em 15% se focarmos na automação do pipeline de deployment, reduzindo o tempo de entrega de novas features."
                      />
                      <AIComment 
                        author="Branchy AI" 
                        time="5 min atrás"
                        content="A saúde do repositório está excelente (92/100), com baixa taxa de refatoração necessária para as próximas semanas."
                      />
                    </>
                  ) : (
                    <>
                      <AIComment 
                        author="Branchy AI" 
                        time="Agora mesmo"
                        content="Existem 3 dependências com vulnerabilidades críticas conhecidas. Recomendo a atualização imediata conforme o relatório de segurança."
                      />
                      <AIComment 
                        author="Branchy AI" 
                        time="10 min atrás"
                        content="O log de auditoria não está capturando as alterações manuais em variáveis de ambiente de produção. Isso pode ser um ponto falho em auditorias futuras."
                      />
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AIComment({ author, time, content }: { author: string, time: string, content: string }) {
  return (
    <div className="bg-b-card border border-b-border rounded-card p-4 hover:border-b-blue/30 transition-all group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-b-blue font-bold tracking-wider uppercase">{author}</span>
          <span className="w-1 h-1 rounded-full bg-b-text-ghost" />
          <span className="font-mono text-[10px] text-b-text-ghost">{time}</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-[10px] font-mono text-b-text-ghost hover:text-white">Resolver</button>
        </div>
      </div>
      <p className="font-body text-[13px] text-b-text-secondary leading-relaxed">
        {content}
      </p>
    </div>
  );
}

