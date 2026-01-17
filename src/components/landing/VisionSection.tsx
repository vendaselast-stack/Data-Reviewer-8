import React from 'react';
import { Brain, Target, TrendingUp } from 'lucide-react';

const VisionSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-white" id="visao">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-blue-600 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3">VISÃO CLARA PARA QUEM DECIDE</h2>
            <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Mais do que um ERP, uma camada de <span className="text-blue-600">inteligência financeira.</span>
            </h3>
            <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed font-normal">
              O HUACONTROL foi desenvolvido para atender empresas que precisam governar o financeiro com precisão, indo além do simples registro de dados.
            </p>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal">
              A plataforma centraliza a gestão financeira e utiliza inteligência artificial para transformar informações em análises estratégicas, apoiando gestores, diretores e CFOs na tomada de decisão.
            </p>
          </div>
          
          <div className="grid gap-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Inteligência Artificial</h4>
                <p className="text-slate-600 text-sm font-normal leading-relaxed">Transforma dados em análises estratégicas de forma objetiva e aplicada à realidade do negócio.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Visão Estratégica</h4>
                <p className="text-slate-600 text-sm font-normal leading-relaxed">Conecta dados, análises e decisões em um único ambiente centralizado.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Gestão Estruturada</h4>
                <p className="text-slate-600 text-sm font-normal leading-relaxed">Visão clara do presente e do futuro da empresa para decisões seguras.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
