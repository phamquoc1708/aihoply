"use client"
import React from 'react';
import Image from 'next/image'
import Link from 'next/link'

const Book = ({_id , title, article, yearRelease, category, idBook }) => {
    const imgSrc = require(`../../app/assets/${idBook}.png`)

  return (
    <div className="relative text-center flex justify-center w-[26%] text-gray-500">
      <div className='relative z-10'>
          <Image className='h-400' src={imgSrc} alt="" width="150" height="200" />
      </div>
      <div className='absolute top-[30%] w-full pt-40 shadow-xl rounded-lg shadow-[rgba(0,0,15,0.5)_0px_0px_3px_0px]'>
        <div className='bg-white'>
          <h2 className="text-xl text-center text-black">{title}</h2>
          <p className='italic text-sm'>by {article}</p>
          <p>Release: {yearRelease}</p>
          <p>{category}</p>
        </div>
        <Link href={`/books/${_id}`} className='bg-yellow-500 block py-3 text-white mt-6 cursor-pointer rounded-lg'>Read Now</Link>
      </div>
    </div>
  );
};

export default Book;
