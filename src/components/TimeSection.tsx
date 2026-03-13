const bars = [
  { label: "compreensão", pct: 58, color: "bg-destructive" },
  { label: "manutenção", pct: 22, color: "bg-accent-yellow" },
  { label: "escrita nova", pct: 14, color: "bg-primary" },
  { label: "reuniões", pct: 6, color: "bg-accent-blue" },
];

const TimeSection = () => {
  return (
    <section className="py-[72px] px-6 md:px-12 border-b border-border">
      <p className="font-mono text-[11px] text-ghost uppercase tracking-[0.1em] mb-4">// como o tempo é realmente gasto</p>
      <h2 className="font-mono text-[22px] md:text-[28px] font-semibold text-white tracking-[-0.5px] mb-4">
        Onde vai o dia de trabalho
      </h2>
      <p className="font-body text-[14px] text-hint max-w-[480px] leading-[1.7] mb-12">
        Dado de campo real. Não estimativa. 3.244 horas monitoradas em 7 projetos com 79 devs profissionais.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left */}
        <div>
          <p className="font-body text-[14px] text-hint leading-[1.7] mb-6">
            A maior fatia do tempo de engenharia é gasta decifrando código existente. Em organizações maiores, o custo de manutenção se torna ainda mais dominante.
          </p>
          <div className="bg-surface border border-border rounded-lg p-6">
            <p className="font-mono text-[36px] font-semibold text-destructive mb-1">32%</p>
            <p className="font-body text-[13px] text-muted-foreground leading-[1.6]">
              do tempo vai para manutenção em orgs com 500+ devs — sem criar nada novo
            </p>
          </div>
        </div>

        {/* Right — bar chart */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em] mb-6">
            DISTRIBUIÇÃO DO DIA DE TRABALHO
          </p>
          <div className="space-y-4">
            {bars.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted-foreground w-[120px] md:w-[140px] shrink-0">{b.label}</span>
                <div className="flex-1 bg-border rounded-sm h-[6px]">
                  <div className={`${b.color} h-full rounded-sm`} style={{ width: `${b.pct}%` }} />
                </div>
                <span className="font-mono text-[11px] text-hint w-8 text-right">{b.pct}%</span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-ghost mt-6">
            fonte: Bao et al., IEEE TSE · Universidade de Waterloo
          </p>
        </div>
      </div>
    </section>
  );
};

export default TimeSection;
