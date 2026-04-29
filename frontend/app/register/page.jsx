"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const { authFetch } = await import('../../../src/lib/authFetch');
      const res = await authFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.status === 409) return setError('E-Mail bereits vergeben.');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return setError(data.error || 'Fehler bei der Registrierung.');
      }
      // go to login after successful registration
      router.push('/login');
    } catch (err) {
      setError('Fehler bei der Registrierung.');
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrieren</h1>
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
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Registrieren</button>
          <a href="/login" className="text-sm accent">Login</a>
        </div>
      </form>
    </div>
  );
}
