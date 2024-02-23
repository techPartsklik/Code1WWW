import React, {useState, useEffect} from "react";
import {db, auth} from "../firebase-config";
import {Modal} from "semantic-ui-react";
import {serverTimestamp} from "firebase/firestore";
import {Alert} from "react-bootstrap";

const ModalRegisterEvent = ({
  open,
  setOpen,
  Ename,
  eventdate,
  Evenue,

  id,
}) => {
  const [userData, setUserData] = useState(null);
  const [success, setSuccess] = useState("");
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const [userDesc, setUserDesc] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDocRef = db.collection("members").doc(userId);
          const userDoc = await userDocRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserData(userData);
          } else {
            console.log("No user document found!");
          }
        } catch (error) {
          console.log("Error getting user document:", error);
        }
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, [userId]);

  const current = new Date();
  const year = current.getFullYear(); // Get the current year
  const month = String(current.getMonth() + 1).padStart(2, "0"); // Get the current month (0-11) and add leading zero if needed
  const day = String(current.getDate()).padStart(2, "0");
  const date = `${year}-${month}-${day}`;

  const handleSubmitApprove = async () => {
    try {
      // Create a new document in Firestore collection
      db.collection("RegisteredEvents")
        .doc(userId)
        .collection("Events")
        .doc(id)
        .set({
          Ename,
          eventdate,
          Evenue,
          certificate: "",
          status: "Registered",
          registeredAt: serverTimestamp(),
          Edate: date,
        })
        .then(() => {
          db.collection("RegisteredEvents").doc(userId).set({
            name: userData.name,
            regno: userData.regno,
            contact: userData.phone,
            dept: userData.department,
            uid: userId,
            Ename,
            eventdate,
            registeredAt: serverTimestamp(),
          });
        });

      // Reset form fields and close the modal
      setUserDesc("");
      setSuccess("Registered Successfully!");
      setTimeout(() => {
        setOpen(false);
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.log("Error submitting applied project:", error);
    }
  };

  const formatTimestamp1 = (eventdate) => {
    const date = new Date(eventdate);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      class="modal fade"
      style={{width: "100%", height: "100%", backgroundColor: "transparent"}}
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div
            class="modal-header"
            style={{backgroundColor: "#2185d2", color: "white"}}
          >
            <h5 class="modal-title" id="exampleModalLabel">
              Register Event
            </h5>
            <button
              type="button"
              style={{
                color: "white",
                backgroundColor: "#2185d2",
                border: "1px solid White",
              }}
              onClick={() => setOpen(false)}
              data-bs-dismiss="modal"
            >
              X
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid" style={{fontSize: "12px"}}>
              {success && (
                <Alert
                  variant="success"
                  style={{fontSize: "13px", textAlign: "center"}}
                >
                  {success}
                </Alert>
              )}
              <div class="row">
                <div class="col-lg-12 my-2">
                  Event Name: <b style={{color: "black"}}>{Ename}</b>
                </div>
                <div class="col-lg-12 my-2">
                  Event Date:{" "}
                  <b style={{color: "black"}}>
                    {eventdate && formatTimestamp1(eventdate)}
                  </b>
                </div>

                <div class="col-lg-12 my-2">
                  Event Venue: <b>{Evenue}</b>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              class="btn"
              style={{
                backgroundColor: "grey",
                color: "white",
              }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              class="btn"
              type="submit"
              style={{
                backgroundColor: "#1f88be",
                color: "white",
              }}
              onClick={handleSubmitApprove}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalRegisterEvent;
