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
import Partners from "../pages/partners";
import AddNewPartener from "../pages/partners/addNewPartener";
import SinglePartener from "../pages/partners/singlePartener";
import EditPartener from "../pages/partners/editPartener";
import Branches from "../pages/branches";
import AddNewbranche from "../pages/branches/addNEwBranche";
import SinglePranch from "../pages/branches/singlePranch";

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
          <Route
            path="partners"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <Partners />
              </ProtectedRoute>
            }
          />
          <Route
            path="partners/addNewPartener"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <AddNewPartener />
              </ProtectedRoute>
            }
          />
          <Route
            path="partners/:id"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <SinglePartener />
              </ProtectedRoute>
            }
          />
          <Route
            path="partners/:id/edit"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <EditPartener />
              </ProtectedRoute>
            }
          />
          <Route
            path="branches"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <Branches />
              </ProtectedRoute>
            }
          />
          <Route
            path="branches/new"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <AddNewbranche />
              </ProtectedRoute>
            }
          />
          <Route
            path="branches/:id"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <SinglePranch />
              </ProtectedRoute>
            }
          />
          <Route
            path="branches/:id/edit"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <AddNewbranche />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
    </>
  )
);

export default router;
