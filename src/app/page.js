'use client';

import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import styles from './page.module.css';

const COLORS = ['#2D6A4F', '#40916C', '#10B981', '#34D399', '#6EE7B7'];

export default function Dashboard() {
  const { leads, campaigns } = useData();

  // Calculate KPIs
  const totalLeads = leads.length;
  const closedLeads = leads.filter(l => l.status === 'closed').length;
  const pendingLeads = leads.filter(l => l.status === 'pending').length;
  const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;

  // Prepare Chart Data
  const campaignData = campaigns.map(c => ({
    name: c.name.split(' ').slice(0, 2).join(' '), // Shorten name
    leads: leads.filter(l => l.campaignId === c.id).length
  }));

  const platformData = [
    { name: 'Instagram', value: leads.filter(l => l.platform === 'instagram').length },
    { name: 'Facebook', value: leads.filter(l => l.platform === 'facebook').length },
    { name: 'WhatsApp', value: leads.filter(l => l.platform === 'whatsapp').length },
  ].filter(d => d.value > 0);

  const recentLeads = [...leads].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className={styles.container}>
      <Header title="Dashboard" />

      {/* KPI Cards */}
      <div className={styles.grid}>
        <StatCard 
          title="Total Leads" 
          value={totalLeads} 
          trend={12} 
          trendLabel="vs last month"
          icon={Users} 
        />
        <StatCard 
          title="Closed Deals" 
          value={closedLeads} 
          trend={8} 
          trendLabel="vs last month"
          icon={CheckCircle} 
        />
        <StatCard 
          title="Pending Follow-ups" 
          value={pendingLeads} 
          trend={-5} 
          trendLabel="decreased"
          icon={Clock} 
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${conversionRate}%`} 
          trend={2.4} 
          trendLabel="increase"
          icon={TrendingUp} 
        />
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Campaign Performance</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="leads" fill="#2D6A4F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Leads by Platform</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.legend}>
              {platformData.map((entry, index) => (
                <div key={index} className={styles.legendItem}>
                  <div className={styles.dot} style={{backgroundColor: COLORS[index % COLORS.length]}} />
                  <span>{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className={styles.recentLeads}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.cardTitle}>Recent Leads</h3>
          <button className="btn btn-outline" style={{fontSize: '0.875rem'}}>View All</button>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Platform</th>
              <th>Campaign</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentLeads.map(lead => (
              <tr key={lead.id}>
                <td style={{fontWeight: 500}}>{lead.name}</td>
                <td style={{textTransform: 'capitalize'}}>{lead.platform}</td>
                <td>{campaigns.find(c => c.id === lead.campaignId)?.name}</td>
                <td><StatusBadge status={lead.status} /></td>
                <td>{lead.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
