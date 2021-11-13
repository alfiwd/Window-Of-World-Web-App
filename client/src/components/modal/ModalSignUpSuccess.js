// Import package
import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalSignUpSuccess(props) {
  return (
    <>
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="text-center">
          <p style={{ color: "#29BD11", fontSize: "24px", fontWeight: "bold" }}>Sign up success!. Please sign in.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
