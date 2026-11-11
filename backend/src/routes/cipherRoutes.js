const express = require('express');
const { encryptMessage, decryptMessage, getKeyHistory } = require('../controllers/cipherController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Todas as rotas de Cifra requerem validação JWT para garantir autenticidade, integridade e confidencialidade
router.post('/encrypt', authMiddleware, encryptMessage);
router.post('/decrypt', authMiddleware, decryptMessage);
router.get('/history', authMiddleware, getKeyHistory);

module.exports = router;

