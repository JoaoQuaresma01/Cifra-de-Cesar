import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CyberCard from '../components/CyberCard';
import CyberInput from '../components/CyberInput';
import CyberButton from '../components/CyberButton';
import { UserPlus, ArrowLeft, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RegisterPage({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas informadas não coincidem!');
      return;
    }

    if (password.length < 4) {
      setError('A chave neural (senha) deve possuir pelo menos 4 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await register(username, password, callsign);
    } catch (err) {
      setError(err.message || 'Falha ao registrar novo operador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-2 px-2 text-[10px] font-mono text-gray-400">
          <span className="flex items-center gap-1.5 text-cyber-yellow">
            <span className="w-1.5 h-1.5 bg-cyber-yellow animate-pulse"></span>
            ARASAKA REGISTRATION PROTOCOL
          </span>
          <span>PERSISTÊNCIA SQLITE</span>
        </div>

        <CyberCard
          title="REGISTRO DE NETRUNNER"
          subtitle="Crie seu registro neural para operar os protocolos de Cifra de César"
          tag="REGISTRY.OPERATOR_02"
          accent="cyan"
        >
          {error && (
            <div className="mb-6 p-4 bg-cyber-red/10 border-l-4 border-cyber-red text-cyber-red text-xs font-mono flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase tracking-wider">ERRO DE REGISTRO</p>
                <p className="text-gray-300 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <CyberInput
              label="Nome de Usuário (Identificação)"
              sublabel="SYS.USERNAME"
              id="reg-username"
              type="text"
              required
              placeholder="Ex: judy_alvarez ou panam"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <CyberInput
              label="Codinome de Combate (Opcional)"
              sublabel="SYS.CALLSIGN"
              id="reg-callsign"
              type="text"
              placeholder="Ex: Ghost Runner, Cyber Samurai"
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
            />

            <CyberInput
              label="Chave Neural (Senha)"
              sublabel="BCRYPT.HASH"
              id="reg-password"
              type="password"
              required
              placeholder="Mínimo de 4 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <CyberInput
              label="Confirmação da Chave Neural"
              sublabel="SYS.VERIFY"
              id="reg-confirm-password"
              type="password"
              required
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="pt-2">
              <CyberButton
                type="submit"
                variant="cyan"
                disabled={loading}
                icon={UserPlus}
                className="w-full"
              >
                {loading ? 'GRAVANDO NO BANCO DE DADOS...' : 'CADASTRAR E CONECTAR'}
              </CyberButton>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-cyber-border/60 flex items-center justify-between text-xs font-mono">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-gray-400 hover:text-cyber-cyan flex items-center gap-1.5 uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar ao Login
            </button>
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-green-400" /> Senha criptografada com Bcrypt
            </span>
          </div>
        </CyberCard>
      </div>
    </div>
  );
}

