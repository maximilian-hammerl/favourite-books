export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      author: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      author_created_book: {
        Row: {
          author_id: string
          book_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          author_id: string
          book_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          book_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'author_created_book_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'author'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'author_created_book_book_id_fkey'
            columns: ['book_id']
            isOneToOne: false
            referencedRelation: 'book'
            referencedColumns: ['id']
          },
        ]
      }
      book: {
        Row: {
          blurb: string
          created_at: string
          id: string
          number_pages: number | null
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          blurb: string
          created_at?: string
          id?: string
          number_pages?: number | null
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          blurb?: string
          created_at?: string
          id?: string
          number_pages?: number | null
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      book_genre: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      book_has_book_genre: {
        Row: {
          book_genre_id: string
          book_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          book_genre_id: string
          book_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          book_genre_id?: string
          book_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'book_has_book_genre_book_genre_id_fkey'
            columns: ['book_genre_id']
            isOneToOne: false
            referencedRelation: 'book_genre'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'book_has_book_genre_book_id_fkey'
            columns: ['book_id']
            isOneToOne: false
            referencedRelation: 'book'
            referencedColumns: ['id']
          },
        ]
      }
      book_has_book_trope: {
        Row: {
          book_id: string
          book_trope_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          book_id: string
          book_trope_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          book_trope_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'book_has_book_trope_book_id_fkey'
            columns: ['book_id']
            isOneToOne: false
            referencedRelation: 'book'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'book_has_book_trope_book_trope_id_fkey'
            columns: ['book_trope_id']
            isOneToOne: false
            referencedRelation: 'book_trope'
            referencedColumns: ['id']
          },
        ]
      }
      book_is_part_of_book_series: {
        Row: {
          book_id: string
          book_series_id: string
          created_at: string
          number_in_series: number
          updated_at: string
        }
        Insert: {
          book_id: string
          book_series_id: string
          created_at?: string
          number_in_series: number
          updated_at?: string
        }
        Update: {
          book_id?: string
          book_series_id?: string
          created_at?: string
          number_in_series?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'book_is_part_of_book_series_book_id_fkey'
            columns: ['book_id']
            isOneToOne: false
            referencedRelation: 'book'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'book_is_part_of_book_series_book_series_id_fkey'
            columns: ['book_series_id']
            isOneToOne: false
            referencedRelation: 'book_series'
            referencedColumns: ['id']
          },
        ]
      }
      book_series: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      book_trope: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
