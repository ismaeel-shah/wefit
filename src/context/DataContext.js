'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Auth Listener
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        fetchData();
      } else {
        setLoading(false);
        if (window.location.pathname !== '/login') {
          router.push('/login');
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchData();
      else {
        setLeads([]);
        setCampaigns([]);
        setMessages({});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Campaigns
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('*')
        .order('id', { ascending: true });
      if (campaignsData) setCampaigns(campaignsData);

      // Fetch Leads
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (leadsData) setLeads(leadsData);

      // Fetch Messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });
      
      if (messagesData) {
        // Group messages by lead_id
        const msgMap = messagesData.reduce((acc, msg) => {
          if (!acc[msg.lead_id]) acc[msg.lead_id] = [];
          acc[msg.lead_id].push(msg);
          return acc;
        }, {});
        setMessages(msgMap);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id, newStatus) => {
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating status:', error);
      // Revert if error (omitted for brevity)
    }
  };

  const addMessage = async (leadId, text, sender = 'me', phone = null) => {
    // 1. If sending from CRM, call WhatsApp API first
    if (sender === 'me' && phone) {
      try {
        const response = await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: phone, text }),
        });
        const data = await response.json();
        if (!data.success) {
          console.error('WhatsApp Send Failed:', data.error);
          alert('WhatsApp message failed to send. Check console.');
          return;
        }
      } catch (err) {
        console.error('WhatsApp API Error:', err);
        return;
      }
    }

    const optimisticMsg = {
      id: Date.now(),
      lead_id: leadId,
      text,
      sender,
      timestamp: new Date().toISOString()
    };

    // Optimistic update
    setMessages(prev => ({
      ...prev,
      [leadId]: [...(prev[leadId] || []), optimisticMsg]
    }));

    const { data, error } = await supabase
      .from('messages')
      .insert([{ lead_id: leadId, text, sender, timestamp: new Date().toISOString() }])
      .select();

    if (error) {
      console.error('Error saving message:', error);
    } else {
      // Refresh to ensure everything is in sync
      fetchData();
    }

    // Update lead status if first contact
    if (sender === 'me') {
      const lead = leads.find(l => l.id === leadId);
      if (lead && lead.status === 'new') {
        updateLeadStatus(leadId, 'contacted');
      }
    }
  };

  const addLead = async (leadData) => {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) {
      console.error('Error adding lead:', error);
      return { success: false, error };
    }

    setLeads(prev => [data[0], ...prev]);
    return { success: true, data: data[0] };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <DataContext.Provider value={{
      user,
      leads,
      campaigns,
      messages,
      loading,
      updateLeadStatus,
      addMessage,
      addLead,
      logout,
      refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
