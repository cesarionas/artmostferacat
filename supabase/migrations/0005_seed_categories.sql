insert into public.categories (name, slug)
values
  ('Wrestling', 'wrestling'),
  ('Música', 'musica'),
  ('Geek', 'geek'),
  ('Cultura Sáfica', 'cultura-safica')
on conflict (slug) do update
  set name = excluded.name;
