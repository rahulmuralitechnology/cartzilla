// src/app/account/notifications/page.tsx
'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Newsletter from '@/app/components/Newsletter'
import Breadcrumb from '@/app/components/Breadcrumb'

export default function AccountNotificationsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    productSold: true,
    productUpdates: true,
    surveys: true,
    productReviews: true,
    companyNews: false,
    dailySummary: true
  })

  const [channelSettings, setChannelSettings] = useState({
    sms: false,
    whatsapp: true,
    email: true,
    push: true
  })

  const toggleNotification = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const toggleChannel = (channel: keyof typeof channelSettings) => {
    setChannelSettings(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }))
  }

  return (
    <>
      <Header />
      <div className="account-notifications-page bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Account', href: '/account' },
                { label: 'Notifications' }
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
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Addresses</span>
                  </div>
                  <div className="bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-md flex items-center justify-between">
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

            {/* Notifications Content */}
            <main className="notifications-content flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">Notifications</h1>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Toggle all</span>
                    <div 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.productSold ? 'bg-green-500' : 'bg-gray-300'}`}
                      onClick={() => {
                        const newState = !notificationSettings.productSold;
                        const updatedSettings = Object.fromEntries(
                          Object.keys(notificationSettings).map(key => [key, newState])
                        ) as typeof notificationSettings;
                        setNotificationSettings(updatedSettings);
                      }}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.productSold ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Switches */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Product sold notifications</h3>
                      <p className="text-sm text-gray-600">Send an email when someone purchased one of my product</p>
                    </div>
                    <div 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.productSold ? 'bg-green-500' : 'bg-gray-300'}`}
                      onClick={() => toggleNotification('productSold')}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.productSold ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Product update notifications</h3>
                      <p className="text-sm text-gray-600">Send an email when a product I`&apos;`ve purchased is updated</p>
                    </div>
                    <div 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.productUpdates ? 'bg-green-500' : 'bg-gray-300'}`}
                      onClick={() => toggleNotification('productUpdates')}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.productUpdates ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Surveys and tests</h3>
                      <p className="text-sm text-gray-600">Receive invitations to participate in surveys, consultations, and tool testing.</p>
                    </div>
                    <div 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.surveys ? 'bg-green-500' : 'bg-gray-300'}`}
                      onClick={() => toggleNotification('surveys')}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.surveys ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Product review notifications</h3>
                      <p className="text-sm text-gray-600">Send an email when someone leaves a review with his/her rating</p>
                    </div>
                    <div 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.productReviews ? 'bg-green-500' : 'bg-gray-300'}`}
                      onClick={() => toggleNotification('productReviews')}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.productReviews ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Company news and cooperation offers</h3>
                      <p className="text-sm text-gray-600">Receive company updates and special offers</p>
                    </div>
                    <div 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.companyNews ? 'bg-green-500' : 'bg-gray-300'}`}
                      onClick={() => toggleNotification('companyNews')}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.companyNews ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Daily summary emails</h3>
                      <p className="text-sm text-gray-600">Receive a daily summary of your account activity</p>
                    </div>
                    <div 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.dailySummary ? 'bg-green-500' : 'bg-gray-300'}`}
                      onClick={() => toggleNotification('dailySummary')}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.dailySummary ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Communication Channels */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Communication channels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span className="text-gray-700">SMS</span>
                      <div 
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${channelSettings.sms ? 'bg-green-500' : 'bg-gray-300'}`}
                        onClick={() => toggleChannel('sms')}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${channelSettings.sms ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span className="text-gray-700">Messages in WhatsApp</span>
                      <div 
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${channelSettings.whatsapp ? 'bg-green-500' : 'bg-gray-300'}`}
                        onClick={() => toggleChannel('whatsapp')}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${channelSettings.whatsapp ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span className="text-gray-700">Email</span>
                      <div 
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${channelSettings.email ? 'bg-green-500' : 'bg-gray-300'}`}
                        onClick={() => toggleChannel('email')}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${channelSettings.email ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span className="text-gray-700">App push notifications</span>
                      <div 
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${channelSettings.push ? 'bg-green-500' : 'bg-gray-300'}`}
                        onClick={() => toggleChannel('push')}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${channelSettings.push ? 'translate-x-6' : 'translate-x-1'}`}
                        />
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