import nodemailer from 'nodemailer';

// --- 1. Config Validation & Setup ---
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || '"Mangrove Run Team" <noreply@mangroverun.com>';

// Validate Critical Config on Load (Fail-Fast)
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('⚠️ EMAIL SYSTEM WARNING: SMTP Environment variables are missing. Emails will not be sent.');
}

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

// --- 2. Design System (Fixed Light Theme for Email Reliability) ---
// Email clients (Gmail/Outlook) often mess up dark mode. 
// Safest bet: Force Light Theme container with high contrast.
const THEME = {
    primary: '#0F172A', // Navy Blue
    secondary: '#334155', // Slate 700
    accent: '#16a34a',  // Green 600 (Accessible on white)
    bg: '#f1f5f9',      // Slate 100
    card: '#ffffff',
    text: '#1e293b',    // Slate 800
    muted: '#64748b',   // Slate 500
    border: '#e2e8f0'   // Slate 200
};

// --- 3. Strict Type Definitions ---

export type EmailPayloads = {
    submission: {
        name: string;
    };
    approval: {
        name: string;
        bib: string;
        raceCategory: string;
    };
    rejection: {
        name: string;
        reason?: string;
    };
};

export type EmailType = keyof EmailPayloads;

interface EmailTemplate<T> {
    subject: string;
    html: (data: T) => string;
}

// --- 4. Wrapper & Templates ---

