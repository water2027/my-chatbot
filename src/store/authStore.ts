import type { User } from '@supabase/supabase-js'
// 确保 UserProfile 类型中包含 token 字段
import { create } from 'zustand'
import { createClient } from '@/utils/supabase/browser'

interface AuthState {
  user: User | null
  balance: number
  isInitialized: boolean
}

interface AuthActions {
  initialize: () => void
  signOut: () => Promise<void>
  refreshTokenValue: () => Promise<void> 
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  balance: 0, 
  isInitialized: false,

  refreshTokenValue: async () => {
    const userId = get().user?.id;
    if (!userId) {
      return;
    }
    
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('users')
        .select('token') 
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Error fetching token value:', error);
        return Promise.reject(error);
      }

      if (data) {
        set({
          balance: data.token ?? 0, 
        });
      }
    } catch (error) {
      console.error('Exception while refreshing token value:', error);
      return Promise.reject(error);
    }
  },

  initialize: () => {
    if (get().isInitialized) return;

    const supabase = createClient();
    supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      set({ user: currentUser });

      if (event === 'SIGNED_OUT') {
        set({ balance: 0 });
      }

      set({ isInitialized: true });
    });
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  },
}));