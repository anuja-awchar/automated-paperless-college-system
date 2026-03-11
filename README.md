# Automated Paperless College System (APTCS)

A comprehensive college management system that digitizes various administrative processes including complaints, elections, facilities, leave management, notices, and placements.

## Features

- **Complaint Management** - Submit and track complaints within the college
- **Election System** - Conduct and manage college elections with voting interface
- **Facility Booking** - Book and manage college facilities
- **Leave Management** - Request and track leave applications
- **Notices** - Stay updated with college notices and announcements
- **Placement Cell** - Access placement opportunities and company information

## Tech Stack

### Backend
- Django REST Framework
- Python 3.x
- SQLite database

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- React Toastify

## Project Structure

```
APTCS/
├── aptcs_backend/          # Django backend
│   ├── aptcs_backend/     # Main Django project
│   ├── complaint/         # Complaint management app
│   ├── election/          # Election management app
│   ├── facility/          # Facility booking app
│   ├── leave/             # Leave management app
│   ├── notices/           # Notice board app
│   ├── placement/         # Placement cell app
│   └── users/             # User management app
│
└── aptcs_frontend/        # React frontend
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── context/       # React context (Auth)
    │   └── pages/         # Page components
    └── public/            # Static assets
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd aptcs_backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. (Optional) Load test data:
   ```bash
   python manage.py setup_test_data
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd aptcs_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

- `/api/users/` - User authentication and management
- `/api/complaints/` - Complaint management
- `/api/elections/` - Election management
- `/api/facilities/` - Facility booking
- `/api/leave/` - Leave requests
- `/api/notices/` - Notice board
- `/api/placements/` - Placement opportunities

## Default Credentials

After running `setup_test_data`, you can login with:
- **Admin:** admin / admin123
- **Faculty:** faculty / faculty123
- **Student:** student / student123

## License

MIT License

