// src/components/UserProfile.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStore from '../store/store'
import {
  faUser,
  faCalendarAlt,
  faEnvelope,
  faEdit,
  faPhone,
  faHome,
  faBriefcase,
  faAward,
  faLanguage,
  faCertificate,
  faHospital,
  faClock,
} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../utils/axios'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import CardCareHomeFields from '../components/CardCareHomeFields'
import DefaultLayout from '../layout/DefaultLayout'
import UserActions from '../components/UsersActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface UserData {
  success: boolean
  data: {
    _id: string
    profile_picture: string
    email: string
    name: string
    active: boolean
    role: string
    email_verification: string
    createdAt: string
    updatedAt: string
    __v: number
  }
}

const UserProfile: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userProfileData, setUserProfileData] = useState<any | null>(null)
  const { user_id } = useParams<{ user_id: string }>()
  const { token, userId } = useStore()
  const navigate = useNavigate()

  const user_id_data = user_id ? user_id : userId

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/user?id=${user_id_data}`)
      if (response.data.success) {
        setUserData(response.data)
      } else {
        console.error('Error:', response.data)
      }
    } catch (error) {
      console.error('Error fetching user data', error)
    }
  }

  const fetchUserProfileData = async () => {
    if (!userData) return // Wait until userData is set
    try {
      const role = userData.data.role
      let url = ''

      switch (role) {
        case 'CAREGIVER':
          url = `/admin/caregivers?userId=${user_id_data}`
          break
        case 'INTERVIEW_CANDIDATE':
          // Define URL for INTERVIEW_CANDIDATE (if applicable)
          break
        case 'ADMINISTRATOR':
          // Define URL for ADMINISTRATOR (if applicable)
          break
        case 'RESIDENT':
          // Define URL for RESIDENT (if applicable)
          break
        case 'HEALTHCARE_PROFESSIONAL':
          url = `/admin/healthcare-professionals?userId=${user_id_data}`
          break
        default:
          console.error('Unhandled role:', role)
          return // Exit if role is not recognized
      }

      const response = await axiosInstance.get(url)
      if (response.data.success) {
        setUserProfileData(response.data)
      } else {
        console.error('Error:', response.data)
      }
    } catch (error) {
      console.error('Error fetching profile data', error)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [user_id_data])

  useEffect(() => {

    if (userData) {
      fetchUserProfileData()
    }
  }, [user_id_data, userData])

  const handleEditClick = (user_id_data: string | null) => {
    if (user_id_data === null) {
      console.log(null)
    }
    navigate(`/users/update/${user_id_data}`)
  }

  const handleToggleClick = async () => {
    console.log('Toggle button clicked')
    setIsActive((prev) => !prev)
    try {
      const response = await fetch(
        `http://localhost:9091/api/admin/user/${user_id_data}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ active: !isActive }),
        },
      )

      if (!response.ok) {
        console.error('Failed to update user status')
      } else {
        alert('User status updated successfully')
        fetchUserData()
        fetchUserProfileData()
      }
    } catch (error) {
      console.error('Error updating user status', error)
    }
  }

  const handleCreateUpdateCaregiver = (userId: string) => {
    navigate(`/caregivers/create-update/${userId}`)
  }

  return (
    <>
      {userData ? (
        <DefaultLayout>
          <Breadcrumb pageName="Users Profile" />

          <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="mt-4">
                <div className="flex flex-col items-center">
                  <img
                    src={userData.data.profile_picture}
                    alt={`${userData.data.email} main`}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                </div>

                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {userData.data.name}
                </h3>
                <UserActions
                  isEnabled={isActive}
                  onEditClick={() =>
                    handleEditClick(user_id_data)
                  }
                  onToggleClick={handleToggleClick}
                />
                <div className="mt-6.5">
                  <h4 className="mb-3.5 font-medium text-black dark:text-white">
                    USER INFO:
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <CardCareHomeFields
                      icon={faUser}
                      title="User ID"
                      value={userData.data._id}
                    />
                    <CardCareHomeFields
                      icon={faUser}
                      title="User Name"
                      value={userData.data.name}
                    />
                    <CardCareHomeFields
                      icon={faEnvelope}
                      title="Email"
                      value={userData.data.email}
                    />
                    <CardCareHomeFields
                      icon={faUser}
                      title="Role"
                      value={userData.data.role}
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Active"
                      value={userData.data.active ? 'True' : 'False'}
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Email Verification"
                      value={userData.data.email_verification}
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Created At"
                      value={new Date(
                        userData.data.createdAt,
                      ).toLocaleDateString()}
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Updated At"
                      value={new Date(
                        userData.data.updatedAt,
                      ).toLocaleDateString()}
                    />
                  </div>
{                   userData && userData.data.role == "CAREGIVER" && ( <div className='mt-3.5'>
                    <h4 className="mb-3.5 font-medium text-black dark:text-white">
                        PROFILE INFO:
                      </h4>
                      <div className="flex justify-center mt-6 mb-2">
                        <button
                          onClick={() =>
                            handleCreateUpdateCaregiver(userData.data._id)
                          }
                          className="flex items-center gap-1 text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded px-3 py-1.5 hover:bg-blue-600"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Create/Update Caregiver Profile
                        </button>
                      </div>
                    </div>)}
                  {/* Additional Caregiver Profile Data */}
                  { userData && userData.data.role == "CAREGIVER" && userProfileData ? (
                    <div className="mt-3.5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <CardCareHomeFields
                          icon={faPhone}
                          title="Contact Number"
                          value={userProfileData.data.contactNumber}
                        />
                        <CardCareHomeFields
                          icon={faHome}
                          title="Address"
                          value={userProfileData.data.address}
                        />
                        <CardCareHomeFields
                          icon={faBriefcase}
                          title="Specialization"
                          value={userProfileData.data.specialization}
                        />
                        <CardCareHomeFields
                          icon={faCertificate}
                          title="License Number"
                          value={userProfileData.data.licenseNumber}
                        />
                        <CardCareHomeFields
                          icon={faCalendarAlt}
                          title="Years of Experience"
                          value={userProfileData.data.yearsOfExperience}
                        />
                        <CardCareHomeFields
                          icon={faAward}
                          title="Qualifications"
                          value={userProfileData.data.qualifications.join(', ')}
                        />
                        <CardCareHomeFields
                          icon={faBriefcase}
                          title="Skills"
                          value={userProfileData.data.skills.join(', ')}
                        />
                        <CardCareHomeFields
                          icon={faClock}
                          title="Preferred Shifts"
                          value={userProfileData.data.preferredShifts.join(
                            ', ',
                          )}
                        />
                        <CardCareHomeFields
                          icon={faHospital}
                          title="Work Location Preferences"
                          value={userProfileData.data.workLocationPreferences.join(
                            ', ',
                          )}
                        />
                        <CardCareHomeFields
                          icon={faLanguage}
                          title="Languages Spoken"
                          value={userProfileData.data.languagesSpoken.join(
                            ', ',
                          )}
                        />
                        <CardCareHomeFields
                          icon={faCertificate}
                          title="Certifications"
                          value={userProfileData.data.certifications.join(', ')}
                        />
                        <CardCareHomeFields
                          icon={faCalendarAlt}
                          title="Availability Days"
                          value={userProfileData.data.availability.days.join(
                            ', ',
                          )}
                        />
                        <CardCareHomeFields
                          icon={faClock}
                          title="Availability Time Slots"
                          value={userProfileData.data.availability.timeSlots.join(
                            ', ',
                          )}
                        />
                        <CardCareHomeFields
                          icon={faUser}
                          title="Emergency Contact Name"
                          value={userProfileData.data.emergencyContact.name}
                        />
                        <CardCareHomeFields
                          icon={faUser}
                          title="Emergency Contact Relationship"
                          value={
                            userProfileData.data.emergencyContact.relationship
                          }
                        />
                        <CardCareHomeFields
                          icon={faPhone}
                          title="Emergency Contact Phone Number"
                          value={
                            userProfileData.data.emergencyContact.phoneNumber
                          }
                        />
                      </div>
                    </div>
                  ) : userProfileData == null ? '' : (
                    <div>Loading...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DefaultLayout>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default UserProfile
