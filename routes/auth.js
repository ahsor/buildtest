const express = require("express");
const { handleLogin, viewLogin , logout, registerUser, updateUser} = require('../controllers/auth.js');

const router = express.Router();
router.post('/register',  registerUser); 
router.post('/login',  handleLogin); 
router.patch('/update',  updateUser); 
router.get('/',  viewLogin); 
//router.delete('/',  deleteCookie); 
router.delete('/logout',  logout); 

module.exports = router; 


/**
  login : localhost:3000/auth/login
  register : localhost:3000/auth/register
  localhost:3000/auth/update
 */