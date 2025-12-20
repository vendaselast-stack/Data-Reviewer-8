# Base44 Dashboard - Documentação do Projeto

## 📋 Visão Geral

Sistema de dashboard financeiro completo com interface moderna, dark mode e componentes Shadcn UI. Integrado com API Base44 e IA Gemini para análises preditivas.

**Status**: ✅ Atualizado com Novos Commits  
**Data Última Atualização**: 20 de Dezembro de 2025
**Commits Recentes**: Padronização de cores azul e formatação brasileira

---

## 🏗️ Arquitetura

### Estrutura do Projeto
```
.
├── src/                          # Código principal (React + JavaScript)
│   ├── App.jsx                  # Componente raiz
│   ├── main.jsx                 # Entry point
│   ├── index.css                # Estilos globais
│   ├── api/                     # Clientes API
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes Shadcn
│   │   ├── dashboard/           # Dashboard components
│   │   ├── customers/           # Customer management
│   │   ├── pricing/             # Pricing analysis
│   │   ├── reports/             # Report components
│   │   ├── suppliers/           # Supplier management
│   │   └── transactions/        # Transaction management
│   ├── hooks/                   # Hooks customizados
│   ├── lib/                     # Utilidades
│   ├── pages/                   # Páginas
│   └── utils/                   # Funções utilitárias
│
├── client/                      # Cliente estático
│   ├── index.html               # HTML principal
│   └── public/                  # Assets estáticos
│
├── server/                      # Backend Express (opcional)
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── ...
│
├── shared/                      # Tipos compartilhados
│   └── schema.ts
│
├── attached_assets/             # Assets do usuário
│
└── [Configurações]
    ├── vite.config.js           # Configuração Vite
    ├── tailwind.config.js       # Configuração Tailwind
    ├── tsconfig.json            # Configuração TypeScript
    ├── package.json             # Dependências
    └── replit.md                # Este arquivo
```

---

## 🎯 Features Atuais

### Dashboard
- ✅ KPI cards com indicadores de tendência
- ✅ Gráfico de receita em tempo real
- ✅ Indicadores de desempenho financeiro
- ✅ Widgets de ações rápidas (FAB)
- ✅ Filtro de data customizável
- ✅ Botão "Nova Transação" com modal integrado

### Gestão de Transações
- ✅ Registro e rastreamento de transações com categorias
- ✅ Categorização com tipos (Entrada/Saída)
- ✅ Valores automáticos (negativo para despesa, positivo para receita)
- ✅ Criação de categorias dentro do formulário
- ✅ Edição e deleção de transações
- ✅ Filtro por categoria, tipo e período
- ✅ Paginação e busca avançada
- ✅ Modal de importação de extrato bancário

### Gestão de Categorias
- ✅ Página dedicada para gerenciar categorias
- ✅ Configuração de tipo (Entrada/Saída) com badges coloridas
- ✅ Criar, editar e deletar categorias
- ✅ Validação de nome e tipo

### Gestão de Clientes e Fornecedores
- ✅ Gerenciamento de clientes com histórico de vendas
- ✅ Gerenciamento de fornecedores com histórico de compras

### Relatórios Avançados
- ✅ Análise DRE (Demonstração de Resultado)
- ✅ Análise de Fluxo de Caixa e Previsões
- ✅ Análise de Despesas e Crescimento de Receita
- ✅ Análise de Dívidas e Capital de Giro
- ✅ Simulador What-If e Resumo Executivo

### Interface & Experiência
- ✅ Dark mode completo com persistência
- ✅ Componentes Shadcn UI premium
- ✅ Ícones Lucide React
- ✅ Animações Framer Motion
- ✅ Gráficos Recharts interativos
- ✅ Layout responsivo
- ✅ Integração API Base44
- ✅ Análise preditiva com Gemini AI

### Localização & Formatação
- ✅ Moeda brasileira (R$) com formatação correta
- ✅ Fuso horário São Paulo integrado
- ✅ Remoção de símbolos desnecessários ($)
- ✅ Paleta de cores azul consistente

---

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (Vite)
npm run dev

# Build para produção
npm run build
```

Acesso: `http://localhost:5000`

---

## 📦 Dependências Principais

