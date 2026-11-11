import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSoundEnabled, setSoundEnabled, playBeep } from '../utils/audio';
import { Volume2, VolumeX, Monitor, Shield, LogOut, Terminal, Key, Unlock, Lock } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, scanlines, setScanlines }) {
  const { user, logout } = useAuth();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('pt-BR', { hour12: false }) +
          ':' +
          String(now.getMilliseconds()).padStart(3, '0').slice(0, 2)
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 100);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const newState = !soundOn;
    setSoundEnabled(newState);
    setSoundOn(newState);
    if (newState) playBeep(900);
  };

  const handleToggleScanlines = () => {
    playBeep(600);
    setScanlines(!scanlines);
  };

  const navItems = [
    { id: 'encrypt', label: 'Criptografar', code: '01', icon: Lock },
    { id: 'decrypt', label: 'Descriptografar', code: '02', icon: Unlock },
    { id: 'history', label: 'Datashards & Chaves', code: '03', icon: Key }
  ];

  return (
    <header className="border-b border-cyber-border bg-[#090910]/95 backdrop-blur sticky top-0 z-50">
      {/* Top micro ticker */}
      <div className="bg-[#050508] border-b border-cyber-border/40 px-4 py-1 text-[10px] flex items-center justify-between text-gray-500 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyber-yellow">
            <span className="w-1.5 h-1.5 bg-cyber-yellow rounded-full animate-ping"></span>
            ARASAKA ICE NET // SECURITY LEVEL: MAXIMUM
          </span>
          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="hidden sm:inline">NIGHT CITY GRID // FATEC 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cyber-cyan font-bold">NC-TIME: {time}</span>
          <span className="text-gray-400">JWT: <span className="text-green-400">VALIDATED</span></span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cyber-yellow text-black flex items-center justify-center font-display font-black text-xl clip-cyber-btn">
            CD
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-display font-bold tracking-wider text-white flex items-center gap-2">
              CYBERDECK <span className="text-cyber-yellow font-black">2077</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 font-mono">
                CÉSAR v1.0
              </span>
            </h1>
            <p className="text-[10px] text-gray-400 font-mono tracking-tight">
              PROTOCOLO DE CIFRAGEM & PERSISTÊNCIA EM BANCO
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playBeep(700);
                  setActiveTab(item.id);
                }}
                className={`
                  relative px-3 md:px-4 py-2 text-xs md:text-sm font-display uppercase tracking-wider flex items-center gap-1.5 transition-all
                  clip-cyber-btn
                  ${
                    isActive
                      ? 'bg-cyber-yellow text-black font-bold shadow-neon-yellow'
                      : 'text-gray-300 hover:text-cyber-yellow hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px] opacity-70">[{item.code}]</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Badge & System Controls */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={handleToggleSound}
            title={soundOn ? 'Desativar Sons' : 'Ativar Sons do Cyberdeck'}
            className={`p-2 border transition-colors ${
              soundOn
                ? 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10'
                : 'border-gray-700 text-gray-500 hover:text-gray-300'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Scanline CRT toggle */}
          <button
            onClick={handleToggleScanlines}
            title={scanlines ? 'Desativar Linhas CRT' : 'Ativar Linhas CRT'}
            className={`p-2 border transition-colors ${
              scanlines
                ? 'border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow/10'
                : 'border-gray-700 text-gray-500 hover:text-gray-300'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>

          {/* User Callout */}
          {user && (
            <div className="hidden lg:flex flex-col text-right pl-2 border-l border-cyber-border">
              <span className="text-xs font-bold text-cyber-yellow tracking-wide">
                {user.callsign || user.username}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                NETRUNNER // ID #{user.id}
              </span>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            title="Encerrar Sessão Neural (Logout)"
            className="p-2 border border-cyber-red/60 text-cyber-red hover:bg-cyber-red hover:text-white transition-all ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

