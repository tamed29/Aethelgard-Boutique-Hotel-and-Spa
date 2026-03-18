import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { CommandBar } from './CommandBar';

export function Layout() {
    return (
        <div className="flex min-h-screen bg-moss-dark text-sage font-sans selection:bg-sage/20 selection:text-cream">
            <Sidebar />
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto max-w-[1600px] mx-auto w-full">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <p className="text-sage/60 uppercase tracking-[0.2em] text-xs font-semibold mb-2">Command Center</p>
                        <h2 className="text-4xl font-serif text-cream">Admin Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-4">
                            <span className="text-cream font-medium">Master Concierge</span>
                            <span className="text-xs text-sage/40">Super Admin</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-sage/20 bg-moss-light flex items-center justify-center text-sage font-serif text-xl overflow-hidden shadow-xl ring-2 ring-sage/10">
                            MC
                        </div>
                    </div>
                </header>
                <Outlet />
            </main>
            <CommandBar />
        </div>
    );
}
