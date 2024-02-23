import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase-config";

import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState("");
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
  return (
    <div>
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link className="nav-link collapsed" to="/home_dashboard">
              <i className="fa fa-home"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link collapsed" to="/www_members_">
              <i className="fa fa-users"></i>
              <span>Members</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link collapsed" to="/attendance_">
              <i className="fa fa-calendar"></i>
              <span>Attendance</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link collapsed" to="/user_leave">
              <i className="fa fa-paper-plane"></i>
              <span>Leave Requests</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link collapsed" to="/payments_">
              <i className="fa fa-usd"></i>
              <span>Payments</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link collapsed" to="/events_">
              <i className="fa fa-calendar-check-o"></i>
              <span>Offline Events</span>
            </Link>
          </li>

          <li
            className="nav-item"
            style={{
              marginTop: "1vh",
              borderRadius: "5px",
              backgroundColor: "#fff",
              color: "white",
              display: userData.tedx === "Active" ? "block" : "none",
            }}
          >
            <Link
              className="nav-link collapsed"
              style={{ border: "1px solid red" }}
              to="/tedx"
            >
              <span style={{ color: "red" }}>TEDx</span>
            </Link>
          </li>

          <li
            className="nav-item"
            style={{
              marginTop: "1vh",
              borderRadius: "5px",
              backgroundColor: "#ff7a7a",
              color: "white",
            }}
          >
            <Link
              className="nav-link collapsed"
              style={{ backgroundColor: "#1f88be" }}
              to="/myfiles_"
            >
              <i
                style={{ color: "white" }}
                class="fa fa-file-text"
                aria-hidden="true"
              ></i>
              <span style={{ color: "white" }}>My Documents</span>
            </Link>
          </li>

          <li
            className="nav-item my-5"
            style={{ position: "absolute", bottom: "-2px" }}
          >
            <div>
              <i style={{ color: "grey" }}>
                Version: <b>v2.06.04</b>
              </i>
              <p>
                Copyright <i class="fa fa-copyright" aria-hidden="true"></i>{" "}
                WakeWithWellness
              </p>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
