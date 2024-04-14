const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!isValid(username)){
    users.push({username, password});
    return res.status(200).json({message: "registration successful"});
  }
  return res.status(300).json({message: "user already exists"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});
 

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  if(!books[isbn]){
    return res.status(300).json({message: "Book not found"});
  }
  return res.status(200).json(books[isbn]);
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const {author} = req.params;
  if(!books[author]){
    return res.status(300).json({message: "Book not found"});
  }
  const keysArray = Object.keys(books);
  let result = {};
  keysArray.forEach((key) => {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  });
  return res.status(200).json(result);
});
 

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const {title} = req.params;
  const keysArray = Object.keys(books);
  let result = {};
  keysArray.forEach((key) => {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  });
  return res.status(200).json(result);
});
 

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  if(!books[isbn]){
    return res.status(300).json({message: "Book not found"});
  }
  return res.status(200).json(books[isbn].reviews);
});


// Get all books – Using async callback function 
public_users.get('/async',function (req, res,next) {
  //Write your code here
  async.map(Object.keys(books),function(key,callback){
    callback(null,books[key]);
  },function(err,result){
    if(err){
      next(err);
    }
    return res.status(200).json(result);
  });
});


// Search by ISBN – Using Promises 
public_users.get('/promise/:isbn',function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  const promise = new Promise((resolve,reject)=>{
    if(!books[isbn]){
      reject(new Error("Book not found"));
    }
    resolve(books[isbn]);
  });
  promise.then((data)=>{
    return res.status(200).json(data);
  }).catch((error)=>{
    return res.status(300).json({message: error.message});
  });
});

//Search by Author  - using promises
public_users.get('/author_promise/:author',function (req, res) {
  //Write your code here
  const {author} = req.params;
  const promise = new Promise((resolve,reject)=>{
    const keysArray = Object.keys(books);
    let result = {};
    keysArray.forEach((key) => {
      if (books[key].author === author) {
        result[key] = books[key];
      }
    });
    if(Object.keys(result).length === 0){
      reject(new Error("Book not found"));
    }
    resolve(result);
  });
  promise.then((data)=>{
    return res.status(200).json(data);
  }).catch((error)=>{
    return res.status(300).json({message: error.message});
  });
});

//Search by Title -using promises
public_users.get('/title_promise/:title',function (req, res) {
  //Write your code here
  const {title} = req.params;
  const promise = new Promise((resolve,reject)=>{
    const keysArray = Object.keys(books);
    let result = {};
    keysArray.forEach((key) => {
      if (books[key].title === title) {
        result[key] = books[key];
      }
    });
    if(Object.keys(result).length === 0){
      reject(new Error("Book not found"));
    }
    resolve(result);
  });
  promise.then((data)=>{
    return res.status(200).json(data);
  }).catch((error)=>{
    return res.status(300).json({message: error.message});
  });
});


module.exports.general = public_users;
