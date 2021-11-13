// Import package
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";

// Import components
import UserNavigation from "../components/navigation/UserNavigation";
import Contact from "../components/complain/Contact";
import Chat from "../components/complain/Chat";

// Import userContext
import { UserContext } from "../context/userContext";

// Import api
import { API } from "../config/api";

// Import io
import { io } from "socket.io-client";
let socket;

export default function ComplainUser() {
  const [state] = useContext(UserContext);
  const [profile, setProfile] = useState(null);
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

    // Load admin contact
    loadContact();

    // Load messages
    loadMessages();

    // Life cycle did unmount
    return () => {
      socket.disconnect();
    };
  }, [messages]);

  // Load contacts
  const loadContact = () => {
    socket.emit("load admin contact");
    socket.on("admin contact", (data) => {
      const dataContact = {
        ...data,
        message: messages.length > 0 ? messages[messages.length - 1].message : "Click here to start message",
      };
      setContacts([dataContact]);
    });
  };

  // Handle on click contact
  const onClickContact = (data) => {
    setContact(data);
    socket.emit("load messages", data.id);
  };

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
      <Container fluid style={{ backgroundColor: "#E5E5E5", paddingTop: "30px", height: "100vh" }}>
        <Row>
          <Col md={3}>
            <UserNavigation profile={profile} />
          </Col>
          <Col md={9}>
            <Row>
              <Col md={3} style={{ height: "93vh" }} className="px-3 border-end border-dark overflow-auto">
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
