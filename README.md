# URL Shortener Monorepo

Este projeto é um sistema completo de encurtador de URLs, com autenticação JWT, frontend em Next.js e backends em NestJS (users-api e urls-api). O sistema permite registro, login, gerenciamento de URLs, redirecionamento, e contagem de acessos.

## Estrutura do Projeto

- **apps/urlshortener**: Frontend (Next.js)
- **apps/users-api**: API de usuários (NestJS)
- **apps/urls-api**: API de URLs (NestJS)

## Funcionalidades
- Registro e login de usuários (JWT)
- CRUD de usuário
- Encurtamento de URLs (autenticado ou anônimo)
- Listagem, edição e deleção (soft delete) de URLs do usuário
- Redirecionamento automático
- Contagem de acessos
- Navegação clara e responsiva
- Botão "Copiar" para URL gerada

## Rotas Principais

### Frontend (Next.js)
- `/` — Tela principal para encurtar URLs
- `/login` — Login
- `/register` — Cadastro
- `/user` — Dados do usuário
- `/user/urls` — Gerenciamento de URLs do usuário
- `/[shortUrl]` — Redirecionamento automático

### API de Usuários (`users-api`)
- `POST /api/auth/register` — Cadastro
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Dados do usuário autenticado
- `PUT /api/users/:id` — Atualizar usuário
- `DELETE /api/users/:id` — Soft delete usuário

### API de URLs (`urls-api`)
- `POST /api/urls` — Encurtar URL
- `GET /api/urls` — Listar URLs do usuário autenticado
- `PUT /api/urls/:id` — Editar URL
- `DELETE /api/urls/:id` — Soft delete URL
- `GET /:shortUrl` — Redirecionamento e contagem de acesso

## Variáveis de Ambiente

Configure o arquivo `.env` na raiz com as variáveis necessárias para banco, JWT, CORS, URLs e portas. Exemplos:

```
USERS_API_PORT=3001
URLS_API_PORT=3002
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=algumseguro
DATABASE_URL=postgres://user:pass@db:5432/urlshortener
NEXT_PUBLIC_API_USERS_URL=http://localhost:3001/api
NEXT_PUBLIC_API_URLS_URL=http://localhost:3002/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Como Executar

1. **Instale as dependências e suba o banco:**
   ```sh
   npm run setup
   ```
2. **Suba todos os serviços (frontend e backends):**
   ```sh
   npm run dev
   ```
3. **Acesse:**
   - Frontend: http://localhost:3000
   - Users API: http://localhost:3001/api
   - URLs API: http://localhost:3002/api

4. **Limpar banco de dados (remove todos os dados):**
   ```sh
   docker-compose down -v
   ```

## Observações
- O frontend consome as APIs usando as variáveis de ambiente configuradas.
- O botão "Copiar" aparece após gerar uma URL encurtada.
- Todas as rotas protegidas exigem JWT (token salvo em cookie).
- O sistema está pronto para desenvolvimento local e fácil deploy via Docker Compose.

---

> Projeto desenvolvido com Nx, Next.js, NestJS, Docker, JWT e TailwindCSS.
