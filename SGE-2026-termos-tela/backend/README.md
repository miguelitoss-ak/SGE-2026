# SGE-2026 - Sistema de Gestão de Estágios

Repositório focado no desenvolvimento do sistema da seção de estágios do IFRS Bento Gonçalves.

## 🚀 Tecnologias

- **Node.js** + **Express 5**
- **Prisma ORM** com **MySQL**
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **Helmet** + **CORS** para segurança

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Ferramenta | Versão Mínima | Verificar |
|------------|---------------|-----------|
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |
| **MySQL** | 8.0+ | `mysql --version` |
| **Git** | 2.30+ | `git --version` |

---

## ⚙️ Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/miguelitoss-ak/SGE-2026.git
cd SGE-2026
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados MySQL

#### Opção A: MySQL Local (recomendado para desenvolvimento)

```bash
# Entre no MySQL como root
mysql -u root -p

# No shell do MySQL, crie o banco e usuário:
CREATE DATABASE IF NOT EXISTS sge
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'sge_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON sge.* TO 'sge_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Opção B: Docker (alternativa rápida)

```bash
docker run -d \
  --name sge-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=sge \
  -e MYSQL_USER=sge_user \
  -e MYSQL_PASSWORD=sua_senha_segura \
  -p 3306:3306 \
  mysql:8.0
```

### 4. Configure as variáveis de ambiente

Copie o arquivo de exemplo e edite:

```bash
cp .env.example .env
```

**Ou crie o `.env` manualmente** com o seguinte conteúdo:

```env
# ===========================================
# BANCO DE DADOS
# ===========================================
# Formato: mysql://usuario:senha@host:porta/banco
DATABASE_URL="mysql://sge_user:sua_senha_segura@localhost:3306/sge"

# ===========================================
# AUTENTICAÇÃO JWT
# ===========================================
# Gere uma chave forte: openssl rand -base64 32
JWT_SECRET="sua_chave_secreta_super_forte_aqui_com_pelo_menos_32_caracteres"
JWT_EXPIRES_IN="1h"

# ===========================================
# SERVIDOR
# ===========================================
PORT=3000
NODE_ENV=development
```

> ⚠️ **Importante**: Nunca commite o arquivo `.env` real! Ele já está no `.gitignore`.

### 5. Gere o Prisma Client e rode as migrations

```bash
# Gera o Prisma Client baseado no schema.prisma
npx prisma generate

# Cria as tabelas no banco (executa o schema.prisma)
npx prisma db push

# Opcional: Visualize o banco no Prisma Studio
npx prisma studio
```

### 6. (Opcional) Popule com dados de teste

```bash
# Se existir seed.prisma ou script de seed:
npx prisma db seed
```

---

## ▶️ Executando a Aplicação

### Desenvolvimento (com hot-reload)

```bash
npm run dev
```

> O servidor reinicia automaticamente ao salvar arquivos.
> Acesse: **http://localhost:3000**

### Produção

```bash
npm start
```

---

## 🧪 Testando a API

### Via arquivo HTTP (VS Code + REST Client)

O projeto já inclui `testes.http` com exemplos prontos:

```bash
# No VS Code, instale a extensão "REST Client"
# Abra testes.http e clique em "Send Request" acima de cada bloco
```

### Via curl (exemplos rápidos)

**Registrar usuário:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ifrs.edu.br","password":"123456","role":"admin"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ifrs.edu.br","password":"123456"}'
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "admin@ifrs.edu.br", "role": "admin" }
}
```

**Usar token (rotas protegidas):**
```bash
TOKEN="seu_token_aqui"

# Listar alunos (rota pública de exemplo)
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/alunos

# Criar aluno
curl -X POST http://localhost:3000/alunos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"matricula":2026001,"nome":"João Silva","cpf":"12345678901","email":"joao@aluno.ifrs.edu.br","id_curso":1}'
```

---

## 📁 Estrutura do Projeto

```
SGE-2026/
├── prisma/
│   └── schema.prisma          # Schema do banco (modelos + enums)
├── src/
│   ├── app.js                 # Configuração do Express + rotas
│   ├── server.js              # Entry point (inicia servidor)
│   ├── config/                # Configurações extras
│   ├── controllers/           # Camada de controle (req/res)
│   ├── middlewares/           # Auth, error handling
│   ├── models/                # Camada de dados (Prisma queries)
│   ├── routes/                # Definição de rotas por recurso
│   ├── services/              # Regras de negócio
│   ├── utils/                 # Helpers (validação de email, etc.)
│   ├── prisma/
│   │   └── prismaClient.js    # Instância singleton do Prisma
│   └── testsHTTP/             # Testes manuais (.http files)
├── .env                       # Variáveis de ambiente (NÃO versionar)
├── .env.example               # Exemplo de variáveis
├── .gitignore
├── package.json
├── package-lock.json
├── sge.sql                    # SQL bruto para referência
└── README.md                  # Este arquivo
```

---

## 🔐 Rotas da API

### Autenticação (`/auth`)
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/register` | Cria usuário |
| POST | `/auth/login` | Login + retorna JWT |
| GET | `/auth/me` | Dados do usuário logado |

### Recursos Públicos (`/public`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/public/...` | Rotas sem autenticação |

### Recursos Protegidos (`/protected`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/protected/...` | Requer JWT válido |

### Domínio (CRUD completo)
| Recurso | Base | Operações |
|---------|------|-----------|
| Alunos | `/alunos` | GET, POST |
| Empresas | `/empresas` | GET, POST |
| Supervisores | `/supervisores` | GET, POST |
| Cursos | `/cursos` | GET, POST |
| Estágios | `/estagios` | GET, POST |
| Orientadores | `/orientadores` | GET, POST |
| Documentos | `/documentos` | GET, POST |
| Horários | `/horarios` | GET, POST |

---

## 🛠️ Comandos Úteis

```bash
# Prisma
npx prisma generate          # Regenera client após mudar schema
npx prisma db push           # Sincroniza schema com banco (dev)
npx prisma migrate dev       # Cria migration versionada
npx prisma studio            # Interface visual do banco
npx prisma validate          # Valida schema

# Desenvolvimento
npm run dev                  # Inicia com nodemon
npm start                    # Inicia em produção

# Banco
mysql -u sge_user -p sge     # Conecta no banco via CLI
```

> **Última atualização**: Novembro 2026
