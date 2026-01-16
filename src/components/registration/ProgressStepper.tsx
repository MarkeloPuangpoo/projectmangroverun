import React from 'react';
import { User, Flag, CreditCard, Check } from 'lucide-react';
import { RegistrationStep } from '@/types/registration';

interface ProgressStepperProps {
    currentStep: RegistrationStep;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
    const steps = [
        { id: 1, label: 'ข้อมูลส่วนตัว', subLabel: 'Personal Info', icon: User },
        { id: 2, label: 'การแข่งขัน', subLabel: 'Race Details', icon: Flag },
        { id: 3, label: 'ชำระเงิน', subLabel: 'Payment', icon: CreditCard },
    ];

    // คำนวณความกว้างของ Progress Bar (เป็น %)
    const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="w-full py-4 md:py-8 px-4">
            <div className="relative max-w-3xl mx-auto">

                {/* Track Background (เส้นสีเทา) */}
                <div className="absolute top-[20px] md:top-[24px] left-0 w-full h-1 bg-gray-200 rounded-full -z-10" />

                {/* Active Progress Bar (เส้นสีเขียววิ่ง) */}
                <div
                    className="absolute top-[20px] md:top-[24px] left-0 h-1 bg-neon-green rounded-full -z-10 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,255,128,0.6)]"
                    style={{ width: `${progressWidth}%` }}
                />

                <div className="flex justify-between items-start">
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;

                        return (
                            <div key={step.id} className="flex flex-col items-center group relative cursor-default">

                                {/* Step Circle */}
                                <div
                                    className={`
                                        w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 
                                        transition-all duration-300 relative z-10
                                        ${isActive
                                            ? 'border-neon-green bg-white text-deep-blue scale-110 shadow-[0_0_20px_rgba(0,255,128,0.4)]'
                                            : ''
                                        }
                                        ${isCompleted
                                            ? 'border-neon-green bg-neon-green text-deep-blue scale-100'
                                            : ''
                                        }
                                        ${!isActive && !isCompleted
                                            ? 'border-gray-200 bg-white text-gray-300'
                                            : ''
                                        }
                                    `}
                                >
                                    {/* Pulse Effect for Active Step */}
                                    {isActive && (
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-20 animate-ping-slow"></span>
                                    )}

                                    {/* Icon */}
                                    <div className="relative z-10 transition-transform duration-300">
                                        {isCompleted ? (
                                            <Check className="w-6 h-6 animate-check-pop" />
                                        ) : (
                                            <step.icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'animate-bounce-subtle' : ''}`} />
                                        )}
                                    </div>
                                </div>

                                {/* Labels */}
                                <div className={`
                                    flex flex-col items-center mt-3 text-center transition-all duration-300
                                    ${isActive ? 'opacity-100 transform translate-y-0' : 'opacity-70'}
                                    ${!isActive && !isCompleted ? 'grayscale opacity-50' : ''}
                                `}>
                                    <span className={`
                                        text-xs md:text-sm font-bold whitespace-nowrap
                                        ${isActive || isCompleted ? 'text-deep-blue' : 'text-gray-400'}
                                    `}>
                                        {step.label}
                                    </span>
                                    <span className="text-[10px] text-gray-400 hidden md:block font-medium">
                                        {step.subLabel}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProgressStepper;