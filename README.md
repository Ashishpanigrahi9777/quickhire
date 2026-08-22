# QuickHire - Job Application Tracker API

## 1. Project Overview
QuickHire is a simple and clean backend API that allows users to track their job applications and recruitment status. It is designed to be a portfolio project demonstrating a solid understanding of modern Python backend development practices.

## 2. Features
- Create a new job application
- View all job applications
- View a specific job application by its ID
- Update an existing application's details (partial updates supported)
- Delete a job application
- Filter job applications by their current status
- Health-check endpoint to verify API availability
- Automatic interactive API documentation (Swagger UI/OpenAPI)

## 3. Technology Stack
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Server**: Uvicorn
- **ORM**: SQLAlchemy 2.x
- **Data Validation**: Pydantic v2
- **Database**: SQLite

## 4. Project Structure
```
quickhire/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── routes/
│       ├── __init__.py
│       └── applications.py
├── requirements.txt
├── .gitignore
└── README.md
```

## 5. Installation Instructions
To run this project locally, ensure you have Python 3.11+ and PostgreSQL installed on your system. 

### Database Setup
1. Open pgAdmin.
2. Create a new database named `quickhire_db`.
3. Create a `.env` file in the root directory (do not commit this file).
4. Add your database connection string to `.env`:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/quickhire_db
   ```
   *(Note: If your password contains special characters like `@`, URL-encode them, e.g., `%40`)*

## 6. Virtual Environment Setup
It is recommended to use a virtual environment to manage dependencies:
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

## 7. Dependency Installation
Once the virtual environment is activated, install the required packages:
```bash
pip install -r requirements.txt
```

## 8. Running the Server
Start the FastAPI server using Uvicorn:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

## 9. API Endpoint Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health-check endpoint |
| POST | `/applications` | Create a new application |
| GET | `/applications` | Return all applications (newest first) |
| GET | `/applications/{id}` | Return one application by ID |
| PUT | `/applications/{id}` | Update an existing application |
| DELETE | `/applications/{id}` | Delete an application |
| GET | `/applications/status/{status}`| Return applications matching a specific status |

**Allowed Statuses:** `Applied`, `Assessment`, `Interview`, `Selected`, `Rejected`.

## 10. Example API Request
**Create an application:**
```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/applications' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "company": "Tech Corp",
  "position": "Python Developer",
  "location": "Remote",
  "applied_date": "2026-08-21",
  "status": "Applied",
  "notes": "Found on LinkedIn"
}'
```

## 11. Swagger Documentation
FastAPI automatically generates interactive API documentation. Once the server is running, you can view the Swagger UI by navigating to:
`http://127.0.0.1:8000/docs`

## 12. Future Improvements
- Add user authentication and authorization
- Implement pagination for application listing
- Support multiple database backends (e.g., PostgreSQL) for production environments
- Add comprehensive automated unit tests
- Include Docker support for containerization
