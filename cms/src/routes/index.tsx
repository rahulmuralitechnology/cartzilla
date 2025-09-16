import { createBrowserRouter } from "react-router-dom";
import LoginSignUp from "../pages/LoginSignUp/LoginSignUp";
import NoMatch from "../pages/NoMatch";
// import VerifyEmail from "../pages/LoginSignUp/VerifyEmail";
import ActivateAccountByEmail from "../pages/LoginSignUp/ActivateAccountByEmail";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Analytics/Analytics";
import StoreListPage from "../pages/stores/StoreListPage.tsx";
import ManageStore from "../pages/ManageStore";
import UserTable from "../component/Users/UserTable";
import StoreUserTable from "../component/Users/StoreUserTable.tsx";
import PrivateRoute from "./PrivateRoute";
import SignupPage from "../pages/V2/Auth/SignUpLogin";
import WelcomePage from "../pages/WelcomePage";
import PricingPage from "../pages/Pricing";
import GetStarted from "../component/GetStarted";
import StepLayout from "../component/StepLayout/StepLayout";
import Pricing from "../component/Pricing/Pricing";
import StoreStepCompletion from "../pages/StoreStepCompletion/StoreStepCompletion";
import DashboardLayout from "../component/DashboardLayout/DashboardLayout";
import Analytics from "../component/Analytics/Analytics";
import RequestedTheme from "../pages/RequestedTheme/RequestedTheme";
import Template from "../pages/Template/Template";
import ForgotPasswordPage from "../pages/LoginSignUp/ForgotPassword";
import CMSManagementPage from "../pages/CMSManagementPage/CMSManagementPage";

