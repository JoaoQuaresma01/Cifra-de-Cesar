# 🌆 CYBERDECK 2077 // CIFRA DE CÉSAR ICE PROTOCOL

> **Trabalho Prático: Implementação de Cifra de César com Interface e Persistência em Banco de Dados**  
> **Instituição:** Fatec / Centro Paula Souza  
> **Professor:** Junio Gonçalves  
> **Tema Visual & Conceito:** Cyberpunk 2077 (Arasaka ICE & Netrunner Breach Protocol)

---

## 📌 Sumário Executivo do Projeto

Este projeto implementa uma solução completa e de alto nível para o Trabalho Prático de Cifra de César, ambientada na atmosfera futurista e distópica de **Cyberpunk 2077**.

O sistema combina rigor técnico (validações de segurança, senhas criptografadas com **Bcrypt**, autenticação **JWT**, persistência com **SQLite** e chaves de uso único) com uma interface visual rica, efeitos de glitch, HUD militar, sintetizador sonoro Web Audio API e visualizador interativo de deslocamento.

---

## 📋 Matriz de Conformidade com os Requisitos do Trabalho

| Requisito do Trabalho (PDF) | Situação | Implementação no Projeto |
| :--- | :---: | :--- |
| **Interface com pelo menos 4 telas** | **100% Atendido** | Telas de **Login**, **Cadastro de Usuário**, **Criptografar**, **Descriptografar** (+ Tela Extra de Auditoria de Datashards/Chaves). |
| **1. Tela de Login** (usuário e senha) | **100% Atendido** | Validação no SQLite; bloqueio de senhas incorretas com feedback visual e sonoro. |
| **1. Autenticação com JWT** | **100% Atendido** | Tokens JWT assinados com expiração de 24h garantindo autenticidade, integridade e confidencialidade em todas as rotas protegidas. |
| **2. Cadastro de Usuário** | **100% Atendido** | Persistência na tabela `users` do SQLite com hashing de senha via `bcryptjs`. |
| **3. Tela de Criptografar** (mensagem + passo) | **100% Atendido** | Inputs de mensagem e passo (aceita inteiros positivos e negativos); botões rápidos de ajuste e visualizador interativo em tempo real. |
| **3. Alfabeto alfanumérico (a-z, 0-9)** | **100% Atendido** | Alfabeto circular de 36 posições (`[a-z]` + `[0-9]`), onde letras viram números e números viram letras reciprocamente. Modo estendido de 62 chars também disponível. |
| **3. Geração de Hash (Chave Privada)** | **100% Atendido** | Gera um hash criptográfico SHA-256 de 64 caracteres único, exibido na tela com botão de cópia em 1 clique. |
| **3. Persistência do Hash + Passo no DB** | **100% Atendido** | Armazenado na tabela `cipher_keys` com o valor do passo e coluna `usado = 0 (false)`. |
| **3. Chave de uso único (1 hash = 1 uso)** | **100% Atendido** | Ao ser descriptografado com sucesso, o hash é marcado como `usado = 1 (true)` no banco de dados. Tentativas posteriores são bloqueadas com erro 400. |
| **4. Tela de Descriptografar** (mensagem + hash) | **100% Atendido** | Inputs para ciphertext e chave hash; valida existência e integridade no banco. |
| **4. Exibição de texto claro ou erro** | **100% Atendido** | Em caso de sucesso, exibe a mensagem original em claro; caso o hash não exista ou já tenha sido usado, exibe alerta explícito de segurança. |
| **Critérios: Criatividade & Apresentação (30%)** | **Destaque** | Estética Cyberpunk 2077: paleta neon (#FCEE0A, #00F0FF, #FF003C), botões chanfrados, CRT scanlines ativáveis/desativáveis, efeitos sonoros sintetizados via Web Audio API e confetes. |

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
  * **React 19** + **Vite 6**
  * **Tailwind CSS** (estilização HUD personalizada com cantos chanfrados via `clip-path`)
  * **Lucide React** (ícones temáticos)
  * **Canvas Confetti** (efeito de celebração no Breach Protocol)
  * **Web Audio API Synth** (efeitos sonoros sintetizados em tempo real, 100% offline e sem arquivos de áudio externos)

* **Backend:**
  * **Node.js** (v20+ / v24)
  * **Express.js** (API RESTful)
  * **JSON Web Token (`jsonwebtoken`)** (autenticação segura)
  * **Bcrypt.js** (criptografia de senhas)
  * **SQLite** (banco de dados relacional embarcado, zero configuração necessária)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* **Node.js** (versão 18, 20 LTS ou 24 instalada)
* **NPM**

### 1. Clonar o Repositório
```bash
git clone https://github.com/JoaoQuaresma01/Cifra-de-Cesar.git
cd Cifra-de-Cesar
```

### 2. Instalar as Dependências
O projeto possui um script centralizado que instala todas as dependências da raiz, backend e frontend:
```bash
npm run install:all
```
*(Ou, se preferir, execute `npm install` na raiz, dentro de `backend/` e dentro de `frontend/`)*

### 3. Iniciar a Aplicação

#### Modo de Produção / Demonstração Rápida (Recomendado para Avaliação):
Executa a aplicação completa em uma única porta (`http://localhost:5000`):
```bash
npm start
```
Acesse no seu navegador: **`http://localhost:5000`**

#### Modo de Desenvolvimento:
Executa o backend (com `--watch`) e o frontend Vite (com Hot Module Reloading) simultaneamente:
```bash
npm run dev
```
* **Frontend:** `http://localhost:5173`
* **Backend API:** `http://localhost:5000`

---

## 🧪 Testes Automatizados do Backend

O projeto inclui uma suíte completa de testes automatizados que verifica todos os requisitos do PDF (cadastro, login JWT, cifra com passos positivos/negativos, gravação no SQLite e bloqueio de reuso de hash):

```bash
npm test --prefix backend
# ou
node backend/test-suite.js
```

---

## 📱 Visão Geral das 4 Telas Requeridas

### 1. Tela de Login (`/login`) - Terminal de Acesso
* **Entrada de Usuário e Senha.**
* Validação direta com os registros da tabela `users` do banco SQLite.
* Retorna o token **JWT**, gravado no cliente para autorizar as demais operações.
* Possui atalho para alternar para a tela de Cadastro.

### 2. Tela de Cadastro de Usuário (`/register`) - Registro de Netrunner
* Permite cadastrar nome de usuário, codinome opcional e senha neural.
* Senha processada através do algoritmo **Bcrypt** com salt rounds = 10.
* Impede duplicidade de operadores no sistema.

### 3. Tela de Criptografar (`/encrypt`) - Protocolo ICE
* **Campo de Mensagem:** Texto a ser protegido.
* **Campo de Passo:** Número inteiro de casas a serem deslocadas (aceita valores positivos ex: `+3`, `+14` ou negativos ex: `-5`, `-12`).
* **Visualizador Interativo (HUD):** Mostra visualmente a rotação do alfabeto alfanumérico conforme você ajusta o passo.
* **Resultado:**
  * Exibe o **Ciphertext** criptografado.
  * Exibe a **Chave Privada (Hash)** gerada (SHA-256).
  * Salva o hash no SQLite com o passo e a coluna `usado = 0 (false)`.
  * Botões de cópia rápida para transferência imediata.

### 4. Tela de Descriptografar (`/decrypt`) - Breach Protocol
* **Campo de Mensagem Criptografada** e **Campo da Chave Hash**.
* O backend consulta o SQLite:
  * Se o hash não existe: exibe erro de chave inexistente.
  * Se o hash já foi usado (`usado = 1`): exibe o alerta: **`CHAVE JÁ UTILIZADA // PROTOCOLO QUEIMADO`**, impedindo a reutilização.
  * Se o hash é válido e não usado: restaura o texto em claro, marca imediatamente `usado = 1` no banco e exibe a mensagem original com animação e efeito sonoro.

### 5. Tela Extra: Datashards & Auditoria do Banco (`/history`)
* Permite ao professor e avaliador inspecionar em tempo real a tabela do SQLite:
  * Lista todas as chaves geradas.
  * Mostra o passo vinculado e o status da coluna `usado` (`DISPONÍVEL (FALSE)` vs `USADO (TRUE)`).

---

## 🗄️ Esquema do Banco de Dados (SQLite)

O banco é criado automaticamente no primeiro arranque em `backend/data/cifra_cesar.sqlite`:

```sql
-- Tabela de Usuários / Operadores
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password TEXT NOT NULL,
  callsign TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Chaves e Cifras
CREATE TABLE cipher_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hash TEXT UNIQUE NOT NULL,
  step INTEGER NOT NULL,
  mode TEXT DEFAULT '36',
  usado INTEGER DEFAULT 0 NOT NULL, -- 0 = false, 1 = true
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  used_at DATETIME
);
```

---

## ⚙️ Regra de Negócio: Cifra de César Alfanumérica (36 Chars)

Conforme especificado no documento (`a-z, 0-9`), o alfabeto circular possui 36 caracteres:

$$\text{Alfabeto} = [\text{'a'}, \dots, \text{'z'}, \text{'0'}, \dots, \text{'9'}]$$

* Posições $0$ a $25$: Letras minúsculas de `a` a `z`
* Posições $26$ a $35$: Dígitos numéricos de `0` a `9`

A fórmula de cifragem com suporte a passos negativos e rotação circular é dada por:

$$\text{Índice}_{\text{cifrado}} = ((\text{Índice}_{\text{original}} + \text{passo}) \pmod{36} + 36) \pmod{36}$$

Exemplo prático:
* Texto original: `cyberpunk 2077`
* Passo: `+3`
* Caractere `'y'` (índice 24) $\rightarrow 24 + 3 = 27 \rightarrow$ **`'1'`** (número!)
* Caractere `'7'` (índice 33) $\rightarrow 33 + 3 = 36 \pmod{36} = 0 \rightarrow$ **`'a'`** (letra!)
* Resultado cifrado: **`f1ehusxqn 53aa`**

---

## 👤 Desenvolvido para
**Fatec - Faculdade de Tecnologia do Estado de São Paulo**  
Disciplina / Avaliação: Trabalho Prático de Cifra de César  
Professor: Junio Gonçalves

