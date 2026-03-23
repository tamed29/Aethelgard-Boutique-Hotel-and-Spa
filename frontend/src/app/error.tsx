'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Root error caught:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-moss-900 text-moss-100 flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-4xl font-serif mb-4">Something went wrong</h2>
            <p className="max-w-md text-moss-100/60 mb-8 font-light leading-relaxed">
                {error.message || "An unexpected error occurred while preparing your sanctuary."}
            </p>
            <button
                onClick={() => reset()}
                className="px-8 py-4 bg-moss-100 text-moss-900 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
