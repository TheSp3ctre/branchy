const terminalLines = [
  { text: "$ branchy analyze acme-corp/payments-api", color: "text-foreground" },
  { text: "→ scanning 247 files...", color: "text-muted-foreground" },
  { text: "✓ architecture map generated", color: "text-primary" },
  { text: "⚠ 6 circular dependencies detected", color: "text-accent-yellow" },
  { text: "! 3 modules with no active consumers", color: "text-destructive" },
  { text: "✓ onboarding guide ready — 38s", color: "text-primary" },
];

const HeroSection = () => {
  return (
    <section className="pt-[100px] md:pt-[132px] pb-12 md:pb-16 px-4 md:px-12 border-b border-border text-center">

      <h1 className="font-mono text-[22px] md:text-[42px] font-semibold text-white leading-[1.15] tracking-[-1px] max-w-[680px] mx-auto mb-4 md:mb-6">
        Seu time passa <span className="text-primary">58%</span> do dia tentando entender código que já existe.
      </h1>

      <p className="font-body text-[14px] md:text-[15px] font-light text-muted-foreground max-w-[520px] mx-auto leading-[1.7] mb-6 md:mb-8">
        Não escrevendo. Não criando. Decifrando. O Branchy transforma qualquer repositório GitHub em mapa de arquitetura, grafo de dependências e guia de onboarding — em menos de 60 segundos.
      </p>

      <div className="flex justify-center mb-8 md:mb-10">
        <button className="bg-green-cta text-white font-mono text-[13px] rounded-md px-[22px] py-[10px] hover:brightness-110 transition-all duration-150">
          Analisar meu repositório →
        </button>
      </div>

      <div className="max-w-[640px] mx-auto bg-surface border border-border-subtle rounded-lg p-5 text-left">
        <div className="flex gap-1.5 mb-4">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <div className="w-3 h-3 rounded-full bg-accent-yellow" />
          <div className="w-3 h-3 rounded-full bg-primary" />
        </div>
        <div className="space-y-1">
          {terminalLines.map((line, i) => (
            <p key={i} className={`font-mono text-[12px] md:text-[13px] ${line.color}`}>
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
