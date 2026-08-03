-- Dynamis Relay: multi-tenant support operations schema
create extension if not exists pgcrypto with schema extensions;

create type public.member_role as enum ('owner','admin','manager','agent','viewer');
create type public.ticket_state as enum ('new','triaged','open','pending_customer','pending_internal','resolved','closed');
create type public.ticket_priority as enum ('urgent','high','normal','low');
create type public.support_channel as enum ('email','chat','whatsapp','api','web');
create type public.message_direction as enum ('inbound','outbound','internal');
create type public.job_state as enum ('pending','processing','retrying','delivered','dead_letter');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '', avatar_url text, timezone text not null default 'UTC',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.organizations (
  id uuid primary key default gen_random_uuid(), name text not null check(char_length(name) between 2 and 120),
  slug text not null unique check(slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'), created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, role public.member_role not null default 'agent',
  is_available boolean not null default true, invited_by uuid references auth.users(id), joined_at timestamptz not null default now(),
  primary key(organization_id,user_id)
);
create table public.inboxes (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, channel public.support_channel not null, address text, provider text,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(organization_id,name)
);
create table public.teams (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, description text, created_at timestamptz not null default now(), unique(organization_id,name)
);
create table public.team_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
  primary key(team_id,user_id)
);
create table public.customers (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  full_name text not null, email text, phone text, company text, external_id text, plan_name text,
  attributes jsonb not null default '{}'::jsonb, last_seen_at timestamptz, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), deleted_at timestamptz
);
create unique index customers_org_email_unique on public.customers(organization_id,lower(email)) where email is not null and deleted_at is null;
create unique index customers_org_external_unique on public.customers(organization_id,external_id) where external_id is not null;
create table public.sla_policies (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, priority public.ticket_priority not null, first_response_minutes integer not null check(first_response_minutes>0),
  resolution_minutes integer not null check(resolution_minutes>0), business_hours_only boolean not null default true,
  created_at timestamptz not null default now(), unique(organization_id,name,priority)
);
create table public.tickets (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  inbox_id uuid references public.inboxes(id) on delete set null, customer_id uuid not null references public.customers(id),
  assigned_to uuid references auth.users(id) on delete set null, team_id uuid references public.teams(id) on delete set null,
  external_id text, reference text not null, subject text not null, state public.ticket_state not null default 'new',
  priority public.ticket_priority not null default 'normal', channel public.support_channel not null, sentiment text check(sentiment in('frustrated','neutral','positive')),
  intent text, ai_confidence smallint check(ai_confidence between 0 and 100), version integer not null default 1,
  first_response_due_at timestamptz, resolution_due_at timestamptz, first_responded_at timestamptz,
  resolved_at timestamptz, closed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(organization_id,reference), unique(organization_id,inbox_id,external_id)
);
create table public.messages (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_id uuid not null references public.tickets(id) on delete cascade, customer_id uuid references public.customers(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null, external_id text, direction public.message_direction not null,
  body text not null, content_type text not null default 'text/plain', provider_status text,
  metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(),
  unique(organization_id,external_id)
);
create table public.tags (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, color text not null default '#7069ef', unique(organization_id,name)
);
create table public.ticket_tags (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_id uuid not null references public.tickets(id) on delete cascade, tag_id uuid not null references public.tags(id) on delete cascade,
  primary key(ticket_id,tag_id)
);
create table public.ticket_transitions (
  id bigint generated always as identity primary key, organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_id uuid not null references public.tickets(id) on delete cascade, actor_id uuid references auth.users(id) on delete set null,
  from_state public.ticket_state not null, to_state public.ticket_state not null, reason text, created_at timestamptz not null default now()
);
create table public.knowledge_collections (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, description text, created_at timestamptz not null default now(), unique(organization_id,name)
);
create table public.knowledge_articles (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  collection_id uuid references public.knowledge_collections(id) on delete set null, title text not null, slug text not null,
  body text not null, status text not null default 'draft' check(status in('draft','published','archived')),
  locale text not null default 'en', helpful_count integer not null default 0, unhelpful_count integer not null default 0,
  created_by uuid references auth.users(id) on delete set null, published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id,slug,locale)
);
create table public.ai_generations (
  id bigint generated always as identity primary key, organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_id uuid references public.tickets(id) on delete cascade, user_id uuid references auth.users(id) on delete set null,
  feature text not null, model text not null, source_article_ids uuid[] not null default '{}', confidence smallint check(confidence between 0 and 100),
  accepted boolean, edited_before_send boolean, input_tokens integer, output_tokens integer, latency_ms integer,
  created_at timestamptz not null default now()
);
create table public.automation_rules (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, trigger_type text not null, conditions jsonb not null default '[]'::jsonb, actions jsonb not null default '[]'::jsonb,
  is_active boolean not null default true, created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.automation_runs (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  rule_id uuid not null references public.automation_rules(id) on delete cascade, ticket_id uuid references public.tickets(id) on delete cascade,
  state text not null check(state in('running','succeeded','failed','skipped')), input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb, error text, started_at timestamptz not null default now(), completed_at timestamptz
);
create table public.inbound_events (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  provider text not null, external_id text not null, idempotency_key text not null, payload jsonb not null,
  received_at timestamptz not null default now(), processed_at timestamptz, error text,
  unique(organization_id,idempotency_key), unique(organization_id,provider,external_id)
);
create table public.outbox_events (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  aggregate_type text not null, aggregate_id uuid not null, event_type text not null, payload jsonb not null,
  state public.job_state not null default 'pending', attempt_count smallint not null default 0,
  next_attempt_at timestamptz not null default now(), locked_at timestamptz, locked_by text,
  delivered_at timestamptz, created_at timestamptz not null default now()
);
create table public.delivery_attempts (
  id bigint generated always as identity primary key, organization_id uuid not null references public.organizations(id) on delete cascade,
  event_id uuid not null references public.outbox_events(id) on delete cascade, attempt_number smallint not null,
  destination text not null, response_status smallint, latency_ms integer, error text, created_at timestamptz not null default now(),
  unique(event_id,attempt_number)
);
create table public.dead_letter_events (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  event_id uuid not null unique references public.outbox_events(id) on delete cascade, reason text not null,
  payload_snapshot jsonb not null, replayed_at timestamptz, replayed_by uuid references auth.users(id) on delete set null,
  dismissed_at timestamptz, created_at timestamptz not null default now()
);
create table public.audit_log (
  id bigint generated always as identity primary key, organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null, action text not null, entity_type text not null, entity_id uuid,
  changes jsonb not null default '{}'::jsonb, request_id text, created_at timestamptz not null default now()
);

create index organization_members_user_idx on public.organization_members(user_id,organization_id);
create index tickets_queue_idx on public.tickets(organization_id,state,priority,updated_at desc);
create index tickets_assignee_idx on public.tickets(organization_id,assigned_to,state) where assigned_to is not null;
create index tickets_sla_idx on public.tickets(organization_id,resolution_due_at) where state not in('resolved','closed');
create index messages_ticket_created_idx on public.messages(ticket_id,created_at);
create index customers_search_idx on public.customers using gin(to_tsvector('simple',coalesce(full_name,'')||' '||coalesce(email,'')||' '||coalesce(company,'')));
create index articles_search_idx on public.knowledge_articles using gin(to_tsvector('english',title||' '||body)) where status='published';
create index outbox_claim_idx on public.outbox_events(state,next_attempt_at,created_at) where state in('pending','retrying');
create index attempts_event_idx on public.delivery_attempts(event_id,attempt_number desc);
create index audit_org_created_idx on public.audit_log(organization_id,created_at desc);

create schema if not exists private;
revoke all on schema private from public,anon,authenticated;
create or replace function private.is_org_member(org_id uuid) returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.organization_members where organization_id=org_id and user_id=(select auth.uid()));
$$;
create or replace function private.has_org_role(org_id uuid,allowed public.member_role[]) returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.organization_members where organization_id=org_id and user_id=(select auth.uid()) and role=any(allowed));
$$;
create or replace function private.touch_updated_at() returns trigger language plpgsql set search_path='' as $$begin new.updated_at=now();return new;end;$$;
create or replace function private.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin insert into public.profiles(id,full_name,avatar_url) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),new.raw_user_meta_data->>'avatar_url');return new;end;$$;
create or replace function private.claim_outbox(worker_name text,batch_size integer default 25)
returns setof public.outbox_events language plpgsql security definer set search_path='' as $$
begin return query update public.outbox_events set state='processing',locked_at=now(),locked_by=worker_name
where id in(select id from public.outbox_events where state in('pending','retrying') and next_attempt_at<=now() order by created_at for update skip locked limit least(batch_size,100)) returning *;end;$$;
revoke execute on function private.claim_outbox(text,integer) from public,anon,authenticated;
grant execute on function private.claim_outbox(text,integer) to service_role;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure private.handle_new_user();
do $$ declare table_name text; begin foreach table_name in array array['profiles','organizations','inboxes','customers','tickets','knowledge_articles','automation_rules'] loop execute format('create trigger %I_touch before update on public.%I for each row execute procedure private.touch_updated_at()',table_name,table_name); end loop; end $$;

