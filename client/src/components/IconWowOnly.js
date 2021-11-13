// Import package
import React from "react";
import { useHistory } from "react-router";

// Import asset
import Logo from "../assets/icon/icon.png";

export default function IconWowOnly() {
  const history = useHistory();
  const handlePushHomePage = () => {
    history.push("/home-page");
  };
  return (
    <>
      <img src={Logo} alt="..." style={{ marginLeft: "175px", cursor: "pointer" }} onClick={handlePushHomePage} />
    </>
  );
}
