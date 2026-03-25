'use client';

import { useEffect } from 'react';
import { useThemeEngine } from '@/hooks/useThemeEngine';
import { io } from 'socket.io-client';
import { useStore } from '@/store/useStore';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    useThemeEngine();
    const setRealtimePrice = useStore(state => state.setRealtimePrice);

    useEffect(() => {
        const setMaintenanceMode = useStore.getState().setMaintenanceMode;
        const setShowPrices = useStore.getState().setShowPrices;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        let socketOrigin = 'http://localhost:5000';
        try {
            socketOrigin = new URL(API_URL).origin;
        } catch (e) {
            console.error('Invalid NEXT_PUBLIC_API_URL:', API_URL);
        }

        const socket = io(socketOrigin, {
            reconnectionAttempts: 5,
            timeout: 5000,
            transports: ['polling', 'websocket'], // Allow polling for better compatibility
        });

        socket.on('priceUpdate', (data: { roomId: string; price: number }) => {
            setRealtimePrice(data.roomId, data.price);
        });

        socket.on('settingUpdate', (data: { key: string; value: any }) => {
            if (data.key === 'maintenanceMode') setMaintenanceMode(data.value === 'true');
            if (data.key === 'showPrices') setShowPrices(data.value === 'true');
        });

        // Initialize settings with better error handling
        fetch(`${API_URL}/admin/settings`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(settings => {
                if (Array.isArray(settings)) {
                    const maint = settings.find((s: any) => s.key === 'maintenanceMode');
                    const prices = settings.find((s: any) => s.key === 'showPrices');
                    if (maint) setMaintenanceMode(maint.value === 'true');
                    if (prices) setShowPrices(prices.value === 'true');
                }
            })
            .catch(err => {
                console.warn('Failed to fetch initial settings:', err.message);
            });

        socket.on('connect_error', (error) => {
            console.warn('Realtime updates unavailable:', error.message);
        });

        return () => {
            socket.disconnect();
        };
    }, [setRealtimePrice]);

    return <>{children}</>;
}