do $$ declare table_name text; begin foreach table_name in array array[
  'profiles','organizations','organization_members','inboxes','teams','team_members','customers','sla_policies','tickets','messages','tags','ticket_tags','ticket_transitions','knowledge_collections','knowledge_articles','ai_generations','automation_rules','automation_runs','inbound_events','outbox_events','delivery_attempts','dead_letter_events','audit_log'
] loop execute format('alter table public.%I enable row level security',table_name); end loop; end $$;

create policy "signed users view profiles" on public.profiles for select to authenticated using(true);
create policy "users update own profile" on public.profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy "members view organizations" on public.organizations for select to authenticated using(private.is_org_member(id));
create policy "users create organizations" on public.organizations for insert to authenticated with check(created_by=(select auth.uid()));
create policy "admins update organizations" on public.organizations for update to authenticated using(private.has_org_role(id,array['owner','admin']::public.member_role[])) with check(private.has_org_role(id,array['owner','admin']::public.member_role[]));
create policy "members view memberships" on public.organization_members for select to authenticated using(private.is_org_member(organization_id));
create policy "creator claims ownership" on public.organization_members for insert to authenticated with check(user_id=(select auth.uid()) and role='owner' and exists(select 1 from public.organizations where id=organization_id and created_by=(select auth.uid())));
create policy "admins manage memberships" on public.organization_members for all to authenticated using(private.has_org_role(organization_id,array['owner','admin']::public.member_role[])) with check(private.has_org_role(organization_id,array['owner','admin']::public.member_role[]));

