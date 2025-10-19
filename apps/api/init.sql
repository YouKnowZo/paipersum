create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  name text, size int, mime text,
  s3_key text, created_at timestamptz default now()
);
create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  doc_id uuid references documents(id),
  risk_score int, confidence real, result jsonb,
  created_at timestamptz default now()
);
create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  key text unique not null, created_at timestamptz default now()
);
create table if not exists audit_logs (
  id bigserial primary key,
  user_id uuid, action text, meta jsonb, created_at timestamptz default now()
);
