// src/components/LoginOffcanvas.tsx
'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

interface LoginOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginOffcanvas({ isOpen, onClose }: LoginOffcanvasProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [privacyPolicy, setPrivacyPolicy] = useState(false)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login/register logic here
    console.log({
      email,
      password,
      rememberMe,
      privacyPolicy,
      isLogin
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="offcanvas-overlay" onClick={handleOverlayClick}></div>
      
      <div className="login-offcanvas">
        <div className="login-header">
          <h2 className="login-title">{isLogin ? 'Login' : 'Register'}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close login">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="login-content">
          <div className="login-tabs">
            <button 
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <span className="input-hint">Minimum 8 characters</span>
            </div>

            {isLogin ? (
              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span className="checkmark"></span>
                  Save the password
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
            ) : (
              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={privacyPolicy}
                    onChange={() => setPrivacyPolicy(!privacyPolicy)}
                    required
                  />
                  <span className="checkmark"></span>
                  I have read and accept the Privacy Policy
                </label>
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isLogin ? 'Login' : 'Create account'}
            </button>
          </form>

          {!isLogin && (
            <div className="benefits-section">
              <h3 className="benefits-title">Cartzilla account benefits</h3>
              <ul className="benefits-list">
                <li>Subscribe to your favorite products</li>
                <li>View and manage your orders and wishlist</li>
                <li>Earn rewards for future purchases</li>
                <li>Receive exclusive offers and discounts</li>
                <li>Create multiple wishlists</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .offcanvas-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1040;
        }
        
        .login-offcanvas {
          position: fixed;
          top: 0;
          right: 0;
          width: 506px;
          height: 100vh;
          background: #FFFFFF;
          border-left: 1px solid #EEF1F6;
          z-index: 1050;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        
        .login-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #EEF1F6;
        }
        
        .login-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #6C757D;
        }
        
        .login-content {
          padding: 1.5rem;
          overflow-y: auto;
          flex-grow: 1;
        }
        
        .login-tabs {
          display: flex;
          border-bottom: 1px solid #EEF1F6;
          margin-bottom: 1.5rem;
        }
        
        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          color: #6C757D;
          position: relative;
        }
        
        .tab-btn.active {
          color: #3B71CA;
        }
        
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #3B71CA;
        }
        
        .login-form {
          margin-bottom: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #CED4DA;
          border-radius: 0.375rem;
          box-sizing: border-box;
        }
        
        .password-input-container {
          position: relative;
        }
        
        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6C757D;
          cursor: pointer;
        }
        
        .input-hint {
          font-size: 0.875rem;
          color: #6C757D;
          margin-top: 0.25rem;
          display: block;
        }
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .checkbox-container input {
          margin-right: 0.5rem;
        }
        
        .forgot-link {
          color: #3B71CA;
          text-decoration: none;
          font-size: 0.875rem;
        }
        
        .submit-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #3B71CA;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 1.5rem;
        }
        
        .benefits-section {
          padding: 1.5rem;
          background-color: #F8F9FA;
          border-radius: 0.375rem;
        }
        
        .benefits-title {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .benefits-list {
          margin: 0;
          padding-left: 1.25rem;
          color: #6C757D;
        }
        
        .benefits-list li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </>
  )
}