-- Create a user first, then replace the UUID below with that auth.users id.
do $$ declare demo_user uuid:='00000000-0000-0000-0000-000000000001'; org_id uuid:=gen_random_uuid(); begin
  if not exists(select 1 from auth.users where id=demo_user) then raise notice 'Seed skipped: create the demo user and update demo_user.';return;end if;
  insert into public.organizations(id,name,slug,created_by) values(org_id,'Northstar','northstar',demo_user);
  insert into public.organization_members(organization_id,user_id,role) values(org_id,demo_user,'owner');
  insert into public.inboxes(organization_id,name,channel,address) values(org_id,'Support email','email','support@example.com'),(org_id,'Live chat','chat',null);
  insert into public.sla_policies(organization_id,name,priority,first_response_minutes,resolution_minutes) values
    (org_id,'Urgent','urgent',15,120),(org_id,'High','high',60,480),(org_id,'Standard','normal',240,1440),(org_id,'Low','low',480,2880);
end $$;
