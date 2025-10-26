
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateExplanation(equation: string): Promise<string> {
  const prompt = `
    Explique como resolver a equação "${equation}" passo a passo. 
    Sua audiência são alunos do sétimo ano do ensino fundamental.
    Use uma linguagem simples, direta e encorajadora.
    Use emojis para tornar a explicação mais amigável e divertida.
    Formate a resposta de forma clara, com quebras de linha para cada passo.
    Exemplo de formato:
    "Olá! Resolver ${equation} é como ser um detetive. 🕵️‍♀️ Vamos encontrar o valor de x!

    1️⃣ Nosso objetivo é deixar o 'x' sozinho de um lado da equação.
    ... continue a explicação ...
    
    E pronto! ✨ O valor de x é [solução]. Você conseguiu! 🎉"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate explanation from Gemini API.");
  }
}
