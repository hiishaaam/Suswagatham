import { Resend } from 'resend';

// Initialize Resend globally (server-only)
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendRsvpHostNotification = async (params: {
  hostEmail: string;
  coupleNames: string;
  guestName: string;
  attending: boolean;
  guestCount?: number;
  foodPreference?: string | null;
}) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured. Skipping email notification.');
    return { success: false, error: 'API Key missing' };
  }

  const { hostEmail, guestName, attending, guestCount, foodPreference, coupleNames } = params;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const subject = attending 
    ? `🎉 RSVP Received! ${guestName} is attending your wedding` 
    : `😔 RSVP Update: ${guestName} cannot attend`;

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f7ab0a; padding: 24px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0;">WeddWise RSVP Alert</h2>
      </div>
      <div style="padding: 32px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #334155;">Hello ${coupleNames},</p>
        <p style="font-size: 16px; color: #334155;">You just received a new RSVP for your wedding:</p>
        
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 24px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Guest:</strong> ${guestName}</p>
          <p style="margin: 0 0 8px 0;"><strong>Status:</strong> ${attending ? '✅ Attending' : '❌ Not Attending'}</p>
          ${attending ? `
            <p style="margin: 0 0 8px 0;"><strong>Headcount:</strong> ${guestCount}</p>
            <p style="margin: 0;"><strong>Meal Preference:</strong> ${foodPreference === 'veg' ? '🌿 Vegetarian' : foodPreference === 'non_veg' ? '🍖 Non-Vegetarian' : '🍽 Both'}</p>
          ` : ''}
        </div>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; font-size: 14px;">View Full Guest List</a>
      </div>
    </div>
  `;

  try {
    const data = await resend.emails.send({
      from: `WeddWise RSVP <${fromEmail}>`,
      to: [hostEmail],
      subject,
      html: htmlBody,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send Resend email:', error);
    return { success: false, error };
  }
};
