// Import package
import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

// Import component
import ModalChangeTransactionSuccess from "../modal/ModalChangeTransactionSuccess";

// Import API
import { API } from "../../config/api";

export default function DropdownStatus(props) {
  const [modalShow, setModalShow] = useState(false);

  // Function onClick approved
  const approved = async () => {
    try {
      // Configuration
      const config = {
        header: {
          "Content-type": "multipart/form-data",
        },
      };
      const config2 = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Store data with FormData as Object
      const formData = new FormData();
      formData.set("remaining_active", 30);
      formData.set("user_status", "Active");
      formData.set("payment_status", "Approve");

      // Edit transaction
      const response = await API.put(`/transaction/${props.idTransaction}`, formData, config);

      // Update subscribe status
      const data = JSON.stringify({
        subscribe_status: true,
      });

      // Update data user
      await API.put(`/user/${response.data.data.transaction.users.id}`, data, config2);

      // Show modal
      setModalShow(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Function onClick cancel
  const cancel = async () => {
    try {
      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
      const config2 = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Store data with FormData as Object
      const formData = new FormData();
      formData.set("remaining_active", 0);
      formData.set("user_status", "Not Active");
      formData.set("payment_status", "Cancel");

      // Edit transaction
      const response = await API.put(`/transaction/${props.idTransaction}`, formData, config);

      // Update subscribe status
      const data = JSON.stringify({
        subscribe_status: false,
      });

      // Update data user
      await API.put(`/user/${response.data.data.transaction.users.id}`, data, config2);

      // Show modal
      setModalShow(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dropdown style={{ cursor: "pointer" }}>
        <Dropdown.Toggle as="p" className="text-primary text-center m-0 w-25"></Dropdown.Toggle>
        <Dropdown.Menu style={{ border: "none", boxShadow: "0 0 10px grey" }}>
          <Dropdown.Item onClick={approved} href="#" style={{ color: "#0ACF83", textAlign: "center" }}>
            Approved
          </Dropdown.Item>
          <Dropdown.Item onClick={cancel} href="#" style={{ color: "#FF0000", textAlign: "center" }}>
            Canceled
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <ModalChangeTransactionSuccess show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}
