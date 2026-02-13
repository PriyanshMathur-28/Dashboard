// import { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../lib/api';
// import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
// import { Button } from '../../components/ui/Button';
// import { Input } from '../../components/ui/Input';
// import { Profile } from '../../types';
// import {
//     User,
//     MapPin,
//     CreditCard,
//     Briefcase,
//     Users,
//     Shield,
//     ChevronDown,
//     ChevronRight,
//     X,
//     CheckCircle2,
//     AlertCircle,
// } from 'lucide-react';
// import { cn } from '../../lib/utils';

// type SectionId = 'personal' | 'address' | 'identity' | 'employment' | 'nominee' | 'security';

// const sections: { id: SectionId; label: string; icon: React.ElementType; description: string }[] = [
//     { id: 'personal', label: 'Personal Information', icon: User, description: 'Name, contact & basic details' },
//     { id: 'address', label: 'Address', icon: MapPin, description: 'Residential address' },
//     { id: 'identity', label: 'Identity & KYC', icon: CreditCard, description: 'PAN, Aadhaar' },
//     { id: 'employment', label: 'Employment', icon: Briefcase, description: 'Job & income details' },
//     { id: 'nominee', label: 'Nominee', icon: Users, description: 'Nominee for accounts' },
//     { id: 'security', label: 'Security', icon: Shield, description: 'Password & verification' },
// ];

// function profileToForm(profile: Profile | null): Record<string, string> {
//     if (!profile) return {};
//     const d = profile.dob ? (typeof profile.dob === 'string' ? profile.dob : (profile.dob as any).split?.('T')?.[0] || '') : '';
//     return {
//         full_name: profile.full_name || '',
//         email: profile.email || '',
//         phone: profile.phone || '',
//         dob: d,
//         gender: profile.gender || '',
//         marital_status: profile.marital_status || '',
//         address_line1: profile.address_line1 || '',
//         address_line2: profile.address_line2 || '',
//         city: profile.city || '',
//         state: profile.state || '',
//         pincode: profile.pincode || '',
//         country: profile.country || 'India',
//         pan_number: profile.pan_number || '',
//         aadhaar_last4: profile.aadhaar_last4 || '',
//         employment_type: profile.employment_type || '',
//         company_name: profile.company_name || '',
//         designation: profile.designation || '',
//         annual_income: profile.annual_income || '',
//         nominee_name: profile.nominee_name || '',
//         nominee_relation: profile.nominee_relation || '',
//         nominee_contact: profile.nominee_contact || '',
//     };
// }

// export default function Account() {
//     const { user, profile, refreshProfile } = useAuth();
//     const [expanded, setExpanded] = useState<SectionId | null>('personal');
//     const [editing, setEditing] = useState<SectionId | null>(null);
//     const [form, setForm] = useState<Record<string, string>>(profileToForm(profile));
//     const [saving, setSaving] = useState(false);
//     const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//     useEffect(() => {
//         setForm(profileToForm(profile));
//     }, [profile]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         let { name, value } = e.target;
//         if (name === 'pan_number') value = value.toUpperCase();
//         if (name === 'aadhaar_last4') value = value.replace(/\D/g, '').slice(0, 4);
//         setForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const buildPayload = (section: SectionId): Record<string, unknown> => {
//         const base: Record<string, unknown> = {
//             full_name: user?.full_name || user?.email?.split('@')[0],
//             email: user?.email,
//         };
//         switch (section) {
//             case 'personal':
//                 return { ...base, phone: form.phone, dob: form.dob, gender: form.gender, marital_status: form.marital_status, full_name: form.full_name };
//             case 'address':
//                 return { ...base, address_line1: form.address_line1, address_line2: form.address_line2, city: form.city, state: form.state, pincode: form.pincode, country: form.country };
//             case 'identity':
//                 return { ...base, pan_number: form.pan_number, aadhaar_last4: form.aadhaar_last4 };
//             case 'employment':
//                 return { ...base, employment_type: form.employment_type, company_name: form.company_name, designation: form.designation, annual_income: form.annual_income };
//             case 'nominee':
//                 return { ...base, nominee_name: form.nominee_name, nominee_relation: form.nominee_relation, nominee_contact: form.nominee_contact };
//             default:
//                 return base;
//         }
//     };

//     const saveSection = async (section: SectionId) => {
//         setSaving(true);
//         setMessage(null);
//         try {
//             const payload = buildPayload(section);
//             await api.post('/profile', payload);
//             await refreshProfile();
//             setEditing(null);
//             setMessage({ type: 'success', text: 'Saved successfully.' });
//             setTimeout(() => setMessage(null), 3000);
//         } catch (err: any) {
//             setMessage({ type: 'error', text: err.response?.data?.msg || err.response?.data?.error || 'Failed to save' });
//         } finally {
//             setSaving(false);
//         }
//     };

//     const isEditing = (id: SectionId) => editing === id;
//     const toggleExpand = (id: SectionId) => setExpanded((e) => (e === id ? null : id));

