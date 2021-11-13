// Library
import React from "react";
import HashLoader from "react-spinners/HashLoader";

const forLoading = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
};

export default function LoadingAnimation() {
  return (
    <>
      <HashLoader color={"#D60000"} size={100} margin={20} css={forLoading} />
    </>
  );
}
