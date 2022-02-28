import { getAuth, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";
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
  // Component Level State
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  // Destructure and pull name and email out of formData
  const { name, email } = formData;

  // Init useNavigate hook
  const navigate = useNavigate();

  // useEffect Hook to fetch a logged in user's listings on page load
  useEffect(() => {
    const fetchUserListings = async () => {
      // Init listingRef
      const listingsRef = collection(db, "listings");
      // Create a query
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      // Init snapshot
      const querySnap = await getDocs(q);

      // Set listings variable to empty array
      let listings = [];
      // Loop through snapshot and push listings to it
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      // Reset listing and loading State
      setListings(listings);
      setLoading(false);
    };
    // Call function to fetch listings
    fetchUserListings();
  }, [auth.currentUser.uid]);

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

  // Function that deletes a listing
  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Successfully deleted listing");
    }
  };

  // Function that allows user to edit a specific listing
  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type="button" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
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
          <form>
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

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="Home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="Arrow Right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
