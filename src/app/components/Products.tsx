// src/components/Products.tsx
'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faStarHalfAlt, 
  faShoppingCart,
  faArrowRight,
  faExclamationTriangle,
  faRefresh
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'
import { Product } from '@/types'
import OptimizedImage from './Image'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'

// API configuration
const MASTER_API_URL = process.env.NEXT_PUBLIC_MASTER_API_URL || 'https://your-api-domain.com/api'
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || 'default-store-id'

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
  badge?: string;
  isNew?: boolean;
}

// Transform function to convert API product to local Product type
const transformApiProduct = (apiProduct: ApiProduct): Product => {
  // Validate and convert badge to the correct type
  let badge: "new" | "sale" | undefined = undefined;
  if (apiProduct.badge === 'new' || apiProduct.badge === 'sale') {
    badge = apiProduct.badge;
  } else if (apiProduct.isNew) {
    badge = 'new';
  }

  return {
    id: apiProduct.id,
    title: apiProduct.name || apiProduct.title || '',
    price: parseFloat(apiProduct.price as string) || 0,
    oldPrice: apiProduct.oldPrice ? parseFloat(apiProduct.oldPrice as string) : undefined,
    rating: apiProduct.rating || 0,
    reviewCount: apiProduct.reviewCount || 0,
    image: apiProduct.image || apiProduct.thumbnail || 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Product',
    badge: badge
  }
}

// Sample products for fallback
const getSampleProducts = (): Product[] => [
  {
    id: 1,
    title: 'Apple MacBook Pro M1',
    price: 1200.00,
    rating: 4.5,
    reviewCount: 45,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=MacBook',
    badge: 'new'
  },
  {
    id: 2,
    title: 'Smart Watch Series 7, White',
    price: 449.00,
    rating: 4,
    reviewCount: 126,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Smart+Watch',
    badge: 'new'
  },
  {
    id: 3,
    title: 'Tablet Apple iPad Air M1',
    price: 540.00,
    oldPrice: 956.00,
    rating: 5,
    reviewCount: 34,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=iPad',
    badge: 'new'
  },
  {
    id: 4,
    title: 'VRB01 Virtual Reality Glasses',
    price: 340.99,
    rating: 4.5,
    reviewCount: 123,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=VR+Headset',
    badge: 'new'
  },
  {
    id: 5,
    title: 'Wireless Bluetooth Earbuds',
    price: 89.99,
    oldPrice: 129.99,
    rating: 4.2,
    reviewCount: 78,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Earbuds',
    badge: 'sale'
  },
  {
    id: 6,
    title: '4K Ultra HD Smart TV',
    price: 899.99,
    rating: 4.7,
    reviewCount: 210,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Smart+TV',
    badge: 'new'
  },
  {
    id: 7,
    title: 'DSLR Camera Pro',
    price: 1200.00,
    oldPrice: 1500.00,
    rating: 4.8,
    reviewCount: 95,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=DSLR+Camera',
    badge: 'sale'
  },
  {
    id: 8,
    title: 'Gaming Laptop RTX Series',
    price: 1899.99,
    rating: 4.6,
    reviewCount: 67,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Gaming+Laptop',
    badge: 'new'
  }
]

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchProducts = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setIsLoadingMore(true)
      } else {
        setLoading(true)
      }
      setError(null)
      
      const response = await axios.get(
        `${MASTER_API_URL}/product/get-product-list/?storeId=${STORE_ID}&page=${pageNum}&limit=8`
      )

      if (!response.data.success || !response.data.data.products) {
        throw new Error("Invalid API response")
      }

      const transformedProducts = response.data.data.products.map(transformApiProduct)
      
      if (append) {
        setProducts(prev => [...prev, ...transformedProducts])
      } else {
        setProducts(transformedProducts)
      }
      
      // Check if there are more products
      setHasMore(transformedProducts.length === 8)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products")
      
      // Fallback to sample data if API fails and no products are loaded
      if (products.length === 0) {
        setProducts(getSampleProducts())
        setHasMore(false)
      }
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
    }
  }, [products.length])

  useEffect(() => {
    fetchProducts(1, false)
  }, [fetchProducts])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProducts(nextPage, true)
  }

  const handleRetry = () => {
    fetchProducts(1, false)
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

  return (
    <section className="products-section">
      <div className="section-header">
        <h2 className="section-title">New arrivals</h2>
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

      {loading && !isLoadingMore ? (
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
        <>
          <div className="products-grid">
            {products.map(product => (
              <article key={product.id} className="product-card group">
                <div className="product-image">
                  {product.badge && (
                    <span className={`product-badge ${product.badge === 'new' ? 'badge-new' : 'badge-sale'}`}>
                      {product.badge === 'new' ? 'New' : 'Sale'}
                    </span>
                  )}
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

          {hasMore && !isLoadingMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Load More Products
              </button>
            </div>
          )}

          {isLoadingMore && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-600">Loading more products...</p>
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              You&apos;ve reached the end of products
            </div>
          )}
        </>
      )}
    </section>
  )
}