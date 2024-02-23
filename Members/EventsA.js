import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase-config";
import "./Loader.css";
import GoToTop from "../GoToTop";
import { Table } from "react-bootstrap";
import { onSnapshot } from "firebase/firestore";

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

  const [openF, setOpenF] = useState(false);
  const [modalapplyF, setModalApplyF] = useState({});
  const handleFile = (item) => {
    setOpenF(true);
    setModalApplyF(item);
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

      {/* Registered and Attended Events */}

      <div class="pagetitle">
        <h5 class="card-title">Registered Events</h5>
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
                  Status
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Certificate
                </th>
              </tr>
            </thead>
            <tbody>
              {registed.length > 0 ? (
                <>
                  {registed.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td
                        style={{
                          minWidth: "24vh",
                        }}
                      >
                        {row.Ename}
                      </td>
                      <td
                        style={{
                          minWidth: "30vh",
                        }}
                      >
                        {row.eventdate && formatTimestamp1(row.eventdate)}
                      </td>
                      <td
                        style={{
                          minWidth: "24vh",
                        }}
                      >
                        {row.Evenue}
                      </td>
                      <td
                        style={{
                          minWidth: "12vh",
                          textAlign: "center",
                          color:
                            row.status === "Registered"
                              ? "orange"
                              : row.status === "Present"
                              ? "green"
                              : "red",
                        }}
                      >
                        <b>{row.status}</b>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {row.certificate && row.certificate.length > 0 ? (
                          <>
                            <i
                              onClick={() => handleFile(row)}
                              className="fa fa-download"
                              style={{ color: "#1f88be", cursor: "pointer" }}
                            ></i>

                            {openF && (
                              <ModalFile
                                open={openF}
                                setOpen={setOpenF}
                                // handleDelete={handleDelete}
                                {...modalapplyF}
                              />
                            )}
                          </>
                        ) : (
                          <i
                            className="fa fa-times"
                            style={{ color: "red" }}
                          ></i>
                        )}
                      </td>

                      {/* Render additional table cells based on your data structure */}
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {" "}
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", color: "red" }}
                    >
                      No data found
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </Table>
        </div>
        <div id="mobileview">
          {registed.length > 0 ? (
            <>
              {registed.map((row, index) => (
                <div
                  class="card info-card revenue-card"
                  key={index}
                  style={{
                    backgroundColor:
                      row.status === "Registered"
                        ? "#FFF7CD"
                        : row.status === "Present"
                        ? "#e1f1fa"
                        : "#FFE7D9",
                  }}
                >
                  <div class="card-body">
                    <div className="row">
                      <div className="col-9">
                        <b style={{ fontSize: "11px", color: "#000" }}>
                          {row.Ename}
                        </b>
                        <br></br>
                        <span style={{ fontSize: "11px", color: "grey" }}>
                          Event Date:{" "}
                          <b style={{ color: "red" }}>
                            {row.eventdate && formatTimestamp1(row.eventdate)}
                          </b>
                        </span>
                        <br></br>
                        <span style={{ fontSize: "11px", color: "grey" }}>
                          Venue: <b style={{ color: "black" }}>{row.Evenue}</b>
                        </span>
                      </div>
                      <div
                        className="col-3"
                        style={{ borderLeft: "1px dotted grey" }}
                      >
                        <h1
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            marginTop: "23px",
                            textAlign: "center",
                            display:
                              row.status === "Present" ? "none" : "block",
                            color:
                              row.status === "Registered"
                                ? "orange"
                                : row.status === "Present"
                                ? "green"
                                : "red",
                          }}
                        >
                          {row.status}
                        </h1>

                        <h1
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginTop: "20px",
                            textAlign: "center",
                            display:
                              row.status === "Present" ? "block" : "none",
                          }}
                        >
                          {row.certificate && row.certificate.length > 0 ? (
                            <>
                              <i
                                onClick={() => handleFile(row)}
                                className="fa fa-download"
                                style={{ color: "#1f88be", cursor: "pointer" }}
                              ></i>

                              {openF && (
                                <ModalFile
                                  open={openF}
                                  setOpen={setOpenF}
                                  // handleDelete={handleDelete}
                                  {...modalapplyF}
                                />
                              )}
                            </>
                          ) : (
                            <i
                              className="fa fa-times"
                              style={{ color: "red" }}
                            ></i>
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
              <p style={{ textAlign: "center", color: "red" }}>No data found</p>
            </>
          )}
        </div>
        <br></br> <br></br>
      </div>
    </>
  );
}

export default Events;
