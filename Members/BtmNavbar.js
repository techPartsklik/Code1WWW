import React from "react";
import { Link } from "react-router-dom";
import Atten from "./Img/atten.svg";
import Events from "./Img/events.svg";
import Payments from "./Img/payment.svg";
import Leave from "./Img/leave.svg";
import Home from "./Img/home.svg";
function BtmNavbar() {
  return (
    <>
      <div
        className="container fixed-bottom"
        id="mobileview"
        style={{
          maxHeight: "8vh",
          backgroundColor: "#1f88be",
          paddingTop: "4px",
        }}
      >
        <div className="row">
          <div className="col">
            <Link to="/user_leave">
              <img
                src={Leave}
                style={{ height: "7vh" }}
                className="img-fluid"
              />
            </Link>
          </div>
          <div className="col">
            <Link to="/payments_">
              <img
                src={Payments}
                style={{ height: "7vh" }}
                className="img-fluid"
              />
            </Link>
          </div>
          <div className="col">
            <Link to="/attendance_">
              <img
                src={Atten}
                style={{ height: "7vh" }}
                className="img-fluid"
              />
            </Link>
          </div>

          <div className="col">
            <Link to="/events_">
              <img
                src={Events}
                style={{ height: "7vh" }}
                className="img-fluid"
              />
            </Link>
          </div>

          <div className="col">
            <Link to="/home_dashboard">
              <img src={Home} style={{ height: "7vh" }} className="img-fluid" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default BtmNavbar;
