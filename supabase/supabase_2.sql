create table public.enterprises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp default now(),
);

-- si suppression entreprise cascade sur profiles : on delete cascade
alter table public.profiles 
add column enterprise_id uuid references public.enterprises(id) on delete set null;

