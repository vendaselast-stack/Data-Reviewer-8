import { InvokeLLM } from '@/api/integrations';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export default function DREAnalysis({ transactions = [], categories = [] }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    vendaBruta: false,
    custos: false,
    despesas: false
  });

  const dreData = useMemo(() => {
    const txList = Array.isArray(transactions) ? transactions : [];
    
    const vendas = txList.filter(t => t.type === 'venda' || t.type === 'income');
    const compras = txList.filter(t => t.type === 'compra' || t.type === 'expense');

    const vendaBruta = vendas.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0);
    const custosDiretos = compras.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0);
    
    const receitaLiquida = vendaBruta - custosDiretos;
    const despesasOp = custosDiretos * 0.15;
    const lucroOp = receitaLiquida - despesasOp;
    const marginLiquida = vendaBruta > 0 ? (lucroOp / vendaBruta) * 100 : 0;

    // Agrupar por forma de pagamento
    const pagamentos = {};
    vendas.forEach(v => {
      const metodo = v.paymentMethod || 'Outros';
      if (!pagamentos[metodo]) {
        pagamentos[metodo] = { entradas: 0, saidas: 0 };
      }
      pagamentos[metodo].entradas += Math.abs(parseFloat(v.amount || 0));
    });

    return {
      vendaBruta,
      custosDiretos,
      receitaLiquida,
      despesasOp,
      lucroOp,
      marginLiquida,
      pagamentos,
      vendaCount: vendas.length,
      compraCount: compras.length
    };
  }, [transactions]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleGenerateForecast = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Análise rápida desta DRE:
      Receita Bruta: R$ ${dreData.vendaBruta.toFixed(2)}
      Custos Diretos: R$ ${dreData.custosDiretos.toFixed(2)}
      Receita Líquida: R$ ${dreData.receitaLiquida.toFixed(2)}
      Despesas Operacionais: R$ ${dreData.despesasOp.toFixed(2)}
      Lucro Operacional: R$ ${dreData.lucroOp.toFixed(2)} (${dreData.marginLiquida.toFixed(2)}%)
      
      Resumo em 1-2 linhas e 1 insight`;

      const response = await InvokeLLM(prompt);
      setForecast(response);
      toast.success('Análise gerada!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao gerar análise');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const DRERow = ({ label, value, indent = 0, isExpanded = false, isExpandable = false, onToggle = null, type = 'normal', showSymbol = null }) => {
    const bgColor = 
      type === 'receita-liquida' ? 'bg-blue-50' :
      type === 'lucro-op' ? 'bg-pink-50' :
      type === 'expandable' ? 'bg-green-50' :
      '';

    const textColor = 
      type === 'lucro-op' ? 'text-green-600' :
      '';

    return (
      <div 
        className={`flex items-center justify-between px-6 py-3 border-b border-slate-100 ${bgColor} ${isExpandable ? 'cursor-pointer hover-elevate' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {isExpandable && (
            <ChevronDown 
              className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
            />
          )}
          {!isExpandable && isExpandable === false && <div className="w-4" />}
          <span style={{ marginLeft: `${indent * 20}px` }} className="font-medium text-slate-700">
            {showSymbol && <span className="text-slate-500 mr-1">{showSymbol}</span>}
            {label}
          </span>
        </div>
        <span className={`font-bold text-right ${textColor} ${type === 'lucro-op' ? 'text-lg' : ''}`}>
          {type === 'lucro-op' ? '+ ' : ''}R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            <div>
              <CardTitle className="text-xl">DRE - Demonstração do Resultado do Exercício</CardTitle>
              <p className="text-sm text-slate-500">Análise detalhada do desempenho financeiro</p>
            </div>
          </div>
          <Button onClick={handleGenerateForecast} disabled={isAnalyzing} className="bg-blue-600 hover:bg-blue-700">
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Previsão
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-0">
        {/* Receita Bruta */}
        <DRERow
          label="Receita Bruta"
          value={dreData.vendaBruta}
          isExpandable={true}
          isExpanded={expandedSections.vendaBruta}
          onToggle={() => toggleSection('vendaBruta')}
          type="expandable"
          showSymbol=">"
        />

        {/* Custos Diretos */}
        <DRERow
          label="(-) Custos Diretos"
          value={dreData.custosDiretos}
          isExpandable={true}
          isExpanded={expandedSections.custos}
          onToggle={() => toggleSection('custos')}
          showSymbol=">"
        />

        {/* Receita Líquida */}
        <DRERow
          label="= Receita Líquida"
          value={dreData.receitaLiquida}
          type="receita-liquida"
          showSymbol="="
        />

        {/* Despesas Operacionais - Header */}
        <div className="flex items-center px-6 py-3 border-b border-slate-100">
          <span className="text-slate-700 font-medium">(-) Despesas Operacionais:</span>
        </div>

        {/* Despesas Operacionais - Itens */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-600">Vendas</span>
            <span className="font-semibold text-slate-700">R$ {dreData.despesasOp.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-3">
            <span className="font-bold text-slate-700">Total Despesas Operacionais</span>
            <span className="font-bold text-slate-700">R$ {dreData.despesasOp.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Lucro Operacional */}
        <DRERow
          label="= Lucro Operacional"
          value={dreData.lucroOp}
          type="lucro-op"
          showSymbol="="
        />

        {/* Margem */}
        <div className="px-6 py-2 bg-pink-50 text-blue-600 text-sm">
          Margem Líquida: {dreData.marginLiquida.toFixed(2)}%
        </div>

        {/* Resumo por Forma de Pagamento */}
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-800">Resumo por Forma de Pagamento</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {Object.entries(dreData.pagamentos).map(([metodo, dados]) => (
              <div key={metodo} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-bold text-slate-800 mb-4">{metodo}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Entradas:</span>
                    <span className="font-semibold text-red-600">R$ {dados.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Saídas:</span>
                    <span className="font-semibold text-red-600">R$ {dados.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-2 font-bold">
                    <span className="text-slate-700">Líquido:</span>
                    <span className="text-green-600">R$ {(dados.entradas - dados.saidas).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast */}
        {forecast && (
          <div className="mt-6 pt-6 border-t">
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-slate-700">{forecast}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
