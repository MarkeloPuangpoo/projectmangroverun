import React, { useRef, useState } from 'react';
import { RegistrationFormData } from '@/types/registration';
import { Upload, X, Copy, Check, CheckCircle2, CreditCard, Wallet, Loader2, AlertTriangle, ArrowDown } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface StepPaymentProps {
    formData: RegistrationFormData;
    updateFormData: (data: Partial<RegistrationFormData>) => void;
    onBack: () => void;
    onSubmit: () => void;
}

const StepPayment: React.FC<StepPaymentProps> = ({ formData, updateFormData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(formData.paymentProof ? URL.createObjectURL(formData.paymentProof) : null);
    const [isCopied, setIsCopied] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);

    // Calculate Price
    const basePrice = formData.raceCategory === 'VIP' ? 2000 : 500;
    const shippingPrice = formData.shipping === 'postal' ? 50 : 0;
    const totalPrice = basePrice + shippingPrice;

    // Bank Details (Mockup)
    const bankAccount = {
        bank: "กสิกรไทย (KBANK)",
        name: "Mangrove Run Official",
        number: "012-3-45678-9",
        promptPayId: "0123456789000"
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
    };

    const processFile = async (file: File) => {
        setIsCompressing(true);
        // Config: บีบให้เหลือ < 0.5MB และขนาดไม่เกิน 1200px (พอสำหรับอ่านตัวหนังสือในสลิป)
        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            fileType: "image/jpeg"
        };

        try {
            const compressedFile = await imageCompression(file, options);
            updateFormData({ paymentProof: compressedFile });
            setPreviewUrl(URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error("Compression failed:", error);
            updateFormData({ paymentProof: file });
            setPreviewUrl(URL.createObjectURL(file));
        } finally {
            setIsDragOver(false);
            setIsCompressing(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
    };

    const clearFile = () => {
        updateFormData({ paymentProof: null });
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(bankAccount.number.replace(/-/g, ''));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in-up space-y-8">

            {/* --- Header: Total Amount (Sticky on Mobile Idea) --- */}
            <div className="bg-deep-blue rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl font-black text-neon-green mb-1">ยอดชำระเงิน (Total Payment)</h2>
                        <p className="text-blue-200 text-sm">กรุณาโอนเงินยอดนี้ เพื่อยืนยันการสมัคร</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                        <span className="text-4xl font-black tracking-tight">{totalPrice.toLocaleString()}</span>
                        <span className="text-sm font-bold ml-2">THB</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* --- Left Column: Payment Methods (Step 1) --- */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-deep-blue font-bold border-b border-gray-100 pb-2">
                        <div className="w-6 h-6 rounded-full bg-deep-blue text-white flex items-center justify-center text-xs">1</div>
                        <h3>เลือกช่องทางชำระเงิน (Transfer via)</h3>
                    </div>

                    {/* Bank Transfer Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:border-green-500 transition-colors cursor-pointer" onClick={copyToClipboard}>
                        <div className="p-5 flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#00A950] rounded-xl flex items-center justify-center text-white shadow-md shrink-0">
                                <span className="font-black text-sm">KBANK</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">{bankAccount.bank}</p>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xl md:text-2xl font-mono font-bold text-deep-blue truncate">{bankAccount.number}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${isCopied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {isCopied ? 'Copied!' : 'Click to Copy'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{bankAccount.name}</p>
                            </div>
                        </div>
                        {/* Copy Hint Bar */}
                        <div className="bg-gray-50 px-5 py-2 text-xs text-gray-400 font-medium flex justify-between items-center group-hover:bg-[#00A950] group-hover:text-white transition-colors">
                            <span>แตะเพื่อคัดลอกเลขบัญชี</span>
                            <Copy size={14} />
                        </div>
                    </div>

                    {/* QR Code (PromptPay Style) */}
                    <div className="bg-[#1A3764] rounded-2xl p-6 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-[#1A3764]" />
                        <img src="/thai-qr-logo.png" alt="Thai QR" className="h-6 mx-auto mb-4 opacity-80" /> {/* ถ้าไม่มีรูปนี้ ให้ลบออกหรือหาใส่ */}

                        <div className="bg-white p-4 rounded-xl inline-block shadow-lg mb-4">
                            {/* Placeholder QR - ใน Production ควรใช้ library 'qrcode.react' Gen จาก PromptPay ID */}
                            <div className="w-40 h-40 bg-gray-100 flex items-center justify-center rounded border-2 border-dashed border-gray-300">
                                <p className="text-xs text-gray-400 text-center px-2">
                                    QR Code for<br />
                                    <span className="font-mono font-bold text-gray-600 text-lg mt-1 block">{totalPrice}.-</span>
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-blue-200">สแกนจ่ายผ่าน Mobile Banking ได้ทุกธนาคาร</p>
                    </div>
                </div>

                {/* --- Right Column: Upload Slip (Step 2) --- */}
                <div className="space-y-6 flex flex-col">
                    <div className="flex items-center gap-2 text-deep-blue font-bold border-b border-gray-100 pb-2">
                        <div className="w-6 h-6 rounded-full bg-deep-blue text-white flex items-center justify-center text-xs">2</div>
                        <h3>แนบหลักฐานการโอน (Upload Slip)</h3>
                    </div>

                    <div
                        className={`
                            flex-1 min-h-[300px] border-2 border-dashed rounded-3xl transition-all duration-300 relative flex flex-col items-center justify-center overflow-hidden
                            ${previewUrl ? 'border-neon-green bg-green-50/20' : 'hover:bg-gray-50 hover:border-gray-400'}
                            ${isDragOver ? 'border-neon-green bg-green-100 scale-[1.02]' : 'border-gray-300'}
                        `}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                            className={`absolute inset-0 w-full h-full cursor-pointer z-10 ${previewUrl ? 'hidden' : 'opacity-0'}`}
                        />

                        {/* Loading State */}
                        {isCompressing && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                                <Loader2 className="w-12 h-12 text-neon-green animate-spin mb-4" />
                                <p className="text-deep-blue font-bold">กำลังบีบอัดรูปภาพ...</p>
                                <p className="text-xs text-gray-500">Optimizing Image</p>
                            </div>
                        )}

                        {previewUrl ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-gray-900/5 p-4">
                                <img src={previewUrl} alt="Slip Preview" className="max-h-[350px] w-auto object-contain rounded-lg shadow-xl" />

                                {/* Overlay Controls */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-20 backdrop-blur-[2px]">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-6 py-2 bg-white rounded-full font-bold text-sm hover:bg-neon-green hover:text-deep-blue transition-colors"
                                    >
                                        เปลี่ยนรูปใหม่ (Change)
                                    </button>
                                    <button
                                        onClick={clearFile}
                                        className="px-6 py-2 bg-red-500 text-white rounded-full font-bold text-sm hover:bg-red-600 transition-colors"
                                    >
                                        ลบรูป (Remove)
                                    </button>
                                </div>

                                <div className="absolute bottom-4 right-4 bg-neon-green text-deep-blue px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg flex items-center gap-2 pointer-events-none z-10">
                                    <CheckCircle2 size={16} /> Ready to Submit
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8 pointer-events-none">
                                <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 transition-colors ${isDragOver ? 'bg-neon-green text-deep-blue' : 'text-gray-400'}`}>
                                    <Upload size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-gray-700">คลิกเพื่ออัปโหลดสลิป</h4>
                                <p className="text-sm text-gray-500 mt-1">หรือลากไฟล์มาวางที่นี่ (Drag & Drop)</p>
                                <p className="text-xs text-gray-400 mt-4 bg-gray-100 inline-block px-2 py-1 rounded">
                                    รองรับ JPG, PNG (Max 5MB)
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Warning Hint */}
                    <div className="bg-orange-50 p-4 rounded-xl flex gap-3 border border-orange-100">
                        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-orange-800 leading-relaxed">
                            <strong className="block mb-1">สำคัญ:</strong>
                            กรุณาตรวจสอบ <strong>"วัน-เวลา"</strong> และ <strong>"ยอดเงิน"</strong> ในสลิปให้ชัดเจนก่อนกดยืนยัน หากตรวจสอบไม่ผ่าน ท่านอาจเสียสิทธิ์ในการสมัคร
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Summary Expander (Optional Detail) --- */}
            <div className="border-t border-gray-100 pt-6">
                <details className="group">
                    <summary className="flex items-center gap-2 text-sm font-bold text-gray-500 cursor-pointer hover:text-deep-blue w-fit">
                        <ArrowDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        ดูรายละเอียดคำสั่งซื้อ (Order Details)
                    </summary>
                    <div className="mt-4 bg-gray-50 rounded-xl p-6 grid sm:grid-cols-3 gap-6 text-sm animate-fade-in-down">
                        <div>
                            <span className="block text-gray-400 text-xs uppercase mb-1">Category</span>
                            <span className="font-bold text-gray-800">{formData.raceCategory}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs uppercase mb-1">Shirt Size</span>
                            <span className="font-bold text-gray-800">{formData.shirtSize}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs uppercase mb-1">Shipping</span>
                            <span className="font-bold text-gray-800 flex items-center gap-2">
                                {formData.shipping === 'postal' ? 'Postal (+50฿)' : 'Pickup (Free)'}
                            </span>
                        </div>
                        {formData.address && (
                            <div className="sm:col-span-3 border-t border-gray-200 pt-3 mt-1">
                                <span className="block text-gray-400 text-xs uppercase mb-1">Shipping Address</span>
                                <span className="font-medium text-gray-700">{formData.address}</span>
                            </div>
                        )}
                    </div>
                </details>
            </div>
        </div>
    );
};

export default StepPayment;