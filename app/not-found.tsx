import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Not Found</h2>
        <p className="text-gray-600 mb-4">Could not find the requested resource</p>
        <Link 
          href="/"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
} 