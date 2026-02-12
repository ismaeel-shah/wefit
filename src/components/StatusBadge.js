import styles from './StatusBadge.module.css';

const statusConfig = {
  new: { label: 'New', className: styles.new },
  contacted: { label: 'Contacted', className: styles.contacted },
  interested: { label: 'Interested', className: styles.interested },
  closed: { label: 'Closed', className: styles.closed },
  pending: { label: 'Pending', className: styles.pending },
  future_reply: { label: 'Future Reply', className: styles.future },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.new;

  return (
    <span className={`${styles.badge} ${config.className}`}>
      {config.label}
    </span>
  );
}
