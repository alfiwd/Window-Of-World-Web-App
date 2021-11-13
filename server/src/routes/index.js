// Instantiate express module
const express = require("express");

// Init express router
const router = express.Router();

// Get controller
const { register, login, checkAuth } = require("../controllers/auth");
const { user, users, editUser, editUserProfile, deleteUser } = require("../controllers/user");
const { books, book, addBook, editBook, deleteBook } = require("../controllers/book");
const { addBookList, bookLists, deleteBookList } = require("../controllers/book_list");
const { addTransaction, editTransaction, transaction, transactions, deleteTransaction } = require("../controllers/transaction");

// Router middlewares
const { auth } = require("../../middlewares/auth");
const { uploadFiles } = require("../../middlewares/uploadFiles");
const { uploadFile } = require("../../middlewares/uploadFile");

// Router register
router.post("/register", register);

// Router login
router.post("/login", login);

// Router auth
router.get("/check-auth", auth, checkAuth);

// Route user
router.get("/user/:id", user);
router.get("/users", users);
router.put("/user/:id", editUser);
router.put("/edit-user-profile/:id", uploadFile("photo_profile"), editUserProfile);
router.delete("/user/:id", deleteUser);

// Route book
router.get("/books", books);
router.get("/book/:id", book);
router.post("/book", auth, uploadFiles("image_file", "book_file"), addBook);
router.put("/book/:id", auth, uploadFiles("image_file", "book_file"), editBook);
router.delete("/book/:id", auth, deleteBook);

// Route book list
router.post("/book-list", auth, addBookList);
router.delete("/book-list/:id", auth, deleteBookList);
router.get("/book-lists", auth, bookLists);

// Route transaction
router.post("/transaction", auth, uploadFile("transfer_proof"), addTransaction);
router.put("/transaction/:id", auth, uploadFile("transfer_proof"), editTransaction);
router.get("/transaction/:id", transaction);
router.get("/transactions", transactions);
router.delete("/transaction/:id", auth, deleteTransaction);

// Export module router
module.exports = router;
