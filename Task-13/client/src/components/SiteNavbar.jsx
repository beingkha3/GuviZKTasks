import { Link } from 'react-router-dom';

export default function SiteNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container py-1">
        <Link className="navbar-brand fw-semibold d-flex align-items-center gap-2" to="/forgot-password">
          <span className="badge text-bg-primary rounded-pill">T13</span>
          Secure Reset
        </Link>
        <div className="ms-auto d-flex gap-2">
          <Link className="btn btn-outline-light btn-sm" to="/login">
            Login
          </Link>
          <Link className="btn btn-warning btn-sm" to="/forgot-password">
            Forgot Password
          </Link>
        </div>
      </div>
    </nav>
  );
}
