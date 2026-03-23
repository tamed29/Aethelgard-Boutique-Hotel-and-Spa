'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useState } from 'react';
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
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex min-h-screen bg-[#3D4127] text-[#F5F2ED] selection:bg-[#D4DE95] selection:text-[#1A1F16]">
                {/* Fixed Sidebar */}
                <AdminSidebar />

                {/* Main Viewport */}
                <main className="flex-1 min-h-screen relative overflow-hidden">
                    {/* Atmospheric Overlays */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4DE95]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/20 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

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
