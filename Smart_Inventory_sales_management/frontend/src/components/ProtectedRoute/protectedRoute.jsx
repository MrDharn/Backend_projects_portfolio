import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. NOT LOGGED IN
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 2. ROLE CHECK (optional)
  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
    }
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
    }

  return children;
}