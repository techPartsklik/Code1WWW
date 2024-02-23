import React, {useState, useEffect, useRef} from "react";
import {db, auth} from "../firebase-config";
import {onSnapshot, serverTimestamp} from "firebase/firestore";
import {Modal, Form} from "semantic-ui-react";
function Chatbox({
  open,
  setOpen,
  name,
  link,

  id,
}) {
  const [msgs, setMsgs] = useState([]);
  const [userData, setUserData] = useState(null);
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const [userMsg, setUserDesc] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    // Scroll down to the bottom of the chat
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs]);

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
            console.log("No user document found!");
          }
        } catch (error) {
          console.log("Error getting user document:", error);
        }
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, [userId]);

  const today = new Date();
  const chattime =
    today.getHours().toString().padStart(2, "0") +
    ":" +
    today.getMinutes().toString().padStart(2, "0") +
    ":" +
    today.getSeconds().toString().padStart(2, "0");
  const current = new Date();
  const options = {year: "numeric", month: "long", day: "numeric"};
  const chatdate = current.toLocaleString("en-US", options);

  const handleSubmit = async () => {
    db.collection("Chats")
      .doc(id)
      .collection("ChatsCollections")
      .doc(`${chatdate}-${chattime}`)
      .set({
        img: userData.img,
        name: userData.name,
        userMsg,
        chattime: serverTimestamp(),
        uid: userId,
      });

    // Reset form fields and close the modal

    setUserDesc("");
    setOpen(true);
  };

  useEffect(() => {
    const unsub = onSnapshot(
      db.collection("Chats").doc(id).collection("ChatsCollections"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({id: doc.id, ...doc.data()});
        });
        setMsgs(list);
        setOpen(true);
      },

      (error) => {
        console.error(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  const formatTimestamp3 = (chattime) => {
    const date = chattime.toDate();
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
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      class="modal fade"
      style={{width: "100%", height: "100%", backgroundColor: "transparent"}}
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div
            class="modal-header"
            style={{backgroundColor: "#2185d2", color: "white"}}
          >
            <div clas="container-fluid">
              <b>{name}</b>
            </div>
            <button
              type="button"
              style={{
                color: "white",
                backgroundColor: "#1f88be",
                border: "none",
              }}
              onClick={() => setOpen(false)}
              data-bs-dismiss="modal"
            >
              X
            </button>
          </div>

          <div class="modal-body">
            {/* //////////////// */}

            <div
              class="card-body my-3"
              ref={chatRef}
              style={{position: "relative", height: "400px"}}
            >
              {msgs.map((item) => (
                <>
                  <div class="d-flex justify-content-between">
                    <p class="small mb-1">{item.name}</p>
                    <p class="small mb-1 text-muted">
                      {item.chattime && formatTimestamp3(item.chattime)}
                    </p>
                  </div>
                  <div class="d-flex flex-row justify-content-start">
                    <img
                      src={item.link}
                      alt="avatar 1"
                      style={{width: "45px", height: "100%"}}
                    />
                    <div>
                      <p
                        class="small p-2 ms-3 mb-3 rounded-3"
                        style={{backgroundColor: "#f5f6f7"}}
                      >
                        {item.userMsg}
                      </p>
                    </div>
                  </div>
                </>
              ))}

              <div class="d-flex justify-content-between">
                <p class="small mb-1 text-muted">23 Jan 2:05 pm</p>
              </div>
              <div class="d-flex flex-row justify-content-end mb-4 pt-1">
                <div>
                  <p class="small p-2 me-3 mb-3 text-white rounded-3 bg-warning">
                    Thank you for your believe in our supports
                  </p>
                </div>
                <img
                  src={link}
                  alt="avatar 1"
                  class="rounded-circle"
                  style={{width: "43px", height: "43px", objectFit: "cover"}}
                />
              </div>
            </div>
          </div>
          <Form>
            <div class="card-footer text-muted d-flex justify-content-start align-items-center p-3">
              <div class="input-group mb-0">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Type message..."
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                  value={userMsg}
                  onChange={setUserDesc}
                />
                <button
                  class="btn"
                  style={{
                    backgroundColor: "#1f88be",
                    color: "white",
                    paddingTop: ".55rem",
                  }}
                  id="button-addon2"
                  type="submit"
                  onClick={handleSubmit}
                >
                  <i class="fa fa-send"></i> Send
                </button>
              </div>{" "}
            </div>{" "}
          </Form>
        </div>
      </div>
    </Modal>
  );
}

export default Chatbox;
