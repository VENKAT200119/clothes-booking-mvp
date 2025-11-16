'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function NotificationSetup() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
    checkNotificationStatus()
  }, [])

  async function checkAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (err) {
      console.error('Auth check error:', err)
    }
  }

  async function checkNotificationStatus() {
    if (typeof window === 'undefined') return
    
    if ('Notification' in window && Notification.permission === 'granted') {
      setEnabled(true)
    }
  }

  async function enableNotifications() {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      // Check browser support
      if (typeof window === 'undefined') {
        throw new Error('This only works in the browser')
      }

      if (!('Notification' in window)) {
        throw new Error('This browser does not support notifications')
      }

      if (!('serviceWorker' in navigator)) {
        throw new Error('This browser does not support service workers')
      }

      // Check user is logged in
      if (!user) {
        throw new Error('You must be logged in to enable notifications')
      }

      // Request permission
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Notification permission was denied')
      }

      // Register service worker
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/',
        })
        console.log('Service Worker registered:', registration)
      } catch (swError) {
        console.warn('Service Worker registration warning (notifications may still work):', swError)
      }

      // Dynamically import Firebase
      const { initializeApp } = await import('firebase/app')
      const { getMessaging, getToken } = await import('firebase/messaging')

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      }

      const app = initializeApp(firebaseConfig)
      const messaging = getMessaging(app)

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      if (!vapidKey) {
        throw new Error('VAPID key is not configured')
      }

      // Get FCM token
      const token = await getToken(messaging, { vapidKey })
      if (!token) {
        throw new Error('Failed to generate FCM token')
      }

      console.log('FCM Token received:', token.substring(0, 20) + '...')

      // Save token to Supabase
      const { data, error: updateError } = await supabase
        .from('users')
        .update({ fcm_token: token })
        .eq('id', user.id)
        .select()

      if (updateError) {
        console.error('Supabase error:', updateError)
        throw new Error(`Failed to save token: ${updateError.message}`)
      }

      setEnabled(true)
      setMessage('✅ Notifications enabled successfully!')
      
      setTimeout(() => setMessage(null), 3000)
      console.log('✓ Notifications enabled')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
      console.error('Error enabling notifications (full error):', err)
      console.error('Error message:', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  async function disableNotifications() {
    try {
      if (!user) return

      const { error: updateError } = await supabase
        .from('users')
        .update({ fcm_token: null })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      setEnabled(false)
      setMessage('✅ Notifications disabled')
      
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
      console.error('Error disabling notifications:', err)
    }
  }

  return (
    <div className="p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
      <h3 className="text-lg font-bold mb-4 text-gray-900">🔔 Push Notifications</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4 text-sm">
          <p className="font-bold">❌ Error:</p>
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded mb-4 text-sm">
          {message}
        </div>
      )}

      {!user && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded mb-4 text-sm">
          ⚠️ You must be logged in to enable notifications
        </div>
      )}

      {!enabled ? (
        <button
          onClick={enableNotifications}
          disabled={loading || !user}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-bold transition duration-200 w-full"
        >
          {loading ? '⏳ Enabling...' : '📲 Enable Notifications'}
        </button>
      ) : (
        <div>
          <p className="text-green-700 mb-4 font-bold text-base">✅ Notifications are enabled!</p>
          <button
            onClick={disableNotifications}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition duration-200 w-full"
          >
            🔔 Disable Notifications
          </button>
        </div>
      )}

      <p className="text-sm text-gray-700 mt-4 leading-relaxed">
        📢 When customers place custom orders, you'll receive instant push notifications on your device. 
        Make sure your browser has notification permission granted.
      </p>

      <div className="text-xs text-gray-600 mt-3 p-2 bg-white rounded border border-gray-300">
        <p><strong>Tip:</strong> If you don't see a permission popup, check if notifications are already allowed or blocked in your browser settings.</p>
      </div>
    </div>
  )
}
