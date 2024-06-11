import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import axiosInstance from '../utils/axios'

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

type AuthData = {
  token: string
  refreshToken: string
  userId: string
  role: string
}

type StoreState = AuthData & { companyData?: CompanyData } & {
  setAuthData: (data: AuthData) => void
  fetchCompanyData: () => Promise<void>
}

const useStore = create<StoreState>(
  (persist as (
    config: (set: any, get: any, api: any) => StoreState,
    options: PersistOptions<StoreState>
  ) => StateCreator<StoreState, [], []>)(
    (set, get) => ({
      token: '',
      refreshToken: '',
      userId: '',
      role: '',
      companyData: undefined,
      setAuthData: (data: AuthData) => set(data),
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
  )
)

export default useStore
