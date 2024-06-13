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

type LoggedUserData = {
  _id: string
  email: string
  active: boolean
  role: string
  email_verification: string
  createdAt: string
  updatedAt: string
  fcm_token: string
  profile_picture: string
  name: string
}

type StoreState = AuthData & {
  companyData?: CompanyData
  loggedUserData?: LoggedUserData
  setAuthData: (data: AuthData) => void
  fetchCompanyData: () => Promise<void>
  fetchLoggedUserData: () => Promise<void>
}

const useStore = create<StoreState>(
  (
    persist as (
      config: (set: any, get: any, api: any) => StoreState,
      options: PersistOptions<StoreState>,
    ) => any
  )(
    (set, get) => ({
      token: '',
      refreshToken: '',
      userId: '',
      role: '',
      companyData: undefined,
      loggedUserData: undefined,
      setAuthData: (data: AuthData) => set(data),
      fetchCompanyData: async () => {
        const { token } = get()
        if (!token) return

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
      fetchLoggedUserData: async () => {
        const { token, userId } = get()
        if (!token || !userId) return

        try {
          const response = await axiosInstance.get(`/admin/user?id=${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.data.success) {
            const dataToSet = {
              _id: response.data.data._id,
              email: response.data.data.email,
              active: response.data.data.active,
              role: response.data.data.role,
              email_verification: response.data.data.email_verification,
              createdAt: response.data.data.createdAt,
              updatedAt: response.data.data.updatedAt,
              fcm_token: response.data.data.fcm_token,
              profile_picture: response.data.data.profile_picture,
              name: response.data.data.name,
            }
            set({ loggedUserData: dataToSet })
          } else {
            console.error('Failed to fetch logged user data')
          }
        } catch (error) {
          console.error('Error fetching logged user data:', error)
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    },
  ),
)

export default useStore
