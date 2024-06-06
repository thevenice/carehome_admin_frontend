import { useState, ChangeEvent, FormEvent } from 'react'
import Joi from 'joi'
import useStore from '../../store/store'

// Define types for form data and errors
type FormData = {
  name: string
  description: string
  price: string
  duration: string
  features: string
}

type FormErrors = {
  [key in keyof FormData]?: string
}

const PlanForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    duration: '',
    features: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const { token } = useStore() // Get the token from Zustand state

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:9091/api/super/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add authorization header with token
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      console.log(data) // Handle response data as needed

      // Clear form data upon successful submission
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        features: '',
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    if (name === 'features') {
      const featuresArray = value.split(',').map((feature) => feature.trim())
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [name]: featuresArray,
      }))
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }))
    }
    // Clear the error message when the user starts typing again
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))
  }

  return (
    <div className="grid">
      <div className="flex flex-col gap-9">
        {/* <!-- Create Plan --> */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Create Plan
            </h3>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="off"
                  required
                  placeholder="Enter name"
                  className={`
        w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
        ${errors.name ? 'border-red-500' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  placeholder="Enter description"
                  className={`
        w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
        ${errors.description ? 'border-red-500' : ''}`}
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  autoComplete="off"
                  required
                  placeholder="Enter price"
                  className={`
        w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
        ${errors.price ? 'border-red-500' : ''}`}
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  id="duration"
                  autoComplete="off"
                  required
                  placeholder="Enter duration"
                  className={`
        w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
        ${errors.duration ? 'border-red-500' : ''}`}
                  value={formData.duration}
                  onChange={handleChange}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>

              {/* Features */}
              <div>
                <label
                  htmlFor="features"
                  className="block text-sm font-medium text-gray-700"
                >
                  Features
                </label>
                <textarea
                  name="features"
                  id="features"
                  rows={3}
                  placeholder="Enter features"
                  className={`
        w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
        ${errors.features ? 'border-red-500' : ''}`}
                  value={formData.features}
                  onChange={handleChange}
                ></textarea>
                {errors.features && (
                  <p className="text-red-500 text-sm mt-1">{errors.features}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanForm
