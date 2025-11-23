import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const getClient = () => {
    // specific check to avoid ReferenceError if process is not defined
    let apiKey = undefined;
    try {
      if (typeof process !== 'undefined' && process.env) {
        apiKey = process.env.API_KEY;
      }
    } catch (e) {
      // ignore
    }
    
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

export const generateArtisticCommentary = async (
  levelName: string, 
  imageKeyword: string, 
  language: Language
): Promise<string> => {
  const ai = getClient();
  const isChinese = language === Language.ZH;
  
  // Fallback messages
  const fallback = isChinese 
    ? "混沌归于秩序，画面终成一体。" 
    : "Chaos has been ordered. The picture is now whole.";

  if (!ai) {
    return isChinese 
      ? "画面已修复，光影重现。" 
      : "A beautiful image restored to its original glory. Well done!";
  }

  try {
    const prompt = isChinese
      ? `用户刚刚完成了一个名为“${levelName}”的拼图游戏关卡，图片主题是“${imageKeyword}”。
         请扮演一位高雅的艺术鉴赏家或禅宗大师。用中文提供一句深刻或诗意的评论，关于这幅画面、拼图的过程或完成时的心境。
         保持在30个字以内。风格要优雅、深邃。`
      : `The user has just completed a jigsaw puzzle level titled "${levelName}" featuring an image of "${imageKeyword}".
         Act as a sophisticated art critic or a zen master. Provide a 1-sentence profound or poetic commentary about the image, the act of putting pieces together, or the feeling of completion. 
         Keep it under 25 words. Be elegant.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return fallback;
  }
};