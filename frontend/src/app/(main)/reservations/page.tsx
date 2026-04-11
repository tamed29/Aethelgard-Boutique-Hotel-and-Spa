'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Bed, Users, ArrowRight, Check, X, ShieldCheck, MapPin, Sparkles, Coffee, Bath, Star, CreditCard } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Image from 'next/image';
import ScrollReveal from '@/components/ui/ScrollReveal';



const EXCHANGE_RATE = 140;

const fallbackRooms = [
    {
        id: 'fallback-grand',
        name: 'Grand Estate Suite',
        roomType: 'grand',
        price: 950,
        sqm: 140,
        view: 'Valley & Forest Panoramas',
        bed: 'Sovereign King',
        images: ['/images/rooms/grand/g1.png'],
        desc: 'Sovereign luxury at the pinnacle of the Wychwood.'
    },
    {
        id: 'fallback-forest',
        name: 'Forest Retreat',
        roomType: 'forest',
        price: 320,
        sqm: 65,
        view: 'Ancient Pine Canopy',
        bed: 'Artisan King',
        images: ['/images/rooms/forest/r1.png'],
        desc: 'Muted luxury amidst the ancient whispering pines.'
    },
    {
        id: 'fallback-double',
        name: 'Double Heritage Room',
        roomType: 'double',
        price: 280,
        sqm: 45,
        view: 'Garden Courtyard',
        bed: 'Twin Heritage Beds',
        images: ['/images/rooms/double/d1.png'],
        desc: 'Storied comfort in the original 12th-century wing.'
    },
    {
        id: 'fallback-botanical',
        name: 'Botanical Oasis Suite',
        roomType: 'botanical',
        price: 380,
        sqm: 85,
        view: 'Living Blossom Walls',
        bed: 'King Garden Bed',
        images: ['/images/rooms/botanical/b1.png'],
        desc: 'Secluded sanctuary wrapped in living blossom walls.'
    }
];

const enhancements = [
    { id: 'breakfast', name: 'Artisan Breakfast Buffet', price: 45, icon: <Coffee className="w-5 h-5" />, desc: 'Farm-to-table morning spread in the Conservatory.' },
    { id: 'spa', name: 'Private Thermal Access', price: 120, icon: <Bath className="w-5 h-5" />, desc: 'Exclusive 1-hour midnight access to the thermal pools.' },
    { id: 'butler', name: 'Estate Butler Service', price: 200, icon: <Star className="w-5 h-5" />, desc: 'Dedicated packing, unpacking, and bespoke concierge.' },
];

