'use client';

import { useStore } from '@/store/useStore';

export default function MaintenanceOverlay() {
  const isMaintenance = useStore(state => state.maintenanceMode);
  
  if (!isMaintenance) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#1A1F16] flex items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-8">
        <div className="w-24 h-24 mx-auto bg-moss-light/10 rounded-full flex items-center justify-center border border-sage/20 animate-pulse">
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60' className="w-12 h-12">
            <path d='M30 8L14 47H46L30 8Z' fill='none' stroke='#BAC095' strokeWidth='2'/>
          </svg>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-cream">Estate Undergoing Preservation</h1>
          <p className="text-sage/60 font-sans leading-relaxed">
            The Aethelgard digital halls are currently being polished. 
            We shall return to serve you shortly. 
          </p>
        </div>
        <div className="pt-8 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[0.4em] text-sage/30 font-bold">Resuming Operations Shortly</p>
        </div>
      </div>
    </div>
  );
}
