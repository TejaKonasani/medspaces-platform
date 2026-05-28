type WelcomeEmailInput = {
  email: string;
  name: string;
  role: 'DOCTOR' | 'CLINIC_OWNER' | 'ADMIN';
};

function getRoleLabel(role: WelcomeEmailInput['role']): string {
  switch (role) {
    case 'DOCTOR':
      return 'Doctor';
    case 'CLINIC_OWNER':
      return 'Clinic Partner';
    default:
      return 'Member';
  }
}

export async function sendWelcomeEmail(input: WelcomeEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  // Keep signup non-blocking when email is not configured.
  if (!apiKey || !from) {
    return;
  }

  const roleLabel = getRoleLabel(input.role);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject: 'Welcome to MedSpaces',
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <h2 style="margin:0 0 12px;">Welcome to MedSpaces</h2>
        <p style="margin:0 0 12px;">Hi ${input.name},</p>
        <p style="margin:0 0 12px;">Your ${roleLabel} account is ready. You are now signed in and can continue with MedSpaces immediately.</p>
        <p style="margin:0;">Thanks,<br/>The MedSpaces Team</p>
      </div>`,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Welcome email failed: ${response.status} ${body}`);
  }
}
