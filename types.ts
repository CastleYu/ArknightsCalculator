
export enum DamageType {
    PHYSICAL = '物理',
    ARTS = '法术',
    TRUE = '真实'
}

export enum SkillMode {
    DURATION = '时间型', // Duration based (e.g., 20s duration)
    AMMO = '子弹型',     // Ammo based (e.g., 10 shots)
    INFINITE = '永续型'  // Infinite duration
}

export interface SkillHit {
    id: string;
    name?: string; // Optional label for the hit
    atkMod: number; // 当次攻击力乘区 (Total %, default 100)
    dmgScale: number; // 伤害倍率 (Total %, default 100)
    hits: number; // 连击数
    damageType: DamageType;
}

export interface OperatorStats {
    atk: number; // Base ATK
    atkFlat: number; // Flat ATK buff (Potential, Trust, Inspire)
    globalAtkMod: number; // Global ATK % increase (Added %, e.g. 90 for +90%)
    atkFlatFinal: number; // Global Flat ATK added AFTER global % (e.g. +200)
    interval: number; // Attack speed (seconds)
    intervalMod: number; // Attack interval modifier in seconds (e.g. -0.5)
    atkSpeed: number; // Attack Speed value (e.g. +100)
}

export interface SkillConfig {
    mode: SkillMode;
    duration: number; // For DURATION mode
    ammoCount: number; // For AMMO mode
}

export interface EnemyStats {
    hp: number;
    def: number;
    res: number;
    count: number;
}

export enum ShredType {
    FLAT = '数值',
    PERCENT = '百分比'
}

export interface ShredItem {
    id: string;
    type: ShredType;
    value: number;
}

export interface Debuffs {
    defShreds: ShredItem[]; // Ordered list of defense shreds
    resShreds: ShredItem[]; // Ordered list of resistance shreds
    fragiles: number[]; // List of fragile modifiers (%, e.g. [40, 40])
}

export interface CalculationResult {
    dps: number;
    dph: number; // Damage per sequence/hit cycle
    totalDamage: number; // Total damage based on skill mode
    hpPercentage: number; // How much % of enemy HP is shredded
    timeToKill: number; // Can be Infinity if not killed within duration/ammo
    damageLog: { time: number; damage: number }[];
    isKill: boolean; // Helper to determine if enemy dies
}

export interface AppState {
    opStats: OperatorStats;
    skillHits: SkillHit[];
    skillConfig: SkillConfig;
    enemyStats: EnemyStats;
    debuffs: Debuffs;
}
