import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Cookies from "js-cookie";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoginPage from "../pages/auth/login";
import RootLayout from "../layout";
import ConsultationRequests from "../pages/consultation_requests";
import HomePage from "../pages/Home";

const token = Cookies.get("access_token");

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/login"
        element={
          <ProtectedRoute isAllowed={!token} redirectPath="/" data={token}>
            <LoginPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="admins">
          <Route
            path="consultation_requests"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <ConsultationRequests />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
    </>
  )
);

export default router;
