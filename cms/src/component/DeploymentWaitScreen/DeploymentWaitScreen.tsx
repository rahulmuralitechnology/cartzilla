import { useState, useEffect } from "react";
import "./DeploymentWaitScreen.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const activities = [
  { message: "🚀 Setting up your store infrastructure...", icon: "🚀" },
  { message: "✨ Configuring your product catalog...", icon: "✨" },
  { message: "🛍️ Optimizing checkout experience...", icon: "🛍️" },
  { message: "⚡ Boosting performance...", icon: "⚡" },
  { message: "🌍 Connecting global CDN...", icon: "🌍" },
  { message: "🔒 Implementing security layers...", icon: "🔒" },
  { message: "💝 Adding finishing touches...", icon: "💝" },
];

const tips = [
  {
    icon: "💡",
    title: "Pro Tip",
    content: "High-quality product images increase conversion rates by up to 30%",
  },
  {
    icon: "⭐",
    title: "Did You Know?",
    content: "Mobile users account for 79% of total ecommerce traffic",
  },
  {
    icon: "🎁",
    title: "Success Secret",
    content: "Personalized product recommendations drive 35% more revenue",
  },
  {
    icon: "☕",
    title: "Fun Fact",
    content: "The average online shopper spends 15 seconds deciding on a product",
  },
  {
    icon: "⚡",
    title: "Speed Matters",
    content: "A 1-second delay in page load can reduce conversions by 7%",
  },
  {
    icon: "🛡️",
    title: "Trust Builder",
    content: "SSL certificates increase customer trust by 85%",
  },
];

const DeploymentWaitingScreen = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [deploymentTime, setDeploymentTime] = useState(0);
  const { selectedStore } = useSelector((state: RootState) => state.store);

  useEffect(() => {
    const activityInterval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 4000);

    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 8000);

    const timeInterval = setInterval(() => {
      setDeploymentTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(activityInterval);
      clearInterval(tipInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentActivityData = activities[currentActivity];
  const currentTipData = tips[currentTip];

  return (
    <div className='deployment-container'>
      <div className='deployment-background'>
        <div className='floating-particles'>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className='particle'
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className='deployment-content'>
        <div className='main-container'>
          <div className='main-card'>
            <div className='header-section'>
              <div className='logo-container'>
                <span className='main-icon'>{currentActivityData.icon}</span>
              </div>
              <h1 className='deployment-main-title'>Deploying Your {selectedStore?.siteType === "webapp" ? "Store" : "Site"}</h1>
              <p className='main-subtitle'>We're building something amazing for you. Don't refresh the page</p>
            </div>

            <div className='activity-section'>
              <div className='activity-badge'>Currently Working</div>

              <div className='current-activity'>
                <h2 className='activity-message'>{currentActivityData.message}</h2>

                <div className='loading-dots'>
                  <div className='dot'></div>
                  <div className='dot'></div>
                  <div className='dot'></div>
                  <div className='dot'></div>
                </div>

                <p className='deployment-time'>Deployment Time: {formatTime(deploymentTime)}</p>
              </div>
            </div>

            <div className='status-grid'>
              {activities.slice(0, 4).map((activity, index) => {
                const isActive = index === currentActivity;
                const isPassed = index < currentActivity;

                return (
                  <div key={index} className={`status-card ${isActive ? "active" : isPassed ? "completed" : "pending"}`}>
                    <div className='status-icon'>{activity.icon}</div>
                    <p className='status-text'>{activity.message.split(" ").slice(1, 3).join(" ")}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='tips-card'>
            <div className='tip-content'>
              <div className='tip-icon-container'>
                <span className='tip-icon'>{currentTipData.icon}</span>
              </div>
              <div className='tip-text'>
                <h3 className='tip-title'>{currentTipData.title}</h3>
                <p className='tip-description'>{currentTipData.content}</p>
              </div>
            </div>

            <div className='tip-indicators'>
              {tips.map((_, index) => (
                <div key={index} className={`tip-dot ${index === currentTip ? "active" : ""}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <div className='bottom-status'>
        <div className='status-indicator'>
          <div className='status-dot'></div>
          <span>System Status: All services operational</span>
        </div>
      </div> */}
    </div>
  );
};

export default DeploymentWaitingScreen;
