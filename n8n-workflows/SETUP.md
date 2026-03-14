# Branchy.io — N8N Workflows Setup Guide

Guia completo para configurar os dois workflows de análise de repositórios do Branchy.io no n8n.

---

## Visão Geral

O sistema de análise do Branchy.io usa dois workflows no n8n:

| Workflow | Arquivo | Método | Path |
|----------|---------|--------|------|
| Repo Analysis Pipeline | `analyze_repo.json` | POST | `/webhook/analyze-repo` |
| Status & Result Polling | `get_status.json` | GET | `/webhook/repo-status` |

### Como funciona o fluxo completo

```
Frontend (React)
    │
    ├─► POST /analyze-repo  ──► n8n cria Job no Supabase (PENDING)
    │                             └─► retorna { jobId } imediatamente
    │
    └─► polling GET /repo-status?jobId=...  (a cada 2s)
              └─► quando status = COMPLETED, retorna analysisResult completo
```

### Pipeline interno do Workflow A

```
Webhook POST
  → Gera UUID (jobId)
  → Supabase: INSERT Job (PENDING)
  → Responde ao frontend com jobId           ← resposta imediata (202)
  → Supabase: UPDATE Job (RUNNING)
  → GitHub API: GET /repos/{owner}/{repo}
  → GitHub API: GET file tree (recursive)
  → GitHub API: GET package.json
  → GitHub API: GET README.md
  → Code: monta prompt com todos os dados
  → Anthropic API: claude-opus-4-6 (8192 tokens)
  → Code: parseia resposta → estrutura AnalysisResult
  → IF sucesso?
       ✅ Supabase: UPDATE Job (COMPLETED) + analysisResult
       ❌ Supabase: UPDATE Job (FAILED)   + fallback
```

---

## Pré-requisitos

Antes de começar, tenha em mãos:

| Item | Onde obter |
|------|-----------|
| **Supabase Service Role Key** | Supabase Dashboard → Project Settings → API → campo `service_role` |
| **Anthropic API Key** | [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key |
| **GitHub Personal Access Token** | GitHub → Settings → Developer settings → Personal access tokens → Classic → scope `repo` |
| **URL do seu n8n cloud** | Painel do n8n cloud (ex: `https://meuusuario.app.n8n.cloud`) |

> ⚠️ Use a **service_role** key do Supabase, **não** a `anon` key. A anon key não tem permissão de escrita na tabela `Job`.

---

## Passo 1 — Importar os workflows no n8n

1. Acesse seu painel n8n cloud
2. Clique em **"+ New workflow"** (canto superior direito)
3. Clique nos **3 pontinhos** (`...`) → **"Import from file"**
4. Selecione o arquivo `n8n-workflows/analyze_repo.json`
5. Clique em **Save**
6. Repita os passos 2–5 para `n8n-workflows/get_status.json`

Após importar, você terá dois workflows na lista, ambos inativos.

---

## Passo 2 — Criar a Credential do Supabase

1. No n8n, vá em **Settings → Credentials → Add Credential**
2. Busque por **"Supabase"** e selecione
3. Preencha os campos:

```
Name:                Supabase branchy.io
Host:                https://dwwgdkxswvpfipilemsc.supabase.co
Service Role Secret: eyJ...  (sua service_role key)
```

> ⚠️ O nome da credential deve ser **exatamente** `Supabase branchy.io` (com ponto e letras maiúsculas) — é o nome referenciado nos nós dos workflows.

4. Clique em **Save & Test** — deve aparecer "Connection successful"

---

## Passo 3 — Adicionar a variável da Anthropic API Key

1. No n8n, vá em **Settings → Variables**
2. Clique em **"Add Variable"**
3. Preencha:

```
Name:  ANTHROPIC_API_KEY
Value: sk-ant-api03-...  (sua chave da Anthropic)
```

4. Clique em **Save**

Os nós de HTTP Request nos workflows leem essa variável automaticamente via `$vars.ANTHROPIC_API_KEY`.

---

## Passo 4 — Verificar (ou criar) a tabela `Job` no Supabase

Abra o **SQL Editor** no Supabase Dashboard e execute:

```sql
-- Verificar se a tabela já existe
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Job'
ORDER BY ordinal_position;
```

**Se retornar vazio**, a tabela ainda não foi criada (Prisma migration não foi rodada). Crie manualmente:

```sql
CREATE TABLE IF NOT EXISTS "Job" (
  id             TEXT PRIMARY KEY,
  "repoUrl"      TEXT NOT NULL,
  "repoName"     TEXT NOT NULL,
  owner          TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'PENDING',
  "analysisResult" JSONB,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para atualizar updatedAt automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_updated_at
  BEFORE UPDATE ON "Job"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**Se a tabela existir**, confirme que tem as colunas: `id`, `repoUrl`, `repoName`, `owner`, `status`, `analysisResult`, `createdAt`, `updatedAt`.

---

## Passo 5 — Ativar os workflows e pegar as URLs

### Workflow A — Repo Analysis Pipeline

1. Abra o workflow **"Branchy - Repo Analysis Pipeline"**
2. Clique no toggle **Activate** (canto superior direito)
3. Clique no nó **"Webhook - Start Analysis"**
4. Copie a **"Production URL"** — será algo como:
   ```
   https://USUARIO.app.n8n.cloud/webhook/analyze-repo
   ```

### Workflow B — Status & Result Polling

1. Abra o workflow **"Branchy - Status & Result Polling"**
2. Ative e copie a Production URL:
   ```
   https://USUARIO.app.n8n.cloud/webhook/repo-status
   ```

---

## Passo 6 — Configurar o frontend

Edite o arquivo `.env` na raiz do projeto adicionando:

```env
VITE_N8N_BASE_URL=https://USUARIO.app.n8n.cloud/webhook
```

O arquivo `src/config/webhooks.ts` já lê essa variável automaticamente:

```typescript
const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'https://your-instance.app.n8n.cloud/webhook';

export const N8N_WEBHOOKS = {
  ANALYZE_REPO: `${N8N_BASE_URL}/analyze-repo`,
  GET_STATUS:   `${N8N_BASE_URL}/repo-status`,
};
```

Reinicie o servidor de desenvolvimento após alterar o `.env`:

```bash
npm run dev
```

---

## Passo 7 — Testar com curl

### Teste 1: Disparar análise

```bash
curl -X POST https://USUARIO.app.n8n.cloud/webhook/analyze-repo \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/facebook/react",
    "repoName": "react",
    "owner": "facebook",
    "token": "ghp_SEU_TOKEN_AQUI"
  }'
