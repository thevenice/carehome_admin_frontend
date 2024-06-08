import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Loader from './common/Loader'
import PageTitle from './components/PageTitle'
import SignIn from './pages/Authentication/SignIn'
import SignUp from './pages/Authentication/SignUp'
import Calendar from './pages/Calendar'
import Chart from './pages/Chart'
import ECommerce from './pages/Dashboard/ECommerce'
import FormElements from './pages/Form/FormElements'
import FormLayout from './pages/Form/FormLayout'
import Profile from './pages/Profile'
import CareHomeProfile from './pages/CareHomeProfile'
import PlanDetails from './pages/PlanDetails'
import Settings from './pages/Settings'
import CareHomes from './pages/CareHomes'
import Plans from './pages/Plans'
import Alerts from './pages/UiElements/Alerts'
import Buttons from './pages/UiElements/Buttons'
import useStore from './store/store'
import UpdateCareHomeForm from './pages/UpdateCareHomeForm'
import Users from './pages/Users'
import UserProfile from './pages/UserProfile'
import UpdateUserProfileForm from './pages/UpdateUserProfile'
import CreateUserProfile from './pages/CreateUserProfile'

function App() {
  const [loading, setLoading] = useState<boolean>(true)
  const { pathname } = useLocation()
  const { token, userId } = useStore() // Access user data and isSignIn function from the store

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  // Redirect to signin if not signed in and trying to access protected routes
  const handleProtectedRoutes = () => {
    if (!token && pathname !== '/auth/signin' && pathname !== '/auth/signup') {
      return <Route path="*" element={<SignIn />} />
    }
    return null
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            token ? ( // Conditionally render ECommerce based on user login
              <>
                <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ECommerce />
              </>
            ) : (
              <>
                <PageTitle title="Signin | Care Home" />
                <SignIn />
              </>
            )
          }
        />
        <Route
          path="/profile"
          element={
            token ? ( // Only render Profile if signed in
              <>
                {console.log('token', token)}
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Profile />
              </>
            ) : (
              <Navigate to="/" replace={true} /> // Redirect to "/" if token is not found or null
            )
          }
        />
      <Route
        path="/carehome-profile/:care_home_id"
        element={
          token ? ( // Only render CareHomeProfile if signed in
            <>
              {console.log('token', token)}
              <PageTitle title="CareHomeProfile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <CareHomeProfile />
            </>
          ) : (
            <Navigate to="/" replace={true} /> // Redirect to "/" if token is not found or null
          )
        }
      />
      <Route
        path="/users/:user_id"
        element={
          token ? ( // Only render User data if signed in
            <>
              {console.log('token', token)}
              <PageTitle title="Users Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UserProfile />
            </>
          ) : (
            <Navigate to="/" replace={true} /> // Redirect to "/" if token is not found or null
          )
        }
      />

      <Route
        path="/carehome-profile/update/:care_home_id"
        element={
          token ? ( // Only render CareHomeProfile if signed in
            <>
              {console.log('token', token)}
              <PageTitle title="Update CareHomeProfile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UpdateCareHomeForm/>
            </>
          ) : (
            <Navigate to="/" replace={true} /> // Redirect to "/" if token is not found or null
          )
        }
      />

      <Route
        path="/users/update/:userId" // Adjust the parameter name here to :userId
        element={
          token ? ( // Only render UpdateUserProfileForm if signed in
            <>
              <PageTitle title="Update user | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UpdateUserProfileForm />
            </>
          ) : (
            <Navigate to="/" replace={true} /> // Redirect to "/" if token is not found or null
          )
        }
      />

      <Route
        path="/users/create" // Adjust the parameter name here to :userId
        element={
          token ? ( // Only render UpdateUserProfileForm if signed in
            <>
              <PageTitle title="Create user | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <CreateUserProfile />
            </>
          ) : (
            <Navigate to="/" replace={true} /> // Redirect to "/" if token is not found or null
          )
        }
      />


        {/* Plans Routes start */}
        {/* <Route
        path="/plans/:plan_id"
        element={
          token ? ( // Only render CareHomeProfile if signed in
            <>
              {console.log('token', token)}
              <PageTitle title="CareHomeProfile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <PlanDetails />
            </>
          ) : (
            <Navigate to="/" replace={true} /> // Redirect to "/" if token is not found or null
          )
        }
      /> */}
        {/*  Plans Routes End*/}
        {/* Public routes (accessible without login) */}
 {/*       <Route path="/forms/form-elements" element={<FormElements />} />
        <Route path="/forms/form-layout" element={<FormLayout />} />
        <Route path="/carehomes" element={<CareHomes />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/ui/alerts" element={<Alerts />} />
      <Route path="/ui/buttons" element={<Buttons />} /> */}
        {handleProtectedRoutes()} {/* Add protected routes check here */}
      <Route path="/users" element={<Users />} />

      </Routes>
    </>
  )
}

export default App
