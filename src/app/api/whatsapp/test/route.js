import { NextResponse } from 'next/server';

export async function GET() {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  // Replace with a phone number you want to test with (e.g., your own number in international format)
  let testRecipient = '+923339786871'; // Change this for testing
  
  // Clean the phone number (remove +, spaces, etc.)
  testRecipient = testRecipient.replace(/\D/g, ''); 
  
  console.log('WhatsApp Test Triggered');
  console.log('Phone Number ID:', phoneNumberId ? 'Present' : 'MISSING');
  console.log('Access Token:', accessToken ? 'Present' : 'MISSING');
  console.log('Recipient:', testRecipient);

  try {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    console.log('Fetching URL:', url);

    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: testRecipient,
          type: 'template',
          template: {
            name: 'test_drive_crm',
            language: {
              code: 'en', // Try 'en' or 'en_US' if this fails
            },
          },
        }),
      }
    );

    const data = await response.json();
    console.log('WhatsApp API Response:', data);

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Fetch Error Details:', error);
    return NextResponse.json({ 
      error: 'fetch failed', 
      message: error.message,
      cause: error.cause?.message || 'Unknown cause'
    }, { status: 500 });
  }
}
