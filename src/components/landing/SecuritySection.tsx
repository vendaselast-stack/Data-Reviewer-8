import React from 'react';
import { Lock, Users, Database, Server } from 'lucide-react';

const SecuritySection: React.FC = () => {
  const features = [
    {
      icon: <Server className="w-6 h-6" />,
      title: "Ambiente corporativo",
      desc: "Infraestrutura robusta e confiável para operações críticas."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Controle de acessos",
      desc: "Permissões granulares por usuário e função."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Centralização de dados",
      desc: "Todas as informações em um único ambiente seguro."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Estrutura robusta",
      desc: "Arquitetura preparada para crescer com sua empresa."
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-white" id="seguranca">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {feature.icon}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-slate-500 text-xs font-normal leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-blue-600 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3">SEGURANÇA E CONFIANÇA</h2>
            <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Decisões importantes exigem <span className="text-blue-600">informações seguras.</span>
            </h3>
            <p className="text-base md:text-lg text-slate-600 mb-6 leading-relaxed font-normal">
              O HUACONTROL foi desenvolvido com foco em ambiente corporativo, controle de acessos, centralização de dados e estrutura robusta e confiável.
            </p>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal">
              Porque quando o assunto é o futuro da sua empresa, você precisa de uma plataforma que entrega segurança em cada decisão.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
