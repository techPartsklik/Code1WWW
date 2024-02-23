import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db, auth } from "../firebase-config";
import "./Loader.css";
import "react-calendar/dist/Calendar.css";
import GoToTop from "../GoToTop";
import { Button } from "semantic-ui-react";
import { serverTimestamp } from "firebase/firestore";
import { Alert } from "react-bootstrap";
import { Table } from "react-bootstrap";
import LeaveImg from "./Img/leave.gif";
import ApprovedImg from "./Img/approved.gif";
import PendingImg from "./Img/wait.gif";

import RejectImg from "./Img/cancel.gif";
function Leave() {
  const [value, onChange] = useState(new Date());
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

  const [loader, setLoader] = useState("");
  const [success, setsuccessLoader] = useState("");
  const [startdate, setTodate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [reason, setReason] = useState("");
  const [numberOfDays, setNumberOfDays] = useState(null);

  const handleStartDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      alert("Selected date cannot be before the current date");
    } else {
      setTodate(e.target.value);
      calculateNumberOfDays(e.target.value, enddate);
    }
  };

  const handleEndDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      alert("Selected date cannot be before the current date");
    } else {
      setEnddate(e.target.value);
      calculateNumberOfDays(startdate, e.target.value);
    }
  };

  const calculateNumberOfDays = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    // Calculate the difference in milliseconds
    const timeDifference = endDateObj - startDateObj;

    // Convert milliseconds to days
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    // Update the state with the number of days
    setNumberOfDays(daysDifference);
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;

  function generateUniqueId(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueId = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueId += characters.charAt(randomIndex);
    }

    return uniqueId;
  }

  const uniqueId = generateUniqueId(10);

  const handleSubmit = async () => {
    setLoader("Please wait...");
    setsuccessLoader("");

    try {
      db.collection("Leaves").doc(`${formattedDateTime}`).set({
        name: userData.name,
        regno: userData.regno,
        contact: userData.phone,
        startdate,
        enddate,
        reason,
        numberOfDays,
        posted: serverTimestamp(),
        status: "Pending",
        uid: userId,
        ref: uniqueId,
        id: formattedDateTime,
      });

      // Reset form fields and close the modal
      // Reset form fields and close the modal
      setLoader("");
      setsuccessLoader("Leave applied successfully!");
      setTodate("");
      setEnddate("");
      setReason("");
      setNumberOfDays("");
      setTimeout(() => {
        setLoader("");
        setsuccessLoader("");
      }, 4000);
    } catch (error) {
      console.log("Error submitting:", error);
    }
  };

  ////////////////////////////////
  const [leave, setLeave] = useState([]);

  useEffect(() => {
    const fetchUserData = (uid) => {
      const query = db.collection("Leaves").where("uid", "==", uid);

      const unsubscribe = query.onSnapshot(
        (querySnapshot) => {
          const documents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLeave(documents);
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
        setLeave([]);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const formatTimestamp1 = (startdate) => {
    const date = new Date(startdate);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toDateString("en-US", options);
  };

  const formatTimestamp2 = (enddate) => {
    const date = new Date(enddate);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toDateString("en-US", options);
  };

  const approvedDaysSum = leave
    .filter((item) => item.status === "Approved")
    .reduce((sum, item) => sum + item.numberOfDays, 0);

  let RemainingDays = 150 - approvedDaysSum;

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
      <main id="main" className="main">
        <div className="pagetitle">
          <h5 class="card-title">Leave Requests</h5>
        </div>
        <div className="row">
          <div class="col-lg-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Instructions</h5>
                <ol style={{ fontSize: "12.5px" }}>
                  <li>Apply for leave a week or a month prior.</li>
                  <li>
                    Once applied the leave, inform the same on the department
                    group on whatsapp.
                  </li>
                  <li>
                    A total number of <b style={{ color: "red" }}>150 days</b>{" "}
                    to be granted to every member in a year as leave.
                  </li>
                  <li>
                    Any member who has been inactive for a longer period without
                    any leave/notice, necessary action will taken according to
                    <i> Leave Policy</i> of Wake With Wellness.
                  </li>
                </ol>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Apply Leave</h5>

                <form>
                  <div class="row mb-3">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">
                      From Date
                    </label>
                    <div class="col-sm-10">
                      <input
                        onChange={handleStartDateChange}
                        value={startdate}
                        type="date"
                        className="form-control"
                        id="inputEmail"
                      />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">
                      End Date
                    </label>
                    <div class="col-sm-10">
                      <input
                        onChange={handleEndDateChange}
                        value={enddate}
                        type="date"
                        className="form-control"
                        id="inputEmail"
                      />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">
                      No. of Days
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        value={numberOfDays !== null ? numberOfDays : ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="inputPassword3" class="col-sm-2 col-form-label">
                      Reason
                    </label>
                    <div class="col-sm-10">
                      <textarea
                        rows="4"
                        onChange={(e) => setReason(e.target.value)}
                        value={reason}
                        class="form-control"
                        required
                        placeholder="State your reason for the leave..."
                      ></textarea>
                    </div>
                  </div>

                  {loader && (
                    <Alert
                      variant="warning"
                      style={{ fontSize: "12px", textAlign: "center" }}
                    >
                      {loader}
                    </Alert>
                  )}
                  {success && (
                    <Alert
                      variant="success"
                      style={{ fontSize: "12px", textAlign: "center" }}
                    >
                      {success}
                    </Alert>
                  )}

                  <div class="text-center">
                    {startdate.length > 0 &&
                    enddate.length > 0 &&
                    reason.length > 3 ? (
                      <>
                        <Button
                          onClick={handleSubmit}
                          color="linkedin"
                          style={{
                            marginTop: "5px",
                          }}
                        >
                          Apply
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          disabled
                          style={{
                            marginTop: "5px",
                          }}
                          color="linkedin"
                        >
                          Apply
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="card">
              <div class="card-body">
                <div className="row my-2">
                  <div className="col-3">
                    <img src={LeaveImg} className="img-fluid" />
                  </div>
                  <div className="col-9">
                    <h1
                      style={{
                        fontSize: "30px",
                        color: "green",
                        fontWeight: "bolder",
                        marginTop: "0.2vh",
                      }}
                    >
                      {RemainingDays} Days
                    </h1>
                    <p style={{ color: "grey", marginTop: "-15px" }}>
                      Remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <div className="pagetitle">
          <h5 class="card-title">Applied Leaves</h5>
        </div>
        <div id="pcview">
          <Table
            responsive
            hover
            striped
            bordered
            size="sm"
            style={{ fontSize: "12px" }}
          >
            <thead style={{ backgroundColor: "#1f88be", color: "#fff" }}>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Ref no.</th>
                <th scope="col">From Date</th>
                <th scope="col">To Date</th>
                <th scope="col">No. of Days</th>
                <th scope="col">Reason</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {leave.length > 0 ? (
                <>
                  {leave.map((item, index) => (
                    <tr key={item.id}>
                      <th scope="row" style={{ width: "3vh" }}>
                        {index + 1}
                      </th>
                      <td style={{ minWidth: "11vh" }}>
                        <b>{item.ref}</b>
                      </td>
                      <td style={{ minWidth: "16vh" }}>
                        {item.startdate && formatTimestamp1(item.startdate)}
                      </td>
                      <td style={{ minWidth: "16vh" }}>
                        {item.enddate && formatTimestamp2(item.enddate)}
                      </td>
                      <td style={{ minWidth: "11vh" }}>
                        <b>{item.numberOfDays}</b>
                      </td>
                      <td style={{ minWidth: "19vh" }}>{item.reason}</td>
                      <td>
                        <b
                          style={{
                            color:
                              item.status === "Pending"
                                ? "orange"
                                : item.status === "Approved"
                                ? "green"
                                : "red",
                          }}
                        >
                          {item.status}
                        </b>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", color: "red" }}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div id="mobileview">
          {leave.length > 0 ? (
            <>
              {leave.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/leave_detail/${item.id}`)}
                  class="card info-card revenue-card"
                  style={{
                    backgroundColor:
                      item.status === "Approved"
                        ? "#e1f1fa"
                        : item.status === "Rejected"
                        ? "#ffe4d9"
                        : "#FFE7D9",
                  }}
                >
                  <div class="card-body">
                    <div className="row">
                      <div className="col-9">
                        <span style={{ fontSize: "12px", color: "grey" }}>
                          Ref. ID: <b style={{ color: "black" }}>{item.ref}</b>
                        </span>
                        <br></br>
                        <span style={{ fontSize: "12px", color: "grey" }}>
                          Start Date:{" "}
                          <b style={{ color: "black" }}>
                            {item.startdate && formatTimestamp1(item.startdate)}
                          </b>
                        </span>
                        <br></br>
                        <span style={{ fontSize: "12px", color: "grey" }}>
                          End Date:{" "}
                          <b style={{ color: "black" }}>
                            {item.enddate && formatTimestamp1(item.enddate)}
                          </b>
                        </span>

                        <br></br>
                        <span style={{ fontSize: "12px", color: "grey" }}>
                          No. of Days:{" "}
                          <b style={{ color: "black" }}>{item.numberOfDays}</b>
                        </span>
                      </div>
                      <div
                        className="col-3"
                        style={{ borderLeft: "1px dotted grey" }}
                      >
                        <img
                          style={{
                            display:
                              item.status === "Approved" ? "block" : "none",
                            mixBlendMode: "multiply",
                          }}
                          src={ApprovedImg}
                          className="img-fluid"
                        />

                        <img
                          style={{
                            display:
                              item.status === "Pending" ? "block" : "none",
                            mixBlendMode: "multiply",
                          }}
                          src={PendingImg}
                          className="img-fluid"
                        />

                        <img
                          style={{
                            display:
                              item.status === "Rejected" ? "block" : "none",
                            mixBlendMode: "multiply",
                          }}
                          src={RejectImg}
                          className="img-fluid"
                        />
                        <p
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            marginTop: "5px",
                            textAlign: "center",
                            color:
                              item.status === "Pending"
                                ? "orange"
                                : item.status === "Approved"
                                ? "green"
                                : "red",
                          }}
                        >
                          {item.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div>
              <p style={{ textAlign: "center", color: "red" }}>No data found</p>
            </div>
          )}
        </div>
        <br /> <br /> <br />
      </main>
    </>
  );
}

export default Leave;
