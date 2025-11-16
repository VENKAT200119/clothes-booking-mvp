'use client'

import { NotificationSetup } from '@/components/NotificationSetup'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Custom Clothes Booking MVP</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <NotificationSetup />
        </div>
      </div>
    </main>
  )
}
