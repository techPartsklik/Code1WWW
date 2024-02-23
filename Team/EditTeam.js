import React, { useState, useEffect } from "react";
import { Button, Form, Loader, Icon, Select } from "semantic-ui-react";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import GoToTop from "../../../GoToTop";
import { useUserAuth } from "../context/UserAuthContext";
import { addDoc, updateDoc, doc, collection, getDoc } from "firebase/firestore";

const initialState = {
  name: "",
  regno: "",
  department: "",
  status: "none",
  date: "",
  time: "",
};

const EditTeam = () => {
  const [data, setData] = useState(initialState);
  const { name, regno, department, status, date, time, users } = data;
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserAuth();
  data.users = user.email;

  const today = new Date();
  data.time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const current = new Date();
  data.date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  useEffect(() => {
    id && getSinglePhoto();
  }, [id]);

  const getSinglePhoto = async () => {
    const docRef = doc(db, "Team", id);
    const snapshot = await getDoc(docRef, "Team");
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errors = {};
    if (!name) {
      errors.name = "Name is required";
    }

    if (!regno) {
      errors.regno = "Regno. is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    if (!id) {
      try {
        await addDoc(collection(db, "Team"), {
          ...data,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await updateDoc(doc(db, "Team", id), {
          ...data,
          id,
        });
      } catch (error) {
        console.log(error);
      }
    }

    navigate(-1);
  };

  return (
    <>
      {" "}
      <GoToTop />
      <div
        className="container"
        style={{ marginTop: "15vh", maxWidth: "120vh" }}
      >
        <div className="card" style={{ backgroundColor: "white" }}>
          <h2>ADD/UPDATE TEAM MEMBER</h2>
          <hr></hr>
          <div className="row">
            <div className="col-lg my-2">
              {isSubmit ? (
                <Loader active inline="centered" size="huge" />
              ) : (
                <>
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      error={errors.ename ? { content: errors.name } : null}
                      label="Name"
                      name="name"
                      placeholder="Name"
                      onChange={handleChange}
                      value={name}
                    />

                    <Form.Input
                      error={errors.regno ? { content: errors.regno } : null}
                      label="Reg no."
                      name="regno"
                      placeholder="Registration number"
                      onChange={handleChange}
                      value={regno}
                    />

                    <Form.Field
                      label="Department"
                      name="department"
                      control="select"
                      onChange={handleChange}
                      value={department}
                    >
                      <option value="">--Select--</option>
                      <option value="Management">Management</option>
                      <option value="Technical">Technical</option>
                      <option value="Editorial">Editorial</option>
                      <option value="Design & Media">Design & Media</option>
                    </Form.Field>

                    <Form.Input name="dtime" readOnly hidden value={time} />
                    <Form.Input name="ddate" readOnly hidden value={date} />

                    <Form.Input name="id" hidden value={id} />

                    <Form.Input name="users" hidden value={users} />

                    <Form.Input name="status" hidden value={status} />

                    <br></br>

                    <Button
                      style={{ float: "right" }}
                      color="green"
                      type="submit"
                      icon
                      labelPosition="left"
                      size="small"
                    >
                      <Icon name="save" /> Save
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </div>
        </div>{" "}
      </div>
    </>
  );
};

export default EditTeam;
