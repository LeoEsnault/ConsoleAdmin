-- Custom types
create type public.app_role as enum ('admin');

-- USER ROLES
create table public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id   uuid references auth.users on delete cascade not null,
  role      app_role not null,
  unique (user_id, role)
);
comment on table public.user_roles is 'Application roles for each user.';
