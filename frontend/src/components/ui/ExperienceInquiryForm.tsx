'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Sparkles, Send, Check, ArrowRight, MapPin } from 'lucide-react';

const experiences = [
    { id: '1', title: 'Beneath the Ancient Oaks', type: 'Private Bonfire', guests: '2-8' },
    { id: '2', title: 'Celestial Dialogues', type: 'Private Stargazing', guests: '1-4' },
    { id: '3', title: 'The Forest Whisper', type: 'Guided Botanical Walk', guests: '1-6' },
    { id: '4', title: 'The Forager\'s Path', type: 'Wild Harvesting', guests: '2-4' },
];

const dietaryNotes = ['Vegan', 'Gluten-Free', 'Nut Allergy', 'No Alcohol'];

export default function ExperienceInquiryForm() {
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [formData, setFormData] = useState({
        experience: '',
        date: '',
        guests: 2,
        dietary: [] as string[],
        specialRequests: ''
    });

    const isStep1Valid = formData.experience && formData.date;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate API call
        setTimeout(() => setStatus('success'), 2000);
    };

    const toggleDietary = (note: string) => {
        setFormData(prev => ({
            ...prev,
            dietary: prev.dietary.includes(note)
                ? prev.dietary.filter(n => n !== note)
                : [...prev.dietary, note]
        }));
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-moss-900 border border-moss-100/20 p-12 text-center rounded-3xl"
            >
                <div className="w-20 h-20 bg-moss-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check className="w-10 h-10 text-moss-900" />
                </div>
                <h3 className="text-3xl font-serif text-moss-100 mb-4">Inquiry Received</h3>
                <p className="text-moss-100/70 font-light max-w-md mx-auto mb-8">
                    Our experience curators will weave your requests into a bespoke journey. Expect a whisper from us within 24 hours.
                </p>
                <button
                    onClick={() => { setStatus('idle'); setStep(1); }}
                    className="text-moss-100/50 uppercase tracking-widest text-xs border-b border-moss-100/20 hover:border-moss-100 pb-1"
                >
                    Inquire for another journey
                </button>
            </motion.div>
        );
    }

    return (
        <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-12">
                    <div className="flex gap-2">
                        {[1, 2].map(s => (
                            <div key={s} className={`h-1 w-8 rounded-full transition-colors duration-500 ${step >= s ? 'bg-moss-100' : 'bg-white/10'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-moss-100/40">Step {step} of 2</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium ml-1">Select Your Narrative</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {experiences.map(exp => (
                                            <button
                                                key={exp.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, experience: exp.title })}
                                                className={`p-6 rounded-2xl border text-left transition-all duration-300 ${formData.experience === exp.title ? 'bg-moss-100 border-moss-100 text-moss-900' : 'bg-white/5 border-white/10 text-moss-100 hover:bg-white/10'}`}
                                            >
                                                <div className="font-serif text-lg mb-1">{exp.title}</div>
                                                <div className="text-[10px] uppercase tracking-widest opacity-60">{exp.type} — For {exp.guests}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium ml-1">Proposed Date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-moss-100/30 group-focus-within:text-moss-100 transition-colors" />
                                            <input
                                                type="date"
                                                required
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-moss-100 outline-none focus:border-moss-100 transition-all custom-datepicker"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium ml-1">Party Size</label>
                                        <div className="relative group">
                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-moss-100/30 group-focus-within:text-moss-100 transition-colors" />
                                            <select
                                                value={formData.guests}
                                                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-moss-100 outline-none focus:border-moss-100 transition-all appearance-none"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                                    <option key={n} value={n} className="bg-moss-900">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={!isStep1Valid}
                                    onClick={() => setStep(2)}
                                    className="w-full bg-moss-100 text-moss-900 py-6 rounded-xl uppercase tracking-[0.2em] text-xs font-bold hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                                >
                                    Refine Your Journey <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="space-y-6">
                                    <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" /> Particular Provisions (Dietary)
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {dietaryNotes.map(note => (
                                            <label key={note} className="flex items-center gap-3 cursor-pointer group p-4 border border-white/5 rounded-xl hover:bg-white/5 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.dietary.includes(note)}
                                                    onChange={() => toggleDietary(note)}
                                                    className="hidden"
                                                />
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.dietary.includes(note) ? 'border-moss-100 bg-moss-100' : 'border-white/20'}`}>
                                                    {formData.dietary.includes(note) && <Check className="w-3 h-3 text-moss-900" />}
                                                </div>
                                                <span className={`text-sm ${formData.dietary.includes(note) ? 'text-moss-100' : 'text-moss-100/50'}`}>{note}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs uppercase tracking-widest text-moss-100/50 font-medium ml-1">The Nuances (Special Requests)</label>
                                    <textarea
                                        rows={3}
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-moss-100 outline-none focus:border-moss-100 transition-all resize-none"
                                        placeholder="Any specific wishes, celebrations, or details to help us curate your moment?"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-[1] border border-white/10 text-moss-100/50 py-6 rounded-xl uppercase tracking-[0.2em] text-xs font-bold hover:bg-white/5 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="flex-[2] bg-moss-100 text-moss-900 py-6 rounded-xl uppercase tracking-[0.2em] text-xs font-bold hover:bg-white transition-all flex items-center justify-center gap-3"
                                    >
                                        {status === 'submitting' ? 'Whispering...' : 'Send Inquiry'} <Send className="w-4 h-4" />
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
