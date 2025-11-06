# BestCity API Documentation

## Overview

This document outlines the API structure for the BestCity platform, including both planned and implemented endpoints for the real estate investment platform.

## Base Configuration

### API Client Setup

```javascript
// services/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Notes API Endpoints (Implemented ✅)

### Overview
Simple CRUD API for managing notes with **MongoDB database storage**. Fully tested with 36 integration tests.

**Base URL:** `/api/v1/notes`

**Status:** ✅ Production-ready with MongoDB
- 36 tests passing (all with real MongoDB)
- MongoDB integration: `mongodb://localhost:27017/bestcity`
- Persistent data storage with Mongoose ODM
- Complete documentation available

**Recent Update (v1.3.0 - 2025-11-06):**
- ✅ Migrated from in-memory storage to MongoDB
- ✅ Data persists across server restarts
- ✅ MongoDB ObjectId support for IDs
- ✅ All tests updated to use real database

---

### Create Note
```
POST /api/v1/notes
```

**Request Body:**
```json
{
  "title": "My Note Title",
  "content": "Note content here"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": "690cdb0184dbe2c9bb43cab6",
    "title": "My Note Title",
    "content": "Note content here",
    "createdAt": "2025-11-06T12:55:33.994Z",
    "updatedAt": "2025-11-06T12:55:33.995Z"
  }
}
```

**Validation:**
- `title` (required, string, max 200 characters)
- `content` (required, string)

**Note:** The `id` field is a MongoDB ObjectId (24-character hex string)

**Errors:**
- `400` - Missing title or content

---

### Get All Notes
```
GET /api/v1/notes
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "690cdb0d84dbe2c9bb43cab9",
      "title": "Second Note",
      "content": "More content",
      "createdAt": "2025-11-06T17:29:49.722Z",
      "updatedAt": "2025-11-06T17:29:49.722Z"
    },
    {
      "id": "690cdb0184dbe2c9bb43cab6",
      "title": "First Note",
      "content": "Content here",
      "createdAt": "2025-11-06T17:29:37.002Z",
      "updatedAt": "2025-11-06T17:29:37.004Z"
    }
  ]
}
```

**Note:** Results are sorted by `createdAt` in descending order (newest first)

---

### Get Note by ID
```
GET /api/v1/notes/:id
```

**URL Parameters:**
- `id` (required, MongoDB ObjectId) - Note ID (24-character hex string)

**Example:** `GET /api/v1/notes/690cdb0184dbe2c9bb43cab6`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "690cdb0184dbe2c9bb43cab6",
    "title": "First Note",
    "content": "Content here",
    "createdAt": "2025-11-06T12:55:33.994Z",
    "updatedAt": "2025-11-06T12:55:33.995Z"
  }
}
```

**Errors:**
- `404` - Note not found

---

### Update Note
```
PUT /api/v1/notes/:id
```

**URL Parameters:**
- `id` (required, MongoDB ObjectId) - Note ID (24-character hex string)

**Example:** `PUT /api/v1/notes/690cdb0184dbe2c9bb43cab6`

**Request Body (partial updates supported):**
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "id": "690cdb0184dbe2c9bb43cab6",
    "title": "Updated Title",
    "content": "Updated content",
    "createdAt": "2025-11-06T12:55:33.994Z",
    "updatedAt": "2025-11-06T12:56:38.758Z"
  }
}
```

**Features:**
- Supports partial updates (update only title or only content)
- Automatically updates `updatedAt` timestamp
- Preserves `createdAt` timestamp

**Errors:**
- `404` - Note not found

---

### Delete Note
```
DELETE /api/v1/notes/:id
```

**URL Parameters:**
- `id` (required, MongoDB ObjectId) - Note ID (24-character hex string)

