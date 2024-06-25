import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import axiosInstance from '../../utils/axios';

const CreateDocumentForm = () => {
  type FormData = {
    title: string;
    file: File | null;
    associatedUsers: { _id: string; name: string }[];
  };

  type FormErrors = {
    title?: string;
    file?: string;
  };

  const [formData, setFormData] = useState<FormData>({
    title: '',
    file: null,
    associatedUsers: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [previewFile, setPreviewFile] = useState<string | ArrayBuffer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchQuery) {
      const fetchUsers = async () => {
        try {
          const response = await axiosInstance.get(`/admin/user`, {
            params: {
              search_field: 'name', // Adjust based on backend implementation
              search_text: searchQuery,
            },
          });
          if (response.data.success) {
            setSearchResults(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = (user: { _id: string; name: string }) => {
    setFormData((prevState) => ({
      ...prevState,
      associatedUsers: [...prevState.associatedUsers, user],
    }));
  };

  const handleRemoveUser = (userId: string) => {
    setFormData((prevState) => ({
      ...prevState,
      associatedUsers: prevState.associatedUsers.filter((user) => user._id !== userId),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let validationErrors: FormErrors = {};

    if (!formData.title) {
      validationErrors.title = 'Title is required';
    }
    if (!formData.file) {
      validationErrors.file = 'File is required';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append('title', formData.title);
      if (formData.file) {
        dataToSend.append('file', formData.file);
      }
      formData.associatedUsers.forEach((user, index) => {
        dataToSend.append(`associatedUsers[${index}]`, user._id);
      });

      const response = await axiosInstance.post(`/admin/documents`, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Document created successfully');
      console.log('Document created:', response.data);

      setFormData({
        title: '',
        file: null,
        associatedUsers: [],
      });
      setErrors({});
      setPreviewFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create document');
    }
  };

  return (
    <div className="grid">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Create Document</h3>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  autoComplete="off"
                  placeholder="Enter title"
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.title ? 'border-red-500' : ''}`}
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                  Upload File
                </label>
                <div className="mt-2 flex items-center">
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept="application/pdf,image/*"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </div>
                {previewFile && (
                  <embed
                    src={previewFile.toString()}
                    type="application/pdf"
                    className="mt-2 rounded-md shadow-sm max-w-xs"
                    width="100%"
                    height="500px"
                  />
                )}
                {errors.file && (
                  <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="associatedUsers" className="block text-sm font-medium text-gray-700">
                  Associated Users
                </label>
                <input
                  type="text"
                  placeholder="Search users by name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto border border-stroke dark:border-strokedark rounded-md">
                    {searchResults.map((user:any) => (
                      <div
                        key={user.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-meta-4"
                        onClick={() => handleAddUser(user)}
                      >
                        {user.name}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  {formData.associatedUsers.map((user) => (
                    <div key={user._id} className="flex items-center mt-2">
                      <input
                        type="text"
                        name={`associatedUsers[${user._id}]`}
                        value={user.name}
                        readOnly
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <button
                        type="button"
                        className="ml-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => handleRemoveUser(user._id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDocumentForm;
