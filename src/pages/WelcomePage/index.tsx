import { Button } from "antd";
import { ArrowRightOutlined, PlayCircleFilled } from "@ant-design/icons";
import "./WelcomePage.scss";
import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import roleConfig from "../../config/roleConfig";

const WelcomePage: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { storeId } = useParams() as { storeId: string };

  useEffect(() => {
    if (storeId) {
      if (user.role === roleConfig.CLIENT) {
        navigate(`/store/${storeId}/dashboard`);
      } else {
        navigate(`/store/${storeId}/analytics`);
      }
    } else if (user?.Store?.length > 0) {
      navigate("/store-list");
    }
  }, [user, storeId]);
  return (
    <section className='welcome-page'>
      <div className='welcome-container'>
        <div className='content-wrapper'>
          <div className='left-content'>
            <h1>
              Welcome To <span className='brand-text'>Bloomi5</span>
            </h1>
            <p className='tagline'>Your Brand, Your Store, Your Success!</p>

            <p className='description'>
              At Bloomi5 we believe in the power to inspire the world. We provide easy to use solution for store setups.
            </p>

            <div className='setup-section'>
              <p className='setup-text'>Lets Setup Your Store in few steps</p>
              <Button type='primary' href='/create/store' style={{ width: 200 }} className='setup-button custom-btn-gradient'>
                Set up Your Store <ArrowRightOutlined />
              </Button>
            </div>
          </div>

          <div className='right-content'>
            <div className='video-container'>
              <PlayCircleFilled className='play-icon' />
            </div>
            <p className='video-text'>Watch a 30s Explainer Video</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomePage;
