// Library
import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router";

// Component
import { UserContext } from "../../context/userContext";

export default function ModalLogout(props) {
  // useContext
  const [_, dispatch] = useContext(UserContext);

  const history = useHistory();
  const handleLogout = () => {
    history.push("/");
    dispatch({
      type: "LOGOUT",
    });
  };
  return (
    <>
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="text-center">
          <p style={{ color: "#D60000", fontSize: "24px", fontWeight: "bold" }}>Are you sure to logout?</p>
          <Button variant="secondary" onClick={props.onHide}>
            No
          </Button>
          <Button variant="danger" style={{ backgroundColor: "#D60000", marginLeft: "10px" }} onClick={handleLogout}>
            Yes
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
