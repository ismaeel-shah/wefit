import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from './StatCard.module.css';

export default function StatCard({ title, value, trend, trendLabel, icon: Icon }) {
  const isPositive = trend >= 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={styles.iconWrapper}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.value}>{value}</h3>
        {trend && (
          <div className={`${styles.trend} ${isPositive ? styles.positive : styles.negative}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span className={styles.trendValue}>{Math.abs(trend)}%</span>
            <span className={styles.trendLabel}>{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
