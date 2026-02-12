'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail, Lock, Loader2, Users } from 'lucide-react';
import styles from './page.module.css';

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessage(`User ${data.user.email} created!`);
      setFormData({ email: '', password: '' });
      setShowAddModal(false);
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      
      setMessage('User deleted successfully');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Team Members</h1>
          <p className={styles.subtitle}>Manage access to We Fit CRM</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className={styles.addBtn}>
          <UserPlus size={18} />
          <span>Add Member</span>
        </button>
      </div>

      {message && <div className={styles.success}>{message}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.card}>
        {loading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} size={24} />
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        {user.email?.[0].toUpperCase()}
                      </div>
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.roleBadge}>{user.role || 'Admin'}</span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className={styles.deleteBtn}
                      title="Delete User"
                      disabled={actionLoading}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className={styles.empty}>No team members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Add New Member</h3>
              <button onClick={() => setShowAddModal(false)} className={styles.closeBtn}>&times;</button>
            </div>
            <form onSubmit={handleAddUser} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Password</label>
                <input 
                  type="password" 
                  required 
                  minLength={6}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className={styles.input}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowAddModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={actionLoading} className={styles.submitBtn}>
                  {actionLoading ? <Loader2 className={styles.spinner} /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
