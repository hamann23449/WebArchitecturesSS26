"use client";
import { useRouter } from 'next/navigation';

/**
 * Convenience function to call fetch and include credentials.
 * If the server responds 401, this will remove the token cookie (if possible) and redirect to /login.
 * This file exports a function for direct import. Because Next's app router requires "use client" for navigation
 * we also export a wrapper hook to get router in components if needed.
 */
export async function authFetch(url, options = {}) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
  const full = url.startsWith('http') ? url : `${API}${url.startsWith('/') ? '' : '/'}${url}`;
  const opts = { credentials: 'include', ...options };

  const res = await fetch(full, opts);
  if (res.status === 401) {
    // try clear cookie by setting an expired cookie via an endpoint or instruct client to navigate to login
    // Best-effort: navigate to /login so user re-authenticates. Caller can also handle.
    if (typeof window !== 'undefined') {
      // remove cookie by setting document.cookie (will only affect non-HttpOnly cookies)
      document.cookie = 'token=; max-age=0; path=/';
      window.location.href = '/login';
    }
    return res;
  }
  return res;
}

export function useAuthFetch() {
  const router = useRouter();
  return async (url, options = {}) => {
    const res = await authFetch(url, options);
    if (res.status === 401) {
      router.push('/login');
    }
    return res;
  };
}
