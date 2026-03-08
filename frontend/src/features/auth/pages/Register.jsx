import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormGroup from "../../components/FormGroup";
import { useAuth } from "../hooks/useAuth";
import "../styles/auth.scss";

const Register = () => {
  const navigate = useNavigate();
  const { register, authLoading, error, clearAuthError } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();

    try {
      await register({ username, email, password });
      navigate("/");
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
          <h1>Create Account</h1>

          <FormGroup
            id="registerName"
            label="Full name"
            name="fullName"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Full name"
            autoComplete="name"
          />

          <FormGroup
            id="registerEmail"
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
          />

          <FormGroup
            id="registerPassword"
            label="Create password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password"
            autoComplete="new-password"
          />

          <button className="auth-submit" type="submit" disabled={authLoading}>
            {authLoading ? "Creating account..." : "Get Started"}
          </button>

          {error && <p className="auth-error">{error}</p>}

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in now
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Register;
