// Import package
import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

// Import Assets
import Admin from "../../assets/img/admin.png";
import LogoutIcon from "../../assets/icon/logout-icon.svg";
import { useHistory } from "react-router";

// Components
import ModalLogout from "../modal/ModalLogout";

export default function DropDownUserIcon(props) {
  const [modalLogout, setModalLogout] = useState(false);
  const history = useHistory();

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle as="p" style={{ width: "10%", border: "none", color: "#E5E5E5", backgroundColor: "#E5E5E5" }}>
          <img src={Admin} alt="..." style={{ width: "50px", height: "50px", margin: "0 172px 0 0", cursor: "pointer", borderRadius: "100%", border: "2px solid black" }} />
        </Dropdown.Toggle>
        <Dropdown.Menu align="end" style={{ border: "none" }}>
          <Dropdown.Item onClick={() => history.push(props.link)}>
            <img src={props.img} alt="..." style={{ width: "30px", display: "inline-block" }} />
            <p className="d-inline-block fw-bold ms-2">{props.text}</p>
          </Dropdown.Item>
          <hr />
          <Dropdown.Item href="#">
            <img src={LogoutIcon} alt="..." style={{ width: "30px", display: "inline-block" }} />
            <p className="d-inline-block fw-bold ms-2" onClick={() => setModalLogout(true)}>
              Logout
            </p>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <ModalLogout show={modalLogout} onHide={() => setModalLogout(false)} />
    </>
  );
}
