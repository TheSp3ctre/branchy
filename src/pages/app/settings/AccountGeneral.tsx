import { useAuth } from '@/contexts/AuthContext';

export default function AccountGeneralPage() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="font-mono text-[12px] text-b-text-ghost">Carregando dados...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="font-mono text-[10px] text-b-text-ghost uppercase block mb-1.5">NOME</label>
        <input
          defaultValue={user?.user_metadata?.full_name || user?.user_metadata?.name || "Usuário"}
          disabled
          className="w-full bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-2 font-mono text-[13px] text-b-text outline-none opacity-70 cursor-not-allowed"
        />
      </div>
      <div>
        <label className="font-mono text-[10px] text-b-text-ghost uppercase block mb-1.5">EMAIL</label>
        <input
          defaultValue={user?.email || ""}
          disabled
          className="w-full bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-2 font-mono text-[13px] text-b-text outline-none opacity-70 cursor-not-allowed"
        />
      </div>
    </div>
  );
}
