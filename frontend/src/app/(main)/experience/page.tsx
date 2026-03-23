import type { Metadata } from 'next';
import ExperienceClient from './ExperienceClient';
import StructuredData from '@/components/ui/StructuredData';

export const metadata: Metadata = {
    title: 'The Aethelgard Experience | Journeys in Wychwood',
    description: 'Bespoke experiences crafted for the soul. From private bonfires beneath ancient oaks to celestial stargazing and guided botanical walks.',
    keywords: ['stargazing', 'private bonfire', 'botanical walk', 'luxury experiences', 'Wychwood activities', 'Aethelgard'],
};

export default function ExperiencePage() {
    const experienceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Aethelgard Narrative Experiences",
        "description": "Private bonfires, stargazing, and guided botanical walks in Wychwood Forest.",
        "provider": {
            "@type": "Hotel",
            "name": "Aethelgard Boutique Hotel & Spa"
        }
    };

    return (
        <>
            <StructuredData data={experienceSchema} />
            <ExperienceClient />
        </>
    );
}
