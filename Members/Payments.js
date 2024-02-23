import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase-config";
import "./Loader.css";
import GoToTop from "../GoToTop";
import { Table } from "react-bootstrap";

import Money from "./Img/wallet.gif";
function Payments() {
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

  const [payments, setPayments] = useState([]);
  useEffect(() => {
    if (userId) {
      const unsubscribe = db
        .collection("members")
        .doc(userId)
        .onSnapshot(
          (snapshot) => {
            const userData = snapshot.data();
            setPayments(userData);
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

  const tPayment = {
    a1: payments.a1,
    a2: payments.a2,
    a3: payments.a3,
    a4: payments.a4,
    a5: payments.a5,
    a6: payments.a6,
  };

  const totalPayment = Object.values(tPayment).reduce(
    (sum, value) => sum + parseFloat(value) || 0,
    0
  );

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
          <h5 class="card-title">Payment History</h5>
        </div>

        <div className="container-fluid" style={{ padding: "0px" }}>
          <div className="row">
            <div className="col-lg-4">
              <div
                class="card info-card revenue-card"
                style={{ backgroundColor: "#e1f1fa" }}
              >
                <div class="card-body" style={{ paddingTop: "0px" }}>
                  <div
                    class="d-flex align-items-center"
                    style={{ marginBottom: "-8px" }}
                  >
                    <div className="row">
                      <div class="col-4">
                        <img
                          src={Money}
                          class="img-fluid"
                          alt="..."
                          style={{
                            height: "auto",
                            width: "24vh",
                            mixBlendMode: "multiply",
                          }}
                        />
                      </div>
                      <div class="col-8 ps-3 my-3">
                        <h6
                          style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          ₹{totalPayment}.00
                        </h6>
                        <span class="text-secondary small">
                          Total contribution
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row" id="mobileview">
            {!payments.i1 ? (
              <></>
            ) : (
              <>
                <div className="col-lg-4">
                  <div class="card info-card revenue-card">
                    <div class="card-body">
                      <div className="row">
                        <div className="col-9">
                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Invoice {payments.i1}
                          </span>

                          <h4 style={{ margin: "0px 0 1px" }}>{payments.p1}</h4>

                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Date: {payments.d1}
                          </span>
                        </div>
                        <div
                          className="col-3"
                          style={{ borderLeft: "1px dotted grey" }}
                        >
                          <h3 style={{ marginTop: "20px", color: "#FF4842" }}>
                            ₹{payments.a1}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!payments.i2 ? (
              <></>
            ) : (
              <>
                <div className="col-lg-4">
                  <div class="card info-card revenue-card">
                    <div class="card-body">
                      <div className="row">
                        <div className="col-9">
                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Invoice {payments.i2}
                          </span>

                          <h4 style={{ margin: "0px 0 1px" }}>{payments.p2}</h4>

                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Date: {payments.d2}
                          </span>
                        </div>
                        <div
                          className="col-3"
                          style={{ borderLeft: "1px dotted grey" }}
                        >
                          <h3 style={{ marginTop: "20px", color: "#FF4842" }}>
                            ₹{payments.a2}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!payments.i3 ? (
              <></>
            ) : (
              <>
                <div className="col-lg-4">
                  <div class="card info-card revenue-card">
                    <div class="card-body">
                      <div className="row">
                        <div className="col-9">
                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Invoice {payments.i3}
                          </span>

                          <h4 style={{ margin: "0px 0 1px" }}>{payments.p3}</h4>

                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Date: {payments.d3}
                          </span>
                        </div>
                        <div
                          className="col-3"
                          style={{ borderLeft: "1px dotted grey" }}
                        >
                          <h3 style={{ marginTop: "20px", color: "#FF4842" }}>
                            ₹{payments.a3}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!payments.i4 ? (
              <></>
            ) : (
              <>
                <div className="col-lg-4">
                  <div class="card info-card revenue-card">
                    <div class="card-body">
                      <div className="row">
                        <div className="col-9">
                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Invoice {payments.i4}
                          </span>

                          <h4 style={{ margin: "0px 0 1px" }}>{payments.p4}</h4>

                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Date: {payments.d4}
                          </span>
                        </div>
                        <div
                          className="col-3"
                          style={{ borderLeft: "1px dotted grey" }}
                        >
                          <h3 style={{ marginTop: "20px", color: "#FF4842" }}>
                            ₹{payments.a4}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!payments.i5 ? (
              <></>
            ) : (
              <>
                <div className="col-lg-4">
                  <div class="card info-card revenue-card">
                    <div class="card-body">
                      <div className="row">
                        <div className="col-9">
                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Invoice {payments.i5}
                          </span>

                          <h4 style={{ margin: "0px 0 1px" }}>{payments.p5}</h4>

                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Date: {payments.d5}
                          </span>
                        </div>
                        <div
                          className="col-3"
                          style={{ borderLeft: "1px dotted grey" }}
                        >
                          <h3 style={{ marginTop: "20px", color: "#FF4842" }}>
                            ₹{payments.a5}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!payments.i6 ? (
              <></>
            ) : (
              <>
                <div className="col-lg-4">
                  <div class="card info-card revenue-card">
                    <div class="card-body">
                      <div className="row">
                        <div className="col-9">
                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Invoice {payments.i6}
                          </span>

                          <h4 style={{ margin: "0px 0 1px" }}>{payments.p6}</h4>

                          <span style={{ fontSize: "12px", color: "grey" }}>
                            Date: {payments.d6}
                          </span>
                        </div>
                        <div
                          className="col-3"
                          style={{ borderLeft: "1px dotted grey" }}
                        >
                          <h3 style={{ marginTop: "20px", color: "#FF4842" }}>
                            ₹{payments.a6}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div class="card mb-3" id="pcview">
            <Table responsive hover striped bordered size="sm">
              <thead style={{ backgroundColor: "#1f88be", color: "#fff" }}>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Invoice No.</th>
                  <th scope="col">Purpose</th>
                  <th scope="col">Date</th>
                  <th scope="col">Amount</th>
                  <th scope="col" style={{ textAlign: "center" }}>
                    Refund
                  </th>
                  <th scope="col" style={{ textAlign: "center" }}>
                    Refund Date
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "12px" }}>
                {!payments.i1 ? (
                  <></>
                ) : (
                  <>
                    <tr>
                      <td style={{ minWidth: "3vh" }}>
                        <b>1</b>
                      </td>
                      <td style={{ minWidth: "14vh" }}>{payments.i1}</td>
                      <td style={{ minWidth: "28vh" }}>{payments.p1}</td>

                      <td style={{ minWidth: "15vh" }}>{payments.d1}</td>
                      <td
                        style={{
                          minWidth: "15vh",

                          fontWeight: "bold",
                        }}
                      >
                        ₹ {payments.a1}.00
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.r1 ? <p>--</p> : <>{payments.r1}</>}
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.rd1 ? <p>--</p> : <>{payments.rd1}</>}
                      </td>
                    </tr>
                  </>
                )}

                {!payments.i2 ? (
                  <></>
                ) : (
                  <>
                    <tr>
                      <td style={{ minWidth: "3vh" }}>
                        <b>2</b>
                      </td>
                      <td style={{ minWidth: "14vh" }}>{payments.i2}</td>
                      <td style={{ minWidth: "28vh" }}>{payments.p2}</td>

                      <td style={{ minWidth: "15vh" }}>{payments.d2}</td>
                      <td
                        style={{
                          minWidth: "15vh",

                          fontWeight: "bold",
                        }}
                      >
                        ₹ {payments.a2}.00
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.r2 ? <p>--</p> : <>{payments.r2}</>}
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.rd2 ? <p>--</p> : <>{payments.rd2}</>}
                      </td>
                    </tr>
                  </>
                )}

                {!payments.i3 ? (
                  <></>
                ) : (
                  <>
                    <tr>
                      <td style={{ minWidth: "3vh" }}>
                        <b>3</b>
                      </td>
                      <td style={{ minWidth: "14vh" }}>{payments.i3}</td>
                      <td style={{ minWidth: "28vh" }}>{payments.p3}</td>

                      <td style={{ minWidth: "15vh" }}>{payments.d3}</td>
                      <td
                        style={{
                          minWidth: "15vh",

                          fontWeight: "bold",
                        }}
                      >
                        ₹ {payments.a3}.00
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.r3 ? <p>--</p> : <>{payments.r3}</>}
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.rd3 ? <p>--</p> : <>{payments.rd3}</>}
                      </td>
                    </tr>
                  </>
                )}

                {!payments.i4 ? (
                  <></>
                ) : (
                  <>
                    <tr>
                      <td style={{ minWidth: "3vh" }}>
                        <b>4</b>
                      </td>
                      <td style={{ minWidth: "14vh" }}>{payments.i4}</td>
                      <td style={{ minWidth: "28vh" }}>{payments.p4}</td>

                      <td style={{ minWidth: "15vh" }}>{payments.d4}</td>
                      <td
                        style={{
                          minWidth: "15vh",

                          fontWeight: "bold",
                        }}
                      >
                        ₹ {payments.a4}.00
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.r4 ? <p>--</p> : <>{payments.r4}</>}
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.rd4 ? <p>--</p> : <>{payments.rd4}</>}
                      </td>
                    </tr>
                  </>
                )}

                {!payments.i5 ? (
                  <></>
                ) : (
                  <>
                    <tr>
                      <td style={{ minWidth: "3vh" }}>
                        <b>5</b>
                      </td>
                      <td style={{ minWidth: "14vh" }}>{payments.i5}</td>
                      <td style={{ minWidth: "28vh" }}>{payments.p5}</td>

                      <td style={{ minWidth: "15vh" }}>{payments.d5}</td>
                      <td
                        style={{
                          minWidth: "15vh",

                          fontWeight: "bold",
                        }}
                      >
                        ₹ {payments.a5}.00
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.r5 ? <p>--</p> : <>{payments.r5}</>}
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.rd5 ? <p>--</p> : <>{payments.rd5}</>}
                      </td>
                    </tr>
                  </>
                )}

                {!payments.i6 ? (
                  <></>
                ) : (
                  <>
                    <tr>
                      <td style={{ minWidth: "3vh" }}>
                        <b>6</b>
                      </td>
                      <td style={{ minWidth: "14vh" }}>{payments.i6}</td>
                      <td style={{ minWidth: "28vh" }}>{payments.p6}</td>

                      <td style={{ minWidth: "15vh" }}>{payments.d6}</td>
                      <td
                        style={{
                          minWidth: "15vh",

                          fontWeight: "bold",
                        }}
                      >
                        ₹ {payments.a6}.00
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.r6 ? <p>--</p> : <>{payments.r6}</>}
                      </td>
                      <td style={{ minWidth: "20vh", textAlign: "center" }}>
                        {!payments.rd6 ? <p>--</p> : <>{payments.rd6}</>}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </main>
    </>
  );
}

export default Payments;
