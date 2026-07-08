import { createContext, useState , useEffect} from "react";

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      setUser({ loggedIn: true });
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ logout, login, user, token }}>
      {children}
    </AuthContext.Provider>
  );
};
