// src/components/CartOffcanvas.tsx
'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes,
  faPlus,
  faMinus,
  faTrash,
  faTruck
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Image from 'next/image'

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  discount?: number;
}

interface CartOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartOffcanvas({ isOpen, onClose }: CartOffcanvasProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Apple iPhone 14 128GB White',
      price: 899.00,
      originalPrice: 956.00,
      quantity: 1,
      image: 'https://via.placeholder.com/80x80/EEF1F6/333333?text=iPhone',
      discount: 10
    },
    {
      id: 2,
      name: 'Tablet Apple iPad Pro M2',
      price: 989.00,
      originalPrice: 1099.00,
      quantity: 1,
      image: 'https://via.placeholder.com/80x80/EEF1F6/333333?text=iPad',
      discount: 10
    },
    {
      id: 3,
      name: 'Smart Watch Series 7, White',
      price: 429.00,
      originalPrice: 456.00,
      quantity: 1,
      image: 'https://via.placeholder.com/80x80/EEF1F6/333333?text=Watch'
    }
  ])

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const freeShippingThreshold = 2500.00
  const amountNeeded = freeShippingThreshold - subtotal
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="cart-offcanvas-overlay" onClick={handleOverlayClick}></div>
      
      <div className="cart-offcanvas">
        <div className="cart-header">
          <h2 className="cart-title">Shopping cart</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close cart">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="shipping-progress">
          <div className="progress-text">
            <FontAwesomeIcon icon={faTruck} className="truck-icon" />
            <span>
              {amountNeeded > 0 ? (
                <>Buy ${amountNeeded.toFixed(2)} more to get <strong>Free Shipping</strong></>
              ) : (
                <strong>Congratulations! You get Free Shipping!</strong>
              )}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <Image 
                  src={item.image} 
                  alt={item.name}
                  width={80}
                  height={80}
                  className="product-image"
                />
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                
                <div className="item-price">
                  <span className="current-price">${item.price.toFixed(2)}</span>
                  {item.originalPrice && (
                    <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                  )}
                  {item.discount && (
                    <span className="discount-badge">-{item.discount}%</span>
                  )}
                </div>
                
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  
                  <span className="quantity">{item.quantity}</span>
                  
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
              
              <button 
                className="remove-btn"
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="subtotal">
            <span className="subtotal-label">Subtotal:</span>
            <span className="subtotal-amount">${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="cart-actions">
            <button className="view-cart-btn">
              View cart
            </button>
            <button className="checkout-btn">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}