create table public.services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  enterprise_id UUID references public.enterprises(id)  on delete cascade
);

-- table de liaison
CREATE TABLE public.profiles_services (
  profile_id uuid references public.profiles(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  PRIMARY KEY (profile_id, service_id)
);