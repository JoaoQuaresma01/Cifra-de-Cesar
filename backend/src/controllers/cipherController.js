const crypto = require('node:crypto');
const db = require('../config/database');
const { encrypt, decrypt } = require('../services/caesarCipher');

/**
 * Criptografa uma mensagem e gera a chave hash de uso único
 */
function encryptMessage(req, res) {
  try {
    const { message, step, mode } = req.body;

    if (message === undefined || message === null || message === '') {
      return res.status(400).json({
        error: 'MENSAGEM NÃO INFORMADA',
        message: 'Digite a mensagem que deseja proteger com o protocolo de César.'
      });
    }

    if (step === undefined || step === null || step === '') {
      return res.status(400).json({
        error: 'PASSO INVÁLIDO',
        message: 'Informe o número de casas a serem deslocadas (positivo ou negativo).'
      });
    }

    const parsedStep = parseInt(step, 10);
    if (isNaN(parsedStep)) {
      return res.status(400).json({
        error: 'PASSO DEVE SER INTEIRO',
        message: 'O passo de deslocamento precisa ser um número inteiro válido (ex: 3, -5, 12).'
      });
    }

    const cipherMode = mode === '62' ? '62' : '36';

    // Executa a cifra de César alfanumérica
    const ciphertext = encrypt(message, parsedStep, cipherMode);

    // Gera um Hash SHA-256 criptográfico para a Chave Privada
    const randomPayload = crypto.randomUUID() + Date.now() + Math.random().toString();
    const hash = crypto.createHash('sha256').update(randomPayload).digest('hex');

    // Armazena no banco de dados com usado = 0 (false)
    const insertStmt = db.prepare(`
      INSERT INTO cipher_keys (hash, step, mode, usado, user_id)
      VALUES (?, ?, ?, 0, ?)
    `);
    const result = insertStmt.run(hash, parsedStep, cipherMode, req.user?.id || null);

    return res.status(201).json({
      message: 'MENSAGEM CRIPTOGRAFADA COM SUCESSO // PROTOCOLO ICE ATIVO',
      ciphertext,
      hash, // Chave privada exibida para o usuário para futura descriptografia
      step: parsedStep,
      mode: cipherMode,
      usado: false,
      keyId: Number(result.lastInsertRowid)
    });
  } catch (error) {
    console.error('Erro na criptografia:', error);
    return res.status(500).json({
      error: 'FALHA NA EXECUÇÃO DA CIFRA',
      message: error.message
    });
  }
}

/**
 * Descriptografa uma mensagem mediante fornecimento da chave hash de uso único
 */
function decryptMessage(req, res) {
  try {
    const { ciphertext, hash } = req.body;

    if (ciphertext === undefined || ciphertext === null || ciphertext === '') {
      return res.status(400).json({
        error: 'MENSAGEM CIFRADA AUSENTE',
        message: 'Informe o texto criptografado para iniciar a decodificação.'
      });
    }

    if (!hash || typeof hash !== 'string' || hash.trim() === '') {
      return res.status(400).json({
        error: 'CHAVE HASH NÃO INFORMADA',
        message: 'A chave privada (hash) é necessária para recuperar a mensagem original.'
      });
    }

    const cleanHash = hash.trim();

    // 1. Valida se o hash informado existe no banco de dados
    const findStmt = db.prepare('SELECT * FROM cipher_keys WHERE hash = ?');
    const keyRecord = findStmt.get(cleanHash);

    if (!keyRecord) {
      return res.status(404).json({
        error: 'CHAVE NÃO ENCONTRADA // BREACH VIOLATION',
        message: 'O hash informado não existe no banco de dados de chaves de Night City.'
      });
    }

    // 2. Valida se o hash já foi utilizado anteriormente
    if (keyRecord.usado === 1 || keyRecord.usado === true) {
      return res.status(400).json({
        error: 'CHAVE JÁ UTILIZADA // PROTOCOLO QUEIMADO',
        message: 'ESTA CHAVE JÁ FOI UTILIZADA ANTERIORMENTE! O sistema garante uso estrito único por hash.',
        usedAt: keyRecord.used_at
      });
    }

    // 3. Caso seja válido, executa a descriptografia com o passo armazenado
    const originalText = decrypt(ciphertext, keyRecord.step, keyRecord.mode || '36');

    // 4. Marca o hash como utilizado imediatamente no banco de dados
    const updateStmt = db.prepare(`
      UPDATE cipher_keys
      SET usado = 1, used_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    updateStmt.run(keyRecord.id);

    return res.json({
      message: 'BREACH PROTOCOL CONCLUÍDO // DADOS DECODIFICADOS COM SUCESSO',
      originalText,
      step: keyRecord.step,
      mode: keyRecord.mode,
      hash: keyRecord.hash,
      usado: true,
      decryptedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na descriptografia:', error);
    return res.status(500).json({
      error: 'FALHA NA DESCRIPTOGRAFIA',
      message: error.message
    });
  }
}

/**
 * Retorna o histórico de chaves geradas pelo usuário ou públicas
 */
function getKeyHistory(req, res) {
  try {
    const userId = req.user?.id;
    let stmt;
    if (userId) {
      stmt = db.prepare(`
        SELECT id, hash, step, mode, usado, created_at, used_at
        FROM cipher_keys
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 20
      `);
      const keys = stmt.all(userId);
      return res.json({ keys });
    } else {
      stmt = db.prepare(`
        SELECT id, hash, step, mode, usado, created_at, used_at
        FROM cipher_keys
        ORDER BY created_at DESC
        LIMIT 10
      `);
      const keys = stmt.all();
      return res.json({ keys });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  encryptMessage,
  decryptMessage,
  getKeyHistory
};

