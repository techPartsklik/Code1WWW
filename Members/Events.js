import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase-config";
import "./Loader.css";
import GoToTop from "../GoToTop";
import { Table } from "react-bootstrap";
import { onSnapshot } from "firebase/firestore";
import EventsA from "./EventsA";

import ModalRegister from "./ModalRegisterEvent";
import ModalFile from "./ModalFile";
function Events() {
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

  //Add Event Modal
  const [openP, setOpenP] = useState(false);
  const [modalapplyP, setModalApplyP] = useState({});
  const handleRegister = (item) => {
    setOpenP(true);
    setModalApplyP(item);
  };

  const [openF, setOpenF] = useState(false);
  const [modalapplyF, setModalApplyF] = useState({});
  const handleFile = (item) => {
    setOpenF(true);
    setModalApplyF(item);
  };

  ///Available Events
  useEffect(() => {
    const unsub = onSnapshot(
      db.collection("Events").orderBy("eventdate", "desc"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setAvail(list);
      },

      (error) => {
        console.error(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

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

  ////////////////////Get registered events
  const [registed, setRegistered] = useState([]);

  useEffect(() => {
    // Fetch data from Firestore
    const fetchData = async () => {
      try {
        const querySnapshot = await db
          .collection("RegisteredEvents")
          .doc(userId)
          .collection("Events")
          .orderBy("eventdate", "desc")
          .onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data());
            setRegistered(data);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error appropriately
      }
    };

    fetchData();
  }, []);

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
          <h5 class="card-title">Offline Events</h5>
        </div>

        <div className="container-fluid" style={{ padding: "0px" }}>
          <div class="card mb-3" id="pcview">
            <Table responsive hover striped bordered size="sm">
              <thead style={{ backgroundColor: "#1f88be", color: "#fff" }}>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Event Name</th>
                  <th scope="col">Event Date</th>
                  <th scope="col">Event Venue</th>

                  <th scope="col" style={{ textAlign: "center" }}>
                    Certificate
                  </th>
                  <th scope="col" style={{ textAlign: "center" }}>
                    Registration
                  </th>
                </tr>
              </thead>
              <tbody>
                {availP.length > 0 ? (
                  <>
                    {availP.map((item, index) => (
                      <tr key={item.id}>
                        <th
                          scope="row"
                          style={{
                            width: "5vh",
                            backgroundColor:
                              item.registration === "Open" ? "#e1f1fa" : null,
                          }}
                        >
                          {index + 1}
                        </th>

                        <td
                          style={{
                            minWidth: "24vh",
                            backgroundColor:
                              item.registration === "Open" ? "#e1f1fa" : null,
                          }}
                        >
                          {item.Ename}
                        </td>
                        <td
                          style={{
                            minWidth: "30vh",
                            backgroundColor:
                              item.registration === "Open" ? "#e1f1fa" : null,
                          }}
                        >
                          <b>
                            {item.eventdate && formatTimestamp1(item.eventdate)}
                          </b>
                        </td>
                        <td
                          style={{
                            minWidth: "24vh",
                            backgroundColor:
                              item.registration === "Open" ? "#e1f1fa" : null,
                          }}
                        >
                          {item.Evenue}
                        </td>

                        <td
                          style={{
                            minWidth: "11vh",
                            textAlign: "center",
                            backgroundColor:
                              item.registration === "Open" ? "#e1f1fa" : null,
                            color:
                              item.certificate === "Available"
                                ? "green"
                                : "red",
                          }}
                        >
                          {item.certificate}
                        </td>

                        <td
                          style={{
                            minWidth: "11vh",
                            textAlign: "center",
                            backgroundColor:
                              item.registration === "Open" ? "#e1f1fa" : null,
                          }}
                        >
                          {item.registration && item.registration === "Open" ? (
                            <>
                              <button
                                class="btn"
                                onClick={() => handleRegister(item)}
                                style={{
                                  backgroundColor: "#1f88be",
                                  color: "white",
                                  minWidth: "15vh",
                                }}
                                // onClick={handleSubmitData}
                              >
                                <i class="fa fa-send"></i> Register
                              </button>
                              {openP && (
                                <ModalRegister
                                  open={openP}
                                  setOpen={setOpenP}
                                  // handleDelete={handleDelete}
                                  {...modalapplyP}
                                />
                              )}
                            </>
                          ) : (
                            <>
                              <b style={{ color: "red" }}>
                                <i class="fa fa-times"></i>
                              </b>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", color: "red" }}
                    >
                      No data found
                    </td>
                  </tr>
                )}
                <tr></tr>
              </tbody>
            </Table>
          </div>

          <div id="mobileview">
            {availP.length > 0 ? (
              <>
                {availP.map((item, index) => (
                  <div
                    class="card info-card revenue-card"
                    key={index}
                    style={{
                      backgroundColor:
                        item.registration === "Open" ? "#e1f1fa" : null,
                    }}
                  >
                    <div class="card-body">
                      <div className="row">
                        <div className="col-9">
                          <b style={{ fontSize: "11px", color: "#000" }}>
                            {item.Ename}
                          </b>
                          <br></br>
                          <span style={{ fontSize: "11px", color: "grey" }}>
                            Event Date:{" "}
                            <b style={{ color: "red" }}>
                              {item.eventdate &&
                                formatTimestamp1(item.eventdate)}
                            </b>
                          </span>
                          <br></br>
                          <span style={{ fontSize: "11px", color: "grey" }}>
                            Venue:{" "}
                            <b style={{ color: "black" }}>{item.Evenue}</b>
                          </span>
                        </div>
                        <div
                          className="col-3"
                          style={{ borderLeft: "1px dotted grey" }}
                        >
                          <h1
                            style={{
                              fontSize: "12px",

                              marginTop: "23px",
                              textAlign: "center",
                            }}
                          >
                            {item.registration &&
                            item.registration === "Open" ? (
                              <>
                                <button
                                  class="btn"
                                  onClick={() => handleRegister(item)}
                                  style={{
                                    backgroundColor: "#1f88be",
                                    color: "white",
                                    fontSize: "11px",
                                    marginTop: "-5px",
                                  }}
                                  // onClick={handleSubmitData}
                                >
                                  Register
                                </button>
                                {openP && (
                                  <ModalRegister
                                    open={openP}
                                    setOpen={setOpenP}
                                    // handleDelete={handleDelete}
                                    {...modalapplyP}
                                  />
                                )}
                              </>
                            ) : (
                              <>
                                <b style={{ color: "red" }}>
                                  <i class="fa fa-times"></i>
                                </b>
                              </>
                            )}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <p style={{ textAlign: "center", color: "red" }}>
                  No data found
                </p>
              </>
            )}
          </div>
        </div>
        <br></br>

        {/* Registered and Attended Events */}

        <EventsA />
      </main>
    </>
  );
}

export default Events;
