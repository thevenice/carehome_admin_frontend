import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthData = {
  token: string
  refreshToken: string
  userId: string
}

type AuthActions = {
  setAuthData: (data: AuthData) => void
}

type CustomStateCreator = StateCreator<AuthData & AuthActions, [], []>

const useStore = create<AuthData & AuthActions>(
  persist<AuthData & AuthActions, [], []>(
    (set: any) => ({
      token: '',
      refreshToken: '',
      userId: '',
      setAuthData: (data: AuthData) => set(data),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    },
  ) as CustomStateCreator,
)

export default useStore
