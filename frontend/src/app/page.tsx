// src/app/page.tsx - Updated with error boundaries
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import NewArrivals from './components/NewArrivals'
import TrendingProducts from './components/TrendingProducts'
import SpecialOffers from './components/SpecialOffers'
import Brands from './components/Brands'
import Banner from './components/Banner'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cartzilla - Premium Electronics Store | Best Deals on Tech',
  description: 'Shop the latest electronics at Cartzilla. Find great deals on smartphones, laptops, headphones, and more with free shipping on orders over $199.',
  keywords: 'electronics, gadgets, smartphones, laptops, headphones, tech deals',
  openGraph: {
    title: 'Cartzilla - Premium Electronics Store',
    description: 'Your one-stop shop for the latest electronics and gadgets',
    type: 'website',
  },
  robots: 'index, follow',
}

export default function Home() {
  return (
    <>
      <ErrorBoundary componentName="Header">
        <Header />
      </ErrorBoundary>
      
      <main>
        <ErrorBoundary componentName="Hero">
          <Hero />
        </ErrorBoundary>
        
        <ErrorBoundary componentName="Features">
          <Features />
        </ErrorBoundary>
        
        <ErrorBoundary componentName="NewArrivals">
          <NewArrivals />
        </ErrorBoundary>

        <ErrorBoundary componentName="TrendingProducts">
          <TrendingProducts />
        </ErrorBoundary>
        
        <ErrorBoundary componentName="Banner">
          <Banner />
        </ErrorBoundary>

        <ErrorBoundary componentName="SpecialOffers">
          <SpecialOffers />
        </ErrorBoundary>
        
        <ErrorBoundary componentName="Brands">
          <Brands />
        </ErrorBoundary>

        <ErrorBoundary componentName="Newsletter">
          <Newsletter />
        </ErrorBoundary>
      </main>
      
      <ErrorBoundary componentName="Footer">
        <Footer />
      </ErrorBoundary>
    </>
  )
}