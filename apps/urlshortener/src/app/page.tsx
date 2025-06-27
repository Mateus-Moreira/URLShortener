'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Index() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [message, setMessage] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLogged(!!Cookies.get('token'));
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLogged(false);
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setShortUrl('');
    setCopied(false);
    try {
      const token = Cookies.get('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(process.env.NEXT_PUBLIC_API_URLS_URL + '/urls', {
        method: 'POST',
        headers,
        body: JSON.stringify({ originalUrl }),
      });
      if (!res.ok) throw new Error('Erro ao encurtar URL');
      const data = await res.json();
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${data.shortUrl}`;
      setMessage('URL encurtada:');
      setShortUrl(url);
      setOriginalUrl('');
    } catch (err) {
      setMessage('Erro ao encurtar URL');
      setShortUrl('');
    }
  };

  const handleCopy = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative">
      <div className="absolute top-4 right-4 flex gap-2">
        {isLogged ? (
          <>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => router.push('/user')}
            >
              Usuário
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              onClick={handleLogout}
            >
              Sair
            </button>
          </>
        ) : (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => router.push('/login')}
          >
            Login
          </button>
        )}
      </div>
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
        {message && (
          <div className="mt-4 text-center text-green-600 flex flex-col items-center gap-2">
            <span>{message}</span>
            {shortUrl && (
              <div className="flex items-center gap-2 justify-center">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="border rounded px-2 py-1 w-56 text-center bg-gray-100"
                  style={{ cursor: 'pointer' }}
                  onClick={handleCopy}
                />
                <button
                  onClick={handleCopy}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
