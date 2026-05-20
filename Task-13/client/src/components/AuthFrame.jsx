export default function AuthFrame({ badge, title, subtitle, children }) {
  return (
    <div className="container py-4 py-lg-5">
      <div className="row g-4 align-items-stretch">
        <div className="col-lg-5 d-none d-lg-flex">
          <div className="auth-card auth-hero p-4 p-xl-5 w-100 d-flex flex-column justify-content-between">
            <div>
              <span className="badge soft-pill rounded-pill mb-3">{badge}</span>
              <h1 className="display-6 fw-bold mb-3">{title}</h1>
              <p className="lead mb-4">{subtitle}</p>
            </div>
            <div className="d-grid gap-2">
              <div className="small opacity-75">Secure token hashing</div>
              <div className="small opacity-75">Expiry-based reset links</div>
              <div className="small opacity-75">Bootstrap-based responsive UI</div>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="auth-card bg-white h-100">
            <div className="card-body p-4 p-md-5">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
