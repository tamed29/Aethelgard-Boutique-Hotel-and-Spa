'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export interface Notification {
    id: number;
    type: 'Booking' | 'Inquiry' | 'Spa Booking' | 'Message';
    title: string;
    description: string;
    href: string;
    read: boolean;
    timestamp: Date;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    socket: Socket | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

    // Load from Cache on Initialization
    useEffect(() => {
        const cached = localStorage.getItem('aethelgard_signals');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                // Convert string dates back to Date objects
                const restored = parsed.map((n: any) => ({
                    ...n,
                    timestamp: new Date(n.timestamp)
                }));
                setNotifications(restored);
            } catch (e) {
                console.error('Signal Cache Corruption:', e);
            }
        }
    }, []);

    // Persist on Changes
    useEffect(() => {
        if (notifications.length > 0) {
            localStorage.setItem('aethelgard_signals', JSON.stringify(notifications));
        }
    }, [notifications]);

    const addNotification = useCallback((
        type: Notification['type'],
        title: string,
        description: string,
        href: string
    ) => {
        const newNotif: Notification = {
            id: Date.now(),
            type,
            title,
            description,
            href,
            read: false,
            timestamp: new Date(),
        };

        setNotifications(prev => [newNotif, ...prev.slice(0, 49)]); // Keep max 50

        // Only show toast if in admin area
        const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
        if (isAdmin) {
            toast.info(title, {
                description,
                duration: 6000,
                action: {
                    label: 'View →',
                    onClick: () => { window.location.href = href; },
                },
            });
        }
    }, []);

    useEffect(() => {
        const socket: Socket = io(SOCKET_URL, {
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            transports: ['websocket', 'polling'], 
            secure: SOCKET_URL.startsWith('https'),
            withCredentials: true,
        });

        setSocketInstance(socket);

        socket.on('connect', () => {
            console.log('[Socket] Admin notification channel connected.');
        });

        socket.on('disconnect', () => {
            console.warn('[Socket] Notification channel disconnected.');
        });

        socket.on('newBooking', (data: { guestName?: string; guestEmail?: string; checkIn?: string; checkOut?: string }) => {
            const name = data.guestName || 'A guest';
            const dates = data.checkIn
                ? `Check-in: ${new Date(data.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : '';
            addNotification(
                'Booking',
                `🏨 New Reservation — ${name}`,
                `${name} has secured a sanctuary.${dates ? ' ' + dates : ''}`,
                '/admin/bookings'
            );
        });

        socket.on('newInquiry', (data: { firstName?: string; lastName?: string; email?: string; subject?: string }) => {
            const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || 'A guest';
            const subjectLine = data.subject ? ` · ${data.subject}` : '';
            addNotification(
                'Inquiry',
                `✉️ New Enquiry — ${name}`,
                `${data.email || 'Unknown email'}${subjectLine}`,
                '/admin/inquiries'
            );
        });

        socket.on('newSpaBooking', (data: { guestName?: string; therapyType?: string; date?: string; timeSlot?: string }) => {
            const name = data.guestName || 'A guest';
            const therapy = data.therapyType ? ` · ${data.therapyType}` : '';
            const dateStr = data.date
                ? ` on ${new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                : '';
            addNotification(
                'Spa Booking',
                `🌿 Thermal Protocol Booked — ${name}`,
                `${name}${therapy}${dateStr}${data.timeSlot ? ' at ' + data.timeSlot : ''}`,
                '/admin/spa'
            );
        });

        socket.on('receiveMessage', (data: { sender: string; text: string; roomId: string }) => {
            // Only notify if not from 'Admin' and not already on the chat page for that room
            if (data.sender !== 'Concierge' && data.sender !== 'Admin') {
                addNotification(
                    'Message',
                    `💬 New Message from ${data.sender}`,
                    data.text.substring(0, 60) + (data.text.length > 60 ? '...' : ''),
                    `/admin/chat?room=${data.roomId}`
                );
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [addNotification]);

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => setNotifications([]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            markAsRead, 
            markAllAsRead, 
            clearAll,
            socket: socketInstance
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
}
