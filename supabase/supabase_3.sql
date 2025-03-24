create table public.establishments (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  enterprise_id UUID references public.enterprises(id)  on delete cascade
);

-- table de liaison
CREATE TABLE public.profiles_establishments (
  profile_id uuid references public.profiles(id) on delete cascade,
  establishment_id uuid references public.establishments(id) on delete cascade,
  PRIMARY KEY (profile_id, establishment_id)
);