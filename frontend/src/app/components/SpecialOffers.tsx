// src/components/SpecialOffers.tsx
'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faStarHalfAlt, 
  faShoppingCart,
  faArrowRight,
  faHeart,
  faChevronLeft,
  faChevronRight,
  faExclamationTriangle,
  faRefresh
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { Product } from '@/types'
import OptimizedImage from './Image'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

// API configuration (same as Products.tsx)
const MASTER_API_URL = process.env.NEXT_PUBLIC_MASTER_API_URL || 'https://your-api-domain.com/api'
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || 'default-store-id'

// Define API product interface
interface ApiProduct {
  id: number;
  name?: string;
  title?: string;
  price: string | number;
  oldPrice?: string | number;
  rating?: number;
  reviewCount?: number;
  image?: string;
  thumbnail?: string;
  discount?: number;
  stock?: number;
}

// Transform function to convert API product to local Product type
const transformApiProduct = (apiProduct: ApiProduct): Product => {
  return {
    id: apiProduct.id,
    title: apiProduct.name || apiProduct.title || 'Unknown Product',
    price: typeof apiProduct.price === 'string' ? parseFloat(apiProduct.price) : apiProduct.price,
    oldPrice: apiProduct.oldPrice ? (typeof apiProduct.oldPrice === 'string' ? parseFloat(apiProduct.oldPrice) : apiProduct.oldPrice) : undefined,
    rating: apiProduct.rating || 0,
    reviewCount: apiProduct.reviewCount || 0,
    image: apiProduct.image || apiProduct.thumbnail || 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Product',
    badge: 'sale', // Special offers are always sale items
    discount: apiProduct.discount || (apiProduct.oldPrice && apiProduct.price ? 
      Math.round(((Number(apiProduct.oldPrice) - Number(apiProduct.price)) / Number(apiProduct.oldPrice)) * 100) : undefined
    ),
    stock: apiProduct.stock || Math.floor(Math.random() * 100) + 1 // Random stock for demo
  }
}

// Sample products for fallback
const getSampleProducts = (): Product[] => [
  {
    id: 1,
    title: 'Xiaomi Wireless Buds Pro',
    price: 129.99,
    oldPrice: 156.00,
    rating: 4.5,
    reviewCount: 14,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Xiaomi+Buds',
    badge: 'sale',
    discount: 17,
    stock: 112
  },
  {
    id: 2,
    title: 'Smart Watch Series 7, White',
    price: 429.00,
    oldPrice: 486.00,
    rating: 4.8,
    reviewCount: 142,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Smart+Watch',
    badge: 'sale',
    discount: 12,
    stock: 45
  },
  {
    id: 3,
    title: 'VRB01 Camera Nikon Max',
    price: 652.00,
    oldPrice: 785.00,
    rating: 4.3,
    reviewCount: 64,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Nikon+Camera',
    badge: 'sale',
    discount: 17,
    stock: 13
  },
  {
    id: 4,
    title: 'Apple iPhone 14 128GB Blue',
    price: 899.00,
    oldPrice: 967.00,
    rating: 4.9,
    reviewCount: 51,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=iPhone+14',
    badge: 'sale',
    discount: 7,
    stock: 7
  }
]

export default function SpecialOffers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 10,
    minutes: 12,
    seconds: 0
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // For special offers, we might want to filter by discount or special offers flag
      const response = await axios.get(
        `${MASTER_API_URL}/product/get-product-list/?storeId=${STORE_ID}&page=1&limit=4&hasDiscount=true`
      )

      if (!response.data.success || !response.data.data.products) {
        throw new Error("Invalid API response")
      }

      const transformedProducts = response.data.data.products.map(transformApiProduct)
      setProducts(transformedProducts)
    } catch (err) {
      console.error("Error fetching special offers:", err)
      setError("Failed to load special offers")
      
      // Fallback to sample data if API fails
      setProducts(getSampleProducts())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { days, hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          return { ...prev, seconds: seconds - 1 }
        } else if (minutes > 0) {
          return { ...prev, minutes: minutes - 1, seconds: 59 }
        } else if (hours > 0) {
          return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 }
        } else if (days > 0) {
          return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 }
        } else {
          clearInterval(timer)
          return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId))
    } else {
      setWishlist([...wishlist, productId])
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-warning text-xs" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-warning text-xs" />)
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStarRegular} className="text-gray-300 text-xs" />)
      }
    }

    return stars
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    alert(`${product.title} added to cart!`)
  }

  const getStockStatus = (stock: number) => {
    if (stock > 20) return 'high'
    if (stock > 5) return 'medium'
    return 'low'
  }

  const handleRetry = () => {
    fetchProducts()
  }

  return (
    <section className="special-offers-section">
      <div className="section-header">
        <div className="section-title-container">
          <h2 className="section-title">Special offers for you</h2>
          <div className="countdown-timer">
            <div className="countdown-item">
              <span className="countdown-value">{timeLeft.days}</span>
              <span className="countdown-label">d</span>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <span className="countdown-value">{timeLeft.hours}</span>
              <span className="countdown-label">h</span>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <span className="countdown-value">{timeLeft.minutes}</span>
              <span className="countdown-label">m</span>
            </div>
          </div>
        </div>
        <Link href="/products" className="view-all">
          View all <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
      
      {error && products.length === 0 && (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </div>
          <button
            onClick={handleRetry}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark flex items-center gap-2 mx-auto"
          >
            <FontAwesomeIcon icon={faRefresh} />
            Try Again
          </button>
        </div>
      )}

      <div className="special-offers-content">
        <div className="navigation-buttons">
          <button 
            className="nav-button prev-button"
            aria-label="Previous products"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button 
            className="nav-button next-button"
            aria-label="Next products"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        
        {loading ? (
          <div className="products-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="product-card animate-pulse">
                <div className="product-image bg-gray-200 h-48"></div>
                <div className="product-info p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <article key={product.id} className="product-card group">
                <div className="product-image">
                  <div className="badge-container">
                    {product.discount && (
                      <span className="discount-badge">
                        -{product.discount}%
                      </span>
                    )}
                    <span className="product-badge badge-sale">
                      Sale
                    </span>
                  </div>
                  
                  <button 
                    className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleWishlist(product.id)
                    }}
                    aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <FontAwesomeIcon icon={wishlist.includes(product.id) ? faHeart : faHeartRegular} />
                  </button>
                  
                  <OptimizedImage 
                    src={product.image} 
                    alt={product.title}
                    width={300}
                    height={250}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="product-info">
                  <div className="product-rating">
                    <div className="stars" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                      {renderStars(product.rating)}
                    </div>
                    <span className="rating-count">({product.reviewCount})</span>
                  </div>
                  
                  <h3 className="product-title">{product.title}</h3>
                  
                  <div className="product-price">
                    <span className="current-price">${product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                      <span className="old-price">${product.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="stock-info">
                    <span className="stock-label">Available:</span>
                    <span className={`stock-amount stock-${getStockStatus(product.stock || 0)}`}>
                      {product.stock}
                    </span>
                  </div>
                  
                  <div className="product-action">
                    <button 
                      className="add-to-cart transition-colors duration-200 hover:bg-primary hover:text-white"
                      onClick={(e) => handleAddToCart(product, e)}
                      aria-label={`Add ${product.title} to cart`}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}