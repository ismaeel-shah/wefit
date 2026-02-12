'use client';

import { Filter, X } from 'lucide-react';
import styles from './FilterBar.module.css';

export default function FilterBar({ filters, onFilterChange, onReset }) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <div className={styles.iconWrapper}>
          <Filter size={18} />
        </div>
        
        <select 
          className={styles.select}
          value={filters.platform}
          onChange={(e) => onFilterChange('platform', e.target.value)}
        >
          <option value="all">All Platforms</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
        </select>

        <select 
          className={styles.select}
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="interested">Interested</option>
          <option value="closed">Closed</option>
          <option value="pending">Pending</option>
        </select>

        <input 
          type="date" 
          className={styles.dateInput}
          value={filters.date}
          onChange={(e) => onFilterChange('date', e.target.value)}
        />
      </div>

      <button className={styles.resetBtn} onClick={onReset}>
        <X size={16} />
        Reset Filters
      </button>
    </div>
  );
}
