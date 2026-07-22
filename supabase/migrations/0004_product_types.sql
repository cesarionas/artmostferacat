create table public.product_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

insert into public.product_types (name, slug)
values
  ('Camisa', 'camisa'),
  ('Moletom', 'moletom'),
  ('Oversized', 'oversized'),
  ('Calça', 'calca'),
  ('Bermuda', 'bermuda'),
  ('Boné', 'bone'),
  ('Caneca', 'caneca')
on conflict (slug) do update set name = excluded.name;

alter table public.people
  add column if not exists product_type_id uuid references public.product_types(id) on delete set null;

update public.people person
set product_type_id = product_type.id
from public.product_types product_type
where person.product_type = product_type.slug
  and person.product_type_id is null;

create index if not exists people_product_type_idx on public.people(product_type_id);

alter table public.product_types enable row level security;

create policy "read product types" on public.product_types for select using (true);
create policy "admin all product types" on public.product_types for all using (public.is_admin()) with check (public.is_admin());
