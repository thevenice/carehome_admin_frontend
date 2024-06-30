// src/components/CarePlanProfile.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStore from '../store/store'
import {
  faBed,
  faCalendarAlt,
  faEdit,
  faDollarSign,
  faList,
  faUsers,
  faUtensils,
  faClipboardList,
  faClock,
  faFile,
  faImage,
  faLink,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../utils/axios'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import CardCareHomeFields from '../components/CardCareHomeFields'
import DefaultLayout from '../layout/DefaultLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface CarePlanData {
  success: boolean
  data: {
    _id: string
    name: string
    description: string
    level: string
    monthlyPrice: number
    features: string[]
    services: Array<{
      name: string
      description: string
      frequency: string
    }>
    accommodationType: string
    mealPlanIncluded: boolean
    activitiesIncluded: boolean
    specializedCare: string[]
    staffingRatio: string
    minimumStayPeriod: number
    cancellationPolicy: string
    isActive: boolean
    featuredImageLink: string
    mediaLinks: string[]
    planPdfLink: string
    createdAt: string
    updatedAt: string
  }
}

const CarePlanProfile: React.FC = () => {
  const [carePlanData, setCarePlanData] = useState<CarePlanData | null>(null)
  const { plan_id } = useParams<{ plan_id: string }>()
  const { token } = useStore()
  const navigate = useNavigate()

  const fetchCarePlanData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/plans?id=${plan_id}`)
      if (response.data.success) {
        setCarePlanData(response.data)
      } else {
        console.error('Error:', response.data)
      }
    } catch (error) {
      console.error('Error fetching care plan data', error)
    }
  }

  useEffect(() => {
    fetchCarePlanData()
  }, [plan_id])

  const handleEditClick = () => {
    navigate(`/care-plans/update/${plan_id}`)
  }


  return (
    <>
      {carePlanData ? (
        <DefaultLayout>
          <Breadcrumb pageName="Care Plan Profile" />

          <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="mt-4">
                <div className="flex flex-col items-center">
                  <FontAwesomeIcon icon={faBed} className="text-6xl mb-4" />
                </div>

                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {carePlanData.data.name}
                </h3>
                <p className="font-medium text-gray-500 dark:text-gray-400">
                  {carePlanData.data.level} Level
                </p>
                <div className="flex justify-center mt-6 mb-2">
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-1 text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded px-3 py-1.5 hover:bg-blue-600"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit Care Plan
                  </button>
                </div>
                <div className="mt-6.5">
                  <h4 className="mb-3.5 font-medium text-black dark:text-white">
                    CARE PLAN INFO:
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <CardCareHomeFields
                      icon={faBed}
                      title="Care Plan ID"
                      value={carePlanData.data._id}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faDollarSign}
                      title="Monthly Price"
                      value={`$${carePlanData.data.monthlyPrice}`}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faBed}
                      title="Accommodation Type"
                      value={carePlanData.data.accommodationType}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faUtensils}
                      title="Meal Plan Included"
                      value={carePlanData.data.mealPlanIncluded ? 'Yes' : 'No'}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faClipboardList}
                      title="Activities Included"
                      value={carePlanData.data.activitiesIncluded ? 'Yes' : 'No'}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faUsers}
                      title="Staffing Ratio"
                      value={carePlanData.data.staffingRatio}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Minimum Stay Period"
                      value={`${carePlanData.data.minimumStayPeriod} months`}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faToggleOn}
                      title="Active Status"
                      value={carePlanData.data.isActive ? 'Active' : 'Inactive'}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faClock}
                      title="Created At"
                      value={new Date(carePlanData.data.createdAt).toLocaleString()}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faClock}
                      title="Updated At"
                      value={new Date(carePlanData.data.updatedAt).toLocaleString()}
                      RedirectComponent=""
                    />
                  </div>

                  <div className="mt-6.5">
                    <h4 className="mb-3.5 font-medium text-black dark:text-white">
                      FEATURES:
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {carePlanData.data.features.map((feature, index) => (
                        <CardCareHomeFields
                          key={index}
                          icon={faList}
                          title={`Feature ${index + 1}`}
                          value={feature}
                          RedirectComponent=""
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-6.5">
                    <h4 className="mb-3.5 font-medium text-black dark:text-white">
                      SERVICES:
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {carePlanData.data.services.map((service, index) => (
                        <CardCareHomeFields
                          key={index}
                          icon={faClipboardList}
                          title={service.name}
                          value={`${service.description} (${service.frequency})`}
                          RedirectComponent=""
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-6.5">
                    <h4 className="mb-3.5 font-medium text-black dark:text-white">
                      ADDITIONAL INFO:
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <CardCareHomeFields
                        icon={faList}
                        title="Description"
                        value={carePlanData.data.description}
                        RedirectComponent=""
                      />
                      <CardCareHomeFields
                        icon={faList}
                        title="Specialized Care"
                        value={carePlanData.data.specializedCare.join(', ')}
                        RedirectComponent=""
                      />
                      <CardCareHomeFields
                        icon={faList}
                        title="Cancellation Policy"
                        value={carePlanData.data.cancellationPolicy}
                        RedirectComponent=""
                      />
                      <CardCareHomeFields
                        icon={faImage}
                        title="Featured Image"
                        value={<a href={carePlanData.data.featuredImageLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Image</a>}
                        RedirectComponent=""
                      />
                      <CardCareHomeFields
                        icon={faFile}
                        title="Plan PDF"
                        value={<a href={carePlanData.data.planPdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View PDF</a>}
                        RedirectComponent=""
                      />
                    </div>
                  </div>

                  {carePlanData.data.mediaLinks.length > 0 && (
                    <div className="mt-6.5">
                      <h4 className="mb-3.5 font-medium text-black dark:text-white">
                        MEDIA LINKS:
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {carePlanData.data.mediaLinks.map((link, index) => (
                          <CardCareHomeFields
                            key={index}
                            icon={faLink}
                            title={`Media Link ${index + 1}`}
                            value={<a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Media</a>}
                            RedirectComponent=""
                          />
                        ))}
                      </div>
                    </div>
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

export default CarePlanProfile