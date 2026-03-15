import { BackgroundPaths } from "./ui/background-paths";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <BackgroundPaths>
        <div className="pt-[100px] md:pt-[132px] pb-12 md:pb-16 px-4 md:px-12 text-center pointer-events-none">
          <div className="pointer-events-auto">
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

            <div className="relative max-w-[840px] mx-auto mt-12 mb-4 group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-b-green/20 to-b-blue/20 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative bg-b-surface border border-b-border/50 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.01]">
                {/* Dashboard Header Bar */}
                <div className="h-8 bg-b-elevated border-b border-b-border/30 flex items-center px-4 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-b-red/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-b-yellow/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-b-green/30" />
                  <div className="ml-4 font-mono text-[10px] text-b-text-ghost">Branchy Dashboard — payments-api</div>
                </div>
                
                <img 
                  src="/DASHBOARD.png" 
                  alt="Branchy Dashboard Preview" 
                  className="w-full h-auto opacity-95 group-hover:opacity-100 transition-opacity"
                />
                
                {/* Reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </BackgroundPaths>
    </section>
  );
};

export default HeroSection;
