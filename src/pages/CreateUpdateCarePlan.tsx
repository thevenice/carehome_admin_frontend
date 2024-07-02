import React, { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../utils/axios'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'

interface CarePlan {
  name: string
  description: string
  level: 'Basic' | 'Standard' | 'Premium' | 'Custom'
  monthlyPrice: number
  features: string[]
  services: {
    name: string
    description: string
    frequency: string
  }[]
  accommodationType: 'Shared Room' | 'Private Room' | 'Suite'
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
}

const CarePlanUpdateForm: React.FC = () => {
  const { planId } = useParams<{ planId: string }>()
  const [formData, setFormData] = useState<CarePlan>({
    name: '',
    description: '',
    level: 'Basic',
    monthlyPrice: 0,
    features: [],
    services: [],
    accommodationType: 'Shared Room',
    mealPlanIncluded: false,
    activitiesIncluded: false,
    specializedCare: [],
    staffingRatio: '',
    minimumStayPeriod: 1,
    cancellationPolicy: '',
    isActive: true,
    featuredImageLink: '',
    mediaLinks: [],
    planPdfLink: '',
  })
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [mediaImages, setMediaImages] = useState<File[]>([])
  const [planPdf, setPlanPdf] = useState<File | null>(null)

  useEffect(() => {
    fetchCarePlanData()
  }, [])

  const fetchCarePlanData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/plans?id=${planId}`)
      if (response.data.success) {
        setFormData(response.data.data)
      } else {
        console.error('Error:', response.data)
      }
    } catch (error) {
      console.error('Error fetching care plan data', error)
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files) {
      if (name === 'featuredImage') {
        setFeaturedImage(files[0])
      } else if (name === 'mediaImages') {
        setMediaImages(Array.from(files))
      } else if (name === 'planPdf') {
        setPlanPdf(files[0])
      }
    }
  }

  const handleArrayChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof CarePlan,
    index: number,
  ) => {
    const { value } = e.target
    setFormData((prevState) => {
      const updatedArray = [...(prevState[fieldName] as string[])]
      updatedArray[index] = value
      return { ...prevState, [fieldName]: updatedArray }
    })
  }

  const handleAddArrayField = (fieldName: keyof CarePlan) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: [...(prevState[fieldName] as string[]), ''],
    }))
  }

  const handleRemoveArrayField = (
    fieldName: keyof CarePlan,
    index: number,
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: (prevState[fieldName] as string[]).filter((_, i) => i !== index),
    }))
  }

  const handleServiceChange = (index: number, field: string, value: string) => {
    setFormData((prevState) => {
      const updatedServices = [...prevState.services]
      updatedServices[index] = { ...updatedServices[index], [field]: value }
      return { ...prevState, services: updatedServices }
    })
  }

  const handleAddService = () => {
    setFormData((prevState) => ({
      ...prevState,
      services: [...prevState.services, { name: '', description: '', frequency: '' }],
    }))
  }

  const handleRemoveService = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      services: prevState.services.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      // Create a copy of the formData
      const formDataToSend:any = { ...formData }
  
      // Remove _id from each service
      formDataToSend.services = formDataToSend.services.map(({ _id, ...rest }) => rest)
  
      // Remove fields not in the schema
      delete formDataToSend._id
      delete formDataToSend.featuredImageLink
      delete formDataToSend.mediaLinks
      delete formDataToSend.planPdfLink
      delete formDataToSend.createdAt
      delete formDataToSend.updatedAt
      delete formDataToSend.__v
  
      const formDataObj = new FormData()
      formDataObj.append('data', JSON.stringify(formDataToSend))
      
      if (featuredImage) {
        formDataObj.append('featuredImage', featuredImage)
      }
      
      mediaImages.forEach((image) => {
        formDataObj.append('mediaImages', image)
      })
      
      if (planPdf) {
        formDataObj.append('planPdf', planPdf)
      }
  
      const response = await axiosInstance.put(`/admin/plans/${planId}`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('Care plan updated successfully')
      console.log('Care plan updated:', response.data)
    } catch (error) {
      console.error('Error updating care plan:', error)
      alert('Failed to update care plan')
    }
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Update Care Plan" />
      <div className="grid">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Update Care Plan
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Level */}
                <div className="mb-4">
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                {/* Monthly Price */}
                <div className="mb-4">
                  <label htmlFor="monthlyPrice" className="block text-sm font-medium text-gray-700">
                    Monthly Price
                  </label>
                  <input
                    type="number"
                    id="monthlyPrice"
                    name="monthlyPrice"
                    value={formData.monthlyPrice}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Features */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Features
                  </label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Feature #${index + 1}`}
                        value={feature}
                        onChange={(e) => handleArrayChange(e, 'features', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveArrayField('features', index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleAddArrayField('features')}
                  >
                    Add Feature
                  </button>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Services
                  </label>
                  {formData.services.map((service, index) => (
                    <div key={index} className="mb-4 border p-4 rounded">
                      <input
                        type="text"
                        placeholder="Service Name"
                        value={service.name}
                        onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                        className="w-full mb-2 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Service Description"
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        className="w-full mb-2 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Service Frequency"
                        value={service.frequency}
                        onChange={(e) => handleServiceChange(index, 'frequency', e.target.value)}
                        className="w-full mb-2 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveService(index)}
                      >
                        Remove Service
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={handleAddService}
                  >
                    Add Service
                  </button>
                </div>

                {/* Accommodation Type */}
                <div className="mb-4">
                  <label htmlFor="accommodationType" className="block text-sm font-medium text-gray-700">
                    Accommodation Type
                  </label>
                  <select
                    id="accommodationType"
                    name="accommodationType"
                    value={formData.accommodationType}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="Shared Room">Shared Room</option>
                    <option value="Private Room">Private Room</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>

                {/* Meal Plan Included */}
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="mealPlanIncluded"
                      checked={formData.mealPlanIncluded}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-primary"
                    />
                    <span className="ml-2 text-sm">Meal Plan Included</span>
                  </label>
                </div>

                {/* Activities Included */}
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="activitiesIncluded"
                      checked={formData.activitiesIncluded}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-primary"
                    />
                    <span className="ml-2 text-sm">Activities Included</span>
                  </label>
                </div>

                {/* Specialized Care */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Specialized Care
                  </label>
                  {formData.specializedCare.map((care, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Specialized Care #${index + 1}`}
                        value={care}
                        onChange={(e) => handleArrayChange(e, 'specializedCare', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-700 focus:outline-none"
                          onClick={() => handleRemoveArrayField('specializedCare', index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                      onClick={() => handleAddArrayField('specializedCare')}
                    >
                      Add Specialized Care
                    </button>
                  </div>
  
                  {/* Staffing Ratio */}
                  <div className="mb-4">
                    <label htmlFor="staffingRatio" className="block text-sm font-medium text-gray-700">
                      Staffing Ratio
                    </label>
                    <input
                      type="text"
                      id="staffingRatio"
                      name="staffingRatio"
                      value={formData.staffingRatio}
                      onChange={handleChange}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
  
                  {/* Minimum Stay Period */}
                  <div className="mb-4">
                    <label htmlFor="minimumStayPeriod" className="block text-sm font-medium text-gray-700">
                      Minimum Stay Period (days)
                    </label>
                    <input
                      type="number"
                      id="minimumStayPeriod"
                      name="minimumStayPeriod"
                      value={formData.minimumStayPeriod}
                      onChange={handleChange}
                      min={1}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
  
                  {/* Cancellation Policy */}
                  <div className="mb-4">
                    <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700">
                      Cancellation Policy
                    </label>
                    <textarea
                      id="cancellationPolicy"
                      name="cancellationPolicy"
                      value={formData.cancellationPolicy}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
  
                  {/* Is Active */}
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-primary"
                      />
                      <span className="ml-2 text-sm">Is Active</span>
                    </label>
                  </div>
  

                {/* Featured Image */}
                <div className="mb-4">
                  <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
                    Featured Image
                  </label>
                  <input
                    type="file"
                    id="featuredImage"
                    name="featuredImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formData.featuredImageLink && (
                    <img src={formData.featuredImageLink} alt="Featured" className="mt-2 h-20 w-20 object-cover" />
                  )}
                </div>

                {/* Media Images */}
                <div className="mb-4">
                  <label htmlFor="mediaImages" className="block text-sm font-medium text-gray-700">
                    Media Images
                  </label>
                  <input
                    type="file"
                    id="mediaImages"
                    name="mediaImages"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.mediaLinks.map((link, index) => (
                      <img key={index} src={link} alt={`Media ${index + 1}`} className="h-20 w-20 object-cover" />
                    ))}
                  </div>
                </div>

                {/* Plan PDF */}
                <div className="mb-4">
                  <label htmlFor="planPdf" className="block text-sm font-medium text-gray-700">
                    Plan PDF
                  </label>
                  <input
                    type="file"
                    id="planPdf"
                    name="planPdf"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formData.planPdfLink && (
                    <a href={formData.planPdfLink} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-600 hover:underline">
                      View Current PDF
                    </a>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary py-3 px-5 text-white transition hover:bg-opacity-90"
                >
                  Update Care Plan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default CarePlanUpdateForm