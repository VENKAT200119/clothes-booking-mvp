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
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)
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

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setResetSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex justify-center items-center overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tr from-pink-400 via-purple-500 to-transparent opacity-40 rounded-full blur-3xl"></div>

        <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Reset Password</h1>
            <p className="text-gray-300 mt-2">Enter your email to receive a reset link</p>
          </div>

          {resetSuccess ? (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 rounded-xl px-4 py-3 mb-6">
              ✅ Check your email for the password reset link!
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl px-4 py-3 text-sm font-semibold">
                  ❌ {error}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="text-gray-300 font-semibold flex items-center gap-2 text-sm mb-2">
                    <FaUserAlt className="text-cyan-400" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={resetEmail} 
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white shadow-inner placeholder:text-gray-400 transition"
                    required 
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 text-lg">
                  {loading ? '⏳ Sending...' : '📧 Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <button
            onClick={() => setShowForgotPassword(false)}
            className="w-full mt-4 text-cyan-400 hover:text-cyan-300 font-semibold transition">
            ← Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex justify-center items-center overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tr from-pink-400 via-purple-500 to-transparent opacity-40 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-10">
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
          <div>
            <label className="text-gray-300 font-semibold flex items-center gap-2 text-sm mb-2">
              <FaUserAlt className="text-cyan-400" /> Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white shadow-inner placeholder:text-gray-400 transition"
              required 
            />
          </div>

          <div>
            <label className="text-gray-300 font-semibold flex items-center gap-2 text-sm mb-2">
              <FaLock className="text-purple-400" /> Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white shadow-inner placeholder:text-gray-400 transition"
              required 
            />
          </div>

          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition">
            Forgot Password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 text-lg flex items-center gap-3 justify-center disabled:opacity-50">
            <FaRocket /> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm mb-3">Don't have an account?</p>
          <Link href="/customer/signup">
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-lg">
              ✨ Create New Account
            </button>
          </Link>
        </div>

        <div className="flex items-center justify-center mt-6 text-sm">
          <Link href="/owner/login" className="text-cyan-400 font-semibold hover:underline transition">
            Owner Login →
          </Link>
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
          <p className="text-xs text-gray-300 font-semibold mb-2">🧪 Test Credentials:</p>
          <p className="text-xs text-gray-400"><strong>Email:</strong> customer@test.com</p>
          <p className="text-xs text-gray-400"><strong>Password:</strong> TestPassword123!</p>
        </div>
      </div>
    </div>
  )
}

