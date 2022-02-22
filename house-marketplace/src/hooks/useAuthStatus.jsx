import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  // State for user logged state
  const [loggedIn, setLoggedIn] = useState(false);

  // State for checking user's logged in status
  const [checkingStatus, setCheckingStatus] = useState(true);

  // ref variable to fix memory leak error
  const isMounted = useRef(true);

  // useEffect hook to fire and check users logged in status
  useEffect(() => {
    if (isMounted) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
        }
        setCheckingStatus(false);
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return { loggedIn, checkingStatus };
};
