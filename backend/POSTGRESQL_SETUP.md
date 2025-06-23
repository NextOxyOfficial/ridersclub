# PostgreSQL Setup Guide

## Prerequisites
Make sure PostgreSQL is installed and running on your computer.

## Setup Steps

### 1. Update Environment Variables
Edit the `.env` file in the backend directory and update your PostgreSQL credentials:

```env
# Database Configuration
DB_NAME=ridersclub_db
DB_USER=postgres
DB_PASSWORD=YOUR_ACTUAL_PASSWORD
DB_HOST=localhost
DB_PORT=5432
```

### 2. Create the Database

#### Option A: Using PostgreSQL Command Line
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE ridersclub_db;

# Exit
\q
```

#### Option B: Using pgAdmin
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" > "Database..."
4. Enter "ridersclub_db" as the database name
5. Click "Save"

#### Option C: Using the SQL Script
```bash
# Run the setup script
psql -U postgres -f setup_database.sql
```

### 3. Run Django Migrations
```bash
cd backend
python manage.py migrate
```

### 4. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 5. Start the Server
```bash
python manage.py runserver
```

## Troubleshooting

### Connection Issues
- Make sure PostgreSQL service is running
- Check if the port 5432 is correct
- Verify your username and password
- Ensure the database exists

### Permission Issues
- Make sure your user has access to the database
- Grant privileges if needed:
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE ridersclub_db TO your_user;
  ```

### Migration Issues
- If you get migration errors, try:
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```
