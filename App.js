import { Routes, Route } from "react-router-dom";

import { UserAuthContextProvider } from "./Auth/context/UserAuthContext";
import Header from "./Members/Header";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Profile from "./Members/ProfileMain";
import Header2 from "./Auth/Header2";
// import AccessDenied from "./components/Components/AccessDenied";
import Home from "./Auth/Home";
import Login from "./Auth/Login";

// import Signup from "./components/Admin/components/Signup";
import FPassword from "./Auth/FPassword";

import "./App.css";
import Attendance from "./Members/Attendance/Attendance";
import Dashboard from "./Members/Dashboard";
import Leave from "./Members/Leave";
import Events from "./Members/Events";
import Payments from "./Members/Payments";
import AgreementForm from "./Members/AgreementForm";
import Members from "./Members/Members";
import AttenUpdates from "./Members/Attendance/AttenUpdates";
import AttenUpdatesOld from "./Members/AttenUpdates";
import AttenDetails from "./Members/Attendance/AttendanceDetails";
import Tshirt from "./Tshirt";
import MyFiles from "./Members/MyFiles";
import MyLogs from "./Members/MyLogs";

import Verification from "./Verifications/Verification";
import VProfile from "./Verifications/Profile";
import FeedbackForm from "./Members/FeedbackForm";
import Membership from "./Others/Membership";
import BtmNavbar from "./Members/BtmNavbar";
import LeaveDetails from "./Members/LeaveDetails";
import Tedx from "./Members/Tedx";
function App() {
  return (
    <div className="admin">
      <UserAuthContextProvider>
        <Routes>
          <Route
            path="/membership24"
            element={
              <>
                <Header2 />
                <Membership />
              </>
            }
          />

          <Route
            path="/password_reset"
            element={
              <>
                <FPassword />
              </>
            }
          />
          <Route
            path="/login_authenticate"
            element={
              <>
                <Login />
              </>
            }
          />

          <Route
            path="/"
            element={
              <>
                <Header2 />
                <Home />
              </>
            }
          />

          <Route
            path="/members_feedbacks"
            element={
              <>
                <Header2 />
                <FeedbackForm />
              </>
            }
          />

          <Route
            path="/members_agreement_"
            element={
              <>
                <Header2 />
                <AgreementForm />
              </>
            }
          />

          <Route
            path="/tshirt_"
            element={
              <>
                <Header2 />
                <Tshirt />
              </>
            }
          />

          <Route
            path="/verifications"
            element={
              <>
                <Header2 />
                <Verification />
              </>
            }
          />

          <Route
            path="/verified_profile"
            element={
              <>
                <Header2 />
                <VProfile />
              </>
            }
          />

          <Route
            path="/attendance_"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <Attendance />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/attendance_updates"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <AttenUpdates />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/attendance_updates_2023"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <AttenUpdatesOld />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/attendance_details/:id"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <AttenDetails />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/events_"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <Events />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/tedx"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <Tedx />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/myfiles_"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <MyFiles />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/mylogs"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <MyLogs />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/payments_"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <Payments />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/www_members_"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <Members />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/home_dashboard"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <Dashboard />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/user_profile"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <Profile />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/user_leave"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <Leave />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/leave_detail/:id"
            element={
              <>
                <ProtectedRoute>
                  <Header />
                  <LeaveDetails />
                  <BtmNavbar />
                </ProtectedRoute>
              </>
            }
          />
        </Routes>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
