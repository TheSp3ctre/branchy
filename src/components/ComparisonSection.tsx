const headers = ["funcionalidade", "branchy", "github nativo", "swark", "copilot"];

const rows = [
  ["analisa repositório real", "✓", "✗", "parcial", "✗"],
  ["sem instalação local", "✓", "✓", "✗", "✓"],
  ["guia de onboarding", "✓", "✗", "✗", "✗"],
  ["grafo de dependências", "✓", "✗", "parcial", "✗"],
  ["score de saúde do código", "✓", "✗", "✗", "✗"],
];

const cellColor = (val: string, col: number) => {
  if (val === "✓" && col === 1) return "text-primary";
  if (val === "✓") return "text-primary";
  if (val === "✗") return "text-ghost";
  if (val === "parcial") return "text-accent-yellow";
  return "text-muted-foreground";
};

const ComparisonSection = () => {
  return (
    <section className="py-[72px] px-6 md:px-12 border-b border-border">
      <p className="font-mono text-[11px] text-ghost uppercase tracking-[0.1em] mb-4">// gap de mercado</p>
      <h2 className="font-mono text-[22px] md:text-[28px] font-semibold text-white tracking-[-0.5px] mb-4">
        Nenhuma ferramenta existente <span className="text-destructive">resolve isso.</span>
      </h2>
      <p className="font-body text-[14px] text-hint max-w-[520px] leading-[1.7] mb-10">
        O mercado tem ferramentas de escrita de código. Não tem ferramentas de leitura e entendimento de repositório real.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[13px]">
          <thead>
            <tr className="border-b border-border">
              {headers.map((h, i) => (
                <th key={h} className={`text-left py-3 px-4 text-[11px] tracking-[0.05em] font-normal ${i === 1 ? "text-primary" : "text-hint"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-card hover:bg-surface transition-colors duration-150">
                {row.map((cell, ci) => (
                  <td key={ci} className={`py-3 px-4 ${ci === 0 ? "text-muted-foreground" : cellColor(cell, ci)}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ComparisonSection;
