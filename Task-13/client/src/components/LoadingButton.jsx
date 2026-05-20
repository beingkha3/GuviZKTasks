export default function LoadingButton({
  loading,
  children,
  className = 'btn-primary',
  type = 'submit',
  disabled,
}) {
  return (
    <button type={type} className={`btn ${className}`} disabled={disabled || loading}>
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
          Working...
        </>
      ) : (
        children
      )}
    </button>
  );
}
