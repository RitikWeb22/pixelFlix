import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormGroup from "../../components/FormGroup";
import { useAuth } from "../hooks/useAuth";
import "../styles/auth.scss";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading, error, clearAuthError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();

    try {
      const result = await login({ email, password });
      const from = location.state?.from;

      if (from) {
        navigate(from);
      } else if (result?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch {
      // Error is handled in auth context and displayed below.
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-backdrop" aria-hidden="true" />
      <div className="auth-vignette" aria-hidden="true" />

      <section className="auth-card" aria-live="polite">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Sign In</h1>

          <FormGroup
            id="loginEmail"
            label="Email or phone number"
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email or phone number"
            autoComplete="username"
          />

          <FormGroup
            id="loginPassword"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
          />

          <button className="auth-submit" type="submit" disabled={authLoading}>
            {authLoading ? "Signing in..." : "Sign In"}
          </button>

          {error && <p className="auth-error">{error}</p>}

          <p className="auth-switch">
            New to PixelFlix?{" "}
            <Link to="/register" className="auth-link">
              Sign up now
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
