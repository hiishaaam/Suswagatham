export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          phone: string
          user_id: string | null
          plan_type: 'b2b_monthly' | 'b2c_basic' | 'b2c_premium' | 'enterprise'
          subscription_status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          user_id?: string | null
          plan_type?: 'b2b_monthly' | 'b2c_basic' | 'b2c_premium' | 'enterprise'
          subscription_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          user_id?: string | null
          plan_type?: 'b2b_monthly' | 'b2c_basic' | 'b2c_premium' | 'enterprise'
          subscription_status?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          client_id: string | null
          user_id: string | null
          couple_names: string
          event_slug: string
          event_date: string
          venue_name: string
          venue_lat: number | null
          venue_lng: number | null
          venue_address: string | null
          venue_parking_notes: string | null
          host_whatsapp: string | null
          show_host_contact: boolean
          status: 'draft' | 'design_pending' | 'preview_sent' | 'live' | 'completed'
          template_id: string
          language: 'english' | 'malayalam' | 'bilingual'
          couple_photo_url: string | null
          invitation_text_en: string | null
          invitation_text_ml: string | null
          max_guests_default: number
          rsvp_cutoff_at: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          amount_paid: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          user_id?: string | null
          couple_names: string
          event_slug: string
          event_date: string
          venue_name: string
          venue_lat?: number | null
          venue_lng?: number | null
          venue_address?: string | null
          venue_parking_notes?: string | null
          host_whatsapp?: string | null
          show_host_contact?: boolean
          status?: 'draft' | 'design_pending' | 'preview_sent' | 'live' | 'completed'
          template_id?: string
          language?: 'english' | 'malayalam' | 'bilingual'
          couple_photo_url?: string | null
          invitation_text_en?: string | null
          invitation_text_ml?: string | null
          max_guests_default?: number
          rsvp_cutoff_at?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          amount_paid?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          user_id?: string | null
          couple_names?: string
          event_slug?: string
          event_date?: string
          venue_name?: string
          venue_lat?: number | null
          venue_lng?: number | null
          venue_address?: string | null
          venue_parking_notes?: string | null
          host_whatsapp?: string | null
          show_host_contact?: boolean
          status?: 'draft' | 'design_pending' | 'preview_sent' | 'live' | 'completed'
          template_id?: string
          language?: 'english' | 'malayalam' | 'bilingual'
          couple_photo_url?: string | null
          invitation_text_en?: string | null
          invitation_text_ml?: string | null
          max_guests_default?: number
          rsvp_cutoff_at?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          amount_paid?: number
          created_at?: string
          updated_at?: string
        }
      }
      sub_events: {
        Row: {
          id: string
          event_id: string
          name: string
          event_date_time: string | null
          headcount_target: number | null
          display_order: number
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          event_date_time?: string | null
          headcount_target?: number | null
          display_order?: number
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          event_date_time?: string | null
          headcount_target?: number | null
          display_order?: number
        }
      }
      guest_tokens: {
        Row: {
          id: string
          event_id: string
          family_name: string
          phone: string | null
          unique_token: string
          max_guests: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          family_name: string
          phone?: string | null
          unique_token?: string
          max_guests?: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          family_name?: string
          phone?: string | null
          unique_token?: string
          max_guests?: number
          created_at?: string
        }
      }
      rsvps: {
        Row: {
          id: string
          token_id: string
          event_id: string
          attending: boolean
          guest_count: number
          food_preference: 'veg' | 'non_veg' | 'both' | null
          sub_event_id: string | null
          is_manual: boolean
          manual_added_by: string | null
          submitted_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          token_id: string
          event_id: string
          attending: boolean
          guest_count?: number
          food_preference?: 'veg' | 'non_veg' | 'both' | null
          sub_event_id?: string | null
          is_manual?: boolean
          manual_added_by?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          token_id?: string
          event_id?: string
          attending?: boolean
          guest_count?: number
          food_preference?: 'veg' | 'non_veg' | 'both' | null
          sub_event_id?: string | null
          is_manual?: boolean
          manual_added_by?: string | null
          submitted_at?: string
          updated_at?: string
        }
      }
      link_clicks: {
        Row: {
          id: string
          event_id: string
          token_id: string | null
          clicked_at: string
          device_type: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          event_id: string
          token_id?: string | null
          clicked_at?: string
          device_type?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          token_id?: string | null
          clicked_at?: string
          device_type?: string | null
          user_agent?: string | null
        }
      }
      caterer_access: {
        Row: {
          id: string
          event_id: string
          caterer_name: string
          caterer_phone: string | null
          access_token: string
          access_level: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          caterer_name: string
          caterer_phone?: string | null
          access_token?: string
          access_level?: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          caterer_name?: string
          caterer_phone?: string | null
          access_token?: string
          access_level?: string
          created_at?: string
        }
      }
    }
    Views: {
      event_summary: {
        Row: {
          event_id: string
          total_clicks: number
          total_responded: number
          attending_count: number
          not_attending_count: number
          total_headcount: number
          veg_count: number
          non_veg_count: number
        }
      }
    }
  }
}
