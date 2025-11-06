const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter note title'],
        trim: true,
        maxLength: [200, 'Note title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Please enter note content'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
noteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Check if model already exists to avoid OverwriteModelError
module.exports = mongoose.models.Note || mongoose.model('Note', noteSchema);
