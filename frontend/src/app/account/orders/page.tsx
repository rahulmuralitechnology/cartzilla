// src/app/account/orders/page.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronRight,
  faStar
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Newsletter from '@/app/components/Newsletter'
import Breadcrumb from '@/app/components/Breadcrumb'

// Order data
const orders = [
  {
    id: '78A6431D409',
    date: 'Feb 6, 2025',
    status: 'In progress',
    statusColor: 'blue',
    total: 2105.90,
    products: [
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+1' },
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+2' },
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+3' }
    ]
  },
  {
    id: '47H76G09F33',
    date: 'Dec 12, 2024',
    status: 'Delivered',
    statusColor: 'green',
    total: 360.75,
    products: [
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+4' }
    ]
  },
  {
    id: '502TR872W2',
    date: 'Nov 7, 2024',
    status: 'Delivered',
    statusColor: 'green',
    total: 4268.00,
    products: [
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+5' },
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+6' },
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+7' },
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+8' }
    ]
  },
  {
    id: '34VB5540K83',
    date: 'Sep 15, 2024',
    status: 'Canceled',
    statusColor: 'red',
    total: 987.50,
    products: [
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+9' },
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+10' }
    ]
  },
  {
    id: '112P45A90V2',
    date: 'May 12, 2024',
    status: 'Delivered',
    statusColor: 'green',
    total: 53.00,
    products: [
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+11' }
    ]
  },
  {
    id: '28BA67U0981',
    date: 'Apr 20, 2024',
    status: 'Canceled',
    statusColor: 'red',
    total: 1029.50,
    products: [
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+12' },
      { image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Prod+13' }
    ]
  }
]

export default function AccountOrdersPage() {
  const [timeFilter, setTimeFilter] = useState('For all time')
  const [statusFilter, setStatusFilter] = useState('Select status')
  const [currentPage, setCurrentPage] = useState(1)

  const getStatusIcon = (statusColor: string) => {
    switch (statusColor) {
      case 'blue':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      case 'green':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      case 'red':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
    }
  }

  return (
    <>
      <Header />
      <div className="account-orders-page bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Account', href: '/account' },
                { label: 'Orders' }
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
                  <div onClick={() => window.location.href = '/account/orders'} className="bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-md flex items-center justify-between">
                    <span>Orders</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">3</span>
                  </div>
                  <div onClick={() => window.location.href = '/account/wishlist'} className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Wishlist</span>
                  </div>
                  <div onClick={() => window.location.href = '/account/payment-methods'} className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Payment methods</span>
                  </div>
                  <div onClick={() => window.location.href = '/account/reviews'} className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
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

            {/* Orders Content */}
            <main className="orders-content flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">Orders</h1>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-md py-2 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Select status</option>
                      <option>In progress</option>
                      <option>Delivered</option>
                      <option>Canceled</option>
                    </select>
                    
                    <select 
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="border border-gray-300 rounded-md py-2 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>For all time</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Last year</option>
                    </select>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 text-sm font-medium text-gray-600">Order #</th>
                        <th className="text-left py-4 text-sm font-medium text-gray-600">Order date</th>
                        <th className="text-left py-4 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-4 text-sm font-medium text-gray-600">Total</th>
                        <th className="text-left py-4 text-sm font-medium text-gray-600">Products</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-200">
                          <td className="py-4 text-sm font-medium text-gray-900">{order.id}</td>
                          <td className="py-4 text-sm text-gray-700">{order.date}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.statusColor)}
                              <span className="text-sm text-gray-700">{order.status}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                          <td className="py-4">
                            <div className="flex items-center">
                              {order.products.slice(0, 3).map((product, index) => (
                                <div key={index} className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden -ml-2 first:ml-0 border-2 border-white">
                                  <Image 
                                    src={product.image} 
                                    alt={`Product ${index + 1}`} 
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                              ))}
                              {order.products.length > 3 && (
                                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center -ml-2 border-2 border-white">
                                  <span className="text-xs font-medium text-gray-700">+{order.products.length - 3}</span>
                                </div>
                              )}
                              <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 text-sm ml-2" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((page) => (
                      <button
                        key={page}
                        className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium ${
                          currentPage === page
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
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