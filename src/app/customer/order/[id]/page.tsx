'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function OrderPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)

  async function handlePlaceOrder() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create order
      const { error } = await supabase.from('orders').insert({
        product_id: params.id,
        customer_id: user.id,
        owner_id: user.id, // Change this to actual owner
        status: 'pending',
        total_amount: 99.99,
        currency: 'USD',
        delivery_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })

      if (error) throw error

      router.push('/customer/dashboard')
    } catch (err) {
      console.error('Error placing order:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Place Your Order</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Customization Details</label>
              <textarea className="w-full p-4 border-2 border-gray-200 rounded-lg" placeholder="Describe your custom requirements..." rows={4}></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Upload Reference Image</label>
              <input type="file" accept="image/*" className="w-full p-4 border-2 border-gray-200 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Preferred Delivery Date</label>
              <input type="date" className="w-full p-4 border-2 border-gray-200 rounded-lg" />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-900"><span className="font-bold">Total Amount:</span> $99.99</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg"
              >
                {loading ? 'Processing...' : '✅ Place Order'}
              </button>
              <button 
                onClick={() => router.back()}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}