import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

function Profile() {
  const auth = getAuth();
  console.log(auth);
  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  const [user, setUser] = useState(null);
  return (
    <div>
      {user ? <h1>Greetings {user.displayName}</h1> : <h1>Not Logged In</h1>}
    </div>
  );
}

export default Profile;
