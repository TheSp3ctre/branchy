const CTASection = () => {
  return (
    <section className="py-20 px-6 md:px-12 text-center">
      <h2 className="font-mono text-[24px] md:text-[32px] font-semibold text-white mb-4">
        Analise seu repositório agora.
      </h2>
      <p className="font-body text-[14px] text-hint mb-8">
        Gratuito. Sem instalação. Resultado em menos de 60 segundos.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-2 max-w-[440px] mx-auto">
        <input
          type="text"
          placeholder="github.com/seu-org/seu-repo"
          className="flex-1 bg-surface border border-border-subtle rounded-md px-3.5 py-2.5 text-foreground font-mono text-[12px] placeholder:text-ghost outline-none focus:border-primary transition-colors duration-150"
        />
        <button className="bg-green-cta text-white font-mono text-[12px] rounded-md px-5 py-2.5 hover:brightness-110 transition-all duration-150 whitespace-nowrap">
          Analisar →
        </button>
      </div>
    </section>
  );
};

export default CTASection;
