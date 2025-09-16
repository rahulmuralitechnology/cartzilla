// src/app/account/addresses/page.tsx
'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Newsletter from '@/app/components/Newsletter'
import Breadcrumb from '@/app/components/Breadcrumb'

// Address data
const addresses = [
  {
    id: 1,
    title: 'Shipping address',
    isPrimary: true,
    address: '396 Lillian Bolavandy, Holbrook',
    city: 'New York 11741, USA'
  },
  {
    id: 2,
    title: 'Alternative shipping address',
    isPrimary: false,
    address: '514 S. Magnolia St., Orlando',
    city: 'Florida 32806, USA'
  }
]

export default function AccountAddressesPage() {
  // const [isEditing, setIsEditing] = useState(false)
  const [addressData, setAddressData] = useState(addresses)

  const handleEdit = (id: number) => {
    // setIsEditing(true)
    // Here you would typically open a modal or form to edit the address
    setAddressData(addressData)
    console.log(`Editing address with id: ${id}`)
  }

  return (
    <>
      <Header />
      <div className="account-addresses-page bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Account', href: '/account' },
                { label: 'Addresses' }
              ]} 
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Account Sidebar */}
            <aside className="account-sidebar w-full lg:w-80 shrink-0">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-semibold text-lg">S</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Susan Gardner</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faStar} className="text-white text-xs" />
                      </span>
                      100 bonuses available
                    </div>
                  </div>
                </div>

                <nav className="space-y-1">
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Orders</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">3</span>
                  </div>
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Wishlist</span>
                  </div>
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Payment methods</span>
                  </div>
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>My reviews</span>
                  </div>
                </nav>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Manage account</h3>
                <nav className="space-y-1">
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Personal info</span>
                  </div>
                  <div className="bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-md flex items-center justify-between">
                    <span>Addresses</span>
                  </div>
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Notifications</span>
                  </div>
                </nav>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Customer service</h3>
                <nav className="space-y-1">
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Help center</span>
                  </div>
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Terms and conditions</span>
                  </div>
                  <div className="py-3 px-4 text-red-600 flex items-center justify-between hover:bg-red-50 rounded-md cursor-pointer">
                    <span>Log out</span>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Addresses Content */}
            <main className="addresses-content flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Addresses</h1>
                
                {/* Addresses List */}
                <div className="space-y-6">
                  {addressData.map((address) => (
                    <div key={address.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-4">
                            <h2 className="text-lg font-semibold text-gray-900">{address.title}</h2>
                            {address.isPrimary && (
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => handleEdit(address.id)}
                            className="text-blue-600 text-sm underline"
                          >
                            Edit
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-gray-600">{address.address}</p>
                          <p className="text-gray-600">{address.city}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add New Address Button */}
                <div className="mt-8">
                  <button className="flex items-center gap-2 text-gray-800 font-medium">
                    <FontAwesomeIcon icon={faPlus} className="text-sm" />
                    Add address
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>

        <Newsletter />
        <Footer />
      </div>
    </>
  )
}