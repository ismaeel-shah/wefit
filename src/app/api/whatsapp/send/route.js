import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { to, templateName = 'test_drive_crm', languageCode = 'en' } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'Recipient phone number (to) is required' }, { status: 400 });
    }

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    // Clean the phone number (remove +, spaces, etc.)
    const cleanTo = to.replace(/\D/g, '');

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanTo,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: languageCode,
            },
          },
        }),
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
