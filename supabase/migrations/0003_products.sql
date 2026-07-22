alter table public.people
  add column if not exists product_type text;

alter table public.people
  drop constraint if exists people_product_type_check;

alter table public.people
  add constraint people_product_type_check
  check (product_type is null or product_type in ('camisa', 'moletom', 'oversized'));

insert into public.categories (name, slug)
values
  ('Wrestling', 'wrestling'),
  ('Música', 'musica'),
  ('Geek', 'geek'),
  ('Cultura Sáfica', 'cultura-safica')
on conflict (slug) do update set name = excluded.name;
