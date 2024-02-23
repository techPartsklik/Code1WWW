import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { db } from "../firebase-config";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AgreementForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [altno, setAlt] = useState("");
  const [department, setDept1] = useState("");
  const [department2, setDept2] = useState("");
  const [dob, setDOB] = useState("");
  const [blood, setBlood] = useState("");
  const [college, setCollege] = useState("");
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
    db.collection("MembersAgreement")
      .add({
        name,
        email,
        phone,
        whatsapp,
        altno,
        department,
        department2,
        dob,
        blood,
        college,
        agree: "Agreed",
        status: "Pending",
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
    setEmail("");
    setPhone("");
    setWhatsapp("");
    setAlt("");
    setDept1("");
    setDept2("");
    setDOB("");
    setBlood("");
    setCollege("");
    setTimeout(() => {
      setsuccess("");
    }, 4000);
  };
  return (
    <>
      <div class="container " style={{ marginTop: "10vh" }}>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Wake With Wellness Member's Agreement</h5>
            This form serves as an agreement of the clauses required to be a
            part of WakeWithWellness , registered under UNITED NATIONS. The
            other information is collected for our team database. This
            information will be kept confidential and will not be shared with
            any one else.
            <br></br>
            <br></br>
            If you have questions about any specific clause, send an email to
            wakewithwellness@gmail.com or drop a feedback at
            www.wakewithwellness.in
          </div>
        </div>
      </div>
      <div class="container ">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Agreement Form</h5>

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
                    label="Email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email id"
                  />
                </div>
                <div className="col-lg-6 my-2">
                  <Form.Input
                    label="Contact"
                    required
                    value={phone}
                    type="tel"
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your contact no."
                  />
                </div>
                <div className="col-lg-6 my-2">
                  <Form.Input
                    label="Whatsapp"
                    required
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Your whatsapp no."
                  />
                </div>
                <div className="col-lg-6 my-2">
                  <Form.Input
                    label="Alternate Number"
                    value={altno}
                    required
                    onChange={(e) => setAlt(e.target.value)}
                    placeholder="Your any alternate contact(State your relation with the person)"
                  />
                </div>
                <div className="col-lg-6 my-2">
                  <Form.Input
                    value={college}
                    required
                    onChange={(e) => setCollege(e.target.value)}
                    label="Workplace/College"
                    placeholder="Name of institution you are currently enrolled in / workplace"
                  />
                </div>
                <div className="col-lg-6 my-2">
                  <Form.Input
                    label="Date Of Birth"
                    value={dob}
                    required
                    onChange={(e) => setDOB(e.target.value)}
                    type="date"
                    placeholder="Your date of birth"
                  />
                </div>
                <div className="col-lg-6 my-2">
                  <Form.Field
                    label="Blood Group"
                    value={blood}
                    required
                    onChange={(e) => setBlood(e.target.value)}
                    control="select"
                  >
                    <option value="">--Select blood group--</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </Form.Field>
                </div>
                <div class="my-4"></div>
                <h6>
                  <b>Department Selection:</b>{" "}
                </h6>
                <div className="col-lg-6 my-2">
                  <Form.Field
                    label="Department (preference I)"
                    control="select"
                    value={department}
                    required
                    onChange={(e) => setDept1(e.target.value)}
                  >
                    <option value="">--Select preference I--</option>

                    <option value="Curation Department">
                      Curation Department
                    </option>
                    <option value="Editorial Department">
                      Editorial Department
                    </option>
                    <option value="Design & Media Department">
                      Design & Media Department
                    </option>
                    <option value="PR Department">
                      Public Relations Department
                    </option>
                    <option value="Events Department">Events Department</option>
                    <option value="Marketing Department">
                      Social Media Marketing Department
                    </option>
                  </Form.Field>
                </div>
                <div className="col-lg-6 my-2">
                  <Form.Field
                    label="Department (preference II) "
                    control="select"
                    value={department2}
                    onChange={(e) => setDept2(e.target.value)}
                  >
                    <option value="">
                      --Select preference II (Optional)--
                    </option>

                    <option value="Curation Department">
                      Curation Department
                    </option>
                    <option value="Editorial Department">
                      Editorial Department
                    </option>
                    <option value="Design & Media Department">
                      Design & Media Department
                    </option>
                    <option value="PR Department">
                      Public Relations Department
                    </option>
                    <option value="Events Department">Events Department</option>
                    <option value="Marketing Department">
                      Social Media Marketing Department
                    </option>
                  </Form.Field>
                </div>
                <div class="my-4"></div>
                <h6>
                  <b>Declarations:</b>{" "}
                </h6>
                <div className="col-lg-12 my-2">
                  <div class="form-check">
                    <input required class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="gridCheck1">
                      I understand that all the funds raised/ donated will be
                      used only for WakeWithWellness (after getting approval
                      from the Head of Finance) and not for any other reasons.
                      If found indulging in such activity, I recognize that will
                      be the reason for immediate removal from WakeWithWellness,
                      will have to compensate the entire amount of misused
                      finances, and will face the relevant consequences.
                      <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                </div>

                <div className="col-lg-12 my-2">
                  <div class="form-check">
                    <input required class="form-check-input" type="checkbox" />
                    <label class="form-check-label">
                      I understand that I should maintain confidentiality of
                      plans, ideas, resources, materials, etc. discussed/used
                      amongst the team. If I wish to implement the
                      aforementioned elsewhere or share them with a third party
                      not affiliated with WakeWithWellness, I will get approval
                      from the Founders head first. After getting approval, I
                      will provide due credit per the standards of
                      WakeWithWellness, if this is implemented or shared
                      elsewhere. I recognize that if I breach this clause, I can
                      be removed from WakeWithWellness immediately and will face
                      the relevant consequences. I understand that this clause
                      stands even after leaving WakeWithWellness that the
                      material can not be shared with any third party without
                      approval, and I will not engage in such practices.{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                </div>

                <div className="col-lg-12 my-2">
                  <div class="form-check">
                    <input required class="form-check-input" type="checkbox" />
                    <label class="form-check-label">
                      I will work to the best of my ability. I recognize that
                      continuous negligence of responsibilities, deadlines and
                      confidentiality rules will result in my removal from
                      WakeWithWellness. <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                </div>

                <div className="col-lg-12 my-2">
                  <div class="form-check">
                    <input required class="form-check-input" type="checkbox" />
                    <label class="form-check-label">
                      I understand that if I am found indulging in malpractices
                      of any sort, spreading misinformation about
                      WakeWithWellness and our work, I will be removed from
                      WakeWithWellness immediately and will face the relevant
                      consequences. <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                </div>

                <div className="col-lg-12 my-2">
                  <div class="form-check">
                    <input required class="form-check-input" type="checkbox" />
                    <label class="form-check-label">
                      I will respect all individuals and their preferred
                      identity, be inclusive in my position, conduct all my
                      responsibilities with dedication, transparency and
                      integrity. <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                </div>

                <div className="col-lg-12 my-2">
                  <div class="form-check">
                    <input required class="form-check-input" type="checkbox" />
                    <a
                      style={{ cursor: "pointer" }}
                      href="https://firebasestorage.googleapis.com/v0/b/website-818ed.appspot.com/o/CodeofEthics.pdf?alt=media&token=df241a31-533a-46ba-91f2-52b371fd851a"
                      target="_blank"
                    >
                      <label
                        class="form-check-label"
                        style={{ cursor: "pointer" }}
                      >
                        <i class="fa fa-file-pdf-o" aria-hidden="true"></i> I
                        will abide the code of ethics and professional conduct
                        of WakeWithWellness and United Nations.{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                    </a>
                  </div>
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

export default AgreementForm;
