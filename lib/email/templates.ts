export function welcomeEmail(name: string) {
  return {
    subject: `Welcome to WeddWise, ${name}! ✨`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:#CAA867;color:#fff;font-weight:bold;font-size:14px;display:flex;align-items:center;justify-content:center;border-radius:4px;">W</div>
        <span style="font-size:20px;font-weight:700;color:#1A1208;letter-spacing:1px;">WeddWise</span>
      </div>
    </div>

    <!-- Card -->
    <div style="background:#ffffff;border-radius:16px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <h1 style="font-size:24px;color:#1A1208;margin:0 0 8px;font-weight:700;">Welcome aboard, ${name}! 🎉</h1>
      <p style="color:#7A7267;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Your WeddWise account has been created. You're now ready to craft beautiful, interactive wedding invitations that your guests will love.
      </p>

      <div style="background:#FAF7F2;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="font-size:12px;color:#7A7267;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin:0 0 12px;">Here's what you can do:</p>
        <div style="color:#1A1208;font-size:14px;line-height:2;">
          ✅ Choose from 5+ premium animated templates<br>
          ✅ Track RSVPs, headcounts & food preferences live<br>
          ✅ Send personalized invitations via WhatsApp<br>
          ✅ Get real-time analytics on link opens
        </div>
      </div>

      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" 
         style="display:block;text-align:center;background:#1A1208;color:#CAA867;padding:14px 24px;border-radius:12px;font-weight:700;font-size:13px;text-decoration:none;text-transform:uppercase;letter-spacing:2px;">
        Go to Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <p style="text-align:center;color:#B8AFA5;font-size:11px;margin-top:32px;text-transform:uppercase;letter-spacing:1px;">
      © WeddWise · Premium Wedding Invitations
    </p>
  </div>
</body>
</html>`
  }
}

export function paymentReceiptEmail(coupleNames: string, amount: string, templateName: string, eventSlug: string) {
  return {
    subject: `Payment Confirmed — ${coupleNames} 🎊`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:#CAA867;color:#fff;font-weight:bold;font-size:14px;display:flex;align-items:center;justify-content:center;border-radius:4px;">W</div>
        <span style="font-size:20px;font-weight:700;color:#1A1208;letter-spacing:1px;">WeddWise</span>
      </div>
    </div>

    <div style="background:#ffffff;border-radius:16px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;background:#E8F5E9;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
          <span style="font-size:28px;">✅</span>
        </div>
        <h1 style="font-size:22px;color:#1A1208;margin:0 0 6px;font-weight:700;">Payment Successful!</h1>
        <p style="color:#7A7267;font-size:14px;margin:0;">Your event is now LIVE</p>
      </div>

      <div style="background:#FAF7F2;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:#7A7267;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Event</td>
            <td style="padding:6px 0;color:#1A1208;font-size:14px;font-weight:600;text-align:right;">${coupleNames}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#7A7267;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Template</td>
            <td style="padding:6px 0;color:#1A1208;font-size:14px;text-align:right;">${templateName}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#7A7267;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Amount Paid</td>
            <td style="padding:6px 0;color:#1A1208;font-size:18px;font-weight:700;text-align:right;">${amount}</td>
          </tr>
        </table>
      </div>

      <p style="color:#7A7267;font-size:13px;line-height:1.6;margin:0 0 24px;">
        Your guests can now RSVP at your live event link. Head to your dashboard to add guests and send WhatsApp invitations.
      </p>

      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" 
         style="display:block;text-align:center;background:#1A1208;color:#CAA867;padding:14px 24px;border-radius:12px;font-weight:700;font-size:13px;text-decoration:none;text-transform:uppercase;letter-spacing:2px;">
        Open Dashboard →
      </a>
    </div>

    <p style="text-align:center;color:#B8AFA5;font-size:11px;margin-top:32px;text-transform:uppercase;letter-spacing:1px;">
      © WeddWise · Premium Wedding Invitations
    </p>
  </div>
</body>
</html>`
  }
}

export function eventLiveEmail(coupleNames: string, eventSlug: string, eventDate: string) {
  const liveUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/events/${eventSlug}`
  return {
    subject: `Your event is LIVE! — ${coupleNames} 🚀`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:#CAA867;color:#fff;font-weight:bold;font-size:14px;display:flex;align-items:center;justify-content:center;border-radius:4px;">W</div>
        <span style="font-size:20px;font-weight:700;color:#1A1208;letter-spacing:1px;">WeddWise</span>
      </div>
    </div>

    <div style="background:#ffffff;border-radius:16px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <h1 style="font-size:22px;color:#1A1208;margin:0 0 8px;font-weight:700;">🎉 ${coupleNames} is Live!</h1>
      <p style="color:#7A7267;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Your wedding invitation is now live and ready for guests. Share the link below or use the WhatsApp distribution feature.
      </p>

      <div style="background:#FAF7F2;border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="font-size:11px;color:#7A7267;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin:0 0 8px;">Your Live Link</p>
        <a href="${liveUrl}" style="color:#CAA867;font-size:14px;font-weight:600;word-break:break-all;text-decoration:none;">${liveUrl}</a>
      </div>

      <div style="display:flex;gap:8px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" 
           style="flex:1;display:block;text-align:center;background:#1A1208;color:#CAA867;padding:14px;border-radius:12px;font-weight:700;font-size:12px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">
          Dashboard
        </a>
      </div>
    </div>

    <p style="text-align:center;color:#B8AFA5;font-size:11px;margin-top:32px;text-transform:uppercase;letter-spacing:1px;">
      © WeddWise · Premium Wedding Invitations
    </p>
  </div>
</body>
</html>`
  }
}
