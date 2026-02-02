// app/TrainingAssessment/page.jsx
'use client';
import { Suspense } from 'react';
import TrainingAssessmentClient from './TrainingAssessmentClient';

export default function TrainingAssessmentPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <TrainingAssessmentClient />
        </Suspense>
    );
}
