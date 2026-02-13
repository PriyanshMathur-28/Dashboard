export interface User {
    id: string;
    email: string;
    full_name?: string;
}

export interface Profile {
    _id?: string;
    user: string; // Reference to User ID
    email: string;
    full_name: string;
    phone: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    employment_type: 'Salaried' | 'Self-Employed' | 'Student' | 'Other';
    pan_number: string;
    onboarding_completed: boolean;
    created_at: string;
    updated_at: string;
}
