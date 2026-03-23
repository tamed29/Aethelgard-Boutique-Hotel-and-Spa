import type { Metadata } from 'next';
import DiningClient from './DiningClient';
import StructuredData from '@/components/ui/StructuredData';

export const metadata: Metadata = {
    title: 'Culinary Heritage | Fine Dining in Wychwood Forest',
    description: 'Explore the Great Hall and Cellar Bar at Aethelgard. A culinary journey featuring foraged botanicals, estate-sourced ingredients, and rare vintages.',
    keywords: ['fine dining', 'Cotswolds restaurant', 'foraged food', 'wine cellar', 'heritage dining', 'Aethelgard'],
};

export default function DiningPage() {
    const restaurantSchema = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "The Great Hall at Aethelgard",
        "description": "Exquisite estate-to-table dining experience.",
        "image": "/images/dining/d2.png",
        "servesCuisine": "Modern British",
        "priceRange": "$$$$",
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
            <StructuredData data={restaurantSchema} />
            <DiningClient />
        </>
    );
}
