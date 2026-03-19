import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { Send, Zap, ShieldCheck, Mail, Filter, User } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

interface ChatMessage {
    roomId: string;
    sender: 'guest' | 'admin';
    text: string;
    timestamp: Date;
}

interface Inquiry {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

const QUICK_TEMPLATES = [
    { label: 'Welcome Ritual', text: 'Welcome to Aethelgard. Your arrival ritual has been prepared. Shall we begin the induction?' },
    { label: 'Turndown Service', text: 'Good evening. Would you like to schedule your evening turndown and herbal infusion service?' },
    { label: 'Spa Selection', text: 'The Runestone Spa is currently serene. Shall I reserve a private session for you?' },
    { label: 'Checkout Prep', text: 'Wishing you a tranquil final morning. Shall I arrange for the carriage to handle your transport?' }
];

export function Concierge() {
    const [socket, setSocket] = useState<any>(null);
    const [activeRoom] = useState<string>('guest_123');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [tab, setTab] = useState<'chats' | 'inquiries'>('chats');
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    const { data: inquiries = [] } = useQuery<Inquiry[]>({
        queryKey: ['inquiries'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/inquiries`, { withCredentials: true });
            return res.data;
        },
        enabled: tab === 'inquiries'
    });

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('joinChat', activeRoom);
        });

        newSocket.on('receiveMessage', (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [activeRoom]);

    const handleSend = (text: string = inputText) => {
        if (!text.trim() || !socket) return;
        const messageData: ChatMessage = {
            roomId: activeRoom,
            sender: 'admin',
            text: text,
            timestamp: new Date()
        };
        socket.emit('sendMessage', messageData);
        if (text === inputText) setInputText('');
    };

    return (
        <div className="space-y-8 h-[calc(100vh-180px)] flex flex-col">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
                <div>
                    <h2 className="text-4xl font-serif text-cream">Concierge Terminal</h2>
                    <p className="text-sage/40 text-[10px] mt-2 uppercase tracking-[0.3em] font-black">Direct Guest Engagement & Intake Protocol</p>
                </div>
                <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto">
                    <button onClick={() => setTab('chats')} className={cn("flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all", tab === 'chats' ? "bg-sage text-moss-dark shadow-lg shadow-sage/10" : "text-sage/40 hover:text-sage")}>Live Signals</button>
                    <button onClick={() => setTab('inquiries')} className={cn("flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all", tab === 'inquiries' ? "bg-sage text-moss-dark shadow-lg shadow-sage/10" : "text-sage/40 hover:text-sage")}>Guest Enquiries</button>
                </div>
            </header>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-6 overflow-hidden">
                    <GlassCard className="flex-1 overflow-hidden flex flex-col p-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] uppercase font-black tracking-widest text-sage/40">{tab === 'chats' ? 'Active Nodes' : 'Enquiry Queue'}</span>
                            <Filter size={14} className="text-sage/20" />
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                            {tab === 'chats' ? (
                                [
                                    { name: 'Elowen Thorne', room: 'Grand Suite', status: 'Online', time: '2m ago' },
                                    { name: 'Cyrus Vance', room: 'Runestone 4', status: 'Idle', time: '14m ago' }
                                ].map((guest) => (
                                    <div key={guest.name} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-sage/5 hover:border-sage/20 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-sage/10 border border-sage/10 flex items-center justify-center text-sage font-serif">{guest.name[0]}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-xs font-bold text-cream truncate">{guest.name}</p>
                                                    <span className="text-[8px] text-sage/30 uppercase font-bold">{guest.time}</span>
                                                </div>
                                                <p className="text-[10px] text-sage/40 uppercase tracking-widest">{guest.room}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                inquiries.map((iq) => (
                                    <div key={iq._id} onClick={() => setSelectedInquiry(iq)} className={cn("p-4 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-sage/5 hover:border-sage/20 transition-all group", selectedInquiry?._id === iq._id && "border-sage/40 bg-sage/5")}>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <p className="text-xs font-bold text-cream">{iq.firstName} {iq.lastName}</p>
                                                <span className="text-[7px] text-sage/30 uppercase font-black">{new Date(iq.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-[9px] text-sage font-black uppercase tracking-widest truncate">{iq.subject}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </GlassCard>

                    <div className="p-6 rounded-[2rem] bg-moss-light/5 border border-sage/10 space-y-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-[10px] uppercase tracking-widest font-black text-sage/40">Terminal Status</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-serif text-cream">Sovereign</p>
                            <p className="text-[8px] text-emerald-400 uppercase font-black tracking-widest">TLS 1.3 Active</p>
                        </div>
                    </div>
                </div>

                {/* Main View Area */}
                <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden h-full">
                    {tab === 'chats' ? (
                        <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden border-white/5 shadow-2xl shadow-black/40">
                            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-sage/80">Signal Link: Grand Suite Induction</h3>
                                </div>
                                <div className="flex gap-4">
                                    <div className="text-right">
                                        <p className="text-[8px] uppercase tracking-widest text-sage/20 font-black">Link Strength</p>
                                        <p className="text-[10px] uppercase font-serif text-emerald-400">Optimal</p>
                                    </div>
                                    <button className="p-3 hover:bg-white/5 rounded-full text-sage/20 hover:text-sage transition-all"><Zap size={18} /></button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-black/10">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, i) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            key={i} 
                                            className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className="flex flex-col gap-3 max-w-[70%]">
                                                <div className={cn(
                                                    "p-6 rounded-[2rem] text-sm leading-relaxed",
                                                    msg.sender === 'admin' 
                                                        ? "bg-sage text-moss-dark font-medium rounded-tr-none" 
                                                        : "bg-white/[0.02] border border-sage/10 text-cream backdrop-blur-xl rounded-tl-none shadow-2xl"
                                                )}>
                                                    {msg.text}
                                                </div>
                                                <span className={cn(
                                                    "text-[8px] uppercase tracking-[0.3em] font-black px-4",
                                                    msg.sender === 'admin' ? "text-right text-sage/40" : "text-left text-sage/20"
                                                )}>
                                                    {msg.sender === 'admin' ? 'Proprietary Channel' : 'Guest Signal Outbound'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="p-8 bg-black/20 border-t border-white/5">
                                <div className="flex gap-3 mb-6 overflow-x-auto pb-4 no-scrollbar">
                                    {QUICK_TEMPLATES.map((tmp) => (
                                        <button key={tmp.label} onClick={() => handleSend(tmp.text)} className="whitespace-nowrap px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[9px] uppercase tracking-[0.2em] font-black text-white/40 hover:bg-sage hover:border-sage hover:text-moss-dark transition-all duration-500">{tmp.label}</button>
                                    ))}
                                </div>

                                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                                    <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Enter dispatch protocol..." className="w-full bg-white/[0.03] border border-white/10 rounded-full py-6 pl-8 pr-20 text-cream focus:outline-none focus:border-sage/40 placeholder:text-sage/10 transition-all font-light tracking-wide" />
                                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-sage hover:bg-white text-moss-dark p-4 rounded-full transition-all duration-700 shadow-2xl shadow-sage/20 group active:scale-95"><Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></button>
                                </form>
                            </div>
                        </GlassCard>
                    ) : (
                        <div className="flex flex-col gap-6 h-full">
                            <AnimatePresence mode="wait">
                                {selectedInquiry ? (
                                    <motion.div key={selectedInquiry._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 h-full">
                                        <GlassCard className="h-full flex flex-col p-10 gap-10 border-white/5 bg-white/[0.01]">
                                            <div className="flex justify-between items-start border-b border-white/5 pb-8">
                                                <div className="flex gap-6 items-center">
                                                    <div className="w-16 h-16 rounded-[2rem] bg-sage/10 border border-sage/20 flex items-center justify-center text-sage"><User size={32} strokeWidth={1} /></div>
                                                    <div>
                                                        <h3 className="text-3xl font-serif text-cream">{selectedInquiry.firstName} {selectedInquiry.lastName}</h3>
                                                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-sage/40 mt-1">{selectedInquiry.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] uppercase font-black tracking-widest text-sage/20 mb-1">Subject Protocol</p>
                                                    <p className="text-lg font-serif text-sage">{selectedInquiry.subject}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 overflow-y-auto">
                                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-sage/20 mb-4">Message Decryption</p>
                                                <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-cream/90 text-lg font-light leading-relaxed italic font-serif">
                                                    "{selectedInquiry.message}"
                                                </div>
                                            </div>

                                            <div className="flex gap-4 border-t border-white/5 pt-8">
                                                <button className="flex-1 bg-sage hover:bg-white text-moss-dark font-black py-5 rounded-full text-[10px] uppercase tracking-[0.3em] transition-all duration-700">Dispatch Response</button>
                                                <button onClick={() => setSelectedInquiry(null)} className="px-10 py-5 rounded-full border border-white/5 text-[10px] uppercase tracking-[0.3em] font-black text-sage/40 hover:text-sage hover:border-sage/20 transition-all">Archive Signal</button>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-6 grayscale scale-90">
                                        <Mail size={80} strokeWidth={0.5} className="text-sage" />
                                        <p className="text-2xl font-serif uppercase tracking-[0.4em]">Select Signal for Decryption</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
