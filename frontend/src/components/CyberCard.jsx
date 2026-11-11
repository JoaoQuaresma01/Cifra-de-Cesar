import React from 'react';

export default function CyberCard({
  title,
  subtitle,
  tag = 'SYS.PROTOCOL',
  children,
  className = '',
  accent = 'cyan', // 'cyan', 'yellow', 'red'
  actions
}) {
  const accentBorder = {
    cyan: 'border-cyber-cyan/30 hover:border-cyber-cyan/60',
    yellow: 'border-cyber-yellow/30 hover:border-cyber-yellow/60',
    red: 'border-cyber-red/30 hover:border-cyber-red/60'
  };

  const accentTag = {
    cyan: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/40',
    yellow: 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/40',
    red: 'bg-cyber-red/10 text-cyber-red border-cyber-red/40'
  };

  return (
    <div
      className={`
        relative bg-[#0b0b12] border transition-all duration-300 p-6 md:p-8
        shadow-2xl shadow-black/80
        ${accentBorder[accent] || accentBorder.cyan}
        ${className}
      `}
    >
      {/* Decorative technical corner marks */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-yellow pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-yellow pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-yellow pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-yellow pointer-events-none"></div>

      {/* Header bar if title exists */}
      {(title || subtitle || tag) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 mb-6 border-b border-cyber-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${accentTag[accent]}`}>
                // {tag}
              </span>
            </div>
            {title && (
              <h2 className="text-xl md:text-2xl font-display font-bold uppercase tracking-wider text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-cyber-muted font-mono mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {children}
    </div>
  );
}

