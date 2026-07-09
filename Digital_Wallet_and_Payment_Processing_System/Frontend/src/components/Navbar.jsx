import {React, useContext} from "react";
import "./css/navbar.css";
import {AuthContext} from "../context/AuthContext"

const Navbar = () => {
  const {user} = useContext(AuthContext)
  return (
    <div className="navbar">
      <div>
        <h3>Dashboard</h3>
      </div>

      <div className="user-box">
        <div className="avatar">
          {/* {user.name.charAt(0)} */}
        </div>

        <div>
          {/* <h4>{user.name}</h4> */}

          {/* <p>{user.email}</p> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
