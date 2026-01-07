import React from 'react';
import { Building2, Eye, Shield, Briefcase, CheckCircle2 } from 'lucide-react';

const TargetAudience: React.FC = () => {
  const audiences = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Empresas em crescimento",
      desc: "Que precisam de estrutura para suportar a expansão de forma sustentável."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Empresários que precisam de visão clara",
      desc: "Para tomar decisões estratégicas com segurança e previsibilidade."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Negócios que buscam governança",
      desc: "Controle de acessos, centralização de dados e processos organizados."
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Empresas que querem profissionalizar o financeiro",
      desc: "Transformando o setor de operacional para estratégico."
    }
  ];

  const managementBenefits = [
    "Mais controle e previsibilidade",
    "Redução de riscos financeiros",
    "Decisões mais rápidas e embasadas",
    "Organização e governança",
    "Suporte ao crescimento sustentável"
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-slate-50 border-y border-slate-100" id="publico">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-blue-600 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3">PARA QUEM É O HUACONTROL</h2>
          <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            O financeiro deixa de ser operacional e passa a ser <span className="text-blue-600">estratégico.</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {audiences.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
              <p className="text-slate-600 leading-relaxed text-sm font-normal">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-lg">
          <div className="text-center mb-10">
            <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 uppercase tracking-tight">Benefícios para a Gestão</h4>
            <p className="text-slate-600 font-normal">Resultados reais para quem precisa decidir com segurança.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {managementBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-slate-700 text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
