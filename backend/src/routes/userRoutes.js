const express = require('express');
const userRoutes = express.Router();

const usersController = require('../controllers/usersController.js');
const activateUser = require('../email/activateUser');
const tokenVerify = require('../middleware/tokenVerify.js');
const recoveryUser = require('../email/recoveryUser.js')
const resendToken = require('../email/resendToken.js')



userRoutes.get('/users', usersController.getAllUsers)
userRoutes.get('/users/:username', usersController.getUserByUsername)

userRoutes.post('/register', usersController.createUser)
userRoutes.post('/resend-token', resendToken)
userRoutes.get('/account-activate', activateUser)

userRoutes.post('/login', usersController.loginUser)
userRoutes.delete('/logout', usersController.logoutUser)


userRoutes.post('/forgot-password', usersController.recoverUser)
userRoutes.get('/account-recovery', recoveryUser)

//protected userRoutes
userRoutes.put('/users/:id', tokenVerify, usersController.updateUser)
userRoutes.delete('/users/:id', tokenVerify, usersController.deleteUser);


module.exports = userRoutes;

