import React, { useState, useEffect, ChangeEvent } from 'react';
import axiosInstance from '../utils/axios'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import { useParams } from 'react-router-dom';


interface Availability {
    days: string[];
    timeSlots: string[];
  }
  
  interface EmergencyContact {
    name: string;
    relationship: string;
    phoneNumber: string;
  }
  
  interface HealthcareProfessionalInfo {
    contactNumber: string;
    address: string;
    specialization: string;
    licenseNumber: string;
    yearsOfExperience: number;
    qualifications: string[];
    skills: string[];
    availability: Availability;
    preferredShifts: string[];
    workLocationPreferences: string[];
    emergencyContact: EmergencyContact;
    languagesSpoken: string[];
    certifications: string[];
    documents: string[];
  }

const HealthcareProfessionalUpdateForm: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const [formData, setFormData] = useState<HealthcareProfessionalInfo>({
    contactNumber: '',
    address: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: 0,
    qualifications: [],
    skills: [],
    availability: {
      days: [],
      timeSlots: []
    },
    preferredShifts: [],
    workLocationPreferences: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: ''
    },
    languagesSpoken: [],
    certifications: [],
    documents: []
  });

  useEffect(() => {
    // Fetch healthcare professional data on component mount
    fetchHealthcareProfessional();
  }, []);

  const fetchHealthcareProfessional = async () => {
    try {
      const response = await axiosInstance.get(`/admin/healthcare-professionals?userId=${userId}`);
      if (response.data.success) {
        const dataToSend = response.data.data 
        delete dataToSend._id
        delete dataToSend.userId
        delete dataToSend.createdAt
        delete dataToSend.updatedAt
        delete dataToSend.__v
        setFormData(response.data.data)
      } else {
        console.error('Error:', response.data)
      }
     } catch (error) {
      console.error('Error fetching healthcare professional data:', error);
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

//   const handleArrayChange = (e: { target: { value: any; }; }, field: any) => {
//     const { value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [field]: value.split(',').map((item: string) => item.trim())
//     }));
//   };

const handleArrayChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof HealthcareProfessionalInfo,
    index: number,
  ) => {
    const { value } = e.target
    setFormData((prevState) => {
      const updatedArray = [...prevState[fieldName] as string[]]
      updatedArray[index] = value
      return { ...prevState, [fieldName]: updatedArray }
    })
  }
  const handleAddArrayField = (fieldName: keyof HealthcareProfessionalInfo) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: [...prevState[fieldName] as string[], ''],
    }))
  }

  const handleRemoveArrayField = (fieldName: keyof HealthcareProfessionalInfo, index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: (prevState[fieldName as keyof HealthcareProfessionalInfo] as string[]).filter((_, i) => i !== index),

    }))
  }



// nested handles
const handleNestedArrayChange = (e: { target: { value: any } }, parentKey: string | number, key: string | number, index: string | number) => {
  const { value } = e.target;
  setFormData((prevState:any) => {
    const updatedArray:any = [...prevState[parentKey][key]];
    updatedArray[index] = value;
    return {
      ...prevState,
      [parentKey]: {
        ...prevState[parentKey],
        [key]: updatedArray,
      },
    };
  });
};

const handleNestedAddArrayField = (parentKey: string | number, key: string | number) => {
  setFormData((prevState:any) => ({
    ...prevState,
    [parentKey]: {
      ...prevState[parentKey],
      [key]: [...prevState[parentKey][key], ''],
    },
  }));
};

