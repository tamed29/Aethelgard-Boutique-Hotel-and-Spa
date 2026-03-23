import { create } from 'zustand';

interface StoreState {
    isBookingOpen: boolean;
    setBookingOpen: (isOpen: boolean) => void;
    realtimePrices: Record<string, number>;
    setRealtimePrice: (roomId: string, price: number) => void;
    maintenanceMode: boolean;
    setMaintenanceMode: (isActive: boolean) => void;
    showPrices: boolean;
    setShowPrices: (show: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
    isBookingOpen: false,
    setBookingOpen: (isOpen) => set({ isBookingOpen: isOpen }),
    realtimePrices: {},
    setRealtimePrice: (roomId, price) => set((state) => ({
        realtimePrices: { ...state.realtimePrices, [roomId]: price }
    })),
    maintenanceMode: false,
    setMaintenanceMode: (isActive) => set({ maintenanceMode: isActive }),
    showPrices: true,
    setShowPrices: (show) => set({ showPrices: show }),
}));
