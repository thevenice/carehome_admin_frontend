import React, { useState, useEffect, ChangeEvent } from 'react'
import axiosInstance from '../utils/axios'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import { useParams } from 'react-router-dom'

interface Availability {
  days: string[]
  timeSlots: string[]
}

interface EmergencyContact {
  name: string
  relationship: string
  phoneNumber: string
}

interface Reference {
  name: string
  company: string
  position: string
  contactInfo: string
}

interface InterviewCandidateInfo {
  contactNumber: string
  address: string
  desiredPosition: string
  yearsOfExperience: number
  qualifications: string[]
  skills: string[]
  availability: Availability
  preferredWorkSchedule: string[]
  locationPreferences: string[]
  emergencyContact: EmergencyContact
  languagesSpoken: string[]
  certifications: string[]
  resumeUrl: string
  currentEmploymentStatus: string
  expectedSalary: number
  noticePeriod: number
  interviewAvailability: string[]
  references: Reference[]
}

const InterviewCandidateUpdateForm: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [formData, setFormData] = useState<InterviewCandidateInfo>({
    contactNumber: '',
    address: '',
    desiredPosition: '',
    yearsOfExperience: 0,
    qualifications: [],
    skills: [],
    availability: {
      days: [],
      timeSlots: [],
    },
    preferredWorkSchedule: [],
    locationPreferences: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: '',
    },
    languagesSpoken: [],
    certifications: [],
    resumeUrl: '',
    currentEmploymentStatus: '',
    expectedSalary: 0,
    noticePeriod: 0,
    interviewAvailability: [],
    references: [],
  })

  useEffect(() => {
    // Fetch interview candidate data on component mount
    fetchInterviewCandidate()
  }, [])

  const fetchInterviewCandidate = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/interview-candidates?userId=${userId}`,
      )
      if (response.data.success) {
        setFormData(response.data.data)
      } else {
        console.error('Error:', response.data)
      }
    } catch (error) {
        console.error('Error fetching interview candidate data:', error)
      }
  }
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleArrayChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof InterviewCandidateInfo,
    index: number,
  ) => {
    const { value } = e.target
    setFormData((prevState) => {
      const updatedArray = [...(prevState[fieldName] as string[])]
      updatedArray[index] = value
      return { ...prevState, [fieldName]: updatedArray }
    })
  }

  const handleAddArrayField = (fieldName: keyof InterviewCandidateInfo) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: [...(prevState[fieldName] as string[]), ''],
    }))
  }

  const handleRemoveArrayField = (
    fieldName: keyof InterviewCandidateInfo,
    index: number,
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: (
        prevState[fieldName as keyof InterviewCandidateInfo] as string[]
      ).filter((_, i) => i !== index),
    }))
  }
  
 // nested handles
 const handleNestedArrayChange = (
    e: { target: { value: any } },
    parentKey: string | number,
    key: string | number,
    index: string | number,
  ) => {
    const { value } = e.target
    setFormData((prevState: any) => {
      const updatedArray: any = [...prevState[parentKey][key]]
      updatedArray[index] = value
      return {
        ...prevState,
        [parentKey]: {
          ...prevState[parentKey],
          [key]: updatedArray,
        },
      }
    })
  }

  const handleNestedAddArrayField = (
    parentKey: string | number,
    key: string | number,
  ) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [parentKey]: {
        ...prevState[parentKey],
        [key]: [...prevState[parentKey][key], ''],
      },
    }))
  }

  const handleNestedRemoveArrayField = (
    parentKey: string,
    key: string,
    index: number
  ) => {
    setFormData((prevState:any) => ({
      ...prevState,
      [parentKey]: {
        ...prevState[parentKey],
        [key]: prevState[parentKey][key].filter((_: any, i: number) => i !== index),
      },
    }));
  };


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        file: file,
      }))

      // Create object URL for previewing the file
      const objectUrl = URL.createObjectURL(file)
      setPreviewFile(objectUrl)
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.put(
        `/admin/interview-candidates/${userId}`,
        formData,
      )
      console.log('Update successful:', response.data)
      alert('Interview candidate info updated successfully')
    } catch (error) {
      console.error('Error updating interview candidate:', error)
      alert('Failed to update interview candidate info')
    }
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Update Interview Candidate Info" />
      <div className="grid">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Update Interview Candidate Info
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Number */}
                <div className="mb-4">
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Desired Position */}
                <div className="mb-4">
                  <label htmlFor="desiredPosition" className="block text-sm font-medium text-gray-700">
                    Desired Position
                  </label>
                  <input
                    type="text"
                    id="desiredPosition"
                    name="desiredPosition"
                    value={formData.desiredPosition}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Years of Experience */}
                <div className="mb-4">
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Qualifications */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Qualifications</label>
                  {formData.qualifications.map((qualification, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Qualification #${index + 1}`}
                        value={qualification}
                        onChange={(e) => handleArrayChange(e, 'qualifications', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveArrayField('qualifications', index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleAddArrayField('qualifications')}
                  >
                    Add Qualification
                  </button>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Skill #${index + 1}`}
                        value={skill}
                        onChange={(e) => handleArrayChange(e, 'skills', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveArrayField('skills', index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleAddArrayField('skills')}
                  >
                    Add Skill
                  </button>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Availability</label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Days</label>
                    {formData.availability.days.map((day, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <input
                          type="text"
                          placeholder={`Day #${index + 1}`}
                          value={day}
                          onChange={(e) => handleNestedArrayChange(e, 'availability', 'days', index)}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-700 focus:outline-none"
                          onClick={() => handleNestedRemoveArrayField('availability', 'days', index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                      onClick={() => handleNestedAddArrayField('availability', 'days')}
                    >
                      Add Day
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time Slots</label>
                    {formData.availability.timeSlots.map((timeSlot, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <input
                          type="text"
                          placeholder={`Time Slot #${index + 1}`}
                          value={timeSlot}
                          onChange={(e) => handleNestedArrayChange(e, 'availability', 'timeSlots', index)}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-700 focus:outline-none"
                          onClick={() => handleNestedRemoveArrayField('availability', 'timeSlots', index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                      onClick={() => handleNestedAddArrayField('availability', 'timeSlots')}
                    >
                      Add Time Slot
                    </button>
                  </div>
                </div>

                {/* Preferred Work Schedule */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Preferred Work Schedule</label>
                  {formData.preferredWorkSchedule.map((schedule, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Schedule #${index + 1}`}
                        value={schedule}
                        onChange={(e) => handleArrayChange(e, 'preferredWorkSchedule', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveArrayField('preferredWorkSchedule', index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleAddArrayField('preferredWorkSchedule')}
                  >
                    Add Preferred Work Schedule
                  </button>
                </div>

                {/* Location Preferences */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Location Preferences</label>
                  {formData.locationPreferences.map((location, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Location #${index + 1}`}
                        value={location}
                        onChange={(e) => handleArrayChange(e, 'locationPreferences', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveArrayField('locationPreferences', index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleAddArrayField('locationPreferences')}
                  >
                    Add Location Preference
                  </button>
                </div>

                {/* Emergency Contact */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleChange({ target: { name: 'emergencyContact.name', value: e.target.value } })}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleChange({ target: { name: 'emergencyContact.relationship', value: e.target.value } })}
                    className="w-full mt-2 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
<input
                    type="text"
                    placeholder="Phone Number"
                    value={formData.emergencyContact.phoneNumber}
                    onChange={(e) => handleChange({ target: { name: 'emergencyContact.phoneNumber', value: e.target.value } })}
                    className="w-full mt-2 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Languages Spoken */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Languages Spoken</label>
                  {formData.languagesSpoken.map((language, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Language #${index + 1}`}
                        value={language}
                        onChange={(e) => handleArrayChange(e, 'languagesSpoken', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveArrayField('languagesSpoken', index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleAddArrayField('languagesSpoken')}
                  >
                    Add Language
                  </button>
                </div>

                {/* Certifications */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Certifications</label>
                  {formData.certifications.map((certification, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Certification #${index + 1}`}
                        value={certification}
                        onChange={(e) => handleArrayChange(e, 'certifications', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveArrayField('certifications', index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleAddArrayField('certifications')}
                  >
                    Add Certification
                  </button>
                </div>

                {/* Resume URL */}
                {/* <div className="mb-4">
                  <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700">
                    Resume URL
                  </label>
                  <input
                    type="text"
                    id="resumeUrl"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div> */}

                <div className="mb-4">
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Resume File
                  </label>
                  <div className="mt-2 flex items-center">
                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept=".pdf, .docx, .txt, .jpeg, .png"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleFileChange}
                    />
                  </div>
                  {previewFile && (
                    <>
                      <div className="mt-2">
                        {previewFile && (
                          <iframe src={previewFile} width="600" height="400" />
                        )}
                        {!previewFile && <p>No preview available.</p>}
                      </div>
                      <div className="mt-2">
                        <a
                          href={previewFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          Preview file full screen
                        </a>
                      </div>
                    </>
                  )}
                  {!previewFile && formData.resumeUrl && (
                    <div className="mt-2">
                      {formData.resumeUrl && (
                        <iframe src={formData.resumeUrl} width="600" height="400" />
                      )}
                      {!formData.resumeUrl && <p>No preview available.</p>}
                    </div>
                  )}
                </div>

                {/* Current Employment Status */}
                <div className="mb-4">
                  <label htmlFor="currentEmploymentStatus" className="block text-sm font-medium text-gray-700">
                    Current Employment Status
                  </label>
                  <input
                    type="text"
                    id="currentEmploymentStatus"
                    name="currentEmploymentStatus"
                    value={formData.currentEmploymentStatus}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Expected Salary */}
                <div className="mb-4">
                  <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700">
                    Expected Salary
                  </label>
                  <input
                    type="number"
                    id="expectedSalary"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Notice Period */}
                <div className="mb-4">
                  <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-700">
                    Notice Period (in days)
                  </label>
                  <input
                    type="number"
                    id="noticePeriod"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Interview Availability */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Interview Availability</label>
                  {formData.interviewAvailability.map((availability, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Availability #${index + 1}`}
                        value={availability}
                        onChange={(e) => handleArrayChange(e, 'interviewAvailability', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveArrayField('interviewAvailability', index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleAddArrayField('interviewAvailability')}
                  >
                    Add Interview Availability
                  </button>
                </div>

                {/* References */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">References</label>
                  {formData.references.map((reference, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded">
                      <input
                        type="text"
                        placeholder="Name"
                        value={reference.name}
                        onChange={(e) => {
                          const updatedReferences = [...formData.references];
                          updatedReferences[index].name = e.target.value;
                          setFormData({ ...formData, references: updatedReferences });
                        }}
                        className="w-full mb-2 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={reference.company}
                        onChange={(e) => {
                          const updatedReferences = [...formData.references];
                          updatedReferences[index].company = e.target.value;
                          setFormData({ ...formData, references: updatedReferences });
                        }}
                        className="w-full mb-2 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Position"
                        value={reference.position}
                        onChange={(e) => {
                          const updatedReferences = [...formData.references];
                          updatedReferences[index].position = e.target.value;
                          setFormData({ ...formData, references: updatedReferences });
                        }}
                        className="w-full mb-2 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Contact Info"
                        value={reference.contactInfo}
                        onChange={(e) => {
                          const updatedReferences = [...formData.references];
                          updatedReferences[index].contactInfo = e.target.value;
                          setFormData({ ...formData, references: updatedReferences });
                        }}
                        className="w-full mb-2 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => {
                          const updatedReferences = formData.references.filter((_, i) => i !== index);
                          setFormData({ ...formData, references: updatedReferences });
                        }}
                      >
                        Remove Reference
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        references: [...formData.references, { name: '', company: '', position: '', contactInfo: '' }],
                      });
                    }}
                  >
                    Add Reference
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary py-3 px-5 text-white transition hover:bg-opacity-90"
                >
                  Update Interview Candidate Info
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default InterviewCandidateUpdateForm