export default function ReservationsPortal() {
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [bookingCode, setBookingCode] = useState('');
    const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: new Date(),
        to: addDays(new Date(), 2)
    });
    const [roomTypes, setRoomTypes] = useState<any[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
    const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [currency, setCurrency] = useState<'USD' | 'ETB'>('USD');

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);


    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_URL}/rooms`);
                const data = await res.json();
                
                if (!Array.isArray(data)) {
                    throw new Error('Invalid API response format');
                }
                
                const mappedRooms = data.map((r: any) => ({
                    id: r._id,
                    name: r.name,
                    roomType: r.roomType,
                    price: r.price,
                    sqm: r.sizeSqM || 100,
                    view: r.view || 'Scenic View',
                    bed: r.bedType || 'King Bed',
                    images: r.images && r.images.length > 0 ? r.images : ['/images/rooms/single/s1.png'],
                    desc: r.description || `Experience the luxury of our ${r.name}.`
                }));
                setRoomTypes(mappedRooms);
            } catch (err) {
                console.error('Failed to fetch rooms, using fallback data', err);
                setRoomTypes(fallbackRooms);
            }
        };
        fetchRooms();
    }, []);
    const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
    
    // Guest Information State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');

    // Payment State
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [isRedirecting, setIsRedirecting] = useState(false);

    const [isChecking, setIsChecking] = useState(false);
    const [availabilityData, setAvailabilityData] = useState<any[]>([]);

    const handleCheckAvailability = async () => {
        if (!range.from || !range.to) return;
        setIsChecking(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/bookings/availability?checkIn=${range.from.toISOString()}&checkOut=${range.to.toISOString()}`);
            const data = await res.json();
            if (res.ok) {
                setAvailabilityData(Array.isArray(data) ? data : [data]);
                setStep(2);
            } else {
                toast.error('Availability Check Failed', { description: data.message });
            }
        } catch (error: any) {
            // Fallback to dummy data if backend is not ready
            setAvailabilityData(roomTypes.map(r => ({ roomType: r.id, isAvailable: true })));
            setStep(2);
            toast.info('Aethelgard Vault', { description: 'Connected to local availability fallback.' });
        } finally {
            setIsChecking(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const toggleEnhancement = (id: string) => {
        setSelectedEnhancements(prev => 
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const calculateTotal = () => {
        if (!selectedRoom || !range.from || !range.to) return 0;
        const nights = differenceInDays(range.to, range.from);
        const roomTotal = selectedRoom.price * nights;
        const enhancementTotal = selectedEnhancements.reduce((acc, id) => {
            const enh = enhancements.find(e => e.id === id);
            return acc + (enh?.price || 0);
        }, 0);
        const totalInUSD = roomTotal + enhancementTotal;
        return currency === 'ETB' ? totalInUSD * EXCHANGE_RATE : totalInUSD;
    };

    const formatPrice = (amount: number) => {
        if (currency === 'ETB') {
            return new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 }).format(amount);
        }
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === 'submitting') return;
        if (!isPrivacyAccepted) return;
        if (!selectedRoom || !range.from || !range.to) {
            toast.error('Selection Incomplete', { description: 'Please ensure dates and a sanctuary are selected.' });
            return;
        }

        if (!firstName || !lastName || !email || !phone || !address || !city || !country) {
            toast.error('Information Required', { description: 'Please complete all mandatory guest details.' });
            return;
        }

        if (currency === 'ETB' && paymentMethod !== 'Chapa') {
            toast.info('Currency Alignment', { description: 'For ETB payments, Chapa is our primary gateway.' });
            setPaymentMethod('Chapa');
        }

        if (!email.includes('@')) {
            toast.error('Invalid Email', { description: 'Please provide a valid digital invitation address.' });
            return;
        }

        setStatus('submitting');
        
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomType: selectedRoom.roomType,
                    checkIn: range.from.toISOString(),
                    checkOut: range.to.toISOString(),
                    guestName: `${firstName} ${lastName}`,
                    guestEmail: email,
                    guestPhone: phone,
                    guestAddress: address,
                    guestCity: city,
                    guestCountry: country,
                    specialRequests: specialRequests,
                    paymentMethod: paymentMethod,
                    paymentDetails: {
                        cardHolder: cardHolderName,
                        cardNumber: cardNumber.slice(-4), // Only send last 4 for "security"
                        expiry: expiryDate
                    },
                    guests: 2, 
                    addons: selectedEnhancements
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Booking failed');

            setBookingCode(data.booking._id.substring(0, 8).toUpperCase());

            // Handle Chapa Redirect
            if (paymentMethod === 'Chapa') {
                setIsRedirecting(true);
                toast.loading('Redirecting to Chapa Secure Checkout...');
                
                const payRes = await fetch(`${API_URL}/payments/chapa/initialize`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        bookingId: data.booking._id,
                        amount: calculateTotal(),
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        phone: phone
                    })
                });
                
                const payData = await payRes.json();
                if (payData.status === 'success' && payData.data.checkout_url) {
                    window.location.href = payData.data.checkout_url;
                    return;
                } else {
                    throw new Error('Chapa Initialization Failed');
                }
            }

            setStatus('success');
            toast.success('Booking Confirmed', { description: 'Your reservation has been confirmed.' });
        } catch (error: any) {
            console.error('Final Submission Error:', error);
            setStatus('idle');
            toast.error('Transmission Failure', { 
                description: error.message || 'The estate vault is currently unreachable. Please try again shortly.' 
            });
        }
    };

    if (status === 'success') {
        return (
            <main className="min-h-screen bg-[#F5F2ED] flex items-center justify-center pt-20">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full mx-4 bg-[#1A1F16] text-white p-12 md:p-16 rounded-[4rem] text-center shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4DE95]/10 blur-[100px]" />
                    <div className="w-24 h-24 bg-[#D4DE95] rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                        <Check className="w-12 h-12 text-[#1A1F16]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight">Booking Confirmed</h2>
                    <p className="text-[#D4DE95]/60 uppercase tracking-[0.4em] text-[10px] font-black mb-12">Your Journey Begins Shortly</p>
                    
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 space-y-8">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Reference Node</span>
                            <span className="text-4xl font-mono tracking-tighter text-[#D4DE95]">{bookingCode}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                            <div className="text-left space-y-1">
                                <span className="text-[10px] uppercase tracking-widest font-black opacity-30">Sanctuary</span>
                                <p className="font-serif text-white">{selectedRoom?.name || 'Sanctuary'}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <span className="text-[10px] uppercase tracking-widest font-black opacity-30">Arrival</span>
                                <p className="font-serif text-white">{range.from ? format(range.from, 'dd MMM yyyy') : '---'}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.6em] font-black opacity-30 mb-4">Capturing this manifest is recommended</p>
                    <p className="text-[11px] uppercase tracking-widest font-black text-[#1A1F16] mb-8 p-3 bg-[#D4DE95] border border-[#D4DE95]/30 rounded-xl inline-block shadow-[0_0_15px_rgba(212,222,149,0.3)]">
                        📸 PLEASE TAKE A SCREENSHOT OF THIS REFERENCE NODE FOR CHECK-IN
                    </p>
                    
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="px-16 py-6 bg-[#D4DE95] text-[#1A1F16] rounded-2xl hover:bg-white transition-all text-[11px] uppercase tracking-[0.4em] font-black shadow-2xl"
                    >
                        Return to Sanctuary
                    </button>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F2ED] text-[#1A1F16] pt-32 pb-24">
            <div className="max-w-[90rem] mx-auto px-4 md:px-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <ScrollReveal>
                        <p className="text-[10px] uppercase tracking-[0.5em] font-black text-[#3D4127] mb-4">Confirm Booking</p>
                        <h1 className="text-4xl md:text-6xl font-serif tracking-tight">Reservations Portal</h1>
                        
                        {/* Currency Toggle */}
                        <div className="flex justify-center mt-8">
                            <div className="p-1.5 bg-black/5 rounded-2xl flex gap-1">
                                <button 
                                    onClick={() => {
                                        setCurrency('USD');
                                        setPaymentMethod('Credit Card');
                                    }}
                                    className={`px-6 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all ${currency === 'USD' ? 'bg-[#3D4127] text-white shadow-lg' : 'text-[#3D4127]/40 hover:text-[#3D4127]'}`}
                                >
                                    USD $
                                </button>
                                <button 
                                    onClick={() => {
                                        setCurrency('ETB');
                                        setPaymentMethod('Chapa');
                                    }}
                                    className={`px-6 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all ${currency === 'ETB' ? 'bg-[#3D4127] text-white shadow-lg' : 'text-[#3D4127]/40 hover:text-[#3D4127]'}`}
                                >
                                    ETB ብር
                                </button>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="flex items-center justify-center mt-12 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-700 ${step >= i ? 'bg-[#3D4127] text-white border-[#3D4127]' : 'bg-white/50 text-[#3D4127]/30 border-black/10'}`}>
                                        {step > i ? <Check className="w-4 h-4" /> : i}
                                    </div>
                                    {i < 4 && <div className={`w-12 md:w-16 h-px ${step > i ? 'bg-[#3D4127]' : 'bg-black/10'}`} />}
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 bg-white/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-black/5 shadow-2xl relative overflow-hidden min-h-[600px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-12"
                                >
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-serif">Select Your Journey Dates</h2>
                                        <p className="text-[#1A1F16]/60 font-serif italic">Minimum stay: 2 nights for deep restoration.</p>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row gap-12 items-center justify-center w-full">
                                        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-xl border border-black/5 w-full md:w-auto overflow-x-auto flex justify-center">
                                            <DayPicker
                                                mode="range"
                                                selected={range}
                                                onSelect={(r: any) => setRange(r)}
                                                numberOfMonths={isMobile ? 1 : 2}
                                                className="rdp-custom"
                                                disabled={{ before: new Date() }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-8 border-t border-black/5">
                                        <button 
                                            type="button"
                                            disabled={!range?.from || !range?.to || isChecking}
                                            onClick={handleCheckAvailability}
                                            className="px-12 py-5 bg-[#3D4127] text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 disabled:opacity-30 transition-all hover:bg-black group"
                                        >
                                            {isChecking ? 'Verifying...' : 'Check Availability'}
                                            {!isChecking && <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-12"
                                >
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-serif">Select Your Sanctuary</h2>
                                        <p className="text-[#1A1F16]/60 font-serif italic">Pricing is dynamically calculated based on seasonality and yield rules.</p>
                                    </div>

                                    <div className="space-y-8">
                                        {roomTypes.map((room) => {
                                            const avail = availabilityData.find(a => a.roomId === room.id);
                                            const isFullyBooked = avail ? !avail.isAvailable : false;

                                            return (
                                            <motion.div 
                                                key={room.id}
                                                whileHover={{ scale: 1.01 }}
                                                className={`group relative grid grid-cols-1 md:grid-cols-12 gap-8 p-6 rounded-[2.5rem] border transition-all duration-700 ${isFullyBooked ? 'bg-[#1A1F16]/5 opacity-60 cursor-not-allowed border-black/5' : (selectedRoom?.id === room.id ? 'bg-[#3D4127] text-white border-[#3D4127] shadow-2xl cursor-pointer' : 'bg-white/60 text-[#1A1F16] border-black/5 hover:bg-white cursor-pointer')}`}
                                                onClick={() => !isFullyBooked && setSelectedRoom(room)}
                                            >
                                                <div className="md:col-span-4 relative aspect-square rounded-2xl overflow-hidden">
                                                    <Image src={room.images[0]} alt={room.name} fill className={`object-cover ${isFullyBooked ? 'grayscale opacity-70' : ''}`} />
                                                    {isFullyBooked && (
                                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[2px]">
                                                            <span className="bg-[#1A1F16] text-[#F5F2ED] px-4 py-2 rounded-full text-[9px] uppercase font-black tracking-widest border border-white/10">Fully Booked</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="md:col-span-8 flex flex-col justify-between py-2">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <h3 className="text-2xl font-serif">{room.name}</h3>
                                                            <div className="text-right">
                                                                <span className={`text-2xl font-serif block ${selectedRoom?.id === room.id ? 'text-white' : 'text-[#3D4127]'}`}>
                                                                    {formatPrice(currency === 'ETB' ? room.price * EXCHANGE_RATE : room.price)}
                                                                </span>
                                                                <span className={`text-[9px] uppercase tracking-widest opacity-40 block mt-1 ${selectedRoom?.id === room.id ? 'text-white/60' : ''}`}>
                                                                    {currency === 'ETB' ? `(${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(room.price)})` : `(${new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 }).format(room.price * EXCHANGE_RATE)})`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className={`text-sm mb-6 ${selectedRoom?.id === room.id ? 'text-white/70' : 'text-[#1A1F16]/60'} font-light`}>{room.desc}</p>
                                                        <div className="flex flex-wrap gap-4">
                                                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
                                                                <Bed className="w-3 h-3" /> {room.bed}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
                                                                <Users className="w-3 h-3" /> 2 Guests
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
                                                                <Sparkles className="w-3 h-3" /> {room.view}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end mt-6">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedRoom?.id === room.id ? 'bg-white text-[#3D4127]' : 'bg-[#3D4127] text-white opacity-0 group-hover:opacity-100'}`}>
                                                            <Check className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )})}
                                    </div>

                                    <div className="flex justify-between pt-8 border-t border-black/5">
                                        <button onClick={prevStep} className="text-[#3D4127] font-black text-[10px] uppercase tracking-[0.4em] hover:translate-x-[-10px] transition-transform flex items-center gap-2">
                                            Back
                                        </button>
                                        <button 
                                            type="button"
                                            disabled={!selectedRoom}
                                            onClick={nextStep}
                                            className="px-12 py-5 bg-[#3D4127] text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 disabled:opacity-30 transition-all hover:bg-black group"
                                        >
                                            Stay Enhancements
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-serif">Enhance Your Stay</h2>
                                        <p className="text-[#1A1F16]/60 font-serif italic">Fine details for a truly bespoke arrival.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {enhancements.map((enh) => (
                                            <div 
                                                key={enh.id}
                                                onClick={() => toggleEnhancement(enh.id)}
                                                className={`p-8 rounded-3xl border transition-all duration-500 cursor-pointer flex items-center justify-between ${selectedEnhancements.includes(enh.id) ? 'bg-[#3D4127] text-white border-[#3D4127]' : 'bg-white/50 border-black/5 hover:bg-white'}`}
                                            >
                                                <div className="flex items-center gap-8">
                                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${selectedEnhancements.includes(enh.id) ? 'bg-white/20' : 'bg-[#3D4127]/5'}`}>
                                                        {enh.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-serif mb-1">{enh.name}</h4>
                                                        <p className={`text-xs ${selectedEnhancements.includes(enh.id) ? 'text-white/60' : 'text-[#1A1F16]/50'}`}>{enh.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-serif mb-2">+{formatPrice(currency === 'ETB' ? enh.price * EXCHANGE_RATE : enh.price)}</p>
                                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${selectedEnhancements.includes(enh.id) ? 'bg-[#D4DE95] border-[#D4DE95]' : 'border-black/20'}`}>
                                                        {selectedEnhancements.includes(enh.id) && <Check className="w-3 h-3 text-[#1A1F16]" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between pt-12 border-t border-black/5">
                                        <button onClick={prevStep} className="text-[#3D4127] font-black text-[10px] uppercase tracking-[0.4em] hover:translate-x-[-10px] transition-transform flex items-center gap-2">
                                            Back
                                        </button>
                                        <button 
                                            onClick={nextStep}
                                            className="px-12 py-5 bg-[#3D4127] text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 transition-all hover:bg-black group"
                                        >
                                            Guest Details
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-12"
                                >
                                    <form onSubmit={handleFinalSubmit} className="space-y-10">
                                        <div className="space-y-8">
                                            <h2 className="text-3xl font-serif">Guest Information</h2>
                                            
                                            <div className="space-y-10">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] uppercase tracking-widest font-black opacity-40">First name*</label>
                                                        <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-white/50 border border-black/10 p-5 rounded-2xl focus:outline-none focus:border-[#3D4127] transition-all" placeholder="Gwendolyn" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Last name*</label>
                                                        <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-white/50 border border-black/10 p-5 rounded-2xl focus:outline-none focus:border-[#3D4127] transition-all" placeholder="Thorne" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] uppercase tracking-widest font-black opacity-40">e-mail*</label>
                                                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/50 border border-black/10 p-5 rounded-2xl focus:outline-none focus:border-[#3D4127] transition-all" placeholder="email" autoComplete="email" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Telephone*</label>
                                                        <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-white/50 border border-black/10 p-5 rounded-2xl focus:outline-none focus:border-[#3D4127] transition-all" placeholder="+44 (0) 7700 ..." />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Street Address*</label>
                                                    <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-white/50 border border-black/10 p-5 rounded-2xl focus:outline-none focus:border-[#3D4127] transition-all" placeholder="123 Heritage Lane" />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] uppercase tracking-widest font-black opacity-40">City*</label>
                                                        <input required type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-white/50 border border-black/10 p-5 rounded-2xl focus:outline-none focus:border-[#3D4127] transition-all" placeholder="London" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Country*</label>
                                                        <input required type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-white/50 border border-black/10 p-5 rounded-2xl focus:outline-none focus:border-[#3D4127] transition-all" placeholder="United Kingdom" />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Special Requests</label>
                                                    <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} className="w-full bg-white/50 border border-black/10 p-5 rounded-2xl focus:outline-none focus:border-[#3D4127] transition-all min-h-[120px]" placeholder="Allergies, pillow preferences, or surprise arrangements..." />
                                                </div>
                                            </div>

                                            {/* Informative Note */}
                                            <div className="space-y-6 pt-12 border-t border-black/5">
                                                <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-30">Privacy & Consent</p>
                                                <div className="bg-black/5 rounded-2xl p-6 h-32 overflow-y-auto text-xs font-serif italic leading-relaxed opacity-60">
                                                    Informative note as per Art. 13 Law Decree No. 196/2003. As per Law Decree No. 196/2003 (the "Personal Data Privacy Law"), our hotel, Aethelgard Boutique, intends to process the personal data that you have provided exclusively for the fulfillment of the obligations prescribed by contract or law that govern the business relationship between us.
                                                </div>
                                                <label 
                                                    className="flex items-center gap-4 cursor-pointer group"
                                                    onClick={() => setIsPrivacyAccepted(!isPrivacyAccepted)}
                                                >
                                                    <div className={`w-6 h-6 border-2 border-[#3D4127] rounded flex items-center justify-center transition-all ${isPrivacyAccepted ? 'bg-[#3D4127]' : 'group-hover:bg-[#3D4127]/10'}`}>
                                                        <Check className={`w-4 h-4 ${isPrivacyAccepted ? 'text-white' : 'text-[#3D4127] opacity-0 group-hover:opacity-50'}`} />
                                                    </div>
                                                    <span className="text-[10px] uppercase tracking-widest font-black opacity-60">I have read and agree to the privacy policy *</span>
                                                </label>
                                            </div>

                                            {/* Payment Method */}
                                            <div className="space-y-8 pt-12 border-t border-black/5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 flex items-center gap-2">
                                                        <CreditCard className="w-3 h-3" /> Secure Payment Guarantee
                                                    </label>
                                                <div className="flex gap-2 opacity-40">
                                                        <div className="w-8 h-5 bg-black/10 rounded flex items-center justify-center text-[6px] font-black italic">VISA</div>
                                                        <div className="w-8 h-5 bg-black/10 rounded flex items-center justify-center text-[6px] font-black italic">MC</div>
                                                        <div className="w-8 h-5 bg-black/10 rounded flex items-center justify-center text-[6px] font-black italic">AMEX</div>
                                                        {currency === 'ETB' && <div className="w-12 h-5 bg-black/10 rounded flex items-center justify-center text-[6px] font-black font-serif italic text-blue-600">CHAPA</div>}
                                                    </div>
                                                </div>

                                                {currency === 'USD' ? (
                                                    <div className="bg-white/40 border border-black/5 rounded-3xl p-8 space-y-6">
                                                        <div className="flex items-center gap-4 mb-4 opacity-40">
                                                            <CreditCard className="w-4 h-4" />
                                                            <span className="text-[10px] uppercase tracking-widest font-black">Secure Credit Card Payment (USD)</span>
                                                        </div>
                                                        {/* Static Card Inputs */}
                                                        <div className="space-y-3">
                                                            <label className="text-[9px] uppercase tracking-widest font-black opacity-30">Cardholder Name</label>
                                                            <input required type="text" value={cardHolderName} onChange={e => setCardHolderName(e.target.value)} className="w-full bg-white border border-black/5 p-4 rounded-xl focus:outline-none focus:border-[#3D4127] transition-all font-serif" placeholder="Gwendolyn Thorne" />
                                                        </div>

                                                        <div className="space-y-3">
                                                            <label className="text-[9px] uppercase tracking-widest font-black opacity-30">Card Number</label>
                                                            <div className="relative">
                                                                <input required type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full bg-white border border-black/5 p-4 rounded-xl focus:outline-none focus:border-[#3D4127] transition-all font-mono tracking-widest" placeholder="•••• •••• •••• ••••" maxLength={19} />
                                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                                    <ShieldCheck className="w-4 h-4 text-[#3D4127] opacity-40" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="space-y-3">
                                                                <label className="text-[9px] uppercase tracking-widest font-black opacity-30">Expiry Date</label>
                                                                <input required type="text" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full bg-white border border-black/5 p-4 rounded-xl focus:outline-none focus:border-[#3D4127] transition-all font-mono" placeholder="MM / YY" maxLength={5} />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-[9px] uppercase tracking-widest font-black opacity-30">CVV</label>
                                                                <input required type="password" value={cvv} onChange={e => setCvv(e.target.value)} className="w-full bg-white border border-black/5 p-4 rounded-xl focus:outline-none focus:border-[#3D4127] transition-all font-mono" placeholder="•••" maxLength={4} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-[#1A1F16] text-white rounded-3xl p-10 space-y-8 relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl pointer-events-none" />
                                                        <h3 className="text-xl font-serif">Chapa Secure ETB Payment</h3>
                                                        <p className="text-xs text-white/60 leading-relaxed font-light">
                                                            You will be redirected to Chapa's secure environment to finalize your payment of <span className="text-[#D4DE95] font-black">{formatPrice(calculateTotal())}</span>. 
                                                            Once confirmed, your sanctuary will be immediately secured.
                                                        </p>
                                                        <ul className="space-y-4">
                                                            {['Telebirr', 'CBE Birr', 'Mobile Banking'].map(m => (
                                                                <li key={m} className="flex items-center gap-3 text-[9px] uppercase tracking-widest opacity-40">
                                                                    <div className="w-1 h-1 bg-blue-500 rounded-full" /> {m}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <p className="text-[8px] uppercase tracking-[0.2em] font-black opacity-30 italic text-center">Your card is required only for guarantee. Aethelgard Boutique uses bank-grade encryption to protect your sanctuary details.</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between pt-12 border-t border-black/5">
                                            <button type="button" onClick={prevStep} className="text-[#3D4127] font-black text-[10px] uppercase tracking-[0.4em] hover:translate-x-[-10px] transition-transform flex items-center gap-2">
                                                Back
                                            </button>
                                            <button 
                                                type="submit"
                                                disabled={!isPrivacyAccepted || status === 'submitting'}
                                                className="px-12 py-6 bg-[#D4DE95] text-[#1A1F16] rounded-full font-black text-[10px] uppercase tracking-[0.6em] flex items-center gap-4 transition-all hover:bg-black hover:text-white shadow-2xl group disabled:opacity-30"
                                            >
                                                {status === 'submitting' ? (isRedirecting ? 'Redirecting...' : 'Processing...') : (paymentMethod === 'Chapa' ? 'Pay with Chapa' : 'Pay & Book Now')}
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar: Summary */}
                    <div className="lg:col-span-4 sticky top-40">
                        <div className="bg-[#1A1F16] text-white rounded-[3rem] p-10 shadow-2xl space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4DE95]/5 blur-3xl pointer-events-none" />
                            
                            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                                <h3 className="text-2xl font-serif uppercase tracking-widest">Your Itinerary</h3>
                                {step > 1 && (
                                    <button 
                                        onClick={() => setStep(step === 4 ? 2 : 1)}
                                        className="text-[8px] uppercase tracking-[0.3em] font-black text-[#D4DE95] hover:text-white transition-colors"
                                    >
                                        Change
                                    </button>
                                )}
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <CalendarIcon className="w-6 h-6 text-[#D4DE95]" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Check In — Out</p>
                                        <p className="text-sm font-serif">
                                            {range?.from ? format(range.from, 'MMM dd, yyyy') : '---'} — {range?.to ? format(range.to, 'MMM dd, yyyy') : '---'}
                                        </p>
                                        {range?.from && range?.to && (
                                            <p className="text-[10px] text-[#D4DE95] mt-2 italic font-serif">
                                                {differenceInDays(range.to, range.from)} Nights Restoration
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {selectedRoom && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-6">
                                        <Bed className="w-6 h-6 text-[#D4DE95]" />
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Sanctuary</p>
                                            <p className="text-sm font-serif">{selectedRoom.name}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {selectedEnhancements.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-6">
                                        <Sparkles className="w-6 h-6 text-[#D4DE95]" />
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Stay Enhancements</p>
                                            {selectedEnhancements.map(id => (
                                                <p key={id} className="text-[11px] font-serif italic mb-1">
                                                    — {enhancements.find(e => e.id === id)?.name}
                                                </p>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="pt-10 border-t border-white/10 space-y-6">
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] uppercase tracking-widest opacity-40">Total Narrative</p>
                                    <div className="text-right">
                                        <p className="text-4xl font-serif text-[#D4DE95]">
                                            {formatPrice(calculateTotal())}
                                        </p>
                                        <p className="text-[9px] uppercase tracking-widest text-[#D4DE95]/40 mt-1">
                                            {currency === 'ETB' ? `~ $${(calculateTotal() / EXCHANGE_RATE).toFixed(2)}` : `~ ${new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 }).format(calculateTotal() * EXCHANGE_RATE)}`}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-30 text-center">Taxes & Heritage Fees included</p>
                            </div>
                        </div>

                        {/* Trust Badge */}
                        <div className="mt-8 flex items-center justify-center gap-4 opacity-40">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[9px] uppercase tracking-[0.3em] font-black">Encrypted SSL Transaction</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .rdp-custom {
                    --rdp-accent-color: #3D4127;
                    --rdp-background-color: #D4DE95;
                    font-family: var(--font-serif);
                }
                .rdp-day_selected, .rdp-day_selected:focus, .rdp-day_selected:hover {
                    background-color: var(--rdp-accent-color) !important;
                    color: white !important;
                }
            `}</style>
        </main>
    );
}
