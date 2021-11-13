// Import package
import React, { useContext, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useHistory } from "react-router";

// Import components
import { UserContext } from "../context/userContext";
import ModalNotSubscribe from "./modal/ModalNotSubscribe";

// Import API
import { API } from "../config/api";

export default function ListBook() {
  const [state] = useContext(UserContext);
  const [modalShowNotSubscribe, setModalShowNotSubscribe] = useState(false);
  const [books, setBooks] = useState([]);
  const [statusSubs, setStatusSubs] = useState(false);
  const history = useHistory();

  const showModalNotSubscribe = () => setModalShowNotSubscribe(true);

  // Function get user
  const getUser = async () => {
    try {
      // Get user logged in
      const response = await API.get(`/user/${state.user.id}`);

      // Checking subscribe status
      if (response.data.data.subscribe_status === true) {
        setStatusSubs(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  // Function get books
  const getBooks = async () => {
    try {
      const response = await API.get("/books");

      // Store book data to useState variable
      setBooks(response.data.data.books);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <>
      <div className="ms-3" style={{ width: "85%" }}>
        <Row>
          {books.map((data, index) => (
            <Col md={3} className="mb-4 text-center">
              <img
                src={data.image_file}
                alt="..."
                onClick={() => {
                  if (statusSubs) {
                    history.push(`/detail-book/${data.id}`);
                  } else {
                    showModalNotSubscribe();
                  }
                }}
                style={{ cursor: "pointer", borderRadius: "20px", boxShadow: "0 0 10px grey" }}
              />
              <h5 className="mt-4">{data.title}</h5>
              <p>{data.author}</p>
            </Col>
          ))}
        </Row>
      </div>
      <ModalNotSubscribe show={modalShowNotSubscribe} onHide={() => setModalShowNotSubscribe(false)} />
    </>
  );
}