```

Resposta esperada **(imediata, ~200ms)**:

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "PENDING",
  "message": "Analysis started"
}
```

### Teste 2: Verificar status

Substitua o `jobId` pelo UUID retornado acima:

```bash
curl "https://USUARIO.app.n8n.cloud/webhook/repo-status?jobId=550e8400-e29b-41d4-a716-446655440000"
```

Respostas possíveis:

**Enquanto processa:**
```json
{ "jobId": "...", "status": "RUNNING", "repoName": "react", "owner": "facebook" }
```

**Quando concluir (~30–90s dependendo do repo):**
```json
{
  "jobId": "...",
  "status": "COMPLETED",
  "repoName": "react",
  "owner": "facebook",
  "analysisResult": {
    "healthScore": 82,
    "modules": [...],
    "insights": [...],
    "onboardingGuide": {...},
    "healthReport": {...}
  }
}
```

**Se falhar:**
```json
{
  "jobId": "...",
  "status": "FAILED",
  "errorHint": "Verify the repo is accessible with the provided token",
  "errorDetail": "Analysis failed: ..."
}
```

**Se o jobId não existir:**
```json
{ "error": "Job not found", "jobId": "..." }
```

---

## Estrutura do AnalysisResult

O campo `analysisResult` segue a interface TypeScript definida em `src/types/index.ts`:

```typescript
interface AnalysisResult {
  repoId: string;
  repoName: string;
  owner: string;
  language: string;
  filesCount: number;
  healthScore: number;          // 0–100
  analyzedAt: string;           // ISO 8601
  modules: Module[];
  insights: Insight[];
  complexityByFile: FileComplexity[];
  circularDeps: CircularDep[];
  deadCode: DeadCodeItem[];
  onboardingGuide: OnboardingGuide;
  healthReport: HealthReport;
  changelogs: Changelog[];
}
```

---

## Solução de Problemas

### Credential do Supabase não encontrada

**Sintoma:** Nó Supabase mostra erro vermelho após importar
**Causa:** Nome da credential diferente do esperado
**Fix:** Abrir cada nó Supabase → no campo Credential, selecionar **"Supabase branchy.io"**

---

### Erro 401 na chamada à Anthropic

**Sintoma:** `{"error": {"type": "authentication_error", ...}}`
**Causa:** Variável `ANTHROPIC_API_KEY` não configurada ou incorreta
**Fix:** Settings → Variables → confirmar que existe `ANTHROPIC_API_KEY` com valor `sk-ant-...`

---

### Erro 404 no GitHub (repo not found)

**Sintoma:** `Get Repo Info` retorna `{"message": "Not Found"}`
**Causa:** Token sem permissão, repo privado ou nome incorreto
**Fix:**
- Verificar se `owner` e `repoName` estão corretos (case-sensitive)
- Para repos privados: gerar PAT com scope `repo` (Classic) ou `contents: read` (Fine-grained)
- Testar manualmente: `curl -H "Authorization: Bearer ghp_..." https://api.github.com/repos/OWNER/REPO`

---

### Job fica travado em RUNNING

**Sintoma:** Status nunca muda para COMPLETED ou FAILED
**Causa:** Claude está demorando mais de 120s (repos muito grandes) ou erro silencioso
**Fix:**
- Abrir n8n → Executions → ver o log da execução com problema
- Aumentar o timeout no nó **"Call Claude API"**: parâmetro `timeout` de `120000` para `180000`
- Repos com >1000 arquivos podem ser lentos — o workflow já limita a 120 arquivos fonte

---

### Tabela `Job` não encontrada

**Sintoma:** Nó Supabase retorna `relation "Job" does not exist`
**Causa:** Prisma migration não foi executada
**Fix:** Executar o SQL do [Passo 4](#passo-4--verificar-ou-criar-a-tabela-job-no-supabase) manualmente

---

### Frontend não encontra os webhooks

**Sintoma:** Erro de CORS ou `net::ERR_CONNECTION_REFUSED`
**Causa:** `VITE_N8N_BASE_URL` não configurado ou workflows inativos
**Fix:**
1. Confirmar que `.env` tem `VITE_N8N_BASE_URL=https://...`
2. Confirmar que ambos os workflows estão **ativos** (toggle verde no n8n)
3. Reiniciar `npm run dev` após alterar `.env`

---

## Checklist Final

- [ ] `analyze_repo.json` importado e ativo no n8n
- [ ] `get_status.json` importado e ativo no n8n
- [ ] Credential **"Supabase branchy.io"** criada com `service_role` key
- [ ] Variável **`ANTHROPIC_API_KEY`** criada em Settings → Variables
- [ ] Tabela `Job` existe no Supabase com todas as colunas
- [ ] `VITE_N8N_BASE_URL` adicionado ao `.env`
- [ ] Teste com `curl` retornou `jobId` corretamente
- [ ] Polling retornou `status: COMPLETED` com `analysisResult`
