// Import package
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import { HiOutlineChat } from "react-icons/hi";

// Import assets and stylesheets
import Logo from "../../assets/icon/icon.png";
import Styles from "../../stylesheets/HomePage.module.css";
import User from "../../assets/img/user.png";

// Import components
import ModalLogout from "../modal/ModalLogout";

export default function UserNavigation(profile) {
  const [statusSubs, setStatusSubs] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const [nullProfile, setNullProfile] = useState(null);

  console.log(profile?.profile?.photo_profile === "http://localhost:5000/uploads/null");

  const history = useHistory();
  const handlePushHomePage = () => {
    history.push("/home-page");
  };

  const manipulation = () => {
    if (profile?.profile?.subscribe_status === true) {
      setStatusSubs(true);
    }
    if (profile?.profile?.photo_profile === "http://localhost:5000/uploads/null") {
      setNullProfile(true);
    } else {
      setNullProfile(false);
    }
  };
  useEffect(() => {
    manipulation();
  }, [profile]);

  let checkSubs = <p className={Styles.textSubs}>Not Subscribed Yet</p>;
  if (statusSubs) {
    checkSubs = <p className={Styles.textSubsDone}>Subscribed</p>;
  }

  return (
    <>
      <div className="d-flex flex-column align-items-center" style={{ marginBottom: "50px" }}>
        <img src={Logo} alt="..." className={Styles.logo} style={{ cursor: "pointer" }} onClick={handlePushHomePage} />
        {nullProfile ? <img src={User} alt="tes" className={Styles.userPhoto} /> : <img src={profile?.profile?.photo_profile} alt="..." className={Styles.userPhoto} />}
        <p className={Styles.name}>{profile?.profile?.full_name}</p>
        {checkSubs}
      </div>
      <hr className={Styles.hr} />
      <div className={Styles.listMenu}>
        <div className="d-flex" style={{ margin: "60px 0" }}>
          <NavLink to="/profile" style={{ color: "#929292", textDecoration: "none" }} activeStyle={{ color: "#D60000", textDecoration: "none" }}>
            <CgProfile size="2em" className="me-4" />
            Profile
          </NavLink>
        </div>
        <div className="d-flex" style={{ margin: "60px 0" }}>
          <NavLink to="/subscribe" style={{ color: "#929292", textDecoration: "none" }} activeStyle={{ color: "#D60000", textDecoration: "none" }}>
            <RiMoneyDollarBoxLine size="2em" className="me-4" />
            Subscribe
          </NavLink>
        </div>
        <div className="d-flex" style={{ margin: "60px 0" }}>
          <NavLink to="/complain-user" style={{ color: "#929292", textDecoration: "none" }} activeStyle={{ color: "#D60000", textDecoration: "none" }}>
            <HiOutlineChat size="2em" className="me-4" />
            Chat Admin
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
