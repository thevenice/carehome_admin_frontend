import { useState, ChangeEvent, FormEvent } from 'react'
import useStore from '../../store/store'
import axiosInstance from '../../utils/axios'

const CreateUserForm = () => {
  type FormData = {
    email: string
    password: string
    active: boolean
    fcm_token: string
    role: string
    email_verification: string
  }

  type FormErrors = {
    email?: string
    password?: string
    fcm_token?: string
    role?: string
    email_verification?: string
  }

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    active: true,
    fcm_token: '',
    role: '',
    email_verification: 'PENDING',
  })

  const [errors, setErrors] = useState<FormErrors>({})

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

  const { token } = useStore() // Get the token from Zustand state

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
    //   const response = await fetch('http://localhost:9091/api/admin/user', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(formData),
    //   })
    try{
        const data_to_send = formData
        const response = await axiosInstance.post(`/admin/user`, data_to_send);
        alert('User created successfully');
        console.log('User created:', response.data);
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to create user');
    }


      // Clear form data upon successful submission
      setFormData({
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
    }
  }

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

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white hover:bg-opacity-90"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateUserForm
