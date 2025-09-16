// src/app/categories/page.tsx
'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faStarHalfAlt, 
  faShoppingCart,
  faHeart,
  faFilter,
  faChevronDown,
  faTh,
  faList,
  faChevronRight,
  faTimes,
  faCheck,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { Product } from '@/types'
import OptimizedImage from '../components/Image'
import Breadcrumb from '../components/Breadcrumb'
import Header from '../components/Header'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

// Category data
const categories = [
  {
    id: 1,
    name: 'Smartphones',
    count: 218,
    subcategories: ['Apple iPhone', 'Samsung', 'Xiaomi', 'Nokia', 'Meizu'],
    icon: '📱'
  },
  {
    id: 2,
    name: 'Accessories',
    count: 372,
    subcategories: ['Accessory Kits', 'Batteries & Battery Packs', 'Cables', 'Car Accessories', 'Charges & Power Adapters', 'FM Transmitters'],
    icon: '🔌'
  },
  {
    id: 3,
    name: 'Tablets',
    count: 110,
    subcategories: ['Apple iPad', 'Android Tablets', 'Samsung', 'Xiaomi', 'Lenovo', 'Voice Recorders'],
    icon: '📋'
  },
  {
    id: 4,
    name: 'Wearable Electronics',
    count: 142,
    subcategories: ['Smart Watches', 'Fitness Trackers', 'Smart Glasses', 'Clips, Arm & Wristbands', 'E-books'],
    icon: '⌚'
  },
  {
    id: 5,
    name: 'Computers & Laptops',
    count: 205,
    subcategories: ['Asus', 'Acer', 'HP (Hewlett Packard)', 'Lenovo', 'Apple MacBook'],
    icon: '💻'
  },
  {
    id: 6,
    name: 'Cameras, Photo & Video',
    count: 78,
    subcategories: ['Photo Cameras', 'Video Cameras', 'Action Cameras', 'Camcorders', 'Studio Equipment', 'Bags and Covers'],
    icon: '📷'
  },
  {
    id: 7,
    name: 'Headphones',
    count: 121,
    subcategories: ['Apple', 'Defunc', 'HyperX', 'JBL', 'Logitech', 'Panasonic'],
    icon: '🎧'
  },
  {
    id: 8,
    name: 'Video Games',
    count: 89,
    subcategories: ['PlayStation 5', 'PlayStation Games', 'Nintendo Switch', 'Xbox Series X/S', 'Gaming Peripherals'],
    icon: '🎮'
  }
]

// Brand data
const brands = [
  { id: 1, name: 'Apple', count: 12, checked: true, logo: '🍎' },
  { id: 2, name: 'Asus', count: 47, checked: false, logo: '🔧' },
  { id: 3, name: 'Cobra', count: 52, checked: false, logo: '🐍' },
  { id: 4, name: 'Dell', count: 48, checked: false, logo: '💻' },
  { id: 5, name: 'Lenovo', count: 112, checked: false, logo: '💾' },
  { id: 6, name: '2E Gambing', count: 13, checked: false, logo: '🎲' },
  { id: 7, name: 'AsRock', count: 35, checked: false, logo: '🔩' }
]

// SSD sizes
const ssdSizes = [
  { id: 1, name: '2 TB', count: 13, checked: false },
  { id: 2, name: '1 TB', count: 28, checked: true },
  { id: 3, name: '512 GB', count: 47, checked: false },
  { id: 4, name: '256 GB', count: 56, checked: false },
  { id: 5, name: '128 GB', count: 69, checked: false },
  { id: 6, name: '64 GB or less', count: 141, checked: false }
]

// Colors
const colors = [
  { id: 1, name: 'Green', value: '#8BC4AB' },
  { id: 2, name: 'Coral red', value: '#EE7976' },
  { id: 3, name: 'Light pink', value: '#DF8FBF' },
  { id: 4, name: 'Sky blue', value: '#9ACBF1' },
  { id: 5, name: 'Black', value: '#364254' },
  { id: 6, name: 'White', value: '#FFFFFF', border: true }
]

