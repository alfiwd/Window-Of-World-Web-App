// Import package
import { Modal, Button } from "react-bootstrap";

export default function ModalLogout({ show, handleClose, setConfirmDelete }) {
  const handleDelete = () => {
    setConfirmDelete(true);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="text-center">
          <p style={{ color: "#D60000", fontSize: "24px", fontWeight: "bold" }}>Are you sure to delete this book?</p>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="danger" style={{ backgroundColor: "#D60000", marginLeft: "10px" }} onClick={handleDelete}>
            Yes
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
