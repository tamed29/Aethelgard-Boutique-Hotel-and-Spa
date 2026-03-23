import type { Metadata } from 'next';
import RoomClient from './RoomClient';
import StructuredData from '@/components/ui/StructuredData';

async function getRoom(id: string) {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/rooms/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return res.json();
    } catch (err) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const room = await getRoom(id);

    // Fallbacks for SEO
    const fallbacks: Record<string, string> = {
        '1': 'The Canopy Suite | Forest View Sanctuary',
        '2': 'The Forest Lodge | Cozy Wychwood Retreat',
        '3': 'Double Heritage Room | Modern Manor Luxury',
        '4': 'Single Sanctuary | Intimate Restorative Space',
        '5': 'Family Forest Suite | Multi-Generational Sanctuary'
    };

    return {
        title: room?.name || fallbacks[id] || 'Boutique Room Sanctuary',
        description: room?.description || 'Discover an architecture of rest in our exclusive boutique suites at Aethelgard.',
    };
}

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const room = await getRoom(id);

    const roomSchema = {
        "@context": "https://schema.org",
        "@type": "HotelRoom",
        "name": room?.name || "Aethelgard Sanctuary Room",
        "description": room?.description || "An exclusive boutique room at Aethelgard.",
        "bed": room?.bedType || "King Bed",
        "occupancy": {
            "@type": "QuantitativeValue",
            "maxValue": room?.capacity || 2
        }
    };

    return (
        <>
            <StructuredData data={roomSchema} />
            <RoomClient params={Promise.resolve({ id })} />
        </>
    );
}
