// src/components/Hero.tsx - Updated with proper image handling
'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import OptimizedImage from './Image'

export default function Hero() {

  return (
    <section className="hero-section">
      {/* Mobile categories toggle button */}
      
      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-subtitle">Feel the real quality sound</p>
          <h1 className="hero-title">Headphones ProMax</h1>
          <a href="#" className="btn">
            Shop now <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
        
        <div className="hero-image">
          <OptimizedImage 
            src="https://via.placeholder.com/500x400/ACCBEE/333333?text=Headphones+ProMax" 
            alt="Headphones ProMax" 
            width={500}
            height={400}
            className="max-w-full h-auto"
          />
        </div>
        
        <div className="slider-progress">
          <div className="slider-progress-filled"></div>
        </div>
      </div>
    </section>
  )
}