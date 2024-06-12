import { useState, ChangeEvent, FormEvent } from 'react'
import useStore from '../../store/store'
import axiosInstance from '../../utils/axios'

const CreateUserForm = () => {
  type FormData = {
    profile_picture?: File | null;
    email: string
    password: string
    active: boolean
    fcm_token: string
    role: string
    email_verification: string
  }

  type FormErrors = {
    profile_picture?: File | null;
    email?: string
    password?: string
    fcm_token?: string
    role?: string
    email_verification?: string
  }

  const [formData, setFormData] = useState<FormData>({
    profile_picture: null,
    email: '',
    password: '',
    active: true,
    fcm_token: '',
    role: '',
    email_verification: 'PENDING',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [previewProfilePicture, setPreviewProfilePicture] = useState<any>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // const { token } = useStore() // Get the token from Zustand state

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Perform validation
    let validationErrors: FormErrors = {}

    if (!formData.email) {
      validationErrors.email = 'Email is required'
    }
    if (!formData.password) {
      validationErrors.password = 'Password is required'
    }

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      const data_to_send = new FormData();
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          data_to_send.append(key, formData[key as keyof FormData]);
        }
      }
      const response = await axiosInstance.post(`/admin/user`, data_to_send, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('User created successfully');
      console.log('User created:', response.data);

      // Clear form data upon successful submission
      setFormData({
        profile_picture: null,
        email: '',
        password: '',
        active: true,
        fcm_token: '',
        role: '',
        email_verification: 'PENDING',
      })
      setErrors({})
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create user');
    }
  }

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        profile_picture: file,
      }));

      // Create object URL for previewing the image
      const objectUrl = URL.createObjectURL(file);
      setPreviewProfilePicture(objectUrl); // Save URL to state for preview
    }
  };

  return (
    <div className="grid">
      <div className="flex flex-col gap-9">
        {/* Create User */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Create User</h3>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo Upload */}
              <div className="mb-4">
                <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700">
                  Upload Profile Picture
                </label>
                <div className="mt-2 flex items-center">
                  <input
                    type="file"
                    id="profile_picture"
                    name="profile_picture"
                    accept="image/*"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleProfilePictureChange}
                  />
                </div>
                {previewProfilePicture && (
                  <img src={previewProfilePicture} alt="Profile Picture Preview" className="mt-2 rounded-md shadow-sm max-w-xs" />
                )}
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="off"
                  required
                  placeholder="Enter email"
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="off"
                  required
                  placeholder="Enter password"
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.password ? 'border-red-500' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Active */}
              <div>
                <label htmlFor="active" className="block text-sm font-medium text-gray-700">
                  Active
                </label>
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* FCM Token */}
              <div>
                <label htmlFor="fcm_token" className="block text-sm font-medium text-gray-700">
                  FCM Token
                </label>
                <input
                  type="text"
                  name="fcm_token"
                  id="fcm_token"
                  autoComplete="off"
                  placeholder="Enter FCM token"
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.fcm_token ? 'border-red-500' : ''}`}
                  value={formData.fcm_token}
                  onChange={handleChange}
                />
                {errors.fcm_token && <p className="text-red-500 text-sm mt-1">{errors.fcm_token}</p>}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="INTERVIEW_CANDIDATE">Interview Candidate</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                    <option value="CAREGIVER">Caregiver</option>
                    <option value="RESIDENT">Resident</option>
                    <option value="HEALTHCARE_PROFESSIONAL">Healthcare Professional</option>
                  </select>
                  {errors.role && <span className="text-red-500">{errors.role}</span>}
                </div>

              {/* Email Verification */}
              <div>
                <label htmlFor="email_verification" className="block text-sm font-medium text-gray-700">
                  Email Verification
                </label>
                <select
                  name="email_verification"
                  id="email_verification"
                  required
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.email_verification ? 'border-red-500' : ''}`}
                  value={formData.email_verification}
                  onChange={handleChange}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
                {errors.email_verification && <p className="text-red-500 text-sm mt-1">{errors.email_verification}</p>}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create User
                </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateUserForm
