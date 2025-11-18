'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { FaUserTie, FaLock, FaCrown } from 'react-icons/fa'

export default function OwnerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })
      if (authError) throw authError
      setTimeout(() => router.push('/owner/dashboard'), 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1a0033] via-[#330867] to-[#4a148c] flex justify-center items-center overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tr from-pink-400 via-purple-500 to-transparent opacity-40 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 flex justify-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl shadow-xl">
              <FaCrown className="text-white" size={44} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Owner Portal
          </h1>
          <p className="text-sm mt-2 text-gray-300">Manage orders & receive notifications</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl px-4 py-3 text-sm font-semibold">
            ❌ {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 font-semibold flex items-center gap-2 text-sm">
              <FaUserTie className="text-purple-400" /> Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="owner@example.com"
              className="rounded-xl px-5 py-3 bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white shadow-inner placeholder:text-gray-400 transition"
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-300 font-semibold flex items-center gap-2 text-sm">
              <FaLock className="text-pink-400" /> Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl px-5 py-3 bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 text-white shadow-inner placeholder:text-gray-400 transition"
              required 
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 text-lg flex items-center gap-3 justify-center disabled:opacity-50">
            <FaCrown /> {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex items-center justify-between mt-6 text-sm">
            <Link href="/customer/login" className="text-cyan-400 font-semibold hover:underline transition">
              ← Customer Login
            </Link>
            <Link href="/owner/signup" className="text-pink-400 font-semibold hover:underline transition">
              Sign Up →
            </Link>
          </div>
        </form>

        <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
          <p className="text-xs text-gray-300 font-semibold mb-2">🧪 Test Credentials:</p>
          <p className="text-xs text-gray-400"><strong>Email:</strong> owner@test.com</p>
          <p className="text-xs text-gray-400"><strong>Password:</strong> TestPassword123!</p>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function OwnerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (authError) throw new Error(authError.message)
      if (!data.user) throw new Error('Login failed')

      setTimeout(() => {
        router.push('/owner/dashboard')
      }, 300)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-8 text-center">
            <div className="text-5xl mb-2">👔</div>
            <h1 className="text-3xl font-bold text-white">Owner Login</h1>
            <p className="text-purple-100 mt-2">Manage orders & get notifications</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                <p className="text-red-800 font-semibold text-sm">❌ {error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="owner@example.com"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition placeholder:text-gray-500" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition placeholder:text-gray-500" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition duration-200 text-lg shadow-lg hover:shadow-xl"
              >
                {loading ? '⏳ Signing in...' : '✨ Sign In'}
              </button>
            </form>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl mt-6 border border-purple-200">
              <p className="font-bold text-gray-900 text-sm mb-2">🧪 Test Credentials:</p>
              <div className="space-y-1 text-sm text-gray-800">
                <p><span className="font-semibold">Email:</span> <code className="bg-white px-2 py-1 rounded border border-gray-200 font-mono text-xs">owner@test.com</code></p>
                <p><span className="font-semibold">Password:</span> <code className="bg-white px-2 py-1 rounded border border-gray-200 font-mono text-xs">TestPassword123!</code></p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <Link href="/customer/login" className="text-blue-600 hover:text-blue-700 font-bold">
                🛍️ Customer Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
