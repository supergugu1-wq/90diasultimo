create extension if not exists pgcrypto;

create table if not exists public.customer_access (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  active boolean not null default false,
  source text,
  blocked_reason text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.customer_access add column if not exists blocked_reason text;

create table if not exists public.device_sessions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  device_hash text not null,
  device_name text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique(email, device_hash)
);
create index if not exists device_sessions_email_idx on public.device_sessions(email);

create table if not exists public.security_events (
  id bigint generated always as identity primary key,
  email text,
  event_type text not null,
  ip_hash text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists security_events_email_created_idx on public.security_events(email, created_at desc);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  storage_path text unique not null,
  title text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.customer_access enable row level security;
alter table public.device_sessions enable row level security;
alter table public.security_events enable row level security;
alter table public.media_assets enable row level security;

-- O navegador não acessa estas tabelas diretamente. Todas as decisões sensíveis
-- passam por rotas server-side usando SUPABASE_SERVICE_ROLE_KEY.
revoke all on table public.customer_access from anon, authenticated;
revoke all on table public.device_sessions from anon, authenticated;
revoke all on table public.security_events from anon, authenticated;
revoke all on table public.media_assets from anon, authenticated;
