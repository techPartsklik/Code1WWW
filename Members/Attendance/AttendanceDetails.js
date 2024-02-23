import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase-config";
import GoToTop from "../../GoToTop";
import { useNavigate, useParams } from "react-router-dom";
import PresentImg from "../Img/Present.png";
import PendingImg from "../Img/wait.gif";
import AbsentImg from "../Img/Absent.png";

function AttendanceDetails() {
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

  const { id } = useParams();
  const [leave, setLeave] = useState([]);

  useEffect(() => {
    const fetchUserData = (uid) => {
      const query = db
        .collection("MembersAttendance")
        .doc(userId)
        .collection("Attendance")
        .where("id", "==", id);

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

  const formatTimestamp = (statusPost) => {
    const date = statusPost.toDate();
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
        {leave.length > 0 ? (
          <>
            {leave.map((item, index) => (
              <div key={item.id}>
                <div className="pagetitle">
                  <h5 class="card-title">{item.slot}</h5>
                </div>

                <div class="card info-card revenue-card">
                  <div class="card-body">
                    <div className="row">
                      <div className="col-4"></div>
                      <div className="col-4">
                        <img
                          style={{
                            height: "100%",
                            display:
                              item.status === "Present" ? "block" : "none",
                            mixBlendMode: "multiply",
                          }}
                          src={PresentImg}
                          className="img-fluid"
                        />

                        <img
                          style={{
                            height: "100%",
                            display:
                              item.status === "Pending" ? "block" : "none",
                            mixBlendMode: "multiply",
                          }}
                          src={PendingImg}
                          className="img-fluid"
                        />

                        <img
                          style={{
                            height: "100%",
                            display:
                              item.status === "Absent" ? "block" : "none",
                            mixBlendMode: "multiply",
                          }}
                          src={AbsentImg}
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-4"></div>
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          marginTop: "5px",
                          textAlign: "center",
                          color:
                            item.status === "Absent"
                              ? "red"
                              : item.status === "Present"
                              ? "green"
                              : "orange",
                        }}
                      >
                        {item.status}
                      </p>
                      {/* <p
                        style={{
                          fontSize: "10px",
                          color: "grey",
                          marginTop: "-17px",
                          textAlign: "center",
                        }}
                      >
                        {item.statusPost && formatTimestamp3(item.statusPost)}
                      </p> */}
                    </div>
                  </div>
                </div>

                <div class="card info-card revenue-card">
                  <div class="card-body">
                    <div className="row">
                      <div className="col-9">
                        <span style={{ fontSize: "12px", color: "grey" }}>
                          Month: <b style={{ color: "black" }}>{item.month}</b>
                        </span>
                        <br></br>
                        <span style={{ fontSize: "12px", color: "grey" }}>
                          Slot: <b style={{ color: "black" }}>{item.slot}</b>
                        </span>
                      </div>
                      <div
                        className="col-3"
                        style={{ borderLeft: "1px dotted grey" }}
                      >
                        <h1
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            marginTop: "0px",
                            textAlign: "center",
                            color: "grey",
                          }}
                        >
                          15
                        </h1>
                        <p
                          style={{
                            color: "grey",
                            fontSize: "12px",
                            marginTop: "-15px",
                            textAlign: "center",
                          }}
                        >
                          Days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card info-card revenue-card">
                  <div class="card-body">
                    <b>Tasks:</b>
                    <br></br>
                    <p
                      style={{
                        fontSize: "11.6px",
                        color: "grey",
                        lineHeight: "16px",
                        display: item.status === "Present" ? "block" : "none",
                      }}
                    >
                      {item.desc}
                    </p>

                    <p
                      style={{
                        fontSize: "11.6px",
                        color: "grey",
                        lineHeight: "16px",
                        display: item.status === "Absent" ? "block" : "none",
                        textAlign: "center",
                      }}
                    >
                      No Task Available
                    </p>
                  </div>
                </div>

                <div
                  class="card info-card revenue-card"
                  style={{
                    display: item.status === "Present" ? "block" : "none",
                  }}
                >
                  <div class="card-body">
                    <div className="row">
                      <div className="col-9">
                        <span style={{ fontSize: "12px", color: "grey" }}>
                          Posted:{" "}
                          <b style={{ color: "red" }}>
                            {item.posted && formatTimestamp(item.posted)}{" "}
                          </b>
                        </span>
                      </div>
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
      </main>
    </>
  );
}

export default AttendanceDetails;
