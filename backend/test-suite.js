/**
 * Test Suite Automatizado para o Backend
 * Valida todos os requisitos do Trabalho Fatec:
 * 1. Cadastro de usuário
 * 2. Login com JWT
 * 3. Cifra de César com deslocamento positivo e negativo
 * 4. Persistência de hash no banco SQLite
 * 5. Uso único do hash (queima após descriptografar)
 * 6. Tratamento de erros e integridade
 */

const assert = require('node:assert');
const http = require('node:http');
const { app, server } = require('./src/server');

function makeRequest(path, method, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = data ? JSON.parse(data) : {};
            resolve({ status: res.statusCode, data: json });
          } catch (e) {
            resolve({ status: res.statusCode, data });
          }
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('\x1b[33m--- INICIANDO SUÍTE DE TESTES AUTOMATIZADOS (CYBERPUNK 2077) ---\x1b[0m\n');

  try {
    // 1. Healthcheck
    const health = await makeRequest('/api/health', 'GET');
    assert.strictEqual(health.status, 200, 'Healthcheck falhou');
    console.log('\x1b[32m[PASS]\x1b[0m Healthcheck OK:', health.data.city);

    // 2. Registro de Usuário
    const testUser = `netrunner_${Date.now()}`;
    const testPass = 'nightcity2077';
    const regRes = await makeRequest('/api/auth/register', 'POST', {
      username: testUser,
      password: testPass,
      callsign: 'V_TESTER'
    });
    assert.strictEqual(regRes.status, 201, 'Falha no cadastro de usuário');
    assert.ok(regRes.data.token, 'Token JWT não retornado no cadastro');
    console.log('\x1b[32m[PASS]\x1b[0m Cadastro de Usuário OK');

    // 3. Login de Usuário
    const loginRes = await makeRequest('/api/auth/login', 'POST', {
      username: testUser,
      password: testPass
    });
    assert.strictEqual(loginRes.status, 200, 'Falha no login');
    const token = loginRes.data.token;
    assert.ok(token, 'Token JWT ausente no login');
    console.log('\x1b[32m[PASS]\x1b[0m Login com validação no DB e emissão de JWT OK');

    // 4. Tentativa de login com senha incorreta
    const badLogin = await makeRequest('/api/auth/login', 'POST', {
      username: testUser,
      password: 'wrong_password'
    });
    assert.strictEqual(badLogin.status, 401, 'Deveria rejeitar senha incorreta');
    console.log('\x1b[32m[PASS]\x1b[0m Bloqueio de senha incorreta OK');

    // 5. Criptografar mensagem (passo positivo, alfabeto alfanumérico)
    const originalMsg = 'cyberpunk 2077 - arasaka tower';
    const encRes = await makeRequest(
      '/api/cipher/encrypt',
      'POST',
      { message: originalMsg, step: 4 },
      token
    );
    assert.strictEqual(encRes.status, 201, 'Falha ao criptografar mensagem');
    const { ciphertext, hash } = encRes.data;
    assert.ok(ciphertext, 'Texto cifrado ausente');
    assert.ok(hash, 'Hash privado não gerado');
    console.log('\x1b[32m[PASS]\x1b[0m Criptografia com Cifra de César Alfanumérica OK');
    console.log(`       Original:  "${originalMsg}"`);
    console.log(`       Cifrado:   "${ciphertext}"`);
    console.log(`       Hash Key:  "${hash}"`);

    // 6. Descriptografar mensagem (1ª tentativa - deve ter sucesso)
    const decRes = await makeRequest(
      '/api/cipher/decrypt',
      'POST',
      { ciphertext, hash },
      token
    );
    assert.strictEqual(decRes.status, 200, 'Falha na descriptografia válida');
    assert.strictEqual(decRes.data.originalText, originalMsg, 'Texto descriptografado difere do original!');
    assert.strictEqual(decRes.data.usado, true, 'Hash não foi marcado como usado');
    console.log('\x1b[32m[PASS]\x1b[0m Descriptografia com sucesso e recuperação de texto claro OK');

    // 7. Descriptografar mensagem (2ª tentativa com o MESMO hash - DEVE FALHAR!)
    const reUseRes = await makeRequest(
      '/api/cipher/decrypt',
      'POST',
      { ciphertext, hash },
      token
    );
    assert.strictEqual(reUseRes.status, 400, 'Deveria bloquear reuso do hash');
    console.log('\x1b[32m[PASS]\x1b[0m Bloqueio estrito de reuso de hash (uso único) OK:', reUseRes.data.error);

    // 8. Descriptografar com hash inexistente
    const invalidHashRes = await makeRequest(
      '/api/cipher/decrypt',
      'POST',
      { ciphertext, hash: '0000000000000000000000000000000000000000000000000000000000000000' },
      token
    );
    assert.strictEqual(invalidHashRes.status, 404, 'Deveria retornar 404 para hash inexistente');
    console.log('\x1b[32m[PASS]\x1b[0m Validação de hash inexistente OK');

    // 9. Criptografia com passo negativo
    const negMsg = 'fatec 2026';
    const encNeg = await makeRequest(
      '/api/cipher/encrypt',
      'POST',
      { message: negMsg, step: -9 },
      token
    );
    assert.strictEqual(encNeg.status, 201);
    const decNeg = await makeRequest(
      '/api/cipher/decrypt',
      'POST',
      { ciphertext: encNeg.data.ciphertext, hash: encNeg.data.hash },
      token
    );
    assert.strictEqual(decNeg.status, 200);
    assert.strictEqual(decNeg.data.originalText, negMsg);
    console.log('\x1b[32m[PASS]\x1b[0m Cifra com passo negativo (-9) OK');

    console.log('\n\x1b[32m✓ TODOS OS TESTES PASSARAM COM SUCESSO! 100% DOS REQUISITOS ATENDIDOS.\x1b[0m\n');
  } catch (err) {
    console.error('\n\x1b[31m✗ ERRO NO TESTE:\x1b[0m', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();

