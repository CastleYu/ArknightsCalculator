import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InputGroup } from './components/InputGroup';
import { OperatorStats, EnemyStats, Debuffs, DamageType, CalculationResult, SkillHit, AppState, ShredItem, ShredType, SkillMode, SkillConfig } from './types';

// Icons
const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const IconArrowUp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

const IconArrowDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const IconSave = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const IconLoad = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

const IconPlay = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
);

// Updated Interval Templates based on Arknights archetypes
const INTERVAL_TEMPLATES = [
    { value: 0.78, desc: '斗士' },
    { value: 0.85, desc: '陷阱师' },
    { value: 0.93, desc: '处决者' },
    { value: 1.0, desc: '冲锋手、战术家、情报官、速射手、回环射手、行商' },
    { value: 1.05, desc: '尖兵、教官' },
    { value: 1.2, desc: '策士、强攻手、解放者、本源近卫、铁卫、守护者、哨戒铁卫、推击手、傀儡师' },
    { value: 1.25, desc: '术战者、武者' },
    { value: 1.3, desc: '执旗手、领主、剑豪、收割者、驭械术师、吟游者、怪杰' },
    { value: 1.5, desc: '无畏者、工匠、巡空者、炼金师' },
    { value: 1.6, desc: '不屈者、驭法铁卫、决战者、本源铁卫、重射手、猎手、中坚术师、本源术师、塑灵术师、咒愈师、削弱者、护佑者、召唤师、巫役' },
    { value: 1.8, desc: '撼地者、钩索师' },
    { value: 1.9, desc: '凝滞师' },
    { value: 2.0, desc: '阵法术师' },
    { value: 2.1, desc: '投掷手' },
    { value: 2.2, desc: '' },
    { value: 2.3, desc: '散射手、链术师' },
    { value: 2.4, desc: '攻城手' },
    { value: 2.5, desc: '重剑手' },
    { value: 2.6, desc: '神射手' },
    { value: 2.7, desc: '' },
    { value: 2.8, desc: '要塞、炮手' },
    { value: 2.85, desc: '医师、群愈师、疗养师、行医、链愈师' },
    { value: 2.9, desc: '扩散术师、轰击术师' },
    { value: 3.0, desc: '秘术师' },
    { value: 3.5, desc: '伏击客' },
];

