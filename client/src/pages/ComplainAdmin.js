// Import package
import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";

// Import components
import AdminNavigation from "../components/navigation/AdminNavigation";
import Contact from "../components/complain/Contact";
import Chat from "../components/complain/Chat";

// Import user context
import { UserContext } from "../context/userContext";

// Import io
import { io } from "socket.io-client";
let socket;

export default function ComplainAdmin() {
  const [state] = useContext(UserContext);
  const [contact, setContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);

  // Socket io
  useEffect(() => {
    // Life cycle did mount
    socket = io("http://localhost:5000", {
      auth: {
        token: localStorage.getItem("token"),
      },
      query: {
        id: state.user.id,
      },
    });

    // Get message
    socket.on("new message", () => {
      socket.emit("load messages", contact?.id);
    });

    // Listen error sent from server
    socket.on("connect_error", (err) => {
      console.log(err.message);
    });

    // Load users contact
    loadContacts();

    // Load messages
    loadMessages();

    // Life cycle did unmount
    return () => {
      socket.disconnect();
    };
  }, [messages]);

  // Load contacts
  const loadContacts = () => {
    socket.emit("load user contacts");
    socket.on("user contacts", (data) => {
      data = data.map((item) => ({
        ...item,
        message: "Click here to start message",
      }));
      setContacts(data);
    });
  };

  // Handle on click contact
  const onClickContact = (data) => {
    setContact(data);
    socket.emit("load messages", data.id);
  };

  const loadMessages = (value) => {
    socket.on("messages", async (data) => {
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
        }));
        setMessages(dataMessages);
      }
    });
  };

  const onSendMessage = (e) => {
    if (e.key === "Enter") {
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      };
      socket.emit("send message", data);
      e.target.value = "";
    }
  };
  return (
    <>
      <Container fluid style={{ backgroundColor: "#e5e5e5", paddingTop: "30px", minHeight: "100vh" }}>
        <Row>
          <Col md={3}>
            <AdminNavigation />
          </Col>
          <Col md={9}>
            <Row>
              <Col md={3} className="px-3 border-end border-dark overflow-auto">
                <Contact dataContact={contacts} clickContact={onClickContact} contact={contact} />
              </Col>
              <Col md={9} style={{ height: "93vh" }} className="px-0">
                <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
