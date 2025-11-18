'use client'

import { useRouter } from 'next/navigation'

export default function OwnerBookingsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">📅 Delivery Slots</h1>
          <button 
            onClick={() => router.push('/owner/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg">Delivery slots management coming soon!</p>
        </div>
      </main>
    </div>
  )
}