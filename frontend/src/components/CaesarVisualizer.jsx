import React from 'react';

const CHARSET_36 = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

export default function CaesarVisualizer({ step = 0 }) {
  const parsedStep = parseInt(step, 10) || 0;
  const radix = 36;
  const normalizedShift = ((parsedStep % radix) + radix) % radix;

  return (
    <div className="bg-[#06060a] border border-cyber-border/80 p-4 rounded-none overflow-hidden my-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-cyber-yellow animate-pulse"></span>
          <span className="text-xs font-display uppercase tracking-widest text-cyber-yellow font-bold">
            HUD VISUALIZADOR DE DESLOCAMENTO // CIFRA DE CÉSAR ALFANUMÉRICA
          </span>
        </div>
        <div className="text-[11px] font-mono text-gray-400">
          ALFABETO BASE (36 CHARS: a-z, 0-9) | PASSO ATUAL: <span className="text-cyber-cyan font-bold">{parsedStep >= 0 ? `+${parsedStep}` : parsedStep}</span> (MOD 36: <span className="text-cyber-yellow font-bold">{normalizedShift}</span>)
        </div>
      </div>

      {/* Visualizer Tape */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="inline-flex flex-col gap-1 min-w-[720px]">
          {/* Row 1: Original Alphabet */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 w-16 shrink-0 uppercase tracking-tight">ORIGINAL:</span>
            <div className="flex gap-1">
              {CHARSET_36.map((char, index) => {
                const isDigit = char >= '0' && char <= '9';
                return (
                  <div
                    key={`orig-${index}`}
                    className={`w-6 h-7 flex items-center justify-center text-xs font-mono border ${
                      isDigit
                        ? 'border-cyber-yellow/40 bg-cyber-yellow/5 text-cyber-yellow font-bold'
                        : 'border-cyber-cyan/30 bg-cyber-cyan/5 text-cyan-200'
                    }`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 2: Shift Indicator Arrows */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-600 w-16 shrink-0 uppercase tracking-tight">SHIFT:</span>
            <div className="flex gap-1">
              {CHARSET_36.map((_, index) => (
                <div key={`arrow-${index}`} className="w-6 text-center text-[10px] text-gray-600">
                  ↓
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Shifted Alphabet */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-cyber-yellow w-16 shrink-0 uppercase tracking-tight font-bold">CIFRADO:</span>
            <div className="flex gap-1">
              {CHARSET_36.map((_, index) => {
                const shiftedIndex = (index + normalizedShift) % radix;
                const shiftedChar = CHARSET_36[shiftedIndex];
                const isDigit = shiftedChar >= '0' && shiftedChar <= '9';
                return (
                  <div
                    key={`shift-${index}`}
                    className={`w-6 h-7 flex items-center justify-center text-xs font-mono font-bold border transition-colors duration-200 ${
                      isDigit
                        ? 'border-cyber-yellow bg-cyber-yellow/20 text-cyber-yellow'
                        : 'border-cyber-cyan bg-cyber-cyan/20 text-cyber-cyan'
                    }`}
                  >
                    {shiftedChar}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-gray-500 flex flex-wrap gap-4 pt-2 border-t border-cyber-border/40 font-mono">
        <span>• <span className="text-cyan-400">Azul-Ciano</span>: Caracteres Alfabéticos [a-z]</span>
        <span>• <span className="text-yellow-400">Amarelo-Neon</span>: Caracteres Numéricos [0-9]</span>
        <span>• Deslocamento circular com rotação mútua: letras convertem em dígitos e dígitos em letras.</span>
      </div>
    </div>
  );
}

