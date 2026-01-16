import React, { useEffect, useState } from 'react';
import { Check, Home, Download } from 'lucide-react';
import Link from 'next/link';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
            document.body.style.overflow = 'hidden'; // Lock scroll
        } else {
            setShow(false);
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div
                className={`
                    absolute inset-0 bg-deep-blue/90 backdrop-blur-sm transition-opacity duration-500
                    ${show ? 'opacity-100' : 'opacity-0'}
                `}
            />

            {/* Modal Card */}
            <div
                className={`
                    relative bg-white rounded-3xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl
                    transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                    ${show ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-10 opacity-0'}
                `}
            >
                {/* Animated Success Icon */}
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 border-4 border-neon-green/30 rounded-full animate-ping-slow"></div>
                    <div className="absolute inset-0 border-4 border-neon-green/50 rounded-full"></div>
                    <Check className="w-12 h-12 text-neon-green stroke-[3] animate-check-pop" />
                </div>

                <h2 className="text-3xl font-black text-deep-blue mb-2 uppercase tracking-tight">
                    Registration<br />Successful!
                </h2>
                <p className="text-gray-500 font-medium mb-8">
                    ลงทะเบียนสำเร็จ! เราได้รับข้อมูลและหลักฐานการชำระเงินของท่านแล้ว
                    <br /><span className="text-xs text-gray-400 mt-2 block">(ระบบจะตรวจสอบและยืนยันสถานะภายใน 24 ชม.)</span>
                </p>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full py-3.5 rounded-xl bg-deep-blue text-white font-bold hover:bg-navy hover:shadow-lg hover:shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" /> กลับหน้าหลัก (Back to Home)
                    </Link>

                    {/* Optional: Slip Download or Check Status button for future */}
                    {/* <button className="block w-full py-3.5 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" /> Download Ticket
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
