# Movie Recommendation Platform

A full-stack web application that helps users discover and manage movies. Users can explore a catalog of movies, manage their favorite items, track watch history, and create personalized watch lists.

## Features

### User Features

- **Authentication**: User registration and login with JWT-based authentication
- **Movie Discovery**: Browse and search through a comprehensive movie catalog
- **Favorites**: Save favorite movies for quick access
- **Watch List**: Add movies to a watch later list
- **Watch History**: Track movies you've watched
- **Movie Details**: View detailed information about each movie

### Admin Features

- **Admin Dashboard**: Manage system features and data
- **Movie Management**: Add, edit, and delete movies from the catalog

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Additional**: Axios for API calls, CORS support

### Frontend

- **Framework**: React 19 with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Styling**: SASS/SCSS
- **Build Tool**: Vite

## Project Structure

```
movie-recommendation/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── config/
│   │   │   ├── database.js        # MongoDB connection
│   │   │   └── cache.js           # Redis caching setup
│   │   ├── controllers/           # Request handlers
│   │   ├── models/                # MongoDB schemas
│   │   ├── routes/                # API route definitions
│   │   ├── services/              # Business logic
│   │   └── middlewares/           # Custom middlewares
│   ├── server.js                  # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Root component
│   │   ├── app.route.jsx          # Route configuration
│   │   ├── features/
│   │   │   ├── auth/             # Authentication feature
│   │   │   ├── admin/            # Admin dashboard
│   │   │   ├── movies/           # Movies module
│   │   │   ├── components/       # Shared components
│   │   │   └── shared/           # Global styles
│   │   └── app/
│   │       └── store.js          # Redux store
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance
- Redis instance (optional, for caching)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd movie-recommendation
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie-recommendation
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Application

### Development Mode

**Start Backend Server**

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

**Start Frontend Development Server** (in a new terminal)

```bash
cd frontend
npm run dev
```

The frontend will typically run on `http://localhost:5173`

### Production Build

**Build Frontend**

```bash
cd frontend
npm run build
npm run preview
```

**Start Backend Production Server**

```bash
cd backend
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Movies

- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Create movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)

### Favorites

- `GET /api/favorites` - Get favorite movies
- `POST /api/favorites/:movieId` - Add to favorites
- `DELETE /api/favorites/:movieId` - Remove from favorites

### Watch History

- `GET /api/history` - Get watch history
- `POST /api/history/:movieId` - Add to watch history

### Watch List

- `GET /api/watch-later` - Get watch later list
- `POST /api/watch-later/:movieId` - Add to watch later
- `DELETE /api/watch-later/:movieId` - Remove from watch later

## Scripts

### Backend

- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Frontend

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Key Features Explained

### Authentication

User authentication is implemented using JWT tokens. Passwords are hashed using bcryptjs for security. Protected routes verify the JWT token and user role.

### Caching with Redis

Redis is used to cache frequently accessed data like movie lists to improve performance and reduce database queries.

### MongoDB Collections

- **Users**: Stores user profiles and authentication data
- **Movies**: Movie catalog information
- **Favorites**: User favorite movies mapping
- **History**: Watch history tracking
- **WatchLater**: User watch later lists

## Project Features Breakdown

1. **User Management**: Register, login, and manage user accounts
2. **Movie Database**: Browse extensive movie catalog with details
3. **Personalization**: Create favorite lists and watch lists
4. **Tracking**: Keep track of watched movies and viewing history
5. **Admin Panel**: Tools for managing movies and system content

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues, feature requests, or questions, please open an issue on the GitHub repository.

---

**Happy coding!** 🎬🍿
