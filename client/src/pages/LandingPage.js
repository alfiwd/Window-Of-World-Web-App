// Import package
import React, { useContext, useState } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";

// Import API config
import { API } from "../config/api";

// Import assets and stylesheets
import Logo from "../assets/icon/icon-large.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Styles from "../stylesheets/LandingPage.module.css";

// Import components
import ModalSignUpSuccess from "../components/modal/ModalSignUpSuccess";
import ModalEmailPasswordWrong from "../components/modal/ModalEmailPasswordWrong";
import ModalEmailRegistered from "../components/modal/ModalEmailRegistered";
import LoadingAnimation from "../components/loading/LoadingAnimation";

// User context
import { UserContext } from "../context/userContext";

export default function LandingPage() {
  // Declare useState
  const [modalShowSignUp, setModalShowSignUp] = useState(false);
  const [modalShowSignIn, setModalShowSignIn] = useState(false);
  const [modalSignUpSuccess, setModalSignUpSuccess] = useState(false);
  const [modalEmailPasswordWrong, setModalEmailPasswordWrong] = useState(false);
  const [modalEmailRegistered, setModalEmailRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  // Change setState
  const closeModalSignUp = () => setModalShowSignUp(false);
  const closeModalSignIn = () => setModalShowSignIn(false);
  const showModalSignUpSuccess = () => setModalSignUpSuccess(true);
  const showModalEmailPasswordWrong = () => setModalEmailPasswordWrong(true);
  const showModalEmailRegistered = () => setModalEmailRegistered(true);
  setTimeout(() => setLoading(true), 2000);

  // useContext
  const [_, dispatch] = useContext(UserContext);

  // All Function
  const handleOnSubmitSignIn = async (e) => {
    try {
      e.preventDefault();

      // Configration
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const body = JSON.stringify({
        email,
        password,
      });
      const response = await API.post("/login", body, config);

      // Checking process
      if (response.data.status === "success") {
        // Send data to useContext
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.user,
        });
      } else if (response.data.status === "failed") {
        showModalEmailPasswordWrong();
        closeModalSignIn();
      }
    } catch (error) {
      showModalEmailPasswordWrong();
      closeModalSignIn();
      console.log(error);
    }
  };
  const handleOnSubmitSignUp = async (e) => {
    try {
      e.preventDefault();

      // Configration
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const full_name = document.getElementById("full-name").value;
      const body = JSON.stringify({
        email,
        password,
        full_name,
      });

      const response = await API.post("/register", body, config);

      // Checking process
      if (response.data.message === "Email has already registered") {
        closeModalSignUp();
        showModalEmailRegistered();
      }
      if (response.data.status === "success") {
        closeModalSignUp();
        showModalSignUpSuccess();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div>
          {/* Container Landing Page */}
          <Container fluid id={Styles.landingPage}>
            <Row>
              <Col md={1}></Col>
              <Col md={5} className={Styles.size}>
                <img src={Logo} alt="..." />
                <p className={Styles.p}>Sign-up now and subscribe to enjoy all the cool and latest books - The best book rental service provider in Indonesia</p>
                <div className={Styles.allButton}>
                  <button className={`${Styles.allBtn} ${Styles.btnSignUp}`} onClick={() => setModalShowSignUp(true)}>
                    Sign Up
                  </button>
                  <button className={`${Styles.allBtn} ${Styles.btnSignIn}`} onClick={() => setModalShowSignIn(true)}>
                    Sign In
                  </button>
                </div>
              </Col>
              <Col md={6}></Col>
            </Row>
          </Container>
          {/* End Container Landing Page */}

          {/* Modal Sign Up */}
          <Modal show={modalShowSignUp} onHide={() => setModalShowSignUp(false)} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body style={{ borderRadius: "50px !important" }}>
              <h2 style={{ margin: "10px 0 30px 0" }}>Sign Up</h2>
              <Form onSubmit={handleOnSubmitSignUp}>
                <Form.Group className="mb-3">
                  <Form.Control type="email" id="email" style={{ backgroundColor: "#BCBCBC40" }} placeholder="Email" name="email" id="email" autoComplete="off" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="password" id="password" style={{ backgroundColor: "#BCBCBC40" }} placeholder="Password" name="password" autoComplete="off" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="text" id="full-name" style={{ backgroundColor: "#BCBCBC40" }} placeholder="Full Name" name="fullName" autoComplete="off" required />
                </Form.Group>
                <Button variant="danger" type="submit" style={{ width: "100%", backgroundColor: "#D60000", marginTop: "15px" }}>
                  Sign Up
                </Button>
                <Form.Group className="my-3">
                  <p className="text-center">
                    Already have an account? Klik{" "}
                    <b
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setModalShowSignUp(false);
                        setModalShowSignIn(true);
                      }}
                    >
                      Here
                    </b>
                  </p>
                </Form.Group>
              </Form>
            </Modal.Body>
          </Modal>
          {/* End Modal Sign Up */}

          {/* Modal Sign In */}
          <Modal show={modalShowSignIn} onHide={() => setModalShowSignIn(false)} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body>
              <h2 style={{ margin: "10px 0 30px 0" }}>Sign In</h2>
              <Form onSubmit={handleOnSubmitSignIn}>
                <Form.Group className="mb-3">
                  <Form.Control type="email" style={{ backgroundColor: "#BCBCBC40" }} placeholder="Email" name="email" id="email" autoComplete="off" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="password" style={{ backgroundColor: "#BCBCBC40" }} placeholder="Password" name="password" id="password" autoComplete="off" required />
                </Form.Group>
                <Button variant="danger" type="submit" style={{ width: "100%", backgroundColor: "#D60000" }}>
                  Sign In
                </Button>
                <Form.Group className="my-3">
                  <p className="text-center">
                    Don't have an account? Klik{" "}
                    <b
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setModalShowSignIn(false);
                        setModalShowSignUp(true);
                      }}
                    >
                      Here
                    </b>
                  </p>
                </Form.Group>
              </Form>
            </Modal.Body>
          </Modal>
          {/* End Modal Sign In */}

          {/* Modal Sign Up Success */}
          <ModalSignUpSuccess show={modalSignUpSuccess} onHide={() => setModalSignUpSuccess(false)} />
          {/* End Modal Sign Up Success */}

          {/* Modal Email Or Password Wrong */}
          <ModalEmailPasswordWrong show={modalEmailPasswordWrong} onHide={() => setModalEmailPasswordWrong(false)} />
          {/* End Modal Email Or Password Wrong */}

          {/* Modal Email Registered */}
          <ModalEmailRegistered show={modalEmailRegistered} onHide={() => setModalEmailRegistered(false)} />
          {/* End Modal Email Registered */}
        </div>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
}