const handleNestedRemoveArrayField = (parentKey: string | number, key: string | number, index: any) => {
  setFormData((prevState:any) => {
    const updatedArray = prevState[parentKey][key].filter((_: any, i: any) => i !== index);
    return {
      ...prevState,
      [parentKey]: {
        ...prevState[parentKey],
        [key]: updatedArray,
      },
    };
  });
};


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/admin/healthcare-professionals/${userId}`, formData);
      console.log('Update successful:', response.data);
      // Handle success      
      alert('Caregiver info updated successfully')

    } catch (error) {
      console.error('Error updating healthcare professional:', error);
      // Handle error      
      alert('Failed to update caregiver info')

    }
  };

  return (
    <>
      {formData ? (
        <DefaultLayout>
          <Breadcrumb pageName="Update Healthcare Professional Info" />
          <div className="grid">
            <div className="flex flex-col gap-9">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Update Healthcare Professional Info
                  </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Information */}
                    <div className="mb-4">
                      <label
                        htmlFor="contactNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
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
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
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
  
                    {/* Specialization */}
                    <div className="mb-4">
                      <label
                        htmlFor="specialization"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Specialization
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
  
                    {/* License Number */}
                    <div className="mb-4">
                      <label
                        htmlFor="licenseNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        License Number
                      </label>
                      <input
                        type="text"
                        id="licenseNumber"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
  
                    {/* Years of Experience */}
                    <div className="mb-4">
                      <label
                        htmlFor="yearsOfExperience"
                        className="block text-sm font-medium text-gray-700"
                      >
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
                      <label className="block text-sm font-medium text-gray-700">
                        Qualifications
                      </label>
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
                      <label className="block text-sm font-medium text-gray-700">
                        Skills
                      </label>
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
                  {/* Availability Days */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Availability Days
                    </label>
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
                      Add Availability Day
                    </button>
                  </div>

                  {/* Availability Time Slots */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Availability Time Slots
                    </label>
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
                      Add Availability Time Slot
                    </button>
                  </div>

                  {/* Preferred Shifts */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Shifts
                    </label>
                    {formData.preferredShifts.map((shift, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <input
                          type="text"
                          placeholder={`Shift #${index + 1}`}
                          value={shift}
                          onChange={(e) => handleArrayChange(e, 'preferredShifts', index)}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-700 focus:outline-none"
                          onClick={() => handleRemoveArrayField('preferredShifts', index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                      <button
                        type="button"
                        className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                        onClick={() => handleAddArrayField('preferredShifts')}
                      >
                        Add Preferred Shift
                      </button>
                    </div>
                    {/* Work Location Preferences */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Work Location Preferences
                      </label>
                      {formData.workLocationPreferences.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <input
                            type="text"
                            placeholder={`Location #${index + 1}`}
                            value={location}
                            onChange={(e) => handleArrayChange(e, 'workLocationPreferences', index)}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          />
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-700 focus:outline-none"
                            onClick={() => handleRemoveArrayField('workLocationPreferences', index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                        onClick={() => handleAddArrayField('workLocationPreferences')}
                      >
                        Add Work Location Preference
                      </button>
                    </div>

                    {/* Emergency Contact */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Emergency Contact
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={formData.emergencyContact.name}
                          onChange={(e) => setFormData(prevState => ({
                            ...prevState,
                            emergencyContact: { ...prevState.emergencyContact, name: e.target.value }
                          }))}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <input
                          type="text"
                          placeholder="Relationship"
                          value={formData.emergencyContact.relationship}
                          onChange={(e) => setFormData(prevState => ({
                            ...prevState,
                            emergencyContact: { ...prevState.emergencyContact, relationship: e.target.value }
                          }))}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <input
                          type="text"
                          placeholder="Phone Number"
                          value={formData.emergencyContact.phoneNumber}
                          onChange={(e) => setFormData(prevState => ({
                            ...prevState,
                            emergencyContact: { ...prevState.emergencyContact, phoneNumber: e.target.value }
                          }))}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Languages Spoken */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Languages Spoken
                      </label>
                      {formData.languagesSpoken.map((language, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
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
                      <label className="block text-sm font-medium text-gray-700">
                        Certifications
                      </label>
                      {formData.certifications.map((certification, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
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

                    {/* Documents */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Documents
                      </label>
                      {formData.documents.map((document, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <input
                            type="text"
                            placeholder={`Document #${index + 1}`}
                            value={document}
                            onChange={(e) => handleArrayChange(e, 'documents', index)}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          />
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-700 focus:outline-none"
                            onClick={() => handleRemoveArrayField('documents', index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                        onClick={() => handleAddArrayField('documents')}
                      >
                        Add Document
                      </button>
                    </div>


                    <button
                      type="submit"
                      className="w-full rounded-lg bg-primary py-3 px-5 text-white transition hover:bg-opacity-90"
                    >
                      Update Healthcare Professional Info
                    </button>
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
  );
};

export default HealthcareProfessionalUpdateForm;
