'use client'

import React, { useState } from 'react';
import Link from 'next/link'; // Import Link from next/link

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

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.75 7.5V5.25C12.75 3.59315 11.4069 2.25 9.75 2.25C8.09315 2.25 6.75 3.59315 6.75 5.25V7.5M4.5 7.5H15C15.4142 7.5 15.75 7.83579 15.75 8.25V15C15.75 15.4142 15.4142 15.75 15 15.75H4.5C4.08579 15.75 3.75 15.4142 3.75 15V8.25C3.75 7.83579 4.08579 7.5 4.5 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 9.20455C16.5 8.56636 16.4318 7.95273 16.3064 7.36364H9V10.845H13.1932C13.0386 11.97 12.3636 12.9232 11.3182 13.5614V15.6196H13.9432C15.6545 14.0468 16.5 11.8273 16.5 9.20455Z" fill="#4285F4"/>
    <path d="M9 17C11.43 17 13.4673 16.1941 14.9432 14.8614L12.3182 12.8091C11.4909 13.4045 10.4182 13.7614 9 13.7614C6.65455 13.7614 4.67273 12.1386 3.96409 9.98864H1.23273V12.1091C2.70909 15.0068 5.59091 17 9 17Z" fill="#34A853"/>
    <path d="M3.96409 9.98864C3.78409 9.43864 3.68182 8.85227 3.68182 8.25C3.68182 7.64773 3.78409 7.06136 3.96409 6.51136V4.39091H1.23273C0.613636 5.66364 0.25 7.11364 0.25 8.25C0.25 9.38636 0.613636 10.8364 1.23273 12.1091L3.96409 9.98864Z" fill="#FBBC05"/>
    <path d="M9 2.73864C10.4682 2.73864 11.7864 3.25455 12.8227 4.26818L15.0182 2.07273C13.4636 0.613636 11.4264 -0.000366211 9 -0.000366211C5.59091 -0.000366211 2.70909 2.00455 1.23273 4.89091L3.96409 6.51136C4.67273 4.36136 6.65455 2.73864 9 2.73864Z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 12.6621 4.21607 15.6975 7.6875 16.35V11.0062H5.83125V9H7.6875V7.33125C7.6875 5.43188 8.89406 4.3125 10.5966 4.3125C11.415 4.3125 12.2812 4.4625 12.2812 4.4625V6.1875H11.3147C10.3631 6.1875 10.0625 6.80156 10.0625 7.43156V9H12.1875L11.8266 11.0062H10.0625V16.35C13.5339 15.6975 16.5 12.6621 16.5 9Z" fill="#1877F2"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5031 9.22125C14.4909 7.96875 15.1406 6.99375 16.4531 6.28125C15.7219 5.19375 14.5125 4.63125 12.825 4.59375C11.2406 4.55625 9.70312 5.5125 9.00312 5.5125C8.26875 5.5125 6.91875 4.63125 5.60625 4.65C3.7125 4.66875 2.00625 5.64375 1.09687 7.33125C-0.759375 10.6313 0.5625 15.4688 2.45625 17.8125C3.43125 18.9938 4.55625 20.3438 5.99062 20.3063C7.36875 20.2688 7.93125 19.5188 9.61875 19.5188C11.2716 19.5188 11.8097 20.3063 13.2562 20.2875C14.7562 20.2688 15.7219 19.0875 16.6594 17.9063C17.7562 16.575 18.1969 15.2813 18.2094 15.225C18.1781 15.2063 14.5219 13.8 14.5031 9.22125ZM12.2062 3.0375C12.8812 2.19375 13.3594 1.03125 13.2188 0C12.2062 0.0375 10.9406 0.69375 10.2281 1.5375C9.61875 2.25 9.02812 3.45 9.19687 4.55625C10.3219 4.63125 11.475 3.975 12.2062 3.0375Z" fill="black"/>
  </svg>
);

const MailIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4.69" y="13.02" width="54.62" height="37.96" fill="#2F6ED5"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.52 0.52H63.48V63.48H0.52V0.52Z" fill="#2F6ED5"/>
  </svg>
);

const GiftIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4.69" y="4.69" width="54.62" height="54.62" fill="#2F6ED5"/>
  </svg>
);

const PercentIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="13.02" y="13.02" width="37.96" height="37.96" fill="#2F6ED5"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.17 8.33H61.45V55.59H4.17V8.33Z" fill="#2F6ED5"/>
  </svg>
);

const PieChartIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4.69" y="4.69" width="54.62" height="54.62" fill="#2F6ED5"/>
  </svg>
);

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      console.log('Sign in requested with:', { email, password, rememberMe });
      // Handle sign in logic here
    }
  };

  return (
    <div className="flex w-full min-h-screen font-['Inter',_sans-serif] bg-white">
      {/* --- Left Side: Form --- */}
      <div className="flex flex-col justify-between w-full lg:w-1/2 p-7">
        <div className="w-full max-w-[416px] mx-auto flex flex-col justify-between h-full">
          {/* Header */}
          <header className="flex items-center justify-between py-4">
            {/* Replace <a> with <Link> for navigation */}
            <Link href="/" className="inline-flex items-center gap-2 font-medium text-[#222934] transition-all duration-300 hover:text-[#F55266] hover:gap-3 group">
              <ArrowLeftIcon />
              <span className="group-hover:translate-x-[-2px] transition-transform">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white bg-gradient-to-br from-[#F55266] to-[#FF7A8A] rounded-md shadow-sm hover:shadow-md transition-shadow duration-300">C</span>
              <span className="text-2xl font-bold text-[#181D25]">Cartzilla</span>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex items-center justify-center w-full h-full py-8">
            <div className="w-full transition-all duration-500 ease-in-out">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <h1 className="text-[32px] font-semibold leading-[42px] text-[#181D25] bg-gradient-to-r from-[#181D25] to-[#2D3748] bg-clip-text text-transparent">
                    Welcome back
                  </h1>
                  <p className="text-base text-[#4E5562] leading-6">
                    Sign in to your Cartzilla account to continue.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Email Input */}
                  <div className="relative group">
                    <div className={`absolute inset-y-0 left-0 flex items-center pl-4 transition-all duration-300 ${
                      isEmailFocused ? 'text-[#F55266] transform scale-110' : 'text-[#4E5562]'
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
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      required
                      className="block w-full py-4 pl-12 pr-4 text-base text-[#181D25] placeholder-[#9CA3AF] border border-[#CAD0D9] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#F55266]/20 focus:border-[#F55266] transition-all duration-300 hover:border-[#A0AEC0] hover:shadow-sm group-hover:border-[#A0AEC0]"
                      placeholder="Email"
                    />
                  </div>
                  
                  {/* Password Input */}
                  <div className="relative group">
                    <div className={`absolute inset-y-0 left-0 flex items-center pl-4 transition-all duration-300 ${
                      isPasswordFocused ? 'text-[#F55266] transform scale-110' : 'text-[#4E5562]'
                    }`}>
                      <LockIcon />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      required
                      className="block w-full py-4 pl-12 pr-4 text-base text-[#181D25] placeholder-[#9CA3AF] border border-[#CAD0D9] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#F55266]/20 focus:border-[#F55266] transition-all duration-300 hover:border-[#A0AEC0] hover:shadow-sm group-hover:border-[#A0AEC0]"
                      placeholder="Password"
                    />
                  </div>
                  
                  {/* Remember me and Forgot password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        id="rememberMe"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 text-[#F55266] bg-white border-[#CAD0D9] rounded focus:ring-[#F55266]/20"
                      />
                      <label htmlFor="rememberMe" className="text-sm text-[#4E5562]">
                        Remember for 30 days
                      </label>
                    </div>
                    
                    <a href="/forgot-password" className="text-sm font-medium text-[#333D4C] hover:text-[#F55266] transition-colors duration-300">
                      Forgot password?
                    </a>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!email || !password}
                    className="flex justify-center w-full px-6 py-4 text-base font-medium text-white bg-gradient-to-r from-[#F55266] to-[#FF7A8A] border border-transparent rounded-xl hover:from-[#E04455] hover:to-[#F55266] focus:outline-none focus:ring-4 focus:ring-[#F55266]/40 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg"
                  >
                    Sign in
                  </button>
                </form>
                
                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-grow h-px bg-[#E0E5EB]"></div>
                  <span className="text-sm text-[#333D4C]">or continue with</span>
                  <div className="flex-grow h-px bg-[#E0E5EB]"></div>
                </div>
                
                {/* Social Login Buttons */}
                <div className="flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#E0E5EB] rounded-lg hover:border-[#CAD0D9] transition-colors duration-300">
                    <GoogleIcon />
                    <span className="text-sm font-medium text-[#333D4C]">Google</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#E0E5EB] rounded-lg hover:border-[#CAD0D9] transition-colors duration-300">
                    <FacebookIcon />
                    <span className="text-sm font-medium text-[#333D4C]">Facebook</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#E0E5EB] rounded-lg hover:border-[#CAD0D9] transition-colors duration-300">
                    <AppleIcon />
                    <span className="text-sm font-medium text-[#333D4C]">Apple</span>
                  </button>
                </div>
                
                {/* Don't have an account */}
                <div className="text-center">
                  <p className="text-sm text-[#4E5562]">
                    Do not have an account?{' '}
                    <Link href="/signup" className="font-medium text-[#181D25] underline hover:text-[#F55266] transition-colors duration-300">
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
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

      {/* --- Right Side: Benefits --- */}
      <div className="relative items-center justify-center hidden w-1/2 p-8 overflow-hidden lg:flex bg-gradient-to-br from-[#ACCBEE] to-[#E7F0FD]">
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50 backdrop-blur-sm bg-white/10 border border-white/20 p-8">
          <div className="flex flex-col h-full">
            <h2 className="text-2xl font-semibold text-center text-[#181D25] mb-8">Cartzilla account benefits</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="flex flex-col items-center p-6 bg-white/25 border border-white/50 rounded-xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                  <MailIcon />
                </div>
                <p className="text-base font-medium text-[#181D25] text-center">Subscribe to your favorite products</p>
              </div>
              
              {/* Benefit 2 */}
              <div className="flex flex-col items-center p-6 bg-white/25 border border-white/50 rounded-xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                  <SettingsIcon />
                </div>
                <p className="text-base font-medium text-[#181D25] text-center">View and manage your orders and wishlist</p>
              </div>
              
              {/* Benefit 3 */}
              <div className="flex flex-col items-center p-6 bg-white/25 border border-white/50 rounded-xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                  <GiftIcon />
                </div>
                <p className="text-base font-medium text-[#181D25] text-center">Earn rewards for future purchases</p>
              </div>
              
              {/* Benefit 4 */}
              <div className="flex flex-col items-center p-6 bg-white/25 border border-white/50 rounded-xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                  <PercentIcon />
                </div>
                <p className="text-base font-medium text-[#181D25] text-center">Receive exclusive offers and discounts</p>
              </div>
              
              {/* Benefit 5 */}
              <div className="flex flex-col items-center p-6 bg-white/25 border border-white/50 rounded-xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                  <HeartIcon />
                </div>
                <p className="text-base font-medium text-[#181D25] text-center">Create multiple wishlists</p>
              </div>
              
              {/* Benefit 6 */}
              <div className="flex flex-col items-center p-6 bg-white/25 border border-white/50 rounded-xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                  <PieChartIcon />
                </div>
                <p className="text-base font-medium text-[#181D25] text-center">Pay for purchases by installments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}