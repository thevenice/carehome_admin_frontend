import React, { useEffect, useState } from 'react'
import useStore from '../store/store'
import CoverOne from '../images/cover/cover-01.png'
import LogoIcon from '../images/logo/logo.svg'
// import userSix from '../../images/user/user-06.png'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons'
import {
  faGoogle,
  faXing,
  faFacebook,
  faInstagram,
  faLinkedin,
  faTelegram,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'

import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import axiosInstance from '../utils/axios'

const CompanyInfo: React.FC = () => {
  const { token, userId } = useStore()
  const [companyData, setCompanyData] = useState<any>(null)

  const navigate = useNavigate()
  const handleEdit = () => {
    navigate(`/update-company-info`)
  }
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/company-info`)
        if (response.data.success) {
          setCompanyData(response.data.data)
          console.log(companyData)
        } else {
          console.error('Failed to fetch company info')
        }
      } catch (error) {
        console.error('Error fetching company info:', error)
      }
    }

    if (token && userId) {
      fetchCompanyData()
    }
  }, [token, userId])

  return (
    <>
      {companyData ? (
        <DefaultLayout>
          <Breadcrumb pageName="Company Info" />

          <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

            {/*  */}
            <div className="container mx-auto p-3">
              {/* CompanyInfo Header */}
              <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md">
                <img
                  src={companyData.logo}
                  alt={`${companyData.name} main`}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h1 className="text-3xl font-bold mb-2">{companyData.name}</h1>
                <p className="text-center text-gray-600">
                  {companyData.aboutUs}
                </p>

                {/* Contact Info */}
                <div className="mt-4 flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-gray-500 mr-2"
                    />
                    <span>{companyData.contactInfo.phoneNumber}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-gray-500 mr-2"
                    />
                    <span>{companyData.contactInfo.emailAddress}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-gray-500 mr-2"
                    />
                    <span>{companyData.location.address}</span>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="flex mt-4 space-x-4">
                  {companyData.facebook && (
                    <a
                      href={companyData.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faFacebook}
                        className="text-2xl text-blue-600 hover:text-blue-800"
                      />
                    </a>
                  )}
                  {companyData.instagram && (
                    <a
                      href={companyData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faInstagram}
                        className="text-2xl text-purple-600 hover:text-purple-800"
                      />
                    </a>
                  )}
                  {companyData.linkedin && (
                    <a
                      href={companyData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faLinkedin}
                        className="text-2xl text-blue-500 hover:text-blue-700"
                      />
                    </a>
                  )}
                  {companyData.telegram && (
                    <a
                      href={companyData.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faTelegram}
                        className="text-2xl text-blue-400 hover:text-blue-600"
                      />
                    </a>
                  )}
                  {companyData.whatsapp && (
                    <a
                      href={`https://wa.me/${companyData.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faWhatsapp}
                        className="text-2xl text-green-400 hover:text-green-600"
                      />
                    </a>
                  )}
                  {companyData.google_map && (
                    <a
                      href={companyData.google_map}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faGoogle}
                        className="text-2xl text-red-600 hover:text-red-800"
                      />
                    </a>
                  )}
                  {companyData.xCom && (
                    <a
                      href={companyData.xCom}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faXing}
                        className="text-2xl text-gray-600 hover:text-gray-800"
                      />
                    </a>
                  )}
                </div>
              </div>

              {/* Services */}
              <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Services Offered</h2>
                <ul className="list-disc list-inside">
                  {companyData.servicesOffered.map(
                    (service: any, index: any) => (
                      <li key={index} className="mb-2">
                        {service}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              {/* Facilities */}
              <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">
                  Facilities & Amenities
                </h2>
                <ul className="list-disc list-inside">
                  {companyData.facilitiesAmenities.map(
                    (facilitieAmenitie: any, index: any) => (
                      <li key={index} className="mb-2">
                        {facilitieAmenitie}
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div>
                {/* Edit Button */}
                <button
                  onClick={() => handleEdit()}
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Company Details
                </button>
              </div>
            </div>

            {/*  */}
          </div>
        </DefaultLayout>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default CompanyInfo
