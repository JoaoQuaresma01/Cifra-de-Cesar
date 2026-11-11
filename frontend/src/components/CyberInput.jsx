import React from 'react';
import { playKeystroke } from '../utils/audio';

export default function CyberInput({
  label,
  sublabel,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  multiline = false,
  rows = 4,
  className = '',
  disabled = false,
  min,
  max,
  step
}) {
  const handleKeyDown = () => {
    playKeystroke();
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={id} className="text-xs uppercase tracking-wider font-display text-cyber-cyan flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyber-cyan inline-block"></span>
            {label}
            {required && <span className="text-cyber-red">*</span>}
          </label>
        )}
        {sublabel && (
          <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">
            // {sublabel}
          </span>
        )}
      </div>

      <div className="relative group">
        {multiline ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={`
              w-full bg-[#0d0d14] border border-cyber-border px-4 py-3 text-sm font-mono text-gray-100
              placeholder-gray-600 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow
              transition-all duration-200 resize-none
              ${error ? 'border-cyber-red focus:border-cyber-red focus:ring-cyber-red' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed bg-black/40' : ''}
            `}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={`
              w-full bg-[#0d0d14] border border-cyber-border px-4 py-3 text-sm font-mono text-gray-100
              placeholder-gray-600 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow
              transition-all duration-200
              ${error ? 'border-cyber-red focus:border-cyber-red focus:ring-cyber-red' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed bg-black/40' : ''}
            `}
          />
        )}
        {/* Decorative corner tag */}
        <div className="absolute right-0 bottom-0 w-2 h-2 border-r border-b border-cyber-yellow pointer-events-none opacity-60"></div>
      </div>

      {error && (
        <span className="text-xs text-cyber-red flex items-center gap-1 font-mono tracking-tight mt-1">
          <span className="font-bold">!</span> {error}
        </span>
      )}
    </div>
  );
}

