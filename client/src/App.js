// Import package
import { useContext, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";

// Import pages
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import HomePageAdmin from "./pages/HomePageAdmin";
import DetailBook from "./pages/DetailBook";
import ReadBook from "./pages/ReadBook";
import Subscribe from "./pages/Subscribe";
import Profile from "./pages/Profile";
import ListTransaction from "./pages/ListTransaction";
import AddBook from "./pages/AddBook";
import ComplainUser from "./pages/ComplainUser";
import ComplainAdmin from "./pages/ComplainAdmin";

// UserContext
import { UserContext } from "./context/userContext";

// Get API config & setAuthToken
import { API, setAuthToken } from "./config/api";

// Init token on axios every time the app is refreshed
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let history = useHistory();
  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    // Init token
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    // Redirect auth
    if (!state.isLogin) {
      history.push("/");
    } else {
      if (state.user.role === "admin") {
        history.push("/home-page-admin");
      } else {
        history.push("/home-page");
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // Get user data
      let payload = response.data.data.user;

      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "LOGIN_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/home-page" component={HomePage} />
      <Route path="/detail-book/:id" component={DetailBook} />
      <Route path="/read-book/:id" component={ReadBook} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/profile" component={Profile} />
      <Route path="/complain-user" component={ComplainUser} />
      <Route path="/list-transaction" component={ListTransaction} />
      <Route path="/add-book" component={AddBook} />
      <Route path="/home-page-admin" component={HomePageAdmin} />
      <Route path="/complain-admin" component={ComplainAdmin} />
      <Route exact path="*" component={NotFound} />
    </Switch>
  );
}

export default App;
