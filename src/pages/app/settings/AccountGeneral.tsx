export default function AccountGeneralPage() {
  return (
    <div className="space-y-6">
      <div>
        <label className="font-mono text-[10px] text-b-text-ghost uppercase block mb-1.5">NOME</label>
        <input
          defaultValue="Acme User"
          className="w-full bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-2 font-mono text-[13px] text-b-text outline-none focus:border-b-blue transition-colors duration-150"
        />
      </div>
      <div>
        <label className="font-mono text-[10px] text-b-text-ghost uppercase block mb-1.5">EMAIL</label>
        <input
          defaultValue="user@acme-corp.com"
          className="w-full bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-2 font-mono text-[13px] text-b-text outline-none focus:border-b-blue transition-colors duration-150"
        />
      </div>
      <button className="font-mono text-[12px] text-white bg-[#238636] hover:bg-[#2EA043] px-4 py-2 rounded-btn transition-colors duration-150">
        Salvar alterações
      </button>
    </div>
  );
}
