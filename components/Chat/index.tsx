"use client";

import { useState } from "react";
import { PieChartIcon } from '@radix-ui/react-icons'

export default function Chat({idBook}) {
    const [query, setQuery] = useState('')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)

    async function createIndexAndEmbeddings() {
      try {
        const rs = await fetch('/api/setup', { method: 'POST' })
        const json = await rs.json();

        console.log('rs', json);
        
      } catch (err) {
        console.log('err', err);
        
      }
    }

    async function sendQuery() {
      if (!query) return;

      setResult('');
      setLoading(true);
      try {
        const rs = await fetch(`/api/read`, {method: 'POST', body: JSON.stringify({query, idBook})});
        const json = await rs.json();

        setResult(json.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        
        setLoading(true);
      }
    }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <h2 className="text-left text-xl font-bold mt-4 w-full">Asking AI</h2>  
      {
        loading && <PieChartIcon className='my-5 w-8 h-8 animate-spin' />
      }
      {
      result && (
      <div className="w-full my-4 bg-gray-300 py-4 rounded-xl">
        <p className='px-4'>{result}</p>
      </div>
      )
      }
      <div className="flex w-full">
        <input
          className='rounded-xl
          mt-3 flex-1
          rounded border
          text-black px-2 py-1' onChange={e => setQuery(e.target.value)} />
        <button
          className='mt-3 py-3 px-6 ml-2 bg-blue-500 text-white rounded-xl'
          onClick={sendQuery}>Submit</button>
      </div>
      { /* consider removing this button from the UI once the embeddings are created ... */}
      <button
        className='w-full mt-2 bg-red-500 text-white rounded-xl py-2 mb-20'
        onClick={createIndexAndEmbeddings}>Create index and embeddings</button>
    </div>
  );
}