do $$ declare table_name text; begin foreach table_name in array array[
  'inboxes','teams','team_members','customers','sla_policies','tickets','messages','tags','ticket_tags','ticket_transitions','knowledge_collections','knowledge_articles','ai_generations','automation_rules','automation_runs','inbound_events','outbox_events','delivery_attempts','dead_letter_events'
] loop
 execute format('create policy "members read %1$s" on public.%1$I for select to authenticated using(private.is_org_member(organization_id))',table_name);
 execute format('create policy "agents create %1$s" on public.%1$I for insert to authenticated with check(private.has_org_role(organization_id,array[''owner'',''admin'',''manager'',''agent'']::public.member_role[]))',table_name);
 execute format('create policy "agents update %1$s" on public.%1$I for update to authenticated using(private.has_org_role(organization_id,array[''owner'',''admin'',''manager'',''agent'']::public.member_role[])) with check(private.has_org_role(organization_id,array[''owner'',''admin'',''manager'',''agent'']::public.member_role[]))',table_name);
 execute format('create policy "managers delete %1$s" on public.%1$I for delete to authenticated using(private.has_org_role(organization_id,array[''owner'',''admin'',''manager'']::public.member_role[]))',table_name);
 end loop; end $$;
create policy "members read audit" on public.audit_log for select to authenticated using(private.is_org_member(organization_id));

revoke all on all tables in schema public from anon;
grant usage on schema public to authenticated;
grant select,insert,update,delete on all tables in schema public to authenticated;
grant usage,select on all sequences in schema public to authenticated;

-- Simple Postgres Changes is enabled for the demo foundation. At scale, use private Realtime Broadcast channels.
alter publication supabase_realtime add table public.tickets;
alter publication supabase_realtime add table public.messages;
alter table public.tickets replica identity full;
alter table public.messages replica identity full;
