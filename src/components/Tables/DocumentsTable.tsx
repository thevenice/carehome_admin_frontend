import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faArrowAltCircleRight,
  faAdd,
} from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../utils/axios';

const DocumentsTable = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({
    totalDocuments: 0,
    limit: 10,
    totalPages: 1,
    currentPage: 1,
  });
   const [searchField, setSearchField] = useState('associatedUsers.email');
  const [searchText, setSearchText] = useState('');

  const fetchDocuments = async () => {
    try {
      const params_to_send:any = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search_field: searchField,
        search_text: searchText,
      };
      const response = await axiosInstance.get('/admin/documents', {
        params: params_to_send,
      });
      if (response.data.success) {
        setDocuments(response.data.data);
        setPagination({
          ...pagination,
          totalPages: response.data.totalPages,
          totalDocuments: response.data.total,
          currentPage: response.data.currentPage,
        });
      } else {
        console.error('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [pagination.currentPage, pagination.limit,  searchField, searchText]);

  const handlePreviousPage = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1),
    }));
  };

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages),
    }));
  };

  const handleLimitChange = (event:any) => {
    const newLimit = Math.max(1, Math.min(50, parseInt(event.target.value, 10)));
    setPagination((prev) => ({
      ...prev,
      limit: isNaN(newLimit) ? prev.limit : newLimit,
      currentPage: 1,
    }));
  };

  const handleCreateClick = () => {
    navigate(`/documents/create`);
  };

  const handleViewDocument = (documentId:any) => {
    navigate(`/documents/${documentId}`);
  };

  const handleSearchFieldChange = (event:any) => {
    setSearchField(event.target.value);
  };

  const handleSearchTextChange = (event:any) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          All Documents
        </h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1 text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded px-3 py-1.5 hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faAdd} />
            Create Document
          </button>
          <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
          <input
            type="number"
            min="1"
            max="50"
            value={pagination.limit}
            onChange={handleLimitChange}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
            placeholder="Limit"
          />

          <select
            value={searchField}
            onChange={handleSearchFieldChange}
            className="px-2 py-1 border border-blue-300 rounded bg-blue-500 text-white"
          >
            <option value="associatedUsers.email">Search by Email</option>
            {/* Add more search fields as needed */}
          </select>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchTextChange}
            className="px-2 py-1 border border-gray-300 rounded"
            placeholder="Search text"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
  <table className="w-full min-w-max table-auto">
    <thead>
      <tr className="bg-gray-2 dark:bg-meta-4">
        <th className="py-4 px-4 font-medium text-black dark:text-white text-left">Title</th>
        <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Uploaded At</th>
        <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Created By</th>
        <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Link</th>
        <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {documents.map((document:any, key) => (
        <tr
          key={document._id}
          className={`${
            key === documents.length - 1
              ? ''
              : 'border-b border-stroke dark:border-strokedark'
          }`}
        >
          <td className="py-4 px-4">
            <p className="text-black dark:text-white text-sm truncate max-w-xs">{document.title}</p>
          </td>
          <td className="py-4 px-4 text-center">
            <p className="text-meta-5 text-sm">{document.uploadedAt}</p>
          </td>
          <td className="py-4 px-4 text-center">
            <p className="text-black dark:text-white text-sm truncate max-w-xs">{document.createdBy.name}</p>
          </td>
          <td className="py-4 px-4 text-center">
            <p className="text-black dark:text-white text-sm truncate max-w-xs">{document.link}</p>
          </td>
          <td className="py-4 px-4 text-center">
            <button
              onClick={() => handleViewDocument(document._id)}
              className="text-blue-500 hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faArrowAltCircleRight} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
    </table>
    </div>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Previous
        </button>

        {pagination.currentPage > 1 && (
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: pagination.currentPage - 1,
              }))
            }
            className="px-4 py-2 text-sm font-medium text-black bg-white border border-stroke rounded hover:bg-gray-100"
          >
            {pagination.currentPage - 1}
          </button>
        )}

        <button
          disabled
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded"
        >
          {pagination.currentPage}
        </button>

        {pagination.currentPage < pagination.totalPages && (
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: pagination.currentPage + 1,
                }))
              }
              className="px-4 py-2 text-sm font-medium text-black bg-white border border-stroke rounded hover:bg-gray-100"
            >
              {pagination.currentPage + 1}
            </button>
          )}

          <button
            onClick={handleNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

export default DocumentsTable;