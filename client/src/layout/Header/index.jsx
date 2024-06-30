import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userName = localStorage.getItem('UserName');

  const handleLogout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('UserName');
    window.location.reload()
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getInitials = (name) => {
    if (!name) return '';
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  };

  return (
    <header className="bg-gradient-to-r from-teal-700 to-teal-500 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <div className="ml-2 text-white text-3xl font-semibold">SmartSchooler</div>
        </div>
        <div className="flex items-center">
          <nav className="flex space-x-4 items-center">
            <NavLink
              exact
              to="/"
              className="text-white hover:text-gray-300 transition duration-300 ease-in-out"
              activeClassName="border-b-2 border-white"
            >
              Home
            </NavLink>
            <NavLink
              to="/class"
              className="text-white hover:text-gray-300 transition duration-300 ease-in-out"
              activeClassName="border-b-2 border-white"
            >
              Class Management
            </NavLink>
            <NavLink
              to="/teacher"
              className="text-white hover:text-gray-300 transition duration-300 ease-in-out"
              activeClassName="border-b-2 border-white"
            >
              Teacher Management
            </NavLink>
            <NavLink
              to="/student"
              className="text-white hover:text-gray-300 transition duration-300 ease-in-out"
              activeClassName="border-b-2 border-white"
            >
              Student Management
            </NavLink>
            <NavLink
              to="/analytics"
              className="text-white hover:text-gray-300 transition duration-300 ease-in-out"
              activeClassName="border-b-2 border-white"
            >
              Analytics
            </NavLink>
            <div className="relative ml-4">
              <button
                className="bg-white text-teal-700 font-bold text-xl rounded-full h-10 w-10 flex items-center justify-center focus:outline-none"
                onClick={toggleDropdown}
              >
                {getInitials(userName)}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                  <div className="px-4 py-2 text-teal-700">{userName}</div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-teal-700 hover:bg-teal-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
