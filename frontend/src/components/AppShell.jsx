import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AppShell() {
  const { currentUser, isAuthenticated, logout } = useAuth();

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">AIAD Demo</span>
          <div className="d-flex align-items-center gap-3 text-white">
            <Link to="/" className="text-white text-decoration-none">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <span aria-label="current-user">{currentUser.email}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-sm btn-outline-light"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
}
