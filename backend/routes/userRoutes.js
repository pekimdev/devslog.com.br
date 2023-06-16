const express = require('express');

const usersController = require('../controllers/usersController.js');
const activateUser = require('../middleware/activateUser');
const tokenVerify = require('../middleware/tokenVerify.js');
const recoveryUser = require('../middleware/recoveryUser.js');
const resendToken = require('../middleware/resendToken.js')

const userRoutes = express.Router();


userRoutes.get('/users', usersController.getAllUsers)
userRoutes.get('/users/:id', usersController.getUserById)

userRoutes.post('/register', usersController.createUser)
userRoutes.post('/resend-token', resendToken)
userRoutes.get('/account-activate', activateUser)

userRoutes.post('/login', usersController.loginUser)
userRoutes.delete('/logout', usersController.logoutUser)


userRoutes.post('/forgot-password', usersController.recoverUser)
userRoutes.get('/account-recovery', recoveryUser)

//protected userRoutes
userRoutes.put('/users/:id', tokenVerify, usersController.updateUser)
userRoutes.delete('/users/:id', tokenVerify, usersController.deleteUser)


module.exports = userRoutes;

