import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import AdminProtected from "./features/auth/components/AdminProtected";
import Protected from "./features/auth/components/Protected";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Home from "./features/movies/pages/Home";
import MovieDetails from "./features/movies/pages/MovieDetails";
import Movies from "./features/movies/pages/Movies";
import MyList from "./features/movies/pages/MyList";
import WatchLater from "./features/movies/pages/WatchLater";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/movie/:id",
    element: (
      <Protected>
        <MovieDetails />
      </Protected>
    ),
  },
  {
    path: "/movies",
    element: (
      <Protected>
        <Movies />
      </Protected>
    ),
  },
  {
    path: "/my-list",
    element: (
      <Protected>
        <MyList />
      </Protected>
    ),
  },
  {
    path: "/watch-later",
    element: (
      <Protected>
        <WatchLater />
      </Protected>
    ),
  },
  {
    path: "/admin",
    element: (
      <Protected>
        <AdminProtected>
          <AdminDashboard />
        </AdminProtected>
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
