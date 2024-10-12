import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faAddressBook,
  faCog,
  faSignOutAlt,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons'

import UserOne from '../../images/user/user-01.png'
import Signout from '../Auth/Signout'
import useStore from '../../store/store'

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const { fetchLoggedUserData, userId } = useStore()
  const trigger = useRef<any>(null)
  const dropdown = useRef<any>(null)

  useEffect(() => {
    const getUserData = async () => {
      if (userId) {
        await fetchLoggedUserData()
        const fetchedUserData = useStore.getState().loggedUserData
        setUserData(fetchedUserData)
      }
    }

    getUserData()
  }, [userId, fetchLoggedUserData])

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return
      setDropdownOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {userData?.name || 'Loading...'}
          </span>
          <span className="block text-xs">
            {userData?.role || 'Loading...'}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full object-cover">
          {
            <img
              className="h-12 w-12 rounded-full object-cover"
              src={userData?.profile_picture || UserOne}
              alt="User"
            />
          }
        </span>

        <FontAwesomeIcon
          icon={faChevronDown}
          className="hidden sm:block fill-current"
        />
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              to="/profile"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <FontAwesomeIcon icon={faUser} className="fill-current" />
              My Profile
            </Link>
          </li>

        </ul>
        <div className="px-6 py-4">
          <Signout>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="mr-2 fill-current"
            />
            Sign Out
          </Signout>
        </div>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  )
}

export default DropdownUser
