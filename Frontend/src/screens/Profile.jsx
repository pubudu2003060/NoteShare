import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const signout = () => {
    localStorage.removeItem("token");
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
