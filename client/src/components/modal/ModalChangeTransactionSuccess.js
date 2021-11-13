// Import package
import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalChangeTransactionSuccess(props) {
  return (
    <>
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="text-center">
          <p style={{ color: "#29BD11", fontSize: "24px" }}>Change transaction success!</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
