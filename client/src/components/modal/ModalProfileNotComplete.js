// Import package
import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalProfileNotComplete(props) {
  return (
    <div>
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="text-center">
          <p style={{ color: "#FFC107", fontSize: "24px" }}>Your profile is not complete. Please complete your profile first by editing profile.</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
