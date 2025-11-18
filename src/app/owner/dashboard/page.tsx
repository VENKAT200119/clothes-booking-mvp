'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { FaBell, FaClipboardList, FaSignOutAlt, FaCrown } from 'react-icons/fa'

export default function OwnerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/owner/login')
      return
    }
    setUser(user)
    const { data } = await supabase.from('orders').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#330867] to-[#4a148c] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-4"></div>
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#330867] to-[#4a148c]">
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <FaCrown className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
              <p className="text-sm text-gray-300">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-xl transition shadow-lg flex items-center gap-2">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 text-white rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3"><FaBell /> Welcome, {user?.email?.split('@')[0]}!</h2>
          <p className="text-purple-100 text-lg">Manage orders & get notifications</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10 px-8 py-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaClipboardList /> Incoming Orders
            </h3>
          </div>
          <div className="p-8">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-300 text-lg font-semibold">No orders yet</p>
                <p className="text-gray-400">When customers place orders, they'll appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
                    <p className="font-bold text-white text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-gray-400">Amount: <span className="text-green-400 font-bold">${order.total_amount}</span></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { NotificationSetup } from '@/components/NotificationSetup'

export default function OwnerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/owner/login')
      return
    }

    setUser(user)

    // Fetch owner's orders
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    setOrders(data || [])
    setLoading(false)
  }

  async function updateOrderStatus(orderId: string, status: string) {
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    // Refresh orders
    checkAuth()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">👔 Owner Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-2">Welcome, {user?.email}</h2>
          <p className="text-gray-600">Manage your orders and receive notifications</p>
        </div>

        {/* Notifications Setup */}
        <div className="mb-8">
          <NotificationSetup />
        </div>

        {/* Incoming Orders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">📥 Incoming Orders</h3>
          
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders yet. When customers place orders, they'll appear here.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border p-4 rounded-lg hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">Status: <span className="font-bold text-blue-600">{order.status}</span></p>
                      <p className="text-sm text-gray-600">Amount: ${order.total_amount}</p>
                      <p className="text-sm text-gray-600">Delivery Deadline: {order.delivery_deadline}</p>
                    </div>
                    <div className="space-x-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                          >
                            ✅ Accept
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'rejected')}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                      {order.status === 'accepted' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                        >
                          ✨ Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
