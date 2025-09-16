'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '../components/Header'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import {
  getCart,
  addOrUpdateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
  applyDiscount,
  CartResponse
} from '../../services/cartService'

interface CartItem {
  id: number
  name: string
  price: number
  oldPrice?: number
  color: string
  model: string
  quantity: number
  image: string
  productId: string
  cartItemId?: string // Backend cart item ID
}

interface DiscountData {
  code: string
  discountAmount: number
  // Add other discount properties as needed
}

interface BackendCartItem {
  id: string // This should match the backend type (string)
  productId: string
  name?: string
  price: number
  quantity: number
  images?: string[]
  // Add other properties that might come from backend
}

interface BackendCart {
  items: BackendCartItem[]
  // Add other cart properties as needed
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountData | null>(null)

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCartData()
  }, [])

  const fetchCartData = async () => {
    try {
      setLoading(true)
      // In a real app, you'd get userId from authentication context
      const userId = localStorage.getItem('userId') || 'current-user-id'
      const response: CartResponse = await getCart(userId)

      if (response.success === 'SUCCESS') {
        // Transform backend cart items to frontend format
        const backendCart = (response.data.cart || response.data.activeCart) as unknown as BackendCart
        if (backendCart && backendCart.items) {
          const transformedItems = backendCart.items.map((item: BackendCartItem, index: number) => ({
            id: index + 1, // Frontend ID
            cartItemId: item.id, // Backend cart item ID
            productId: item.productId,
            name: item.name || 'Product Name',
            price: item.price,
            quantity: item.quantity,
            color: 'White', // You might need to store this in your backend
            model: 'Default', // You might need to store this in your backend
            image: item.images && item.images.length > 0
              ? item.images[0]
              : 'https://via.placeholder.com/110x110/EEF1F6/333333?text=Product'
          }))
          setCartItems(transformedItems)
        }
      }
    } catch (err) {
      setError('Failed to load cart data')
      console.error('Error fetching cart:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      const item = cartItems.find(item => item.id === id)
      if (!item) return

      // In a real app, you'd get userId and storeId from context
      const userId = localStorage.getItem('userId') || 'current-user-id'
      const storeId = 'default-store-id' // This should come from your app context

      await addOrUpdateCartItem(
        userId,
        storeId,
        item.productId,
        newQuantity,
        item.price,
        item.name,
        [item.image]
      )

      // Update local state
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    } catch (err) {
      setError('Failed to update quantity')
      console.error('Error updating quantity:', err)
    }
  }

  const removeItem = async (id: number) => {
    try {
      const item = cartItems.find(item => item.id === id)
      if (!item || !item.cartItemId) return

      await removeCartItem(item.cartItemId)

      // Update local state
      setCartItems(cartItems.filter(item => item.id !== id))
    } catch (err) {
      setError('Failed to remove item')
      console.error('Error removing item:', err)
    }
  }

  const clearCart = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'current-user-id'
      await clearCartApi(userId)
      setCartItems([])
    } catch (err) {
      setError('Failed to clear cart')
      console.error('Error clearing cart:', err)
    }
  }

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return

    try {
      const userId = localStorage.getItem('userId') || 'current-user-id'
      const response = await applyDiscount(userId, promoCode)

      if (response.success === 'SUCCESS') {
        setAppliedDiscount(response.data.appliedDiscount as DiscountData)
        // You might want to refresh the cart to show updated prices
        fetchCartData()
      }
    } catch (err) {
      setError('Failed to apply promo code')
      console.error('Error applying promo code:', err)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const savings = cartItems.reduce((sum, item) => sum + ((item.oldPrice || item.price) - item.price) * item.quantity, 0)
  const tax = subtotal * 0.03 // 3% tax
  const discountAmount = appliedDiscount ? appliedDiscount.discountAmount : 0
  const estimatedTotal = subtotal - savings + tax - discountAmount

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 mt-4">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 right-0 p-3"
              onClick={() => setError('')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        {/* Header Section */}
        <header className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <nav className="breadcrumb flex items-center space-x-2 text-sm text-gray-600">
              <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
              <span className="text-gray-400">/</span>
              <a href="#" className="text-gray-700 hover:text-blue-600">Shop</a>
              <span className="text-gray-400">/</span>
              <a href="#" className="text-gray-700 hover:text-blue-600">Category</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-400">Shopping cart</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mt-4">Shopping cart</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="lg:w-2/3">
              {/* Free Shipping Progress */}
              <div className="free-shipping bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-gray-600 mb-2">Buy $183 more to get Free Shipping</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-end -mt-4">
                  <div className="w-6 h-6 bg-white border border-amber-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2.5a7.5 7.5 0 017.5 7.5h-1.5a6 6 0 00-6-6v-1.5zm-5 7.5a5 5 极 0 015-5v1.5a3.5 3.5 0 00-3.5 3.5h-1.5z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="cart-items bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-gray-600 text-sm border-b">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 极 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <a href="#" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Continue Shopping
                    </a>
                  </div>
                ) : (
                  <>
                    {cartItems.map(item => (
                      <div key={item.id} className="cart-item grid grid-cols-12 gap-4 p-6 border-b">
                        <div className="col-span-12 md:col-span-5 flex items-center space-x-4">
                          <div className="product-image w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <div className="text-sm text-gray极-500 mt-1">
                              <p>Color: {item.color}</p>
                              <p>Model: {item.model}</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-2 flex items-center">
                          <div>
                            <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                            {item.oldPrice && (
                              <p className="text-sm text-gray-500 line-through">${item.oldPrice.toFixed(2)}</p>
                            )}
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-2 flex items-center">
                          <div className="quantity-control flex border border-gray-300 rounded-md">
                            <button
                              className="px极-3 py-1 text-gray-极600 hover:bg-gray-100"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="w-12 text-center border-x border-gray-300 py-1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              min="1"
                            />
                            <button
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-2 flex items-center">
                          <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>

                        <div className="col-span-12 md:col-span-1 flex items-center justify-end">
                          <button
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="p-6">
                      <button
                        className="flex items-center text-gray-700 hover:text-red-600"
                        onClick={clearCart}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5极 7m5 4v6m4-6极v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Clear cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="order-summary bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb极-6">
                  <h2 className="text-xl font-semibold text-gray-900">Order summary</h2>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items):</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Saving:</span>
                    <span className="text-green-600 font-medium">-${savings.toFixed(2)}</span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount ({appliedDiscount.code}):</span>
                      <span className="text-green-600 font-medium">-${appliedDiscount.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax collected:</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <div className="极flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimated total:</span>
                    <span className="text-xl font-bold text-gray-900">${estimatedTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2极" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2极v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Proceed to checkout
                </button>

                <p className="text-center text-gray-600 text-sm mt-4">
                  Create an account and get 239 bonuses
                </p>
              </div>

              <div className="promo-code bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <svg className="w-5极 h-5 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 极24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m极0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                    </svg>
                    <span className="font-medium text-gray-900">Apply promo code</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleApplyPromoCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>

                {appliedDiscount && (
                  <div className="mt-3 p-2 bg-green-100 text-green-800 rounded-md">
                    Discount applied: {appliedDiscount.code} (-${appliedDiscount.discountAmount.toFixed(2)})
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Newsletter />
      <Footer />
    </>
  )
}