export default function TeamPage() {
  return (
    <div>
      <div className="flex gap-2 mb-6">
        <input
          placeholder="email@exemplo.com"
          className="flex-1 bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-2 font-mono text-[12px] text-b-text placeholder:text-b-text-ghost outline-none"
        />
        <select className="bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-2 py-1 font-mono text-[12px] text-b-text outline-none">
          <option>Viewer</option>
          <option>Editor</option>
          <option>Admin</option>
        </select>
        <button className="font-mono text-[12px] text-white bg-[#238636] hover:bg-[#2EA043] px-3 py-1.5 rounded-btn transition-colors duration-150">
          Convidar
        </button>
      </div>

      <div className="bg-b-card border-[0.5px] border-b-border rounded-card overflow-hidden">
        <div className="flex items-center px-4 py-3">
          <span className="w-7 h-7 rounded-full bg-b-blue-bg text-b-blue font-mono text-[10px] flex items-center justify-center mr-3">AC</span>
          <div className="flex-1">
            <div className="font-mono text-[12px] text-white">Acme User</div>
            <div className="font-body text-[11px] text-b-text-muted">user@acme-corp.com</div>
          </div>
          <span className="font-mono text-[10px] text-b-text-muted bg-b-elevated px-1.5 py-0.5 rounded-sm">Admin</span>
        </div>
      </div>
    </div>
  );
}
