// Library
import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

// Assets
import TopFrame from "../assets/img/top-frame.png";

// Components
import UserNavigation from "../components/navigation/UserNavigation";
import ListBook from "../components/ListBook";
import ModalProfileNotComplete from "../components/modal/ModalProfileNotComplete";
import ModalTransactionCancel from "../components/modal/ModalTransactionCancel";

// User context
import { UserContext } from "../context/userContext";

// Import API
import { API } from "../config/api";

export default function HomePage() {
  const [state] = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [modalProfileNotComplete, setModalProfileNotComplete] = useState(false);
  const [modalTransactionCancel, setModalTransactionCancel] = useState(false);

  // Get user
  const getUser = async () => {
    try {
      const response = await API.get(`/user/${state.user.id}`);
      setProfile(response.data.data);
      const data = response.data.data;
      if (data.address === null || data.gender === null || data.phone_number === null || data.photo_profile === "http://localhost:5000/uploads/null") {
        setModalProfileNotComplete(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  // Get transaction
  const getTransaction = async () => {
    try {
      const response = await API.get(`/transaction/${state.user.id}`);
      if (response.data.data.transaction.payment_status === "Cancel") {
        setModalTransactionCancel(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTransaction();
  }, []);

  return (
    <>
      <Container fluid style={{ backgroundColor: "#e5e5e5", paddingTop: "30px", minHeight: "100vh" }}>
        <Row>
          <Col md={3}>
            <UserNavigation profile={profile} />
          </Col>
          <Col md={9}>
            <img src={TopFrame} alt="..." style={{ width: "85%", maxHeight: "40%", marginLeft: "20px" }} />
            <h2 className="my-3 fw-bold ms-5 mt-5 mb-4">List Books</h2>
            <ListBook />
          </Col>
        </Row>

        <ModalProfileNotComplete
          show={modalProfileNotComplete}
          onHide={() => {
            setModalProfileNotComplete(false);
          }}
        />

        <ModalTransactionCancel
          show={modalTransactionCancel}
          onHide={() => {
            setModalTransactionCancel(false);
          }}
        />
      </Container>
    </>
  );
}
