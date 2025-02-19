create table public.profiles (
  id uuid default gen_random_uuid() primary key,
  auth_id uuid not null references auth.users(id) on delete cascade,
  firstname text,
  lastname text
);
