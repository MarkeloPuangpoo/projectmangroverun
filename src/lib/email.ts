import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || '"Mangrove Run Team" <noreply@mangroverun.com>';

// Config สีและธีม
const THEME = {
    primary: '#0F172A', // Deep Blue
    accent: '#CCFF00',  // Neon Green
    text: '#334155',    // Slate 700
    bg: '#F8FAFC',      // Slate 50
    white: '#FFFFFF'
};

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});


export type EmailType = 'submission' | 'approval' | 'rejection';

interface SubmissionData {
    name: string;
}

interface ApprovalData {
    name: string;
    bib: string;
    raceCategory: string;
}

interface RejectionData {
    name: string;
    reason?: string;
}

type EmailData = SubmissionData | ApprovalData | RejectionData;

interface EmailTemplate {
    subject: string;
    html: (data: unknown) => string;
}

// ฟังก์ชันห่อหุ้มธีมหลัก (Header & Footer)
const wrapHtml = (title: string, content: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${THEME.bg}; font-family: 'Prompt', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: ${THEME.white}; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);">
                        
                        <tr>
                            <td style="background-color: ${THEME.primary}; padding: 40px 30px; text-align: center; background-image: url('https://www.transparenttextures.com/patterns/cubes.png');">
                                <h1 style="color: ${THEME.accent}; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; font-weight: 800; line-height: 1.2;">
                                    Mangrove Run<br/>
                                    <span style="color: #ffffff; font-size: 20px; font-weight: 300;">2026</span>
                                </h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px;">
                                ${content}
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0 0 10px; color: ${THEME.text}; font-size: 14px; font-weight: 600;">Mangrove Run 2026 Team</p>
                                <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                    ติดต่อสอบถาม: contact@mangroverun.com | Facebook Page
                                </p>
                            </td>
                        </tr>
                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    `;
};

export const EMAIL_TEMPLATES: Record<EmailType, EmailTemplate> = {
    submission: {
        subject: '📝 ได้รับข้อมูลการสมัคร - Mangrove Run 2026',
        html: (input: unknown) => {
            const data = input as SubmissionData;
            const content = `
                <h2 style="color: ${THEME.primary}; margin-top: 0; font-size: 22px;">สวัสดีคุณ ${data.name},</h2>
                <p style="color: ${THEME.text}; font-size: 16px; line-height: 1.6;">
                    เราได้รับข้อมูลการสมัครของคุณเรียบร้อยแล้ว! 🎉 <br>
                    ขณะนี้ทีมงานกำลังตรวจสอบหลักฐานการโอนเงิน (Payment Slip)
                </p>
                
                <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; color: #b45309; font-weight: bold;">⏳ สถานะ: รอการตรวจสอบ</p>
                    <p style="margin: 5px 0 0; color: #92400e; font-size: 14px;">กรุณารออีเมลยืนยันผลการตรวจสอบภายใน 24-48 ชั่วโมง</p>
                </div>

                <p style="color: ${THEME.text}; font-size: 16px;">ขอบคุณที่มาร่วมเป็นส่วนหนึ่งในการวิ่งครั้งนี้ครับ</p>
            `;
            return wrapHtml('ได้รับข้อมูลการสมัคร', content);
        }
    },
    approval: {
        subject: '✅ การสมัครเสร็จสมบูรณ์ - พบกันวันงาน!',
        html: (input: unknown) => {
            const data = input as ApprovalData;
            const content = `
                <div style="text-align: center; margin-bottom: 30px;">
                     <div style="display: inline-block; background-color: #dcfce7; color: #15803d; padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: bold; margin-bottom: 20px;">
                        APPROVED / อนุมัติแล้ว
                    </div>
                    <h2 style="color: ${THEME.primary}; margin: 0; font-size: 24px;">ยินดีด้วยคุณ ${data.name}!</h2>
                    <p style="color: #64748b; margin-top: 8px;">การสมัครของคุณเสร็จสมบูรณ์เรียบร้อย</p>
                </div>

                <div style="background: linear-gradient(135deg, ${THEME.primary} 0%, #1e293b 100%); border-radius: 16px; padding: 30px; color: white; text-align: center; margin: 30px 0; box-shadow: 0 10px 20px rgba(0,0,0,0.2); position: relative; overflow: hidden;">
                    
                    <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background-color: ${THEME.accent}; opacity: 0.2; border-radius: 50%;"></div>
                    
                    <p style="margin: 0; color: ${THEME.accent}; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">RACE CATEGORY</p>
                    <h3 style="margin: 5px 0 20px; font-size: 24px; color: white;">${data.raceCategory}</h3>
                    
                    <div style="background-color: rgba(255,255,255,0.1); border: 2px solid ${THEME.accent}; padding: 15px 30px; display: inline-block; border-radius: 12px;">
                        <span style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 5px;">YOUR BIB NUMBER</span>
                        <span style="display: block; font-size: 48px; font-weight: 800; line-height: 1; color: white; font-family: 'Courier New', monospace; letter-spacing: -2px;">
                            ${data.bib}
                        </span>
                    </div>
                </div>

                <p style="color: ${THEME.text}; text-align: center; font-size: 14px; margin-top: 30px;">
                    กรุณาแสดงอีเมลนี้ (หรือแจ้งชื่อ-นามสกุล) <br>เพื่อรับเสื้อและ BIB ตามวันเวลาที่กำหนด
                </p>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://mangroverun.com" style="background-color: ${THEME.primary}; color: ${THEME.accent}; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; transition: all 0.3s;">เข้าสู่เว็บไซต์</a>
                </div>
            `;
            return wrapHtml('การสมัครเสร็จสมบูรณ์', content);
        }
    },
    rejection: {
        subject: '⚠️ แจ้งผลการตรวจสอบการชำระเงิน - Mangrove Run 2026',
        html: (input: unknown) => {
            const data = input as RejectionData;
            const content = `
                <div style="text-align: center; margin-bottom: 30px;">
                     <div style="display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: bold; margin-bottom: 20px;">
                        PAYMENT REJECTED / ไม่ผ่านการตรวจสอบ
                    </div>
                    <h2 style="color: ${THEME.primary}; margin: 0; font-size: 24px;">เรียนคุณ ${data.name}</h2>
                    <p style="color: #64748b; margin-top: 8px;">พบปัญหาเกี่ยวกับหลักฐานการโอนเงินของคุณ</p>
                </div>

                <div style="background-color: #fff1f2; border-left: 4px solid #f43f5e; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; color: #881337; font-weight: bold; font-size: 16px;">สาเหตุที่ไม่อนุมัติ:</p>
                    <p style="margin: 5px 0 0; color: #be123c; font-size: 16px;">
                        "${data.reason || 'หลักฐานการโอนเงินไม่ถูกต้อง หรือยอดเงินไม่ตรงกับรายการสมัคร'}"
                    </p>
                </div>

                <p style="color: ${THEME.text}; font-size: 16px; line-height: 1.6; text-align: center;">
                    กรุณาตรวจสอบข้อมูลและทำการแนบหลักฐานการโอนเงินใหม่อีกครั้งผ่านลิงก์ด้านล่าง <br>
                    หรือติดต่อเจ้าหน้าที่หากมีข้อสงสัย
                </p>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://mangroverun.com/check-status" style="background-color: ${THEME.text}; color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        ส่งหลักฐานใหม่ / ตรวจสอบสถานะ
                    </a>
                </div>
            `;
            return wrapHtml('แจ้งผลการตรวจสอบ', content);
        }
    }
};

export async function sendEmail({ to, type, data }: { to: string, type: EmailType, data: EmailData }) {
    if (!SMTP_HOST || !SMTP_USER) {
        // ใช้ console.error เพื่อให้เห็นชัดใน log เวลา deploy
        console.error('⚠️ SMTP Config missing. Email cannot be sent.', { to, type });
        return { success: false, error: 'SMTP Config missing' };
    }

    try {
        const template = EMAIL_TEMPLATES[type];
        if (!template) throw new Error(`Invalid email type: ${type}`);

        const info = await transporter.sendMail({
            from: SMTP_FROM,
            to,
            subject: template.subject,
            html: template.html(data),
        });

        console.log(`📧 Email sent successfully: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, error };
    }
}