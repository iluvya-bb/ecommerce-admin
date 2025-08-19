import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBox, FiShoppingCart, FiUsers } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/', icon: <FiHome />, text: 'Dashboard' },
    { to: '/products', icon: <FiBox />, text: 'Products' },
    { to: '/orders', icon: <FiShoppingCart />, text: 'Orders' },
    { to: '/customers', icon: <FiUsers />, text: 'Customers' },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Admin</h2>
      </div>
      <nav className="flex-grow">
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center p-5 hover:bg-gray-700 transition-colors ${
                  location.pathname === link.to ? 'bg-gray-700' : ''
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;