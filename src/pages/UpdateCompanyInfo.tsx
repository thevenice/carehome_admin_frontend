import React, { ChangeEvent, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';

interface CompanyInfo {
  name: string;
  logo: File | null;
  contactInfo: {
    phoneNumber: string;
    emailAddress: string;
  };
  linkedin: string;
  googleMap: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  telegram: string;
  aboutUs: string;
  servicesOffered: string[];
  facilitiesAmenities: string[];
}

const UpdateCompanyInfo: React.FC = () => {

  const [previewLogo, setPreviewLogo] = useState<any>()
  const [formData, setFormData] = useState<CompanyInfo>({
    name: '',
    logo: null,
    contactInfo: {
      phoneNumber: '',
      emailAddress: '',
    },
    linkedin: '',
    googleMap: '',
    facebook: '',
    instagram: '',
    whatsapp: '',
    telegram: '',
    aboutUs: '',
    servicesOffered: [],
    facilitiesAmenities: [],
  });

  useEffect(() => {
    // Fetch company info and set formData
    fetchCompanyInfoData();
  }, []);

  const fetchCompanyInfoData = async () => {
    try {
      const response = await axiosInstance.get('/admin/company-info');
      if (response.data.success) {
        setFormData(response.data.data);
      } else {
        console.error('Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching company data', error);
    }
  };


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        logo: file,
      }));

      // Create object URL for previewing the image
      const objectUrl = URL.createObjectURL(file);
      setPreviewLogo(objectUrl); // Save URL to state for preview
    }
  };

  const handleAddService = () => {
    setFormData(prevState => ({
      ...prevState,
      servicesOffered: [...prevState.servicesOffered, ''],
    }));
  };

  const handleServiceChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    setFormData(prevState => {
      const updatedServices = [...prevState.servicesOffered];
      updatedServices[index] = value;
      return { ...prevState, servicesOffered: updatedServices };
    });
  };

  const handleRemoveService = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      servicesOffered: prevState.servicesOffered.filter((_, i) => i !== index),
    }));
  };

  const handleAddFacility = () => {
    setFormData(prevState => ({
      ...prevState,
      facilitiesAmenities: [...prevState.facilitiesAmenities, ''],
    }));
  };

  const handleFacilityChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    setFormData(prevState => {
      const updatedFacilities = [...prevState.facilitiesAmenities];
      updatedFacilities[index] = value;
      return { ...prevState, facilitiesAmenities: updatedFacilities };
    });
  };

  const handleRemoveFacility = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      facilitiesAmenities: prevState.facilitiesAmenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      // Append form data
      formDataToSend.append('logo', formData.logo || ''); // Add logo file
      formDataToSend.append('name', formData.name);
      formDataToSend.append('contactInfo', JSON.stringify(formData.contactInfo));
    //   formDataToSend.append('contactInfo.emailAddress', formData.contactInfo.emailAddress);
      formDataToSend.append('linkedin', formData.linkedin);
      formDataToSend.append('googleMap', formData.googleMap);
      formDataToSend.append('facebook', formData.facebook);
      formDataToSend.append('instagram', formData.instagram);
      formDataToSend.append('whatsapp', formData.whatsapp);
      formDataToSend.append('telegram', formData.telegram);
      formDataToSend.append('aboutUs', formData.aboutUs);
      formDataToSend.append('servicesOffered', JSON.stringify(formData.servicesOffered));
      formDataToSend.append('facilitiesAmenities', JSON.stringify(formData.facilitiesAmenities));

        const response = await axiosInstance.post(`/admin/company-info`, formDataToSend);
        alert('User created successfully');
        console.log('User created:', response.data);
    } 
    catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to create user');
    }
  };

  return (
    <>
{    formData ?
(    
<DefaultLayout>
    <Breadcrumb pageName="Update Company Info" />
    <div className="grid">
      <div className="flex flex-col gap-9">
        {/* <!-- Update Company Info --> */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Create Care Home
            </h3>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
<form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo Upload */}
      <div className="mb-4">
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
          Upload Logo
        </label>
        <div className="mt-2 flex items-center">
          <input
            type="file"
            id="logo"
            name="logo"
            accept="image/*"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={handleLogoChange}
          />

        </div>
        {previewLogo && (
          <img src={previewLogo} alt="Logo Preview" className="mt-2 rounded-md shadow-sm max-w-xs" />
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-lg border-r-0 border-[1.5px] border-stroke dark:border-form-strokedark bg-transparent text-black text-sm dark:bg-form-input dark:text-white dark:focus:border-primary" >
            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
          </span>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border-[1.5px] border-stroke rounded-l-none border-l-0 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      {/* Contact Information Fields */}
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-lg border-r-0 border-[1.5px] border-stroke dark:border-form-strokedark bg-transparent text-black text-sm dark:bg-form-input dark:text-white dark:focus:border-primary">
            <FontAwesomeIcon icon={faPhone} className="h-5 w-5" />
          </span>
          <input
            type="text"
            id="phoneNumber"
            name="contactInfo.phoneNumber"
            value={formData.contactInfo.phoneNumber}
            onChange={handleChange}
            className="w-full rounded-lg border-[1.5px] border-stroke rounded-l-none border-l-0 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-lg border-r-0 border-[1.5px] border-stroke dark:border-form-strokedark bg-transparent text-black text-sm dark:bg-form-input dark:text-white dark:focus:border-primary">
            <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
          </span>
          <input
            type="text"
            id="emailAddress"
            name="contactInfo.emailAddress"
            value={formData.contactInfo.emailAddress}
            onChange={handleChange}
            className="w-full rounded-lg border-[1.5px] border-stroke rounded-l-none border-l-0 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mb-4">
        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
          LinkedIn
        </label>
        <input
          type="text"
          id="linkedin"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="googleMap" className="block text-sm font-medium
        text-gray-700">
        Google Map
      </label>
      <input
        type="text"
        id="googleMap"
        name="googleMap"
        value={formData.googleMap}
        onChange={handleChange}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
        Facebook
      </label>
      <input
        type="text"
        id="facebook"
        name="facebook"
        value={formData.facebook}
        onChange={handleChange}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
        Instagram
      </label>
      <input
        type="text"
        id="instagram"
        name="instagram"
        value={formData.instagram}
        onChange={handleChange}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
        WhatsApp
      </label>
      <input
        type="text"
        id="whatsapp"
        name="whatsapp"
        value={formData.whatsapp}
        onChange={handleChange}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
        Telegram
      </label>
      <input
        type="text"
        id="telegram"
        name="telegram"
        value={formData.telegram}
        onChange={handleChange}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>

    {/* About Us */}
    <div className="mb-4">
      <label htmlFor="aboutUs" className="block text-sm font-medium text-gray-700">
        About Us
      </label>
      <textarea
        id="aboutUs"
        name="aboutUs"
        value={formData.aboutUs}
        onChange={handleChange}
        rows={3}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>

    {/* Services Offered */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Services Offered</label>
      {formData.servicesOffered.map((service, index) => (
        <div key={index} className="flex items-center space-x-4">
          <input
            type="text"
            placeholder={`Service #${index + 1}`}
            value={service}
            onChange={(e) => handleServiceChange(e, index)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <button
            type="button"
            className="text-red-600 hover:text-red-700 focus:outline-none"
            onClick={() => handleRemoveService(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="mt-2 text-indigo-600 hover:text-indigo-700 focus:outline-none"
        onClick={handleAddService}
      >
        Add Service
      </button>
    </div>

    {/* Facilities and Amenities */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Facilities and Amenities</label>
      {formData.facilitiesAmenities.map((facility, index) => (
        <div key={index} className="flex items-center space-x-4">
          <input
            type="text"
            placeholder={`Facility #${index + 1}`}
            value={facility}
            onChange={(e) => handleFacilityChange(e, index)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <button
            type="button"
            className="text-red-600 hover:text-red-700 focus:outline-none"
            onClick={() => handleRemoveFacility(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="mt-2 text-indigo-600 hover:text-indigo-700 focus:outline-none"
        onClick={handleAddFacility}
      >
        Add Facility
      </button>
    </div>

    {/* Submit Button */}
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Company Info
                </button>
    </div>
    </form>
          </div>
        </div>
      </div>
    </div>
    </DefaultLayout>
  
  )
  : 
  (
    <div>Loading...</div>
  )}
  </>
);
};

export default UpdateCompanyInfo;
