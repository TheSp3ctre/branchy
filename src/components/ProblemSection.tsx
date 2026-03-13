const stats = [
  { number: "58%", color: "text-destructive", desc: "do dia de um dev gasto em compreensão de código — não em escrita", source: "Universidade de Waterloo · 79 devs · 3.244h" },
  { number: "$240k", color: "text-accent-yellow", desc: "perdidos por dev sênior com onboarding mal feito num codebase desorganizado", source: "DevOps Institute · 2024" },
  { number: "30%", color: "text-destructive", desc: "do budget total de TI consumido por dívida técnica — sem gerar valor novo", source: "Software Improvement Group · 2024" },
];

const causes = [
  { num: "01", title: "Sem documentação de arquitetura", body: "Decisões de design vivem na cabeça de 1–2 pessoas. Quando saem, o conhecimento vai junto." },
  { num: "02", title: "Ninguém sabe o que depende do quê", body: "Dependências circulares só são descobertas quando algo quebra em produção." },
  { num: "03", title: "Onboarding custa semanas", body: "Sem mapa, novos devs consomem 30% da produtividade de seniores por meses." },
  { num: "04", title: "IA está piorando isso", body: "Code churn dobrou em 2024 vs 2021. O Copilot escreve mais rápido do que qualquer um entende." },
];

const ProblemSection = () => {
  return (
    <section className="py-[72px] px-6 md:px-12 border-b border-border">
      <p className="font-mono text-[11px] text-ghost uppercase tracking-[0.1em] mb-4">// o problema</p>
      <h2 className="font-mono text-[22px] md:text-[28px] font-semibold text-white tracking-[-0.5px] mb-4">
        A maior parte do trabalho de um dev não é criar. É decifrar.{" "}
      </h2>
      <p className="font-body text-[14px] text-hint max-w-[480px] leading-[1.7] mb-12">
        Pesquisas de campo mostram que a esmagadora maioria do tempo de um desenvolvedor profissional é gasta tentando entender código existente — não escrevendo código novo.
      </p>

      {/* Stats grid */}
      <div className="rounded-lg overflow-hidden mb-10" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", backgroundColor: "hsl(var(--border-default))" }}>
        {stats.map((s, i) => (
          <div key={i} className="bg-background p-7">
            <p className={`font-mono text-[36px] font-semibold ${s.color} mb-2`}>{s.number}</p>
            <p className="font-body text-[13px] text-muted-foreground leading-[1.6] mb-3">{s.desc}</p>
            <p className="font-mono text-[10px] text-ghost">{s.source}</p>
          </div>
        ))}
      </div>

      {/* Cause cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {causes.map((c) => (
          <div key={c.num} className="bg-surface border border-border rounded-lg p-5">
            <p className="font-mono text-[11px] text-ghost mb-2">{c.num}</p>
            <p className="font-mono text-[13px] text-foreground mb-2">{c.title}</p>
            <p className="font-body text-[13px] text-hint leading-[1.6]">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProblemSection;
