-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type application_status as enum ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'withdrawn');
create type admin_role as enum ('super_admin', 'admin', 'reviewer');
create type document_type as enum ('government_id', 'passport_photo', 'bank_statement', 'payslip', 'proof_of_residence');
create type credit_tier as enum ('private_bridge', 'premium', 'core', 'access');

-- Applications (core table — guest flow, no auth required)
create table applications (
  id uuid primary key default uuid_generate_v4(),
  reference_number text unique not null,
  status application_status not null default 'draft',

  -- Step 1: Personal Information
  title text,
  first_name text not null,
  last_name text not null,
  other_names text,
  gender text,
  date_of_birth date,
  marital_status text,
  number_of_children integer default 0,
  state_of_origin text,
  lga_of_origin text,
  phone_number text not null,
  email text not null,
  home_address text,
  landmark text,
  state_of_residence text,
  lga_of_residence text,
  residential_status text,
  occupation text,
  employer_name text,
  office_address text,
  employment_type text,

  -- Step 2: Identity
  id_type text,
  id_number text,
  id_expiry_date date,
  nin text,
  bvn text,

  -- Step 3: Vehicle Interest
  vehicle_category text,
  vehicle_model text,

  -- Progress and timestamps
  current_step integer not null default 1,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Credit scores (linked to application, but can also exist standalone before form submission)
create table credit_scores (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references applications(id) on delete set null,
  score integer not null,
  tier credit_tier not null,
  monthly_income numeric(15,2) not null default 0,
  monthly_obligations numeric(15,2) not null default 0,
  down_payment_percentage numeric(5,2) not null default 30,
  form_responses jsonb not null default '{}',
  signals jsonb not null default '{"red": [], "yellow": [], "green": []}',
  score_breakdown jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Uploaded documents (Supabase Storage paths)
create table documents (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid not null references applications(id) on delete cascade,
  document_type document_type not null,
  storage_path text not null,
  file_name text not null,
  file_size integer,
  mime_type text,
  uploaded_at timestamptz not null default now()
);

-- Admin users (linked to Supabase auth.users)
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role admin_role not null default 'reviewer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Internal admin notes on applications
create table application_notes (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid not null references applications(id) on delete cascade,
  admin_id uuid not null references admin_users(id),
  note text not null,
  created_at timestamptz not null default now()
);

-- Audit trail for status changes
create table application_status_history (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid not null references applications(id) on delete cascade,
  from_status application_status,
  to_status application_status not null,
  changed_by uuid references admin_users(id),
  note text,
  changed_at timestamptz not null default now()
);

-- Configurable credit scoring parameters (editable by super_admin)
create table credit_score_config (
  id uuid primary key default uuid_generate_v4(),
  config_key text not null unique,
  config_value jsonb not null,
  description text,
  updated_by uuid references admin_users(id),
  updated_at timestamptz not null default now()
);

-- Indexes
create index idx_applications_reference_number on applications(reference_number);
create index idx_applications_status on applications(status);
create index idx_applications_email on applications(email);
create index idx_applications_created_at on applications(created_at desc);
create index idx_credit_scores_application_id on credit_scores(application_id);
create index idx_documents_application_id on documents(application_id);
create index idx_application_notes_application_id on application_notes(application_id);
create index idx_application_status_history_application_id on application_status_history(application_id);

-- updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger applications_updated_at
  before update on applications
  for each row execute procedure update_updated_at_column();

create trigger admin_users_updated_at
  before update on admin_users
  for each row execute procedure update_updated_at_column();

-- =====================
-- Row Level Security
-- =====================

-- Applications
alter table applications enable row level security;

create policy "Public can insert application"
  on applications for insert with check (true);

create policy "Public can read application by reference"
  on applications for select using (true);

create policy "Admins can update applications"
  on applications for update
  using (auth.uid() in (select id from admin_users where is_active = true));

-- Credit scores
alter table credit_scores enable row level security;

create policy "Public can insert credit score"
  on credit_scores for insert with check (true);

create policy "Public can read credit scores"
  on credit_scores for select using (true);

-- Documents
alter table documents enable row level security;

create policy "Public can insert documents"
  on documents for insert with check (true);

create policy "Admins can read documents"
  on documents for select
  using (auth.uid() in (select id from admin_users where is_active = true));

-- Admin users
alter table admin_users enable row level security;

create policy "Admins can read admin users"
  on admin_users for select
  using (auth.uid() in (select id from admin_users where is_active = true));

create policy "Super admins can manage admin users"
  on admin_users for all
  using (auth.uid() in (select id from admin_users where role = 'super_admin' and is_active = true));

-- Application notes
alter table application_notes enable row level security;

create policy "Admins can manage notes"
  on application_notes for all
  using (auth.uid() in (select id from admin_users where is_active = true));

-- Status history
alter table application_status_history enable row level security;

create policy "Admins can read status history"
  on application_status_history for select
  using (auth.uid() in (select id from admin_users where is_active = true));

create policy "Admins can insert status history"
  on application_status_history for insert
  with check (auth.uid() in (select id from admin_users where is_active = true));

-- Credit score config
alter table credit_score_config enable row level security;

create policy "Admins can read config"
  on credit_score_config for select
  using (auth.uid() in (select id from admin_users where is_active = true));

create policy "Super admins can update config"
  on credit_score_config for all
  using (auth.uid() in (select id from admin_users where role = 'super_admin' and is_active = true));

-- =====================
-- Seed: Default credit scoring config
-- =====================

insert into credit_score_config (config_key, config_value, description) values
(
  'section_weights',
  '{
    "income_stability": 0.25,
    "cashflow_consistency": 0.20,
    "debt_to_income": 0.20,
    "banking_behaviour": 0.15,
    "digital_footprint": 0.10,
    "down_payment_strength": 0.10
  }',
  'Percentage weight each section contributes to the total score'
),
(
  'score_tiers',
  '[
    {"name": "private_bridge", "label": "Private Bridge", "min_score": 850, "interest_rate": 9, "max_tenor_months": 6, "min_down_payment": 50},
    {"name": "premium", "label": "Premium Tier", "min_score": 800, "interest_rate": 18, "max_tenor_months": 12, "min_down_payment": 40},
    {"name": "core", "label": "Core Tier", "min_score": 700, "interest_rate": 22, "max_tenor_months": 24, "min_down_payment": 30},
    {"name": "access", "label": "Access Tier", "min_score": 0, "interest_rate": 28, "max_tenor_months": 48, "min_down_payment": 30}
  ]',
  'Credit tiers with their interest rates, maximum tenors, and minimum down payments'
),
(
  'score_formula',
  '{
    "base_score": 520,
    "multiplier": 3.2,
    "income_boost_max": 46,
    "income_boost_divisor": 100000000,
    "down_payment_boost_max": 54,
    "down_payment_boost_divisor": 70,
    "obligation_penalty_max": 34,
    "obligation_penalty_divisor": 5000000,
    "min_score": 520,
    "max_score": 910
  }',
  'Numerical parameters used in the credit score formula'
);
