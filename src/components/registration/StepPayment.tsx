import React, { useRef, useState } from 'react';
import { RegistrationFormData } from '@/types/registration';
import { Upload, Copy, CheckCircle2, AlertTriangle, ArrowDown, FileText, X, ChevronRight, ShieldCheck } from 'lucide-react';
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
    const [isTermsOpen, setIsTermsOpen] = useState(false); // State เปิด/ปิด Modal กฎหมาย

    // Calculate Price
    const basePrice = formData.raceCategory === 'VIP' ? 2000 : 500;
    const shippingPrice = formData.shipping === 'postal' ? 50 : 0;
    const totalPrice = basePrice + shippingPrice;

    // Bank Details
    const bankAccount = {
        bank: "กสิกรไทย (KBANK)",
        name: "Mangrove Run Official",
        number: "012-3-45678-9",
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
    };

    const processFile = async (file: File) => {
        setIsCompressing(true);
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true, fileType: "image/jpeg" };
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
        <div className="animate-fade-in-up space-y-8 pb-4">
            {/* Header: Total Amount */}
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
                {/* Left Column: Payment Methods */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-deep-blue font-bold border-b border-gray-100 pb-2">
                        <div className="w-6 h-6 rounded-full bg-deep-blue text-white flex items-center justify-center text-xs">1</div>
                        <h3>เลือกช่องทางชำระเงิน (Transfer via)</h3>
                    </div>

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
                    </div>

                    <div className="bg-[#1A3764] rounded-2xl p-6 text-center text-white relative overflow-hidden">
                        {/* Placeholder QR Code */}
                        <div className="bg-white p-4 rounded-xl inline-block shadow-lg mb-4">
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

                {/* Right Column: Upload Slip */}
                <div className="space-y-6 flex flex-col">
                    <div className="flex items-center gap-2 text-deep-blue font-bold border-b border-gray-100 pb-2">
                        <div className="w-6 h-6 rounded-full bg-deep-blue text-white flex items-center justify-center text-xs">2</div>
                        <h3>แนบหลักฐานการโอน (Upload Slip)</h3>
                    </div>

                    <div
                        className={`flex-1 min-h-[300px] border-2 border-dashed rounded-3xl transition-all duration-300 relative flex flex-col items-center justify-center overflow-hidden
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
                        {/* ... (Loading & Preview Logic same as before) ... */}
                        {previewUrl ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-gray-900/5 p-4">
                                <img src={previewUrl} alt="Slip Preview" className="max-h-[350px] w-auto object-contain rounded-lg shadow-xl" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-20 backdrop-blur-[2px]">
                                    <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-white rounded-full font-bold text-sm hover:bg-neon-green hover:text-deep-blue transition-colors">Change</button>
                                    <button onClick={clearFile} className="px-6 py-2 bg-red-500 text-white rounded-full font-bold text-sm hover:bg-red-600 transition-colors">Remove</button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8 pointer-events-none">
                                <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 transition-colors ${isDragOver ? 'bg-neon-green text-deep-blue' : 'text-gray-400'}`}>
                                    <Upload size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-gray-700">อัปโหลดสลิป</h4>
                                <p className="text-sm text-gray-500 mt-1">คลิก หรือ ลากไฟล์มาวางที่นี่</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- CONSENT SECTION (ส่วนใหม่ที่เพิ่มเข้ามา) --- */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="relative flex items-center">
                        <input
                            id="terms-checkbox"
                            type="checkbox"
                            checked={formData.agreedToTerms || false}
                            onChange={(e) => updateFormData({ agreedToTerms: e.target.checked })}
                            className="w-6 h-6 border-2 border-gray-300 rounded-lg text-deep-blue focus:ring-deep-blue/20 cursor-pointer transition-all checked:bg-deep-blue checked:border-deep-blue"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="terms-checkbox" className="text-sm text-gray-700 font-medium cursor-pointer select-none">
                            ข้าพเจ้าขอรับรองว่าข้อมูลข้างต้นเป็นความจริง และข้าพเจ้าได้อ่าน เข้าใจ และยอมรับ
                            <span
                                onClick={(e) => { e.preventDefault(); setIsTermsOpen(true); }}
                                className="text-deep-blue font-bold hover:underline mx-1 cursor-pointer"
                            >
                                ข้อกำหนดและเงื่อนไข (Terms & Conditions)
                            </span>
                            รวมถึงนโยบายความเป็นส่วนตัว ของกิจกรรม Mangrove BPK RUN 2026
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                            * จำเป็นต้องกดยอมรับเพื่อดำเนินการต่อ (Required to proceed)
                        </p>
                    </div>
                </div>
            </div>

            {/* --- Summary Expander --- */}
            <div className="border-t border-gray-100 pt-6">
                <details className="group">
                    <summary className="flex items-center gap-2 text-sm font-bold text-gray-500 cursor-pointer hover:text-deep-blue w-fit">
                        <ArrowDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        ดูรายละเอียดคำสั่งซื้อ (Order Details)
                    </summary>
                    <div className="mt-4 bg-gray-50 rounded-xl p-6 grid sm:grid-cols-3 gap-6 text-sm animate-fade-in-down">
                        {/* ... ข้อมูลสรุปเดิม ... */}
                        <div><span className="block text-gray-400 text-xs uppercase mb-1">Category</span><span className="font-bold text-gray-800">{formData.raceCategory}</span></div>
                        <div><span className="block text-gray-400 text-xs uppercase mb-1">Size</span><span className="font-bold text-gray-800">{formData.shirtSize}</span></div>
                    </div>
                </details>
            </div>

            {/* --- MODAL Terms & Conditions (ฉบับละเอียด) --- */}
            {isTermsOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">

                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-deep-blue/10 rounded-lg">
                                    <ShieldCheck className="w-6 h-6 text-deep-blue" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">ข้อตกลงและเงื่อนไข (Terms & Conditions)</h3>
                                    <p className="text-xs text-gray-500">กรุณาอ่านให้ครบถ้วนเพื่อสิทธิประโยชน์ของท่าน</p>
                                </div>
                            </div>
                            <button onClick={() => setIsTermsOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content Scrollable */}
                        <div className="p-6 overflow-y-auto custom-scrollbar text-sm text-gray-600 leading-relaxed space-y-6">

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-xs">
                                <strong>หมายเหตุ:</strong> การกด "ยอมรับเงื่อนไข" (I Accept) ถือว่าท่านได้อ่าน ทำความเข้าใจ และตกลงผูกพันตามข้อกำหนดนี้ทุกประการ โดยมีผลผูกพันทางกฎหมายทันที
                            </div>

                            {/* 1. การสมัครและการชำระเงิน */}
                            <section>
                                <h4 className="font-bold text-deep-blue text-base mb-2 flex items-center gap-2">
                                    1. การสมัครและการชำระเงิน (Registration & Payment)
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                    <li>ผู้สมัครรับรองว่าข้อมูลที่ใช้ในการสมัครเป็นความจริงทุกประการ หากตรวจพบว่ามีการปลอมแปลงข้อมูล ผู้จัดงานขอสงวนสิทธิ์ในการตัดสิทธิ์การแข่งขันทันที</li>
                                    <li><strong>การชำระเงินถือเป็นที่สิ้นสุด (Non-Refundable):</strong> ผู้จัดงานขอสงวนสิทธิ์ในการไม่คืนเงินค่าสมัครทุกกรณี ไม่ว่าด้วยเหตุผลส่วนตัวของผู้สมัคร การบาดเจ็บ หรือเหตุอื่นใด</li>
                                    <li>สิทธิ์การเข้าร่วมแข่งขัน (BIB) <strong>ไม่สามารถโอนให้ผู้อื่น (Non-Transferable)</strong> หรือจำหน่ายต่อได้ เว้นแต่จะได้รับอนุญาตจากผู้จัดงานอย่างเป็นลายลักษณ์อักษร หากฝ่าฝืน ผู้จัดงานจะไม่รับผิดชอบต่อความเสียหายหรือสวัสดิภาพของผู้รับช่วงสิทธิ์นั้น</li>
                                </ul>
                            </section>

                            {/* 2. สุขภาพและความพร้อม */}
                            <section>
                                <h4 className="font-bold text-deep-blue text-base mb-2 flex items-center gap-2">
                                    2. การรับรองสุขภาพ (Health Declaration)
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                    <li>ผู้สมัครรับรองว่าตนมีสุขภาพแข็งแรงสมบูรณ์ ทั้งทางร่างกายและจิตใจ ไม่มีโรคประจำตัวร้ายแรงที่อาจเป็นอันตรายต่อการวิ่ง (เช่น โรคหัวใจ, ความดันโลหิตสูงรุนแรง, หอบหืดรุนแรง ฯลฯ) และได้ผ่านการฝึกซ้อมมาเป็นอย่างดี</li>
                                    <li>หากผู้สมัครมีอาการเจ็บป่วยก่อน หรือระหว่างการแข่งขัน ผู้สมัครยินยอมที่จะหยุดการแข่งขันทันทีเพื่อความปลอดภัย</li>
                                </ul>
                            </section>

                            {/* 3. การสละสิทธิ์เรียกร้องและการปฐมพยาบาล */}
                            <section>
                                <h4 className="font-bold text-deep-blue text-base mb-2 flex items-center gap-2">
                                    3. ความรับผิดและการปฐมพยาบาล (Liability Waiver & Medical Consent)
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                    <li><strong>การสละสิทธิ์เรียกร้อง:</strong> ผู้สมัครตกลงเข้าร่วมกิจกรรมด้วยความสมัครใจ และยอมรับความเสี่ยง (Assumption of Risk) ที่อาจเกิดขึ้น ข้าพเจ้าขอปลดเปลื้องความรับผิด (Waiver of Liability) แก่ผู้จัดงาน (Organizers), สปอนเซอร์, เจ้าหน้าที่ และหน่วยงานที่เกี่ยวข้อง จากการบาดเจ็บ ทุพพลภาพ เสียชีวิต หรือความสูญเสียต่อทรัพย์สิน ในทุกกรณี</li>
                                    <li><strong>การปฐมพยาบาล:</strong> ในกรณีฉุกเฉิน ผู้สมัครยินยอมให้ทีมแพทย์หรือเจ้าหน้าที่ทำการปฐมพยาบาล และ/หรือ นำส่งสถานพยาบาลตามดุลยพินิจของแพทย์ โดยผู้สมัครยินดีรับผิดชอบค่าใช้จ่ายในการรักษาพยาบาลส่วนเกินจากวงเงินประกันอุบัติเหตุ (ถ้ามี) ด้วยตนเอง</li>
                                </ul>
                            </section>

                            {/* 4. เหตุสุดวิสัยและการยกเลิกงาน */}
                            <section>
                                <h4 className="font-bold text-deep-blue text-base mb-2 flex items-center gap-2">
                                    4. การเปลี่ยนแปลงหรือยกเลิกกิจกรรม (Event Cancellation)
                                </h4>
                                <p className="mb-2">
                                    ผู้จัดงานขอสงวนสิทธิ์ในการเปลี่ยนแปลงเส้นทาง เวลาปล่อยตัว หรือยกเลิกการแข่งขัน ในกรณีเกิดเหตุสุดวิสัย (Force Majeure) ที่อยู่นอกเหนือการควบคุม เช่น:
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                    <li>ภัยธรรมชาติ (น้ำท่วม, พายุ, แผ่นดินไหว)</li>
                                    <li>สภาพอากาศเลวร้าย หรือ ค่าฝุ่น PM2.5 เกินมาตรฐานความปลอดภัย</li>
                                    <li>โรคระบาด หรือ คำสั่งระงับจากหน่วยงานราชการ</li>
                                    <li>เหตุการณ์ความไม่สงบ หรือ การจลาจล</li>
                                </ul>
                                <p className="mt-2 text-red-600 font-medium">
                                    **ในกรณีดังกล่าว ผู้จัดงานขอสงวนสิทธิ์ในการ "ไม่คืนเงินค่าสมัคร" และไม่มีภาระหน้าที่ในการชดเชยค่าเสียหายอื่นใด** เนื่องจากค่าสมัครได้ถูกนำไปใช้ในการเตรียมงานล่วงหน้าแล้ว
                                </p>
                            </section>

                            {/* 5. ทรัพย์สินส่วนตัว */}
                            <section>
                                <h4 className="font-bold text-deep-blue text-base mb-2 flex items-center gap-2">
                                    5. ทรัพย์สินส่วนตัว (Personal Belongings)
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                    <li>ผู้จัดงานมีจุดรับฝากของเพื่ออำนวยความสะดวกเท่านั้น</li>
                                    <li>ผู้จัดงาน <strong>ไม่รับผิดชอบ</strong> ต่อความสูญหายหรือเสียหายของทรัพย์สินมีค่า (เช่น โทรศัพท์มือถือ, กุญแจรถ, กระเป๋าสตางค์, เครื่องประดับ) ที่ผู้สมัครนำมาในบริเวณงาน หรือฝากไว้</li>
                                </ul>
                            </section>

                            {/* 6. กฎหมาย PDPA (ละเอียด) */}
                            <section>
                                <h4 className="font-bold text-deep-blue text-base mb-2 flex items-center gap-2">
                                    6. การคุ้มครองข้อมูลส่วนบุคคล (PDPA & Privacy Policy)
                                </h4>
                                <p className="mb-2">ข้าพเจ้ายินยอมให้ผู้จัดงาน (Data Controller) เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล ดังนี้:</p>
                                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                    <li><strong>ข้อมูลทั่วไป:</strong> ชื่อ-นามสกุล, วันเกิด, เพศ, เบอร์โทรศัพท์, อีเมล เพื่อใช้ในการยืนยันตัวตน, ติดต่อประสานงาน และประกาศผลการแข่งขัน</li>
                                    <li><strong>ข้อมูลอ่อนไหว (Sensitive Data):</strong> หมู่เลือด, ประวัติการแพ้ยา/โรคประจำตัว เพื่อใช้ในการปฐมพยาบาล, การรักษาพยาบาลฉุกเฉิน และการทำประกันอุบัติเหตุกลุ่ม</li>
                                    <li><strong>สิทธิในภาพถ่าย (Media Release):</strong> ข้าพเจ้ายินยอมให้ผู้จัดงานและช่างภาพ บันทึกภาพนิ่งและภาพเคลื่อนไหวของข้าพเจ้า และอนุญาตให้นำภาพดังกล่าวไปใช้ในการประชาสัมพันธ์ เผยแพร่ผ่านสื่อ Social Media, เว็บไซต์ หรือสื่อสิ่งพิมพ์ของงาน Mangrove BPK RUN โดยไม่มีค่าตอบแทน และถือเป็นลิขสิทธิ์ของผู้จัดงาน</li>
                                </ul>
                            </section>

                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400">
                                    * กฎกติกาและการตัดสินของคณะกรรมการจัดการแข่งขันถือเป็นที่สิ้นสุด (The organizer's decision is final)
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl sticky bottom-0 z-10">
                            <button
                                onClick={() => setIsTermsOpen(false)}
                                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors text-sm"
                            >
                                ปิด (Close)
                            </button>
                            <button
                                onClick={() => {
                                    updateFormData({ agreedToTerms: true });
                                    setIsTermsOpen(false);
                                }}
                                className="px-6 py-2.5 rounded-xl font-bold bg-deep-blue text-white hover:bg-navy transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/10 text-sm"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                ข้าพเจ้ายอมรับเงื่อนไข (I Accept)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepPayment;