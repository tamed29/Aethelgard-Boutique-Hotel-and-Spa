'use client';

import { useEffect, useRef } from 'react';
import { useThemeEngine } from '@/hooks/useThemeEngine';
import { io } from 'socket.io-client';
import { useStore } from '@/store/useStore';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    useThemeEngine();
    const setRealtimePrice = useStore(state => state.setRealtimePrice);
    const hasFetched = useRef(false);

    useEffect(() => {
        const setMaintenanceMode = useStore.getState().setMaintenanceMode;
        const setShowPrices = useStore.getState().setShowPrices;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        let socketOrigin = 'http://localhost:5000';
        try {
            socketOrigin = new URL(API_URL).origin;
        } catch (e) {
            // fallback is already set
        }

        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
        const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('adminToken');
        const shouldConnect = isAdminPath || hasToken;

        // Use polling-first transport — required for Vercel/edge deployments where raw
        // WebSocket upgrades fail before the HTTP handshake completes.
        const socket = io(socketOrigin, {
            autoConnect: shouldConnect,
            reconnectionAttempts: 5,
            timeout: 8000,
            transports: ['polling', 'websocket'], // polling first, then upgrade
            withCredentials: true,
        });

        socket.on('priceUpdate', (data: { roomId: string; price: number }) => {
            setRealtimePrice(data.roomId, data.price);
        });

        socket.on('settingUpdate', (data: { key: string; value: any }) => {
            if (data.key === 'maintenanceMode') setMaintenanceMode(data.value === 'true');
            if (data.key === 'showPrices') setShowPrices(data.value === 'true');
        });

        socket.on('connect_error', () => {
            // Suppress console noise on public pages — realtime is optional here
        });

        // Fetch initial settings via HTTP (no socket needed)
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetch(`${API_URL}/admin/settings`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
                .catch(() => { /* settings fetch is optional */ });
        }

        return () => {
            socket.disconnect();
        };
    }, [setRealtimePrice]);

    return <>{children}</>;
}
