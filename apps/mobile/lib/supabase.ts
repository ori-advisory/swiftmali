import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import type { Database } from '@swiftmali/supabase/src/database.types';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const supabaseUrl = (Constants.expoConfig?.extra?.['supabaseUrl'] as string) || process.env['EXPO_PUBLIC_SUPABASE_URL']!;
const supabaseAnonKey = (Constants.expoConfig?.extra?.['supabaseAnonKey'] as string) || process.env['EXPO_PUBLIC_SUPABASE_ANON_KEY']!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { storage: ExpoSecureStoreAdapter, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});
