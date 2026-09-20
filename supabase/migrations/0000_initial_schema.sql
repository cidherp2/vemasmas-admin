create extension if not exists pgcrypto;
create table public.persons (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    name text not null,
    email text not null unique,
    phone varchar(10) not null,
    role text,
    status text not null default 'active',
    constraint persons_phone_ten_digits check (phone ~ '^[0-9]{10}$'),
    constraint persons_status_allowed check (status in ('active', 'inactive'))
);
create index persons_name_lower_idx on public.persons (lower(name));
create index persons_email_lower_idx on public.persons (lower(email));
alter table public.persons enable row level security;
create policy "Authenticated users can read persons" on public.persons for
select to authenticated using (true);
create policy "Authenticated users can create persons" on public.persons for
insert to authenticated with check (true);
create policy "Authenticated users can update persons" on public.persons for
update to authenticated using (true) with check (true);
create policy "Authenticated users can delete persons" on public.persons for delete to authenticated using (true);