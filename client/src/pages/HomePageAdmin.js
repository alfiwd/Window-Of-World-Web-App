// Import package
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

// Import Components
import AdminNavigation from "../components/navigation/AdminNavigation";
import ListBookAdmin from "../components/ListBookAdmin";

export default function HomePageAdmin() {
  return (
    <>
      <Container fluid style={{ backgroundColor: "#e5e5e5", paddingTop: "30px", minHeight: "100vh" }}>
        <Row>
          <Col md={3}>
            <AdminNavigation />
          </Col>
          <Col md={9} className="d-flex align-items-center text-center">
            <ListBookAdmin />
          </Col>
        </Row>
      </Container>
    </>
  );
}
