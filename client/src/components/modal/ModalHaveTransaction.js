// Import package
import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalHaveTransaction(props) {
  return (
    <div>
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="text-center">
          <p style={{ color: "#29BD11", fontSize: "24px" }}>You have made a transaction.</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
