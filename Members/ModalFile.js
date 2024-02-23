import React from "react";

import {Modal} from "semantic-ui-react";

const ModalFile = ({open, setOpen, certificate, Ename}) => {
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
            <h5 class="modal-title" id="exampleModalLabel">
              {Ename}
            </h5>
            <button
              type="button"
              style={{
                color: "white",
                backgroundColor: "#2185d2",
                border: "1px solid White",
              }}
              onClick={() => setOpen(false)}
              data-bs-dismiss="modal"
            >
              X
            </button>
          </div>
          <div class="modal-body">
            <iframe
              src={certificate}
              alt="certificate"
              style={{width: "100%", height: "50vh"}}
            ></iframe>
          </div>

          <div class="modal-footer">
            <button
              class="btn"
              style={{
                backgroundColor: "grey",
                color: "white",
              }}
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalFile;
