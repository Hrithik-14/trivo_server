# TrivoGroup Backend API Documentation

## Overview
This is the backend API for the TrivoGroup project management system, built with Express.js and MongoDB. It provides RESTful endpoints for managing projects, employees, tasks, and authentication.

## Tech Stack
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **File Storage**: Cloudinary for image uploads
- **Email Service**: Nodemailer for notifications

## Project Structure
```
trivo_server/
├── src/
│   ├── controllers/
│   │   ├── auth.ts           # Authentication endpoints
│   │   ├── project.ts        # Project management
│   │   ├── search.ts         # Search functionality
│   │   └── ...               # Other controllers
│   ├── models/
│   │   ├── user.ts           # User model
│   │   ├── project.ts        # Project model
│   │   ├── task.ts           # Task model
│   │   └── ...               # Other models
│   ├── routes/
│   │   ├── authRoutes.ts     # Authentication routes
│   │   ├── projectRoutes.ts  # Project routes
│   │   └── ...               # Other routes
│   ├── middleware/
│   │   ├── authMiddleware.ts # JWT verification
│   │   ├── errorMiddleware.ts # Error handling
│   │   └── upload.ts         # File upload handling
│   └── configs/
│       ├── db.ts             # Database configuration
│       └── cloudinary.ts     # Cloudinary configuration
```

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### Project Management Endpoints
- `GET /api/projects` - Get all projects (paginated)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Employee Management Endpoints
- `GET /api/employees` - Get all employees (paginated)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Search Endpoints
- `GET /api/search?query=&role=` - Search users by name and role
- `GET /api/projectManagerSearch/:managerId?query=` - Search manager's projects
- `GET /api/search/projects?query=` - Search all projects

### Task Management Endpoints
- `POST /api/manager/addTask` - Add task to project
- `GET /api/tasks/project/:projectId` - Get project tasks
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Database Models

### User Model
```typescript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: 'admin' | 'manager' | 'employee',
  designation: String,
  employeeCode: String,
  profileImage: String,
  managerId: ObjectId,
  dateOfBirth: Date,
  phoneNumber: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```typescript
{
  _id: ObjectId,
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  managerId: ObjectId,
  members: [ObjectId], // Array of user IDs
  tasks: [ObjectId], // Array of task IDs
  client: String,
  clientEmail: String,
  status: 'ongoing' | 'completed',
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```typescript
{
  _id: ObjectId,
  projectId: ObjectId,
  assignedTo: ObjectId, // User ID
  title: String,
  description: String,
  status: 'pending' | 'in-progress' | 'completed',
  priority: 'low' | 'medium' | 'high',
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Search Functionality

### User Search
The search system provides real-time user search with role filtering:

**Endpoint**: `GET /api/search?query=john&role=employee`

**Query Parameters**:
- `query`: Search term (searches in name field)
- `role`: Filter by user role (admin/manager/employee)

**Response**:
```json
{
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "role": "employee",
      "employeeCode": "EMP001"
    }
  ]
}
```

### Project Search
Search projects by manager with optional query filtering:

**Endpoint**: `GET /api/projectManagerSearch/:managerId?query=project`

**Response**:
```json
[
  {
    "_id": "project_id",
    "name": "Project Alpha"
  }
]
```

## File Upload

### Image Upload
Images are uploaded to Cloudinary with the following configuration:

**Endpoint**: `POST /api/auth/register` (multipart/form-data)

**File Requirements**:
- Maximum file size: 5MB
- Supported formats: JPG, JPEG, PNG, GIF
- Images are automatically optimized and cached

## Authentication & Authorization

### JWT Token
Tokens are issued upon successful login and must be included in the Authorization header:

```
Authorization: Bearer <token>
```

### Role-based Access Control
- **Admin**: Full access to all endpoints
- **Manager**: Access to own projects and assigned employees
- **Employee**: Access to assigned projects and tasks

## Error Handling

### Standard Error Response
```json
{
  "message": "Error description",
  "status": "error",
  "code": 400
}
```

### Common Error Codes
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

## Rate Limiting
- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **File upload endpoints**: 10 requests per 15 minutes

## Pagination
List endpoints support pagination with the following parameters:

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response Format**:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

## Environment Variables

### Required Variables
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/trivogroup

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@trivogroup.com

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation Steps

1. **Clone and navigate to backend directory**
```bash
cd trivo_server
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run database migrations (if any)**
```bash
npm run migrate
```

6. **Start development server**
```bash
npm run dev
```

### Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

## Testing

### Running Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Load tests
npm run test:load
```

### API Testing with Postman
Import the provided Postman collection from `/docs/postman-collection.json`

## Monitoring & Logging

### Logging
- **Development**: Console logging with colors
- **Production**: File-based logging with rotation
- **Error Tracking**: Sentry integration (optional)

### Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `{"status": "ok", "timestamp": "2024-01-01T00:00:00.000Z"}`

## Security Best Practices

1. **Input Validation**: All inputs validated using express-validator
2. **SQL Injection Prevention**: Using Mongoose ORM
3. **XSS Protection**: Helmet.js for security headers
4. **Rate Limiting**: Express-rate-limit for API protection
5. **CORS Configuration**: Configured for specific origins
6. **File Upload Security**: File type and size validation

## Performance Optimization

1. **Database Indexing**: Indexed frequently queried fields
2. **Caching**: Redis caching for search results (optional)
3. **Compression**: Gzip compression for API responses
4. **Database Connection Pooling**: Mongoose connection pooling
5. **Image Optimization**: Cloudinary automatic optimization

## Support & Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB service status
   - Verify connection string format
   - Ensure database user permissions

2. **File Upload Errors**
   - Check Cloudinary configuration
   - Verify file size limits
   - Check network connectivity

3. **Authentication Issues**
   - Verify JWT secret configuration
   - Check token expiration settings
   - Ensure proper token format

### Debug Mode
Enable detailed logging:
```bash
DEBUG=trivo:* npm run dev
```

### Getting Help
- Check the issues section in the repository
- Review the troubleshooting guide in `/docs/troubleshooting.md`
- Contact the development team via the provided channels
