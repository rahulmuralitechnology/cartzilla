// src/components/TrendingProducts.tsx
'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faStarHalfAlt, 
  faShoppingCart,
  faArrowRight,
  faHeart,
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
  price: string;
  oldPrice?: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  thumbnail?: string;
  badge?: string;
  isNew?: boolean;
  discount?: number;
}

// Transform function to convert API product to local Product type (same as Products.tsx)
// Update the transformApiProduct function to handle the badge property correctly
const transformApiProduct = (apiProduct: ApiProduct): Product => {
  // Validate badge value to match the Product type
  let badge: "new" | "sale" | undefined = undefined;
  
  if (apiProduct.badge === 'new' || apiProduct.badge === 'sale') {
    badge = apiProduct.badge;
  } else if (apiProduct.isNew) {
    badge = 'new';
  } else if (apiProduct.oldPrice && apiProduct.price) {
    badge = 'sale';
  }

  return {
    id: apiProduct.id,
    title: apiProduct.name || apiProduct.title || '',
    price: parseFloat(apiProduct.price) || 0,
    oldPrice: apiProduct.oldPrice ? parseFloat(apiProduct.oldPrice) : undefined,
    rating: apiProduct.rating || 0,
    reviewCount: apiProduct.reviewCount || 0,
    image: apiProduct.image || apiProduct.thumbnail || 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Product',
    badge: badge,
    discount: apiProduct.discount || (apiProduct.oldPrice && apiProduct.price ? 
      Math.round(((parseFloat(apiProduct.oldPrice) - parseFloat(apiProduct.price)) / parseFloat(apiProduct.oldPrice)) * 100) : undefined
    )
  }
}

// Sample products for fallback
const getSampleProducts = (): Product[] => [
  {
    id: 1,
    title: 'VRB01 Virtual Reality Glasses',
    price: 340.99,
    oldPrice: 430.00,
    rating: 4.5,
    reviewCount: 14,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=VR+Glasses',
    badge: 'sale',
    discount: 21
  },
  {
    id: 2,
    title: 'Apple iPhone 14 128GB White',
    price: 899.00,
    oldPrice: 960.00,
    rating: 4.8,
    reviewCount: 142,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=iPhone+14',
    badge: 'new'
  },
  {
    id: 3,
    title: 'Smart Watch Series 7, White',
    price: 429.00,
    oldPrice: 960.00,
    rating: 4.3,
    reviewCount: 64,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Smart+Watch',
    badge: 'sale'
  },
  {
    id: 4,
    title: 'Laptop Apple MacBook Pro 13 M2',
    price: 1200.00,
    oldPrice: 960.00,
    rating: 4.9,
    reviewCount: 51,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=MacBook+Pro',
    badge: 'new'
  },
  {
    id: 5,
    title: 'Tablet Apple iPad Air M1',
    price: 540.00,
    oldPrice: 640.00,
    rating: 4.6,
    reviewCount: 12,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=iPad+Air',
    badge: 'sale'
  },
  {
    id: 6,
    title: 'Headphones Apple AirPods 2 Pro',
    price: 224.00,
    oldPrice: 299.00,
    rating: 4.4,
    reviewCount: 78,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=AirPods+Pro',
    badge: 'sale'
  },
  {
    id: 7,
    title: 'Tablet Apple iPad Pro M1',
    price: 960.00,
    rating: 4.7,
    reviewCount: 48,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=iPad+Pro',
    badge: 'new'
  },
  {
    id: 8,
    title: 'Wireless Bluetooth Headphones Sony',
    price: 430.00,
    oldPrice: 960.00,
    rating: 4.2,
    reviewCount: 136,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Sony+Headphones',
    badge: 'sale'
  }
]

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<number[]>([])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // For trending products, we might want to add sorting by popularity/rating
      const response = await axios.get(
        `${MASTER_API_URL}/product/get-product-list/?storeId=${STORE_ID}&page=1&limit=8&sortBy=rating&sortOrder=desc`
      )

      if (!response.data.success || !response.data.data.products) {
        throw new Error("Invalid API response")
      }

      const transformedProducts = response.data.data.products.map(transformApiProduct)
      setProducts(transformedProducts)
    } catch (err) {
      console.error("Error fetching trending products:", err)
      setError("Failed to load trending products")
      
      // Fallback to sample data if API fails
      setProducts(getSampleProducts())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
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

  const handleRetry = () => {
    fetchProducts()
  }

  return (
    <section className="trending-products-section">
      <div className="section-header">
        <h2 className="section-title">Trending products</h2>
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="product-card animate-pulse">
              <div className="product-image bg-gray-200 h-48"></div>
              <div className="product-info p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
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
                {product.badge && (
                  <div className="badge-container">
                    {product.discount && (
                      <span className="discount-badge">
                        -{product.discount}%
                      </span>
                    )}
                    <span className={`product-badge ${product.badge === 'new' ? 'badge-new' : 'badge-sale'}`}>
                      {product.badge === 'new' ? 'New' : 'Sale'}
                    </span>
                  </div>
                )}
                
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
    </section>
  )
}