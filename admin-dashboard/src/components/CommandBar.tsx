import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Calendar, Home } from 'lucide-react';
import type { IBooking, IUser, IRoom } from '@shared/types';

export function CommandBar() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const navigate = useNavigate();

    // Toggle the menu when ⌘K is pressed
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!open) return;
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`, { withCredentials: true });
                setBookings(res.data);
            } catch (err) {
                console.error('Failed to fetch bookings for command bar', err);
            }
        };
        fetchBookings();
    }, [open]);

    // Filter based on user name/email
    const filteredBookings = bookings.filter((b) => {
        if (!query) return true;
        const user = b.user as unknown as IUser;
        const searchStr = `${user?.name} ${user?.email}`.toLowerCase();
        return searchStr.includes(query.toLowerCase());
    });

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
        >
            <div className="w-full max-w-xl bg-moss-dark border border-sage/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="flex items-center px-4 border-b border-sage/10">
                    <Search className="w-5 h-5 text-sage/40 mr-2" />
                    <Command.Input
                        value={query}
                        onValueChange={setQuery}
                        placeholder="Search bookings by guest name or email..."
                        className="flex-1 py-4 text-sm bg-transparent border-none text-cream placeholder-sage/40 focus:outline-none focus:ring-0"
                    />
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto p-2">
                    <Command.Empty className="py-6 text-center text-sm text-sage/40">
                        No results found.
                    </Command.Empty>

                    {filteredBookings.length > 0 && (
                        <Command.Group heading="Bookings" className="text-xs text-sage/50 px-2 font-medium">
                            {filteredBookings.slice(0, 10).map((booking) => {
                                const user = booking.user as unknown as IUser;
                                const room = booking.room as unknown as IRoom;
                                return (
                                    <Command.Item
                                        key={booking._id}
                                        onSelect={() => {
                                            setOpen(false);
                                            navigate('/bookings'); // Or modal
                                        }}
                                        className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl cursor-pointer hover:bg-sage/10 aria-selected:bg-sage/15 transition-colors"
                                    >
                                        <div className="bg-sage/10 p-2 rounded-lg text-sage">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <div className="text-cream text-sm font-medium">{user?.name || 'Unknown Guest'}</div>
                                            <div className="text-sage/60 text-xs flex gap-2">
                                                <span>{user?.email}</span>
                                                <span>•</span>
                                                <span>{room?.name}</span>
                                            </div>
                                        </div>
                                    </Command.Item>
                                );
                            })}
                        </Command.Group>
                    )}

                    <Command.Group heading="Quick Links" className="text-xs text-sage/50 px-2 font-medium mt-4">
                        <Command.Item onSelect={() => { setOpen(false); navigate('/') }} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-sage/10 aria-selected:bg-sage/15 mt-1 text-cream text-sm">
                            <Home size={16} className="text-sage/40" /> Dashboard
                        </Command.Item>
                        <Command.Item onSelect={() => { setOpen(false); navigate('/inventory') }} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-sage/10 aria-selected:bg-sage/15 mt-1 text-cream text-sm">
                            Rooms & Inventory
                        </Command.Item>
                        <Command.Item onSelect={() => { setOpen(false); navigate('/pricing') }} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-sage/10 aria-selected:bg-sage/15 mt-1 text-cream text-sm">
                            Revenue Management
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </div>
        </Command.Dialog>
    );
}
