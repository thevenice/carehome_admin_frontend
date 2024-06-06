import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import SwitcherThreeWithProps from './Switchers/SwitcherThreeWithProps';

interface CareHomeActionsProps {
  isEnabled: boolean;
  onEditClick: () => void;
  onToggleClick: () => void;
}

const CareHomeActions: React.FC<CareHomeActionsProps> = ({
  isEnabled,
  onEditClick,
  onToggleClick
}) => {
  return (
    <div className="mx-auto mt-4.5 mb-5.5 max-w-94 border border-stroke py-2.5 shadow-default dark:border-strokedark dark:bg-boxdark rounded-md">
      <div className="flex justify-center text-xl items-center px-4">
        <h2>Actions</h2>
      </div>
      <div className="flex justify-between items-center px-4">
        <h2>Update Details:</h2>
        <button
          onClick={onEditClick}
          className="flex items-center gap-1 text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded px-3 py-1.5 hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faEdit} />
          Edit
        </button>
      </div>
      <div className="flex justify-between items-center px-4 mt-4">
        <h2>Change Status:</h2>
        <SwitcherThreeWithProps enabled={isEnabled} onChange={onToggleClick} />
      </div>
    </div>
  );
};

export default CareHomeActions;