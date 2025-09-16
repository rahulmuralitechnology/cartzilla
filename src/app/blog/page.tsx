// src/app/blog/page.tsx
'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronRight,
  faChevronLeft,
  faPlay,
} from '@fortawesome/free-solid-svg-icons'
import OptimizedImage from '../components/Image'
import Breadcrumb from '../components/Breadcrumb'
import Header from '../components/Header'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

// Blog post data
const blogPosts = [
  {
    id: 1,
    title: 'Digital digest: News and views on the latest electronic products',
    category: 'Tech News',
    date: 'October 10, 2024',
    image: 'https://via.placeholder.com/416x306/EEF1F6/333333?text=Tech+News',
    excerpt: 'Stay updated with the latest news and insights in the electronics industry.'
  },
  {
    id: 2,
    title: 'Embracing connections: How modern technology bridges gaps and builds communities',
    category: 'Industry Trends',
    date: 'September 29, 2024',
    image: 'https://via.placeholder.com/416x306/EEF1F6/333333?text=Connections',
    excerpt: 'Exploring how technology brings people together in innovative ways.'
  },
  {
    id: 3,
    title: 'Transform your home into a smart hub with the latest IoT',
    category: 'IoT',
    date: 'September 17, 2024',
    image: 'https://via.placeholder.com/416x306/EEF1F6/333333?text=Smart+Home',
    excerpt: 'Discover how IoT devices can make your home smarter and more efficient.'
  },
  {
    id: 4,
    title: 'Discover how to maximize your productivity with these essential tech gadgets',
    category: 'Gadget Reviews',
    date: 'October 13, 2024',
    image: 'https://via.placeholder.com/416x306/EEF1F6/333333?text=Productivity',
    excerpt: 'Top gadgets that can boost your productivity in the modern home office.'
  },
  {
    id: 5,
    title: 'Optimizing your workspace: The guide to an efficient and minimalist desk setup',
    category: 'Tech Tips',
    date: 'September 11, 2024',
    image: 'https://via.placeholder.com/416x306/EEF1F6/333333?text=Workspace',
    excerpt: 'Create the perfect workspace with these efficiency tips and tricks.'
  },
  {
    id: 6,
    title: 'Exploring the skies: The rise of drone photography and videography',
    category: 'Industry Trends',
    date: 'September 5, 2024',
    image: 'https://via.placeholder.com/416x306/EEF1F6/333333?text=Drones',
    excerpt: 'How drone technology is revolutionizing photography and videography.'
  },
  {
    id: 7,
    title: 'The role of philanthropy in building a better world',
    category: 'Charitable Contributions',
    date: 'September 5, 2024',
    image: 'https://via.placeholder.com/416x306/EEF1F6/333333?text=Philanthropy',
    excerpt: 'Understanding how charitable contributions impact our society positively.'
  },
  {
    id: 8,
    title: 'Behind-the-scenes stories from the world of iPhones',
    category: 'Tech News',
    date: 'September 5, 2024',
    image: 'https://via.placeholder.com/416x306/EEF1F6/333333?text=iPhone',
    excerpt: 'Exclusive insights into the development and innovation behind iPhones.'
  },
  {
    id: 9,
    title: 'The biggest prospects for the smart home electronics industry',
    category: 'Industry Trends',
    date: 'September 5, 2024',
    image: 'https://via.placeholder.com/416x306/EEF1F6/333333?text=Smart+Home',
    excerpt: 'Future trends and opportunities in the smart home electronics market.'
  }
]

// Featured posts
const featuredPosts = [
  {
    id: 1,
    title: 'Digital digest: News and views on the latest electronic products',
    category: 'Tech News',
    date: 'October 10, 2024',
    image: 'https://via.placeholder.com/746x484/EEF1F6/333333?text=Featured+Post',
    excerpt: 'Stay updated with the latest news and insights in the electronics industry.'
  },
  {
    id: 2,
    title: 'Embracing connections: How modern technology bridges gaps',
    category: 'Industry Trends',
    date: 'September 29, 2024',
    image: 'https://via.placeholder.com/196x140/EEF1F6/333333?text=Trending+1',
    excerpt: 'Exploring how technology brings people together in innovative ways.'
  },
  {
    id: 3,
    title: 'Transform your home into a smart hub with the latest IoT',
    category: 'IoT',
    date: 'September 17, 2024',
    image: 'https://via.placeholder.com/196x140/EEF1F6/333333?text=Trending+2',
    excerpt: 'Discover how IoT devices can make your home smarter.'
  },
  {
    id: 4,
    title: 'Maximize productivity with essential tech gadgets',
    category: 'Gadget Reviews',
    date: 'October 13, 2024',
    image: 'https://via.placeholder.com/196x140/EEF1F6/333333?text=Trending+3',
    excerpt: 'Top gadgets that can boost your productivity.'
  }
]

// Video reviews
const videoReviews = [
  {
    id: 1,
    title: 'A comprehensive review of the latest kitchen blenders',
    time: '06:12',
    image: 'https://via.placeholder.com/306x200/EEF1F6/333333?text=Video+1'
  },
  {
    id: 2,
    title: 'Behind-the-scenes stories from the world of iPhones',
    time: '10:08',
    image: 'https://via.placeholder.com/306x200/EEF1F6/333333?text=Video+2'
  },
  {
    id: 3,
    title: 'Exploring the latest best smartwatch features for professionals',
    time: '04:56',
    image: 'https://via.placeholder.com/306x200/EEF1F6/333333?text=Video+3'
  },
  {
    id: 4,
    title: 'Taking to the skies with the latest compact drone technology',
    time: '03:27',
    image: 'https://via.placeholder.com/306x200/EEF1F6/333333?text=Video+4'
  }
]

