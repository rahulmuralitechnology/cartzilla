// src/app/components/Features.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTruck, 
  faLock, 
  faUndo, 
  faHeadset 
} from '@fortawesome/free-solid-svg-icons'
import { Feature } from '@/types'

const features: Feature[] = [
  {
    id: 1,
    title: 'Free Shipping & Returns',
    description: 'For all orders over $199.00',
    icon: 'truck'
  },
  {
    id: 2,
    title: 'Secure Payment',
    description: 'We ensure secure payment',
    icon: 'lock'
  },
  {
    id: 3,
    title: 'Money Back Guarantee',
    description: 'Returning money 30 days',
    icon: 'undo'
  },
  {
    id: 4,
    title: '24/7 Customer Support',
    description: 'Friendly customer support',
    icon: 'headset'
  }
]

const getIconComponent = (iconName: string) => {
  switch(iconName) {
    case 'truck': return faTruck;
    case 'lock': return faLock;
    case 'undo': return faUndo;
    case 'headset': return faHeadset;
    default: return faTruck;
  }
}

export default function Features() {
  return (
    <section className="features-section">
      {features.map(feature => (
        <div key={feature.id} className="feature">
          <div className="feature-icon">
            <FontAwesomeIcon icon={getIconComponent(feature.icon)} className="text-2xl text-dark" />
          </div>
          <div className="feature-text">
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.description}</p>
          </div>
        </div>
      ))}
    </section>
  )
}