// Import package
import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalWaitingApprove(props) {
  return (
    <div>
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="text-center">
          <p style={{ color: "#FFC107", fontSize: "24px" }}>Your transaction is being process by admin. Please wait.</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
