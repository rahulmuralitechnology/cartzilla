// src/app/products/iphone-14-plus/reviews/page.tsx
'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faStarHalfAlt, 
  faShoppingCart,
  faHeart,
  faChevronRight,
  faChevronLeft,
  faPlus,
  faMinus,
  faTruck,
  faStore,
  faReply,
  faThumbsUp,
  faThumbsDown
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import OptimizedImage from '../../../components/Image'
import Breadcrumb from '../../../components/Breadcrumb'
import Header from '../../../components/Header'
import Newsletter from '../../../components/Newsletter'
import Footer from '../../../components/Footer'

export default function IPhoneReviewsPage() {
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [sortBy, setSortBy] = useState('popular')
  const [onlyVerified, setOnlyVerified] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const product = {
    id: 1,
    title: 'Apple iPhone 14 Plus 128GB Blue',
    price: 940.00,
    oldPrice: 956.00,
    rating: 4.1,
    reviewCount: 68,
    image: 'https://via.placeholder.com/110x110/EEF1F6/333333?text=iPhone+14',
    ratingDistribution: {
      5: 37,
      4: 16,
      3: 9,
      2: 4,
      1: 2
    }
  }

  const reviews = [
    {
      id: 1,
      author: 'Rafael Marquez',
      rating: 5,
      comment: 'The phone has a new A15 Bionic chip, which makes it lightning-fast and responsive. The camera system has also been upgraded, and it now includes a 12-megapixel ultra-wide lens and a 12-megapixel wide lens.',
      date: 'June 28, 2023',
      verified: true,
      color: 'Blue',
      model: '128GB',
      likes: 0,
      dislikes: 0,
      replies: []
    },
    {
      id: 2,
      author: 'Ronald Richards',
      rating: 4,
      comment: 'The phone also has 5G connectivity, which makes it future-proof. Overall, the iPhone 14 is an excellent phone for anyone looking for a premium device with great features.',
      date: 'June 8, 2023',
      verified: true,
      color: 'Black',
      model: '256GB',
      likes: 0,
      dislikes: 0,
      pros: '12-megapixel ultra-wide lens and a 12-megapixel wide lens',
      cons: 'Does not have a headphone jack',
      replies: [
        {
          id: 1,
          author: 'Cartzilla Company',
          comment: 'Thank you for your feedback! We are glad that you were satisfied with your purchase :)',
          date: 'June 12, 2023',
          isCompany: true
        }
      ]
    },
    {
      id: 3,
      author: 'Kristin Watson',
      rating: 5,
      comment: 'The phone has a new A15 Bionic chip, which makes it lightning-fast and responsive. The camera system has also been upgraded, and it now includes a 12-megapixel ultra-wide lens and a 12-megapixel wide lens. The battery life is excellent, and it can easily last a whole day of heavy use.',
      date: 'May 17, 2023',
      verified: true,
      color: 'Blue',
      model: '128GB',
      likes: 0,
      dislikes: 0,
      replies: []
    },
    {
      id: 4,
      author: 'Jenny Wilson',
      rating: 4,
      comment: 'The phone also has 5G connectivity, which makes it future-proof. Overall, the iPhone 13 is an excellent phone for anyone looking for a premium device with great features.',
      date: 'May 28, 2023',
      verified: true,
      color: 'Red',
      model: '64GB',
      likes: 0,
      dislikes: 0,
      pros: '12-megapixel ultra-wide lens and a 12-megapixel wide lens',
      cons: 'Does not have a headphone jack',
      replies: []
    }
  ]

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-sm" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-400 text-sm" />)
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStarRegular} className="text-gray-300 text-sm" />)
      }
    }

    return stars
  }

  const handleAddToCart = () => {
    // In a real app, you would add to a cart context or state management
    console.log(`Added ${quantity} to cart`)
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount))
  }

  const toggleWishlist = () => {
    setWishlisted(prev => !prev)
  }

  const totalReviews = Object.values(product.ratingDistribution).reduce((a, b) => a + b, 0)

  return (
    <>
      <Header />
      <div className="product-reviews-page bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Categories', href: '/categories' },
                { label: 'Smartphones', href: '/categories?category=smartphones' },
                { label: product.title, href: `/products/iphone-14-plus` },
                { label: 'Reviews' }
              ]} 
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Page Title and Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Reviews</h1>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md flex items-center gap-2 transition-colors duration-200">
              <span>Leave a review</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Reviews Content */}
            <div className="reviews-content lg:w-3/4">
              {/* Rating Summary */}
              <div className="rating-summary bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Overall Rating */}
                  <div className="overall-rating bg-gray-50 rounded-lg p-6 text-center md:w-1/3">
                    <div className="text-5xl font-bold text-gray-900 mb-2">{product.rating}</div>
                    <div className="flex justify-center mb-3">
                      {renderStars(product.rating)}
                    </div>
                    <div className="text-gray-600 text-sm">{product.reviewCount} reviews</div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="rating-distribution md:w-2/3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating distribution</h3>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <div className="w-12 text-sm text-gray-600">{rating} star</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3">
                            <div 
                              className="h-full bg-yellow-400 rounded-full" 
                              style={{ width: `${(product.ratingDistribution[rating as keyof typeof product.ratingDistribution] / totalReviews) * 100}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-sm text-gray-600 text-right">
                            {product.ratingDistribution[rating as keyof typeof product.ratingDistribution]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Filter */}
              <div className="reviews-filter bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <label className="flex items-center text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={onlyVerified}
                        onChange={() => setOnlyVerified(!onlyVerified)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      Only verified
                    </label>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-3">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="popular">Most popular</option>
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="highest">Highest rated</option>
                      <option value="lowest">Lowest rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="reviews-list space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="review bg-white rounded-lg shadow-sm p-6">
                    {/* Review Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <div className="font-semibold text-gray-900 mr-3">{review.author}</div>
                        {review.verified && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Verified</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>

                    {/* Rating and Product Info */}
                    <div className="flex items-center mb-4">
                      <div className="flex mr-4">
                        {renderStars(review.rating)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {review.color} • {review.model}
                      </div>
                    </div>

                    {/* Review Content */}
                    <p className="text-gray-700 mb-4">{review.comment}</p>

                    {/* Pros and Cons */}
                    {(review.pros || review.cons) && (
                      <div className="pros-cons mb-4">
                        {review.pros && (
                          <div className="flex mb-2">
                            <span className="font-medium text-green-700 mr-2">Pros:</span>
                            <span className="text-gray-700">{review.pros}</span>
                          </div>
                        )}
                        {review.cons && (
                          <div className="flex">
                            <span className="font-medium text-red-700 mr-2">Cons:</span>
                            <span className="text-gray-700">{review.cons}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                          <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                          <span>Helpful ({review.likes})</span>
                        </button>
                        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                          <FontAwesomeIcon icon={faThumbsDown} className="mr-1" />
                          <span>Not helpful ({review.dislikes})</span>
                        </button>
                        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                          <FontAwesomeIcon icon={faReply} className="mr-1" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>

                    {/* Replies */}
                    {review.replies && review.replies.length > 0 && (
                      <div className="replies mt-6 pl-6 border-l-2 border-gray-200">
                        {review.replies.map((reply) => (
                          <div key={reply.id} className="reply mb-4 last:mb-0">
                            <div className="flex items-center mb-2">
                              <span className={`font-semibold ${reply.isCompany ? 'text-blue-600' : 'text-gray-900'} mr-2`}>
                                {reply.author}
                              </span>
                              {reply.isCompany && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Company</span>
                              )}
                              <span className="text-sm text-gray-500 ml-3">{reply.date}</span>
                            </div>
                            <p className="text-gray-700">{reply.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination flex justify-center items-center space-x-2 mt-8">
                <button className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                {[1, 2, 3, 4, '...', 16].map((page, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 rounded-md border transition-colors duration-200 ${
                      page === currentPage 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    } ${page === '...' ? 'pointer-events-none' : ''}`}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>

            {/* Product Summary Sidebar */}
            <div className="product-summary lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <div className="flex items-center mb-4">
                  <OptimizedImage 
                    src={product.image} 
                    alt={product.title}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-contain"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex mr-2">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-sm text-gray-500">({product.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="price flex items-center mb-4">
                  <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  {product.oldPrice && (
                    <span className="text-lg text-gray-500 line-through ml-2">${product.oldPrice.toFixed(2)}</span>
                  )}
                </div>

                <div className="actions mb-4">
                  <div className="quantity flex items-center mb-3">
                    <span className="mr-3 text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        onClick={() => handleQuantityChange(-1)}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <span className="px-3 py-1 border-l border-r border-gray-300 font-medium">{quantity}</span>
                      <button 
                        className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        onClick={() => handleQuantityChange(1)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      className="add-to-cart-btn flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
                      onClick={handleAddToCart}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                      Add to Cart
                    </button>
                    <button 
                      className={`wishlist-btn w-10 h-10 flex items-center justify-center rounded-md border transition-colors duration-200 ${
                        wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-300 text-gray-400 hover:text-red-500'
                      }`}
                      onClick={toggleWishlist}
                      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FontAwesomeIcon icon={wishlisted ? faHeart : faHeartRegular} />
                    </button>
                  </div>
                </div>

                <div className="shipping-options border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Options:</h3>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-700">
                      <FontAwesomeIcon icon={faStore} className="text-gray-500 mr-2" />
                      <span>Pickup from store: <span className="text-green-600 font-medium">Free</span></span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FontAwesomeIcon icon={faTruck} className="text-gray-500 mr-2" />
                      <span>Postal office: <span className="font-medium">$25.00</span></span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FontAwesomeIcon icon={faTruck} className="text-gray-500 mr-2" />
                      <span>Courier: <span className="font-medium">$35.00</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Newsletter />
        <Footer />
      </div>
    </>
  )
}