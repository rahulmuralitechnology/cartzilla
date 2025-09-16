import { FC } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../store";
import roleConfig from "../../config/roleConfig";

const AppLogo: FC<{ width?: number | string; collapsed?: boolean }> = ({ width = 200, collapsed = false }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const { storeId } = useParams() as { storeId: string };
  const navigateDashboard = () => {
    if (user?.role === roleConfig.CLIENT) {
      navigate(`/store/${storeId}/dashboard`);
    } else {
      navigate(`/store/${storeId}/analytics`);
    }
  };

  if (collapsed) {
    return (
      <div className='app-logo' style={{ width: 75, cursor: "pointer" }} onClick={navigateDashboard}>
        <img src={""} style={{ width: "100%", paddingBottom: 5 }} alt='' />
      </div>
    );
  } else {
    return (
      <div className='app-logo' style={{ width: "100%", cursor: "pointer" }} onClick={navigateDashboard}>
        <img src={"/logo.png"} width={width} alt='' />
      </div>
    );
  }
};

export default AppLogo;
