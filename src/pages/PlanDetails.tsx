import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../store/store'
import {
  faMoneyBillAlt,
  faClock,
  faListUl,
  faCalendarAlt,
  faUser,
  faUsers,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons'
import DefaultLayout from '../layout/DefaultLayout'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import CardCareHomeFields from '../components/CardCareHomeFields'

interface PlanData {
  _id: string
  name: string
  description: string
  price: number
  duration: number
  features: string[]
  created_by: string
  createdAt: string
  updatedAt: string
  __v: number
}

const PlanDetails: React.FC = () => {
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const { token } = useStore()
  const navigate = useNavigate()
  const { plan_id } = useParams<{ plan_id: string }>()

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await fetch(
          `http://localhost:9091/api/super/plans?plan_id=${plan_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.ok) {
          const data = await response.json()
          setPlanData(data.data)
        } else {
          console.log(response)
        }
      } catch (error) {
        console.error('Error fetching plan data ', error)
      }
    }

    fetchPlanData()
  }, [plan_id, token])

  if (!planData) {
    return <div>Loading...</div>
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Care Home Profile" />
      <div className="mt-6.5">
        <h4 className="mb-3.5 font-medium text-black dark:text-white">
          STATS:
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CardCareHomeFields
            icon={faBuilding}
            title="Plan Name"
            value={`${planData.name}`}
          />
          <CardCareHomeFields
            icon={faBuilding}
            title="Price"
            value={`$${planData.price}`}
          />
          <CardCareHomeFields
            icon={faCalendarAlt}
            title="Description"
            value={`${planData.description}`}
          />
          <CardCareHomeFields
            icon={faBuilding}
            title="Duration"
            value={`${planData.duration} months`}
          />
          <CardCareHomeFields
            icon={faUsers}
            title="Features"
            value={
              <div className="flex items-center">
                {/* <FontAwesomeIcon icon={faListUl} className="text-blue-500" /> */}
                <ul className="ml-2">
                  {planData.features.map((feature, index) => (
                    <li key={index}>
                      {index}. {feature}
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
        </div>
      </div>
    </DefaultLayout>
  )
}

export default PlanDetails
