// Import package
import React, { useState, useContext } from "react";
import { Container, Button } from "react-bootstrap";
import { useHistory } from "react-router";

// Import assets
import PageNotFound from "../assets/img/page-not-found.svg";

// Import components
import LoadingAnimation from "../components/loading/LoadingAnimation";

// UserContext
import { UserContext } from "../context/userContext";

export default function NotFound() {
  const [state] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  setTimeout(() => setLoading(true), 2000);

  const handleOnClick = () => {
    if (!state.isLogin) {
      history.push("/");
    } else {
      if (state.user.role === "admin") {
        history.push("/home-page-admin");
      } else {
        history.push("/home-page");
      }
    }
  };

  return (
    <>
      {loading ? (
        <Container className="d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center mt-5">OOPS! Page Not Found</h1>
          <img src={PageNotFound} alt="" className="mt-5" />
          <Button variant="success" style={{ width: "20%", marginTop: "100px", fontWeight: "bold" }} onClick={handleOnClick}>
            Click here to back
          </Button>
        </Container>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
}
