import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faArrowAltCircleRight,
  faAdd,
} from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../utils/axios';

const UsersTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    limit: 10,
    totalPages: 1,
    currentPage: 1,
  });
  const [selectedRole, setSelectedRole] = useState(''); // New state for selected role filter
  const [activeParam, setActiveParam] = useState("all"); // New state for selected role filter

  const fetchUsers = async () => {
    try {
      const params_to_send:any = {
        page: pagination.currentPage,
        limit: pagination.limit,
        role: selectedRole, // Pass selected role as a query parameter
      }
      if (activeParam !== "all") {
        params_to_send.active = activeParam === "active" ? true : false
      }
      const response = await axiosInstance.get('/admin/user', {
        params: params_to_send
      });
      if (response.data.success) {
        setUsers(response.data.data);
        setPagination({
          ...pagination,
          totalPages: response.data.totalPages,
          totalUsers: response.data.total,
          currentPage: response.data.currentPage,
        });
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, pagination.limit, selectedRole, activeParam]); // Add selectedRole to dependency array

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
    navigate(`/users/create`);
  };

  const handleViewUser = (userId:any) => {
    navigate(`/users/${userId}`);
  };

  const handleRoleChange = (event:any) => {
    setSelectedRole(event.target.value);
  };

  const handleActiveParamChange = (event:any) => {
    setActiveParam(event.target.value);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          All Users
        </h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1 text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded px-3 py-1.5 hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faAdd} />
            Create User
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
            value={selectedRole}
            onChange={handleRoleChange}
            className="px-2 py-1 border border-blue-300 rounded bg-blue-500 text-white"
          >
            <option value="">Filter by Role</option>
            <option value="INTERVIEW_CANDIDATE">Interview Candidate</option>
            <option value="ADMINISTRATOR">Administrator</option>
            <option value="CAREGIVER">Caregiver</option>
            <option value="RESIDENT">Resident</option>
            <option value="HEALTHCARE_PROFESSIONAL">Healthcare Professional</option>
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
              <th className="py-4 px-4 font-medium text-black dark:text-white text-left">Email</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Role</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Status</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Created At</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user:any, key) => (
              <tr
                key={user._id}
                className={`${
                  key === users.length - 1
                    ? ''
                    : 'border-b border-stroke dark:border-strokedark'
                }`}
              >
                <td className="py-4 px-4">
                  <p className="text-black dark:text-white text-sm truncate max-w-xs">{user.email}</p>
                </td>
                <td className="py-4 px-4 text-center">
                  <p className="text-black dark:text-white text-sm">{user.role}</p>
                </td>
                <td className="py-4 px-4 text-center">
                  <p className="text-black dark:text-white text-sm">
                    {user.active ? 'Active' : 'Inactive'}
                  </p>
                </td>
                <td className="py-4 px-4 text-center">
                  <p className="text-meta-5 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => handleViewUser(user._id)}
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

export default UsersTable;