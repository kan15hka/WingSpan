import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserSignUp from "./pages/Auth/UserSignUp";
import UserSignIn from "./pages/Auth/UserSignIn";
import AdminPage from "./pages/AdminPage";
import EmployeePage from "./pages/EmployeePage";
import PageMsgDisplay from "./components/PageMsgDisplay";

function AuthRedirect({ children }) {
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;

  if (storedUser) {
    return storedUser.role === "Admin" ? (
      <Navigate to="/admin" />
    ) : (
      <Navigate to="/employee" />
    );
  }

  return children;
}
function AdminProtectedRoute({ children }) {
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;

  if (!storedUser) {
    return <Navigate to="/signin" />;
  }

  return storedUser.role === "Admin" ? (
    children
  ) : (
    <PageMsgDisplay text="Unauthorized access." />
  );
}

function EmployeeProtectedRoute({ children }) {
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;

  if (!storedUser) {
    return <Navigate to="/signin" />;
  }

  return storedUser.role === "Employee" ? (
    children
  ) : (
    <PageMsgDisplay text="Unauthorized access." />
  );
}

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <EmployeeProtectedRoute>
                <EmployeePage />
              </EmployeeProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRedirect>
                <UserSignUp />
              </AuthRedirect>
            }
          />
          <Route
            path="/signin"
            element={
              <AuthRedirect>
                <UserSignIn />
              </AuthRedirect>
            }
          />
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </Router>
    </div>
  );
}
