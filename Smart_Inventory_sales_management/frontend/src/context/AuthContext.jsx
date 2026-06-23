import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid user JSON:", error);
        setUser(null);
        localStorage.removeItem("user");
      }
      setToken(savedToken);
    }
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });

    const token = res.data.createToken;
    setToken(token);
    localStorage.setItem("token", token);

    // Fetch user details using CRUD controller
    const userRes = await API.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(userRes.data);
    localStorage.setItem("user", JSON.stringify(userRes.data));

    console.log("Logged in user:", userRes.data);
  };

  // REGISTER
  const register = async (data) => {
    await API.post("/auth/register", data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
