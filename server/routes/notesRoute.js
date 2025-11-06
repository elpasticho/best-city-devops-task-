const express = require('express');
const {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote
} = require('../controllers/notesController');

const router = express.Router();

// Create a new note
router.route('/notes').post(createNote);

// Get all notes
router.route('/notes').get(getAllNotes);

// Get a specific note by ID
router.route('/notes/:id').get(getNoteById);

// Update a note by ID
router.route('/notes/:id').put(updateNote);

// Delete a note by ID
router.route('/notes/:id').delete(deleteNote);

module.exports = router;
