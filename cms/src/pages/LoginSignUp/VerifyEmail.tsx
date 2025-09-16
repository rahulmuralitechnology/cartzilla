// import React, { FC } from "react";
// import "./LoginSignUp.scss";
// import { Button, Result, notification } from "antd";
// import AppIconLoader from "../../component/AppIconLoader/AppIconLoader";
// import authService from "../../services/authService";
// import { useNavigate, useSearchParams } from "react-router-dom";

// const VerifyEmail: FC<{}> = () => {
//   const [searchParams, setSearchParams] = useSearchParams() as any;
//   const navigate = useNavigate();
//   const [state, setState] = React.useState<{ message: string; loading: boolean; success: boolean; error?: string }>({
//     message: "",
//     error: "",
//     success: false,
//     loading: true,
//   });

//   const verfyingEmail = async () => {
//     try {
//       // const res = await authService.userVerifyEmail(searchParams.get("token"));
//       setState({ ...state, message: res.message, loading: false, error: "" });
//       notification.success({ message: "Email Verified", description: res.message, placement: "bottomRight" });
//     } catch (error: any) {
//       setState({ ...state, error: error.message, loading: false, message: "" });
//       notification.error({ message: "Failed to verify email!", description: error.message, placement: "bottomRight" });
//     }
//   };

//   React.useEffect(() => {
//     verfyingEmail();
//   }, []);

//   return (
//     <div className='email-verified-message'>
//       <div>
//         {state.loading && (
//           <div style={{ display: "grid", placeItems: "center", marginTop: 100 }}>
//             <AppIconLoader />
//             <p style={{ textAlign: "center", marginTop: 30, fontSize: 20 }}>Please wait...</p>
//           </div>
//         )}
//         {!state.loading && state.message && (
//           <Result
//             status='success'
//             title={
//               <div style={{ textAlign: "center", maxWidth: 800 }}>
//                 <h2 style={{ marginBottom: 5 }}>Thank You, your email has been verified successfully.</h2>
//                 <p style={{ fontSize: "20px" }}>{state.message}</p>
//               </div>
//             }
//           />
//         )}

//         {!state.loading && state.error && (
//           <Result
//             status='error'
//             title='Failed to verify email!'
//             subTitle={state.error}
//             extra={[
//               <Button
//                 key={1}
//                 type='primary'
//                 onClick={() => navigate("/account/sign-in")}
//                 style={{ width: "200px", height: "40px", marginTop: 30, fontSize: 20 }}>
//                 Go Back
//               </Button>,
//             ]}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;
