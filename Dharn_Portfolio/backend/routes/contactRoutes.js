const express = require('express')
const contactRoutes = express.Router();
const createContact = require("../controllers/contactController")
const contactValidation = require('../validators/validators')
const validateRequest = require('../middlewares/validateRequest')

contactRoutes.route('/').post(contactValidation, validateRequest, createContact)


module.exports = contactRoutes