import CustomerDetailPage from "../pages/ManageStore/CustomerDetailPage";
import OrderDetailPage from "../pages/ManageStore/OrderDetailPage";
import StoreDashboard from "../pages/StoreDashboard/StoreDashboard.tsx";
import CodeSnippets from "../pages/CodeSnippets/CodeSnippets.tsx";
import Settings from "../pages/Settings/Settings.tsx";
import OrdersTable from "../component/StoreManage/Orders/OrdersTable/OrdersTable.tsx";
import CartView from "../component/Cart/CartView.tsx";
import CustomersTable from "../component/Customer/CustomerTable.tsx";
import StorePages from "../pages/StorePages/StorePages.tsx";
import BlogEditor from "../component/CMSManagement/Blog/BlogEditor.tsx";
import BlogList from "../component/CMSManagement/Blog/BlogList.tsx";
import BlogViewer from "../component/CMSManagement/Blog/BlogViewer.tsx";
import AdminStoreList from "../pages/AdminStoreList/AdminStoreList.tsx";
import InviteAddClientUser from "../component/InviteAddClientUser/InviteAddClientUser.tsx";
import ClientUserTable from "../component/ClientsUser/ClientsUser.tsx";
import UserProfilePage from "../component/UserProfile/UserProfile.tsx";
import SubscriptionExpired from "../pages/ExpiredSubscriptionPage/ExpiredSubscriptionPage.tsx";
import StoreListTable from "../component/StoreTableList/StoreTableList.tsx";
import InventoryManagementPage from "../pages/ManageStore/InventoryManagement/InventoryManagement.tsx";
import ShiprocketOrderShipment from "../component/StoreManage/Orders/OrderDeliveryProvider/ShiprocketOrderShipment.tsx";
import PricingV2 from "../component/Pricing/Pricingv2/Pricing2.tsx";
import StorePayment from "../component/GetStarted/StorePayment.tsx";
import FAQSection from "../component/CMSManagement/StorePageForm/FAQSection.tsx";
import MealPlansForm from "../component/CMSManagement/StorePageForm/MealPlans.tsx";
import ReasonsForm from "../component/CMSManagement/StorePageForm/Reasons.tsx";
import BrandForm from "../component/CMSManagement/StorePageForm/BrandForm.tsx";
import NavigationForm from "../component/CMSManagement/StorePageForm/NavigationForm.tsx";
import FooterForm from "../component/CMSManagement/StorePageForm/FooterForm.tsx";
import ProfileForm from "../component/CMSManagement/StorePageForm/ProfileForm.tsx";
import SocialForm from "../component/CMSManagement/StorePageForm/SocialForm.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StepLayout />,
    children: [
      {
        path: "",
        element: <ProtectedRoute component={WelcomePage} />,
      },
      {
        path: "store-list",
        element: <ProtectedRoute component={AdminStoreList} />,
      },
      {
        path: "create/store",
        element: <PrivateRoute component={GetStarted} />,
      },
      {
        path: "store/:storeId",
        element: <ProtectedRoute component={ManageStore} />,
      },
      {
        path: "store/:storeId",
        element: <ProtectedRoute component={ManageStore} />,
      },
      {
        path: "pricing/:storeId",
        element: <ProtectedRoute component={PricingV2} />,
      },
      {
        path: "store/payment/:storeId",
        element: <ProtectedRoute component={StorePayment} />,
      },
      {
        path: "store/configuration/:storeId",
        element: <ProtectedRoute component={StoreStepCompletion} />,
      },
      {
        path: "app/dashoard",
        element: <ProtectedRoute component={Dashboard} />,
      },
    ],
  },

  {
    path: "/store/:storeId",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <PrivateRoute component={StoreDashboard} />,
      },
      {
        path: "cms",
        element: <PrivateRoute component={CMSManagementPage} />,
      },
      {
        path: "cms/page/:pagename",
        element: <PrivateRoute component={StorePages} />,
      },
      {
        path: "orders",
        element: <PrivateRoute component={OrdersTable} />,
      },
      {
        path: "carts",
        element: <PrivateRoute component={CartView} />,
      },
      {
        path: "inventory",
        element: <PrivateRoute component={InventoryManagementPage} />,
      },
      {
        path: "blogs",
        element: <PrivateRoute component={BlogList} />,
      },
      {
        path: "faq",
        element: <PrivateRoute component={FAQSection} />,
      },
      {
        path: "meal",
        element: <PrivateRoute component={MealPlansForm} />,
      },
      {
        path: "reason",
        element: <PrivateRoute component={ReasonsForm} />,
      },
      {
        path: "brand",
        element: <PrivateRoute component={BrandForm} />,
      },
      {
        path: "profile",
        element: <PrivateRoute component={ProfileForm} />,
      },
      {
        path: "navigation",
        element: <PrivateRoute component={NavigationForm} />,
      },
      {
        path: "footer",
        element: <PrivateRoute component={FooterForm} />,
      },
      {
        path: "social",
        element: <PrivateRoute component={SocialForm} />,
      },
      {
        path: "blog/:blogId",
        element: <PrivateRoute component={BlogViewer} />,
      },
      {
        path: "blog/update/:blogId",
        element: <PrivateRoute component={BlogEditor} />,
      },
      {
        path: "cms/page/create-blog",
        element: <PrivateRoute component={BlogEditor} />,
      },
      {
        path: "customer",
        element: <PrivateRoute component={CustomersTable} />,
      },
      {
        path: "client/employees",
        element: <PrivateRoute component={ClientUserTable} />,
      },
      {
        path: "customer/:customerId",
        element: <PrivateRoute component={CustomerDetailPage} />,
      },
      {
        path: "code-snippets",
        element: <PrivateRoute component={CodeSnippets} />,
      },
      {
        path: "settings",
        element: <PrivateRoute component={Settings} />,
      },
      {
        path: "list",
        element: <PrivateRoute component={StoreListPage} />,
      },
      {
        path: "manage/:storeId",
        element: <ProtectedRoute component={ManageStore} />,
      },
      {
        path: "order/:orderId",
        element: <ProtectedRoute component={OrderDetailPage} />,
      },
      {
        path: "manage/customer/:customerId",
        element: <ProtectedRoute component={CustomerDetailPage} />,
      },
      {
        path: "users",
        element: <PrivateRoute component={UserTable} />,
      },
      {
        path: "store-users",
        element: <PrivateRoute component={StoreUserTable} />,
      },
      {
        path: "analytics",
        element: <PrivateRoute component={Analytics} />,
      },
      {
        path: "dashboard",
        element: <PrivateRoute component={StoreDashboard} />,
      },
      {
        path: "requested-theme",
        element: <PrivateRoute component={RequestedTheme} />,
      },
      {
        path: "themes",
        element: <ProtectedRoute component={Template} />,
      },
      {
        path: "user-profile",
        element: <ProtectedRoute component={UserProfilePage} />,
      },
      {
        path: "order/:orderId/ship",
        element: <ProtectedRoute component={ShiprocketOrderShipment} />,
      },
    ],
  },
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      {
        path: "user/:userId/stores",
        element: <PrivateRoute component={StoreListTable} />,
      },
      {
        path: "cms",
        element: <PrivateRoute component={CMSManagementPage} />,
      },
    ],
  },

  {
    path: "/account/:account",
    element: <SignupPage />,
  },

  // {
  //   path: "/user/verify/email",
  //   element: <VerifyEmail />,
  // },

  {
    path: "/user/activate/account",
    element: <ActivateAccountByEmail />,
  },
  {
    path: "/user/invitation/register",
    element: <InviteAddClientUser />,
  },
  {
    path: "/user/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/subscription-expired",
    element: <SubscriptionExpired />,
  },
  {
    path: "pricing",
    element: <PricingV2 />,
  },
  {
    path: "*",
    element: <NoMatch />,
  },
]);

export default router;
