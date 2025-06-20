import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/types/user'
import { create } from 'zustand'
import { createClient } from '@/utils/supabase/browser'

interface AuthState {
  user: User | null
  userProfile: UserProfile | null
}

interface AuthActions {
  setUser: (user: User | null) => void
  setUserProfile: (profile: UserProfile | null) => void
  initialize: () => Promise<void>
  signOut: () => Promise<void>
  refreshToken: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  userProfile: null,
  isAuthenticated: false,

  setUser: user => set({
    user,
  }),

  setUserProfile: userProfile => set({ userProfile }),

  refreshToken: async () => {
    const supabase = createClient()
    const userId = get().user?.id
    if (!userId) {
      return
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, token')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return Promise.reject(error)
      }

      const profile = data as UserProfile
      get().setUserProfile(profile)
    }
    catch (error) {
      console.error('Error fetching user profile:', error)
      return Promise.reject(error)
    }
  },

  initialize: async () => {
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      get().setUser(user)

      // 如果用户已登录，获取用户资料
      if (user) {
        await get().refreshToken()
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user ?? null
        get().setUser(currentUser)

        if (currentUser) {
          // 用户登录时获取资料
          await get().refreshToken()
        }
        else {
          // 用户登出时清除资料
          get().setUserProfile(null)
        }
      })
    }
    catch (error) {
      console.error('Auth initialization error:', error)
      get().setUser(null)
      get().setUserProfile(null)
      return Promise.reject(error)
    }
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({
      user: null,
      userProfile: null,
    })
  },
}))
