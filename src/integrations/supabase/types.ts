export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          last_updated: string | null
          name: string
          type: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          last_updated?: string | null
          name: string
          type: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          last_updated?: string | null
          name?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          date: string
          description: string
          id: string
          image_path: string | null
          is_featured: boolean | null
          location: string
          time: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          date: string
          description: string
          id?: string
          image_path?: string | null
          is_featured?: boolean | null
          location: string
          time: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string
          id?: string
          image_path?: string | null
          is_featured?: boolean | null
          location?: string
          time?: string
          title?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          read_status: boolean | null
          replied_at: string | null
          replied_status: boolean | null
          subject: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          read_status?: boolean | null
          replied_at?: string | null
          replied_status?: boolean | null
          subject: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          read_status?: boolean | null
          replied_at?: string | null
          replied_status?: boolean | null
          subject?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          active: boolean | null
          category: string | null
          content: string | null
          created_at: string
          featured_image: string | null
          id: string
          last_updated_by: string | null
          section: string
          section_type: string | null
          slug: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          content?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          last_updated_by?: string | null
          section: string
          section_type?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          content?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          last_updated_by?: string | null
          section?: string
          section_type?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_images: {
        Row: {
          active: boolean | null
          alt_text: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          location: string
          path: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          location: string
          path: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          location?: string
          path?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
