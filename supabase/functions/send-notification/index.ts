// Supabase Edge Function za slanje email obavijesti
// Koristi Resend API za slanje emaila

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@yourdomain.com'

serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    const { record, table } = await req.json()

    if (!record) {
      return new Response(
        JSON.stringify({ error: 'Record data is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    let subject = ''
    let emailBody = ''

    if (table === 'appointments') {
      // Email za rezervaciju poziva
      const appointmentDate = new Date(record.appointment_date)
      const formattedDate = appointmentDate.toLocaleString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      const packageMap: { [key: string]: string } = {
        start: 'START WEB',
        upiti: 'WEB KOJI DONOSI UPITE',
        custom: 'CUSTOM WEB',
      }
      const packageName = record.package_selected
        ? packageMap[record.package_selected] || record.package_selected
        : 'Nije odabran paket'

      subject = `Nova rezervacija poziva - ${record.client_name}`
      emailBody = `
<h2>Nova rezervacija poziva</h2>
<p><strong>Ime i prezime:</strong> ${record.client_name}</p>
<p><strong>Email:</strong> ${record.client_email}</p>
<p><strong>Datum i vrijeme:</strong> ${formattedDate}</p>
<p><strong>Paket:</strong> ${packageName}</p>
<p><strong>Status:</strong> ${record.status}</p>
      `
    } else if (table === 'audit_requests') {
      // Email za zahtjev za analizu
      subject = `Novi zahtjev za besplatnu analizu - ${record.client_name}`
      emailBody = `
<h2>Novi zahtjev za besplatnu analizu web stranice</h2>
<p><strong>Ime i prezime:</strong> ${record.client_name}</p>
<p><strong>Email:</strong> ${record.client_email}</p>
${record.website_url ? `<p><strong>Web stranica:</strong> <a href="${record.website_url}">${record.website_url}</a></p>` : ''}
<p><strong>Status:</strong> ${record.status}</p>
      `
    } else {
      return new Response(
        JSON.stringify({ error: 'Unknown table' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Slanje emaila preko Resend API-ja
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SaboStudio <noreply@yourdomain.com>',
        to: [ADMIN_EMAIL],
        subject: subject,
        html: emailBody,
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text()
      console.error('Resend API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: errorData }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = await resendResponse.json()

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})

