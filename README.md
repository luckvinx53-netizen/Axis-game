# Axis Game

O Brasfoot da nova geração: carreira de jogador, carreira de treinador, motor de
simulação de partidas, treinamento, transferências e sala de troféus — construído
com Next.js, Supabase e deploy no Vercel.

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + Row Level Security)
- **Deploy:** Vercel
- **Repositório:** GitHub

## Estrutura do projeto

```
axis-game/
├── src/
│   ├── app/                  # Rotas (App Router)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts     # Cliente Supabase (Client Components)
│   │       └── server.ts     # Cliente Supabase (Server Components/Actions)
│   ├── types/
│   │   └── database.types.ts # Tipos do banco (regenerar com `npm run db:types`)
│   └── components/           # Componentes de UI (a crescer nas próximas fases)
├── supabase/
│   └── migrations/
│       └── 0001_init_schema.sql  # Schema: ligas, clubes, jogadores, carreiras,
│                                  # partidas, transferências, troféus
├── tailwind.config.ts         # Tokens de design (cores, fontes)
└── package.json
```

## Passo a passo — do zero ao ar

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) → **New Project**.
2. Copie a **Project URL** e a **anon public key** em
   `Project Settings → API`.
3. Duplique `.env.local.example` para `.env.local` e preencha:

```bash
cp .env.local.example .env.local
```

### 3. Aplicar o schema do banco

**Opção A — SQL Editor (mais rápido para começar):**
Abra o SQL Editor do seu projeto no Supabase, cole o conteúdo de
`supabase/migrations/0001_init_schema.sql` e rode.

**Opção B — Supabase CLI (recomendado a partir daqui):**

```bash
npm install -g supabase
supabase login
supabase link --project-ref SEU-PROJECT-REF
supabase db push
```

### 4. Gerar os tipos do banco (opcional, mas recomendado)

Depois de linkar o projeto (`supabase link`), rode:

```bash
export SUPABASE_PROJECT_ID=seu-project-id
npm run db:types
```

Isso substitui `src/types/database.types.ts` (escrito à mão por enquanto) pela
versão gerada automaticamente a partir do schema real — sempre em dia.

### 5. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 6. Subir para o GitHub

```bash
git init
git add .
git commit -m "Estrutura inicial do Axis Game"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/axis-game.git
git push -u origin main
```

### 7. Deploy no Vercel

1. Em [vercel.com](https://vercel.com) → **Add New → Project** → importe o
   repositório `axis-game` do GitHub.
2. Em **Environment Variables**, adicione as mesmas chaves do `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`).
3. Clique em **Deploy**. Todo push na branch `main` gera um novo deploy
   automaticamente.

## O que já está pronto (Fase 1)

- [x] Estrutura do projeto Next.js + Tailwind com tokens de design do jogo
- [x] Conexão com Supabase (client + server)
- [x] Schema completo do banco: perfis, ligas, temporadas, clubes, jogadores,
      atributos, carreiras (jogador/treinador), partidas, eventos de partida,
      transferências, troféus (clube e individual)
- [x] Row Level Security: dados de jogo com leitura pública, dados de carreira
      privados por usuário
- [x] Tela inicial com a identidade visual

## Próximas fases

1. **Autenticação** — cadastro/login (Supabase Auth) e criação de carreira
2. **Dashboard do modo carreira** — visão do clube ou do jogador controlado
3. **Motor de simulação de partidas** — resultados baseados em atributos, forma
   e decisões táticas
4. **Elenco, treinamento e transferências**
5. **Sala de troféus** — a tela com holofotes e taças em pedestais
6. **Polimento visual** — cards de jogador, animações, apresentação estilo FIFA
