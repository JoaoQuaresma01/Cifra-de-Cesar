/**
 * Caesar Cipher Service - Cyberpunk 2077 ICE Protocol
 * 
 * Atende com rigor à especificação do trabalho:
 * "Utilize minimamente caracteres alfabéticos e numéricos para a combinação e resultado: Exemplo: a-z,0-9."
 * 
 * - Alfabeto Padrão (36 chars): 'abcdefghijklmnopqrstuvwxyz0123456789'
 *   Permite que letras virem números e números virem letras (ex: 'y' + 3 = '1', '7' + 3 = 'a').
 * - Alfabeto Estendido (62 chars): 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
 *   Preserva diferenciação entre maiúsculas e minúsculas.
 * - Suporta deslocamentos (passos) positivos e negativos.
 * - Preserva pontuação, espaços e caracteres especiais intactos.
 */

const CHARSET_36 = 'abcdefghijklmnopqrstuvwxyz0123456789';
const CHARSET_62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function normalizeShift(step, radix) {
  const parsed = parseInt(step, 10);
  if (isNaN(parsed)) {
    throw new Error('O passo (deslocamento) deve ser um número inteiro válido.');
  }
  return ((parsed % radix) + radix) % radix;
}

/**
 * Criptografa o texto
 * @param {string} text - Texto original
 * @param {number|string} step - Número de casas de deslocamento (positivo ou negativo)
 * @param {'36'|'62'} mode - Modo do alfabeto ('36' padrão do trabalho ou '62' estendido)
 * @returns {string} - Texto cifrado
 */
function encrypt(text, step, mode = '36') {
  if (typeof text !== 'string') {
    throw new Error('A mensagem a ser criptografada deve ser um texto válido.');
  }

  const charset = mode === '62' ? CHARSET_62 : CHARSET_36;
  const radix = charset.length;
  const shift = normalizeShift(step, radix);
  const input = mode === '36' ? text.toLowerCase() : text;

  let result = '';
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const index = charset.indexOf(char);

    if (index !== -1) {
      const nextIndex = (index + shift) % radix;
      result += charset[nextIndex];
    } else {
      // Espaços, quebras de linha e símbolos são preservados
      result += char;
    }
  }

  return result;
}

/**
 * Descriptografa o texto cifrado aplicando a inversão do deslocamento
 * @param {string} ciphertext - Texto cifrado
 * @param {number|string} step - Passo original usado na criptografia
 * @param {'36'|'62'} mode - Modo do alfabeto utilizado
 * @returns {string} - Texto em claro
 */
function decrypt(ciphertext, step, mode = '36') {
  const parsed = parseInt(step, 10);
  if (isNaN(parsed)) {
    throw new Error('O passo (deslocamento) deve ser um número inteiro válido.');
  }
  return encrypt(ciphertext, -parsed, mode);
}

module.exports = {
  encrypt,
  decrypt,
  normalizeShift,
  CHARSET_36,
  CHARSET_62
};
