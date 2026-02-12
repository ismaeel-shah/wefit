'use client';

import { Search, Bell } from 'lucide-react';
import styles from './Header.module.css';

export default function Header({ title }) {
  return (
    <header className={styles.header}>
      <div className={styles.titleContainer}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      <div className={styles.actions}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search leads..." 
            className={styles.searchInput}
          />
        </div>

        <button className={styles.iconButton}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>

        <div className={styles.user}>
          <div className={styles.avatar}>IS</div>
        </div>
      </div>
    </header>
  );
}
