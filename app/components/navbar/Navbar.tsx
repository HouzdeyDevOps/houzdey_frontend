import Link from 'next/link'
import React from 'react'
import {Search} from 'lucide-react'

const Navbar = () => {
  return (
    <div>
            {/* Header with Search */}
            <header className="p-4 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Houzdey
          </Link>
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Properties, Locations ..."
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search />
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <Link
              href="/create-listing"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create listing
            </Link>
            <Link href="/auth/signup" className="px-4 py-2">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Property Type Filters */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex gap-8 overflow-x-auto py-4">
            <li>
              <Link href="/" className="text-indigo-600">
                All
              </Link>
            </li>
            {["Apartments", "Bungalows", "Detached houses", "Duplexes", "Flats", "Mansions", "Office spaces", "Penthouses"].map((type) => (
              <li key={type}>
                <Link href={`/properties?type=${type.toLowerCase()}`} className="text-gray-600 hover:text-gray-900 dark:">
                  {type}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

    </div>
  )
}

export default Navbar
