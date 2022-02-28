import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
function Contact() {
  // Component Level State
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);

  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();

  // Init useParams hook to get the landlord id in the URL
  const params = useParams();

  // useEffect hook to get the user and the landlord id on page load
  useEffect(() => {
    const getLandlord = async () => {
      // Setup user document and create a db snapshot
      const docRef = doc(db, "users", params.landlordId);
      const docSnap = await getDoc(docRef);
      // If document snapshot exists, set landlord to its data property, else throw an error
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    };
    // Call function on page load
    getLandlord();
  }, [params.landlordId]);

  // Function that reacts to form change
  const onChange = (e) => setMessage(e.target.value);
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">
              Contact User Name:{" "}
              <strong>
                <u>{landlord?.name}</u>
              </strong>
            </p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
