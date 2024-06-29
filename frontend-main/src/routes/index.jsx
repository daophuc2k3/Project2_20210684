import { LocalKeys } from "@constant/localStorage";
import { UserRoles } from "@constant/user";
import { fetchCurrentUser } from "@features/auth/authThunk";
import RootLayout from "@layout/RootLayout";
import CategoryPage from "@pages/CategoryPage";
import FootballPageClient from "@pages/Clients/FootballPageClient";
import OrderPageClient from "@pages/Clients/OrderPageClient";
import CustomerPage from "@pages/CustomerPage";
import FootballPage from "@pages/FootballPage";
import ForbiddenPage from "@pages/ForbiddenPage";
import LoginPage from "@pages/LoginPage";
import OrderPage from "@pages/OrderPage";
import ProductPage from "@pages/ProductPage";
import ProfilePage from "@pages/ProfilePage";
import SignUpPage from "@pages/SignUpPage";
import StatisticsPage from "@pages/StatisticsPage/StatisticsPage";
import { store } from "@store/store";
import { isEmpty } from "lodash";
import { createBrowserRouter, Navigate, redirect } from "react-router-dom";

const authentication = (role = "") => {
  return async (params) => {
    const userId = localStorage.getItem(LocalKeys.userId);
    const accessToken = localStorage.getItem(LocalKeys.accessToken);
    const refreshToken = localStorage.getItem(LocalKeys.refreshToken);
    const { user } = store.getState().auth;

    if (!accessToken || !refreshToken || !userId) throw redirect("/login");

    if (!role) return null;

    if (!user) {
      const { payload } = await store.dispatch(fetchCurrentUser());

      console.log(`payload  authentication`, payload);

      if (isEmpty(payload?.error)) {
        const { role: getRole } = payload?.metadata;

        if (getRole !== role) {
          throw redirect("/forbidden");
        }
      }

      // throw payload.error;
    } else {
      if (user.role !== role) {
        throw redirect("/forbidden");
      }
    }

    return null;
  };
};

const authorization = () => {
  const userId = localStorage.getItem(LocalKeys.userId);
  const accessToken = localStorage.getItem(LocalKeys.accessToken);
  const refreshToken = localStorage.getItem(LocalKeys.refreshToken);

  if (!accessToken || !refreshToken || !userId) return null;

  throw redirect("/");
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: () => {
      const userId = localStorage.getItem(LocalKeys.userId);
      const accessToken = localStorage.getItem(LocalKeys.accessToken);
      const refreshToken = localStorage.getItem(LocalKeys.refreshToken);
      const { user } = store.getState().auth;

      if (!accessToken || !refreshToken || !userId) return null;

      !user && store.dispatch(fetchCurrentUser());

      return null;
    },
    children: [
      { index: true, element: <Navigate to="/admin/order" /> },

      // Admins
      {
        path: "admin/order",
        element: <OrderPage />,
        loader: authentication(UserRoles.admin),
      },
      {
        path: "admin/customer",
        element: <CustomerPage />,
        loader: authentication(UserRoles.admin),
      },
      {
        path: "admin/category",
        element: <CategoryPage />,
        loader: authentication(UserRoles.admin),
      },
      {
        path: "admin/football",
        element: <FootballPage />,
        loader: authentication(UserRoles.admin),
      },
      {
        path: "admin/product",
        element: <ProductPage />,
        loader: authentication(UserRoles.admin),
      },
      {
        path: "admin/statistics",
        element: <StatisticsPage />,
      },

      // Clients
      { path: "order", element: <OrderPageClient />, loader: authentication() },
      { path: "football", element: <FootballPageClient /> },

      //  Common
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  { path: "/sign-up", element: <SignUpPage />, loader: authorization },
  { path: "/forbidden", element: <ForbiddenPage /> },
  { path: "/login", element: <LoginPage />, loader: authorization },
]);

export default router;
