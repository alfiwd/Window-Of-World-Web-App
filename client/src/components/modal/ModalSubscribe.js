// Import package
import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalSubscribe(props) {
  return (
    <div>
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="text-center">
          <p style={{ color: "#29BD11", fontSize: "24px" }}>Thank you for subscribing to premium, your premium package will be active after our admin approves your transaction, thank you</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
