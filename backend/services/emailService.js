/**
 * Email Service Factory
 * 
 * Supports multiple email providers:
 * - gmail: Gmail via nodemailer
 * - smtp: Custom SMTP server
 * - sendgrid: SendGrid API
 * - aws-ses: AWS SES service
 * 
 * Usage:
 *   const emailService = createEmailService();
 *   await emailService.send(options);
 */

const nodemailer = require('nodemailer');
const axios = require('axios');

/**
 * Create appropriate email transporter based on provider
 */
function createEmailTransporter(provider, config) {
  switch (provider) {
    case 'gmail':
      return createGmailTransporter(config);
    case 'smtp':
      return createSmtpTransporter(config);
    case 'sendgrid':
      return createSendgridTransporter(config);
    case 'aws-ses':
      return createAwsSesTransporter(config);
    case 'resend':
      return createResendTransporter(config);
    default:
      throw new Error(`Unknown email provider: ${provider}`);
  }
}

/**
 * Gmail via nodemailer
 */
function createGmailTransporter(config) {
  if (!config.email || !config.password) {
    throw new Error('Gmail provider requires EMAIL_USER and EMAIL_PASS');
  }

  return {
    type: 'gmail',
    transporter: nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email,
        pass: config.password
      }
    })
  };
}

/**
 * Custom SMTP server
 */
function createSmtpTransporter(config) {
  const { smtp_host, smtp_port = 587, smtp_secure = false, smtp_user, smtp_password } = config;
  
  if (!smtp_host || !smtp_user || !smtp_password) {
    throw new Error('SMTP provider requires SMTP_HOST, SMTP_USER, and SMTP_PASSWORD');
  }

  return {
    type: 'smtp',
    transporter: nodemailer.createTransport({
      host: smtp_host,
      port: smtp_port,
      secure: smtp_secure,
      auth: {
        user: smtp_user,
        pass: smtp_password
      }
    })
  };
}

/**
 * SendGrid API
 */
function createSendgridTransporter(config) {
  if (!config.sendgrid_api_key) {
    throw new Error('SendGrid provider requires SENDGRID_API_KEY');
  }

  return {
    type: 'sendgrid',
    send: async (mailOptions) => {
      try {
        const response = await axios.post('https://api.sendgrid.com/v3/mail/send', {
          personalizations: [{
            to: [{ email: mailOptions.to }],
            subject: mailOptions.subject
          }],
          from: { email: mailOptions.from || config.email },
          content: [{
            type: 'text/html',
            value: mailOptions.html || mailOptions.text
          }],
          reply_to: mailOptions.replyTo ? { email: mailOptions.replyTo } : undefined
        }, {
          headers: {
            'Authorization': `Bearer ${config.sendgrid_api_key}`,
            'Content-Type': 'application/json'
          }
        });
        return { success: true, messageId: response.headers['x-message-id'] };
      } catch (error) {
        throw new Error(`SendGrid error: ${error.response?.data?.errors?.[0]?.message || error.message}`);
      }
    }
  };
}

/**
 * AWS SES (Simple Email Service)
 */
function createAwsSesTransporter(config) {
  const { aws_access_key, aws_secret_key, aws_region } = config;
  
  if (!aws_access_key || !aws_secret_key || !aws_region) {
    throw new Error('AWS SES requires AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SES_REGION');
  }

  // Create AWS SDK client (v3)
  const AWS = require('aws-sdk');
  AWS.config.update({
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_key,
    region: aws_region
  });

  return {
    type: 'aws-ses',
    transporter: nodemailer.createTransport({
      SES: new AWS.SES({ apiVersion: '2010-12-01' })
    })
  };
}

/**
 * Resend.com API Transporter
 */
function createResendTransporter(config) {
  if (!config.resend_api_key) {
    throw new Error('Resend provider requires RESEND_API_KEY env variable');
  }

  return {
    type: 'resend',
    send: async (mailOptions) => {
      try {
        const response = await axios.post('https://api.resend.com/emails', {
          from: mailOptions.from || config.from || 'onboarding@resend.dev',
          to: mailOptions.to,
          subject: mailOptions.subject,
          html: mailOptions.html || mailOptions.text
        }, {
          headers: {
            'Authorization': `Bearer ${config.resend_api_key}`,
            'Content-Type': 'application/json'
          }
        });
        return { success: true, messageId: response.data.id };
      } catch (error) {
        const msg = error.response?.data?.message || error.message;
        throw new Error(`Resend API error: ${msg}`);
      }
    }
  };
}

/**
 * Email Service Manager
 */
class EmailService {
  constructor(provider, config = {}) {
    this.provider = provider;
    this.config = config;
    this.transporterConfig = createEmailTransporter(provider, config);
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000; // ms
  }

  /**
   * Test email configuration
   */
  async testConnection() {
    try {
      if (this.transporterConfig.transporter) {
        await this.transporterConfig.transporter.verify();
        return { success: true, provider: this.provider };
      }
      return { success: true, provider: this.provider, note: 'SendGrid/AWS SES configured' };
    } catch (error) {
      return {
        success: false,
        provider: this.provider,
        error: error.message
      };
    }
  }

  /**
   * Send email with retry logic
   */
  async send(mailOptions, attempt = 1) {
    try {
      // Validate required fields
      if (!mailOptions.to || !mailOptions.subject) {
        throw new Error('Email requires "to" and "subject" fields');
      }

      // Set from if not provided
      if (!mailOptions.from) {
        mailOptions.from = this.config.email || this.config.from || 'noreply@ksavaluers.com';
      }

      let result;

      if (this.transporterConfig.transporter) {
        // nodemailer-based providers
        result = await this.transporterConfig.transporter.sendMail(mailOptions);
      } else if (this.transporterConfig.send) {
        // Custom send method (SendGrid)
        result = await this.transporterConfig.send(mailOptions);
      } else {
        throw new Error('No send method available');
      }

      console.log(`✅ Email sent via ${this.provider}: ${mailOptions.to}`);
      return { success: true, messageId: result.messageId || result.id, provider: this.provider };

    } catch (error) {
      console.error(`❌ Email send error (attempt ${attempt}/${this.retryAttempts}): ${error.message}`);

      // Retry logic for transient failures
      if (attempt < this.retryAttempts && this.isRetryable(error)) {
        await this.sleep(this.retryDelay * attempt); // Exponential backoff
        return this.send(mailOptions, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Determine if error is retryable
   */
  isRetryable(error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('temporarily unavailable') ||
      message.includes('service unavailable') ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT'
    );
  }

  /**
   * Sleep utility for delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Batch send emails with error handling
   */
  async sendBatch(emails) {
    const results = [];
    for (const email of emails) {
      try {
        const result = await this.send(email);
        results.push({ success: true, email: email.to, ...result });
      } catch (error) {
        results.push({ success: false, email: email.to, error: error.message });
      }
    }
    return results;
  }
}

/**
 * Factory function to create email service
 */
function createEmailService() {
  let provider = process.env.EMAIL_PROVIDER || 'gmail';
  
  // Dynamic fallback for Resend to keep server bootable without environment key
  if (provider === 'resend' && !process.env.RESEND_API_KEY) {
    console.warn('⚠️  WARNING: EMAIL_PROVIDER is set to "resend" but RESEND_API_KEY is missing!');
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('🔄 Falling back to "gmail" provider.');
      provider = 'gmail';
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      console.log('🔄 Falling back to "smtp" provider.');
      provider = 'smtp';
    }
  }
  
  const config = {
    // Gmail config
    email: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,

    // SMTP config
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT || 587,
    smtp_secure: process.env.SMTP_SECURE === 'true',
    smtp_user: process.env.SMTP_USER,
    smtp_password: process.env.SMTP_PASSWORD,

    // SendGrid config
    sendgrid_api_key: process.env.SENDGRID_API_KEY,

    // Resend config
    resend_api_key: process.env.RESEND_API_KEY,

    // AWS SES config
    aws_access_key: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    aws_region: process.env.AWS_SES_REGION,

    // General config
    from: process.env.EMAIL_FROM || 'noreply@ksavaluers.com',
    retryAttempts: parseInt(process.env.EMAIL_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.EMAIL_RETRY_DELAY || '1000')
  };

  try {
    return new EmailService(provider, config);
  } catch (error) {
    console.error(`❌ Failed to initialize email service: ${error.message}`);
    throw error;
  }
}

module.exports = {
  EmailService,
  createEmailService,
  createEmailTransporter
};
