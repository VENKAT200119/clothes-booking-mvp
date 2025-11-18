'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { FaUserAlt, FaLock, FaRocket } from 'react-icons/fa'

export default function CustomerLogin() {
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
      setTimeout(() => router.push('/customer/dashboard'), 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex justify-center items-center overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tr from-pink-400 via-purple-500 to-transparent opacity-40 rounded-full blur-3xl"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 flex justify-center">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-4 rounded-2xl shadow-xl">
              <FaRocket className="text-white" size={44} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
            Customer Portal
          </h1>
          <p className="text-sm mt-2 text-gray-300">Login to browse & order custom clothes</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl px-4 py-3 text-sm font-semibold">
            ❌ {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 font-semibold flex items-center gap-2 text-sm">
              <FaUserAlt className="text-cyan-400" /> Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="rounded-xl px-5 py-3 bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white shadow-inner placeholder:text-gray-400 transition"
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-300 font-semibold flex items-center gap-2 text-sm">
              <FaLock className="text-purple-400" /> Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl px-5 py-3 bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white shadow-inner placeholder:text-gray-400 transition"
              required 
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 text-lg flex items-center gap-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <FaRocket /> {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex items-center justify-between mt-6 text-sm">
            <Link href="/owner/login" className="text-cyan-400 font-semibold hover:underline transition">
              Owner Login →
            </Link>
            <Link href="/customer/signup" className="text-purple-400 font-semibold hover:underline transition">
              Sign Up →
            </Link>
          </div>
        </form>

        <div className="mt-8 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
          <p className="text-xs text-gray-300 font-semibold mb-2">🧪 Test Credentials:</p>
          <p className="text-xs text-gray-400"><strong>Email:</strong> customer@test.com</p>
          <p className="text-xs text-gray-400"><strong>Password:</strong> TestPassword123!</p>
        </div>
      </div>
    </div>
  )
}

