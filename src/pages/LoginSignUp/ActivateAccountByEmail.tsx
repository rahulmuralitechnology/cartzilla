import React, { FC } from "react";
import "./LoginSignUp.scss";
import { Result, notification } from "antd";
import AppIconLoader from "../../component/AppIconLoader/AppIconLoader";
import authService from "../../services/authService";
import { useSearchParams } from "react-router-dom";

const ActivateAccountByEmail: FC<{}> = () => {
  const [searchParams, _] = useSearchParams() as any;
  const [state, setState] = React.useState<{ message: string; loading: boolean; success: boolean; error?: string }>({
    message: "",
    error: "",
    success: false,
    loading: true,
  });

  const activateAccount = async () => {
    try {
      const res = await authService.activateAccountByAdmin(searchParams.get("token"));
      setState({ ...state, message: res.message, loading: false, error: "" });
      notification.success({ message: "Account Activated", description: res.message, placement: "bottomRight" });
    } catch (error: any) {
      setState({ ...state, error: error.message, loading: false, message: "" });
      notification.error({ message: "Failed to activate account!", description: error.message, placement: "bottomRight" });
    }
  };

  React.useEffect(() => {
    activateAccount();
  }, []);

  return (
    <div className='email-verified-message'>
      <div>
        {state.loading && (
          <div style={{ display: "grid", placeItems: "center", marginTop: 100 }}>
            <AppIconLoader />
            <p style={{ textAlign: "center", marginTop: 30, fontSize: 20 }}>Please wait...</p>
          </div>
        )}
        {!state.loading && state.message && (
          <Result
            status='success'
            title={
              <div style={{ textAlign: "center", maxWidth: 800 }}>
                <h2 style={{ marginBottom: 5 }}>{state.message}</h2>
              </div>
            }
          />
        )}

        {!state.loading && state.error && <Result status='error' title='Failed to Activate Account' subTitle={state.error} />}
      </div>
    </div>
  );
};

export default ActivateAccountByEmail;
