const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  registeredUsers = users.filter((user) => user.username === username);
  return registeredUsers.length > 0 ? true : false;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.

  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!isValid(username)) {
    return res.status(300).json({ message: "not found  please register" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(300).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ data: password }, "secretkey");
  req.session.authorization = {
    token,
    username,
  };
  return res.status(200).json({ message: "Login successful" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.body;
  const user = req.user;

  if (!books[isbn]) {
    return res.status(300).json({ message: "Book not found" });
  }

  books[isbn].reviews[user.username] = review;

  return res.status(200).json({ message: "review added successfully" });
});


//Delete book review added by that particular user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const user = req.user;
  if (!books[isbn]) {
    return res.status(300).json({ message: "Book not found" });
  }
  delete books[isbn].reviews[user.username];
  return res.status(200).json({ message: "review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
