import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CyberCard from '../components/CyberCard';
import CyberInput from '../components/CyberInput';
import CyberButton from '../components/CyberButton';
import { playSuccess, playError, playGlitch, playBeep } from '../utils/audio';
import { Unlock, ShieldCheck, ShieldAlert, Copy, Check, Flame, RefreshCw, AlertOctagon } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DecryptPage({ initialCiphertext = '', initialHash = '' }) {
  const [ciphertext, setCiphertext] = useState(initialCiphertext);
  const [hash, setHash] = useState(initialHash);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copiedText, setCopiedText] = useState(false);

  // Se vier pré-preenchido de outra tela
  useEffect(() => {
    if (initialCiphertext) setCiphertext(initialCiphertext);
    if (initialHash) setHash(initialHash);
  }, [initialCiphertext, initialHash]);

  const handleDecrypt = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!ciphertext.trim()) {
      setError({
        title: 'MENSAGEM NÃO INFORMADA',
        message: 'Informe o texto criptografado para iniciar o processo de decodificação.'
      });
      playError();
      return;
    }

    if (!hash.trim()) {
      setError({
        title: 'CHAVE HASH AUSENTE',
        message: 'A chave privada (hash) é estritamente necessária para recuperar o passo da cifra no banco de dados.'
      });
      playError();
      return;
    }

    setLoading(true);
    playGlitch();

    try {
      const res = await api.decrypt(ciphertext, hash);
      setResult(res);
      playSuccess();

      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#FCEE0A', '#10B981']
      });
    } catch (err) {
      playError();
      setError({
        title: err.data?.error || 'ERRO DE DESCRIPTOGRAFIA',
        message: err.data?.message || err.message || 'Falha ao descriptografar mensagem.',
        details: err.data
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    playBeep(1200);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleClear = () => {
    playBeep(600);
    setCiphertext('');
    setHash('');
    setError(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0b0b14] border-l-4 border-cyber-cyan p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="text-cyber-cyan font-bold uppercase tracking-wider">// BREACH PROTOCOL // DECODIFICAÇÃO:</span>
          <span className="text-gray-300 ml-2">Validação rigorosa de existência e uso único do hash no banco de dados.</span>
        </div>
        <div className="text-[10px] text-cyber-yellow bg-black/60 px-2.5 py-1 border border-cyber-border">
          REGRA: <span className="font-bold">1 HASH = 1 USO</span>
        </div>
      </div>

      <CyberCard
        title="TELA DE DESCRIPTOGRAFAR"
        subtitle="Informe a mensagem cifrada e sua chave hash para restaurar o texto em claro"
        tag="BREACH.DECRYPT_02"
        accent="cyan"
        actions={
          (ciphertext || hash || result) && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-mono text-gray-400 hover:text-cyber-red flex items-center gap-1 transition-colors px-2 py-1 border border-cyber-border/40"
            >
              <RefreshCw className="w-3 h-3" /> Limpar Campos
            </button>
          )
        }
      >
        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 bg-cyber-red/15 border-2 border-cyber-red text-cyber-red text-xs font-mono flex items-start gap-3 animate-in fade-in">
            <AlertOctagon className="w-6 h-6 shrink-0 text-cyber-red mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <p className="font-bold text-sm tracking-wide text-white uppercase">{error.title}</p>
              <p className="text-red-200 text-xs">{error.message}</p>
              {error.details?.usedAt && (
                <p className="text-[11px] text-gray-400 pt-1">
                  Data em que a chave foi queimada: {new Date(error.details.usedAt).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleDecrypt} className="space-y-6">
          {/* Campo 1: Mensagem Criptografada */}
          <CyberInput
            label="Mensagem Criptografada (Ciphertext)"
            sublabel="INPUT.CIPHER_TEXT"
            id="decrypt-ciphertext"
            multiline
            rows={3}
            required
            placeholder="Cole aqui o texto cifrado gerado previamente..."
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
          />

          {/* Campo 2: Chave Hash Correspondente */}
          <CyberInput
            label="Chave Privada (Hash Correspondente)"
            sublabel="INPUT.HASH_KEY"
            id="decrypt-hash"
            type="text"
            required
            placeholder="Cole o hash de 64 caracteres (Ex: 3e6f2d381fc951b793d...)"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
          />

          <div className="pt-2">
            <CyberButton
              type="submit"
              variant="cyan"
              disabled={loading}
              icon={Unlock}
              className="w-full text-base py-4"
            >
              {loading ? 'VALIDANDO CHAVE NO BANCO E DECODIFICANDO...' : 'DESCRIPTOGRAFAR // VALIDAR HASH NO BANCO'}
            </CyberButton>
          </div>
        </form>

        {/* RESULT SECTION (TEXTO CLARO) */}
        {result && (
          <div className="mt-8 pt-6 border-t-2 border-cyber-cyan/60 space-y-5 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <h3 className="text-base font-display font-bold uppercase tracking-wider text-green-400">
                  DECODIFICAÇÃO CONCLUÍDA COM SUCESSO!
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-cyber-red/20 border border-cyber-red text-cyber-red flex items-center gap-1 font-bold">
                  <Flame className="w-3 h-3" /> HASH QUEIMADO (USADO: TRUE)
                </span>
              </div>
            </div>

            {/* Output: Mensagem Original / Texto Claro */}
            <div className="bg-[#050e0d] border-2 border-green-500/80 p-5 relative shadow-lg shadow-green-500/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-display text-green-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                  TEXTO CLARO (MENSAGEM ORIGINAL RECUPERADA):
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(result.originalText)}
                  className="text-xs font-mono bg-green-500/20 text-green-300 hover:bg-green-500 hover:text-black font-bold px-3 py-1 flex items-center gap-1 transition-all"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIADO!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPIAR TEXTO CLARO</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-black/90 p-4 border border-green-500/40 mt-2">
                <p className="text-base font-mono text-white break-words select-all font-semibold">
                  {result.originalText}
                </p>
              </div>

              {/* Forensic Details */}
              <div className="mt-4 pt-3 border-t border-cyber-border/40 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-gray-400">
                <div>
                  <span className="text-gray-500">Passo Recuperado:</span>{' '}
                  <strong className="text-cyber-yellow">{result.step}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Status no DB:</span>{' '}
                  <strong className="text-cyber-red">usado = true (1)</strong>
                </div>
                <div>
                  <span className="text-gray-500">Horário:</span>{' '}
                  <strong className="text-gray-300">
                    {new Date(result.decryptedAt).toLocaleTimeString('pt-BR')}
                  </strong>
                </div>
              </div>
            </div>

            {/* Re-use test warning */}
            <div className="p-3 bg-cyber-yellow/10 border border-cyber-yellow/40 text-xs font-mono text-cyber-yellow flex items-center gap-2">
              <span className="font-bold">[TESTE DE AVALIAÇÃO FATEC]:</span>
              <span>
                Clique no botão "Descriptografar" novamente com esses mesmos dados para verificar o bloqueio automático de reuso da chave!
              </span>
            </div>
          </div>
        )}
      </CyberCard>
    </div>
  );
}

