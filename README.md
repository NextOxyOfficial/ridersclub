# Riders Club

A full-stack web application for motorcycle enthusiasts to connect, organize events, and share their riding experiences.

## Project Structure

```
ridersclub/
├── backend/          # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── ridersclub_backend/
│   └── riders/
└── frontend/         # Next.js React app
    ├── package.json
    ├── src/
    └── public/
```

## Features

### Backend (Django)
- ✅ REST API with Django REST Framework
- ✅ User authentication and authorization
- ✅ Rider profiles with bike information
- ✅ Event management with participant tracking
- ✅ Community posts with like functionality
- ✅ Image upload support
- ✅ Admin interface
- ✅ CORS configuration for frontend integration

### Frontend (Next.js)
- ✅ Modern responsive design
- ✅ TypeScript for type safety
- ✅ Tailwind CSS styling
- ✅ Server-side rendering
- ✅ API integration with loading states
- ✅ Mobile-friendly navigation
- ✅ Real-time data display

## Technology Stack

### Backend
- **Django 5.2.3** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (development)
- **Pillow** - Image processing
- **django-cors-headers** - CORS support

### Frontend
- **Next.js 15.3.4** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **Heroicons** - Icon library

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/NextOxyOfficial/ridersclub.git
cd ridersclub
```

### 2. Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
cd ../frontend

# Install Node.js dependencies
npm install

# Start Next.js development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api-auth/login/` - User login
- `POST /api-auth/logout/` - User logout

### Riders
- `GET /api/riders/` - List all riders
- `POST /api/riders/` - Create rider profile
- `GET /api/riders/{id}/` - Get rider details

### Events
- `GET /api/events/` - List all events
- `POST /api/events/` - Create new event
- `POST /api/events/{id}/join/` - Join event
- `POST /api/events/{id}/leave/` - Leave event

### Posts
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create new post
- `POST /api/posts/{id}/like/` - Toggle like

## Development

### Running Both Servers
1. Start the Django backend server:
   ```bash
   cd backend && python manage.py runserver
   ```

2. In a new terminal, start the Next.js frontend:
   ```bash
   cd frontend && npm run dev
   ```

### Database Administration
Access the Django admin at `http://localhost:8000/admin/` to manage data directly.

### Environment Configuration
- Backend: Configure settings in `backend/ridersclub_backend/settings.py`
- Frontend: Set environment variables in `frontend/.env.local`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## Future Enhancements

- [ ] User authentication in frontend
- [ ] Real-time chat functionality
- [ ] Advanced search and filtering
- [ ] Event calendar view
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Payment integration for paid events
- [ ] Route planning and GPS integration

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Happy Riding! 🏍️**
