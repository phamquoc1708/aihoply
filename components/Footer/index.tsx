import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-4 px-6 text-center">
      <p>Copyright &copy; {currentYear} My Website</p>
    </footer>
  );
};

export default Footer;