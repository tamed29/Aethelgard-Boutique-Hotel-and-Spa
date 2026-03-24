'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface Notification {
    id: number;
    type: string;
    data: any;
    href: string;
    read: boolean;
    timestamp: Date;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: number) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const socket = io(SOCKET_URL);

        const addNotification = (type: string, data: any, href: string) => {
            const newNotif = {
                id: Date.now(),
                type,
                data,
                href,
                read: false,
                timestamp: new Date()
            };
            setNotifications(prev => [newNotif, ...prev]);
            
            toast.info(`New ${type}`, {
                description: type === 'Booking' ? `Live reservation from ${data.guestName}` : `Guest enquiry received.`,
                action: {
                    label: 'View',
                    onClick: () => window.location.href = href
                }
            });
        };

        socket.on('newBooking', (data) => addNotification('Booking', data, '/admin/bookings'));
        socket.on('newInquiry', (data) => addNotification('Inquiry', data, '/admin/inquiries'));
        socket.on('newSpaBooking', (data) => addNotification('Spa Booking', data, '/admin/spa'));

        return () => { socket.disconnect(); };
    }, []);

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => setNotifications([]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
}
