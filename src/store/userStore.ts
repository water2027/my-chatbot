// store/userStore.ts
import { create } from 'zustand'

interface UserInfo {
  accessToken: string
  refreshToken: string
}

interface UserState {
  userInfo: UserInfo | null
  isAuthenticated: boolean
  setUserInfo: (userInfo: UserInfo) => void
  clearUserInfo: () => void
  updateToken: (accessToken: string) => void
}

export const useUserStore = create<UserState>((set, _get) => ({
  userInfo: null,
  isAuthenticated: false,

  setUserInfo: userInfo => set({
    userInfo,
    isAuthenticated: true,
  }),

  clearUserInfo: () => set({
    userInfo: null,
    isAuthenticated: false,
  }),

  updateToken: accessToken => set(state => ({
    userInfo: state.userInfo
      ? {
          ...state.userInfo,
          accessToken,
        }
      : null,
  })),
}))
