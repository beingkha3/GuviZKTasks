import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFrame from '../components/AuthFrame';
import LoadingButton from '../components/LoadingButton';
import StatusAlert from '../components/StatusAlert';
import { requestForgotPassword } from '../api/passwordResetApi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await requestForgotPassword(email.trim());
      setSuccess(response.message);
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame
      badge="Forgot password"
      title="Reset access in a few steps"
      subtitle="Enter your registered email address and we will send a secure reset link with a short expiry window."
    >
      <div className="d-lg-none mb-4">
        <div className="p-4 rounded-4 bg-primary text-white">
          <div className="fw-semibold mb-2">Secure reset flow</div>
          <div className="small opacity-75">Token hashing, expiry checks, and Bootstrap UI.</div>
        </div>
      </div>

      <h2 className="h4 fw-bold mb-2">Forgot Password</h2>
      <p className="text-secondary mb-4">
        We will email a reset link if the account exists.
      </p>

      <StatusAlert variant="success" message={success} />
      <StatusAlert variant="danger" message={error} />

      <form onSubmit={handleSubmit} className="d-grid gap-3">
        <div>
          <label htmlFor="email" className="form-label">
            Registered email address
          </label>
          <div className="input-group input-group-lg">
            <span className="input-group-text">
              <i className="bi bi-envelope" />
            </span>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <LoadingButton loading={loading} className="btn-primary btn-lg">
          Send reset link
        </LoadingButton>
      </form>

      <div className="d-flex flex-wrap gap-3 mt-4 small">
        <Link to="/login" className="text-decoration-none">
          Back to login
        </Link>
      </div>
    </AuthFrame>
  );
}
