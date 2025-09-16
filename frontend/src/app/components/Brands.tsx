// src/components/Brands.tsx
'use client'

import OptimizedImage from './Image'

const brands = [
  {
    id: 1,
    name: 'Apple',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=Apple',
    url: '#'
  },
  {
    id: 2,
    name: 'Samsung',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=Samsung',
    url: '#'
  },
  {
    id: 3,
    name: 'Sony',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=Sony',
    url: '#'
  },
  {
    id: 4,
    name: 'LG',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=LG',
    url: '#'
  },
  {
    id: 5,
    name: 'Xiaomi',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=Xiaomi',
    url: '#'
  },
  {
    id: 6,
    name: 'Huawei',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=Huawei',
    url: '#'
  },
  {
    id: 7,
    name: 'Google',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=Google',
    url: '#'
  },
  {
    id: 8,
    name: 'Microsoft',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=Microsoft',
    url: '#'
  },
  {
    id: 9,
    name: 'Dell',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=Dell',
    url: '#'
  },
  {
    id: 10,
    name: 'HP',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=HP',
    url: '#'
  },
  {
    id: 11,
    name: 'Lenovo',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=Lenovo',
    url: '#'
  },
  {
    id: 12,
    name: 'Asus',
    logo: 'https://via.placeholder.com/160x80/EEF1F6/333333?text=Asus',
    url: '#'
  }
]

export default function Brands() {
  return (
    <section className="brands-section">
      <div className="section-header">
        <h2 className="section-title">All brands</h2>
      </div>
      
      <div className="brands-grid">
        {brands.map(brand => (
          <a
            key={brand.id}
            href={brand.url}
            className="brand-card"
            aria-label={`Visit ${brand.name} products`}
          >
            <OptimizedImage 
              src={brand.logo} 
              alt={brand.name}
              width={160}
              height={80}
              className="brand-logo"
            />
          </a>
        ))}
      </div>
    </section>
  )
}