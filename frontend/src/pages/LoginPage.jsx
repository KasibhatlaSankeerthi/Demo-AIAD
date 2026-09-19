import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleLogin() {
    login("demo.user@aiad.local");
    navigate("/");
  }

  return (
    <section className="card shadow-sm border-0 mx-auto" style={{ maxWidth: 480 }}>
      <div className="card-body p-4">
        <h1 className="h4 mb-3">Sign in</h1>
        <p className="text-muted">
          Demo auth context login used for scaffold verification.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleLogin}
        >
          Sign in as Demo User
        </button>
      </div>
    </section>
  );
}
