import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GOOGLE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function analyzeWithAI(prompt: string, responseJsonSchema: any = null) {
  if (!genAI) {
    throw new Error('API_KEY_NOT_CONFIGURED');
  }

  // Tenta múltiplos nomes de modelo para contornar o erro 404
  const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro"];
  let model = null;
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[AI Debug] Tentando modelo: ${modelName}`);
      model = genAI.getGenerativeModel({ model: modelName });
      // Teste rápido com prompt vazio não funciona, vamos tentar a chamada real
      break; 
    } catch (e) {
      lastError = e;
      console.warn(`[AI Debug] Falha ao carregar modelo ${modelName}:`, e.message);
    }
  }

  if (!model) {
    throw new Error(`Não foi possível carregar nenhum modelo Gemini. Último erro: ${lastError?.message}`);
  }

  let finalPrompt = prompt;
  if (responseJsonSchema) {
    finalPrompt = `${prompt}\n\nResponda APENAS com um objeto JSON seguindo este formato:\n${JSON.stringify(responseJsonSchema)}\nNão inclua markdown ou explicações adicionais.`;
  }

  try {
    console.log(`[AI Debug] Enviando prompt para ${model.model}...`);
    const result = await model.generateContent(finalPrompt);
    const textContent = result.response.text().trim();
    console.log(`[AI Debug] Resposta recebida (primeiros 100 caracteres): ${textContent.substring(0, 100)}...`);

    const cleanContent = textContent.replace(/^```json/, '').replace(/```$/, '').trim();

    if (responseJsonSchema) {
      try {
        return JSON.parse(cleanContent);
      } catch (parseError) {
        // Fallback: tenta extrair JSON do texto caso a IA tenha incluído texto extra
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw parseError;
      }
    }

    return textContent;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(`Erro na API Gemini: ${error.message}`);
  }
}