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
  faAllergies,
  faDoorOpen,
  faHeartbeat,
  faIdCard,
  faListUl,
  faMoon,
  faRunning,
  faStethoscope,
  faSun,
  faUserMd,
  faUserNurse,
  faUserShield,
  faUtensils,
  faWalking,
  faWheelchair,
  faAddressBook,
  faFileAlt,
  faFolder,
  faPills,
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
          url = `/admin/residents?userId=${user_id_data}`
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

  const handleCreateUpdateHealthcareProffesional = (userId: string) => {
    navigate(`/users/healthcareProffesional/create-update/${userId}`)
  }

  const handleCreateUpdateCaregiver = (userId: string) => {
    navigate(`/users/caregivers/create-update/${userId}`)
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
                  onEditClick={() => handleEditClick(user_id_data)}
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
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faUser}
                      title="User Name"
                      value={userData.data.name}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faEnvelope}
                      title="Email"
                      value={userData.data.email}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faUser}
                      title="Role"
                      value={userData.data.role}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Active"
                      value={userData.data.active ? 'True' : 'False'}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Email Verification"
                      value={userData.data.email_verification}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Created At"
                      value={new Date(
                        userData.data.createdAt,
                      ).toLocaleDateString()}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Updated At"
                      value={new Date(
                        userData.data.updatedAt,
                      ).toLocaleDateString()}
                      RedirectComponent=""
                    />
                  </div>
                  {userData &&
                    userData.data.role == 'HEALTHCARE_PROFESSIONAL' && (
                      <div className="mt-3.5">
                        <h4 className="mb-3.5 font-medium text-black dark:text-white">
                          PROFILE INFO:
                        </h4>
                        <div className="flex justify-center mt-6 mb-2">
                          <button
                            onClick={() =>
                              handleCreateUpdateHealthcareProffesional(
                                userData.data._id,
                              )
                            }
                            className="flex items-center gap-1 text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded px-3 py-1.5 hover:bg-blue-600"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                            Create/Update Healthcare Proffesional Profile
                          </button>
                        </div>
                      </div>
                    )}
                  {userData && userData.data.role == 'CAREGIVER' && (
                    <div className="mt-3.5">
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
                    </div>
                  )}
                  {/* Additional Caregiver Profile Data */}
                  {userData &&
                  userData.data.role == 'CAREGIVER' &&
                  userProfileData ? (
                    <div className="mt-3.5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <CardCareHomeFields
                          icon={faPhone}
                          title="Contact Number"
                          value={userProfileData.data.contactNumber}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faHome}
                          title="Address"
                          value={userProfileData.data.address}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faBriefcase}
                          title="Specialization"
                          value={userProfileData.data.specialization}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faCertificate}
                          title="License Number"
                          value={userProfileData.data.licenseNumber}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faCalendarAlt}
                          title="Years of Experience"
                          value={userProfileData.data.yearsOfExperience}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faAward}
                          title="Qualifications"
                          value={userProfileData.data.qualifications.join(', ')}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faBriefcase}
                          title="Skills"
                          value={userProfileData.data.skills.join(', ')}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faClock}
                          title="Preferred Shifts"
                          value={userProfileData.data.preferredShifts.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faHospital}
                          title="Work Location Preferences"
                          value={userProfileData.data.workLocationPreferences.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faLanguage}
                          title="Languages Spoken"
                          value={userProfileData.data.languagesSpoken.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faCertificate}
                          title="Certifications"
                          value={userProfileData.data.certifications.join(', ')}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faCalendarAlt}
                          title="Availability Days"
                          value={userProfileData.data.availability.days.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faClock}
                          title="Availability Time Slots"
                          value={userProfileData.data.availability.timeSlots.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faUser}
                          title="Emergency Contact Name"
                          value={userProfileData.data.emergencyContact.name}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faUser}
                          title="Emergency Contact Relationship"
                          value={
                            userProfileData.data.emergencyContact.relationship
                          }
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faPhone}
                          title="Emergency Contact Phone Number"
                          value={
                            userProfileData.data.emergencyContact.phoneNumber
                          }
                          RedirectComponent=""
                        />
                      </div>
                    </div>
                  ) : userProfileData == null ? (
                    ''
                  ) : userProfileData != null &&
                    userData.data.role == 'CAREGIVER' ? (
                    <div>Loading...</div>
                  ) : (
                    ''
                  )}

                  {/* Additional HEALTHCARE_PROFESSIONAL Profile Data */}
                  {userData &&
                  userData.data.role == 'HEALTHCARE_PROFESSIONAL' &&
                  userProfileData ? (
                    <div className="mt-3.5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <CardCareHomeFields
                          icon={faPhone}
                          title="Contact Number"
                          value={userProfileData.data.contactNumber}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faHome}
                          title="Address"
                          value={userProfileData.data.address}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faBriefcase}
                          title="Specialization"
                          value={userProfileData.data.specialization}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faCertificate}
                          title="License Number"
                          value={userProfileData.data.licenseNumber}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faCalendarAlt}
                          title="Years of Experience"
                          value={userProfileData.data.yearsOfExperience}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faAward}
                          title="Qualifications"
                          value={userProfileData.data.qualifications.join(', ')}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faBriefcase}
                          title="Skills"
                          value={userProfileData.data.skills.join(', ')}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faClock}
                          title="Preferred Shifts"
                          value={userProfileData.data.preferredShifts.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faHospital}
                          title="Work Location Preferences"
                          value={userProfileData.data.workLocationPreferences.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faLanguage}
                          title="Languages Spoken"
                          value={userProfileData.data.languagesSpoken.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faCertificate}
                          title="Certifications"
                          value={userProfileData.data.certifications.join(', ')}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faCalendarAlt}
                          title="Availability Days"
                          value={userProfileData.data.availability.days.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faClock}
                          title="Availability Time Slots"
                          value={userProfileData.data.availability.timeSlots.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faUser}
                          title="Emergency Contact Name"
                          value={userProfileData.data.emergencyContact.name}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faUser}
                          title="Emergency Contact Relationship"
                          value={
                            userProfileData.data.emergencyContact.relationship
                          }
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faPhone}
                          title="Emergency Contact Phone Number"
                          value={
                            userProfileData.data.emergencyContact.phoneNumber
                          }
                          RedirectComponent=""
                        />
                      </div>
                    </div>
                  ) : userProfileData == null ? (
                    ''
                  ) : userProfileData != null &&
                    userData.data.role == 'HEALTHCARE_PROFESSIONAL' ? (
                    <div>Loading...</div>
                  ) : (
                    ''
                  )}
                  {/* Resident Profile Data */}
                  {userData &&
                  userData.data.role === 'RESIDENT' &&
                  userProfileData ? (
                    <div className="mt-3.5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <CardCareHomeFields
                          icon={faCalendarAlt}
                          title="Admission Date"
                          value={new Date(
                            userProfileData.data.admissionDate,
                          ).toLocaleDateString()}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faDoorOpen}
                          title="Room Number"
                          value={userProfileData.data.roomNumber}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faUserNurse}
                          title="Care Level"
                          value={userProfileData.data.careLevel}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faStethoscope}
                          title="Primary Diagnosis"
                          value={userProfileData.data.primaryDiagnosis}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faListUl}
                          title="Secondary Diagnoses"
                          value={userProfileData.data.secondaryDiagnoses.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faAllergies}
                          title="Allergies"
                          value={userProfileData.data.allergies.join(', ')}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faUtensils}
                          title="Dietary Restrictions"
                          value={userProfileData.data.dietaryRestrictions.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faPills}
                          title="Medications"
                          value={userProfileData.data.medications
                            .map((med: any) => `${med.name} (${med.dosage})`)
                            .join(', ')}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faWalking}
                          title="Mobility Status"
                          value={userProfileData.data.mobilityStatus}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faWheelchair}
                          title="Assistive Devices"
                          value={userProfileData.data.assistiveDevices.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faHeartbeat}
                          title="DNR Status"
                          value={userProfileData.data.dnrStatus ? 'Yes' : 'No'}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faUserMd}
                          title="Primary Physician"
                          value={`${userProfileData.data.primaryPhysician.name} (${userProfileData.data.primaryPhysician.contactNumber})`}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faIdCard}
                          title="Insurance"
                          value={`${userProfileData.data.insuranceInfo.provider} (${userProfileData.data.insuranceInfo.policyNumber})`}
                          RedirectComponent=""
                        />
                        {userProfileData.data.legalGuardian && (
                          <CardCareHomeFields
                            icon={faUserShield}
                            title="Legal Guardian"
                            value={`${userProfileData.data.legalGuardian.name} (${userProfileData.data.legalGuardian.relationship})`}
                            RedirectComponent=""
                          />
                        )}
                        <CardCareHomeFields
                          icon={faSun}
                          title="Wake Up Time"
                          value={userProfileData.data.preferences.wakeUpTime}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faMoon}
                          title="Bed Time"
                          value={userProfileData.data.preferences.bedTime}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faUtensils}
                          title="Meal Preferences"
                          value={userProfileData.data.preferences.mealPreferences.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faRunning}
                          title="Preferred Activities"
                          value={userProfileData.data.preferences.activities.join(
                            ', ',
                          )}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faAddressBook}
                          title="Emergency Contacts"
                          value={userProfileData.data.emergencyContacts
                            .map(
                              (contact: any) =>
                                `${contact.name} (${contact.relationship})`,
                            )
                            .join(', ')}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faFileAlt}
                          title="Care Notes"
                          value={userProfileData.data.careNotes.map((note:any) => `${note.note} - By(${note.author}) - At(${note.date})`)}
                          RedirectComponent=""
                        />
                        <CardCareHomeFields
                          icon={faFolder}
                          title="Documents"
                          value={`${userProfileData.data.documents}`}
                          RedirectComponent=""
                        />
                      </div>
                    </div>
                  ) : userProfileData === null ? (
                    ''
                  ) : userProfileData != null &&
                    userData.data.role === 'RESIDENT' ? (
                    <div>Loading...</div>
                  ) : (
                    ''
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
