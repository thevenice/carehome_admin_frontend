import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface CardCareHomeFieldsProps {
  icon: IconDefinition
  title: string
  value: React.ReactNode | any
}

const CardCareHomeFields: React.FC<CardCareHomeFieldsProps> = ({
  icon,
  title,
  value,
}) => (
  <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="flex items-center">
      <FontAwesomeIcon
        icon={icon}
        className="text-xl text-gray-600 dark:text-gray-400"
      />
      <h5 className="ml-3 text-lg font-semibold text-black dark:text-white">
        {title}
      </h5>
    </div>

    <div className="mt-4">{value}</div>
  </div>
)

export default CardCareHomeFields
