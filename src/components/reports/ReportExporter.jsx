import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { formatDateUTC3, formatDateTimeUTC3 } from '@/utils/formatters';

export default function ReportExporter({ reportData, reportType = 'general', analysisResult }) {
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (value) => {
    const val = parseFloat(value || 0);
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const captureChart = async (id) => {
    const printId = `${id}-print`;
    const element = document.getElementById(printId) || document.getElementById(id);
    
    if (!element) {
      console.warn(`Element ${id} not found`);
      return null;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 800,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById(printId) || clonedDoc.getElementById(id);
          if (el) {
            el.style.width = '750px';
            el.style.height = 'auto';
            el.style.padding = '15px';
            el.style.visibility = 'visible';
            el.style.display = 'block';
          }
        }
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error(`Error capturing chart ${id}:`, error);
      return null;
    }
  };

  const exportToPDF = async () => {
    if (!analysisResult) {
      toast.error('Gere uma analise primeiro para exportar o relatorio completo.');
      return;
    }

    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let yPos = 20;

      const checkPageBreak = (neededHeight) => {
        if (yPos + neededHeight > pageHeight - 25) {
          pdf.addPage();
          yPos = 20;
          return true;
        }
        return false;
      };

      const addSectionTitle = (title, color = [44, 62, 80]) => {
        checkPageBreak(18);
        pdf.setFillColor(color[0], color[1], color[2]);
        pdf.rect(margin, yPos - 2, contentWidth, 10, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin + 4, yPos + 5);
        yPos += 14;
        pdf.setTextColor(44, 62, 80);
      };

      const addSubtitle = (text) => {
        checkPageBreak(10);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(52, 73, 94);
        pdf.text(text, margin, yPos);
        yPos += 7;
      };

      const addParagraph = (text, maxWidth = contentWidth - 5) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);
        const lines = pdf.splitTextToSize(text, maxWidth);
        const neededHeight = lines.length * 4.5;
        checkPageBreak(neededHeight + 5);
        pdf.text(lines, margin + 2, yPos);
        yPos += neededHeight + 4;
      };

      // === CAPA ===
      pdf.setFillColor(44, 62, 80);
      pdf.rect(0, 0, pageWidth, 55, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RELATORIO FINANCEIRO', margin, 28);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Analise Inteligente com IA', margin, 40);
      
      pdf.setTextColor(44, 62, 80);
      pdf.setFontSize(11);
      yPos = 70;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Empresa:', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(reportData?.summary?.companyName || 'Minha Empresa', margin + 25, yPos);
      yPos += 8;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Periodo:', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(reportData?.summary?.periodo || 'N/A', margin + 25, yPos);
      yPos += 8;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Gerado em:', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(formatDateTimeUTC3(), margin + 30, yPos);
      yPos += 15;

      // === KPIs PRINCIPAIS ===
      addSectionTitle('INDICADORES CHAVE (KPIs)', [52, 152, 219]);
      
      const receita = parseFloat(reportData?.summary?.receita_total || 0);
      const despesa = parseFloat(reportData?.summary?.despesas_total || 0);
      const lucro = receita - despesa;
      const margem = receita > 0 ? ((lucro / receita) * 100).toFixed(1) : '0.0';

      const kpiData = [
        ['Receita Total', formatCurrency(receita)],
        ['Despesas Totais', formatCurrency(despesa)],
        ['Lucro Liquido', formatCurrency(lucro)],
        ['Margem de Lucro', `${margem}%`]
      ];

      autoTable(pdf, {
        startY: yPos,
        body: kpiData,
        theme: 'plain',
        styles: { 
          fontSize: 11, 
          cellPadding: 4,
          textColor: [44, 62, 80]
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 60 },
          1: { halign: 'left', cellWidth: 60 }
        },
        margin: { left: margin }
      });
      yPos = pdf.lastAutoTable.finalY + 12;

      // === SUMARIO EXECUTIVO ===
      addSectionTitle('SUMARIO EXECUTIVO', [46, 204, 113]);
      
      const summaryText = analysisResult?.executive_summary || 
        'Analise em processamento. Gere uma nova analise para obter insights detalhados.';
      
      pdf.setFillColor(245, 250, 245);
      const summaryLines = pdf.splitTextToSize(summaryText, contentWidth - 10);
      const summaryHeight = summaryLines.length * 4.5 + 10;
      checkPageBreak(summaryHeight + 5);
      
      pdf.roundedRect(margin, yPos, contentWidth, summaryHeight, 2, 2, 'F');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(50, 50, 50);
      pdf.text(summaryLines, margin + 5, yPos + 7);
      yPos += summaryHeight + 10;

      // === PREVISAO DE FLUXO DE CAIXA ===
      if (analysisResult?.cash_flow_forecast && analysisResult.cash_flow_forecast.length > 0) {
        addSectionTitle('PREVISAO DE FLUXO DE CAIXA', [155, 89, 182]);
        
        const forecastData = analysisResult.cash_flow_forecast.map(f => [
          f.month || 'Mes',
          formatCurrency(f.predicted_revenue || 0),
          formatCurrency(f.predicted_expense || 0),
          formatCurrency((f.predicted_revenue || 0) - (f.predicted_expense || 0))
        ]);

        autoTable(pdf, {
          startY: yPos,
          head: [['Periodo', 'Receita Prevista', 'Despesa Prevista', 'Resultado']],
          body: forecastData,
          theme: 'striped',
          headStyles: { 
            fillColor: [155, 89, 182],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold'
          },
          styles: { fontSize: 9, cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { halign: 'right', cellWidth: 40 },
            2: { halign: 'right', cellWidth: 40 },
            3: { halign: 'right', cellWidth: 40 }
          },
          margin: { left: margin, right: margin }
        });
        yPos = pdf.lastAutoTable.finalY + 12;
      }

      // === GRAFICO DE FLUXO DE CAIXA ===
      const cashflowImg = await captureChart('report-chart-cashflow');
      if (cashflowImg) {
        checkPageBreak(75);
        addSubtitle('Grafico: Fluxo de Caixa Projetado');
        const imgWidth = contentWidth * 0.9;
        const imgHeight = imgWidth * 0.45;
        pdf.addImage(cashflowImg, 'PNG', margin + 5, yPos, imgWidth, imgHeight, undefined, 'FAST');
        yPos += imgHeight + 12;
      }

      // === DRE - DEMONSTRATIVO DE RESULTADOS ===
      pdf.addPage();
      yPos = 20;
      addSectionTitle('DEMONSTRATIVO DE RESULTADOS (DRE)', [231, 76, 60]);

      const dreData = [
        ['RECEITA BRUTA', formatCurrency(receita), '100%'],
        ['(-) Custos e Despesas', formatCurrency(despesa), receita > 0 ? `${((despesa / receita) * 100).toFixed(1)}%` : '0%'],
        ['(=) RESULTADO LIQUIDO', formatCurrency(lucro), receita > 0 ? `${((lucro / receita) * 100).toFixed(1)}%` : '0%']
      ];

      autoTable(pdf, {
        startY: yPos,
        head: [['DESCRICAO', 'VALOR (R$)', '% RECEITA']],
        body: dreData,
        theme: 'grid',
        headStyles: { 
          fillColor: [231, 76, 60],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { halign: 'right', cellWidth: 50 },
          2: { halign: 'center', cellWidth: 40 }
        },
        margin: { left: margin, right: margin }
      });
      yPos = pdf.lastAutoTable.finalY + 15;

      // === OPORTUNIDADES DE REDUCAO DE CUSTOS ===
      if (analysisResult?.expense_reduction_opportunities && analysisResult.expense_reduction_opportunities.length > 0) {
        addSectionTitle('OPORTUNIDADES DE REDUCAO DE CUSTOS', [230, 126, 34]);
        
        analysisResult.expense_reduction_opportunities.forEach((item, idx) => {
          checkPageBreak(15);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10);
          pdf.setTextColor(44, 62, 80);
          pdf.text(`${idx + 1}. ${item.suggestion || item.category || 'Sugestao'}`, margin + 2, yPos);
          yPos += 5;
          
          if (item.potential_savings) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`   Economia potencial: ${item.potential_savings}`, margin + 2, yPos);
            yPos += 6;
          } else {
            yPos += 3;
          }
        });
        yPos += 8;
      }

      // === ESTRATEGIAS DE CRESCIMENTO ===
      if (analysisResult?.revenue_growth_suggestions && analysisResult.revenue_growth_suggestions.length > 0) {
        addSectionTitle('ESTRATEGIAS DE CRESCIMENTO DE RECEITA', [46, 204, 113]);
        
        analysisResult.revenue_growth_suggestions.forEach((item, idx) => {
          checkPageBreak(20);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10);
          pdf.setTextColor(44, 62, 80);
          pdf.text(`${idx + 1}. ${item.strategy || 'Estrategia'}`, margin + 2, yPos);
          yPos += 5;
          
          if (item.rationale) {
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(8);
            pdf.setTextColor(80, 80, 80);
            const rationaleLines = pdf.splitTextToSize(`   Por que: ${item.rationale}`, contentWidth - 10);
            pdf.text(rationaleLines, margin + 2, yPos);
            yPos += rationaleLines.length * 3.5 + 2;
          }
          
          if (item.target_customer_segment) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`   Publico-alvo: ${item.target_customer_segment}`, margin + 2, yPos);
            yPos += 6;
          }
          yPos += 2;
        });
        yPos += 8;
      }

      // === ALERTAS E RISCOS ===
      if (analysisResult?.anomalies && analysisResult.anomalies.length > 0) {
        checkPageBreak(30);
        addSectionTitle('ALERTAS E RISCOS IDENTIFICADOS', [192, 57, 43]);
        
        analysisResult.anomalies.forEach((item, idx) => {
          checkPageBreak(15);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10);
          pdf.setTextColor(192, 57, 43);
          pdf.text(`! ${item.title || 'Alerta'}`, margin + 2, yPos);
          yPos += 5;
          
          if (item.description) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(80, 80, 80);
            const descLines = pdf.splitTextToSize(`  ${item.description}`, contentWidth - 10);
            pdf.text(descLines, margin + 2, yPos);
            yPos += descLines.length * 3.5 + 4;
          }
        });
        yPos += 8;
      }

      // === GRAFICO DE DESPESAS ===
      const expensesImg = await captureChart('report-chart-expenses');
      if (expensesImg) {
        checkPageBreak(75);
        addSubtitle('Grafico: Distribuicao de Despesas');
        const imgWidth = contentWidth * 0.85;
        const imgHeight = imgWidth * 0.5;
        pdf.addImage(expensesImg, 'PNG', margin + 8, yPos, imgWidth, imgHeight, undefined, 'FAST');
        yPos += imgHeight + 12;
      }

      // === GRAFICO DE RECEITAS ===
      const revenueImg = await captureChart('report-chart-revenue');
      if (revenueImg) {
        checkPageBreak(75);
        addSubtitle('Grafico: Tendencia de Receitas');
        const imgWidth = contentWidth * 0.85;
        const imgHeight = imgWidth * 0.5;
        pdf.addImage(revenueImg, 'PNG', margin + 8, yPos, imgWidth, imgHeight, undefined, 'FAST');
        yPos += imgHeight + 12;
      }

      // === TRANSACOES DO PERIODO ===
      if (reportData?.transactions && reportData.transactions.length > 0) {
        pdf.addPage();
        yPos = 20;
        addSectionTitle('HISTORICO ANALITICO DE TRANSACOES', [52, 73, 94]);

        const txnData = reportData.transactions.slice(0, 50).map(t => [
          t.date ? new Date(t.date).toLocaleDateString('pt-BR') : '-',
          (t.description || '-').substring(0, 35),
          t.category || 'Outros',
          ['venda', 'receita', 'income'].includes(t.type) ? 'Receita' : 'Despesa',
          formatCurrency(t.amount || 0)
        ]);

        autoTable(pdf, {
          startY: yPos,
          head: [['Data', 'Descricao', 'Categoria', 'Tipo', 'Valor']],
          body: txnData,
          theme: 'striped',
          headStyles: { 
            fillColor: [52, 73, 94],
            textColor: [255, 255, 255],
            fontSize: 8
          },
          styles: { fontSize: 7, cellPadding: 2 },
          columnStyles: { 
            0: { cellWidth: 22 },
            1: { cellWidth: 60 },
            2: { cellWidth: 35 },
            3: { cellWidth: 20 },
            4: { halign: 'right', cellWidth: 28 }
          },
          margin: { left: margin, right: margin }
        });

        if (reportData.transactions.length > 50) {
          yPos = pdf.lastAutoTable.finalY + 5;
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`* Exibindo 50 de ${reportData.transactions.length} transacoes. Exporte para Excel para ver todas.`, margin, yPos);
        }
      }

      // === RODAPE EM TODAS AS PAGINAS ===
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Pagina ${i} de ${totalPages}`, pageWidth - 30, pageHeight - 10);
        pdf.text('Gerado por HUACONTROL - IA Analista Financeiro', margin, pageHeight - 10);
      }

      pdf.save(`Relatorio_Financeiro_IA_${formatDateUTC3()}.pdf`);
      toast.success('Relatorio PDF gerado com sucesso!');
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = () => {
    setIsExporting(true);
    try {
      const wb = XLSX.utils.book_new();

      // Aba 1: Dashboard e Resumo
      const receita = parseFloat(reportData?.summary?.receita_total || 0);
      const despesa = parseFloat(reportData?.summary?.despesas_total || 0);
      const lucro = receita - despesa;

      const summaryData = [
        ['RELATORIO FINANCEIRO - IA ANALISTA'],
        [''],
        ['Gerado em', formatDateTimeUTC3()],
        ['Periodo', reportData?.summary?.periodo || 'N/A'],
        [''],
        ['INDICADORES PRINCIPAIS'],
        ['Receita Total', receita],
        ['Despesas Totais', despesa],
        ['Lucro Liquido', lucro],
        ['Margem de Lucro', receita > 0 ? `${((lucro / receita) * 100).toFixed(1)}%` : '0%'],
        [''],
        ['SUMARIO EXECUTIVO'],
        [analysisResult?.executive_summary || 'Gere uma analise para ver o sumario.']
      ];

      if (analysisResult?.cash_flow_forecast) {
        summaryData.push(['']);
        summaryData.push(['PREVISAO DE FLUXO DE CAIXA']);
        summaryData.push(['Mes', 'Receita Prevista', 'Despesa Prevista', 'Resultado']);
        analysisResult.cash_flow_forecast.forEach(f => {
          const rev = parseFloat(f.predicted_revenue || 0);
          const exp = parseFloat(f.predicted_expense || 0);
          summaryData.push([f.month, rev, exp, rev - exp]);
        });
      }

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Resumo Executivo");

      // Aba 2: DRE
      const dreData = [
        ['DEMONSTRATIVO DE RESULTADOS (DRE)'],
        [''],
        ['Descricao', 'Valor', '% Receita'],
        ['Receita Bruta', receita, '100%'],
        ['(-) Custos e Despesas', despesa, receita > 0 ? `${((despesa / receita) * 100).toFixed(1)}%` : '0%'],
        ['(=) Resultado Liquido', lucro, receita > 0 ? `${((lucro / receita) * 100).toFixed(1)}%` : '0%']
      ];
      const wsDRE = XLSX.utils.aoa_to_sheet(dreData);
      XLSX.utils.book_append_sheet(wb, wsDRE, "DRE");

      // Aba 3: Recomendacoes
      const recsData = [['RECOMENDACOES ESTRATEGICAS'], ['']];
      
      if (analysisResult?.expense_reduction_opportunities?.length > 0) {
        recsData.push(['OPORTUNIDADES DE REDUCAO DE CUSTOS']);
        analysisResult.expense_reduction_opportunities.forEach((item, i) => {
          recsData.push([`${i + 1}. ${item.suggestion || item.category || 'Sugestao'}`]);
        });
        recsData.push(['']);
      }

      if (analysisResult?.revenue_growth_suggestions?.length > 0) {
        recsData.push(['ESTRATEGIAS DE CRESCIMENTO']);
        analysisResult.revenue_growth_suggestions.forEach((item, i) => {
          recsData.push([`${i + 1}. ${item.strategy || 'Estrategia'}`, item.rationale || '', item.target_customer_segment || '']);
        });
      }

      const wsRecs = XLSX.utils.aoa_to_sheet(recsData);
      XLSX.utils.book_append_sheet(wb, wsRecs, "Recomendacoes");

      // Aba 4: Transacoes
      const txnHeader = ['Data', 'Descricao', 'Valor', 'Categoria', 'Tipo'];
      const txnData = [txnHeader];
      
      if (reportData?.transactions) {
        reportData.transactions.forEach(t => {
          const dateStr = t.date ? new Date(t.date).toLocaleDateString('pt-BR') : '';
          const amount = parseFloat(t.amount || 0);
          const typeLabel = ['venda', 'receita', 'income'].includes(t.type) ? 'Receita' : 'Despesa';
          txnData.push([dateStr, t.description || '', amount, t.category || 'Outros', typeLabel]);
        });
      }

      const wsTxns = XLSX.utils.aoa_to_sheet(txnData);
      XLSX.utils.book_append_sheet(wb, wsTxns, "Transacoes");

      XLSX.writeFile(wb, `Relatorio_IA_${formatDateUTC3()}.xlsx`);
      toast.success('Planilha Excel gerada com sucesso!');
    } catch (error) {
      console.error('Excel Export Error:', error);
      toast.error('Erro ao gerar Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Button
        onClick={exportToPDF}
        disabled={isExporting}
        variant="outline"
        className="gap-2 flex-1 sm:flex-none border-blue-200 hover:bg-blue-50"
        data-testid="button-export-pdf"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4 text-blue-600" />
        )}
        Exportar PDF
      </Button>
      <Button
        onClick={exportToExcel}
        disabled={isExporting}
        variant="outline"
        className="gap-2 flex-1 sm:flex-none border-emerald-200 hover:bg-emerald-50"
        data-testid="button-export-excel"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
        )}
        Exportar XLSX
      </Button>
    </div>
  );
}
