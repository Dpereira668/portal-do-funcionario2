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
      absences: {
        Row: {
          absence_date: string
          coverage_bank_info: Json | null
          coverage_cpf: string
          coverage_name: string
          coverage_type: string
          coverage_value: number | null
          created_at: string
          employee_cpf: string
          employee_name: string
          id: string
          justification: string | null
          justification_file_url: string | null
          position_title: string
          status: string | null
          updated_at: string
          workplace: string
        }
        Insert: {
          absence_date: string
          coverage_bank_info?: Json | null
          coverage_cpf: string
          coverage_name: string
          coverage_type: string
          coverage_value?: number | null
          created_at?: string
          employee_cpf: string
          employee_name: string
          id?: string
          justification?: string | null
          justification_file_url?: string | null
          position_title: string
          status?: string | null
          updated_at?: string
          workplace: string
        }
        Update: {
          absence_date?: string
          coverage_bank_info?: Json | null
          coverage_cpf?: string
          coverage_name?: string
          coverage_type?: string
          coverage_value?: number | null
          created_at?: string
          employee_cpf?: string
          employee_name?: string
          id?: string
          justification?: string | null
          justification_file_url?: string | null
          position_title?: string
          status?: string | null
          updated_at?: string
          workplace?: string
        }
        Relationships: []
      }
      admin_invites: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          expires_at: string
          id: string
          token: string | null
          used_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          expires_at?: string
          id?: string
          token?: string | null
          used_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          expires_at?: string
          id?: string
          token?: string | null
          used_at?: string | null
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          created_at: string
          email: string | null
          function: string | null
          id: string
          name: string | null
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          function?: string | null
          id: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          function?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          document_type: string
          employee_id: string | null
          file_url: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          document_type: string
          employee_id?: string | null
          file_url: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          document_type?: string
          employee_id?: string | null
          file_url?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_charges: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          due_date: string
          id: string
          notes: string | null
          status: string
          updated_at: string
          workplace_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          due_date: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          workplace_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          due_date?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          workplace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_charges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_charges_workplace_id_fkey"
            columns: ["workplace_id"]
            isOneToOne: false
            referencedRelation: "workplaces"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          admission_date: string | null
          avatar_url: string | null
          birth_date: string | null
          cpf: string | null
          created_at: string
          department: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          position_id: string | null
          role: string | null
          status: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"] | null
          workplace_id: string | null
        }
        Insert: {
          address?: string | null
          admission_date?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          position_id?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          workplace_id?: string | null
        }
        Update: {
          address?: string | null
          admission_date?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          position_id?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          workplace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_workplace_id_fkey"
            columns: ["workplace_id"]
            isOneToOne: false
            referencedRelation: "workplaces"
            referencedColumns: ["id"]
          },
        ]
      }
      punishments: {
        Row: {
          created_at: string | null
          document_url: string | null
          employee_id: string | null
          end_date: string | null
          id: string
          reason: string
          start_date: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_url?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          reason: string
          start_date: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_url?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          reason?: string
          start_date?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      registration_requests: {
        Row: {
          cpf: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          position_title: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          cpf: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          position_title?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          cpf?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          position_title?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          advance_amount: number | null
          advance_reason: string | null
          created_at: string
          delivery_confirmation_url: string | null
          delivery_date: string | null
          delivery_status: string | null
          end_date: string | null
          id: string
          notes: string | null
          start_date: string
          status: string | null
          type: string
          uniform_quantity: number | null
          uniform_size: string | null
          uniform_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          advance_amount?: number | null
          advance_reason?: string | null
          created_at?: string
          delivery_confirmation_url?: string | null
          delivery_date?: string | null
          delivery_status?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date: string
          status?: string | null
          type: string
          uniform_quantity?: number | null
          uniform_size?: string | null
          uniform_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          advance_amount?: number | null
          advance_reason?: string | null
          created_at?: string
          delivery_confirmation_url?: string | null
          delivery_date?: string | null
          delivery_status?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string
          status?: string | null
          type?: string
          uniform_quantity?: number | null
          uniform_size?: string | null
          uniform_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      uniform_movements: {
        Row: {
          created_at: string
          employee_id: string | null
          id: string
          movement_type: string
          notes: string | null
          quantity: number
          uniform_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          id?: string
          movement_type: string
          notes?: string | null
          quantity: number
          uniform_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          id?: string
          movement_type?: string
          notes?: string | null
          quantity?: number
          uniform_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uniform_movements_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uniform_movements_uniform_id_fkey"
            columns: ["uniform_id"]
            isOneToOne: false
            referencedRelation: "uniforms"
            referencedColumns: ["id"]
          },
        ]
      }
      uniforms: {
        Row: {
          created_at: string
          id: string
          min_quantity: number
          quantity: number
          size: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          min_quantity?: number
          quantity?: number
          size: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          min_quantity?: number
          quantity?: number
          size?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      vacation_schedules: {
        Row: {
          created_at: string
          employee_cpf: string
          employee_name: string
          end_date: string
          id: string
          observation: string | null
          position_title: string
          start_date: string
          updated_at: string
          workplace: string
        }
        Insert: {
          created_at?: string
          employee_cpf: string
          employee_name: string
          end_date: string
          id?: string
          observation?: string | null
          position_title: string
          start_date: string
          updated_at?: string
          workplace: string
        }
        Update: {
          created_at?: string
          employee_cpf?: string
          employee_name?: string
          end_date?: string
          id?: string
          observation?: string | null
          position_title?: string
          start_date?: string
          updated_at?: string
          workplace?: string
        }
        Relationships: []
      }
      workplaces: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_admin_role: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "funcionario"
      user_type: "admin" | "funcionario"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
