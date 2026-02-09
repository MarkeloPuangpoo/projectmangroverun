'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Registration } from '@/types/registration';
import { X, Save, Loader2, AlertCircle } from 'lucide-react';

interface EditRunnerModalProps {
    runner: Registration;
    onClose: () => void;
    onUpdate: (updatedRunner: Registration) => void;
}

export default function EditRunnerModal({ runner, onClose, onUpdate }: EditRunnerModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name_th: runner.full_name_th,
        full_name_en: runner.full_name_en,
        national_id: runner.national_id,
        phone: runner.phone,
        email: runner.email,
        race_category: runner.race_category,
        bib_number: runner.bib_number || '',
        gender: runner.gender,
        shirt_size: runner.shirt_size,
        birth_date: runner.birth_date,
        medical_conditions: runner.medical_conditions || '',
        address: runner.address || '',
        status: runner.status,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('registrations')
                .update(formData)
                .eq('id', runner.id)
                .select()
                .single();

            if (error) throw error;

            onUpdate(data as Registration);
            onClose();
        } catch (error) {
            console.error('Error updating runner:', error);
            alert('Failed to update runner information');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Edit Runner Profile</h2>
                        <p className="text-sm text-slate-500 font-medium">Update details for {runner.full_name_en}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Section: Personal Info */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-slate-200"></span> Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (TH)</label>
                                <input
                                    type="text"
                                    name="full_name_th"
                                    value={formData.full_name_th}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (EN)</label>
                                <input
                                    type="text"
                                    name="full_name_en"
                                    value={formData.full_name_en}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">National ID</label>
                                <input
                                    type="text"
                                    name="national_id"
                                    value={formData.national_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Contact */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-slate-200"></span> Contact Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Race Info */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-slate-200"></span> Race Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Category (Distance)</label>
                                <select
                                    name="race_category"
                                    value={formData.race_category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium"
                                >
                                    <option value="10.5KM">10.5KM (Mini Marathon)</option>
                                    <option value="6KM">6KM (Fun Run)</option>
                                    <option value="5KM">5KM (Walk-Run)</option>
                                    <option value="VIP">VIP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">BIB Number</label>
                                <input
                                    type="text"
                                    name="bib_number"
                                    value={formData.bib_number}
                                    onChange={handleChange}
                                    placeholder="Assign BIB..."
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-bold tracking-widest uppercase placeholder:font-normal placeholder:tracking-normal"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Shirt Size</label>
                                <select
                                    name="shirt_size"
                                    value={formData.shirt_size}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium"
                                >
                                    <option value="5XS">5XS</option>
                                    <option value="4XS">4XS</option>
                                    <option value="3XS">3XS</option>
                                    <option value="2XS">2XS</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="2XL">2XL</option>
                                    <option value="3XL">3XL</option>
                                    <option value="4XL">4XL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section: Medical & Address */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-slate-200"></span> Other Details
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Medical Conditions</label>
                            <textarea
                                name="medical_conditions"
                                value={formData.medical_conditions}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium resize-none"
                            />
                        </div>
                    </div>


                </form>

                {/* Footer Actions */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white hover:border-slate-300 transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