**Example:** `DELETE /api/v1/notes/690cdb0184dbe2c9bb43cab6`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": "690cdb0184dbe2c9bb43cab6",
    "title": "Deleted Note",
    "content": "This was deleted",
    "createdAt": "2025-11-06T12:55:33.994Z",
    "updatedAt": "2025-11-06T12:55:33.995Z"
  }
}
```

**Errors:**
- `404` - Note not found

---

### Notes API Testing

**Test Coverage (Updated v1.3.0):**
- 36 tests (all integration with MongoDB)
- All tests use real MongoDB database
- Separate test database: `bestcity_test`
- All CRUD operations tested with persistence
- Edge cases covered (empty strings, long content, special characters)
- Full integration flow tested

**Test Documentation:** See [NOTES_API_TESTS.md](./NOTES_API_TESTS.md)

**Example Frontend Usage:**
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/notes';

// Create note
const createNote = async (title, content) => {
  const response = await axios.post(API_URL, { title, content });
  return response.data;
  // Returns: { success: true, data: { id: "690cdb0184dbe2c9bb43cab6", ... } }
};

// Get all notes
const getAllNotes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
  // Returns: { success: true, count: 2, data: [...] }
};

// Update note (id is MongoDB ObjectId)
const updateNote = async (id, title, content) => {
  const response = await axios.put(`${API_URL}/${id}`, { title, content });
  return response.data;
  // Example: updateNote("690cdb0184dbe2c9bb43cab6", "New Title", "New Content")
};

// Delete note (id is MongoDB ObjectId)
const deleteNote = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
  // Example: deleteNote("690cdb0184dbe2c9bb43cab6")
};
```

**Note:** All `id` values are MongoDB ObjectIds (24-character hex strings), not integers.

**Frontend Page:** Available at `http://localhost:3000/notes`

---

## Authentication Endpoints

### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "64a7f9c8e5f1234567890abc",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a7f9c8e5f1234567890abc",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "walletAddress": "0x1234...5678"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Logout
```
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Verify Email
```
GET /api/auth/verify-email/:token
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

## Property Endpoints

### Get All Properties
```
GET /api/properties
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `type` (string) - Property type (villa, apartment, house)
- `minPrice` (number) - Minimum price in USD
- `maxPrice` (number) - Maximum price in USD
- `location` (string) - Location filter
- `minROI` (number) - Minimum ROI percentage
- `status` (string) - Funding status (new, active, almost_funded)
- `sortBy` (string) - Sort field (price, roi, funded)
- `sortOrder` (string) - Sort order (asc, desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "1",
        "title": "Modern Villa with Pool",
        "price": {
          "usd": 850000,
          "eth": 425
        },
        "location": "Beverly Hills, CA",
        "image": "https://...",
        "type": "villa",
        "roi": "7.2%",
        "metrics": {
          "totalInvestors": 142,
          "funded": "89%",
          "minInvestment": "$10",
          "monthlyIncome": "$520",
          "appreciation": "4.5%"
        },
        "status": "Active Investment",
        "tokenDetails": {
          "totalTokens": 85000,
          "availableTokens": 9350,
          "tokenPrice": "$10"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45,
      "itemsPerPage": 10
    }
  }
}
```

### Get Property by ID
```
GET /api/properties/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Modern Villa with Pool",
    "price": {
      "usd": 850000,
      "eth": 425
    },
    "location": "Beverly Hills, CA",
    "type": "villa",
    "roi": "7.2%",
    "description": "This stunning modern villa...",
    "features": [
      "Swimming Pool",
      "Smart Home System",
      "Gourmet Kitchen"
    ],
    "metrics": {
      "totalInvestors": 142,
      "funded": "89%",
      "minInvestment": "$10",
      "monthlyIncome": "$520",
      "appreciation": "4.5%",
      "rentalYield": "5.8%",
      "totalReturn": "10.3%"
    },
    "tokenDetails": {
      "totalTokens": 85000,
      "availableTokens": 9350,
      "tokenPrice": "$10",
      "tokenSymbol": "VILLA425",
      "contractAddress": "0x1234...5678",
      "blockchain": "Ethereum"
    },
    "financials": {
      "grossRent": "$8,500/month",
      "netRent": "$7,225/month",
      "expenses": {
        "management": "8%",
        "maintenance": "5%",
        "insurance": "2%",
        "property_tax": "1.2%"
      },
      "projectedAppreciation": "4.5% annually"
    },
    "images": [
      "https://...",
      "https://..."
    ],
    "agent": {
      "name": "John Doe",
      "phone": "+1 (555) 123-4567",
      "email": "john@realestate.com",
      "image": "https://..."
    },
    "yearBuilt": 2020,
    "parkingSpaces": 3,
    "lotSize": "0.5 acres"
  }
}
```

