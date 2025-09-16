// src/app/account/payment-methods/page.tsx
'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCreditCard,
  faPlus,
  faEdit,
  faTrash,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Newsletter from '@/app/components/Newsletter'
import Breadcrumb from '@/app/components/Breadcrumb'

// Payment methods data
const paymentMethods = [
  {
    id: 1,
    type: 'mastercard',
    lastFour: '8341',
    expiration: '05/24',
    isPrimary: true,
    isExpired: true
  },
  {
    id: 2,
    type: 'visa',
    lastFour: '1276',
    expiration: '01/27',
    isPrimary: false,
    isExpired: false
  }
]

export default function AccountPaymentMethodsPage() {
  const [methods, setMethods] = useState(paymentMethods)

  const setAsPrimary = (id: number) => {
    setMethods(methods.map(method => ({
      ...method,
      isPrimary: method.id === id
    })))
  }

  const removeMethod = (id: number) => {
    setMethods(methods.filter(method => method.id !== id))
  }

  const addPaymentMethod = () => {
    // Handle add payment method logic
    console.log('Add payment method')
  }

  const renderCardLogo = (type: string) => {
    switch (type) {
      case 'mastercard':
        return (
          <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
            <div className="w-8 h-5 relative">
              <div className="absolute left-0 top-0 w-3 h-5 bg-red-600 rounded-l-full"></div>
              <div className="absolute right-0 top-0 w-3 h-5 bg-orange-400 rounded-r-full"></div>
              <div className="absolute left-2 top-0 w-2 h-5 bg-gray-300 opacity-50"></div>
            </div>
          </div>
        )
      case 'visa':
        return (
          <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
            <div className="w-8 h-4 bg-blue-900 relative">
              <div className="absolute top-1 left-1 w-1 h-2 bg-white"></div>
              <div className="absolute top-1 left-3 w-1 h-2 bg-white"></div>
              <div className="absolute top-1 left-5 w-1 h-2 bg-white"></div>
            </div>
          </div>
        )
      default:
        return (
          <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
            <FontAwesomeIcon icon={faCreditCard} className="text-gray-600" />
          </div>
        )
    }
  }

  return (
    <>
      <Header />
      <div className="account-payment-methods-page bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Account', href: '/account' },
                { label: 'Payment Methods' }
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
                        <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xs" />
                      </span>
                      100 bonuses available
                    </div>
                  </div>
                </div>

                <nav className="space-y-1">
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Orders</span>
                  </div>
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Wishlist</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">3</span>
                  </div>
                  <div className="bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-md flex items-center justify-between">
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
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
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

            {/* Payment Methods Content */}
            <main className="payment-methods-content flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">Payment Methods</h1>
                </div>

                {/* Payment Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {methods.map((method) => (
                    <div key={method.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                      <div className="flex flex-col gap-4">
                        {/* Card Header */}
                        <div className="flex items-center justify-between">
                          {renderCardLogo(method.type)}
                          {method.isPrimary && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              Primary
                            </span>
                          )}
                          {method.isExpired && (
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                              Expired
                            </span>
                          )}
                        </div>

                        {/* Card Details */}
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            **** **** **** {method.lastFour}
                          </h3>
                          <p className={`text-sm ${method.isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                            Expires {method.expiration}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          {!method.isPrimary && (
                            <button
                              onClick={() => setAsPrimary(method.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Set as primary
                            </button>
                          )}
                          <button className="text-sm text-gray-600 hover:text-gray-800">
                            <FontAwesomeIcon icon={faEdit} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => removeMethod(method.id)}
                            className="text-sm text-red-600 hover:text-red-800 ml-auto"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Payment Method Card */}
                  <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors duration-300">
                    <button
                      onClick={addPaymentMethod}
                      className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faPlus} className="text-xl" />
                      </div>
                      <span className="font-medium">Add payment method</span>
                    </button>
                  </div>
                </div>

                {/* Empty State */}
                {methods.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={faCreditCard} className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
                    <p className="text-gray-600 mb-6">Add your first payment method to get started</p>
                    <button 
                      onClick={addPaymentMethod}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors duration-200"
                    >
                      Add Payment Method
                    </button>
                  </div>
                )}
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