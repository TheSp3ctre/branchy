export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="bg-b-card border-[0.5px] border-b-border rounded-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] text-b-text-ghost uppercase">PLANO ATUAL</span>
            <div className="font-mono text-[20px] text-white mt-1">Free</div>
            <p className="font-body text-[12px] text-b-text-muted mt-1">Até 3 repositórios · Análise básica</p>
          </div>
          <button className="font-mono text-[13px] text-white bg-[#238636] hover:bg-[#2EA043] px-4 py-2 rounded-btn transition-colors duration-150">
            Upgrade para Pro →
          </button>
        </div>
      </div>

      <div className="bg-b-card border-[0.5px] border-b-border rounded-card p-5">
        <span className="font-mono text-[10px] text-b-text-ghost uppercase">PRO</span>
        <div className="font-mono text-[20px] text-white mt-1">R$ 49<span className="text-[14px] text-b-text-muted">/mês</span></div>
        <ul className="mt-3 space-y-2">
          {['Repositórios ilimitados', 'Análise avançada com IA', 'Onboarding guides personalizados', 'Integrações (Slack, Jira, Notion)', 'Suporte prioritário'].map((f) => (
            <li key={f} className="flex items-center gap-2 font-body text-[13px] text-b-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-b-green" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
