import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase-config";
import GoToTop from "../../GoToTop";
import AttendanceIcon from "../Img/attendance.gif";
import Imp from "../Img/alert.gif";
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
  const [attend, setAttend] = useState([]);

  useEffect(() => {
    // Fetch data from Firestore
    const fetchData = async () => {
      try {
        const querySnapshot = await db
          .collection("MembersAttendance")
          .doc(userId)
          .collection("Attendance")
          .onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data());
            setAttend(data);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error appropriately
      }
    };

    fetchData();
  }, [userId]);


  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const currentMonthYear = `${month}${year}`;
 
  const currentDay = currentDate.getDate();

  


  let monthcount;

  if (currentMonthYear == "January2024" && currentDay <=15) {
    monthcount = 1;
  }else if (currentMonthYear == "January2024" && currentDay >=16) {
    monthcount = 2;
  } else if (currentMonthYear == "February2024" && currentDay <=15) {
    monthcount = 3;
  }else if (currentMonthYear == "February2024" && currentDay >=16) {
    monthcount = 4;
  } else if (currentMonthYear == "March2024" && currentDay <=15) {
    monthcount = 5;
  }else if (currentMonthYear == "March2024" && currentDay >=16) {
    monthcount = 6;
  }else if (currentMonthYear == "April2024" && currentDay <=15) {
    monthcount = 7;
  }else if (currentMonthYear == "April2024" && currentDay >=16) {
    monthcount = 8;
  }else if (currentMonthYear == "May2024" && currentDay <=15) {
    monthcount = 9;
  }else if (currentMonthYear == "May2024" && currentDay >=16) {
    monthcount = 10;
  }else if (currentMonthYear == "June2024" && currentDay <=15) {
    monthcount = 11;
  }else if (currentMonthYear == "June2024" && currentDay >=16) {
    monthcount = 12;
  }
  else if (currentMonthYear == "July2024" && currentDay <=15) {
    monthcount = 13;
  }else if (currentMonthYear == "July2024" && currentDay >=16) {
    monthcount = 14;
  } else if (currentMonthYear == "August2024" && currentDay <=15) {
    monthcount = 15;
  }else if (currentMonthYear == "August2024" && currentDay >=16) {
    monthcount = 16;
  }else if (currentMonthYear == "September2024" && currentDay <=15) {
    monthcount = 17;
  }else if (currentMonthYear == "September2024" && currentDay >=16) {
    monthcount = 18;
  }else if (currentMonthYear == "October2024" && currentDay <=15) {
    monthcount = 19;
  }else if (currentMonthYear == "October2024" && currentDay >=16) {
    monthcount = 20;
  }else if (currentMonthYear == "November2024" && currentDay <=15) {
    monthcount = 21;
  }else if (currentMonthYear == "November2024" && currentDay >=16) {
    monthcount = 22;
  }else if (currentMonthYear == "December2024" && currentDay <=15) {
    monthcount = 23;
  }else if (currentMonthYear == "December2024" && currentDay >=16) {
    monthcount = 24;
  }


  const [atten, setAtten] = useState({
    data: [],
    presentDocs: 0,
    totalDocs: 0,
    percentage: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await db
          .collection("MembersAttendance")
          .doc(userId)
          .collection("Attendance")
          .onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data());

            const presentDocs = data.filter(
              (doc) => doc.status === "Present"
            ).length;
            const totalDocs = data.length;
            const percentage = (presentDocs / monthcount) * 100;

            setAtten({
              data,
              presentDocs,
              totalDocs,
              percentage,
            });
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error appropriately
      }
    };

    fetchData();
  }, [userId]);

  // const { Jan23a, Jan23b } = atten;

  // const A = calculatePercentage(Jan23a);
  // const B = calculatePercentage(Jan23b);

  // const overallPercentage = ((A + B) / 2).toFixed(2);

  let fontColor;
  if (atten.percentage > 80.0) {
    fontColor = "green";
  } else if (atten.percentage >= 60.0 && atten.percentage <= 79.0) {
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
          <h5 class="card-title">Attendance Updates</h5>
        </div>
        <div className="container-fluid">
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
                       {atten.percentage}% 
                  
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

                    {/* <span style={{ fontWeight: "bold", marginTop: "-5px" }}>
                      {atten.percentage >= 60 ? (
                        <i style={{ color: "green", fontSize: "11px" }}>
                          (You are eligible for certification)
                        </i>
                      ) : (
                        <i style={{ color: "red", fontSize: "11px" }}>
                          (You are not eligible for certification)
                        </i>
                      )}
                    </span> */}
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
                  marginBottom: "25px",
                  padding: "10px",
                  backgroundColor: "#FFE7D9",
                }}
              >
                <p>
                  {" "}
                  <img
                    src={Imp}
                    className="img-fluid"
                    style={{ height: "20px", mixBlendMode: "multiply" }}
                  />{" "}
                  Minimum of 60% percentage is required
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid" id="pcview" style={{ padding: "0px" }}>
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
                <th scope="col" style={{ textAlign: "center" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {attend.length > 0 ? (
                <>
                  {attend.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <b>{item.month}</b>
                      </td>
                      <td>{item.slot}</td>
                      <td style={{ maxWidth: "40vh" }}>{item.desc}</td>
                      <td
                        style={{
                          color: item.status === "Present" ? "green" : "red",
                          textAlign: "center",
                        }}
                      >
                        <b>{item.status}</b>
                      </td>

                      <td
                        onClick={() =>
                          navigate(`/attendance_details/${item.id}`)
                        }
                        style={{
                          cursor: "pointer",
                          color: item.status === "Present" ? "green" : "red",
                          textAlign: "center",
                        }}
                      >
                        <i class="fa fa-eye"></i>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  <p style={{ textAlign: "center", color: "red" }}>
                    No data found
                  </p>
                </>
              )}
            </tbody>
          </Table>
        </div>
        <div id="mobileview">
          {attend.length > 0 ? (
            <>
              {attend.map((item, index) => (
                <div
                  class="card info-card revenue-card"
                  key={item.id}
                  onClick={() => navigate(`/attendance_details/${item.id}`)}
                  style={{
                    marginTop: "-9px",
                    backgroundColor:
                      item.status === "Present" ? "#e1f1fa" : "#FFE7D9",
                  }}
                >
                  <div class="card-body">
                    <div className="row">
                      <div className="col-9">
                        <b style={{ fontSize: "12px", color: "#000" }}>
                          {item.slot}
                        </b>
                      </div>
                      <div
                        className="col-3"
                        style={{
                          borderLeft: "1px dotted grey",
                          textAlign: "center",
                        }}
                      >
                        <b
                          style={{
                            fontSize: "12px",
                            color: item.status === "Present" ? "green" : "red",
                          }}
                        >
                          {item.status}
                        </b>
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
        <br /> <br />
      </main>
    </>
  );
}

export default AttenUpdates;
