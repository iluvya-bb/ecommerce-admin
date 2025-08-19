import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="bg-white shadow-md p-5 flex justify-between items-center">
      <div className="relative">
        <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex items-center">
        <FiBell className="mr-5 text-gray-600" />
        <div className="flex items-center">
          <span className="mr-3 font-medium text-gray-700">John Doe</span>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
