import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  let user = null;
  console.log(token, savedUser);

  try {
    user =
      savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Invalid user JSON:", error);
    localStorage.removeItem("user");
  }


  // 1. NOT LOGGED IN
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 2. ROLE CHECK
  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
}
