import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

const PlansTable = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [pagination, setPagination] = useState({
    total_plans: 0,
    limit: 10,
    total_pages: 0,
    current_page: 1,
  });

  const fetchPlans = async () => {
    try {
      const response = await axiosInstance.get(`/super/plans`, {
        params: {
          page: pagination.current_page,
          limit: pagination.limit,
        },
      });
      console.log("response: ", response)
      if (response.data.success) {

        setPlans(response.data.data);
        setPagination(response.data.pagination);
      } else {
        console.error('Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [pagination.current_page, pagination.limit]);

  const handlePreviousPage = () => {
    setPagination(prev => ({
      ...prev,
      current_page: Math.max(prev.current_page - 1, 1),
    }));
  };

  const handleNextPage = () => {
    setPagination(prev => ({
      ...prev,
      current_page: Math.min(prev.current_page + 1, prev.total_pages),
    }));
  };

  const handleViewPlan = (planId:any) => {
    // Navigate to plan details page or implement further action
    console.log('View Plan:', planId);
    navigate(`/plans/${planId}`);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          All Plans
        </h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            max="50"
            value={pagination.limit}
            onChange={(event) => setPagination({
              ...pagination,
              limit: parseInt(event.target.value, 10),
              current_page: 1,
            })}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
            placeholder="Limit"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
        <div className="p-2.5 xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Name</h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Description</h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Price</h5>
        </div>
        <div className="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Duration (months)</h5>
        </div>
        <div className="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Features</h5>
        </div>
      </div>

      {plans.map((plan:any) => (
        <div
          key={plan._id}
          className="grid grid-cols-3 sm:grid-cols-5 border-b border-stroke dark:border-strokedark"
        >
          <div className="flex items-center gap-3 p-2.5 xl:p-5">
            <p className="text-black dark:text-white">{plan.name}</p>
          </div>
          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white">{plan.description}</p>
          </div>
          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white">{plan.price}</p>
          </div>
          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-black dark:text-white">{plan.duration}</p>
          </div>
          <div className="flex items-center justify-center p-2.5 sm:p-5">
            <button
              onClick={() => handleViewPlan(plan._id)}
              className="text-blue-500 hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faArrowAltCircleRight} />
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={pagination.current_page === 1}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Previous
        </button>

        {pagination.current_page > 1 && (
          <button
            onClick={() => setPagination(prev => ({
              ...prev,
              current_page: pagination.current_page - 1,
            }))}
            className="px-4 py-2 text-sm font-medium text-black bg-white border border-stroke rounded hover:bg-gray-100"
          >
            {pagination.current_page - 1}
          </button>
        )}

        <button
          disabled
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded"
        >
          {pagination.current_page}
        </button>

        {pagination.current_page < pagination.total_pages && (
          <button
            onClick={() => setPagination(prev => ({
              ...prev,
              current_page: pagination.current_page + 1,
            }))}
            className="px-4 py-2 text-sm font-medium text-black bg-white border border-stroke rounded hover:bg-gray-100"
          >
            {pagination.current_page + 1}
          </button>
        )}

        <button
          onClick={handleNextPage}
          disabled={pagination.current_page === pagination.total_pages}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PlansTable;