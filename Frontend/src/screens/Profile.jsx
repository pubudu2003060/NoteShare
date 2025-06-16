import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const signout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/signin");
  };
  return (
    <div>
      <button onClick={signout}>Signout</button>
    </div>
  );
};

export default Profile;
