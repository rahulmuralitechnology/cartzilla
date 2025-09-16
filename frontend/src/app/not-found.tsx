// src/app/not-found.tsx
import Link from 'next/link'
import Header from './components/Header'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Page not found
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              The page you are looking for was moved, removed or might never existed.
            </p>
          </div>
          <div className="mt-5">
            <Link
              href="/"
              className="btn bg-primary text-white hover:bg-primary-dark"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
      <Newsletter />
      <Footer />
    </>
  )
}