import React from 'react';
import {Book} from '../components/index';

const getData = async () => {
  const rs = await import('./api/book/route')
  const json = await (await rs.GET()).json();

  return json.data;
};

export default async function Home() {

  const books = await getData();

  return (
    <div className="book-list">
      <h1 className="text-left font-bold text-2xl py-6">Book List:</h1>
      <div className='flex justify-between flex-wrap'>
        {books.map((book) => (
            <Book key={book.title} {...book} />
        ))}
      </div>
    </div>
  );
}
