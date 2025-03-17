import React from "react";
import { Link } from "react-router-dom";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        {/* Logo */}
        <Link to="/" className="text-primary text-xl font-bold">
          PaiperSum
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-primary">Home</Link>
          <Link to="/upload" className="text-gray-600 hover:text-primary">Upload</Link>
          <Link to="/settings" className="text-gray-600 hover:text-primary">Settings</Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600">
            {menuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white p-4 space-y-2 shadow-md">
          <Link to="/" className="block text-gray-600 hover:text-primary">Home</Link>
          <Link to="/upload" className="block text-gray-600 hover:text-primary">Upload</Link>
          <Link to="/settings" className="block text-gray-600 hover:text-primary">Settings</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
