import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import CoverOne from '../images/cover/cover-01.png'
import axiosInstance from '../utils/axios'

const UpdateUserProfileForm = () => {
  const { userId } = useParams<{ userId: string }>()

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    profile_picture_image: null as File | null,
    active: false,
    fcm_token: '',
    otp: 0,
    role: 'INTERVIEW_CANDIDATE',
    email_verification: 'PENDING',
  })

  const [loading, setLoading] = useState(true) // State to track loading state
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [previewProfilePicture, setPreviewProfilePicture] = useState<
    string | null
  >(null)

  useEffect(() => {
    // Fetch user details and set initial form data
    axiosInstance
      .get(`/admin/user?id=${userId}`)
      .then((response) => {
        setFormData(response.data.data) // Set form data with response data
        setLoading(false) // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error('Error fetching user details:', error)
        setLoading(false) // Ensure loading is set to false even on error
      })
  }, [userId])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        profile_picture_image: file,
      }))

      // Create object URL for previewing the image
      const objectUrl = URL.createObjectURL(file)
      setPreviewProfilePicture(objectUrl) // Save URL to state for preview
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data_to_send = new FormData()
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          const value = formData[key as keyof typeof formData]
          const allowed_keys = [
            'email',
            'name',
            'password',
            'active',
            'fcm_token',
            'otp',
            'role',
            'email_verification',
            'profile_picture_image',
          ]
          if (key === 'profile_picture_image' && formData.profile_picture_image) {
            data_to_send.append(key, formData.profile_picture_image)
          }
          if (
            key !== 'profile_picture_image' &&
            value !== null &&
            allowed_keys.includes(key)
          ) {
            data_to_send.append(key, value)
          }
        }
      }

      const response = await axiosInstance.put(
        `/admin/user/${userId}`,
        data_to_send,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      alert('User updated successfully')
      console.log('User updated:', response.data)
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user')
    }
  }

  if (loading) {
    return <div>Loading...</div> // Display a loading indicator while data is being fetched
  }
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Update User Profile" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              Update Users Profile
            </h3>
            <form onSubmit={handleSubmit} className="mt-6.5 space-y-6">
              <div className="space-y-2">
                {/* Profile Picture Upload */}
                <div className="mb-4">
                  <label
                    htmlFor="profile_picture_image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Profile Picture
                  </label>
                  <div className="mt-2 flex items-center">
                    <input
                      type="file"
                      id="profile_picture_image"
                      name="profile_picture_image"
                      accept="image/*"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleProfilePictureChange}
                    />
                  </div>
                  {previewProfilePicture && (
                    <img
                      src={previewProfilePicture}
                      alt="Profile Picture Preview"
                      className="mt-2 rounded-md shadow-sm max-w-xs"
                    />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name}</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`
                      w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                      ${errors.email ? 'border-red-500' : ''}
                    `}
                  />
                  {errors.email && (
                    <span className="text-red-500">{errors.email}</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="fcm_token"
                    className="block text-sm font-medium text-gray-700"
                  >
                    FCM Token:
                  </label>
                  <input
                    type="text"
                    name="fcm_token"
                    value={formData.fcm_token}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.fcm_token && (
                    <span className="text-red-500">{errors.fcm_token}</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    OTP:
                  </label>
                  <input
                    type="number"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.otp && (
                    <span className="text-red-500">{errors.otp}</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role:
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="INTERVIEW_CANDIDATE">
                      Interview Candidate
                    </option>
                    <option value="ADMINISTRATOR">Administrator</option>
                    <option value="CAREGIVER">Caregiver</option>
                    <option value="RESIDENT">Resident</option>
                    <option value="HEALTHCARE_PROFESSIONAL">
                      Healthcare Professional
                    </option>
                  </select>
                  {errors.role && (
                    <span className="text-red-500">{errors.role}</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email_verification"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Verification:
                  </label>
                  <select
                    name="email_verification"
                    value={formData.email_verification}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="COMPLETED">Completed</option>
                    <option value="NOTCOMPLETED">Not Completed</option>
                    <option value="PENDING">Pending</option>
                  </select>
                  {errors.email_verification && (
                    <span className="text-red-500">
                      {errors.email_verification}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default UpdateUserProfileForm
