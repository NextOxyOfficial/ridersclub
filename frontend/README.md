# Riders Club - Next.js Frontend

A modern, responsive frontend for the Riders Club application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Modern responsive design
- Server-side rendering with Next.js
- TypeScript for type safety
- Tailwind CSS for styling
- Heroicons for consistent iconography
- Axios for API communication
- Real-time data updates

## Technology Stack

- Next.js 15.3.4
- TypeScript
- Tailwind CSS
- Axios
- Heroicons
- Headless UI

## Installation

1. Make sure Node.js 18+ is installed
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Pages

### Home (`/`)
- Hero section with call-to-action
- Feature highlights
- Recent events and posts

### Events (`/events`)
- List of all motorcycle events
- Event details with participant information
- Join/leave event functionality

### Posts (`/posts`)
- Community posts feed
- Like/unlike posts
- Author information

### Riders (`/riders`)
- Community member profiles
- Rider information and bike details
- Member since information

## Components

### Header
- Navigation menu
- Responsive mobile menu
- Active page highlighting

## API Integration

The frontend communicates with the Django backend through REST API endpoints:

- Base URL: `http://localhost:8000` (configurable via environment variables)
- Automatic token handling
- Error handling and loading states

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Development

To start development:

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open `http://localhost:3000` in your browser

## Build

To build for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Features in Development

- User authentication
- Create/edit events and posts
- Real-time notifications
- Image upload for posts and profiles
- Advanced search and filtering
