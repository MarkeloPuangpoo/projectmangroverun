export interface RegistrationFormData {
    // Step 1: Personal
    fullNameTh: string;
    fullNameEn: string;
    nationalId: string;
    birthDate: string; // YYYY-MM-DD
    age: number | '';
    gender: 'male' | 'female' | '';
    bloodType: string;
    medicalConditions: string;
    phone: string;
    email: string;

    // Step 2: Race
    raceCategory: '10.5KM' | '6KM' | '5KM' | 'VIP' | '';
    shirtSize: string;
    shipping: 'pickup' | 'postal';

    // Step 3: Payment
    paymentProof: File | null;
    kit_picked_up?: boolean;
    agreedToTerms: boolean;
    checked_in_at?: string;
    bib_number?: string;
    address?: string | null;
}

export interface Registration extends RegistrationFormData {
    id: string;
    created_at: string;
    status: 'pending' | 'approved' | 'rejected';
    payment_slip_url: string | null;
    // Database fields might use snake_case, need to map or strictly type the DB response
    full_name_th: string;
    full_name_en: string;
    national_id: string;
    birth_date: string;
    race_category: string;
    shirt_size: string;
    shipping_method: string;
    medical_conditions: string | null;
    address: string | null;
}

export type RegistrationStep = 1 | 2 | 3;
