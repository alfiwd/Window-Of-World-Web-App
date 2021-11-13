// Import package
import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalWaitingApprove(props) {
  return (
    <div>
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="text-center">
          <p style={{ color: "#D60000", fontSize: "24px" }}>Your transaction was canceled by admin. Please transaction again.</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
