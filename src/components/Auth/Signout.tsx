import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/store' // Assuming your store is located here

interface SignoutProps {
  // No props are required for this component, so the interface remains empty
}

const Signout: React.FC<SignoutProps> = () => {
  const navigate = useNavigate()
  const { setAuthData } = useStore() // Move this inside the functional component body

  const handleLogout = async () => {
    console.log('Logging out...')
    try {
      setAuthData({ token: '', refreshToken: '', userId: '' }) // Clear the token from the store
      navigate('/') // Redirect to login page after successful logout
    } catch (error) {
      console.error('Logout error:', error)
      // Handle logout errors gracefully (e.g., display an error message)
    }
  }

  return (
    <button
      type="button"
      className="rounded-lg bg-primary text-white px-4 py-2 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      onClick={handleLogout}
    >
      Logout
    </button>
  )
}

export default Signout
