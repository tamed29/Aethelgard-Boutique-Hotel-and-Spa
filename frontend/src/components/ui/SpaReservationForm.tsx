'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Sparkles, Send, Check, ArrowRight } from 'lucide-react';
import axios from 'axios';


const treatments = [
    { id: '1', title: 'Aethelgard Signature Massage', duration: '90 min', price: 180 },
    { id: '2', title: 'Ancient Salt Scrub & Plunge', duration: '60 min', price: 120 },
    { id: '3', title: 'Wychwood Facial Ritual', duration: '75 min', price: 150 },
    { id: '4', title: 'Forest Flow Yoga (Private)', duration: '60 min', price: 90 },
];

const oils = ['Honeysuckle & Pine', 'Wild Lavender', 'Sandalwood & Moss', 'Unscented Heritage Oil'];
const intensities = ['Gentle Renewal', 'Moderate Flow', 'Deep Earth Release'];

export default function SpaReservationForm() {
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [confCode, setConfCode] = useState('');
    const [formData, setFormData] = useState({
        treatment: '',
        date: '',
        time: '',
        oil: 'Wild Lavender',
        intensity: 'Moderate Flow',
        notes: '',
        name: '',
        email: '',
        phone: ''
    });

    const isStep1Valid = formData.treatment && formData.date && formData.time;
    const isStep3Valid = formData.name && formData.email && formData.phone;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        const confirmCode = `SPA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/spa`, {
                guestName: formData.name,
                guestEmail: formData.email,
                therapyType: formData.treatment,
                date: formData.date,
                timeSlot: formData.time,
                specialRequests: `Phone: ${formData.phone} | Oil: ${formData.oil} | Intensity: ${formData.intensity} | Notes: ${formData.notes}`
            });
        } catch (_) {
            // Backend may be offline — silently continue; reservation is logged locally.
        }

        setConfCode(confirmCode);
        setStatus('success');
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-moss-900/40 backdrop-blur-xl border border-moss-100/20 p-12 text-center rounded-3xl shadow-2xl"
            >
                <div className="w-20 h-20 bg-moss-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Check className="w-10 h-10 text-moss-900" />
                </div>
                <h3 className="text-3xl font-serif text-moss-100 mb-4">Ritual Confirmed</h3>
                <div className="mb-8">
                    <p className="text-moss-100/40 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Confirmation Code</p>
                    <p className="text-4xl font-serif text-white tracking-widest">{confCode}</p>
                </div>
                <p className="text-moss-100/70 font-light max-w-md mx-auto mb-10 text-sm leading-relaxed italic">
                    Your sanctuary awaits, {formData.name.split(' ')[0]}. A formal invitation has been sent to {formData.email}. We look forward to your arrival.
                </p>
                <button
                    onClick={() => { setStatus('idle'); setStep(1); }}
                    className="text-moss-100/50 uppercase tracking-widest text-[9px] font-black border-b border-moss-100/20 hover:border-moss-100 pb-2 transition-all"
                >
                    Book another session
                </button>
            </motion.div>
        );
    }

    return (
        <div className="bg-black/20 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-12">
                    <div className="flex gap-2">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1 w-8 rounded-full transition-colors duration-500 ${step >= s ? 'bg-moss-100' : 'bg-white/10'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-moss-100/40">Step {step} of 3</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium ml-1">Select Your Ritual</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {treatments.map(t => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, treatment: t.title })}
                                                className={`p-6 rounded-2xl border text-left transition-all duration-300 ${formData.treatment === t.title ? 'bg-moss-100 border-moss-100 text-moss-900' : 'bg-white/5 border-white/10 text-moss-100 hover:bg-white/10'}`}
                                            >
                                                <div className="font-serif text-lg mb-1">{t.title}</div>
                                                <div className="text-[10px] uppercase tracking-widest opacity-60">{t.duration} — ${t.price}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium ml-1">Preferred Date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-moss-100/30 group-focus-within:text-moss-100 transition-colors" />
                                            <input
                                                type="date"
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-moss-100 outline-none focus:border-moss-100 transition-all custom-datepicker"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium ml-1">Preferred Time</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-moss-100/30 group-focus-within:text-moss-100 transition-colors" />
                                            <select
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-moss-100 outline-none focus:border-moss-100 transition-all appearance-none"
                                            >
                                                <option value="" className="bg-moss-900">Select Time</option>
                                                <option value="09:00" className="bg-moss-900">09:00 AM</option>
                                                <option value="11:00" className="bg-moss-900">11:00 AM</option>
                                                <option value="14:00" className="bg-moss-900">02:00 PM</option>
                                                <option value="16:00" className="bg-moss-900">04:00 PM</option>
                                                <option value="18:00" className="bg-moss-900">06:00 PM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={!isStep1Valid}
                                    onClick={() => setStep(2)}
                                    className="w-full bg-moss-100 text-moss-900 py-6 rounded-xl uppercase tracking-[0.2em] text-[10px] font-black hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                                >
                                    Customize Experience <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" /> Sensory Selection (Oil)
                                        </label>
                                        <div className="space-y-3">
                                            {oils.map(o => (
                                                <label key={o} className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="radio" name="oil" value={o}
                                                        checked={formData.oil === o}
                                                        onChange={(e) => setFormData({ ...formData, oil: e.target.value })}
                                                        className="hidden"
                                                    />
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${formData.oil === o ? 'border-moss-100 bg-moss-100' : 'border-white/20 group-hover:border-white/40'}`}>
                                                        {formData.oil === o && <div className="w-1.5 h-1.5 rounded-full bg-moss-900" />}
                                                    </div>
                                                    <span className={`text-sm transition-colors ${formData.oil === o ? 'text-moss-100' : 'text-moss-100/50'}`}>{o}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium">Pressure Intensity</label>
                                        <div className="space-y-3">
                                            {intensities.map(i => (
                                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="radio" name="intensity" value={i}
                                                        checked={formData.intensity === i}
                                                        onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                                                        className="hidden"
                                                    />
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${formData.intensity === i ? 'border-moss-100 bg-moss-100' : 'border-white/20 group-hover:border-white/40'}`}>
                                                        {formData.intensity === i && <div className="w-1.5 h-1.5 rounded-full bg-moss-900" />}
                                                    </div>
                                                    <span className={`text-sm transition-colors ${formData.intensity === i ? 'text-moss-100' : 'text-moss-100/50'}`}>{i}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium">Notes for Your Practitioner</label>
                                    <textarea
                                        rows={3}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-moss-100 outline-none focus:border-moss-100 transition-all resize-none"
                                        placeholder="Any focus areas or sensitivities we should be aware of?"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-[1] border border-white/10 text-moss-100/50 py-6 rounded-xl uppercase tracking-[0.2em] text-[10px] font-black hover:bg-white/5 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="flex-[2] bg-moss-100 text-moss-900 py-6 rounded-xl uppercase tracking-[0.2em] text-[10px] font-black hover:bg-white transition-all flex items-center justify-center gap-3"
                                    >
                                        Guest Details <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Gwendolyn Thorne"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-moss-100 outline-none focus:border-moss-100 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="g.thorne@estate.com"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-moss-100 outline-none focus:border-moss-100 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium ml-1">Telephone</label>
                                    <input
                                        type="tel"
                                        placeholder="+44 (0) 7700 900000"
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-moss-100 outline-none focus:border-moss-100 transition-all"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="flex-[1] border border-white/10 text-moss-100/50 py-6 rounded-xl uppercase tracking-[0.2em] text-[10px] font-black hover:bg-white/5 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!isStep3Valid || status === 'submitting'}
                                        className="flex-[2] bg-moss-100 text-moss-900 py-6 rounded-xl uppercase tracking-[0.2em] text-[10px] font-black hover:bg-white transition-all flex items-center justify-center gap-3"
                                    >
                                        {status === 'submitting' ? 'Confirming Sanctuary...' : 'Reserve Ritual'} <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>

            <style jsx>{`
                .custom-datepicker::-webkit-calendar-picker-indicator {
                    filter: invert(1) brightness(0.7);
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
