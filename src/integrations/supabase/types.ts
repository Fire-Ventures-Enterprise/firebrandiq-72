export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agency_team_members: {
        Row: {
          agency_id: string
          created_at: string
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean
          joined_at: string | null
          permissions: string[] | null
          role: Database["public"]["Enums"]["agency_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          joined_at?: string | null
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["agency_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          joined_at?: string | null
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["agency_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_team_members_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_team_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_phone_otps: {
        Row: {
          attempts: number | null
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          max_attempts: number | null
          otp_hash: string
          phone_number: string
          used_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          max_attempts?: number | null
          otp_hash: string
          phone_number: string
          used_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          max_attempts?: number | null
          otp_hash?: string
          phone_number?: string
          used_at?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          all_day: boolean | null
          attendees: Json | null
          created_at: string
          description: string | null
          end_date: string
          google_event_id: string | null
          id: string
          location: string | null
          recurring_rule: string | null
          start_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          all_day?: boolean | null
          attendees?: Json | null
          created_at?: string
          description?: string | null
          end_date: string
          google_event_id?: string | null
          id?: string
          location?: string | null
          recurring_rule?: string | null
          start_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          all_day?: boolean | null
          attendees?: Json | null
          created_at?: string
          description?: string | null
          end_date?: string
          google_event_id?: string | null
          id?: string
          location?: string | null
          recurring_rule?: string | null
          start_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      campaign_posts: {
        Row: {
          campaign_id: string
          content: string
          created_at: string
          engagement_metrics: Json | null
          id: string
          media_urls: string[] | null
          platform: string
          platform_post_id: string | null
          posted_at: string | null
          scheduled_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          content: string
          created_at?: string
          engagement_metrics?: Json | null
          id?: string
          media_urls?: string[] | null
          platform: string
          platform_post_id?: string | null
          posted_at?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          content?: string
          created_at?: string
          engagement_metrics?: Json | null
          id?: string
          media_urls?: string[] | null
          platform?: string
          platform_post_id?: string | null
          posted_at?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_posts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          platforms: string[] | null
          start_date: string | null
          status: string
          target_audience: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          platforms?: string[] | null
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          platforms?: string[] | null
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_analytics: {
        Row: {
          ad_spend: number | null
          clicks: number | null
          client_id: string
          conversions: number | null
          created_at: string
          date: string
          engagement_rate: number | null
          id: string
          impressions: number | null
          leads: number | null
          metrics: Json | null
          revenue: number | null
          roi: number | null
          updated_at: string
        }
        Insert: {
          ad_spend?: number | null
          clicks?: number | null
          client_id: string
          conversions?: number | null
          created_at?: string
          date: string
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          leads?: number | null
          metrics?: Json | null
          revenue?: number | null
          roi?: number | null
          updated_at?: string
        }
        Update: {
          ad_spend?: number | null
          clicks?: number | null
          client_id?: string
          conversions?: number | null
          created_at?: string
          date?: string
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          leads?: number | null
          metrics?: Json | null
          revenue?: number | null
          roi?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_analytics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_analytics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_secure_view"
            referencedColumns: ["id"]
          },
        ]
      }
      client_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          client_id: string
          created_at: string
          id: string
          is_active: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          client_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          client_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_campaigns: {
        Row: {
          budget: number | null
          client_id: string
          created_at: string
          created_by: string
          end_date: string | null
          id: string
          metrics: Json | null
          name: string
          start_date: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          client_id: string
          created_at?: string
          created_by: string
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name: string
          start_date?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          client_id?: string
          created_at?: string
          created_by?: string
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          start_date?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_secure_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          agency_id: string
          company_name: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string
          email: string | null
          id: string
          industry: string | null
          monthly_budget: number | null
          name: string
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          agency_id: string
          company_name?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          monthly_budget?: number | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          agency_id?: string
          company_name?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          monthly_budget?: number | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_limited: {
        Row: {
          agency_id: string
          client_id: string
          company_name: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string
          id: string
          industry: string | null
          monthly_budget: number | null
          name: string
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          agency_id: string
          client_id: string
          company_name?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          monthly_budget?: number | null
          name: string
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          agency_id?: string
          client_id?: string
          company_name?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          monthly_budget?: number | null
          name?: string
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_limited_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_limited_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients_secure_view"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          agency_id: string
          client_ids: string[] | null
          content: string
          created_at: string
          created_by: string
          id: string
          is_bulk: boolean
          metrics: Json | null
          name: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          client_ids?: string[] | null
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_bulk?: boolean
          metrics?: Json | null
          name: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          client_ids?: string[] | null
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_bulk?: boolean
          metrics?: Json | null
          name?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      psychology_approach_analytics: {
        Row: {
          approach_name: string | null
          average_engagement_lift: number | null
          average_psychology_score: number | null
          created_at: string | null
          id: string
          industry: string | null
          last_updated: string | null
          platform: string | null
          success_rate: number | null
          total_uses: number | null
        }
        Insert: {
          approach_name?: string | null
          average_engagement_lift?: number | null
          average_psychology_score?: number | null
          created_at?: string | null
          id?: string
          industry?: string | null
          last_updated?: string | null
          platform?: string | null
          success_rate?: number | null
          total_uses?: number | null
        }
        Update: {
          approach_name?: string | null
          average_engagement_lift?: number | null
          average_psychology_score?: number | null
          created_at?: string | null
          id?: string
          industry?: string | null
          last_updated?: string | null
          platform?: string | null
          success_rate?: number | null
          total_uses?: number | null
        }
        Relationships: []
      }
      psychology_post_generations: {
        Row: {
          audience_segment: string | null
          brand_name: string | null
          conversion_potential: number | null
          created_at: string | null
          emotional_resonance: number | null
          engagement_prediction: number | null
          generated_content: string | null
          id: string
          industry: string | null
          platform: string | null
          psychology_approach: string | null
          psychology_score: number | null
          target_emotions: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          audience_segment?: string | null
          brand_name?: string | null
          conversion_potential?: number | null
          created_at?: string | null
          emotional_resonance?: number | null
          engagement_prediction?: number | null
          generated_content?: string | null
          id?: string
          industry?: string | null
          platform?: string | null
          psychology_approach?: string | null
          psychology_score?: number | null
          target_emotions?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          audience_segment?: string | null
          brand_name?: string | null
          conversion_potential?: number | null
          created_at?: string | null
          emotional_resonance?: number | null
          engagement_prediction?: number | null
          generated_content?: string | null
          id?: string
          industry?: string | null
          platform?: string | null
          psychology_approach?: string | null
          psychology_score?: number | null
          target_emotions?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      psychology_post_performance: {
        Row: {
          actual_conversions: number | null
          actual_engagement: number | null
          created_at: string | null
          feedback_rating: number | null
          generation_id: string | null
          id: string
          performance_score: number | null
          updated_at: string | null
        }
        Insert: {
          actual_conversions?: number | null
          actual_engagement?: number | null
          created_at?: string | null
          feedback_rating?: number | null
          generation_id?: string | null
          id?: string
          performance_score?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_conversions?: number | null
          actual_engagement?: number | null
          created_at?: string | null
          feedback_rating?: number | null
          generation_id?: string | null
          id?: string
          performance_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "psychology_post_performance_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "psychology_post_generations"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      social_connections: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          is_active: boolean
          platform: string
          platform_user_id: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          platform: string
          platform_user_id?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          platform?: string
          platform_user_id?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_connections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_connections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_secure_view"
            referencedColumns: ["id"]
          },
        ]
      }
      social_token_vault: {
        Row: {
          connection_id: string
          created_at: string
          encrypted_access_token: string | null
          encrypted_refresh_token: string | null
          id: string
          key_version: number
          updated_at: string
        }
        Insert: {
          connection_id: string
          created_at?: string
          encrypted_access_token?: string | null
          encrypted_refresh_token?: string | null
          id?: string
          key_version?: number
          updated_at?: string
        }
        Update: {
          connection_id?: string
          created_at?: string
          encrypted_access_token?: string | null
          encrypted_refresh_token?: string | null
          id?: string
          key_version?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_psychology_preferences: {
        Row: {
          created_at: string | null
          default_audience_segment: string | null
          preferred_approach: string | null
          preferred_emotions: string[] | null
          psychology_intensity: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          default_audience_segment?: string | null
          preferred_approach?: string | null
          preferred_emotions?: string[] | null
          psychology_intensity?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          default_audience_segment?: string | null
          preferred_approach?: string | null
          preferred_emotions?: string[] | null
          psychology_intensity?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      clients_secure_view: {
        Row: {
          agency_id: string | null
          company_name: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          email: string | null
          id: string | null
          industry: string | null
          monthly_budget: number | null
          name: string | null
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["client_status"] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          agency_id?: string | null
          company_name?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          email?: never
          id?: string | null
          industry?: string | null
          monthly_budget?: number | null
          name?: string | null
          notes?: string | null
          phone?: never
          status?: Database["public"]["Enums"]["client_status"] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          agency_id?: string | null
          company_name?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          email?: never
          id?: string | null
          industry?: string | null
          monthly_budget?: number | null
          name?: string | null
          notes?: string | null
          phone?: never
          status?: Database["public"]["Enums"]["client_status"] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_access_client_basic_info: {
        Args: { client_id_param: string }
        Returns: boolean
      }
      can_access_client_contact_info: {
        Args: { client_id_param: string }
        Returns: boolean
      }
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      is_active_agency_member: {
        Args: { agency_uuid: string }
        Returns: boolean
      }
      is_agency_owner: {
        Args: { agency_uuid: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_action: string
          p_metadata?: Json
          p_record_id?: string
          p_table_name: string
        }
        Returns: undefined
      }
      verify_phone_otp: {
        Args: { p_ip_address?: unknown; p_otp: string; p_phone_number: string }
        Returns: Json
      }
    }
    Enums: {
      agency_role: "owner" | "admin" | "manager" | "analyst" | "member"
      client_status: "active" | "inactive" | "trial" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agency_role: ["owner", "admin", "manager", "analyst", "member"],
      client_status: ["active", "inactive", "trial", "suspended"],
    },
  },
} as const
