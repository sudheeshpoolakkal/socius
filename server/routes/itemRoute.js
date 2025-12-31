import express from 'express'
import { addItem, listItem, getItemById, toggleAvailability } from '../controllers/itemController.js'
import authUser from '../middlewares/authUser.js' // Users manage items

const itemRouter = express.Router()

// Public Routes
itemRouter.get('/list', listItem)
itemRouter.get('/:itemId', getItemById)

import upload from '../middlewares/multer.js' // Handle file uploads

// Protected Routes (User must be logged in to add/manage items)
itemRouter.post('/add', authUser, upload.single('image'), addItem)
itemRouter.post('/toggle-availability', authUser, toggleAvailability)

export default itemRouter