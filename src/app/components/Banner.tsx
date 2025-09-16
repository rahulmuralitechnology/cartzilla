// src/components/Banner.tsx - Updated with proper image handling
import OptimizedImage from './Image'

export default function Banner() {
  return (
    <section className="banner-section">
      <div className="banner-content">
        <div className="banner-text">
          <h2 className="banner-title">seasonal weekly sale 2024</h2>
          <p className="banner-desc">
            Use code <span className="banner-code">Sale2024</span> to get best offer
          </p>
          
          <div className="countdown">
            <div className="countdown-item">
              <div className="countdown-value">12</div>
              <div className="countdown-label">days</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-value">10</div>
              <div className="countdown-label">hours</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-value">12</div>
              <div className="countdown-label">mins</div>
            </div>
          </div>
        </div>
        
        <div className="banner-image">
          <OptimizedImage 
            src="https://via.placeholder.com/400x300/ACCBEE/333333?text=Special+Offer" 
            alt="Special Offer" 
            width={400}
            height={300}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  )
}