// Blog categories
const blogCategories = [
  { id: 1, name: 'Gadget reviews', count: 24 },
  { id: 2, name: 'Tech news', count: 18 },
  { id: 3, name: 'Industry trends', count: 15 },
  { id: 4, name: 'Buying guides', count: 12 },
  { id: 5, name: 'Tech tips', count: 9 },
  { id: 6, name: 'Gaming', count: 7 },
  { id: 7, name: 'IoT', count: 6 }
]

// Trending posts
const trendingPosts = [
  {
    id: 1,
    title: 'The role of philanthropy in building a better world',
    image: 'https://via.placeholder.com/86x64/EEF1F6/333333?text=Trend+1'
  },
  {
    id: 2,
    title: 'Optimizing your workspace: The guide to an efficient setup',
    image: 'https://via.placeholder.com/86x64/EEF1F6/333333?text=Trend+2'
  },
  {
    id: 3,
    title: 'Exploring the skies: The rise of drone photography',
    image: 'https://via.placeholder.com/86x64/EEF1F6/333333?text=Trend+3'
  }
]

export default function BlogPage() {
  // const [wishlist, setWishlist] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [activeCategory, setActiveCategory] = useState('All')

  // const toggleWishlist = (productId: number) => {
  //   if (wishlist.includes(productId)) {
  //     setWishlist(wishlist.filter(id => id !== productId))
  //   } else {
  //     setWishlist([...wishlist, productId])
  //   }
  // }

  // Pagination logic
  const postsPerPage = 6
  const totalPages = Math.ceil(blogPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = blogPosts.slice(startIndex, startIndex + postsPerPage)

  return (
    <>
      <Header />
      <div className="blog-page bg-white min-h-screen">
        {/* Header Section */}
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: 'Our blog' }
              ]} 
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0">Our blog</h1>
          </div>

          {/* Featured Posts Section */}
          <div className="featured-posts mb-16">
            <div className="flex flex-col lg:flex-row gap-8 mb-10">
              {/* Main Featured Post */}
              <div className="lg:w-8/12">
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="h-96 overflow-hidden">
                    <OptimizedImage 
                      src={featuredPosts[0].image} 
                      alt={featuredPosts[0].title}
                      width={746}
                      height={484}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="font-medium text-gray-600">{featuredPosts[0].category}</span>
                      <span className="mx-3">•</span>
                      <span>{featuredPosts[0].date}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors duration-200">
                      {featuredPosts[0].title}
                    </h2>
                    <p className="text-gray-600">{featuredPosts[0].excerpt}</p>
                  </div>
                </div>
              </div>

              {/* Side Featured Posts */}
              <div className="lg:w-4/12">
                <div className="space-y-8">
                  {featuredPosts.slice(1).map((post) => (
                    <div key={post.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                        <OptimizedImage 
                          src={post.image} 
                          alt={post.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">{post.date}</div>
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-3 hover:text-blue-600 transition-colors duration-200">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-wrap gap-4">
                {blogCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      activeCategory === category.name
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content with Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Blog Posts */}
            <main className="lg:w-8/12">
              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {paginatedPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="h-48 overflow-hidden">
                      <OptimizedImage 
                        src={post.image} 
                        alt={post.title}
                        width={416}
                        height={306}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="font-medium text-gray-600">{post.category}</span>
                        <span className="mx-3">•</span>
                        <span>{post.date}</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm">{post.excerpt}</p>
                      <button className="mt-4 text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors duration-200 flex items-center">
                        Read more
                        <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center">
                <button 
                  className="p-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded-md mx-1 transition-colors duration-200 ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white' 
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  className="p-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ml-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="lg:w-4/12">
              {/* Categories */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog categories</h3>
                <div className="space-y-3">
                  {blogCategories.map((category) => (
                    <div key={category.id} className="flex justify-between items-center py-2 hover:bg-gray-50 px-3 rounded transition-colors duration-200">
                      <span className="text-gray-700">{category.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Posts */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending posts</h3>
                <div className="space-y-6">
                  {trendingPosts.map((post) => (
                    <div key={post.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-20 h-16 rounded overflow-hidden">
                        <OptimizedImage 
                          src={post.image} 
                          alt={post.title}
                          width={80}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                        {post.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow Us */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow us</h3>
                <div className="flex space-x-3">
                  <button className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                    <span className="sr-only">Instagram</span>
                    {/* Icon would go here */}
                    <span>IG</span>
                  </button>
                  <button className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                    <span className="sr-only">Twitter</span>
                    {/* Icon would go here */}
                    <span>X</span>
                  </button>
                  <button className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                    <span className="sr-only">Facebook</span>
                    {/* Icon would go here */}
                    <span>FB</span>
                  </button>
                  <button className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                    <span className="sr-only">Telegram</span>
                    {/* Icon would go here */}
                    <span>TG</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* Video Reviews Section */}
          <div className="video-reviews-section my-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Video reviews</h2>
              <button className="text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors duration-200">
                View all
                <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-xs" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoReviews.map((video) => (
                <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <OptimizedImage 
                      src={video.image} 
                      alt={video.title}
                      width={306}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                    <button className="absolute inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faPlay} className="text-gray-900 ml-1" />
                      </div>
                    </button>
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.time}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                      {video.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Newsletter />
        <Footer />
      </div>
    </>
  )
}