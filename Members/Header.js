import React, { useState, useEffect } from "react";
import { useUserAuth } from "../Auth/context/UserAuthContext";
import { useNavigate } from "react-router";
import { db, auth } from "../firebase-config";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { serverTimestamp } from "firebase/firestore";

function Header() {
  function refreshPage() {
    window.location.reload(false);
  }
  const [date, setDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isDivVisible, setIsDivVisible] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991); // Set the breakpoint according to your mobile view
    };

    handleResize(); // Set initial mobile state

    window.addEventListener("resize", handleResize); // Update mobile state on window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup the event listener
    };
  }, []);

  const handleToggleClick = () => {
    setIsDivVisible(!isDivVisible);
  };

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);

    return function cleanup() {
      clearInterval(timer);
    };
  });

  const { logOut } = useUserAuth();

  const today = new Date();
  const chattime =
    today.getHours().toString().padStart(2, "0") +
    ":" +
    today.getMinutes().toString().padStart(2, "0") +
    ":" +
    today.getSeconds().toString().padStart(2, "0");
  const current = new Date();
  const year = current.getFullYear(); // Get the current year
  const month = String(current.getMonth() + 1).padStart(2, "0"); // Get the current month (0-11) and add leading zero if needed
  const dayy = String(current.getDate()).padStart(2, "0");
  const chatdate = `${year}-${month}-${dayy}`;

  const navigate = useNavigate();
  const handleLogout = async () => {
    await db.collection("MembersLogs").doc(`${chatdate} ${chattime}`).set({
      email: userData.email,
      status: "Signed Out",

      uid: userId,
      loginAt: serverTimestamp(),
    });

    try {
      await logOut();
      navigate("/");
      refreshPage();
      return false;
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      const userDocRef = db.collection("members").doc(userId);

      const unsubscribeUser = userDocRef.onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const userData = snapshot.data();
          setUserData(userData);
        } else {
          console.log("No user document found!");
          // Handle the case when the user document doesn't exist
        }
      });

      // Clean up the subscriptions when the component unmounts or when userId changes
      return () => {
        unsubscribeUser();
      };
    }
  }, [userId]);

  const currentTime = new Date();
  const options = { month: "long", year: "numeric" };
  const currentMonthYear = currentTime.toLocaleString("default", options);
  const day = String(currentTime.getDate());
  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getSeconds()).padStart(2, "0");
  const formattedDateTime = `${day} ${currentMonthYear}; ${hours}:${minutes}:${seconds}`;
  if (!userData) {
    return <div></div>;
  }

  return (
    <>
      <header id="header" class="header fixed-top d-flex align-items-center">
        <div class="d-flex align-items-center justify-content-between">
          <a class="logo d-flex align-items-center">
            {/* <img src="assets/img/logo.png" alt="" /> */}
            <span class="d-none d-lg-block">MEMBER PORTAL</span>
            {/* <i
              style={{
                marginLeft: "-10px",
                fontSize: "19px",
                marginTop: "-2px",
              }}
              class="fa fa-bars toggle-sidebar-btn"
              onClick={handleToggleClick}
            ></i> */}
            <span
              class="d-lg-none"
              style={{ fontSize: "18px" }}
              // style={{ fontSize: "18px", marginLeft: "8px" }}
            >
              MEMBER PORTAL
            </span>
          </a>
        </div>

        <div class="search-bar">
          <form class="search-form d-flex align-items-center">
            <input
              type="text"
              readOnly
              name="query"
              value={formattedDateTime}
            />
          </form>
        </div>

        <nav class="header-nav ms-auto">
          <ul class="d-flex align-items-center">
            <li class="nav-item dropdown pe-3">
              <a
                style={{ cursor: "pointer" }}
                class="nav-link nav-profile d-flex align-items-center pe-0"
                data-bs-toggle="dropdown"
              >
                <img
                  src={userData.link}
                  alt="Profile"
                  style={{ width: "5vh", height: "5vh", objectFit: "cover" }}
                  class="rounded-circle"
                />
                <span
                  class="d-none d-md-block dropdown-toggle ps-2"
                  style={{ color: "white" }}
                >
                  {userData.name}
                </span>
              </a>

              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li class="dropdown-header" style={{ textAlign: "left" }}>
                  <h6 style={{ textTransform: "uppercase", fontSize: "14px" }}>
                    {userData.name}
                  </h6>
                  <span>{userData.regno}</span>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li>
                  <Link
                    to="/user_profile"
                    class="dropdown-item d-flex align-items-center"
                    href="users-profile.html"
                  >
                    <i class="bi bi-person"></i>
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li>
                  <Link
                    to="/mylogs"
                    class="dropdown-item d-flex align-items-center"
                  >
                    <i class="bi bi-gear"></i>
                    <span>My Logs</span>
                  </Link>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li>
                  <a
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={handleLogout}
                    class="dropdown-item d-flex align-items-center"
                  >
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>

      <div id="sidebarPc" style={{ marginLeft: "0px" }}>
        <Sidebar />
      </div>

      {isMobile && isDivVisible && (
        <div>
          <Sidebar />
        </div>
      )}
    </>
  );
}

export default Header;
