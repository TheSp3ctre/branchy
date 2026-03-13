import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { timeAgo, getModuleColor } from '@/lib/branchy-utils';
import { Share2, Download } from 'lucide-react';

export default function OnboardingPage() {
  const { repoId } = useParams();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  const guide = repo.onboardingGuide;

  const techCategoryColors: Record<string, string> = {
    language: 'bg-b-blue-bg border-b-blue-border text-b-blue',
    runtime: 'bg-b-green-bg border-b-green-border text-b-green',
    framework: 'bg-b-purple-bg border-b-purple-border text-b-purple',
    database: 'bg-b-yellow-bg border-b-yellow-border text-b-yellow',
    service: 'bg-b-blue-bg border-b-blue-border text-b-blue',
    testing: 'bg-b-green-bg border-b-green-border text-b-green',
    infra: 'bg-b-card border-b-border-subtle text-b-text-secondary',
    build: 'bg-b-card border-b-border-subtle text-b-text-secondary',
    styling: 'bg-b-purple-bg border-b-purple-border text-b-purple',
    data: 'bg-b-blue-bg border-b-blue-border text-b-blue',
  };

  return (
    <div className="max-w-[720px] mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-mono text-[20px] text-white">Onboarding guide</h1>
          <p className="font-body text-[13px] text-b-text-muted mt-1">
            Gerado pelo Branchy AI · atualizado {timeAgo(guide.generatedAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 font-mono text-[12px] text-b-text-secondary border-[0.5px] border-b-border-subtle rounded-btn px-3 py-1.5 hover:bg-b-card transition-colors duration-150">
            <Share2 size={13} /> Compartilhar
          </button>
          <button className="flex items-center gap-1.5 font-mono text-[12px] text-b-text-secondary border-[0.5px] border-b-border-subtle rounded-btn px-3 py-1.5 hover:bg-b-card transition-colors duration-150">
            <Download size={13} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {guide.sections.map((section, i) => (
          <div key={i}>
            <h2 className="font-mono text-[14px] text-b-green uppercase tracking-[0.08em] mb-3 pb-2 border-b-[0.5px] border-b-border">
              {section.title}
            </h2>

            {section.type === 'overview' && (
              <p className="font-body text-[15px] font-light text-b-text-secondary leading-[1.8]">{section.content}</p>
            )}

            {section.type === 'techStack' && (
              <div className="flex flex-wrap gap-2">
                {section.content.map((tech: any) => (
                  <span key={tech.name} className={`font-mono text-[12px] px-2.5 py-1 rounded-sm border-[0.5px] ${techCategoryColors[tech.category] || techCategoryColors.infra}`}>
                    {tech.name}
                  </span>
                ))}
              </div>
            )}

            {section.type === 'structure' && (
              <div className="space-y-1">
                {section.content.map((item: any) => (
                  <div key={item.name}>
                    <div className="flex items-center gap-2 py-1.5">
                      <span className="font-mono text-[12px] text-b-text">{item.children ? '▸' : '·'} {item.name}</span>
                      <span className="font-body text-[12px] text-b-text-muted">{item.description}</span>
                    </div>
                    {item.children?.map((child: any) => (
                      <div key={child.name} className="flex items-center gap-2 py-1 pl-6">
                        <span className="font-mono text-[12px] text-b-text-secondary">· {child.name}</span>
                        <span className="font-body text-[12px] text-b-text-muted">{child.description}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {section.type === 'modules' && (
              <div className="grid grid-cols-2 gap-3">
                {section.content.map((mod: any) => (
                  <div key={mod.name} className="bg-b-card border-[0.5px] border-b-border rounded-card p-4">
                    <div className="font-mono text-[13px] text-white">{mod.name}</div>
                    <div className="font-mono text-[11px] text-b-text-ghost mt-0.5">{mod.path}</div>
                    <p className="font-body text-[12px] text-b-text-secondary mt-2">{mod.description}</p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'gettingStarted' && (
              <div className="space-y-3">
                {section.content.map((item: any, j: number) => (
                  <div key={j} className="flex items-start gap-3">
                    <span className="font-mono text-[14px] text-b-green font-semibold">{j + 1}</span>
                    <div>
                      <span className="font-mono text-[12px] text-b-text">{item.file}</span>
                      <p className="font-body text-[12px] text-b-text-muted mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'patterns' && (
              <div className="space-y-3">
                {section.content.map((item: any) => (
                  <div key={item.pattern} className="bg-b-surface border-l-2 border-b-green px-4 py-3.5">
                    <div className="font-mono text-[12px] text-b-text mb-2">{item.pattern}</div>
                    <pre className="font-mono text-[12px] text-b-text whitespace-pre-wrap">{item.code}</pre>
                    <p className="font-body text-[12px] text-b-text-muted mt-2">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'runLocally' && (
              <div className="space-y-3">
                {section.content.map((step: any) => (
                  <div key={step.step} className="flex items-start gap-3">
                    <span className="font-mono text-[14px] text-b-green font-semibold w-5">{step.step}</span>
                    <div className="flex-1">
                      <div className="font-mono text-[12px] text-b-text mb-1">{step.label}</div>
                      <div className="bg-b-surface border-l-2 border-b-green px-3 py-2 font-mono text-[12px] text-b-text">{step.command}</div>
                      <p className="font-body text-[12px] text-b-text-muted mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
