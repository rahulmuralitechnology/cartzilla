"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronRight, User, ShoppingBag, TrendingUp, Star, MapPin } from "lucide-react"
import Newsletter from "../components/Newsletter"
import Footer from "../components/Footer"
import Header from "../components/Header"

export default function AboutPage() {
  const [expandedPrinciples, setExpandedPrinciples] = useState<number[]>([0])

  const togglePrinciple = (index: number) => {
    if (expandedPrinciples.includes(index)) {
      setExpandedPrinciples(expandedPrinciples.filter((i) => i !== index))
    } else {
      setExpandedPrinciples([...expandedPrinciples, index])
    }
  }

  const principles = [
    {
      title: "Customer focus",
      content:
        "The most important value of the Company is people (employees, partners, clients). Behind any success there is, first and foremost, a specific person. It is he who creates the product, technology, and innovation.",
    },
    {
      title: "Betting on reputation",
      content:
        "Care, attention, desire and ability to be helpful (to a colleague in his department, other departments, clients, customers and all other people who surround us).",
    },
    {
      title: "Fast, convenient and enjoyable",
      content:
        "Responsibility is our key quality. We don't shift it to external circumstances or other circumstances. If we see something that could be improved, we don't just criticize, but offer our own options.",
    },
  ]

  const values = [
    {
      icon: User,
      title: "People",
      content:
        "The most important value of the Company is people (employees, partners, clients). Behind any success there is, first and foremost, a specific person.",
    },
    {
      icon: ShoppingBag,
      title: "Service",
      content:
        "Care, attention, desire and ability to be helpful (to a colleague in his department, other departments, clients, customers and all other people who surround us).",
    },
    {
      icon: TrendingUp,
      title: "Responsibility",
      content:
        "Responsibility is our key quality. We don't shift it to external circumstances or other people. If we see something that could be improved, we don't just criticize, but offer our own options.",
    },
    {
      icon: Star,
      title: "Leadership",
      content:
        "Cartzilla people are young, ambitious and energetic individuals. With identified leadership qualities, with a desire to be the best at what they do.",
    },
  ]

  const jobOffers = [
    {
      type: "Full time",
      title: "Supply Chain and Logistics Coordinator",
      location: "New York",
    },
    {
      type: "Part time",
      title: "Content Manager for Social Networks",
      location: "Remote",
    },
    {
      type: "Full time",
      title: "Customer Service Representative",
      location: "London",
    },
    {
      type: "Freelance",
      title: "Data Analyst/Analytics Specialist",
      location: "Remote",
    },
  ]

  return (
    <>
      <Header />
      <div className="about-page bg-gray-50 min-h-screen">
        <div className="page-header-section bg-white shadow-sm py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">About</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="hero-section flex flex-col md:flex-row gap-12 mb-16">
            <div className="content bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12 shadow-xl w-full md:w-2/5">
              <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                Cartzilla - More than a retailer
              </h1>
              <p className="text-gray-700 text-lg mb-8">
                Since 2015, we have been fulfilling the small dreams and big plans of millions of people. You can find
                literally everything here.
              </p>
              <button className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Learn More
              </button>
            </div>
            <div className="image w-full md:w-3/5 rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/modern-office-collaboration.png"
                alt="About Cartzilla"
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-section grid grid-cols-2 md:grid-cols-4 gap-8 py-12 mb-16 bg-white rounded-3xl shadow-xl px-8">
            {["14k products available", "12m site visits", "80+ employees", "92% customers return"].map((text, idx) => (
              <div
                key={idx}
                className="stat-card bg-gray-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow text-center"
              >
                <h3 className="text-3xl font-bold text-blue-600 mb-2">{text.split(" ")[0]}</h3>
                <p className="text-gray-700">{text.replace(text.split(" ")[0], "").trim()}</p>
              </div>
            ))}
          </div>

          {/* Principles Section */}
          <div className="principles-section flex flex-col md:flex-row gap-12 mb-20">
            <div className="image w-full md:w-1/2 rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/delivery-truck-and-logistics.jpg"
                alt="Our Principles"
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="content w-full md:w-1/2">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Our Core Principles</h2>
              <div className="principles-list space-y-6">
                {principles.map((principle, index) => (
                  <div
                    key={index}
                    className="principle-card bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => togglePrinciple(index)}
                    >
                      <h3 className="font-semibold text-lg text-gray-800">{principle.title}</h3>
                      <ChevronDown
                        className={`transform transition-transform text-blue-600 w-5 h-5 ${expandedPrinciples.includes(index) ? "rotate-180" : ""}`}
                      />
                    </div>
                    {expandedPrinciples.includes(index) && (
                      <p className="mt-4 text-gray-600 leading-relaxed">{principle.content}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="values-section mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">Our Values That Drive Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div
                    key={index}
                    className="value-card bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    <div className="w-12 h-12 text-blue-600 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.content}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Career Section */}
          <div className="career-section mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">Join Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {jobOffers.map((job, index) => (
                <div
                  key={index}
                  className="job-card bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-200"
                >
                  <span
                    className={`badge px-3 py-1 rounded-full text-xs text-white ${
                      index === 0
                        ? "bg-blue-600"
                        : index === 1
                          ? "bg-green-500"
                          : index === 2
                            ? "bg-blue-500"
                            : "bg-orange-500"
                    }`}
                  >
                    {job.type}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">{job.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <button className="text-blue-600 font-medium mt-4 flex items-center gap-1 text-sm group hover:text-blue-800">
                    View details
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="newsletter-section bg-blue-600 rounded-3xl p-12 text-center text-white mb-8">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-blue-100 mb-6">Subscribe to our newsletter for the latest updates and offers</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-gray-900" />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      <Newsletter />
      <Footer />
    </>
  )
}