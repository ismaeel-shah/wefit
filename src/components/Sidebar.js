'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { LayoutDashboard, Users, Megaphone, MessageCircle, LogOut, UserPlus } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'WhatsApp Chat', href: '/chat', icon: MessageCircle },
  { name: 'Team Members', href: '/team', icon: UserPlus },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useData();

  if (!user) return null; // Don't show sidebar if not logged in

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Image 
          src="/logo.png" 
          alt="We Fit Logo" 
          width={140} 
          height={50} 
          className={styles.logoImage}
          priority
        />
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>
          {user.email.substring(0, 2).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>Admin</p>
          <p className={styles.userRole} title={user.email}>
            {user.email.length > 20 ? user.email.substring(0, 18) + '...' : user.email}
          </p>
        </div>
        <button onClick={logout} className={styles.logoutBtn} title="Sign Out">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
