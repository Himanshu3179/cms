import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-300 text-black py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="/privacy-policy" className="text-sm hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-sm hover:text-gray-700">
              Terms of Service
            </a>
            <a href="/contact" className="text-sm hover:text-gray-700">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
