// src/components/UserProfile.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import useStore from '../store/store';
import { faUser, faCalendarAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../utils/axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CardCareHomeFields from '../components/CardCareHomeFields';
import DefaultLayout from '../layout/DefaultLayout';
import UserActions from '../components/UsersActions';

interface UserData {
  success: boolean;
  data: {
    _id: string;
    email: string;
    active: boolean;
    role: string;
    email_verification: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

const UserProfile: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(true)
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user_id } = useParams<{ user_id: string }>();

  const { token } = useStore()
  const navigate = useNavigate()

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/user?id=${user_id}`);
      if (response.data.success) {
        setUserData(response.data);
      } else {
        console.error('Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  const handleEditClick = (user_id: string | null) => {
    if (user_id === null) {
      console.log(null)
    }
    navigate(`/users/update/${user_id}`)
  }

  const handleToggleClick = async () => {
    console.log('Toggle button clicked')
    setIsActive((prev) => !prev)
    try {
      const response = await fetch(
        `http://localhost:9091/api/admin/user/${user_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ active: !isActive }),
        }
      )

      fetchUserData()
      if (!response.ok) {
        console.error('Failed to update user status')
      }
    } catch (error) {
      console.error('Error updating user status', error)
    }
  }
  useEffect(() => {
    if (user_id) {
      fetchUserData();
    }
  }, [user_id]);

  return (
    <>
      {userData ? (
        <DefaultLayout>
          <Breadcrumb pageName="Users Profile" />
          <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="mt-4">
                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {userData.data.email}
                </h3>
                <p className="font-medium">Users Profile</p>
                UserActions
                {/* Display CareHomeActions component */}
                <UserActions
                  isEnabled={isActive}
                  onEditClick={() =>
                    handleEditClick(!!user_id ? user_id : null)
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
                      value={new Date(userData.data.createdAt).toLocaleDateString()}
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Updated At"
                      value={new Date(userData.data.updatedAt).toLocaleDateString()}
                    />
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
  );
};

export default UserProfile;