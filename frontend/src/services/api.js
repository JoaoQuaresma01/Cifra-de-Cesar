const API_BASE = '/api';

function getStoredToken() {
  return localStorage.getItem('cyber_jwt_token');
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('cyber_jwt_token', token);
  } else {
    localStorage.removeItem('cyber_jwt_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || data.error || 'Erro na comunicação com o Cyberdeck';
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Autenticação
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),

  register: (username, password, callsign) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, callsign })
    }),

  me: () => request('/auth/me'),

  // Cifra e Chaves
  encrypt: (message, step, mode = '36') =>
    request('/cipher/encrypt', {
      method: 'POST',
      body: JSON.stringify({ message, step, mode })
    }),

  decrypt: (ciphertext, hash) =>
    request('/cipher/decrypt', {
      method: 'POST',
      body: JSON.stringify({ ciphertext, hash })
    }),

  getHistory: () => request('/cipher/history'),

  // Diagnóstico
  getHealth: () => request('/health')
};

