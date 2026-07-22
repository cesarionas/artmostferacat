alter table public.people enable row level security;
alter table public.images enable row level security;

drop policy if exists "public published people" on public.people;
create policy "public published people"
on public.people
for select
using (status = 'published' or public.is_admin());

drop policy if exists "public related images" on public.images;
create policy "public related images"
on public.images
for select
using (
  exists (
    select 1
    from public.people person
    where person.id = person_id
      and (person.status = 'published' or public.is_admin())
  )
);
