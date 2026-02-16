'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import { Search, ChevronLeft, ChevronRight, Eye, MessageCircle, Plus, X } from 'lucide-react';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 10;

export default function LeadsPage() {
  const { leads, campaigns, updateLeadStatus, addLead } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    platform: 'all',
    status: 'all',
    date: '',
    search: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    platform: 'whatsapp',
    campaignId: 3,
    status: 'new',
    date: new Date().toISOString().split('T')[0],
    notes: ''
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

  const handleSendWhatsApp = async (lead) => {
    if (!window.confirm(`Send WhatsApp message to ${lead.name}?`)) return;

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: lead.phone,
          templateName: 'test_drive_crm',
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('WhatsApp message sent successfully!');
        // Update status to 'contacted' if it was 'new'
        if (lead.status === 'new') {
          updateLeadStatus(lead.id, 'contacted');
        }
      } else {
        alert('Error: ' + (data.error?.message || 'Failed to send message'));
      }
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      alert('Failed to connect to the server.');
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    const res = await addLead(newLead);
    if (res.success) {
      setIsModalOpen(false);
      setNewLead({
        name: '',
        phone: '',
        email: '',
        platform: 'whatsapp',
        campaignId: 3,
        status: 'new',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      alert('Lead added successfully! Now click the WhatsApp icon to test.');
    } else {
      alert('Error adding lead: ' + res.error.message);
    }
  };

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
          <div className={styles.headerLeft}>
            <h3>All Leads ({filteredLeads.length})</h3>
            <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> Add Test Lead
            </button>
          </div>
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
                      <button 
                        className={`${styles.actionBtn} ${styles.whatsappBtn}`} 
                        title="Send WhatsApp"
                        onClick={() => handleSendWhatsApp(lead)}
                      >
                        <MessageCircle size={18} />
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

      {/* Basic Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add Test Lead</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddLead} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input 
                  type="text" 
                  required 
                  value={newLead.name} 
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  placeholder="e.g. Test User"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone (International Format)</label>
                <input 
                  type="text" 
                  required 
                  value={newLead.phone} 
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  placeholder="e.g. +923339786871"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input 
                  type="email" 
                  value={newLead.email} 
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  placeholder="test@example.com"
                />
              </div>
              <button type="submit" className={styles.submitBtn}>Save Lead</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
