import React, { useState, useEffect } from "react";
import { Button, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import { Table } from "react-bootstrap";
import GoToTop from "../../../GoToTop";
import * as XLSX from "xlsx";

function Tshirts() {
  const [photos, setPhotos] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(
      db.collection("Team").orderBy("name"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setPhotos(list);
      },
      (error) => {
        console.error(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete selected items?")) {
      try {
        if (selectedItems.length === 0) {
          alert("No items selected for deletion.");
          return;
        }
        await Promise.all(
          selectedItems.map(async (id) => {
            await deleteDoc(doc(db, "Team", id));
          })
        );
        setSelectedItems([]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === photos.length) {
      // All items are selected, so deselect all
      setSelectedItems([]);
    } else {
      // Not all items are selected, so select all
      setSelectedItems(photos.map((item) => item.id));
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Assuming there's only one sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Uploading data to Firestore
      try {
        await Promise.all(
          jsonData.map(async (item) => {
            await db.collection("Team").add(item);
          })
        );
        alert("Data uploaded successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error uploading data:", error);
        alert("Error uploading data. Please try again.");
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  return (
    <>
      <GoToTop />

      <div id="mbonly" className="container" style={{ marginTop: "15vh" }}>
        This page is not compatible in mobile view. Please open it on
        laptop/desktop
      </div>

      <div
        id="pconly"
        className="container"
        style={{ maxWidth: "200vh", marginTop: "15vh" }}
      >
        <div className="section-title">
          <h2
            style={{ fontWeight: "bold", fontFamily: "Montserrat, sans-serif" }}
          >
            TEAM MEMBERS
          </h2>
        </div>

        <div className="container-fluid">
          <div className="text-right" style={{ marginTop: "-30px" }}>
            <div></div>
            <Button
              floated="right"
              icon
              labelPosition="left"
              secondary
              size="small"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Icon name="plus" /> Upload Bulk
            </Button>
            <Button
              floated="right"
              icon
              labelPosition="left"
              primary
              size="small"
              onClick={() => navigate(`/addteam`)}
            >
              <Icon name="plus" /> Add Members
            </Button>
            {selectedItems.length > 0 && (
              <Button
                floated="right"
                icon
                labelPosition="left"
                color="red"
                size="small"
                onClick={handleDelete}
              >
                <Icon name="delete" /> Delete Selected
              </Button>
            )}
          </div>
        </div>

        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Upload Bulk
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <input type="file" onChange={handleFileUpload} />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                {/* <button class="btn btn-primary">Upload</button> */}
              </div>
            </div>
          </div>
        </div>

        <br></br>
        <br></br>

        <Table responsive striped bordered hover size="sm">
          <thead style={{ backgroundColor: "#121212", color: "white" }}>
            <tr style={{ fontSize: "13px" }}>
              <th style={{ textAlign: "center", fontSize: "10px" }}>
                {selectedItems.length === photos.length
                  ? "Deselect All"
                  : "Select All"}
                <br />
                <input
                  style={{ cursor: "pointer" }}
                  type="checkbox"
                  checked={selectedItems.length === photos.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th style={{ textAlign: "center" }}>#</th>
              <th style={{ textAlign: "left" }}>RegNo</th>
              <th style={{ textAlign: "left" }}>Name</th>

              <th style={{ textAlign: "center" }}>Department</th>
              <th style={{ textAlign: "center" }}>UpdatedBy</th>
              <th style={{ textAlign: "center" }}>UpdateOn</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {photos &&
              photos.map((item, index) => (
                <tr style={{ fontSize: "12px" }} key={item.id}>
                  <td style={{ textAlign: "center", width: "10vh" }}>
                    <input
                      style={{ cursor: "pointer" }}
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td style={{ textAlign: "left", textTransform: "uppercase" }}>
                    {item.regno}
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                    }}
                  >
                    {item.name}
                  </td>

                  <td
                    style={{
                      textAlign: "left",
                    }}
                  >
                    {item.department}
                  </td>
                  <td style={{ textAlign: "center", minWidth: "15vh" }}>
                    <small>{item.users}</small>
                  </td>
                  <td
                    style={{ textAlign: "center", color: "red", width: "30vh" }}
                  >
                    <b>
                      {item.date};{item.time}
                    </b>
                  </td>
                  <td style={{ textAlign: "center", width: "10vh" }}>
                    <i
                      style={{
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "green",
                      }}
                      onClick={() => navigate(`/editteam/${item.id}`)}
                      class="fa fa-pencil-square-o"
                      aria-hidden="true"
                    ></i>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        <br></br>
      </div>
    </>
  );
}

export default Tshirts;
