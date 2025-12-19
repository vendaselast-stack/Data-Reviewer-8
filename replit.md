# FinançasPro - Documentação do Projeto

## 📋 Visão Geral

Sistema de dashboard financeiro em português com interface moderna e responsiva. Exibe KPIs principais, indicadores de desempenho e análises financeiras. Projeto limpo, organizado e pronto para expansão.

**Status**: ✅ Funcional, Otimizado e Reorganizado  
**Data Última Atualização**: 19 de Dezembro de 2025  
**Última Reorganização**: 19 de Dezembro de 2025 (Limpeza Completa)

---

## 🎯 Features Atuais

- ✅ Dashboard principal com KPI cards
- ✅ Indicadores de tendência (positivos/negativos)
- ✅ Cards de análise financeira (Capital, Endividamento, Visibilidade)
- ✅ Resumo financeiro com período customizável
- ✅ Interface responsiva (mobile, tablet, desktop)
- ✅ Dark mode completo
- ✅ Componentes Shadcn UI integrados
- ✅ Design system documentado
- ✅ **Estrutura limpa e sem duplicatas**

---

## 🏗️ Arquitetura Final (Limpa)

### Frontend (React + Vite + TypeScript)
```
client/src/
├── App.tsx                    # Router principal com Wouter
├── main.tsx                   # Entry point
├── index.css                  # Estilos globais (light/dark mode, variáveis CSS)
├── design_guidelines.md       # Documentação de design e cores
├── pages/
│   ├── dashboard.tsx         # Página principal (KPIs, cards, análises)
│   └── not-found.tsx         # Página 404
├── components/
│   ├── app-sidebar.tsx       # Sidebar navigation
│   ├── kpi-card.tsx          # Componente reutilizável de KPI
│   └── ui/                   # Shadcn components (45+ componentes)
├── hooks/
│   ├── use-mobile.tsx        # Responsive helper
│   └── use-toast.ts          # Toast notifications
└── lib/
    ├── queryClient.ts        # TanStack Query config
    └── utils.ts              # Utility functions
```

### Backend (Express + TypeScript)
```
server/
├── index.ts                  # Servidor Express principal
├── routes.ts                 # API routes (pronto para expansão)
├── storage.ts                # Interface de storage genérica
├── db.ts                     # Database config
├── static.ts                 # Static files handler
└── vite.ts                   # Vite middleware
```

### Tipos Compartilhados
```
shared/
└── schema.ts                 # Zod schemas e tipos TypeScript
```

### Public Assets
```
client/public/
└── favicon.png
```

---

## 🎨 Paleta de Cores (Rastreadas)

| Elemento | Hex | HSL | Uso |
|----------|-----|-----|-----|
| **Primary** | #001F47 | 209 95% 15% | Headings, botões primários, texto |
| **Accent/Secondary** | #FFC933 | 39 100% 50% | Destaques, tendências positivas, ações |
| **Destructive** | #FF0000 | 0 100% 50% | Warnings, tendências negativas |
| **Sidebar** | #030303 | 209 95% 1% | Sidebar background |
| **Background** | #FFFFFF | 0 0% 100% | Light mode background |
| **Muted** | - | 210 10% 50-60% | Texto secundário, borders |

**Dark Mode**: Todas as cores são invertidas automaticamente via CSS variables no `.dark` class.

---

## 📝 Limpeza e Reorganização (19/Dez/2025)

### ✅ Problemas Identificados e Resolvidos

**Antes (Caótico):**
- ❌ Dois projetos inteiros rodando em paralelo (`src/` e `client/src/`)
- ❌ Rotas duplicadas (10+ arquivos JSX e TSX diferentes)
- ❌ Configurações duplicadas (`vite.config.ts` + `.js`, `tailwind.config.ts` + `.js`, etc)
- ❌ Componentes UI em 2 locais diferentes
- ❌ 3 documentações confusas
- ❌ Dependências redundantes

**Depois (Limpo):**
- ✅ **UMA ÚNICA estrutura ativa** em `client/src/`
- ✅ **ZERO duplicatas de rotas, componentes ou configs**
- ✅ **Configuração única** (`vite.config.ts`, `tailwind.config.ts`)
- ✅ **Design guidelines centralizados** em `client/src/design_guidelines.md`
- ✅ **Estrutura padrão TypeScript/React**

### 🗑️ Arquivos Removidos

**Pastas deletadas:**
- `src/` (projeto JavaScript antigo com 10+ rotas duplicadas)
- `script/` (scripts obsoletos)

**Configs duplicadas removidas:**
- `vite.config.js` (mantém `vite.config.ts`)
- `tailwind.config.js` (mantém `tailwind.config.ts`)
- `jsconfig.json` (mantém `tsconfig.json`)
- `App.css` (não utilizado)

**Documentação obsoleta removida:**
- `design_guidelines.md` (raiz - mantém `client/src/design_guidelines.md`)
- `index.html` (raiz - mantém `client/index.html`)
- `REFACTORING_PLAN.md` (obsoleto)
- `OPTIMIZATION_REPORT.md` (obsoleto)
- `OBSERVACOES_BUGS_E_FALHAS.md` (obsoleto)

---

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

**Acesso**: `http://localhost:5000`

---

## 📦 Dependências Principais

- **React 18** - Framework UI
- **TailwindCSS** - Styling
- **Shadcn/ui** - 45+ componentes UI prefeitos
- **Lucide React** - Icons
- **Wouter** - Routing lightweight
- **TanStack Query v5** - Data fetching
- **Zod** - Validação de dados
- **Express** - Backend
- **TypeScript** - Type safety
- **Framer Motion** - Animações
- **Recharts** - Gráficos

---

## 📋 Routes Atuais

### Frontend
- `/` → Dashboard (página principal com KPIs)
- `/*` → NotFound (404)

### Backend
- `/api/*` → Pronto para novas rotas

---

## ⚙️ Configurações Importantes

- **Alias @** → `client/src/` (imports de componentes)
- **Alias @shared** → `shared/` (tipos compartilhados)
- **Alias @assets** → `attached_assets/` (imagens e media)
- **Ambiente**: Development (PORT 5000)
- **Framework**: React 18 + TypeScript
- **Routing**: Wouter (lightweight)
- **Dark Mode**: Suportado via CSS classes (`.dark`)
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui

---

## 🔄 Próximos Passos Recomendados

1. **Implementar APIs** quando houver necessidade de dados dinâmicos
2. **Adicionar novas páginas** conforme requisitos
3. **Expandir Storage Interface** para operações específicas
4. **Integrar com banco de dados** quando necessário

---

## 📄 Arquivos de Referência

- `client/src/design_guidelines.md` - Guia completo de design, cores e componentes
- `replit.md` - **Este arquivo** (documentação do projeto)

---

## 🔍 Verificação de Saúde do Projeto (Pós-Limpeza)

```
✅ Compilação: OK
✅ Workflow: Running
✅ Browser Console: Connected
✅ Rotas: Funcionando
✅ Estilos: Aplicados corretamente
✅ Dark mode: Funcional
✅ Responsividade: OK
✅ Zero duplicatas: CONFIRMADO
✅ Estrutura limpa: CONFIRMADO
✅ Cores rastreadas: CONFIRMADO (#001F47, #FFC933, #FF0000)
```

---

**Última verificação**: 19/Dez/2025 - Pós-Limpeza  
**Sistema**: 🟢 **Pronto para expansão - Estrutura limpa e otimizada**
