import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Profile() {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  // Destructure and pull name and email out of formData
  const { name, email } = formData;

  // Init useNavigate hook
  const navigate = useNavigate();

  // Function to log the user out
  const onLogout = (e) => {
    auth.signOut();
    navigate("/");
  };
  return (
    <div className="profile">
      {formData ? (
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button className="logOut" type="button" onClick={onLogout}>
            Logout
          </button>
        </header>
      ) : (
        <h1>Not Logged In</h1>
      )}
    </div>
  );
}

export default Profile;
