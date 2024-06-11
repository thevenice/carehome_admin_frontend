import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import axiosInstance from '../utils/axios'

type AuthData = {
  token: string
  refreshToken: string
  userId: string
}

type CompanyData = {
  name: string
  contactInfo: {
    phoneNumber: string
    emailAddress: string
  }
  location: {
    address: string
    coordinates: {
      type: string
      coordinates: [number, number]
    }
  }
  linkedin: string
  google_map: string
  facebook: string
  instagram: string
  whatsapp: string
  telegram: string
  aboutUs: string
  servicesOffered: string[]
  facilitiesAmenities: string[]
  logo: string
}

type AuthActions = {
  setAuthData: (data: AuthData) => void
  fetchAuthData: () => Promise<void>
  updateAuthData: (data: Partial<AuthData>) => Promise<void>
  fetchCompanyData: () => Promise<void>
}

type StoreState = AuthData & { companyData?: CompanyData } & AuthActions

type CustomStateCreator = StateCreator<StoreState, [], []>

const useStore = create<StoreState>(
  persist<StoreState, [], []>(
    (set, get) => ({
      token: '',
      refreshToken: '',
      userId: '',
      companyData: undefined,
      setAuthData: (data: AuthData) => set(data),
      fetchAuthData: async () => {
        try {
          const response = await axios.get('/api/auth')
          set(response.data)
        } catch (error) {
          console.error('Failed to fetch auth data:', error)
        }
      },
      updateAuthData: async (data: Partial<AuthData>) => {
        try {
          const response = await axios.put('/api/auth', data)
          set(response.data)
        } catch (error) {
          console.error('Failed to update auth data:', error)
        }
      },
      fetchCompanyData: async () => {
        const { token, userId } = get()
        if (!token || !userId) return

        try {
          const response = await axiosInstance.get('/admin/company-info', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.data.success) {
            set({ companyData: response.data.data })
          } else {
            console.error('Failed to fetch company info')
          }
        } catch (error) {
          console.error('Error fetching company info:', error)
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  ) as CustomStateCreator,
)

export default useStore
