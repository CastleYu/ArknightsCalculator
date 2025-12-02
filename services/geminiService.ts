
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
  作为终末地工业（arknights Industries）的战术AI顾问，请基于以下复杂战斗模型进行分析。
  语气要求：工业冷淡、硬核、数据化。使用中文。

  [源石技艺/武装配置]
  - 基础攻击: ${op.atk} (+${op.atkFlat})
  - 全局攻击加成: +${op.globalAtkMod}%
  - 全局最终加算: +${op.atkFlatFinal}
  - 攻击间隔: ${op.interval}s (攻速修正: +${op.atkSpeed})
  - 攻击序列配置:
${hitsDescription}

  [目标环境]
  - 敌方状态: HP ${enemy.hp} / DEF ${enemy.def} / RES ${enemy.res}
  - 削弱策略: 减防[${defShredsDesc}], 减抗[${resShredsDesc}] (按列表顺序结算)
  - 易伤乘区: ${fragileDesc}

  [模拟结果]
  - 单次总伤 (Cycle Dmg/DPH): ${Math.round(result.dph).toLocaleString()}
  - 循环总伤 (Total Dmg): ${Math.round(result.totalDamage).toLocaleString()}
  - 秒伤 (DPS): ${Math.round(result.dps).toLocaleString()}
  - 击杀时间 (TTK): ${result.timeToKill === Infinity ? '无法击杀' : result.timeToKill.toFixed(2) + 's'}

  [分析指令]
  1. 分析该技能组的伤害构成（物理/法术占比，DPH质量），适合对付何种防御类型的敌人。
  2. 评价当前的削弱（破甲/减抗）与易伤收益是否溢出或不足。
  3. 对攻击序列的爆发力与持续输出能力进行综合评级（D到S）。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "你是由终末地工业构建的自动化战术分析系统（T.A.S.）。你的输出应使用中文，包含技术术语、项目符号，并保持冷静、专业的科幻UI人格。",
      }
    });
    
    return response.text || "系统错误：无法生成战术报告。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "连接失败：离线模式已激活。无法进行分析。";
  }
};