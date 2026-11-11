const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/authMiddleware');

/**
 * Registro de novo usuário / Netrunner
 */
function register(req, res) {
  try {
    const { username, password, callsign } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'DADOS INCOMPLETOS',
        message: 'Identificação (usuário) e Chave Neural (senha) são obrigatórias.'
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        error: 'IDENTIFICAÇÃO CURTA DEMAIS',
        message: 'O nome de usuário deve conter no mínimo 3 caracteres.'
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        error: 'CHAVE NEURAL FRACA',
        message: 'A senha deve conter no mínimo 4 caracteres.'
      });
    }

    const cleanUsername = username.trim();

    // Verifica se já existe
    const findStmt = db.prepare('SELECT id FROM users WHERE username = ?');
    const existing = findStmt.get(cleanUsername);
    if (existing) {
      return res.status(409).json({
        error: 'OPERADOR JÁ REGISTRADO',
        message: `O codinome/usuário '${cleanUsername}' já está cadastrado no sistema.`
      });
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const assignedCallsign = callsign?.trim() || `Netrunner#${Math.floor(1000 + Math.random() * 9000)}`;

    const insertStmt = db.prepare(`
      INSERT INTO users (username, password, callsign)
      VALUES (?, ?, ?)
    `);
    const result = insertStmt.run(cleanUsername, hashedPassword, assignedCallsign);

    const userId = Number(result.lastInsertRowid);

    // Gera token JWT
    const token = jwt.sign(
      { id: userId, username: cleanUsername, callsign: assignedCallsign },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'NETRUNNER REGISTRADO COM SUCESSO // CONEXÃO NEURAL ESTABELECIDA',
      token,
      user: {
        id: userId,
        username: cleanUsername,
        callsign: assignedCallsign
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({
      error: 'FALHA INTERNA DO CYBERDECK',
      message: 'Não foi possível registrar o operador. Tente novamente.',
      details: error.message
    });
  }
}

/**
 * Login de usuário com validação de senha e emissão de JWT
 */
function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'CREDENCIAIS AUSENTES',
        message: 'Informe usuário e senha para acessar o terminal.'
      });
    }

    const cleanUsername = username.trim();

    const findStmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = findStmt.get(cleanUsername);

    if (!user) {
      return res.status(401).json({
        error: 'ACESSO NEGADO // OPERADOR NÃO ENCONTRADO',
        message: 'Nenhum registro encontrado para este codinome em Night City.'
      });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'ACESSO NEGADO // CHAVE NEURAL INCORRETA',
        message: 'A senha informada não confere com os registros criptografados.'
      });
    }

    // Gera JWT assinado
    const token = jwt.sign(
      { id: user.id, username: user.username, callsign: user.callsign },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'AUTENTICAÇÃO AUTORIZADA // BEM-VINDO A NIGHT CITY',
      token,
      user: {
        id: user.id,
        username: user.username,
        callsign: user.callsign,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({
      error: 'ERRO CRÍTICO NO SUBSISTEMA DE AUTENTICAÇÃO',
      message: error.message
    });
  }
}

/**
 * Retorna dados da sessão atual do Netrunner
 */
function me(req, res) {
  try {
    const findStmt = db.prepare('SELECT id, username, callsign, created_at FROM users WHERE id = ?');
    const user = findStmt.get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Operador não encontrado' });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
  me
};

