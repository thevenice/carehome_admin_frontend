import { useState, ChangeEvent, FormEvent, useRef } from 'react'
import axiosInstance from '../../utils/axios'

const CreateDocumentForm = () => {
  type FormData = {
    title: string
    file: File | null
  }

  type FormErrors = {
    title?: string
    file?: string
  }

  const [formData, setFormData] = useState<FormData>({
    title: '',
    file: null,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [previewFile, setPreviewFile] = useState<string | ArrayBuffer | null>()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        file,
      }))

      // Create object URL for previewing the file
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewFile(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Perform validation
    let validationErrors: FormErrors = {}

    if (!formData.title) {
      validationErrors.title = 'Title is required'
    }
    if (!formData.file) {
      validationErrors.file = 'File is required'
    }

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      const dataToSend = new FormData()
      dataToSend.append('title', formData.title)
      if (formData.file) {
        dataToSend.append('file', formData.file)
      }

      const response = await axiosInstance.post(`/admin/documents`, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWM3ZTgzNzg5Mjk0YmUwOTA2NDY2ZiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6IkFETUlOSVNUUkFUT1IiLCJpYXQiOjE3MTg5NDM4NzgsImV4cCI6MTcxODk3MjY3OH0.ELPyYFwmt5Wc_NmQ2-T9VcygSBdLog_lt-EPBRoMrBI`
        },
      })
      alert('Document created successfully')
      console.log('Document created:', response.data)

      // Clear form data upon successful submission
      setFormData({
        title: '',
        file: null,
      })
      setErrors({})
      setPreviewFile(null)

      // Reset file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create document')
    }
  }

  return (
    <div className="grid">
      <div className="flex flex-col gap-9">
        {/* Create Document */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Create Document
            </h3>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
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

              {/* File Upload */}
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

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Document
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateDocumentForm