/**
 * Email Templates
 * 
 * Reusable email templates for common communications
 */

/**
 * Contact Form Confirmation
 */
function contactFormTemplate(data) {
  const { name, email, subject, message } = data;
  
  return {
    subject: `Re: ${subject} - We received your message`,
    html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f3f4f6; padding: 20px; border-radius: 0 0 8px 8px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Message Received</h2>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Thank you for reaching out to KSA Valuers! We received your message with the subject:</p>
              <p><strong>"${subject}"</strong></p>
              <p>Our team will review your inquiry and get back to you as soon as possible, typically within 24 hours.</p>
              <p>Best regards,<br>KSA Valuers Team</p>
              <div class="footer">
                <p>This is an automated confirmation email. Please do not reply to this message.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  };
}

/**
 * Booking Confirmation
 */
function bookingConfirmationTemplate(data) {
  const { name, propertyTitle, date, time, location } = data;
  const formattedDate = new Date(date).toLocaleDateString('en-NG', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return {
    subject: `Booking Confirmed - ${propertyTitle}`,
    html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .details { background-color: #ecfdf5; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #059669; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #059669; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✓ Booking Confirmed</h2>
            </div>
            <p>Hello ${name},</p>
            <p>Your property viewing has been confirmed. Here are your booking details:</p>
            <div class="details">
              <div class="detail-row">
                <span class="label">Property:</span> ${propertyTitle}
              </div>
              <div class="detail-row">
                <span class="label">Location:</span> ${location}
              </div>
              <div class="detail-row">
                <span class="label">Date:</span> ${formattedDate}
              </div>
              <div class="detail-row">
                <span class="label">Time:</span> ${time}
              </div>
            </div>
            <p>If you need to reschedule or cancel, please contact us at least 24 hours before your scheduled viewing.</p>
            <p>We look forward to seeing you!</p>
            <p>Best regards,<br>KSA Valuers Team</p>
            <div class="footer">
              <p>This is an automated confirmation email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
}

/**
 * Admin Notification
 */
function adminNotificationTemplate(data) {
  const { type, subject, content } = data;
  
  return {
    subject: `[Admin Notification] ${subject}`,
    html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #7c3aed; color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .content { background-color: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New ${type}</h2>
            </div>
            <div class="content">
              ${content}
            </div>
            <p>Log in to your admin panel to review or respond.</p>
            <div class="footer">
              <p>This is an automated notification. Do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
}

/**
 * Password Reset
 */
function passwordResetTemplate(data) {
  const { name, resetLink, expiresIn = '24 hours' } = data;
  
  return {
    subject: 'Password Reset Request',
    html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .button { display: inline-block; margin: 20px 0; padding: 12px 30px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; }
            .warning { background-color: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626; margin: 20px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Password Reset Request</h2>
            </div>
            <p>Hello ${name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            <p>This link will expire in ${expiresIn}.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request this, please ignore this email and your password will remain unchanged.
            </div>
            <div class="footer">
              <p>This is an automated email. Do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
}

/**
 * Welcome Email
 */
function welcomeTemplate(data) {
  const { name, email } = data;
  
  return {
    subject: 'Welcome to KSA Valuers',
    html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e40af; color: white; padding: 30px; text-align: center; border-radius: 8px; }
            .features { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .feature { background-color: #f3f4f6; padding: 15px; border-radius: 6px; text-align: center; }
            .feature-icon { font-size: 24px; margin-bottom: 5px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to KSA Valuers!</h1>
              <p>Hello ${name}</p>
            </div>
            <p>We're excited to have you as part of our community. Explore premium properties and investment opportunities with us.</p>
            <div class="features">
              <div class="feature">
                <div class="feature-icon">🏠</div>
                <strong>Browse Properties</strong>
              </div>
              <div class="feature">
                <div class="feature-icon">📅</div>
                <strong>Schedule Viewings</strong>
              </div>
              <div class="feature">
                <div class="feature-icon">📊</div>
                <strong>Explore Projects</strong>
              </div>
              <div class="feature">
                <div class="feature-icon">💬</div>
                <strong>Get Expert Advice</strong>
              </div>
            </div>
            <p>Start exploring and find your next investment opportunity!</p>
            <div class="footer">
              <p>Questions? Contact us at info@ksavaluers.com</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
}

/**
 * Template registry
 */
const templates = {
  'contact-confirmation': contactFormTemplate,
  'booking-confirmation': bookingConfirmationTemplate,
  'admin-notification': adminNotificationTemplate,
  'password-reset': passwordResetTemplate,
  'welcome': welcomeTemplate
};

/**
 * Get template by name
 */
function getTemplate(templateName, data) {
  const templateFn = templates[templateName];
  if (!templateFn) {
    throw new Error(`Unknown template: ${templateName}`);
  }
  return templateFn(data);
}

module.exports = {
  contactFormTemplate,
  bookingConfirmationTemplate,
  adminNotificationTemplate,
  passwordResetTemplate,
  welcomeTemplate,
  getTemplate,
  templates
};
