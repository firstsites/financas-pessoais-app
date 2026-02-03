
import { GoogleGenAI } from "@google/genai";
import { BudgetData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (data: BudgetData): Promise<string> => {
  const totalFixed = data.fixedCosts.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = data.monthlyLimit - totalFixed - totalExpenses;
  
  const prompt = `
    Atue como um consultor financeiro pessoal expert. 
    Analise os seguintes dados financeiros do usuário para o mês atual:
    - Limite Mensal: R$ ${data.monthlyLimit.toFixed(2)}
    - Total de Custos Fixos: R$ ${totalFixed.toFixed(2)}
    - Total de Gastos Variáveis: R$ ${totalExpenses.toFixed(2)}
    - Saldo Restante: R$ ${remaining.toFixed(2)}
    
    Lista de Custos Fixos: ${data.fixedCosts.map(f => `${f.description} (R$${f.amount})`).join(', ')}
    Lista de Gastos Variáveis: ${data.expenses.map(e => `${e.description} (R$${e.amount})`).join(', ')}

    Por favor, forneça um breve feedback (máximo 3 parágrafos) em Português do Brasil:
    1. Uma avaliação rápida da saúde financeira deste mês.
    2. Identifique se os custos fixos estão muito altos (regra sugerida de 50%).
    3. Dê uma dica prática baseada nos gastos atuais para economizar.
    
    Seja motivador e direto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar uma análise no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com o consultor financeiro inteligente.";
  }
};
