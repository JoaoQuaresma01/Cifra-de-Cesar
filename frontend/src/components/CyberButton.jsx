import React from 'react';
import { playBeep } from '../utils/audio';

export default function CyberButton({
  children,
  onClick,
  variant = 'yellow',
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon
}) {
  const handleClick = (e) => {
    if (!disabled) {
      playBeep(variant === 'red' ? 440 : 880);
      if (onClick) onClick(e);
    }
  };

  const variantStyles = {
    yellow:
      'bg-cyber-yellow text-black font-bold border-2 border-cyber-yellow hover:bg-black hover:text-cyber-yellow hover:shadow-neon-yellow',
    cyan:
      'bg-cyber-cyan text-black font-bold border-2 border-cyber-cyan hover:bg-black hover:text-cyber-cyan hover:shadow-neon-cyan',
    red:
      'bg-cyber-red text-white font-bold border-2 border-cyber-red hover:bg-black hover:text-cyber-red hover:shadow-neon-red',
    outline:
      'bg-transparent text-gray-200 border-2 border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan hover:bg-cyber-cyan/10',
    ghost:
      'bg-transparent text-gray-400 hover:text-cyber-yellow hover:bg-white/5 border border-transparent'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`
        relative px-6 py-3 font-display uppercase tracking-widest text-sm transition-all duration-200
        clip-cyber-btn flex items-center justify-center gap-2 select-none
        ${variantStyles[variant] || variantStyles.yellow}
        ${disabled ? 'opacity-40 cursor-not-allowed filter grayscale' : 'cursor-pointer active:scale-95'}
        ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
}

