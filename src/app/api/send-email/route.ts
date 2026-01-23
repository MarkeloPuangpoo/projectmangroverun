
import { NextResponse } from 'next/server';
import { sendEmail, EmailType } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { to, type, data } = body;

        if (!to || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await sendEmail({ to, type: type as EmailType, data });

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, messageId: result.messageId });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
