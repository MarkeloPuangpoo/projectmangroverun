'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProgressStepper from '@/components/registration/ProgressStepper';
import StepPersonal from '@/components/registration/StepPersonal';
import StepRace from '@/components/registration/StepRace';
import StepPayment from '@/components/registration/StepPayment';
import SizeChartModal from '@/components/registration/SizeChartModal';
import SuccessModal from '@/components/registration/SuccessModal';
import { RegistrationFormData, RegistrationStep } from '@/types/registration';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import { LanguageProvider } from "@/contexts/LanguageContext";
import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage() {
    return (
        <LanguageProvider>
            <RegisterContent />
        </LanguageProvider>
    );
}

function RegisterContent() {
    // State
    const [step, setStep] = useState<RegistrationStep>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // Form Data
    const [formData, setFormData] = useState<RegistrationFormData>({
        fullNameTh: '',
        fullNameEn: '',
        nationalId: '',
        birthDate: '',
        age: '',
        gender: '',
        bloodType: '',
        medicalConditions: '',
        phone: '',
        email: '',
        raceCategory: '',
        shirtSize: '',
        shipping: 'pickup',
        paymentProof: null,
    });

    // Reset error when data changes
    useEffect(() => {
        if (errorMsg) setErrorMsg(null);
    }, [formData, step]);

    const updateFormData = (data: Partial<RegistrationFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const validateStep = (currentStep: number): boolean => {
        if (currentStep === 1) {
            return !!(formData.fullNameTh && formData.fullNameEn && formData.nationalId && formData.birthDate && formData.gender && formData.bloodType && formData.phone && formData.email);
        }
        if (currentStep === 2) {
            return !!(formData.raceCategory && formData.shirtSize && formData.shipping);
        }
        return true;
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, 3) as RegistrationStep);
            scrollToTop();
        } else {
            setErrorMsg('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน / Please fill in all required fields marked with *');
            const container = document.getElementById('form-container');
            container?.classList.add('animate-shake');
            setTimeout(() => container?.classList.remove('animate-shake'), 500);
        }
    };

    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 1) as RegistrationStep);
        scrollToTop();
    };

    const handleSubmit = async () => {
        if (!formData.paymentProof) {
            setErrorMsg('กรุณาอัพโหลดหลักฐานการโอนเงิน / Please upload payment slip');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const file = formData.paymentProof;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `slips/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('payment-slips')
                .upload(filePath, file);

            if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`);

            const { data: { publicUrl } } = supabase.storage
                .from('payment-slips')
                .getPublicUrl(filePath);

            const { error: insertError } = await supabase
                .from('registrations')
                .insert([
                    {
                        full_name_th: formData.fullNameTh,
                        full_name_en: formData.fullNameEn,
                        national_id: formData.nationalId,
                        birth_date: formData.birthDate,
                        age: Number(formData.age),
                        gender: formData.gender,
                        blood_type: formData.bloodType,
                        medical_conditions: formData.medicalConditions,
                        phone: formData.phone,
                        email: formData.email,
                        race_category: formData.raceCategory,
                        shirt_size: formData.shirtSize,
                        shipping_method: formData.shipping,
                        payment_slip_url: publicUrl,
                        status: 'pending'
                    }
                ]);

            if (insertError) throw new Error(`Registration Failed: ${insertError.message}`);

            setIsSuccessOpen(true);

        } catch (error: any) {
            console.error(error);
            setErrorMsg(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 font-sans selection:bg-neon-green selection:text-deep-blue flex flex-col relative overflow-x-hidden">

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
            />

            <Header />

            {/* ✅ FIXED: เพิ่ม Padding Top (pt-24 และ md:pt-36) เพื่อดันเนื้อหาลงมาไม่ให้โดน Header บัง */}
            <div className="flex-grow w-full max-w-4xl mx-auto px-4 pt-24 pb-8 md:pt-36 md:pb-12 z-10">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl md:text-5xl font-black text-deep-blue uppercase mb-3 tracking-tight">
                        Registration
                    </h1>
                    <p className="text-gray-600 font-medium">สมัครเข้าร่วมแข่งขัน Mangrove BPK RUN 2026</p>
                </div>

                {/* Stepper */}
                <div className="sticky top-[4rem] md:top-[5rem] z-40 bg-gray-50/95 backdrop-blur-sm py-2 transition-all">
                    <ProgressStepper currentStep={step} />
                </div>

                {/* Main Card */}
                <div
                    id="form-container"
                    className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-6 md:p-10 min-h-[500px] relative flex flex-col transition-all duration-300"
                >
                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 animate-pulse-soft">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm font-bold">{errorMsg}</span>
                        </div>
                    )}

                    <div className="flex-grow">
                        {step === 1 && <StepPersonal formData={formData} updateFormData={updateFormData} />}
                        {step === 2 && <StepRace formData={formData} updateFormData={updateFormData} onOpenSizeChart={() => setIsSizeChartOpen(true)} />}
                        {step === 3 && <StepPayment formData={formData} updateFormData={updateFormData} onBack={handleBack} onSubmit={handleSubmit} />}
                    </div>

                    <div className="hidden md:flex justify-between mt-12 pt-8 border-t border-gray-100">
                        {step > 1 ? (
                            <button
                                onClick={handleBack}
                                disabled={isSubmitting}
                                className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-deep-blue transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-5 h-5" /> Back
                            </button>
                        ) : <div />}

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                className="group px-10 py-3 rounded-xl font-bold bg-deep-blue text-white hover:bg-navy hover:shadow-lg hover:shadow-blue-900/20 transition-all flex items-center gap-3 transform hover:-translate-y-0.5"
                            >
                                Next
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`
                                    px-10 py-3 rounded-xl font-bold flex items-center gap-3 transform hover:-translate-y-0.5
                                    transition-all shadow-lg
                                    ${isSubmitting
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                        : 'bg-neon-green text-deep-blue hover:brightness-105 shadow-green-500/20'
                                    }
                                `}
                            >
                                {isSubmitting ? (
                                    <>Processing <Loader2 className="w-5 h-5 animate-spin" /></>
                                ) : (
                                    <>Confirm Registration <Check className="w-5 h-5" /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50 shadow-lg-up flex gap-3">
                {step > 1 && (
                    <button
                        onClick={handleBack}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Back
                    </button>
                )}

                {step < 3 ? (
                    <button
                        onClick={handleNext}
                        className="flex-[2] px-4 py-3 rounded-xl font-bold bg-deep-blue text-white shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                    >
                        Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`
                            flex-[2] px-4 py-3 rounded-xl font-bold text-deep-blue shadow-lg flex items-center justify-center gap-2
                            ${isSubmitting ? 'bg-gray-300' : 'bg-neon-green shadow-green-500/20'}
                        `}
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm'}
                    </button>
                )}
            </div>

            <div className="h-24 md:hidden" />

            <Footer />

            <SizeChartModal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
            <SuccessModal isOpen={isSuccessOpen} onClose={() => window.location.href = '/'} />
        </main>
    );
}