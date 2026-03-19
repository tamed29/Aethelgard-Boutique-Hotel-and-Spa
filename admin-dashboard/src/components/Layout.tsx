import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Outlet } from 'react-router-dom';
import { CommandBar } from './CommandBar';
import { motion } from 'framer-motion';

export function Layout() {
    return (
        <div className="flex min-h-screen bg-moss-dark text-sage font-sans selection:bg-sage/20 selection:text-cream overflow-hidden">
            <div className="hidden lg:block">
                <Sidebar />
            </div>
            
            <main className="flex-1 h-screen overflow-y-auto w-full relative">
                <div className="max-w-[1400px] mx-auto p-6 md:p-8 lg:p-12 pb-32 lg:pb-12">
                    <motion.header 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                        <div>
                            <p className="text-sage/40 uppercase tracking-[0.3em] text-[10px] font-bold mb-2">Aethelgard Estate • Command Center</p>
                            <h2 className="text-4xl font-serif text-cream leading-none tracking-tight">System Overview</h2>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-white/5 border border-sage/10 p-2 pr-6 rounded-full group hover:border-sage/30 transition-all duration-500">
                            <div className="w-12 h-12 rounded-full border border-sage/20 bg-moss-light flex items-center justify-center text-sage font-serif text-xl overflow-hidden shadow-xl ring-2 ring-sage/5 group-hover:ring-sage/20 transition-all">
                                MC
                            </div>
                            <div className="flex flex-col">
                                <span className="text-cream text-sm font-medium tracking-wide">Master Concierge</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] uppercase font-bold text-sage/40 tracking-widest">Active Operative</span>
                                </div>
                            </div>
                        </div>
                    </motion.header>
                    
                    <Outlet />
                </div>
            </main>

            <MobileNav />
            <CommandBar />
        </div>
    );
}
