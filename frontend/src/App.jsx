import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navigation from "./pages/Navigation";
import AuthoritySignIn from "./auth/SignIn/AuthoritySignIn";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/Passenger/HomePage";
import FlightBookingPage from "./pages/Passenger/FlightBooking/FlightBookingPage";
import UserSignUp from "./auth/UserSignUp";
import UserSignIn from "./auth/UserSignIn";

const AuthorityProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user && (user.role === "admin" || user.role === "staff") ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

const AuthorityAuthRedirect = ({ children }) => {
  const { user } = useAuth();
  return user && (user.role === "admin" || user.role === "staff") ? (
    <Navigate to="/dashboard" />
  ) : (
    children
  );
};
const PassengerAuthRedirect = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : children;
};

export default function App() {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <AuthorityProtectedRoute>
                  <Navigation />
                </AuthorityProtectedRoute>
              }
            />

            <Route
              path="/authority-login"
              element={
                <AuthorityAuthRedirect>
                  <AuthoritySignIn />
                </AuthorityAuthRedirect>
              }
            />
            <Route
              path="/passenger-signup"
              element={
                <PassengerAuthRedirect>
                  <UserSignUp />
                </PassengerAuthRedirect>
              }
            />
            <Route
              path="/passenger-signin"
              element={
                <PassengerAuthRedirect>
                  <UserSignIn />{" "}
                </PassengerAuthRedirect>
              }
            />

            <Route path="/" element={<HomePage />} />
            <Route path="/book-flights" element={<FlightBookingPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}
