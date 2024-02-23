import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { db } from "../firebase-config";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function FeedbackForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [regno, setReg] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [loader, setLoader] = useState(false);
  const [success, setsuccess] = useState("");

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    setsuccess("");

    // Create a new document in the "submissions" collection
    db.collection("MembersFeedbacks")
      .add({
        name,
        regno,
        q1,
        q2,
        q3,
        date: formattedDateTime,
      })
      .then(() => {
        console.log("Form submitted successfully!");
        setsuccess("Submitted Successfully!");
        setLoader(false);
        // Perform any additional actions after successful form submission
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });

    // Reset the form fields
    setName("");
    setReg("");
    setQ1("");
    setQ2("");
    setQ3("");
    setTimeout(() => {
      setsuccess("");
    }, 4000);
  };
  return (
    <>
      <div class="container " style={{ marginTop: "10vh" }}>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Member's Feedback Form</h5>
            If you have questions about any specific clause, send an email to
            wakewithwellness@gmail.com or drop a feedback at
            www.wakewithwellness.in
          </div>
        </div>
      </div>
      <div class="container ">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Feedback Form</h5>

            <Form onSubmit={handleSubmit}>
              <h6>
                <b>Personal Details:</b>{" "}
              </h6>
              <div className="row">
                <div className="col-lg-6 my-2">
                  <Form.Input
                    label="Full Name"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="col-lg-6 my-2">
                  <Form.Input
                    label="Registration Number"
                    value={regno}
                    onChange={(e) => setReg(e.target.value)}
                    placeholder="Your Registration Number"
                  />
                </div>

                <div class="my-4"></div>
                <h6>
                  <b>Feedbacks:</b>{" "}
                </h6>
                <div className="col-lg-12 my-2">
                  <Form.TextArea
                    label="1. Are you satisfied with how the organization is currently operating?"
                    value={q1}
                    required
                    onChange={(e) => setQ1(e.target.value)}
                    placeholder="Yes/No"
                  ></Form.TextArea>
                </div>

                <div className="col-lg-12 my-2">
                  <Form.TextArea
                    label="2. Do you have any suggestions that may help the organization function more effectively?"
                    value={q2}
                    required
                    onChange={(e) => setQ2(e.target.value)}
                  ></Form.TextArea>
                </div>

                <div className="col-lg-12 my-2">
                  <Form.TextArea
                    label="3. Are there any issues with the organization's operations or activity of any kind?"
                    value={q3}
                    required
                    onChange={(e) => setQ3(e.target.value)}
                  ></Form.TextArea>
                </div>
              </div>

              {success && (
                <Alert
                  variant="success"
                  style={{ fontSize: "12px", textAlign: "center" }}
                >
                  {success}
                </Alert>
              )}
              <div className="text-center my-5">
                {loader === false ? (
                  <>
                    <Button color="linkedin" type="submit">
                      Submit
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
            </Form>
          </div>
        </div>
      </div>
      <br></br> <br></br> <br></br>
    </>
  );
}

export default FeedbackForm;
