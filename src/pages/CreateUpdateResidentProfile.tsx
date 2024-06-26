import React, { useState, useEffect, ChangeEvent } from 'react';
import axiosInstance from '../utils/axios'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import { useParams } from 'react-router-dom';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
}

interface Preferences {
  wakeUpTime: string;
  bedTime: string;
  mealPreferences: string[];
  activities: string[];
}

interface ResidentInfo {
  admissionDate: string;
  roomNumber: string;
  careLevel: string;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  medications: Medication[];
  mobilityStatus: string;
  assistiveDevices: string[];
  dnrStatus: boolean;
  emergencyContacts: EmergencyContact[];
  primaryPhysician: {
    name: string;
    contactNumber: string;
  };
  insuranceInfo: {
    provider: string;
    policyNumber: string;
  };
  legalGuardian?: {
    name: string;
    relationship: string;
    contactNumber: string;
    email: string;
  };
  preferences: Preferences;
  documents: string[];
}

const CreateUpdateResidentProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [formData, setFormData] = useState<ResidentInfo>({
    admissionDate: '',
    roomNumber: '',
    careLevel: '',
    primaryDiagnosis: '',
    secondaryDiagnoses: [],
    allergies: [],
    dietaryRestrictions: [],
    medications: [],
    mobilityStatus: '',
    assistiveDevices: [],
    dnrStatus: false,
    emergencyContacts: [],
    primaryPhysician: {
      name: '',
      contactNumber: '',
    },
    insuranceInfo: {
      provider: '',
      policyNumber: '',
    },
    preferences: {
      wakeUpTime: '',
      bedTime: '',
      mealPreferences: [],
      activities: [],
    },
    documents: [],
  });

  useEffect(() => {
    if (userId) {
      fetchResidentData();
    }
  }, [userId]);

  const fetchResidentData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/residents?userId=${userId}`);
      if (response.data.success) {
        const dataToSend = response.data.data;
        delete dataToSend._id;
        delete dataToSend.userId;
        delete dataToSend.createdAt;
        delete dataToSend.updatedAt;
        delete dataToSend.__v;
        setFormData(dataToSend);
      } else {
        console.error('Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching resident data:', error);
    }
  };
  const handleNestedArrayChange = (
    e: { target: { value: any } }, 
    parentKey: string, 
    index: number, 
    field: string
  ) => {
    const { value } = e.target;
    setFormData((prevState: any) => {
      // Ensure the parent key exists and is an array
      const updatedParent = Array.isArray(prevState[parentKey]) 
        ? [...prevState[parentKey]] 
        : [];
      
      // Ensure the item at the index exists and is an object
      updatedParent[index] = {
        ...updatedParent[index],
        [field]: value
      };
  
      return {
        ...prevState,
        [parentKey]: updatedParent
      };
    });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleArrayChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof ResidentInfo,
    index: number,
  ) => {
    const { value } = e.target;
    setFormData((prevState) => {
      const updatedArray = [...prevState[fieldName] as string[]];
      updatedArray[index] = value;
      return { ...prevState, [fieldName]: updatedArray };
    });
  };

  const handleAddArrayField = (fieldName: keyof ResidentInfo) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: [...prevState[fieldName] as string[], ''],
    }));
  };

  const handleRemoveArrayField = (fieldName: keyof ResidentInfo, index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: (prevState[fieldName] as string[]).filter((_, i) => i !== index),
    }));
  };

  const handleNestedChange = (e: ChangeEvent<HTMLInputElement>, parentKey: keyof ResidentInfo, key: string) => {
    const { value } = e.target;
    setFormData((prevState:any) => ({
      ...prevState,
      [parentKey]: {
        ...prevState[parentKey],
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (userId) {
        response = await axiosInstance.put(`/admin/residents/${userId}`, formData);
      } else {
        response = await axiosInstance.post('/admin/residents', formData);
      }
      console.log('Operation successful:', response.data);
      alert(userId ? 'Resident info updated successfully' : 'Resident created successfully');
    } catch (error) {
      console.error('Error:', error);
      alert(userId ? 'Failed to update resident info' : 'Failed to create resident');
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={userId ? "Update Resident Profile" : "Create Resident Profile"} />
      <div className="grid">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {userId ? "Update Resident Profile" : "Create Resident Profile"}
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="mb-4">
                  <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    id="admissionDate"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
                    Room Number
                  </label>
                  <input
                    type="text"
                    id="roomNumber"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Medical Information */}
                <div className="mb-4">
                  <label htmlFor="careLevel" className="block text-sm font-medium text-gray-700">
                    Care Level
                  </label>
                  <input
                    type="text"
                    id="careLevel"
                    name="careLevel"
                    value={formData.careLevel}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="primaryDiagnosis" className="block text-sm font-medium text-gray-700">
                    Primary Diagnosis
                  </label>
                  <input
                    type="text"
                    id="primaryDiagnosis"
                    name="primaryDiagnosis"
                    value={formData.primaryDiagnosis}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Secondary Diagnoses */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Secondary Diagnoses
                  </label>
                  {formData.secondaryDiagnoses.map((diagnosis, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Diagnosis #${index + 1}`}
                        value={diagnosis}
                        onChange={(e) => handleArrayChange(e, 'secondaryDiagnoses', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveArrayField('secondaryDiagnoses', index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleAddArrayField('secondaryDiagnoses')}
                  >
                    Add Secondary Diagnosis
                  </button>
                </div>

                {/* Allergies */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Allergies
                  </label>
                  {formData.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Allergy #${index + 1}`}
                        value={allergy}
                        onChange={(e) => handleArrayChange(e, 'allergies', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveArrayField('allergies', index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleAddArrayField('allergies')}
                  >
                    Add Allergy
                  </button>
                </div>

                {/* Dietary Restrictions */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Dietary Restrictions
                  </label>
                  {formData.dietaryRestrictions.map((restriction, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder={`Restriction #${index + 1}`}
                        value={restriction}
                        onChange={(e) => handleArrayChange(e, 'dietaryRestrictions', index)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        onClick={() => handleRemoveArrayField('dietaryRestrictions', index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleAddArrayField('dietaryRestrictions')}
                  >
                    Add Dietary Restriction
                  </button>
                </div>

                {/* Mobility Status */}
                <div className="mb-4">
                  <label htmlFor="mobilityStatus" className="block text-sm font-medium text-gray-700">
                    Mobility Status
                  </label>
                  <input
                    type="text"
                    id="mobilityStatus"
                    name="mobilityStatus"
                    value={formData.mobilityStatus}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* DNR Status */}
                <div className="mb-4">
                  <label htmlFor="dnrStatus" className="block text-sm font-medium text-gray-700">
                    DNR Status
                  </label>
                  <select
                    id="dnrStatus"
                    name="dnrStatus"
                    value={formData.dnrStatus.toString()}
                    onChange={(e) => setFormData(prev => ({ ...prev, dnrStatus: e.target.value === 'true' }))}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-nonetransition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

{/* Medications Contacts */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Medications Contacts
  </label>
  {formData.medications.map((medication:any, index) => (
    <div key={index} className="mb-2">
      <input
        type="text"
        placeholder="Name"
        value={medication.name}
        onChange={(e) => handleNestedArrayChange(e, 'medications', index, 'name')}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
      />
      <input
        type="text"
        placeholder="Dosage"
        value={medication.dosage}
        onChange={(e) => handleNestedArrayChange(e, 'medications', index, 'dosage')}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
      />
      <input
        type="text"
        placeholder="Frequency"
        value={medication.frequency}
        onChange={(e) => handleNestedArrayChange(e, 'medications', index, 'frequency')}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
      />
        <input
          type="date"
          name="StartDate"
          value={medication.startDate}
          onChange={(e) => handleNestedArrayChange(e, 'medications', index, 'startDate')}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        <input
          type="date"
          name="EndDate"
          value={medication.endDate}
          onChange={(e) => handleNestedArrayChange(e, 'medications', index, 'endDate')}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />

      <button
        type="button"
        className="text-red-600 hover:text-red-700 focus:outline-none"
        onClick={() => handleRemoveArrayField('medications', index)}
      >
        Remove Medication
      </button>
    </div>
  ))}
  <button
    type="button"
    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
    onClick={() => handleAddArrayField('emergencyContacts')}
  >
    Add Emergency Contact
  </button>
</div>
{/* Emergency Contacts */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Emergency Contacts
  </label>
  {formData.emergencyContacts.map((contact:any, index) => (
    <div key={index} className="mb-2">
      <input
        type="text"
        placeholder="Name"
        value={contact.name}
        onChange={(e) => handleNestedArrayChange(e, 'emergencyContacts', index, 'name')}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
      />
      <input
        type="text"
        placeholder="Relationship"
        value={contact.relationship}
        onChange={(e) => handleNestedArrayChange(e, 'emergencyContacts', index, 'relationship')}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
      />
      <input
        type="text"
        placeholder="Contact Number"
        value={contact.phoneNumber}
        onChange={(e) => handleNestedArrayChange(e, 'emergencyContacts', index, 'phoneNumber')}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
      />
      <button
        type="button"
        className="text-red-600 hover:text-red-700 focus:outline-none"
        onClick={() => handleRemoveArrayField('emergencyContacts', index)}
      >
        Remove Contact
      </button>
    </div>
  ))}
  <button
    type="button"
    className="mt-2 text-blue-600 hover:text-blue-700 focus:outline-none"
    onClick={() => handleAddArrayField('emergencyContacts')}
  >
    Add Emergency Contact
  </button>
</div>

{/* Primary Physician */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Primary Physician
  </label>
  <input
    type="text"
    placeholder="Name"
    value={formData.primaryPhysician.name}
    onChange={(e) => handleNestedChange(e, 'primaryPhysician', 'name')}
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
  />
  <input
    type="text"
    placeholder="Contact Number"
    value={formData.primaryPhysician.contactNumber}
    onChange={(e) => handleNestedChange(e, 'primaryPhysician', 'contactNumber')}
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
  />
</div>

{/* Insurance Info */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Insurance Information
  </label>
  <input
    type="text"
    placeholder="Provider"
    value={formData.insuranceInfo.provider}
    onChange={(e) => handleNestedChange(e, 'insuranceInfo', 'provider')}
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
  />
  <input
    type="text"
    placeholder="Policy Number"
    value={formData.insuranceInfo.policyNumber}
    onChange={(e) => handleNestedChange(e, 'insuranceInfo', 'policyNumber')}
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
  />
</div>

{/* Legal Guardian */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Legal Guardian (Optional)
  </label>
  <input
    type="text"
    placeholder="Name"
    value={formData.legalGuardian?.name || ''}
    onChange={(e) => handleNestedChange(e, 'legalGuardian', 'name')}
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
  />
  <input
    type="text"
    placeholder="Relationship"
    value={formData.legalGuardian?.relationship || ''}
    onChange={(e) => handleNestedChange(e, 'legalGuardian', 'relationship')}
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
  />
  <input
    type="text"
    placeholder="Contact Number"
    value={formData.legalGuardian?.contactNumber || ''}
    onChange={(e) => handleNestedChange(e, 'legalGuardian', 'contactNumber')}
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-2"
  />
  <input
    type="email"
    placeholder="Email"
    value={formData.legalGuardian?.email || ''}
    onChange={(e) => handleNestedChange(e, 'legalGuardian', 'email')}
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
  />
</div>

{/* Preferences */}
{/* Note: You might want to create specific fields for preferences based on your Preferences interface */}

{/* Documents */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Documents
  </label>
  {formData.documents.map((document, index) => (
    <div key={index} className="flex items-center space-x-4 mb-2">
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
)
};

export default CreateUpdateResidentProfile