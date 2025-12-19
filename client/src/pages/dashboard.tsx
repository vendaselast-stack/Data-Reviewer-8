import { KPICard } from "@/components/kpi-card";
import { DollarSign, TrendingUp, CreditCard, Activity, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-dashboard">Visão completa do seu negócio</h1>
          <p className="mt-2 text-muted-foreground" data-testid="subheading-dashboard">Acompanhe os principais indicadores de desempenho do seu negócio</p>
        </div>

        {/* KPI Cards Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            label="Receita (3 meses)"
            value="R$ 4.300,00"
            icon={<DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            iconBgColor="bg-blue-50 dark:bg-blue-950"
            trend={{
              value: "+12%",
              isPositive: true,
              period: "vs período anterior",
            }}
          />

          <KPICard
            label="Despesas (3 meses)"
            value="R$ 850,00"
            icon={<CreditCard className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
            iconBgColor="bg-orange-50 dark:bg-orange-950"
            trend={{
              value: "-5%",
              isPositive: true,
              period: "vs período anterior",
            }}
          />

          <KPICard
            label="Lucro Líquido"
            value="R$ 3.450,00"
            icon={<TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />}
            iconBgColor="bg-green-50 dark:bg-green-950"
          />

          <KPICard
            label="Saúde Financeira"
            value="Saudável"
            icon={<Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
            iconBgColor="bg-emerald-50 dark:bg-emerald-950"
          />
        </div>

        {/* Additional Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover-elevate" data-testid="card-capital-de-giro">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Capital de Giro</CardTitle>
              <CardDescription>Disponibilidade de caixa</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ 1.800,00</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Fundos disponíveis para operações
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-endividamento">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Endividamento</CardTitle>
              <CardDescription>Índice de dívida</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ 200,00</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Débitos pendentes
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-visibilidade">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Visibilidade</CardTitle>
              <CardDescription>Análise de transparência</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium">Completa</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Todos os dados visíveis
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <Card className="mt-8 hover-elevate" data-testid="card-summary">
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>Análise dos últimos 3 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="mt-2 text-2xl font-bold">R$ 4.300,00</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Despesa Total</p>
                <p className="mt-2 text-2xl font-bold">R$ 850,00</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margem Líquida</p>
                <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-500">80,2%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fluxo de Caixa</p>
                <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-500">Positivo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
