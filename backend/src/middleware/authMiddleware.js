const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cyberpunk_2077_arasaka_ice_secret_fatec_998877';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'ACESSO NEGADO // TOKEN NEURAL AUSENTE',
      message: 'Você precisa estar autenticado no Cyberdeck para acessar este protocolo.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, callsign }
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'ACESSO NEGADO // ASSINATURA JWT INVÁLIDA OU EXPIRADA',
      message: 'Falha na verificação de integridade/confidencialidade do token.',
      details: err.message
    });
  }
}

module.exports = {
  authMiddleware,
  JWT_SECRET
};

