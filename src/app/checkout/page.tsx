// src/app/checkout/page.tsx
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
  faCalendarAlt,
  faClock
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

export default function CheckoutPage() {
  const [activeStep] = useState(3) // Step 3 is active
  const [selectedShipping] = useState('courier')
  const [selectedTimeSlot] = useState('Monday, 13 | 12:00 - 16:00')
  const [postcode] = useState('15006')
  const [sameAsDelivery, setSameAsDelivery] = useState(true)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    city: '',
    postcode: '15006',
    address: '',
    additionalAddress: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const cartItems = [
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
  ]

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const savings = cartItems.reduce((total, item) => 
    total + ((item.originalPrice || item.price) - item.price) * item.quantity, 0)
  const tax = subtotal * 0.03
  const shippingCost = selectedShipping === 'courier' ? 26.50 : selectedShipping === 'local' ? 21.40 : 0
  const estimatedTotal = subtotal + tax + shippingCost - savings

  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']

  const categories = [
    'Computers', 'Smartphones', 'TV, Video', 'Speakers', 'Cameras', 'Printers',
    'Video Games', 'Headphones', 'Wearable', 'HDD/SSD', 'Smart Home', 'Apple Devices',
    'Tablets', 'Monitors', 'Scanners', 'Servers', 'Heating and Cooling', 'E-readers',
    'Data Storage', 'Networking', 'Power Strips', 'Plugs and Outlets', 'Detectors and Sensors',
    'Accessories'
  ]

  return (
    <div className="checkout-page">
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
      <main className="checkout-content">
        <div className="checkout-container">
          <div className="checkout-steps">
            <div className={`step ${activeStep === 1 ? 'active' : ''}`}>
              <div className="step-header">
                <div className="step-number">1</div>
                <h3>Delivery Information</h3>
              </div>
            </div>
            
            <div className={`step ${activeStep === 2 ? 'active' : ''}`}>
              <div className="step-header">
                <div className="step-number">2</div>
                <h3>Shipping Address</h3>
              </div>
            </div>
            
            <div className={`step ${activeStep === 3 ? 'active' : ''}`}>
              <div className="step-header">
                <div className="step-number">3</div>
                <h3>Payment</h3>
              </div>
              
              {activeStep === 3 && (
                <div className="step-body">
                  <div className="delivery-info-section">
                    <div className="section-header">
                      <h4>Delivery information</h4>
                      <button className="edit-btn">Edit</button>
                    </div>
                    
                    <div className="delivery-details">
                      <div className="detail-item">
                        <span className="label">Postcode</span>
                        <span className="value">{postcode}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="label">Estimated delivery date</span>
                        <span className="value">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                          <FontAwesomeIcon icon={faClock} />
                          {selectedTimeSlot}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="shipping-address-form">
                    <h4>Shipping Address</h4>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="firstName">First name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          placeholder="Placeholder"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="lastName">Last name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          placeholder="Placeholder"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email">Email address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Placeholder"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="mobile">Mobile number</label>
                        <input
                          type="tel"
                          id="mobile"
                          name="mobile"
                          placeholder="Placeholder"
                          value={formData.mobile}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <select
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select your city</option>
                          {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="postcode">Postcode *</label>
                        <input
                          type="text"
                          id="postcode"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label htmlFor="address">House / apartment number and street address *</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          placeholder="Placeholder"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label htmlFor="additionalAddress">Add address lines</label>
                        <input
                          type="text"
                          id="additionalAddress"
                          name="additionalAddress"
                          placeholder="Placeholder"
                          value={formData.additionalAddress}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="billing-address">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={sameAsDelivery}
                          onChange={() => setSameAsDelivery(!sameAsDelivery)}
                        />
                        <span className="checkmark"></span>
                        Billing address same as delivery address
                      </label>
                    </div>
                    
                    <button className="continue-btn">
                      Continue
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="order-summary">
            <div className="summary-card">
              <div className="summary-header">
                <h3>Order summary</h3>
                <button className="edit-btn">Edit</button>
              </div>
              
              <div className="product-images">
                {cartItems.map(item => (
                  <div key={item.id} className="product-image">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                    />
                  </div>
                ))}
                <FontAwesomeIcon icon={faChevronRight} className="chevron-right" />
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-details">
                <div className="summary-item">
                  <span>Subtotal (3 items):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-item">
                  <span>Saving:</span>
                  <span className="savings">-${savings.toFixed(2)}</span>
                </div>
                
                <div className="summary-item">
                  <span>Tax collected:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="summary-item">
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-total">
                <span>Estimated total:</span>
                <span className="total-amount">${estimatedTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bonus-card">
              <FontAwesomeIcon icon={faGift} className="bonus-icon" />
              <p>Create an account and get 239 bonuses</p>
            </div>
            
            <div className="bonus-card">
              <FontAwesomeIcon icon={faGift} className="bonus-icon" />
              <p>Congratulations! You have earned 256 bonuses</p>
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