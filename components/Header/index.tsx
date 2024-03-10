import React from 'react';
import Link from 'next/link'

const Header = () => {

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold cursor-pointer">My Website</Link>
        <nav>
        <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-gray-400">Home</a></li>
            <li><a href="#" className="hover:text-gray-400">About</a></li>
            <li><a href="#" className="hover:text-gray-400">Contact</a></li>
        </ul>
        </nav>
    </header>

  );
};

export default Header;