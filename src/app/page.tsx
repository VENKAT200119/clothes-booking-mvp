'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Custom Clothes Booking
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Order custom-tailored clothes from local artisans
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/customer/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
            >
              👤 I'm a Customer
            </Link>
            <Link
              href="/owner/login"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
            >
              👔 I'm an Owner
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Custom Designs</h3>
            <p className="text-gray-600">Upload your reference images and get perfectly tailored clothes</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Choose your preferred delivery slot and get it on time</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
            <p className="text-gray-600">Pay securely with Stripe. Money held until you're satisfied</p>
          </div>
        </div>
      </div>
    </div>
  )
}
