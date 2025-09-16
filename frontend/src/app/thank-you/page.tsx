// src/app/thank-you/page.tsx
'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronRight,
  faSearch,
  faShoppingCart,
  faUser,
  faHeart,
  faBell,
  faGift,
  faCopy,
  faCheck,
  faTruck,
  faClock,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

export default function ThankYouPage() {
  const [couponCopied, setCouponCopied] = useState(false)

  const copyCouponCode = () => {
    navigator.clipboard.writeText('30%SALEOFF')
    setCouponCopied(true)
    setTimeout(() => setCouponCopied(false), 2000)
  }

  const recommendedProducts = [
    {
      id: 1,
      name: 'VRB01 Virtual Reality Glasses',
      price: 340.99,
      originalPrice: 430.00,
      discount: 21,
      image: 'https://via.placeholder.com/200x200/EEF1F6/333333?text=VR+Glasses'
    },
    {
      id: 2,
      name: 'Apple iPhone 14 128GB Blue',
      price: 899.00,
      originalPrice: 960.00,
      discount: 6,
      image: 'https://via.placeholder.com/200x200/EEF1F6/333333?text=iPhone+14'
    }
  ]

  const categories = [
    'Computers', 'Smartphones', 'TV, Video', 'Speakers', 'Cameras', 'Printers',
    'Video Games', 'Headphones', 'Wearable', 'HDD/SSD', 'Smart Home', 'Apple Devices',
    'Tablets', 'Monitors', 'Scanners', 'Servers', 'Heating and Cooling', 'E-readers',
    'Data Storage', 'Networking', 'Power Strips', 'Plugs and Outlets', 'Detectors and Sensors',
    'Accessories'
  ]

  return (
    <div className="thank-you-page">
      {/* Navbar */}
      <header className="checkout-navbar">
        <div className="navbar-top">
          <div className="logo">
            <span className="logo-icon">C</span>
            <span className="logo-text">Cartzilla</span>
          </div>
          
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input type="text" placeholder="Search the products" />
          </div>
          
          <div className="top-actions">
            <div className="sale-banner">
              <div className="sale-icon">
                <FontAwesomeIcon icon={faGift} />
              </div>
              <div className="sale-text">
                <div>Only this month</div>
                <div>Super Sale 20%</div>
              </div>
            </div>
            
            <button className="icon-btn">
              <FontAwesomeIcon icon={faUser} />
            </button>
            
            <button className="icon-btn">
              <FontAwesomeIcon icon={faHeart} />
            </button>
            
            <button className="icon-btn">
              <FontAwesomeIcon icon={faBell} />
            </button>
            
            <button className="icon-btn cart-btn">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="cart-count">3</span>
            </button>
          </div>
        </div>
        
        <div className="navbar-bottom">
          <div className="categories-toggle">
            <span>Categories</span>
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
          
          <nav className="main-nav">
            <a href="#">Best Sellers</a>
            <a href="#">Today&apos;s Deals</a>
            <a href="#">New Arrivals</a>
            <a href="#">Gift Cards</a>
            <a href="#">Help Center</a>
          </nav>
          
          <div className="nav-utils">
            <div className="language-selector">
              <span>Eng</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="currency-selector">
              <span>USD ($)</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="thank-you-content">
        <div className="thank-you-container">
          {/* Order Header */}
          <div className="order-header">
            <div className="order-info">
              <h1>Thank you for your order!</h1>
              <div className="order-number">
                <span>Order #234000</span>
                <button className="track-order-btn">
                  Track order
                </button>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="order-details">
            <div className="detail-card">
              <div className="detail-icon">
                <FontAwesomeIcon icon={faTruck} />
              </div>
              <div className="detail-content">
                <h3>Delivery</h3>
                <p>567 Cherry Souse Lane Sacramento, 95829</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className="detail-content">
                <h3>Time</h3>
                <p>Sunday, May 9, 12:00 - 14:00</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FontAwesomeIcon icon={faCreditCard} />
              </div>
              <div className="detail-content">
                <h3>Payment</h3>
                <p>Cash on delivery</p>
              </div>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="coupon-section">
            <div className="coupon-header">
              <span className="congrats-icon">🎉</span>
              <h2>Congratulations! 30% off your new purchase!</h2>
            </div>
            <p>Use the coupon now or look for it in your personal account.</p>
            
            <div className="coupon-code">
              <span>30%SALEOFF</span>
              <button 
                className={`copy-btn ${couponCopied ? 'copied' : ''}`}
                onClick={copyCouponCode}
              >
                <FontAwesomeIcon icon={couponCopied ? faCheck : faCopy} />
                {couponCopied ? 'Copied!' : 'Copy coupon'}
              </button>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="recommended-section">
            <h2>You may also like</h2>
            <div className="products-grid">
              {recommendedProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      width={200}
                      height={200}
                    />
                    {product.discount && (
                      <span className="discount-badge">-{product.discount}%</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-pricing">
                      <span className="current-price">${product.price.toFixed(2)}</span>
                      <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="continue-shopping-btn">
              Continue shopping
            </button>
            <div className="help-section">
              <span>Need help?</span>
              <a href="#" className="contact-link">Contact us</a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="checkout-footer">
        <div className="footer-top">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">C</span>
              <span className="logo-text">Cartzilla</span>
            </div>
            
            <div className="contact-us">
              <p>Got question? Contact us 24/7</p>
              <button className="contact-btn">
                <span>Contact us</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About company</a></li>
              <li><a href="#">Our team</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">News</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Account</h4>
            <ul>
              <li><a href="#">Your account</a></li>
              <li><a href="#">Shipping rates & policies</a></li>
              <li><a href="#">Refunds & replacements</a></li>
              <li><a href="#">Order tracking</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Customer service</h4>
            <ul>
              <li><a href="#">Payment methods</a></li>
              <li><a href="#">Money back guarantee</a></li>
              <li><a href="#">Product returns</a></li>
              <li><a href="#">Support center</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Taxes & fees</a></li>
            </ul>
          </div>
        </div>
        
        <div className="categories-row">
          {categories.slice(0, 12).map((category, index) => (
            <span key={category}>
              {category}
              {index < 11 && <span className="separator">/</span>}
            </span>
          ))}
        </div>
        
        <div className="categories-row">
          {categories.slice(12).map((category, index) => (
            <span key={category}>
              {category}
              {index < categories.slice(12).length - 1 && <span className="separator">/</span>}
            </span>
          ))}
        </div>
        
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          
          <div className="bottom-content">
            <div className="copyright">
              © All rights reserved. Made by Createx Studio
            </div>
            
            <div className="payment-methods">
              <div className="payment-method">
                <span>Visa</span>
              </div>
              <div className="payment-method">
                <span>Mastercard</span>
              </div>
              <div className="payment-method">
                <span>PayPal</span>
              </div>
              <div className="payment-method">
                <span>Google Pay</span>
              </div>
              <div className="payment-method">
                <span>Apple Pay</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}