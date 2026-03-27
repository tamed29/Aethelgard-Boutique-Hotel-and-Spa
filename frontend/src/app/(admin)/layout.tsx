'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';

/**
 * Admin Layout (Protected Group)
 * Primary Aesthetic: Aethelgard Dark Ops (#3D4127)
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60, // 1 minute
                refetchOnWindowFocus: false,
                retry: (failureCount, error: any) => {
                    // Don't retry on 401/403
                    if (error?.response?.status === 401 || error?.response?.status === 403) return false;
                    return failureCount < 3;
                }
            },
        },
    }));

    const router = useRouter();
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.replace('/login');
        } else {
            setIsAuthenticating(false);
        }
    }, [router]);

    if (isAuthenticating) {
        return (
            <div className="flex min-h-screen bg-[#1A1F16] items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#D4DE95]/20 border-t-[#D4DE95] animate-spin" />
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
                <div className="flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] transition-[background-color,color] duration-500 selection:bg-[var(--admin-accent)] selection:text-[var(--admin-bg)]">
                {/* Fixed Sidebar */}
                <AdminSidebar />

                {/* Main Viewport */}
                <main className="flex-1 min-h-screen relative overflow-hidden">
                    {/* Atmospheric Overlays */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--admin-accent)] opacity-5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-1000" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black opacity-10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-1000" />

                    {/* Content Scroll Area */}
                    <div className="relative z-10 p-12 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>

                <Toaster 
                    theme="dark" 
                    closeButton 
                    toastOptions={{
                        style: {
                            background: '#1A1F16',
                            border: '1px solid rgba(212, 222, 149, 0.1)',
                            color: '#F5F2ED',
                            fontFamily: 'inherit',
                        }
                    }}
                />
            </div>
        </QueryClientProvider>
    );
}
