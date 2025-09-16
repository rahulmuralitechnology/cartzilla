// src/app/account/reviews/page.tsx
'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHeart,
  faStar,
  faStarHalf,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Newsletter from '@/app/components/Newsletter'
import Breadcrumb from '@/app/components/Breadcrumb'
import Image from 'next/image'

// Review data
const reviewItems = [
  {
    id: 1,
    title: 'Apple iPad 10.2" 2021 Wi-Fi 64 GB Space Gray (MK2K3RK/A)',
    bonuses: 100,
    status: 'pending',
    image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=iPad',
    rating: 0
  },
  {
    id: 2,
    title: 'Laptop Apple MacBook Pro 13 M2',
    bonuses: 100,
    status: 'completed',
    image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=MacBook',
    rating: 5
  },
  {
    id: 3,
    title: 'Razer Opus X Mercury Headphones (RZ04-03760200-R3M1)',
    bonuses: 0,
    status: 'pending',
    image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Headphones',
    rating: 0
  },
  {
    id: 4,
    title: '3D virtual reality glasses VR Shinecon G10 for smartphones with a large screen',
    bonuses: 0,
    status: 'pending',
    image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=VR',
    rating: 0
  },
  {
    id: 5,
    title: 'Apple iPad Pro M2 2022 64 GB Space Gray',
    bonuses: 86,
    status: 'pending',
    image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=iPad+Pro',
    rating: 0
  },
  {
    id: 6,
    title: 'Mobile phone Apple iPhone 14 256GB Starlight',
    bonuses: 0,
    status: 'pending',
    image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=iPhone',
    rating: 0
  },
  {
    id: 7,
    title: 'Apple iPhone 14 128GB Blue',
    bonuses: 0,
    status: 'pending',
    image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=iPhone+14',
    rating: 0
  },
  {
    id: 8,
    title: 'VRB01 Camera Nikon Max',
    bonuses: 0,
    status: 'pending',
    image: 'https://via.placeholder.com/64x64/EEF1F6/333333?text=Camera',
    rating: 0
  }
]

export default function AccountReviewsPage() {
  const [reviews] = useState(reviewItems)
  const [sortBy, setSortBy] = useState('All reviews')

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <div key={i} className="w-3.5 h-3.5 text-yellow-400">
            <FontAwesomeIcon icon={faStar} />
          </div>
        )
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="w-3.5 h-3.5 text-yellow-400">
            <FontAwesomeIcon icon={faStarHalf} />
          </div>
        )
      } else {
        stars.push(
          <div key={i} className="w-3.5 h-3.5 text-gray-300">
            <FontAwesomeIcon icon={faStarRegular} />
          </div>
        )
      }
    }

    return stars
  }

  const leaveReview = (id: number) => {
    // Handle leave review logic
    console.log('Leave review for:', id)
  }

  const viewReview = (id: number) => {
    // Handle view review logic
    console.log('View review for:', id)
  }

  return (
    <>
      <Header />
      <div className="account-reviews-page bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Account', href: '/account' },
                { label: 'My reviews' }
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
                        <FontAwesomeIcon icon={faHeart} className="text-white text-xs" />
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
                  <div className="py-3 px-4 text-gray-700 flex items-center justify-between hover:bg-gray-50 rounded-md cursor-pointer">
                    <span>Payment methods</span>
                  </div>
                  <div className="bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-md flex items-center justify-between">
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

            {/* Reviews Content */}
            <main className="reviews-content flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">My reviews</h1>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Filter:</span>
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>All reviews</option>
                        <option>Pending reviews</option>
                        <option>Completed reviews</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="reviews-list space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-item border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                          <Image 
                            src={review.image} 
                            alt={review.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>

                        {/* Review Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                            {review.title}
                          </h3>
                          
                          {review.status === 'completed' ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="font-semibold text-gray-900">{review.bonuses} bonuses earned</span>
                            </div>
                          ) : review.bonuses > 0 ? (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-yellow-500">
                                <FontAwesomeIcon icon={faHeart} className="mr-1" />
                              </span>
                              <span className="font-semibold text-gray-900">+{review.bonuses} bonuses for a review</span>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">No bonuses available</div>
                          )}
                        </div>

                        {/* Review Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          {review.status === 'completed' ? (
                            <>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                              <button 
                                onClick={() => viewReview(review.id)}
                                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                              >
                                <span>View review</span>
                                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => leaveReview(review.id)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200"
                            >
                              Leave a review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 bg-gray-100 text-gray-900 font-medium rounded-md flex items-center justify-center">
                      1
                    </button>
                    <button className="w-8 h-8 bg-gray-50 text-gray-900 font-medium rounded-md flex items-center justify-center hover:bg-gray-100">
                      2
                    </button>
                    <button className="w-8 h-8 text-gray-600 font-medium rounded-md flex items-center justify-center hover:bg-gray-100">
                      3
                    </button>
                    <button className="w-8 h-8 text-gray-600 font-medium rounded-md flex items-center justify-center hover:bg-gray-100">
                      4
                    </button>
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