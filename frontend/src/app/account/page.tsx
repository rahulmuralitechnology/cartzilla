// src/app/account/page.tsx
'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faShoppingBasket,
  faCreditCard,
  faStar,
  faUser,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Newsletter from '@/app/components/Newsletter'
import Breadcrumb from '@/app/components/Breadcrumb'
import Link from 'next/link'

export default function AccountPage() {
  return (
    <>
      <Header />
      <div className="account-page bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Account' }
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
                  <Link href="/account/orders" className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Orders</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">3</span>
                  </Link>
                  <Link href="/account/wishlist" className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Wishlist</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">5</span>
                  </Link>
                  <Link href="/account/payment-methods" className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Payment methods</span>
                  </Link>
                  <Link href="/account/reviews" className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>My reviews</span>
                  </Link>
                </nav>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Manage account</h3>
                <nav className="space-y-1">
                  <Link href="/account/personal" className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Personal info</span>
                  </Link>
                  <Link href="/account/addresses" className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Addresses</span>
                  </Link>
                  <Link href="/account/notifications" className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Notifications</span>
                  </Link>
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

            {/* Account Dashboard Content */}
            <main className="account-dashboard-content flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Account Overview</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Recent Orders Card */}
                  <Link href="/account/orders" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faShoppingBasket} className="text-blue-600" />
                      </div>
                      <span className="text-blue-600 text-sm font-medium">3 orders</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Orders</h3>
                    <p className="text-gray-600 text-sm">Track, return, or buy things again</p>
                  </Link>

                  {/* Wishlist Card */}
                  <Link href="/account/wishlist" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faStar} className="text-pink-600" />
                      </div>
                      <span className="text-pink-600 text-sm font-medium">5 items</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Wishlist</h3>
                    <p className="text-gray-600 text-sm">Your saved items</p>
                  </Link>

                  {/* Payment Methods Card */}
                  <Link href="/account/payment-methods" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faCreditCard} className="text-green-600" />
                      </div>
                      <span className="text-green-600 text-sm font-medium">2 cards</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Methods</h3>
                    <p className="text-gray-600 text-sm">Manage your payment options</p>
                  </Link>

                  {/* Personal Info Card */}
                  <Link href="/account/personal" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-purple-600" />
                      </div>
                      <span className="text-purple-600 text-sm font-medium">Profile</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Info</h3>
                    <p className="text-gray-600 text-sm">Edit your personal details</p>
                  </Link>

                  {/* Reviews Card */}
                  <Link href="/account/reviews" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faFileAlt} className="text-yellow-600" />
                      </div>
                      <span className="text-yellow-600 text-sm font-medium">8 reviews</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Reviews</h3>
                    <p className="text-gray-600 text-sm">View and manage your reviews</p>
                  </Link>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faShoppingBasket} className="text-green-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #78A6431D409 placed</p>
                        <p className="text-xs text-gray-500">Feb 6, 2025</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">In progress</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faStar} className="text-pink-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Item added to wishlist</p>
                        <p className="text-xs text-gray-500">Feb 5, 2025</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faCreditCard} className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Payment method updated</p>
                        <p className="text-xs text-gray-500">Feb 3, 2025</p>
                      </div>
                    </div>
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