import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, Button, Form } from "semantic-ui-react";
import { db, auth } from "../firebase-config";
import "./Loader.css";
import GoToTop from "../GoToTop";
import { onSnapshot } from "firebase/firestore";
import ModalTedx from "./ModalTedx";

function Tedx() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const userId = auth.currentUser ? auth.currentUser.uid : null;
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
            navigate("/");
          }
        } catch (error) {
          console.log("Error getting user document:", error);
        }
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, [userId]);

  const [availP, setAvail] = useState([]);
  //   useEffect(() => {
  //     const unsub = onSnapshot(
  //       db.collection("TedXtasks").doc(uid).collection("Tasks").orderBy("id"),
  //       (snapshot) => {
  //         let list = [];
  //         snapshot.docs.forEach((doc) => {
  //           list.push({ id: doc.id, ...doc.data() });
  //         });
  //         setAvail(list);
  //       },

  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  //     return () => {
  //       unsub();
  //     };
  //   }, []);

  useEffect(() => {
    const fetchUserData = (uid) => {
      const query = db
        .collection("TedXtasks")
        .doc(uid)
        .collection("Tasks")
        .orderBy("id");
      const unsubscribe = query.onSnapshot(
        (querySnapshot) => {
          const documents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAvail(documents);
        },
        (error) => {
          console.error(error);
        }
      );

      return unsubscribe;
    };

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        const unsubscribeSnapshot = fetchUserData(uid);

        return () => {
          unsubscribeSnapshot();
        };
      } else {
        // No current user
        setAvail([]);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const formatTimestamp = (lastdate) => {
    const date = new Date(lastdate);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toDateString("en-US", options);
  };

  const formatTimestamp1 = (postedOn) => {
    const date = postedOn.toDate();
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

  //Add Event Modal
  const [openP, setOpenP] = useState(false);
  const [modalapplyP, setModalApplyP] = useState({});
  const handleSubmit = (item) => {
    setOpenP(true);
    setModalApplyP(item);
  };

  if (!userData) {
    return (
      <>
        <GoToTop />
        <span class="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </>
    );
  }

  return (
    <>
      <GoToTop />
      <main id="main" class="main">
        <div class="pagetitle">
          {/* <h1>Payment History</h1> */}
          <h5 class="card-title">Task Management</h5>
        </div>

        {availP.map((item, index) => (
          <div
            key={item.id}
            style={{ display: item.tstatus === "Assigned" ? "block" : "none" }}
          >
            <div className="row">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body" style={{ fontSize: "12px" }}>
                    <div
                      class="ui ribbon label"
                      style={{
                        backgroundColor:
                          item.tstatus === "Assigned"
                            ? "orange"
                            : item.tstatus === "Completed"
                            ? "green"
                            : "yellow",
                        color: "white",
                      }}
                    >
                      {item.tstatus}
                    </div>
                    <p style={{ color: "grey", marginTop: "15px" }}>
                      Assigned Date:{" "}
                      <b style={{ color: "grey" }}>
                        {item.postedOn && formatTimestamp1(item.postedOn)}
                      </b>
                    </p>
                    <p style={{ color: "grey" }}>
                      Submission Date:{" "}
                      <div class="ui red horizontal label">
                        {item.lastdate && formatTimestamp(item.lastdate)}
                      </div>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body" style={{ fontSize: "12px" }}>
                    <p style={{ color: "black", fontWeight: "bold" }}>
                      <span style={{ color: "grey", fontWeight: "normal" }}>
                        Task {index + 1}:{" "}
                      </span>
                      {item.task}
                    </p>

                    <Button
                      color="facebook"
                      onClick={() => handleSubmit(item)}
                      size="small"
                    >
                      Submit Task
                    </Button>
                    {openP && (
                      <ModalTedx
                        open={openP}
                        setOpen={setOpenP}
                        // handleDelete={handleDelete}
                        {...modalapplyP}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div class="pagetitle my-3">
          {/* <h1>Payment History</h1> */}
          <h5 class="card-title">Past Tasks</h5>
        </div>

        {availP.map((item, index) => (
          <div
            key={item.id}
            style={{ display: item.tstatus === "Assigned" ? "none" : "block" }}
          >
            <div className="row">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body" style={{ fontSize: "12px" }}>
                    <div
                      class="ui ribbon label"
                      style={{
                        backgroundColor:
                          item.tstatus === "Assigned"
                            ? "orange"
                            : item.tstatus === "Completed"
                            ? "green"
                            : item.tstatus === "Submitted"
                            ? "green"
                            : "yellow",
                        color: "white",
                      }}
                    >
                      {item.tstatus}
                    </div>
                    <p style={{ color: "grey", marginTop: "15px" }}>
                      Assigned Date:{" "}
                      <b style={{ color: "grey" }}>
                        {item.postedOn && formatTimestamp1(item.postedOn)}
                      </b>
                    </p>
                    <p style={{ color: "grey" }}>
                      Submission Date:{" "}
                      <div class="ui red horizontal label">
                        {item.lastdate && formatTimestamp(item.lastdate)}
                      </div>
                    </p>

                    <p style={{ color: "grey" }}>
                      Submitted On:{" "}
                      <b style={{ color: "green" }}>
                        {item.submittedOn && formatTimestamp1(item.submittedOn)}
                      </b>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body" style={{ fontSize: "12px" }}>
                    <p style={{ color: "black", fontWeight: "bold" }}>
                      <span style={{ color: "grey", fontWeight: "normal" }}>
                        Task {index + 1}:{" "}
                      </span>
                      {item.task}
                    </p>

                    <p>
                      <span style={{ color: "grey", fontWeight: "normal" }}>
                        Remark:{" "}
                      </span>
                      {item.remark}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <br></br>
        <br></br>
      </main>
    </>
  );
}

export default Tedx;
