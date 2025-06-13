// store/userStore.ts
import { create } from 'zustand'

interface UserInfo {
  accessToken: string
  refreshToken: string
}

interface UserState {
  userInfo: UserInfo | null
  setUserInfo: (userInfo: UserInfo) => void
  clearUserInfo: () => void
  updateAccessToken: (accessToken: string) => void
  updateRefreshToken: (refreshToken: string) => void
}

export const useUserStore = create<UserState>((set, _get) => ({
  userInfo: null,

  setUserInfo: userInfo => set({
    userInfo,
  }),

  clearUserInfo: () => set({
    userInfo: null,
  }),

  updateAccessToken: accessToken => set(state => ({
    userInfo: state.userInfo
      ? {
          ...state.userInfo,
          accessToken,
        }
      : null,
  })),

  updateRefreshToken: refreshToken => set(state => ({
    userInfo: state.userInfo
      ? {
          ...state.userInfo,
          refreshToken,
        }
      : null,
  })),
}))
