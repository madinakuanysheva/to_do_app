# Todo App with Authentication

A full-stack Todo application built with FastAPI, React, and PostgreSQL, featuring JWT authentication and Docker support.

## Features

- User authentication (register, login)
- JWT token-based authorization
- CRUD operations for todos
- PostgreSQL database
- Docker and Docker Compose support
- CI/CD with GitHub Actions
- Modern UI with Material-UI

## Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local frontend development)
- Python 3.9+ (for local backend development)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd todo_app
```

2. Create a `.env` file in the backend directory:
```bash
cd backend
echo "SECRET_KEY=your-secret-key-here" > .env
```

3. Start the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development

### Backend

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

### Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## API Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/token` - Login and get access token
- `GET /api/me` - Get current user info
- `POST /api/create_task` - Create a new todo
- `GET /api/get_tasks` - Get all todos for current user
- `PUT /api/tasks/{todo_id}` - Update a todo
- `DELETE /api/tasks/{todo_id}` - Delete a todo

## Testing

Run the backend tests:
```bash
cd backend
pytest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 