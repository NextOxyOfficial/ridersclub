# Riders Club - Django Backend

A Django REST API backend for the Riders Club application, providing endpoints for managing riders, events, and posts.

## Features

- User authentication and authorization
- Rider profiles with bike information
- Ride events with participant management
- Community posts with likes
- Image upload support
- Admin interface

## Technology Stack

- Django 5.2.3
- Django REST Framework
- django-cors-headers
- SQLite (development)
- Pillow (image processing)

## Installation

1. Make sure Python 3.12+ is installed
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Riders
- `GET /api/riders/` - List all riders
- `POST /api/riders/` - Create a new rider
- `GET /api/riders/{id}/` - Get rider details
- `PUT /api/riders/{id}/` - Update rider
- `DELETE /api/riders/{id}/` - Delete rider

### Events
- `GET /api/events/` - List all events
- `POST /api/events/` - Create a new event
- `GET /api/events/{id}/` - Get event details
- `PUT /api/events/{id}/` - Update event
- `DELETE /api/events/{id}/` - Delete event
- `POST /api/events/{id}/join/` - Join an event
- `POST /api/events/{id}/leave/` - Leave an event

### Posts
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create a new post
- `GET /api/posts/{id}/` - Get post details
- `PUT /api/posts/{id}/` - Update post
- `DELETE /api/posts/{id}/` - Delete post
- `POST /api/posts/{id}/like/` - Like/unlike a post

## Models

### Rider
- User (OneToOne with Django User)
- Bio
- Location
- Bike model
- Profile image

### RideEvent
- Title
- Description
- Location
- Date
- Organizer (ForeignKey to Rider)
- Participants (ManyToMany with Rider)
- Max participants

### Post
- Author (ForeignKey to Rider)
- Title
- Content
- Image
- Likes (ManyToMany with Rider)

## Development

To start development:

1. Make sure the virtual environment is activated
2. Run the development server: `python manage.py runserver`
3. Access the admin interface at `http://localhost:8000/admin/`
4. API documentation is available at `http://localhost:8000/api/`
