import { createContext, useReducer } from "react";

export const UserContext = createContext();

const initialState = {
  isLogin: false,
  user: {},
  subs: false,
  book: {},
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SIGN_UP_SUCCESS":
      return {
        isLogin: false,
        user: payload,
        subs: false,
        book: state.book,
      };
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", payload.token);
      return {
        isLogin: true,
        user: payload,
        subs: state.subs,
        book: state.book,
      };
    case "SUBS":
      return {
        isLogin: state.isLogin,
        user: state.user,
        subs: true,
        book: state.book,
      };
    case "BOOK_ADDED":
      return {
        isLogin: state.isLogin,
        user: state.user,
        subs: state.subs,
        book: payload,
      };
    case "AUTH_ERROR":
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        isLogin: false,
        user: {},
        subs: state.subs,
        book: state.book,
      };
    default:
      throw new Error();
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <UserContext.Provider value={[state, dispatch]}>{children}</UserContext.Provider>;
};
