// Import package
import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

// Import assets
import IconSmall from "../assets/icon/icon-small.png";
import UploadIcon from "../assets/icon/upload-icon.png";

// Import components
import UserNavigation from "../components/navigation/UserNavigation";
import ModalSubscribe from "../components/modal/ModalSubscribe";
import ModalInsertFile from "../components/modal/ModalInsertFile";
import ModalHaveTransaction from "../components/modal/ModalHaveTransaction";
import ModalWaitingApprove from "../components/modal/ModalWaitingApprove";
import { UserContext } from "../context/userContext";

// Import API
import { API } from "../config/api";

const styles = {
  formInputAccount: {
    backgroundColor: "#BCBCBC",
    color: "black",
  },
  formUpload: {
    color: "#D60000",
    cursor: "pointer",
    border: "2px solid #BCBCBC",
    borderRadius: "5px",
    width: "100%",
  },
  position: {
    marginTop: "225px",
    marginLeft: "200px",
  },
};

export default function Subscribe() {
  const [state] = useContext(UserContext);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowInsertFile, setModalShowInsertFile] = useState(false);
  const [modalShowWaiting, setModalShowWaiting] = useState(false);
  const [modalShowHaveTransaction, setModalShowHaveTransaction] = useState(false);
  const [preview, setPreview] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    account_number: "",
    transfer_proof: "",
  });

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

  // Handle onChange
  const handleOnChange = async (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for privew
    if (e.target.type === "file") {
      if (e.target.files[0] === undefined) {
        setForm({
          ...form,
          transfer_proof: "",
        });
        setPreview(null);
      } else {
        let url = URL.createObjectURL(e.target.files[0]);
        setPreview(url);
      }
    }
  };

  // Handle onSubmit
  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();

      if (form.transfer_proof === "") {
        setModalShowInsertFile(true);
      } else {
        const checkTransaction = await API.get(`/transaction/${state.user.id}`);
        if (checkTransaction.data.status === "failed") {
          // Configuration
          const config = {
            headers: {
              "Content-type": "multipart/form-data",
            },
          };

          // Store data with formData as object
          let formData = new FormData();
          formData.set("account_number", form.account_number);
          formData.set("transfer_proof", form.transfer_proof[0], form.transfer_proof[0].name);

          // Insert transaction data
          await API.post("/transaction", formData, config);

          setModalShow(true);
          setPreview(null);
          document.getElementById("account_number").value = "";
        } else {
          if (checkTransaction.data.data.transaction.payment_status === "Approve") {
            setModalShowHaveTransaction(true);
            setPreview(null);
            document.getElementById("account_number").value = "";
          } else if (checkTransaction.data.data.transaction.payment_status === "Pending") {
            setModalShowWaiting(true);
            setPreview(null);
            document.getElementById("account_number").value = "";
          } else {
            // Delete transaction data
            await API.delete(`/transaction/${state.user.id}`);

            // Configuration
            const config = {
              headers: {
                "Content-type": "multipart/form-data",
              },
            };

            // Store data with formData as object
            let formData = new FormData();
            formData.set("account_number", form.account_number);
            formData.set("transfer_proof", form.transfer_proof[0], form.transfer_proof[0].name);

            // Insert transaction data
            await API.post("/transaction", formData, config);

            setModalShow(true);
            setPreview(null);
            document.getElementById("account_number").value = "";
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container fluid style={{ backgroundColor: "#E5E5E5", paddingTop: "30px", height: "100vh" }}>
        <Row>
          <Col md={3}>
            <UserNavigation profile={profile} />
          </Col>
          <Col md={9}>
            <div className="d-flex flex-column justify-content-center align-items-center w-50" style={styles.position}>
              <h4 className="mb-5">Premium</h4>
              <p>
                Pay now and access all the latest books from <img src={IconSmall} alt=".." />
              </p>
              <p>
                <img src={IconSmall} alt=".." /> : 0981312323
              </p>
              <Form onSubmit={handleOnSubmit} className="w-50 mx-auto">
                <Form.Group className="mb-3 mt-2">
                  <Form.Control type="number" name="account_number" className="py-2" id="account_number" style={styles.formInputAccount} placeholder="Input your account number" onChange={handleOnChange} required />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                  {preview && (
                    <div>
                      <img src={preview} alt="..." style={{ maxWidth: "200px", maxHeight: "200px", margin: "5px 0 20px 0" }} />
                    </div>
                  )}
                  <Form.Label className="fw-bold p-2 mb-4" style={styles.formUpload}>
                    Attache proof of transfer <img src={UploadIcon} alt="icon" style={{ width: "5%", marginLeft: "124px" }} />
                  </Form.Label>
                  <Form.Control hidden type="file" name="transfer_proof" onChange={handleOnChange} />
                </Form.Group>
                <Button variant="danger" type="submit" style={{ backgroundColor: "#D60000", width: "100%" }}>
                  Subscribe
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      <ModalSubscribe show={modalShow} onHide={() => setModalShow(false)} />
      <ModalInsertFile show={modalShowInsertFile} onHide={() => setModalShowInsertFile(false)} />
      <ModalHaveTransaction show={modalShowHaveTransaction} onHide={() => setModalShowHaveTransaction(false)} />
      <ModalWaitingApprove show={modalShowWaiting} onHide={() => setModalShowWaiting(false)} />
    </>
  );
}