- **React 18** - Framework UI
- **TailwindCSS** - Styling
- **Shadcn/ui** - Componentes prontos
- **Lucide React** - Icons
- **Framer Motion** - Animações
- **Recharts** - Gráficos
- **Date-fns** - Manipulação de datas
- **Zod** - Validação

---

## 🔄 Estrutura de Componentes

### Hierarquia de Pastas
```
src/components/
├── ui/                          # Componentes base (Shadcn)
├── dashboard/                   # Dashboard específico
├── customers/                   # Gestão de clientes
├── pricing/                     # Análise de preços
├── reports/                     # Relatórios
├── suppliers/                   # Gestão de fornecedores
└── transactions/                # Gestão de transações
```

---

## 📝 Atualizações Recentes (20/Dez/2025)

### 🎯 Sistema de Categorias e Transações - IMPLEMENTADO
**Data**: 20 de Dezembro de 2025

#### Funcionalidades Principais
1. **Página de Categorias Completa**
   - ✅ Nova página em `src/pages/Categories.jsx`
   - ✅ Tabela de categorias com coluna "Tipo" (Entrada/Saída)
   - ✅ Badges coloridas: 🟢 Verde para Entrada, 🔴 Vermelho para Saída
   - ✅ Modal de criar/editar categorias com seleção de tipo
   - ✅ Validação e mensagens de sucesso/erro

2. **Categorização de Transações**
   - ✅ Cada categoria tem tipo definido: "entrada" ou "saida"
   - ✅ Automaticamente determina se é receita (+) ou despesa (-)
   - ✅ Valores negativos para despesas, positivos para receitas
   - ✅ Edição de transações com amount absoluto

3. **Modal de Nova Categoria**
   - ✅ Componente dedicado: `src/components/transactions/CreateCategoryModal.jsx`
   - ✅ Criação de categoria sem sair do formulário de transação
   - ✅ Seleção de tipo com radio buttons e cores visuais
   - ✅ Auto-seleção da categoria após criação

4. **Formulário de Transação Melhorado**
   - ✅ Tipo (Receita/Despesa) agora é automático via categoria
   - ✅ Campo tipo exibido como badge (não editável, apenas informativo)
   - ✅ Data e Status lado a lado (grid 2 colunas)
   - ✅ Suporta edição de transações existentes

#### Arquivos Criados/Modificados
- **Criado**: `src/components/transactions/CreateCategoryModal.jsx` (novo componente)
- **Modificado**: `src/pages/Categories.jsx` (adicionado tipo com badges)
- **Modificado**: `src/components/transactions/TransactionForm.jsx` (integração categoria/tipo)

#### Commits Associados
```
3bf271a - Arrange transaction date and status fields side by side
90d15b5 - Update category badges to use green for income and red for expenses
5282f35 - Update categories page to include income and expense types
a0505e1 - Add ability to categorize income and expenses on a dedicated page
b7ea275 - Add a separate modal for creating new categories within transactions
8669a63 - Make transaction amounts reflect category type automatically
```

#### Fluxo de Uso
1. Acesse "Categorias" → Crie/edite categorias definindo tipo
2. Crie transação → Selecione categoria → Tipo aparece automático
3. Salve → Valor é negativo (despesa) ou positivo (receita) conforme tipo

### Anterior (19/Dez/2025) - Limpeza Realizada
- ✅ Removidos configs duplicados (vite.config.js único)
- ✅ Removidos arquivos obsoletos
- ✅ Estrutura padronizada em src/
- ✅ Aliases corrigidos (@, @assets, @shared)

---

## ⚙️ Configurações Importantes

- **Alias @** → `src/` (imports de código)
- **Alias @assets** → `attached_assets/` (media)
- **Alias @shared** → `shared/` (tipos compartilhados)
- **Servidor**: Vite em PORT 5000
- **Dark Mode**: Suportado

---

## 🎨 Paleta de Cores

Gerenciada via Tailwind CSS com variáveis CSS customizadas em `src/index.css`

---

**Última atualização**: 20/Dez/2025 (14h30)  
**Sistema**: 🟢 Pronto para desenvolvimento  
**Status do Sistema de Transações**: ✅ Completo e Funcional
