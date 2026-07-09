import { createContext, useState , useEffect} from "react";
import {getProfile} from '../services/profileApiService'
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

    const fetchProfile = async()=>{
      if(!token) return ;

      try{
        const response = await getProfile();
        console.log(response)
        setUser(response.data);
      }catch(e){
        console.log(e)
      }
    }

    fetchProfile()
  }, [token]);

  console.log(user)
  return (
    <AuthContext.Provider value={{ logout, login, user, token }}>
      {children}
    </AuthContext.Provider>
  );
};
