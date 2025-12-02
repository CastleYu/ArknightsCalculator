
import { GoogleGenAI } from "@google/genai";
import { CalculationResult, EnemyStats, OperatorStats, Debuffs, SkillHit, ShredType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCombatData = async (
  op: OperatorStats,
  hits: SkillHit[],
  enemy: EnemyStats,
  debuffs: Debuffs,
  result: CalculationResult
): Promise<string> => {
  
  const hitsDescription = hits.map((h, i) => 
    `   - 攻击${i+1}: 类型[${h.damageType}], 连击[${h.hits}], 当次倍率[${h.atkMod}%], 独立倍率[${h.dmgScale}%]`
  ).join('\n');

  const fragileDesc = debuffs.fragiles.length > 0 
    ? debuffs.fragiles.map(f => `+${f}%`).join(' * ') 
    : '无';

  // Helper to format shred items
  const formatShreds = (items: { type: ShredType; value: number }[]) => {
      if (!items || items.length === 0) return '无';
      return items.map(item => {
          const isPercent = item.type === ShredType.PERCENT;
          return `${item.type}${item.value}${isPercent ? '%' : ''}`;
      }).join(' -> ');
  };

  const defShredsDesc = formatShreds(debuffs.defShreds);
  const resShredsDesc = formatShreds(debuffs.resShreds);

  const prompt = `

  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "",
      }
    });
    
    return response.text || "系统错误：无法生成战术报告。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "连接失败：离线模式已激活。无法进行分析。";
  }
};