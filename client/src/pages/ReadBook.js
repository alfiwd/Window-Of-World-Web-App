// Import package
import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router";
import { ReactReader } from "react-reader";

// Import component
import IconWowOnly from "../components/IconWowOnly";

// Import API
import { API } from "../config/api";

export default function ReadBook() {
  // Get id from params
  let { id } = useParams();

  const [book, setBook] = useState(null);
  const [location, setLocation] = useState(null);
  const [page, setPage] = useState("");
  const renditionRef = useRef(null);
  const tocRef = useRef(null);

  const locationChanged = (epubcifi) => {
    setLocation(epubcifi);

    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start;
      const chapter = tocRef.current.find((item) => item.href === href);
      setPage(`Page ${displayed.page} of ${displayed.total} in chapter ${chapter ? chapter.label : "n/a"}`);
    }
  };

  const getBook = async () => {
    try {
      const response = await API.get(`/book/${id}`);
      setBook(response.data.data.book);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBook();
  }, []);

  return (
    <>
      <Container fluid style={{ backgroundColor: "#e5e5e5", paddingTop: "30px", paddingBottom: "10px" }}>
        <div>
          <IconWowOnly />
        </div>
        <div style={{ position: "relative", height: "100vh", boxShadow: "0 0 10px grey" }} className="position-relative w-75 mt-5 mb-5 mx-auto">
          <ReactReader location={location} getRendition={(rendition) => (renditionRef.current = rendition)} tocChanged={(toc) => (tocRef.current = toc)} locationChanged={locationChanged} url={book?.book_file} title={book?.title} />
          <div style={{ position: "absolute", bottom: "1rem", right: "1rem", left: "1rem", textAlign: "center", zIndex: 1 }}>{page}</div>
        </div>
      </Container>
    </>
  );
}
