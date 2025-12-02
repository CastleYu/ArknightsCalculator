import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultChartProps {
  data: { time: number; damage: number }[];
}

export const ResultChart: React.FC<ResultChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full bg-arknights-panel border border-arknights-border relative overflow-hidden">
      <div className="absolute top-0 left-0 bg-arknights-yellow text-black text-[10px] px-1 font-bold font-mono z-10">
        输出曲线监测 // DMG_VISUALIZER
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorDmg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#52525b" 
            tick={{fill: '#52525b', fontSize: 10, fontFamily: 'Roboto Mono'}} 
            tickFormatter={(val) => `${val}s`}
          />
          <YAxis 
            stroke="#52525b" 
            tick={{fill: '#52525b', fontSize: 10, fontFamily: 'Roboto Mono'}}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0e0e10', border: '1px solid #fbbf24', borderRadius: '0px' }}
            itemStyle={{ color: '#fbbf24', fontFamily: 'Roboto Mono' }}
            labelStyle={{ color: '#e4e4e7', fontFamily: 'Noto Sans SC', fontWeight: 'bold' }}
            cursor={{ stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' }}
            formatter={(value: number) => [value, '累计伤害']}
            labelFormatter={(label) => `时间: ${label}秒`}
          />
          <Area 
            type="monotone" 
            dataKey="damage" 
            stroke="#fbbf24" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorDmg)" 
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};