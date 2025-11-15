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

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Enable notifications on this page</li>
            <li>Create an order via your API</li>
            <li>Receive push notification instantly</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
