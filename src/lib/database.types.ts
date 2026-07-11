// Auto-generated types for LMS Apoteker Rahmato Supabase schema.
// Regenerate with: npx supabase gen types typescript --local > src/lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'student' | 'mentor';
          avatar_url: string | null;
          profession: 'Apoteker' | 'Dokter' | 'Mahasiswa' | 'Perawat' | 'Bidan' | 'Lainnya' | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email?: string;
          role?: 'student' | 'mentor';
          avatar_url?: string | null;
          profession?: 'Apoteker' | 'Dokter' | 'Mahasiswa' | 'Perawat' | 'Bidan' | 'Lainnya' | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'student' | 'mentor';
          avatar_url?: string | null;
          profession?: 'Apoteker' | 'Dokter' | 'Mahasiswa' | 'Perawat' | 'Bidan' | 'Lainnya' | null;
          created_at?: string;
        };
        Relationships: [];
      };
      generations: {
        Row: {
          id: string;
          name: string;
          status: 'active' | 'completed' | 'upcoming';
          year: string;
        };
        Insert: {
          id: string;
          name: string;
          status?: 'active' | 'completed' | 'upcoming';
          year: string;
        };
        Update: {
          id?: string;
          name?: string;
          status?: 'active' | 'completed' | 'upcoming';
          year?: string;
        };
        Relationships: [];
      };
      classes: {
        Row: {
          id: string;
          generation_id: string;
          generation_name: string;
          name: string;
          category: 'REGULER' | 'ADVANCE';
          price: number;
          description: string;
          materials_count: number;
          students_count: number;
          playlist_url: string | null;
        };
        Insert: {
          id: string;
          generation_id: string;
          generation_name: string;
          name: string;
          category: 'REGULER' | 'ADVANCE';
          price?: number;
          description?: string;
          materials_count?: number;
          students_count?: number;
          playlist_url?: string | null;
        };
        Update: {
          id?: string;
          generation_id?: string;
          generation_name?: string;
          name?: string;
          category?: 'REGULER' | 'ADVANCE';
          price?: number;
          description?: string;
          materials_count?: number;
          students_count?: number;
          playlist_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'classes_generation_id_fkey';
            columns: ['generation_id'];
            isOneToOne: false;
            referencedRelation: 'generations';
            referencedColumns: ['id'];
          }
        ];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          class_id: string;
          enrolled_at: string;
          completed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          class_id: string;
          enrolled_at?: string;
          completed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          class_id?: string;
          enrolled_at?: string;
          completed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollments_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          }
        ];
      };
      materials: {
        Row: {
          id: string;
          class_id: string;
          title: string;
          type: 'video' | 'pdf' | 'quiz';
          description: string;
          duration_or_pages: string;
          content: string;
          video_url: string | null;
          youtube_id: string | null;
          order_index: number;
        };
        Insert: {
          id: string;
          class_id: string;
          title: string;
          type: 'video' | 'pdf' | 'quiz';
          description?: string;
          duration_or_pages?: string;
          content?: string;
          video_url?: string | null;
          youtube_id?: string | null;
          order_index?: number;
        };
        Update: {
          id?: string;
          class_id?: string;
          title?: string;
          type?: 'video' | 'pdf' | 'quiz';
          description?: string;
          duration_or_pages?: string;
          content?: string;
          video_url?: string | null;
          youtube_id?: string | null;
          order_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'materials_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          }
        ];
      };
      quizzes: {
        Row: {
          id: string;
          class_id: string;
          title: string;
          passing_score: number;
        };
        Insert: {
          id: string;
          class_id: string;
          title: string;
          passing_score?: number;
        };
        Update: {
          id?: string;
          class_id?: string;
          title?: string;
          passing_score?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'quizzes_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          }
        ];
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question: string;
          options: Json;
          correct_option: number;
          explanation: string;
          order_index: number;
        };
        Insert: {
          id: string;
          quiz_id: string;
          question: string;
          options: Json;
          correct_option: number;
          explanation?: string;
          order_index?: number;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          question?: string;
          options?: Json;
          correct_option?: number;
          explanation?: string;
          order_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_questions_quiz_id_fkey';
            columns: ['quiz_id'];
            isOneToOne: false;
            referencedRelation: 'quizzes';
            referencedColumns: ['id'];
          }
        ];
      };
      quiz_attempts: {
        Row: {
          id: string;
          student_id: string;
          quiz_id: string;
          class_id: string;
          score: number;
          passed: boolean;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          quiz_id: string;
          class_id: string;
          score: number;
          passed: boolean;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          quiz_id?: string;
          class_id?: string;
          score?: number;
          passed?: boolean;
          submitted_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_attempts_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quiz_attempts_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          }
        ];
      };
      forum_posts: {
        Row: {
          id: string;
          class_id: string;
          user_id: string;
          title: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          user_id: string;
          title: string;
          content?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'forum_posts_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'forum_posts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      forum_replies: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'forum_replies_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'forum_posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'forum_replies_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          class_id: string;
          amount: number;
          status: 'pending' | 'success' | 'failed';
          payment_method: string;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          class_id: string;
          amount?: number;
          status?: 'pending' | 'success' | 'failed';
          payment_method?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          class_id?: string;
          amount?: number;
          status?: 'pending' | 'success' | 'failed';
          payment_method?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_mentor: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      increment_students_count: {
        Args: { class_id_input: string };
        Returns: undefined;
      };
      decrement_students_count: {
        Args: { class_id_input: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
