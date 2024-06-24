import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import axiosInstance from '../utils/axios'

const UpdateDocumentProfile = () => {
  const { documentId } = useParams<{ documentId: string }>()

  const [formData, setFormData] = useState({
    title: '',
    file: null as File | null,
    link: null as string | null,
    associatedUsers: [] as { _id: string; name: string }[],
  })

  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<{ _id: string; name: string }[]>([])

  useEffect(() => {
    // Fetch document details and set initial form data
    axiosInstance
      .get(`/admin/documents?documentId=${documentId}`)
      .then((response) => {
        setFormData(response.data.data)
        
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching document details:', error)
        setLoading(false)
      })
  }, [documentId])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

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

  const handleAddUser = (user: { _id: string; name: string }) => {
    setFormData((prevState) => ({
      ...prevState,
      associatedUsers: [...prevState.associatedUsers, user],
    }))
  }

  const handleRemoveUser = (userId: string) => {
    setFormData((prevState) => ({
      ...prevState,
      associatedUsers: prevState.associatedUsers.filter((user) => user._id !== userId),
    }))
  }

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/admin/users?search=${searchQuery}`)
      setSearchResults(response.data.data)
    } catch (error) {
      console.error('Error searching users:', error)
      setSearchResults([])
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const dataToSend = new FormData()
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          const value = formData[key as keyof typeof formData]
          if (key === 'file' && formData.file) {
            dataToSend.append(key, formData.file)
          }
          if (key !== 'file' && value !== null) {
            if (key === 'associatedUsers') {
              dataToSend.append(key, JSON.stringify(value))
            } else {
              dataToSend.append(key, value)
            }
          }
        }
      }

      const response = await axiosInstance.put(
        `/admin/documents/${documentId}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      alert('Document updated successfully')
      console.log('Document updated:', response.data)
    } catch (error) {
      console.error('Error updating document:', error)
      alert('Failed to update document')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Update Document" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              Update Document
            </h3>
            <form onSubmit={handleSubmit} className="mt-6.5 space-y-6">
              <div className="space-y-2">
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.title && (
                    <span className="text-red-500">{errors.title}</span>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload File
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
                  {previewFile  && (
                    <>
                    <div className="mt-2">
                          {previewFile && <iframe src={previewFile} width="600" height="400" />}
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
                  {!previewFile && formData.link && (
                    <div className="mt-2">
                          {formData.link && <iframe src={formData.link} width="600" height="400" />}
                          {!formData.link && <p>No preview available.</p>}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="associatedUsers"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                      {searchResults.map((user) => (
                        <div
                          key={user._id}
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
                      <div
                        key={user._id}
                        className="flex items-center mt-2"
                      >
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
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update Document
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default UpdateDocumentProfile
