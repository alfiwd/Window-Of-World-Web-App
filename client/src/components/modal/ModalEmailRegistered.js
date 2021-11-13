// Import package
import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalEmailRegistered(props) {
  return (
    <>
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="text-center">
          <p style={{ color: "#D60000", fontSize: "24px", fontWeight: "bold" }}>Email has already registered!</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
