import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStore from '../store/store'
import CoverOne from '../images/cover/cover-01.png'
import CardCareHomeFields from '../components/CardCareHomeFields'
import {
  faUser,
  faCalendarAlt,
  faMoneyBillAlt,
  faBuilding,
  faUsers,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import CareHomeActions from '../components/CarehomeActions'

interface CareHomeData {
  success: boolean
  data: {
    settings: {
      background_color: string
      text_color: string
      font: string
      logo_link: string
    }
    _id: string
    name: string
    registration_date: string
    owner_id: string
    staff_size: number
    created_by: string
    active: boolean
    createdAt: string
    updatedAt: string
    __v: number
    contact_info?: {
      phone_number?: string[]
      email_address?: string[]
      physical_address?: string[]
    }
  }
}

const CareHomeProfile: React.FC = () => {
  const [isEnabled, setisEnabled] = useState<boolean>(true)
  const { token } = useStore()
  const navigate = useNavigate()
  const { care_home_id } = useParams<{ care_home_id: string }>()
  const [careHomeData, setCareHomeData] = useState<CareHomeData | null>(null)

  const fetchCareHomeData = async () => {
    try {
      const response = await fetch(
        `http://localhost:9091/api/super/care-homes?care_home_id=${care_home_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        setCareHomeData(data)
        setisEnabled(data.data.active) // Ensure the toggle reflects the current status
      } else {
        console.log(response)
      }
    } catch (error) {
      console.error('Error fetching care home ', error)
    }
  }

  const handleEditClick = (careHomeId: string | null) => {
    if (careHomeId === null) {
      console.log(null)
    }
    navigate(`/carehome-profile/update/${careHomeId}`)
  }

  const handleToggleClick = async () => {
    console.log('Toggle button clicked')
    setisEnabled((prev) => !prev)
    try {
      const response = await fetch(
        `http://localhost:9091/api/super/care-homes/${care_home_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ active: !isEnabled }),
        },
      )

      fetchCareHomeData()
      if (!response.ok) {
        console.error('Failed to update care home status')
      }
    } catch (error) {
      console.error('Error updating care home status', error)
    }
  }

  useEffect(() => {
    if (token && care_home_id) {
      fetchCareHomeData()
    }
  }, [token, care_home_id])

  return (
    <>
      {careHomeData ? (
        <DefaultLayout>
          <Breadcrumb pageName="Care Home Profile" />

          <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="relative z-20 h-35 md:h-65">
              <img
                src={CoverOne}
                alt="care home cover"
                className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              />
            </div>
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="mt-4">
                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {careHomeData.data.name}
                </h3>
                <p className="font-medium">Care Home</p>

                {/* Display CareHomeActions component */}
                <CareHomeActions
                  isEnabled={isEnabled}
                  onEditClick={() =>
                    handleEditClick(!!care_home_id ? care_home_id : null)
                  }
                  onToggleClick={handleToggleClick}
                />

                <div className="mt-6.5">
                  <h4 className="mb-3.5 font-medium text-black dark:text-white">
                    STATS:
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <CardCareHomeFields
                      icon={faBuilding}
                      title="Care Home"
                      value={careHomeData.data.name}
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Status"
                      value={
                        careHomeData.data?.active === true ? 'true' : 'false'
                      }
                    />
                    <CardCareHomeFields
                      icon={faBuilding}
                      title="Owner Id"
                      value={careHomeData.data.owner_id}
                    />
                    <CardCareHomeFields
                      icon={faUsers}
                      title="Staff Size"
                      value={String(careHomeData.data.staff_size)}
                    />
                    <CardCareHomeFields
                      icon={faUser}
                      title="Created By"
                      value={careHomeData.data.created_by}
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Registration Date"
                      value={new Date(
                        careHomeData.data.registration_date,
                      ).toLocaleDateString()}
                    />
                    {careHomeData.data.contact_info?.phone_number && (
                      <CardCareHomeFields
                        icon={faPhone}
                        title="Phone Number"
                        value={careHomeData.data.contact_info.phone_number.join(
                          ', ',
                        )}
                      />
                    )}
                    {careHomeData.data.contact_info?.email_address && (
                      <CardCareHomeFields
                        icon={faEnvelope}
                        title="Email Address"
                        value={careHomeData.data.contact_info.email_address.join(
                          ', ',
                        )}
                      />
                    )}
                    {careHomeData.data.contact_info?.physical_address && (
                      <CardCareHomeFields
                        icon={faMapMarkerAlt}
                        title="Physical Address"
                        value={careHomeData.data.contact_info.physical_address.join(
                          ', ',
                        )}
                      />
                    )}
                  </div>
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

export default CareHomeProfile
