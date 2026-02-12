'use client';

import { useState, useEffect, useRef } from 'react';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import StatusBadge from '@/components/StatusBadge';
import { Send, Phone, MoreVertical, Search, User } from 'lucide-react';
import styles from './page.module.css';

export default function ChatPage() {
  const { leads, messages, addMessage, updateLeadStatus } = useData();
  const [activeLeadId, setActiveLeadId] = useState(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Get leads who have messages or are "contacted"
  const chatLeads = leads.filter(l => messages[l.id] || l.status === 'contacted' || l.status === 'new');
  
  const activeLead = leads.find(l => l.id === activeLeadId);
  const activeMessages = activeLeadId ? (messages[activeLeadId] || []) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeLeadId) return;

    addMessage(activeLeadId, inputText, 'me');
    setInputText('');
    
    // Simulate reply after 3 seconds
    setTimeout(() => {
      addMessage(activeLeadId, 'This is an automated reply simulation.', 'lead');
    }, 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatLayout}>
        {/* Sidebar List */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Chats</h2>
            <div className={styles.sidebarActions}>
               <MoreVertical size={20} color="#54656F" />
            </div>
          </div>
          
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
               <Search size={16} color="#54656F" />
               <input type="text" placeholder="Search or start new chat" className={styles.searchInput} />
            </div>
          </div>

          <div className={styles.leadList}>
            {chatLeads.map(lead => (
              <div 
                key={lead.id} 
                className={`${styles.leadItem} ${activeLeadId === lead.id ? styles.activeItem : ''}`}
                onClick={() => setActiveLeadId(lead.id)}
              >
                <div className={styles.avatar}>{lead.name.substring(0, 2).toUpperCase()}</div>
                <div className={styles.leadContent}>
                  <div className={styles.leadNameRow}>
                    <span className={styles.leadName}>{lead.name}</span>
                    <span className={styles.leadTime}>10:30 AM</span>
                  </div>
                  <div className={styles.leadMessage}>
                    {messages[lead.id] ? messages[lead.id][messages[lead.id].length - 1].text : 'Click to start chat'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={styles.chatWindow}>
          {activeLead ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.avatar}>{activeLead.name.substring(0, 2).toUpperCase()}</div>
                <div className={styles.headerInfo}>
                  <span className={styles.headerName}>{activeLead.name}</span>
                  <span className={styles.headerStatus}>{activeLead.phone}</span>
                </div>
                <div className={styles.headerActions}>
                  <Phone size={20} color="#54656F" />
                  <Search size={20} color="#54656F" />
                </div>
              </div>

              <div className={styles.messagesArea}>
                {activeMessages.map(msg => (
                  <div key={msg.id} className={`${styles.messageBubble} ${msg.sender === 'me' ? styles.sent : styles.received}`}>
                    <div className={styles.messageText}>{msg.text}</div>
                    <div className={styles.messageTime}>10:35 AM</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className={styles.inputArea} onSubmit={handleSend}>
                <input 
                  type="text" 
                  placeholder="Type a message" 
                  className={styles.messageInput}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className={styles.sendBtn}>
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                 <User size={64} color="#D1D7DB" />
              </div>
              <h3 className={styles.emptyText}>Select a conversation to start chatting</h3>
            </div>
          )}
        </div>

        {/* Lead Details Panel */}
        {activeLead && (
          <div className={styles.infoPanel}>
            <div className={styles.infoHeader}>
              <h3>Lead Contact Info</h3>
            </div>
            
            <div className={styles.infoContent}>
              <div className={styles.infoAvatar}>{activeLead.name.substring(0, 2).toUpperCase()}</div>
              <h2 className={styles.infoName}>{activeLead.name}</h2>
              <p className={styles.infoPhone}>{activeLead.phone}</p>
              
              <div className={styles.infoSection}>
                <label className={styles.infoLabel}>Email</label>
                <div className={styles.infoValue}>{activeLead.email}</div>
              </div>

              <div className={styles.infoSection}>
                <label className={styles.infoLabel}>Platform</label>
                <div className={styles.infoValue} style={{textTransform: 'capitalize'}}>{activeLead.platform}</div>
              </div>

              <div className={styles.infoSection}>
                <label className={styles.infoLabel}>Current Status</label>
                <div className={styles.statusWrapper}>
                  <StatusBadge status={activeLead.status} />
                </div>
                <select 
                   className={styles.statusSelect}
                   value={activeLead.status}
                   onChange={(e) => updateLeadStatus(activeLead.id, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="interested">Interested</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className={styles.infoSection}>
                <label className={styles.infoLabel}>Notes</label>
                <textarea 
                  className={styles.notes} 
                  placeholder="Add notes here..."
                  defaultValue={activeLead.notes}
                ></textarea>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
