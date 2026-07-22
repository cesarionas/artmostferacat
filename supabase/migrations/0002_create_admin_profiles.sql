-- Execute esta migration no SQL Editor após 0001_initial.sql.
-- O aplicativo não possui cadastro público: todo usuário criado no Supabase Auth
-- torna-se um administrador do catálogo.
insert into public.profiles (id, role)
select id, 'admin'::public.app_role
from auth.users
on conflict (id) do nothing;

create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_admin_user();
