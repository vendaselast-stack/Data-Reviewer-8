# 🗄️ Database Reset Scripts - Guia Completo

## Problema Corrigido ✅

Os scripts anteriores tinham 3 problemas principais:

1. **❌ Não deletavam TODAS as tabelas** → Agora deletam as 16 tabelas na ordem correta
2. **❌ Não criavam usuários com companyId** → Agora todos os usuários recebem `companyId`
3. **❌ Sessões eram criadas mas não funcionavam para login** → Agora as sessões estão funcionando

## Scripts Disponíveis

### 1️⃣ `reset-db.ts` - Reset Rápido (Recomendado para Testes)

```bash
npx tsx server/reset-db.ts
```

**O que faz:**
- ✅ Deleta TODAS as 16 tabelas em ordem correta de dependências
- ✅ Cria 1 empresa padrão (HUA Consultoria)
- ✅ Cria 1 Super Admin com companyId
- ✅ Cria sessão automaticamente
- ⏱️ Execução: ~3 segundos

**Credenciais de Login:**
```
Usuário: admin
Senha: senha123456
Email: admin@example.com
Tipo: Super Admin
```

---

### 2️⃣ `reset-db-improved.ts` - Reset Completo (Recomendado para Desenvolvimento)

```bash
npx tsx server/reset-db-improved.ts
```

**O que faz:**
- ✅ Deleta TODAS as 16 tabelas em ordem correta
- ✅ Cria 1 empresa padrão (HUA Consultoria)
- ✅ Cria 3 usuários com companyId:
  - **Super Admin** → Acesso ao painel de admin
  - **Admin da Empresa** → Acesso ao sistema principal
  - **Gerente** → Acesso com permissões restritas
- ✅ Cria 5 categorias padrão (Vendas, Compras, Devolução, Ajuste, Pagamento)
- ✅ Cria sessões para todos os usuários
- ⏱️ Execução: ~5 segundos

**Credenciais de Login:**

```
SUPER ADMIN (Painel de Admin):
  Usuário: superadmin
  Senha: senha123456
  Email: superadmin@huaconsultoria.com

ADMIN DA EMPRESA (Sistema Principal):
  Usuário: admin
  Senha: senha123456
  Email: admin@huaconsultoria.com

GERENTE (Acesso Limitado):
  Usuário: gerente
  Senha: senha123456
  Email: gerente@huaconsultoria.com
```

---

### 3️⃣ `reset-all-tables.ts` - Reset Legado (Compatibilidade)

```bash
npx tsx server/reset-all-tables.ts
```

**Equivalente a `reset-db.ts`** mas com mais detalhes visuais. Use se preferir.

---

## Tabelas Deletadas (Ordem Correta)

Os scripts deletam as seguintes 16 tabelas em ordem de dependência:

1. `login_attempts` (sem dependências)
2. `audit_logs` (sem dependências)
3. `sessions` (depende de users)
4. `invitations` (depende de companies e users)
5. `installments` (depende de sales)
6. `purchase_installments` (depende de purchases)
7. `purchases` (depende de suppliers e companies)
8. `sales` (depende de customers e companies)
9. `transactions` (depende de categories e companies)
10. `cash_flow` (depende de companies)
11. `categories` (depende de companies)
12. `customers` (depende de companies)
13. `suppliers` (depende de companies)
14. `subscriptions` (depende de companies)
15. `users` (depende de companies)
16. `companies` (tabela raiz)

---

## ✨ Principais Melhorias

### Antes ❌
- Scripts não listavam todas as tabelas
- Usuários criados SEM companyId
- Erros ao fazer login pós-reset
- Sem categorias padrão

### Depois ✅
- ✅ Deleta TODAS as 16 tabelas explicitamente
- ✅ Todos os usuários têm companyId válido
- ✅ Login funciona imediatamente após reset
- ✅ Categorias padrão criadas automaticamente
- ✅ Múltiplos usuários com permissões diferentes
- ✅ Tratamento de erros melhorado

---

## Como Usar

### Para Testes Rápidos:
```bash
npx tsx server/reset-db.ts
```

### Para Desenvolvimento Completo:
```bash
npx tsx server/reset-db-improved.ts
```

### Verificar Resultado:
1. Abra o app em http://localhost:5000
2. Faça login com as credenciais fornecidas
3. Verifique se as tabelas foram limpas
4. Verifique se as categorias padrão existem

---

## Troubleshooting

### ❌ "Erro ao conectar ao banco"
- Certifique-se que o banco PostgreSQL está rodando
- Verifique as variáveis de ambiente `DATABASE_URL`

### ❌ "Erro de foreign key"
- Os scripts já tratam a ordem correta de deleção
- Se ainda falhar, verifique se há dados fora do padrão

### ❌ "Usuário não consegue fazer login"
- Execute `reset-db-improved.ts` ao invés do `reset-db.ts`
- Verifique se a sessão foi criada corretamente
- Verifique se o usuário tem `companyId` válido

---

## Dados Criados Automaticamente

Após qualquer reset, você terá:

- **1 Empresa**: HUA Consultoria (ID gerado)
- **1-3 Usuários**: Super Admin e/ou Admin (dependendo do script)
- **5 Categorias**: Vendas, Compras, Devolução, Ajuste, Pagamento
- **1 Assinatura**: Status "active" para a empresa
- **Sessões**: Uma para cada usuário criado
