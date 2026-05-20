import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { requestPasswordReset, verifyResetToken } from '../api/passwordResetApi';
import AuthFrame from '../components/AuthFrame';
import LoadingButton from '../components/LoadingButton';
import StatusAlert from '../components/StatusAlert';
import { getPasswordChecks, isStrongPassword } from '../utils/password';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [tokenState, setTokenState] = useState('loading');
  const [tokenMessage, setTokenMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!token) {
        if (mounted) {
          setTokenState('invalid');
          setTokenMessage('Invalid reset link.');
        }
        return;
      }

      try {
        await verifyResetToken(token);
        if (mounted) {
          setTokenState('valid');
        }
      } catch (err) {
        if (!mounted) return;
        setTokenMessage(err.message);
        setTokenState(err.message.toLowerCase().includes('expired') ? 'expired' : 'invalid');
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login', { replace: true }), 1800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [success, navigate]);

  const checks = useMemo(() => getPasswordChecks(password), [password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');

    if (!isStrongPassword(password)) {
      setFormError('Choose a stronger password that meets every requirement.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Password confirmation does not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await requestPasswordReset(token, { password, confirmPassword });
      setSuccess(response.message);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame
      badge="Reset password"
      title="Create a new secure password"
      subtitle="Verify your reset token, then choose a strong password to regain access."
    >
      <h2 className="h4 fw-bold mb-2">Reset Password</h2>
      <p className="text-secondary mb-4">
        We validate the token before showing the form.
      </p>

      {tokenState === 'loading' && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true" />
          <div className="fw-semibold">Checking your reset link...</div>
        </div>
      )}

      {tokenState === 'invalid' && <StatusAlert variant="danger" message={tokenMessage || 'Invalid reset link.'} />}
      {tokenState === 'expired' && (
        <StatusAlert
          variant="warning"
          message={tokenMessage || 'Reset link has expired. Please request a new one.'}
        />
      )}

      {tokenState === 'valid' && (
        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <StatusAlert variant="success" message={success} />
          <StatusAlert variant="danger" message={formError} />

          <div>
            <label htmlFor="password" className="form-label">
              New password
            </label>
            <input
              id="password"
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="form-control form-control-lg"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="rounded-4 border bg-light p-3">
            <div className="fw-semibold mb-2">Password strength checklist</div>
            <ul className="list-unstyled mb-0 reset-checklist">
              {checks.map((check) => (
                <li key={check.label} className="mb-2">
                  <span className={`check-mark ${check.passed ? 'bg-success text-white' : 'bg-secondary-subtle text-secondary'}`}>
                    <i className={`bi ${check.passed ? 'bi-check-lg' : 'bi-dash-lg'}`} />
                  </span>
                  <span className={check.passed ? 'text-success' : 'text-secondary'}>{check.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <LoadingButton loading={loading} className="btn-primary btn-lg">
            Update password
          </LoadingButton>
        </form>
      )}

      <div className="d-flex flex-wrap gap-3 mt-4 small">
        <Link to="/forgot-password" className="text-decoration-none">
          Request a new link
        </Link>
        <Link to="/login" className="text-decoration-none">
          Go to login
        </Link>
      </div>
    </AuthFrame>
  );
}
