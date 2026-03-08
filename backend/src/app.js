const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.route');
const movieRouter = require('./routes/movie.routes');
const favRouter = require('./routes/favorite.routes');
const cookieParser = require('cookie-parser');
const historyRouter = require('./routes/history.routes');
const AdminRouter = require('./routes/admin.routes');
const movieCreateRouter = require('./routes/adminMovie.routes');
const app = express();
app.use(express.static('public'))

// middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// auth routes
app.use('/api/auth', authRouter);

// movie routes
app.use('/api/movies', movieRouter)

// favorite routes
app.use('/api/favorites', favRouter)

// history routes
app.use("/api/history", historyRouter)

// admin routes
app.use("/api/admin", AdminRouter)
// admin movie routes
app.use("/api/admin/movies", movieCreateRouter)
module.exports = app;