// Helper component for small inputs in tables
const CompactNumberInput: React.FC<{
    value: number;
    onChange: (val: number) => void;
    className?: string;
    min?: number;
}> = ({ value, onChange, className, min }) => {
    const [localValue, setLocalValue] = useState(value.toString());

    useEffect(() => {
        // Sync with parent value unless typing a decimal
        if (parseFloat(localValue) !== value) {
            setLocalValue(value.toString());
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value;
        // Strip leading zeros
        if (raw.length > 1 && raw.startsWith('0') && raw[1] !== '.') {
            raw = raw.replace(/^0+/, '');
            if (raw === '') raw = '0';
        }
        setLocalValue(raw);
        const parsed = parseFloat(raw);
        onChange(isNaN(parsed) ? 0 : parsed);
    };

    const handleBlur = () => {
        setLocalValue(value.toString());
    };

    return (
        <input 
            type="number"
            className={className}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            min={min}
        />
    );
}

const App: React.FC = () => {
  // --- State ---
  const [opStats, setOpStats] = useState<OperatorStats>({
    atk: 0,
    atkFlat: 0,
    globalAtkMod: 0,
    atkFlatFinal: 0,
    interval: 0, // Default to 0 as requested
    intervalMod: 0,
    atkSpeed: 0,
  });

  const [skillHits, setSkillHits] = useState<SkillHit[]>([
    { id: '1', name: '基础攻击', atkMod: 100, dmgScale: 100, hits: 1, damageType: DamageType.PHYSICAL }
  ]);

  const [skillConfig, setSkillConfig] = useState<SkillConfig>({
      mode: SkillMode.DURATION, // Default to DURATION
      duration: 0,
      ammoCount: 0
  });

  const [enemyStats, setEnemyStats] = useState<EnemyStats>({
    hp: 10000,
    def: 0,
    res: 0,
    count: 1,
  });

  const [debuffs, setDebuffs] = useState<Debuffs>({
    defShreds: [],
    resShreds: [],
    fragiles: [0],
  });

  const [result, setResult] = useState<CalculationResult>({
    dps: 0,
    dph: 0,
    totalDamage: 0,
    hpPercentage: 0,
    timeToKill: 0,
    damageLog: [],
    isKill: false
  });

  // State for the custom interval input
  const [intervalFocused, setIntervalFocused] = useState(false);
  const [localInterval, setLocalInterval] = useState(opStats.interval.toString());

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Sync local interval with state when it changes externally ---
  useEffect(() => {
    setLocalInterval(prev => {
        const parsed = parseFloat(prev);
        if (!isNaN(parsed) && parsed === opStats.interval) {
            return prev;
        }
        return opStats.interval.toString();
    });
  }, [opStats.interval]);

  // --- Helpers ---
  const generateId = () => Math.random().toString(36).substr(2, 9);
  
  // Hit List Helpers
  const addHit = () => {
    setSkillHits([...skillHits, { 
      id: generateId(), 
      name: `SEQ_${skillHits.length + 1}`, 
      atkMod: 100,
      dmgScale: 100, 
      hits: 1, 
      damageType: DamageType.PHYSICAL 
    }]);
  };
  const removeHit = (id: string) => {
    if (skillHits.length > 1) setSkillHits(skillHits.filter(h => h.id !== id));
  };
  const updateHit = (id: string, field: keyof SkillHit, value: any) => {
    setSkillHits(skillHits.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  // Shred List Helpers
  const addShred = (target: 'defShreds' | 'resShreds') => {
      setDebuffs({
          ...debuffs,
          [target]: [...debuffs[target], { id: generateId(), type: ShredType.PERCENT, value: 0 }]
      });
  };
  const updateShred = (target: 'defShreds' | 'resShreds', index: number, field: keyof ShredItem, value: any) => {
      const newList = [...debuffs[target]];
      newList[index] = { ...newList[index], [field]: value };
      setDebuffs({ ...debuffs, [target]: newList });
  };
  const removeShred = (target: 'defShreds' | 'resShreds', index: number) => {
      const newList = [...debuffs[target]];
      newList.splice(index, 1);
      setDebuffs({ ...debuffs, [target]: newList });
  };
  const moveShred = (target: 'defShreds' | 'resShreds', index: number, direction: 'up' | 'down') => {
      const newList = [...debuffs[target]];
      if (direction === 'up' && index > 0) {
          [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
      } else if (direction === 'down' && index < newList.length - 1) {
          [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
      }
      setDebuffs({ ...debuffs, [target]: newList });
  };

  // Fragile Helpers
  const addFragile = () => setDebuffs({ ...debuffs, fragiles: [...debuffs.fragiles, 0] });
  const removeFragile = (index: number) => {
    const newF = [...debuffs.fragiles];
    newF.splice(index, 1);
    setDebuffs({ ...debuffs, fragiles: newF });
  };
  const updateFragile = (index: number, val: number) => {
    const newF = [...debuffs.fragiles];
    newF[index] = val;
    setDebuffs({ ...debuffs, fragiles: newF });
  };

  // --- Core Calculation ---
  const calculate = useCallback(() => {
    // 1. Operator Panel Attack
    const baseAtk = (opStats.atk + opStats.atkFlat);

    // 2. Interval & Frequency
    // Formula: RealInterval = (BaseInterval + IntervalMod) / ((100 + ASPD) / 100)
    const spdScale = Math.max(10, 100 + opStats.atkSpeed) / 100;
    const baseIntervalCombined = opStats.interval + opStats.intervalMod;
    
    // Safety check for calculation: if base interval configured is 0, we can't really do DPS
    const isIntervalValid = opStats.interval > 0;
    const realInterval = isIntervalValid ? Math.max(0.033, baseIntervalCombined / spdScale) : 0;
    const frequency = realInterval > 0 ? 1 / realInterval : 0;

    // 3. Enemy Mitigation (Pipeline Processing)
    let finalDef = enemyStats.def;
    let finalRes = enemyStats.res;

    debuffs.defShreds.forEach(shred => {
        if (shred.type === ShredType.PERCENT) {
            finalDef = finalDef * (1 - shred.value / 100);
        } else {
            finalDef = finalDef - shred.value;
        }
    });

    debuffs.resShreds.forEach(shred => {
        if (shred.type === ShredType.PERCENT) {
            finalRes = finalRes * (1 - shred.value / 100);
        } else {
            finalRes = finalRes - shred.value;
        }
    });

    finalDef = Math.max(0, finalDef);
    finalRes = Math.max(0, Math.min(100, finalRes));

    // 4. Fragile Multiplier
    const fragileMult = debuffs.fragiles.reduce((acc, val) => acc * (1 + val / 100), 1);

    // 5. Calculate Cycle Damage (One full attack sequence)
    let damagePerSequence = 0;

    skillHits.forEach(hit => {
        // Calculate Attack Power in steps
        // Step A: Base Panel (Base + Flat) * Global%
        const panelAtkBeforeFinalFlat = baseAtk * (1 + opStats.globalAtkMod / 100);
        
        // Step B: Add Global Final Flat
        const panelAtk = panelAtkBeforeFinalFlat + opStats.atkFlatFinal;
        
        // Step C: Apply Hit Specific Atk Mod %
        const atkAfterHitMod = panelAtk * (hit.atkMod / 100);

        // Step D: Apply Damage Scale %
        const hitAtkPower = atkAfterHitMod * (hit.dmgScale / 100);
        
        let damagePerHit = 0;

        if (hit.damageType === DamageType.PHYSICAL) {
            damagePerHit = Math.max(hitAtkPower * 0.05, hitAtkPower - finalDef);
        } else if (hit.damageType === DamageType.ARTS) {
            damagePerHit = Math.max(hitAtkPower * 0.05, hitAtkPower * (1 - finalRes / 100));
        } else {
            damagePerHit = hitAtkPower;
        }

        damagePerHit *= fragileMult;
        damagePerSequence += damagePerHit * hit.hits;
    });

    // 6. Calculate DPS
    const dps = isIntervalValid ? damagePerSequence * frequency : 0;

    // 7. Calculate Total Damage & TTK based on Mode
    let totalDamage = 0;
    let duration = 0;
    let timeToKill = Infinity;
    let isKill = false;

    if (skillConfig.mode === SkillMode.DURATION) {
        duration = skillConfig.duration;
        // If interval is valid, use dps * duration
        // If interval is 0, we can't calculate total damage over duration via DPS logic, unless we treat it as infinite frequency (crash) or 0.
        // If user is just checking DPH, total damage over time is irrelevant or 0.
        totalDamage = dps * duration;
    } else if (skillConfig.mode === SkillMode.AMMO) {
        // Assume 1 ammo = 1 full sequence
        // Duration only valid if realInterval > 0
        duration = realInterval > 0 ? realInterval * skillConfig.ammoCount : 0;
        totalDamage = damagePerSequence * skillConfig.ammoCount;
    } else {
        // Infinite
        totalDamage = 0; // Or indicate infinity
    }

    const hpPercentage = enemyStats.hp > 0 ? (totalDamage / enemyStats.hp) * 100 : 0;
    const baseTTK = (enemyStats.hp > 0 && dps > 0) ? enemyStats.hp / dps : 0;

    if (skillConfig.mode === SkillMode.INFINITE) {
        timeToKill = (dps > 0) ? baseTTK : Infinity;
        isKill = dps > 0; // Infinite eventually kills if dps > 0
    } else {
        if (totalDamage >= enemyStats.hp) {
            timeToKill = baseTTK;
            isKill = true;
        } else {
            timeToKill = Infinity; // MAX
            isKill = false;
        }
    }

    // 8. Log Generation (Simplified without chart)
    const log = [];
    
    setResult({
        dps,
        dph: damagePerSequence,
        totalDamage,
        hpPercentage,
        timeToKill,
        damageLog: log,
        isKill
    });

  }, [opStats, skillHits, enemyStats, debuffs, skillConfig]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  // --- Import/Export ---
  const handleDownload = () => {
      const state: AppState = { opStats, skillHits, enemyStats, debuffs, skillConfig };
      const json = JSON.stringify(state, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arknights_config_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const json = event.target?.result as string;
              const state: AppState = JSON.parse(json);
              
              if(state.opStats) {
                  // Ensure intervalMod exists for backward compatibility
                  setOpStats({ ...state.opStats, intervalMod: state.opStats.intervalMod || 0 });
              }
              if(state.skillHits) setSkillHits(state.skillHits);
              if(state.enemyStats) setEnemyStats(state.enemyStats);
              if(state.debuffs) setDebuffs(state.debuffs);
              if(state.skillConfig) setSkillConfig(state.skillConfig);
          } catch (e) {
              alert("无效的配置文件 (Invalid JSON)");
          }
      };
      reader.readAsText(file);
      e.target.value = ''; // Reset input
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleRunScript = () => {
      // Demo Script: "Rapid Fire Extermination"
      // Simulating a fast-attacking physical sniper with buffs against a high def enemy
      
      setOpStats({
        atk: 630,
        atkFlat: 0,
        globalAtkMod: 6, // Talent
        atkFlatFinal: 280, // Bard buff
        interval: 1.0,
        intervalMod: -0.11, // Attack interval reduction
        atkSpeed: 15, // Attack speed +
      });

      setSkillHits([
        { 
            id: generateId(), 
            name: '过载连射', 
            atkMod: 110, // 110% attack
            dmgScale: 100, 
            hits: 5, // 5 hits per attack
            damageType: DamageType.PHYSICAL 
        }
      ]);

      setSkillConfig({
          mode: SkillMode.DURATION,
          duration: 15,
          ammoCount: 0
      });

      setEnemyStats({
        hp: 80000,
        def: 2000, // High defense
        res: 0,
        count: 1,
      });

      setDebuffs({
        defShreds: [{ id: generateId(), type: ShredType.PERCENT, value: 40 }], // -40% DEF
        resShreds: [],
        fragiles: [30], // +30% Fragile
      });
  };

  // --- Components for Shred Lists ---
  const ShredList = ({ 
      title, 
      list, 
      target 
  }: { 
      title: string, 
      list: ShredItem[], 
      target: 'defShreds' | 'resShreds' 
  }) => (
      <div className="bg-arknights-surface border border-arknights-dim/30 p-3">
          <div className="flex justify-between items-center mb-2 border-b border-arknights-dim/30 pb-1">
              <span className="text-[10px] uppercase text-arknights-dim font-bold">{title}</span>
              <button onClick={() => addShred(target)} className="text-arknights-yellow hover:text-white"><IconPlus /></button>
          </div>
          {list.length === 0 && <div className="text-[10px] text-arknights-dim/50 text-center py-2">无削弱条目</div>}
          <div className="space-y-1">
              {list.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-1 bg-black/20 p-1 group">
                      <span className="text-[9px] font-mono text-arknights-dim w-4 text-center">{index+1}</span>
                      <button
                          onClick={() => updateShred(target, index, 'type', item.type === ShredType.PERCENT ? ShredType.FLAT : ShredType.PERCENT)}
                          className="bg-transparent text-[10px] text-arknights-yellow border border-arknights-dim/50 outline-none w-16 py-0.5 hover:bg-arknights-yellow hover:text-black transition-colors"
                      >
                          {item.type}
                      </button>
                      
                      <CompactNumberInput 
                        value={item.value} 
                        onChange={(val) => updateShred(target, index, 'value', val)}
                        className="w-16 bg-transparent text-sm font-mono text-white text-right border-b border-arknights-dim focus:border-arknights-yellow outline-none"
                      />
                      
                      <span className="text-[10px] text-arknights-dim w-4">{item.type === ShredType.PERCENT ? '%' : ''}</span>
                      
                      <div className="flex ml-auto gap-0.5 opacity-20 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveShred(target, index, 'up')} className="p-1 hover:bg-arknights-dim/30 hover:text-arknights-yellow"><IconArrowUp /></button>
                          <button onClick={() => moveShred(target, index, 'down')} className="p-1 hover:bg-arknights-dim/30 hover:text-arknights-yellow"><IconArrowDown /></button>
                          <button onClick={() => removeShred(target, index)} className="p-1 hover:bg-red-900/50 hover:text-red-500"><IconTrash /></button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  // Logic for custom interval input showing label
  const showIntervalLabel = intervalFocused || opStats.interval !== 0;

  return (
    <div className="min-h-screen bg-arknights-dark text-arknights-text font-sans bg-grid-pattern bg-[length:40px_40px] selection:bg-arknights-yellow selection:text-black flex flex-col">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileImport} 
        className="hidden" 
        accept=".json"
      />

      {/* Header */}
      <header className="border-b border-arknights-border bg-arknights-dark/90 backdrop-blur-md sticky top-0 z-50 h-14 flex-none">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-arknights-yellow clip-corner-br flex items-center justify-center">
               <span className="font-bold text-black font-mono text-xs">AK</span>
            </div>
            <h1 className="text-lg font-bold tracking-widest uppercase font-sans">
              伤害模拟<span className="text-arknights-yellow">终端</span> V3.4
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow items-start">
        
        {/* --- Column 1: Configuration (Span 4) --- */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Basic Config */}
          <section className="bg-arknights-panel p-4 tech-border shadow-lg">
            <h2 className="text-xs font-bold text-arknights-yellow uppercase tracking-widest border-b border-arknights-yellow/30 pb-2 mb-4">
               基础规格 // BASIC_SPECS
            </h2>
            <div className="grid grid-cols-1 gap-2 mb-4">
              <InputGroup 
                  label="基础攻击力" 
                  value={opStats.atk} 
                  onChange={(v) => setOpStats({...opStats, atk: v})} 
                  onReset={() => setOpStats({...opStats, atk: 0})}
                  suffix="ATK"
              />
              <InputGroup 
                  label="白值加成" 
                  value={opStats.atkFlat} 
                  onChange={(v) => setOpStats({...opStats, atkFlat: v})} 
                  onReset={() => setOpStats({...opStats, atkFlat: 0})}
                  suffix="+" 
              />
              
              {/* Custom Interval Input Group with adapted logic */}
              <div className="group relative bg-arknights-surface p-3 border-l-2 border-arknights-dim hover:border-arknights-text transition-all duration-300">
                   <div className={`flex justify-between items-center mb-1 h-4 transition-opacity duration-200 ${showIntervalLabel ? 'opacity-100' : 'opacity-0'}`}>
                      <label className="block text-[10px] uppercase tracking-widest text-arknights-dim group-hover:text-arknights-yellow font-bold font-mono">
                        基础攻击间隔 (秒)
                      </label>
                   </div>
                   <div className="flex items-end gap-2">
                       <div className="flex-grow relative">
                           {/* Manually implement placeholder logic here since CompactNumberInput is simple */}
                           <input 
                              type="number"
                              value={!intervalFocused && opStats.interval === 0 ? '' : localInterval}
                              onChange={(e) => {
                                let raw = e.target.value;
                                // Automatically remove leading zeros unless it is "0."
                                if (raw.length > 1 && raw.startsWith('0') && raw[1] !== '.') {
                                    raw = raw.replace(/^0+/, '');
                                    if (raw === '') raw = '0';
                                }
                                setLocalInterval(raw);
                                
                                let val = parseFloat(raw);
                                if (isNaN(val)) val = 0;
                                setOpStats(prev => ({...prev, interval: val}));
                              }}
                              onFocus={() => setIntervalFocused(true)}
                              onBlur={() => {
                                  setIntervalFocused(false);
                                  setLocalInterval(opStats.interval.toString());
                              }}
                              placeholder={!showIntervalLabel ? "基础攻击间隔 (秒)" : ""}
                              className={`w-full bg-transparent font-sans text-xl font-bold focus:outline-none placeholder-arknights-dim/40 transition-colors pb-1 text-arknights-text`}
                           />
                       </div>
                       
                       <div className={`relative w-28 flex-shrink-0 transition-opacity duration-200`}>
                           <select 
                              className="w-full bg-black/20 border border-arknights-dim/30 text-arknights-dim text-[10px] py-1.5 px-2 focus:border-arknights-yellow outline-none appearance-none hover:bg-black/40 transition-colors cursor-pointer"
                              onChange={(e) => {
                                   const val = parseFloat(e.target.value);
                                   if (val > 0) setOpStats({...opStats, interval: val});
                                   e.target.value = "0"; 
                              }}
                              value={0}
                           >
                              <option value={0}>▼ 模板参考</option>
                              {INTERVAL_TEMPLATES.map(p => (
                                  <option key={p.value} value={p.value} title={p.desc}>
                                      {p.value}s
                                  </option>
                              ))}
                           </select>
                       </div>
                   </div>
                   {/* Decorative corner */}
                   <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-arknights-yellow transition-colors duration-300 opacity-50" />
              </div>

            </div>
          </section>

          {/* Skill Inherent Config */}
          <section className="bg-arknights-panel p-4 border border-arknights-border">
            <h2 className="text-xs font-bold text-white uppercase tracking-widest border-b border-arknights-border pb-2 mb-4">
               技能固有 // SKILL_CONFIG
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <InputGroup 
                    label="攻击力加成%" 
                    value={opStats.globalAtkMod} 
                    onChange={(v) => setOpStats({...opStats, globalAtkMod: v})} 
                    onReset={() => setOpStats({...opStats, globalAtkMod: 0})}
                    suffix="%" 
                />
              </div>
              <div className="col-span-2">
                <InputGroup 
                    label="鼓舞加成" 
                    value={opStats.atkFlatFinal} 
                    onChange={(v) => setOpStats({...opStats, atkFlatFinal: v})} 
                    onReset={() => setOpStats({...opStats, atkFlatFinal: 0})}
                    suffix="+" 
                />
              </div>
              <InputGroup 
                  label="攻速修正(秒)" 
                  value={opStats.intervalMod} 
                  onChange={(v) => setOpStats({...opStats, intervalMod: v})} 
                  onReset={() => setOpStats({...opStats, intervalMod: 0})}
                  suffix="sec"
                  step={0.1}
              />
              <InputGroup 
                  label="攻速加成" 
                  value={opStats.atkSpeed} 
                  onChange={(v) => setOpStats({...opStats, atkSpeed: v})} 
                  onReset={() => setOpStats({...opStats, atkSpeed: 0})}
                  suffix="%" 
              />
            </div>
          </section>

          {/* Skill Mode Block */}
          <section className="bg-arknights-panel p-4 border border-arknights-border h-fit">
              <h2 className="text-xs font-bold text-white uppercase tracking-widest border-b border-arknights-border pb-2 mb-4">
                  技能形态 // MODE
              </h2>
              <div className="flex bg-black/30 p-1 mb-4">
                  {Object.values(SkillMode).map(mode => (
                      <button 
                        key={mode} 
                        onClick={() => setSkillConfig({...skillConfig, mode})}
                        className={`flex-1 text-[10px] py-2 font-mono transition-colors ${skillConfig.mode === mode ? 'bg-arknights-yellow text-black font-bold' : 'text-arknights-dim hover:text-white'}`}
                      >
                          {mode}
                      </button>
                  ))}
              </div>
              <div className="grid grid-cols-1 gap-3">
                  {skillConfig.mode === SkillMode.DURATION && (
                      <InputGroup 
                          label="持续时间" 
                          value={skillConfig.duration} 
                          onChange={(v) => setSkillConfig({...skillConfig, duration: v})} 
                          suffix="sec"
                      />
                  )}
                  {skillConfig.mode === SkillMode.AMMO && (
                      <InputGroup 
                          label="弹药/次数" 
                          value={skillConfig.ammoCount} 
                          onChange={(v) => setSkillConfig({...skillConfig, ammoCount: v})} 
                          suffix="count"
                      />
                  )}
                  {skillConfig.mode === SkillMode.INFINITE && (
                      <div className="text-center py-2 border border-dashed border-arknights-dim/50 text-arknights-dim text-[10px] font-mono">
                          -- 永续模式 --
                      </div>
                  )}
              </div>
          </section>
        </div>

        {/* --- Column 2: Interaction (Span 4) - Sequence & Environment --- */}
        <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Attack Sequence */}
            <section className="bg-arknights-panel p-4 border border-arknights-border">
                <div className="flex justify-between items-center border-b border-arknights-border pb-2 mb-4">
                    <h2 className="text-xs font-bold text-white uppercase tracking-widest">
                    攻击序列 // ATTACK_SEQUENCE
                    </h2>
                    <button onClick={addHit} className="p-1 hover:text-arknights-yellow transition-colors bg-arknights-surface border border-arknights-dim/50"><IconPlus /></button>
                </div>
                <div className="space-y-2">
                    {skillHits.map((hit, index) => (
                        <div key={hit.id} className="bg-arknights-surface p-3 border-l-2 border-arknights-dim hover:border-arknights-yellow transition-colors relative group">
                            <div className="flex justify-between items-center mb-3 border-b border-arknights-dim/20 pb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono text-arknights-dim">#{index + 1}</span>
                                    <input 
                                        value={hit.name} 
                                        onChange={(e) => updateHit(hit.id, 'name', e.target.value)}
                                        className="text-xs font-mono text-arknights-yellow bg-transparent border-none outline-none w-32 font-bold"
                                    />
                                </div>
                                {skillHits.length > 1 && (
                                    <button onClick={() => removeHit(hit.id)} className="text-arknights-dim hover:text-red-500 opacity-50 group-hover:opacity-100"><IconTrash /></button>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="text-[9px] text-arknights-yellow font-bold block uppercase">攻击力提升为%</label>
                                    <div className="flex items-center bg-black/30 p-1">
                                        <CompactNumberInput 
                                            value={hit.atkMod}
                                            onChange={(val) => updateHit(hit.id, 'atkMod', val)}
                                            className="w-full bg-transparent text-arknights-text text-sm font-mono focus:border-arknights-yellow outline-none text-right pr-2"
                                        />
                                        <span className="text-[10px] text-arknights-dim border-l border-arknights-dim/30 pl-2">%</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] text-arknights-yellow font-bold block uppercase">伤害倍率%</label>
                                    <div className="flex items-center bg-black/30 p-1">
                                        <CompactNumberInput 
                                            value={hit.dmgScale}
                                            onChange={(val) => updateHit(hit.id, 'dmgScale', val)}
                                            className="w-full bg-transparent text-arknights-text text-sm font-mono focus:border-arknights-yellow outline-none text-right pr-2"
                                        />
                                        <span className="text-[10px] text-arknights-dim border-l border-arknights-dim/30 pl-2">%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 items-end">
                                <div className="w-20">
                                    <label className="text-[9px] text-arknights-yellow font-bold block uppercase">Hit数</label>
                                    <div className="bg-black/30 p-1">
                                        <CompactNumberInput 
                                            value={hit.hits}
                                            onChange={(val) => updateHit(hit.id, 'hits', val)}
                                            min={1}
                                            className="w-full bg-transparent text-arknights-text text-sm font-mono outline-none text-center"
                                        />
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <label className="text-[9px] text-arknights-yellow font-bold block uppercase mb-1">伤害类型</label>
                                    <div className="flex bg-black/30">
                                        {Object.values(DamageType).map(t => {
                                            // Color coding for damage types
                                            let activeClass = '';
                                            if (hit.damageType === t) {
                                                if (t === DamageType.PHYSICAL) activeClass = 'bg-orange-600 text-white font-bold shadow-md';
                                                else if (t === DamageType.ARTS) activeClass = 'bg-blue-600 text-white font-bold shadow-md';
                                                else if (t === DamageType.TRUE) activeClass = 'bg-white text-black font-bold shadow-md';
                                            } else {
                                                activeClass = 'text-arknights-dim hover:text-white';
                                            }
                                            
                                            return (
                                                <button key={t} onClick={() => updateHit(hit.id, 'damageType', t)} 
                                                    className={`flex-1 text-[10px] py-1.5 uppercase tracking-wide transition-all ${activeClass}`}>
                                                    {t}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

             {/* Debuff Pipeline & Environment (Moved to Center Column) */}
             <section className="bg-arknights-panel p-4 border border-arknights-border relative">
                <h2 className="text-xs font-bold text-white uppercase tracking-widest border-b border-arknights-border pb-2 mb-4">
                  环境与削弱 // ENV_DEBUFF
                </h2>
                
                {/* Target Stats */}
                <div className="mb-4 bg-black/20 p-2 border border-arknights-dim/20">
                    <label className="text-[10px] uppercase text-arknights-dim font-bold block mb-2">目标状态 // TARGET</label>
                    <div className="space-y-2">
                        <InputGroup 
                            label="生命值 HP" 
                            value={enemyStats.hp} 
                            onChange={(v) => setEnemyStats({...enemyStats, hp: v})} 
                            onReset={() => setEnemyStats({...enemyStats, hp: 10000})}
                            step={1000}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <InputGroup 
                                label="防御力 DEF" 
                                value={enemyStats.def} 
                                onChange={(v) => setEnemyStats({...enemyStats, def: v})} 
                                onReset={() => setEnemyStats({...enemyStats, def: 0})}
                            />
                            <InputGroup 
                                label="法术抗性 RES" 
                                value={enemyStats.res} 
                                max={100} 
                                onChange={(v) => setEnemyStats({...enemyStats, res: v})} 
                                onReset={() => setEnemyStats({...enemyStats, res: 0})}
                                suffix="%" 
                            />
                        </div>
                    </div>
                </div>

                {/* Shreds */}
                <div className="space-y-4">
                    <ShredList title="防御削弱 (DEF)" list={debuffs.defShreds} target="defShreds" />
                    <ShredList title="抗性削弱 (RES)" list={debuffs.resShreds} target="resShreds" />

                    <div className="mt-4 border-t border-arknights-border pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-[10px] uppercase text-arknights-dim font-bold">脆弱乘区</label>
                            <button onClick={addFragile} className="text-arknights-yellow hover:text-white"><IconPlus /></button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {debuffs.fragiles.map((val, idx) => (
                                <div key={idx} className="relative group">
                                    <InputGroup label={`脆弱${idx+1}`} value={val} onChange={(v) => updateFragile(idx, v)} suffix="%" />
                                    <button onClick={() => removeFragile(idx)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-arknights-surface border border-arknights-dim hover:border-red-500 hover:text-red-500 text-arknights-dim w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10">×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>

        {/* --- Column 3: Analysis & System (Span 4) --- */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Results Dashboard */}
          <section className="bg-arknights-panel border border-arknights-border p-1 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
             <div className="bg-arknights-dark/50 p-3 flex justify-between items-center border-b border-arknights-border mb-1">
                <h3 className="font-mono text-sm text-arknights-dim uppercase tracking-widest font-bold">伤害模拟 // CORE_SIM</h3>
                <div className="flex gap-2 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-arknights-yellow animate-pulse"></div>
                    <span className="text-[10px] text-arknights-yellow font-mono">ONLINE</span>
                </div>
             </div>
             
             <div className="p-5 grid grid-cols-1 gap-6">
                 {/* DPS Display */}
                 <div className="relative group text-center py-2 border border-arknights-yellow/10 bg-arknights-yellow/5">
                    <div className="text-arknights-dim font-mono text-[10px] uppercase mb-1 tracking-widest">平均秒伤 (DPS)</div>
                    <div className="text-6xl font-bold text-arknights-yellow font-sans tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {Math.round(result.dps).toLocaleString()}
                    </div>
                 </div>

                 {/* DPH Display */}
                 <div className="bg-black/20 p-3 border-l-2 border-arknights-yellow/50">
                    <div className="text-arknights-dim font-mono text-[10px] uppercase mb-1">单次总伤 (Cycle Dmg)</div>
                    <div className="text-3xl font-bold text-white font-sans tracking-tight">
                        {Math.round(result.dph).toLocaleString()}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className="bg-black/20 p-3 border-l border-arknights-dim/30">
                        <div className="text-arknights-dim font-mono text-[10px] uppercase mb-1">总伤</div>
                        <div className="text-2xl font-bold text-white font-sans tracking-tight">
                            {skillConfig.mode === SkillMode.INFINITE ? '∞' : Math.round(result.totalDamage).toLocaleString()}
                        </div>
                     </div>
                     <div className="bg-black/20 p-3 border-l border-arknights-dim/30">
                        <div className="text-arknights-dim font-mono text-[10px] uppercase mb-1">HP 削减</div>
                        <div className={`text-2xl font-bold font-sans tracking-tight ${result.hpPercentage >= 100 ? 'text-[#4ade80]' : 'text-arknights-orange'}`}>
                            {skillConfig.mode === SkillMode.INFINITE ? '∞' : `${result.hpPercentage.toFixed(1)}%`}
                        </div>
                     </div>
                 </div>

                 <div className="bg-black/20 p-3 border-l-2 border-arknights-text flex justify-between items-center">
                     <div className="text-arknights-dim font-mono text-[10px] uppercase">击杀时间</div>
                     <div className={`text-3xl font-bold font-sans tracking-tight ${result.isKill ? 'text-white' : 'text-arknights-dim'}`}>
                         {skillConfig.mode === SkillMode.INFINITE ? '∞' : (!result.isKill ? '∞' : `${result.timeToKill.toFixed(2)}s`)}
                     </div>
                 </div>
             </div>
          </section>

          {/* System Menu */}
          <section className="bg-arknights-panel border border-arknights-border p-4">
            <h2 className="text-xs font-bold text-arknights-dim uppercase tracking-widest mb-3">系统 // SYSTEM</h2>
            <div className="flex flex-col gap-3">
                 <button onClick={handleRunScript} className="flex items-center justify-center gap-2 px-3 py-3 text-xs border border-arknights-yellow/40 hover:border-arknights-yellow text-arknights-yellow hover:bg-arknights-yellow/10 transition-all bg-arknights-surface font-mono uppercase group tracking-wider">
                     <IconPlay /> 
                     <span>一键运行脚本</span>
                 </button>
                 <div className="grid grid-cols-2 gap-3">
                     <button onClick={triggerImport} className="flex items-center justify-center gap-2 px-3 py-3 text-xs border border-arknights-dim hover:border-arknights-yellow hover:text-arknights-yellow hover:bg-arknights-yellow/10 transition-all bg-arknights-surface text-arknights-text font-mono uppercase group">
                         <IconLoad /> 
                         <span className="group-hover:tracking-wider transition-all">导入 JSON</span>
                     </button>
                     <button onClick={handleDownload} className="flex items-center justify-center gap-2 px-3 py-3 text-xs border border-arknights-dim hover:border-arknights-yellow hover:text-arknights-yellow hover:bg-arknights-yellow/10 transition-all bg-arknights-surface text-arknights-text font-mono uppercase group">
                         <IconSave /> 
                         <span className="group-hover:tracking-wider transition-all">导出 JSON</span>
                     </button>
                 </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;