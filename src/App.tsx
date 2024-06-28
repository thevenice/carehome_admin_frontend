import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Loader from './common/Loader'
import PageTitle from './components/PageTitle'
import SignIn from './pages/Authentication/SignIn'
import CompanyInfo from './pages/CompanyInfo'
import CareHomeProfile from './pages/CareHomeProfile'
import UpdateCareHomeForm from './pages/UpdateCareHomeForm'
import Users from './pages/Users'
import UserProfile from './pages/UserProfile'
import UpdateUserProfileForm from './pages/UpdateUserProfile'
import CreateUserProfile from './pages/CreateUserProfile'
import UpdateCompanyInfo from './pages/UpdateCompanyInfo'
import useStore from './store/store'
import ECommerce from './pages/Dashboard'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import CareHomes from './pages/CareHomes'
import Chart from './pages/Chart'
import FormElements from './pages/Form/FormElements'
import FormLayout from './pages/Form/FormLayout'
import Plans from './pages/Plans'
import Alerts from './pages/UiElements/Alerts'
import Buttons from './pages/UiElements/Buttons'
import PlanDetails from './pages/PlanDetails'
import CaregiverCreateUpdateForm from './pages/CreateUpdateCaregiverProfile'
import HealthcareProfessionalUpdateForm from './pages/CreateUpdateHealthcareProfessionalProfile'
import Documents from './pages/Documents'
import DocumentProfile from './pages/DocumentProfile'
import CreateDocumentProfile from './pages/CreateDocumentProfile'
import UpdateDocumentProfile from './pages/UpdateDocumentProfile'
import CreateUpdateResidentProfile from './pages/createUpdateResidentProfile'
import InterviewCandidateUpdateForm from './pages/CreateUpdateInterviewCandidateProfile'

//
// import PlanDetails from './pages/PlanDetails'
// import Settings from './pages/Settings'
// import CareHomes from './pages/CareHomes'
// import Plans from './pages/Plans'
// import Alerts from './pages/UiElements/Alerts'
// import Buttons from './pages/UiElements/Buttons'
// import SignUp from './pages/Authentication/SignUp'
// import Calendar from './pages/Calendar'
// import Chart from './pages/Chart'
// import ECommerce from './pages/Dashboard/ECommerce'
// import FormElements from './pages/Form/FormElements'
// import FormLayout from './pages/Form/FormLayout'
//

function App() {
  const [loading, setLoading] = useState<boolean>(true)
  const { pathname } = useLocation()
  const { token, role } = useStore() // Access user data and role from the store

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const protectedRoute = (element: JSX.Element) => {
    console.log('role', role)
    return token && role === 'ADMINISTRATOR' ? (
      element
    ) : (
      <Navigate to="/" replace={true} />
    )
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
                <PageTitle title="Company Info Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Dashboard />
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
          path="/dashboard"
          element={protectedRoute(
            <>
              <PageTitle title="Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Dashboard />
            </>,
          )}
        />
        <Route
          path="/company-info"
          element={protectedRoute(
            <>
              <PageTitle title="Company Info | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <CompanyInfo />
            </>,
          )}
        />
        <Route
          path="/carehome-profile/:care_home_id"
          element={protectedRoute(
            <>
              <PageTitle title="CareHomeProfile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <CareHomeProfile />
            </>,
          )}
        />
        <Route
          path="/profile"
          element={protectedRoute(
            <>
              <PageTitle title="Users Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UserProfile />
            </>,
          )}
        />
        <Route
          path="/users/:user_id"
          element={protectedRoute(
            <>
              <PageTitle title="Users Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UserProfile />
            </>,
          )}
        />
        <Route
          path="/documents/:document_id"
          element={protectedRoute(
            <>
              <PageTitle title="Users Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <DocumentProfile />
            </>,
          )}
        />
        <Route
          path="/carehome-profile/update/:care_home_id"
          element={protectedRoute(
            <>
              <PageTitle title="Update CareHomeProfile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UpdateCareHomeForm />
            </>,
          )}
        />
        <Route
          path="/users/caregivers/create-update/:userId"
          element={protectedRoute(
            <>
              <PageTitle title="Update CareHomeProfile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <CaregiverCreateUpdateForm />
            </>,
          )}
        />
        <Route
          path="/users/healthcareProffesional/create-update/:userId"
          element={protectedRoute(
            <>
              <PageTitle title="Update HealthcareProffesional | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <HealthcareProfessionalUpdateForm />
            </>,
          )}
        />
        <Route
          path="/users/residents/create-update/:userId"
          element={protectedRoute(
            <>
              <PageTitle title="Update Residents | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <CreateUpdateResidentProfile />
            </>,
          )}
        />
        <Route
          path="/users/interview-candidates/create-update/:userId"
          element={protectedRoute(
            <>
              <PageTitle title="Update Interview Candidate | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <InterviewCandidateUpdateForm />
            </>,
          )}
        />
        <Route
          path="/users/update/:userId"
          element={protectedRoute(
            <>
              <PageTitle title="Update user | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UpdateUserProfileForm />
            </>,
          )}
        />
        <Route
          path="/users/create"
          element={protectedRoute(
            <>
              <PageTitle title="Create user | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <CreateUserProfile />
            </>,
          )}
        />
        <Route
          path="/users"
          element={protectedRoute(
            <>
              <PageTitle title="Users | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Users />
            </>,
          )}
        />
        <Route
          path="/documents"
          element={protectedRoute(
            <>
              <PageTitle title="Documents | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Documents />
            </>,
          )}
        />
        <Route
          path="/documents/create"
          element={protectedRoute(
            <>
              <PageTitle title="Create Document | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <CreateDocumentProfile />
            </>,
          )}
        />
        <Route
          path="/documents/update/:documentId"
          element={protectedRoute(
            <>
              <PageTitle title="Update Document | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UpdateDocumentProfile />
            </>,
          )}
        />
        <Route
          path="/update-company-info"
          element={protectedRoute(
            <>
              <PageTitle title="Update Company Info | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UpdateCompanyInfo />
            </>,
          )}
        />
        {/* Plans Routes start */}
        <Route
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
        />
        {/* Public routes (accessible without login) */}
        <Route path="/forms/form-elements" element={<FormElements />} />
        <Route path="/forms/form-layout" element={<FormLayout />} />
        <Route path="/carehomes" element={<CareHomes />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/ui/alerts" element={<Alerts />} />
        <Route path="/ui/buttons" element={<Buttons />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  )
}

export default App
