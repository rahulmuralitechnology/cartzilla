'use client'

import React, { useState } from 'react';

// --- SVG Icon Components ---
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 9H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.25 3.75L3 9L8.25 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EnvelopeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 4.5H15C15.4142 4.5 15.75 4.83579 15.75 5.25V13.5C15.75 13.9142 15.4142 14.25 15 14.25H3C2.58579 14.25 2.25 13.9142 2.25 13.5V5.25C2.25 4.83579 2.58579 4.5 3 4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.75 5.25L9 10.5L2.25 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Illustration = () => (
    <div className="w-full h-full flex items-center justify-center">
        <svg width="80%" height="80%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
                </linearGradient>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <rect width="400" height="400" fill="none"/>
            <g filter="url(#softGlow)" opacity="0.7">
                <path d="M 50,150 C 100,50 300,50 350,150 S 300,350 200,350 S 0,250 50,150 Z" fill="url(#bgGradient)" />
                <path d="M 100,100 C 150,20 250,20 300,100 S 350,250 250,250 S 50,180 100,100 Z" fill="rgba(255,255,255,0.1)"/>
            </g>
             <text x="200" y="380" fontFamily="Inter, sans-serif" fontSize="16" fill="#181D25" textAnchor="middle" fontWeight="500" opacity="0.6">
                Modern E-Commerce Solutions
            </text>
        </svg>
    </div>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      console.log('Password reset requested for:', email);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="flex w-full min-h-screen font-['Inter',_sans-serif] bg-white">
      {/* --- Left Side: Form --- */}
      <div className="flex flex-col justify-between w-full lg:w-1/2 p-7">
        <div className="w-full max-w-[416px] mx-auto flex flex-col justify-between h-full">
            {/* Header */}
            <header className="flex items-center justify-between py-4">
                <a href="/signin" className="inline-flex items-center gap-2 font-medium text-[#222934] transition-all duration-300 hover:text-[#F55266] hover:gap-3 group">
                    <ArrowLeftIcon />
                    <span className="group-hover:translate-x-[-2px] transition-transform">Back to Sign In</span>
                </a>
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white bg-gradient-to-br from-[#F55266] to-[#FF7A8A] rounded-md shadow-sm hover:shadow-md transition-shadow duration-300">C</span>
                    <span className="text-2xl font-bold text-[#181D25]">Cartzilla</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex items-center justify-center w-full h-full py-8">
                <div className="w-full transition-all duration-500 ease-in-out">
                    {!isSubmitted ? (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <h1 className="text-[32px] font-semibold leading-[42px] text-[#181D25] bg-gradient-to-r from-[#181D25] to-[#2D3748] bg-clip-text text-transparent">
                                    Forgot password?
                                </h1>
                                <p className="text-base text-[#4E5562] leading-6">
                                    Enter the email address you used when you joined and we`&apos;`ll send you instructions to reset your password.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 flex items-center pl-4 transition-all duration-300 ${
                                        isFocused ? 'text-[#F55266] transform scale-110' : 'text-[#4E5562]'
                                    }`}>
                                        <EnvelopeIcon />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        required
                                        className="block w-full py-4 pl-12 pr-4 text-base text-[#181D25] placeholder-[#9CA3AF] border border-[#CAD0D9] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#F55266]/20 focus:border-[#F55266] transition-all duration-300 hover:border-[#A0AEC0] hover:shadow-sm group-hover:border-[#A0AEC0]"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!email}
                                    className="flex justify-center w-full px-6 py-4 text-base font-medium text-white bg-gradient-to-r from-[#F55266] to-[#FF7A8A] border border-transparent rounded-xl hover:from-[#E04455] hover:to-[#F55266] focus:outline-none focus:ring-4 focus:ring-[#F55266]/40 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg"
                                >
                                    Reset password
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/60 rounded-2xl animate-fade-in shadow-lg">
                            <div className="flex items-center justify-center w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-full shadow-inner">
                                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Check your email
                            </h2>
                            <p className="mt-3 text-gray-600 leading-relaxed">
                                We`&apos;`ve sent password reset instructions to <span className="font-semibold text-[#181D25] bg-gradient-to-r from-[#181D25] to-[#2D3748] bg-clip-text text-transparent">{email}</span>.
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="mt-8 px-6 py-2 text-sm font-medium text-[#F55266] hover:text-[#E04455] bg-white border border-gray-200 rounded-lg hover:border-[#F55266]/30 hover:shadow-md transition-all duration-300"
                            >
                                Didn`&apos;`t get an email? Try again.
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-[#4E5562] py-4">
                <div className="flex items-center justify-center gap-2 text-sm">
                    <span>Need help?</span>
                    <a href="/contact" className="font-medium text-[#222934] underline underline-offset-4 hover:text-[#F55266] transition-all duration-300 hover:underline-offset-2">
                        Contact us
                    </a>
                </div>
                <p className="mt-4 text-xs text-gray-400">© {new Date().getFullYear()} All rights reserved. Made by Createx Studio</p>
            </footer>
        </div>
      </div>

      {/* --- Right Side: Image --- */}
      <div className="relative items-center justify-center hidden w-1/2 p-8 overflow-hidden lg:flex bg-gradient-to-br from-[#ACCBEE] to-[#E7F0FD]">
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50 backdrop-blur-sm bg-white/10 border border-white/20">
           <Illustration />
        </div>
      </div>
    </div>
  );
}