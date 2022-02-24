import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Spinner from "../components/Spinner";

function CreateListing() {
  /* Component Level State */

  // Component Loading State
  const [loading, setLoading] = useState(false);

  // Component Form State
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  // Component Geolocation Option State
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);

  /* End Of Component Level State */

  // Init getAuth, navigate and isMounted constants
  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  // useEffect hook to check for a user on page load
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }

    // Return cleanup function for memory leak
    return (isMounted.current = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  // If loading state is true, enable the Spinner component
  if (loading) {
    return <Spinner />;
  }
  return <div>CreateListing</div>;
}

export default CreateListing;
