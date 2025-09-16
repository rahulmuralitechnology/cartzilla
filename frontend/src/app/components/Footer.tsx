// src/app/components/Footer.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
  const footerLinks = {
    company: [
      'About company',
      'Careers',
      'Contact us',
      'Our team',
      'Help and consultation',
      'News'
    ],
    account: [
      'Your account',
      'Shipping rates & policies',
      'Refunds & replacements',
      'Order tracking',
      'Delivery info',
      'Taxes & fees'
    ],
    service: [
      'Payment methods',
      'Money back guarantee',
      'Product returns',
      'Support center',
      'Shipping',
      'Term and conditions'
    ]
  }

  const categories = [
    'Computers', 'Smartphones', 'TV, Video', 'Speakers', 'Cameras', 'Printers', 
    'Video Games', 'Headphones', 'Wearable', 'HDD/SSD', 'Smart Home', 'Apple Devices', 
    'Tablets', 'Monitors', 'Scanners', 'Servers', 'Heating and Cooling', 'E-readers',
    'Data Storage', 'Networking', 'Power Strips', 'Plugs and Outlets', 'Detectors and Sensors', 'Accessories'
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              Cartz<span className="text-primary">illa</span>
            </div>
            <p className="mb-1">Got question? Call us 24/7</p>
            <p className="mb-4">+1 234 567 8900</p>
            <a href="#" className="contact-btn">
              Contact us <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>
          
          <div className="footer-menu">
            <h3 className="footer-menu-title">Company</h3>
            <div className="footer-links">
              {footerLinks.company.map((link, index) => (
                <a key={index} href="#">
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          <div className="footer-menu">
            <h3 className="footer-menu-title">Account</h3>
            <div className="footer-links">
              {footerLinks.account.map((link, index) => (
                <a key={index} href="#">
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          <div className="footer-menu">
            <h3 className="footer-menu-title">Customer service</h3>
            <div className="footer-links">
              {footerLinks.service.map((link, index) => (
                <a key={index} href="#">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="footer-categories">
          <div className="category-row">
            {categories.slice(0, 13).map((category, index) => (
              <span key={index}>
                <a href="#" className="category-link">
                  {category}
                </a>
                {index < 12 && <span className="category-separator">/</span>}
              </span>
            ))}
          </div>
          
          <div className="category-row">
            {categories.slice(13).map((category, index) => (
              <span key={index}>
                <a href="#" className="category-link">
                  {category}
                </a>
                {index < categories.slice(13).length - 1 && <span className="category-separator">/</span>}
              </span>
            ))}
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">© All rights reserved. Made by Createx Studio</div>
          
          <div className="payment-methods">
            {['Visa', 'Mastercard', 'PayPal', 'Google Pay', 'Apple Pay'].map((method, index) => (
              <div key={index} className="payment-method">
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}