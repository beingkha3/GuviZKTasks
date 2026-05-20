const iconByVariant = {
  success: 'bi-check-circle-fill',
  danger: 'bi-exclamation-triangle-fill',
  warning: 'bi-exclamation-circle-fill',
  info: 'bi-info-circle-fill',
};

export default function StatusAlert({ variant = 'info', message }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`alert alert-${variant} d-flex align-items-start gap-2`} role="alert">
      <i className={`bi ${iconByVariant[variant] || iconByVariant.info} mt-1`} />
      <div>{message}</div>
    </div>
  );
}
