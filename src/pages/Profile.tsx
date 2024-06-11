import React, { useEffect, useState } from 'react'
import useStore from '../store/store'
import CoverOne from '../images/cover/cover-01.png'
import userSix from '../images/user/user-06.png'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faXing, faFacebook, faInstagram, faLinkedin, faTelegram, faWhatsapp  } from '@fortawesome/free-brands-svg-icons';


import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import axiosInstance from '../utils/axios'

const Profile: React.FC = () => {
  const { token, userId } = useStore()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/company-info`);
        if (response.data.success) {
          setUserData(response.data.data);
          console.log(userData)
        } else {
          console.error('Failed to fetch company info');
        }
      } catch (error) {
        console.error('Error fetching company info:', error);
      }
    }

    if (token && userId) {
      fetchCompanyData()
    }
  }, [token, userId])

  return (
    <>
      {userData ? (
        <DefaultLayout>
          <Breadcrumb pageName="Profile" />

          <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="relative z-20 h-35 md:h-65">
              <img
                src={CoverOne}
                alt="profile cover"
                className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              />
            </div>
            {/*  */}
            <div className="container mx-auto p-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md">
        <img src={userData.logo} alt={`${userData.name} main`} className="w-32 h-32 rounded-full object-cover mb-4" />
        <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
        <p className="text-center text-gray-600">{userData.aboutUs}</p>

        {/* Contact Info */}
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faPhone} className="text-gray-500 mr-2" />
            <span>{userData.contactInfo.phoneNumber}</span>
          </div>
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-2" />
            <span>{userData.contactInfo.emailAddress}</span>
          </div>
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-2" />
            <span>{userData.location.address}</span>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex mt-4 space-x-4">
          {userData.facebook && (
            <a href={userData.facebook} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} className="text-2xl text-blue-600 hover:text-blue-800" />
            </a>
          )}
          {userData.instagram && (
            <a href={userData.instagram} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} className="text-2xl text-purple-600 hover:text-purple-800" />
            </a>
          )}
          {userData.linkedin && (
            <a href={userData.linkedin} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} className="text-2xl text-blue-500 hover:text-blue-700" />
            </a>
          )}
          {userData.telegram && (
            <a href={userData.telegram} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTelegram} className="text-2xl text-blue-400 hover:text-blue-600" />
            </a>
          )}
          {userData.whatsapp && (
            <a href={`https://wa.me/${userData.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faWhatsapp} className="text-2xl text-green-400 hover:text-green-600" />
            </a>
          )}
          {userData.google_map && (
            <a href={userData.google_map} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGoogle} className="text-2xl text-red-600 hover:text-red-800" />
            </a>
          )}
          {userData.xCom && (
            <a href={userData.xCom} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faXing} className="text-2xl text-gray-600 hover:text-gray-800" />
            </a>
          )}
        </div>
      </div>

      {/* Services */}
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Services Offered</h2>
        <ul className="list-disc list-inside">
          {userData.servicesOffered.map((service:any, index:any) => (
            <li key={index} className="mb-2">{service}</li>
          ))}
        </ul>
      </div>

      {/* Facilities */}
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Facilities & Amenities</h2>
        <ul className="list-disc list-inside">
          {userData.facilitiesAmenities.map((facilitieAmenitie:any, index:any) => (
            <li key={index} className="mb-2">{facilitieAmenitie}</li>
          ))}
        </ul>
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

export default Profile
