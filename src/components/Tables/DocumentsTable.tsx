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
  const [selectedType, setSelectedType] = useState(''); // New state for selected document type filter
  const [activeParam, setActiveParam] = useState('all'); // New state for selected status filter

  const fetchDocuments = async () => {
    try {
      const params_to_send:any = {
        page: pagination.currentPage,
        limit: pagination.limit,
        type: selectedType, // Pass selected type as a query parameter
      };
      if (activeParam !== 'all') {
        params_to_send.active = activeParam === 'active' ? true : false;
      }
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
  }, [pagination.currentPage, pagination.limit, selectedType, activeParam]);

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

  const handleTypeChange = (event:any) => {
    setSelectedType(event.target.value);
  };

  const handleActiveParamChange = (event:any) => {
    setActiveParam(event.target.value);
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
            value={selectedType}
            onChange={handleTypeChange}
            className="px-2 py-1 border border-blue-300 rounded bg-blue-500 text-white"
          >
            <option value="">Filter by Type</option>
            <option value="PDF">PDF</option>
            <option value="IMAGE">Image</option>
            <option value="TEXT">Text</option>
            {/* Add more document types as needed */}
          </select>
          <select
            value={activeParam}
            onChange={handleActiveParamChange}
            className="px-2 py-1 border border-blue-300 rounded bg-blue-500 text-white"
          >
            <option value="all">Filter by Active</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
            <p className="text-black dark:text-white text-sm truncate max-w-xs">{document.createdBy}</p>
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
    </div>
  );
};

export default DocumentsTable;