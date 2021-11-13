// Library
import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { HiOutlineChat } from "react-icons/hi";
import { VscChecklist } from "react-icons/vsc";
import { MdOutlinePostAdd } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";

// Assets and Stylesheets
import Logo from "../../assets/icon/icon.png";
import Styles from "../../stylesheets/HomePage.module.css";
import Admin from "../../assets/img/admin.png";

// Components
import ModalLogout from "../modal/ModalLogout";
import { UserContext } from "../../context/userContext";

export default function AdminNavigation() {
  const [state] = useContext(UserContext);
  const [modalLogout, setModalLogout] = useState(false);

  const history = useHistory();
  const handlePushHomePageAdmin = () => {
    history.push("/home-page-admin");
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center" style={{ marginBottom: "50px" }}>
        <img src={Logo} alt="..." className={Styles.logo} style={{ cursor: "pointer" }} onClick={handlePushHomePageAdmin} />
        <img src={Admin} alt="..." className={Styles.userPhoto} />
        <p className={Styles.name}>{state.user.full_name}</p>
      </div>
      <hr className={Styles.hr} />
      <div className={Styles.listMenu}>
        <div className="d-flex" style={{ margin: "60px 0" }}>
          <NavLink to="/add-book" style={{ color: "#929292", textDecoration: "none" }} activeStyle={{ color: "#D60000", textDecoration: "none" }}>
            <MdOutlinePostAdd size="2em" className="me-4" />
            Add Book
          </NavLink>
        </div>
        <div className="d-flex" style={{ margin: "60px 0" }}>
          <NavLink to="/list-transaction" style={{ color: "#929292", textDecoration: "none" }} activeStyle={{ color: "#D60000", textDecoration: "none" }}>
            <VscChecklist size="2em" className="me-4" />
            List Transaction
          </NavLink>
        </div>
        <div className="d-flex" style={{ margin: "60px 0" }}>
          <NavLink to="/complain-admin" style={{ color: "#929292", textDecoration: "none" }} activeStyle={{ color: "#D60000", textDecoration: "none" }}>
            <HiOutlineChat size="2em" className="me-4" />
            Chat Customer
          </NavLink>
        </div>
        <hr />
        <div className="d-flex" style={{ margin: "60px 0" }}>
          <p onClick={() => setModalLogout(true)} style={{ cursor: "pointer", color: "#929292" }}>
            <IoLogOutOutline size="2em" className="me-4" />
            Logout
          </p>
        </div>
      </div>

      <ModalLogout show={modalLogout} onHide={() => setModalLogout(false)} />
    </>
  );
}
