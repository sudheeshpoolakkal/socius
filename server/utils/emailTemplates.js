// emailTemplates.js - Professional email templates for Socius Community Borrowing

const getEmailTemplate = (type, data) => {
  // More email-client compatible inline styles
  const baseStyle = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif !important;
        margin: 0 !important;
        padding: 0 !important;
        background-color: #f3f4f6 !important;
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
      }
      table {
        border-collapse: collapse !important;
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }
      .container {
        width: 100% !important;
        max-width: 600px !important;
        margin: 0 auto !important;
        background-color: #ffffff !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
      }
      .header {
        background-color: #3B82F6 !important; /* Socius Trust Blue */
        color: #ffffff !important;
        padding: 30px 20px !important;
        text-align: center !important;
      }
      .header h1 {
        margin: 0 !important;
        font-size: 24px !important;
        font-weight: 600 !important;
        color: #ffffff !important;
        letter-spacing: 0.5px !important;
      }
      .content {
        padding: 30px 25px !important;
        background-color: #ffffff !important;
      }
      .content h2 {
        color: #1f2937 !important;
        margin: 0 0 20px 0 !important;
        font-size: 20px !important;
        font-weight: 600 !important;
      }
      .content p {
        color: #4b5563 !important;
        line-height: 1.6 !important;
        margin: 0 0 15px 0 !important;
        font-size: 15px !important;
      }
      .highlight {
        background-color: #eff6ff !important;
        border-left: 4px solid #3B82F6 !important;
        padding: 15px !important;
        margin: 20px 0 !important;
        border-radius: 4px !important;
      }
      .request-details {
        background-color: #f9fafb !important;
        padding: 20px !important;
        border-radius: 8px !important;
        margin: 20px 0 !important;
        border: 1px solid #e5e7eb !important;
      }
      .detail-row {
        margin: 10px 0 !important;
        font-size: 14px !important;
        display: flex !important;
      }
      .label {
        font-weight: 600 !important;
        color: #374151 !important;
        display: inline-block !important;
        width: 120px !important;
      }
      .value {
        color: #4b5563 !important;
        display: inline-block !important;
        flex: 1 !important;
      }
      .footer {
        background-color: #f3f4f6 !important;
        padding: 20px !important;
        text-align: center !important;
        border-top: 1px solid #e5e7eb !important;
      }
      .footer p {
        color: #6b7280 !important;
        font-size: 12px !important;
        margin: 5px 0 !important;
      }
      .btn {
        display: inline-block !important;
        background-color: #F97316 !important; /* Socius Orange */
        color: #ffffff !important;
        padding: 12px 24px !important;
        border-radius: 6px !important;
        text-decoration: none !important;
        font-weight: bold !important;
        margin-top: 15px !important;
      }
    </style>
  `;

  const templates = {
    welcome: {
      subject: 'Welcome to Socius',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          ${baseStyle}
        </head>
        <body>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td align="center" style="padding: 20px;">
                <div class="container">
                  <div class="header">
                    <h1>Welcome to Socius</h1>
                  </div>
                  <div class="content">
                    <h2>Hello ${data.name},</h2>
                    <p>Welcome to Socius! Your account has been successfully created. You are now part of a community that shares and cares.</p>
                    
                    <div class="highlight">
                      <p style="margin: 0 0 10px 0; font-weight: bold;">What you can do:</p>
                      <p style="margin: 0;">• Borrow items from neighbors<br>
                      • Lend items you don't use often<br>
                      • Connect with your local community</p>
                    </div>
                    
                    <p>Start exploring items available in your area today!</p>

                    <p>Best regards,<br><strong>The Socius Team</strong></p>
                  </div>
                  <div class="footer">
                    <p>Socius Community Borrowing</p>
                    <p>&copy; ${new Date().getFullYear()} Socius. All rights reserved.</p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    },

    requestCreated: {
      subject: 'New Borrowing Request Received',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          ${baseStyle}
        </head>
        <body>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td align="center" style="padding: 20px;">
                <div class="container">
                  <div class="header">
                    <h1>New Request</h1>
                  </div>
                  <div class="content">
                    <h2>Hello ${data.ownerName},</h2>
                    <p>You have received a new request to borrow your item.</p>
                    
                    <div class="request-details">
                      <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">Request Details</h3>
                      <div class="detail-row">
                        <span class="label">Item:</span>
                        <span class="value">${data.itemName}</span>
                      </div>
                      <div class="detail-row">
                        <span class="label">Borrower:</span>
                        <span class="value">${data.borrowerName}</span>
                      </div>
                      <div class="detail-row">
                        <span class="label">Duration:</span>
                        <span class="value">${data.duration} days</span>
                      </div>
                      <div class="detail-row">
                        <span class="label">Total Deposit:</span>
                        <span class="value">₹${data.amount}</span>
                      </div>
                    </div>
                    
                    <p>Please log in to your dashboard to Approve or Reject this request.</p>
                    
                    <p>Best regards,<br><strong>The Socius Team</strong></p>
                  </div>
                  <div class="footer">
                    <p>Socius Community Borrowing</p>
                    <p>&copy; ${new Date().getFullYear()} Socius. All rights reserved.</p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    },

    requestApproved: {
      subject: 'Your Request was Approved!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          ${baseStyle}
        </head>
        <body>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td align="center" style="padding: 20px;">
                <div class="container">
                  <div class="header">
                    <h1>Request Approved</h1>
                  </div>
                  <div class="content">
                    <h2>Hello ${data.borrowerName},</h2>
                    <p>Great news! Your request to borrow <strong>${data.itemName}</strong> has been approved.</p>
                    
                    <div class="request-details">
                      <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">Details</h3>
                      <div class="detail-row">
                        <span class="label">Owner:</span>
                        <span class="value">${data.ownerName}</span>
                      </div>
                      <div class="detail-row">
                        <span class="label">Pickup Address:</span>
                        <span class="value">${data.address}</span>
                      </div>
                      <div class="detail-row">
                        <span class="label">Dates:</span>
                        <span class="value">${data.startDate} to ${data.endDate}</span>
                      </div>
                    </div>
                    
                    <div class="highlight">
                      <p style="margin: 0 0 10px 0; font-weight: bold;">Next Steps:</p>
                      <p style="margin: 0;">Please proceed to payment to confirm this booking.</p>
                    </div>

                    <p>Best regards,<br><strong>The Socius Team</strong></p>
                  </div>
                  <div class="footer">
                    <p>Socius Community Borrowing</p>
                    <p>&copy; ${new Date().getFullYear()} Socius. All rights reserved.</p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    }
  };

  return templates[type] || null;
};

// Named export for reminder email function
export const requestReminderEmail = (borrowerName, itemName, daysLeft) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: #f3f4f6 !important;
        }
        .container {
          width: 100% !important;
          max-width: 600px !important;
          margin: 0 auto !important;
          background-color: #ffffff !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          padding: 30px !important;
        }
        h1 { color: #F97316; font-size: 24px; }
        p { color: #4b5563; font-size: 16px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Item Return Reminder</h1>
        <p>Hello ${borrowerName},</p>
        <p>This is a gentle reminder that your borrowed item <strong>${itemName}</strong> is due for return in <strong>${daysLeft} days</strong>.</p>
        <p>Please ensure you return it on successfully to maintain a good community score!</p>
        <p>Best regards,<br>The Socius Team</p>
      </div>
    </body>
    </html>
  `;
};

export default getEmailTemplate;