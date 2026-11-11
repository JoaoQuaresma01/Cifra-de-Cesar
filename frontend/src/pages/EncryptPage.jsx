import React, { useState } from 'react';
import { api } from '../services/api';
import CyberCard from '../components/CyberCard';
import CyberInput from '../components/CyberInput';
import CyberButton from '../components/CyberButton';
import CaesarVisualizer from '../components/CaesarVisualizer';
import { playSuccess, playError, playGlitch, playBeep } from '../utils/audio';
import { Lock, Copy, Check, ArrowRight, ShieldAlert, Sparkles, KeyRound } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EncryptPage({ onNavigateToDecrypt }) {
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(3);
  const [mode, setMode] = useState('36'); // '36' (padrão fatec a-z, 0-9) ou '62'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copiedCipher, setCopiedCipher] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleEncrypt = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!message.trim()) {
      setError('Por favor, informe uma mensagem para ser criptografada.');
      playError();
      return;
    }

    setLoading(true);
    playGlitch();

    try {
      const res = await api.encrypt(message, step, mode);
      setResult(res);
      playSuccess();

      // Cyberpunk neon confetti burst
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FCEE0A', '#00F0FF', '#FF003C']
      });
    } catch (err) {
      setError(err.message || 'Erro ao executar o protocolo de criptografia.');
      playError();
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    playBeep(1200);
    if (type === 'cipher') {
      setCopiedCipher(true);
      setTimeout(() => setCopiedCipher(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleQuickShift = (delta) => {
    playBeep(750);
    setStep((prev) => (parseInt(prev, 10) || 0) + delta);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0b0b14] border-l-4 border-cyber-yellow p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="text-cyber-yellow font-bold uppercase tracking-wider">// PROTOCOLO ICE DE CIFRAGEM:</span>
          <span className="text-gray-300 ml-2">Deslocamento circular alfanumérico com geração de chave hash descartável de uso único.</span>
        </div>
        <div className="text-[10px] text-gray-400 bg-black/60 px-2.5 py-1 border border-cyber-border">
          FATEC BD REQ: <span className="text-green-400 font-bold">SQLITE ACTIVE</span>
        </div>
      </div>

      <CyberCard
        title="TELA DE CRIPTOGRAFAR"
        subtitle="Codifique sua mensagem com deslocamento de César e gere o hash de descriptografia"
        tag="ICE.ENCRYPT_01"
        accent="yellow"
      >
        {error && (
          <div className="mb-6 p-4 bg-cyber-red/10 border-l-4 border-cyber-red text-cyber-red text-xs font-mono flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider">FALHA NO PROTOCOLO</p>
              <p className="text-gray-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleEncrypt} className="space-y-6">
          {/* Campo 1: Mensagem a ser criptografada */}
          <CyberInput
            label="Mensagem a ser criptografada"
            sublabel="INPUT.PLAINTEXT"
            id="encrypt-message"
            multiline
            rows={3}
            required
            placeholder="Digite aqui a mensagem confidencial para Night City... (Ex: Encontro secreto na torre Arasaka as 20h)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Campo 2: Passo (deslocamento) com seletores rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <CyberInput
                label="Passo de Deslocamento (Número de Casas)"
                sublabel="INPUT.STEP_OFFSET"
                id="encrypt-step"
                type="number"
                required
                placeholder="Ex: 3, -5, 12, -18"
                value={step}
                onChange={(e) => setStep(e.target.value)}
              />
            </div>

            {/* Quick Adjust Buttons */}
            <div className="flex items-center gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => handleQuickShift(-5)}
                className="flex-1 py-2 text-xs font-mono bg-black/60 border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan text-gray-300 transition-colors"
                title="Deslocar -5 casas"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => handleQuickShift(-1)}
                className="flex-1 py-2 text-xs font-mono bg-black/60 border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan text-gray-300 transition-colors"
                title="Deslocar -1 casa"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => handleQuickShift(1)}
                className="flex-1 py-2 text-xs font-mono bg-black/60 border border-cyber-border hover:border-cyber-yellow hover:text-cyber-yellow text-gray-300 transition-colors"
                title="Deslocar +1 casa"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => handleQuickShift(5)}
                className="flex-1 py-2 text-xs font-mono bg-black/60 border border-cyber-border hover:border-cyber-yellow hover:text-cyber-yellow text-gray-300 transition-colors"
                title="Deslocar +5 casas"
              >
                +5
              </button>
            </div>
          </div>

          {/* Modo do Alfabeto */}
          <div className="p-3 bg-black/40 border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-cyber-yellow font-bold">CONJUNTO DE CARACTERES:</span>
              <span className="text-gray-400">
                {mode === '36' ? 'Alfanumérico Fatec [a-z, 0-9] (36 chars)' : 'Estendido Case-Sensitive [a-z, A-Z, 0-9] (62 chars)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playBeep(800);
                  setMode('36');
                }}
                className={`px-2.5 py-1 text-[11px] border transition-colors ${
                  mode === '36'
                    ? 'border-cyber-yellow bg-cyber-yellow text-black font-bold'
                    : 'border-cyber-border text-gray-400 hover:text-white'
                }`}
              >
                [a-z, 0-9] Padrão Fatec
              </button>
              <button
                type="button"
                onClick={() => {
                  playBeep(800);
                  setMode('62');
                }}
                className={`px-2.5 py-1 text-[11px] border transition-colors ${
                  mode === '62'
                    ? 'border-cyber-cyan bg-cyber-cyan text-black font-bold'
                    : 'border-cyber-border text-gray-400 hover:text-white'
                }`}
              >
                [a-z, A-Z, 0-9] Estendido
              </button>
            </div>
          </div>

          {/* Interactive Live Caesar Visualizer */}
          <CaesarVisualizer step={step} />

          <div className="pt-2">
            <CyberButton
              type="submit"
              variant="yellow"
              disabled={loading}
              icon={Lock}
              className="w-full text-base py-4"
            >
              {loading ? 'EXECUTANDO CIFRAÇÃO E GRAVANDO NO BANCO...' : 'CRIPTOGRAFAR MENSAGEM // GERAR CHAVE HASH'}
            </CyberButton>
          </div>
        </form>

        {/* RESULT SECTION */}
        {result && (
          <div className="mt-8 pt-6 border-t-2 border-cyber-yellow/60 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></span>
                <h3 className="text-base font-display font-bold uppercase tracking-wider text-cyber-yellow">
                  RESULTADO DA CRIPTOGRAFIA // DADOS PROTEGIDOS COM ICE
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-green-400/10 border border-green-400/40 text-green-400">
                PERSISTIDO NO SQLITE // USADO: FALSE
              </span>
            </div>

            {/* Output 1: Mensagem Criptografada */}
            <div className="bg-[#06060c] border border-cyber-border p-4 relative group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-display text-cyber-cyan uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Mensagem Criptografada (Ciphertext)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(result.ciphertext, 'cipher')}
                  className="text-xs font-mono text-gray-400 hover:text-cyber-yellow flex items-center gap-1 transition-colors"
                >
                  {copiedCipher ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm font-mono text-gray-100 break-all select-all bg-black/60 p-3 border border-cyber-border/40">
                {result.ciphertext}
              </p>
            </div>

            {/* Output 2: Hash (Chave Privada de uso único) */}
            <div className="bg-[#0e0c05] border-2 border-cyber-yellow p-4 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="text-xs font-display text-cyber-yellow uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <KeyRound className="w-4 h-4 text-cyber-yellow" />
                  CHAVE PRIVADA (HASH DE DESCRIPTOGRAFIA - USO ÚNICO)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(result.hash, 'hash')}
                  className="text-xs font-mono bg-cyber-yellow text-black font-bold px-3 py-1 hover:bg-white flex items-center gap-1 transition-all"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span>HASH COPIADO!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPIAR HASH</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-black/90 p-3 border border-cyber-yellow/40">
                <p className="text-xs font-mono text-cyber-yellow break-all select-all tracking-wider font-bold">
                  {result.hash}
                </p>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-gray-400">
                <span>
                  • Passo vinculado no banco: <strong className="text-white">{result.step}</strong> | Status: <strong className="text-green-400">Ativo (uso único)</strong>
                </span>
                {onNavigateToDecrypt && (
                  <button
                    type="button"
                    onClick={() => onNavigateToDecrypt(result.ciphertext, result.hash)}
                    className="text-cyber-cyan hover:text-cyber-yellow flex items-center gap-1 font-bold underline transition-colors"
                  >
                    <span>Testar descriptografia agora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </CyberCard>
    </div>
  );
}

