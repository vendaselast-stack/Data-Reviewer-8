// Groq AI Integration with Llama 3.1 8B
const API_KEY = import.meta.env.VITE_GROQ;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const invokeOpenAI = async (prompt, responseJsonSchema = null) => {
  try {
    // Sem API key = erro (sem fallback!)
    if (!API_KEY) {
      console.error('❌ VITE_GROQ não configurada');
      throw new Error('API de IA não configurada. Configure VITE_GROQ para usar análises.');
    }

    // Construir o prompt com instruções de JSON se necessário
    let finalPrompt = prompt;
    if (responseJsonSchema) {
      finalPrompt = `${prompt}\n\nResponda APENAS com um JSON válido que corresponda a este schema: ${JSON.stringify(responseJsonSchema)}\n\nNão inclua texto antes ou depois do JSON.`;
    }

    const requestBody = {
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente financeiro experiente. Forneça análises detalhadas e precisas em português brasileiro.'
        },
        {
          role: 'user',
          content: finalPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API Error:', error);
      throw new Error(error.error?.message || 'Erro na API Groq');
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Resposta vazia da API');
    }

    const textContent = data.choices[0].message.content.trim();
    
    // Se esperamos JSON, parse
    if (responseJsonSchema) {
      try {
        return JSON.parse(textContent);
      } catch (e) {
        // Tentar extrair JSON da resposta
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            return JSON.parse(jsonMatch[0]);
          } catch (jsonError) {
            console.error('JSON malformado mesmo após extração:', jsonError);
            throw new Error('Resposta JSON inválida da IA');
          }
        }
        console.error('Não conseguiu encontrar JSON na resposta:', textContent.substring(0, 200));
        throw new Error('Resposta não é JSON válido');
      }
    }
    
    return textContent;
  } catch (error) {
    console.error('Groq Request Error:', error.message);
    throw error;
  }
};
