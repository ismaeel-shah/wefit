'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import StatusBadge from '@/components/StatusBadge';
import { Facebook, Instagram, MessageCircle, ChevronDown, ChevronUp, BarChart2, MousePointer, Users, DollarSign } from 'lucide-react';
import styles from './page.module.css';

const PlatformIcon = ({ platform }) => {
  switch (platform) {
    case 'facebook': return <Facebook size={20} color="#1877F2" />;
    case 'instagram': return <Instagram size={20} color="#E4405F" />;
    case 'whatsapp': return <MessageCircle size={20} color="#25D366" />;
    default: return <BarChart2 size={20} />;
  }
};

export default function CampaignsPage() {
  const { campaigns, leads } = useData();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCampaignLeads = (id) => {
    return leads.filter(l => l.campaignId === id).slice(0, 5); // Show top 5 recent
  };

  return (
    <div className={styles.container}>
      <Header title="Campaigns" />

      <div className={styles.grid}>
        {campaigns.map(campaign => (
          <div key={campaign.id} className={styles.card}>
            <div className={styles.cardHeader} onClick={() => toggleExpand(campaign.id)}>
              <div className={styles.headerTop}>
                <div className={styles.platformBadge}>
                  <PlatformIcon platform={campaign.platform} />
                  <span className={styles.platformName}>{campaign.platform}</span>
                </div>
                <span className={`${styles.status} ${campaign.status === 'active' ? styles.active : styles.paused}`}>
                  {campaign.status}
                </span>
              </div>
              
              <h3 className={styles.campaignName}>{campaign.name}</h3>
              
              <div className={styles.metricsGrid}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}><Users size={14} /> Leads</span>
                  <span className={styles.metricValue}>{campaign.leads}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}><MousePointer size={14} /> Clicks</span>
                  <span className={styles.metricValue}>{campaign.clicks}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}><DollarSign size={14} /> Cost</span>
                  <span className={styles.metricValue}>${campaign.spend}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>CPL</span>
                  <span className={styles.metricValue}>
                    ${(campaign.spend / (campaign.leads || 1)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={styles.expandHint}>
                {expandedId === campaign.id ? (
                  <>Hide Details <ChevronUp size={16} /></>
                ) : (
                  <>View Recent Leads <ChevronDown size={16} /></>
                )}
              </div>
            </div>

            {expandedId === campaign.id && (
              <div className={styles.details}>
                <h4 className={styles.detailsTitle}>Recent Leads</h4>
                <div className={styles.leadsList}>
                  {getCampaignLeads(campaign.id).length > 0 ? (
                     getCampaignLeads(campaign.id).map(lead => (
                       <div key={lead.id} className={styles.leadItem}>
                         <div className={styles.leadInfo}>
                           <span className={styles.leadName}>{lead.name}</span>
                           <span className={styles.leadDate}>{lead.date}</span>
                         </div>
                         <StatusBadge status={lead.status} />
                       </div>
                     ))
                  ) : (
                    <div className={styles.noLeads}>No leads yet</div>
                  )}
                </div>
                <div className={styles.viewAll}>
                   <a href="/leads" className={styles.link}>View all leads for this campaign &rarr;</a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
