import React, { useEffect, useState } from 'react'
import useStore from '../store/store'
import CoverOne from '../images/cover/cover-01.png'
import userSix from '../images/user/user-06.png'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import axiosInstance from '../utils/axios'

const Profile: React.FC = () => {
  const { token, userId } = useStore()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
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
      fetchUserData()
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
        <img src={userData.images[0]} alt={`${userData.name} main`} className="w-32 h-32 rounded-full object-cover mb-4" />
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
          <div className="flex items-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-2" />
            <span>{userData.location.address}</span>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {userData.images.map((image:any, index:any) => (
          <img key={index} src={image} alt={`${name} ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
        ))}
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
        <p>{userData.facilitiesAmenities}</p>
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
