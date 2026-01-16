import React, { useRef, useState } from 'react';
import { RegistrationFormData } from '@/types/registration';
import { Upload, X, Copy, Check, QrCode, CreditCard, Wallet, Loader2 } from 'lucide-react';
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

    // Bank Details
    const bankAccount = {
        bank: "ธนาคารกสิกรไทย (KBank)",
        name: "Mangrove Run Official",
        number: "012-3-45678-9"
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = async (file: File) => {
        setIsCompressing(true);

        // Settings for compression
        const options = {
            maxSizeMB: 0.1,          // Max 0.5 MB
            maxWidthOrHeight: 800,  // Max dimension
            useWebWorker: true,
            fileType: "image/jpeg"
        };

        try {
            const compressedFile = await imageCompression(file, options);

            updateFormData({ paymentProof: compressedFile });
            setPreviewUrl(URL.createObjectURL(compressedFile));
            console.log(`Original: ${file.size / 1024 / 1024} MB, Compressed: ${compressedFile.size / 1024 / 1024} MB`);
        } catch (error) {
            console.error("Compression failed:", error);
            // Fallback to original
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
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const clearFile = () => {
        updateFormData({ paymentProof: null });
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(bankAccount.number.replace(/-/g, ''));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in-up space-y-8">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-deep-blue">ชำระเงิน / Payment</h2>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    <Wallet className="w-4 h-4" />
                    Pending Payment
                </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* Left Column: Summary & Payment Info (3/5) */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Order Ticket */}
                    <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm relative">
                        {/* Decorative Top */}
                        <div className="h-2 bg-gradient-to-r from-deep-blue to-neon-green" />

                        <div className="p-6">
                            <h3 className="font-bold text-lg text-deep-blue mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-neon-green" /> สรุปรายการ (Order Summary)
                            </h3>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center group">
                                    <span className="text-gray-500 group-hover:text-deep-blue transition-colors">Category</span>
                                    <span className="font-bold text-deep-blue">{formData.raceCategory}</span>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-gray-500 group-hover:text-deep-blue transition-colors">Shirt Size</span>
                                    <span className="font-bold text-deep-blue">{formData.shirtSize}</span>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-gray-500 group-hover:text-deep-blue transition-colors">Shipping</span>
                                    <span className="font-bold text-deep-blue">
                                        {formData.shipping === 'postal' ? 'Postal Delivery' : 'Pick up at event'}
                                    </span>
                                </div>

                                <div className="border-t border-dashed border-gray-200 my-4"></div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">{basePrice.toLocaleString()} THB</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Shipping Fee</span>
                                    <span className="font-medium text-gray-900">{shippingPrice > 0 ? `+${shippingPrice}` : 'Free'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Highlight */}
                        <div className="bg-deep-blue p-6 flex justify-between items-center text-white">
                            <div>
                                <span className="text-xs text-blue-200 uppercase tracking-wider block">Total Amount</span>
                                <span className="text-sm text-blue-200">ยอดชำระทั้งสิ้น</span>
                            </div>
                            <div className="text-3xl font-black text-neon-green tracking-tight">
                                {totalPrice.toLocaleString()} <span className="text-sm font-bold text-white">THB</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#00A950] rounded-lg flex items-center justify-center text-white shadow-sm">
                                <span className="font-bold text-xs">KBANK</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-deep-blue">{bankAccount.bank}</h4>
                                <p className="text-xs text-gray-500">{bankAccount.name}</p>
                            </div>
                        </div>

                        {/* Copyable Account Number */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between group hover:border-[#00A950] transition-all cursor-pointer shadow-sm" onClick={copyToClipboard}>
                            <div className="font-mono text-xl md:text-2xl font-bold text-deep-blue tracking-wider group-hover:text-[#00A950] transition-colors">
                                {bankAccount.number}
                            </div>
                            <button
                                type="button"
                                className={`
                                    p-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-bold
                                    ${isCopied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 group-hover:bg-[#00A950] group-hover:text-white'}
                                `}
                            >
                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {isCopied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: QR & Upload (2/5) */}
                <div className="lg:col-span-2 space-y-6 flex flex-col">

                    {/* QR Code Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                        <div className="bg-[#1A3764] text-white py-2 rounded-t-lg -mx-6 -mt-6 mb-6">
                            <span className="text-sm font-bold">Thai QR Payment</span>
                        </div>
                        <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 relative group cursor-pointer overflow-hidden">
                            {/* Placeholder for QR Image */}
                            <QrCode className="w-16 h-16 text-gray-300 group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm">Scan Me</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Scan via any Banking App</p>
                    </div>

                    {/* File Upload Zone - Grow to fill height */}
                    <div
                        className={`
                            flex-grow border-2 border-dashed rounded-2xl transition-all duration-300 relative min-h-[200px] flex flex-col items-center justify-center overflow-hidden
                            ${previewUrl ? 'border-neon-green bg-green-50/10' : 'hover:bg-gray-50'}
                            ${isDragOver ? 'border-neon-green bg-green-50 scale-[1.02] shadow-xl' : 'border-gray-300'}
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

                        {/* Loading Indicator */}
                        {isCompressing && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                                <Loader2 className="w-10 h-10 text-neon-green animate-spin" />
                                <p className="text-sm font-bold text-deep-blue mt-2">Compressing...</p>
                            </div>
                        )}

                        {previewUrl ? (
                            <div className="relative w-full h-full flex items-center justify-center p-4">
                                <img src={previewUrl} alt="Slip Preview" className="max-h-64 rounded-lg shadow-md object-contain" />

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-white text-deep-blue px-4 py-2 rounded-full font-bold text-sm hover:bg-neon-green hover:scale-105 transition-all"
                                    >
                                        Change
                                    </button>
                                    <button
                                        onClick={clearFile}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 hover:scale-105 transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-neon-green text-deep-blue text-xs font-bold px-2 py-1 rounded-md shadow-sm pointer-events-none z-10 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Ready
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-6 space-y-3 pointer-events-none">
                                <div className={`
                                    w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-colors duration-300
                                    ${isDragOver ? 'bg-neon-green text-deep-blue' : 'bg-gray-100 text-gray-400'}
                                `}>
                                    <Upload className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-bold text-deep-blue text-lg">Upload Slip</p>
                                    <p className="text-sm text-gray-500">Click or Drag & Drop here</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepPayment;