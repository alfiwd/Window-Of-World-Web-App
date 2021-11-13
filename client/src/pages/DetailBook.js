// Library
import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

// Components
import UserNavigation from "../components/navigation/UserNavigation";
import AboutBook from "../components/AboutBook";

// Import userContext
import { UserContext } from "../context/userContext";

// Import API
import { API } from "../config/api";

export default function DetailBook() {
  const [state] = useContext(UserContext);
  const [profile, setProfile] = useState(null);

  // Get user
  const getUser = async () => {
    try {
      const response = await API.get(`/user/${state.user.id}`);
      setProfile(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Container fluid style={{ backgroundColor: "#e5e5e5" }}>
        <Row>
          <Col md={3} style={{ paddingTop: "30px" }}>
            <UserNavigation profile={profile} />
          </Col>
          <Col md={9}>
            <AboutBook />
          </Col>
        </Row>
      </Container>
    </>
  );
}
