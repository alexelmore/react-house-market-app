import { getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function Profile() {
  const auth = getAuth();
  // Const for memeber registration date
  const memberRegistrationDate = auth.currentUser.metadata.creationTime.slice(
    0,
    -13
  );
  // Const for last time member was logged in
  const lastTimeLoggedIn = auth.currentUser.metadata.lastSignInTime.slice(
    0,
    -13
  );

  // State for changing profile details
  const [changeDetails, setChangeDetails] = useState(false);

  // State for the form data
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

  // Function for submitting profile changes
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update user display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function for changes to the form
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type="button" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsText">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "Done" : "Change User Name"}
          </p>
        </div>
        <div className="profileCard">
          <form action="">
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <p>
              <strong>Member Since:</strong> {memberRegistrationDate}
            </p>

            <p>
              <strong>Last Time Logged In:</strong> {lastTimeLoggedIn}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;
