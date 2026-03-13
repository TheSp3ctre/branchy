const steps = [
  { num: "01", title: "conectar", sub: "URL do GitHub" },
  { num: "02", title: "analisar", sub: "estrutura + deps" },
  { num: "03", title: "detectar", sub: "padrões + anomalias" },
  { num: "04", title: "entregar", sub: "mapa + guia em <60s" },
];

const features = [
  { border: "border-l-primary", title: "Mapa de arquitetura", desc: "Grafo visual de todos os módulos, serviços e dependências." },
  { border: "border-l-accent-blue", title: "Grafo de dependências", desc: "Detecta dependências circulares, módulos sem consumers e libs desatualizadas." },
  { border: "border-l-accent-yellow", title: "Guia de onboarding com IA", desc: "Guia gerado a partir do código real. Novos devs entendem o codebase antes de tocá-lo." },
  { border: "border-l-destructive", title: "Score de saúde contínuo", desc: "Manutenibilidade e complexidade monitorados a cada push." },
];

const SolutionSection = () => {
  return (
    <section className="py-[72px] px-6 md:px-12 border-b border-border">
      <p className="font-mono text-[11px] text-ghost uppercase tracking-[0.1em] mb-4">// a solução</p>
      <h2 className="font-mono text-[22px] md:text-[28px] font-semibold text-white tracking-[-0.5px] mb-4">
        branchy. <span className="text-primary">legibilidade como infraestrutura.</span>
      </h2>
      <p className="font-body text-[14px] text-hint max-w-[520px] leading-[1.7] mb-10">
        Não é documentação gerada por IA. É inteligência estrutural sobre o seu repositório — gerada direto do código, sem configuração manual.
      </p>

      {/* Pipeline */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.num} className={`p-5 ${i < steps.length - 1 ? "md:border-r border-b md:border-b-0 border-border" : ""}`}>
              <p className="font-mono text-[10px] text-ghost mb-1">{s.num}</p>
              <p className="font-mono text-[12px] text-foreground font-medium">{s.title}</p>
              <p className="font-body text-[11px] text-hint">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((f) => (
          <div key={f.title} className={`bg-surface border border-border rounded-lg p-5 border-l-2 ${f.border}`}>
            <p className="font-mono text-[13px] text-foreground mb-2">{f.title}</p>
            <p className="font-body text-[13px] text-hint leading-[1.6]">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SolutionSection;
