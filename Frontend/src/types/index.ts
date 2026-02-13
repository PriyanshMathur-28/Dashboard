export interface User {
    id: string;
    email: string;
    full_name?: string;
}

export interface Profile {
    _id?: string;
    user: string;
    email: string;
    full_name: string;
    phone: string;
    dob: string;
    gender?: 'Male' | 'Female' | 'Other';
    marital_status?: string;
    employment_type?: string;
    company_name?: string;
    designation?: string;
    annual_income?: string;
    pan_number: string;
    aadhaar_last4?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    nominee_name?: string;
    nominee_relation?: string;
    nominee_contact?: string;
    onboarding_completed: boolean;
    created_at: string;
    updated_at: string;
}
