import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import useStore from '../store/store'
import { useParams } from 'react-router-dom'
import DefaultLayout from '../layout/DefaultLayout'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'

type FormData = {
  name: string
  location: [string | number | null, string | number | null]
  registration_date: string
  owner_id: string
  settings: {
    background_color: string
    text_color: string
    font: string
  }
  staff_size: string
  file: File | null
  contact_info: {
    phone_number: ['']
    email_address: ['']
    physical_address: ['']
  }
}

type FormErrors = {
  name?: string
  location?: [string | number | null, string | number | null]
  registration_date?: string
  owner_id?: string
  settings?: {
    background_color?: string
    text_color?: string
    font?: string
  }
  staff_size?: string
  file?: string
  contact_info: {
    phone_number: string[]
    email_address: string[]
    physical_address: string[]
  }
}

const UpdateCareHomeForm = () => {
  const { token } = useStore()
  const { care_home_id } = useParams<{ care_home_id: string }>()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: [0, 0],
    registration_date: '',
    owner_id: '',
    settings: {
      background_color: '',
      text_color: '',
      font: '',
    },
    staff_size: '',
    file: null,
    contact_info: {
      phone_number: [''],
      email_address: [''],
      physical_address: [''],
    },
  })

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    location: [0, 0],
    registration_date: '',
    owner_id: '',
    settings: {
      background_color: '',
      text_color: '',
      font: '',
    },
    staff_size: '',
    file: '',
    contact_info: {
      phone_number: [''],
      email_address: [''],
      physical_address: [''],
    },
  })
  useEffect(() => {
    const fetchCareHomeData = async () => {
      try {
        const response = await fetch(
          `http://localhost:9091/api/super/care-homes?care_home_id=${care_home_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        if (response.ok) {
          const data = await response.json()
          // Check if data exists before setting formData
          if (data) {
            console.log('data: ', data)
            setFormData({
              name: data.data.name || '',
              location: data.data.location || [0, 0],
              registration_date: data.data.registration_date || '',
              owner_id: data.data.owner_id || '',
              settings: {
                background_color: data.data.settings?.background_color || '',
                text_color: data.data.settings?.text_color || '',
                font: data.data.settings?.font || '',
              },
              staff_size: data.data.staff_size || '',
              file: null, // File cannot be pre-filled
              contact_info: {
                phone_number: data.data.contact_info.phone_number || [''],
                email_address: data.data.contact_info.email_address || [''],
                physical_address: data.data.contact_info.physical_address || [
                  '',
                ],
              },
            })
          } else {
            console.error('No data found for care home')
            // Optionally display an error message to the user
          }
        } else {
          console.error(response)
        }
      } catch (error) {
        console.error('Error fetching care home data:', error)
        // Optionally display an error message to the user
      }
    }

    fetchCareHomeData()
  }, [care_home_id])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target

    if (name === 'latitude' || name === 'longitude') {
      const newValue = parseFloat(value)
      if (!isNaN(newValue)) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          location:
            name === 'latitude'
              ? [newValue, prevFormData.location[1]]
              : [prevFormData.location[0], newValue],
        }))
        setErrors((prevErrors) => ({
          ...prevErrors,
          location: [null, null],
        }))
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          location: [
            name === 'latitude' ? 'Invalid latitude' : null,
            name === 'longitude' ? 'Invalid longitude' : null,
          ],
        }))
      }
    } else if (name.startsWith('settings.')) {
      const settingName = name.split('.')[1]
      setFormData((prevFormData) => ({
        ...prevFormData,
        settings: {
          ...prevFormData.settings,
          [settingName]: value,
        },
      }))
      setErrors((prevErrors) => ({
        ...prevErrors,
        settings: {
          ...prevErrors.settings,
          [settingName]: '',
        },
      }))
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }))
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }))
    }
  }

  const handleSettingsChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      settings: {
        ...prevFormData.settings,
        [name]: value,
      },
    }))
    setErrors((prevErrors) => ({
      ...prevErrors,
      settings: {
        ...prevErrors.settings,
        [name]: '',
      },
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prevFormData) => ({
      ...prevFormData,
      file,
    }))
  }

  const handleContactInfoChange = (
    e: { target: { value: any } },
    type: string | number,
    index: string | number,
  ) => {
    const { value } = e.target
    setFormData((prev: any) => {
      const updatedContactInfo = [...prev.contact_info[type]]
      updatedContactInfo[index] = value
      console.log({
        ...prev,
        contact_info: { ...prev.contact_info, [type]: updatedContactInfo },
      })
      return {
        ...prev,
        contact_info: { ...prev.contact_info, [type]: updatedContactInfo },
      }
    })
  }

  const handleAddField = (type: string | number) => {
    setFormData((prev: any) => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [type]: [...prev.contact_info[type], ''],
      },
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formDataToSend: any = new FormData()

    for (const [key, value] of Object.entries(formData)) {
      if (key === 'file') {
        formDataToSend.append('file', value as any) // Assuming file is always present
      } else if (key === 'location') {
        // Ensure location value is an array of numbers
        if (
          Array.isArray(value) &&
          value.length === 2 &&
          typeof value[0] === 'number' &&
          typeof value[1] === 'number'
        ) {
          const locationString = `[${value[0]},${value[1]}]`
          formDataToSend.append('location', locationString)
        } else {
          console.error('Invalid location format:', value)
        }
      } else if (key === 'settings') {
        const settings = value as {
          background_color?: string
          text_color?: string
          font?: string
        }
        // Append settings object as a single stringified JSON
        formDataToSend.append('settings', JSON.stringify(settings))
      } else if (key === 'contact_info') {
        const contact_info = value as {
          phone_number: string[]
          email_address: string[]
          physical_address: string[]
        }
        // Append settings object as a single stringified JSON
        formDataToSend.append('contact_info', JSON.stringify(contact_info))
      } else {
        formDataToSend.append(key, value as string)
      }
    }

    try {
      const response = await fetch(
        `http://localhost:9091/api/super/care-homes/${care_home_id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`, // Add authorization header with token
          },
          body: formDataToSend,
        },
      )
      console.log('Response:', response.ok)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <>
      {formData ? (
        <DefaultLayout>
          <Breadcrumb pageName="Edit Care Home Profile" />
          <div className="grid">
            <div className="flex flex-col gap-9">
              {/* <!-- Create Plan --> */}
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Create Care Home
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
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Location - Latitude */}
                    <div>
                      <label
                        htmlFor="latitude"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Latitude
                      </label>
                      <input
                        type="text"
                        name="latitude"
                        id="latitude"
                        autoComplete="off"
                        placeholder="Enter latitude"
                        className={`
      w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
      ${errors.location && errors.location[0] ? 'border-red-500' : ''}`}
                        value={
                          formData.location[0] === null
                            ? ''
                            : formData.location[0]
                        }
                        onChange={handleChange}
                      />
                      {errors.location && errors.location[0] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.location[0]}
                        </p>
                      )}
                    </div>

                    {/* Location - Longitude */}
                    <div>
                      <label
                        htmlFor="longitude"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Longitude
                      </label>
                      <input
                        type="text"
                        name="longitude"
                        id="longitude"
                        autoComplete="off"
                        placeholder="Enter longitude"
                        className={`
      w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
      ${errors.location && errors.location[1] ? 'border-red-500' : ''}`}
                        value={
                          formData.location[1] === null
                            ? ''
                            : formData.location[1]
                        }
                        onChange={handleChange}
                      />
                      {errors.location && errors.location[1] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.location[1]}
                        </p>
                      )}
                    </div>

                    {/* Registration Date */}
                    <div>
                      <label
                        htmlFor="registration_date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Registration Date
                      </label>
                      <input
                        type="date"
                        name="registration_date"
                        id="registration_date"
                        autoComplete="off"
                        required
                        className={`
                  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                  ${errors.registration_date ? 'border-red-500' : ''}`}
                        value={formData.registration_date}
                        onChange={handleChange}
                      />
                      {errors.registration_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.registration_date}
                        </p>
                      )}
                    </div>

                    {/* Owner ID */}
                    <div>
                      <label
                        htmlFor="owner_id"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Owner ID
                      </label>
                      <input
                        type="text"
                        name="owner_id"
                        id="owner_id"
                        autoComplete="off"
                        required
                        placeholder="Enter owner ID"
                        className={`
                  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                  ${errors.owner_id ? 'border-red-500' : ''}`}
                        value={formData.owner_id}
                        onChange={handleChange}
                      />
                      {errors.owner_id && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.owner_id}
                        </p>
                      )}
                    </div>

                    {/* Settings - Background Color */}
                    <div>
                      <label
                        htmlFor="background_color"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Background Color
                      </label>
                      <input
                        type="color"
                        name="background_color"
                        id="background_color"
                        autoComplete="off"
                        required
                        placeholder="Enter background color"
                        className={`
      mt-1 p-2 block w-full rounded-lg border-[1.5px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
      ${errors.settings?.background_color ? 'border-red-500' : ''}`}
                        value={formData.settings.background_color}
                        onChange={handleSettingsChange}
                      />
                      {errors.settings?.background_color && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.settings.background_color}
                        </p>
                      )}
                    </div>

                    {/* Settings - Text Color */}
                    <div>
                      <label
                        htmlFor="text_color"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Text Color
                      </label>
                      <input
                        type="color"
                        name="text_color"
                        id="text_color"
                        autoComplete="off"
                        placeholder="Enter text color"
                        className={`
      mt-1 p-2 block w-full rounded-lg border-[1.5px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
      ${errors.settings?.text_color ? 'border-red-500' : ''}`}
                        value={formData.settings.text_color}
                        onChange={handleSettingsChange}
                      />
                      {errors.settings?.text_color && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.settings.text_color}
                        </p>
                      )}
                    </div>

                    {/* Settings - Font */}
                    <div>
                      <label
                        htmlFor="font"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Font
                      </label>
                      <input
                        type="text"
                        name="font"
                        id="font"
                        autoComplete="off"
                        required
                        placeholder="Enter font"
                        className={`
      mt-1 p-2 block w-full rounded-lg border-[1.5px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
      ${errors.settings?.font ? 'border-red-500' : ''}`}
                        value={formData.settings.font}
                        onChange={handleSettingsChange}
                      />
                      {errors.settings?.font && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.settings.font}
                        </p>
                      )}
                    </div>

                    {/* Settings - Logo */}
                    <div>
                      <label
                        htmlFor="file"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Care Home Logo
                      </label>
                      <input
                        type="file"
                        name="file"
                        id="file"
                        required
                        className={`
            w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
            ${errors.file ? 'border-red-500' : ''}`}
                        onChange={handleFileChange}
                      />
                      {errors.file && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.file}
                        </p>
                      )}
                    </div>

                    {/* Staff Size */}
                    <div>
                      <label
                        htmlFor="staff_size"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Staff Size
                      </label>
                      <input
                        type="text"
                        name="staff_size"
                        id="staff_size"
                        autoComplete="off"
                        required
                        placeholder="Enter staff size"
                        className={`
                  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                  ${errors.staff_size ? 'border-red-500' : ''}`}
                        value={formData.staff_size}
                        onChange={handleChange}
                      />
                      {errors.staff_size && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.staff_size}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    {/* Contact Info - Phone Number */}
                    {formData.contact_info.phone_number.map((phone, index) => (
                      <div key={index}>
                        <label
                          htmlFor={`phone_number_${index}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name={`phone_number_${index}`}
                          id={`phone_number_${index}`}
                          autoComplete="off"
                          required
                          placeholder="Enter phone number"
                          className={`
                  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                  ${errors.contact_info.phone_number && errors.contact_info.phone_number[index] ? 'border-red-500' : ''}`}
                          value={phone}
                          onChange={(e) =>
                            handleContactInfoChange(e, 'phone_number', index)
                          }
                        />
                        {errors.contact_info.phone_number &&
                          errors.contact_info.phone_number[index] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.contact_info.phone_number[index]}
                            </p>
                          )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddField('phone_number')}
                    >
                      Add Phone Number
                    </button>

                    {/* Contact Info - email_address */}
                    {formData.contact_info.email_address.map(
                      (email_address, index) => (
                        <div key={index}>
                          <label
                            htmlFor={`email_address_${index}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            email_address
                          </label>
                          <input
                            type="email_address"
                            name={`email_address_${index}`}
                            id={`email_address_${index}`}
                            autoComplete="off"
                            required
                            placeholder="Enter email_address"
                            className={`
                  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                  ${errors.contact_info.email_address && errors.contact_info.email_address[index] ? 'border-red-500' : ''}`}
                            value={email_address}
                            onChange={(e) =>
                              handleContactInfoChange(e, 'email_address', index)
                            }
                          />
                          {errors.contact_info.email_address &&
                            errors.contact_info.email_address[index] && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.contact_info.email_address[index]}
                              </p>
                            )}
                        </div>
                      ),
                    )}
                    <button
                      type="button"
                      onClick={() => handleAddField('email_address')}
                    >
                      Add email_address
                    </button>

                    {/* Contact Info - physical_address */}
                    {formData.contact_info.physical_address.map(
                      (physical_address, index) => (
                        <div key={index}>
                          <label
                            htmlFor={`address_${index}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            physical_address
                          </label>
                          <input
                            type="text"
                            name={`address_${index}`}
                            id={`address_${index}`}
                            autoComplete="off"
                            required
                            placeholder="Enter physical_address"
                            className={`
                  w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                  ${errors.contact_info.physical_address && errors.contact_info.physical_address[index] ? 'border-red-500' : ''}`}
                            value={physical_address}
                            onChange={(e) =>
                              handleContactInfoChange(
                                e,
                                'physical_address',
                                index,
                              )
                            }
                          />
                          {errors.contact_info.physical_address &&
                            errors.contact_info.physical_address[index] && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.contact_info.physical_address[index]}
                              </p>
                            )}
                        </div>
                      ),
                    )}
                    <button
                      type="button"
                      onClick={() => handleAddField('physical_address')}
                    >
                      Add physical_address
                    </button>

                    <div className="px-4 py-3 text-right sm:px-6">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Care Home
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </DefaultLayout>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default UpdateCareHomeForm
