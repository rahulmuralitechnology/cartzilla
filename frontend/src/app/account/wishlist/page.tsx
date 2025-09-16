// src/app/account/wishlist/page.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHeart,
  faShoppingCart,
  faTrash,
  faCheckSquare,
  faSquare,
  faArrowRightArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Newsletter from '@/app/components/Newsletter'
import Breadcrumb from '@/app/components/Breadcrumb'

// Wishlist data
const wishlistItems = [
  {
    id: 1,
    title: 'VRB01 Virtual Reality Glasses',
    price: 340.99,
    oldPrice: 430.00,
    rating: 4.5,
    reviewCount: 123,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=VR+Glasses',
    discount: 21,
    selected: true
  },
  {
    id: 2,
    title: 'Apple iPhone 14 128GB White',
    price: 899.00,
    oldPrice: 960.00,
    rating: 4.8,
    reviewCount: 142,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=iPhone+14',
    selected: true
  },
  {
    id: 3,
    title: 'Smart Watch Series 7, White',
    price: 429.00,
    oldPrice: 960.00,
    rating: 4.3,
    reviewCount: 64,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Smart+Watch',
    selected: false
  },
  {
    id: 4,
    title: 'Tablet Apple iPad Air M1',
    price: 540.00,
    oldPrice: 640.00,
    rating: 4.6,
    reviewCount: 12,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=iPad+Air',
    discount: 16,
    selected: false
  },
  {
    id: 5,
    title: 'Headphones Apple AirPods 2 Pro',
    price: 224.00,
    oldPrice: 299.00,
    rating: 4.4,
    reviewCount: 78,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=AirPods+Pro',
    discount: 25,
    selected: false
  }
]

export default function AccountWishlistPage() {
  const [items, setItems] = useState(wishlistItems)
  const [sortBy, setSortBy] = useState('By date added')
  const [selectAll, setSelectAll] = useState(false)

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setItems(items.map(item => ({ ...item, selected: newSelectAll })))
  }

  const toggleItemSelection = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ))
  }

  const removeSelectedItems = () => {
    setItems(items.filter(item => !item.selected))
    setSelectAll(false)
  }

  const addToCart = (id: number) => {
    // Handle add to cart logic
    console.log('Add to cart:', id)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <div key={i} className="w-4 h-4 text-yellow-400">
            <FontAwesomeIcon icon={faHeart} />
          </div>
        )
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="w-4 h-4 text-yellow-400">
            <FontAwesomeIcon icon={faHeart} />
          </div>
        )
      } else {
        stars.push(
          <div key={i} className="w-4 h-4 text-gray-300">
            <FontAwesomeIcon icon={faHeartRegular} />
          </div>
        )
      }
    }

    return stars
  }

  const selectedCount = items.filter(item => item.selected).length

  return (
    <>
      <Header />
      <div className="account-wishlist-page bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Account', href: '/account' },
                { label: 'Wishlist' }
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
                  <div className="bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-md flex items-center justify-between">
                    <span>Wishlist</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">3</span>
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

            {/* Wishlist Content */}
            <main className="wishlist-content flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">Wishlist</h1>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Sort by:</span>
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>By date added</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Most popular</option>
                        <option>Highest rated</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Wishlist Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={toggleSelectAll}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      <FontAwesomeIcon icon={selectAll ? faCheckSquare : faSquare} />
                      {selectAll ? 'Unelect all' : 'Select all'}
                    </button>
                    <span className="text-sm text-gray-500">
                      {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        // Add selected to cart logic
                        items.filter(item => item.selected).forEach(item => addToCart(item.id))
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                      Add to cart
                    </button>
                    
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                      <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                      Relocate
                    </button>
                    
                    <button 
                      onClick={removeSelectedItems}
                      className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Remove selected
                    </button>
                  </div>
                </div>

                {/* Wishlist Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        {/* Product Image */}
                        <div className="aspect-w-1 aspect-h-1 w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden relative">
                          <Image 
                            src={item.image} 
                            alt={item.title}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>

                        {/* Discount Badge */}
                        {item.discount && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                            -{item.discount}%
                          </div>
                        )}

                        {/* Selection Checkbox */}
                        <button
                          onClick={() => toggleItemSelection(item.id)}
                          className="absolute top-3 right-3 w-6 h-6 bg-white rounded border flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                        >
                          {item.selected && (
                            <FontAwesomeIcon icon={faCheckSquare} className="text-blue-600 text-sm" />
                          )}
                        </button>
                      </div>

                      <div className="p-4">
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {renderStars(item.rating)}
                          </div>
                          <span className="text-xs text-gray-500">({item.reviewCount})</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 cursor-pointer">
                          {item.title}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                          {item.oldPrice && (
                            <span className="text-sm text-gray-500 line-through">${item.oldPrice.toFixed(2)}</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => addToCart(item.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <FontAwesomeIcon icon={faShoppingCart} />
                            Add to cart
                          </button>
                          
                          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors duration-200">
                            <FontAwesomeIcon icon={faTrash} className="text-gray-600 text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {items.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={faHeartRegular} className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">Start adding items you love to your wishlist</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors duration-200">
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>

              {/* Interesting Offers Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Interesting offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Sample offer cards - you can add real products here */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="aspect-w-1 aspect-h-1 w-full h-32 bg-gray-100 rounded-lg mb-3 relative">
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">Product image</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Special Offer Product</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">$199.99</span>
                      <span className="text-sm text-gray-500 line-through">$249.99</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="aspect-w-1 aspect-h-1 w-full h-32 bg-gray-100 rounded-lg mb-3 relative">
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">Product image</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Limited Time Deal</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">$299.99</span>
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