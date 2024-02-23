import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase-config";
import "./Loader.css";
import "react-calendar/dist/Calendar.css";
import GoToTop from "../GoToTop";
import ModalChat from "./Chatbox";
import { Button } from "semantic-ui-react";
import { onSnapshot } from "firebase/firestore";

function Members() {
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

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
  const [availP, setAvail] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(
      db.collection("members").orderBy("name"),
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

  const [openChat, setOpenChat] = useState(false);
  const [modalchat, setModalChat] = useState({});

  const handleChat = (item) => {
    setOpenChat(true);
    setModalChat(item);
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
        <div className="pagetitle">
          <h5 class="card-title">Members</h5>
        </div>
        <div className="row">
          {availP.map((item, index) => (
            <div class="col-lg-3" key={item.id}>
              <div class="card mb-4">
                <div class="card-body text-center">
                  <img
                    src={item.link}
                    alt="avatar"
                    class="rounded-circle img-fluid"
                    style={{
                      width: "20vh",
                      height: "22vh",
                      objectFit: "cover",
                      marginTop: "15px",
                    }}
                  />
                  <h5 class="my-2">{item.name}</h5>
                  <b
                    class="text"
                    style={{
                      color:
                        item.department === "Board Member"
                          ? "red"
                          : item.department === "Co-Founder (CFO)"
                          ? "orange"
                          : item.department === "Co-Founder (COO)"
                          ? "orange"
                          : item.department === "Co-Founder (CTO)"
                          ? "orange"
                          : "green",
                    }}
                  >
                    {item.department}
                  </b>
                  <br></br> <br></br>
                  <div class="d-flex justify-content-center mb-2">
                    <a
                      type="button"
                      style={{ backgroundColor: "#1f88be", color: "white" }}
                      class="btn"
                      href={`tel:${item.phone}`}
                    >
                      <i class="fa fa-phone"></i> Contact
                    </a>
                    <button
                      onClick={() => handleChat(item)}
                      type="button"
                      style={{ border: "1px solid #1f88be", color: "#1f88be" }}
                      class="btn ms-1"
                    >
                      Details
                    </button>
                    {/* {openChat && (
                      <ModalChat
                        open={openChat}
                        setOpen={setOpenChat}
                        // handleDelete={handleDelete}
                        {...modalchat}
                      />
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Members;
