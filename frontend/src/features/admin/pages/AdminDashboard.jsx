import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  banOrUnbanUser,
  createAdminMovie,
  editAdminMovie,
  fetchAdminMovies,
  fetchAdminUsers,
  removeAdminMovie,
  removeUser,
} from "../services/admin.api";
import "../styles/admin.scss";

const initialMovieForm = {
  title: "",
  description: "",
  releaseDate: "",
  trailer: "",
  genre: "",
  category: "",
  poster: "",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [movieForm, setMovieForm] = useState(initialMovieForm);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [movieSearch, setMovieSearch] = useState("");

  const adminName = user?.username || "Admin";

  const handleApiError = (err, fallback) => {
    if (err?.status === 401) {
      navigate("/login");
      return;
    }

    if (err?.status === 403) {
      navigate("/");
      return;
    }

    setError(err?.message || fallback);
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await fetchAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      handleApiError(err, "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const loadMovies = async () => {
    setMoviesLoading(true);
    try {
      const data = await fetchAdminMovies();
      setMovies(Array.isArray(data.movies) ? data.movies : []);
    } catch (err) {
      handleApiError(err, "Failed to load movies");
    } finally {
      setMoviesLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadMovies();
  }, []);

  const totalAdmins = useMemo(
    () => users.filter((item) => item.role === "admin").length,
    [users],
  );

  const totalBannedUsers = useMemo(
    () => users.filter((item) => item.isBanned).length,
    [users],
  );

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) {
      return users;
    }

    return users.filter((item) => {
      const username = item.username || "";
      const email = item.email || "";
      return (
        username.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query)
      );
    });
  }, [users, userSearch]);

  const filteredMovies = useMemo(() => {
    const query = movieSearch.trim().toLowerCase();
    if (!query) {
      return movies;
    }

    return movies.filter((movie) => {
      const title = movie.title || "";
      const genre = movie.genre || "";
      const category = movie.category || "";
      return (
        title.toLowerCase().includes(query) ||
        genre.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query)
      );
    });
  }, [movies, movieSearch]);

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleToggleBan = async (userId) => {
    clearMessages();
    setActionLoading(true);
    try {
      const result = await banOrUnbanUser(userId);
      setSuccessMessage(result.message || "User status updated");
      await loadUsers();
    } catch (err) {
      handleApiError(err, "Unable to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    clearMessages();
    setActionLoading(true);
    try {
      const result = await removeUser(userId);
      setSuccessMessage(result.message || "User deleted");
      await loadUsers();
    } catch (err) {
      handleApiError(err, "Unable to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMovieField = (event) => {
    const { name, value } = event.target;
    setMovieForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetMovieForm = () => {
    setMovieForm(initialMovieForm);
    setEditingMovieId(null);
  };

  const handleEditMovie = (movie) => {
    setEditingMovieId(movie._id);
    setMovieForm({
      title: movie.title || "",
      description: movie.description || "",
      releaseDate: movie.releaseDate || "",
      trailer: movie.trailer || "",
      genre: movie.genre || "",
      category: movie.category || "",
      poster: movie.poster || "",
    });
    setActiveTab("movies");
    clearMessages();
  };

  const handleMovieSubmit = async (event) => {
    event.preventDefault();
    clearMessages();
    setActionLoading(true);

    try {
      if (editingMovieId) {
        const result = await editAdminMovie(editingMovieId, movieForm);
        setSuccessMessage(result.message || "Movie updated");
      } else {
        const result = await createAdminMovie(movieForm);
        setSuccessMessage(result.message || "Movie created");
      }
      resetMovieForm();
      await loadMovies();
    } catch (err) {
      handleApiError(err, "Unable to save movie");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMovie = async (movieDbId) => {
    clearMessages();
    setActionLoading(true);
    try {
      const result = await removeAdminMovie(movieDbId);
      setSuccessMessage(result.message || "Movie deleted");
      await loadMovies();
    } catch (err) {
      handleApiError(err, "Unable to delete movie");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-backdrop" aria-hidden="true" />
      <header className="admin-header">
        <div>
          <p className="admin-kicker">Admin Console</p>
          <h1>Welcome, {adminName}</h1>
          <p>Manage users and custom movies from one place.</p>
        </div>

        <div className="admin-header-actions">
          <button
            className="admin-btn ghost"
            type="button"
            onClick={() => navigate("/")}
          >
            Back Home
          </button>
          <button className="admin-btn" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="admin-stats">
        <article>
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </article>
        <article>
          <h3>Admins</h3>
          <p>{totalAdmins}</p>
        </article>
        <article>
          <h3>Custom Movies</h3>
          <p>{movies.length}</p>
        </article>
        <article>
          <h3>Banned Users</h3>
          <p>{totalBannedUsers}</p>
        </article>
      </section>

      <section className="admin-tabs" aria-label="Admin sections">
        <button
          type="button"
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          type="button"
          className={activeTab === "movies" ? "active" : ""}
          onClick={() => setActiveTab("movies")}
        >
          Movies
        </button>
      </section>

      {error && <p className="admin-message error">{error}</p>}
      {successMessage && (
        <p className="admin-message success">{successMessage}</p>
      )}

      {activeTab === "users" && (
        <section className="admin-panel">
          <h2>Manage Users</h2>
          <div className="admin-tools">
            <input
              type="text"
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              placeholder="Search by username or email"
            />
            <button
              className="admin-btn ghost"
              type="button"
              onClick={loadUsers}
            >
              Refresh
            </button>
          </div>
          {usersLoading ? (
            <p className="admin-state">Loading users...</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((item) => (
                    <tr key={item._id}>
                      <td>{item.username || "-"}</td>
                      <td>{item.email || "-"}</td>
                      <td>{item.role || "user"}</td>
                      <td>{item.isBanned ? "Banned" : "Active"}</td>
                      <td className="actions">
                        <button
                          className="admin-btn sm"
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleToggleBan(item._id)}
                        >
                          {item.isBanned ? "Unban" : "Ban"}
                        </button>
                        <button
                          className="admin-btn sm danger"
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleDeleteUser(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeTab === "movies" && (
        <section className="admin-panel">
          <h2>{editingMovieId ? "Edit Movie" : "Create Movie"}</h2>

          <form className="movie-form" onSubmit={handleMovieSubmit}>
            <div className="movie-form-grid">
              <div className="movie-form-inputs">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    id="title"
                    name="title"
                    value={movieForm.title}
                    onChange={handleMovieField}
                    placeholder="Enter movie title"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="releaseDate">Release Date</label>
                    <input
                      id="releaseDate"
                      name="releaseDate"
                      value={movieForm.releaseDate}
                      onChange={handleMovieField}
                      placeholder="e.g., 2024-03-15"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="genre">Genre</label>
                    <input
                      id="genre"
                      name="genre"
                      value={movieForm.genre}
                      onChange={handleMovieField}
                      placeholder="e.g., Action, Drama"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                      id="category"
                      name="category"
                      value={movieForm.category}
                      onChange={handleMovieField}
                      placeholder="e.g., Hollywood, Bollywood"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="trailer">Trailer URL</label>
                    <input
                      id="trailer"
                      name="trailer"
                      value={movieForm.trailer}
                      onChange={handleMovieField}
                      placeholder="YouTube or video URL"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="poster">Poster URL</label>
                  <input
                    id="poster"
                    name="poster"
                    value={movieForm.poster}
                    onChange={handleMovieField}
                    placeholder="https://example.com/poster.jpg"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={movieForm.description}
                    onChange={handleMovieField}
                    placeholder="Enter movie description..."
                    rows={5}
                  />
                </div>
              </div>

              <div className="movie-form-preview">
                <label>Poster Preview</label>
                <div className="poster-preview">
                  {movieForm.poster ? (
                    <img src={movieForm.poster} alt="Poster preview" />
                  ) : (
                    <div className="poster-placeholder">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <p>No poster URL provided</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="movie-form-actions">
              <button
                className="admin-btn"
                type="submit"
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Saving..."
                  : editingMovieId
                    ? "Update Movie"
                    : "Create Movie"}
              </button>
              {editingMovieId && (
                <button
                  className="admin-btn ghost"
                  type="button"
                  onClick={resetMovieForm}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {moviesLoading ? (
            <p className="admin-state">Loading movies...</p>
          ) : (
            <>
              <div className="admin-tools">
                <input
                  type="text"
                  value={movieSearch}
                  onChange={(event) => setMovieSearch(event.target.value)}
                  placeholder="Search by title, genre, or category"
                />
                <button
                  className="admin-btn ghost"
                  type="button"
                  onClick={loadMovies}
                >
                  Refresh
                </button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Genre</th>
                      <th>Category</th>
                      <th>Release</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovies.map((movie) => (
                      <tr key={movie._id}>
                        <td>{movie.title}</td>
                        <td>{movie.genre || "-"}</td>
                        <td>{movie.category || "-"}</td>
                        <td>{movie.releaseDate || "-"}</td>
                        <td className="actions">
                          <button
                            className="admin-btn sm"
                            type="button"
                            onClick={() => handleEditMovie(movie)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn sm danger"
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleDeleteMovie(movie._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
};

export default AdminDashboard;
