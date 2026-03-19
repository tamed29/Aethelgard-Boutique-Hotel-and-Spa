import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Globe, Palette, Mail, Lock, Save, ExternalLink, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const MAIN_SITE_URL = 'http://localhost:3000';

export function Settings() {
    const [siteName, setSiteName] = useState('Aethelgard Boutique Hotel & Spa');
    const [tagline, setTagline] = useState('Where Heritage Meets Wilderness');
    const [bookingEmail, setBookingEmail] = useState('bookings@aethelgard.com');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [onlineBooking, setOnlineBooking] = useState(true);
    const [showPrices, setShowPrices] = useState(true);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setSaving(false);
        toast.success('Settings saved successfully');
    };

    const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
        <button onClick={() => onChange(!value)} className="transition-transform active:scale-95">
            {value
                ? <ToggleRight size={28} className="text-sage" />
                : <ToggleLeft size={28} className="text-sage/20" />}
        </button>
    );

    return (
        <div className="space-y-8 pb-12">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-cream">Site Settings</h2>
                    <p className="text-sage/40 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">Global Configuration & Control Panel</p>
                </div>
                <a href={MAIN_SITE_URL} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-sage/10 hover:border-sage/30 text-sage px-5 py-3 rounded-2xl transition-all text-xs uppercase tracking-widest font-bold">
                    <ExternalLink size={14} />
                    View Live Site
                </a>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <GlassCard title="General Information" className="border-sage/10">
                    <div className="space-y-5 mt-4">
                        <div className="p-3 rounded-xl bg-white/5 flex items-center gap-3 border border-sage/10">
                            <Globe size={16} className="text-sage/40 flex-shrink-0" />
                            <div className="flex-1">
                                <label className="text-[9px] uppercase tracking-widest text-sage/40 font-bold block mb-1">Hotel Name</label>
                                <input value={siteName} onChange={e => setSiteName(e.target.value)}
                                    className="w-full bg-transparent text-cream text-sm outline-none placeholder-sage/20" />
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 flex items-center gap-3 border border-sage/10">
                            <Palette size={16} className="text-sage/40 flex-shrink-0" />
                            <div className="flex-1">
                                <label className="text-[9px] uppercase tracking-widest text-sage/40 font-bold block mb-1">Tagline</label>
                                <input value={tagline} onChange={e => setTagline(e.target.value)}
                                    className="w-full bg-transparent text-cream text-sm outline-none placeholder-sage/20" />
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 flex items-center gap-3 border border-sage/10">
                            <Mail size={16} className="text-sage/40 flex-shrink-0" />
                            <div className="flex-1">
                                <label className="text-[9px] uppercase tracking-widest text-sage/40 font-bold block mb-1">Booking Email</label>
                                <input value={bookingEmail} onChange={e => setBookingEmail(e.target.value)}
                                    className="w-full bg-transparent text-cream text-sm outline-none placeholder-sage/20" />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Feature Toggles */}
                <GlassCard title="Feature Controls" className="border-sage/10">
                    <div className="space-y-2 mt-4">
                        {[
                            { label: 'Online Booking', desc: 'Allow guests to book directly online', value: onlineBooking, set: setOnlineBooking },
                            { label: 'Show Room Prices', desc: 'Display prices publicly on main site', value: showPrices, set: setShowPrices },
                            { label: 'Email Notifications', desc: 'Receive alerts for new bookings', value: emailNotifs, set: setEmailNotifs },
                            { label: 'Maintenance Mode', desc: 'Take the main website temporarily offline', value: maintenanceMode, set: setMaintenanceMode, danger: true },
                        ].map(f => (
                            <div key={f.label} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${f.value && f.danger ? 'bg-rose-500/5 border-rose-500/20' : 'bg-white/5 border-white/5 hover:border-sage/10'}`}>
                                <div>
                                    <p className={`text-sm font-medium ${f.danger && f.value ? 'text-rose-400' : 'text-cream'}`}>{f.label}</p>
                                    <p className="text-[10px] text-sage/40 mt-0.5">{f.desc}</p>
                                </div>
                                <Toggle value={f.value} onChange={f.set} />
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Quick Site Links */}
                <GlassCard title="Website Sections" className="border-sage/10">
                    <div className="space-y-2 mt-4">
                        {[
                            { label: 'Homepage', path: '/' },
                            { label: 'Rooms & Suites', path: '/rooms' },
                            { label: 'Experiences', path: '/experience' },
                            { label: 'Dining', path: '/dining' },
                            { label: 'The Story', path: '/story' },
                            { label: 'Contact', path: '/contact' },
                        ].map(p => (
                            <a key={p.label} href={`${MAIN_SITE_URL}${p.path}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-sage/20 transition-all group">
                                <span className="text-sm text-sage/80 group-hover:text-cream transition-colors">{p.label}</span>
                                <ChevronRight size={14} className="text-sage/20 group-hover:text-sage transition-colors" />
                            </a>
                        ))}
                    </div>
                </GlassCard>

                {/* Security */}
                <GlassCard title="Security Settings" className="border-sage/10">
                    <div className="space-y-4 mt-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
                            <Lock size={18} className="text-emerald-400" />
                            <div>
                                <p className="text-sm text-emerald-400 font-medium">Session Encryption Active</p>
                                <p className="text-[10px] text-sage/40 mt-0.5">JWT tokens, 30-day validity</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] uppercase tracking-widest text-sage/40 font-bold">Change Admin Password</label>
                            <input type="password" placeholder="Current password" className="w-full bg-white/5 border border-sage/10 rounded-xl py-3 px-4 text-cream placeholder-sage/20 outline-none focus:border-sage/40 transition-all text-sm" />
                            <input type="password" placeholder="New password" className="w-full bg-white/5 border border-sage/10 rounded-xl py-3 px-4 text-cream placeholder-sage/20 outline-none focus:border-sage/40 transition-all text-sm" />
                            <button className="w-full bg-sage/10 hover:bg-sage/20 text-sage font-bold py-3 rounded-xl transition-all text-sm border border-sage/20">
                                Update Password
                            </button>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleSave} disabled={saving}
                className="w-full bg-sage hover:bg-sage-light text-moss-dark font-bold py-5 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl shadow-sage/10 text-sm uppercase tracking-widest disabled:opacity-60">
                <Save size={18} />
                {saving ? 'Saving Configuration...' : 'Save All Settings'}
            </motion.button>
        </div>
    );
}
