import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const { username } = userInfo || {};
  const [openClose, setOpenClose] = useState(false);
  const url = process.env.REACT_APP_PORT;
  useEffect(() => {
    axios.get(`http://localhost:4000/profile`, { withCredentials: true })
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [setUserInfo, url]);

  function logout() {
    axios
      .post(`http://localhost:4000/logout`, null, { withCredentials: true })
      .then((response) => {
        setUserInfo(null);
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <header>
      <nav>
        <div className={openClose ? 'fullscreen active' : 'fullscreen'}>
          {username && (
            <> 
              <div className="header">
                <Link className="logo" to='/'>Admin DashBoard</Link>
                <Link className="logout-user" to='/login' onClick={logout}>
                    Logout
                </Link>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;