import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import notesRoute from './notesRoute.js';
import Note from '../models/Note.js';

// Create a test Express app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/api/v1', notesRoute);
  return app;
};

describe('Notes API Endpoints', () => {
  let app;
  let testNoteId;

  // Connect to test database before all tests
  beforeAll(async () => {
    const testDbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/bestcity_test';
    await mongoose.connect(testDbUri);
  });

  // Disconnect after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    app = createTestApp();
    // Clear the notes collection before each test
    await Note.deleteMany({});
  });

  describe('POST /api/v1/notes - Create Note', () => {
    it('should create a new note with valid data', async () => {
      const newNote = {
        title: 'Test Note',
        content: 'This is a test note content'
      };

      const response = await request(app)
        .post('/api/v1/notes')
        .send(newNote)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Note created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(newNote.title);
      expect(response.body.data.content).toBe(newNote.content);
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');

      // Save for use in other tests
      testNoteId = response.body.data.id;
    });

    it('should return 400 when title is missing', async () => {
      const invalidNote = {
        content: 'Content without title'
      };

      const response = await request(app)
        .post('/api/v1/notes')
        .send(invalidNote)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and content are required');
    });

    it('should return 400 when content is missing', async () => {
      const invalidNote = {
        title: 'Title without content'
      };

      const response = await request(app)
        .post('/api/v1/notes')
        .send(invalidNote)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and content are required');
    });

    it('should return 400 when both title and content are missing', async () => {
      const response = await request(app)
        .post('/api/v1/notes')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should create note with timestamps', async () => {
      const newNote = {
        title: 'Timestamped Note',
        content: 'Testing timestamps'
      };

      const response = await request(app)
        .post('/api/v1/notes')
        .send(newNote)
        .expect(201);

      const createdAt = new Date(response.body.data.createdAt);
      const updatedAt = new Date(response.body.data.updatedAt);

      expect(createdAt).toBeInstanceOf(Date);
      expect(updatedAt).toBeInstanceOf(Date);
      expect(createdAt.getTime()).toBeCloseTo(updatedAt.getTime(), -2);
    });
  });

  describe('GET /api/v1/notes - Get All Notes', () => {
    beforeEach(async () => {
      // Create some test notes
      await request(app)
        .post('/api/v1/notes')
        .send({ title: 'Note 1', content: 'Content 1' });

      await request(app)
        .post('/api/v1/notes')
        .send({ title: 'Note 2', content: 'Content 2' });
    });

    it('should return all notes', async () => {
      const response = await request(app)
        .get('/api/v1/notes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('count');
      expect(response.body.count).toBe(2);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should return notes with correct structure', async () => {
      const response = await request(app)
        .get('/api/v1/notes')
        .expect(200);

      const firstNote = response.body.data[0];
      expect(firstNote).toHaveProperty('id');
      expect(firstNote).toHaveProperty('title');
      expect(firstNote).toHaveProperty('content');
      expect(firstNote).toHaveProperty('createdAt');
      expect(firstNote).toHaveProperty('updatedAt');
    });

    it('should return empty array when no notes exist', async () => {
      // Clear all notes
      await Note.deleteMany({});

      const response = await request(app)
        .get('/api/v1/notes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    it('should return notes in descending order by createdAt', async () => {
      // Clear existing notes
      await Note.deleteMany({});

      // Create notes with slight delay
      await request(app).post('/api/v1/notes').send({ title: 'First', content: 'First content' });
      await new Promise(resolve => setTimeout(resolve, 10));
      await request(app).post('/api/v1/notes').send({ title: 'Second', content: 'Second content' });

      const response = await request(app).get('/api/v1/notes').expect(200);

      expect(response.body.data[0].title).toBe('Second');
      expect(response.body.data[1].title).toBe('First');
    });
  });

  describe('GET /api/v1/notes/:id - Get Note by ID', () => {
    let createdNoteId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/notes')
        .send({ title: 'Test Note', content: 'Test Content' });

      createdNoteId = response.body.data.id;
    });

    it('should return a note by valid ID', async () => {
      const response = await request(app)
        .get(`/api/v1/notes/${createdNoteId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBe(createdNoteId);
      expect(response.body.data.title).toBe('Test Note');
      expect(response.body.data.content).toBe('Test Content');
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId format

      const response = await request(app)
        .get(`/api/v1/notes/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Note not found');
    });

    it('should return 500 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/v1/notes/invalid-id')
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/notes/:id - Update Note', () => {
    let createdNoteId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/notes')
        .send({ title: 'Original Title', content: 'Original Content' });

      createdNoteId = response.body.data.id;
    });

    it('should update a note with valid data', async () => {
      const updatedData = {
        title: 'Updated Title',
        content: 'Updated Content'
      };

      const response = await request(app)
        .put(`/api/v1/notes/${createdNoteId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Note updated successfully');
      expect(response.body.data.title).toBe(updatedData.title);
      expect(response.body.data.content).toBe(updatedData.content);
    });

    it('should update only title', async () => {
      const response = await request(app)
        .put(`/api/v1/notes/${createdNoteId}`)
        .send({ title: 'New Title Only' })
        .expect(200);

      expect(response.body.data.title).toBe('New Title Only');
      expect(response.body.data.content).toBe('Original Content');
    });

    it('should update only content', async () => {
      const response = await request(app)
        .put(`/api/v1/notes/${createdNoteId}`)
        .send({ content: 'New Content Only' })
        .expect(200);

      expect(response.body.data.title).toBe('Original Title');
      expect(response.body.data.content).toBe('New Content Only');
    });

    it('should update the updatedAt timestamp', async () => {
      // Get original note
      const originalResponse = await request(app)
        .get(`/api/v1/notes/${createdNoteId}`)
        .expect(200);

      const originalUpdatedAt = new Date(originalResponse.body.data.updatedAt);

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));

      // Update note
      const updateResponse = await request(app)
        .put(`/api/v1/notes/${createdNoteId}`)
        .send({ title: 'Updated' })
        .expect(200);

      const newUpdatedAt = new Date(updateResponse.body.data.updatedAt);

      expect(newUpdatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should return 404 for non-existent note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .put(`/api/v1/notes/${fakeId}`)
        .send({ title: 'New Title' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Note not found');
    });
  });

  describe('DELETE /api/v1/notes/:id - Delete Note', () => {
    let createdNoteId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/notes')
        .send({ title: 'To Be Deleted', content: 'Delete me' });

      createdNoteId = response.body.data.id;
    });

    it('should delete a note', async () => {
      const response = await request(app)
        .delete(`/api/v1/notes/${createdNoteId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Note deleted successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBe(createdNoteId);
    });

    it('should actually remove the note from database', async () => {
      await request(app)
        .delete(`/api/v1/notes/${createdNoteId}`)
        .expect(200);

      // Try to get the deleted note
      const response = await request(app)
        .get(`/api/v1/notes/${createdNoteId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Note not found');
    });

    it('should return 404 when deleting non-existent note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/v1/notes/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Note not found');
    });

    it('should return deleted note data', async () => {
      const response = await request(app)
        .delete(`/api/v1/notes/${createdNoteId}`)
        .expect(200);

      expect(response.body.data.title).toBe('To Be Deleted');
      expect(response.body.data.content).toBe('Delete me');
    });
  });

  describe('Integration - Full CRUD Flow', () => {
    it('should support complete create-read-update-delete lifecycle', async () => {
      // 1. Create a note
      const createResponse = await request(app)
        .post('/api/v1/notes')
        .send({ title: 'Lifecycle Note', content: 'Testing CRUD' })
        .expect(201);

      const noteId = createResponse.body.data.id;

      // 2. Read the note
      const readResponse = await request(app)
        .get(`/api/v1/notes/${noteId}`)
        .expect(200);

      expect(readResponse.body.data.title).toBe('Lifecycle Note');

      // 3. Update the note
      const updateResponse = await request(app)
        .put(`/api/v1/notes/${noteId}`)
        .send({ title: 'Updated Lifecycle' })
        .expect(200);

      expect(updateResponse.body.data.title).toBe('Updated Lifecycle');

      // 4. Delete the note
      await request(app)
        .delete(`/api/v1/notes/${noteId}`)
        .expect(200);

      // 5. Verify deletion
      await request(app)
        .get(`/api/v1/notes/${noteId}`)
        .expect(404);
    });
  });
});
