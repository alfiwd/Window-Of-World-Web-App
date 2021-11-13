// Import package
import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Form, Button } from "react-bootstrap";
import { TiEdit } from "react-icons/ti";

// Import components
import ModalConfirmDeleteBook from "../components/modal/ModalConfirmDeleteBook";
import ModalEditBookSuccess from "./modal/ModalEditBookSuccess";

// Import assets
import ForAdminIcon from "../assets/icon/for-admin-icon.svg";
import AttacheBookIcon from "../assets/icon/attache-book-icon.png";

// Import API
import { API } from "../config/api";

import Button2 from "@restart/ui/esm/Button";

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

export default function ListBook() {
  const [books, setBooks] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [idEdit, setIdEdit] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  // Change setState
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

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

  // Function get books
  const getBooks = async () => {
    try {
      const response = await API.get("/books");

      if (response.data.message === "Data not found!") {
        setIsEmpty(true);
      }

      // Store book data to useState variable
      setBooks(response.data.data.books);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBooks();
  }, []);

  // Function handle confirm delete
  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  // Function handle confirm edit
  const handleEdit = (id) => {
    setIdEdit(id);
    handleShowEdit();
  };

  // Function handle delete
  const deleteById = async (id) => {
    try {
      await API.delete(`/book/${id}`);

      // For update books
      getBooks();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (confirmDelete) {
      handleClose();
      deleteById(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  // Fetching detail book data by id
  const getBook = async (id) => {
    try {
      const response = await API.get(`/book/${id}`);

      // Store book data to useState
      setBookFile(response.data.data.book.book_file.replace("http://localhost:5000/uploads/", ""));
      setPreview(response.data.data.book.image_file);
      setForm({
        title: response.data.data.book.title,
        publication_date: response.data.data.book.publication_date,
        pages: response.data.data.book.pages,
        author: response.data.data.book.author,
        isbn: response.data.data.book.isbn,
        about: response.data.data.book.about,
        book_file: response.data.data.book.book_file.replace("http://localhost:5000/uploads/", ""),
        image_file: response.data.data.book.image_file.replace("http://localhost:5000/uploads/", ""),
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBook();
  }, []);

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

  // Handle submit
  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        header: {
          "Content-type": "multipart/form-data",
        },
      };

      // Store data with FormData as Object
      const formData = new FormData();
      formData.set("title", form.title);
      formData.set("publication_date", form.publication_date);
      formData.set("pages", form.pages);
      formData.set("author", form.author);
      formData.set("isbn", form.isbn);
      formData.set("about", form.about);
      if (form.book_file[0].name !== undefined && form.image_file[0].name === undefined) {
        formData.set("book_file", form.book_file[0], form.book_file[0].name);
        formData.set("image_file", form.image_file);
      } else if (form.book_file[0].name === undefined && form.image_file[0].name !== undefined) {
        formData.set("book_file", form.book_file);
        formData.set("image_file", form.image_file[0], form.image_file[0].name);
      } else if (form.image_file[0].name === undefined && form.image_file[0].name === undefined) {
        formData.set("book_file", form.book_file);
        formData.set("image_file", form.image_file);
      } else {
        formData.set("book_file", form.book_file[0], form.book_file[0].name);
        formData.set("image_file", form.image_file[0], form.image_file[0].name);
      }

      await API.put(`/book/${idEdit}`, formData, config);

      setShowEdit(false);
      setEditSuccess(true);

      // For update books
      getBooks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=" w-75 ms-3">
        {isEmpty ? (
          <img src={ForAdminIcon} alt="" style={{ margin: "100px 0 0 0px" }} />
        ) : (
          <>
            <Row style={{ marginTop: "50px" }}>
              <h2 className="" style={{ marginBottom: "50px" }}>
                List Books
              </h2>
              {books.map((data, index) => (
                <Col md={3} className="mb-5">
                  <img src={data.image_file} alt="..." style={{ borderRadius: "20px", boxShadow: "0 0 10px grey" }} />
                  <h5 className="mt-4">{data.title}</h5>
                  <p>{data.author}</p>
                  <Button
                    onClick={() => {
                      handleDelete(data.id);
                    }}
                    variant="danger"
                    style={{ width: "70px", marginRight: "10px", backgroundColor: "#D60000" }}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => {
                      handleEdit(data.id);
                      getBook(data.id);
                    }}
                    variant="warning"
                    style={{ width: "70px" }}
                  >
                    Edit
                  </Button>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>

      <Modal show={showEdit} onHide={handleCloseEdit} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body style={{ borderRadius: "50px !important" }}>
          <h2 style={{ margin: "10px 0 30px 0" }}>Edit Book</h2>
          <Form onSubmit={handleOnSubmit}>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="text" value={form.title} name="title" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="date" value={form.publication_date} name="publication_date" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="number" value={form.pages} name="pages" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="text" value={form.author} name="author" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control type="number" value={form.isbn} name="isbn" style={{ backgroundColor: "#D2D2D2" }} onChange={handleOnChange} />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Control as="textarea" value={form.about} name="about" style={{ backgroundColor: "#D2D2D2", height: "200px" }} onChange={handleOnChange} />
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
                  <img src={preview} alt="..." style={{ maxWidth: "200px", maxHeight: "200px", marginBottom: "25px" }} />
                </div>
              )}
              <Form.Label className="fw-bold p-2" htmlFor="imageFile" style={styles.formUpload}>
                Attache image file <img src={AttacheBookIcon} alt="icon" style={{ width: "20px", marginLeft: "23px" }} />
              </Form.Label>
              <Form.Control hidden type="file" id="imageFile" name="image_file" onChange={handleOnChange} />
            </Form.Group>
            <div className="read-book d-flex align-items-center p-2 rounded-3 ms-auto" style={{ cursor: "pointer", backgroundColor: "#D60000", width: "137px" }}>
              <Button2 type="submit" style={{ backgroundColor: "#D60000", border: "none", color: "white", fontWeight: "bold" }}>
                Edit Book <TiEdit size="1.5em" className="ms-2" />
              </Button2>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <ModalConfirmDeleteBook setConfirmDelete={setConfirmDelete} show={show} handleClose={handleClose} />
      <ModalEditBookSuccess show={editSuccess} onHide={() => setEditSuccess(false)} />
    </>
  );
}
