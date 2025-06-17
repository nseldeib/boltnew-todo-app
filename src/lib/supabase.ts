import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          timezone: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          emoji: string | null
          color: string | null
          completed: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          emoji?: string | null
          color?: string | null
          completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          emoji?: string | null
          color?: string | null
          completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      todos: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          completed: boolean | null
          priority: string | null
          due_date: string | null
          event_id: string | null
          created_at: string | null
          updated_at: string | null
          starred: boolean | null
          emoji: string | null
          project_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          completed?: boolean | null
          priority?: string | null
          due_date?: string | null
          event_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          starred?: boolean | null
          emoji?: string | null
          project_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          completed?: boolean | null
          priority?: string | null
          due_date?: string | null
          event_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          starred?: boolean | null
          emoji?: string | null
          project_id?: string | null
        }
      }
    }
  }
}