# MLMP - Modern Fullstack Boilerplate

Um boilerplate fullstack moderno, flexível e pronto para produção, projetado para ser o ponto de partida ideal para qualquer aplicação web.

## 🚀 Stack Tecnológica

### Backend

- **[Fastify](https://fastify.dev/)** - Framework web rápido e eficiente
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM TypeScript-first com migrations
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional robusto
- **[Zod](https://zod.dev/)** - Validação de schemas com TypeScript
- **JWT** - Autenticação stateless com access + refresh tokens
- **bcryptjs** - Hash seguro de senhas

### Frontend

- **[React 19](https://react.dev/)** - Biblioteca UI declarativa
- **[Vite](https://vitejs.dev/)** - Build tool ultra-rápido
- **[TailwindCSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes UI acessíveis e customizáveis
- **[React Router 7](https://reactrouter.com/)** - Roteamento moderno
- **[React Hook Form](https://react-hook-form.com/)** - Formulários performáticos
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de estado do servidor
- **[Axios](https://axios-http.com/)** - Cliente HTTP com interceptors

## 📁 Estrutura do Projeto

```
mlmp/
├── back/                    # Backend Fastify
│   ├── src/
│   │   ├── db/              # Database config e schemas Drizzle
│   │   ├── lib/             # Utilitários (errors, helpers)
│   │   ├── middleware/      # Middlewares (auth, etc)
│   │   ├── modules/         # Módulos de negócio
│   │   │   ├── auth/        # Autenticação (login, register, etc)
│   │   │   └── users/       # CRUD de usuários
│   │   ├── routes/          # Registro de rotas
│   │   └── server.ts        # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── front/                   # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   │   └── ui/          # Componentes Shadcn/ui
│   │   ├── config/          # Configurações (rotas, etc)
│   │   ├── contexts/        # React Contexts (Auth, Theme)
│   │   ├── hooks/           # Custom hooks
│   │   ├── layouts/         # Layouts de página
│   │   ├── pages/           # Páginas/views
│   │   ├── services/        # Serviços de API
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Componente raiz
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml       # Produção
├── docker-compose.dev.yml   # Desenvolvimento
└── README.md
```

## 🏁 Quick Start

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose (recomendado)
- PostgreSQL (ou use Docker)

### 1. Clone e instale

```bash
git clone <repo-url>
cd mlmp

# Backend
cd back && npm install

# Frontend
cd ../front && npm install
```

### 2. Configure as variáveis de ambiente

```bash
# Backend
cp back/.env.example back/.env

# Frontend (opcional - para produção)
# Crie front/.env com VITE_API_URL se necessário
```

### 3. Inicie o banco de dados

```bash
# Com Docker (recomendado)
docker compose -f docker-compose.dev.yml up -d

# Ou use um PostgreSQL local/remoto
```

### 4. Execute as migrations

```bash
cd back
npm run db:push    # Aplica schema direto (dev)
# ou
npm run db:migrate # Executa migrations (prod)
```

### 5. Inicie os servidores

```bash
# Na raiz do projeto
npm run dev

# Ou separadamente:
cd back && npm run dev   # http://localhost:3000
cd front && npm run dev  # http://localhost:5173
```

## 🐳 Docker (Produção)

```bash
# Build e start de todos os serviços
docker compose up -d --build

# Acessar:
# Frontend: http://localhost
# Backend:  http://localhost:3000
```

## 📜 Scripts Disponíveis

### Backend (`/back`)

| Script                | Descrição                                   |
| --------------------- | ------------------------------------------- |
| `npm run dev`         | Inicia em modo desenvolvimento (hot reload) |
| `npm run build`       | Compila TypeScript                          |
| `npm run start`       | Inicia em produção                          |
| `npm run db:generate` | Gera migrations Drizzle                     |
| `npm run db:migrate`  | Executa migrations                          |
| `npm run db:push`     | Push direto do schema                       |
| `npm run db:studio`   | Abre Drizzle Studio                         |

### Frontend (`/front`)

| Script            | Descrição              |
| ----------------- | ---------------------- |
| `npm run dev`     | Inicia Vite dev server |
| `npm run build`   | Build de produção      |
| `npm run preview` | Preview do build       |
| `npm run lint`    | Executa ESLint         |

## 🔐 Autenticação

O sistema de autenticação está pronto para uso:

### Endpoints

| Método | Endpoint                | Descrição                       |
| ------ | ----------------------- | ------------------------------- |
| POST   | `/auth/register`        | Registro de novo usuário        |
| POST   | `/auth/login`           | Login                           |
| POST   | `/auth/refresh`         | Renovar tokens                  |
| POST   | `/auth/logout`          | Logout (requer auth)            |
| GET    | `/auth/me`              | Perfil do usuário (requer auth) |
| PUT    | `/auth/change-password` | Alterar senha (requer auth)     |

### Tokens

- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias
- Refresh automático no frontend via interceptor Axios

## 🏗️ Criando um Novo Módulo

### Backend

1. Crie a pasta em `src/modules/seu-modulo/`
2. Crie os arquivos:

   - `seu-modulo.schema.ts` - Validações Zod
   - `seu-modulo.service.ts` - Lógica de negócio
   - `seu-modulo.controller.ts` - Handlers de requisição
   - `seu-modulo.routes.ts` - Definição de rotas
   - `index.ts` - Barrel export

3. Registre em `src/routes/index.ts`:

```typescript
import { seuModuloRoutes } from "../modules/seu-modulo/index.js"
fastify.register(seuModuloRoutes, { prefix: "/seu-modulo" })
```

### Frontend

1. Crie hooks em `src/hooks/use-seu-modulo.ts`
2. Crie o serviço em `src/services/seu-modulo.service.ts`
3. Adicione tipos em `src/types/`
4. Crie páginas em `src/pages/`
5. Configure rotas em `src/config/routes.config.ts`

## 🎨 Adicionando Componentes UI

Use o CLI do Shadcn/ui:

```bash
cd front
npx shadcn@latest add button
npx shadcn@latest add dialog
# etc...
```

## 🔒 Variáveis de Ambiente

### Backend (`.env`)

| Variável             | Descrição                 | Exemplo                                  |
| -------------------- | ------------------------- | ---------------------------------------- |
| `DATABASE_URL`       | URL de conexão PostgreSQL | `postgres://user:pass@localhost:5432/db` |
| `PORT`               | Porta do servidor         | `3000`                                   |
| `JWT_SECRET`         | Secret do access token    | `random-string-here`                     |
| `JWT_REFRESH_SECRET` | Secret do refresh token   | `another-random-string`                  |

### Frontend (`.env`)

| Variável       | Descrição  | Exemplo                 |
| -------------- | ---------- | ----------------------- |
| `VITE_API_URL` | URL da API | `http://localhost:3000` |

## 📝 Roadmap

- [ ] Testes automatizados (Vitest)
- [ ] CI/CD (GitHub Actions)
- [ ] Documentação Swagger/OpenAPI
- [ ] Sistema multi-tenant
- [ ] Upload de arquivos
- [ ] Serviço de e-mail
- [ ] Internacionalização (i18n)
- [ ] PWA Support

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para acelerar seu próximo projeto.**
