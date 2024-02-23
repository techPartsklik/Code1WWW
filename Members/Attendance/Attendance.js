import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase-config";
import { Button, Form } from "semantic-ui-react";
import { Alert } from "react-bootstrap";
import { serverTimestamp } from "firebase/firestore";
import "../Loader.css";
import GoToTop from "../../GoToTop";
import AttenUpdates from "./AttenUpdates";

function Attendance() {
  const navigate = useNavigate();

  const [desc, setDesc] = useState("");
  const [loader, setLoader] = useState("");
  const [success, setsuccessLoader] = useState("");
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

  ////////////////////////
  const [isDiv1Visible, setIsDiv1Visible] = useState(true);
  const [isDiv2Visible, setIsDiv2Visible] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    // Show the first div until the 15th of the month
    if (currentDay <= 15) {
      setIsDiv1Visible(true);
    } else {
      setIsDiv1Visible(false);
    }

    // Show the second div from the 16th till the end of the month
    if (currentDay >= 16) {
      setIsDiv2Visible(true);
    } else {
      setIsDiv2Visible(false);
    }
  }, []);

  /////////////////////////////

  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const currentMonthYear = `${month}${year}`;
  const currentMonthYearr = `${month} ${year}`;
  const [imageURL, setImageURL] = useState("");
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1 to get the actual month

    // Define an array of image URLs for each month
    const imageUrlsByMonth = [
      "https://firebasestorage.googleapis.com/v0/b/volunteers-2ddcc.appspot.com/o/Months%2FJan.JPG?alt=media&token=84ffaa3d-2ff4-4706-889f-af715d571fd6",
      "https://firebasestorage.googleapis.com/v0/b/volunteers-2ddcc.appspot.com/o/Months%2FFeb.JPG?alt=media&token=edb87754-7ed1-48c2-be34-41efcfaf8784",
      "https://firebasestorage.googleapis.com/v0/b/volunteers-2ddcc.appspot.com/o/Months%2FMarch.JPG?alt=media&token=d4c822e0-be68-4c58-ab13-ebbd3d469181",
      "https://firebasestorage.googleapis.com/v0/b/volunteers-2ddcc.appspot.com/o/Months%2FApril.JPG?alt=media&token=8e15102f-48fd-46d9-a9df-8bc3b4acf3f0",
      "https://firebasestorage.googleapis.com/v0/b/volunteers-2ddcc.appspot.com/o/Months%2FMay.jpg?alt=media&token=bf734d5f-428d-4062-a192-2e62a2966b7e",
      "https://firebasestorage.googleapis.com/v0/b/volunteers-2ddcc.appspot.com/o/Months%2FJune.jpg?alt=media&token=b298b918-a46b-4ff2-b4fd-34c8cde0a0aa",
      "https://firebasestorage.googleapis.com/v0/b/volunteers-2ddcc.appspot.com/o/Months%2FJuly.JPG?alt=media&token=7edab8b0-e866-4cda-aca8-9523355f4e7d",
      "",
      "",
      "",
      "https://img.freepik.com/free-vector/flat-hello-november-background_23-2149534537.jpg?w=996&t=st=1699598018~exp=1699598618~hmac=9173a6b551ae542984f1635ae9bf7ef4763ca2c4f775728adab49902c8f56095",
      "https://img.freepik.com/free-photo/dry-autumn-leaves-floating-with-sky-background_23-2150708273.jpg?t=st=1699597954~exp=1699601554~hmac=cf7135d57d197798767fbe38b9fde776f845b5eddd2c46439abf5e27b66857ef&w=996",

      // ... and so on
    ];

    // Set the image URL based on the current month
    setImageURL(imageUrlsByMonth[currentMonth - 1]);
  }, []);

  ///////////////////////////

  const handleSubmitA = async () => {
    setLoader("Please wait...");
    setsuccessLoader("");

    try {
      db.collection("MembersAttendance")
        .doc(userId)
        .collection("Attendance")
        .doc(currentMonthYear + "A")
        .set({
          id: currentMonthYear + "A",
          desc: desc,
          status: "Present",
          slot: "1st - 15th " + currentMonthYearr,
          month: currentMonthYearr,
          posted: serverTimestamp(),
        });

      // Reset form fields and close the modal
      // Reset form fields and close the modal
      setLoader("");
      setsuccessLoader("Attendance posted successfully!");
      setDesc("");
      setTimeout(() => {
        setLoader("");
        setsuccessLoader("");
      }, 2000);
    } catch (error) {
      console.log("Error submitting:", error);
    }
  };

  const handleSubmitB = async () => {
    setLoader("Please wait...");
    setsuccessLoader("");

    try {
      db.collection("MembersAttendance")
        .doc(userId)
        .collection("Attendance")
        .doc(currentMonthYear + "B")
        .set({
          id: currentMonthYear + "B",
          desc: desc,
          status: "Present",
          slot: "16th - 30th " + currentMonthYearr,
          month: currentMonthYearr,
          posted: serverTimestamp(),
        });

      // Reset form fields and close the modal
      // Reset form fields and close the modal
      setLoader("");
      setsuccessLoader("Attendance posted successfully!");
      setDesc("");
      setTimeout(() => {
        setLoader("");
        setsuccessLoader("");
      }, 2000);
    } catch (error) {
      console.log("Error submitting:", error);
    }
  };

  /////////////////////////////////////////////////

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
          <h5 class="card-title">Attendance</h5>
        </div>

        <div className="container-fluid" style={{ padding: "0px" }}>
          {isDiv1Visible && (
            <>
              <div class="card mb-3">
                <div class="row g-0">
                  <div class="col-md-4">
                    <img
                      src={imageURL}
                      class="img-fluid rounded-start"
                      alt="..."
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body" style={{ padding: "8px" }}>
                      <h5
                        style={{
                          fontSize: "15px",
                          margin: "5px 0 10px 5px",
                          color: "black",
                        }}
                      >
                        1st {currentMonthYearr} - 15th {currentMonthYearr} 
                      
                      </h5>
                      <Form>
                        <Form.TextArea
                          placeholder="Write your tasks........"
                          rows={6}
                          onChange={(e) => setDesc(e.target.value)}
                          value={desc}
                        />
                      </Form>

                     <div className="row">
                        <div className="col-lg-2">
                          {desc && desc.length > 4 ? (
                            <>
                              <Button
                                onClick={handleSubmitA}
                                color="linkedin"
                                style={{
                                  marginTop: "5px",
                                }}
                              >
                                Post
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                disabled
                                style={{
                                  marginTop: "5px",
                                  width: "28vh",
                                }}
                                color="linkedin"
                              >
                                Post Attendance
                              </Button>
                            </>
                          )}
                        </div>
                        <div className="col-lg">
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
                        </div>
                      </div> 

                      {/* <h5 style={{ color: "red", textAlign: "center" }}>
                        Attendance will resume from 1st January 2024
                      </h5> */}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {isDiv2Visible && (
            <>
              <div class="card mb-3">
                <div class="row g-0">
                  <div class="col-md-4">
                    <img
                      src={imageURL}
                      class="img-fluid rounded-start"
                      alt="..."
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body" style={{ padding: "8px" }}>
                      <h5 class="card-title">
                       16th {currentMonthYearr} - 30th {currentMonthYearr} 
                       
                      </h5>
                      <Form>
                        <Form.TextArea
                          placeholder="Write your tasks........"
                          rows={6}
                          onChange={(e) => setDesc(e.target.value)}
                          value={desc}
                        />
                      </Form>

                    <div className="row">
                        <div className="col-lg-2">
                          {desc && desc.length > 4 ? (
                            <>
                              <Button
                                onClick={handleSubmitB}
                                style={{ marginTop: "5px" }}
                                color="linkedin"
                              >
                                Post
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                disabled
                                style={{ marginTop: "5px" }}
                                color="linkedin"
                              >
                                Post
                              </Button>
                            </>
                          )}
                        </div>
                        <div className="col-lg" style={{ textAlign: "right" }}>
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
                        </div>
                      </div> 

                      {/* <h5 style={{ color: "red", textAlign: "center" }}>
                        Attendance will resume from 1st January 2024
                      </h5> */}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <main className="main" style={{ marginTop: "-45px" }}>
        <AttenUpdates />
      </main>
    </>
  );
}

export default Attendance;
