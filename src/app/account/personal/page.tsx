// src/app/account/personal/page.tsx
'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar,
  faCheckCircle,
  faEdit,
  faSave
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Newsletter from '@/app/components/Newsletter'
import Breadcrumb from '@/app/components/Breadcrumb'

export default function AccountPersonalPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    firstName: 'Susan',
    lastName: 'Gardner',
    dob: '1996-05-15',
    language: 'English',
    email: 'susan.gardner@email.com',
    phone: '+1 (805) 348 95 72',
    password: '************'
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically send the updated data to your backend
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <Header />
      <div className="account-personal-page bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Account', href: '/account' },
                { label: 'Personal Info' }
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
                  <div className="bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-md flex items-center justify-between">
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

            {/* Personal Info Content */}
            <main className="personal-info-content flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Personal info</h1>
                
                {/* Basic Info Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic info</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={userData.dob}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        name="language"
                        value={userData.language}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={isEditing ? handleSave : () => setIsEditing(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={isEditing ? faSave : faEdit} className="text-sm" />
                      {isEditing ? 'Save changes' : 'Edit'}
                    </button>
                    
                    {isEditing && (
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 my-6"></div>
                
                {/* Contact Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
                    <button className="text-blue-600 text-sm underline">Edit</button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600">{userData.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600">{userData.phone}</p>
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                      Verified
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 my-6"></div>
                
                {/* Password Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Password</h2>
                    <button className="text-blue-600 text-sm underline">Edit</button>
                  </div>
                  
                  <p className="text-gray-600">{userData.password}</p>
                </div>
                
                <div className="border-t border-gray-200 my-6"></div>
                
                {/* Delete Account Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Delete account</h2>
                  
                  <p className="text-gray-600 mb-4">
                    When you delete your account, your public profile will be deactivated immediately. 
                    If you change your mind before the 14 days are up, sign in with your email and password, 
                    and we`&apos;`ll send you a link to reactivate your account.
                  </p>
                  
                  <button className="text-red-600 font-medium underline">Delete account</button>
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