const wrapHtml = (title: string, content: string) => {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <title>${title}</title>
        <style>
            /* Reset */
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; }
            
            /* Force Light Mode */
            :root {
                color-scheme: light;
                supported-color-schemes: light;
            }
            body {
                margin: 0; padding: 0; width: 100% !important;
                background-color: ${THEME.bg} !important;
            }
        </style>
    </head>
    <body bgcolor="${THEME.bg}" style="margin: 0; padding: 0; background-color: ${THEME.bg}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <center style="width: 100%; background-color: ${THEME.bg};">
            <div style="display: none; font-size: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                ${title} - Mangrove Run 2026
            </div>
            
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; padding: 20px;">
                <tr>
                    <td align="center" bgcolor="${THEME.card}" style="border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 40px; overflow: hidden;">
                        
                        <!-- Header -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" style="padding-bottom: 30px; border-bottom: 2px solid ${THEME.bg};">
                                    <h1 style="margin: 0; color: ${THEME.primary}; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">
                                        Mangrove Run 2026
                                    </h1>
                                </td>
                            </tr>
                        </table>

                        <!-- Content -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding-top: 30px; color: ${THEME.text}; font-size: 16px; line-height: 1.6;">
                                    ${content}
                                </td>
                            </tr>
                        </table>

                        <!-- Footer -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" style="padding-top: 40px; color: ${THEME.muted}; font-size: 12px;">
                                    <p style="margin: 0;">&copy; 2026 Mangrove Run. All rights reserved.</p>
                                    <p style="margin: 5px 0 0;">This email was sent automatically.</p>
                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    `;
};

// Strictly Typed Templates Map
export const EMAIL_TEMPLATES: { [K in EmailType]: EmailTemplate<EmailPayloads[K]> } = {
    submission: {
        subject: '📝 Subscription Confirmed - รอการตรวจสอบ',
        html: (data) => {
            const content = `
                <h2 style="margin: 0 0 16px; color: ${THEME.primary}; font-size: 20px;">สวัสดีคุณ ${data.name},</h2>
                <p style="margin: 0 0 24px;">เราได้รับข้อมูลการสมัครของคุณเรียบร้อยแล้ว ขณะนี้ทีมงานกำลังตรวจสอบหลักฐานการโอนเงิน</p>
                
                <table width="100%" bgcolor="#fff7ed" cellpadding="0" cellspacing="0" style="border-radius: 12px; border: 1px solid #ffedd5;">
                    <tr>
                        <td style="padding: 20px;">
                            <p style="margin: 0; color: #9a3412; font-weight: bold; font-size: 14px; text-transform: uppercase;">status</p>
                            <p style="margin: 4px 0 0; color: #c2410c; font-size: 18px; font-weight: bold;">⏳ PENDING REVIEW</p>
                        </td>
                    </tr>
                </table>

                <p style="margin: 24px 0 0; font-size: 14px; color: ${THEME.muted};">กรุณารอผลยืนยันภายใน 24 ชม.</p>
            `;
            return wrapHtml('ได้รับข้อมูลการสมัคร', content);
        }
    },
    approval: {
        subject: '✅ Registration Approved - สมัครสำเร็จ!',
        html: (data) => {
            const content = `
                <div style="text-align: center;">
                    <div style="display: inline-block; background-color: #dcfce7; color: #15803d; padding: 12px; border-radius: 50%; margin-bottom: 20px;">
                        <!-- Checkmark Icon fallback -->
                        <span style="font-size: 32px; line-height: 1;">✓</span>
                    </div>
                    <h2 style="margin: 0 0 10px; color: ${THEME.primary}; font-size: 24px;">Registration Approved</h2>
                    <p style="margin: 0 0 30px; color: ${THEME.muted};">ยินดีด้วย! การสมัครของคุณสมบูรณ์แล้ว</p>
                </div>

                <table width="100%" bgcolor="#f0fdf4" cellpadding="0" cellspacing="0" style="border-radius: 16px; border: 1px solid #bbf7d0; overflow: hidden; margin-bottom: 30px;">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <p style="margin: 0 0 5px; color: #15803d; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">BIB NUMBER</p>
                            <p style="margin: 0; color: #166534; font-size: 48px; font-weight: 800; letter-spacing: -2px; line-height: 1;">${data.bib}</p>
                            
                            <div style="height: 1px; background-color: #bbf7d0; width: 60px; margin: 20px auto;"></div>
                            
                            <p style="margin: 0; color: #15803d; font-weight: bold;">${data.raceCategory}</p>
                            <p style="margin: 5px 0 0; font-size: 14px; color: #15803d;">${data.name}</p>
                        </td>
                    </tr>
                </table>

                <p style="text-align: center; color: ${THEME.text}; font-size: 14px;"><strong>โปรดบันทึกภาพหน้าจอนี้</strong> เพื่อใช้ยืนยันการรับเสื้อและ BIB ที่หน้างาน</p>
            `;
            return wrapHtml('การสมัครเสร็จสมบูรณ์', content);
        }
    },
    rejection: {
        subject: '⚠️ Action Required - แจ้งผลการตรวจสอบ',
        html: (data) => {
            const content = `
                <h2 style="margin: 0 0 16px; color: #dc2626; font-size: 20px;">Payment Issue Requires Action</h2>
                <p style="margin: 0 0 24px;">เรียนคุณ ${data.name}, เราไม่สามารถอนุมัติการสมัครของคุณได้เนื่องจากเหตุผลดังนี้:</p>
                
                <table width="100%" bgcolor="#fef2f2" cellpadding="0" cellspacing="0" style="border-radius: 12px; border: 1px solid #fee2e2;">
                    <tr>
                        <td style="padding: 20px;">
                            <p style="margin: 0; color: #991b1b; font-weight: bold; font-size: 14px; text-transform: uppercase;">Reason</p>
                            <p style="margin: 8px 0 0; color: #b91c1c; font-size: 16px;">
                                "${data.reason || 'หลักฐานไม่ถูกต้อง'}"
                            </p>
                        </td>
                    </tr>
                </table>

                <p style="margin: 30px 0 0; text-align: center;">
                    <a href="https://mangroverun.com/check-status" style="background-color: ${THEME.primary}; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                        ส่งหลักฐานใหม่ (Upload Slip)
                    </a>
                </p>
            `;
            return wrapHtml('แจ้งผลการตรวจสอบ', content);
        }
    }
};

interface SendEmailParams<K extends EmailType> {
    to: string;
    type: K;
    data: EmailPayloads[K];
    attachments?: any[];
}

export async function sendEmail<K extends EmailType>({ to, type, data, attachments }: SendEmailParams<K>) {
    if (!SMTP_HOST || !SMTP_USER) {
        return { success: false, error: 'SMTP Configuration Missing' };
    }

    try {
        const template = EMAIL_TEMPLATES[type];

        const info = await transporter.sendMail({
            from: SMTP_FROM,
            to,
            subject: template.subject,
            html: template.html(data),
            attachments
        });

        console.log(`📧 [${type}] Email sent to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };

    } catch (error: any) {
        console.error(`❌ Error sending [${type}] email to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
}