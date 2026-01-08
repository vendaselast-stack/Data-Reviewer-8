import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatDateUTC3, formatDateTimeUTC3 } from '@/utils/formatters';

export default function ReportExporter({ reportData, reportType = 'general', analysisResult }) {
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (value) => {
    const val = parseFloat(value || 0);
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

      const transactions = reportData?.transactions || [];

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
        pdf.setFontSize(11);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin + 4, yPos + 5);
        yPos += 14;
        pdf.setTextColor(44, 62, 80);
      };

      const addSubtitle = (text) => {
        checkPageBreak(10);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(52, 73, 94);
        pdf.text(text, margin, yPos);
        yPos += 6;
      };

      // Calculate all financial data
      const incomeTransactions = transactions.filter(t => 
        ['venda', 'venda_prazo', 'receita', 'income'].includes(t.type)
      );
      const expenseTransactions = transactions.filter(t => 
        ['compra', 'compra_prazo', 'despesa', 'expense'].includes(t.type)
      );

      const totalIncome = incomeTransactions.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0);
      const totalExpense = expenseTransactions.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0);
      const profit = totalIncome - totalExpense;
      const margin_percent = totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : '0.0';

      // Group by category
      const incomeByCategory = {};
      const expenseByCategory = {};
      
      incomeTransactions.forEach(t => {
        const cat = t.category || 'Sem Categoria';
        incomeByCategory[cat] = (incomeByCategory[cat] || 0) + Math.abs(parseFloat(t.amount || 0));
      });
      
      expenseTransactions.forEach(t => {
        const cat = t.category || 'Sem Categoria';
        expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Math.abs(parseFloat(t.amount || 0));
      });

      // Group by payment method
      const incomeByPayment = {};
      const expenseByPayment = {};
      
      incomeTransactions.forEach(t => {
        const pm = t.paymentMethod || 'Outros';
        incomeByPayment[pm] = (incomeByPayment[pm] || 0) + Math.abs(parseFloat(t.amount || 0));
      });
      
      expenseTransactions.forEach(t => {
        const pm = t.paymentMethod || 'Outros';
        expenseByPayment[pm] = (expenseByPayment[pm] || 0) + Math.abs(parseFloat(t.amount || 0));
      });

      // === CAPA ===
      pdf.setFillColor(44, 62, 80);
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RELATORIO FINANCEIRO', margin, 25);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Analise Inteligente com IA', margin, 38);
      
      pdf.setTextColor(44, 62, 80);
      pdf.setFontSize(10);
      yPos = 62;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Periodo:', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(reportData?.summary?.periodo || 'N/A', margin + 22, yPos);
      yPos += 6;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Gerado em:', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(formatDateTimeUTC3(), margin + 28, yPos);
      yPos += 6;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total de Transacoes:', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${transactions.length}`, margin + 45, yPos);
      yPos += 12;

      // === KPIs PRINCIPAIS ===
      addSectionTitle('INDICADORES CHAVE (KPIs)', [52, 152, 219]);

      const kpiData = [
        ['Receita Total', formatCurrency(totalIncome), '100%'],
        ['Despesas Totais', formatCurrency(totalExpense), totalIncome > 0 ? `${((totalExpense / totalIncome) * 100).toFixed(1)}%` : '-'],
        ['Lucro Liquido', formatCurrency(profit), `${margin_percent}%`],
        ['Total de Receitas', `${incomeTransactions.length} transacoes`, '-'],
        ['Total de Despesas', `${expenseTransactions.length} transacoes`, '-']
      ];

      autoTable(pdf, {
        startY: yPos,
        head: [['Indicador', 'Valor', '% Receita']],
        body: kpiData,
        theme: 'striped',
        headStyles: { 
          fillColor: [52, 152, 219],
          textColor: [255, 255, 255],
          fontSize: 9
        },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 55 },
          1: { halign: 'right', cellWidth: 50 },
          2: { halign: 'center', cellWidth: 35 }
        },
        margin: { left: margin, right: margin }
      });
      yPos = pdf.lastAutoTable.finalY + 10;

      // === SUMARIO EXECUTIVO ===
      addSectionTitle('SUMARIO EXECUTIVO', [46, 204, 113]);
      
      const summaryText = analysisResult?.executive_summary || 
        'Analise em processamento. Gere uma nova analise para obter insights.';
      
      pdf.setFillColor(245, 250, 245);
      const summaryLines = pdf.splitTextToSize(summaryText, contentWidth - 10);
      const summaryHeight = summaryLines.length * 4 + 8;
      checkPageBreak(summaryHeight + 5);
      
      pdf.roundedRect(margin, yPos, contentWidth, summaryHeight, 2, 2, 'F');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(50, 50, 50);
      pdf.text(summaryLines, margin + 5, yPos + 6);
      yPos += summaryHeight + 8;

      // === DRE COMPLETO ===
      pdf.addPage();
      yPos = 20;
      addSectionTitle('DEMONSTRATIVO DE RESULTADOS (DRE)', [231, 76, 60]);

      // Receitas por Categoria
      const dreData = [
        ['RECEITAS', '', ''],
      ];
      
      Object.entries(incomeByCategory)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, val]) => {
          dreData.push([`   ${cat}`, formatCurrency(val), totalIncome > 0 ? `${((val / totalIncome) * 100).toFixed(1)}%` : '-']);
        });
      
      dreData.push(['TOTAL RECEITAS', formatCurrency(totalIncome), '100%']);
      dreData.push(['', '', '']);
      dreData.push(['DESPESAS', '', '']);
      
      Object.entries(expenseByCategory)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, val]) => {
          dreData.push([`   ${cat}`, formatCurrency(val), totalIncome > 0 ? `${((val / totalIncome) * 100).toFixed(1)}%` : '-']);
        });
      
      dreData.push(['TOTAL DESPESAS', formatCurrency(totalExpense), totalIncome > 0 ? `${((totalExpense / totalIncome) * 100).toFixed(1)}%` : '-']);
      dreData.push(['', '', '']);
      dreData.push(['(=) RESULTADO LIQUIDO', formatCurrency(profit), `${margin_percent}%`]);

      autoTable(pdf, {
        startY: yPos,
        head: [['DESCRICAO', 'VALOR (R$)', '% RECEITA']],
        body: dreData,
        theme: 'grid',
        headStyles: { 
          fillColor: [231, 76, 60],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { halign: 'right', cellWidth: 45 },
          2: { halign: 'center', cellWidth: 35 }
        },
        didParseCell: (data) => {
          const text = data.cell.text[0] || '';
          if (text === 'RECEITAS' || text === 'DESPESAS' || text.includes('TOTAL') || text.includes('RESULTADO')) {
            data.cell.styles.fontStyle = 'bold';
          }
          if (text.includes('RESULTADO LIQUIDO')) {
            data.cell.styles.fillColor = profit >= 0 ? [220, 252, 231] : [254, 226, 226];
          }
        },
        margin: { left: margin, right: margin }
      });
      yPos = pdf.lastAutoTable.finalY + 12;

      // === RESUMO POR FORMA DE PAGAMENTO ===
      checkPageBreak(60);
      addSectionTitle('RESUMO POR FORMA DE PAGAMENTO', [155, 89, 182]);

      addSubtitle('Receitas por Forma de Pagamento:');
      const paymentIncomeData = Object.entries(incomeByPayment)
        .sort((a, b) => b[1] - a[1])
        .map(([pm, val]) => [pm, formatCurrency(val), totalIncome > 0 ? `${((val / totalIncome) * 100).toFixed(1)}%` : '-']);

      if (paymentIncomeData.length > 0) {
        autoTable(pdf, {
          startY: yPos,
          head: [['Forma de Pagamento', 'Valor', '%']],
          body: paymentIncomeData,
          theme: 'striped',
          headStyles: { fillColor: [46, 204, 113], fontSize: 8 },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { halign: 'right', cellWidth: 40 },
            2: { halign: 'center', cellWidth: 25 }
          },
          margin: { left: margin, right: margin }
        });
        yPos = pdf.lastAutoTable.finalY + 8;
      } else {
        pdf.setFontSize(8);
        pdf.text('Nenhuma receita registrada.', margin, yPos);
        yPos += 8;
      }

      checkPageBreak(40);
      addSubtitle('Despesas por Forma de Pagamento:');
      const paymentExpenseData = Object.entries(expenseByPayment)
        .sort((a, b) => b[1] - a[1])
        .map(([pm, val]) => [pm, formatCurrency(val), totalExpense > 0 ? `${((val / totalExpense) * 100).toFixed(1)}%` : '-']);

      if (paymentExpenseData.length > 0) {
        autoTable(pdf, {
          startY: yPos,
          head: [['Forma de Pagamento', 'Valor', '%']],
          body: paymentExpenseData,
          theme: 'striped',
          headStyles: { fillColor: [231, 76, 60], fontSize: 8 },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { halign: 'right', cellWidth: 40 },
            2: { halign: 'center', cellWidth: 25 }
          },
          margin: { left: margin, right: margin }
        });
        yPos = pdf.lastAutoTable.finalY + 10;
      } else {
        pdf.setFontSize(8);
        pdf.text('Nenhuma despesa registrada.', margin, yPos);
        yPos += 8;
      }

      // === PREVISAO DE FLUXO DE CAIXA ===
      if (analysisResult?.cash_flow_forecast && analysisResult.cash_flow_forecast.length > 0) {
        checkPageBreak(50);
        addSectionTitle('PREVISAO DE FLUXO DE CAIXA (IA)', [52, 73, 94]);
        
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
            fillColor: [52, 73, 94],
            textColor: [255, 255, 255],
            fontSize: 9
          },
          styles: { fontSize: 9, cellPadding: 3 },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { halign: 'right', cellWidth: 40 },
            2: { halign: 'right', cellWidth: 40 },
            3: { halign: 'right', cellWidth: 40 }
          },
          margin: { left: margin, right: margin }
        });
        yPos = pdf.lastAutoTable.finalY + 10;
      }

      // === OPORTUNIDADES DE REDUCAO DE CUSTOS ===
      if (analysisResult?.expense_reduction_opportunities && analysisResult.expense_reduction_opportunities.length > 0) {
        checkPageBreak(40);
        addSectionTitle('OPORTUNIDADES DE REDUCAO DE CUSTOS', [230, 126, 34]);
        
        analysisResult.expense_reduction_opportunities.forEach((item, idx) => {
          checkPageBreak(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(44, 62, 80);
          pdf.text(`${idx + 1}. ${item.suggestion || item.category || 'Sugestao'}`, margin + 2, yPos);
          yPos += 5;
          
          if (item.potential_savings) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`   Economia potencial: ${item.potential_savings}`, margin + 2, yPos);
            yPos += 5;
          }
        });
        yPos += 5;
      }

      // === ESTRATEGIAS DE CRESCIMENTO ===
      if (analysisResult?.revenue_growth_suggestions && analysisResult.revenue_growth_suggestions.length > 0) {
        checkPageBreak(40);
        addSectionTitle('ESTRATEGIAS DE CRESCIMENTO DE RECEITA', [46, 204, 113]);
        
        analysisResult.revenue_growth_suggestions.forEach((item, idx) => {
          checkPageBreak(15);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(44, 62, 80);
          pdf.text(`${idx + 1}. ${item.strategy || 'Estrategia'}`, margin + 2, yPos);
          yPos += 5;
          
          if (item.rationale) {
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(8);
            pdf.setTextColor(80, 80, 80);
            const rationaleLines = pdf.splitTextToSize(`   ${item.rationale}`, contentWidth - 10);
            pdf.text(rationaleLines, margin + 2, yPos);
            yPos += rationaleLines.length * 3.5 + 2;
          }
        });
        yPos += 5;
      }

      // === ALERTAS E RISCOS ===
      if (analysisResult?.anomalies && analysisResult.anomalies.length > 0) {
        checkPageBreak(30);
        addSectionTitle('ALERTAS E RISCOS IDENTIFICADOS', [192, 57, 43]);
        
        analysisResult.anomalies.forEach((item, idx) => {
          checkPageBreak(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(192, 57, 43);
          pdf.text(`! ${item.title || 'Alerta'}`, margin + 2, yPos);
          yPos += 4;
          
          if (item.description) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(80, 80, 80);
            const descLines = pdf.splitTextToSize(`  ${item.description}`, contentWidth - 10);
            pdf.text(descLines, margin + 2, yPos);
            yPos += descLines.length * 3.5 + 3;
          }
        });
        yPos += 5;
      }

      // === TRANSACOES DO PERIODO ===
      if (transactions.length > 0) {
        pdf.addPage();
        yPos = 20;
        addSectionTitle('HISTORICO ANALITICO DE TRANSACOES', [52, 73, 94]);

        const txnData = transactions.slice(0, 60).map(t => [
          t.date ? new Date(t.date).toLocaleDateString('pt-BR') : '-',
          (t.description || '-').substring(0, 30),
          t.category || 'Outros',
          t.paymentMethod || '-',
          ['venda', 'receita', 'income'].includes(t.type) ? 'R' : 'D',
          formatCurrency(t.amount || 0)
        ]);

        autoTable(pdf, {
          startY: yPos,
          head: [['Data', 'Descricao', 'Categoria', 'Pagamento', 'Tipo', 'Valor']],
          body: txnData,
          theme: 'striped',
          headStyles: { 
            fillColor: [52, 73, 94],
            textColor: [255, 255, 255],
            fontSize: 7
          },
          styles: { fontSize: 7, cellPadding: 2 },
          columnStyles: { 
            0: { cellWidth: 20 },
            1: { cellWidth: 45 },
            2: { cellWidth: 30 },
            3: { cellWidth: 25 },
            4: { cellWidth: 12, halign: 'center' },
            5: { halign: 'right', cellWidth: 28 }
          },
          margin: { left: margin, right: margin }
        });

        if (transactions.length > 60) {
          yPos = pdf.lastAutoTable.finalY + 5;
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`* Exibindo 60 de ${transactions.length} transacoes. Exporte para Excel para ver todas.`, margin, yPos);
        }
      }

      // === RODAPE EM TODAS AS PAGINAS ===
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Pagina ${i} de ${totalPages}`, pageWidth - 28, pageHeight - 8);
        pdf.text('HUACONTROL - IA Analista Financeiro', margin, pageHeight - 8);
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
      const transactions = reportData?.transactions || [];

      // Calculate data
      const incomeTransactions = transactions.filter(t => 
        ['venda', 'venda_prazo', 'receita', 'income'].includes(t.type)
      );
      const expenseTransactions = transactions.filter(t => 
        ['compra', 'compra_prazo', 'despesa', 'expense'].includes(t.type)
      );

      const totalIncome = incomeTransactions.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0);
      const totalExpense = expenseTransactions.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0);
      const profit = totalIncome - totalExpense;

      // Group by category
      const incomeByCategory = {};
      const expenseByCategory = {};
      incomeTransactions.forEach(t => {
        const cat = t.category || 'Sem Categoria';
        incomeByCategory[cat] = (incomeByCategory[cat] || 0) + Math.abs(parseFloat(t.amount || 0));
      });
      expenseTransactions.forEach(t => {
        const cat = t.category || 'Sem Categoria';
        expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Math.abs(parseFloat(t.amount || 0));
      });

      // Group by payment method
      const incomeByPayment = {};
      const expenseByPayment = {};
      incomeTransactions.forEach(t => {
        const pm = t.paymentMethod || 'Outros';
        incomeByPayment[pm] = (incomeByPayment[pm] || 0) + Math.abs(parseFloat(t.amount || 0));
      });
      expenseTransactions.forEach(t => {
        const pm = t.paymentMethod || 'Outros';
        expenseByPayment[pm] = (expenseByPayment[pm] || 0) + Math.abs(parseFloat(t.amount || 0));
      });

      // Aba 1: Resumo Executivo
      const summaryData = [
        ['RELATORIO FINANCEIRO - IA ANALISTA'],
        [''],
        ['Gerado em', formatDateTimeUTC3()],
        ['Periodo', reportData?.summary?.periodo || 'N/A'],
        [''],
        ['INDICADORES PRINCIPAIS'],
        ['Receita Total', totalIncome],
        ['Despesas Totais', totalExpense],
        ['Lucro Liquido', profit],
        ['Margem de Lucro', totalIncome > 0 ? `${((profit / totalIncome) * 100).toFixed(1)}%` : '0%'],
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

      // Aba 2: DRE Completo
      const dreData = [
        ['DEMONSTRATIVO DE RESULTADOS (DRE)'],
        [''],
        ['RECEITAS POR CATEGORIA'],
        ['Categoria', 'Valor', '% Receita']
      ];
      Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, val]) => {
        dreData.push([cat, val, totalIncome > 0 ? `${((val / totalIncome) * 100).toFixed(1)}%` : '-']);
      });
      dreData.push(['TOTAL RECEITAS', totalIncome, '100%']);
      dreData.push(['']);
      dreData.push(['DESPESAS POR CATEGORIA']);
      dreData.push(['Categoria', 'Valor', '% Receita']);
      Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, val]) => {
        dreData.push([cat, val, totalIncome > 0 ? `${((val / totalIncome) * 100).toFixed(1)}%` : '-']);
      });
      dreData.push(['TOTAL DESPESAS', totalExpense, totalIncome > 0 ? `${((totalExpense / totalIncome) * 100).toFixed(1)}%` : '-']);
      dreData.push(['']);
      dreData.push(['RESULTADO LIQUIDO', profit, totalIncome > 0 ? `${((profit / totalIncome) * 100).toFixed(1)}%` : '-']);

      const wsDRE = XLSX.utils.aoa_to_sheet(dreData);
      XLSX.utils.book_append_sheet(wb, wsDRE, "DRE Completo");

      // Aba 3: Por Forma de Pagamento
      const paymentData = [
        ['RESUMO POR FORMA DE PAGAMENTO'],
        [''],
        ['RECEITAS'],
        ['Forma de Pagamento', 'Valor', '%']
      ];
      Object.entries(incomeByPayment).sort((a, b) => b[1] - a[1]).forEach(([pm, val]) => {
        paymentData.push([pm, val, totalIncome > 0 ? `${((val / totalIncome) * 100).toFixed(1)}%` : '-']);
      });
      paymentData.push(['']);
      paymentData.push(['DESPESAS']);
      paymentData.push(['Forma de Pagamento', 'Valor', '%']);
      Object.entries(expenseByPayment).sort((a, b) => b[1] - a[1]).forEach(([pm, val]) => {
        paymentData.push([pm, val, totalExpense > 0 ? `${((val / totalExpense) * 100).toFixed(1)}%` : '-']);
      });

      const wsPayment = XLSX.utils.aoa_to_sheet(paymentData);
      XLSX.utils.book_append_sheet(wb, wsPayment, "Por Forma Pagamento");

      // Aba 4: Recomendacoes
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
          recsData.push([`${i + 1}. ${item.strategy || 'Estrategia'}`, item.rationale || '']);
        });
      }

      const wsRecs = XLSX.utils.aoa_to_sheet(recsData);
      XLSX.utils.book_append_sheet(wb, wsRecs, "Recomendacoes");

      // Aba 5: Transacoes
      const txnHeader = ['Data', 'Descricao', 'Categoria', 'Forma Pagamento', 'Tipo', 'Valor'];
      const txnData = [txnHeader];
      
      transactions.forEach(t => {
        const dateStr = t.date ? new Date(t.date).toLocaleDateString('pt-BR') : '';
        const amount = parseFloat(t.amount || 0);
        const typeLabel = ['venda', 'receita', 'income'].includes(t.type) ? 'Receita' : 'Despesa';
        txnData.push([dateStr, t.description || '', t.category || 'Outros', t.paymentMethod || '-', typeLabel, amount]);
      });

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
