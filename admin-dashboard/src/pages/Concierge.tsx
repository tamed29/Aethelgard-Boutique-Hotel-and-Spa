import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { GlassCard } from '../components/ui/GlassCard';
import { Send, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

interface ChatMessage {
    roomId: string;
    sender: 'guest' | 'admin';
    text: string;
    timestamp: Date;
}

export function Concierge() {
    const [socket, setSocket] = useState<any>(null);
    const [activeRoom, setActiveRoom] = useState<string>('guest_123'); // Hardcoded generic room for demo
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

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !socket) return;

        const messageData: ChatMessage = {
            roomId: activeRoom,
            sender: 'admin',
            text: inputText,
            timestamp: new Date()
        };

        socket.emit('sendMessage', messageData);
        setInputText('');
    };

    return (
        <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-3xl font-serif text-cream">Live Concierge Chat</h2>
                    <p className="text-sage/40 text-sm mt-1 uppercase tracking-widest">Connect Directly with Guests in Real-Time</p>
                </div>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Active Support Requests */}
                <GlassCard className="lg:col-span-1 border-sage/10 overflow-y-auto hidden lg:block">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-sage/60 mb-4 px-2">Active Guests</h3>
                    <div className="space-y-2">
                        {/* Demo Room */}
                        <div
                            className="bg-sage/10 border border-sage/30 rounded-xl p-3 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-sage/20 p-2 rounded-full text-sage">
                                    <User size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-cream">Guest Request</p>
                                    <p className="text-[10px] text-sage/60 text-emerald-400">Online</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Chat Window */}
                <GlassCard className="lg:col-span-3 border-sage/10 flex flex-col p-4 w-full h-full relative">
                    <div className="flex-1 overflow-y-auto mb-4 p-4 space-y-6">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-sage/30 text-sm tracking-widest uppercase text-center">
                                Waiting for guest messages...
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl p-4 ${msg.sender === 'admin' ? 'bg-sage text-moss-dark rounded-br-sm' : 'bg-white/5 border border-sage/10 text-cream rounded-bl-sm'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-[10px] uppercase tracking-widest mt-2 ${msg.sender === 'admin' ? 'text-moss-dark/60' : 'text-sage/40'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={handleSend} className="relative mt-auto shrink-0">
                        <input
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Type your response to the guest..."
                            className="w-full bg-white/5 border border-sage/20 rounded-xl py-4 pl-4 pr-14 text-cream focus:outline-none focus:border-sage/50"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-sage hover:bg-sage-light text-moss-dark p-2 rounded-lg transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
}
