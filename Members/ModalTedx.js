import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import { Button, Form } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { serverTimestamp } from "firebase/firestore";
import { Alert } from "react-bootstrap";

const ModalTedx = ({ open, setOpen, task, id }) => {
  const [userData, setUserData] = useState(null);
  const [success, setSuccess] = useState("");
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const [remark, setUserDesc] = useState("");

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

  const handleSubmitApprove = async () => {
    try {
      // Create a new document in Firestore collection
      db.collection("TedXtasks")
        .doc(userId)
        .collection("Tasks")
        .doc(id)
        .update({
          remark,
          submittedOn: serverTimestamp(),
          tstatus: "Submitted",
        })
        .then(() => {
          db.collection("TedXtasks").doc(userId).update({
            submittedOn: serverTimestamp(),
            tstatus: "Submitted",
          });
        });

      // Reset form fields and close the modal
      setUserDesc("");
      setSuccess("Submitted Successfully!");
      setTimeout(() => {
        setOpen(false);
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.log("Error submitting applied project:", error);
    }
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      class="modal fade"
      style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div
            class="modal-header"
            style={{ backgroundColor: "#2185d2", color: "white" }}
          >
            <h5 class="modal-title" id="exampleModalLabel">
              Task Update
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
            <div class="container-fluid" style={{ fontSize: "12px" }}>
              {success && (
                <Alert
                  variant="success"
                  style={{ fontSize: "13px", textAlign: "center" }}
                >
                  {success}
                </Alert>
              )}
              <div class="row">
                <p class="col-lg-12 my-2">
                  Task: <b style={{ color: "black" }}>{task}</b>
                </p>

                <Form>
                  <Form.TextArea
                    rows={5}
                    placeholder="Write your task updates here..."
                  ></Form.TextArea>
                </Form>
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
              Submit
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalTedx;
