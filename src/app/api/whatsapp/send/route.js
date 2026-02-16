import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { to, text, templateName, languageCode = 'en' } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'Recipient phone number (to) is required' }, { status: 400 });
    }

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    // Clean the phone number (remove +, spaces, etc.)
    const cleanTo = to.replace(/\D/g, '');

    let payload = {
      messaging_product: 'whatsapp',
      to: cleanTo,
    };

    if (templateName) {
      payload.type = 'template';
      payload.template = {
        name: templateName,
        language: { code: languageCode },
      };
    } else if (text) {
      payload.type = 'text';
      payload.text = { body: text };
    } else {
      return NextResponse.json({ error: 'Either text or templateName is required' }, { status: 400 });
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API Error:', data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('WhatsApp Send Catch Error:', error);
    return NextResponse.json({ 
      error: 'Failed to send message', 
      details: error.message 
    }, { status: 500 });
  }
}
