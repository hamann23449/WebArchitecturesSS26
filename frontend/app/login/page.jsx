"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const { authFetch } = await import('../../../src/lib/authFetch');
      const res = await authFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.status === 401) return setError('E-Mail oder Passwort ungültig.');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return setError(data.error || 'Fehler beim Login.');
      }
      // success -> redirect
      router.push('/');
    } catch (err) {
      setError('Fehler beim Login.');
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">E-Mail</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full" />
        </div>
        <div>
          <label className="block text-sm">Passwort</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full" />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex items-center justify-between">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
          <a href="/register" className="text-sm accent">Registrieren</a>
        </div>
      </form>
    </div>
  );
}
