import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { GlassCard } from '../components/ui/GlassCard';
import { Send, MessageCircle, Zap, ShieldCheck, Clock } from 'lucide-react';
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
        <div className="space-y-8 h-[calc(100vh-200px)] flex flex-col">
            <header className="flex justify-between items-end shrink-0">
                <div>
                    <h2 className="text-3xl font-serif text-cream">Estate Concierge</h2>
                    <p className="text-sage/40 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">Direct Guest Engagement Interface</p>
                </div>
                <div className="hidden md:flex items-center gap-3 bg-white/5 border border-sage/10 rounded-full px-4 py-2">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-widest text-sage/80 font-bold">Encrypted Session</span>
                </div>
            </header>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Guest List */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <GlassCard title="Active Operatives" className="flex-1 overflow-hidden flex flex-col">
                        <div className="space-y-3 mt-2 overflow-y-auto">
                            {[
                                { name: 'Elowen Thorne', room: 'Grand Suite', status: 'Online', time: '2m ago' },
                                { name: 'Cyrus Vance', room: 'Runestone 4', status: 'Idle', time: '14m ago' }
                            ].map((guest) => (
                                <motion.div
                                    key={guest.name}
                                    whileHover={{ x: 4 }}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:bg-sage/5 hover:border-sage/20 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-moss-light border border-sage/10 flex items-center justify-center text-sage font-serif">
                                            {guest.name[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-xs font-bold text-cream truncate">{guest.name}</p>
                                                <span className="text-[8px] text-sage/30 uppercase font-bold">{guest.time}</span>
                                            </div>
                                            <p className="text-[10px] text-sage/40 uppercase tracking-widest">{guest.room}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* System Stats */}
                    <div className="p-6 rounded-3xl bg-moss-light/10 border border-sage/10 space-y-4">
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-sage/40" />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-sage/40">Response Velocity</span>
                        </div>
                        <p className="text-xl font-serif text-cream">1.4m Average</p>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[92%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="lg:col-span-3 flex flex-col gap-6 h-full">
                    {/* Messaging Area */}
                    <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden relative border-sage/10">
                        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-sage/80">Secure Channel: Elowen Thorne</h3>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/5 rounded-lg text-sage/40 transition-colors"><Zap size={16} /></button>
                                <button className="p-2 hover:bg-white/5 rounded-lg text-sage/40 transition-colors"><MessageCircle size={16} /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            <AnimatePresence initial={false}>
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 scale-90 grayscale">
                                        <MessageCircle size={48} className="text-sage mb-4" />
                                        <p className="text-sm font-serif italic tracking-widest uppercase">Awaiting Terminal Link...</p>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            key={i} 
                                            className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className="flex flex-col gap-2 max-w-[75%] md:max-w-[60%]">
                                                <div className={cn(
                                                    "p-5 rounded-3xl text-sm leading-relaxed",
                                                    msg.sender === 'admin' 
                                                        ? "bg-sage text-moss-dark font-medium shadow-xl shadow-sage/5 rounded-tr-none" 
                                                        : "bg-moss-light/40 border border-sage/10 text-cream backdrop-blur-md rounded-tl-none"
                                                )}>
                                                    {msg.text}
                                                </div>
                                                <span className={cn(
                                                    "text-[8px] uppercase tracking-[0.2em] font-bold px-2",
                                                    msg.sender === 'admin' ? "text-right text-sage/40" : "text-left text-sage/20"
                                                )}>
                                                    {msg.sender === 'admin' ? 'Agent Dispatch' : 'Guest Signal'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Input & Templates */}
                        <div className="p-6 bg-moss-dark/40 backdrop-blur-3xl border-t border-white/5">
                            {/* Quick Templates */}
                            <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
                                {QUICK_TEMPLATES.map((tmp) => (
                                    <button
                                        key={tmp.label}
                                        onClick={() => handleSend(tmp.text)}
                                        className="whitespace-nowrap px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-sage/60 hover:bg-sage/10 hover:border-sage/30 hover:text-sage transition-all duration-300"
                                    >
                                        {tmp.label}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    placeholder="Execute response protocol..."
                                    className="w-full bg-white/5 border border-sage/20 rounded-2xl py-5 pl-6 pr-16 text-cream focus:outline-none focus:border-sage/50 placeholder:text-sage/20 transition-all font-medium"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-sage hover:bg-sage-light text-moss-dark p-3 rounded-xl transition-all shadow-lg shadow-sage/10 active:scale-95 group"
                                >
                                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
