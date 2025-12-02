import React, { useState, useEffect } from 'react';

const IconReset = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  onReset?: () => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  highlight?: boolean; // Deprecated but kept for compatibility
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, 
  value, 
  onChange, 
  onReset,
  step = 1, 
  min = 0,
  max,
  suffix,
}) => {
  // Local state to manage input string for better UX (preventing cursor jumps and handling '0.' etc.)
  const [localValue, setLocalValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Sync local state with prop value if they are numerically different
    setLocalValue(prev => {
      const parsed = parseFloat(prev);
      if (!isNaN(parsed) && parsed === value) {
        return prev;
      }
      return value.toString();
    });
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Automatically remove leading zeros unless it is "0."
    if (raw.length > 1 && raw.startsWith('0') && raw[1] !== '.') {
      raw = raw.replace(/^0+/, '');
      if (raw === '') raw = '0';
    }

    setLocalValue(raw);

    const parsed = parseFloat(raw);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // On blur, format strictly to the numeric value
    setLocalValue(value.toString());
  };

  // Logic: Show top label if focused OR value is not 0.
  // If value is 0 and not focused, label becomes placeholder.
  const isConfigured = value !== 0;
  const showTopLabel = isFocused || isConfigured;

  return (
    <div className={`group relative bg-arknights-surface p-3 border-l-2 border-arknights-dim hover:border-arknights-text transition-all duration-300`}>
      <div className={`flex justify-between items-center mb-1 h-4 transition-opacity duration-200 ${showTopLabel ? 'opacity-100' : 'opacity-0'}`}>
        <label className={`block text-[10px] uppercase tracking-widest font-bold font-mono text-arknights-dim group-hover:text-arknights-yellow pointer-events-none`}>
          {label}
        </label>
        {onReset && isConfigured && (
            <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent focus accumulation if clicked
                  onReset();
                  setLocalValue('0');
                }}
                className="text-arknights-dim hover:text-arknights-yellow transition-opacity p-0.5"
                title="重置 / Reset"
            >
                <IconReset />
            </button>
        )}
      </div>
      <div className="flex items-center">
        <input
          type="number"
          value={!isFocused && !isConfigured ? '' : localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={!showTopLabel ? label : ''}
          step={step}
          min={min}
          max={max}
          className={`w-full bg-transparent font-sans text-xl font-bold focus:outline-none placeholder-arknights-dim/40 transition-colors text-arknights-text`}
        />
        {suffix && (
          <span className={`text-xs font-mono ml-2 select-none transition-colors text-arknights-dim`}>
            {suffix}
          </span>
        )}
      </div>
      
      {/* Decorative corner */}
      <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-arknights-yellow transition-colors duration-300 opacity-50`} />
    </div>
  );
};