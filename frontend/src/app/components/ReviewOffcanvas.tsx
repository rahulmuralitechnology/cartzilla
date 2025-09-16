// src/components/ReviewOffcanvas.tsx
'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes,
  faStar,
  faThumbsUp,
  faThumbsDown
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

interface ReviewOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewOffcanvas({ isOpen, onClose }: ReviewOffcanvasProps) {
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  const [notHelpfulClicked, setNotHelpfulClicked] = useState(false);
  
  const product = {
    name: 'Laptop Apple MacBook Pro 13 M2',
    price: 1200.00,
    shipping: 21.05,
    date: 'June 17, 2024',
    color: 'Space Gray',
    model: '256GB',
    review: 'After 6 months of using the laptop, I can say that it fully meets the needs. The main advantage is smooth operation without hangs, the function of scanning fingerprints to unlock the laptop works perfectly, it will be useful for those who work in the office (confidentiality of information is guaranteed).',
    pros: ['Touchpad', 'design', 'weight', 'performance', 'battery'],
    cons: ['Warming up'],
    bonuses: 100
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleHelpfulClick = () => {
    setHelpfulClicked(!helpfulClicked);
    if (notHelpfulClicked) setNotHelpfulClicked(false);
  }

  const handleNotHelpfulClick = () => {
    setNotHelpfulClicked(!notHelpfulClicked);
    if (helpfulClicked) setHelpfulClicked(false);
  }

  if (!isOpen) return null

  return (
    <>
      <div className="offcanvas-overlay" onClick={handleOverlayClick}></div>
      
      <div className="review-offcanvas">
        <div className="review-header">
          <h2 className="review-title">Review</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close review">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-pricing">
            <span className="product-price">${product.price.toFixed(2)}</span>
            <span className="shipping-price">${product.shipping.toFixed(2)} Shipping</span>
          </div>
          <div className="purchase-date">Purchased on {product.date}</div>
          
          <div className="product-specs">
            <div className="spec">
              <span className="spec-label">Color:</span>
              <span className="spec-value">{product.color}</span>
            </div>
            <div className="spec">
              <span className="spec-label">Model:</span>
              <span className="spec-value">{product.model}</span>
            </div>
          </div>
        </div>

        <div className="review-content">
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
            ))}
          </div>
          
          <p className="review-text">{product.review}</p>
          
          <div className="pros-cons">
            <div className="pros">
              <h4>Pros:</h4>
              <ul>
                {product.pros.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>
            </div>
            
            <div className="cons">
              <h4>Cons:</h4>
              <ul>
                {product.cons.map((con, index) => (
                  <li key={index}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="review-feedback">
          <span>Was this review helpful?</span>
          <div className="feedback-buttons">
            <button 
              className={`feedback-btn ${helpfulClicked ? 'active' : ''}`}
              onClick={handleHelpfulClick}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>Yes</span>
            </button>
            <button 
              className={`feedback-btn ${notHelpfulClicked ? 'active' : ''}`}
              onClick={handleNotHelpfulClick}
            >
              <FontAwesomeIcon icon={faThumbsDown} />
              <span>No</span>
            </button>
          </div>
        </div>

        <div className="bonus-info">
          <div className="bonus-badge">
            <span>You have earned +{product.bonuses} bonuses</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .offcanvas-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        
        .review-offcanvas {
          position: fixed;
          width: 506px;
          height: 100vh;
          right: 0;
          top: 0;
          background: #FFFFFF;
          border-left: 1px solid #EEF1F6;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow-y: auto;
        }
        
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #EEF1F6;
        }
        
        .review-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #333;
        }
        
        .product-info {
          padding: 24px;
          border-bottom: 1px solid #EEF1F6;
        }
        
        .product-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }
        
        .product-pricing {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;
        }
        
        .product-price {
          font-size: 20px;
          font-weight: 600;
        }
        
        .shipping-price {
          font-size: 14px;
          color: #666;
        }
        
        .purchase-date {
          font-size: 14px;
          color: #666;
          margin-bottom: 16px;
        }
        
        .product-specs {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .spec {
          display: flex;
          gap: 8px;
        }
        
        .spec-label {
          font-weight: 600;
          color: #333;
        }
        
        .spec-value {
          color: #666;
        }
        
        .review-content {
          padding: 24px;
          border-bottom: 1px solid #EEF1F6;
        }
        
        .rating {
          margin-bottom: 16px;
          color: #FFD700;
        }
        
        .review-text {
          line-height: 1.6;
          margin-bottom: 20px;
          color: #333;
        }
        
        .pros-cons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .pros h4, .cons h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
        }
        
        .pros ul, .cons ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .pros li {
          color: #28A745;
        }
        
        .cons li {
          color: #DC3545;
        }
        
        .review-feedback {
          padding: 24px;
          border-bottom: 1px solid #EEF1F6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .feedback-buttons {
          display: flex;
          gap: 12px;
        }
        
        .feedback-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid #DDD;
          background: #FFF;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .feedback-btn.active {
          background: #F8F9FA;
          border-color: #333;
        }
        
        .bonus-info {
          padding: 24px;
        }
        
        .bonus-badge {
          background: #F8F9FA;
          border-radius: 6px;
          padding: 12px 16px;
          text-align: center;
          font-weight: 600;
        }
      `}</style>
    </>
  )
}