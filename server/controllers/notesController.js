const Note = require('../models/Note');

// Create a new note
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        const note = await Note.create({
            title,
            content
        });

        console.log(`[Notes API] Created note in MongoDB with ID: ${note._id}`);

        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            data: {
                id: note._id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt
            }
        });
    } catch (error) {
        console.error('[Notes API] Error creating note:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating note',
            error: error.message
        });
    }
};

// Get all notes
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });

        console.log(`[Notes API] Retrieved ${notes.length} notes from MongoDB`);

        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes.map(note => ({
                id: note._id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt
            }))
        });
    } catch (error) {
        console.error('[Notes API] Error retrieving notes:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving notes',
            error: error.message
        });
    }
};

// Get a specific note by ID
exports.getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);

        if (!note) {
            console.log(`[Notes API] Note with ID ${id} not found in MongoDB`);
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        console.log(`[Notes API] Retrieved note from MongoDB with ID: ${id}`);

        res.status(200).json({
            success: true,
            data: {
                id: note._id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt
            }
        });
    } catch (error) {
        console.error('[Notes API] Error retrieving note:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving note',
            error: error.message
        });
    }
};

// Update a note
exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const note = await Note.findById(id);

        if (!note) {
            console.log(`[Notes API] Note with ID ${id} not found for update`);
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        // Update only provided fields
        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        note.updatedAt = Date.now();

        await note.save();

        console.log(`[Notes API] Updated note in MongoDB with ID: ${id}`);

        res.status(200).json({
            success: true,
            message: 'Note updated successfully',
            data: {
                id: note._id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt
            }
        });
    } catch (error) {
        console.error('[Notes API] Error updating note:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating note',
            error: error.message
        });
    }
};

// Delete a note
exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);

        if (!note) {
            console.log(`[Notes API] Note with ID ${id} not found for deletion`);
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        const deletedNote = {
            id: note._id,
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
        };

        await Note.findByIdAndDelete(id);

        console.log(`[Notes API] Deleted note from MongoDB with ID: ${id}`);

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully',
            data: deletedNote
        });
    } catch (error) {
        console.error('[Notes API] Error deleting note:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting note',
            error: error.message
        });
    }
};
