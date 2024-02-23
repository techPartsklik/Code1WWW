import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import { db, auth } from "../firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import GoToTop from "../GoToTop";
function Profile() {
  const [sname, setName] = useState("");
  const [scontact, setContact] = useState("");
  const [swhatsapp, setSwhatsapp] = useState("");
  const [scollege, setCollege] = useState("");
  const [sexp, setExp] = useState("");
  const [saddress, setAddress] = useState("");
  const [sabout, setAbout] = useState("");
  const [sstate, setState] = useState("");
  const [sblood, setBlood] = useState("");
  const [successForm, setSuccessForm] = useState("");

  const [loader, setLoader] = useState(false);

  const [userData, setUserData] = useState({});
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = () => {
      if (userId) {
        const userDocRef = db.collection("members").doc(userId);
        const unsubscribe = userDocRef.onSnapshot((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setUserData(userData);
            setName(userData.name);
            setContact(userData.phone);
            setSwhatsapp(userData.whatsapp);
            setAddress(userData.address);
            setCollege(userData.college);
            setAbout(userData.about);
            setExp(userData.exp);
            setBlood(userData.blood);
            setState(userData.state);
          } else {
            navigate("/");
          }
        });

        return unsubscribe;
      }
    };

    const fetchOtherData = async () => {
      // Add your additional data fetching logic here
      // Example:
      if (userId) {
        try {
          const otherDocRef = db.collection("members").doc(userId);
          const otherDoc = await otherDocRef.get();

          if (otherDoc.exists) {
            const otherData = otherDoc.data();
            // Process and store other data as needed
          } else {
            console.log("No other document found!");
          }
        } catch (error) {
          console.log("Error getting other document:", error);
        }
      }
    };

    // Call the functions to fetch the data
    const unsubscribeUserData = fetchUserData();
    fetchOtherData();

    // Clean up subscriptions
    return () => {
      if (unsubscribeUserData) {
        unsubscribeUserData();
      }
    };
  }, [userId]);

  const handleSubmit = async () => {
    try {
      // Create a new document in Firestore collection
      await db.collection("members").doc(userId).update({
        name: sname,
        phone: scontact,
        address: saddress,
        whatsapp: swhatsapp,
        about: sabout,
        exp: sexp,
        college: scollege,
        blood: sblood,
        state: sstate,
      });

      setSuccessForm("Success! Profile Updated");

      setTimeout(() => {
        setSuccessForm("");
      }, 3000);

      // Reset form fields and close the modal
    } catch (error) {
      console.log("Error submitting applied project:", error);
    }
  };

  //Update Profile
  const [imageFile, setImageFile] = useState(null);
  const [imgerror, setImgError] = useState("");

  const [uploaded, setUploaded] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const handleProfilePic = async (event) => {
    event.preventDefault();
    setLoader(true);
    if (!imageFile) return;

    // Check the file size
    const fileSize = imageFile.size; // in bytes
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes

    if (fileSize > maxSize) {
      setImgError("Profile picture size should be less than 1MB");
      setTimeout(() => {
        setImgError("");
        setLoader(false);
      }, 3000);
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `users/${userId}/profile`);

    try {
      await uploadBytes(storageRef, imageFile);
      setLoader(true);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      const userRef = db.collection("members").doc(userId);
      userRef.update({ link: downloadURL });

      setUploaded("Profile Updated!");

      setTimeout(() => {
        setUploaded("");
        setLoader(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      alert("An error occurred while uploading the profile picture");
    }
  };

  return (
    <>
      <GoToTop />
      <main id="main" class="main">
        <div class="pagetitle">
          <h5 class="card-title">My Profile</h5>
        </div>

        <section class="section profile">
          <div class="row">
            <div class="col-xl-4">
              <div class="card">
                <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
                  <img
                    src={userData.link}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: "15vh",
                      height: "15vh",
                      objectFit: "cover",
                    }}
                  />
                  <h2>{userData.name}</h2>

                  <b style={{ color: "red" }}>{userData.regno}</b>
                  <h3>{userData.department}</h3>
                </div>
              </div>
            </div>

            <div class="col-xl-8">
              <div class="card">
                <div class="card-body pt-3">
                  <ul class="nav nav-tabs nav-tabs-bordered">
                    <li class="nav-item">
                      <button
                        class="nav-link active"
                        data-bs-toggle="tab"
                        data-bs-target="#profile-overview"
                      >
                        Overview
                      </button>
                    </li>

                    <li class="nav-item">
                      <button
                        class="nav-link"
                        data-bs-toggle="tab"
                        data-bs-target="#profile-edit"
                      >
                        Edit Profile
                      </button>
                    </li>
                  </ul>
                  <div class="tab-content pt-2">
                    <div
                      class="tab-pane fade show active profile-overview"
                      id="profile-overview"
                    >
                      <h5 class="card-title" style={{ color: "white" }}>
                        About
                      </h5>
                      <p class="small fst-italic">{userData.about}</p>

                      <h5 class="card-title" style={{ color: "white" }}>
                        Profile Details
                      </h5>

                      <div class="row">
                        <div class="col-lg-3 col-md-4 label ">Full Name</div>
                        <div class="col-lg-9 col-md-8">{userData.name}</div>
                      </div>

                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">
                          Registration no.
                        </div>
                        <div class="col-lg-9 col-md-8">{userData.regno}</div>
                      </div>

                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">Email</div>
                        <div class="col-lg-9 col-md-8">{userData.email}</div>
                      </div>

                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">Department</div>
                        <div class="col-lg-9 col-md-8">
                          {userData.department}
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">
                          Dept (Preference-II)
                        </div>
                        <div class="col-lg-9 col-md-8">
                          {userData.department2}
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">Contact</div>
                        <div class="col-lg-9 col-md-8">{userData.phone}</div>
                      </div>
                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">Whatsapp</div>
                        <div class="col-lg-9 col-md-8">{userData.whatsapp}</div>
                      </div>
                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">Gender</div>
                        <div class="col-lg-9 col-md-8">{userData.gender}</div>
                      </div>

                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">Blood Group</div>
                        <div class="col-lg-9 col-md-8">{userData.blood}</div>
                      </div>

                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">Address</div>
                        <div class="col-lg-9 col-md-8">{userData.address}</div>
                      </div>

                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">State</div>
                        <div class="col-lg-9 col-md-8">{userData.state}</div>
                      </div>

                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">Education</div>
                        <div class="col-lg-9 col-md-8">{userData.college}</div>
                      </div>

                      <div class="row">
                        <div class="col-lg-3 col-md-4 label">Experience</div>
                        <div class="col-lg-9 col-md-8">{userData.exp}</div>
                      </div>
                    </div>

                    <div
                      class="tab-pane fade profile-edit pt-3"
                      id="profile-edit"
                    >
                      <Form onSubmit={handleProfilePic}>
                        <div class="row mb-3">
                          <label
                            for="profileImage"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            Profile Image
                          </label>
                          <div class="col-md-8 col-lg-9">
                            {/* <img
                            src={userData.link}
                            alt="Profile"
                            className="rounded-circle"
                            style={{
                              width: "15vh",
                              height: "15vh",
                              objectFit: "cover",
                            }}
                          /> */}

                            <div className="row">
                              <div className="col-lg">
                                {imgerror && (
                                  <Alert
                                    variant="danger"
                                    style={{
                                      fontSize: "13px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {imgerror}
                                  </Alert>
                                )}

                                {uploaded && (
                                  <Alert
                                    variant="success"
                                    style={{
                                      fontSize: "13px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {uploaded}
                                  </Alert>
                                )}

                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />
                              </div>
                              <div className="col-lg">
                                {loader === false ? (
                                  <>
                                    <Button color="linkedin" type="submit">
                                      <i class="fa fa-upload"></i> Upload
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      class="ui loading button"
                                      style={{ height: "37px" }}
                                    >
                                      Loading
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Form>
                      <Form>
                        <div class="row mb-3">
                          <label
                            for="fullName"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            Full Name
                          </label>
                          <div class="col-md-8 col-lg-9">
                            <Form.Input
                              type="text"
                              class="form-control"
                              onChange={(e) => setName(e.target.value)}
                              required
                              value={sname}
                            />
                          </div>
                        </div>

                        <div class="row mb-3">
                          <label
                            for="about"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            About
                          </label>
                          <div class="col-md-8 col-lg-9">
                            <textarea
                              name="about"
                              class="form-control"
                              onChange={(e) => setAbout(e.target.value)}
                              value={sabout}
                              style={{ height: "100px" }}
                            ></textarea>
                          </div>
                        </div>

                        <div class="row mb-3">
                          <label
                            for="Job"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            Contact
                          </label>
                          <div class="col-md-8 col-lg-9">
                            <input
                              name="job"
                              type="tel"
                              class="form-control"
                              id="Job"
                              onChange={(e) => setContact(e.target.value)}
                              required
                              value={scontact}
                            />
                          </div>
                        </div>

                        <div class="row mb-3">
                          <label
                            for="Country"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            Whatsapp
                          </label>
                          <div class="col-md-8 col-lg-9">
                            <input
                              name="country"
                              type="text"
                              class="form-control"
                              onChange={(e) => setSwhatsapp(e.target.value)}
                              required
                              value={swhatsapp}
                            />
                          </div>
                        </div>

                        <div class="row mb-3">
                          <label
                            for="Experience"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            Experience
                          </label>
                          <div class="col-md-8 col-lg-9">
                            <textarea
                              name="address"
                              rows="2"
                              class="form-control"
                              onChange={(e) => setExp(e.target.value)}
                              required
                              value={sexp}
                            ></textarea>
                          </div>
                        </div>

                        <div class="row mb-3">
                          <label
                            for="Address"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            Blood group
                          </label>
                          <div class="col-md-8 col-lg-9">
                            <select
                              id="inputboxform"
                              name="blood"
                              onChange={(e) => setBlood(e.target.value)}
                              required
                              value={sblood}
                              class="form-control"
                            >
                              <option value=" ">--Select Blood Group--</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>

                              <option value="B+">B+</option>
                              <option value="B-">B-</option>

                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>

                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </select>
                          </div>
                        </div>

                        <div class="row mb-3">
                          <label
                            for="Address"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            Address
                          </label>
                          <div class="col-md-8 col-lg-9">
                            <textarea
                              name="address"
                              rows="3"
                              class="form-control"
                              onChange={(e) => setAddress(e.target.value)}
                              required
                              value={saddress}
                            ></textarea>
                          </div>
                        </div>

                        <div class="row mb-3">
                          <label
                            for="Address"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            State
                          </label>
                          <div class="col-md-8 col-lg-9">
                            <select
                              onChange={(e) => setState(e.target.value)}
                              required
                              value={sstate}
                              name="state"
                              class="form-control"
                            >
                              <option value=" ">--Select--</option>
                              <option value="Andhra Pradesh">
                                Andhra Pradesh
                              </option>
                              <option value="Andaman and Nicobar Islands">
                                Andaman and Nicobar Islands
                              </option>
                              <option value="Arunachal Pradesh">
                                Arunachal Pradesh
                              </option>
                              <option value="Assam">Assam</option>
                              <option value="Bihar">Bihar</option>
                              <option value="Chandigarh">Chandigarh</option>
                              <option value="Chhattisgarh">Chhattisgarh</option>

                              <option value="Delhi">Delhi</option>
                              <option value="Lakshadweep">Lakshadweep</option>
                              <option value="Puducherry">Puducherry</option>
                              <option value="Goa">Goa</option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="Haryana">Haryana</option>
                              <option value="Himachal Pradesh">
                                Himachal Pradesh
                              </option>
                              <option value="Jammu and Kashmir">
                                Jammu and Kashmir
                              </option>
                              <option value="Jharkhand">Jharkhand</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Kerala">Kerala</option>
                              <option value="Madhya Pradesh">
                                Madhya Pradesh
                              </option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Manipur">Manipur</option>
                              <option value="Meghalaya">Meghalaya</option>
                              <option value="Mizoram">Mizoram</option>
                              <option value="Nagaland">Nagaland</option>
                              <option value="Odisha">Odisha</option>
                              <option value="Punjab">Punjab</option>
                              <option value="Rajasthan">Rajasthan</option>
                              <option value="Sikkim">Sikkim</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Telangana">Telangana</option>
                              <option value="Tripura">Tripura</option>
                              <option value="Uttar Pradesh">
                                Uttar Pradesh
                              </option>
                              <option value="Uttarakhand">Uttarakhand</option>
                              <option value="West Bengal">West Bengal</option>
                            </select>
                          </div>
                        </div>

                        {successForm && (
                          <Alert
                            variant="success"
                            style={{ fontSize: "13px", textAlign: "center" }}
                          >
                            {successForm}
                          </Alert>
                        )}

                        <div class="text-center">
                          <Button
                            onClick={handleSubmit}
                            size="small"
                            type="submit"
                            color="linkedin"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </Form>
                    </div>

                    <div
                      class="tab-pane fade pt-3"
                      id="profile-change-password"
                    >
                      <form>
                        <div class="row mb-3">
                          <label
                            for="currentPassword"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            Current Password
                          </label>
                          <div class="col-md-8 col-lg-9">
                            <input
                              name="password"
                              type="password"
                              class="form-control"
                              id="currentPassword"
                            />
                          </div>
                        </div>

                        <div class="row mb-3">
                          <label
                            for="newPassword"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            New Password
                          </label>
                          <div class="col-md-8 col-lg-9">
                            <input
                              name="newpassword"
                              type="password"
                              class="form-control"
                              id="newPassword"
                            />
                          </div>
                        </div>

                        <div class="row mb-3">
                          <label
                            for="renewPassword"
                            class="col-md-4 col-lg-3 col-form-label"
                          >
                            Re-enter New Password
                          </label>
                          <div class="col-md-8 col-lg-9">
                            <input
                              name="renewpassword"
                              type="password"
                              class="form-control"
                              id="renewPassword"
                            />
                          </div>
                        </div>

                        <div class="text-center">
                          <button type="submit" class="btn btn-primary">
                            Change Password
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br></br>
        </section>
      </main>
    </>
  );
}

export default Profile;
