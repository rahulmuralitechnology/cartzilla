// src/components/Header.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faSearch,
  faUser,
  faHeart,
  faShoppingCart,
  faChevronDown,
  faLaptop,
  faMobileAlt,
  faTv,
  faVolumeUp,
  faCamera,
  faPrint,
  faBatteryFull,
  faHeadphones,
  faClock,
  faBolt,
  faHdd,
  faGamepad,
  faChevronRight,
  faExclamationTriangle,
  faSpinner,
  faSun,
  faMoon,
  faCaretDown
} from '@fortawesome/free-solid-svg-icons'
import { Category, Subcategory } from '@/types'
import axios from 'axios'
import CartOffcanvas from './CartOffcanvas'

// API configuration
const MASTER_API_URL = process.env.NEXT_PUBLIC_MASTER_API_URL || 'https://your-api-domain.com/api'
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || 'default-store-id'

// Define API response type
interface ApiCategory {
  id: number;
  name: string;
  categoryImage?: string;
  description?: string;
  subcategories?: Subcategory[];
}

interface ApiResponse {
  success: boolean;
  data: {
    productCategory: ApiCategory[];
  };
}

export default function Header() {
  const [language, setLanguage] = useState('Eng')
  const [currency, setCurrency] = useState('USD ($)')
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)
  const currencyRef = useRef<HTMLDivElement>(null)

  // Helper function to map category names to icons
  const mapCategoryToIcon = (categoryName: string): string => {
    const iconMap: Record<string, string> = {
      'computers': 'laptop',
      'laptops': 'laptop',
      'smartphones': 'mobile-alt',
      'phones': 'mobile-alt',
      'tablets': 'mobile-alt',
      'tv': 'tv',
      'television': 'tv',
      'audio': 'volume-up',
      'speakers': 'volume-up',
      'cameras': 'camera',
      'photo': 'camera',
      'video': 'camera',
      'printers': 'print',
      'charging': 'battery-full',
      'power': 'battery-full',
      'headphones': 'headphones',
      'wearables': 'clock',
      'watches': 'clock',
      'storage': 'hdd',
      'hard drives': 'hdd',
      'ssd': 'hdd',
      'gaming': 'gamepad',
      'games': 'gamepad',
      'electronics': 'bolt'
    }

    const lowerName = categoryName.toLowerCase()
    for (const [key, value] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return value
      }
    }
    
    return 'laptop' // default icon
  }

  // Generate default subcategories based on category name
  const generateDefaultSubcategories = (categoryName: string): Subcategory[] => {
    const lowerName = categoryName.toLowerCase()
    
    if (lowerName.includes('computer') || lowerName.includes('laptop')) {
      return [
        { id: 101, name: 'Laptops' },
        { id: 102, name: 'Desktops' },
        { id: 103, name: 'Monitors' },
        { id: 104, name: 'Keyboards' },
        { id: 105, name: 'Mice' },
      ]
    } else if (lowerName.includes('phone') || lowerName.includes('mobile')) {
      return [
        { id: 201, name: 'Smartphones' },
        { id: 202, name: 'Accessories' },
        { id: 203, name: 'Cases' },
        { id: 204, name: 'Chargers' },
      ]
    } else if (lowerName.includes('tv') || lowerName.includes('television')) {
      return [
        { id: 301, name: 'LED TVs' },
        { id: 302, name: 'OLED TVs' },
        { id: 303, name: 'Smart TVs' },
      ]
    }
    
    // Default subcategories
    return [
      { id: 1, name: 'Popular' },
      { id: 2, name: 'New Arrivals' },
      { id: 3, name: 'Best Sellers' },
      { id: 4, name: 'Special Offers' },
    ]
  }

  // Sample categories for fallback
  const getSampleCategories = (): Category[] => [
    {
      id: 1,
      name: 'Computers & Laptops',
      icon: 'laptop',
      subcategories: [
        { id: 101, name: 'Laptops' },
        { id: 102, name: 'Desktops' },
        { id: 103, name: 'Monitors' },
        { id: 104, name: 'Keyboards' },
        { id: 105, name: 'Mice' },
      ]
    },
    {
      id: 2,
      name: 'Smartphones & Tablets',
      icon: 'mobile-alt',
      subcategories: [
        { id: 201, name: 'Smartphones' },
        { id: 202, name: 'Tablets' },
        { id: 203, name: 'Accessories' },
        { id: 204, name: 'Cases' },
      ]
    },
    {
      id: 3,
      name: 'TV & Audio',
      icon: 'tv',
      subcategories: [
        { id: 301, name: 'LED TVs' },
        { id: 302, name: 'OLED TVs' },
        { id: 303, name: 'Soundbars' },
        { id: 304, name: 'Home Theaters' },
      ]
    },
    {
      id: 4,
      name: 'Cameras & Photo',
      icon: 'camera',
      subcategories: [
        { id: 401, name: 'DSLR Cameras' },
        { id: 402, name: 'Mirrorless Cameras' },
        { id: 403, name: 'Lenses' },
        { id: 404, name: 'Accessories' },
      ]
    },
    {
      id: 5,
      name: 'Gaming',
      icon: 'gamepad',
      subcategories: [
        { id: 501, name: 'Gaming Consoles' },
        { id: 502, name: 'Games' },
        { id: 503, name: 'Accessories' },
        { id: 504, name: 'VR Headsets' },
      ]
    }
  ]

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get<ApiResponse>(
        `${MASTER_API_URL}/product-category/get-all-categories/${STORE_ID}`
      )

      if (!response.data.success || !response.data.data.productCategory) {
        throw new Error("Invalid API response structure")
      }

      const apiCategories: Category[] = response.data.data.productCategory.map(
        (category: ApiCategory) => ({
          id: category.id,
          name: category.name,
          categoryImage: category.categoryImage,
          description: category.description,
          icon: mapCategoryToIcon(category.name),
          subcategories: category.subcategories || generateDefaultSubcategories(category.name)
        })
      )

      setCategories(apiCategories)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories'
      setError(errorMessage)
      console.error('Error fetching categories:', err)
      
      // Fallback to sample categories if API fails
      if (categories.length === 0) {
        setCategories(getSampleCategories())
      }
    } finally {
      setLoading(false)
    }
  }, [categories.length]) // Added categories.length as dependency

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false)
        setActiveCategory(null)
      }
      
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false)
      }
      
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories, retryCount]) // Added fetchCategories to dependencies

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen)
    if (isCategoriesOpen) {
      setActiveCategory(null)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    // You might want to persist this in localStorage
    // localStorage.setItem('theme', newTheme)
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'laptop': return faLaptop;
      case 'mobile-alt': return faMobileAlt;
      case 'tv': return faTv;
      case 'volume-up': return faVolumeUp;
      case 'camera': return faCamera;
      case 'print': return faPrint;
      case 'battery-full': return faBatteryFull;
      case 'headphones': return faHeadphones;
      case 'clock': return faClock;
      case 'bolt': return faBolt;
      case 'hdd': return faHdd;
      case 'gamepad': return faGamepad;
      default: return faLaptop;
    }
  }

  // Theme-based styles
  const headerBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const navBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const logoColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const searchBorder = theme === 'dark' ? 'border-white' : 'border-gray-300'
  const searchBg = theme === 'dark' ? 'bg-transparent' : 'bg-white'
  const searchText = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const dropdownBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const dropdownText = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const dropdownHover = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'

  return (
    <header className={`header ${headerBgColor}`} role="banner">
      <div className="top-bar">
        <div className={`logo ${logoColor}`} aria-label="Cartzilla Logo">
          Cartz<span className="text-primary">illa</span>
        </div>

        <div className={`flex-1 max-w-md mx-5 my-3 md:my-0 relative ${isSearchFocused ? 'ring-2 ring-primary rounded-full' : ''}`}>
          <input
            type="text"
            placeholder="Search the products"
            className={`search-input ${searchBg} ${searchBorder} ${searchText}`}
            aria-label="Search products"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
            aria-label="Search"
          >
            <FontAwesomeIcon icon={faSearch} className={textColor} />
          </button>
        </div>

        <div className={`text-sm mr-4 hidden md:block ${textColor}`}>
          Only this month <span className="text-primary font-semibold">Super Sale 20%</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
          </button>

          {/* Language Selector */}
          <div className="relative" ref={languageRef}>
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className={`flex items-center gap-1 ${textColor} p-1 rounded`}
              aria-expanded={isLanguageOpen}
            >
              {language}
              <FontAwesomeIcon icon={faCaretDown} className="text-xs" />
            </button>
            
            {isLanguageOpen && (
              <div className={`absolute top-full left-0 mt-1 w-32 rounded-md shadow-lg ${dropdownBg} ${dropdownText} z-50`}>
                <div className="py-1">
                  {['Eng', 'Esp', 'Fr'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang)
                        setIsLanguageOpen(false)
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${dropdownHover} ${lang === language ? 'bg-primary text-white' : ''}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className={`flex items-center gap-1 ${textColor} p-1 rounded`}
              aria-expanded={isCurrencyOpen}
            >
              {currency}
              <FontAwesomeIcon icon={faCaretDown} className="text-xs" />
            </button>
            
            {isCurrencyOpen && (
              <div className={`absolute top-full left-0 mt-1 w-32 rounded-md shadow-lg ${dropdownBg} ${dropdownText} z-50`}>
                <div className="py-1">
                  {['USD ($)', 'EUR (€)', 'GBP (£)'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr)
                        setIsCurrencyOpen(false)
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${dropdownHover} ${curr === currency ? 'bg-primary text-white' : ''}`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            className={`text-lg ${textColor}`}
            aria-label="User account"
            onClick={() => window.location.href = '/account'}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>

          <button
            className={`text-lg ${textColor}`}
            aria-label="Wishlist"
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>

          <button
            className="text-gray-300 text-lg relative"
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping cart"
          >
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className="absolute -top-2 -right-2 bg-success text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-800">
              3
            </span>
          </button>
        </div>
      </div>

      <div className={`nav-container ${navBgColor}`}>
        <nav className="nav-bar" aria-label="Main navigation">
          <div className="relative" ref={categoriesRef}>
            <button
              className={`categories-btn ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
              onClick={toggleCategories}
              aria-expanded={isCategoriesOpen}
              aria-haspopup="true"
              aria-controls="categories-dropdown"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faBars} />
              Categories
              <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-xs" />
              {loading && (
                <FontAwesomeIcon icon={faSpinner} className="ml-2 animate-spin" />
              )}
            </button>

            {isCategoriesOpen && (
              <div className="categories-dropdown-container">
                <div id="categories-dropdown" className="categories-sidebar mt-10">
                  {error ? (
                    <div className="p-4">
                      <div className="text-red-500 mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                        Error loading categories
                      </div>
                      <button
                        onClick={handleRetry}
                        className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark"
                      >
                        Retry
                      </button>
                    </div>
                  ) : categories.length === 0 && !loading ? (
                    <div className="p-4 text-gray-500">
                      No categories available
                    </div>
                  ) : (
                    categories.map(category => (
                      <div 
                        key={category.id} 
                        className="category-item"
                        onMouseEnter={() => setActiveCategory(category.id)}
                      >
                        <div className="w-5 h-5 opacity-60 text-gray-700">
                          <FontAwesomeIcon icon={getIconComponent(category.icon)} />
                        </div>
                        <div className="flex-1 text-gray-700 font-medium">
                          {category.name}
                        </div>
                        <div className="w-4 h-4 opacity-60 text-gray-700">
                          <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {activeCategory && (
                  <div className="subcategories-panel">
                    <div className="subcategories-grid">
                      {categories
                        .find(c => c.id === activeCategory)
                        ?.subcategories
                        .map(subcategory => (
                          <a 
                            key={subcategory.id} 
                            href="#"
                            className="subcategory-item"
                          >
                            {subcategory.name}
                          </a>
                        ))
                      }
                    </div>
                    <div className="subcategories-footer">
                      <a href="#" className="shop-now-btn">
                        Shop Now
                        <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-xs" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <ul className="menu" role="menubar">
            <li role="none">
              <a href="#" role="menuitem" className={textColor}>
                Best Sellers
              </a>
            </li>
            <li role="none">
              <a href="#" role="menuitem" className={textColor}>
                Today&apos;s Deals
              </a>
            </li>
            <li role="none">
              <a href="#" role="menuitem" className={textColor}>
                New Arrivals
              </a>
            </li>
            <li role="none">
              <a href="#" role="menuitem" className={textColor}>
                Gift Cards
              </a>
            </li>
            <li role="none">
              <a href="#" role="menuitem" className={textColor}>
                Help Center
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <CartOffcanvas isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}