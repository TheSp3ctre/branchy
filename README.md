<div align="center">

<img src="https://i.imgur.com/d2964li.png" alt="branchy." width="220" />

<br/>
<br/>

**Transforme repositórios GitHub em mapas de arquitetura, grafos de dependências e guias de onboarding — em menos de 60 segundos.**

<br/>

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel)](https://branchy.io)
[![Stack](https://img.shields.io/badge/stack-react%20%2B%20typescript-blue?style=flat-square&logo=react)](/)
[![AI](https://img.shields.io/badge/AI-claude%20%2B%20gemini-orange?style=flat-square)](/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](/)

</div>

---

## O que é o Branchy?

**Branchy** é uma plataforma de inteligência de repositórios que une IA, análise estática de código e visualização interativa para dar às equipes de desenvolvimento uma visão completa e em tempo real de seus projetos no GitHub.

Do código ao insight — sem fricção.

---

---

## 🎯 O Problema

Repositórios crescem. A clareza não — na mesma velocidade.

Desenvolvedores perdem horas entendendo código legado. Times novos ficam semanas sem saber onde mexer. Dependências críticas ficam invisíveis até quebrarem em produção. Documentação desatualiza sozinha.

**O Branchy resolve isso.**

---

## ✨ O que o Branchy faz

| Feature | Descrição |
|---|---|
| 🗺️ **Architecture Map** | Mapa visual da arquitetura gerado por IA com Claude, baseado na estrutura real do código |
| 📦 **Dependency Graph** | Grafo interativo de dependências com alertas de vulnerabilidades (CVE) e pacotes desatualizados |
| 📋 **Onboarding Guide** | README avançado gerado por IA — adaptável por persona (Dev, Stakeholder, Auditor) — exportável em PDF |
| 💚 **Code Health** | Score de saúde do código (0–100) com 5 dimensões: segurança, arquitetura, manutenibilidade, testes e documentação |
| 🪲 **Dead Code** | Detecção automática de código morto, exports não usados, dependências circulares e complexidade excessiva |
| 📜 **Changelog** | Feed de commits do GitHub com análise de tipo (feat/fix/refactor) e resumo por IA |
| 📤 **Export** | Exportação de todos os artefatos em PNG, SVG, PDF e Markdown |
| 🔌 **Integrações** | Conecte Slack, Jira e Notion para receber alertas e criar tickets automaticamente |

---

## 🧠 Valores do Produto

**Clareza antes da complexidade**
Código complexo precisa de clareza. O Branchy torna visível o que estava fragmentado ou implícito.

**IA como ferramenta, não como mágica**
A IA do Branchy gera contexto útil e acionável — não apenas texto genérico.

**Tempo do desenvolvedor é sagrado**
Cada feature foi desenhada para reduzir o tempo gasto em descoberta e aumentar o tempo em entrega.

**Rastreabilidade e transparência**
Do código fonte ao score de saúde — cada insight tem uma fonte verificável.

---

## 🔄 Como o Branchy funciona

```
1. Conecte seu repositório GitHub
         │
         ▼
2. O Branchy analisa toda a estrutura via IA (Claude + Gemini)
         │
         ├──► Gera Architecture Map (Mermaid)
         ├──► Detecta dependências e vulnerabilidades
         ├──► Calcula Code Health Score
         ├──► Identifica Dead Code
         └──► Gera Onboarding Guide personalizado
         │
         ▼
3. Visualize tudo em uma interface unificada
         │
         ▼
4. Mantenha-se atualizado automaticamente
   (a cada commit, o pipeline roda de novo)
```

---

## 🛠️ Tecnologias

### Frontend
- **React 18** com **Vite** e **TypeScript**
- **Tailwind CSS** + **shadcn/ui** para interface
- **React Router v6** para navegação
- **Zustand** para gerenciamento de estado
- **React Flow** para grafos interativos
- **Recharts** para visualizações de dados
- **Mermaid.js** para diagramas de arquitetura

### Backend & Infraestrutura
- **Supabase** — banco de dados PostgreSQL, autenticação e Realtime
- **Supabase Edge Functions** (Deno) — lógica serverless
- **Prisma ORM** — modelagem do banco de dados

### Integrações
- **GitHub API** — commits, repositórios, webhooks
- **Slack API** — notificações de alertas
- **Jira API** — criação automática de issues
- **Notion API** — publicação de documentação

---

## 🚀 Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/TheSp3ctre/branchyio-main
cd branchyio-main

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais (Supabase, GitHub, Claude API, N8n)

# 4. Inicie o servidor de desenvolvimento
npm run dev
```


## 📁 Estrutura do Projeto

```
src/
  ├── components/        # Componentes React reutilizáveis
  │   └── layout/        # Topbar, Sidebar, AppLayout, RepoLayout
  ├── pages/             # Páginas da aplicação
  │   ├── app/           # Dashboard, repo views, settings
  │   └── Login.tsx      # Autenticação GitHub OAuth
  ├── services/          # Camada de serviços (Supabase, N8n)
  ├── store/             # Estado global (Zustand)
  ├── hooks/             # Custom hooks React
  ├── types/             # TypeScript types e interfaces
  └── config/            # Configurações (webhooks, constants)

prisma/                  # Schema do banco de dados
```

---


## 📄 Licença

MIT © Branchy.io

---

<div align="center">

**branchy<span>.</span>** — *Do código ao insight, sem fricção.*

</div>
