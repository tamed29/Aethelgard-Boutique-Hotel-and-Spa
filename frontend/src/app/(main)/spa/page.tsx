import type { Metadata } from 'next';
import SpaClient from './SpaClient';
import StructuredData from '@/components/ui/StructuredData';

export const metadata: Metadata = {
    title: 'The Sanctuary Spa | Ancient Wellness in Wychwood Forest',
    description: 'Immerse yourself in ancestral wellness rituals. The Aethelgard Sanctuary Spa offers thermal veins, forest rituals, and botanical restoration beneath the old-growth canopy.',
    keywords: ['spa', 'wellness', 'Cotswolds spa', 'thermal bath', 'botanical rituals', 'Aethelgard'],
};

export default function SpaPage() {
    const spaSchema = {
        "@context": "https://schema.org",
        "@type": "HealthAndBeautyBusiness",
        "name": "The Sanctuary Spa at Aethelgard",
        "description": "Ancient wellness rituals and botanical restoration.",
        "image": "/images/spa/spa2.png",
        "priceRange": "$$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "The Wychwood Estate",
            "addressLocality": "Cotswolds",
            "addressRegion": "Gloucestershire",
            "postalCode": "GL54 1AA",
            "addressCountry": "GB"
        }
    };

    return (
        <>
            <StructuredData data={spaSchema} />
            <SpaClient />
        </>
    );
}