//     return (
//         <div className="space-y-8 max-w-4xl">
//             <div>
//                 <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
//                 <p className="mt-1 text-slate-500">Manage your profile, address, KYC and security.</p>
//             </div>

//             {message && (
//                 <div
//                     className={cn(
//                         'flex items-center gap-3 rounded-lg px-4 py-3 text-sm',
//                         message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
//                     )}
//                 >
//                     {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
//                     {message.text}
//                 </div>
//             )}

//             <div className="space-y-3">
//                 {sections.map(({ id, label, icon: Icon, description }) => (
//                     <Card key={id} className="overflow-hidden">
//                         <button
//                             type="button"
//                             onClick={() => toggleExpand(id)}
//                             className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors"
//                         >
//                             <div className="flex items-center gap-4">
//                                 <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
//                                     <Icon className="h-5 w-5" />
//                                 </div>
//                                 <div>
//                                     <CardTitle className="text-base font-semibold text-slate-900">{label}</CardTitle>
//                                     <CardDescription>{description}</CardDescription>
//                                 </div>
//                             </div>
//                             {expanded === id ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
//                         </button>

//                         {expanded === id && (
//                             <CardContent className="pt-0 pb-6 border-t border-slate-100">
//                                 {id === 'personal' && (
//                                     <div className="space-y-4 pt-6">
//                                         {!isEditing('personal') ? (
//                                             <>
//                                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                                     <Field label="Full Name" value={profile?.full_name || '—'} />
//                                                     <Field label="Email" value={user?.email || '—'} />
//                                                     <Field label="Phone" value={profile?.phone || '—'} />
//                                                     <Field label="Date of Birth" value={profile?.dob ? new Date(profile.dob).toLocaleDateString() : '—'} />
//                                                     <Field label="Gender" value={profile?.gender || '—'} />
//                                                     <Field label="Marital Status" value={profile?.marital_status || '—'} />
//                                                 </div>
//                                                 <Button variant="outline" size="sm" onClick={() => setEditing('personal')}>Edit</Button>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                                     <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
//                                                     <Input label="Email" name="email" value={form.email} disabled />
//                                                     <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
//                                                     <Input label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
//                                                     <Select label="Gender" name="gender" value={form.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
//                                                     <Select label="Marital Status" name="marital_status" value={form.marital_status} onChange={handleChange} options={['Single', 'Married', 'Divorced', 'Widowed', 'Other']} />
//                                                 </div>
//                                                 <div className="flex gap-2">
//                                                     <Button size="sm" onClick={() => saveSection('personal')} isLoading={saving}>Save</Button>
//                                                     <Button variant="outline" size="sm" onClick={() => setEditing(null)} disabled={saving}><X className="h-4 w-4 mr-1" /> Cancel</Button>
//                                                 </div>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}

//                                 {id === 'address' && (
//                                     <div className="space-y-4 pt-6">
//                                         {!isEditing('address') ? (
//                                             <>
//                                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                                     <Field label="Address Line 1" value={profile?.address_line1 || '—'} />
//                                                     <Field label="Address Line 2" value={profile?.address_line2 || '—'} />
//                                                     <Field label="City" value={profile?.city || '—'} />
//                                                     <Field label="State" value={profile?.state || '—'} />
//                                                     <Field label="Pincode" value={profile?.pincode || '—'} />
//                                                     <Field label="Country" value={profile?.country || '—'} />
//                                                 </div>
//                                                 <Button variant="outline" size="sm" onClick={() => setEditing('address')}>Edit</Button>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Input label="Address Line 1" name="address_line1" value={form.address_line1} onChange={handleChange} placeholder="Building, Street" />
//                                                 <Input label="Address Line 2" name="address_line2" value={form.address_line2} onChange={handleChange} placeholder="Landmark, Area (optional)" />
//                                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                                                     <Input label="City" name="city" value={form.city} onChange={handleChange} />
//                                                     <Input label="State" name="state" value={form.state} onChange={handleChange} />
//                                                     <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="110001" maxLength={6} />
//                                                 </div>
//                                                 <Input label="Country" name="country" value={form.country} onChange={handleChange} />
//                                                 <div className="flex gap-2">
//                                                     <Button size="sm" onClick={() => saveSection('address')} isLoading={saving}>Save</Button>
//                                                     <Button variant="outline" size="sm" onClick={() => setEditing(null)} disabled={saving}><X className="h-4 w-4 mr-1" /> Cancel</Button>
//                                                 </div>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}

