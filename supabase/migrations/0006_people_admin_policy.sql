alter table public.people enable row level security;

drop policy if exists "admin all people" on public.people;

create policy "admin all people"
on public.people
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

alter table public.images enable row level security;

drop policy if exists "admin all images" on public.images;

create policy "admin all images"
on public.images
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin storage images" on storage.objects;

create policy "admin storage images"
on storage.objects
for all
to authenticated
using (bucket_id = 'people-images' and public.is_admin())
with check (bucket_id = 'people-images' and public.is_admin());
