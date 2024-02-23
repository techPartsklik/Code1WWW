import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {db, auth} from "../firebase-config";
import GoToTop from "../GoToTop";
import {Table} from "react-bootstrap";
function MyLogs() {
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

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchUserData = (uid) => {
      const query = db.collection("MembersLogs").where("uid", "==", uid);

      const unsubscribe = query.onSnapshot(
        (querySnapshot) => {
          const documents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLogs(documents);
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
        setLogs([]);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const formatTimestamp = (loginAt) => {
    const date = loginAt.toDate();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
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

      <main id="main" class="main">
        <div class="pagetitle">
          <h1>My Logs</h1>
        </div>

        <div className="col-lg-4">
          <Table
            responsive
            hover
            striped
            bordered
            size="sm"
            style={{fontSize: "12px"}}
          >
            <thead style={{backgroundColor: "#1f88be", color: "#fff"}}>
              <tr>
                <th scope="col" style={{textAlign: "center"}}>
                  #
                </th>
                <th scope="col">Logged In/Sign Out Time</th>
                <th scope="col" style={{textAlign: "left"}}>
                  Activity
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.length > 0 ? (
                logs.map((user, index) => (
                  <tr key={user.id}>
                    <td
                      style={{
                        textAlign: "center",
                        color: user.status === "Logged In" ? "black" : "red",
                      }}
                    >
                      {index + 1}
                    </td>

                    <td
                      style={{
                        textAlign: "left",
                        color: user.status === "Logged In" ? "black" : "red",
                      }}
                    >
                      {user.loginAt && formatTimestamp(user.loginAt)}
                    </td>

                    <td
                      style={{
                        textAlign: "left",
                        color: user.status === "Logged In" ? "green" : "red",
                      }}
                    >
                      <b>
                        {user.status === "Logged In" ? (
                          <>
                            <i class="fa fa-sign-in" aria-hidden="true"></i>
                          </>
                        ) : (
                          <>
                            <i class="fa fa-sign-out" aria-hidden="true"></i>
                          </>
                        )}{" "}
                        {user.status}
                      </b>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{textAlign: "center", color: "red"}}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </main>
    </>
  );
}

export default MyLogs;
