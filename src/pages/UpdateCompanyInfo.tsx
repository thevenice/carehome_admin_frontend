import React, { ChangeEvent, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';

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
            className="sr-only"
            onChange={handleLogoChange}
          />
          <label
            htmlFor="logo"
            className="cursor-pointer border border-gray-300 rounded-md py-1 px-3 flex items-center space-x-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <span>Choose a file</span>
            <span className="text-gray-500">(PNG, JPG, GIF)</span>
          </label>
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
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
          </span>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="flex-1 block w-full min-w-0 border-gray-300 rounded-none rounded-r-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Contact Information Fields */}
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            <FontAwesomeIcon icon={faPhone} className="h-5 w-5" />
          </span>
          <input
            type="text"
            id="phoneNumber"
            name="contactInfo.phoneNumber"
            value={formData.contactInfo.phoneNumber}
            onChange={handleChange}
            className="flex-1 block w-full min-w-0 border-gray-300 rounded-none rounded-r-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
          </span>
          <input
            type="text"
            id="emailAddress"
            name="contactInfo.emailAddress"
            value={formData.contactInfo.emailAddress}
            onChange={handleChange}
            className="flex-1 block w-full min-w-0 border-gray-300 rounded-none rounded-r-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="flex-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="flex-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
    <div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update Company Info
      </button>
    </div>
  </form>
);
};

export default UpdateCompanyInfo;
