import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Check, Lock, Loader } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

const PLANS = {
  basic: {
    name: 'Basic',
    price: 99,
    currency: 'BRL',
    description: 'Perfeito para pequenas empresas',
    features: ['Até 100 clientes', 'Gestão básica de vendas', 'Relatórios simples', 'Suporte por email', '5GB de armazenamento']
  },
  pro: {
    name: 'Pro',
    price: 299,
    currency: 'BRL',
    description: 'Para empresas em crescimento',
    features: ['Até 500 clientes', 'Gestão avançada com IA', 'Relatórios inteligentes', 'Suporte prioritário', '100GB de armazenamento', 'Múltiplos usuários', 'Integração com banco']
  },
  enterprise: {
    name: 'Enterprise',
    price: 0,
    currency: 'BRL',
    description: 'Para grandes corporações',
    features: ['Clientes ilimitados', 'Customizável 100%', 'Analytics avançado', 'Suporte 24/7', 'Armazenamento ilimitado', 'Usuários ilimitados', 'APIs personalizadas', 'SLA garantido'],
    contact: true
  }
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const paymentBricksContainerRef = useRef(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const [bricksReady, setBricksReady] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [initializingPayment, setInitializingPayment] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    if (plan && PLANS[plan]) {
      setSelectedPlan(plan);
    } else {
      setSelectedPlan('pro');
    }
  }, []);

  // Pré-preencher dados do Signup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const company = params.get('company');
    
    if (email) setFormData(prev => ({ ...prev, email }));
    if (company) setFormData(prev => ({ ...prev, companyName: company }));
  }, []);

  // Inicializar Payment Brick quando plano é selecionado
  useEffect(() => {
    if (!selectedPlan || selectedPlan === 'enterprise' || preferenceId) return;

    const initPaymentBrick = async () => {
      try {
        setInitializingPayment(true);

        // Step 1: Criar preferência no backend
        const response = await fetch('/api/payment/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan: selectedPlan,
            amount: PLANS[selectedPlan].price,
            companyName: formData.companyName || 'Customer',
            email: formData.email || 'customer@example.com',
            phone: formData.phone,
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao inicializar pagamento');
        }

        const data = await response.json();
        if (data.preferenceId) {
          setPreferenceId(data.preferenceId);
        }
      } catch (error) {
        console.error('Payment Brick init error:', error);
        toast.error('Erro ao carregar formulário de pagamento');
      } finally {
        setInitializingPayment(false);
      }
    };

    initPaymentBrick();
  }, [selectedPlan, formData.companyName, formData.email]);

  // Renderizar Payment Brick quando preferenceId está pronto
  useEffect(() => {
    if (!preferenceId || !paymentBricksContainerRef.current || bricksReady) return;

    const renderPaymentBrick = async () => {
      try {
        if (!window.MercadoPago) {
          console.error('Mercado Pago SDK não carregado');
          return;
        }

        const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
        if (!publicKey) {
          toast.error('Chave pública do Mercado Pago não configurada');
          return;
        }

        window.MercadoPago.setPublishableKey(publicKey);

        const bricks = window.MercadoPago.Bricks();
        
        await bricks.create('payment', {
          initialization: {
            amount: PLANS[selectedPlan].price,
            preferenceId: preferenceId,
          },
          callbacks: {
            onReady: () => {
              console.log('Payment Brick pronto');
              setBricksReady(true);
            },
            onSubmit: async (formData) => {
              console.log('Payment Brick submitted:', formData);
              return new Promise((resolve) => {
                // O pagamento foi submetido
                setTimeout(() => {
                  resolve();
                }, 100);
              });
            },
            onError: (error) => {
              console.error('Payment Brick error:', error);
              toast.error('Erro ao processar pagamento: ' + (error?.message || 'Desconhecido'));
            },
            onFetching: (resource) => {
              console.log('Fetching resource:', resource);
            },
          },
          customization: {
            visual: {
              style: {
                theme: 'dark',
              },
            },
          },
        });
      } catch (error) {
        console.error('Error rendering Payment Brick:', error);
        toast.error('Erro ao carregar formulário de pagamento');
      }
    };

    renderPaymentBrick();
  }, [preferenceId, selectedPlan, bricksReady]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentBrickSubmit = async () => {
    if (!selectedPlan) {
      toast.error('Selecione um plano');
      return;
    }

    if (PLANS[selectedPlan].contact) {
      toast.info('Entre em contato conosco para planos Enterprise');
      window.location.href = 'mailto:vendas@hua.com';
      return;
    }

    // O Payment Brick cuidará do submit
    try {
      const submitButton = document.querySelector('[data-testid="brick-submit"]');
      if (submitButton) {
        submitButton.click();
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento');
    }
  };

  if (!selectedPlan) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const plan = PLANS[selectedPlan];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">HUA Analytics</h1>
          <Button 
            variant="outline"
            onClick={() => setLocation('/')}
            data-testid="button-checkout-cancel"
          >
            Cancelar
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <button 
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition"
          data-testid="button-checkout-back"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur sticky top-24 p-6">
              <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>

              {/* Card do Plano */}
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-4 mb-6 border border-slate-600/50">
                <p className="text-slate-400 text-sm mb-1">Plano Selecionado</p>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                
                {!plan.contact && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-400 mb-2">Valor mensal</p>
                    <p className="text-3xl font-bold text-blue-400">{formatCurrency(plan.price)}</p>
                  </div>
                )}

                <Button 
                  variant="outline"
                  onClick={() => setLocation('/#pricing')}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  data-testid="button-change-plan-checkout"
                >
                  Mudar Plano
                </Button>
              </div>

              {/* Características */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-300 mb-3">Incluso neste plano:</p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Segurança */}
              <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center gap-2 text-xs text-slate-400">
                <Lock className="w-4 h-4" />
                Pagamento 100% seguro
              </div>
            </Card>
          </div>

          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur p-8">
              <h2 className="text-2xl font-bold mb-8">Informações de Pagamento</h2>

              {plan.contact ? (
                <div className="text-center py-12">
                  <p className="text-lg text-slate-300 mb-4">
                    Planos Enterprise são customizados para sua empresa.
                  </p>
                  <p className="text-slate-400 mb-6">
                    Entre em contato com nossa equipe de vendas para discutir suas necessidades.
                  </p>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => window.location.href = 'mailto:vendas@hua.com'}
                    data-testid="button-contact-sales"
                  >
                    Contatar Vendas
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Dados da Empresa */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Dados da Empresa</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Empresa *</label>
                        <Input 
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Nome da sua empresa"
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                          required
                          disabled={loading}
                          data-testid="input-company-name-checkout"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Email *</label>
                          <Input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="seu@email.com"
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                            required
                            disabled={loading}
                            data-testid="input-email-checkout"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Telefone</label>
                          <Input 
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(11) 99999-9999"
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                            disabled={loading}
                            data-testid="input-phone-checkout"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Brick Container */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Método de Pagamento</h3>
                    
                    {initializingPayment ? (
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 text-center">
                        <Loader className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Carregando formulário de pagamento...</p>
                      </div>
                    ) : (
                      <>
                        <div 
                          ref={paymentBricksContainerRef}
                          id="paymentBricksContainer"
                          className="mb-4 bg-slate-900/50 rounded-lg p-4 border border-slate-700/50"
                        >
                          {!bricksReady && (
                            <div className="text-center py-12 text-slate-400">
                              <Loader className="w-6 h-6 animate-spin mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Inicializando Payment Brick...</p>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-500">
                          Formulário de pagamento seguro do Mercado Pago. Aceita: Cartão de Crédito, Débito, Pix e Transferência.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Termos */}
                  <div className="pt-4 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-6">
                      Ao clicar em "Pagar", você concorda com nossos termos de serviço e a renovação automática da assinatura.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
                      <button 
                        type="button"
                        id="paymentBricksSubmit"
                        data-testid="brick-submit"
                        className="hidden"
                      />
                      <Button
                        onClick={handlePaymentBrickSubmit}
                        disabled={initializingPayment || !bricksReady}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 text-lg rounded-lg disabled:opacity-50"
                        data-testid="button-pay-checkout"
                      >
                        {initializingPayment ? 'Carregando...' : `Pagar ${formatCurrency(plan.price)}/mês`}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
