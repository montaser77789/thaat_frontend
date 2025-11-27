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
import SpecialistsPage from "../pages/specialists";
import AddNewSpecialist from "../pages/specialists/addNewSpecialist";
import EditSpecialist from "../pages/specialists/editSpecialist";
import SingleSpecialist from "../pages/specialists/singleSpecialist";
import TeamsPage from "../pages/Teams";
import AddNewTeam from "../pages/Teams/addNewTeams";
import SigleTeam from "../pages/Teams/singleTeam";
import CaragoriesPage from "../pages/categories";
import AddNewCatagory from "../pages/categories/addNewCatagory";
import Cities from "../pages/cities";
import Admins from "../pages/admins";
import Countries from "../pages/countrie";

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
          <Route
            path="specialists"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <SpecialistsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="specialists/new"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <AddNewSpecialist />
              </ProtectedRoute>
            }
          />
          <Route
            path="specialists/:id/edit"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <EditSpecialist />
              </ProtectedRoute>
            }
          />
          <Route
            path="specialists/:id"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <SingleSpecialist />
              </ProtectedRoute>
            }
          />
          <Route
            path="teams"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <TeamsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="teams/new"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <AddNewTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="teams/:id/edit"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <AddNewTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="teams/:id"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <SigleTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="categories"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <CaragoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="categories/new"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <AddNewCatagory />
              </ProtectedRoute>
            }
          />
          <Route
            path="categories/:id/edit"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <AddNewCatagory />
              </ProtectedRoute>
            }
          />
          <Route
            path="cities"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <Cities />
              </ProtectedRoute>
            }
          />
          <Route
            path="countries"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <Countries />
              </ProtectedRoute>
            }
          />
          <Route
            path="admins"
            element={
              <ProtectedRoute isAllowed={!!token} redirectPath="/login">
                <Admins />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
    </>
  )
);

export default router;
