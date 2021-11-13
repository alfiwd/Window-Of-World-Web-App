// Import package
import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { useHistory } from "react-router";
import { TiEdit } from "react-icons/ti";

// Import assets
import EmailIcon from "../assets/icon/email-icon.png";
import GenderIcon from "../assets/icon/gender-icon.png";
import PhoneIcon from "../assets/icon/phone-icon.png";
import LocationIcon from "../assets/icon/location-icon.png";
import AttacheBookIcon from "../assets/icon/attache-book-icon.png";
import User from "../assets/img/user.png";
import IconNoData from "../assets/icon/no-data.svg";

// Import components
import UserNavigation from "../components/navigation/UserNavigation";
import ModalConfirmDeleteBook from "../components/modal/ModalConfirmDeleteBook";
import ModalEditProfileSuccess from "../components/modal/ModalEditProfileSuccess";

// UseContext
import { UserContext } from "../context/userContext";

// Import API
import { API } from "../config/api";

const styles = {
  formUpload: {
    color: "#767F8D",
    cursor: "pointer",
    border: "2px solid #BCBCBC",
    borderRadius: "5px",
    width: "220px",
    backgroundColor: "#D2D2D2",
  },
};

export default function Profile() {
  const history = useHistory();
  const [state] = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [successEdit, setSuccessEdit] = useState(false);
  const [bookLists, setBookLists] = useState([]);
  const [preview, setPreview] = useState(null);
  const [nullProfile, setNullProfile] = useState(true);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    gender: "",
    phone_number: "",
    address: "",
    photo_profile: "",
  });

  // Get user
  const getUser = async () => {
    try {
      const response = await API.get(`/user/${state.user.id}`);
      setProfile(response.data.data);
      if (response.data.data.photo_profile === "http://localhost:5000/uploads/null") {
        setPreview(User);
      }
      if (response.data.data.photo_profile !== "http://localhost:5000/uploads/null") {
        setPreview(response.data.data.photo_profile);
        setNullProfile(false);
      }

      setForm({
        full_name: response.data.data.full_name,
        email: response.data.data.email,
        gender: response.data.data.gender,
        phone_number: response.data.data.phone_number,
        address: response.data.data.address,
        photo_profile: response.data.data.photo_profile.replace("http://localhost:5000/uploads/", ""),
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  // Get book lists
  const getBookLists = async () => {
    try {
      const response = await API.get("/book-lists");
      if (response.data.status === "success") {
        setBookLists(response.data.data);
      }
      if (response.data.status === "failed") {
        setIsEmpty(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBookLists();
  }, []);

  // Get transaction
  const getTransaction = async () => {
    try {
      const response = await API.get(`transaction/${state.user.id}`);
      if (response.data.data.transaction.user_status === "Not Active") {
        setIsEmpty(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTransaction();
  }, []);

  // Handle onChange
  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for privew
    if (e.target.name === "photo_profile") {
      if (e.target.files[0] === undefined) {
        setForm({
          ...form,
          photo_profile: "",
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
    e.preventDefault();

    // Configuration
    const config = {
      header: {
        "Content-type": "multipart/form-data",
      },
    };

    // Store data with FormData as Object
    const formData = new FormData();
    formData.set("full_name", form.full_name);
    formData.set("email", form.email);
    formData.set("gender", form.gender);
    formData.set("phone_number", form.phone_number);
    formData.set("address", form.address);
    if (form.photo_profile[0].name === undefined) {
      if (form.photo_profile === "http://localhost:5000/uploads/null") {
        formData.set("photo_profile", null);
      } else {
        formData.set("photo_profile", form.photo_profile.replace("http://localhost:5000/uploads/", ""));
      }
    } else {
      formData.set("photo_profile", form.photo_profile[0], form.photo_profile[0].name);
    }

    await API.put(`/edit-user-profile/${state.user.id}`, formData, config);

    getUser();

    setShowModal(false);
    setSuccessEdit(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    setIdDelete(id);
    setShow(true);
  };

  // Function delete by id
  const deleteById = async (id) => {
    try {
      await API.delete(`/book-list/${id}`);

      // For update book list
      getBookLists();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (confirmDelete) {
      setShow(false);
      deleteById(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  return (
    <>
      <Container fluid style={{ backgroundColor: "#e5e5e5", paddingTop: "30px", minHeight: "100vh" }}>
        <Row>
          <Col md={3}>
            <UserNavigation profile={profile} />
          </Col>
          <Col md={9}>
            <h2 className="my-4 ms-4 fw-bold">Profile</h2>
            <div style={{ backgroundColor: "#FFD9D9", padding: "20px", borderRadius: "10px", width: "82%", boxShadow: "0 0 20px grey", marginLeft: "23px" }}>
              <Row>
                <Col md={6}>
                  <div className="email d-flex mb-4">
                    <div className="email-icon my-auto me-3">
                      <img src={EmailIcon} alt="" style={{ with: "30px" }} />
                    </div>
                    <div className="text">
                      <p style={{ marginBottom: "0", fontWeight: "bold" }}>{profile?.email}</p>
                      <p style={{ marginBottom: "0", fontSize: "14px", color: "#8A8C90" }}>Email</p>
                    </div>
                  </div>
                  <div className="genre d-flex mb-4">
                    <div className="gender-icon my-auto me-3">
                      <img src={GenderIcon} alt="" style={{ with: "30px" }} />
                    </div>
                    <div className="text">
                      <p style={{ marginBottom: "0", fontWeight: "bold" }}>{profile?.gender}</p>
                      <p style={{ marginBottom: "0", fontSize: "14px", color: "#8A8C90" }}>Gender</p>
                    </div>
                  </div>
                  <div className="phone d-flex mb-4">
                    <div className="phone-icon my-auto me-3">
                      <img src={PhoneIcon} alt="" style={{ with: "30px" }} />
                    </div>
                    <div className="text">
                      <p style={{ marginBottom: "0", fontWeight: "bold" }}>{profile?.phone_number}</p>
                      <p style={{ marginBottom: "0", fontSize: "14px", color: "#8A8C90" }}>Mobile Phone</p>
                    </div>
                  </div>
                  <div className="location d-flex mb-4">
                    <div className="location-icon my-auto me-3">
                      <img src={LocationIcon} alt="" style={{ with: "30px", marginRight: "5px" }} />
                    </div>
                    <div className="text">
                      <p style={{ marginBottom: "0", fontWeight: "bold" }}>{profile?.address}</p>
                      <p style={{ marginBottom: "0", fontSize: "14px", color: "#8A8C90" }}>Address</p>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="ms-auto mt-3" style={{ width: "229px" }}>
                    <div>
                      {nullProfile ? (
                        <img src={User} alt="..." style={{ borderRadius: "5px", width: "227px", height: "202px" }} />
                      ) : (
                        <img src={profile?.photo_profile} alt="..." style={{ borderRadius: "5px", width: "227px", height: "202px" }} />
                      )}
                    </div>
                    <div className="mt-3">
                      <Button variant="danger" style={{ backgroundColor: "#D60000", width: "100%" }} onClick={() => setShowModal(true)}>
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <h2 className="mt-5 mb-4 ms-4 fw-bold">My List Book</h2>
            {isEmpty ? (
              <img src={IconNoData} alt="..." className="w-25 text-center" style={{ margin: "20px 0 0 300px" }} />
            ) : (
              <div style={{ width: "85%" }}>
                <Row>
                  {bookLists.map((data, index) => (
                    <Col md={3} className="mb-5 text-center">
                      <img
                        src={data.image_file}
                        alt="..."
                        style={{ cursor: "pointer", borderRadius: "20px", boxShadow: "0 0 10px gray" }}
                        onClick={() => {
                          history.push(`/read-book/${data.id}`);
                        }}
                      />
                      <h5 className="mt-4">{data.title}</h5>
                      <p>{data.author}</p>
                      <Button
                        variant="danger"
                        style={{ width: "70px", marginRight: "10px", backgroundColor: "#D60000" }}
                        onClick={() => {
                          handleDelete(data.id);
                        }}
                      >
                        Delete
                      </Button>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={setShowModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body style={{ borderRadius: "50px !important" }}>
          <h2 style={{ margin: "10px 0 30px 0" }}>Edit Profile</h2>
          <Form onSubmit={handleOnSubmit}>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="text" value={form.full_name} placeholder="Full Name" name="full_name" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="email" value={form.email} placeholder="Email" name="email" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} />
            </Form.Group>
            <Form.Select className="mb-4" value={form.gender} name="gender" style={{ backgroundColor: "#D2D2D2" }} aria-label="Default select example" onChange={handleOnChange}>
              <option disabled selected>
                Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="number" value={form.phone_number} placeholder="Phone Number" name="phone_number" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control as="textarea" value={form.address} placeholder="Address" name="address" style={{ backgroundColor: "#D2D2D2", height: "200px" }} onChange={handleOnChange} />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-4">
              {preview && (
                <div>
                  <img src={preview} style={{ maxWidth: "200px", maxHeight: "200px", marginBottom: "25px" }} />
                </div>
              )}
              <Form.Label className="fw-bold p-2" htmlFor="photoProfile" style={styles.formUpload}>
                Attache photo profile <img src={AttacheBookIcon} alt="icon" style={{ width: "20px", marginLeft: "13px" }} />
              </Form.Label>
              <Form.Control hidden type="file" id="photoProfile" name="photo_profile" onChange={handleOnChange} />
            </Form.Group>
            <div className="read-book d-flex justify-content-center p-1 rounded-3 ms-auto" style={{ cursor: "pointer", backgroundColor: "#D60000", width: "156px" }}>
              <Button type="submit" style={{ backgroundColor: "#D60000", border: "none", color: "white", fontWeight: "bold" }}>
                Edit Profile
                <TiEdit size="1.5em" className="ms-2" />
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <ModalEditProfileSuccess show={successEdit} onHide={setSuccessEdit} />
      <ModalConfirmDeleteBook
        setConfirmDelete={setConfirmDelete}
        show={show}
        handleClose={() => {
          setShow(false);
        }}
      />
    </>
  );
}
