import { Button } from "@/components/ui/button";
import { Check, TrendingUp, Users, Lock, Shield, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const benefits = [
    {
      icon: Shield,
      title: "Segurança de Nível Bancário",
      description:
        "Seus dados são isolados com criptografia de ponta. Nem mesmo nossa equipe técnica tem acesso às suas transações.",
    },
    {
      icon: Users,
      title: "Delegue sem Medo",
      description:
        "Crie usuários para sua equipe com permissões granulares. Seu funcionário lança contas, mas só VOCÊ vê o saldo.",
    },
    {
      icon: TrendingUp,
      title: "Previsibilidade Total",
      description:
        "Com o módulo de Cash Flow Forecast, saiba hoje se vai faltar dinheiro daqui a 3 meses. Antecipe decisões.",
    },
    {
      icon: Zap,
      title: "Precificação Inteligente",
      description:
        "Pare de chutar preços. Nossa calculadora automática mostra a margem real de cada produto ou serviço.",
    },
  ];

  const plans = [
    {
      name: "MENSAL",
      subtitle: "Para quem prefere diluir o investimento",
      price: "97",
      period: "/ mês",
      features: [
        "Acesso completo ao sistema",
        "Até 3 Usuários",
        "Controle Financeiro",
        "Suporte por E-mail",
      ],
      cta: "ASSINAR MENSAL",
      highlighted: false,
    },
    {
      name: "VITALÍCIO",
      subtitle: "Best-Seller - Economia brutal",
      originalPrice: "2.997,00",
      price: "997",
      installments: "ou 12x de R$ 99,70",
      features: [
        "Acesso VITALÍCIO (Nunca mais pague mensalidade)",
        "Usuários ILIMITADOS",
        "Módulo Avançado de Permissões",
        "Suporte Prioritário (WhatsApp)",
        "Todas as atualizações futuras",
        "Oferta limitada para as próximas 50 contas",
      ],
      cta: "QUERO O PLANO VITALÍCIO",
      highlighted: true,
    },
  ];

  const faqs = [
    {
      q: "O plano vitalício é sério mesmo?",
      a: "Sim. É uma estratégia de lançamento para capitalizar o desenvolvimento. Ao comprar agora, você garante que nunca será cobrado mensalmente no futuro.",
    },
    {
      q: "Preciso instalar algo?",
      a: "Não. O sistema é 100% online (SaaS). Você acessa pelo navegador do seu computador, tablet ou celular, de qualquer lugar.",
    },
    {
      q: "Meus dados estão seguros?",
      a: "Utilizamos a mesma infraestrutura de segurança de grandes fintechs. Além disso, temos Audit Logs que gravam quem fez cada alteração.",
    },
    {
      q: "Como funciona o suporte?",
      a: "No plano mensal, suporte via email em até 24h. No vitalício, você ganha acesso ao nosso canal VIP de atendimento.",
    },
  ];

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-blue-600/10" />
        
        {/* Floating elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                  O Fim das <span className="text-yellow-500">Planilhas</span> Quebradas
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Tenha um Controle Financeiro de Nível Bancário, com Gestão de Equipe Avançada e Previsibilidade Total.
                </p>
              </div>

              <p className="text-lg text-gray-700 dark:text-gray-200">
                Chega de "alugar" software. Adquira o sistema definitivo para organizar seu Fluxo de Caixa, DRE e Precificação. Pague uma única vez e use para sempre.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8"
                  onClick={() => setLocation("/signup")}
                  data-testid="button-cta-hero"
                >
                  GARANTIR ACESSO VITALÍCIO AGORA
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  onClick={() => setLocation("/login")}
                  data-testid="button-login-hero"
                >
                  Já tenho acesso
                </Button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 pt-2">
                ✓ Instalação imediata | ✓ Garantia de 7 dias
              </p>
            </div>

            {/* Right side - Visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl transform rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl transform -rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="space-y-4 w-full px-6 py-8">
                    <div className="h-3 bg-yellow-400 rounded w-3/4" />
                    <div className="h-2 bg-blue-600 rounded w-full" />
                    <div className="h-2 bg-blue-600 rounded w-5/6" />
                    <div className="flex gap-2 mt-6">
                      <div className="flex-1 h-16 bg-yellow-400/20 rounded" />
                      <div className="flex-1 h-16 bg-blue-600/20 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Sua empresa cresceu, mas seu controle financeiro parou no tempo?
          </h2>

          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 text-center">
            Se você ainda depende de planilhas do Excel que travam ou de sistemas caros que cobram por cada usuário adicional, você está perdendo dinheiro.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🙈",
                title: "Cegueira Financeira",
                desc: "Você vende, mas não vê a cor do dinheiro no final do mês?",
              },
              {
                emoji: "😰",
                title: "Medo de Delegar",
                desc: "Você centraliza o financeiro porque tem medo que seus funcionários vejam o lucro?",
              },
              {
                emoji: "⚠️",
                title: "Dados Vulneráveis",
                desc: "O que acontece se seu computador queimar hoje? Adeus histórico?",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-center">
            Tecnologia Enterprise blindada para o seu Negócio
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-16 text-center">
            Conheça os benefícios que vão transformar sua gestão financeira
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 transition-colors bg-white dark:bg-gray-800"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-center">Escolha seu Plano de Liberdade</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-16 text-center">
            Qual caminho você escolhe? Mensal ou Vitalício?
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-8 border-2 transition-all ${
                  plan.highlighted
                    ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-blue-50 dark:from-yellow-900/20 dark:to-blue-900/20 transform lg:scale-105 shadow-xl"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`}
              >
                {plan.highlighted && (
                  <div className="mb-4 inline-block px-4 py-1 bg-yellow-400 text-black text-sm font-bold rounded-full">
                    BEST-SELLER
                  </div>
                )}

                <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.subtitle}</p>

                <div className="mb-6">
                  {plan.originalPrice && (
                    <div className="text-lg text-gray-500 line-through mb-2">
                      De: R$ {plan.originalPrice}
                    </div>
                  )}
                  <div className="text-5xl font-bold mb-2">
                    R$ {plan.price}
                    <span className="text-2xl text-gray-600 dark:text-gray-400">{plan.period}</span>
                  </div>
                  {plan.installments && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{plan.installments}</p>
                  )}
                </div>

                <Button
                  size="lg"
                  className={`w-full mb-8 font-bold text-lg ${
                    plan.highlighted
                      ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() => setLocation(plan.highlighted ? "/signup" : "/login")}
                  data-testid={`button-plan-${plan.name.toLowerCase()}`}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h2 className="text-4xl font-bold mb-6 flex items-center justify-center gap-3">
            <Lock className="w-10 h-10" />
            Risco Zero para Você
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sabemos que trocar de sistema é uma decisão importante. Por isso, oferecemos uma <strong>Garantia Incondicional de 7 Dias</strong>. Entre, cadastre seus dados, teste a gestão de equipe, faça lançamentos.
          </p>
          <p className="text-lg opacity-80">
            Se você achar que o sistema não é para você, devolvemos 100% do seu dinheiro. <strong>Sem perguntas, sem letras miúdas.</strong>
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-16 text-center">Perguntas Frequentes</h2>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-3 text-yellow-600 dark:text-yellow-400">
                  {idx + 1}. {faq.q}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Não deixe a desorganização quebrar sua empresa
          </h2>
          <p className="text-xl text-gray-300">
            O controle que você busca está a um clique de distância
          </p>
          <Button
            size="lg"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-12"
            onClick={() => setLocation("/signup")}
            data-testid="button-cta-final"
          >
            Começar Agora
          </Button>
        </div>
      </section>
    </div>
  );
}
