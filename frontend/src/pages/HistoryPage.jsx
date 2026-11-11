import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CyberCard from '../components/CyberCard';
import { playBeep, playSuccess, playError } from '../utils/audio';
import { Key, Copy, Check, RefreshCw, Flame, Shield, ArrowRight, Database } from 'lucide-react';

export default function HistoryPage({ onSelectKeyForDecrypt }) {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory();
      setKeys(res.keys || []);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleCopy = (hash, id) => {
    navigator.clipboard.writeText(hash);
    playBeep(1100);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0b0b14] border-l-4 border-cyber-yellow p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="text-cyber-yellow font-bold uppercase tracking-wider">// BANCO DE DADOS SQLITE // TABELA CIPHER_KEYS:</span>
          <span className="text-gray-300 ml-2">Registro de todas as chaves geradas e seus respectivos status de uso.</span>
        </div>
        <button
          type="button"
          onClick={() => {
            playBeep(700);
            loadHistory();
          }}
          disabled={loading}
          className="text-cyber-cyan hover:text-cyber-yellow flex items-center gap-1.5 font-bold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Banco</span>
        </button>
      </div>

      <CyberCard
        title="REGISTRO DE DATASHARDS & CHAVES"
        subtitle="Monitoramento em tempo real da persistência do hash e da coluna 'usado' no SQLite"
        tag="DB.CIPHER_KEYS_TABLE"
        accent="yellow"
      >
        {loading ? (
          <div className="py-12 text-center text-cyber-yellow font-mono text-sm flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-cyber-yellow" />
            <span>CONSULTANDO TABELA SQLITE EM NIGHT CITY...</span>
          </div>
        ) : keys.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-cyber-border p-8 font-mono text-gray-500">
            <Database className="w-10 h-10 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-300">NENHUMA CHAVE REGISTRADA AINDA</p>
            <p className="text-xs text-gray-500 mt-1">
              Acesse a tela "Criptografar" para cifrar uma mensagem e gerar seu primeiro hash persistido no banco!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-cyber-border text-gray-400 uppercase tracking-wider text-[11px] bg-black/40">
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Hash (Chave Privada)</th>
                  <th className="py-3 px-3 text-center">Passo</th>
                  <th className="py-3 px-3 text-center">Coluna 'Usado'</th>
                  <th className="py-3 px-3">Data de Criação</th>
                  <th className="py-3 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/40">
                {keys.map((k) => {
                  const isUsed = k.usado === 1 || k.usado === true;
                  return (
                    <tr
                      key={k.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isUsed ? 'opacity-70' : 'bg-cyber-yellow/[0.02]'
                      }`}
                    >
                      <td className="py-3 px-3 text-gray-500 font-bold">#{k.id}</td>
                      <td className="py-3 px-3 max-w-[260px]">
                        <div className="flex items-center gap-2">
                          <span
                            className={`truncate select-all ${
                              isUsed ? 'text-gray-400 line-through' : 'text-cyber-yellow font-bold'
                            }`}
                            title={k.hash}
                          >
                            {k.hash.slice(0, 16)}...{k.hash.slice(-8)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(k.hash, k.id)}
                            className="text-gray-500 hover:text-white shrink-0"
                            title="Copiar Hash Completo"
                          >
                            {copiedId === k.id ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-cyber-cyan">
                        {k.step >= 0 ? `+${k.step}` : k.step}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isUsed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-cyber-red/20 text-cyber-red border border-cyber-red/50">
                            <Flame className="w-3 h-3" /> USADO (TRUE)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/50 animate-pulse">
                            <Shield className="w-3 h-3" /> DISPONÍVEL (FALSE)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-[11px]">
                        {new Date(k.created_at).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {!isUsed && onSelectKeyForDecrypt && (
                          <button
                            type="button"
                            onClick={() => onSelectKeyForDecrypt('', k.hash)}
                            className="text-xs text-cyber-cyan hover:text-cyber-yellow font-bold flex items-center gap-1 ml-auto"
                          >
                            <span>Usar</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isUsed && (
                          <span className="text-[10px] text-gray-600 uppercase font-mono">
                            QUEIMADO
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CyberCard>
    </div>
  );
}

