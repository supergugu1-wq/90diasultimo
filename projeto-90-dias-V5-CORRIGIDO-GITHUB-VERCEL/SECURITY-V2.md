# Checklist de segurança — V2

## Antes de publicar
- [ ] Executar `supabase/schema.sql`.
- [ ] Criar bucket privado `premium-media` no Supabase Storage.
- [ ] Configurar todas as variáveis de `.env.example` na Vercel.
- [ ] Gerar `ADMIN_SECRET`, `SESSION_SECRET` e `KIWIFY_WEBHOOK_SECRET` fortes e diferentes.
- [ ] Manter `SUPABASE_SERVICE_ROLE_KEY` somente no servidor/Vercel.
- [ ] Configurar Supabase Auth e SMTP antes de ativar `AUTO_INVITE_CUSTOMERS=true`.
- [ ] Testar compra aprovada, reembolso, chargeback, cancelamento e atraso com payloads reais da Kiwify.
- [ ] Confirmar que cliente bloqueado não entra em `/dashboard`.
- [ ] Confirmar limite de 2 dispositivos.
- [ ] Confirmar que arquivos premium não existem em `/public`.
- [ ] Rodar `npm install && npm run build` em ambiente com acesso ao registro npm.

## Fluxo de acesso
Kiwify -> webhook -> customer_access -> Supabase Auth -> /dashboard -> AccessGuard -> device_sessions -> conteúdo.

## Fluxo de reembolso
Kiwify -> webhook -> active=false -> revoga device_sessions -> dashboard bloqueado -> URLs futuras de mídia recusadas.

## Limitação técnica
Nenhuma aplicação web consegue impedir 100% gravação de tela. A V2 foca em impedir acesso não autorizado, compartilhamento casual de conta, links permanentes de mídia e manutenção de acesso após reembolso.
