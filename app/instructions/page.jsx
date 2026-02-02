'use client';
import { Suspense } from 'react';
import InstructionsClient from './InstructionsClient';

export default function InstructionsPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <InstructionsClient />
        </Suspense>
    );
}
