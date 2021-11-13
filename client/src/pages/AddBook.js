// Import package
import React, { useState } from "react";
import { Container, Form } from "react-bootstrap";

// Import assets
import AddBookIcon from "../assets/icon/add-book-icon.png";
import AttacheBookIcon from "../assets/icon/attache-book-icon.png";
import ListTransaction from "../assets/icon/subs-icon.png";

// Import components
import IconWowOnlyAdmin from "../components/IconWowOnlyAdmin";
import DropdownUserIcon from "../components/dropdown/DropdownUserIcon";
import ModalAddBookSuccess from "../components/modal/ModalAddBookSuccess";
import ModalInsertFile from "../components/modal/ModalInsertFile";
import Button from "@restart/ui/esm/Button";

// Import API
import { API } from "../config/api";

const styles = {
  formUpload: {
    color: "#767F8D",
    cursor: "pointer",
    border: "2px solid #BCBCBC",
    borderRadius: "5px",
    width: "205px",
    backgroundColor: "#D2D2D2",
  },
};

export default function AddBook() {
  const [showModal, setShowModal] = useState(false);
  const [modalShowInsertFile, setModalShowInsertFile] = useState(false);
  const [preview, setPreview] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    publication_date: "",
    pages: "",
    author: "",
    isbn: "",
    about: "",
    book_file: "",
    image_file: "",
  });

  // Handle onChange
  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for privew
    if (e.target.name === "book_file") {
      if (e.target.files[0] === undefined) {
        setForm({
          ...form,
          book_file: "",
        });
        setBookFile(null);
      } else {
        let text = e.target.files[0].name;
        setBookFile(text);
      }
    }
    if (e.target.name === "image_file") {
      if (e.target.files[0] === undefined) {
        setForm({
          ...form,
          image_file: "",
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

      if (form.book_file === "") {
        setModalShowInsertFile(true);
      }
      if (form.image_file === "") {
        setModalShowInsertFile(true);
      }
      if (form.book_file && form.image_file === "") {
        setModalShowInsertFile(true);
      }

      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // Store data with formData as object
      let formData = new FormData();
      formData.set("title", form.title);
      formData.set("publication_date", form.publication_date);
      formData.set("pages", form.pages);
      formData.set("author", form.author);
      formData.set("isbn", form.isbn);
      formData.set("about", form.about);
      formData.set("book_file", form.book_file[0], form.book_file[0].name);
      formData.set("image_file", form.image_file[0], form.image_file[0].name);

      // Insert book data
      await API.post("/book", formData, config);

      setShowModal(true);
      setPreview(null);
      setBookFile(null);
      document.getElementById("title").value = "";
      document.getElementById("publication_date").value = "";
      document.getElementById("pages").value = "";
      document.getElementById("author").value = "";
      document.getElementById("isbn").value = "";
      document.getElementById("about").value = "";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container fluid style={{ backgroundColor: "#E5E5E5", paddingTop: "30px", paddingBottom: "54px" }}>
        <div className="d-flex justify-content-between">
          <IconWowOnlyAdmin />
          <DropdownUserIcon link={"/list-transaction"} text={"List Transaction"} img={ListTransaction} />
        </div>
        <div className="mx-auto" style={{ marginTop: "50px", width: "60%" }}>
          <h4 style={{ marginBottom: "50px" }}>Add Book</h4>
          <Form onSubmit={handleOnSubmit}>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="text" id="title" placeholder="Title" name="title" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} required />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="date" id="publication_date" placeholder="Publication Date" name="publication_date" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} required />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="number" id="pages" placeholder="Pages" name="pages" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} required />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="text" id="author" placeholder="Author" name="author" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} required />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="number" id="isbn" placeholder="ISBN" name="isbn" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} required />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control as="textarea" id="about" placeholder="About This Book" name="about" style={{ backgroundColor: "#D2D2D2", height: "200px" }} onChange={handleOnChange} required />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-4">
              {bookFile && (
                <div>
                  <p>{bookFile}</p>
                </div>
              )}
              <Form.Label className="fw-bold p-2" htmlFor="bookFile" style={styles.formUpload}>
                Attache book file <img src={AttacheBookIcon} alt="icon" style={{ width: "20px", marginLeft: "31px" }} />
              </Form.Label>
              <Form.Control hidden type="file" id="bookFile" name="book_file" onChange={handleOnChange} />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-4">
              {preview && (
                <div>
                  <img src={preview} alt="..." style={{ maxWidth: "300px", maxHeight: "300px", marginBottom: "25px", borderRadius: "10px", boxShadow: "0px 0px 10px grey" }} />
                </div>
              )}
              <Form.Label className="fw-bold p-2" htmlFor="imageFile" style={styles.formUpload}>
                Attache image file <img src={AttacheBookIcon} alt="icon" style={{ width: "20px", marginLeft: "23px" }} />
              </Form.Label>
              <Form.Control hidden type="file" id="imageFile" name="image_file" onChange={handleOnChange} />
            </Form.Group>
            <div className="read-book d-flex align-items-center p-2 rounded-3 ms-auto" style={{ cursor: "pointer", backgroundColor: "#D60000", width: "140px" }}>
              <Button type="submit" style={{ backgroundColor: "#D60000", border: "none", color: "white", fontWeight: "bold" }}>
                Add Book <img src={AddBookIcon} alt="..." className="ms-2" />
              </Button>
            </div>
          </Form>
        </div>
      </Container>

      <ModalAddBookSuccess show={showModal} onHide={setShowModal} />
      <ModalInsertFile show={modalShowInsertFile} onHide={() => setModalShowInsertFile(false)} />
    </>
  );
}
