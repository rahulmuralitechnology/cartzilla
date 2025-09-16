import { Row, Col, Form, Input, Button, Select, Radio, notification, GetProps, Checkbox } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import React, { FC, useEffect, useState } from "react";
// import "./LoginSignUp.scss";
import { useDispatch, useSelector } from "react-redux";
import authService, { SignupData, UserRole } from "../../services/authService";
import appConstants from "../../services/appConstant";
import { getLocalStorage, setLocalStorage, validatePassword } from "../../services/utils";
import { RootState } from "../../store";
import { setUser } from "../../store/reducers/userReducer";
import userService from "../../services/userService";
import { setSelectedStoreId } from "../../store/reducers/storeSlice";
import roleConfig from "../../config/roleConfig";

type OTPProps = GetProps<typeof Input.OTP>;

interface ISignInfo {
  email: string;
  password: string;
  loading: boolean;
  isRegister: boolean;
  isForgotPs: boolean;
  isOTPSend: boolean;
}

const LoginSignUp: FC<{}> = ({}) => {
  const dispatch = useDispatch();
  const { account } = useParams() as { account: string };
  const [isSubAdmin, setSubAmin] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  let navigate = useNavigate();
  const [signInfo, setSignInfo] = useState<ISignInfo>({
    isRegister: false,
    isForgotPs: false,
    isOTPSend: false,
    email: "",
    password: "",
    loading: false,
  });
  const [form] = Form.useForm();

  const onSignIn = async (info: SignupData) => {
    setSignInfo({ ...signInfo, loading: true });
    try {
      if (signInfo.isRegister) {
        let signupData: SignupData = {
          username: info.username,
          email: info.email,
          password: info.password,
          role: "client" as UserRole,
          organizationName: info.organizationName,
          confirmPassword: info.confirmPassword,
        };
        const res = await authService.signup(signupData);
        form.resetFields(["username", "password", "confirmPassword", "organizationName"]);
        notification.success({ message: "Register Success", description: res.message, placement: "bottomRight" });
        setSignInfo({ ...signInfo, loading: false, isForgotPs: false, isRegister: false, isOTPSend: true });
      } else if (signInfo.isOTPSend) {
        const res = await authService.userVerifyEmail(info.otp as string, info.email);
        navigate("/account/sign-in");
        notification.success({ message: "Register Success", description: res.message, placement: "bottomRight" });
        setSignInfo({ ...signInfo, loading: false, isForgotPs: false, isRegister: false, isOTPSend: false });
      } else if (signInfo.isForgotPs) {
        const res = await userService.forgotPasswordLink({ email: info.email });
        notification.success({ message: "Forgot password link send", placement: "bottomRight" });
        setSignInfo({ ...signInfo, loading: false, isForgotPs: true, isRegister: false, isOTPSend: false });
      } else {
        const res = await authService.login({ email: info.email, password: info.password });
        if (res?.otpSend) {
          notification.info({ message: "Sign In Failed", description: res.message, placement: "bottomRight" });
          setSignInfo({ ...signInfo, loading: false, isForgotPs: false, isRegister: false, isOTPSend: true });
        } else {
          localStorage.setItem(appConstants.AUTH_TOKEN, res.data.token);
          form.resetFields();
          setRefresh(!refresh);
          notification.success({ message: "Login Success", description: res.message, placement: "bottomRight" });
        }
      }
      localStorage.removeItem("currentStep");
      localStorage.removeItem("selectedStore");
    } catch (error: any) {
      setSignInfo({ ...signInfo, loading: false });
      notification.error({ message: "Auth Error", description: error.message, placement: "bottomRight" });
    }
  };

  const onClickRegister = () => {
    navigate("/account/register");
    form.resetFields();
  };
  const onClickSignIn = () => {
    setSignInfo({ ...signInfo, isRegister: false, isForgotPs: false, isOTPSend: false });
    navigate("/account/sign-in");
    form.resetFields();
  };
  const onClickForgotPs = () => {
    setSignInfo({ ...signInfo, isRegister: false, isForgotPs: true, isOTPSend: false });
    form.resetFields();
  };

  const getUser = async () => {
    if (authService.isAuthenticated()) {
      const res = await authService.getUserInfo();
      dispatch(setUser(res.data.user));
      if (res?.data?.user?.Store && res.data.user.Store?.length > 0) {
        setLocalStorage(appConstants.SELECTED_STORE_ID, res.data.user.Store[0]?.id);
        dispatch(setSelectedStoreId(res.data.user.Store[0]));
        if (res.data.user.role === roleConfig.CLIENT) {
          navigate(`/store-list`);
        } else {
          navigate(`/store-list`);
        }
      } else {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    getUser();
  }, [refresh]);

  React.useEffect(() => {
    if (account === "register") {
      setSignInfo({ ...signInfo, isRegister: true, isForgotPs: false, isOTPSend: false });
      setSubAmin(true);
    } else if (account === "sign-in") {
      setSignInfo({ ...signInfo, isRegister: false, isForgotPs: false, isOTPSend: false });
    } else {
      navigate(`/account/unknown/${account}`);
    }
  }, [account]);

  return (
    <div className='login-signup-container'>
      {/* {signInfo.isForgotPs && <div className='login-title'>Forgot Password</div>} */}
      {signInfo.isRegister && <div className='title'>Create your Account</div>}
      {!signInfo.isRegister && !signInfo.isOTPSend && !signInfo.isForgotPs && <div className='title'>Login</div>}
      {/* {signInfo.isForgotPs && <div className='login-title'>Forgot Password</div>} */}

      {signInfo.isForgotPs && (
        <p style={{ textAlign: "left", marginTop: 5 }} className='title'>
          Enter your email below, and we'll send you the reset link
        </p>
      )}
      {signInfo.isOTPSend && (
        <>
          <div className='title'>OTP Verification</div>
          <p style={{ textAlign: "left", marginTop: 5 }}>Enter your OTP below, to verify your account</p>
        </>
      )}

      <Form form={form} name='login-form' layout='vertical' requiredMark={false} className='form-container' onFinish={onSignIn}>
        {signInfo.isRegister && (
          <Row gutter={[12, 0]} align='middle' justify='space-between'>
            <Col span={24}>
              <Form.Item
                name='username'
                label='Name'
                rules={[
                  {
                    required: true,
                    message: "First Name is required",
                  },
                ]}>
                <Input placeholder='First Name' />
              </Form.Item>
            </Col>
          </Row>
        )}
        {(signInfo.isRegister || signInfo.isOTPSend) && (
          <Form.Item
            name='email'
            label='Email'
            rules={[
              {
                type: "email",
                message: "This email is not valid email",
              },
              {
                required: true,
                message: "Email is required",
              },
            ]}>
            <Input disabled={signInfo.isOTPSend} placeholder='Email' />
          </Form.Item>
        )}
        {signInfo.isOTPSend && (
          <Form.Item
            name='otp'
            label='OTP'
            rules={[
              {
                required: true,
                message: "OTP is required",
              },
            ]}>
            <Input.OTP formatter={(str) => str.toUpperCase()} />
          </Form.Item>
        )}

        {!signInfo.isRegister && !signInfo.isOTPSend && (
          <Form.Item
            name='email'
            label='Email'
            rules={[
              {
                type: "email",
                message: "This email is not valid email",
              },
              {
                required: true,
                message: "Email is required",
              },
            ]}>
            <Input placeholder='Email' />
          </Form.Item>
        )}
        {signInfo.isRegister && !signInfo.isOTPSend && (
          <>
            {isSubAdmin && (
              <Form.Item
                name='organizationName'
                label='Organization'
                rules={[
                  {
                    required: true,
                    message: "Organization is required",
                  },
                ]}>
                <Input placeholder='Company Name' />
              </Form.Item>
            )}
          </>
        )}

        {!signInfo.isForgotPs && !signInfo.isOTPSend && (
          <Form.Item
            label='Password'
            name='password'
            rules={[
              {
                required: true,
                message: "Required Password",
              },
              ({}) => ({
                validator(_, value) {
                  if (value && validatePassword(value)) {
                    return Promise.reject(new Error(validatePassword(value)));
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}>
            <Input.Password placeholder='Password' />
          </Form.Item>
        )}
        {signInfo.isRegister && (
          <>
            <Form.Item
              name='confirmPassword'
              label='Confirm Password'
              dependencies={["password"]}
              rules={[
                { required: true, message: "Confirm password is required" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("The password that you entered does not match"));
                  },
                }),
              ]}>
              <Input.Password placeholder='Confirm Password' />
            </Form.Item>
          </>
        )}
        {!signInfo.isRegister && !signInfo.isForgotPs && (
          <Form.Item>
            <div className='remember-forgot'>
              <Checkbox>Remember Me</Checkbox>
              <div onClick={onClickForgotPs} className='forgot-link'>
                Forgot Password?
              </div>
            </div>
          </Form.Item>
        )}

        <Form.Item noStyle>
          <Button loading={signInfo.loading} type='primary' htmlType='submit' className='register-button'>
            {signInfo.isRegister && "Register"}
            {!signInfo.isRegister && !signInfo.isForgotPs && !signInfo.isOTPSend && "Sign In"}
            {signInfo.isForgotPs && "Send rest link"}
            {signInfo.isOTPSend && "Verify OTP"}
          </Button>
        </Form.Item>
      </Form>

      {signInfo.isRegister && !signInfo.isOTPSend && (
        <>
          <div className='login-text'>
            Already have an account? <span onClick={onClickSignIn}> Sign In</span>
          </div>
        </>
      )}

      {!signInfo.isRegister && !signInfo.isForgotPs && !signInfo.isOTPSend && (
        <>
          <div className='login-text'>
            Don't have an account <span onClick={onClickRegister}> create a new account.</span>
          </div>
        </>
      )}

      {signInfo.isForgotPs && (
        <div className='click-to-sign' style={{ marginTop: 20 }}>
          <span onClick={onClickSignIn}>Back to Sign In</span>
        </div>
      )}
      {/* <a href={config.websiteUrl} className='go-to-website'>
          Back
        </a> */}
    </div>
  );
};

export default LoginSignUp;
