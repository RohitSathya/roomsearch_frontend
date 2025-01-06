import React from "react";
import { FaAngleUp, FaWhatsapp } from "react-icons/fa";

const Footer2 = () => {
  return (
    <div className="bg-white py-4 text-gray-400 text-sm">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center px-6">
        {/* Left Section */}
        <div className="text-center lg:text-left mb-4 lg:mb-0">
          &copy; 2024 – BROROOMS DESIGNED BY
          <a
            // Replace with the actual link
             href="https://wa.me/7052923068"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 ml-1 hover:underline"
          >
            Apex Network
          </a>
        </div>

        {/* Center Section */}
      

        {/* WhatsApp Section */}
        <div className="flex items-center mt-4 lg:mt-0">
          <a
            // WhatsApp link with the number
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition duration-300 space-x-2"
          >
            <FaWhatsapp size={20} />
            <span>Contact Us</span>
          </a>
        </div>

        {/* Right Section */}
        <div className="fixed bottom-6 right-6">
          <button
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-orange-500 transition duration-300"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <FaAngleUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer2;
