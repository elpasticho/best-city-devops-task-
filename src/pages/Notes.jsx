import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/notes';

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch all notes
    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            console.log('Fetched notes:', response.data);
            setNotes(response.data.data || []);
            setMessage(`✓ Loaded ${response.data.count} notes`);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setMessage(`✗ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Create a new note
    const createNote = async (e) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            setLoading(true);
            const response = await axios.post(API_URL, { title, content });
            console.log('Created note:', response.data);
            setMessage(`✓ Created: ${response.data.data.title}`);
            setTitle('');
            setContent('');
            fetchNotes();
        } catch (error) {
            console.error('Error creating note:', error);
            setMessage(`✗ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Update a note
    const updateNote = async (e) => {
        e.preventDefault();
        if (!title || !content || !editingId) return;

        try {
            setLoading(true);
            const response = await axios.put(`${API_URL}/${editingId}`, { title, content });
            console.log('Updated note:', response.data);
            setMessage(`✓ Updated: ${response.data.data.title}`);
            setTitle('');
            setContent('');
            setEditingId(null);
            fetchNotes();
        } catch (error) {
            console.error('Error updating note:', error);
            setMessage(`✗ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Delete a note
    const deleteNote = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            setLoading(true);
            const response = await axios.delete(`${API_URL}/${id}`);
            console.log('Deleted note:', response.data);
            setMessage(`✓ Deleted: ${response.data.data.title}`);
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
            setMessage(`✗ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Edit button handler
    const handleEdit = (note) => {
        setEditingId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setMessage(`Editing: ${note.title}`);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
        setMessage('Edit cancelled');
    };

    // Load notes on component mount
    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div className="min-h-screen py-20 section-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-heading mb-4">Notes App</h1>
                    <p className="text-body">Simple CRUD API Test - Check console for logs</p>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.startsWith('✓') ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
                        {message}
                    </div>
                )}

                {/* Create/Update Form */}
                <div className="card p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-heading mb-4">
                        {editingId ? 'Edit Note' : 'Create New Note'}
                    </h2>
                    <form onSubmit={editingId ? updateNote : createNote}>
                        <div className="mb-4">
                            <label className="block text-body font-medium mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-secondary-700 text-heading border-secondary-300 dark:border-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter note title"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-body font-medium mb-2">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows="4"
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-secondary-700 text-heading border-secondary-300 dark:border-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter note content"
                                required
                            ></textarea>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Processing...' : editingId ? 'Update Note' : 'Create Note'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-6 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={fetchNotes}
                                className="px-6 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Refresh
                            </button>
                        </div>
                    </form>
                </div>

                {/* Notes List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-heading mb-4">
                        All Notes ({notes.length})
                    </h2>

                    {loading && notes.length === 0 ? (
                        <div className="card p-8 text-center">
                            <p className="text-body">Loading notes...</p>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="card p-8 text-center">
                            <p className="text-body">No notes yet. Create your first note above!</p>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div key={note.id} className="card p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-semibold text-heading">{note.title}</h3>
                                    <span className="text-sm text-muted">ID: {note.id}</span>
                                </div>
                                <p className="text-body mb-4 whitespace-pre-wrap">{note.content}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-muted">
                                        <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
                                        <p>Updated: {new Date(note.updatedAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(note)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteNote(note.id)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
