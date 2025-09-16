// src/app/components/Newsletter.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faYoutube 
} from '@fortawesome/free-brands-svg-icons'
import { Video } from '@/types'

const videos: Video[] = [
  {
    id: 1,
    title: '5 New Cool Gadgets You Must See on Cartzilla - Cheap Budget',
    duration: '6:16',
    thumbnail: 'https://via.placeholder.com/140x86/EEF1F6/333333?text=Video+1'
  },
  {
    id: 2,
    title: '5 Super Useful Gadgets on Cartzilla You Must Have in 2023',
    duration: '10:20',
    thumbnail: 'https://via.placeholder.com/140x86/EEF1F6/333333?text=Video+2'
  },
  {
    id: 3,
    title: 'Top 5 New Amazing Gadgets on Cartzilla You Must See',
    duration: '8:40',
    thumbnail: 'https://via.placeholder.com/140x86/EEF1F6/333333?text=Video+3'
  }
]

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Thanks for subscribing to our newsletter!')
    setEmail('')
    setIsSubmitting(false)
  }

  return (
    <section className="newsletter-section bg-gray-50 py-16">
      <div className="newsletter-container max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div className="newsletter-content">
          <h2 className="newsletter-title text-3xl font-bold text-gray-900 mb-4">
            Sign up to our newsletter
          </h2>
          <p className="newsletter-desc text-gray-600 mb-8">
            Receive our latest updates about our products & promotions
          </p>
          
          <form onSubmit={handleSubmit} className="newsletter-form flex gap-2 mb-8">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email" 
              className="newsletter-input flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              className="newsletter-btn bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          <div className="social-buttons flex gap-4">
            {[
              { icon: faFacebookF, label: 'Facebook' },
              { icon: faTwitter, label: 'Twitter' },
              { icon: faInstagram, label: 'Instagram' },
              { icon: faYoutube, label: 'YouTube' }
            ].map((social) => (
              <a
                key={social.label}
                href="#"
                className="social-btn w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label={social.label}
              >
                <FontAwesomeIcon icon={social.icon} className="text-gray-700" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="video-feed">
          <h3 className="section-title text-xl font-semibold text-gray-900 mb-6">
            Latest Videos
          </h3>
          
          <div className="video-list space-y-4 mb-6">
            {videos.map(video => (
              <div key={video.id} className="video-item flex gap-4 group cursor-pointer">
                <div className="video-thumb relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={`Thumbnail for ${video.title}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="96px"
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="video-info flex-1 min-w-0">
                  <div className="video-title text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {video.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <a href="#" className="view-all inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
            View all videos <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  )
}