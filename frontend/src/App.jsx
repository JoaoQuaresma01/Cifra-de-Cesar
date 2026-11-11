import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EncryptPage from './pages/EncryptPage';
import DecryptPage from './pages/DecryptPage';
import HistoryPage from './pages/HistoryPage';
import { initSoundPreference } from './utils/audio';
import { Terminal, Shield, Cpu, RefreshCw } from 'lucide-react';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' ou 'register'
  const [activeTab, setActiveTab] = useState('encrypt'); // 'encrypt', 'decrypt', 'history'
  const [scanlines, setScanlines] = useState(true);

  // Estados compartilhados para navegação direta entre criptografar e descriptografar
  const [prefilledCipher, setPrefilledCipher] = useState('');
  const [prefilledHash, setPrefilledHash] = useState('');

  useEffect(() => {
    initSoundPreference();
  }, []);

  const handleNavigateToDecrypt = (ciphertext, hash) => {
    setPrefilledCipher(ciphertext);
    setPrefilledHash(hash);
    setActiveTab('decrypt');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070b] flex flex-col items-center justify-center font-mono text-cyber-yellow gap-4 p-4">
        <RefreshCw className="w-8 h-8 animate-spin text-cyber-yellow" />
        <p className="tracking-widest uppercase text-sm animate-pulse">
          INICIALIZANDO PROTOCOLO CYBERDECK 2077...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070b] text-gray-100 flex flex-col font-mono relative selection:bg-cyber-yellow selection:text-black">
      {/* CRT Scanlines Overlay Effect */}
      {scanlines && <div className="scanlines-overlay pointer-events-none"></div>}

      {!isAuthenticated ? (
        // TELAS PÚBLICAS: LOGIN & CADASTRO DE USUÁRIO
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-cyber-yellow text-black clip-cyber-btn mb-3">
              <Terminal className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-widest text-white uppercase">
              CYBERDECK <span className="text-cyber-yellow">2077</span>
            </h1>
            <p className="text-xs md:text-sm text-cyber-cyan font-mono mt-1 tracking-wider uppercase">
              FATEC // CIFRA DE CÉSAR COM AUTENTICAÇÃO JWT & PERSISTÊNCIA SQLITE
            </p>
          </div>

          {authView === 'login' ? (
            <LoginPage onSwitchToRegister={() => setAuthView('register')} />
          ) : (
            <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
          )}
        </div>
      ) : (
        // TELAS AUTENTICADAS: CRIPTOGRAFAR, DESCRIPTOGRAFAR, AUDITORIA DE CHAVES
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            scanlines={scanlines}
            setScanlines={setScanlines}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
            {activeTab === 'encrypt' && (
              <EncryptPage onNavigateToDecrypt={handleNavigateToDecrypt} />
            )}

            {activeTab === 'decrypt' && (
              <DecryptPage
                initialCiphertext={prefilledCipher}
                initialHash={prefilledHash}
              />
            )}

            {activeTab === 'history' && (
              <HistoryPage onSelectKeyForDecrypt={handleNavigateToDecrypt} />
            )}
          </main>
        </>
      )}

      {/* Cyberpunk Footer */}
      <footer className="border-t border-cyber-border/60 bg-[#050508] py-4 px-6 text-[11px] font-mono text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyber-yellow inline-block"></span>
            <span>TRABALHO PRÁTICO: CIFRA DE CÉSAR // PROF. JUNIO GONÇALVES</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>FATEC 2026</span>
            <span>•</span>
            <span className="text-cyber-cyan">PERSISTÊNCIA SQLITE</span>
            <span>•</span>
            <span className="text-cyber-yellow">JWT SECURITY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

