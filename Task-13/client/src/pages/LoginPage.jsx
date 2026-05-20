import { Link } from 'react-router-dom';
import AuthFrame from '../components/AuthFrame';

export default function LoginPage() {
  return (
    <AuthFrame
      badge="Login"
      title="Your password has been updated"
      subtitle="Use your new password on the main application login screen."
    >
      <div className="text-center py-4 py-md-5">
        <div className="display-5 text-primary mb-3">
          <i className="bi bi-shield-lock-fill" />
        </div>
        <h2 className="h4 fw-bold mb-3">Ready to sign in</h2>
        <p className="text-secondary mb-4">
          This handoff page confirms the reset flow is complete. Sign in with your updated password in the main app.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/forgot-password" className="btn btn-outline-primary">
            Reset another password
          </Link>
          <Link to="/forgot-password" className="btn btn-primary">
            Back to reset flow
          </Link>
        </div>
      </div>
    </AuthFrame>
  );
}
