import React, { createContext, useContext, useEffect } from 'react'
import useStore from './store'

const StoreContext = createContext<ReturnType<typeof useStore> | null>(null)
//@ts-ignore
export const StoreProvider: React.FC = ({ children }) => {
  const store = useStore()

  useEffect(() => {
    store.fetchCompanyData()
  }, [store.token, store.userId])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStoreContext = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider')
  }
  return context
}
