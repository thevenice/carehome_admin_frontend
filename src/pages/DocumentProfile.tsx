// src/components/DocumentProfile.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStore from '../store/store'
import {
  faFile,
  faCalendarAlt,
  faUser,
  faEdit,
  faLink,
  faUsers,
  faArrowAltCircleRight,
} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../utils/axios'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import CardCareHomeFields from '../components/CardCareHomeFields'
import DefaultLayout from '../layout/DefaultLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface DocumentData {
  success: boolean
  data: {
    _id: string
    title: string
    createdBy: {
      _id: string
      email: string
      name: string
    }
    associatedUsers: Array<{
      _id: string
      email: string
      name: string
    }>
    uploadedAt: string
    __v: number
    link: string
  }
}

const DocumentProfile: React.FC = () => {
  const [documentData, setDocumentData] = useState<DocumentData | null>(null)
  const { document_id } = useParams<{ document_id: string }>()
  const { token } = useStore()
  const navigate = useNavigate()

  const handleViewUser = (userId: any) => {
    navigate(`/users/${userId}`)
  }

  const fetchDocumentData = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/documents?documentId=${document_id}`,
      )
      if (response.data.success) {
        setDocumentData(response.data)
      } else {
        console.error('Error:', response.data)
      }
    } catch (error) {
      console.error('Error fetching document data', error)
    }
  }

  useEffect(() => {
    fetchDocumentData()
  }, [document_id])

  const handleEditClick = () => {
    navigate(`/documents/update/${document_id}`)
  }

  return (
    <>
      {documentData ? (
        <DefaultLayout>
          <Breadcrumb pageName="Document Profile" />

          <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="mt-4">
                <div className="flex flex-col items-center">
                  <FontAwesomeIcon icon={faFile} className="text-6xl mb-4" />
                </div>

                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {documentData.data.title}
                </h3>
                <div className="flex justify-center mt-6 mb-2">
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-1 text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded px-3 py-1.5 hover:bg-blue-600"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit Document
                  </button>
                </div>
                <div className="mt-6.5">
                  <h4 className="mb-3.5 font-medium text-black dark:text-white">
                    DOCUMENT INFO:
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <CardCareHomeFields
                      icon={faFile}
                      title="Document ID"
                      value={documentData.data._id}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faFile}
                      title="Document Title"
                      value={documentData.data.title}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faUser}
                      title="Created By"
                      value={documentData.data.createdBy.name}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faCalendarAlt}
                      title="Uploaded At"
                      value={new Date(
                        documentData.data.uploadedAt,
                      ).toLocaleDateString()}
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faLink}
                      title="Document Link"
                      value={
                        <a
                          href={documentData.data.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Document
                        </a>
                      }
                      RedirectComponent=""
                    />
                    <CardCareHomeFields
                      icon={faUsers}
                      title="Associated Users"
                      value={documentData.data.associatedUsers
                        .map((user) => user.name)
                        .join(', ')}
                      RedirectComponent=""
                    />
                  </div>

                  <div className="mt-6.5">
                    <h4 className="mb-3.5 font-medium text-black dark:text-white">
                      ASSOCIATED USERS:
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {documentData.data.associatedUsers.map((user, index) => (
                        <CardCareHomeFields
                          key={index}
                          icon={faUser}
                          title={`User ${index + 1}`}
                          value={`${user.name} (${user.email})`}
                          RedirectComponent={
                            <button
                              onClick={() => handleViewUser(user._id)}
                              className="text-blue-500 hover:text-blue-600 pt-2"
                            >
                              <FontAwesomeIcon icon={faArrowAltCircleRight} />
                            </button>
                          }
                        />
                      ))}
                    </div>
                  </div>
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

export default DocumentProfile
