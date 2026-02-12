'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 10;

export default function LeadsPage() {
  const { leads, campaigns, updateLeadStatus } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    platform: 'all',
    status: 'all',
    date: '',
    search: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleResetFilters = () => {
    setFilters({ platform: 'all', status: 'all', date: '', search: '' });
    setCurrentPage(1);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchPlatform = filters.platform === 'all' || lead.platform === filters.platform;
      const matchStatus = filters.status === 'all' || lead.status === filters.status;
      const matchDate = !filters.date || lead.date === filters.date;
      const matchSearch = !filters.search || 
        lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.phone.includes(filters.search) ||
        lead.email.toLowerCase().includes(filters.search.toLowerCase());

      return matchPlatform && matchStatus && matchDate && matchSearch;
    });
  }, [leads, filters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={styles.container}>
      <Header title="Leads Management" />

      <FilterBar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onReset={handleResetFilters} 
      />

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>All Leads ({filteredLeads.length})</h3>
          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by name, phone..." 
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Platform</th>
                <th>Campaign</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <div className={styles.leadName}>{lead.name}</div>
                      <div className={styles.leadEmail}>{lead.email}</div>
                    </td>
                    <td>{lead.phone}</td>
                    <td style={{textTransform: 'capitalize'}}>{lead.platform}</td>
                    <td>{campaigns.find(c => c.id === lead.campaignId)?.name || 'Unknown'}</td>
                    <td>
                      <select 
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="interested">Interested</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                        <option value="future_reply">Future Reply</option>
                      </select>
                    </td>
                    <td>{lead.date}</td>
                    <td>
                      <button className={styles.actionBtn} title="View Details">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.noData}>No leads found matching filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={styles.pageBtn} 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
            <button 
              className={styles.pageBtn} 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
