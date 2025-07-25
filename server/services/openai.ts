import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamResponse {
  content: string;
  done: boolean;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  model: string = "gpt-4o"
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate response from OpenAI");
  }
}

export async function* streamChatResponse(
  messages: ChatMessage[],
  model: string = "gpt-4o"
): AsyncGenerator<StreamResponse> {
  try {
    const stream = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      const done = chunk.choices[0]?.finish_reason === "stop";
      
      yield { content, done };
      
      if (done) break;
    }
  } catch (error) {
    console.error("OpenAI streaming error:", error);
    throw new Error("Failed to stream response from OpenAI");
  }
}

export async function analyzeText(
  text: string,
  analysisType: "summarize" | "extract_themes" | "sentiment" = "summarize"
): Promise<any> {
  try {
    let prompt = "";
    
    switch (analysisType) {
      case "summarize":
        prompt = `Please provide a concise summary of the following text, highlighting the key points and main findings:\n\n${text}`;
        break;
      case "extract_themes":
        prompt = `Analyze the following text and extract the main themes and topics. Respond with JSON in this format: { "themes": ["theme1", "theme2"], "key_points": ["point1", "point2"] }\n\n${text}`;
        break;
      case "sentiment":
        prompt = `Analyze the sentiment of the following text. Respond with JSON in this format: { "sentiment": "positive|negative|neutral", "confidence": 0.95, "reasoning": "explanation" }\n\n${text}`;
        break;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: analysisType !== "summarize" ? { type: "json_object" } : undefined,
    });

    const content = response.choices[0].message.content || "";
    
    if (analysisType !== "summarize") {
      try {
        return JSON.parse(content);
      } catch {
        return { error: "Failed to parse analysis response" };
      }
    }
    
    return content;
  } catch (error) {
    console.error("Text analysis error:", error);
    throw new Error("Failed to analyze text");
  }
}

export async function analyzeImage(base64Image: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image in detail and describe its key elements, context, and any notable aspects. If it contains charts, graphs, or data visualizations, extract and explain the data shown."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Image analysis error:", error);
    throw new Error("Failed to analyze image");
  }
}

export async function generateInsights(
  data: any,
  contextualInfo?: string
): Promise<string> {
  try {
    const prompt = `As an AI data analyst, provide insights and analysis for the following data. ${contextualInfo ? `Context: ${contextualInfo}` : ""}\n\nData:\n${JSON.stringify(data, null, 2)}\n\nPlease provide:
1. Key insights and patterns
2. Notable trends or anomalies
3. Recommendations or next steps
4. Any data quality issues observed`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Insights generation error:", error);
    throw new Error("Failed to generate insights");
  }
}
