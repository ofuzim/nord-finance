-- Fix: admin_users RLS policies were recursively querying admin_users,
-- causing infinite recursion. Replace inline subqueries with security
-- definer functions that bypass RLS when executing.

create or replace function is_admin_user()
returns boolean as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  );
$$ language sql security definer stable;

create or replace function is_super_admin()
returns boolean as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and role = 'super_admin' and is_active = true
  );
$$ language sql security definer stable;

-- admin_users
drop policy if exists "Admins can read admin users" on admin_users;
drop policy if exists "Super admins can manage admin users" on admin_users;

create policy "Admins can read admin users"
  on admin_users for select using (is_admin_user());

create policy "Super admins can manage admin users"
  on admin_users for all using (is_super_admin());

-- applications
drop policy if exists "Admins can update applications" on applications;

create policy "Admins can update applications"
  on applications for update using (is_admin_user());

-- documents
drop policy if exists "Admins can read documents" on documents;

create policy "Admins can read documents"
  on documents for select using (is_admin_user());

-- application_notes
drop policy if exists "Admins can manage notes" on application_notes;

create policy "Admins can manage notes"
  on application_notes for all using (is_admin_user());

-- application_status_history
drop policy if exists "Admins can read status history" on application_status_history;
drop policy if exists "Admins can insert status history" on application_status_history;

create policy "Admins can read status history"
  on application_status_history for select using (is_admin_user());

create policy "Admins can insert status history"
  on application_status_history for insert with check (is_admin_user());

-- credit_score_config
drop policy if exists "Admins can read config" on credit_score_config;
drop policy if exists "Super admins can update config" on credit_score_config;

create policy "Admins can read config"
  on credit_score_config for select using (is_admin_user());

create policy "Super admins can update config"
  on credit_score_config for all using (is_super_admin());
