# Artmosfera

Catálogo de pessoas e acervos construído com Next.js 15, TypeScript, Tailwind CSS e Supabase. A interface pública é aberta; a administração é protegida por Supabase Auth e RLS.

## Instalação

1. Instale Node.js 20.9+ e execute `npm install`.
2. Copie `.env.example` para `.env.local` e preencha a URL e a chave anônima do Supabase.
3. No SQL Editor do Supabase, execute `supabase/migrations/0001_initial.sql`.
4. Em **Authentication > Users**, crie o usuário administrador e execute, substituindo o UUID: `insert into public.profiles (id, role) values ('UUID_DO_USUARIO', 'admin');`.
5. Execute `npm run dev`.

## Storage e segurança

A migration cria `people-images` (público, apenas imagens) e `people-files` (privado, com URLs assinadas de uma hora). As políticas RLS permitem leitura pública somente de pessoas publicadas e escrita apenas para administradores. O limite por arquivo é 15 MB e os MIME types são validados no bucket e no cliente.

## Deploy na Vercel

Importe o repositório na Vercel, configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e opcionalmente `NEXT_PUBLIC_SITE_URL`. O build é `npm run build`. Adicione a URL Vercel em **Authentication > URL Configuration** no Supabase.

## Estrutura

- `app/`: rotas App Router, APIs e SEO.
- `features/`: componentes por domínio público e administrativo.
- `services/`: consultas de domínio ao Supabase.
- `supabase/`: clientes SSR/browser e migrations SQL.
- `types/`, `lib/` e `components/`: contratos e componentes reutilizáveis.

## Próximos incrementos

O banco e a UI já suportam categorias, tags, ordenação e imagens. Para grandes acervos, adicione paginação por cursor ao endpoint e um job de compressão de imagens antes do upload.
