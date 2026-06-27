// Généré par `pnpm db:types` — ne pas éditer manuellement
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; phone: string; full_name: string | null; avatar_url: string | null;
          commune: string | null; role: 'customer' | 'driver' | 'merchant' | 'admin';
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      restaurants: {
        Row: {
          id: string; name: string; slug: string; description: string | null;
          image_url: string | null; cover_url: string | null; category: string;
          tags: string[]; address: string; commune: string; lat: number; lng: number;
          phone: string | null; rating: number; rating_count: number;
          delivery_time_min: number; delivery_time_max: number;
          min_order: number; delivery_fee: number; is_open: boolean; is_featured: boolean;
          owner_id: string; created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['restaurants']['Row'], 'id' | 'created_at' | 'updated_at' | 'rating' | 'rating_count'>;
        Update: Partial<Database['public']['Tables']['restaurants']['Insert']>;
      };
      menu_categories: {
        Row: { id: string; restaurant_id: string; name: string; position: number; };
        Insert: Omit<Database['public']['Tables']['menu_categories']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['menu_categories']['Insert']>;
      };
      menu_items: {
        Row: {
          id: string; restaurant_id: string; category_id: string | null;
          name: string; description: string | null; image_url: string | null;
          price: number; is_available: boolean; is_popular: boolean;
          tags: string[]; position: number; created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['menu_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['menu_items']['Insert']>;
      };
      orders: {
        Row: {
          id: string; order_number: string; customer_id: string; restaurant_id: string;
          driver_id: string | null;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picking_up' | 'delivering' | 'delivered' | 'cancelled';
          subtotal: number; delivery_fee: number; total: number;
          payment_method: 'orange_money' | 'wave' | 'cash';
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          delivery_address: string; delivery_commune: string;
          delivery_lat: number | null; delivery_lng: number | null;
          notes: string | null; estimated_delivery_at: string | null;
          delivered_at: string | null; created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'order_number' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string; order_id: string; menu_item_id: string;
          name: string; price: number; quantity: number; notes: string | null;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
      drivers: {
        Row: {
          id: string; profile_id: string; plate: string; moto_model: string;
          zone: string; is_online: boolean; lat: number | null; lng: number | null;
          rating: number; trip_count: number; created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['drivers']['Row'], 'id' | 'created_at' | 'rating' | 'trip_count'>;
        Update: Partial<Database['public']['Tables']['drivers']['Insert']>;
      };
      ratings: {
        Row: {
          id: string; order_id: string; customer_id: string;
          driver_id: string | null; restaurant_id: string | null;
          score: number; comment: string | null; tip: number; created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ratings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picking_up' | 'delivering' | 'delivered' | 'cancelled';
      payment_method: 'orange_money' | 'wave' | 'cash';
      user_role: 'customer' | 'driver' | 'merchant' | 'admin';
    };
  };
}