### Create Property (Admin)
```
POST /api/properties
```

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Modern Villa with Pool",
  "price": {
    "usd": 850000,
    "eth": 425
  },
  "location": "Beverly Hills, CA",
  "type": "villa",
  "description": "This stunning modern villa...",
  "features": ["Swimming Pool", "Smart Home System"],
  "tokenDetails": {
    "totalTokens": 85000,
    "tokenPrice": "$10"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": "1",
    "title": "Modern Villa with Pool"
  }
}
```

## Investment Endpoints

### Create Investment
```
POST /api/investments
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "propertyId": "1",
  "amount": 1000,
  "currency": "USD",
  "tokenCount": 100,
  "walletAddress": "0x1234...5678",
  "transactionHash": "0xabcd...efgh"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Investment created successfully",
  "data": {
    "investmentId": "64a7f9c8e5f1234567890xyz",
    "propertyId": "1",
    "amount": 1000,
    "tokenCount": 100,
    "status": "pending",
    "createdAt": "2025-11-06T10:30:00Z"
  }
}
```

### Get User Investments
```
GET /api/investments/user/:userId
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "investments": [
      {
        "investmentId": "64a7f9c8e5f1234567890xyz",
        "property": {
          "id": "1",
          "title": "Modern Villa with Pool",
          "image": "https://..."
        },
        "amount": 1000,
        "tokenCount": 100,
        "currentValue": 1050,
        "roi": "5%",
        "monthlyIncome": 52,
        "status": "active",
        "purchaseDate": "2025-11-06T10:30:00Z"
      }
    ],
    "portfolio": {
      "totalInvested": 5000,
      "currentValue": 5250,
      "totalReturn": "5%",
      "monthlyIncome": 260
    }
  }
}
```

## Wallet Endpoints

### Connect Wallet
```
POST /api/wallet/connect
```

**Request Body:**
```json
{
  "walletAddress": "0x1234...5678",
  "walletType": "MetaMask",
  "signature": "0xsignature..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Wallet connected successfully",
  "data": {
    "userId": "64a7f9c8e5f1234567890abc",
    "walletAddress": "0x1234...5678",
    "verified": true
  }
}
```

### Get Wallet Balance
```
GET /api/wallet/:address/balance
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "address": "0x1234...5678",
    "balances": {
      "ETH": "2.5",
      "USD": "4250"
    },
    "tokens": [
      {
        "symbol": "VILLA425",
        "balance": 100,
        "value": 1000
      }
    ]
  }
}
```

## Blog Endpoints

### Get All Posts
```
GET /api/blog/posts
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Posts per page
- `category` (string) - Filter by category
- `search` (string) - Search in title/content

**Response (200):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "1",
        "title": "The Future of Real Estate",
        "slug": "future-real-estate-crypto-payments",
        "excerpt": "Explore how cryptocurrency...",
        "image": "https://...",
        "category": "crypto",
        "author": "Sarah Johnson",
        "date": "2024-03-15",
        "readTime": "5 min read"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

### Get Post by Slug
```
GET /api/blog/posts/:slug
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "The Future of Real Estate",
    "slug": "future-real-estate-crypto-payments",
    "content": "<p>Full content...</p>",
    "image": "https://...",
    "category": "crypto",
    "author": {
      "name": "Sarah Johnson",
      "bio": "Real estate expert...",
      "image": "https://..."
    },
    "date": "2024-03-15",
    "readTime": "5 min read",
    "tags": ["Blockchain", "Real Estate"]
  }
}
```

## User Profile Endpoints

### Get User Profile
```
GET /api/users/:userId
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64a7f9c8e5f1234567890abc",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "walletAddress": "0x1234...5678",
    "kycStatus": "verified",
    "createdAt": "2025-11-06T00:00:00Z",
    "preferences": {
      "newsletter": true,
      "notifications": true,
      "theme": "dark"
    }
  }
}
```

