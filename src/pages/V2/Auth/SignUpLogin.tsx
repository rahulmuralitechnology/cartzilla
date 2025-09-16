import "./SignUpLogin.scss";
import LoginSignUp from "../../LoginSignUp/LoginSignUp";
import { useLocation } from "react-router-dom";
import { Typography } from "antd";

const { Title, Text } = Typography;

export default function SignupPage() {
  const location = useLocation();
  return (
    <div className='signup-container'>
      <div className='signup-left'>
        {/* <img
          src={location.pathname === "/account/sign-in" ? "/login/login-left.svg" : "/login/signup-left.png"}
          alt='Decorative abstract shapes'
          className='background-image'
        /> */}

        <div className='saleskip-container'>
          {/* Background geometric patterns */}
          <div className='geometric-pattern pattern-1'></div>
          <div className='geometric-pattern pattern-2'></div>
          <div className='geometric-pattern pattern-3'></div>
          <div className='geometric-pattern pattern-4'></div>

          {/* Star icon */}
          <div className='star-icon'>
            <svg width='48' height='48' viewBox='0 0 48 48' fill='none'>
              <path
                d='M24 4L24 44M4 24L44 24M12.343 12.343L35.657 35.657M35.657 12.343L12.343 35.657'
                stroke='white'
                strokeWidth='3'
                strokeLinecap='round'
              />
            </svg>
          </div>

          {/* Main content */}
          <div className='content'>
            <Title level={1} className='main-title'>
              {location.pathname === "/account/sign-in" ? "Your Business Partner is Ready" : " Your Business Success Journey Begins!"}
            </Title>

            <Text className='auth-subtitle'>
              {location.pathname === "/account/sign-in" ? (
                <span>
                  Ready to continue your online success journey? <br /> Your Bloomi5 dashboard is waiting with the latest insights, orders,
                  and growth opportunities for your business.
                  <br /> <br />
                  Every sign-in brings you closer to your next business milestone.
                </span>
              ) : (
                <span>
                  <span style={{ fontWeight: 700, fontSize: "20px" }}>Congratulations 🚀</span> on taking this powerful step toward online
                  growth! With Bloomi5, you're not just creating a online store—you're building your dream with expert guidance every step
                  of the way.
                  <br /> <br />
                  From setup to sales, we're with you all the way.
                </span>
              )}
            </Text>
          </div>

          {/* Footer */}
          <div className='footer'>
            <Text className='copyright'>© {new Date().getFullYear()} Bloomi5. All rights reserved.</Text>
          </div>
        </div>
      </div>
      <div className='signup-right'>
        <div className='signup-form-container'>
          <h1 className='logo'>
            <img src='/logo.png' alt='mybloomi5.com' />
          </h1>
          <LoginSignUp />
        </div>
      </div>
    </div>
  );
}