//                                 {id === 'identity' && (
//                                     <div className="space-y-4 pt-6">
//                                         {!isEditing('identity') ? (
//                                             <>
//                                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                                     <Field label="PAN Number" value={profile?.pan_number?.length === 10 ? `${profile.pan_number.slice(0, 5)}****${profile.pan_number.slice(-1)}` : (profile?.pan_number || '—')} />
//                                                     <Field label="Aadhaar (last 4 digits)" value={profile?.aadhaar_last4 ? `**** **** ${profile.aadhaar_last4}` : '—'} />
//                                                 </div>
//                                                 <Button variant="outline" size="sm" onClick={() => setEditing('identity')}>Edit</Button>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Input label="PAN Number" name="pan_number" value={form.pan_number} onChange={handleChange} placeholder="ABCDE1234F" maxLength={10} />
//                                                 <Input label="Aadhaar last 4 digits" name="aadhaar_last4" value={form.aadhaar_last4} onChange={handleChange} placeholder="1234" maxLength={4} />
//                                                 <div className="flex gap-2">
//                                                     <Button size="sm" onClick={() => saveSection('identity')} isLoading={saving}>Save</Button>
//                                                     <Button variant="outline" size="sm" onClick={() => setEditing(null)} disabled={saving}><X className="h-4 w-4 mr-1" /> Cancel</Button>
//                                                 </div>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}

//                                 {id === 'employment' && (
//                                     <div className="space-y-4 pt-6">
//                                         {!isEditing('employment') ? (
//                                             <>
//                                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                                     <Field label="Employment Type" value={profile?.employment_type || '—'} />
//                                                     <Field label="Company Name" value={profile?.company_name || '—'} />
//                                                     <Field label="Designation" value={profile?.designation || '—'} />
//                                                     <Field label="Annual Income" value={profile?.annual_income ? `₹ ${profile.annual_income}` : '—'} />
//                                                 </div>
//                                                 <Button variant="outline" size="sm" onClick={() => setEditing('employment')}>Edit</Button>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Select label="Employment Type" name="employment_type" value={form.employment_type} onChange={handleChange} options={['Salaried', 'Self-Employed', 'Student', 'Homemaker', 'Business', 'Other']} />
//                                                 <Input label="Company Name" name="company_name" value={form.company_name} onChange={handleChange} placeholder="Employer or business name" />
//                                                 <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="Job title" />
//                                                 <Input label="Annual Income (₹)" name="annual_income" value={form.annual_income} onChange={handleChange} placeholder="e.g. 800000" />
//                                                 <div className="flex gap-2">
//                                                     <Button size="sm" onClick={() => saveSection('employment')} isLoading={saving}>Save</Button>
//                                                     <Button variant="outline" size="sm" onClick={() => setEditing(null)} disabled={saving}><X className="h-4 w-4 mr-1" /> Cancel</Button>
//                                                 </div>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}

//                                 {id === 'nominee' && (
//                                     <div className="space-y-4 pt-6">
//                                         {!isEditing('nominee') ? (
//                                             <>
//                                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                                     <Field label="Nominee Name" value={profile?.nominee_name || '—'} />
//                                                     <Field label="Relation" value={profile?.nominee_relation || '—'} />
//                                                     <Field label="Nominee Contact" value={profile?.nominee_contact || '—'} />
//                                                 </div>
//                                                 <Button variant="outline" size="sm" onClick={() => setEditing('nominee')}>Edit</Button>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Input label="Nominee Full Name" name="nominee_name" value={form.nominee_name} onChange={handleChange} />
//                                                 <Input label="Relation" name="nominee_relation" value={form.nominee_relation} onChange={handleChange} placeholder="e.g. Spouse, Father" />
//                                                 <Input label="Nominee Phone" name="nominee_contact" type="tel" value={form.nominee_contact} onChange={handleChange} />
//                                                 <div className="flex gap-2">
//                                                     <Button size="sm" onClick={() => saveSection('nominee')} isLoading={saving}>Save</Button>
//                                                     <Button variant="outline" size="sm" onClick={() => setEditing(null)} disabled={saving}><X className="h-4 w-4 mr-1" /> Cancel</Button>
//                                                 </div>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}

//                                 {id === 'security' && (
//                                     <div className="pt-6 space-y-4">
//                                         <p className="text-sm text-slate-500">Password and two-factor authentication are managed from a separate security flow. Contact support to change email or enable 2FA.</p>
//                                         <Button variant="outline" size="sm" disabled>Change Password (coming soon)</Button>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         )}
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     );
// }

// function Field({ label, value }: { label: string; value: string }) {
//     return (
//         <div>
//             <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
//             <p className="mt-0.5 text-slate-900 font-medium">{value}</p>
//         </div>
//     );
// }

// function Select({
//     label,
//     name,
//     value,
//     onChange,
//     options,
// }: {
//     label: string;
//     name: string;
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//     options: string[];
// }) {
//     return (
//         <div className="space-y-1">
//             <label className="block text-sm font-medium text-slate-700">{label}</label>
//             <select
//                 name={name}
//                 value={value}
//                 onChange={onChange}
//                 className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//             >
//                 <option value="">Select</option>
//                 {options.map((opt) => (
//                     <option key={opt} value={opt}>{opt}</option>
//                 ))}
//             </select>
//         </div>
//     );
// }