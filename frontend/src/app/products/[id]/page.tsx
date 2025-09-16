// src/app/products/[id]/page.tsx
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
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import OptimizedImage from '../../components/Image'
import Breadcrumb from '../../components/Breadcrumb'
import Header from '../../components/Header'
import Newsletter from '../../components/Newsletter'
import Footer from '../../components/Footer'

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  // const [cartCount, setCartCount] = useState(0)

  const product = {
    id: 1,
    title: 'Apple iPhone 14 Plus 128GB Blue',
    price: 940.00,
    oldPrice: 999.00,
    rating: 4.1,
    reviewCount: 68,
    images: [
      'https://via.placeholder.com/600x600/EEF1F6/333333?text=iPhone+Front',
      'https://via.placeholder.com/600x600/EEF1F6/333333?text=iPhone+Back',
      'https://via.placeholder.com/600x600/EEF1F6/333333?text=iPhone+Side',
      'https://via.placeholder.com/600x600/EEF1F6/333333?text=iPhone+Box'
    ],
    details: {
      model: 'iPhone 14 Plus',
      gender: 'Unisex',
      screenType: 'Super Retina XDR',
      screenRefreshRate: '120 Hz',
      storage: '128GB',
      color: 'Blue'
    }
  }

  const bundleItems = [
    {
      id: 2,
      title: 'Headphones Apple AirPods 2 Pro',
      price: 224.00,
      image: 'https://via.placeholder.com/150x150/EEF1F6/333333?text=AirPods+Pro'
    },
    {
      id: 3,
      title: 'Wireless charger for iPhone',
      price: 26.00,
      image: 'https://via.placeholder.com/150x150/EEF1F6/333333?text=Wireless+Charger'
    }
  ]

  const trendingProducts = [
    {
      id: 4,
      title: 'VRB01 Virtual Reality Glasses',
      price: 340.00,
      image: 'https://via.placeholder.com/150x150/EEF1F6/333333?text=VR+Glasses',
      rating: 4.5,
      reviewCount: 14
    },
    {
      id: 5,
      title: 'Apple iPhone 12',
      price: 899.00,
      image: 'https://via.placeholder.com/150x150/EEF1F6/333333?text=iPhone+12',
      rating: 4.3,
      reviewCount: 87
    },
    {
      id: 6,
      title: 'Apple Watch Series 7',
      price: 429.00,
      image: 'https://via.placeholder.com/150x150/EEF1F6/333333?text=Apple+Watch',
      rating: 4.7,
      reviewCount: 52
    },
    {
      id: 7,
      title: 'MacBook Air M2',
      price: 1200.00,
      image: 'https://via.placeholder.com/150x150/EEF1F6/333333?text=MacBook+Air',
      rating: 4.8,
      reviewCount: 31
    }
  ]

  const viewedProducts = [
    {
      id: 8,
      title: 'Dualsense Controller',
      price: 200.00,
      image: 'https://via.placeholder.com/150x150/EEF1F6/333333?text=Controller'
    },
    {
      id: 9,
      title: 'Camera Nikon Max',
      price: 652.00,
      image: 'https://via.placeholder.com/150x150/EEF1F6/333333?text=Nikon+Camera'
    },
    {
      id: 10,
      title: 'iPhone 14 128GB Blue',
      price: 899.00,
      image: 'https://via.placeholder.com/150x150/EEF1F6/333333?text=iPhone+14'
    },
    {
      id: 11,
      title: 'Tablet iPad Pro',
      price: 640.00,
      image: 'https://via.placeholder.com/150x150/EEF1F6/333333?text=iPad+Pro'
    }
  ]

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
    // setCartCount(prev => prev + quantity)
    // In a real app, you would add to a cart context or state management
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount))
  }

  const toggleWishlist = () => {
    setWishlisted(prev => !prev)
  }

  const totalBundlePrice = product.price + bundleItems.reduce((total, item) => total + item.price, 0)

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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{product.title}</h1>
            
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
                <div className="price-rating flex items-center justify-between mb-6">
                  <div>
                    <p className="price text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                    {product.oldPrice && (
                      <p className="old-price line-through text-gray-500 text-lg">${product.oldPrice.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="rating flex items-center">
                    <div className="stars flex mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="rating-count text-gray-500 text-sm">({product.reviewCount})</span>
                  </div>
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

          {/* Cheaper Together */}
          <section className="cheaper-together bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cheaper together</h2>
            
            <div className="bundle flex flex-col md:flex-row gap-6 mb-6">
              <div className="bundle-item flex-1 border border-gray-200 rounded-lg p-4 flex items-center">
                <div className="image-container w-20 h-20 bg-gray-100 rounded-lg p-2 mr-4 flex items-center justify-center">
                  <OptimizedImage 
                    src={product.images[0]} 
                    alt={product.title}
                    width={80}
                    height={80}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.title}</p>
                  <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center text-gray-500 text-xl">+</div>
              
              {bundleItems.map((item, index) => (
                <>
                  <div key={item.id} className="bundle-item flex-1 border border-gray-200 rounded-lg p-4 flex items-center">
                    <div className="image-container w-20 h-20 bg-gray-100 rounded-lg p-2 mr-4 flex items-center justify-center">
                      <OptimizedImage 
                        src={item.image} 
                        alt={item.title}
                        width={80}
                        height={80}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  {index < bundleItems.length - 1 && (
                    <div className="flex items-center justify-center text-gray-500 text-xl">+</div>
                  )}
                </>
              ))}
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-xl font-bold text-gray-900 mb-4 md:mb-0">
                Total: <span className="text-blue-600">${totalBundlePrice.toFixed(2)}</span> 
                <span className="text-sm text-gray-500 line-through ml-2">${(totalBundlePrice + 100).toFixed(2)}</span>
              </p>
              <button className="purchase-together bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors duration-200">
                Purchase Together (Save $100.00)
              </button>
            </div>
          </section>

          {/* Product Details */}
          <section className="product-details-section bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.details).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-medium text-gray-700 w-40 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="reviews bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Reviews ({product.reviewCount})</h2>
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
          </section>

          {/* Trending Products */}
          <section className="trending-products bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Products</h2>
            
            <div className="trending-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map(product => (
                <div key={product.id} className="product-card bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <div className="image-container h-40 bg-white rounded-lg p-4 mb-3 flex items-center justify-center">
                    <OptimizedImage 
                      src={product.image} 
                      alt={product.title}
                      width={120}
                      height={120}
                      className="h-32 object-contain"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center mb-2">
                    <div className="stars flex mr-1">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Viewed Products */}
          <section className="viewed-products bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
            
            <div className="viewed-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {viewedProducts.map(product => (
                <div key={product.id} className="viewed-card bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <div className="image-container h-40 bg-white rounded-lg p-4 mb-3 flex items-center justify-center">
                    <OptimizedImage 
                      src={product.image} 
                      alt={product.title}
                      width={120}
                      height={120}
                      className="h-32 object-contain"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <Newsletter />
        <Footer />
      </div>
    </>
  )
}