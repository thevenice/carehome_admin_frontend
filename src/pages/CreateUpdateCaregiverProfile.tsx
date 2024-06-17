import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import axiosInstance from '../utils/axios';

const CaregiverCreateUpdateForm = () => {
  const { userId } = useParams<{ userId: string }>();

  const [formData, setFormData] = useState({
    contactNumber: '',
    address: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: 0,
    qualifications: [],
    skills: [],
    availability: {
      days: [],
      timeSlots: [],
    },
    preferredShifts: [],
    workLocationPreferences: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: '',
    },
    languagesSpoken: [],
    certifications: [],
    documents: [],
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (userId) {
      axiosInstance
        .get(`/admin/caregivers/${userId}`)
        .then((response) => {
          setFormData(response.data.data); // Set form data with response data
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching caregiver details:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
      const { name, value } = e.target;
      console.log({ name, value })
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleArrayChange = (name: string, value: string[]) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAvailabilityChange = (name: string, value: string[]) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [name]: value,
      },
    });
  };

  const handleEmergencyContactChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log({ name, value })
    const newName = name === "emergencyPhoneNumber" ? "phoneNumber" : name === "emergencyRelationship" ? "relationship" : name === "emergencyName" ? "name" : name
    setFormData({
        ...formData,
        emergencyContact: {
            ...formData.emergencyContact,
            [newName]: value,
            },
            
            });
        console.log("formData: ", formData)
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        console.log("userId",userId)
      const response = await axiosInstance.put(`/admin/caregivers/${userId}`, formData);
      alert('Caregiver profile updated successfully');
      console.log('Caregiver profile updated:', response.data);
    } catch (error) {
      console.error('Error updating caregiver profile:', error);
      alert('Failed to update caregiver profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName={userId ? 'Update Caregiver Profile' : 'Create Caregiver Profile'} />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {userId ? 'Update Caregiver Profile' : 'Create Caregiver Profile'}
            </h3>
            <form onSubmit={handleSubmit} className="mt-6.5 space-y-6">
              <div className="space-y-2">
                {/* Contact Information */}
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                    Contact Number:
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
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address:
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                {/* Other fields */}
                {/* Specialization */}
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization:
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
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                    License Number:
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
                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                    Years of Experience:
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
                <div>
                  <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
                    Qualifications:
                  </label>
                  <input
                    type="text"
                    id="qualifications"
                    name="qualifications"
                    value={formData.qualifications.join(', ')}
                    onChange={(e) => handleArrayChange('qualifications', e.target.value.split(', '))}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                {/* Skills */}
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                    Skills:
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={formData.skills.join(', ')}
                    onChange={(e) => handleArrayChange('skills', e.target.value.split(', '))}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                {/* Availability */}
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                    Availability:
                  </label>
                  <div className="space-y-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="days"
                        value="Monday"
                        checked={formData.availability.days.includes('Monday')}
                        onChange={(e) => handleAvailabilityChange('days', updateCheckboxArray(formData.availability.days, 'Monday', e.target.checked))}
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">Monday</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="days"
                        value="Wednesday"
                        checked={                        formData.availability.days.includes('Wednesday')}
                        onChange={(e) =>
                          handleAvailabilityChange(
                            'days',
                            updateCheckboxArray(
                              formData.availability.days,
                              'Wednesday',
                              e.target.checked
                            )
                          )
                        }
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">Wednesday</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="days"
                        value="Friday"
                        checked={formData.availability.days.includes('Friday')}
                        onChange={(e) =>
                          handleAvailabilityChange(
                            'days',
                            updateCheckboxArray(
                              formData.availability.days,
                              'Friday',
                              e.target.checked
                            )
                          )
                        }
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">Friday</span>
                    </label>
                  </div>
                  <label htmlFor="timeSlots" className="block mt-2 text-sm font-medium text-gray-700">
                    Time Slots:
                  </label>
                  <div className="space-y-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="timeSlots"
                        value="09:00-12:00"
                        checked={formData.availability.timeSlots.includes('09:00-12:00')}
                        onChange={(e) =>
                          handleAvailabilityChange(
                            'timeSlots',
                            updateCheckboxArray(
                              formData.availability.timeSlots,
                              '09:00-12:00',
                              e.target.checked
                            )
                          )
                        }
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">09:00-12:00</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="timeSlots"
                        value="13:00-16:00"
                        checked={formData.availability.timeSlots.includes('13:00-16:00')}
                        onChange={(e) =>
                          handleAvailabilityChange(
                            'timeSlots',
                            updateCheckboxArray(
                              formData.availability.timeSlots,
                              '13:00-16:00',
                              e.target.checked
                            )
                          )
                        }
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">13:00-16:00</span>
                    </label>
                  </div>
                </div>
                {/* Preferred Shifts */}
                <div>
                  <label htmlFor="preferredShifts" className="block text-sm font-medium text-gray-700">
                    Preferred Shifts:
                  </label>
                  <div className="space-y-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="preferredShifts"
                        value="Morning"
                        checked={formData.preferredShifts.includes('Morning')}
                        onChange={(e) =>
                          handleArrayChange('preferredShifts', updateCheckboxArray(formData.preferredShifts, 'Morning', e.target.checked))}
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">Morning</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="preferredShifts"
                        value="Night"
                        checked={formData.preferredShifts.includes('Night')}
                        onChange={(e) =>
                          handleArrayChange('preferredShifts', updateCheckboxArray(formData.preferredShifts, 'Night', e.target.checked))}
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">Night</span>
                    </label>
                  </div>
                </div>
                {/* Work Location Preferences */}
                <div>
                  <label htmlFor="workLocationPreferences" className="block text-sm font-medium text-gray-700">
                    Work Location Preferences:
                  </label>
                  <div className="space-y-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="workLocationPreferences"
                        value="Hospital"
                        checked={formData.workLocationPreferences.includes('Hospital')}
                        onChange={(e) =>
                          handleArrayChange('workLocationPreferences', updateCheckboxArray(formData.workLocationPreferences, 'Hospital', e.target.checked))}
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">Hospital</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="workLocationPreferences"
                        value="Clinic"
                        checked={formData.workLocationPreferences.includes('Clinic')}
                        onChange={(e) =>
                          handleArrayChange('workLocationPreferences', updateCheckboxArray(formData.workLocationPreferences, 'Clinic', e.target.checked))}
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">Clinic</span>
                    </label>
                  </div>
                </div>
                {/* Emergency Contact */}
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                    Emergency Contact:
                  </label>
                  <div>
                    <label htmlFor="emergencyName" className="block mt-2 text-sm font-medium text-gray-700">
                      Name:
                    </label>
                    <input
                      type="text"
                      id="emergencyName"
                      name="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={handleEmergencyContactChange}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="emergencyRelationship" className="block mt-2 text-sm font-medium text-gray-700">
                      Relationship:
                    </label>
                    <input
                      type="text"
                      id="emergencyRelationship"
                      name="emergencyRelationship"
                      value={formData.emergencyContact.relationship}
                      onChange={handleEmergencyContactChange}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="emergencyPhoneNumber" className="block mt-2 text-sm font-medium text-gray-700">
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      id="emergencyPhoneNumber"
                      name="emergencyPhoneNumber"
                      value={formData.emergencyContact.phoneNumber}
                      onChange={handleEmergencyContactChange}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                {/* Languages Spoken */}
                <div>
                  <label htmlFor="languagesSpoken" className="block text-sm font-medium text-gray-700">
                    Languages Spoken:
                  </label>
                  <div className="space-y-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="languagesSpoken"
                        value="English"
                        checked={formData.languagesSpoken.includes('English')}
                        onChange={(e) =>
                          handleArrayChange('languagesSpoken', updateCheckboxArray(formData.languagesSpoken, 'English', e.target.checked))}
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">English</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="languagesSpoken"
                        value="Spanish"
                        checked={formData.languagesSpoken.includes('Spanish')}
                        onChange={(e) =>
                          handleArrayChange('languagesSpoken', updateCheckboxArray(formData.languagesSpoken, 'Spanish', e.target.checked))}
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input                        dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">Spanish</span>
                    </label>
                  </div>
                </div>
                {/* Certifications */}
                <div>
                  <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
                    Certifications:
                  </label>
                  <div className="space-y-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="certifications"
                        value="BLS"
                        checked={formData.certifications.includes('BLS')}
                        onChange={(e) =>
                          handleArrayChange('certifications', updateCheckboxArray(formData.certifications, 'BLS', e.target.checked))}
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">BLS</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="certifications"
                        value="PALS"
                        checked={formData.certifications.includes('PALS')}
                        onChange={(e) =>
                          handleArrayChange('certifications', updateCheckboxArray(formData.certifications, 'PALS', e.target.checked))}
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">PALS</span>
                    </label>
                  </div>
                </div>
                {/* Documents */}
                <div>
                  <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                    Documents:
                  </label>
                  <div className="space-y-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="documents"
                        value="60d1fe4f5311236168a109ca"
                        checked={formData.documents.includes('60d1fe4f5311236168a109ca')}
                        onChange={(e) =>
                          handleArrayChange('documents', updateCheckboxArray(formData.documents, '60d1fe4f5311236168a109ca', e.target.checked))}
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">Document 1</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="documents"
                        value="60d2fe4f5311236168a109cb"
                        checked={formData.documents.includes('60d2fe4f5311236168a109cb')}
                        onChange={(e) =>
                          handleArrayChange('documents', updateCheckboxArray(formData.documents, '60d2fe4f5311236168a109cb', e.target.checked))}
                        className="rounded border-[1.5px] border-stroke form-checkbox focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-700">Document 2</span>
                    </label>
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {userId ? 'Update Caregiver' : 'Create Caregiver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CaregiverCreateUpdateForm;

// Helper function to update checkbox arrays
const updateCheckboxArray = (array: string[], value: string, checked: boolean) => {
  if (checked) {
    return [...array, value];
  } else {
    return array.filter((item) => item !== value);
  }
};