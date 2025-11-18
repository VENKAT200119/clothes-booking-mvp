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
