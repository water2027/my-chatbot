import type { User } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  setUser: user => set({
    user,
    isAuthenticated: !!user,
  }),

  setLoading: loading => set({ loading }),

  initialize: async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    try {
      const { data: { user } } = await supabase.auth.getUser()
      get().setUser(user)

      supabase.auth.onAuthStateChange((event, session) => {
        get().setUser(session?.user ?? null)
      })
    }
    catch (error) {
      console.error('Auth initialization error:', error)
      get().setUser(null)
    }
    finally {
      get().setLoading(false)
    }
  },

  signOut: async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    await supabase.auth.signOut()
    set({ user: null, isAuthenticated: false })
  },
}))
