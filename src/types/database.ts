export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn'
export type AdminRole = 'super_admin' | 'admin' | 'reviewer'
export type DocumentType = 'government_id' | 'passport_photo' | 'bank_statement' | 'payslip' | 'proof_of_residence'
export type CreditTier = 'private_bridge' | 'premium' | 'core' | 'access'

export interface Application {
  id: string
  reference_number: string
  status: ApplicationStatus

  // Personal Information
  title: string | null
  first_name: string
  last_name: string
  other_names: string | null
  gender: string | null
  date_of_birth: string | null
  marital_status: string | null
  number_of_children: number
  state_of_origin: string | null
  lga_of_origin: string | null
  phone_number: string
  email: string
  home_address: string | null
  landmark: string | null
  state_of_residence: string | null
  lga_of_residence: string | null
  residential_status: string | null
  occupation: string | null
  employer_name: string | null
  office_address: string | null
  employment_type: string | null

  // Identity
  id_type: string | null
  id_number: string | null
  id_expiry_date: string | null
  nin: string | null
  bvn: string | null

  // Vehicle
  vehicle_category: string | null
  vehicle_model: string | null

  current_step: number
  submitted_at: string | null
  created_at: string
  updated_at: string
}

export interface CreditScore {
  id: string
  application_id: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  score: number
  tier: CreditTier
  monthly_income: number
  monthly_obligations: number
  down_payment_percentage: number
  form_responses: Record<string, unknown>
  signals: {
    red: string[]
    yellow: string[]
    green: string[]
  }
  score_breakdown: Record<string, unknown>
  created_at: string
}

export interface Document {
  id: string
  application_id: string
  document_type: DocumentType
  storage_path: string
  file_name: string
  file_size: number | null
  mime_type: string | null
  uploaded_at: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string
  role: AdminRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ApplicationNote {
  id: string
  application_id: string
  admin_id: string
  note: string
  created_at: string
  admin_users?: Pick<AdminUser, 'full_name' | 'email'>
}

export interface ApplicationStatusHistory {
  id: string
  application_id: string
  from_status: ApplicationStatus | null
  to_status: ApplicationStatus
  changed_by: string | null
  note: string | null
  changed_at: string
  admin_users?: Pick<AdminUser, 'full_name'>
}

export interface CreditScoreConfig {
  id: string
  config_key: string
  config_value: unknown
  description: string | null
  updated_by: string | null
  updated_at: string
}

// Full application detail view (with relations)
export interface ApplicationDetail extends Application {
  credit_scores: CreditScore[]
  documents: Document[]
  application_notes: ApplicationNote[]
  application_status_history: ApplicationStatusHistory[]
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      applications: {
        Row: Application
        Insert: Omit<Application, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Application, 'id' | 'created_at'>>
      }
      credit_scores: {
        Row: CreditScore
        Insert: Omit<CreditScore, 'id' | 'created_at'>
        Update: Partial<Omit<CreditScore, 'id' | 'created_at'>>
      }
      documents: {
        Row: Document
        Insert: Omit<Document, 'id' | 'uploaded_at'>
        Update: Partial<Omit<Document, 'id' | 'uploaded_at'>>
      }
      admin_users: {
        Row: AdminUser
        Insert: Omit<AdminUser, 'created_at' | 'updated_at'>
        Update: Partial<Omit<AdminUser, 'id' | 'created_at'>>
      }
      application_notes: {
        Row: ApplicationNote
        Insert: Omit<ApplicationNote, 'id' | 'created_at'>
        Update: never
      }
      application_status_history: {
        Row: ApplicationStatusHistory
        Insert: Omit<ApplicationStatusHistory, 'id' | 'changed_at'>
        Update: never
      }
      credit_score_config: {
        Row: CreditScoreConfig
        Insert: Omit<CreditScoreConfig, 'id'>
        Update: Partial<Omit<CreditScoreConfig, 'id'>>
      }
    }
  }
}
