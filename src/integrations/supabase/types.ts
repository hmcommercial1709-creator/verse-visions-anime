export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Hand-maintained Supabase types.
 *
 * Two things were wrong here and they compounded. No table carried a
 * `Relationships` key, which @supabase/supabase-js v2.116 requires for query
 * inference - without it every `.select()` resolved to `never`, which is why
 * `$locale.$.tsx` could not read `.title` off its own loader data. And the file
 * declared three tables while the app queries seven, so the rest fell through
 * to the same `never`.
 *
 * Columns below are taken from what the code demonstrably reads and writes -
 * the select lists, the insert payloads, and the fields rendered in JSX - not
 * from a guess at the schema.
 */
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      entities: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          image_url: string | null;
          entity_type: string;
          status: string;
          categories: string[] | null;
          metadata: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          entity_type: string;
          status?: string;
          categories?: string[] | null;
          metadata?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          entity_type?: string;
          status?: string;
          categories?: string[] | null;
          metadata?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string | null;
          author: string | null;
          image_url: string | null;
          upvotes: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category?: string | null;
          author?: string | null;
          image_url?: string | null;
          upvotes?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: string | null;
          author?: string | null;
          image_url?: string | null;
          upvotes?: number | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      reels: {
        Row: {
          id: string;
          title: string;
          author: string | null;
          video_url: string;
          likes: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          author?: string | null;
          video_url: string;
          likes?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string | null;
          video_url?: string;
          likes?: number | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author: string | null;
          content: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          post_id: string;
          author?: string | null;
          content: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          post_id?: string;
          author?: string | null;
          content?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      anime_nexus_matrix: {
        Row: {
          slug: string;
          title: string;
          target_language: string;
          target_market: string;
          webRTC_voice_channels_active: boolean;
          neural_node_data: Json;
          matrix_metrics: Json;
          status: string;
        };
        Insert: {
          slug: string;
          title: string;
          target_language: string;
          target_market: string;
          webRTC_voice_channels_active?: boolean;
          neural_node_data?: Json;
          matrix_metrics?: Json;
          status?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          target_language?: string;
          target_market?: string;
          webRTC_voice_channels_active?: boolean;
          neural_node_data?: Json;
          matrix_metrics?: Json;
          status?: string;
        };
        Relationships: [];
      };
      game_nexus_matrix: {
        Row: {
          slug: string;
          title: string;
          target_language: string;
          target_market: string;
          ai_auto_localization: boolean;
          live_viewers_count: number;
          chat_activity_rate: string;
          webRTC_voice_channels_active: boolean;
          dopamine_multiplier: string;
          loot_box_drop_rate: string;
          daily_streak_bonus_active: boolean;
          web_push_notifications_enabled: boolean;
          algorithmic_feed_weight: string;
          loot_marketplace_token: string;
          ai_dynamic_event_active: boolean;
          aggregate_rating: string;
          reviews_count: number;
          sample_review: string;
          adsense_slot: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          title: string;
          target_language: string;
          target_market: string;
          ai_auto_localization?: boolean;
          live_viewers_count?: number;
          chat_activity_rate?: string;
          webRTC_voice_channels_active?: boolean;
          dopamine_multiplier?: string;
          loot_box_drop_rate?: string;
          daily_streak_bonus_active?: boolean;
          web_push_notifications_enabled?: boolean;
          algorithmic_feed_weight?: string;
          loot_marketplace_token?: string;
          ai_dynamic_event_active?: boolean;
          aggregate_rating?: string;
          reviews_count?: number;
          sample_review?: string;
          adsense_slot?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          target_language?: string;
          target_market?: string;
          ai_auto_localization?: boolean;
          live_viewers_count?: number;
          chat_activity_rate?: string;
          webRTC_voice_channels_active?: boolean;
          dopamine_multiplier?: string;
          loot_box_drop_rate?: string;
          daily_streak_bonus_active?: boolean;
          web_push_notifications_enabled?: boolean;
          algorithmic_feed_weight?: string;
          loot_marketplace_token?: string;
          ai_dynamic_event_active?: boolean;
          aggregate_rating?: string;
          reviews_count?: number;
          sample_review?: string;
          adsense_slot?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      /**
       * Created by supabase/setup-community-polls.sql, which is optional.
       * Declared here so the poll code is type-checked either way; every read
       * and write of it is wrapped so an absent table degrades to local
       * counts rather than throwing. See src/lib/community-poll.ts.
       */
      poll_votes: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          poll_id?: string;
          option_id?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      automation_state: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
