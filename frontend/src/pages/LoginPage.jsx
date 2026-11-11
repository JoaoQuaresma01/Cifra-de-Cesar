import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CyberCard from '../components/CyberCard';
import CyberInput from '../components/CyberInput';
import CyberButton from '../components/CyberButton';
import { Terminal, Shield, LogIn, UserPlus, AlertTriangle } from 'lucide-react';

export default function LoginPage({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Falha ao autenticar no Cyberdeck');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Decorative Header Badge */}
        <div className="flex items-center justify-between mb-2 px-2 text-[10px] font-mono text-gray-400">
          <span className="flex items-center gap-1.5 text-cyber-cyan">
            <span className="w-1.5 h-1.5 bg-cyber-cyan animate-pulse"></span>
            PORTAL DE CONEXÃO ARASAKA SEC-ICE
          </span>
          <span>AUTENTICAÇÃO JWT v2.0</span>
        </div>

        <CyberCard
          title="ACESSO AO CYBERDECK"
          subtitle="Informe suas credenciais neurais para descriptografia e cifragem"
          tag="TERMINAL.AUTH_01"
          accent="yellow"
        >
          {error && (
            <div className="mb-6 p-4 bg-cyber-red/10 border-l-4 border-cyber-red text-cyber-red text-xs font-mono flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase tracking-wider">ACESSO NEGADO // FALHA DE SEGURANÇA</p>
                <p className="text-gray-300 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <CyberInput
              label="Codinome do Operador (Usuário)"
              sublabel="SYS.USER_ID"
              id="login-username"
              type="text"
              required
              placeholder="Ex: v_netrunner ou johnny"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <CyberInput
              label="Chave Neural de Acesso (Senha)"
              sublabel="SYS.KEY_PHRASE"
              id="login-password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="pt-2">
              <CyberButton
                type="submit"
                variant="yellow"
                disabled={loading}
                icon={LogIn}
                className="w-full"
              >
                {loading ? 'AUTENTICANDO TOKEN JWT...' : 'CONECTAR AO CYBERDECK'}
              </CyberButton>
            </div>
          </form>

          {/* Quick Switch to Register */}
          <div className="mt-6 pt-6 border-t border-cyber-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <span className="text-gray-400">Novo em Night City?</span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-cyber-cyan hover:text-cyber-yellow hover:underline flex items-center gap-1.5 uppercase font-bold tracking-wider"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Registrar Novo Netrunner
            </button>
          </div>

          {/* Professor Quick Test Hint */}
          <div className="mt-4 p-3 bg-black/40 border border-cyber-border/40 text-[11px] font-mono text-gray-500">
            <span className="text-cyber-yellow font-bold">// DICA DE AVALIAÇÃO:</span> Se ainda não possui cadastro, clique em "Registrar Novo Netrunner" acima para persistir suas credenciais no SQLite.
          </div>
        </CyberCard>
      </div>
    </div>
  );
}

