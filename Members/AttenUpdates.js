import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase-config";
import GoToTop from "../GoToTop";
import AttendanceIcon from "./Img/attendance.gif";
import Imp from "./Img/alert.gif";
const calculatePercentage = (status) => {
  return status === "Present" ? 100 : 0;
};

function AttenUpdates() {
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
  const [atten, setAtten] = useState([]);
  useEffect(() => {
    if (userId) {
      const unsubscribe = db
        .collection("attendance")
        .doc(userId)
        .onSnapshot(
          (snapshot) => {
            const userData = snapshot.data();
            setAtten(userData);
          },
          (error) => {
            console.error("Error fetching user data:", error);
          }
        );

      // Unsubscribe from the snapshot listener when the component unmounts
      return () => unsubscribe();
    } else {
      console.error("User ID is missing or invalid");
    }
  }, [userId]);

  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const currentMonthYear = `${month}${year}`;

  const {
    Jan23a,
    Jan23b,
    Feb23a,
    Feb23b,
    Mar23a,
    Mar23b,
    Apr23a,
    Apr23b,
    May23a,
    May23b,
    June2023A,
    June2023B,
    July2023A,
    July2023B,
    August2023A,
    August2023B,
    September2023A,
    September2023B,
    October2023A,
    October2023B,
    November2023A,
    November2023B,
    December2023A,
    December2023B,
  } = atten;

  const A = calculatePercentage(Jan23a);
  const B = calculatePercentage(Jan23b);
  const C = calculatePercentage(Feb23a);
  const D = calculatePercentage(Feb23b);
  const E = calculatePercentage(Mar23a);
  const F = calculatePercentage(Mar23b);
  const G = calculatePercentage(Apr23a);
  const H = calculatePercentage(Apr23b);
  const I = calculatePercentage(May23a);
  const J = calculatePercentage(May23b);
  const K = calculatePercentage(June2023A);
  const L = calculatePercentage(June2023B);
  const M = calculatePercentage(July2023A);
  const N = calculatePercentage(July2023B);
  const O = calculatePercentage(August2023A);
  const P = calculatePercentage(August2023B);
  const Q = calculatePercentage(September2023A);
  const R = calculatePercentage(September2023B);
  const S = calculatePercentage(October2023A);
  const T = calculatePercentage(October2023B);
  const U = calculatePercentage(November2023A);
  const V = calculatePercentage(November2023B);
  const W = calculatePercentage(December2023A);
  const X = calculatePercentage(December2023B);

  const overallPercentage = (
    (A +
      B +
      C +
      D +
      E +
      F +
      G +
      H +
      I +
      J +
      K +
      L +
      M +
      N +
      O +
      P +
      Q +
      R +
      S +
      T +
      U +
      V +
      W +
      X) /
    24
  ).toFixed(2);

  let fontColor;
  if (overallPercentage > 80.0) {
    fontColor = "green";
  } else if (overallPercentage >= 60.0 && overallPercentage <= 79.0) {
    fontColor = "orange";
  } else {
    fontColor = "red";
  }

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
          <h5 class="card-title">Attendance Updates -2023</h5>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="card" style={{ padding: "15px" }}>
                <div className="row">
                  <div className="col-3">
                    <img src={AttendanceIcon} class="img-fluid" alt="..." />
                  </div>

                  <div className="col-9">
                    <h3
                      style={{
                        color: fontColor,
                        fontSize: "16px",
                        marginTop: "2px",
                      }}
                    >
                      {overallPercentage}%
                      <p
                        style={{
                          fontSize: "10px",
                          color: "grey",
                          fontWeight: "normal",
                          marginTop: "0px",
                        }}
                      >
                        Attendance Percentage{" "}
                      </p>
                    </h3>

                    <span style={{ fontWeight: "bold", marginTop: "-5px" }}>
                      {overallPercentage >= 60 ? (
                        <i style={{ color: "green", fontSize: "11px" }}>
                          (You are eligible for certification)
                        </i>
                      ) : (
                        <i style={{ color: "red", fontSize: "11px" }}>
                          (You are not eligible for certification)
                        </i>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div
                className="card"
                style={{
                  color: "red",
                  fontSize: "12px",

                  padding: "10px",
                }}
              >
                <p>
                  {" "}
                  <img
                    src={Imp}
                    className="img-fluid"
                    style={{ height: "20px" }}
                  />{" "}
                  Minimum of 60% percentage is required
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid" style={{ padding: "0px" }}>
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
                <th scope="col">Month/Year</th>
                <th scope="col">Week</th>
                <th scope="col">Description</th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {atten.Jan23a !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>January 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st January 2023 - 15th January 2023
                    </td>

                    <td
                      style={{
                        minWidth: "20vh",
                      }}
                    >
                      {atten.Jan23af}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.Jan23a === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.Jan23a}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.Jan23b !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>January 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th January 2023 - 30th January 2023
                    </td>

                    <td
                      style={{
                        minWidth: "20vh",
                      }}
                    >
                      {atten.Jan23bf}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.Jan23b === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.Jan23b}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.Feb23a !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>February 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st February 2023 - 15th February 2023
                    </td>

                    <td
                      style={{
                        minWidth: "20vh",
                        color: "green",
                      }}
                    >
                      <b>{atten.Feb23af}</b>
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.Feb23a === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.Feb23a}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.Feb23b !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>February 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th February 2023 - 28th February 2023
                    </td>

                    <td
                      style={{
                        minWidth: "20vh",
                        color: "green",
                      }}
                    >
                      <b>{atten.Feb23bf}</b>
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.Feb23b === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.Feb23b}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.Mar23a !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>March 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st March 2023 - 15th March 2023
                    </td>

                    <td
                      style={{
                        minWidth: "20vh",
                      }}
                    >
                      {atten.Mar23af}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.Mar23a === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.Mar23a}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.Mar23b !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>March 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th March 2023 - 30th March 2023
                    </td>

                    <td
                      style={{
                        minWidth: "20vh",
                        color: "green",
                      }}
                    >
                      <b>{atten.Mar23bf}</b>
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.Mar23b === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.Mar23b}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.Apr23a !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>April 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st April 2023 - 15th April 2023
                    </td>

                    <td
                      style={{
                        minWidth: "20vh",
                      }}
                    >
                      {atten.Apr23af}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.Apr23a === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.Apr23a}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.Apr23b !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>April 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th April 2023 - 30th April 2023
                    </td>

                    <td
                      style={{
                        minWidth: "20vh",
                      }}
                    >
                      {atten.Apr23bf}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.Apr23b === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.Apr23b}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.May23a !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>May 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st May 2023 - 15th May 2023
                    </td>

                    <td
                      style={{
                        minWidth: "20vh",
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      {atten.May23af}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.May23a === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.May23a}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.May23b !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>May 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th May 2023 - 30th May 2023
                    </td>

                    <td
                      style={{
                        minWidth: "20vh",
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      {atten.May23bf}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.May23b === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.May23b}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.June2023A !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>June 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st June 2023 - 15th June 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>{atten.June2023ADesc}</td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.June2023A === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.June2023A}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.June2023B !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>June 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th June 2023 - 30th June 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>{atten.June2023BDesc}</td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.June2023B === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.June2023B}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.July2023A !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>July 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st July 2023 - 15th July 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>{atten.July2023ADesc}</td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.July2023A === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.July2023A}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.July2023B !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>July 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th July 2023 - 30th July 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>{atten.July2023BDesc}</td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color: atten.July2023B === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.July2023B}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.August2023A !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>August 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st August 2023 - 15th August 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>
                      {atten.August2023ADesc}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color:
                          atten.August2023A === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.August2023A}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.August2023B !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>August 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th August 2023 - 30th August 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>
                      {atten.August2023BDesc}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color:
                          atten.August2023B === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.August2023B}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.September2023A !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>September 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st September 2023 - 15th September 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>
                      {atten.September2023ADesc}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color:
                          atten.September2023A === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.September2023A}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.September2023B !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>September 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th September 2023 - 30th September 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>
                      {atten.September2023BDesc}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color:
                          atten.September2023B === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.September2023B}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.October2023A !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>October 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st October 2023 - 15th October 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>
                      {atten.October2023ADesc}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color:
                          atten.October2023A === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.October2023A}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.October2023B !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>October 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th October 2023 - 30th October 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>
                      {atten.October2023BDesc}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color:
                          atten.October2023B === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.October2023B}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.November2023A !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>November 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st November 2023 - 15th November 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>
                      {atten.November2023ADesc}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color:
                          atten.November2023A === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.November2023A}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.November2023B !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>November 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th November 2023 - 30th November 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>
                      {atten.November2023BDesc}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color:
                          atten.November2023B === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.November2023B}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.December2023A !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>December 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      1st December 2023 - 15th December 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>
                      {atten.December2023ADesc}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color:
                          atten.December2023A === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.December2023A}</b>
                    </td>
                  </tr>
                </>
              ) : null}

              {atten.December2023B !== undefined ? (
                <>
                  <tr>
                    <td style={{ minWidth: "14vh" }}>
                      <b>December 2023</b>
                    </td>
                    <td style={{ minWidth: "29vh" }}>
                      15th December 2023 - 30th December 2023
                    </td>

                    <td style={{ minWidth: "20vh" }}>
                      {atten.December2023BDesc}
                    </td>
                    <td
                      style={{
                        minWidth: "12vh",
                        textAlign: "center",
                        color:
                          atten.December2023B === "Present" ? "green" : "red",
                      }}
                    >
                      <b>{atten.December2023B}</b>
                    </td>
                  </tr>
                </>
              ) : null}
            </tbody>
          </Table>
        </div>
        <br /> <br />
      </main>
    </>
  );
}

export default AttenUpdates;
