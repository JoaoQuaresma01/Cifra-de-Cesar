require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const db = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const cipherRoutes = require('./routes/cipherRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Banner Cyberpunk
const BANNER = `
\x1b[33m╔════════════════════════════════════════════════════════════════════╗
║    _   _ _____ _____ _   _ _   _ _   _ _   _ _____ ____    ____ ___ ║
║   | \\ | | ____|_   _| \\ | | | | | \\ | | \\ | | ____|  _ \\  |___ \\ _ \\║
║   |  \\| |  _|   | | |  \\| | | | |  \\| |  \\| |  _| | |_) |   __) | | |║
║   | |\\  | |___  | | | |\\  | |_| | |\\  | |\\  | |___|  _ <   / __/| |_|║
║   |_| \\_|_____| |_| |_| \\_|\\___/|_| \\_|_| \\_|_____|_| \\_\\ |_____|\\___/║
║                                                                    ║
║   [CYBERDECK TERMINAL 2077] - PROTOCOLO DE CIFRA DE CÉSAR COM ICE  ║
║   FATEC // TRABALHO PRÁTICO // AUTENTICAÇÃO JWT + PERSISTÊNCIA DB  ║
╚════════════════════════════════════════════════════════════════════╝\x1b[0m
`;

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/cipher', cipherRoutes);

// Endpoint de Diagnóstico / Healthcheck
app.get('/api/health', (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as total FROM users').get().total;
    const keyCount = db.prepare('SELECT COUNT(*) as total FROM cipher_keys').get().total;
    const usedKeyCount = db.prepare('SELECT COUNT(*) as total FROM cipher_keys WHERE usado = 1').get().total;

    res.json({
      status: 'OPERATIONAL',
      city: 'Night City',
      subsystem: 'Arasaka ICE Encryption Grid',
      database: 'SQLite Connected',
      stats: {
        totalNetrunners: Number(userCount),
        totalKeysGenerated: Number(keyCount),
        totalKeysBurned: Number(usedKeyCount)
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// Suporte para servir o Frontend construído em modo de produção
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    }
  });
}

const server = app.listen(PORT, () => {
  console.log(BANNER);
  console.log(`\x1b[36m[+] Servidor Cyberdeck ativo na porta:\x1b[0m \x1b[33mhttp://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[36m[+] Banco de Dados SQLite:\x1b[0m \x1b[32mConectado e operacional\x1b[0m`);
  console.log(`\x1b[35m[+] Endpoint Healthcheck:\x1b[0m http://localhost:${PORT}/api/health\n`);
});

module.exports = { app, server };

