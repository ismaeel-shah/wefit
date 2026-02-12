export const initialCampaigns = [
  { id: 1, name: 'Summer Shred Challenge', platform: 'instagram', status: 'active', impressions: 12500, clicks: 450, leads: 42, spend: 1200 },
  { id: 2, name: 'New Year New You', platform: 'facebook', status: 'completed', impressions: 45000, clicks: 1200, leads: 150, spend: 3500 },
  { id: 3, name: 'Free Trial WhatsApp Blast', platform: 'whatsapp', status: 'active', impressions: 8000, clicks: 320, leads: 28, spend: 500 },
  { id: 4, name: 'Personal Training Promo', platform: 'instagram', status: 'paused', impressions: 5600, clicks: 180, leads: 15, spend: 800 },
  { id: 5, name: 'Yoga Class Retargeting', platform: 'facebook', status: 'active', impressions: 9000, clicks: 310, leads: 35, spend: 950 },
  { id: 6, name: 'Student Discount', platform: 'instagram', status: 'active', impressions: 3400, clicks: 120, leads: 18, spend: 300 },
];

export const initialLeads = [
  { id: 1, name: 'Ahmed Khan', phone: '+923001234567', email: 'ahmed.k@gmail.com', campaignId: 1, platform: 'instagram', status: 'new', date: '2023-10-25', notes: 'Interested in weight loss' },
  { id: 2, name: 'Sara Ali', phone: '+923331234567', email: 'sara.ali@hotmail.com', campaignId: 3, platform: 'whatsapp', status: 'contacted', date: '2023-10-24', notes: 'Asked about female trainers' },
  { id: 3, name: 'Omer Riaz', phone: '+923211234567', email: 'omer.riaz@yahoo.com', campaignId: 2, platform: 'facebook', status: 'closed', date: '2023-10-20', notes: 'Signed up for annual plan' },
  { id: 4, name: 'Fatima Zafar', phone: '+923451234567', email: 'fatima.z@gmail.com', campaignId: 1, platform: 'instagram', status: 'interested', date: '2023-10-23', notes: 'Wants to visit gym first' },
  { id: 5, name: 'Bilal Ahmed', phone: '+923011234567', email: 'bilal.ahmed@gmail.com', campaignId: 5, platform: 'facebook', status: 'pending', date: '2023-10-22', notes: 'Thinking about price' },
  { id: 6, name: 'Zainab Malik', phone: '+923341234567', email: 'zainab.m@gmail.com', campaignId: 3, platform: 'whatsapp', status: 'new', date: '2023-10-25', notes: '' },
  { id: 7, name: 'Usman Ghani', phone: '+923221234567', email: 'usman.g@gmail.com', campaignId: 1, platform: 'instagram', status: 'future_reply', date: '2023-10-21', notes: 'Call next month' },
  { id: 8, name: 'Ayesha Bibi', phone: '+923021234567', email: 'ayesha.b@gmail.com', campaignId: 4, platform: 'instagram', status: 'new', date: '2023-10-25', notes: '' },
  { id: 9, name: 'Hamza Tariq', phone: '+923351234567', email: 'hamza.t@gmail.com', campaignId: 2, platform: 'facebook', status: 'closed', date: '2023-10-18', notes: '3 month package' },
  { id: 10, name: 'Hira Shah', phone: '+923461234567', email: 'hira.s@gmail.com', campaignId: 6, platform: 'instagram', status: 'interested', date: '2023-10-23', notes: 'Student ID checked' },
  { id: 11, name: 'Saad Karim', phone: '+923121234567', email: 'saad.k@gmail.com', campaignId: 3, platform: 'whatsapp', status: 'new', date: '2023-10-24', notes: '' },
  { id: 12, name: 'Mariam Yusuf', phone: '+923321234567', email: 'mariam.y@gmail.com', campaignId: 5, platform: 'facebook', status: 'contacted', date: '2023-10-22', notes: 'No pick up' },
  { id: 13, name: 'Ali Raza', phone: '+923031234567', email: 'ali.raza@gmail.com', campaignId: 1, platform: 'instagram', status: 'new', date: '2023-10-25', notes: '' },
  { id: 14, name: 'Nida Parveen', phone: '+923231234567', email: 'nida.p@gmail.com', campaignId: 2, platform: 'facebook', status: 'closed', date: '2023-10-15', notes: '' },
  { id: 15, name: 'Kamran Akmal', phone: '+923441234567', email: 'kamran.a@gmail.com', campaignId: 4, platform: 'instagram', status: 'pending', date: '2023-10-20', notes: 'Comparing with other gym' },
  // ... generating more leads procedurally in real app, but keeping these for now
];

// Generate more leads to hit 30+
for (let i = 16; i <= 35; i++) {
  const platforms = ['instagram', 'facebook', 'whatsapp'];
  const statuses = ['new', 'contacted', 'interested', 'closed', 'pending', 'future_reply'];
  const campaigns = [1, 2, 3, 4, 5, 6];
  
  initialLeads.push({
    id: i,
    name: `Lead User ${i}`,
    phone: `+92300${1000000 + i}`,
    email: `lead${i}@example.com`,
    campaignId: campaigns[Math.floor(Math.random() * campaigns.length)],
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: `2023-10-${Math.floor(Math.random() * 25) + 1}`,
    notes: ''
  });
}

export const initialMessages = {
  2: [ // Sara Ali
    { id: 1, text: 'Hi, I saw your ad on WhatsApp. Do you have female trainers?', sender: 'lead', timestamp: '2023-10-24T10:00:00' },
    { id: 2, text: 'Hello Sara! Yes, we have 3 certified female trainers available.', sender: 'me', timestamp: '2023-10-24T10:05:00' },
    { id: 3, text: 'Great, what are their timings?', sender: 'lead', timestamp: '2023-10-24T10:10:00' },
  ],
  4: [ // Fatima Zafar
    { id: 1, text: 'Is there a registration fee?', sender: 'lead', timestamp: '2023-10-23T14:30:00' },
    { id: 2, text: 'Hi Fatima, registration is currently free for our Summer Shred campaign!', sender: 'me', timestamp: '2023-10-23T14:35:00' },
  ]
};
