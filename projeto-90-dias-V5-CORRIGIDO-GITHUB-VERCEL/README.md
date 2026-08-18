# Projeto 90 Dias — Segurança Kiwify V2

Versão reforçada para GitHub + Vercel + Kiwify + Supabase.

## Melhorias da V2
- Webhook Kiwify ativa e bloqueia clientes por compra, reembolso, chargeback, atraso e cancelamento.
- Ao bloquear um cliente, as sessões de dispositivos são revogadas automaticamente.
- Limite configurável de dispositivos ativos (`MAX_ACTIVE_DEVICES`, padrão 2).
- Autorização de dispositivo em `/api/access/authorize` usando JWT válido do Supabase Auth.
- Mídia premium em bucket privado com URLs assinadas de curta duração (`/api/media/signed-url`).
- Logs de segurança: logins admin, bloqueios, dispositivos, mídia e eventos Kiwify.
- Painel `/admin` com busca de clientes e bloqueio/reativação imediata.
- Sessão administrativa assinada e cookie HttpOnly/SameSite Strict.
- Headers reforçados (CSP, HSTS, COOP, CORP, nosniff, frame deny e permissions policy).
- Banco com RLS e tabelas sensíveis sem acesso direto de anon/authenticated.

## Configuração
1. Rode `npm install`.
2. Copie `.env.example` para `.env.local`.
3. Configure as variáveis no Vercel.
4. Execute `supabase/schema.sql` no SQL Editor do Supabase.
5. No Supabase Storage, crie um bucket **privado** chamado `premium-media`.
6. Ative/configure o Supabase Auth para seus alunos.
7. Faça `npm run build` antes do deploy.

## Kiwify
Webhook sugerido:
`https://SEU-DOMINIO.com/api/kiwify/webhook?secret=SEU_KIWIFY_WEBHOOK_SECRET`

Faça testes reais/sandbox com os payloads da sua conta Kiwify e confirme os nomes exatos dos eventos antes da venda.

## Controle de dispositivo
Após o aluno autenticar pelo Supabase Auth, o front-end envia o JWT e um identificador estável do dispositivo para `/api/access/authorize`. O servidor confere:
1. JWT válido;
2. compra/acesso ativo;
3. dispositivo já autorizado ou vaga disponível;
4. limite de dispositivos.

## Mídia privada
Não coloque vídeos premium dentro de `/public`. Faça upload no bucket privado `premium-media`. Para assistir, solicite `/api/media/signed-url` com JWT e `deviceId`. A URL expira rapidamente (padrão 180 segundos).

## Painel Admin
Abra `/admin` e use `ADMIN_USERNAME` + `ADMIN_SECRET`. Nunca coloque essas variáveis no GitHub.

## Importante
Nenhum site impede 100% gravação de tela ou cópia por um comprador legítimo. Esta versão reduz compartilhamento, revoga acesso rapidamente e impede que links diretos de mídia funcionem permanentemente.

## Visual Premium V3
- Dashboard redesenhado com hierarquia visual premium.
- Progresso de 90 dias em destaque.
- Navegação Academia/Em Casa refinada.
- Cards de exercício e estados concluído/ativo.
- Layout mobile com barra inferior.
- Landing page redesenhada.
- Placeholders explícitos para vídeos (vídeos serão adicionados na próxima etapa).


## V4 — mídia de exercícios
A interface foi preparada para um vídeo exclusivo por exercício em `public/media/exercises/`. O antigo circuito metabólico foi substituído por **Full Body Progressivo**. Consulte `VIDEOS-PLANO.md`. Os vídeos reais não estão incluídos nesta versão porque precisam ser produzidos externamente com movimento corporal real; não foram simulados com imagens estáticas.