### Update User Profile
```
PUT /api/users/:userId
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "preferences": {
    "newsletter": true,
    "notifications": false
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "64a7f9c8e5f1234567890abc",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## KYC Endpoints

### Submit KYC
```
POST /api/kyc/submit
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
firstName: John
lastName: Doe
dateOfBirth: 1990-01-01
address: 123 Main St
country: USA
idDocument: [File]
selfie: [File]
```

**Response (201):**
```json
{
  "success": true,
  "message": "KYC submitted successfully",
  "data": {
    "kycId": "64a7f9c8e5f1234567890xyz",
    "status": "pending",
    "submittedAt": "2025-11-06T10:30:00Z"
  }
}
```

### Get KYC Status
```
GET /api/kyc/status/:userId
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "verified",
    "submittedAt": "2025-11-06T10:30:00Z",
    "verifiedAt": "2025-01-07T14:20:00Z",
    "documents": [
      {
        "type": "id_document",
        "status": "approved"
      },
      {
        "type": "selfie",
        "status": "approved"
      }
    ]
  }
}
```

## Transaction Endpoints

### Get Transaction History
```
GET /api/transactions/user/:userId
```

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `type` (string) - investment, withdrawal, royalty

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "transactionId": "tx_123456",
        "type": "investment",
        "amount": 1000,
        "currency": "USD",
        "propertyId": "1",
        "propertyTitle": "Modern Villa with Pool",
        "status": "completed",
        "txHash": "0xabcd...efgh",
        "timestamp": "2025-11-06T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3
    }
  }
}
```

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Invalid request data |
| UNAUTHORIZED | 401 | Missing or invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

## Rate Limiting

- **Public endpoints:** 100 requests per minute
- **Authenticated endpoints:** 500 requests per minute
- **Admin endpoints:** 1000 requests per minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704537600
```

## Pagination

Standard pagination format for list endpoints:

**Query Parameters:**
```
?page=1&limit=10
```

**Response Format:**
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## WebSocket Events (Socket.io)

### Connection
```javascript
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Property Updates
```javascript
// Subscribe to property updates
socket.emit('subscribe:property', { propertyId: '1' });

// Listen for updates
socket.on('property:updated', (data) => {
  console.log('Property updated:', data);
});
```

### Investment Updates
```javascript
// Subscribe to investment updates
socket.emit('subscribe:investments', { userId: 'user123' });

// Listen for updates
socket.on('investment:status', (data) => {
  console.log('Investment status:', data);
});
```

### Royalty Payments
```javascript
// Listen for royalty payments
socket.on('royalty:paid', (data) => {
  console.log('Royalty received:', data);
});
```

## Frontend Service Implementation

### Properties Service
```javascript
// services/api/properties.js
import apiClient from './client';

export const propertiesService = {
  getAll: (params) => apiClient.get('/properties', { params }),
  getById: (id) => apiClient.get(`/properties/${id}`),
  create: (data) => apiClient.post('/properties', data),
  update: (id, data) => apiClient.put(`/properties/${id}`, data),
  delete: (id) => apiClient.delete(`/properties/${id}`)
};
```

### Investments Service
```javascript
// services/api/investments.js
import apiClient from './client';

export const investmentsService = {
  create: (data) => apiClient.post('/investments', data),
  getUserInvestments: (userId) => apiClient.get(`/investments/user/${userId}`),
  getById: (id) => apiClient.get(`/investments/${id}`)
};
```

### Web3 Service
```javascript
// services/web3Service.js
import { ethers } from 'ethers';

export const web3Service = {
  connectWallet: async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      return { provider, signer, address };
    }
    throw new Error('No wallet found');
  },

  getBalance: async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }
};
```

## API Versioning

Current API version: `v1`

Base URL format:
```
https://api.bestcity.com/v1/
```

## Authentication Flow

1. User registers → Receives JWT token
2. Token stored in localStorage
3. Token sent in Authorization header for protected routes
4. Token refresh before expiration
5. Logout clears token

## CORS Configuration

```javascript
// server/server.js
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

**Last Updated:** 2025-11-06
**API Version:** 1.0.0
**Base URL:** http://localhost:5000/api
