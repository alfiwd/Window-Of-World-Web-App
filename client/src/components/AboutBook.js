// Import package
import React, { useState, useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { BsBookmarkCheck } from "react-icons/bs";
import { GrNext } from "react-icons/gr";

// Import components
import { UserContext } from "../context/userContext";
import ModalAddBookToList from "./modal/ModalAddBookToList";

// Import API
import { API } from "../config/api";

export default function AboutBook() {
  // Get id from params
  let { id } = useParams();

  // All state
  const [state] = useContext(UserContext);
  const [isEmpty, setIsEmpty] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [book, setBook] = useState({});
  const [publicationDate, setPublicationDate] = useState(null);

  // Get book
  const getBook = async (id) => {
    try {
      const response = await API.get(`/book/${id}`);
      setBook(response.data.data.book);
      setPublicationDate(response.data.data.book.publication_date.replace(/T00:00:00.000Z/g, ""));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBook(id);
  }, []);

  // Handle onClick add book list
  const handleAddBookList = async (e) => {
    try {
      // Configuration
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Store data with formData as object
      let formData = new FormData();
      formData.set("user_id", state.user.id);
      formData.set("book_id", book.id);

      const data = JSON.stringify({
        user_id: state.user.id,
        book_id: book.id,
      });

      // Add book to book list
      await API.post("/book-list", data, config);

      // Show modal
      handleShowModal();

      e.target.parentElement.parentElement.style.display = "none";
    } catch (error) {
      console.log(error);
    }
  };

  // Read book
  const history = useHistory();
  const handlePushReadBook = () => {
    history.push(`/read-book/${book.id}`);
  };

  // Get book list
  const getBookList = async () => {
    try {
      const response = await API.get("/book-lists");
      let datas = response.data.data;
      datas = datas.filter((item) => {
        return item.id === parseInt(id);
      });
      if (id == datas[0].id) {
        setIsEmpty(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBookList();
  }, []);

  const handleShowModal = () => setModalShow(true);
  return (
    <>
      <div className="d-flex align-items-center" style={{ height: "100vh", width: "70%" }}>
        <div className="">
          <div className="d-flex">
            <div className="me-5">
              <img src={book.image_file} alt="" style={{ width: "300px", borderRadius: "20px", boxShadow: "0 0 10px grey" }} className="img-fluid" />
            </div>
            <div>
              <div className="list">
                <h1>{book.title}</h1>
                <p>{book.author}</p>
              </div>
              <div className="list">
                <h3>Publication Date</h3>
                <p>{publicationDate}</p>
              </div>
              <div className="list">
                <h3>Pages</h3>
                <p>{book.pages}</p>
              </div>
              <div className="list">
                <h3>ISBN</h3>
                <p>{book.isbn}</p>
              </div>
            </div>
          </div>
          <div className="aboutBook mt-5">
            <h2 className="mb-3">About This Book</h2>
            <p style={{ textAlign: "justify" }}>{book.about}</p>
          </div>
          <div className="mt-5 d-flex justify-content-end">
            {isEmpty ? (
              <div>
                <div className="add-my-list d-flex align-items-center p-2 rounded-3 me-3 text-white fw-bold" style={{ cursor: "pointer", backgroundColor: "#D60000" }} onClick={handleAddBookList}>
                  <p className="my-auto me-2">Add My List</p>
                  <BsBookmarkCheck size="1.3em" />
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="read-book bg-secondary d-flex align-items-center p-2 rounded-3 text-black fw-bold" style={{ cursor: "pointer" }} onClick={handlePushReadBook}>
              <p className="my-auto me-2">Read Book</p>
              <GrNext size="1.3em" />
            </div>
          </div>
        </div>
      </div>

      <ModalAddBookToList show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}
