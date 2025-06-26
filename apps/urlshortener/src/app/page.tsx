'use client';
import { useState } from 'react';

export default function Index() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:3002/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      });
      if (!res.ok) throw new Error('Erro ao encurtar URL');
      const data = await res.json();
      setMessage(`URL encurtada: ${window.location.origin}/${data.shortUrl}`);
      setOriginalUrl('');
    } catch (err) {
      setMessage('Erro ao encurtar URL');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Encurtador de URL</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="url"
            className="border rounded px-3 py-2"
            placeholder="Cole sua URL original aqui..."
            value={originalUrl}
            onChange={e => setOriginalUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
          >
            Encurtar URL
          </button>
        </form>
        {message && <div className="mt-4 text-center text-green-600">{message}</div>}
      </div>
    </div>
  );
}
