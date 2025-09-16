// src/app/products/iphone-14-plus/page.tsx
'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faStarHalfAlt, 
  faShoppingCart,
  faHeart,
  faPlus,
  faMinus,
  faTruck,
  faStore,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import OptimizedImage from '../../components/Image'
import Breadcrumb from '../../components/Breadcrumb'
import Header from '../../components/Header'
import Newsletter from '../../components/Newsletter'
import Footer from '../../components/Footer'

export default function IPhoneDetailPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  const product = {
    id: 1,
    title: 'Apple iPhone 14 Plus 128GB Blue',
    price: 940.00,
    oldPrice: 956.00,
    rating: 4.1,
    reviewCount: 68,
    images: [
      'https://via.placeholder.com/600x600/EEF1F6/333333?text=iPhone+Front',
      'https://via.placeholder.com/600x600/EEF1F6/333333?text=iPhone+Back',
      'https://via.placeholder.com/600x600/EEF1F6/333333?text=iPhone+Side',
      'https://via.placeholder.com/600x600/EEF1F6/333333?text=iPhone+Box'
    ],
    specifications: {
      general: [
        { name: 'Model', value: 'iPhone 14 Plus' },
        { name: 'Gender', value: 'Unisex' },
        { name: 'Screen type', value: 'Super Retina XDR' },
        { name: 'Screen refresh rate', value: '120 Hz' }
      ],
      display: [
        { name: 'Screen diagonal', value: '6.1"' },
        { name: 'Display resolution', value: '2532x1170' },
        { name: 'Matrix type', value: 'OLED (Super Retina XDR)' },
        { name: 'Number of touch points', value: '10' },
        { name: 'Screen material', value: 'Ceramic Shield' }
      ],
      memory: [
        { name: 'Memory functions', value: '128 Gb' },
        { name: 'Maximum size of a supported memory card', value: 'None' }
      ],
      battery: [
        { name: 'Fast charging', value: 'Yes' },
        { name: 'Wireless charging', value: 'Yes' },
        { name: 'Charging power', value: '15 W' }
      ],
      housing: [
        { name: 'Housing protection', value: 'Protection against dust and moisture' },
        { name: 'Protection class', value: 'IP68' },
        { name: 'Biometric protection', value: 'Face recognition' },
        { name: 'Body material', value: 'Metal, Glass' },
        { name: 'Warranty period', value: '2 years' },
        { name: 'Country of origin', value: 'China' }
      ]
    }
  }

  const reviews = [
    {
      id: 1,
      author: 'Rafael Marquez',
      rating: 5,
      comment: 'Great phone, super responsive.',
      date: 'June 28, 2023'
    },
    {
      id: 2,
      author: 'Daniel Adams',
      rating: 4,
      comment: 'Decent device, great value.',
      date: 'May 8, 2023'
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

  const SpecificationSection = ({ title, items }: { title: string, items: { name: string, value: string }[] }) => (
    <div className="specification-section mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">{item.name}</span>
            <span className="text-gray-900 font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <Header />
      <div className="product-detail-page bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Categories', href: '/categories' },
                { label: 'Smartphones', href: '/categories?category=smartphones' },
                { label: product.title }
              ]} 
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Product Overview */}
          <section className="product-overview bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            
            <div className="flex items-center mb-6">
              <div className="stars flex mr-2">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-500 text-sm">({product.reviewCount} reviews)</span>
            </div>
            
            <div className="product-main flex flex-col lg:flex-row gap-8">
              {/* Product Images */}
              <div className="product-images lg:w-1/2">
                <div className="main-image mb-4 bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                  <OptimizedImage 
                    src={product.images[selectedImage]} 
                    alt={product.title}
                    width={500}
                    height={500}
                    className="w-full h-80 object-contain"
                  />
                </div>
                <div className="thumbnail-images flex gap-3 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`thumbnail p-2 border rounded-lg flex-shrink-0 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <OptimizedImage 
                        src={image} 
                        alt={`${product.title} view ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-16 h-16 object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Product Details */}
              <div className="product-details lg:w-1/2">
                <div className="price flex items-center mb-6">
                  <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                  {product.oldPrice && (
                    <p className="old-price line-through text-gray-500 text-lg ml-3">${product.oldPrice.toFixed(2)}</p>
                  )}
                </div>
                
                <div className="actions mb-6">
                  <div className="quantity flex items-center mb-4">
                    <span className="mr-3 text-gray-700 font-medium">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                        onClick={() => handleQuantityChange(-1)}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <span className="px-4 py-2 border-l border-r border-gray-300 font-medium">{quantity}</span>
                      <button 
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                        onClick={() => handleQuantityChange(1)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      className="add-to-cart-btn flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
                      onClick={handleAddToCart}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                      Add to Cart
                    </button>
                    <button 
                      className={`wishlist-btn w-12 h-12 flex items-center justify-center rounded-md border transition-colors duration-200 ${
                        wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-300 text-gray-400 hover:text-red-500'
                      }`}
                      onClick={toggleWishlist}
                      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FontAwesomeIcon icon={wishlisted ? faHeart : faHeartRegular} />
                    </button>
                  </div>
                </div>
                
                <div className="shipping-options border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Shipping Options:</h3>
                  <div className="space-y-2">
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
          </section>

          {/* Tabs Navigation */}
          <div className="tabs-navigation bg-white rounded-t-lg shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex space-x-8">
                <button
                  className={`py-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
                    activeTab === 'details' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  Product Details
                </button>
                <button
                  className={`py-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
                    activeTab === 'reviews' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews (68)
                </button>
                <button
                  className={`py-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
                    activeTab === 'specs' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('specs')}
                >
                  Specifications
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content bg-white rounded-b-lg shadow-sm p-6 mb-8">
            {activeTab === 'details' && (
              <div className="product-description">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
                <p className="text-gray-700 mb-4">
                  The Apple iPhone 14 Plus features a stunning 6.1-inch Super Retina XDR display with ProMotion technology for smooth scrolling and responsiveness. With its advanced camera system, A16 Bionic chip, and all-day battery life, it`&apos;`s the ultimate iPhone for power users.
                </p>
                <p className="text-gray-700 mb-4">
                  The Ceramic Shield front cover is tougher than any smartphone glass. The aluminum design is durable and features a gorgeous blue color that stands out from the crowd.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mt-1 mr-3" />
                    <p className="text-blue-700 text-sm">
                      Product specifications and equipment are subject to change without notice.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                  <div className="flex items-center">
                    <div className="stars flex mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-gray-700 font-medium">{product.rating}/5</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="review border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center mb-2">
                        <div className="stars flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <h3 className="font-medium text-gray-900">{review.author}</h3>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
                
                <button className="mt-6 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                  See all reviews
                </button>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="specifications-content">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
                
                <SpecificationSection title="General Specifications" items={product.specifications.general} />
                <SpecificationSection title="Display" items={product.specifications.display} />
                <SpecificationSection title="Memory Functions" items={product.specifications.memory} />
                <SpecificationSection title="Battery" items={product.specifications.battery} />
                <SpecificationSection title="Housing & Protection" items={product.specifications.housing} />
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mt-1 mr-3" />
                    <p className="text-blue-700 text-sm">
                      Product specifications and equipment are subject to change without notice.
                    </p>
                  </div>
                </div>
                
                <div className="contact-section mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Do you have any questions?</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-200">
                    Contact us
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Support Section */}
          <section className="support-section bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Do you have any questions?</h2>
            <p className="text-gray-700 mb-6">
              Our support team is here to help you with any questions about this product or your order.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors duration-200">
                Contact Support
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-md transition-colors duration-200">
                FAQ
              </button>
            </div>
          </section>
        </div>

        <Newsletter />
        <Footer />
      </div>
    </>
  )
}