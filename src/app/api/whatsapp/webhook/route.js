import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Webhook Verification
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('WEBHOOK_VERIFIED');
      return new Response(challenge, { status: 200 });
    } else {
      return new Response('Forbidden', { status: 403 });
    }
  }
}

// POST: Handle Inbound Messages
export async function POST(request) {
  try {
    const body = await request.json();

    // Check if it's a WhatsApp message event
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from; // Phone number of lead
      const text = message.text ? message.text.body : '[Media/Other]';

      console.log(`Received message from ${from}: ${text}`);

      // 1. Find the lead in Supabase based on phone number
      // Note: We might need to handle different phone number formats
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('id')
        .or(`phone.like.%${from}%,phone.eq.${from}`)
        .single();

      if (leadError || !lead) {
        console.error('Lead not found for phone:', from, leadError);
        // We could create a new lead here if desired, but for now we ignore or log
        return NextResponse.json({ status: 'lead_not_found' });
      }

      // 2. Insert message into Supabase
      const { error: msgError } = await supabase
        .from('messages')
        .insert([{
          lead_id: lead.id,
          text: text,
          sender: 'lead',
          timestamp: new Date().toISOString()
        }]);

      if (msgError) {
        console.error('Error saving message:', msgError);
        return NextResponse.json({ error: msgError.message }, { status: 500 });
      }

      return NextResponse.json({ status: 'success' });
    }

    return NextResponse.json({ status: 'ignored' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
