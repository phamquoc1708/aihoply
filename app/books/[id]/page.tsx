import Chat from '@/components/Chat';
import { NextRequest } from 'next/server';
import React from 'react';

const getData = async (id) => {
  const rs = await import('../../api/book/route')
  const respone = await (await rs.GET({url: id} as NextRequest)).json();
  // const rs = await fetch(`/api/book`, {method: 'GET', body: JSON.stringify(id)});
  // const respone = await rs.json();

  return respone.data;
};

const Books = async ({ params }) => {
    const { id } = params;
    const data = await getData(id);

  return (
    <div className="book-list">
      <h1 className="text-left text-3xl font-bold mb-4 mt-6">{data.information.title}</h1>
      <div className='flex justify-between flex-wrap'>
        <p>{data.content}</p>
      </div>

      <div>
        <Chat idBook={data.information.idBook} />
      </div>
    </div>
  );
};

export default Books;