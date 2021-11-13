// Import package
import React from "react";
import { useHistory } from "react-router";

// Import asset
import Logo from "../assets/icon/icon.png";

export default function IconWowOnlyAdmin() {
  const history = useHistory();
  const handlePushHomePageAdmin = () => {
    history.push("/home-page-admin");
  };
  return (
    <>
      <img src={Logo} alt="..." style={{ marginLeft: "175px", cursor: "pointer" }} onClick={handlePushHomePageAdmin} />
    </>
  );
}
