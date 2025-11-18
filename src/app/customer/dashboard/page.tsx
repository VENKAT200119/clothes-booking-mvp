'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { FaShoppingBag, FaClipboardList, FaSignOutAlt, FaUser } from 'react-icons/fa'

export default function CustomerDashboard() {
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
      router.push('/customer/login')
      return
    }
    setUser(user)
    const { data } = await supabase.from('orders').select('*').eq('customer_id', user.id).order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-xl">
              <FaUser className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Customer Dashboard</h1>
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
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-500/30 text-white rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0]}! 👋</h2>
          <p className="text-cyan-100 text-lg">Browse products and place custom orders</p>
        </div>

        {/* Browse Products Button */}
        <div className="mb-8">
          <Link href="/customer/products">
            <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:scale-105 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-2xl transition-all flex items-center gap-3">
              <FaShoppingBag /> Browse Products & Place Order
            </button>
          </Link>
        </div>

        {/* Orders Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-b border-white/10 px-8 py-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaClipboardList /> Your Orders
            </h3>
            <p className="text-gray-300 text-sm mt-1">Track all your custom clothing orders</p>
          </div>
          
          <div className="p-8">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-300 text-lg font-semibold mb-2">No orders yet</p>
                <p className="text-gray-400 mb-6">Start by browsing our products!</p>
                <Link href="/customer/products">
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 text-white font-bold py-3 px-6 rounded-xl transition">
                    🛍️ Browse Products
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-cyan-400/50 transition">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">📋</span>
                          <p className="font-bold text-white text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Status</p>
                            <p className="font-bold text-white">{order.status === 'pending' && '⏳ Pending'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Amount</p>
                            <p className="font-bold text-green-400 text-lg">${order.total_amount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
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
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        if (!data || !data.user) {
          router.push('/customer/login');
          return;
        }
        setUser(data.user);
      } catch (err) {
        console.error('failed to get user', err);
        router.push('/customer/login');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadUser();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <main>
      <h1>Welcome, {user?.email ?? 'Customer'}</h1>
      <Link href="/customer/bookings">Your Bookings</Link>
    </main>
  );
}
