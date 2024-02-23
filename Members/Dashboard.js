import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db, auth } from "../firebase-config";
import { Table } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import "./Loader.css";
import GoToTop from "../GoToTop";
import MembersCount from "../Auth/MembersCount";
import Check from "./Img/check-mark.png";
import Warn from "./Img/warning.png";
import Memberss from "./Img/student.gif";
import File from "./Img/file.gif";
import Tedx from "./ted.png";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
function Dashboard() {
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

  //////////////////////////////////
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const currentTime = new Date().getHours();

    if (currentTime >= 3 && currentTime < 12) {
      setGreeting("Good Morning");
    } else if (currentTime >= 12 && currentTime < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  /////////////////////////////////

  const [atten, setAtten] = useState([]);
  useEffect(() => {
    // Fetch data from Firestore
    const fetchData = async () => {
      try {
        const querySnapshot = await db
          .collection("MembersAttendance")
          .doc(userId)
          .collection("Attendance").orderBy("posted", "desc").limit(2)
          .onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data());
            setAtten(data);
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

  const currentMonth = `${month} ${year}`;

  ///////////////////Current Location

  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    // Get the current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          // Use Google Maps Geocoding API to get the location name
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDoiXHxMG_vZPHz0eeJj5s661xhfU-Y4_4`
          );

          if (response.ok) {
            const data = await response.json();
            const firstResult = data.results[0];
            const formattedAddress = firstResult.formatted_address;
            setLocationName(formattedAddress);
          } else {
            console.error("Error fetching location name:", response.statusText);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
    }
  }, []);
  ///////////////////Current Location

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
          <p
            style={{
              fontSize: "20px",
              color: "#1F88BE",
              fontWeight: "bold",
            }}
          >
            {greeting}, {userData.name.split(" ")[0]}!
          </p>
          <p style={{ color: "grey", marginTop: "-2.5vh", fontSize: "12px" }}>
            We're thrilled to see you again. Your dashboard is ready to go!
          </p>
        </div>
        <div
          className="card"
          style={{
            fontSize: "11px",
            backgroundColor: "white",
            padding: "15px",
            maxWidth: "70vh",
          }}
        >
          <div className="row">
            <div className="col-2" style={{ width: "38px" }}>
              <i
                class="fa fa-map-marker"
                style={{ color: "red", fontSize: "37px" }}
              ></i>{" "}
            </div>
            <div className="col-10">{locationName}</div>
          </div>
        </div>
        <section class="section dashboard">
          <div className="row"></div>

          <div class="row my-2">
            <div class="col-lg-8">
              <div class="card">
                <div class="card-body pb-0">
                  <h5 class="card-title">
                    <i class="fa fa-bell" aria-hidden="true"></i> Notifications
                  </h5>

                  <div class="news" style={{ fontSize: "12px" }}>
                    <div>
                      <ul>
                        {/* <li>
                          Apply for WWW T-shirt.{" "}
                          <Link to="/tshirt_">Click here</Link>
                        </li> */}
                    
                    <p>No Notifications</p>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <Link to="/www_members_">
                <div class="card info-card revenue-card">
                  <div class="card-body" style={{ paddingTop: "0px" }}>
                    <div
                      class="d-flex align-items-center"
                      style={{ marginBottom: "-22px" }}
                    >
                      <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <img src={Memberss} class="img-fluid " alt="..." />
                      </div>
                      <div class="ps-3 my-3">
                        <h6>
                          <MembersCount />
                        </h6>
                        <span class="text-success small pt-1 fw-bold">
                          Active Members
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div class="col-12">
            <div class="card top-selling overflow-auto">
              <div class="card-body pb-0">
                <h5 class="card-title">Attendance of {currentMonth}</h5>
                <div id="pcview">
            
                  <Table
                    responsive
                    hover
                    striped
                    bordered
                    size="sm"
                    style={{ fontSize: "12px" }}
                  >
                    <thead
                      style={{ backgroundColor: "#1f88be", color: "#fff" }}
                    >
                      <tr>
                        <th scope="col">Month</th>
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
              {atten.length > 0 ? (
                <>
                  {atten.map((item, index) => (
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
                    {/* <tbody style={{ fontSize: "12px" }}>
                      <tr>
                        <td style={{ minWidth: "14vh" }}>
                          <b>{currentMonth}</b>
                        </td>
                        <td style={{ minWidth: "29vh" }}>
                          15th {currentMonth} - 30th {currentMonth}
                        </td>

                        <td style={{ minWidth: "20vh" }}>
                          {atten[currentMonthYear + "BDesc"]}
                        </td>
                        <td
                          style={{
                            minWidth: "13vh",
                            textAlign: "center",
                            color: "green",
                          }}
                        >
                          <b>{atten[currentMonthYear + "B"]}</b>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ minWidth: "14vh" }}>
                          <b>{currentMonth}</b>
                        </td>
                        <td style={{ minWidth: "22vh" }}>
                          1st {currentMonth} - 15th {currentMonth}
                        </td>

                        <td style={{ minWidth: "29vh" }}>
                          {atten[currentMonthYear + "ADesc"]}
                        </td>
                        <td
                          style={{
                            minWidth: "13vh",
                            textAlign: "center",
                            color: "green",
                          }}
                        >
                          <b>{atten[currentMonthYear + "A"]}</b>
                        </td>
                      </tr>
                    </tbody> */}
                  </Table>
                </div>

                <div id="mobileview">

                {atten.length > 0 ? (
                <>
                  {atten.map((item, index) => (
                  
                     <div key={index}  onClick={() => navigate(`/attendance_details/${item.id}`)}
                    class="card"
                    style={{
                      backgroundColor:
                        item.status === "Present"
                          ? "#E9FCD4"
                          : "#FFE7D9",
                    }}
                  >
                    <div class="card-body pb-0">
                      <div className="row">
                        <div className="col-3">
                          <img
                            style={{
                              display:
                              item.status === "Present"
                                  ? "block"
                                  : "none",
                            }}
                            src={Check}
                            className="img-fluid"
                            alt=""
                          />

                          <img
                            style={{
                              display:
                              item.status === "Present"
                                  ? "none"
                                  : "block",
                            }}
                            src={Warn}
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                        <div className="col-9">
                          <h5
                            style={{
                              color:
                              item.status === "Present"
                                  ? "#00AB55"
                                  : "#FF4842",
                            }}
                          >
                           {item.slot}
                          </h5>
                          <p
                            style={{
                              fontSize: "12px",
                              backgroundColor:
                              item.status === "Present"
                                  ? "#00AB55"
                                  : "#FF4842",
                              color: "white",
                              marginTop: "-5px",
                              marginBottom: "7px",
                              padding: "3px 3px 3px 10px",
                              width: "10vh",
                              borderRadius: "4px",
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
                <>
                  <p style={{ textAlign: "center", color: "red" }}>
                    No data found
                  </p>
                  </>
              )}
                    


               
                
                  <Link
                    to="/attendance_"
                    style={{ textAlign: "center" }}
                  >
                    <Button color="primary">View attendance</Button>
                  </Link>
                  <br /> <br />
                </div>
              </div>
            </div>
          </div>

          <div id="mobileview">
            <Link to="/myfiles_">
              <div class="card info-card revenue-card">
                <div class="card-body" style={{ paddingTop: "0px" }}>
                  <div
                    class="d-flex align-items-center"
                    style={{ marginBottom: "-22px" }}
                  >
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <img src={File} class="img-fluid " alt="..." />
                    </div>
                    <div class="ps-3 my-3">
                      <h6 style={{ fontSize: "19px" }}>My Documents</h6>
                      <span class="text-secondary small pt-1 fw-bold">
                        Agreement/ID card/Certificates
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div
            style={{
              position: "fixed",
              right: "-35px",
              bottom: "13vh",
              display: userData.tedx === "Active" ? "block" : "none",
            }}
          >
            <Link to="/tedx">
              <img
                src={Tedx}
                style={{ width: "15vh", transform: "rotate(-90deg)" }}
                className="img-fluid"
              />
            </Link>
          </div>
        </section>
        <br></br> <br></br>
      </main>
    </>
  );
}

export default Dashboard;
