import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase-config";
import GoToTop from "../GoToTop";
import { Table } from "react-bootstrap";
function MyFiles() {
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

  const [files, setFiles] = useState([]);
  useEffect(() => {
    if (userId) {
      const unsubscribe = db
        .collection("members")
        .doc(userId)
        .onSnapshot(
          (snapshot) => {
            const userData = snapshot.data();
            setFiles(userData);
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

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Agreement Form
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div
                className="container my-2"
                style={{
                  border: "1.5px solid grey",
                  padding: "30px 18px 30px 18px",
                }}
              >
                <img
                  style={{ width: "100%" }}
                  src="https://firebasestorage.googleapis.com/v0/b/recruitment-1f4e0.appspot.com/o/header.png?alt=media&token=43662d91-1f95-4716-a2a0-87d0cb04e4b1"
                />
                <hr></hr>
                <div>
                  <h1 style={{ textAlign: "center", marginTop: "5vh" }}>
                    Wake With Wellness Member’s Agreement
                  </h1>
                  <br></br>

                  <b style={{ textAlign: "left" }}>Date: {files.date}</b>
                </div>

                <div className="para my-4">
                  <p>
                    This form serves as an agreement of the clauses required to
                    be a part of WakeWithWellness , registered under United
                    Nations. The other information is collected for our team
                    database. This information will be kept confidential and
                    will not be shared with any one else.
                  </p>
                  <br></br>
                  <div className="row">
                    <div className="col-lg-6 my-2">
                      <i
                        class="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      Full name :
                    </div>
                    <div className="col-lg-6">
                      <b>{files.name}</b>
                    </div>

                    <div className="col-lg-6 my-2">
                      <i
                        class="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      E-mail ID :
                    </div>
                    <div className="col-lg-6">
                      <b>{files.email}</b>
                    </div>

                    <div className="col-lg-6 my-2">
                      <i
                        class="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      Contact No. :
                    </div>
                    <div className="col-lg-6">
                      <b>{files.phone}</b>
                    </div>

                    <div className="col-lg-6 my-2">
                      <i
                        class="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      Whatsapp No. :
                    </div>
                    <div className="col-lg-6">
                      <b>{files.whatsapp}</b>
                    </div>

                    <div className="col-lg-6 my-2">
                      <i
                        class="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      Alternate Contact Number (State your relation with the
                      person) :
                    </div>
                    <div className="col-lg-6">
                      <b>{files.altno}</b>
                    </div>

                    <div className="col-lg-6 my-2">
                      <i
                        class="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      Department :
                    </div>
                    <div className="col-lg-6">
                      <b>{files.department}</b>
                    </div>

                    <div className="col-lg-6 my-2">
                      <i
                        class="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>{" "}
                      Name of institution you are currently enrolled in /
                      workplace :
                    </div>
                    <div className="col-lg-6">
                      <b>{files.college}</b>
                    </div>
                  </div>
                </div>
                <br></br>
                <br></br>
                <div classname="declarartion " style={{ textAlign: "justify" }}>
                  <p>
                    <i class="fa fa-check-square-o" aria-hidden="true"></i> I
                    understand that all the funds raised/ donated will be used
                    only for WakeWithWellness (after getting approval from the
                    Head of Finance) and not for any other reasons. If found
                    indulging in such activity, I recognize that will be the
                    reason for immediate removal from WakeWithWellness, will
                    have to compensate the entire amount of misused finances,
                    and will face the relevant consequences.
                  </p>

                  <p>
                    <i class="fa fa-check-square-o" aria-hidden="true"></i> I
                    understand that I should maintain confidentiality of plans,
                    ideas, resources, materials, etc. discussed/used amongst the
                    team. If I wish to implement the aforementioned elsewhere or
                    share them with a third party not affiliated with
                    WakeWithWellness, I will get approval from the HR and
                    Administrative head first. After getting approval, I will
                    provide due credit per the standards of WakeWithWellness, if
                    this is implemented or shared elsewhere. I recognize that if
                    I breach this clause, I can be removed from WakeWithWellness
                    immediately and will face the relevant consequences. I
                    understand that this clause stands even after leaving
                    WakeWithWellness that the material can not be shared with
                    any third party without approval, and I will not engage in
                    such practices.
                  </p>
                  <p>
                    <i class="fa fa-check-square-o" aria-hidden="true"></i> If
                    at any point of time I want to discontinue working for my
                    position, I will inform my CBO’s HR Head or respective
                    Department Head , minimum 2 weeks prior and I will continue
                    working in my position for these 2 weeks. The only exception
                    to this clause is immediate termination of position in case
                    of an emergency as determined by WakeWithWellness. I
                    recognize that reasons such as exams, vacations, packed
                    schedules, etc. do not stand ground as an emergency and I
                    will continue working for the remaining 2 weeks till the
                    termination of the position. Note: You can take breaks as
                    and when required, but the HR or respective Departmental
                    Head should be informed minimum 1 week in advance depending
                    on the nature of the leave.
                  </p>

                  <p>
                    <i class="fa fa-check-square-o" aria-hidden="true"></i> I
                    will work to the best of my ability. I recognize that
                    continuous negligence of responsibilities, deadlines and
                    confidentiality rules will result in my removal from
                    WakeWithWellness
                  </p>

                  <p>
                    <i class="fa fa-check-square-o" aria-hidden="true"></i> I
                    understand that if I am found indulging in malpractices of
                    any sort, spreading misinformation about WakeWithWellness
                    and our work, I will be removed from WakeWithWellness
                    immediately and will face the relevant consequences.
                  </p>

                  <p>
                    <i class="fa fa-check-square-o" aria-hidden="true"></i> I
                    will respect all individuals and their preferred identity,
                    be inclusive in my position, conduct all my responsibilities
                    with dedication, transparency and integrity.
                  </p>

                  <p>
                    <i class="fa fa-check-square-o" aria-hidden="true"></i> I
                    will abide the code of ethics and professional conduct of
                    WakeWithWellness and United Nations
                  </p>
                </div>

                <div style={{ marginTop: "10vh" }}>
                  <div className="col-3">
                    <img
                      style={{ width: "100%" }}
                      src="https://firebasestorage.googleapis.com/v0/b/recruitment-1f4e0.appspot.com/o/Sudhanshu.png?alt=media&token=73f9991d-bc95-437a-83f7-22a0c099ddcahttps://firebasestorage.googleapis.com/v0/b/recruitment-1f4e0.appspot.com/o/Sudhanshu.png?alt=media&token=44429566-8974-49ef-a002-45c183743770"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="exampleModalA"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                E-Identity Card
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              {files.idcard === undefined || files.idcard === null ? (
                <p style={{ color: "red", textAlign: "center" }}>
                  ID Card not generated
                </p>
              ) : (
                <img
                  src={files.idcard}
                  style={{ width: "100%" }}
                  alt="idcard"
                />
              )}
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>

              {files.idcard === undefined || files.idcard === null ? (
                <></>
              ) : (
                <a
                  type="button"
                  href={files.idcard}
                  target="_blank"
                  class="btn "
                  style={{ backgroundColor: "#1f88be", color: "#fff" }}
                >
                  Download
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <main id="main" class="main">
        <div class="pagetitle">
          <h5 class="card-title">My Documents</h5>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <div class="card mb-4">
                <div class="card-body text-center">
                  <img
                    src={files.link}
                    alt="avatar"
                    class="img-fluid"
                    style={{
                      width: "30vh",
                      height: "35vh",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginTop: "15px",
                    }}
                  />
                  <h3 class="my-2">{files.name}</h3>
                  <b
                    class="text"
                    style={{
                      color:
                        files.department === "Board Member" ? "red" : "green",
                    }}
                  >
                    {files.department}
                  </b>
                  <br></br> <br></br>
                  <div class="d-flex justify-content-center mb-2">
                    <button
                      type="button"
                      style={{ backgroundColor: "#1f88be", color: "white" }}
                      class="btn"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Agreement
                    </button>
                    <button
                      type="button"
                      style={{ border: "1px solid #1f88be", color: "#1f88be" }}
                      class="btn ms-1"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalA"
                    >
                      ID Card
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
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
                    <th scope="col">Tenure</th>

                    <th scope="col">Remark</th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      File
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {files.y1 === null || files.y1 === undefined ? (
                    <tr>
                      <td
                        colSpan="3"
                        style={{ textAlign: "center", color: "red" }}
                      >
                        No data found
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr>
                        <td style={{ width: "12vh" }}>
                          <b>{files.y1}</b>
                        </td>
                        <td>{files.r1}</td>
                        <td style={{ width: "12vh", textAlign: "center" }}>
                          <a
                            href={files.c1}
                            target="_blank"
                            style={{ color: "cornflowerblue" }}
                          >
                            <i class="fa fa-download"></i>
                          </a>
                        </td>
                      </tr>
                    </>
                  )}

                  {files.y2 === null || files.y2 === undefined ? (
                    <></>
                  ) : (
                    <>
                      <tr>
                        <td style={{ width: "12vh" }}>
                          <b>{files.y2}</b>
                        </td>
                        <td>{files.r2}</td>
                        <td style={{ width: "12vh", textAlign: "center" }}>
                          <a
                            href={files.c2}
                            target="_blank"
                            style={{ color: "cornflowerblue" }}
                          >
                            <i class="fa fa-download"></i>
                          </a>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default MyFiles;
