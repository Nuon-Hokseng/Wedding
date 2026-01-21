import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Guest = {
  id: number;
  name: string;
  email: string | null;
  link_token: string;
  invited_at: string;
};

export type WishFeed = {
  id: number;
  guest_id: number;
  name: string;
  number_of_guests: number;
  will_attend: boolean;
  message: string;
  created_at: string;
};
