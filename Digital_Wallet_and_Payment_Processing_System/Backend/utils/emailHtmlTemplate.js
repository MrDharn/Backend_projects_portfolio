/**
 * HTML Email Wrapper Layout
 */
const emailWrapper = (title, content) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; border: 1px solid #eef2f5; border-radius: 8px; color: #1a202c; background-color: #ffffff;">
    <div style="padding-bottom: 20px; border-bottom: 2px solid #3b82f6; text-align: center;">
        <h2 style="margin: 0; color: #3b82f6; letter-spacing: 0.5px;">WALLET APP</h2>
    </div>
    <div style="padding: 24px 10px; line-height: 1.6;">
        <h3 style="margin-top: 0; color: #2d3748;">${title}</h3>
        ${content}
    </div>
    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eef2f5; text-align: center; font-size: 12px; color: #718096;">
        <p style="margin: 0 0 5px 0;">This is an automated operational alert regarding your secure account.</p>
        <p style="margin: 0;">&copy; 2026 Wallet App Inc. All rights reserved.</p>
    </div>
</div>
`;

// 1. Wallet Funded Template

const getDepositEmail = (amount, reference, currentBalance) =>
  emailWrapper(
    "✨ Wallet Credit Notification",
    `<p>Hello,</p>
     <p>Your app wallet has been credited successfully via Paystack.</p>
     <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 8px 0;"><strong>Amount Credited:</strong> ₦${Number(amount).toLocaleString()}</p>
        <p style="margin: 0 0 8px 0;"><strong>New Wallet Balance:</strong> ₦${Number(currentBalance).toLocaleString()}</p>
        <p style="margin: 0;"><strong>Reference ID:</strong> ${reference}</p>
     </div>
     <p>If you did not expect or authorize this credit transaction, please contact our security desk immediately.</p>`,
  );

// 2. Welcome/Registration Template
const getWelcomeEmail = (fullName) =>
  emailWrapper(
    "👋 Welcome to Wallet App!",
    `<p>Hello ${fullName || "there"},</p>
         <p>Your premium digital wallet profile has been configured successfully. You can now securely fund your digital account, keep track of real-time expenditures, and initiate commercial bank withdrawals instantly.</p>
         <div style="text-align: center; margin: 25px 0;">
            <p style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">Explore Your Dashboard</p>
         </div>
         <p>To keep your assets entirely secure, ensure your security transaction PIN remains confidential at all times.</p>`,
  );

// 3. Security PIN Reset Template
const getPasswordChangeEmail = () =>
  emailWrapper(
    "🔒 Security Update: Transaction PIN Changed",
    `<p>Hello,</p>
         <p>This message confirms that your secure <strong>Transaction PIN</strong> has been successfully modified or updated within your settings profile.</p>
         <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #991b1b; font-weight: 500;"><strong>Security Warning:</strong> If you did not execute this action yourself, your profile may be compromised. Lock your profile and recover your parameters right away.</p>
         </div>
         <p>Our operational staff will never request your clear-text security codes over phone channels or email chains.</p>`,
  );
module.exports = {
  getDepositEmail,
  getWelcomeEmail,
  getPasswordChangeEmail,
};