// Products data
const products: Product[] = [
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
  },
  {
    id: 9,
    title: 'iPhone 14 Pro Max 256GB',
    price: 1099.00,
    oldPrice: 1299.00,
    rating: 4.9,
    reviewCount: 89,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=iPhone+14+Pro',
    badge: 'sale'
  },
  {
    id: 10,
    title: 'Samsung Galaxy S23 Ultra',
    price: 1199.00,
    rating: 4.8,
    reviewCount: 67,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Galaxy+S23',
    badge: 'new'
  },
  {
    id: 11,
    title: 'Xiaomi 13 Pro',
    price: 899.00,
    oldPrice: 999.00,
    rating: 4.6,
    reviewCount: 45,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Xiaomi+13',
    badge: 'sale'
  },
  {
    id: 12,
    title: 'Nintendo Switch OLED',
    price: 349.00,
    rating: 4.7,
    reviewCount: 123,
    image: 'https://via.placeholder.com/300x250/EEF1F6/333333?text=Nintendo+Switch',
    badge: 'new'
  }
]

export default function CategoriesPage() {
  const [wishlist, setWishlist] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<string>('popularity')
  const [priceRange, setPriceRange] = useState<[number, number]>([340, 1250])
  const [selectedBrands, setSelectedBrands] = useState<number[]>([1])
  const [selectedSizes, setSelectedSizes] = useState<number[]>([2])
  const [selectedColors, setSelectedColors] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])

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
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-xs" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-400 text-xs" />)
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStarRegular} className="text-gray-300 text-xs" />)
      }
    }

    return stars
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // In a real app, you would add to a cart context or state management
  }

  const toggleBrand = (brandId: number) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter(id => id !== brandId))
    } else {
      setSelectedBrands([...selectedBrands, brandId])
    }
  }

  const toggleSize = (sizeId: number) => {
    if (selectedSizes.includes(sizeId)) {
      setSelectedSizes(selectedSizes.filter(id => id !== sizeId))
    } else {
      setSelectedSizes([...selectedSizes, sizeId])
    }
  }

  const toggleColor = (colorId: number) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(selectedColors.filter(id => id !== colorId))
    } else {
      setSelectedColors([...selectedColors, colorId])
    }
  }

  const clearAllFilters = () => {
    setSelectedBrands([])
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([0, 2000])
  }

  const toggleCategoryExpand = (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId))
    } else {
      setExpandedCategories([...expandedCategories, categoryId])
    }
  }

  const selectedCategory: string = 'All'
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => 
        product.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (product.badge === 'sale' && selectedCategory === 'Deal of the week')
      )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.id - a.id
      default:
        return b.reviewCount - a.reviewCount // popularity
    }
  })

  // Pagination logic
  const productsPerPage = 12
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage)

  return (
    <>
      <Header />
      <div className="categories-page bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Categories', href: '/categories' },
                { label: 'Shop categories' }
              ]} 
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0">Shop catalog</h1>
            
            {/* Mobile filter toggle */}
            <button 
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
              Filters
              {selectedBrands.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0 ? (
                <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {selectedBrands.length + selectedSizes.length + selectedColors.length}
                </span>
              ) : null}
            </button>
          </div>

          {/* Banners Section */}
          <div className="banners-section grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="banner bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 flex items-center shadow-md hover:shadow-lg transition-all duration-300 text-white">
              <div className="banner-content max-w-xs">
                <h2 className="text-2xl font-bold mb-3">iPhone 14</h2>
                <p className="text-blue-100 mb-5">Apple iPhone 14 128GB Blue</p>
                <button className="bg-white text-blue-600 px-5 py-3 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-50">
                  From $899
                </button>
              </div>
              <div className="banner-image ml-auto">
                <OptimizedImage 
                  src="https://via.placeholder.com/150x150/ffffff/000000?text=iPhone+14" 
                  alt="iPhone 14" 
                  width={150}
                  height={150}
                  className="w-36 h-36 object-contain" 
                />
              </div>
            </div>

            <div className="banner bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-all duration-300 text-white">
              <h2 className="text-2xl font-bold mb-5">Deal of the week</h2>
              <OptimizedImage 
                src="https://via.placeholder.com/150x150/ffffff/000000?text=iPad+Pro+M1" 
                alt="iPad Pro M1" 
                width={150}
                height={150}
                className="mx-auto w-36 h-36 object-contain" 
              />
              <p className="mt-5 text-pink-100">iPad Pro M1</p>
              <span className="inline-block mt-3 bg-white text-pink-600 text-xs font-bold px-4 py-2 rounded-full">
                20% OFF
              </span>
            </div>
          </div>

          {/* Main Content with Filters */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className={`filters-sidebar w-full lg:w-80 shrink-0 ${mobileFiltersOpen ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} lg:block lg:relative`}>
              <div className="lg:hidden flex justify-between items-center mb-6 sticky top-0 bg-white py-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-500 p-2">
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>
              
              {/* Status Filter */}
              <div className="filter-section bg-white p-5 rounded-lg shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
                <div className="space-y-3">
                  <button className="w-full text-left py-3 px-5 bg-blue-600 text-white rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-700">
                    Sale
                  </button>
                  <button className="w-full text-left py-3 px-5 border border-gray-200 rounded-md text-sm text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200">
                    Same Day Delivery
                  </button>
                  <button className="w-full text-left py-3 px-5 border border-gray-200 rounded-md text-sm text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200">
                    Available to Order
                  </button>
                </div>
              </div>

              {/* Categories Filter */}
              <div className="filter-section bg-white p-5 rounded-lg shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {categories.map(category => (
                    <div key={category.id}>
                      <div 
                        className="flex justify-between items-center py-3 px-3 rounded hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleCategoryExpand(category.id)}
                      >
                        <div className="flex items-center">
                          <span className="mr-3 text-lg">{category.icon}</span>
                          <span className="text-sm text-gray-700">{category.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mr-3">({category.count})</span>
                          <FontAwesomeIcon 
                            icon={faChevronDown} 
                            className={`text-xs text-gray-500 transition-transform duration-200 ${expandedCategories.includes(category.id) ? 'rotate-180' : ''}`} 
                          />
                        </div>
                      </div>
                      {expandedCategories.includes(category.id) && (
                        <div className="ml-8 mt-2 mb-3 space-y-2">
                          {category.subcategories.map((subcat, index) => (
                            <div key={index} className="flex items-center py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200">
                              {subcat}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="filter-section bg-white p-5 rounded-lg shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Price</h3>
                <div className="mb-5">
                  <div className="relative h-2 bg-gray-200 rounded-lg">
                    <div 
                      className="absolute h-full bg-blue-500 rounded-lg"
                      style={{ left: `${(priceRange[0] / 2000) * 100}%`, width: `${((priceRange[1] - priceRange[0]) / 2000) * 100}%` }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
                    />
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
                    />
                    <div 
                      className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow -mt-1.5"
                      style={{ left: `${(priceRange[0] / 2000) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow -mt-1.5"
                      style={{ left: `${(priceRange[1] / 2000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-5 text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="filter-section bg-white p-5 rounded-lg shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Brand</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {brands.map(brand => (
                    <div key={brand.id} className="flex items-center justify-between py-2 hover:bg-gray-50 px-3 rounded">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleBrand(brand.id)}
                          className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors duration-200 ${
                            selectedBrands.includes(brand.id) 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-gray-300 hover:border-blue-600'
                          }`}
                        >
                          {selectedBrands.includes(brand.id) && (
                            <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                          )}
                        </button>
                        <span className="text-lg mr-3">{brand.logo}</span>
                        <span className="text-sm text-gray-800">{brand.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">({brand.count})</span>
                    </div>
                  ))}
                </div>
                <button className="text-sm text-blue-600 mt-3 flex items-center hover:text-blue-800 transition-colors duration-200">
                  Show all <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-xs" />
                </button>
              </div>

              {/* SSD Size Filter */}
              <div className="filter-section bg-white p-5 rounded-lg shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">SSD Size</h3>
                <div className="space-y-3">
                  {ssdSizes.map(size => (
                    <div key={size.id} className="flex items-center justify-between py-2 hover:bg-gray-50 px-3 rounded">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleSize(size.id)}
                          className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors duration-200 ${
                            selectedSizes.includes(size.id) 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-gray-300 hover:border-blue-600'
                          }`}
                        >
                          {selectedSizes.includes(size.id) && (
                            <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                          )}
                        </button>
                        <span className="text-sm text-gray-800">{size.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">({size.count})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="filter-section bg-white p-5 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => toggleColor(color.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                        color.border ? 'border border-gray-300' : ''
                      } ${selectedColors.includes(color.id) ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:ring-2 hover:ring-offset-2 hover:ring-blue-300'}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      aria-label={color.name}
                    >
                      {selectedColors.includes(color.id) && (
                        <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters button */}
              {(selectedBrands.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0) && (
                <button 
                  onClick={clearAllFilters}
                  className="w-full mt-6 py-3 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Clear all filters
                </button>
              )}
            </aside>

            {/* Products Section */}
            <main className="products-section flex-1">
              {/* Filters Bar */}
              <div className="filters-bar bg-white p-5 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <span className="text-sm text-gray-600 mr-5">Found {sortedProducts.length} items</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-2 rounded-full flex items-center">
                        Sale <FontAwesomeIcon icon={faTimes} className="ml-2 text-xs cursor-pointer hover:text-blue-900" />
                      </span>
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-2 rounded-full flex items-center">
                        Asus <FontAwesomeIcon icon={faTimes} className="ml-2 text-xs cursor-pointer hover:text-blue-900" />
                      </span>
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-2 rounded-full flex items-center">
                        1 TB <FontAwesomeIcon icon={faTimes} className="ml-2 text-xs cursor-pointer hover:text-blue-900" />
                      </span>
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-2 rounded-full flex items-center">
                        $340 - $1,250 <FontAwesomeIcon icon={faTimes} className="ml-2 text-xs cursor-pointer hover:text-blue-900" />
                      </span>
                      <button className="text-blue-600 text-xs font-medium hover:text-blue-800 transition-colors duration-200 ml-2">
                        Clear all
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="view-toggle flex border border-gray-300 rounded-md overflow-hidden">
                      <button 
                        className={`p-3 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <FontAwesomeIcon icon={faTh} />
                      </button>
                      <button 
                        className={`p-3 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setViewMode('list')}
                      >
                        <FontAwesomeIcon icon={faList} />
                      </button>
                    </div>
                    <span className="text-sm text-gray-600 mx-4">Sort by:</span>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-md py-2 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="popularity">Most popular</option>
                      <option value="rating">Sort by rating</option>
                      <option value="price-low">Sort by price: low to high</option>
                      <option value="price-high">Sort by price: high to low</option>
                      <option value="newest">Sort by newest</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`products-grid ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'} gap-6 mb-10`}>
                {paginatedProducts.map(product => (
                  <div key={product.id} className={`product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={`product-image relative ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                      {product.badge && (
                        <span className={`product-badge absolute top-4 left-4 text-white text-xs px-3 py-2 rounded z-10 ${
                          product.badge === 'new' ? 'bg-blue-500' : 'bg-red-500'
                        }`}>
                          {product.badge === 'new' ? 'New' : product.discount ? `-${product.discount}%` : 'Sale'}
                        </span>
                      )}
                      
                      <button 
                        className={`wishlist-btn absolute top-4 right-4 p-2 rounded-full bg-white shadow-md transition-colors duration-200 z-10 ${
                          wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                        }`}
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <FontAwesomeIcon icon={wishlist.includes(product.id) ? faHeart : faHeartRegular} />
                      </button>
                      
                      <div className={`aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 ${viewMode === 'list' ? 'h-full' : 'h-56'}`}>
                        <OptimizedImage 
                          src={product.image} 
                          alt={product.title}
                          width={300}
                          height={250}
                          className={`w-full ${viewMode === 'list' ? 'h-full' : 'h-56'} object-contain group-hover:scale-105 transition-transform duration-300`}
                        />
                      </div>
                    </div>
                    
                    <div className={`product-info p-5 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                      <div className="product-rating flex items-center mb-3">
                        <div className="stars flex">
                          {renderStars(product.rating)}
                        </div>
                        <span className="rating-count text-gray-500 text-xs ml-2">({product.reviewCount})</span>
                      </div>
                      
                      <h3 className="product-title text-sm font-medium text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                        {product.title}
                      </h3>
                      
                      <div className="product-price flex items-center mb-4">
                        <span className="current-price text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        {product.oldPrice && (
                          <span className="old-price line-through text-gray-500 text-sm ml-3">${product.oldPrice.toFixed(2)}</span>
                        )}
                      </div>
                      
                      <button 
                        className="add-to-cart-btn w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md flex items-center justify-center transition-colors duration-200 group/cart"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="mr-2 group-hover/cart:scale-110 transition-transform duration-200" />
                        Add to cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination flex justify-center items-center">
                <button 
                  className="pagination-btn flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-btn w-10 h-10 rounded-md mx-1 transition-colors duration-200 ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white' 
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  className="pagination-btn flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ml-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                </button>
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